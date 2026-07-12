import React, { useState, useEffect } from 'react';
import { ArrowRight, Leaf, Clock, MapPin, Award } from 'lucide-react';
import { Dictionary } from '../types';

interface HeroSectionProps {
  dict: Dictionary;
  onExploreMenu: () => void;
  bannerImages?: string[];
}

export default function HeroSection({ dict, onExploreMenu, bannerImages = [] }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto rotate banner images every 4 seconds
  useEffect(() => {
    if (bannerImages.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bannerImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [bannerImages]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? bannerImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % bannerImages.length);
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-emerald-50/50 via-white to-white pt-10 pb-6 sm:pt-14 sm:pb-8 lg:pt-16 lg:pb-10">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-1/4 -z-10 h-72 w-72 rounded-full bg-emerald-100/40 blur-3xl" />
      <div className="absolute bottom-12 left-1/4 -z-10 h-96 w-96 rounded-full bg-amber-100/30 blur-3xl" />

      {/* Hero Content Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-10">
        <div className="max-w-3xl mx-auto text-center space-y-5 sm:space-y-6">
          {/* Promo Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/80 px-4 py-1.5 text-xs font-semibold text-emerald-800 shadow-xs">
            <Award className="h-4 w-4 text-emerald-600 animate-pulse" />
            <span>Authentic taste of Hanoi & Saigon</span>
          </div>

          <h1 className="font-sans font-extrabold tracking-tight text-gray-900 text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.1]">
            {dict.heroTitle}
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            {dict.heroSub}
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onExploreMenu}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 font-bold shadow-md hover:shadow-lg transition-all cursor-pointer transform active:translate-y-0.5"
            >
              <span>{dict.heroBtn}</span>
              <ArrowRight className="h-4.5 w-4.5" />
            </button>
            
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-white border border-gray-100 px-5 py-3.5 rounded-xl w-full sm:w-auto justify-center shadow-xs">
              <span>⚡️ Delivery to Makati, Manila, Pasay, Quezon City</span>
            </div>
          </div>
        </div>
      </div>

      {/* Massive Full-Width Horizontal Banner Slider (Edge-to-Edge) */}
      <div className="relative w-full h-[280px] sm:h-[400px] md:h-[500px] overflow-hidden group bg-slate-100 shadow-inner">
        {bannerImages.length > 0 ? (
          bannerImages.map((img, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <img
                src={img}
                alt={`Vietnamese Food Cuisine Banner ${idx + 1}`}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              {/* Overlay for visual blending */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
            </div>
          ))
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-50 text-gray-400 font-medium text-xs">
            <span>No banner images found. Add some in the Admin Panel!</span>
          </div>
        )}

        {/* Navigation Buttons */}
        {bannerImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2.5 sm:p-3 shadow-md transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
              aria-label="Previous banner slide"
            >
              <svg className="h-5 w-5 stroke-current" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2.5 sm:p-3 shadow-md transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
              aria-label="Next banner slide"
            >
              <svg className="h-5 w-5 stroke-current" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Slide Dots */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2 bg-black/35 backdrop-blur-xs px-3 py-1.5 rounded-full">
              {bannerImages.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentIndex ? 'w-5 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
                  }`}
                  aria-label={`Show slide ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Selling Points bar below the banner */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
          <div className="flex items-center gap-3 p-3.5 bg-white border border-gray-100 rounded-2xl shadow-xs">
            <div className="p-2 bg-emerald-50 rounded-xl">
              <Leaf className="h-5.5 w-5.5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-gray-900">Fresh Herbs</h3>
              <p className="text-[10px] text-gray-500">Imported daily from premium growers</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3.5 bg-white border border-gray-100 rounded-2xl shadow-xs">
            <div className="p-2 bg-amber-50 rounded-xl">
              <Clock className="h-5.5 w-5.5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-gray-900">24H Broth</h3>
              <p className="text-[10px] text-gray-500">Slow cooked with authentic Vietnamese spices</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3.5 bg-white border border-gray-100 rounded-2xl shadow-xs">
            <div className="p-2 bg-emerald-50 rounded-xl">
              <MapPin className="h-5.5 w-5.5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-gray-900">BGC High St</h3>
              <p className="text-[10px] text-gray-500">Visit our physical store in Taguig city</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
