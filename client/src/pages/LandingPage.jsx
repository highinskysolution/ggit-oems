import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  UserCheck,
  BookOpen,
  Timer,
  Award,
  ShieldCheck,
  ArrowRight,
  Layers,
  CheckCircle2,
  Building2,
} from 'lucide-react';

const LandingPage = () => {
  const { isAuthenticated, isStudent, isTeacher, isAdmin } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-24">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/4 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/3 right-1/4 w-[450px] h-[450px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-14">
            {/* University Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-600/50 text-indigo-300 text-xs font-bold mb-6 shadow-lg shadow-indigo-950/50 backdrop-blur-md">
              <Building2 className="w-4 h-4 text-cyan-400" />
              <span>ASG-IIT • Digital Examination System</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-6 leading-tight">
              Online Examination <br />
              <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Management System
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed mb-8 max-w-2xl mx-auto">
              Official academic examination portal for <strong className="text-white">ASG-IIT</strong> across <span className="text-cyan-300 font-semibold">BCA</span>, <span className="text-indigo-300 font-semibold">BSc IT</span>, and <span className="text-purple-300 font-semibold">AI</span> departments.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {isAuthenticated ? (
                <Link
                  to={isStudent ? '/student/dashboard' : isTeacher ? '/teacher/dashboard' : '/admin/dashboard'}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition-all hover:scale-105"
                >
                  <span>Go to My Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition-all hover:scale-105"
                  >
                    <span>Sign In to Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/register"
                    className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs transition-all hover:scale-105"
                  >
                    <span>Register New Account</span>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* 2 Dedicated Public Portal Cards: Student & Faculty (Admin is hidden) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
            {/* 1. Student Candidate Portal */}
            <div className="relative group rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-cyan-500/30 p-6 sm:p-8 flex flex-col justify-between shadow-2xl transition-all duration-300 hover:border-cyan-400 hover:shadow-cyan-500/10 hover:-translate-y-1">
              <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-mono font-bold uppercase tracking-wider">
                Candidate Terminal
              </div>

              <div>
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-6 text-cyan-400 group-hover:scale-110 transition-transform shadow-inner">
                  <GraduationCap className="w-8 h-8" />
                </div>

                <h3 className="text-2xl font-black text-white mb-2">Student Portal</h3>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                  Dedicated examination terminal for ASG-IIT candidates (FY, SY, TY) across BCA, BSc IT & AI departments to attempt timed tests and view marksheets.
                </p>

                <ul className="space-y-2.5 text-xs text-slate-300 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Real-Time Countdown Timer & Auto-Submit</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Anti-Cheating Window Monitor & Guard</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>4-State Question Palette with Review Flags</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Instant Marksheet with Subject Breakdown</span>
                  </li>
                </ul>
              </div>

              <div>
                <Link
                  to="/login"
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/25 transition-all"
                >
                  <span>Student Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* 2. Faculty / Teacher Portal */}
            <div className="relative group rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-indigo-500/30 p-6 sm:p-8 flex flex-col justify-between shadow-2xl transition-all duration-300 hover:border-indigo-400 hover:shadow-indigo-500/10 hover:-translate-y-1">
              <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-mono font-bold uppercase tracking-wider">
                Faculty Terminal
              </div>

              <div>
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mb-6 text-indigo-400 group-hover:scale-110 transition-transform shadow-inner">
                  <Layers className="w-8 h-8" />
                </div>

                <h3 className="text-2xl font-black text-white mb-2">Faculty / Teacher Portal</h3>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                  Academic management console for ASG-IIT instructors to author MCQs, configure scheduled exams in real-time, and audit class performance.
                </p>

                <ul className="space-y-2.5 text-xs text-slate-300 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Real-Time Exam & Question Authoring</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Instant Question Pack Generator</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Class Pass Rate & High/Low Analytics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Student Answer Sheet & Proctoring Inspector</span>
                  </li>
                </ul>
              </div>

              <div>
                <Link
                  to="/login"
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all"
                >
                  <span>Faculty Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Institutional Highlights */}
          <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-8 max-w-5xl mx-auto shadow-xl">
            <h3 className="text-base font-bold text-white text-center mb-6 uppercase tracking-wider">
              ASG-IIT • Digital Examination Framework
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3">
                  <UserCheck className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-white mb-1">Student Candidate Suite</h4>
                <p className="text-xs text-slate-400">
                  Authentication with unique Roll Number validation across BCA, BSc IT & AI.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-white mb-1">Question Bank & Creation</h4>
                <p className="text-xs text-slate-400">
                  Categorized MCQs with difficulty weighting, subject tags, and real-time exam authoring.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
                  <Timer className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-white mb-1">Proctored Live Room</h4>
                <p className="text-xs text-slate-400">
                  Synchronized countdown, anti-cheating window monitor, and auto-submission.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
                  <Award className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-white mb-1">Automated Evaluation</h4>
                <p className="text-xs text-slate-400">
                  Instant evaluation engine, printable university marksheets, and faculty analytics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
