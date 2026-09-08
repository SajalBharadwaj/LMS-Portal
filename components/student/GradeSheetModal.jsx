'use client';

import React from 'react';
import { useLMS } from '../../context/LMSContext';
import {
  X,
  Printer,
  GraduationCap,
  Award,
  CheckCircle2,
  Calendar,
  FileText,
  ShieldCheck,
} from 'lucide-react';

export default function GradeSheetModal({ onClose }) {
  const { studentProfile } = useLMS();

  const handlePrint = () => {
    window.print();
  };

  const totalCredits = studentProfile.marksheetData.reduce((acc, c) => acc + c.credits, 0);
  const totalMarks = studentProfile.marksheetData.reduce((acc, c) => acc + c.total, 0);
  const maxMarks = studentProfile.marksheetData.reduce((acc, c) => acc + c.maxMarks, 0);
  const aggregatePercentage = ((totalMarks / maxMarks) * 100).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Top Control Bar (Non-printable) */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 print:hidden">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Verified Autonomous Examination Grade Sheet • Autumn 2026
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Official Grade Card Document */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-6 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
          {/* Institutional Crest & Header */}
          <div className="text-center border-b-2 border-indigo-600 pb-6 space-y-1">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md mb-2">
              <GraduationCap className="w-8 h-8" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight uppercase">
              Apex Institute of Technology & Research
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              (Autonomous Institution Approved by AICTE & Accredited NAAC 'A++' Grade)
            </p>
            <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 pt-1 tracking-wider uppercase">
              Office of the Controller of Examinations • Grade Statement
            </p>
          </div>

          {/* Student Bio Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs">
            <div>
              <span className="text-slate-500 block">Candidate Name</span>
              <strong className="text-sm text-slate-900 dark:text-white">
                {studentProfile.name}
              </strong>
            </div>
            <div>
              <span className="text-slate-500 block">Roll Number</span>
              <strong className="text-sm font-mono text-slate-900 dark:text-white">
                {studentProfile.rollNo}
              </strong>
            </div>
            <div>
              <span className="text-slate-500 block">Registration No</span>
              <strong className="text-sm font-mono text-slate-900 dark:text-white">
                {studentProfile.registrationNo}
              </strong>
            </div>
            <div>
              <span className="text-slate-500 block">Academic Session</span>
              <strong className="text-sm text-slate-900 dark:text-white">
                {studentProfile.semester} (2026-27)
              </strong>
            </div>
            <div className="sm:col-span-2">
              <span className="text-slate-500 block">Degree & Branch</span>
              <strong className="text-slate-900 dark:text-white">
                {studentProfile.program}
              </strong>
            </div>
            <div>
              <span className="text-slate-500 block">Current CGPA</span>
              <strong className="text-sm text-emerald-600 dark:text-emerald-400">
                {studentProfile.cgpa} / 10.0
              </strong>
            </div>
            <div>
              <span className="text-slate-500 block">Result Standing</span>
              <strong className="text-sm text-emerald-600 dark:text-emerald-400">
                Passed (Distinction)
              </strong>
            </div>
          </div>

          {/* Subject Marks Table */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Subject Name</th>
                  <th className="px-3 py-3 text-center">Credits</th>
                  <th className="px-3 py-3 text-center">Internal (40)</th>
                  <th className="px-3 py-3 text-center">End-Sem (60)</th>
                  <th className="px-3 py-3 text-center">Total (100)</th>
                  <th className="px-3 py-3 text-center">Grade</th>
                  <th className="px-3 py-3 text-center">Point</th>
                  <th className="px-3 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {studentProfile.marksheetData.map((item) => (
                  <tr key={item.code} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                    <td className="px-4 py-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {item.code}
                    </td>
                    <td className="px-4 py-3 text-slate-800 dark:text-slate-200 font-semibold">
                      {item.name}
                    </td>
                    <td className="px-3 py-3 text-center">{item.credits}</td>
                    <td className="px-3 py-3 text-center text-slate-600 dark:text-slate-400">
                      {item.internal}
                    </td>
                    <td className="px-3 py-3 text-center text-slate-600 dark:text-slate-400">
                      {item.external}
                    </td>
                    <td className="px-3 py-3 text-center font-bold text-slate-900 dark:text-white">
                      {item.total}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                        {item.grade}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center font-bold">{item.gradePoint}</td>
                    <td className="px-3 py-3 text-center">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Marksheet Footer Summary & Signature Block */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <p>
                Total Semester Credits Registered: <strong>{totalCredits}</strong>
              </p>
              <p>
                Aggregate Marks: <strong>{totalMarks} / {maxMarks}</strong> ({aggregatePercentage}%)
              </p>
              <p>
                Grading Scale: <strong>O (Outstanding &ge; 90)</strong>, <strong>A+ (Excellent 80-89)</strong>,{' '}
                <strong>A (Very Good 70-79)</strong>
              </p>
            </div>

            <div className="flex items-end justify-between md:justify-end gap-10 text-center text-xs pt-4 md:pt-0">
              <div>
                <div className="h-10 border-b border-slate-300 dark:border-slate-700 w-32 mb-1 flex items-center justify-center italic text-slate-400 text-[11px]">
                  R. Verma
                </div>
                <span className="text-slate-500 font-medium">Head of Department</span>
              </div>

              <div>
                <div className="h-10 border-b border-slate-300 dark:border-slate-700 w-36 mb-1 flex items-center justify-center font-serif text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                  Dr. Meera Sen
                </div>
                <span className="text-slate-500 font-bold">Controller of Examinations</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
