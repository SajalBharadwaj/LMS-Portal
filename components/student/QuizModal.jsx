'use client';

import React, { useState, useEffect } from 'react';
import { useLMS } from '../../context/LMSContext';
import confetti from 'canvas-confetti';
import {
  X,
  Clock,
  Award,
  CheckCircle,
  AlertTriangle,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export default function QuizModal({ quizId, onClose }) {
  const { quizzes, recordQuizResult } = useLMS();
  const quiz = quizzes[quizId];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState((quiz?.timeLimitMinutes || 10) * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [scoreData, setScoreData] = useState(null);

  // Timer Effect
  useEffect(() => {
    if (isSubmitted || !quiz) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted, quiz]);

  if (!quiz) return null;

  const currentQ = quiz.questions[currentQuestionIndex];

  const handleSelectOption = (optionIndex) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optionIndex,
    }));
  };

  const handleSubmitQuiz = () => {
    let earnedPoints = 0;
    const pointsPerQuestion = quiz.totalPoints / quiz.questions.length;

    quiz.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        earnedPoints += pointsPerQuestion;
      }
    });

    const passed = earnedPoints >= quiz.passingScore;
    const result = {
      score: earnedPoints,
      maxScore: quiz.totalPoints,
      percentage: Math.round((earnedPoints / quiz.totalPoints) * 100),
      passed,
      selectedAnswers,
    };

    setScoreData(result);
    setIsSubmitted(true);
    recordQuizResult(quizId, result);

    if (passed) {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#a855f7', '#10b981', '#f59e0b'],
      });
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80">
          <div>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              {quiz.courseCode}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1">
              {quiz.title}
            </h3>
          </div>

          <div className="flex items-center gap-4">
            {!isSubmitted && (
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-sm font-bold ${
                  timeLeft < 120
                    ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 border border-rose-300 animate-pulse'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                }`}
              >
                <Clock className="w-4 h-4" />
                {formatTime(timeLeft)}
              </div>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 min-h-0">
          {!isSubmitted ? (
            <div className="space-y-6">
              {/* Question Navigation Bubbles */}
              <div className="flex items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-500">
                  Question {currentQuestionIndex + 1} of {quiz.questions.length} (
                  {answeredCount} answered)
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {quiz.questions.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentQuestionIndex(i)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                        currentQuestionIndex === i
                          ? 'bg-indigo-600 text-white ring-2 ring-indigo-400'
                          : selectedAnswers[i] !== undefined
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Text */}
              <div>
                <p className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white leading-relaxed">
                  {currentQ.question}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQ.options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full text-left p-4 rounded-xl border text-sm font-medium transition-all flex items-center gap-3 ${
                        isSelected
                          ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-600 dark:border-indigo-500 text-indigo-900 dark:text-indigo-200 shadow-sm'
                          : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-600 text-white'
                            : 'border-slate-300 dark:border-slate-600 text-slate-500'
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="flex-1">{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Quiz Results Screen */
            <div className="space-y-6">
              <div
                className={`p-6 rounded-2xl border text-center relative overflow-hidden ${
                  scoreData.passed
                    ? 'bg-gradient-to-b from-emerald-500/10 to-transparent border-emerald-500/30'
                    : 'bg-gradient-to-b from-rose-500/10 to-transparent border-rose-500/30'
                }`}
              >
                {scoreData.passed && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold text-xs mb-3 border border-emerald-500/20">
                    <Sparkles className="w-4 h-4" /> Assessment Passed!
                  </div>
                )}
                <h4 className="text-3xl font-black text-slate-900 dark:text-white">
                  {scoreData.score} / {scoreData.maxScore}{' '}
                  <span className="text-lg font-medium text-slate-500">
                    ({scoreData.percentage}%)
                  </span>
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  Passing threshold:{' '}
                  <span className="font-semibold">{quiz.passingScore} points</span>. Your result
                  has been officially recorded in your academic profile.
                </p>
              </div>

              {/* Detailed Answers Review */}
              <div className="space-y-4">
                <h5 className="font-bold text-slate-900 dark:text-white text-sm">
                  Detailed Answer Key & Technical Explanations
                </h5>
                {quiz.questions.map((q, idx) => {
                  const studentAns = scoreData.selectedAnswers[idx];
                  const isCorrect = studentAns === q.correctAnswer;
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border text-sm space-y-2 ${
                        isCorrect
                          ? 'border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/20'
                          : 'border-rose-500/30 bg-rose-50/40 dark:bg-rose-950/20'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          Q{idx + 1}: {q.question}
                        </span>
                        {isCorrect ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                            <CheckCircle className="w-3.5 h-3.5" /> Correct
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400">
                            <AlertTriangle className="w-3.5 h-3.5" /> Incorrect
                          </span>
                        )}
                      </div>

                      <div className="text-xs space-y-1 text-slate-600 dark:text-slate-300">
                        <p>
                          <span className="font-semibold">Your Answer:</span>{' '}
                          {studentAns !== undefined
                            ? q.options[studentAns]
                            : 'Unanswered'}
                        </p>
                        {!isCorrect && (
                          <p className="text-emerald-700 dark:text-emerald-400 font-medium">
                            <span className="font-bold">Correct Option:</span>{' '}
                            {q.options[q.correctAnswer]}
                          </p>
                        )}
                        <p className="p-2.5 rounded-lg bg-white/70 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                          💡 <span className="font-semibold">Explanation:</span>{' '}
                          {q.explanation}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-between">
          {!isSubmitted ? (
            <>
              <button
                onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              <div className="flex items-center gap-2">
                {currentQuestionIndex < quiz.questions.length - 1 ? (
                  <button
                    onClick={() =>
                      setCurrentQuestionIndex((prev) =>
                        Math.min(quiz.questions.length - 1, prev + 1)
                      )
                    }
                    className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:opacity-90"
                  >
                    Next Question <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitQuiz}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/25"
                  >
                    Submit Assessment Now
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-slate-500">
                Quiz completed. Scores synced with Faculty gradebook.
              </span>
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Done & Return to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
