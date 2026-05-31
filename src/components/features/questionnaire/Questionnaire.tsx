"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { UserPreferences } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles, Car, Users, Fuel, Settings, Zap, ShieldCheck } from "lucide-react";

const formSchema = z.object({
  budget: z.number().min(5).max(70),
  familySize: z.string().min(1, "Please select family size"),
  fuelPreference: z.string().min(1, "Please select fuel preference"),
  transmission: z.string().min(1, "Please select transmission"),
  usageType: z.string().min(1, "Please select usage type"),
  primaryPriority: z.enum(["Mileage", "Safety", "Performance", "Features", "Low Maintenance"], {
    required_error: "Please select a primary priority",
  }),
});

interface QuestionnaireProps {
  onComplete: (prefs: UserPreferences) => void;
  isLoading: boolean;
}

export function Questionnaire({ onComplete, isLoading }: QuestionnaireProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      budget: 15,
      familySize: "5",
      fuelPreference: "Petrol",
      transmission: "Automatic",
      usageType: "City",
      primaryPriority: "Safety",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onComplete({
      ...values,
      familySize: parseInt(values.familySize),
    } as UserPreferences);
  }

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-2xl border-none bg-white/90 backdrop-blur-md">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Sparkles className="w-6 h-6 text-primary" />
        </div>
        <CardTitle className="text-3xl font-black italic tracking-tighter">CAR MATCHMAKER</CardTitle>
        <CardDescription>Tell us what you need, and our AI will find the perfect ride for you.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Budget Slider */}
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-2">
                    <FormLabel className="text-lg font-bold flex items-center gap-2">
                      <Zap className="w-4 h-4 text-primary" /> Max Budget: ₹{field.value} Lakh
                    </FormLabel>
                    <FormControl>
                      <Slider
                        min={5}
                        max={70}
                        step={1}
                        value={[field.value]}
                        onValueChange={(val) => field.onChange(val[0])}
                        className="py-4"
                      />
                    </FormControl>
                    <FormDescription>Drag to set your maximum budget range.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Family Size */}
              <FormField
                control={form.control}
                name="familySize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary" /> Family Size
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select seats" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="2">2 Seater (Coupe/Sports)</SelectItem>
                        <SelectItem value="4">4 Seater (Compact)</SelectItem>
                        <SelectItem value="5">5 Seater (Standard)</SelectItem>
                        <SelectItem value="7">7 Seater (Large Family)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Fuel Preference */}
              <FormField
                control={form.control}
                name="fuelPreference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold flex items-center gap-2">
                      <Fuel className="w-4 h-4 text-primary" /> Fuel Preference
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select fuel type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Petrol">Petrol</SelectItem>
                        <SelectItem value="Diesel">Diesel</SelectItem>
                        <SelectItem value="Electric">Electric (EV)</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                        <SelectItem value="CNG">CNG</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Transmission */}
              <FormField
                control={form.control}
                name="transmission"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold flex items-center gap-2">
                      <Settings className="w-4 h-4 text-primary" /> Transmission
                    </FormLabel>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex gap-4 pt-2"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Manual" />
                        </FormControl>
                        <FormLabel className="font-normal">Manual</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Automatic" />
                        </FormControl>
                        <FormLabel className="font-normal">Automatic</FormLabel>
                      </FormItem>
                    </RadioGroup>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Usage Type */}
              <FormField
                control={form.control}
                name="usageType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold flex items-center gap-2">
                      <Car className="w-4 h-4 text-primary" /> Primary Usage
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select usage" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="City">City Commute</SelectItem>
                        <SelectItem value="Highway">Highway / Long Drives</SelectItem>
                        <SelectItem value="Off-road">Off-roading / Adventure</SelectItem>
                        <SelectItem value="Mix">Mix of Both</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Primary Priority */}
              <FormField
                control={form.control}
                name="primaryPriority"
                render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-2">
                    <FormLabel className="font-bold flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-primary" /> What's your Top Priority?
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-2"
                      >
                        {["Mileage", "Safety", "Performance", "Features", "Low Maintenance"].map((item) => (
                          <FormItem key={item} className="flex flex-col items-center space-y-2">
                            <FormControl>
                              <RadioGroupItem value={item} className="sr-only" />
                            </FormControl>
                            <FormLabel 
                              className={`w-full py-3 px-2 text-center rounded-xl border-2 transition-all cursor-pointer text-xs font-bold leading-tight ${
                                field.value === item 
                                ? "border-primary bg-primary text-white shadow-lg" 
                                : "border-secondary bg-white hover:border-primary/50"
                              }`}
                            >
                              {item}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>

            <Button 
              type="submit" 
              className="w-full h-14 text-xl font-black italic tracking-tighter shadow-xl shadow-primary/20" 
              disabled={isLoading}
            >
              {isLoading ? "ANALYZING..." : "GENERATE MATCHES"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
