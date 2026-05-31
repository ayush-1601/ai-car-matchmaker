"use client";

import { CarCard } from "./CarCard";
import { RecommendationResponse } from "@/lib/types";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCcw } from "lucide-react";

interface MatchResultsProps {
  data: RecommendationResponse;
  onReset: () => void;
}

export function MatchResults({ data, onReset }: MatchResultsProps) {
  if (!data || !data.recommendations || data.recommendations.length === 0) {
    return (
      <div className="text-center py-40 space-y-6">
        <h2 className="text-3xl font-black italic tracking-tighter">NO PERFECT MATCHES</h2>
        <p className="text-muted-foreground text-lg">
          Try loosening your budget or changing your priorities for a better match.
        </p>
        <Button onClick={onReset} variant="outline" size="lg" className="rounded-full">
          Adjust Preferences
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-12 py-8 max-w-7xl mx-auto px-4">
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-primary/20"
        >
          <Sparkles className="w-4 h-4" /> Top Recommendation
        </motion.div>
        <h2 className="text-6xl font-black italic tracking-tighter leading-none">THE IDEAL LINEUP</h2>
        <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-medium">
          Based on your profile, these 3 vehicles offer the best balance of value, performance, and long-term satisfaction.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {data.recommendations
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

      <div className="flex justify-center pt-12">
        <Button 
          variant="outline" 
          size="lg" 
          onClick={onReset}
          className="gap-2 rounded-full border-2 hover:bg-primary hover:text-white transition-all px-12 font-bold h-14"
        >
          <RefreshCcw className="w-4 h-4" /> Start Over
        </Button>
      </div>
    </div>
  );
}
