import { generateJson } from "@/lib/gemini";
import carsData from "@/data/cars.json";
import { Car, RecommendationResponse, RecommendationMatch } from "@/lib/types";

const cars = carsData as Car[];

function parsePriceToNumber(priceStr: string | number): number {
  if (typeof priceStr === "number") return priceStr;
  const cleaned = String(priceStr).replace(/[^0-9.]/g, "");
  const v = parseFloat(cleaned || "0");
  return Number.isFinite(v) ? v : 0;
}

function buildPrettyCarList(list: Car[]) {
  return list.map(c => ({
    id: c.id,
    brand: c.brand,
    model: c.model,
    variant: c.variant,
    price: c.price,
    fuelType: c.fuelType,
    transmission: c.transmission,
    seatingCapacity: c.seatingCapacity,
    mileage: c.mileage,
    safetyRating: c.safetyRating,
    maintenanceScore: c.maintenanceScore,
    features: c.features,
  }));
}

// Runtime validator for RecommendationResponse
function isStringArray(a: unknown): a is string[] {
  return Array.isArray(a) && a.every(i => typeof i === "string");
}

function isCar(obj: any): obj is Car {
  return obj && typeof obj === "object" && typeof obj.id === "string" && typeof obj.brand === "string";
}

function isRecommendationMatch(obj: any): obj is RecommendationMatch {
  return (
    obj &&
    typeof obj === "object" &&
    isCar(obj.car) &&
    typeof obj.score === "number" &&
    typeof obj.reason === "string" &&
    isStringArray(obj.pros) &&
    isStringArray(obj.cons)
  );
}

function isRecommendationResponse(v: unknown): v is RecommendationResponse {
  if (!v || typeof v !== "object") return false;
  const r = (v as any).recommendations;
  if (!Array.isArray(r)) return false;
  return r.every(isRecommendationMatch);
}

export async function getCarRecommendations(rawPreferences: any): Promise<RecommendationResponse> {
  // Map incoming request keys to internal names and validate
  const budget = Number(rawPreferences?.budget ?? 0);
  const familySize = Number(rawPreferences?.familySize ?? 1);
  const fuelPreference = rawPreferences?.fuelType ?? rawPreferences?.fuelPreference ?? "Any";
  const transmission = rawPreferences?.transmission ?? "Any";
  const usageType = rawPreferences?.usage ?? rawPreferences?.usageType ?? "General";
  const primaryPriority = rawPreferences?.priority ?? rawPreferences?.primaryPriority ?? "Mileage";

  // Basic validation
  if (!budget || budget <= 0) {
    return { recommendations: [] };
  }

  // 1. Filter obvious mismatches
  const budgetLimit = budget * 1.15; // allow slight over-budget

  const filtered = cars.filter(car => {
    const price = parsePriceToNumber(car.price);
    if (!price || price > budgetLimit) return false;
    if ((car.seatingCapacity ?? 0) < familySize) return false;
    // Keep fuel/transmission as soft filters (allowing variety). Exclude only strict mismatches when user specified.
    if (fuelPreference && fuelPreference !== "Any" && fuelPreference !== "Mix" && car.fuelType && car.fuelType !== fuelPreference) {
      return false;
    }
    if (transmission && transmission !== "Any" && car.transmission && car.transmission !== transmission) {
      return false;
    }
    return true;
  });

  if (!filtered.length) {
    return { recommendations: [] };
  }

  // 2. Heuristic pre-score to pick candidates for the heavy AI ranking
  const scored = filtered.map(car => {
    const price = parsePriceToNumber(car.price);
    let score = 0;
    // price closeness: closer to budget gets higher score
    const priceDiff = Math.abs(budget - price) / Math.max(budget, 1);
    score += Math.max(0, 30 - priceDiff * 30);
    // safety and maintenance
    score += (car.safetyRating || 0) * 5; // up to ~25
    score += (10 - (car.maintenanceScore ?? 5)); // lower maintenanceScore means better (assumption)
    // seating match bonus
    if (car.seatingCapacity >= familySize) score += 10;
    return { car, preScore: Math.round(score) };
  });

  scored.sort((a, b) => b.preScore - a.preScore);

  const candidateCars = scored.slice(0, 15).map(s => s.car);

  // 3. Build prompt for GEMINI
  const prompt = `You are an expert automotive recommender. The user preferences and candidate cars are below. Using these, return a JSON object with a "recommendations" array of at most 3 items. Each item must include: \n- \"car\": the full car object from the provided list,\n- \"score\": integer 0-100,\n- \"reason\": short 2-3 sentence reason tailored to the user's priorities,\n- \"pros\": array of 3 concise pros,\n- \"cons\": array of 1 concise con.\n\nUser Preferences:\n- budget: ${budget}\n- familySize: ${familySize}\n- fuelPreference: ${fuelPreference}\n- transmission: ${transmission}\n- usage: ${usageType}\n- priority: ${primaryPriority}\n\nCandidateCars: ${JSON.stringify(buildPrettyCarList(candidateCars), null, 2)}\n\nReturn valid JSON only (no commentary).`; 

  // 4. Call Gemini via generateJson with runtime validator
  try {
    const parsed = await generateJson<RecommendationResponse>(prompt, isRecommendationResponse, { maxRetries: 2 });
    // ensure length and shape
    const items = parsed.recommendations.slice(0, 3).map(r => ({
      car: r.car,
      score: Number(r.score) || 0,
      reason: String(r.reason || ""),
      pros: r.pros,
      cons: r.cons,
    } as RecommendationMatch));
    return { recommendations: items };
  } catch (err) {
    console.error("Gemini call/parse failed:", err);
  }

  // 5. Fallback: return top 3 from heuristic ranking with generated reasons
  const fallback = scored.slice(0, 3).map(({ car, preScore }) => {
    const match: RecommendationMatch = {
      car,
      score: Math.min(100, 50 + preScore),
      reason: `Matches your budget and family size; balances ${primaryPriority.toString().toLowerCase()} and overall value.`,
      pros: [
        `Good seating for ${car.seatingCapacity} people`,
        `Reasonable price: ${car.price}`,
        `${car.fuelType} / ${car.transmission} configuration`,
      ],
      cons: ["Consider dealer availability and optional feature costs"],
    };
    return match;
  });

  return { recommendations: fallback };
}
