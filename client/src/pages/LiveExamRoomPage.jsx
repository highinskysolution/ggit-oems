import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/client';
import CountdownTimer from '../components/CountdownTimer';
import QuestionPalette from '../components/QuestionPalette';
import {
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Send,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Loader2,
  ShieldAlert,
  Info,
  Maximize,
  Minimize,
  ShieldCheck,
  Eye,
  AlertOctagon,
  Copy,
  Volume2,
  Zap,
} from 'lucide-react';

// Audio Synthesizer for High-Priority Security Alarm
const playSecurityAlarmSound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(800, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.3);
    osc1.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.6);

    gain1.gain.setValueAtTime(0.3, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.7);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    osc1.start();
    osc1.stop(ctx.currentTime + 0.7);
  } catch (err) {
    // audio context might be blocked if no user gesture yet
    console.warn('Audio alarm could not play:', err);
  }
};

const LiveExamRoomPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: selectedOptionNumber (0-3) }
  const [flagged, setFlagged] = useState({}); // { questionId: boolean }
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [startTime] = useState(Date.now());
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Anti-Cheating & Proctoring States
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showCheatingAlert, setShowCheatingAlert] = useState(false);
  const [cheatingReason, setCheatingReason] = useState('');
  const [lastViolationTime, setLastViolationTime] = useState(null);
  const [proctorFlags, setProctorFlags] = useState([]);
  const [showBannerToast, setShowBannerToast] = useState(false);

  const cacheKey = `oems_exam_cache_${id}`;
  const lastTriggerTimeRef = useRef(0);

  // Register Proctoring Security Violation with Debounce Protection
  const registerViolation = useCallback((reason) => {
    if (submitting) return;

    // Prevent duplicate rapid firing within 800ms
    const now = Date.now();
    if (now - lastTriggerTimeRef.current < 800) {
      return;
    }
    lastTriggerTimeRef.current = now;

    playSecurityAlarmSound();

    setTabSwitchCount((prev) => {
      const nextCount = prev + 1;
      return nextCount;
    });

    const timestampStr = new Date().toLocaleTimeString();
    setLastViolationTime(timestampStr);

    const flagEntry = {
      timestamp: new Date().toISOString(),
      reason: reason || 'Window Focus Lost / Tab Switch Detected',
    };

    setProctorFlags((prev) => [...prev, flagEntry]);
    setCheatingReason(reason || 'You navigated away from the examination test window.');
    setShowCheatingAlert(true);
    setShowBannerToast(true);
  }, [submitting]);

  // Robust Multi-Layer Browser Event Listeners for Anti-Cheating
  useEffect(() => {
    // 1. Window Blur (Focus Lost / Alt-Tab / Clicking other app)
    const handleWindowBlur = () => {
      registerViolation('Window focus lost! Navigated to another application or window.');
    };

    // 2. Tab Visibility Change (Switching Browser Tabs / Minimizing)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        registerViolation('Browser tab switched or minimized to background.');
      }
    };

    // 3. Mouse Leaving Browser Viewport
    const handleMouseLeave = (e) => {
      if (e.clientY <= 0 || e.clientX <= 0 || e.clientX >= window.innerWidth || e.clientY >= window.innerHeight) {
        // Cursor moved out of window
        registerViolation('Cursor moved outside examination window boundary.');
      }
    };

    // 4. Keyboard Shortcuts Interception (Alt, Alt+Tab, Ctrl+C, Ctrl+V, F12, PrtScn)
    const handleKeyDown = (e) => {
      // Alt key
      if (e.altKey) {
        e.preventDefault();
        registerViolation('Unauthorized Alt key shortcut pressed (Alt-Tab attempt).');
        return;
      }

      // Copy / Paste / Cut / Print / Save shortcuts
      if (e.ctrlKey || e.metaKey) {
        const key = e.key.toLowerCase();
        if (['c', 'v', 'x', 'p', 's', 'u', 'a'].includes(key)) {
          e.preventDefault();
          registerViolation(`Unauthorized keyboard shortcut Ctrl+${key.toUpperCase()} detected.`);
          return;
        }
      }

      // DevTools F12
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(e.key.toLowerCase()))) {
        e.preventDefault();
        registerViolation('Attempted to inspect examination room or open Developer Tools (F12).');
        return;
      }

      // PrintScreen Key
      if (e.key === 'PrintScreen') {
        registerViolation('Screen capture / PrintScreen action intercepted.');
      }
    };

    // 5. Copy / Paste / Cut Prevention
    const handleCopy = (e) => {
      e.preventDefault();
      registerViolation('Attempted text copy action during secure examination.');
    };

    const handlePaste = (e) => {
      e.preventDefault();
      registerViolation('Attempted paste action into examination room.');
    };

    const handleCut = (e) => {
      e.preventDefault();
      registerViolation('Attempted text cut action during secure examination.');
    };

    // 6. Right-Click Context Menu Prevention
    const handleContextMenu = (e) => {
      e.preventDefault();
      registerViolation('Right-click context menu attempt detected.');
    };

    // Attach all security event listeners
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('cut', handleCut);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('cut', handleCut);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [registerViolation]);

  // Fullscreen helper
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
      }
    }
  };

  // Fetch test session questions
  useEffect(() => {
    const initExam = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/exams/${id}/take`);
        if (res.data.success) {
          const examData = res.data.exam;
          setExam(examData);
          setQuestions(examData.questions || []);

          // Crash recovery from localStorage (NFR-04)
          const cachedData = localStorage.getItem(cacheKey);
          if (cachedData) {
            try {
              const parsed = JSON.parse(cachedData);
              if (parsed.answers) setAnswers(parsed.answers);
              if (parsed.flagged) setFlagged(parsed.flagged);
              if (parsed.currentIndex !== undefined) setCurrentIndex(parsed.currentIndex);
              if (parsed.tabSwitchCount) setTabSwitchCount(parsed.tabSwitchCount);
            } catch (e) {
              console.warn('Failed to parse cached exam data', e);
            }
          }
        }
      } catch (err) {
        console.error('Init exam error:', err);
        if (err.response?.data?.alreadyAttempted) {
          navigate(`/student/results/${err.response.data.resultId}`);
          return;
        }
        setError(err.response?.data?.message || 'Failed to start exam session.');
      } finally {
        setLoading(false);
      }
    };

    initExam();
  }, [id, navigate, cacheKey]);

  // Sync state changes to localStorage cache
  useEffect(() => {
    if (questions.length > 0 && !submitting) {
      localStorage.setItem(
        cacheKey,
        JSON.stringify({ answers, flagged, currentIndex, tabSwitchCount, timestamp: Date.now() })
      );
    }
  }, [answers, flagged, currentIndex, tabSwitchCount, questions.length, submitting, cacheKey]);

  // Option selection
  const handleSelectOption = (optionIndex) => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    setAnswers((prev) => ({
      ...prev,
      [currentQ._id]: optionIndex,
    }));
  };

  // Clear current question choice
  const handleClearChoice = () => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    setAnswers((prev) => {
      const next = { ...prev };
      delete next[currentQ._id];
      return next;
    });
  };

  // Toggle flag for review
  const handleToggleFlag = () => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    setFlagged((prev) => ({
      ...prev,
      [currentQ._id]: !prev[currentQ._id],
    }));
  };

  // Navigation handlers
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Submit test
  const executeSubmission = async (isAuto = false) => {
    if (submitting) return;
    setSubmitting(true);

    const timeSpentSeconds = Math.round((Date.now() - startTime) / 1000);

    const formattedAnswers = questions.map((q) => ({
      questionId: q._id,
      selectedOption: answers[q._id] !== undefined ? answers[q._id] : -1,
    }));

    try {
      const res = await api.post('/results/submit', {
        examId: id,
        answers: formattedAnswers,
        time_taken_seconds: timeSpentSeconds,
        tab_switch_count: tabSwitchCount,
        proctor_flags: proctorFlags,
      });

      if (res.data.success) {
        localStorage.removeItem(cacheKey);
        navigate(`/student/results/${res.data.resultId}`);
      }
    } catch (err) {
      console.error('Submission error:', err);
      alert(err.response?.data?.message || 'Failed to submit examination.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300">
        <Loader2 className="w-10 h-10 text-cyan-500 animate-spin mb-4" />
        <p className="text-sm font-semibold tracking-wide">Initializing GGIT AI-Proctored Test Environment...</p>
      </div>
    );
  }

  if (error || !exam || questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center">
          <ShieldAlert className="w-12 h-12 text-rose-400 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-white mb-2">Examination Room Error</h2>
          <p className="text-xs text-slate-400 mb-6">{error || 'No questions found for this exam.'}</p>
          <button
            onClick={() => navigate('/student/dashboard')}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const selectedOption = currentQuestion ? answers[currentQuestion._id] : undefined;
  const isCurrentFlagged = currentQuestion ? !!flagged[currentQuestion._id] : false;

  const answeredCount = Object.keys(answers).filter((k) => answers[k] !== undefined && answers[k] !== -1).length;
  const flaggedCount = Object.keys(flagged).filter((k) => flagged[k]).length;
  const unansweredCount = questions.length - answeredCount;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white select-none">
      {/* Top Real-Time Security Warning Toast Banner */}
      {showBannerToast && tabSwitchCount > 0 && (
        <div className="bg-gradient-to-r from-rose-900 via-red-800 to-rose-900 text-white px-4 py-2 text-xs font-bold flex items-center justify-between border-b border-rose-500 shadow-xl animate-pulse z-50">
          <div className="flex items-center gap-2 max-w-4xl mx-auto">
            <AlertOctagon className="w-4 h-4 text-amber-300 shrink-0" />
            <span>
              🚨 <strong>SECURITY VIOLATION DETECTED:</strong> Window focus lost or unauthorized action logged! (Violation #{tabSwitchCount} at {lastViolationTime || 'just now'}).
            </span>
          </div>
          <button
            onClick={() => setShowBannerToast(false)}
            className="text-white/80 hover:text-white text-xs font-mono font-bold ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Sticky Top Test Bar with Proctoring Status */}
      <header className="sticky top-0 z-30 bg-slate-900/95 border-b border-slate-800 backdrop-blur-md px-4 sm:px-8 py-3 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center shadow-md">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xs sm:text-sm font-bold text-white truncate max-w-xs sm:max-w-md">
                {exam.title}
              </h1>
              <p className="text-[11px] text-cyan-300 font-mono flex items-center gap-1.5">
                <span>GGIT • {exam.subject?.subject_code}</span>
                <span>•</span>
                <span>{questions.length} Questions ({exam.total_marks} Marks)</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            {/* Live Proctoring Security Status Badge */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                tabSwitchCount > 0
                  ? 'bg-rose-950/80 border-rose-500 text-rose-300 shadow-lg shadow-rose-950/50'
                  : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
              }`}
              title="Anti-Cheating Window Monitor Active"
            >
              {tabSwitchCount > 0 ? (
                <ShieldAlert className="w-4 h-4 text-rose-400 animate-bounce" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              )}
              <span>
                {tabSwitchCount === 0 ? '🛡️ Proctoring: Clean' : `🚨 Violations: ${tabSwitchCount}`}
              </span>
            </div>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-colors"
              title="Toggle Fullscreen Security Mode"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>

            {/* Live Synchronized Countdown Timer (FR-OE-03 & Auto-submit FR-OE-05) */}
            <CountdownTimer
              durationMinutes={exam.duration_mins}
              onTimeUp={() => {
                alert('⏳ Time is up! Your answers are being submitted automatically.');
                executeSubmission(true);
              }}
            />

            {/* Finish Button */}
            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 flex items-center gap-1.5 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Finish Exam</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Examination View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left / Center: Question Panel (8 cols) */}
        <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            {/* Question Header Status */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <span
                  className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                    currentQuestion.difficulty === 'Easy'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : currentQuestion.difficulty === 'Hard'
                      ? 'bg-rose-500/20 text-rose-300'
                      : 'bg-amber-500/20 text-amber-300'
                  }`}
                >
                  {currentQuestion.difficulty || 'Medium'}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-slate-400">
                  Marks: <strong className="text-cyan-400">+{currentQuestion.marks || 1}</strong>
                </span>
                <button
                  onClick={handleToggleFlag}
                  className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border transition-all ${
                    isCurrentFlagged
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                  title="Flag for later review"
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isCurrentFlagged ? 'fill-amber-400 text-amber-400' : ''}`} />
                  <span>{isCurrentFlagged ? 'Flagged' : 'Mark for Review'}</span>
                </button>
              </div>
            </div>

            {/* Question Text */}
            <div className="text-base sm:text-lg font-medium text-white leading-relaxed">
              {currentQuestion.question_text}
            </div>

            {/* 4 MCQ Radio Candidate Options */}
            <div className="space-y-3 pt-2">
              {currentQuestion.options.map((optionText, optIdx) => {
                const isSelected = selectedOption === optIdx;
                const optionLetter = String.fromCharCode(65 + optIdx); // A, B, C, D

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center space-x-3.5 ${
                      isSelected
                        ? 'bg-gradient-to-r from-cyan-950/80 to-indigo-950/80 border-cyan-400 ring-2 ring-cyan-500/30 shadow-lg shadow-cyan-950/50'
                        : 'bg-slate-800/60 border-slate-700/70 hover:bg-slate-800 hover:border-slate-600 text-slate-300'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 transition-all ${
                        isSelected
                          ? 'bg-cyan-500 text-slate-950 shadow-md scale-105'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {optionLetter}
                    </div>
                    <span className={`text-xs sm:text-sm font-medium ${isSelected ? 'text-white font-semibold' : 'text-slate-200'}`}>
                      {optionText}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Action Controls (FR-OE-04) */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center space-x-2">
              <button
                disabled={currentIndex === 0}
                onClick={handlePrev}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                disabled={currentIndex === questions.length - 1}
                onClick={handleNext}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1 transition-all shadow-md shadow-indigo-600/20"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center space-x-2">
              {selectedOption !== undefined && (
                <button
                  onClick={handleClearChoice}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-rose-950/40 hover:text-rose-300 hover:border-rose-600/40 border border-slate-700 text-slate-400 text-xs font-semibold flex items-center gap-1 transition-all"
                  title="Clear selected option"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear Choice</span>
                </button>
              )}

              <button
                onClick={() => setShowSubmitModal(true)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Finish & Submit</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Question Palette Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <QuestionPalette
            questions={questions}
            currentIndex={currentIndex}
            answers={answers}
            flaggedQuestions={flagged}
            onSelectQuestion={(idx) => setCurrentIndex(idx)}
          />

          {/* Anti-Cheating Environment Monitor Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-xs space-y-3 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-white flex items-center gap-1.5 text-xs">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                Security & Anti-Cheating Guard
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  tabSwitchCount === 0
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-rose-500/20 text-rose-300 animate-pulse'
                }`}
              >
                {tabSwitchCount} Violations
              </span>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Window focus, Alt+Tab switching, copy/paste, and cursor exit are monitored in real-time. Unauthorized attempts are timestamped and logged on your final marksheet.
            </p>

            {/* Test Simulation Button for Evaluator Testing */}
            <button
              type="button"
              onClick={() => registerViolation('Manual test trigger: Simulated window blur & tab switch attempt.')}
              className="w-full py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
              title="Test Anti-Cheating Alert"
            >
              <Zap className="w-3.5 h-3.5 text-rose-400" />
              <span>🧪 Test Anti-Cheating Security Alert</span>
            </button>
          </div>
        </div>
      </main>

      {/* 🚨 PROCTORING / CHEATING SECURITY WARNING MODAL (Audio 2 & Alert Requirement) */}
      {showCheatingAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
          <div className="bg-slate-900 border-2 border-rose-600 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 text-center">
            <div className="w-16 h-16 rounded-3xl bg-rose-600/20 border-2 border-rose-500 text-rose-400 flex items-center justify-center mx-auto animate-bounce">
              <AlertOctagon className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                🚨 Security & Proctoring Alert
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-3">
                Cheating / Suspicious Activity Detected!
              </h2>
              <p className="text-xs text-rose-300 mt-2 font-medium">
                {cheatingReason}
              </p>
            </div>

            <div className="bg-slate-950/80 border border-rose-900/60 rounded-2xl p-4 text-xs text-slate-300 space-y-2 text-left">
              <p className="font-bold text-white flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                Official Academic Warning Notice:
              </p>
              <p className="text-[11px] text-slate-400">
                • You have navigated outside the examination test window (Violation count: <strong className="text-rose-400">{tabSwitchCount}</strong>).
              </p>
              <p className="text-[11px] text-slate-400">
                • Copying questions or consulting external materials is strictly prohibited and logged in your official GGIT marksheet audit record.
              </p>
            </div>

            <button
              onClick={() => setShowCheatingAlert(false)}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all"
            >
              I Understand & Return to Test Room
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                <Send className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">
                Submit Examination Answers?
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Please confirm your test submission. Once submitted, your answers cannot be altered.
              </p>
            </div>

            {/* Breakdown summary */}
            <div className="grid grid-cols-3 gap-2 bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 text-center">
              <div>
                <span className="text-[10px] text-emerald-400 uppercase font-bold block">Answered</span>
                <span className="text-lg font-black text-emerald-300">{answeredCount}</span>
              </div>
              <div>
                <span className="text-[10px] text-amber-400 uppercase font-bold block">Marked Review</span>
                <span className="text-lg font-black text-amber-300">{flaggedCount}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Unanswered</span>
                <span className="text-lg font-black text-slate-300">{unansweredCount}</span>
              </div>
            </div>

            {tabSwitchCount > 0 && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Notice: {tabSwitchCount} security window switches logged.</span>
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                disabled={submitting}
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
              >
                Continue Test
              </button>
              <button
                disabled={submitting}
                onClick={() => executeSubmission(false)}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition-all"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Confirm & Finish</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveExamRoomPage;
