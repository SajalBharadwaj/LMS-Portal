'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  Navigation,
  Compass,
  Video,
  Layers,
  Building2,
  Users,
  CheckCircle2,
  Sparkles,
  Search,
  ExternalLink,
  ChevronRight,
  Maximize2,
  Play,
  Volume2,
} from 'lucide-react';
import { INITIAL_CAMPUS_LOCATIONS } from '../../data/mockData';

export default function CampusTourMapModal({
  onClose,
  initialLocationId = null,
  initialViewMode = 'map',
}) {
  const [locations] = useState(INITIAL_CAMPUS_LOCATIONS);
  const [selectedLoc, setSelectedLoc] = useState(() => {
    if (initialLocationId) {
      const match = INITIAL_CAMPUS_LOCATIONS.find(
        (l) => l.id === initialLocationId || l.code === initialLocationId
      );
      if (match) return match;
    }
    return INITIAL_CAMPUS_LOCATIONS[0];
  });
  const [activeCategory, setActiveCategory] = useState('All');
  const [viewMode, setViewMode] = useState(initialViewMode || 'map'); // 'map' | 'virtualTour'
  const [searchQuery, setSearchQuery] = useState('');
  const [walkingRoute, setWalkingRoute] = useState(null);

  useEffect(() => {
    if (initialLocationId) {
      const match = locations.find(
        (l) => l.id === initialLocationId || l.code === initialLocationId
      );
      if (match) setSelectedLoc(match);
    }
    if (initialViewMode) {
      setViewMode(initialViewMode);
    }
  }, [initialLocationId, initialViewMode, locations]);

  const categories = ['All', 'Academic', 'Research Labs', 'Administrative', 'Residential', 'Sports & Recreation'];

  const filteredLocations = locations.filter((loc) => {
    const matchesCat = activeCategory === 'All' || loc.category.includes(activeCategory);
    const matchesSearch =
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCalculateRoute = (loc) => {
    const distanceMeters = Math.floor(180 + Math.random() * 450);
    const walkMinutes = Math.ceil(distanceMeters / 80);
    setWalkingRoute({
      destination: loc.name,
      distance: `${distanceMeters} meters`,
      time: `${walkMinutes} mins walk`,
      from: 'Nilgiri Student Hostel (Wing A)',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl max-h-[94vh] flex flex-col bg-slate-950 text-white rounded-3xl shadow-2xl border border-slate-800 overflow-hidden">
        {/* Top Header Controls */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Compass className="w-6 h-6 text-white animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight">
                  APEX UNIVERSITY CAMPUS NAVIGATOR
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Interactive 3D Map
                </span>
              </div>
              <p className="text-xs text-slate-400">
                120-Acre Smart Autonomous Campus • GPS Wayfinding & Virtual Video Tour
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs font-semibold">
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'map'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                Map Blueprint
              </button>
              <button
                onClick={() => setViewMode('virtualTour')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'virtualTour'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                360° Video Tour
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category & Search Filter Bar */}
        <div className="px-6 py-2.5 bg-slate-900/50 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search buildings, labs, halls..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Main Body: Map/Video on Left (8 cols), Details Panel on Right (4 cols) */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-0">
          {/* Main Map or Virtual Tour Canvas */}
          <div className="lg:col-span-8 bg-slate-950 flex flex-col relative overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800">
            {viewMode === 'map' ? (
              /* High-Tech Vector Campus Blueprint Map Canvas */
              <div className="relative flex-1 w-full h-[380px] lg:h-full bg-[#070b14] overflow-hidden select-none">
                {/* Background Blueprint Grid & Pathway Silhouettes */}
                <div
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage: `radial-gradient(#6366f1 1px, transparent 1px), linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                  }}
                />

                {/* Campus Ring Road Vector SVG Overlay */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                  <path
                    d="M 120 100 Q 400 40 700 120 T 900 400 T 500 500 T 150 400 Z"
                    fill="none"
                    stroke="#4338ca"
                    strokeWidth="4"
                    strokeDasharray="8 6"
                  />
                  <path
                    d="M 280 200 L 480 300 L 720 380"
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="3"
                  />
                  <path
                    d="M 480 300 L 420 480"
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="3"
                  />
                  <circle cx="50%" cy="50%" r="60" fill="#312e81" opacity="0.2" />
                </svg>

                {/* Campus Compass Rose Watermark */}
                <div className="absolute top-4 left-4 p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2 text-[10px] text-slate-400 backdrop-blur-md">
                  <Compass className="w-4 h-4 text-indigo-400" />
                  <span>North Sector: Innovation & Academic Wing</span>
                </div>

                {/* Legend Watermark */}
                <div className="absolute bottom-4 left-4 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[10px] text-slate-400 backdrop-blur-md space-y-1 hidden sm:block">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    <span>Academic & Classrooms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Research GPU Labs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-500" />
                    <span>Hostel Residences</span>
                  </div>
                </div>

                {/* Interactive Hotspots Pins on the Map */}
                {filteredLocations.map((loc) => {
                  const isSelected = selectedLoc?.id === loc.id;
                  return (
                    <div
                      key={loc.id}
                      style={{ top: loc.top, left: loc.left }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer"
                      onClick={() => {
                        setSelectedLoc(loc);
                        setWalkingRoute(null);
                      }}
                    >
                      {/* Pulse Ring */}
                      <span
                        className={`absolute -inset-2 rounded-full opacity-75 animate-ping pointer-events-none ${
                          isSelected ? 'bg-indigo-400 scale-125' : 'bg-slate-400 opacity-20'
                        }`}
                      />

                      {/* Map Pin Icon Button */}
                      <div
                        className={`relative w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-xs shadow-xl transition-all duration-300 transform group-hover:scale-110 ${
                          isSelected
                            ? 'bg-gradient-to-tr from-indigo-500 to-purple-600 text-white ring-4 ring-indigo-400/40 scale-110'
                            : 'bg-slate-900 text-white border border-slate-700 hover:border-indigo-400'
                        }`}
                      >
                        <Building2 className="w-4 h-4" />
                      </div>

                      {/* Tooltip Label */}
                      <div
                        className={`absolute top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap shadow-xl backdrop-blur-md pointer-events-none transition-all ${
                          isSelected
                            ? 'bg-indigo-600 text-white opacity-100 z-30'
                            : 'bg-slate-900/90 text-slate-300 border border-slate-700/80 group-hover:opacity-100 opacity-0'
                        }`}
                      >
                        {loc.name}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Virtual 360 Video Tour Mode */
              <div className="relative flex-1 w-full h-[380px] lg:h-full bg-black flex flex-col justify-between">
                <div className="relative flex-1 w-full bg-black">
                  <iframe
                    src={selectedLoc.videoTour}
                    title={selectedLoc.name}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-3 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
                  <span className="flex items-center gap-1.5 text-indigo-400 font-bold">
                    <Video className="w-4 h-4" /> 360° Panoramic View: {selectedLoc.name}
                  </span>
                  <button
                    onClick={() => setViewMode('map')}
                    className="px-3 py-1 rounded-lg bg-indigo-600 text-white font-bold text-xs"
                  >
                    Return to Map Blueprint
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar: Selected Landmark Inspector (4 cols) */}
          <div className="lg:col-span-4 bg-slate-900/70 flex flex-col overflow-y-auto p-5 sm:p-6 space-y-5">
            {selectedLoc ? (
              <>
                {/* Photo Preview with Badges */}
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 shadow-md">
                  <img
                    src={selectedLoc.image}
                    alt={selectedLoc.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600 text-white shadow-md">
                      {selectedLoc.code}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="text-[10px] uppercase font-bold text-indigo-300 tracking-wider">
                      {selectedLoc.category}
                    </span>
                    <h4 className="text-base font-extrabold text-white line-clamp-1">
                      {selectedLoc.name}
                    </h4>
                  </div>
                </div>

                {/* Building Meta Stats */}
                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                      Floors & Wings
                    </span>
                    <p className="font-bold text-white mt-0.5">{selectedLoc.floors}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                      Live Occupancy
                    </span>
                    <p className="font-bold text-emerald-400 mt-0.5 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {selectedLoc.occupancy}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Building Overview
                  </h5>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3.5 rounded-xl border border-slate-800">
                    {selectedLoc.description}
                  </p>
                </div>

                {/* Incharge */}
                <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-900/60 text-xs">
                  <span className="text-[10px] text-indigo-300 uppercase font-semibold block">
                    Administrative / Academic Incharge
                  </span>
                  <p className="font-bold text-white mt-0.5">{selectedLoc.head}</p>
                </div>

                {/* Facilities Badges */}
                <div>
                  <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Key Facilities
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedLoc.facilities.map((fac, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700"
                      >
                        ✓ {fac}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Walking Route Calculator */}
                {walkingRoute && (
                  <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-1 text-xs animate-in fade-in">
                    <div className="flex items-center justify-between font-bold text-emerald-400">
                      <span className="flex items-center gap-1">
                        <Navigation className="w-3.5 h-3.5" /> Walking Route Generated
                      </span>
                      <span>{walkingRoute.time}</span>
                    </div>
                    <p className="text-slate-300 text-[11px]">
                      From <strong>{walkingRoute.from}</strong> to <strong>{selectedLoc.name}</strong> ({walkingRoute.distance}).
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => setViewMode('virtualTour')}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/30 transition-all"
                  >
                    <Video className="w-4 h-4" />
                    Step Inside (360° Virtual Tour)
                  </button>

                  <button
                    onClick={() => handleCalculateRoute(selectedLoc)}
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all border border-slate-700"
                  >
                    <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                    Directions from Hostel
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 text-xs">
                <MapPin className="w-8 h-8 opacity-40 mb-2" />
                Select any landmark pin on the map to inspect details.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
