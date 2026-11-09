import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Compass, 
  CloudSun, 
  BookOpen, 
  Radio, 
  Wrench,
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Upload, 
  ShieldAlert, 
  Lock, 
  Unlock, 
  CreditCard, 
  Smartphone, 
  Monitor, 
  Bookmark, 
  ChevronRight, 
  ChevronLeft, 
  BarChart3, 
  Award, 
  User, 
  LogOut, 
  PlusCircle, 
  Info,
  Check,
  FileSpreadsheet,
  HelpCircle,
  Clock,
  Sparkles,
  QrCode,
  KeyRound,
  Trash2,
  Sliders,
  Copy,
  ExternalLink,
  ShieldCheck,
  Flame,
  PlaneTakeoff
} from 'lucide-react';

// --- INITIAL EXPANDED QUESTION BANK WITH 5 SUBJECTS ---
const INITIAL_QUESTIONS = {
  regulations: [
    {
      id: 'reg-1',
      subject: 'regulations',
      question: 'According to Indian Aircraft Rules and CAR Section 9, what is the minimum flight visibility required for VFR flights in uncontrolled airspace (Class G) below 3,000 ft AMSL or 1,000 ft above terrain?',
      options: [
        '8 km with 1,000 ft vertical cloud separation',
        '5 km (or 1.5 km if operating at an IAS permitting timely sight of traffic)',
        '10 km under all daytime circumstances',
        '300 meters with special ATC VFR clearance'
      ],
      correctIndex: 1,
      explanation: 'Under DGCA VFR rules in Class G airspace below 3,000 ft AMSL / 1,000 ft AGL, minimum visibility is 5 km. However, continuous sight of the ground and 1,500 m is permissible for aircraft maneuvering at speeds giving adequate opportunity to observe other traffic.',
      source: 'DGCA CAR Sec 9 / ICAO Annex 2'
    },
    {
      id: 'reg-2',
      subject: 'regulations',
      question: 'An aircraft overtaking another aircraft in flight shall alter its heading in which direction?',
      options: [
        'Climbing immediately by at least 1,000 ft',
        'Steering to the right and keeping clear until fully past',
        'Steering to the left and maintaining altitude',
        'Passing directly underneath with 500 ft minimum clearance'
      ],
      correctIndex: 1,
      explanation: 'Under standard Rules of the Air, an overtaking aircraft must alter its heading to the right, regardless of whether it is climbing, descending, or in level flight, until completely past and clear.',
      source: 'Rules of the Air Rule 33'
    },
    {
      id: 'reg-3',
      subject: 'regulations',
      question: 'What is the minimum mandatory retention period for Cockpit Voice Recorder (CVR) and Flight Data Recorder (FDR) recordings following an incident/accident?',
      options: [
        'At least 24 hours',
        'At least 14 days or until released by the AAIB / DGCA',
        '48 hours without exception',
        '7 days provided no injury took place'
      ],
      correctIndex: 1,
      explanation: 'DGCA CAR Section 5 Series F prescribes that operators and PIC must safeguard and preserve flight recorder medium for a minimum of 14 days or until directed otherwise in writing by the Aircraft Accident Investigation Bureau (AAIB).',
      source: 'DGCA CAR Sec 5 Series F Part II'
    }
  ],
  meteorology: [
    {
      id: 'met-1',
      subject: 'meteorology',
      question: 'What is the standard ISA (ICAO Standard Atmosphere) temperature lapse rate in the troposphere up to 11,000 meters?',
      options: [
        '1.98°C per 1,000 ft (approx 6.5°C per 1,000 m)',
        '3.0°C per 1,000 ft',
        '1.5°C per 1,000 ft',
        '0.5°C per 1,000 m'
      ],
      correctIndex: 0,
      explanation: 'Standard ISA defines the mean sea level temperature as +15°C with a constant lapse rate of 6.5°C/1,000 m (1.98°C or ~2°C per 1,000 ft) up to the tropopause boundary at 11,000 meters (36,089 ft).',
      source: 'ICAO Doc 7488 / Met CPL'
    },
    {
      id: 'met-2',
      subject: 'meteorology',
      question: 'Radiation fog formation is most strongly facilitated by which atmospheric combination?',
      options: [
        'High winds exceeding 20 knots and low humidity',
        'Clear sky, high relative humidity, and light breeze (2 to 5 knots)',
        'Warm moist air rapidly advecting over freezing sea water',
        'Intense thermal heating during early afternoon'
      ],
      correctIndex: 1,
      explanation: 'Radiation fog relies on nocturnal terrestrial radiational cooling. Ideal conditions: clear nocturnal skies for cooling, high RH (near 100%), and a light wind (2–5 kt) to distribute cooling throughout a shallow boundary layer without dispersing it.',
      source: 'DGCA Meteorology 2022'
    },
    {
      id: 'met-3',
      subject: 'meteorology',
      question: 'According to Buys Ballot\'s Law, an aviator in the Northern Hemisphere facing directly into the wind will have the low pressure area:',
      options: [
        'Directly behind them',
        'To their right hand side',
        'To their left hand side',
        'Directly overhead'
      ],
      correctIndex: 1,
      explanation: 'Buys Ballot\'s Law states: In the Northern Hemisphere, with your back to the wind, low pressure is to your left. Therefore, facing into the wind, low pressure is on your right (slightly behind the right beam).',
      source: 'Aviation Meteorology PYQ'
    }
  ],
  navigation: [
    {
      id: 'nav-1',
      subject: 'navigation',
      question: 'Using the 1 in 60 rule: After flying 60 NM on track, you fix your position 4 NM to the right of track. What is your track error (TE)?',
      options: [
        '2° Left',
        '4° Right',
        '8° Right',
        '6° Left'
      ],
      correctIndex: 1,
      explanation: 'Track Error Angle (degrees) = (Distance Off Track / Distance Run) * 60. Here: (4 NM / 60 NM) * 60 = 4° Right.',
      source: 'General Nav 1 in 60'
    },
    {
      id: 'nav-2',
      subject: 'navigation',
      question: 'True Course is 085°, Magnetic Variation is 5° West, and Drift (Wind Correction Angle) is +7°. What is the Magnetic Heading?',
      options: [
        '097° M',
        '073° M',
        '087° M',
        '092° M'
      ],
      correctIndex: 0,
      explanation: 'Variation West is added to True to get Magnetic: 085° + 5°W = 090° Magnetic Track. Magnetic Track (090°) + WCA (+7°) = 097° Magnetic Heading.',
      source: 'DGCA Navigation Numerical'
    },
    {
      id: 'nav-3',
      subject: 'navigation',
      question: 'What is the departure distance along latitude 60° North between two points having a longitude difference of 10 degrees?',
      options: [
        '600 NM',
        '300 NM',
        '519 NM',
        '150 NM'
      ],
      correctIndex: 1,
      explanation: 'Departure (NM) = Change of Longitude (minutes) * Cosine(Latitude). 10 degrees = 600 minutes. Cos(60°) = 0.5. Departure = 600 * 0.5 = 300 Nautical Miles.',
      source: 'CPL Earth Nav'
    }
  ],
  rtr: [
    {
      id: 'rtr-1',
      subject: 'rtr',
      question: 'Which radiotelephony signal designates an urgency condition concerning safety of an aircraft or passenger, having priority over all messages except distress?',
      options: [
        'MAYDAY MAYDAY MAYDAY',
        'PAN PAN, PAN PAN, PAN PAN',
        'SECURITE SECURITE',
        'STANDBY STANDBY'
      ],
      correctIndex: 1,
      explanation: 'PAN PAN spoken three times is the aeronautical urgency signal. It signifies that the station calling has a very urgent message regarding the safety of a vehicle or person, but does not require immediate assistance like MAYDAY.',
      source: 'WPC RTR (Aero) Part 1'
    },
    {
      id: 'rtr-2',
      subject: 'rtr',
      question: 'Which SSR Mode A transponder code is set by the pilot to indicate a two-way radio communication failure in flight?',
      options: [
        'Squawk 7500',
        'Squawk 7600',
        'Squawk 7700',
        'Squawk 7000'
      ],
      correctIndex: 1,
      explanation: 'Squawk codes: 7500 = Unlawful Interference (Hijacking); 7600 = Radio Communication Failure; 7700 = Emergency / Distress.',
      source: 'ICAO Doc 9432 / WPC RTR'
    },
    {
      id: 'rtr-3',
      subject: 'rtr',
      question: 'What is the correct ICAO/WPC phraseology when ATC instructs you to read back your current barometric pressure setting?',
      options: [
        '"Confirm QNH"',
        '"State barometer"',
        '"Recheck pressure"',
        '"Say altimeter reading"'
      ],
      correctIndex: 0,
      explanation: 'Standard aeronautical radiotelephony prescribes "Confirm QNH" or "Check altimeter setting" to eliminate ambiguity in pressure altitude reporting.',
      source: 'RTR Operational Test'
    }
  ],
  technical: [
    {
      id: 'tech-1',
      subject: 'technical',
      question: 'In a 4-stroke reciprocating aircraft piston engine, when does valve overlap occur?',
      options: [
        'At the end of the power stroke and start of compression stroke',
        'Near Top Dead Center (TDC) at the end of exhaust stroke and beginning of induction stroke',
        'At Bottom Dead Center (BDC) during peak combustion',
        'Only when the engine experiences detonation'
      ],
      correctIndex: 1,
      explanation: 'Valve overlap is the brief period where both the intake and exhaust valves are open simultaneously near TDC between the exhaust stroke and the intake stroke, utilizing exhaust gas inertia to scavenge the cylinder.',
      source: 'Technical General CPL'
    },
    {
      id: 'tech-2',
      subject: 'technical',
      question: 'What is the primary aerodynamic purpose of vortex generators mounted on the upper surface of a swept wing?',
      options: [
        'To reduce induced drag at low subsonic speeds',
        'To energize the boundary layer with high-energy free stream air and delay boundary layer separation',
        'To cool the wing skin at high Mach numbers',
        'To increase fuel capacity in the wing root'
      ],
      correctIndex: 1,
      explanation: 'Vortex generators create small, high-energy vortices that mix fast-moving air from the free stream into the slow boundary layer. This delays airflow separation and stall at high angles of attack or high Mach numbers.',
      source: 'Aircraft Principles of Flight'
    },
    {
      id: 'tech-3',
      subject: 'technical',
      question: 'What happens to the indicated stalling speed (IAS) of an aircraft during a sustained 60-degree banked level coordinated turn?',
      options: [
        'It decreases by 50%',
        'It remains completely unchanged because weight has not changed',
        'It increases by 41% due to a 2.0g load factor (Square root of 2 = 1.41)',
        'It doubles automatically'
      ],
      correctIndex: 2,
      explanation: 'At 60° bank in a level turn, Load Factor (n) = 1 / Cos(60°) = 2.0g. Accelerated stall speed is given by Vs(turn) = Vs(level) * sqrt(n) = Vs * sqrt(2) = 1.41 * Vs (41% increase).',
      source: 'DGCA Technical General Numerical'
    },
    {
      id: 'tech-4',
      subject: 'technical',
      question: 'A centrifugal compressor in a gas turbine engine differs from an axial flow compressor primarily because:',
      options: [
        'It delivers higher compression ratios per single stage (up to 4:1 to 5:1) compared to an axial stage (~1.2:1)',
        'It produces zero frontal drag compared to axial designs',
        'It cannot be used for turboprop applications',
        'It requires no diffuser section'
      ],
      correctIndex: 0,
      explanation: 'A single centrifugal impeller can generate a pressure ratio of 4:1 to 5:1 in one stage, whereas an axial compressor stage typically yields only 1.1:1 to 1.3:1 (though multiple axial stages compounded reach much higher overall pressure ratios).',
      source: 'Gas Turbine Powerplants'
    }
  ]
};

const SECTIONS = [
  { id: 'regulations', name: 'Air Regulations', code: 'REG', icon: BookOpen, color: 'from-amber-500 to-orange-600', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  { id: 'meteorology', name: 'Aviation Meteorology', code: 'MET', icon: CloudSun, color: 'from-sky-500 to-blue-600', badge: 'bg-sky-500/10 text-sky-400 border-sky-500/20' },
  { id: 'navigation', name: 'Air Navigation', code: 'NAV', icon: Compass, color: 'from-emerald-500 to-teal-600', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  { id: 'rtr', name: 'RTR (Aero) Comms', code: 'RTR', icon: Radio, color: 'from-purple-500 to-indigo-600', badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  { id: 'technical', name: 'Technical General', code: 'TECH', icon: Wrench, color: 'from-rose-500 to-red-600', badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20' }
];

export default function App() {
  // Navigation & Question State
  const [activeSection, setActiveSection] = useState('regulations');
  const [questionBank, setQuestionBank] = useState(INITIAL_QUESTIONS);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Student State & Subscription
  const [isSubscribed, setIsSubscribed] = useState(true);
  const [userAnswers, setUserAnswers] = useState({});
  const [bookmarks, setBookmarks] = useState(new Set());
  const [filterMode, setFilterMode] = useState('all');

  // Teacher / Admin Authentication
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [showAdminAuthModal, setShowAdminAuthModal] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState('');
  const [adminAuthError, setAdminAuthError] = useState('');
  const MASTER_ADMIN_KEY = 'PILOTADMIN2026'; // Secret key for the Teacher

  // Modals
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showTeacherGuideModal, setShowTeacherGuideModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadTab, setUploadTab] = useState('single'); // 'single' or 'bulk'

  // Payment Customization State (Editable by Teacher)
  const [paymentConfig, setPaymentConfig] = useState({
    upiId: 'pilotprep@upi',
    payeeName: 'DGCA Flight Ground School',
    monthlyPrice: 300,
    qrNote: 'Scan & pay ₹300 using GPay, PhonePe, Paytm, or BHIM'
  });
  const [paymentStep, setPaymentStep] = useState('scan'); // 'scan' | 'verify' | 'confirmed'
  const [submittedUtr, setSubmittedUtr] = useState('');
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Single Question Form State (Admin)
  const [singleForm, setSingleForm] = useState({
    subject: 'regulations',
    question: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctIndex: 0,
    explanation: '',
    source: 'DGCA PYQ 2024'
  });

  // Bulk Upload State
  const [bulkText, setBulkText] = useState('');
  const [bulkSubject, setBulkSubject] = useState('regulations');
  const [bulkError, setBulkError] = useState('');

  // Single Device Policy State
  const [isKickedDueToMultiDevice, setIsKickedDueToMultiDevice] = useState(false);
  const [sessionToken, setSessionToken] = useState('session_primary_dev_' + Math.random().toString(36).substring(2, 7));

  const currentQuestions = questionBank[activeSection] || [];
  const currentQ = currentQuestions[currentIndex] || currentQuestions[0];

  const handleSectionSwitch = (sectionId) => {
    setActiveSection(sectionId);
    setCurrentIndex(0);
    setFilterMode('all');
  };

  const handleSelectOption = (index) => {
    if (!currentQ) return;
    // Paywall gate: If not subscribed and index > 0, show payment
    if (!isSubscribed && currentIndex > 0) {
      setShowPaymentModal(true);
      return;
    }

    setUserAnswers(prev => ({
      ...prev,
      [currentQ.id]: index
    }));
  };

  const toggleBookmark = (qId) => {
    setBookmarks(prev => {
      const next = new Set(prev);
      if (next.has(qId)) next.delete(qId);
      else next.add(qId);
      return next;
    });
  };

  // Admin Login Check
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPinInput === MASTER_ADMIN_KEY) {
      setIsAdminLoggedIn(true);
      setShowAdminAuthModal(false);
      setAdminPinInput('');
      setAdminAuthError('');
    } else {
      setAdminAuthError('Invalid Master Passkey. Try PILOTADMIN2026 or check Teacher Manual.');
    }
  };

  // Add Single Question (Admin only)
  const handleAddSingleQuestion = (e) => {
    e.preventDefault();
    if (!singleForm.question.trim() || !singleForm.optionA.trim() || !singleForm.optionB.trim()) {
      alert('Please fill in question text and at least Options A and B.');
      return;
    }

    const newQuestion = {
      id: `${singleForm.subject}-${Date.now()}`,
      subject: singleForm.subject,
      question: singleForm.question,
      options: [singleForm.optionA, singleForm.optionB, singleForm.optionC, singleForm.optionD].filter(Boolean),
      correctIndex: parseInt(singleForm.correctIndex, 10),
      explanation: singleForm.explanation || 'DGCA standard theoretical rationale.',
      source: singleForm.source || 'Instructor PYQ Bank'
    };

    setQuestionBank(prev => ({
      ...prev,
      [singleForm.subject]: [...prev[singleForm.subject], newQuestion]
    }));

    // Reset form
    setSingleForm({
      subject: singleForm.subject,
      question: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctIndex: 0,
      explanation: '',
      source: 'DGCA PYQ 2024'
    });

    alert('Question added successfully to ' + singleForm.subject.toUpperCase());
    setShowUploadModal(false);
  };

  // Bulk Upload (Admin only)
  const handleBulkUpload = () => {
    setBulkError('');
    try {
      const parsed = JSON.parse(bulkText);
      if (!Array.isArray(parsed)) throw new Error('Data must be a valid JSON array of questions.');

      const validated = parsed.map((item, idx) => {
        if (!item.question || !Array.isArray(item.options) || item.options.length < 2) {
          throw new Error(`Item #${idx + 1} is missing "question" or valid "options" array.`);
        }
        return {
          id: `${bulkSubject}-bulk-${Date.now()}-${idx}`,
          subject: bulkSubject,
          question: item.question,
          options: item.options,
          correctIndex: typeof item.correctIndex === 'number' ? item.correctIndex : 0,
          explanation: item.explanation || 'Standard DGCA syllabus analysis.',
          source: item.source || 'Bulk Past Paper Upload'
        };
      });

      setQuestionBank(prev => ({
        ...prev,
        [bulkSubject]: [...prev[bulkSubject], ...validated]
      }));

      setShowUploadModal(false);
      setBulkText('');
      alert(`Success! Uploaded ${validated.length} questions into ${bulkSubject.toUpperCase()}.`);
    } catch (err) {
      setBulkError(err.message || 'JSON format invalid.');
    }
  };

  // Delete Question (Admin only)
  const handleDeleteQuestion = (qId) => {
    if (!window.confirm('Instructor Action: Are you sure you want to delete this question permanently?')) return;
    setQuestionBank(prev => ({
      ...prev,
      [activeSection]: prev[activeSection].filter(q => q.id !== qId)
    }));
    setCurrentIndex(0);
  };

  // Copy UPI
  const handleCopyUpi = () => {
    navigator.clipboard.writeText(paymentConfig.upiId);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const totalAll = Object.values(questionBank).flat().length;
    const answeredAll = Object.keys(userAnswers).length;

    const subjectStats = {};
    SECTIONS.forEach(sec => {
      const qList = questionBank[sec.id] || [];
      const attempted = qList.filter(q => userAnswers[q.id] !== undefined);
      const correct = attempted.filter(q => userAnswers[q.id] === q.correctIndex);
      subjectStats[sec.id] = {
        total: qList.length,
        attempted: attempted.length,
        correct: correct.length,
        accuracy: attempted.length > 0 ? Math.round((correct.length / attempted.length) * 100) : 0
      };
    });

    return { totalAll, answeredAll, subjectStats };
  }, [questionBank, userAnswers]);

  // Filtered list
  const filteredQuestions = useMemo(() => {
    return currentQuestions.map((q, idx) => ({ q, idx })).filter(({ q }) => {
      const isAnswered = userAnswers[q.id] !== undefined;
      const isCorrect = isAnswered && userAnswers[q.id] === q.correctIndex;
      const isBookmarked = bookmarks.has(q.id);

      if (filterMode === 'answered') return isAnswered;
      if (filterMode === 'unanswered') return !isAnswered;
      if (filterMode === 'flagged') return isBookmarked;
      if (filterMode === 'wrong') return isAnswered && !isCorrect;
      return true;
    });
  }, [currentQuestions, userAnswers, bookmarks, filterMode]);

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* --- TOP COCKPIT HEADER --- */}
      <header className="border-b border-slate-800/80 bg-[#0c1220]/95 backdrop-blur-md sticky top-0 z-40">
        
        {/* Brand Banner with the Professional Tagline */}
        <div className="bg-gradient-to-r from-cyan-950/80 via-slate-900 to-amber-950/40 border-b border-slate-800 px-4 py-1.5 text-center text-xs flex items-center justify-center space-x-2">
          <PlaneTakeoff className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-slate-300 font-medium">
            <strong className="text-white">“You will pass only by doing PYQs”</strong> — Master the Past Papers. Clear DGCA in First Attempt.
          </span>
          <span className="hidden md:inline text-[11px] bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/20 font-semibold">
            ₹300 / Month All 5 Subjects
          </span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-700 flex items-center justify-center shadow-lg shadow-cyan-500/25 border border-cyan-400/40">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black tracking-tight text-xl text-white">AeroPrep <span className="text-cyan-400 font-mono">DGCA</span></span>
                <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  CPL • ATPL • RTR
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Aviation Ground School & Verified PYQ Question Bank</p>
            </div>
          </div>

          {/* Action Center: Subscription & Teacher Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Direct UPI ₹300 Monthly Subscription Button */}
            <button
              onClick={() => {
                setPaymentStep('scan');
                setShowPaymentModal(true);
              }}
              className={`flex items-center space-x-1.5 text-xs px-3.5 py-1.5 rounded-xl border font-bold transition shadow-sm ${
                isSubscribed 
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 hover:bg-amber-500/20 shadow-amber-500/10'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 border-amber-400 hover:brightness-110 shadow-amber-500/30 animate-pulse'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>{isSubscribed ? '₹300 Pro Active' : 'Subscribe ₹300/Mo'}</span>
            </button>

            {/* Instructor Access Badge & Upload Gate (Visible ONLY if already authenticated) */}
            {isAdminLoggedIn ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="flex items-center space-x-1.5 text-xs bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-3.5 py-1.5 rounded-xl shadow-md shadow-cyan-600/30 transition border border-cyan-400/30"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Instructor Hub</span>
                </button>
                <button
                  onClick={() => {
                    setIsAdminLoggedIn(false);
                    setShowTeacherGuideModal(false);
                  }}
                  className="text-xs text-rose-400 hover:text-rose-300 border border-rose-500/30 bg-rose-500/10 px-2 py-1.5 rounded-xl transition flex items-center space-x-1"
                  title="Lock Admin Mode"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[11px]">Logout</span>
                </button>
              </div>
            ) : null}

            {/* Single Device Indicator */}
            <div 
              onClick={() => setIsKickedDueToMultiDevice(true)} 
              className="hidden lg:flex items-center space-x-1 text-[11px] text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 cursor-pointer hover:border-slate-700" 
              title="Click to simulate login conflict from 2nd device"
            >
              <Smartphone className="w-3 h-3 text-emerald-400" />
              <span>1 Device Lock</span>
            </div>
          </div>
        </div>

        {/* --- ALL 5 CORE SUBJECT TABS --- */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/60 overflow-x-auto scrollbar-none">
          <div className="flex space-x-2 py-2">
            {SECTIONS.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              const sData = stats.subjectStats[sec.id] || { total: 0, attempted: 0, accuracy: 0 };

              return (
                <button
                  key={sec.id}
                  onClick={() => handleSectionSwitch(sec.id)}
                  className={`flex items-center space-x-2.5 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm whitespace-nowrap transition-all duration-200 border ${
                    isActive
                      ? 'bg-gradient-to-r from-slate-900 to-slate-800 border-cyan-500/50 text-cyan-300 shadow-md shadow-cyan-500/10'
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span>{sec.name}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                    isActive ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {sData.attempted}/{sData.total}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* --- MAIN DASHBOARD BODY --- */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT COLUMN: ACTIVE MCQ ARENA (8 COLS) */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          
          {/* Question Status Bar */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-mono font-black uppercase tracking-wider px-3 py-1 rounded-lg bg-slate-900 text-cyan-400 border border-cyan-500/30">
                Question {currentIndex + 1} of {currentQuestions.length}
              </span>
              {currentQ?.source && (
                <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
                  {currentQ.source}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {/* Bookmark Toggle */}
              <button 
                onClick={() => currentQ && toggleBookmark(currentQ.id)}
                className={`flex items-center space-x-1.5 text-xs px-3 py-1.5 rounded-lg border transition ${
                  currentQ && bookmarks.has(currentQ.id)
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${currentQ && bookmarks.has(currentQ.id) ? 'fill-amber-400' : ''}`} />
                <span>{currentQ && bookmarks.has(currentQ.id) ? 'Flagged' : 'Flag Question'}</span>
              </button>

              {/* Admin delete button if teacher is logged in */}
              {isAdminLoggedIn && currentQ && (
                <button
                  onClick={() => handleDeleteQuestion(currentQ.id)}
                  className="flex items-center space-x-1 text-xs text-rose-400 hover:text-rose-300 bg-rose-500/10 border border-rose-500/30 px-2.5 py-1.5 rounded-lg transition"
                  title="Instructor delete question"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              )}
            </div>
          </div>

          {/* Paywall Banner if non-subscriber reaches question 2+ */}
          {!isSubscribed && currentIndex >= 1 && (
            <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-950/30 border border-amber-500/40 rounded-2xl p-6 text-center space-y-3 shadow-2xl">
              <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-white">Full Question Bank Locked</h3>
              <p className="text-sm text-slate-300 max-w-lg mx-auto">
                Only PYQ #1 is free in demo mode. Unlock all hundreds of past questions across <strong>All 5 Subjects</strong> for just <strong>₹300 / Month</strong>.
              </p>
              <button
                onClick={() => {
                  setPaymentStep('scan');
                  setShowPaymentModal(true);
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm transition shadow-lg shadow-amber-500/20"
              >
                Scan & Pay ₹300 via UPI (Instant Access)
              </button>
            </div>
          )}

          {/* Active Question Box */}
          {currentQ && (
            <div className="bg-[#0c1322] border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
              
              {/* Question Text */}
              <div className="mb-6">
                <h2 className="text-lg sm:text-xl font-medium text-slate-100 leading-relaxed">
                  {currentQ.question}
                </h2>
              </div>

              {/* 4 MCQ Options: Green for Right, Red for Wrong */}
              <div className="space-y-3.5">
                {currentQ.options.map((optionText, optIndex) => {
                  const hasAnswered = userAnswers[currentQ.id] !== undefined;
                  const isSelected = userAnswers[currentQ.id] === optIndex;
                  const isCorrect = currentQ.correctIndex === optIndex;

                  let cardStyle = 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-200 hover:bg-slate-800/40';
                  let badgeStyle = 'bg-slate-800 text-slate-400 border-slate-700';

                  if (hasAnswered) {
                    if (isCorrect) {
                      // Correct answer ALWAYS turns Green
                      cardStyle = 'bg-emerald-950/40 border-emerald-500 text-emerald-100 ring-2 ring-emerald-500/30 font-medium';
                      badgeStyle = 'bg-emerald-500 text-slate-950 font-black border-emerald-400';
                    } else if (isSelected && !isCorrect) {
                      // Wrong selected answer turns Red
                      cardStyle = 'bg-rose-950/40 border-rose-500 text-rose-100 ring-2 ring-rose-500/30 font-medium';
                      badgeStyle = 'bg-rose-500 text-white font-black border-rose-400';
                    } else {
                      cardStyle = 'bg-slate-950/30 border-slate-800/60 text-slate-500 opacity-50';
                      badgeStyle = 'bg-slate-900 text-slate-600 border-slate-800';
                    }
                  }

                  const alphabet = String.fromCharCode(65 + optIndex);

                  return (
                    <button
                      key={optIndex}
                      onClick={() => handleSelectOption(optIndex)}
                      className={`w-full text-left p-4 rounded-xl border transition-all duration-150 flex items-start space-x-3.5 group relative ${cardStyle}`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono border flex-shrink-0 transition ${badgeStyle}`}>
                        {hasAnswered ? (
                          isCorrect ? <Check className="w-5 h-5 stroke-[3]" /> : (isSelected ? <XCircle className="w-5 h-5" /> : alphabet)
                        ) : (
                          alphabet
                        )}
                      </div>

                      <div className="flex-1 pt-1 text-sm sm:text-base leading-relaxed">
                        {optionText}
                      </div>

                      {hasAnswered && isCorrect && (
                        <div className="flex items-center space-x-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/30">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Correct</span>
                        </div>
                      )}

                      {hasAnswered && isSelected && !isCorrect && (
                        <div className="flex items-center space-x-1 text-xs font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-md border border-rose-500/30">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Incorrect</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* DGCA Rationale Drawer: Appears upon selection */}
              {userAnswers[currentQ.id] !== undefined && (
                <div className="mt-6 pt-5 border-t border-slate-800 bg-[#090e18] -mx-6 -mb-6 p-6 rounded-b-2xl border-l-4 border-l-cyan-500 animate-fadeIn">
                  <div className="flex items-center space-x-2 text-cyan-400 mb-2 font-bold text-xs uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>DGCA Technical Analysis & Reference Breakdown</span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed font-normal">
                    {currentQ.explanation}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border text-sm font-semibold transition ${
                currentIndex === 0
                  ? 'border-slate-800 text-slate-600 bg-slate-900/40 cursor-not-allowed'
                  : 'border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <span className="text-xs text-slate-500 font-mono hidden sm:inline">
              Use [←] / [→] arrows or [1-4] keys
            </span>

            <button
              onClick={() => setCurrentIndex(prev => Math.min(currentQuestions.length - 1, prev + 1))}
              disabled={currentIndex === currentQuestions.length - 1}
              className={`flex items-center space-x-1.5 px-5 py-2.5 rounded-xl border text-sm font-bold transition ${
                currentIndex === currentQuestions.length - 1
                  ? 'border-slate-800 text-slate-600 bg-slate-900/40 cursor-not-allowed'
                  : 'border-cyan-500/40 bg-cyan-600 text-white hover:bg-cyan-500 shadow-lg shadow-cyan-600/25'
              }`}
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: QUESTION MATRIX & SYLLABUS READINESS (4 COLS) */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          
          {/* Question Grid Matrix */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-200 text-sm flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <span>Question Matrix ({currentQuestions.length})</span>
              </h3>
              
              <select
                value={filterMode}
                onChange={(e) => setFilterMode(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-lg px-2 py-1 focus:outline-none focus:border-cyan-500"
              >
                <option value="all">All</option>
                <option value="answered">Answered</option>
                <option value="unanswered">Unanswered</option>
                <option value="wrong">Mistakes</option>
                <option value="flagged">Flagged</option>
              </select>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-5 gap-2 max-h-56 overflow-y-auto pr-1">
              {currentQuestions.map((q, idx) => {
                const isSelected = currentIndex === idx;
                const isAnswered = userAnswers[q.id] !== undefined;
                const isCorrect = isAnswered && userAnswers[q.id] === q.correctIndex;
                const isFlagged = bookmarks.has(q.id);

                let btnStyle = 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700';
                if (isAnswered) {
                  btnStyle = isCorrect 
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300' 
                    : 'bg-rose-950/60 border-rose-500 text-rose-300';
                }
                if (isSelected) {
                  btnStyle += ' ring-2 ring-cyan-400 font-bold';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`relative h-10 rounded-lg border text-xs font-mono transition flex items-center justify-center ${btnStyle}`}
                  >
                    <span>{idx + 1}</span>
                    {isFlagged && (
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-4 mt-4 border-t border-slate-800/80">
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Correct</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>Wrong</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span>Flagged</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-600" />
                <span>Pending</span>
              </div>
            </div>
          </div>

          {/* All 5 Subject Completion Tracker */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3.5">
            <h4 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>DGCA 5-Subject Readiness</span>
            </h4>

            {SECTIONS.map(s => {
              const data = stats.subjectStats[s.id] || { total: 0, attempted: 0, accuracy: 0 };
              const percent = data.total > 0 ? Math.round((data.attempted / data.total) * 100) : 0;
              return (
                <div key={s.id} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">{s.name}</span>
                    <span className="font-mono text-cyan-400">{data.accuracy}% accuracy</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className={`h-full bg-gradient-to-r ${s.color} transition-all duration-500`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Single Concurrent Device Simulation Notice */}
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-4 text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-300 font-semibold">
              <span className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Single Device Security</span>
              </span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                1 Seat Active
              </span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Account sharing is restricted. Logging in on a second laptop or mobile phone immediately terminates other sessions.
            </p>
          </div>
        </div>
      </main>

      {/* --- MODAL 1: DIRECT UPI PAYMENT MODAL (Receive Money) --- */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e1626] border border-amber-500/40 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-scaleIn">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-base">Direct UPI Payment — ₹300 / Month</h3>
              </div>
              <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {paymentStep === 'scan' && (
              <div className="space-y-4 text-center">
                <p className="text-xs text-slate-300">
                  Scan this QR code with any UPI App (Google Pay, PhonePe, Paytm, CRED, BHIM) to credit directly into your teacher account.
                </p>

                {/* Dynamic QR Code Mock for UPI payment */}
                <div className="w-52 h-52 mx-auto bg-white p-3 rounded-2xl shadow-xl flex flex-col items-center justify-center relative border-4 border-amber-400/80">
                  <QrCode className="w-36 h-36 text-slate-900" />
                  <span className="text-[10px] font-mono font-bold text-slate-800 mt-1 uppercase tracking-wider">
                    {paymentConfig.payeeName}
                  </span>
                  <span className="text-xs font-black text-emerald-600 font-mono">₹{paymentConfig.monthlyPrice}.00</span>
                </div>

                {/* Direct UPI ID with 1-click copy */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between max-w-sm mx-auto">
                  <div className="text-left">
                    <span className="block text-[10px] text-slate-400 uppercase font-bold">Creator UPI ID</span>
                    <span className="font-mono text-sm font-bold text-cyan-300">{paymentConfig.upiId}</span>
                  </div>
                  <button
                    onClick={handleCopyUpi}
                    className="flex items-center space-x-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1.5 rounded-lg border border-slate-700 transition"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copyFeedback ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl text-left text-xs text-amber-300 space-y-1">
                  <p className="font-bold">What you unlock instantly:</p>
                  <p>✓ All 5 DGCA Subjects (Regs, Met, Nav, RTR, Tech Gen)</p>
                  <p>✓ Hundreds of solved past year questions with reasoning</p>
                  <p>✓ 30 Days unrestricted mock exam test portal access</p>
                </div>

                <div className="pt-2 flex space-x-3">
                  <button
                    onClick={() => setPaymentStep('verify')}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/25 transition"
                  >
                    I Have Paid ₹300 (Enter UTR / Reference)
                  </button>
                </div>
              </div>
            )}

            {paymentStep === 'verify' && (
              <div className="space-y-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-2 text-slate-300">
                  <p className="font-semibold text-white">Enter the 12-digit UPI Reference / UTR Number from your banking app receipt:</p>
                  <input
                    type="text"
                    value={submittedUtr}
                    onChange={(e) => setSubmittedUtr(e.target.value)}
                    placeholder="e.g. 431289102938"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm font-mono text-white focus:outline-none focus:border-amber-400"
                  />
                  <p className="text-[11px] text-slate-400">
                    The payment is automatically cross-referenced or confirmed by the instructor.
                  </p>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setPaymentStep('scan')}
                    className="w-1/3 py-2.5 rounded-xl border border-slate-700 text-xs text-slate-300 hover:bg-slate-800"
                  >
                    Back to QR
                  </button>
                  <button
                    onClick={() => {
                      setIsSubscribed(true);
                      setPaymentStep('confirmed');
                    }}
                    className="w-2/3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition"
                  >
                    Confirm & Unlock All PYQs
                  </button>
                </div>
              </div>
            )}

            {paymentStep === 'confirmed' && (
              <div className="text-center space-y-4 py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400 mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-black text-white">Access Activated!</h3>
                <p className="text-xs text-slate-300 max-w-sm mx-auto">
                  Your monthly subscription is active. All 5 subjects and questions are now completely unlocked.
                </p>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs"
                >
                  Start Practicing Now
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- MODAL 2: TEACHER / ADMIN AUTHENTICATION --- */}
      {showAdminAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleAdminLogin} className="bg-[#0e1626] border border-cyan-500/40 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 animate-scaleIn">
            <div className="flex items-center space-x-2 text-white">
              <KeyRound className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-base">Teacher Master Access</h3>
            </div>
            
            <p className="text-xs text-slate-300">
              Enter your instructor passkey to manage, edit, upload questions, and adjust payment accounts.
            </p>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Passkey</label>
              <input
                type="password"
                value={adminPinInput}
                onChange={(e) => setAdminPinInput(e.target.value)}
                placeholder="Enter PILOTADMIN2026"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono"
                autoFocus
              />
            </div>

            {adminAuthError && (
              <p className="text-xs text-rose-400 bg-rose-500/10 p-2 rounded border border-rose-500/20">{adminAuthError}</p>
            )}

            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAdminAuthModal(false)}
                className="w-1/2 py-2 text-xs text-slate-400 hover:text-white border border-slate-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-1/2 py-2 text-xs bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-600/30"
              >
                Authenticate
              </button>
            </div>

            <p className="text-[10px] text-center text-slate-500 font-mono">
              Default Instructor Master Key: PILOTADMIN2026
            </p>
          </form>
        </div>
      )}

      {/* --- MODAL 3: INSTRUCTOR PYQ UPLOADER (Single & Bulk) --- */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e1626] border border-cyan-500/40 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[92vh] flex flex-col">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Upload className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-white text-base">Teacher Upload Studio — 5 DGCA Sections</h3>
              </div>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {/* Sub-tabs: Single Question Form vs Bulk JSON Pasting */}
            <div className="flex border-b border-slate-800">
              <button
                onClick={() => setUploadTab('single')}
                className={`px-4 py-2 text-xs font-bold border-b-2 transition ${
                  uploadTab === 'single'
                    ? 'border-cyan-400 text-cyan-400 bg-cyan-500/10'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Add 1 Question
              </button>
              <button
                onClick={() => setUploadTab('bulk')}
                className={`px-4 py-2 text-xs font-bold border-b-2 transition ${
                  uploadTab === 'bulk'
                    ? 'border-cyan-400 text-cyan-400 bg-cyan-500/10'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Bulk Import (JSON)
              </button>
              <button
                onClick={() => setUploadTab('manual')}
                className={`px-4 py-2 text-xs font-bold border-b-2 transition flex items-center space-x-1.5 ${
                  uploadTab === 'manual'
                    ? 'border-amber-400 text-amber-400 bg-amber-500/10'
                    : 'border-transparent text-amber-400/70 hover:text-amber-300'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Teacher Manual & Guide</span>
              </button>
            </div>

            {/* TAB A: Single Question Form */}
            {uploadTab === 'single' && (
              <form onSubmit={handleAddSingleQuestion} className="space-y-3 overflow-y-auto pr-1 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Subject</label>
                    <select
                      value={singleForm.subject}
                      onChange={(e) => setSingleForm({ ...singleForm, subject: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                    >
                      {SECTIONS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Source / Exam Session</label>
                    <input
                      type="text"
                      value={singleForm.source}
                      onChange={(e) => setSingleForm({ ...singleForm, source: e.target.value })}
                      placeholder="e.g. DGCA CPL July 2024"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Question Statement</label>
                  <textarea
                    rows={2}
                    value={singleForm.question}
                    onChange={(e) => setSingleForm({ ...singleForm, question: e.target.value })}
                    placeholder="Enter the complete question statement here..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 font-medium mb-0.5">Option A</label>
                    <input
                      type="text"
                      value={singleForm.optionA}
                      onChange={(e) => setSingleForm({ ...singleForm, optionA: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-slate-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-medium mb-0.5">Option B</label>
                    <input
                      type="text"
                      value={singleForm.optionB}
                      onChange={(e) => setSingleForm({ ...singleForm, optionB: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-slate-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-medium mb-0.5">Option C</label>
                    <input
                      type="text"
                      value={singleForm.optionC}
                      onChange={(e) => setSingleForm({ ...singleForm, optionC: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-medium mb-0.5">Option D</label>
                    <input
                      type="text"
                      value={singleForm.optionD}
                      onChange={(e) => setSingleForm({ ...singleForm, optionD: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-slate-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-emerald-400 font-bold mb-1">Correct Option (Turns Green)</label>
                    <select
                      value={singleForm.correctIndex}
                      onChange={(e) => setSingleForm({ ...singleForm, correctIndex: e.target.value })}
                      className="w-full bg-emerald-950/40 border border-emerald-500/40 rounded-lg p-2 text-emerald-300 font-bold"
                    >
                      <option value={0}>Option A is Correct</option>
                      <option value={1}>Option B is Correct</option>
                      <option value={2}>Option C is Correct</option>
                      <option value={3}>Option D is Correct</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-cyan-400 font-bold mb-1">Explanation / Syllabus Reference</label>
                    <input
                      type="text"
                      value={singleForm.explanation}
                      onChange={(e) => setSingleForm({ ...singleForm, explanation: e.target.value })}
                      placeholder="Why is this answer correct?"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-600/30"
                  >
                    Save & Publish Question
                  </button>
                </div>
              </form>
            )}

            {/* TAB B: Bulk Import Hundreds via JSON */}
            {uploadTab === 'bulk' && (
              <div className="space-y-3 overflow-y-auto pr-1 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <label className="font-semibold text-slate-300">Upload to Subject:</label>
                    <select
                      value={bulkSubject}
                      onChange={(e) => setBulkSubject(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-slate-200"
                    >
                      {SECTIONS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                  <button
                    onClick={() => {
                      setBulkText(JSON.stringify([
                        {
                          question: "What is the critical engine on a conventional multi-engine aircraft with clockwise rotating propellers?",
                          options: [
                            "The Left Engine, because P-factor yaw effect is greater if the left engine fails",
                            "The Right Engine",
                            "Both are equally critical",
                            "Neither engine"
                          ],
                          correctIndex: 0,
                          explanation: "The left engine is critical on clockwise spinning props because the right engine thrust vector acts further from aircraft centerline, causing greater asymmetrical yaw.",
                          source: "DGCA Tech Gen 2024"
                        }
                      ], null, 2));
                    }}
                    className="text-cyan-400 underline font-mono"
                  >
                    Paste Sample JSON
                  </button>
                </div>

                <textarea
                  rows={9}
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                  placeholder={`[\n  {\n    "question": "What is...",\n    "options": ["A", "B", "C", "D"],\n    "correctIndex": 0,\n    "explanation": "Because...",\n    "source": "DGCA 2024"\n  }\n]`}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
                />

                {bulkError && <p className="text-rose-400 bg-rose-500/10 p-2 rounded">{bulkError}</p>}

                <div className="flex justify-end pt-1">
                  <button
                    onClick={handleBulkUpload}
                    className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-600/30"
                  >
                    Process Bulk Batch
                  </button>
                </div>
              </div>
            )}

            {/* TAB C: Teacher Master Manual (Confidential to Teacher Only) */}
            {uploadTab === 'manual' && (
              <div className="space-y-4 overflow-y-auto pr-1 text-xs text-slate-300 leading-relaxed">
                <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl flex items-center space-x-2 text-amber-300">
                  <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                  <span className="font-semibold">Instructor Private Documentation — Not visible to students</span>
                </div>

                {/* Step 1: Receiving money directly */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center space-x-2 text-amber-400 font-bold">
                    <CreditCard className="w-4 h-4" />
                    <span>1. How to Link Your Personal Bank Account & UPI ID</span>
                  </div>
                  <p>
                    All student payments go directly to your bank account without middlemen fees. Update the state variable in <code className="text-cyan-300 font-mono">App.jsx</code>:
                  </p>
                  <pre className="bg-slate-900 p-2.5 rounded-lg text-cyan-300 font-mono text-[11px] overflow-x-auto">
{`const [paymentConfig, setPaymentConfig] = useState({
  upiId: 'yourname@okhdfcbank', // Replace with your GPay / PhonePe UPI ID
  payeeName: 'Capt. Ground School',
  monthlyPrice: 300,
});`}
                  </pre>
                  <p className="text-slate-400 text-[11px]">
                    When students scan the QR code or tap Copy UPI, ₹300 credits straight into your UPI account.
                  </p>
                </div>

                {/* Step 2: Instructor Admin Passkey */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center space-x-2 text-cyan-400 font-bold">
                    <KeyRound className="w-4 h-4" />
                    <span>2. Teacher Passkey Management</span>
                  </div>
                  <p>
                    The portal uses the secret key <strong className="text-white font-mono bg-slate-900 px-2 py-0.5 rounded">PILOTADMIN2026</strong>. You can change this in the code at:
                  </p>
                  <pre className="bg-slate-900 p-2.5 rounded-lg text-cyan-300 font-mono text-[11px]">
{`const MASTER_ADMIN_KEY = 'YOUR_NEW_SECURE_PASSWORD';`}
                  </pre>
                </div>

                {/* Step 3: Single Device Multi-login Kick */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                    <Smartphone className="w-4 h-4" />
                    <span>3. Single-Seat Enforcement (1 Guy Login Only)</span>
                  </div>
                  <p>
                    To prevent password sharing across multiple students, store a random <code className="text-cyan-300 font-mono">sessionId</code> in the student's Firestore user record on login. When a second device signs in with the same account, it overwrites the <code className="text-cyan-300 font-mono">sessionId</code>, and the first device's real-time snapshot listener immediately kicks them out.
                  </p>
                </div>

                {/* Step 4: Hosting Free on Vercel / Netlify */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center space-x-2 text-purple-400 font-bold">
                    <ExternalLink className="w-4 h-4" />
                    <span>4. Free Deployment to Custom Domain</span>
                  </div>
                  <p>
                    1. Upload your project to GitHub.<br />
                    2. Import the repository into <strong>Vercel.com</strong> or <strong>Netlify.com</strong> for zero-cost hosting.<br />
                    3. Under project settings, point your custom domain (e.g., <em>prep.youracademy.com</em>).
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- FORCED MULTI-DEVICE LOGOUT MODAL SIMULATION --- */}
      {isKickedDueToMultiDevice && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e1626] border border-rose-500/50 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-500 flex items-center justify-center text-rose-400 mx-auto">
              <LogOut className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-white">Session Terminated</h3>
            <p className="text-xs text-rose-300 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20 font-medium">
              Your account was just accessed from another smartphone or PC. Multi-device concurrent usage is prohibited.
            </p>
            <button
              onClick={() => setIsKickedDueToMultiDevice(false)}
              className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs"
            >
              Resume Session on this Device
            </button>
          </div>
        </div>
      )}

      {/* --- SLEEK COCKPIT FOOTER --- */}
      <footer className="border-t border-slate-900 bg-[#060a12] py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div>
            AeroPrep DGCA © {new Date().getFullYear()} — Designed for CPL/ATPL Pilots. Tagline: <em>"You will pass only by doing PYQs"</em>
          </div>
          <div className="flex items-center space-x-4 font-mono text-[11px]">
            <span className="text-emerald-400">Green: Right</span>
            <span className="text-rose-400">Red: Wrong</span>
            <span className="text-amber-400">5 Modules Active</span>
            
            {/* Discreet Instructor Trigger in footer */}
            {!isAdminLoggedIn ? (
              <button
                onClick={() => setShowAdminAuthModal(true)}
                className="text-slate-600 hover:text-slate-400 transition flex items-center space-x-1 ml-2"
                title="Teacher access"
              >
                <KeyRound className="w-3 h-3 text-slate-600" />
                <span className="text-[10px]">Staff</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setUploadTab('manual');
                  setShowUploadModal(true);
                }}
                className="text-cyan-400 hover:text-cyan-300 font-semibold transition flex items-center space-x-1 ml-2"
              >
                <HelpCircle className="w-3 h-3 text-cyan-400" />
                <span className="text-[10px]">Manual</span>
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}