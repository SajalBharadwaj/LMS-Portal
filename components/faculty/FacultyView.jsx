'use client';

import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import {
  Briefcase,
  Users,
  CalendarCheck,
  Award,
  CheckCircle2,
  XCircle,
  FileCode,
  Github,
  ExternalLink,
  MessageSquare,
  Sparkles,
  BookOpen,
  Filter,
  Check,
  X,
  Edit3,
  Compass,
} from 'lucide-react';

export default function FacultyView() {
  const {
    facultyProfile,
    facultyRoster,
    toggleStudentAttendance,
    assignments,
    gradeAssignment,
    studentProfile,
    updateStudentMarks,
    openCampusTour,
  } = useLMS();

  const [activeSubTab, setActiveSubTab] = useState('attendance');
  // 'attendance' | 'grading' | 'marks'

  // Grading Modal State
  const [activeGradingModal, setActiveGradingModal] = useState(null);
  const [scoreInput, setScoreInput] = useState('');
  const [feedbackInput, setFeedbackInput] = useState('');

  // Internal Marks Edit State
  const [editingCourse, setEditingCourse] = useState('CS-401');
  const [newInternalMarks, setNewInternalMarks] = useState('38');

  const pendingSubmissions = assignments.filter((a) => a.status === 'Submitted');
  const gradedSubmissions = assignments.filter((a) => a.status === 'Graded');

  const handleOpenGrading = (asg) => {
    setActiveGradingModal(asg);
    setScoreInput(asg.earnedScore !== null ? String(asg.earnedScore) : '');
    setFeedbackInput(asg.instructorFeedback || '');
  };

  const handleSaveGrade = (e) => {
    e.preventDefault();
    if (!scoreInput || isNaN(scoreInput) || Number(scoreInput) < 0 || Number(scoreInput) > 100) {
      alert('Please enter a valid numeric score (0 - 100).');
      return;
    }
    if (!feedbackInput.trim()) {
      alert('Please provide feedback comments.');
      return;
    }

    gradeAssignment(activeGradingModal.id, {
      score: scoreInput,
      feedback: feedbackInput,
    });
    setActiveGradingModal(null);
  };

  const handleSaveInternalMarks = (e) => {
    e.preventDefault();
    if (isNaN(newInternalMarks) || Number(newInternalMarks) < 0 || Number(newInternalMarks) > 40) {
      alert('Internal marks must be between 0 and 40.');
      return;
    }
    updateStudentMarks(editingCourse, Number(newInternalMarks));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Faculty Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-indigo-900/50">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={facultyProfile.avatar}
              alt={facultyProfile.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-indigo-500/30 shadow-lg"
            />
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Faculty Portal & Examination Desk
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                {facultyProfile.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                {facultyProfile.title} • <span className="text-amber-300 font-semibold">{facultyProfile.designation}</span>
              </p>
              <p className="text-xs text-slate-400">
                {facultyProfile.room} • {facultyProfile.email}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-right">
              <span className="text-xs text-slate-400 block">Pending Assignments</span>
              <span className="text-2xl font-black text-amber-400">
                {pendingSubmissions.length}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-right">
              <span className="text-xs text-slate-400 block">Class Cohort</span>
              <span className="text-2xl font-black text-emerald-400">
                {facultyRoster.length} Scholars
              </span>
            </div>
            <button
              onClick={() => openCampusTour()}
              className="flex items-center gap-1.5 px-3 py-3 rounded-2xl bg-indigo-600/40 hover:bg-indigo-600/60 border border-indigo-400/30 text-white text-xs font-bold transition-all shadow-md"
              title="Explore 3D Campus Map"
            >
              <Compass className="w-4 h-4 text-indigo-300 animate-spin-slow" />
              <span>Campus Map</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveSubTab('attendance')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
            activeSubTab === 'attendance'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          CS-401 Live Attendance Register
        </button>

        <button
          onClick={() => setActiveSubTab('grading')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
            activeSubTab === 'grading'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileCode className="w-4 h-4" />
          Assignment Evaluation Queue ({pendingSubmissions.length})
        </button>

        <button
          onClick={() => setActiveSubTab('marks')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
            activeSubTab === 'marks'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          Student Internal Marks Entry
        </button>
      </div>

      {/* SUB-TAB 1: LIVE ATTENDANCE REGISTER */}
      {activeSubTab === 'attendance' && (
        <div className="glass-card rounded-2xl p-6 border shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-indigo-500" />
                CS-401: Distributed Systems Attendance Register
              </h3>
              <p className="text-xs text-slate-500">
                Click on any student status button to toggle Present / Absent. Updates student dashboard immediately.
              </p>
            </div>

            <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              Session: Lecture 37 • Today, 09:00 AM
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase font-bold text-slate-500 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3">Roll No</th>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-3 py-3 text-center">Attended Classes</th>
                  <th className="px-3 py-3 text-center">Current %</th>
                  <th className="px-4 py-3 text-right">Today's Mark (One-Click Toggle)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {facultyRoster.map((student) => {
                  const percentage = ((student.attendanceCount / student.totalClasses) * 100).toFixed(1);
                  const isPresent = student.status === 'Present';
                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-4 py-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {student.rollNo}
                      </td>

                      <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                        {student.name}
                        {student.id === 'std-1' && (
                          <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                            Current User
                          </span>
                        )}
                      </td>

                      <td className="px-3 py-3 text-center font-bold text-slate-900 dark:text-white">
                        {student.attendanceCount} / {student.totalClasses}
                      </td>

                      <td className="px-3 py-3 text-center">
                        <span
                          className={`text-xs font-black ${
                            percentage < 75
                              ? 'text-rose-600 dark:text-rose-400'
                              : 'text-emerald-600 dark:text-emerald-400'
                          }`}
                        >
                          {percentage}%
                        </span>
                      </td>

                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => toggleStudentAttendance(student.id)}
                          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                            isPresent
                              ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 hover:bg-rose-100'
                              : 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800 hover:bg-emerald-100'
                          }`}
                        >
                          {isPresent ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              Present
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5 text-rose-600" />
                              Absent
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: ASSIGNMENT EVALUATION DESK */}
      {activeSubTab === 'grading' && (
        <div className="glass-card rounded-2xl p-6 border shadow-sm space-y-4">
          <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileCode className="w-5 h-5 text-indigo-500" />
              Student Assignment Evaluation Queue
            </h3>
            <p className="text-xs text-slate-500">
              Inspect submitted code repositories, verify automated test results, assign marks, and publish live feedback.
            </p>
          </div>

          <div className="space-y-3">
            {assignments
              .filter((a) => a.submission !== null)
              .map((asg) => {
                const sub = asg.submission;
                const isGraded = asg.status === 'Graded';
                return (
                  <div
                    key={asg.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                          {asg.courseCode}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {asg.title}
                        </h4>
                        {isGraded ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                            Graded: {asg.earnedScore}/{asg.points}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">
                            Needs Grading
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                        <span>
                          Student: <strong>{sub.studentName} ({sub.rollNo})</strong>
                        </span>
                        <span>•</span>
                        <span>
                          Submitted on: {new Date(sub.submittedAt).toLocaleDateString()}
                        </span>
                      </div>

                      {sub.repoUrl && (
                        <div>
                          <a
                            href={sub.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:text-indigo-600 transition-colors"
                          >
                            <Github className="w-3.5 h-3.5" />
                            {sub.repoUrl}
                            <ExternalLink className="w-3 h-3 opacity-60" />
                          </a>
                        </div>
                      )}

                      {sub.notes && (
                        <p className="text-xs italic text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                          "{sub.notes}"
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => handleOpenGrading(asg)}
                      className={`shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                        isGraded
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/25'
                      }`}
                    >
                      {isGraded ? 'Update Marks / Feedback' : 'Grade Submission'}
                    </button>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: INTERNAL MARKS ENTRY */}
      {activeSubTab === 'marks' && (
        <div className="glass-card rounded-2xl p-6 border shadow-sm space-y-6">
          <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-500" />
              Student Internal Assessment Marks Entry (Out of 40)
            </h3>
            <p className="text-xs text-slate-500">
              Direct entry of mid-term test, lab practical, and continuous assessment marks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Form */}
            <form onSubmit={handleSaveInternalMarks} className="space-y-4 p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40">
              <h4 className="text-xs font-bold uppercase text-slate-500">
                Update Internal Score for Aarav Sharma ({studentProfile.rollNo})
              </h4>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Select Course
                </label>
                <select
                  value={editingCourse}
                  onChange={(e) => {
                    setEditingCourse(e.target.value);
                    const curr = studentProfile.marksheetData.find((m) => m.code === e.target.value);
                    if (curr) setNewInternalMarks(String(curr.internal));
                  }}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                >
                  {studentProfile.marksheetData.map((m) => (
                    <option key={m.code} value={m.code}>
                      {m.code} - {m.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Internal Assessment Marks (Max 40)
                </label>
                <input
                  type="number"
                  min="0"
                  max="40"
                  required
                  value={newInternalMarks}
                  onChange={(e) => setNewInternalMarks(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white font-bold"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/25"
              >
                Save & Update Student Marksheet
              </button>
            </form>

            {/* Live Student Marksheet Preview */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase text-slate-500">
                Live Result Status for {editingCourse}
              </h4>
              {(() => {
                const currentItem = studentProfile.marksheetData.find((m) => m.code === editingCourse);
                if (!currentItem) return null;
                return (
                  <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {currentItem.name}
                    </p>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-2 rounded-lg bg-white dark:bg-slate-800">
                        <span className="text-slate-400 block text-[10px]">Internal</span>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">
                          {currentItem.internal} / 40
                        </span>
                      </div>
                      <div className="p-2 rounded-lg bg-white dark:bg-slate-800">
                        <span className="text-slate-400 block text-[10px]">End-Sem</span>
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          {currentItem.external} / 60
                        </span>
                      </div>
                      <div className="p-2 rounded-lg bg-white dark:bg-slate-800">
                        <span className="text-slate-400 block text-[10px]">Total Score</span>
                        <span className="font-black text-slate-900 dark:text-white">
                          {currentItem.total} / 100 ({currentItem.grade})
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Grading Modal */}
      {activeGradingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/70">
              <div>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  {activeGradingModal.courseCode} Evaluation
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Grade: {activeGradingModal.submission?.studentName}
                </h3>
              </div>
              <button
                onClick={() => setActiveGradingModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGrade} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Assignment Title
                </label>
                <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                  {activeGradingModal.title}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Assigned Score (0 - {activeGradingModal.points}) *
                </label>
                <input
                  type="number"
                  min="0"
                  max={activeGradingModal.points}
                  required
                  placeholder="e.g. 95"
                  value={scoreInput}
                  onChange={(e) => setScoreInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Constructive Feedback & Code Review Remarks *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide feedback on algorithm complexity, test coverage, and edge cases..."
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveGradingModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/25"
                >
                  <Check className="w-4 h-4" />
                  Publish Grade to Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
