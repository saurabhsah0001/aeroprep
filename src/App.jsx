import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Compass, 
  CloudRain, 
  Radio, 
  BookOpen, 
  Wrench, 
  CheckCircle2, 
  XCircle, 
  Lock, 
  Smartphone, 
  Laptop, 
  LogOut, 
  PlusCircle, 
  Trash2, 
  QrCode, 
  Copy, 
  Check, 
  AlertTriangle,
  ArrowRight,
  HelpCircle,
  FileText
} from 'lucide-react';

// --- INITIAL QUESTION BANK (5 SECTIONS) ---
const INITIAL_QUESTIONS = {
  regulations: [
    {
      id: "reg-1",
      question: "According to DGCA regulations, what is the minimum lateral separation required outside controlled airspace under VFR?",
      options: [
        "500 ft from any person, vessel, vehicle or structure",
        "1000 ft above the highest obstacle within 8 km",
        "2000 ft horizontally from clouds",
        "1500 m horizontal and 1000 ft vertical from clouds"
      ],
      correct: 3,
      explanation: "In Class G (uncontrolled) airspace above 3000 ft AMSL or 1000 ft above terrain, standard VFR cloud clearance requires 1,500 m horizontal separation and 1,000 ft vertical clearance."
    },
    {
      id: "reg-2",
      question: "When two aircraft are converging at approximately the same level, which aircraft has the right of way?",
      options: [
        "The aircraft on the left",
        "The aircraft that is larger",
        "The aircraft that has the other on its right shall give way",
        "The aircraft flying at higher indicated airspeed"
      ],
      correct: 2,
      explanation: "ICAO / DGCA Rules of the Air dictate that an aircraft which has another aircraft on its right must give way and avoid crossing ahead."
    }
  ],
  meteorology: [
    {
      id: "met-1",
      question: "Which type of fog is formed by radiational cooling of the ground at night under clear skies and calm or light wind?",
      options: [
        "Advection fog",
        "Radiation fog",
        "Frontal fog",
        "Upslope fog"
      ],
      correct: 1,
      explanation: "Radiation fog occurs overnight when terrestrial radiation cools the Earth's surface below the dewpoint under light wind (2-5 kts) and clear skies."
    },
    {
      id: "met-2",
      question: "In the Northern Hemisphere, according to Buys Ballot's Law, if an observer stands with their back to the wind, where is the low pressure?",
      options: [
        "Directly ahead",
        "To the left and slightly forward",
        "To the right",
        "Directly behind"
      ],
      correct: 1,
      explanation: "Buys Ballot's Law states that in the Northern Hemisphere, when standing with your back to the wind, low pressure lies to your left (slightly forward due to surface friction)."
    }
  ],
  navigation: [
    {
      id: "nav-1",
      question: "Using the 1-in-60 rule: After flying 60 NM, an aircraft is 3 NM off track. What is the track error angle (TE)?",
      options: [
        "1 degree",
        "3 degrees",
        "6 degrees",
        "1.5 degrees"
      ],
      correct: 1,
      explanation: "Track Error (deg) = (Distance Off Track * 60) / Distance Flown = (3 * 60) / 60 = 3°."
    },
    {
      id: "nav-2",
      question: "Departure along a parallel of latitude between two meridians is calculated as:",
      options: [
        "Change of Longitude (minutes) × cos(Latitude)",
        "Change of Latitude (minutes) × sin(Longitude)",
        "Change of Longitude (minutes) × tan(Latitude)",
        "Change of Latitude × 60 NM"
      ],
      correct: 0,
      explanation: "Departure (in NM) = Ch.Long (in minutes) × cos(Lat)."
    }
  ],
  rtr: [
    {
      id: "rtr-1",
      question: "Which of the following urgency signals must be repeated three times on the VHF frequency during RTR communications?",
      options: [
        "MAYDAY",
        "PAN PAN",
        "SECURITE",
        "EMERGENCY"
      ],
      correct: 1,
      explanation: "The aeronautical urgency signal is PAN PAN (spoken three times). MAYDAY is reserved for distress."
    },
    {
      id: "rtr-2",
      question: "What is the transponder squawk code allocated internationally for complete communications failure (two-way radio loss)?",
      options: [
        "Squawk 7500",
        "Squawk 7600",
        "Squawk 7700",
        "Squawk 7000"
      ],
      correct: 1,
      explanation: "7500 indicates unlawful interference (hijack), 7600 indicates lost radio comms, and 7700 indicates general emergency."
    }
  ],
  tech_general: [
    {
      id: "tech-1",
      question: "What is the primary purpose of vortex generators installed along the upper wing surface of modern transport aircraft?",
      options: [
        "Increase wing tip vortex strength",
        "Delay boundary layer separation at high angles of attack",
        "Reduce induced drag during high-speed cruise",
        "Prevent fuel vaporization inside wet wings"
      ],
      correct: 1,
      explanation: "Vortex generators re-energize the boundary layer by drawing high-energy airflow into the lower boundary region, postponing airflow separation and stall."
    },
    {
      id: "tech-2",
      question: "In a reciprocating aviation engine, detonation is most commonly caused by:",
      options: [
        "Using fuel with an octane rating higher than specified",
        "Extremely rich fuel-air mixtures at low cylinder temperatures",
        "Excessive cylinder head temperature and low fuel octane grade",
        "Rapid cooling during high-speed descents"
      ],
      correct: 2,
      explanation: "Detonation is the uncontrolled, explosive combustion of the remaining fuel-air charge, triggered by excessive heat, high manifold pressure, or substandard octane fuel."
    }
  ]
};

export default function App() {
  // Navigation & Subject State
  const [activeSubject, setActiveSubject] = useState('regulations');
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Custom Question Store (Persistent in LocalStorage)
  const [questions, setQuestions] = useState(() => {
    const saved = localStorage.getItem('aeroprep_questions');
    return saved ? JSON.parse(saved) : INITIAL_QUESTIONS;
  });

  // User State
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubscribed, setIsSubscribed] = useState(() => {
    return localStorage.getItem('aeroprep_subscribed') === 'true';
  });

  // Admin / Teacher Hub State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);
  const [adminPassInput, setAdminPassInput] = useState('');
  const [adminError, setAdminError] = useState('');
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);

  // Question Upload Mode: 'plain' or 'json'
  const [uploadMode, setUploadMode] = useState('plain');
  const [plainTextInput, setPlainTextInput] = useState('');
  const [jsonInput, setJsonInput] = useState('');
  const [importStatus, setImportStatus] = useState('');

  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [utrInput, setUtrInput] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Single Device Enforcement Demo State
  const [currentSessionId] = useState(() => 'SES-' + Math.random().toString(36).substring(2, 9).toUpperCase());
  const [activeSessionInDb, setActiveSessionInDb] = useState(currentSessionId);
  const [sessionLocked, setSessionLocked] = useState(false);

  // Replace with your actual UPI ID
  const instructorUpiId = "pilotprep@oksbi"; 

  // Save questions when updated
  useEffect(() => {
    localStorage.setItem('aeroprep_questions', JSON.stringify(questions));
  }, [questions]);

  // Monitor single device login status
  useEffect(() => {
    if (activeSessionInDb !== currentSessionId) {
      setSessionLocked(true);
    }
  }, [activeSessionInDb, currentSessionId]);

  const subjectsList = [
    { id: 'regulations', title: 'Air Regulations', icon: ShieldCheck, count: questions.regulations?.length || 0 },
    { id: 'meteorology', title: 'Aviation Meteorology', icon: CloudRain, count: questions.meteorology?.length || 0 },
    { id: 'navigation', title: 'Air Navigation', icon: Compass, count: questions.navigation?.length || 0 },
    { id: 'rtr', title: 'RTR (Aero)', icon: Radio, count: questions.rtr?.length || 0 },
    { id: 'tech_general', title: 'Technical General', icon: Wrench, count: questions.tech_general?.length || 0 },
  ];

  const currentQuestions = questions[activeSubject] || [];
  const currentQ = currentQuestions[currentIndex];

  const handleSelectAnswer = (optionIndex) => {
    if (!isSubscribed && currentIndex >= 1) {
      setShowPaymentModal(true);
      return;
    }
    setUserAnswers({
      ...userAnswers,
      [`${activeSubject}-${currentIndex}`]: optionIndex
    });
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPassInput === 'PILOTADMIN2026') {
      setIsAdminLoggedIn(true);
      setShowAdminLoginModal(false);
      setShowAdminDashboard(true);
      setAdminPassInput('');
      setAdminError('');
    } else {
      setAdminError('Invalid access key. Please verify credentials.');
    }
  };

  // Parse plain text questions
  const handlePlainTextImport = () => {
    setImportStatus('');
    try {
      const blocks = plainTextInput.trim().split(/\n\s*\n/);
      const parsed = [];
      const letterToIdx = { A: 0, B: 1, C: 2, D: 3 };

      blocks.forEach((block, idx) => {
        const qMatch = block.match(/Q:\s*(.+)/i);
        const aMatch = block.match(/A\)\s*(.+)/i);
        const bMatch = block.match(/B\)\s*(.+)/i);
        const cMatch = block.match(/C\)\s*(.+)/i);
        const dMatch = block.match(/D\)\s*(.+)/i);
        const ansMatch = block.match(/Answer:\s*([A-D])/i);
        const expMatch = block.match(/Explanation:\s*(.+)/i);

        if (qMatch && aMatch && bMatch && cMatch && dMatch && ansMatch) {
          parsed.push({
            id: `${activeSubject}-${Date.now()}-${idx}`,
            question: qMatch[1].trim(),
            options: [
              aMatch[1].trim(),
              bMatch[1].trim(),
              cMatch[1].trim(),
              dMatch[1].trim()
            ],
            correct: letterToIdx[ansMatch[1].toUpperCase()],
            explanation: expMatch ? expMatch[1].trim() : 'Official DGCA PYQ standard syllabus answer.'
          });
        }
      });

      if (parsed.length === 0) {
        setImportStatus('Could not parse any questions. Check formatting.');
        return;
      }

      setQuestions(prev => ({
        ...prev,
        [activeSubject]: [...(prev[activeSubject] || []), ...parsed]
      }));
      setPlainTextInput('');
      setImportStatus(`Successfully imported ${parsed.length} questions into ${activeSubject.toUpperCase()}!`);
    } catch {
      setImportStatus('Failed to parse text. Please check the structure.');
    }
  };

  // Parse bulk JSON questions
  const handleJsonImport = () => {
    setImportStatus('');
    try {
      const parsed = JSON.parse(jsonInput);
      if (!Array.isArray(parsed)) {
        setImportStatus('JSON must be an array of questions: [ { ... } ]');
        return;
      }
      setQuestions(prev => ({
        ...prev,
        [activeSubject]: [...(prev[activeSubject] || []), ...parsed]
      }));
      setJsonInput('');
      setImportStatus(`Successfully added ${parsed.length} questions into ${activeSubject.toUpperCase()}!`);
    } catch {
      setImportStatus('Invalid JSON syntax. Ensure quotes and commas are correct.');
    }
  };

  const handleSimulateNewLogin = () => {
    setActiveSessionInDb('SES-' + Math.random().toString(36).substring(2, 9).toUpperCase());
  };

  const handleReauthorizeSession = () => {
    setActiveSessionInDb(currentSessionId);
    setSessionLocked(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      
      {/* --- TOP BRAND HEADER --- */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center font-black text-white text-xl tracking-tighter shadow-lg shadow-cyan-500/20">
              ✈
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg text-white tracking-wide">AEROPREP</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">DGCA</span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">You will pass only by doing PYQs</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {!isSubscribed ? (
              <button 
                onClick={() => setShowPaymentModal(true)}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-md bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold transition-all shadow-md shadow-orange-500/20"
              >
                Unlock All (₹300/mo)
              </button>
            ) : (
              <span className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Subscription Active</span>
              </span>
            )}

            {isAdminLoggedIn && (
              <button
                onClick={() => setShowAdminDashboard(!showAdminDashboard)}
                className="px-3 py-1.5 text-xs font-semibold rounded-md bg-slate-800 text-cyan-400 border border-cyan-500/30 hover:bg-slate-700"
              >
                {showAdminDashboard ? 'Close Admin' : 'Instructor Hub'}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* --- BANNER TAGLINE --- */}
      <div className="bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-slate-950 border-b border-slate-800/80 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-slate-300">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="font-medium text-slate-200">
              Master the Past Papers. Clear DGCA in First Attempt.
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-4 text-slate-400">
            <span>Single-Device Protection Active</span>
            <span className="text-slate-600">•</span>
            <span>Monthly Subscription: ₹300</span>
          </div>
        </div>
      </div>

      {/* --- SUBJECT NAVIGATION TABS (5 SECTIONS) --- */}
      <nav className="bg-slate-900 border-b border-slate-800 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 flex space-x-2 py-2">
          {subjectsList.map((subject) => {
            const Icon = subject.icon;
            const isActive = activeSubject === subject.id;
            return (
              <button
                key={subject.id}
                onClick={() => {
                  setActiveSubject(subject.id);
                  setCurrentIndex(0);
                }}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive 
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{subject.title}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  isActive ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'
                }`}>
                  {subject.count}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* --- MAIN INTERFACE --- */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* LEFT / CENTER: QUESTION VIEWER */}
        <div className="lg:col-span-3 space-y-5">
          {currentQ ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-7 shadow-xl relative overflow-hidden">
              
              {/* Question Meta Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                    {subjectsList.find(s => s.id === activeSubject)?.title}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs text-slate-400 font-mono">
                    PYQ #{currentIndex + 1} of {currentQuestions.length}
                  </span>
                </div>
                {!isSubscribed && currentIndex >= 1 && (
                  <span className="flex items-center space-x-1 text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    <Lock className="w-3 h-3" />
                    <span>Locked</span>
                  </span>
                )}
              </div>

              {/* Question Prompt */}
              <h2 className="text-base sm:text-lg font-medium text-slate-100 leading-relaxed mb-6">
                {currentQ.question}
              </h2>

              {/* Multiple Choice Options */}
              <div className="space-y-3">
                {currentQ.options.map((option, idx) => {
                  const qKey = `${activeSubject}-${currentIndex}`;
                  const answeredIdx = userAnswers[qKey];
                  const hasAnswered = answeredIdx !== undefined;
                  const isSelected = answeredIdx === idx;
                  const isCorrectAnswer = idx === currentQ.correct;

                  let optionStyle = "border-slate-800 bg-slate-800/40 hover:bg-slate-800 hover:border-slate-700 text-slate-300";

                  if (hasAnswered) {
                    if (isCorrectAnswer) {
                      // Correct selection -> Always Emerald Green
                      optionStyle = "border-emerald-500 bg-emerald-950/40 text-emerald-200 font-medium";
                    } else if (isSelected && !isCorrectAnswer) {
                      // Wrong selection -> Crimson Red
                      optionStyle = "border-red-500 bg-red-950/40 text-red-200";
                    } else {
                      optionStyle = "border-slate-800/40 bg-slate-900/40 text-slate-500 opacity-60";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectAnswer(idx)}
                      disabled={hasAnswered}
                      className={`w-full text-left p-4 rounded-lg border transition-all flex items-start space-x-3.5 ${optionStyle}`}
                    >
                      <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold border shrink-0 mt-0.5 ${
                        hasAnswered && isCorrectAnswer
                          ? 'border-emerald-500 bg-emerald-500 text-slate-950'
                          : hasAnswered && isSelected && !isCorrectAnswer
                          ? 'border-red-500 bg-red-500 text-white'
                          : 'border-slate-700 bg-slate-900 text-slate-400'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-sm flex-1">{option}</span>
                      {hasAnswered && isCorrectAnswer && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      )}
                      {hasAnswered && isSelected && !isCorrectAnswer && (
                        <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Box (Visible after answering) */}
              {userAnswers[`${activeSubject}-${currentIndex}`] !== undefined && (
                <div className="mt-6 p-4 rounded-lg bg-slate-800/60 border border-slate-700/60">
                  <div className="flex items-center space-x-2 text-cyan-400 mb-1.5 text-xs font-bold tracking-wide uppercase">
                    <BookOpen className="w-4 h-4" />
                    <span>Aviation Syllabus Rationale</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-normal">
                    {currentQ.explanation}
                  </p>
                </div>
              )}

              {/* Pagination Controls */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-800 mt-6">
                <button
                  onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                  className="px-4 py-2 rounded text-xs font-medium border border-slate-700 text-slate-300 disabled:opacity-40 disabled:hover:bg-transparent hover:bg-slate-800"
                >
                  Previous
                </button>
                <button
                  onClick={() => {
                    if (!isSubscribed && currentIndex >= 1) {
                      setShowPaymentModal(true);
                      return;
                    }
                    setCurrentIndex(prev => Math.min(currentQuestions.length - 1, prev + 1));
                  }}
                  disabled={currentIndex === currentQuestions.length - 1}
                  className="px-5 py-2 rounded text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white disabled:opacity-40"
                >
                  Next Question
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-400">
              <BookOpen className="w-12 h-12 mx-auto text-slate-600 mb-3" />
              <p className="text-base font-semibold text-slate-300">No questions available in this section yet.</p>
              <p className="text-xs text-slate-500 mt-1">Upload questions via the Instructor Hub.</p>
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR: QUESTION PALETTE & SESSION MONITOR */}
        <div className="space-y-5">
          
          {/* Question Grid Navigator */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
              Question Navigator
            </h3>
            <div className="grid grid-cols-5 gap-2 max-h-56 overflow-y-auto pr-1">
              {currentQuestions.map((_, idx) => {
                const isAnswered = userAnswers[`${activeSubject}-${idx}`] !== undefined;
                const isCurrent = currentIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (!isSubscribed && idx >= 2) {
                        setShowPaymentModal(true);
                        return;
                      }
                      setCurrentIndex(idx);
                    }}
                    className={`h-8 rounded text-xs font-mono font-medium border transition-all ${
                      isCurrent
                        ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 font-bold'
                        : isAnswered
                        ? 'border-emerald-600/50 bg-emerald-950/30 text-emerald-300'
                        : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Single Session Device Guardian Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-300 font-semibold border-b border-slate-800 pb-2">
              <span className="flex items-center space-x-1.5">
                <Laptop className="w-3.5 h-3.5 text-cyan-400" />
                <span>Device Integrity Check</span>
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                1 Device
              </span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Accounts are locked to a single device session. Logging in from another browser or mobile automatically disconnects earlier sessions.
            </p>
            <div className="pt-2">
              <button
                onClick={handleSimulateNewLogin}
                className="w-full text-center py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] border border-slate-700 flex items-center justify-center space-x-1"
              >
                <Smartphone className="w-3 h-3 text-amber-400" />
                <span>Simulate Concurrent Login</span>
              </button>
            </div>
          </div>

          {/* Pricing Card */}
          <div className="bg-gradient-to-b from-cyan-950/20 to-slate-900 border border-cyan-900/40 rounded-xl p-4 text-xs space-y-2.5">
            <span className="text-cyan-400 font-bold tracking-wide uppercase text-[10px]">CPL / ATPL PYQ Access</span>
            <div className="text-xl font-black text-white">₹300 <span className="text-xs font-normal text-slate-400">/ month</span></div>
            <p className="text-[11px] text-slate-400">
              Unlimited access to all 5 DGCA subject banks, explanations, and latest question sets.
            </p>
            {!isSubscribed && (
              <button
                onClick={() => setShowPaymentModal(true)}
                className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded text-xs shadow-md shadow-cyan-600/20"
              >
                Subscribe Now
              </button>
            )}
          </div>

        </div>
      </main>

      {/* --- INSTRUCTOR HUB / ADMIN DASHBOARD (PROTECTED) --- */}
      {isAdminLoggedIn && showAdminDashboard && (
        <section className="bg-slate-900 border-t-2 border-cyan-500 p-6 max-w-7xl mx-auto w-full my-6 rounded-xl shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-800 mb-6 gap-3">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <span>Instructor Management Console</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">Verified</span>
              </h2>
              <p className="text-xs text-slate-400">Upload questions, modify syllabus sections, and manage access parameters.</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setUploadMode('plain')}
                className={`px-3 py-1.5 rounded text-xs font-semibold ${
                  uploadMode === 'plain' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                Plain Text Parser
              </button>
              <button
                onClick={() => setUploadMode('json')}
                className={`px-3 py-1.5 rounded text-xs font-semibold ${
                  uploadMode === 'json' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                Bulk JSON Import
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Uploader Input Column */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">
                  Target Subject for Questions:
                </label>
                <select
                  value={activeSubject}
                  onChange={(e) => setActiveSubject(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-white text-xs rounded px-2.5 py-1"
                >
                  <option value="regulations">Air Regulations</option>
                  <option value="meteorology">Aviation Meteorology</option>
                  <option value="navigation">Air Navigation</option>
                  <option value="rtr">RTR (Aero)</option>
                  <option value="tech_general">Technical General</option>
                </select>
              </div>

              {uploadMode === 'plain' ? (
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                    <span>Paste questions using this standard format:</span>
                    <button 
                      onClick={() => setPlainTextInput(`Q: What is standard sea level pressure in hectopascals?\nA) 1000 hPa\nB) 1013.25 hPa\nC) 29.92 hPa\nD) 1025.5 hPa\nAnswer: B\nExplanation: Standard mean sea level pressure is 1013.25 hPa or 29.92 inHg.`)}
                      className="text-cyan-400 hover:underline"
                    >
                      Fill Example Template
                    </button>
                  </div>
                  <textarea
                    rows={10}
                    value={plainTextInput}
                    onChange={(e) => setPlainTextInput(e.target.value)}
                    placeholder={`Q: Question text?\nA) First option\nB) Second option\nC) Third option\nD) Fourth option\nAnswer: B\nExplanation: Why B is correct.\n\nQ: Next question...`}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    onClick={handlePlainTextImport}
                    className="mt-2.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded shadow-md"
                  >
                    Convert & Add Questions
                  </button>
                </div>
              ) : (
                <div>
                  <textarea
                    rows={10}
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    placeholder={`[\n  {\n    "id": "nav-101",\n    "question": "Sample question text?",\n    "options": ["A", "B", "C", "D"],\n    "correct": 1,\n    "explanation": "Rationale here."\n  }\n]`}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    onClick={handleJsonImport}
                    className="mt-2.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded shadow-md"
                  >
                    Import JSON Array
                  </button>
                </div>
              )}

              {importStatus && (
                <div className="p-3 bg-slate-800/80 border border-slate-700 rounded text-xs text-cyan-300">
                  {importStatus}
                </div>
              )}
            </div>

            {/* Quick Actions / Reset Column */}
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-4 text-xs">
              <h4 className="font-bold text-white uppercase text-[11px] tracking-wider border-b border-slate-800 pb-2">
                Section Controls ({activeSubject})
              </h4>
              <p className="text-slate-400">
                Currently loaded: <span className="text-cyan-400 font-bold">{questions[activeSubject]?.length || 0}</span> questions.
              </p>
              <button
                onClick={() => {
                  if (confirm(`Clear all questions in ${activeSubject.toUpperCase()}?`)) {
                    setQuestions(prev => ({ ...prev, [activeSubject]: [] }));
                  }
                }}
                className="w-full py-2 bg-red-950/40 border border-red-800/60 hover:bg-red-900/60 text-red-300 rounded text-xs font-semibold flex items-center justify-center space-x-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete All in this Section</span>
              </button>

              <button
                onClick={() => {
                  setQuestions(INITIAL_QUESTIONS);
                  localStorage.removeItem('aeroprep_questions');
                  alert('Reset to original default syllabus questions.');
                }}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs"
              >
                Restore Default Questions
              </button>
            </div>

          </div>
        </section>
      )}

      {/* --- FOOTER --- */}
      <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-500 text-xs py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 AeroPrep DGCA • Professional Ground School Exam Series</p>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowAdminLoginModal(true)}
              className="text-slate-600 hover:text-slate-400 transition-colors"
            >
              Staff / Instructor Portal
            </button>
          </div>
        </div>
      </footer>

      {/* --- MODAL 1: TEACHER ACCESS MODAL --- */}
      {showAdminLoginModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-sm w-full space-y-4">
            <h3 className="text-sm font-bold text-white">Instructor Authentication</h3>
            <p className="text-xs text-slate-400">Enter teacher master key to access question management.</p>
            <form onSubmit={handleAdminLogin} className="space-y-3">
              <input
                type="password"
                placeholder="Enter Passkey"
                value={adminPassInput}
                onChange={(e) => setAdminPassInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
              {adminError && <p className="text-xs text-red-400">{adminError}</p>}
              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdminLoginModal(false)}
                  className="w-1/2 py-2 rounded text-xs border border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 rounded text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white"
                >
                  Authenticate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: DIRECT PAYMENT MODAL (₹300/MONTH) --- */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 max-w-md w-full space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">Unlock All DGCA PYQ Portals</h3>
                <p className="text-xs text-slate-400">Direct instant enrollment • ₹300/month</p>
              </div>
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="text-slate-500 hover:text-slate-300 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* QR Code Graphic Box */}
            <div className="flex flex-col items-center justify-center p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
              <div className="p-3 bg-white rounded-xl shadow-lg">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=upi://pay?pa=${instructorUpiId}&pn=AeroPrep%20DGCA&am=300&cu=INR`} 
                  alt="UPI QR Code" 
                  className="w-36 h-36"
                />
              </div>
              <span className="text-[11px] text-slate-400 font-medium">Scan using GPay, PhonePe, Paytm, or BHIM</span>
            </div>

            {/* UPI ID Copy Bar */}
            <div className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-lg">
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Pay via UPI VPA</div>
                <div className="text-xs font-mono font-bold text-cyan-400">{instructorUpiId}</div>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(instructorUpiId);
                  setCopiedUpi(true);
                  setTimeout(() => setCopiedUpi(false), 2000);
                }}
                className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center space-x-1"
              >
                {copiedUpi ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Transaction Reference Submit */}
            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-medium">
                Enter 12-Digit UPI UTR / Transaction ID after payment:
              </label>
              <input
                type="text"
                placeholder="e.g. 412356789012"
                value={utrInput}
                onChange={(e) => setUtrInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <button
              onClick={() => {
                if (utrInput.trim().length >= 8) {
                  setIsSubscribed(true);
                  localStorage.setItem('aeroprep_subscribed', 'true');
                  setShowPaymentModal(false);
                  alert('Payment confirmed! All 5 subjects are now unlocked.');
                } else {
                  alert('Please enter a valid 12-digit UPI UTR reference.');
                }
              }}
              className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-extrabold rounded-lg text-xs tracking-wide shadow-lg shadow-emerald-900/30"
            >
              Verify & Activate Subscription
            </button>
          </div>
        </div>
      )}

      {/* --- MODAL 3: SINGLE DEVICE LOGOUT OVERLAY --- */}
      {sessionLocked && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-red-500/40 rounded-2xl p-6 sm:p-7 max-w-sm w-full text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Logged In on Another Device</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your account was accessed from another phone or computer. DGCA exam subscriptions permit one active device at a time.
            </p>
            <button
              onClick={handleReauthorizeSession}
              className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold"
            >
              Use on This Device
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
