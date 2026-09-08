'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  INITIAL_STUDENT,
  INITIAL_FACULTY,
  INITIAL_ADMIN,
  INITIAL_TIMETABLE,
  INITIAL_FEES,
  INITIAL_EVENTS,
  INITIAL_ROSTER,
  INITIAL_COURSES,
  INITIAL_ASSIGNMENTS,
  INITIAL_QUIZZES,
  INITIAL_NOTICES,
  INITIAL_CAMPUS_FILMS,
} from '../data/mockData';

const LMSContext = createContext(null);

export function LMSProvider({ children }) {
  // Theme State: 'dark' | 'light'
  const [theme, setTheme] = useState('dark');

  // Active Role: 'student' | 'faculty' | 'admin'
  const [activeRole, setActiveRole] = useState('student');

  // Core Data States
  const [studentProfile, setStudentProfile] = useState(INITIAL_STUDENT);
  const [facultyProfile, setFacultyProfile] = useState(INITIAL_FACULTY);
  const [adminProfile, setAdminProfile] = useState(INITIAL_ADMIN);
  const [timetable] = useState(INITIAL_TIMETABLE);
  const [fees, setFees] = useState(INITIAL_FEES);
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [campusFilms, setCampusFilms] = useState(INITIAL_CAMPUS_FILMS);
  const [facultyRoster, setFacultyRoster] = useState(INITIAL_ROSTER);
  const [courses, setCourses] = useState(INITIAL_COURSES);
  const [assignments, setAssignments] = useState(INITIAL_ASSIGNMENTS);
  const [quizzes, setQuizzes] = useState(INITIAL_QUIZZES);
  const [quizResults, setQuizResults] = useState({});
  const [notices, setNotices] = useState(INITIAL_NOTICES);

  // Active Modals
  const [activeGradeSheetModal, setActiveGradeSheetModal] = useState(false);
  const [activeFeeReceiptModal, setActiveFeeReceiptModal] = useState(null); // fee object
  const [activeEventPassModal, setActiveEventPassModal] = useState(null); // event object
  const [activeFilmModal, setActiveFilmModal] = useState(null); // film object
  const [activeClassroomModal, setActiveClassroomModal] = useState(null); // course object
  const [activeQuizModal, setActiveQuizModal] = useState(null); // quizId string
  const [activeNoticeModal, setActiveNoticeModal] = useState(false);
  const [showCampusTourModal, setShowCampusTourModal] = useState(false);
  const [campusTourInitialLoc, setCampusTourInitialLoc] = useState(null);
  const [campusTourInitialMode, setCampusTourInitialMode] = useState('map'); // 'map' | 'virtualTour'

  const openCampusTour = (locationId = null, viewMode = 'map') => {
    setCampusTourInitialLoc(locationId);
    setCampusTourInitialMode(viewMode);
    setShowCampusTourModal(true);
  };

  const closeCampusTour = () => {
    setShowCampusTourModal(false);
    setCampusTourInitialLoc(null);
    setCampusTourInitialMode('map');
  };

  // Toast System
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // 1. Safe Hydration from LocalStorage
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('lms_theme');
      if (savedTheme) setTheme(savedTheme);

      const savedRole = localStorage.getItem('lms_role');
      if (savedRole && ['student', 'faculty', 'admin'].includes(savedRole)) {
        setActiveRole(savedRole);
      }

      const savedStudent = localStorage.getItem('lms_student');
      if (savedStudent) setStudentProfile(JSON.parse(savedStudent));

      const savedFees = localStorage.getItem('lms_fees');
      if (savedFees) setFees(JSON.parse(savedFees));

      const savedEvents = localStorage.getItem('lms_events');
      if (savedEvents) setEvents(JSON.parse(savedEvents));

      const savedRoster = localStorage.getItem('lms_roster');
      if (savedRoster) setFacultyRoster(JSON.parse(savedRoster));

      const savedCourses = localStorage.getItem('lms_courses');
      if (savedCourses) setCourses(JSON.parse(savedCourses));

      const savedAssignments = localStorage.getItem('lms_assignments');
      if (savedAssignments) setAssignments(JSON.parse(savedAssignments));

      const savedQuizResults = localStorage.getItem('lms_quiz_results');
      if (savedQuizResults) setQuizResults(JSON.parse(savedQuizResults));

      const savedNotices = localStorage.getItem('lms_notices');
      if (savedNotices) setNotices(JSON.parse(savedNotices));
    } catch (e) {
      console.error('LocalStorage load error:', e);
    }
  }, []);

  // 2. Synchronize Dark Mode Class
  useEffect(() => {
    try {
      const root = document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      localStorage.setItem('lms_theme', theme);
    } catch (e) {
      console.error(e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleSetRole = (role) => {
    setActiveRole(role);
    try {
      localStorage.setItem('lms_role', role);
      addToast(`Role changed to ${role.toUpperCase()}`, 'info');
    } catch (e) {}
  };

  // Fee Payment Action
  const payFee = (feeId, paymentMode = 'Instant UPI / NetBanking') => {
    const txnId = `TXN-APX-${Math.floor(100000 + Math.random() * 900000)}-2026`;
    const now = new Date().toISOString();

    let updatedFeeItem = null;

    setFees((prev) => {
      const updated = prev.map((f) => {
        if (f.id === feeId) {
          updatedFeeItem = {
            ...f,
            status: 'Paid',
            paidOn: now,
            transactionId: txnId,
            paymentMode,
          };
          return updatedFeeItem;
        }
        return f;
      });
      try {
        localStorage.setItem('lms_fees', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    // Update Admin fee collection stats
    setAdminProfile((prev) => {
      const feeItem = fees.find((f) => f.id === feeId);
      const addedAmount = feeItem ? feeItem.amount : 0;
      return {
        ...prev,
        totalFeeCollected: prev.totalFeeCollected + addedAmount,
      };
    });

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#6366f1', '#f59e0b'],
      });
    } catch (e) {}

    addToast(`Payment of ₹${fees.find((f) => f.id === feeId)?.amount.toLocaleString()} successful! Digital receipt generated.`, 'success');

    if (updatedFeeItem) {
      setActiveFeeReceiptModal(updatedFeeItem);
    }
  };

  // Campus Club Event Registration
  const registerEvent = (eventId) => {
    const passCode = `PASS-${eventId.toUpperCase().replace('EVT-', '')}-${Math.floor(1000 + Math.random() * 9000)}`;

    let updatedEvent = null;

    setEvents((prev) => {
      const updated = prev.map((ev) => {
        if (ev.id === eventId) {
          updatedEvent = { ...ev, registered: true, passId: passCode };
          return updatedEvent;
        }
        return ev;
      });
      try {
        localStorage.setItem('lms_events', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    addToast(`Successfully registered! Event pass: ${passCode}`, 'success');
    if (updatedEvent) {
      setActiveEventPassModal(updatedEvent);
    }
  };

  // Faculty Attendance Marking for Section CSE-A
  const toggleStudentAttendance = (studentId) => {
    setFacultyRoster((prev) => {
      const updated = prev.map((s) => {
        if (s.id === studentId) {
          const isPresent = s.status === 'Present';
          const newStatus = isPresent ? 'Absent' : 'Present';
          const newCount = isPresent ? s.attendanceCount - 1 : s.attendanceCount + 1;
          return {
            ...s,
            status: newStatus,
            attendanceCount: Math.max(0, newCount),
          };
        }
        return s;
      });
      try {
        localStorage.setItem('lms_roster', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    // If toggled student is Aarav Sharma (std-1), also synchronize Aarav's CS-401 attendance
    if (studentId === 'std-1') {
      setStudentProfile((prev) => {
        const currentCS401 = prev.subjectAttendance.find((sub) => sub.code === 'CS-401');
        if (!currentCS401) return prev;

        const updatedSubs = prev.subjectAttendance.map((sub) => {
          if (sub.code === 'CS-401') {
            const isCurrentlyPresent = sub.attended >= 32;
            const newAttended = isCurrentlyPresent ? sub.attended - 1 : sub.attended + 1;
            const percentage = Number(((newAttended / sub.total) * 100).toFixed(1));
            return {
              ...sub,
              attended: newAttended,
              percentage,
            };
          }
          return sub;
        });

        // Recalculate overall attendance
        const totalAttendedAll = updatedSubs.reduce((acc, curr) => acc + curr.attended, 0);
        const totalConductedAll = updatedSubs.reduce((acc, curr) => acc + curr.total, 0);
        const overallAttendance = Number(((totalAttendedAll / totalConductedAll) * 100).toFixed(1));

        const updatedStudent = {
          ...prev,
          subjectAttendance: updatedSubs,
          overallAttendance,
        };

        try {
          localStorage.setItem('lms_student', JSON.stringify(updatedStudent));
        } catch (e) {}

        return updatedStudent;
      });
    }

    addToast('Attendance register record updated in real time.', 'info');
  };

  // Course Classroom Actions
  const enrollCourse = (courseId) => {
    setCourses((prev) => {
      const updated = prev.map((c) => {
        if (c.id === courseId) return { ...c, enrolled: true, progress: 0 };
        return c;
      });
      try {
        localStorage.setItem('lms_courses', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    addToast('Course successfully added to academic curriculum!', 'success');
  };

  const toggleLessonComplete = (courseId, lessonId) => {
    setCourses((prev) => {
      const updated = prev.map((c) => {
        if (c.id === courseId) {
          const updatedLessons = c.lessons.map((l) => {
            if (l.id === lessonId) return { ...l, completed: !l.completed };
            return l;
          });
          const completedCount = updatedLessons.filter((l) => l.completed).length;
          const progress = Math.round((completedCount / updatedLessons.length) * 100);
          return { ...c, lessons: updatedLessons, progress };
        }
        return c;
      });
      try {
        localStorage.setItem('lms_courses', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Assignment Submissions & Faculty Grading
  const submitAssignment = (assignmentId, { repoUrl, notes }) => {
    setAssignments((prev) => {
      const updated = prev.map((a) => {
        if (a.id === assignmentId) {
          return {
            ...a,
            status: 'Submitted',
            submission: {
              repoUrl,
              notes,
              submittedAt: new Date().toISOString(),
              studentName: studentProfile.name,
              rollNo: studentProfile.rollNo,
            },
          };
        }
        return a;
      });
      try {
        localStorage.setItem('lms_assignments', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    addToast('Assignment submitted successfully! Pending faculty review.', 'success');
  };

  const gradeAssignment = (assignmentId, { score, feedback }) => {
    setAssignments((prev) => {
      const updated = prev.map((a) => {
        if (a.id === assignmentId) {
          return {
            ...a,
            status: 'Graded',
            earnedScore: Number(score),
            instructorFeedback: feedback,
            gradedAt: new Date().toISOString(),
            gradedBy: facultyProfile.name,
          };
        }
        return a;
      });
      try {
        localStorage.setItem('lms_assignments', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    addToast(`Grade (${score}/100) published to student gradebook!`, 'success');
  };

  // Update student marks (Faculty Marks Entry)
  const updateStudentMarks = (courseCode, internalMarks) => {
    setStudentProfile((prev) => {
      const updatedMarksheet = prev.marksheetData.map((item) => {
        if (item.code === courseCode) {
          const total = Number(internalMarks) + item.external;
          const grade = total >= 90 ? 'O' : total >= 80 ? 'A+' : total >= 70 ? 'A' : 'B+';
          const gradePoint = total >= 90 ? 10 : total >= 80 ? 9 : total >= 70 ? 8 : 7;
          return {
            ...item,
            internal: Number(internalMarks),
            total,
            grade,
            gradePoint,
          };
        }
        return item;
      });
      const updated = { ...prev, marksheetData: updatedMarksheet };
      try {
        localStorage.setItem('lms_student', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    addToast(`Internal marks for ${courseCode} updated to ${internalMarks}/40`, 'success');
  };

  // Quizzes & Confetti
  const recordQuizResult = (quizId, resultData) => {
    setQuizResults((prev) => {
      const updated = {
        ...prev,
        [quizId]: {
          ...resultData,
          completedAt: new Date().toISOString(),
        },
      };
      try {
        localStorage.setItem('lms_quiz_results', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Admin Broadcast Circular
  const broadcastNotice = (newNotice) => {
    const noticeObj = {
      id: `not-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      publishedBy: `${adminProfile.name} (${adminProfile.title})`,
      ...newNotice,
    };
    setNotices((prev) => {
      const updated = [noticeObj, ...prev];
      try {
        localStorage.setItem('lms_notices', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    addToast(`Campus Circular published: "${newNotice.title.substring(0, 32)}..."`, 'success');
  };

  // Active Current User
  const currentUser =
    activeRole === 'student'
      ? studentProfile
      : activeRole === 'faculty'
      ? facultyProfile
      : adminProfile;

  return (
    <LMSContext.Provider
      value={{
        theme,
        toggleTheme,
        activeRole,
        setActiveRole: handleSetRole,
        currentUser,
        studentProfile,
        facultyProfile,
        adminProfile,
        timetable,
        fees,
        payFee,
        events,
        registerEvent,
        campusFilms,
        setCampusFilms,
        facultyRoster,
        toggleStudentAttendance,
        courses,
        enrollCourse,
        toggleLessonComplete,
        assignments,
        submitAssignment,
        gradeAssignment,
        updateStudentMarks,
        quizzes,
        quizResults,
        recordQuizResult,
        notices,
        broadcastNotice,
        // Modals
        activeGradeSheetModal,
        setActiveGradeSheetModal,
        activeFeeReceiptModal,
        setActiveFeeReceiptModal,
        activeEventPassModal,
        setActiveEventPassModal,
        activeFilmModal,
        setActiveFilmModal,
        activeClassroomModal,
        setActiveClassroomModal,
        activeQuizModal,
        setActiveQuizModal,
        activeNoticeModal,
        setActiveNoticeModal,
        showCampusTourModal,
        setShowCampusTourModal,
        campusTourInitialLoc,
        campusTourInitialMode,
        openCampusTour,
        closeCampusTour,
        // Toasts
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </LMSContext.Provider>
  );
}

export function useLMS() {
  const context = useContext(LMSContext);
  if (!context) {
    throw new Error('useLMS must be used within an LMSProvider');
  }
  return context;
}
