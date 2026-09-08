'use client';

import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import {
  X,
  FileCode,
  Github,
  Calendar,
  Send,
  CheckCircle2,
  Clock,
  Award,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';

export default function AssignmentModal({ assignmentId, onClose }) {
  const { assignments, submitAssignment } = useLMS();
  const assignment = assignments.find((a) => a.id === assignmentId);

  const [repoUrl, setRepoUrl] = useState(assignment?.submission?.repoUrl || '');
  const [notes, setNotes] = useState(assignment?.submission?.notes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!assignment) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!repoUrl.trim()) {
      alert('Please provide a valid GitHub repository or project URL.');
      return;
    }
    setIsSubmitting(true);
    submitAssignment(assignment.id, { repoUrl, notes });
    setIsSubmitting(false);
    onClose();
  };

  const isGraded = assignment.status === 'Graded';
  const isSubmitted = assignment.status === 'Submitted';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  {assignment.courseCode}
                </span>
                <span className="text-xs text-slate-500">
                  Max Points: {assignment.points}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5 line-clamp-1">
                {assignment.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Due date & instructor info */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 text-xs">
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <Calendar className="w-4 h-4 text-indigo-500" />
              Due: {new Date(assignment.dueDate).toLocaleDateString()} at 11:59 PM
            </span>
            <span className="text-slate-500">
              Evaluator: <span className="font-semibold text-slate-700 dark:text-slate-300">{assignment.instructor}</span>
            </span>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Assignment Problem Statement
            </h4>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50/50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              {assignment.description}
            </p>
          </div>

          {/* Graded Feedback Box if Graded */}
          {isGraded && (
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  <Award className="w-4 h-4" /> Evaluated & Published
                </span>
                <span className="text-base font-extrabold text-emerald-700 dark:text-emerald-400">
                  Score: {assignment.earnedScore} / {assignment.points}
                </span>
              </div>
              <div className="text-xs text-slate-700 dark:text-slate-300">
                <p className="font-semibold mb-1 flex items-center gap-1 text-slate-900 dark:text-white">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-500" /> Faculty Remarks from{' '}
                  {assignment.gradedBy}:
                </p>
                <p className="italic bg-white/60 dark:bg-slate-900/60 p-3 rounded-lg border border-emerald-500/20">
                  "{assignment.instructorFeedback}"
                </p>
              </div>
            </div>
          )}

          {/* Submission Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                GitHub Repository / Project URL <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Github className="w-4 h-4" />
                </div>
                <input
                  type="url"
                  required
                  placeholder="https://github.com/your-username/assignment-repo"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  disabled={isGraded}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Implementation Notes & Testing Instructions
              </label>
              <textarea
                rows={3}
                placeholder="Detail testing steps, test coverage commands, container flags, or edge cases handled..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={isGraded}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
              />
            </div>

            {!isGraded && (
              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/25 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isSubmitted ? 'Update Submission' : 'Submit Assignment'}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
