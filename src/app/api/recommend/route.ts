import { NextResponse } from "next/server";
import { getCarRecommendations } from "@/lib/services/recommendation";

export async function POST(req: Request) {
  try {
    const preferences = await req.json();
    const recommendations = await getCarRecommendations(preferences);
    return NextResponse.json(recommendations);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to fetch matches" }, { status: 500 });
  }
}
