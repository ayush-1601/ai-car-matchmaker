export interface Car {
  id: string;
  brand: string;
  model: string;
  variant: string;
  coverImage: string;
  cardekhoUrl: string;
  bodyType: string;
  fuelType: string;
  transmission: string;
  price: string;
  mileage: string;
  safetyRating: number;
  seatingCapacity: number;
  maintenanceScore: number;
  features: string[];
}

export interface UserPreferences {
  budget: number;
  familySize: number;
  fuelPreference: string;
  transmission: string;
  usageType: string;
  primaryPriority: "Mileage" | "Safety" | "Performance" | "Features" | "Low Maintenance";
}

export interface RecommendationMatch {
  car: Car;
  score: number;
  reason: string;
  pros: string[];
  cons: string[];
}

export interface RecommendationResponse {
  recommendations: RecommendationMatch[];
}
