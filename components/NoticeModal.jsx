'use client';

import React from 'react';
import { useLMS } from '../context/LMSContext';
import { X, Bell, Calendar, Megaphone, ShieldAlert, FileText } from 'lucide-react';

export default function NoticeModal({ onClose }) {
  const { notices } = useLMS();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[88vh] flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Official Campus Notice Board
              </h3>
              <p className="text-xs text-slate-500">
                Authorized circulars from the Academic Directorate & Dean's Office
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0">
          {notices.map((n) => (
            <div
              key={n.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2.5 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
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
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{n.title}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {n.content}
              </p>
              <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-200/60 dark:border-slate-800">
                <span>By: {n.publishedBy}</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  {n.department}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Close Notice Board
          </button>
        </div>
      </div>
    </div>
  );
}
