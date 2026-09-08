'use client';

import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import {
  X,
  PlayCircle,
  CheckCircle2,
  Circle,
  FileText,
  Download,
  Award,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  MessageSquare,
} from 'lucide-react';

export default function ClassroomModal({ course, onClose }) {
  const { toggleLessonComplete, courses } = useLMS();

  // Find updated course state
  const liveCourse = courses.find((c) => c.id === course.id) || course;
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('notes'); // 'notes' | 'resources' | 'discussion'

  const currentLesson = liveCourse.lessons[selectedLessonIndex] || liveCourse.lessons[0];

  const handleToggleCurrent = () => {
    if (currentLesson) {
      toggleLessonComplete(liveCourse.id, currentLesson.id);
    }
  };

  const handleNext = () => {
    if (selectedLessonIndex < liveCourse.lessons.length - 1) {
      setSelectedLessonIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (selectedLessonIndex > 0) {
      setSelectedLessonIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl max-h-[92vh] flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              {liveCourse.code}
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white line-clamp-1">
                {liveCourse.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Instructor: {liveCourse.instructor} • Progress: {liveCourse.progress}%
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - 2 Columns (Player on Left, Playlist on Right) */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 min-h-0">
          {/* Main Video & Content Area (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 overflow-y-auto">
            {/* Video Player Container */}
            <div className="relative aspect-video w-full bg-black">
              {currentLesson?.videoUrl ? (
                <iframe
                  src={currentLesson.videoUrl}
                  title={currentLesson.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <PlayCircle className="w-12 h-12 mb-2 opacity-50" />
                  <p className="text-sm">Video Stream Ready</p>
                </div>
              )}
            </div>

            {/* Lesson Control Bar */}
            <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex-1 min-w-[200px]">
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  Lesson {selectedLessonIndex + 1} of {liveCourse.lessons.length}
                </span>
                <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {currentLesson?.title}
                </h4>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleToggleCurrent}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    currentLesson?.completed
                      ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20'
                  }`}
                >
                  {currentLesson?.completed ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Completed
                    </>
                  ) : (
                    <>
                      <Circle className="w-4 h-4" />
                      Mark Completed
                    </>
                  )}
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={handlePrev}
                    disabled={selectedLessonIndex === 0}
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Previous Lesson"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={selectedLessonIndex === liveCourse.lessons.length - 1}
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Next Lesson"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content Tabs (Notes, Resources) */}
            <div className="p-4 sm:p-6 flex-1 bg-white dark:bg-slate-900">
              <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 mb-4">
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`pb-3 text-sm font-semibold border-b-2 transition-all ${
                    activeTab === 'notes'
                      ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                  }`}
                >
                  Lecture Summary & Transcripts
                </button>
                <button
                  onClick={() => setActiveTab('resources')}
                  className={`pb-3 text-sm font-semibold border-b-2 transition-all ${
                    activeTab === 'resources'
                      ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                  }`}
                >
                  Downloadable Materials ({currentLesson?.resources?.length || 0})
                </button>
              </div>

              {activeTab === 'notes' && (
                <div className="prose dark:prose-invert max-w-none text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-3">
                  <p>{currentLesson?.summary}</p>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
                    <h5 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-indigo-500" />
                      Key Takeaways for End-Sem Exam
                    </h5>
                    <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600 dark:text-slate-400">
                      <li>Understand formal mathematical specifications and correctness proofs.</li>
                      <li>Review algorithmic invariants, leader election timeouts, and log commit indexes.</li>
                      <li>Compare trade-offs between linearizable consistency and partition tolerance.</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'resources' && (
                <div className="space-y-3">
                  {currentLesson?.resources?.map((res, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/40 hover:border-indigo-500/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-indigo-500" />
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-200">
                            {res}
                          </p>
                          <span className="text-[11px] text-slate-500">
                            PDF Document • Official College Course Material
                          </span>
                        </div>
                      </div>
                      <a
                        href="#download"
                        onClick={(e) => {
                          e.preventDefault();
                          alert(`Downloading ${res}...`);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Curriculum Playlist Sidebar (4 Cols) */}
          <div className="lg:col-span-4 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Course Curriculum
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {liveCourse.lessons.filter((l) => l.completed).length} /{' '}
                  {liveCourse.lessons.length} Modules Completed ({liveCourse.progress}%)
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center font-bold text-xs text-indigo-600 dark:text-indigo-400">
                {liveCourse.progress}%
              </div>
            </div>

            {/* Lessons List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {liveCourse.lessons.map((lesson, idx) => {
                const isCurrent = idx === selectedLessonIndex;
                return (
                  <button
                    key={lesson.id}
                    onClick={() => setSelectedLessonIndex(idx)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 ${
                      isCurrent
                        ? 'bg-white dark:bg-indigo-950/40 border-indigo-500 shadow-sm'
                        : 'bg-white/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800/80 hover:bg-white dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="mt-0.5">
                      {lesson.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Circle
                          className={`w-4 h-4 ${
                            isCurrent
                              ? 'text-indigo-600 dark:text-indigo-400'
                              : 'text-slate-400'
                          }`}
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs font-medium line-clamp-2 ${
                          isCurrent
                            ? 'text-indigo-600 dark:text-indigo-300 font-semibold'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {lesson.title}
                      </p>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
                        <PlayCircle className="w-3 h-3" />
                        {lesson.duration}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Course Completion Badge */}
            {liveCourse.progress === 100 && (
              <div className="m-3 p-3 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 flex items-center gap-3">
                <Award className="w-7 h-7 text-amber-500 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-amber-700 dark:text-amber-400">
                    Course Fully Completed!
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Verified course credentials recorded for semester grade sheet.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
