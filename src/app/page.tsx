"use client";

import { useState } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { Questionnaire } from "@/components/features/questionnaire/Questionnaire";
import { MatchResults } from "@/components/features/results/MatchResults";
import { UserPreferences, RecommendationResponse } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function Home() {
  const [view, setView] = useState<"hero" | "questionnaire" | "results">("hero");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<RecommendationResponse | null>(null);

  const fetchRecommendations = async (prefs: UserPreferences) => {
    setLoading(true);
    setView("results");
    try {
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prefs),
      });
      
      if (!response.ok) throw new Error("API failed");
      
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Error fetching matches:", error);
      setResults(null); // This will trigger the "No Matches Found" view in MatchResults
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <div className="pt-24 pb-16">
        <AnimatePresence mode="wait">
          {view === "hero" && (
            <motion.section
              key="hero"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-7xl mx-auto px-4 text-center py-20"
            >
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-6 py-2 rounded-full text-sm font-bold mb-8">
                <Sparkles className="w-4 h-4" /> Next-Gen AI Car Matching
              </div>
              <h1 className="text-7xl md:text-8xl font-black tracking-tight leading-[0.9] mb-8">
                FIND YOUR <br /> 
                <span className="text-primary italic">DREAM RIDE</span> <br />
                IN 60 SECONDS.
              </h1>
              <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 font-medium">
                Answer 4 simple questions and let our advanced AI match you with the 
                perfect car from Maruti, Tata, Mahindra and more.
              </p>
              <button 
                onClick={() => setView("questionnaire")}
                className="bg-primary text-white text-xl font-bold py-6 px-12 rounded-2xl shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
              >
                Start AI Matchmaker
              </button>
            </motion.section>
          )}

          {view === "questionnaire" && (
            <motion.section
              key="questionnaire"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="py-12"
            >
              <Questionnaire onComplete={fetchRecommendations} isLoading={loading} />
            </motion.section>
          )}

          {view === "results" && (
            <motion.section
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-12"
            >
              {loading ? (
                <div className="flex flex-col items-center justify-center py-40 space-y-8">
                  <div className="relative">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                      className="w-24 h-24 border-4 border-primary/20 border-t-primary rounded-full"
                    />
                    <Sparkles className="w-8 h-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold">Consulting our AI Expert...</h3>
                    <p className="text-slate-500">Matching your lifestyle with 30,000+ data points</p>
                  </div>
                </div>
              ) : (
                results && <MatchResults data={results} onReset={() => { setResults(null); setView("hero"); }} />
              )}
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      {/* Decorative Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
      </div>
    </main>
  );
}
