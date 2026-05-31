"use client";

import { Car } from "lucide-react";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/50 backdrop-blur-xl border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-lg">
            <Car className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter">CARDEKHO <span className="text-primary">AI</span></span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-wider text-slate-600">
          <Link href="#" className="hover:text-primary transition-colors">Buy Car</Link>
          <Link href="#" className="hover:text-primary transition-colors">Sell Car</Link>
          <Link href="#" className="hover:text-primary transition-colors">Compare</Link>
        </div>

        <button className="bg-slate-900 text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-primary transition-all">
          Sign In
        </button>
      </div>
    </nav>
  );
}
