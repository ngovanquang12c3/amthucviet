import React, { useState } from 'react';
import { MapPin, Navigation, Clock, CreditCard, Info } from 'lucide-react';
import { Dictionary } from '../types';

interface MapSectionProps {
  dict: Dictionary;
}

export default function MapSection({ dict }: MapSectionProps) {
  const [selectedDistrict, setSelectedDistrict] = useState('makati');

  // Districts coordinates relative to BGC (placed at center x=160, y=140)
  const districts: Record<string, {
    name: string;
    distance: number;
    fee: number;
    time: string;
    x: number; // SVG Coordinates
    y: number;
    directions: string[];
  }> = {
    bgc: {
      name: "Bonifacio Global City (Taguig)",
      distance: 1.5,
      fee: 50,
      time: "15-20 mins",
      x: 170,
      y: 135,
      directions: [
        "Depart from Unit G-12, Bonifacio High Street, 30th St.",
        "Head North-East on High Street towards 7th Avenue.",
        "Turn left into 7th Avenue, rider arrives at BGC destination."
      ]
    },
    makati: {
      name: "Makati Business District",
      distance: 4.8,
      fee: 80,
      time: "20-30 mins",
      x: 110,
      y: 125,
      directions: [
        "Depart from BGC High Street via 32nd St.",
        "Head West towards Kalayaan Flyover.",
        "Take Kalayaan Flyover towards Buendia Avenue.",
        "Turn left onto Makati Avenue or Ayala Avenue.",
        "Rider arrives in Makati Business District."
      ]
    },
    pasay: {
      name: "Pasay / Manila Bay Area",
      distance: 9.2,
      fee: 120,
      time: "30-40 mins",
      x: 75,
      y: 180,
      directions: [
        "Depart from BGC via McKinley Road.",
        "Drive through Forbes Park to reach EDSA Southbound.",
        "Head straight down EDSA past Magallanes.",
        "Take the exit towards Macapagal Boulevard or Roxas Boulevard.",
        "Rider arrives at Pasay/Manila Bay Area."
      ]
    },
    qc: {
      name: "Quezon City Suburbs",
      distance: 15.6,
      fee: 180,
      time: "45-60 mins",
      x: 180,
      y: 40,
      directions: [
        "Depart from BGC via C-5 Road Northbound.",
        "Cross Pasig River via Bagong Ilog bridge.",
        "Follow C-5 Road past Libis / Eastwood.",
        "Exit towards Katipunan Avenue or Commonwealth.",
        "Rider arrives in Quezon City District."
      ]
    }
  };

  const active = districts[selectedDistrict] || districts.makati;
  const bgcBranch = { x: 160, y: 140 }; // Center-right BGC Branch coordinate

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 bg-gray-50 rounded-3xl my-8 border border-gray-100" id="location-section">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Route Planner Panel */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-600 font-bold block mb-1">Interactive Map & Planner</span>
            <h3 className="font-sans font-bold text-xl text-gray-900 leading-snug">
              {dict.getDirections}
            </h3>
            <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
              We operate from our premium BGC kitchen. Select your district in Metro Manila to calculate dynamic rider route vectors, delivery fees, and estimated transit times.
            </p>
          </div>

          {/* Selector */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
              {dict.selectDistrict}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(districts).map((key) => (
                <button
                  key={key}
                  onClick={() => setSelectedDistrict(key)}
                  className={`px-3 py-2.5 rounded-xl text-left text-xs font-bold border transition-all cursor-pointer ${
                    selectedDistrict === key
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-white text-gray-700 border-gray-100 hover:bg-gray-50'
                  }`}
                >
                  📍 {districts[key].name.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Delivery estimation card */}
          <div className="bg-emerald-50/50 border border-emerald-100/50 rounded-2xl p-4.5 space-y-3">
            <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5 uppercase tracking-wider">
              <span>🛵 {dict.estDelivery}</span>
            </h4>
            
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-white p-2.5 rounded-xl shadow-2xs border border-emerald-100/10">
                <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wide">Distance</span>
                <span className="font-mono font-extrabold text-sm text-gray-800">{active.distance} km</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl shadow-2xs border border-emerald-100/10">
                <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wide">Delivery Fee</span>
                <span className="font-mono font-extrabold text-sm text-emerald-700">₱{active.fee}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl shadow-2xs border border-emerald-100/10">
                <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wide">Est. Time</span>
                <span className="font-mono font-extrabold text-[11px] text-amber-700 leading-tight block pt-0.5">{active.time}</span>
              </div>
            </div>
          </div>

          {/* Step-by-Step Directions */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Navigation className="h-3.5 w-3.5" />
              <span>Rider Routing Steps</span>
            </h4>
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-3.5 space-y-2.5 max-h-[140px] overflow-y-auto">
              {active.directions.map((step, idx) => (
                <div key={idx} className="flex gap-2.5 items-start text-xs text-gray-600 leading-relaxed">
                  <span className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-800 font-mono mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Visual Map Canvas Columns */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
          {/* Map canvas space */}
          <div className="relative flex-1 bg-slate-900 rounded-xl overflow-hidden min-h-[300px] border border-slate-800 shadow-inner flex flex-col justify-between p-4">
            
            {/* Top Bar with address info */}
            <div className="flex justify-between items-center bg-slate-900/90 backdrop-blur-xs p-2 rounded-lg border border-slate-800 z-10">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-slate-300">Viet Bistro Kitchen (HQ)</span>
              </div>
              <span className="text-[9px] text-slate-400 italic">BGC High Street</span>
            </div>

            {/* Simulated Vector Grid SVG Map */}
            <div className="absolute inset-0">
              <svg className="w-full h-full opacity-90" viewBox="0 0 320 220" preserveAspectRatio="none">
                {/* Cyber grid lines */}
                <defs>
                  <pattern id="mapGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#mapGrid)" />

                {/* Major Highway (EDSA / C5 representation) */}
                {/* C5 Road Vector line */}
                <path d="M 170 10 L 165 90 L 160 140 L 195 210" fill="none" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
                {/* EDSA Highway Representation */}
                <path d="M 50 20 L 80 80 L 115 130 L 140 180 L 220 210" fill="none" stroke="#1e293b" strokeWidth="5" strokeLinecap="round" />
                <path d="M 50 20 L 80 80 L 115 130 L 140 180 L 220 210" fill="none" stroke="#cbd5e1" strokeWidth="1" strokeLinecap="round" strokeDasharray="3,3" />

                {/* District Road Connections */}
                {/* BGC - Makati route */}
                <path d="M 160 140 Q 135 130 110 125" fill="none" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
                {/* BGC - Pasay route */}
                <path d="M 160 140 Q 110 160 75 180" fill="none" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
                {/* BGC - QC route */}
                <path d="M 160 140 Q 170 90 180 40" fill="none" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />

                {/* Active vector tracking path */}
                {selectedDistrict && (
                  <path
                    d={
                      selectedDistrict === 'bgc' ? "M 160 140 L 170 135" :
                      selectedDistrict === 'makati' ? "M 160 140 Q 135 130 110 125" :
                      selectedDistrict === 'pasay' ? "M 160 140 Q 110 160 75 180" :
                      "M 160 140 Q 170 90 180 40"
                    }
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    className="animate-[dash_3s_linear_infinite]"
                    strokeDasharray="6,6"
                  />
                )}

                {/* Grid Labels */}
                <text x="30" y="30" fill="#475569" fontSize="7" fontWeight="bold">MANILA BAY</text>
                <text x="230" y="80" fill="#475569" fontSize="7" fontWeight="bold">LAGUNA LAKE</text>

                {/* HQ Marker */}
                <g transform={`translate(${bgcBranch.x}, ${bgcBranch.y})`}>
                  <circle r="8" fill="#10b981" fillOpacity="0.3" className="animate-ping" />
                  <circle r="4.5" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
                </g>

                {/* District Markers */}
                {Object.keys(districts).map((key) => {
                  const dist = districts[key];
                  const isActive = selectedDistrict === key;
                  return (
                    <g key={key} transform={`translate(${dist.x}, ${dist.y})`} className="cursor-pointer" onClick={() => setSelectedDistrict(key)}>
                      <circle r={isActive ? "7" : "4"} fill={isActive ? "#f59e0b" : "#475569"} stroke="#ffffff" strokeWidth="1" />
                      <text
                        x="9"
                        y="3"
                        fill={isActive ? "#fbbf24" : "#94a3b8"}
                        fontSize="8"
                        fontWeight={isActive ? "extrabold" : "bold"}
                        className="pointer-events-none select-none bg-slate-900"
                      >
                        {dist.name.split(" ")[0]}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Empty space filler for SVG layer */}
            <div className="h-44" />

            {/* Map bottom stats */}
            <div className="bg-slate-900/90 backdrop-blur-xs p-3 rounded-lg border border-slate-800 mt-auto z-10 flex justify-between items-center text-xs">
              <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                <MapPin className="h-4 w-4 text-emerald-400" />
                <span>Selected Destination:</span>
                <span className="text-amber-400">{active.name}</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase tracking-wider">{active.distance} km away</span>
            </div>
          </div>

          {/* Location details card */}
          <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <span className="font-bold text-gray-700 block">🏠 Kitchen HQ Address</span>
              <p className="text-gray-500 leading-relaxed text-[11px]">{dict.ourAddress}</p>
            </div>
            <div className="space-y-1 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <span className="font-bold text-gray-700 block">⏰ Operating Hours</span>
              <p className="text-[11px] text-gray-500">{dict.weekdays}</p>
              <p className="text-[11px] text-gray-500">{dict.weekends}</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
