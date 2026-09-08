'use client';

import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import {
  Briefcase,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCode,
  Github,
  Award,
  ExternalLink,
  MessageSquare,
  Sparkles,
  BookOpen,
  Filter,
  Check,
  X,
} from 'lucide-react';

export default function InstructorView() {
  const { facultyProfile, assignments, gradeAssignment, courses } = useLMS();

  const [selectedFilter, setSelectedFilter] = useState('all'); // 'all' | 'needs-grading' | 'graded'
  const [activeGradingModal, setActiveGradingModal] = useState(null); // assignment object
  const [scoreInput, setScoreInput] = useState('');
  const [feedbackInput, setFeedbackInput] = useState('');

  // Submissions submitted or graded
  const actionableAssignments = assignments.filter((a) => a.submission !== null);

  const filteredAssignments = actionableAssignments.filter((a) => {
    if (selectedFilter === 'needs-grading') return a.status === 'Submitted';
    if (selectedFilter === 'graded') return a.status === 'Graded';
    return true;
  });

  const pendingCount = assignments.filter((a) => a.status === 'Submitted').length;
  const gradedCount = assignments.filter((a) => a.status === 'Graded').length;

  const handleOpenGrading = (asg) => {
    setActiveGradingModal(asg);
    setScoreInput(asg.earnedScore !== null ? String(asg.earnedScore) : '');
    setFeedbackInput(asg.instructorFeedback || '');
  };

  const handleSubmitGrade = (e) => {
    e.preventDefault();
    if (!scoreInput || isNaN(scoreInput) || Number(scoreInput) < 0 || Number(scoreInput) > 100) {
      alert('Please enter a valid numeric score between 0 and 100.');
      return;
    }
    if (!feedbackInput.trim()) {
      alert('Please provide constructive remarks/feedback for the student.');
      return;
    }

    gradeAssignment(activeGradingModal.id, {
      score: scoreInput,
      feedback: feedbackInput,
    });
    setActiveGradingModal(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
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
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Faculty Portal
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {facultyProfile.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                {facultyProfile.title} • {facultyProfile.department}
              </p>
              <p className="text-xs text-slate-400">{facultyProfile.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-right">
              <span className="text-xs text-slate-400 block">Pending Reviews</span>
              <span className="text-2xl font-black text-amber-400">{pendingCount}</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-right">
              <span className="text-xs text-slate-400 block">Evaluated Tasks</span>
              <span className="text-2xl font-black text-emerald-400">{gradedCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="glass-card rounded-2xl p-5 border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Enrolled Students
            </span>
            <Users className="w-5 h-5 text-indigo-500" />
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">
            {facultyProfile.totalStudentsMentored}
          </p>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1 inline-block">
            Across B.Tech CSE & M.Tech Systems
          </span>
        </div>

        <div className="glass-card rounded-2xl p-5 border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Assigned Courses
            </span>
            <BookOpen className="w-5 h-5 text-indigo-500" />
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">
            {facultyProfile.coursesTaught.length}
          </p>
          <span className="text-xs text-slate-500 mt-1 inline-block">
            {facultyProfile.coursesTaught.join(', ')}
          </span>
        </div>

        <div className="glass-card rounded-2xl p-5 border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Average Submission Score
            </span>
            <Award className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">96.0%</p>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1 inline-block">
            +4.2% higher than department benchmark
          </span>
        </div>
      </div>

      {/* Assignment Evaluation Desk */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileCode className="w-5 h-5 text-indigo-500" />
              Faculty Evaluation & Grading Desk
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Inspect submitted code repositories, verify automated test results, assign marks, and publish live feedback.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedFilter === 'all'
                  ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              All Submissions ({actionableAssignments.length})
            </button>
            <button
              onClick={() => setSelectedFilter('needs-grading')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedFilter === 'needs-grading'
                  ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Needs Grading ({pendingCount})
            </button>
            <button
              onClick={() => setSelectedFilter('graded')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedFilter === 'graded'
                  ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Evaluated ({gradedCount})
            </button>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="glass-card rounded-2xl border shadow-sm overflow-hidden">
          {filteredAssignments.length > 0 ? (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredAssignments.map((asg) => {
                const sub = asg.submission;
                const isGraded = asg.status === 'Graded';
                return (
                  <div
                    key={asg.id}
                    className="p-5 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                          {asg.courseCode}
                        </span>
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">
                          {asg.title}
                        </span>
                        {isGraded ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                            <CheckCircle2 className="w-3 h-3" /> Graded: {asg.earnedScore}/
                            {asg.points}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400">
                            <Clock className="w-3 h-3" /> Awaiting Marks
                          </span>
                        )}
                      </div>

                      {/* Student Info & Repo */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                        <span>
                          Student:{' '}
                          <strong className="text-slate-800 dark:text-slate-200">
                            {sub.studentName} ({sub.rollNo})
                          </strong>
                        </span>
                        <span>•</span>
                        <span>
                          Submitted:{' '}
                          {new Date(sub.submittedAt).toLocaleString(undefined, {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}
                        </span>
                      </div>

                      {/* Repo URL link */}
                      {sub.repoUrl && (
                        <div className="flex items-center gap-2 pt-1">
                          <a
                            href={sub.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 transition-colors border border-slate-200 dark:border-slate-700"
                          >
                            <Github className="w-3.5 h-3.5" />
                            {sub.repoUrl}
                            <ExternalLink className="w-3 h-3 opacity-60" />
                          </a>
                        </div>
                      )}

                      {/* Student Notes */}
                      {sub.notes && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                          " {sub.notes} "
                        </p>
                      )}

                      {/* Instructor Published Feedback if already graded */}
                      {isGraded && asg.instructorFeedback && (
                        <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300">
                          <strong className="block mb-0.5 text-emerald-900 dark:text-emerald-200">
                            Your Published Feedback:
                          </strong>
                          {asg.instructorFeedback}
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="shrink-0">
                      <button
                        onClick={() => handleOpenGrading(asg)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                          isGraded
                            ? 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20'
                        }`}
                      >
                        {isGraded ? 'Update Marks / Feedback' : 'Grade Submission'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 text-sm">
              No submissions found under this filter.
            </div>
          )}
        </div>
      </section>

      {/* Courses Managed by Faculty */}
      <section className="space-y-4">
        <div className="pb-2 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-500" />
            Curriculum Modules Under Your Supervision
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Active courses taught in Autumn 2026.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses
            .filter((c) => facultyProfile.coursesTaught.includes(c.code))
            .map((c) => (
              <div
                key={c.id}
                className="glass-card rounded-2xl p-5 border shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded text-xs font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    {c.code}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {c.credits} Credits • {c.lessons.length} Modules
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {c.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                  {c.description}
                </p>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <span>Class Cohort: 68 Enrolled</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    Avg Attendance: 84.8%
                  </span>
                </div>
              </div>
            ))}
        </div>
      </section>

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

            <form onSubmit={handleSubmitGrade} className="p-6 space-y-4">
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
                  Faculty Constructive Feedback & Comments *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide technical feedback, code review remarks, and concurrency safety points..."
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
