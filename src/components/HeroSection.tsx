import React from 'react';
import { ArrowRight, Leaf, Clock, MapPin, Award } from 'lucide-react';
import { Dictionary } from '../types';

interface HeroSectionProps {
  dict: Dictionary;
  onExploreMenu: () => void;
}

export default function HeroSection({ dict, onExploreMenu }: HeroSectionProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-emerald-50/50 via-white to-white py-12 sm:py-16 lg:py-24">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-1/4 -z-10 h-72 w-72 rounded-full bg-emerald-100/40 blur-3xl" />
      <div className="absolute bottom-12 left-1/4 -z-10 h-96 w-96 rounded-full bg-amber-100/30 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Text Column */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            {/* Promo Badges */}
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/80 px-4 py-1.5 text-xs font-semibold text-emerald-800 shadow-sm">
              <Award className="h-4 w-4 text-emerald-600" />
              <span>Authentic taste of Hanoi & Saigon</span>
            </div>

            <h1 className="font-sans font-extrabold tracking-tight text-gray-900 text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.1]">
              {dict.heroTitle}
            </h1>

            <p className="max-w-2xl text-base sm:text-lg text-gray-600 leading-relaxed mx-auto lg:mx-0">
              {dict.heroSub}
            </p>

            {/* Quick Selling Points */}
            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 py-2">
              <div className="flex flex-col items-center lg:items-start p-3 bg-white border border-gray-100 rounded-xl shadow-xs">
                <Leaf className="h-5 w-5 text-emerald-600 mb-1" />
                <span className="font-bold text-xs text-gray-900">Fresh Herbs</span>
                <span className="text-[10px] text-gray-500">Imported daily</span>
              </div>
              <div className="flex flex-col items-center lg:items-start p-3 bg-white border border-gray-100 rounded-xl shadow-xs">
                <Clock className="h-5 w-5 text-amber-600 mb-1" />
                <span className="font-bold text-xs text-gray-900">24H Broth</span>
                <span className="text-[10px] text-gray-500">Slow cooked</span>
              </div>
              <div className="flex flex-col items-center lg:items-start p-3 bg-white border border-gray-100 rounded-xl shadow-xs">
                <MapPin className="h-5 w-5 text-emerald-600 mb-1" />
                <span className="font-bold text-xs text-gray-900">BGC High St</span>
                <span className="text-[10px] text-gray-500">Taguig Branch</span>
              </div>
            </div>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onExploreMenu}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3.5 font-semibold shadow-md transition-all cursor-pointer"
              >
                <span>{dict.heroBtn}</span>
                <ArrowRight className="h-4.5 w-4.5" />
              </button>
              
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl w-full sm:w-auto justify-center">
                <span>⚡️ Deliver to Makati, Manila, Pasay, QC</span>
              </div>
            </div>
          </div>

          {/* Media Collage Column */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-[420px] aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-gray-50">
              <img
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80"
                alt="Vietnamese Pho Noodle Soup Table Setting"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              
              {/* Floating review card */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-xs p-4 rounded-2xl shadow-lg border border-gray-100/50">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="flex text-amber-400">★ ★ ★ ★ ★</div>
                  <span className="font-bold text-xs text-gray-900">5.0 in Makati</span>
                </div>
                <p className="text-xs italic text-gray-600 line-clamp-2">
                  \"The beef broth is insanely rich and authentic! Brings me right back to the streets of Hanoi. GCash checkout was seamless.\"
                </p>
                <p className="text-[10px] text-gray-400 mt-1.5 font-semibold text-right">— Jose M., BGC Foodie</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
