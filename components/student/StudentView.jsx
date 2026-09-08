'use client';

import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import ClassroomModal from './ClassroomModal';
import QuizModal from './QuizModal';
import AssignmentModal from './AssignmentModal';
import GradeSheetModal from './GradeSheetModal';
import FeeReceiptModal from './FeeReceiptModal';
import EventPassModal from './EventPassModal';
import FilmPlayerModal from './FilmPlayerModal';
import {
  LayoutDashboard,
  CalendarCheck,
  Award,
  Calendar,
  CreditCard,
  FileCheck,
  Sparkles,
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ChevronRight,
  Printer,
  Download,
  ExternalLink,
  Play,
  ArrowUpRight,
  ShieldAlert,
  GraduationCap,
  Users,
  MapPin,
  Ticket,
  Film,
  Heart,
  Star,
  Compass,
  Navigation,
  Video,
  Building2,
  Search,
  Maximize2,
  Radio,
} from 'lucide-react';
import { INITIAL_CAMPUS_LOCATIONS } from '../../data/mockData';

export default function StudentView() {
  const {
    studentProfile,
    courses,
    enrollCourse,
    timetable,
    fees,
    payFee,
    events,
    registerEvent,
    assignments,
    quizzes,
    quizResults,
    campusFilms,
    activeFilmModal,
    setActiveFilmModal,
    activeFeeReceiptModal,
    setActiveFeeReceiptModal,
    activeEventPassModal,
    setActiveEventPassModal,
    activeGradeSheetModal,
    setActiveGradeSheetModal,
    activeClassroomModal,
    setActiveClassroomModal,
    activeQuizModal,
    setActiveQuizModal,
    openCampusTour,
  } = useLMS();

  // Tab State
  const [activeTab, setActiveTab] = useState('dashboard');
  // 'dashboard' | 'attendance' | 'results' | 'timetable' | 'fees' | 'assignments' | 'activities' | 'cinema' | 'quizzes' | 'campusTour'

  const [selectedDay, setSelectedDay] = useState('Monday');
  const [activeAssignmentId, setActiveAssignmentId] = useState(null);

  // In-Page Campus Map State
  const [studentMapLocations] = useState(INITIAL_CAMPUS_LOCATIONS);
  const [studentSelectedLoc, setStudentSelectedLoc] = useState(INITIAL_CAMPUS_LOCATIONS[1]); // LHC Default
  const [studentMapCategory, setStudentMapCategory] = useState('All');
  const [studentMapViewMode, setStudentMapViewMode] = useState('map'); // 'map' | 'virtualTour'
  const [studentMapSearch, setStudentMapSearch] = useState('');
  const [studentWalkingRoute, setStudentWalkingRoute] = useState(null);

  const studentCategories = ['All', 'Academic', 'Research Labs', 'Administrative', 'Residential', 'Sports & Recreation'];

  const studentFilteredLocations = studentMapLocations.filter((loc) => {
    const matchesCat = studentMapCategory === 'All' || loc.category.includes(studentMapCategory);
    const matchesSearch =
      loc.name.toLowerCase().includes(studentMapSearch.toLowerCase()) ||
      loc.code.toLowerCase().includes(studentMapSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleStudentCalcRoute = (loc) => {
    const dist = Math.floor(160 + Math.random() * 400);
    const mins = Math.ceil(dist / 80);
    setStudentWalkingRoute({
      destination: loc.name,
      distance: `${dist} meters`,
      time: `${mins} mins walk`,
      from: 'Nilgiri Student Hostel (Wing A)',
    });
  };

  // Calculate Shortfall helper
  const calculateClassesNeeded = (attended, total) => {
    // (attended + N) / (total + N) >= 0.75
    // attended + N >= 0.75 * total + 0.75 * N
    // 0.25 * N >= 0.75 * total - attended
    // N >= 3 * total - 4 * attended
    const needed = Math.ceil(3 * total - 4 * attended);
    return Math.max(0, needed);
  };

  const lowAttendanceList = studentProfile.subjectAttendance.filter(
    (s) => s.percentage < 75
  );

  const pendingFeesTotal = fees
    .filter((f) => f.status === 'Pending')
    .reduce((acc, f) => acc + f.amount, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Student Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white p-6 sm:p-8 shadow-xl border border-indigo-700/50">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={studentProfile.avatar}
              alt={studentProfile.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-indigo-400/40 shadow-xl"
            />
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-indigo-200 border border-white/10">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Autonomous B.Tech CSE • {studentProfile.semester}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                {studentProfile.name}
              </h1>
              <p className="text-xs sm:text-sm text-indigo-200">
                Roll No: <span className="font-mono font-bold text-white">{studentProfile.rollNo}</span> • Sec: {studentProfile.section} • Advisor: {studentProfile.advisor}
              </p>
            </div>
          </div>

          {/* Quick Metrics Header Pill */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-2.5 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md">
              <span className="text-[10px] text-indigo-200 uppercase font-semibold block">
                Current CGPA
              </span>
              <span className="text-xl font-black text-white">{studentProfile.cgpa}</span>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md">
              <span className="text-[10px] text-indigo-200 uppercase font-semibold block">
                Overall Attendance
              </span>
              <span
                className={`text-xl font-black ${
                  studentProfile.overallAttendance >= 75
                    ? 'text-emerald-300'
                    : 'text-rose-300'
                }`}
              >
                {studentProfile.overallAttendance}%
              </span>
            </div>
          </div>
        </div>

        {/* Decorative ambient background */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Attendance Shortfall Alert Strip if any subject < 75% */}
      {lowAttendanceList.length > 0 && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-rose-900 dark:text-rose-200">
                Detention Risk Warning: Mandatory Attendance Shortfall
              </h4>
              <p className="text-xs text-rose-800 dark:text-rose-300 mt-0.5">
                Your attendance in{' '}
                {lowAttendanceList.map((s, idx) => (
                  <span key={s.code} className="font-bold">
                    {s.code} ({s.percentage}%) - needs{' '}
                    <span className="underline font-black">
                      {calculateClassesNeeded(s.attended, s.total)} consecutive classes
                    </span>{' '}
                    to reach 75%
                    {idx < lowAttendanceList.length - 1 ? ', ' : ''}
                  </span>
                ))}
                . Debarment from final theory exam applies if not rectified.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('attendance')}
            className="shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition-colors"
          >
            Fix Shortfall
          </button>
        </div>
      )}

      {/* Navigation Sub-Tabs Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold scrollbar-none">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'dashboard'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          Dashboard Overview
        </button>

        <button
          onClick={() => setActiveTab('attendance')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'attendance'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          Attendance Tracker
          {lowAttendanceList.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('results')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'results'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          Results & Marks
        </button>

        <button
          onClick={() => setActiveTab('timetable')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'timetable'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Lecture Timetable
        </button>

        <button
          onClick={() => setActiveTab('fees')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'fees'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          Fees & Accounts
          {pendingFeesTotal > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px]">
              ₹{(pendingFeesTotal / 1000).toFixed(0)}k
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('assignments')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'assignments'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          Assignments ({assignments.filter((a) => a.status === 'Pending').length})
        </button>

        <button
          onClick={() => setActiveTab('activities')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'activities'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Clubs & Hackathons
        </button>

        <button
          onClick={() => setActiveTab('cinema')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'cinema'
              ? 'bg-pink-600 text-white shadow-md shadow-pink-500/25'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Film className="w-4 h-4" />
          Campus Cinema & Plays
        </button>

        <button
          onClick={() => setActiveTab('quizzes')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'quizzes'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          Assessments
        </button>

        <button
          id="student-tab-campus-tour"
          onClick={() => setActiveTab('campusTour')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'campusTour'
              ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-md shadow-indigo-500/25'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Compass className="w-4 h-4 text-emerald-400 animate-spin-slow" />
          <span>Campus 3D Tour & Map</span>
          <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
            3D Live
          </span>
        </button>
      </div>

      {/* TAB 1: DASHBOARD OVERVIEW */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Top 3 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="glass-card rounded-2xl p-5 border shadow-sm">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Cumulative CGPA
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  {studentProfile.cgpa}
                </span>
                <span className="text-xs text-slate-400">/ 10.0</span>
              </div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-2 flex items-center gap-1">
                <Award className="w-3.5 h-3.5" /> First Class with Distinction
              </p>
            </div>

            <div className="glass-card rounded-2xl p-5 border shadow-sm">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Earned Degree Credits
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  {studentProfile.earnedCredits}
                </span>
                <span className="text-xs text-slate-400">/ {studentProfile.totalCredits}</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mt-3">
                <div
                  className="bg-indigo-600 h-2 rounded-full"
                  style={{
                    width: `${(studentProfile.earnedCredits / studentProfile.totalCredits) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5 border shadow-sm">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Aggregate Attendance
              </span>
              <div className="flex items-baseline gap-2">
                <span
                  className={`text-3xl font-black ${
                    studentProfile.overallAttendance >= 75
                      ? 'text-slate-900 dark:text-white'
                      : 'text-rose-600'
                  }`}
                >
                  {studentProfile.overallAttendance}%
                </span>
                <span className="text-xs text-slate-400">Min 75% Cutoff</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {lowAttendanceList.length === 0 ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    ✓ All subjects compliant
                  </span>
                ) : (
                  <span className="text-rose-500 font-semibold">
                    ⚠️ {lowAttendanceList.length} Subject below threshold
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Featured Smart Campus 3D Map Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#070b14] via-indigo-950 to-purple-950 border border-indigo-800/40 p-6 text-white shadow-xl">
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(#6366f1 1px, transparent 1px), linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)`,
                backgroundSize: '32px 32px',
              }}
            />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
                  <Compass className="w-3.5 h-3.5 text-indigo-400 animate-spin-slow" />
                  120-Acre Smart Autonomous Campus Map
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                  Explore Buildings, Labs, Hostels & 360° Tours Online
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Lost on campus or need walking directions from Nilgiri Hostel? Use our interactive 3D blueprint to explore Lecture Hall Complex (LHC), the AI GPU cluster, and sports arenas.
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => setActiveTab('campusTour')}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition-all"
                  >
                    <MapPin className="w-3.5 h-3.5" /> Open Campus Map in LMS
                  </button>
                  <button
                    onClick={() => openCampusTour()}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg transition-all"
                  >
                    <Maximize2 className="w-3.5 h-3.5" /> Fullscreen 3D Navigator
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs min-w-[260px]">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">LHC Complex</span>
                  <span className="text-sm font-extrabold text-indigo-400 mt-0.5 block">LHC-201 & 104</span>
                  <span className="text-[10px] text-slate-400">4 mins walk from hostel</span>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">GPU Cluster</span>
                  <span className="text-sm font-extrabold text-emerald-400 mt-0.5 block">NVIDIA H100</span>
                  <span className="text-[10px] text-slate-400">AI Deep Learning Lab</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enrolled Courses Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Active Classroom Courses ({courses.filter((c) => c.enrolled).length})
              </h3>
              <button
                onClick={() => setActiveTab('timetable')}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                View Timetable <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="glass-card rounded-2xl overflow-hidden border shadow-sm flex flex-col justify-between group hover:border-indigo-500/40 transition-all"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                    <img
                      src={course.coverImage}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-600 text-white">
                        {course.code}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-black/60 text-slate-200">
                        {course.credits} Credits
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <h4 className="text-sm font-bold text-white line-clamp-1">
                        {course.title}
                      </h4>
                      <p className="text-[11px] text-indigo-300">{course.instructor}</p>
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                      {course.description}
                    </p>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-500">Curriculum Progress</span>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">
                          {course.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full transition-all"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveClassroomModal(course)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Resume Classroom
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ATTENDANCE MANAGEMENT & SHORTFALL TRACKER */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6 border shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CalendarCheck className="w-5 h-5 text-indigo-500" />
                  Subject-Wise Attendance Register
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time synchronization with Faculty Attendance Register.
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 block">Overall Aggregate</span>
                <span
                  className={`text-2xl font-black ${
                    studentProfile.overallAttendance >= 75
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-600'
                  }`}
                >
                  {studentProfile.overallAttendance}%
                </span>
              </div>
            </div>

            {/* Attendance Table */}
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase font-bold text-slate-500 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Course Code & Subject</th>
                    <th className="px-4 py-3">Faculty Incharge</th>
                    <th className="px-3 py-3 text-center">Attended</th>
                    <th className="px-3 py-3 text-center">Total Held</th>
                    <th className="px-3 py-3 text-center">Percentage</th>
                    <th className="px-4 py-3">Status / Action Required</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {studentProfile.subjectAttendance.map((sub) => {
                    const isShortfall = sub.percentage < 75;
                    const classesNeeded = calculateClassesNeeded(sub.attended, sub.total);
                    return (
                      <tr
                        key={sub.code}
                        className={`hover:bg-slate-50 dark:hover:bg-slate-800/30 ${
                          isShortfall ? 'bg-rose-50/50 dark:bg-rose-950/20' : ''
                        }`}
                      >
                        <td className="px-4 py-3">
                          <span className="font-bold font-mono text-indigo-600 dark:text-indigo-400">
                            {sub.code}
                          </span>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {sub.name}
                          </p>
                        </td>

                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                          {sub.faculty}
                        </td>

                        <td className="px-3 py-3 text-center font-bold text-slate-900 dark:text-white">
                          {sub.attended}
                        </td>

                        <td className="px-3 py-3 text-center text-slate-500">{sub.total}</td>

                        <td className="px-3 py-3 text-center">
                          <span
                            className={`text-sm font-black ${
                              isShortfall
                                ? 'text-rose-600 dark:text-rose-400'
                                : 'text-emerald-600 dark:text-emerald-400'
                            }`}
                          >
                            {sub.percentage}%
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          {isShortfall ? (
                            <div className="space-y-1">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                                <AlertTriangle className="w-3 h-3" /> Detention Risk
                              </span>
                              <p className="text-[11px] font-bold text-rose-600 dark:text-rose-400">
                                Attend next {classesNeeded} classes to reach 75%
                              </p>
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                              <CheckCircle2 className="w-3 h-3" /> Safe Attendance
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ACADEMIC RESULTS & MARKSHEET HUB */}
      {activeTab === 'results' && (
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6 border shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  Academic Marksheet & Semester SGPA History
                </h3>
                <p className="text-xs text-slate-500">
                  Autonomous curriculum marks with internal (40) and end-sem theory (60) splits.
                </p>
              </div>

              <button
                onClick={() => setActiveGradeSheetModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/25"
              >
                <Printer className="w-4 h-4" />
                View & Print Official Marksheet
              </button>
            </div>

            {/* Semester SGPA Progression Bar */}
            <div>
              <h4 className="text-xs font-bold uppercase text-slate-500 mb-3 tracking-wider">
                Semester-by-Semester SGPA Progression
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                {studentProfile.semesterResults.map((sem, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center"
                  >
                    <span className="text-[11px] text-slate-500 block">{sem.sem}</span>
                    <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                      {sem.sgpa}
                    </span>
                    <span className="text-[10px] text-slate-400 block">{sem.year}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Marks Breakdown Table */}
            <div>
              <h4 className="text-xs font-bold uppercase text-slate-500 mb-3 tracking-wider">
                Current Semester (Autumn 2026) Subject Marks Breakdown
              </h4>
              <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/70 font-bold uppercase text-slate-600 dark:text-slate-300">
                    <tr>
                      <th className="px-4 py-3">Subject</th>
                      <th className="px-3 py-3 text-center">Internal (40)</th>
                      <th className="px-3 py-3 text-center">External (60)</th>
                      <th className="px-3 py-3 text-center">Total (100)</th>
                      <th className="px-3 py-3 text-center">Grade</th>
                      <th className="px-3 py-3 text-center">Point</th>
                      <th className="px-3 py-3 text-center">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {studentProfile.marksheetData.map((m) => (
                      <tr key={m.code} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                        <td className="px-4 py-3">
                          <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                            {m.code}
                          </span>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {m.name}
                          </p>
                        </td>
                        <td className="px-3 py-3 text-center text-slate-600 dark:text-slate-300">
                          {m.internal}
                        </td>
                        <td className="px-3 py-3 text-center text-slate-600 dark:text-slate-300">
                          {m.external}
                        </td>
                        <td className="px-3 py-3 text-center font-bold text-slate-900 dark:text-white">
                          {m.total}
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span className="px-2 py-0.5 rounded text-xs font-black bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                            {m.grade}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-center font-bold">{m.gradePoint}</td>
                        <td className="px-3 py-3 text-center">
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                            {m.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: WEEKLY LECTURE TIMETABLE */}
      {activeTab === 'timetable' && (
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6 border shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-500" />
                  Weekly Lecture & Practical Schedule
                </h3>
                <p className="text-xs text-slate-500">
                  Section CSE-A • Academic Block 3 & Advanced Computing Labs.
                </p>
              </div>

              {/* Day Pills */}
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl overflow-x-auto">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedDay === day
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Slots Timeline for Selected Day */}
            <div className="space-y-3">
              {timetable[selectedDay]?.map((slot, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    slot.isLive
                      ? 'border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-md ring-1 ring-emerald-500/30'
                      : slot.type === 'Break'
                      ? 'border-slate-200 dark:border-slate-800/60 bg-slate-50/40 dark:bg-slate-900/40'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-32 shrink-0">
                      <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300 block">
                        {slot.time}
                      </span>
                      {slot.isLive && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 animate-pulse">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" /> LIVE NOW
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                          {slot.code}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {slot.type}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                        {slot.subject}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {slot.faculty} • <span className="font-semibold text-slate-700 dark:text-slate-300">{slot.room}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {slot.room}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: COLLEGE FEE DEPOSIT & DIGITAL RECEIPTS */}
      {activeTab === 'fees' && (
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6 border shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-indigo-500" />
                  College Fee Ledger & Accounts Clearance
                </h3>
                <p className="text-xs text-slate-500">
                  Instant online payment processing and digitally signed receipt generation.
                </p>
              </div>

              {pendingFeesTotal > 0 ? (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-right">
                  <span className="text-[11px] text-slate-500 block">Total Dues Pending</span>
                  <span className="text-xl font-black text-amber-600 dark:text-amber-400">
                    ₹ {pendingFeesTotal.toLocaleString()}
                  </span>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-right">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    ✓ All Semester Dues Cleared
                  </span>
                </div>
              )}
            </div>

            {/* Fees List */}
            <div className="space-y-4">
              {fees.map((fee) => {
                const isPaid = fee.status === 'Paid';
                return (
                  <div
                    key={fee.id}
                    className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isPaid
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                              : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                          }`}
                        >
                          {fee.status}
                        </span>
                        <span className="text-xs text-slate-400">
                          Due Date: {new Date(fee.dueDate).toLocaleDateString()}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {fee.title}
                      </h4>

                      <div className="text-xs text-slate-500 space-y-0.5">
                        {fee.breakdown?.map((b, bIdx) => (
                          <span key={bIdx} className="inline-block mr-3">
                            • {b.item}: <strong>₹{b.cost.toLocaleString()}</strong>
                          </span>
                        ))}
                      </div>

                      {isPaid && (
                        <p className="text-[11px] text-slate-400 font-mono">
                          Txn: {fee.transactionId} • Paid via {fee.paymentMode}
                        </p>
                      )}
                    </div>

                    {/* Amount & Actions */}
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">Total Amount</span>
                        <span className="text-xl font-black text-slate-900 dark:text-white font-mono">
                          ₹ {fee.amount.toLocaleString()}
                        </span>
                      </div>

                      {isPaid ? (
                        <button
                          onClick={() => setActiveFeeReceiptModal(fee)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-200 transition-colors"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          Receipt
                        </button>
                      ) : (
                        <button
                          onClick={() => payFee(fee.id)}
                          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/25 transition-all"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          Pay Online
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: ASSIGNMENTS HUB & SUBMISSION DESK */}
      {activeTab === 'assignments' && (
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6 border shadow-sm space-y-4">
            <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-500" />
                Project Assignments & Laboratory Submissions
              </h3>
              <p className="text-xs text-slate-500">
                Submit GitHub repositories, track pending deliverables, and view detailed faculty feedback remarks.
              </p>
            </div>

            <div className="space-y-3">
              {assignments.map((asg) => (
                <div
                  key={asg.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                        {asg.courseCode}
                      </span>
                      <span className="text-xs text-slate-400">
                        Due: {new Date(asg.dueDate).toLocaleDateString()}
                      </span>
                      {asg.status === 'Graded' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                          Graded: {asg.earnedScore}/{asg.points}
                        </span>
                      )}
                      {asg.status === 'Submitted' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700">
                          Under Evaluation
                        </span>
                      )}
                      {asg.status === 'Pending' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">
                          Pending Submission
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {asg.title}
                    </h4>

                    {asg.instructorFeedback && (
                      <p className="text-xs text-emerald-700 dark:text-emerald-400 italic bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded-lg border border-emerald-500/20">
                        Faculty Feedback: "{asg.instructorFeedback}"
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => setActiveAssignmentId(asg.id)}
                    className="shrink-0 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    {asg.status === 'Graded'
                      ? 'View Feedback'
                      : asg.status === 'Submitted'
                      ? 'Review Submission'
                      : 'Submit Solution'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: CAMPUS ACTIVITIES & CLUBS */}
      {activeTab === 'activities' && (
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6 border shadow-sm space-y-6">
            <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                Campus Activities, Hackathons & Cultural Clubs
              </h3>
              <p className="text-xs text-slate-500">
                Register for collegiate fests, hackathons, and download your digital entry passes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.map((evt) => (
                <div
                  key={evt.id}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-800/50 flex flex-col justify-between"
                >
                  <div className="relative aspect-video w-full">
                    <img
                      src={evt.banner}
                      alt={evt.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-indigo-600 text-white">
                        {evt.category}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <h4 className="text-sm font-bold text-white line-clamp-1">
                        {evt.title}
                      </h4>
                      <span className="text-xs text-indigo-300">{evt.club}</span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                      {evt.description}
                    </p>

                    <div className="space-y-1 text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <p>
                        📅 <strong>{evt.date}</strong>
                      </p>
                      <p>
                        📍 <strong>{evt.venue}</strong>
                      </p>
                      <p className="text-amber-600 dark:text-amber-400 font-semibold">
                        🏆 {evt.prizePool}
                      </p>
                    </div>

                    <div className="pt-2">
                      {evt.registered ? (
                        <button
                          onClick={() => setActiveEventPassModal(evt)}
                          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/20"
                        >
                          <Ticket className="w-4 h-4" />
                          View Digital Entry Pass
                        </button>
                      ) : (
                        <button
                          onClick={() => registerEvent(evt.id)}
                          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/20"
                        >
                          RSVP & Register Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: CAMPUS CINEMA & THEATRE ROMANCE PLAYS */}
      {activeTab === 'cinema' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="glass-card rounded-2xl p-6 border shadow-sm space-y-6">
            <div className="pb-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Film className="w-5 h-5 text-pink-500" />
                  Apex Campus Cinema & Theatre Showcase
                </h3>
                <p className="text-xs text-slate-500">
                  Original student-directed romantic dramas, collegiate short films, and campus theatre plays.
                </p>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-bold bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20 w-max">
                Dramatics & Cinephiles Society
              </span>
            </div>

            {/* Films Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {campusFilms.map((film) => (
                <div
                  key={film.id}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-800/40 flex flex-col justify-between group hover:border-pink-500/40 transition-all shadow-sm"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                    <img
                      src={film.coverImage}
                      alt={film.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-pink-600 text-white backdrop-blur-md">
                        {film.genre}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-black/60 text-slate-200 backdrop-blur-md">
                        {film.duration}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3">
                      <h4 className="text-base font-black text-white line-clamp-1">
                        {film.title}
                      </h4>
                      <p className="text-xs text-pink-300 font-medium">
                        {film.club} • Directed by {film.director}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {film.synopsis}
                    </p>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="flex items-center gap-1 text-amber-500 font-semibold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        {film.rating} ({film.reviewsCount} reviews)
                      </span>
                      <span className="flex items-center gap-1 text-rose-500 font-semibold">
                        <Heart className="w-3.5 h-3.5 fill-current" />
                        {film.likes} Likes
                      </span>
                    </div>

                    {film.awards && (
                      <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20 line-clamp-1">
                        {film.awards}
                      </div>
                    )}

                    <button
                      onClick={() => setActiveFilmModal(film)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white shadow-md shadow-pink-600/20 transition-all"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      Watch Film & Read Reviews
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: ASSESSMENTS & TIMED QUIZZES */}
      {activeTab === 'quizzes' && (
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6 border shadow-sm space-y-6">
            <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-500" />
                Mid-Term Assessments & MCQ Quizzes
              </h3>
              <p className="text-xs text-slate-500">
                Timed evaluations with real-time scoring, confetti celebration, and detailed answer explanations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.values(quizzes).map((quiz) => {
                const pastResult = quizResults[quiz.id];
                return (
                  <div
                    key={quiz.id}
                    className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 space-y-4 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                          {quiz.courseCode}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {quiz.timeLimitMinutes} Mins
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">
                        {quiz.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        {quiz.questions.length} Questions • {quiz.totalPoints} Marks (Cutoff: {quiz.passingScore})
                      </p>
                    </div>

                    {pastResult ? (
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs">
                        <span className="font-bold text-emerald-700 dark:text-emerald-400">
                          Completed: {pastResult.score} / {pastResult.maxScore} ({pastResult.percentage}%)
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white font-bold text-[10px]">
                          Passed
                        </span>
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-500">
                        Timed session will commence upon clicking Start.
                      </div>
                    )}

                    <button
                      onClick={() => setActiveQuizModal(quiz.id)}
                      className="w-full py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/25"
                    >
                      {pastResult ? 'Retake Assessment' : 'Start Timed Assessment'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: CAMPUS 3D TOUR & INTERACTIVE MAP NAVIGATOR */}
      {activeTab === 'campusTour' && (
        <div className="space-y-6">
          {/* Header & Controls */}
          <div className="glass-card rounded-3xl p-6 border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                  <Compass className="w-5 h-5 animate-spin-slow" />
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  Autonomous Campus 3D Navigator & Virtual Tour
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Online Interactive Visit
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Explore 8 academic blocks, AI GPU clusters, Central Library, and Nilgiri Hostels with GPS wayfinding & 360° virtual video walkthroughs.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold">
                <button
                  onClick={() => setStudentMapViewMode('map')}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
                    studentMapViewMode === 'map'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" /> Map Blueprint
                </button>
                <button
                  onClick={() => setStudentMapViewMode('virtualTour')}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
                    studentMapViewMode === 'virtualTour'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" /> 360° Video Tour
                </button>
              </div>

              <button
                onClick={() => openCampusTour(studentSelectedLoc.id, studentMapViewMode)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold shadow-md hover:from-indigo-700 hover:to-purple-700 transition-all"
                title="Open in Fullscreen"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Fullscreen</span>
              </button>
            </div>
          </div>

          {/* Filter Bar & Search */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {studentCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setStudentMapCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
                    studentMapCategory === cat
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
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
                placeholder="Search LHC, AI Lab, Library..."
                value={studentMapSearch}
                onChange={(e) => setStudentMapSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Map + Detail Panel Container */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 8 cols: Interactive Blueprint Map or Virtual Tour */}
            <div className="lg:col-span-8 rounded-3xl overflow-hidden bg-[#070b14] border border-slate-800 relative shadow-xl min-h-[460px] flex flex-col justify-between">
              {studentMapViewMode === 'map' ? (
                <div className="relative flex-1 w-full h-full min-h-[460px] select-none overflow-hidden">
                  {/* Grid background */}
                  <div
                    className="absolute inset-0 opacity-25 pointer-events-none"
                    style={{
                      backgroundImage: `radial-gradient(#6366f1 1px, transparent 1px), linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)`,
                      backgroundSize: '36px 36px',
                    }}
                  />

                  {/* Pathways SVG overlay */}
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
                  </svg>

                  {/* Compass watermark */}
                  <div className="absolute top-4 left-4 p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2 text-[10px] text-slate-400 backdrop-blur-md">
                    <Compass className="w-4 h-4 text-indigo-400" />
                    <span>Academic & Research North Quadrangle</span>
                  </div>

                  {/* Hotspots */}
                  {studentFilteredLocations.map((loc) => {
                    const isSelected = studentSelectedLoc?.id === loc.id;
                    return (
                      <div
                        key={loc.id}
                        style={{ top: loc.top, left: loc.left }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer"
                        onClick={() => {
                          setStudentSelectedLoc(loc);
                          setStudentWalkingRoute(null);
                        }}
                      >
                        <span
                          className={`absolute -inset-2 rounded-full opacity-75 animate-ping pointer-events-none ${
                            isSelected ? 'bg-indigo-400 scale-125' : 'bg-slate-400 opacity-20'
                          }`}
                        />
                        <div
                          className={`relative w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs shadow-xl transition-all duration-300 transform group-hover:scale-110 ${
                            isSelected
                              ? 'bg-gradient-to-tr from-indigo-500 to-purple-600 text-white ring-4 ring-indigo-400/40 scale-110'
                              : 'bg-slate-900 text-white border border-slate-700 hover:border-indigo-400'
                          }`}
                        >
                          <Building2 className="w-4 h-4" />
                        </div>

                        <div
                          className={`absolute top-11 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap shadow-xl backdrop-blur-md pointer-events-none transition-all ${
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
                /* Virtual Video Tour Embedded */
                <div className="relative flex-1 w-full h-[460px] bg-black flex flex-col justify-between">
                  <iframe
                    src={studentSelectedLoc.videoTour}
                    title={studentSelectedLoc.name}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                  <div className="p-3 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
                    <span className="flex items-center gap-1.5 text-indigo-400 font-bold">
                      <Video className="w-4 h-4" /> 360° View: {studentSelectedLoc.name}
                    </span>
                    <button
                      onClick={() => setStudentMapViewMode('map')}
                      className="px-3 py-1 rounded-lg bg-indigo-600 text-white font-bold text-xs"
                    >
                      Back to Map
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right 4 cols: Selected Landmark Details Panel */}
            <div className="lg:col-span-4 glass-card rounded-3xl p-5 sm:p-6 border shadow-sm space-y-4 flex flex-col justify-between">
              {studentSelectedLoc ? (
                <div className="space-y-4">
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 shadow-md">
                    <img
                      src={studentSelectedLoc.image}
                      alt={studentSelectedLoc.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600 text-white shadow-md">
                      {studentSelectedLoc.code}
                    </span>
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="text-[10px] uppercase font-bold text-indigo-300 tracking-wider block">
                        {studentSelectedLoc.category}
                      </span>
                      <h4 className="text-base font-extrabold text-white line-clamp-1">
                        {studentSelectedLoc.name}
                      </h4>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                        Floors & Wings
                      </span>
                      <p className="font-bold text-slate-900 dark:text-white mt-0.5">
                        {studentSelectedLoc.floors}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                        Live Occupancy
                      </span>
                      <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {studentSelectedLoc.occupancy}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Overview
                    </h5>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                      {studentSelectedLoc.description}
                    </p>
                  </div>

                  <div>
                    <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Facilities
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {studentSelectedLoc.facilities.map((fac, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 rounded-lg text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                        >
                          ✓ {fac}
                        </span>
                      ))}
                    </div>
                  </div>

                  {studentWalkingRoute && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-1 animate-in fade-in">
                      <div className="flex items-center justify-between font-bold text-emerald-600 dark:text-emerald-400">
                        <span className="flex items-center gap-1">
                          <Navigation className="w-3.5 h-3.5" /> Route from Hostel
                        </span>
                        <span>{studentWalkingRoute.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300">
                        {studentWalkingRoute.from} → {studentSelectedLoc.name} ({studentWalkingRoute.distance})
                      </p>
                    </div>
                  )}

                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => setStudentMapViewMode('virtualTour')}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/25 transition-all"
                    >
                      <Video className="w-4 h-4" />
                      Step Inside (360° Virtual Tour)
                    </button>
                    <button
                      onClick={() => handleStudentCalcRoute(studentSelectedLoc)}
                      className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all"
                    >
                      <Navigation className="w-3.5 h-3.5 text-emerald-500" />
                      Directions from Nilgiri Hostel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 text-xs">
                  <MapPin className="w-8 h-8 opacity-40 mb-2" />
                  Select any building on the map to inspect details.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modals Container */}
      {activeClassroomModal && (
        <ClassroomModal
          course={activeClassroomModal}
          onClose={() => setActiveClassroomModal(null)}
        />
      )}

      {activeQuizModal && (
        <QuizModal
          quizId={activeQuizModal}
          onClose={() => setActiveQuizModal(null)}
        />
      )}

      {activeAssignmentId && (
        <AssignmentModal
          assignmentId={activeAssignmentId}
          onClose={() => setActiveAssignmentId(null)}
        />
      )}

      {activeGradeSheetModal && (
        <GradeSheetModal onClose={() => setActiveGradeSheetModal(false)} />
      )}

      {activeFeeReceiptModal && (
        <FeeReceiptModal
          fee={activeFeeReceiptModal}
          student={studentProfile}
          onClose={() => setActiveFeeReceiptModal(null)}
        />
      )}

      {activeEventPassModal && (
        <EventPassModal
          event={activeEventPassModal}
          student={studentProfile}
          onClose={() => setActiveEventPassModal(null)}
        />
      )}

      {activeFilmModal && (
        <FilmPlayerModal
          film={activeFilmModal}
          onClose={() => setActiveFilmModal(null)}
        />
      )}
    </div>
  );
}
