'use client';

import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import { INITIAL_CAMPUS_LOCATIONS } from '../../data/mockData';
import {
  ShieldCheck,
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
  Megaphone,
  Bell,
  Send,
  Calendar,
  AlertCircle,
  Sparkles,
  Building2,
  FileSpreadsheet,
  CheckCircle,
  CreditCard,
  DollarSign,
  PieChart,
  Compass,
  MapPin,
  Video,
  Navigation,
  Activity,
  Radio,
  ExternalLink,
} from 'lucide-react';

export default function AdminView() {
  const { adminProfile, notices, broadcastNotice, fees, openCampusTour } = useLMS();

  // New Circular State
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Academic Directorate');
  const [category, setCategory] = useState('Examination');
  const [priority, setPriority] = useState('Urgent');
  const [content, setContent] = useState('');
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  // Financial calculations
  const totalCollected = adminProfile.totalFeeCollected;
  const totalExpected = adminProfile.totalFeeExpected;
  const pendingArrears = totalExpected - totalCollected;
  const collectionRate = ((totalCollected / totalExpected) * 100).toFixed(1);

  const handleBroadcast = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('Please fill in both the circular title and detailed announcement body.');
      return;
    }

    setIsBroadcasting(true);
    broadcastNotice({
      title,
      department,
      category,
      priority,
      content,
    });

    setTitle('');
    setContent('');
    setIsBroadcasting(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Admin Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 shadow-xl border border-purple-900/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={adminProfile.avatar}
              alt={adminProfile.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-purple-500/30 shadow-lg"
            />
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/30">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Dean Academics & Central Accounts Directorate
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                {adminProfile.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                {adminProfile.title} • {adminProfile.institution}
              </p>
              <p className="text-xs text-slate-400">{adminProfile.email} • {adminProfile.phone}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-right">
              <span className="text-[10px] text-slate-400 block uppercase font-semibold">Total Scholars</span>
              <span className="text-2xl font-black text-indigo-400">
                {adminProfile.totalRegisteredStudents.toLocaleString()}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-right">
              <span className="text-[10px] text-slate-400 block uppercase font-semibold">Fee Collection Rate</span>
              <span className="text-2xl font-black text-emerald-400">
                {collectionRate}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* College Accounts & Fee Collection Overview */}
      <section className="space-y-4">
        <div className="pb-2 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-500" />
            University Fee Collection & Accounts Engine
          </h2>
          <p className="text-xs text-slate-500">
            Real-time reconciliation of tuition fees, examination dues, and hostel collections.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="glass-card rounded-2xl p-5 border shadow-sm">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Total Budget Expected
            </span>
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              ₹ {(totalExpected / 10000000).toFixed(2)} Cr
            </p>
            <span className="text-xs text-slate-500 mt-1 inline-block">
              For Academic Session 2026-27
            </span>
          </div>

          <div className="glass-card rounded-2xl p-5 border shadow-sm">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Total Amount Realized
            </span>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              ₹ {(totalCollected / 10000000).toFixed(2)} Cr
            </p>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1 inline-block">
              {collectionRate}% Collection Efficiency
            </span>
          </div>

          <div className="glass-card rounded-2xl p-5 border shadow-sm">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Outstanding Dues
            </span>
            <p className="text-2xl font-black text-amber-500">
              ₹ {(pendingArrears / 10000000).toFixed(2)} Cr
            </p>
            <span className="text-xs text-amber-500 font-semibold mt-1 inline-block">
              Reminders dispatched via ERP
            </span>
          </div>

          <div className="glass-card rounded-2xl p-5 border shadow-sm">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Student Fee Ledgers
            </span>
            <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
              {fees.length} Active Records
            </p>
            <span className="text-xs text-slate-500 mt-1 inline-block">
              Tuition, Exam, Hostel & Alumni
            </span>
          </div>
        </div>
      </section>

      {/* 🏛️ University Infrastructure & Smart Campus Navigator (3D Online Tour) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-indigo-500 animate-spin-slow" />
                Campus Infrastructure & 3D Interactive Map Navigator
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                120-Acre Smart Campus
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Dean & Directorate Live Inspection: Real-time facility occupancy, smart wayfinding, and 360° virtual video walkthroughs.
            </p>
          </div>

          <button
            id="admin-launch-campus-tour-btn"
            onClick={() => openCampusTour()}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all transform hover:scale-[1.02]"
          >
            <Compass className="w-4 h-4 text-white" />
            Launch 3D Campus Tour & Vector Map
          </button>
        </div>

        {/* Quick Facility Infrastructure Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-indigo-500/5 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/40">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Autonomous Area
            </span>
            <p className="text-lg font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
              120 Acres
            </p>
            <span className="text-[10px] text-slate-500">Wi-Fi 6 Smart Coverage</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Major Complexes
            </span>
            <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
              8 Hubs Connected
            </p>
            <span className="text-[10px] text-slate-500">Academic, Labs, Hostels</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-purple-500/5 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Live On-Campus Headcount
            </span>
            <p className="text-lg font-black text-purple-600 dark:text-purple-400 mt-0.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              3,420 Active
            </p>
            <span className="text-[10px] text-slate-500">Scholars, Faculty & Staff</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-pink-500/5 dark:bg-pink-950/20 border border-pink-200 dark:border-pink-900/40">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Virtual Wayfinding
            </span>
            <p className="text-lg font-black text-pink-600 dark:text-pink-400 mt-0.5">
              360° Tours Active
            </p>
            <span className="text-[10px] text-slate-500">Online 3D Walkthroughs</span>
          </div>
        </div>

        {/* Blueprint Interactive Mini-Map Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-[#070b14] border border-slate-800 p-6 sm:p-8 text-white shadow-xl">
          {/* Background Blueprint Grid */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(#6366f1 1px, transparent 1px), linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)`,
              backgroundSize: '36px 36px',
            }}
          />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                Live GPS & 3D Autonomous Campus Navigator
              </div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                Inspect University Campus, Labs & Hostels Online
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Click any building to pinpoint its GPS coordinates, check live student occupancy, evaluate department head cabins, calculate walking routes from hostels, or step inside with 360° panoramic video tours.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => openCampusTour()}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition-all"
                >
                  <MapPin className="w-4 h-4" /> Open Full Vector Blueprint
                </button>
                <button
                  onClick={() => openCampusTour('loc-lhc', 'virtualTour')}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-all"
                >
                  <Video className="w-4 h-4 text-emerald-400" /> Watch 360° Campus Tour
                </button>
              </div>
            </div>

            {/* Hotspot Chips on the right */}
            <div className="grid grid-cols-2 gap-2 text-xs min-w-[280px]">
              {INITIAL_CAMPUS_LOCATIONS.slice(0, 6).map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => openCampusTour(loc.id, 'map')}
                  className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-indigo-950/80 border border-slate-800 hover:border-indigo-500/50 text-left transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-indigo-400">{loc.code}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  </div>
                  <p className="text-xs font-bold text-white group-hover:text-indigo-200 truncate mt-0.5">
                    {loc.name}
                  </p>
                  <span className="text-[10px] text-slate-400">{loc.occupancy}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 8 Connected Complexes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {INITIAL_CAMPUS_LOCATIONS.map((loc) => (
            <div
              key={loc.id}
              className="glass-card rounded-2xl overflow-hidden border shadow-sm flex flex-col justify-between group hover:border-indigo-500/50 transition-all duration-300"
            >
              <div>
                <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                  <img
                    src={loc.image}
                    alt={loc.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600 text-white shadow-md">
                    {loc.code}
                  </span>
                  <div className="absolute bottom-2 left-2.5 right-2.5">
                    <span className="text-[9px] uppercase font-bold text-indigo-300 tracking-wider block">
                      {loc.category}
                    </span>
                    <h4 className="text-xs font-extrabold text-white truncate">
                      {loc.name}
                    </h4>
                  </div>
                </div>

                <div className="p-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Live Occupancy</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {loc.occupancy}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {loc.description}
                  </p>

                  <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800 truncate">
                    Incharge: <strong>{loc.head}</strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-3 bg-slate-50/70 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => openCampusTour(loc.id, 'map')}
                  className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 font-bold text-[11px] hover:bg-indigo-100 transition-colors"
                >
                  <MapPin className="w-3 h-3" /> Map Pin
                </button>
                <button
                  onClick={() => openCampusTour(loc.id, 'virtualTour')}
                  className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-[11px] transition-colors"
                >
                  <Video className="w-3 h-3 text-emerald-400" /> 360° Tour
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Notice Broadcaster & Live Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-card rounded-2xl p-6 border shadow-sm space-y-4">
            <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-indigo-500" />
                Broadcast University Circular
              </h3>
              <p className="text-xs text-slate-500">
                Instantly notifies all scholars, faculty members, and academic departments.
              </p>
            </div>

            <form onSubmit={handleBroadcast} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Circular Subject / Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule for Autumn 2026 End-Sem Practicals"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="Academic Directorate">Academic Directorate</option>
                    <option value="Controller of Examinations">Controller of Examinations</option>
                    <option value="Finance & Accounts Section">Finance & Accounts Section</option>
                    <option value="Training & Placement Cell">Training & Placement Cell</option>
                    <option value="Dept. of CSE">Dept. of CSE</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Priority Flag
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="Urgent">Urgent (Red Alert)</option>
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Circular Text & Official Instructions *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Draft official notifications, instructions, eligibility criteria..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={isBroadcasting}
                className="w-full py-3 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Publish to Campus Dashboard
              </button>
            </form>
          </div>
        </div>

        {/* Live Notices Stream (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="pb-2 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-500" />
              Published Campus Circulars ({notices.length})
            </h3>
          </div>

          <div className="space-y-3">
            {notices.map((n) => (
              <div
                key={n.id}
                className="glass-card rounded-2xl p-5 border shadow-sm space-y-2.5"
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                      n.priority === 'Urgent'
                        ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400'
                        : n.priority === 'High'
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                        : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400'
                    }`}
                  >
                    {n.priority}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> {n.date}
                  </span>
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    {n.department}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {n.title}
                </h4>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  {n.content}
                </p>

                <div className="text-[11px] text-slate-400 pt-1">
                  Issued by: <strong>{n.publishedBy}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
