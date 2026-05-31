"use client";

import { Car as CarType } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Gauge, Users, Star, ArrowRight, CheckCircle2, AlertCircle, Target } from "lucide-react";
import { motion } from "framer-motion";

const BadgeUI = ({ children, variant = "default" }: { children: React.ReactNode, variant?: string }) => (
  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
    variant === "outline" ? "border border-primary/20 text-primary" : "bg-primary text-white"
  }`}>
    {children}
  </span>
);

interface CarCardProps {
  car: CarType;
  reason: string;
  score: number;
  pros: string[];
  cons: string[];
  index: number;
}

export function CarCard({ car, reason, score, pros, cons, index }: CarCardProps) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: index * 0.1 }}
    >
      <a
        href={car.cardekhoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group block h-full"
      >
        <Card className="relative overflow-hidden border border-transparent shadow-xl bg-white/95 backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/70 hover:shadow-2xl cursor-pointer h-full flex flex-col">
        {/* Score Ribbon */}
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-primary text-white px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-lg shadow-primary/20">
            <Target className="w-4 h-4" />
            <span className="font-black text-lg leading-none">{score}</span>
          </div>
        </div>

        <CardHeader>
          <div className="pr-12">
            <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">{car.brand}</p>
            <CardTitle className="text-3xl font-black italic tracking-tighter leading-tight">{car.model}</CardTitle>
            <p className="text-sm font-medium text-muted-foreground">{car.variant}</p>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4">
            <BadgeUI variant="outline">{car.fuelType}</BadgeUI>
            <BadgeUI variant="outline">{car.transmission}</BadgeUI>
            <BadgeUI variant="outline">{car.bodyType}</BadgeUI>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 flex-grow">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <p className="text-sm italic leading-relaxed text-slate-600">
              "{reason}"
            </p>
          </div>

          <div className="grid grid-cols-2 gap-y-4 gap-x-2">
            <div className="flex items-center gap-2 text-xs font-bold">
              <Shield className="w-4 h-4 text-green-500" />
              <span>{car.safetyRating} Star Safety</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold">
              <Gauge className="w-4 h-4 text-blue-500" />
              <span>{car.mileage}</span>
            </div>
          </div>

          {/* Pros & Cons */}
          <div className="space-y-3 pt-2">
            <div className="space-y-1.5">
              {pros.slice(0, 3).map((pro, i) => (
                <div key={i} className="flex items-start gap-2 text-[11px] font-medium text-slate-700">
                  <CheckCircle2 className="w-3 h-3 text-green-500 mt-0.5 shrink-0" />
                  <span>{pro}</span>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-slate-100">
              {cons.map((con, i) => (
                <div key={i} className="flex items-start gap-2 text-[11px] font-medium text-slate-500 italic">
                  <AlertCircle className="w-3 h-3 text-amber-500 mt-0.5 shrink-0" />
                  <span>{con}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-0 pb-6 px-6">
          <div className="flex w-full items-center justify-between flex-wrap gap-4">
            <p className="text-2xl font-black text-slate-900">₹{car.price} <span className="text-xs text-muted-foreground uppercase font-bold">Lakh</span></p>
            <Button asChild variant="outline" size="sm" className="rounded-full">
              <span className="inline-flex items-center gap-2">
                View on CarDekho
                <ArrowRight className="w-4 h-4" />
              </span>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </a>
    </motion.div>
  );
}
