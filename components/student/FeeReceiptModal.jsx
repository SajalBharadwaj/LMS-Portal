'use client';

import React from 'react';
import {
  X,
  Printer,
  CheckCircle2,
  Building2,
  Receipt,
  Download,
  ShieldCheck,
} from 'lucide-react';

export default function FeeReceiptModal({ fee, student, onClose }) {
  if (!fee) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 print:hidden">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            Official Electronic Fee Receipt Generated
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Challan
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div className="p-6 sm:p-8 space-y-6 text-slate-900 dark:text-slate-100">
          {/* Header */}
          <div className="text-center border-b border-slate-200 dark:border-slate-800 pb-5">
            <h2 className="text-lg sm:text-xl font-extrabold uppercase tracking-tight">
              Apex Institute of Technology & Research
            </h2>
            <p className="text-xs text-slate-500">
              Central Accounts Directorate • Student Fee Receipt Challan
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-2 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5" /> PAYMENT STATUS: SETTLED & VERIFIED
            </div>
          </div>

          {/* Receipt Details Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-slate-500 block">Transaction Reference ID</span>
              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                {fee.transactionId || 'TXN-APX-849201-2026'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Payment Date & Time</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {fee.paidOn
                  ? new Date(fee.paidOn).toLocaleString()
                  : new Date().toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Student Name & Roll No</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {student.name} ({student.rollNo})
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Payment Instrument</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {fee.paymentMode || 'Instant Net Banking'}
              </span>
            </div>
          </div>

          {/* Fee Itemization Table */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 uppercase tracking-wider font-bold">
                <tr>
                  <th className="px-4 py-2.5">Fee Head Description</th>
                  <th className="px-4 py-2.5 text-right">Amount (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {fee.breakdown?.map((b, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-2.5 text-slate-700 dark:text-slate-300 font-medium">
                      {b.item}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono font-semibold">
                      ₹ {b.cost.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 dark:bg-slate-800/60 font-bold border-t border-slate-200 dark:border-slate-800">
                <tr>
                  <td className="px-4 py-3 text-slate-900 dark:text-white">
                    Total Amount Received
                  </td>
                  <td className="px-4 py-3 text-right text-base text-emerald-600 dark:text-emerald-400 font-mono">
                    ₹ {fee.amount.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Stamp & Footer Note */}
          <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-200 dark:border-slate-800 pt-4">
            <div>
              <p>Computer-generated digital receipt.</p>
              <p>Authorized by Finance Officer & Registrar.</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400">
                Accounts Directorate Stamp
              </span>
              <div className="font-serif text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                [Apex University Accounts]
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
