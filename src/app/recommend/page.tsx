"use client";

import { useState } from "react";
import { CarCard } from "@/components/features/results/CarCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RecommendationResponse, UserPreferences } from "@/lib/types";
import { Sparkles } from "lucide-react";

export default function RecommendPage() {
  const [prefs, setPrefs] = useState<UserPreferences>({
    budget: 8,
    familySize: 4,
    fuelPreference: "Petrol",
    transmission: "Automatic",
    usageType: "City",
    primaryPriority: "Mileage",
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<RecommendationResponse | null>(null);

  async function fetchRecs() {
    setLoading(true);
    setResults(null);
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prefs),
      });
      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error(err);
      setResults({ recommendations: [] });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] py-12">
      <div className="max-w-6xl mx-auto px-4">
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-bold mb-4">
            <Sparkles className="w-4 h-4" /> AI Recommendations
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Personalised Car Recommendations</h1>
          <p className="text-muted-foreground mt-2">Enter your preferences and get the top 3 matches tailored for Indian driving.</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-1 bg-white rounded-2xl p-6 shadow">
            <h3 className="text-lg font-bold mb-4">Your Preferences</h3>

            <div className="space-y-4">
              <div>
                <Label>Budget (Lakh)</Label>
                <Input type="number" value={String(prefs.budget)} onChange={e => setPrefs({ ...prefs, budget: Number(e.target.value) })} />
              </div>

              <div>
                <Label>Family Size</Label>
                <Input type="number" value={String(prefs.familySize)} onChange={e => setPrefs({ ...prefs, familySize: Number(e.target.value) })} />
              </div>

              <div>
                <Label>Fuel</Label>
                <Select value={prefs.fuelPreference} onValueChange={(v: string) => setPrefs({ ...prefs, fuelPreference: v })}>
                  <option>Any</option>
                  <option>Petrol</option>
                  <option>Diesel</option>
                  <option>Hybrid</option>
                  <option>Electric</option>
                </Select>
              </div>

              <div>
                <Label>Transmission</Label>
                <Select value={prefs.transmission} onValueChange={(v: string) => setPrefs({ ...prefs, transmission: v })}>
                  <option>Any</option>
                  <option>Manual</option>
                  <option>Automatic</option>
                </Select>
              </div>

              <div>
                <Label>Usage</Label>
                <Select value={prefs.usageType} onValueChange={(v: string) => setPrefs({ ...prefs, usageType: v })}>
                  <option>City</option>
                  <option>Highway</option>
                  <option>Mixed</option>
                </Select>
              </div>

              <div>
                <Label>Priority</Label>
                <Select value={prefs.primaryPriority} onValueChange={(v: string) => setPrefs({ ...prefs, primaryPriority: v as "Mileage" | "Safety" | "Performance" | "Features" | "Low Maintenance" })}>
                  <option>Mileage</option>
                  <option>Safety</option>
                  <option>Performance</option>
                  <option>Features</option>
                  <option>Low Maintenance</option>
                </Select>
              </div>

              <div className="pt-2">
                <Button onClick={fetchRecs} className="w-full">Get Recommendations</Button>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="min-h-75 bg-white rounded-2xl p-6 shadow">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[0,1,2].map(i => (
                    <div key={i} className="animate-pulse bg-slate-100 rounded-2xl h-64 p-4" />
                  ))}
                </div>
              ) : results && results.recommendations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {results.recommendations
                    .slice()
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 3)
                    .map((rec, i) => (
                      <CarCard
                        key={rec.car.id}
                        car={rec.car}
                        reason={rec.reason}
                        score={rec.score}
                        pros={rec.pros}
                        cons={rec.cons}
                        index={i}
                      />
                    ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <h4 className="text-xl font-bold">No recommendations yet</h4>
                  <p className="text-muted-foreground mt-2">Submit your preferences to see tailored car matches.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
