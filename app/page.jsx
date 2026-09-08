'use client';

import React, { useState } from 'react';
import { useLMS } from '../context/LMSContext';
import Navbar from '../components/Navbar';
import StudentView from '../components/student/StudentView';
import FacultyView from '../components/faculty/FacultyView';
import AdminView from '../components/admin/AdminView';
import NoticeModal from '../components/NoticeModal';
import CampusChatbot from '../components/chatbot/CampusChatbot';
import CampusTourMapModal from '../components/campus/CampusTourMapModal';
import {
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Github,
  Heart,
  BookOpen,
} from 'lucide-react';

export default function Home() {
  const {
    activeRole,
    showCampusTourModal,
    campusTourInitialLoc,
    campusTourInitialMode,
    openCampusTour,
    closeCampusTour,
  } = useLMS();
  const [showNoticesModal, setShowNoticesModal] = useState(false);

  const isFaculty = activeRole === 'faculty' || activeRole === 'instructor';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors duration-300 relative">
      {/* Sticky Top Navbar with Dynamic Role Switcher */}
      <Navbar
        onOpenNotices={() => setShowNoticesModal(true)}
        onOpenCampusMap={() => openCampusTour()}
      />

      {/* Main Role-Specific View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeRole === 'student' && <StudentView />}
        {isFaculty && <FacultyView />}
        {activeRole === 'admin' && <AdminView />}
      </main>

      {/* Institutional Footer */}
      <footer className="w-full border-t border-slate-200 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md py-8 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-indigo-500" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Apex Institute of Technology & Research
            </span>
            <span>• Autumn 2026 Academic Session</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setShowNoticesModal(true)}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors"
            >
              Circulars Archive
            </button>
            <span>•</span>
            <span className="flex items-center gap-1">
              Active Role: <strong className="text-indigo-500 capitalize">{activeRole}</strong>
            </span>
          </div>
        </div>
      </footer>

      {/* Notice Board Modal */}
      {showNoticesModal && (
        <NoticeModal onClose={() => setShowNoticesModal(false)} />
      )}

      {/* Campus 3D Map & Virtual Tour Modal */}
      {showCampusTourModal && (
        <CampusTourMapModal
          onClose={closeCampusTour}
          initialLocationId={campusTourInitialLoc}
          initialViewMode={campusTourInitialMode}
        />
      )}

      {/* Floating AI Campus Assistant Chatbot */}
      <CampusChatbot />
    </div>
  );
}
