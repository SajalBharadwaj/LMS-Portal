'use client';

import React from 'react';
import {
  X,
  Printer,
  Sparkles,
  Ticket,
  Calendar,
  MapPin,
  QrCode,
  ShieldCheck,
} from 'lucide-react';

export default function EventPassModal({ event, student, onClose }) {
  if (!event) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 print:hidden">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Ticket className="w-4 h-4 text-indigo-500" />
            Official Campus Event Pass
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Print Pass
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Ticket Body */}
        <div className="p-6 space-y-5 text-slate-900 dark:text-slate-100">
          {/* Banner Graphic */}
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-900 shadow-md">
            <img
              src={event.banner}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-600 text-white">
                {event.category}
              </span>
              <h3 className="text-sm font-bold text-white mt-1 line-clamp-1">
                {event.title}
              </h3>
            </div>
          </div>

          {/* Pass ID & Verified Badge */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800">
            <div>
              <span className="text-[10px] uppercase font-bold text-indigo-500 tracking-wider">
                Pass Credential ID
              </span>
              <p className="font-mono font-extrabold text-sm text-indigo-700 dark:text-indigo-300">
                {event.passId || 'PASS-APX-REG-2026'}
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-1 rounded-md">
              <ShieldCheck className="w-3.5 h-3.5" /> CONFIRMED
            </span>
          </div>

          {/* Metadata */}
          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>
                Schedule: <strong>{event.date}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
              <span>
                Venue: <strong>{event.venue}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span>
                Organized by: <strong>{event.club}</strong>
              </span>
            </div>
          </div>

          {/* Attendee Details & Barcode Mock */}
          <div className="pt-4 border-t-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">
                Delegate Name
              </span>
              <p className="font-bold text-xs text-slate-900 dark:text-white">
                {student.name}
              </p>
              <p className="text-[11px] font-mono text-slate-500">{student.rollNo}</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border border-slate-300 dark:border-slate-700 rounded-lg p-1 bg-white flex items-center justify-center">
                <QrCode className="w-10 h-10 text-slate-900" />
              </div>
              <span className="text-[9px] text-slate-400 mt-1">Scan at Entrance</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
