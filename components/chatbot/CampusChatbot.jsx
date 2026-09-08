'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLMS } from '../../context/LMSContext';
import {
  Bot,
  MessageSquare,
  X,
  Send,
  Sparkles,
  User,
  Trash2,
  Minimize2,
  Maximize2,
  ChevronDown,
  HelpCircle,
  Clock,
  Calendar,
  AlertTriangle,
  Award,
  CreditCard,
  BookOpen,
} from 'lucide-react';

export default function CampusChatbot() {
  const {
    activeRole,
    studentProfile,
    facultyProfile,
    adminProfile,
    courses,
    timetable,
    fees,
    events,
    notices,
    openCampusTour,
  } = useLMS();

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Initial welcome message tailored to the current role
  const getInitialMessage = () => {
    if (activeRole === 'student') {
      return `Hello ${studentProfile.name}! 👋 I am **Apex AI**, your 24/7 Academic Copilot. 

I can help you check your **attendance shortfalls**, review **semester marks**, explain **syllabus concepts (like Raft or Kubernetes)**, guide you on **fee payments**, or check your **today's timetable**. 

How can I assist you right now?`;
    } else if (activeRole === 'faculty') {
      return `Welcome, ${facultyProfile.name}! 👨‍🏫 I am your **Faculty Teaching Assistant AI**. 

I can help you review **pending assignment submissions**, organize your **lecture schedule**, or assist with **grading guidelines**. What would you like to review?`;
    } else {
      return `Welcome, ${adminProfile.name}! 🏛️ I am the **Campus Administrative Assistant AI**. 

I can provide instant summaries on **fee collections**, **campus circulars**, or **student attendance compliance across departments**. How can I help you?`;
    }
  };

  const [messages, setMessages] = useState([
    {
      id: 'msg-welcome',
      sender: 'bot',
      text: getInitialMessage(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  // Update welcome message when role changes
  useEffect(() => {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'bot',
        text: getInitialMessage(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, [activeRole]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen, isMinimized]);

  // Role-specific suggested prompts
  const getSuggestedQuestions = () => {
    if (activeRole === 'student') {
      return [
        'Explore 3D Campus Map & Hostels',
        'Check CS-305 Attendance Shortfall',
        'When is my next lecture today?',
        'How much examination fee is pending?',
        'Explain Raft Consensus Algorithm',
        'Tell me about HackApex 2026 hackathon',
      ];
    } else if (activeRole === 'faculty') {
      return [
        'How many assignments are pending review?',
        'Show my supervised courses',
        'Explore Campus 3D Map & Lecture Theaters',
      ];
    } else {
      return [
        'Campus Facilities & Live Occupancy',
        'What is the total fee collected so far?',
        'Show latest campus circulars',
      ];
    }
  };

  // Intelligent Context-Aware Response Engine
  const generateBotResponse = (query) => {
    const q = query.toLowerCase();

    // 1. Attendance Queries
    if (q.includes('attendance') || q.includes('shortfall') || q.includes('detention') || q.includes('cs-305')) {
      const cs305 = studentProfile.subjectAttendance.find((s) => s.code === 'CS-305');
      return `📊 **Attendance Summary for ${studentProfile.name}**:

• **Overall Aggregate Attendance**: **${studentProfile.overallAttendance}%** (Safe threshold is 75%).
• **Subject Status**:
  - CS-401 (Distributed Systems): **88.9%** (Safe)
  - CS-408 (DevSecOps): **83.3%** (Safe)
  - AI-402 (Deep Learning): **84.4%** (Safe)
  - ⚠️ **CS-305 (Database Internals)**: **${cs305?.percentage || 67.9}%** (Attended ${cs305?.attended || 19}/${cs305?.total || 28} classes).

⚠️ **Detention Alert**: In **CS-305**, you currently have a shortfall. You must attend **at least 4 consecutive upcoming classes** without absence to reach the mandatory 75% cutoff for university exam hall ticket issuance!`;
    }

    // 2. Timetable & Next Lecture
    if (q.includes('timetable') || q.includes('schedule') || q.includes('lecture') || q.includes('class') || q.includes('today')) {
      const mondaySchedule = timetable['Monday'];
      const liveLecture = mondaySchedule.find((s) => s.isLive);
      return `📅 **Today's Schedule (Monday)**:

${liveLecture ? `🔴 **Happening Now**: **${liveLecture.code}: ${liveLecture.subject}** (${liveLecture.time}) in **${liveLecture.room}** with ${liveLecture.faculty}.\n` : ''}
• **09:00 - 10:00 AM**: CS-401 (Distributed Systems) - LHC-201
• **10:00 - 11:00 AM**: CS-408 (DevSecOps CI/CD) - LHC-201
• **11:15 - 12:15 PM**: AI-402 (Deep Learning) - LHC-104
• **01:00 - 02:00 PM**: Lunch Break (Cafeteria)
• **02:00 - 04:00 PM**: CS-401L (Distributed Systems Lab) - Advanced Systems Lab-2

You can switch days in the **Lecture Timetable tab** anytime!`;
    }

    // 3. Fee & Accounts Queries
    if (q.includes('fee') || q.includes('challan') || q.includes('receipt') || q.includes('dues') || q.includes('pay') || q.includes('pending')) {
      const pendingFees = fees.filter((f) => f.status === 'Pending');
      const pendingTotal = pendingFees.reduce((acc, f) => acc + f.amount, 0);

      if (pendingFees.length === 0) {
        return `✅ **Fee Status**: All your 7th semester fees are **100% paid and cleared**! You can view and print your digitally stamped fee receipts in the **Fees & Accounts tab**.`;
      }

      return `💳 **College Fee & Accounts Ledger**:

• **Tuition Fee (₹85,000)**: ✅ Paid (Txn: TXN-APX-982341-2026)
• **Hostel/Mess Dues (₹42,000)**: ✅ Paid (Txn: TXN-APX-812749-2026)
• **Pending Dues (${pendingFees.length} Items)**:
${pendingFees.map((f) => `  - **${f.title}**: ₹${f.amount.toLocaleString()} (Due: ${new Date(f.dueDate).toLocaleDateString()})`).join('\n')}

💰 **Total Outstanding**: **₹ ${pendingTotal.toLocaleString()}**
You can click **"Pay Online"** in the **Fees & Accounts tab** to pay via UPI/NetBanking and immediately download your official digital receipt challan!`;
    }

    // 4. Marks, Results, CGPA & Grade Sheet
    if (q.includes('marks') || q.includes('cgpa') || q.includes('sgpa') || q.includes('result') || q.includes('grade') || q.includes('marksheet')) {
      return `🏆 **Academic Performance & Results**:

• **Cumulative CGPA**: **${studentProfile.cgpa} / 10.0** (Top 4% Distinction)
• **Earned Credits**: **${studentProfile.earnedCredits} / ${studentProfile.totalCredits}**
• **Semester SGPA History**:
  - Sem 1: 8.65 | Sem 2: 8.78 | Sem 3: 8.92
  - Sem 4: 8.80 | Sem 5: 9.05 | Sem 6: 8.86 | Sem 7: 8.84 (Ongoing)

• **Subject Breakdown Sample**:
  - CS-401: Internal 38/40 + External 54/60 = **92/100 (Grade: O, Points: 10)**
  - CS-408: Internal 36/40 + External 51/60 = **87/100 (Grade: A+, Points: 9)**
  - AI-402: Internal 37/40 + External 53/60 = **90/100 (Grade: O, Points: 10)**

Click **"View & Print Official Marksheet"** in the Results tab to print the university-certified grade sheet!`;
    }

    // 5. Technical Concept Explanations (Raft, Paxos, DevSecOps, Kafka, Docker)
    if (q.includes('raft') || q.includes('consensus') || q.includes('paxos')) {
      return `💡 **Raft Consensus Algorithm (CS-401 Concept Breakdown)**:

Raft is a distributed consensus algorithm designed for state machine replication across a cluster of nodes:

1. **Node States**: Each server exists in one of three states:
   - **Follower**: Passive; receives heartbeats from the leader.
   - **Candidate**: If heartbeats time out, increments term and requests votes.
   - **Leader**: Handles client requests, replicates log entries, and sends heartbeats.

2. **Split-Vote Prevention**: Uses **randomized election timeouts** (e.g. 150-300ms) so that one node almost always triggers election first and wins majority before another times out.

3. **Log Replication**: The leader receives commands, appends them to its log, broadcasts \`appendEntries\` RPC to followers, and commits once a majority quorum acknowledges.`;
    }

    if (q.includes('hackathon') || q.includes('hackapex') || q.includes('club') || q.includes('event') || q.includes('robowars')) {
      return `🚀 **Campus Extracurriculars & Clubs**:

1. **HackApex 2026**:
   - **Type**: 36-Hour National Collegiate Hackathon
   - **Prize Pool**: ₹ 2,50,000 + Incubation Grants
   - **Dates**: October 10-12, 2026 (Apex Innovation Center)
   - **Status**: Registered! You can view your **Digital Delegate Pass** with QR code in the Clubs tab.

2. **RoboWars & Drone Racing**:
   - **Type**: 30kg Combat Robots & FPV Micro-Drones
   - **Dates**: October 24, 2026 (Sports Arena)
   - **Registration**: Open for students!

Head over to the **Clubs & Hackathons tab** to register and generate instant event entry passes!`;
    }

    if (q.includes('exam') || q.includes('circular') || q.includes('notice')) {
      return `📢 **Latest Campus Circular from Dean's Office**:

• **Subject**: Autumn 2026 End-Semester Examination Schedule
• **Key Dates**: Theory & Practical exams commence on **November 16, 2026**.
• **Requirement**: Minimum **75% aggregate attendance** is strictly enforced. Hall tickets will be released starting November 01.
• **Placements Notice**: Google & Microsoft hiring drives are scheduled for October 5-8, 2026 for students with CGPA >= 8.0.

Click the **Bell icon** in the top navbar to view the full circulars board!`;
    }

    // 6. Campus Map & 3D Online Visit
    if (
      q.includes('map') ||
      q.includes('tour') ||
      q.includes('visit') ||
      q.includes('3d') ||
      q.includes('campus') ||
      q.includes('building') ||
      q.includes('location') ||
      q.includes('directions') ||
      q.includes('kahan') ||
      q.includes('hostel') ||
      q.includes('lhc')
    ) {
      return `🗺️ **Apex University 120-Acre 3D Campus Tour & Online Map**:

Aap pure campus ko online 3D map me dekh sakte hain aur har landmark ka 360° virtual video tour le sakte hain:

📍 **Key Campus Complexes**:
1. **Administrative Directorate (ADMIN-01)**: Dean & Central Accounts Office (92 Active Staff)
2. **Lecture Hall Complex (LHC-MAIN)**: Multimedia Smart Theaters LHC 101-304 (740 Students)
3. **Dept. of CSE (ACAD-BLOCK-3)**: Systems, DevSecOps & Cloud Computing Labs
4. **Apex GPU Cluster & AI Lab (AI-LAB-04)**: NVIDIA H100 Deep Learning Server Hall
5. **Central Digital Library (LIB-CENTRAL)**: 24/7 Air-Conditioned Reading Commons
6. **Nilgiri & Aravali Hostels (RES-COMPLEX)**: 1,420 Resident Scholars
7. **University Sports Arena (SPORTS-TURF)**: FIFA Turf, Athletic Track & Gym
8. **Startup Incubation Hub (INNOV-HUB)**: Student Startups & 3D Maker Lab

✨ **Online Visit Kaise Karein?**
• Top Navbar me **"Campus 3D Tour"** button click karein.
• Student Portal ke **"Campus 3D Tour & Map"** tab me live vector map, hostel se walking time (mins), aur 360° virtual video tour stream dekhein!
• Admin View me bhi **"Campus Infrastructure & 3D Navigator"** module se live occupancy check kar sakte hain.`;
    }

    // Default Fallback
    return `I understood your query about "${query}". 

Here are the key things I can assist you with right now:
• **"Check attendance"** to see subject percentages and detention shortfall warnings.
• **"Next lecture"** to see your live timetable and classroom venue.
• **"Pending fees"** to check outstanding dues and get payment links.
• **"Results"** to view your SGPA progression and marksheet.
• **"Technical doubts"** — ask me to explain Raft, Docker, Vector Clocks, or Kubernetes!

Feel free to pick any question or type what you need!`;
  };

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage.trim();
    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate natural AI thinking delay
    setTimeout(() => {
      const botResponseText = generateBotResponse(userText);
      const botMsg = {
        id: `msg-${Date.now() + 1}`,
        sender: 'bot',
        text: botResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
    // Send automatically
    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: question,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const botResponseText = generateBotResponse(question);
      const botMsg = {
        id: `msg-${Date.now() + 1}`,
        sender: 'bot',
        text: botResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 500);
  };

  return (
    <>
      {/* Floating Chatbot Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white shadow-2xl shadow-indigo-600/40 hover:scale-105 active:scale-95 transition-all group border border-white/20"
          aria-label="Open Apex AI Campus Assistant"
        >
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md">
              <Bot className="w-5 h-5 text-white animate-bounce" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-bold leading-tight flex items-center gap-1">
              Apex AI Copilot <Sparkles className="w-3 h-3 text-amber-300" />
            </p>
            <p className="text-[10px] text-indigo-200">Academic & Campus Help</p>
          </div>
        </button>
      )}

      {/* Floating Chatbot Window */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-50 w-full sm:w-[420px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden transition-all duration-300 ${
            isMinimized ? 'h-16' : 'h-[620px] max-h-[85vh]'
          }`}
        >
          {/* Chat Window Header */}
          <div className="px-5 py-3.5 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                <Bot className="w-4 h-4 text-white" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-indigo-600" />
              </div>
              <div>
                <h3 className="text-xs font-black tracking-tight flex items-center gap-1.5">
                  Apex Academic AI <Sparkles className="w-3 h-3 text-amber-300" />
                </h3>
                <p className="text-[10px] text-indigo-200">
                  Autonomous Campus Copilot • 24/7 Live
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized((prev) => !prev)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() =>
                  setMessages([
                    {
                      id: `msg-${Date.now()}`,
                      sender: 'bot',
                      text: getInitialMessage(),
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    },
                  ])
                }
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                title="Clear Chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main Chat Body (When Not Minimized) */}
          {!isMinimized && (
            <>
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50 dark:bg-slate-950/40 text-xs">
                {messages.map((msg) => {
                  const isBot = msg.sender === 'bot';
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-2.5 ${isBot ? 'items-start' : 'items-end justify-end'}`}
                    >
                      {isBot && (
                        <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                          <Bot className="w-4 h-4" />
                        </div>
                      )}

                      <div
                        className={`max-w-[84%] p-3.5 rounded-2xl leading-relaxed ${
                          isBot
                            ? 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 shadow-sm'
                            : 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                        }`}
                      >
                        <div className="whitespace-pre-line prose-xs">{msg.text}</div>
                        <span
                          className={`text-[9px] block mt-1 text-right font-medium ${
                            isBot ? 'text-slate-400' : 'text-indigo-200'
                          }`}
                        >
                          {msg.timestamp}
                        </span>
                      </div>

                      {!isBot && (
                        <div className="w-7 h-7 rounded-lg bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-200 flex items-center justify-center shrink-0 mb-0.5">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Typing Dots Indicator */}
                {isTyping && (
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 p-2">
                    <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                      <Bot className="w-3.5 h-3.5 animate-spin" />
                    </div>
                    <div className="flex items-center gap-1 bg-white dark:bg-slate-900 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Questions Horizontal Scroll */}
              <div className="p-2 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {getSuggestedQuestions().map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickQuestion(q)}
                      className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80 hover:bg-indigo-100 whitespace-nowrap transition-colors shrink-0"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Input Field */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Ask Apex AI (e.g. Check CS-305 attendance, fee dues)..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isTyping}
                  className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white transition-all shadow-md shadow-indigo-600/20"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}
