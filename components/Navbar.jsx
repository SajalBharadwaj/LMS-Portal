'use client';

import React from 'react';
import { useLMS } from '../context/LMSContext';
import {
  GraduationCap,
  Sun,
  Moon,
  BookOpen,
  Briefcase,
  ShieldCheck,
  Bell,
  CheckCircle2,
  AlertCircle,
  Info,
  X,
  Compass,
  MapPin,
} from 'lucide-react';

export default function Navbar({ onOpenNotices, onOpenCampusMap }) {
  const {
    activeRole,
    setActiveRole,
    currentUser,
    theme,
    toggleTheme,
    notices,
    toasts,
    removeToast,
  } = useLMS();

  const urgentNoticesCount = notices.filter(
    (n) => n.priority === 'Urgent' || n.priority === 'High'
  ).length;

  const isFacultyActive = activeRole === 'faculty' || activeRole === 'instructor';

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-nav transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
            {/* College Branding */}
            <div className="flex items-center gap-3 min-w-max">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 text-white">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-lg font-black tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                    APEX UNIVERSITY
                  </span>
                  <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    ERP & LMS Portal
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                  Academic Management & Examination Information System
                </p>
              </div>
            </div>

            {/* Sticky Role Switcher Pills */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800/90 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/60 shadow-inner">
              <button
                id="role-btn-student"
                onClick={() => setActiveRole('student')}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  activeRole === 'student'
                    ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Student</span>
              </button>

              <button
                id="role-btn-faculty"
                onClick={() => setActiveRole('faculty')}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  isFacultyActive
                    ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Faculty</span>
              </button>

              <button
                id="role-btn-admin"
                onClick={() => setActiveRole('admin')}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  activeRole === 'admin'
                    ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Admin / Dean</span>
              </button>
            </div>

            {/* Right Action Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Campus 3D Map & Virtual Tour Button */}
              <button
                id="navbar-campus-map-btn"
                onClick={onOpenCampusMap}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/80 hover:bg-indigo-100 transition-colors text-xs font-bold shadow-sm"
                title="Explore 3D Virtual Campus Map"
              >
                <Compass className="w-4 h-4 text-indigo-500 animate-spin-slow" />
                <span className="hidden md:inline">Campus 3D Tour</span>
                <span className="md:hidden">Map</span>
              </button>

              {/* Notices Bell Button */}
              <button
                id="navbar-notice-btn"
                onClick={onOpenNotices}
                className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="View Official Campus Notices"
              >
                <Bell className="w-5 h-5" />
                {urgentNoticesCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-600 text-[10px] font-bold text-white items-center justify-center">
                      {urgentNoticesCount}
                    </span>
                  </span>
                )}
              </button>

              {/* Theme Toggle */}
              <button
                id="navbar-theme-btn"
                onClick={toggleTheme}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle Dark/Light Mode"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-amber-400" />
                ) : (
                  <Moon className="w-5 h-5 text-slate-700" />
                )}
              </button>

              {/* Profile Chip */}
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover ring-2 ring-indigo-500/30"
                />
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                    {currentUser.name}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                    {activeRole === 'student'
                      ? currentUser.rollNo
                      : isFacultyActive
                      ? 'Exam Incharge'
                      : 'Dean Academics'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Floating Toast Alerts Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-2xl border text-sm transition-all duration-300 transform translate-y-0 ${
              toast.type === 'success'
                ? 'bg-emerald-900/90 dark:bg-emerald-950/95 border-emerald-700 text-emerald-100'
                : toast.type === 'info'
                ? 'bg-indigo-900/90 dark:bg-indigo-950/95 border-indigo-700 text-indigo-100'
                : 'bg-rose-900/90 dark:bg-rose-950/95 border-rose-700 text-rose-100'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}
            <div className="flex-1 font-medium">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
