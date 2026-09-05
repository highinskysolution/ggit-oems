import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  LogOut,
  BookOpen,
  Shield,
  ChevronRight,
  UserCheck,
  Award,
  Clock,
} from 'lucide-react';

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState('student'); // 'student' | 'faculty'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();

  const { user, isAuthenticated, login, logout } = useAuth();
  const navigate = useNavigate();

  const sessionExpired = searchParams.get('session_expired');

  // Reset fields when switching tabs
  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setEmail('');
    setPassword('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);

    try {
      const data = await login(email.trim(), password);
      if (data.user.role === 'teacher') {
        navigate('/teacher/dashboard');
      } else if (data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const isStudent = activeTab === 'student';

  return (
    <div
      className="min-h-screen flex items-center justify-center py-10 px-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0a0a1a 0%, #0d0d2b 40%, #060614 100%)' }}
    >
      {/* ── Ambient Background Glows ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '15%', left: '20%',
          width: 520, height: 520,
          background: isStudent
            ? 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(99,102,241,0.14) 0%, transparent 70%)',
          transition: 'background 0.6s ease',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '10%', right: '15%',
          width: 480, height: 480,
          background: isStudent
            ? 'radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 70%)',
          transition: 'background 0.6s ease',
        }}
      />
      {/* Floating grid dots */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="w-full max-w-lg relative z-10">

        {/* ── ASG-IIT Institutional Header ── */}
        <div className="text-center mb-8">
          <div
            className="mx-auto mb-4 flex items-center justify-center"
            style={{
              width: 64, height: 64,
              borderRadius: 20,
              background: isStudent
                ? 'linear-gradient(135deg, #0891b2, #22d3ee)'
                : 'linear-gradient(135deg, #4f46e5, #8b5cf6)',
              boxShadow: isStudent
                ? '0 0 40px rgba(6,182,212,0.35)'
                : '0 0 40px rgba(99,102,241,0.35)',
              transition: 'all 0.5s ease',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            {isStudent
              ? <GraduationCap className="w-8 h-8 text-white" />
              : <BookOpen className="w-8 h-8 text-white" />
            }
          </div>
          <h1
            className="text-3xl font-black tracking-tight text-white mb-1"
            style={{ letterSpacing: '-0.02em' }}
          >
            ASG-IIT
          </h1>
          <p className="text-xs font-semibold tracking-widest uppercase"
            style={{ color: isStudent ? '#22d3ee' : '#a78bfa', transition: 'color 0.4s ease' }}
          >
            Online Examination Management System
          </p>
        </div>

        {/* ── Already Signed In Banner ── */}
        {isAuthenticated && user && (
          <div
            className="mb-5 p-4 flex items-center justify-between rounded-2xl border text-sm backdrop-blur-md"
            style={{
              background: 'rgba(15,23,42,0.85)',
              borderColor: 'rgba(255,255,255,0.1)',
            }}
          >
            <div>
              <p className="text-white font-bold text-xs">Currently signed in as:</p>
              <p className="text-cyan-300 font-mono text-[11px] mt-0.5">{user.name} — {user.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (user.role === 'teacher') navigate('/teacher/dashboard');
                  else if (user.role === 'admin') navigate('/admin/dashboard');
                  else navigate('/student/dashboard');
                }}
                className="px-3 py-1.5 rounded-xl text-white font-bold text-[11px] transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #4f46e5, #06b6d4)' }}
              >
                Dashboard
              </button>
              <button
                type="button"
                onClick={() => logout()}
                className="p-1.5 rounded-xl border transition-all hover:scale-105"
                style={{ background: 'rgba(239,68,68,0.15)', borderColor: 'rgba(239,68,68,0.3)', color: '#fca5a5' }}
                title="Sign Out to switch account"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── Main Login Card ── */}
        <div
          className="rounded-3xl overflow-hidden backdrop-blur-2xl"
          style={{
            background: 'rgba(10,10,30,0.85)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: isStudent
              ? '0 25px 60px rgba(6,182,212,0.12), 0 0 0 1px rgba(34,211,238,0.05)'
              : '0 25px 60px rgba(99,102,241,0.15), 0 0 0 1px rgba(139,92,246,0.05)',
            transition: 'box-shadow 0.5s ease',
          }}
        >

          {/* ── Portal Selector Tabs ── */}
          <div
            className="grid grid-cols-2"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
          >
            {/* Student Tab */}
            <button
              type="button"
              onClick={() => handleTabSwitch('student')}
              className="relative flex flex-col items-center gap-2 py-5 px-4 transition-all duration-300 group"
              style={{
                background: isStudent
                  ? 'linear-gradient(180deg, rgba(6,182,212,0.12) 0%, rgba(6,182,212,0.04) 100%)'
                  : 'transparent',
                borderRight: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div
                className="flex items-center justify-center rounded-2xl transition-all duration-300"
                style={{
                  width: 48, height: 48,
                  background: isStudent
                    ? 'linear-gradient(135deg, rgba(6,182,212,0.25), rgba(34,211,238,0.15))'
                    : 'rgba(255,255,255,0.04)',
                  border: isStudent ? '1px solid rgba(34,211,238,0.35)' : '1px solid rgba(255,255,255,0.08)',
                  boxShadow: isStudent ? '0 0 20px rgba(6,182,212,0.2)' : 'none',
                }}
              >
                <GraduationCap
                  className="w-6 h-6 transition-colors duration-300"
                  style={{ color: isStudent ? '#22d3ee' : '#64748b' }}
                />
              </div>
              <div>
                <p
                  className="text-sm font-black tracking-tight transition-colors duration-300"
                  style={{ color: isStudent ? '#ffffff' : '#64748b' }}
                >
                  Student
                </p>
                <p
                  className="text-[10px] font-semibold transition-colors duration-300"
                  style={{ color: isStudent ? '#22d3ee' : '#475569' }}
                >
                  Candidate Portal
                </p>
              </div>
              {/* Active indicator bar */}
              {isStudent && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                  style={{ background: 'linear-gradient(90deg, #0891b2, #22d3ee)' }}
                />
              )}
            </button>

            {/* Faculty Tab */}
            <button
              type="button"
              onClick={() => handleTabSwitch('faculty')}
              className="relative flex flex-col items-center gap-2 py-5 px-4 transition-all duration-300 group"
              style={{
                background: !isStudent
                  ? 'linear-gradient(180deg, rgba(99,102,241,0.12) 0%, rgba(99,102,241,0.04) 100%)'
                  : 'transparent',
              }}
            >
              <div
                className="flex items-center justify-center rounded-2xl transition-all duration-300"
                style={{
                  width: 48, height: 48,
                  background: !isStudent
                    ? 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.15))'
                    : 'rgba(255,255,255,0.04)',
                  border: !isStudent ? '1px solid rgba(139,92,246,0.35)' : '1px solid rgba(255,255,255,0.08)',
                  boxShadow: !isStudent ? '0 0 20px rgba(99,102,241,0.2)' : 'none',
                }}
              >
                <BookOpen
                  className="w-6 h-6 transition-colors duration-300"
                  style={{ color: !isStudent ? '#a78bfa' : '#64748b' }}
                />
              </div>
              <div>
                <p
                  className="text-sm font-black tracking-tight transition-colors duration-300"
                  style={{ color: !isStudent ? '#ffffff' : '#64748b' }}
                >
                  Faculty
                </p>
                <p
                  className="text-[10px] font-semibold transition-colors duration-300"
                  style={{ color: !isStudent ? '#a78bfa' : '#475569' }}
                >
                  Examiner Portal
                </p>
              </div>
              {/* Active indicator bar */}
              {!isStudent && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                  style={{ background: 'linear-gradient(90deg, #4f46e5, #8b5cf6)' }}
                />
              )}
            </button>
          </div>

          {/* ── Form Area ── */}
          <div className="p-7">

            {/* Portal Info Badge */}
            <div
              className="flex items-center gap-3 p-3.5 rounded-2xl mb-6"
              style={{
                background: isStudent
                  ? 'rgba(6,182,212,0.07)'
                  : 'rgba(99,102,241,0.07)',
                border: isStudent
                  ? '1px solid rgba(34,211,238,0.15)'
                  : '1px solid rgba(139,92,246,0.15)',
              }}
            >
              <div
                className="flex items-center justify-center rounded-xl shrink-0"
                style={{
                  width: 36, height: 36,
                  background: isStudent ? 'rgba(6,182,212,0.15)' : 'rgba(99,102,241,0.15)',
                }}
              >
                {isStudent
                  ? <UserCheck className="w-5 h-5" style={{ color: '#22d3ee' }} />
                  : <Shield className="w-5 h-5" style={{ color: '#a78bfa' }} />
                }
              </div>
              <div>
                <p className="text-white font-bold text-xs">
                  {isStudent ? 'Student Candidate Terminal' : 'Faculty Examiner Console'}
                </p>
                <p className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>
                  {isStudent
                    ? 'Sign in to access your examinations and marksheets'
                    : 'Faculty credentials are authorized by the administration'}
                </p>
              </div>
            </div>

            {/* Alerts */}
            {sessionExpired && (
              <div
                className="mb-4 p-3.5 rounded-2xl flex items-center gap-2 text-xs"
                style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', color: '#fbbf24' }}
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Your session has expired. Please sign in again to continue.</span>
              </div>
            )}
            {error && (
              <div
                className="mb-4 p-3.5 rounded-2xl flex flex-col gap-2 text-xs"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5' }}
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
                {error.toLowerCase().includes('admin') && (
                  <Link
                    to="/admin/login"
                    className="mt-1 px-3 py-2 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 font-bold text-xs text-center transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>👑 Open Master Administrator Gateway (/admin/login)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-bold mb-1.5" style={{ color: '#94a3b8' }}>
                  {isStudent ? 'University / Registered Email' : 'Faculty Institutional Email'}
                </label>
                <div className="relative">
                  <Mail
                    className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2"
                    style={{ color: '#475569' }}
                  />
                  <input
                    id="login-email"
                    type="email"
                    required
                    autoComplete="off"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={isStudent ? 'student@gmail.com' : 'faculty@asg-iit.edu.in'}
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-white text-sm placeholder-slate-600 transition-all outline-none"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.09)',
                    }}
                    onFocus={(e) => {
                      e.target.style.border = isStudent
                        ? '1px solid rgba(34,211,238,0.5)'
                        : '1px solid rgba(139,92,246,0.5)';
                      e.target.style.boxShadow = isStudent
                        ? '0 0 0 3px rgba(6,182,212,0.1)'
                        : '0 0 0 3px rgba(99,102,241,0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.border = '1px solid rgba(255,255,255,0.09)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold mb-1.5" style={{ color: '#94a3b8' }}>
                  Account Password
                </label>
                <div className="relative">
                  <Lock
                    className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2"
                    style={{ color: '#475569' }}
                  />
                  <input
                    id="login-password"
                    type="password"
                    required
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-white text-sm placeholder-slate-600 transition-all outline-none"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.09)',
                    }}
                    onFocus={(e) => {
                      e.target.style.border = isStudent
                        ? '1px solid rgba(34,211,238,0.5)'
                        : '1px solid rgba(139,92,246,0.5)';
                      e.target.style.boxShadow = isStudent
                        ? '0 0 0 3px rgba(6,182,212,0.1)'
                        : '0 0 0 3px rgba(99,102,241,0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.border = '1px solid rgba(255,255,255,0.09)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                id="login-submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: isStudent
                    ? 'linear-gradient(135deg, #0891b2, #06b6d4)'
                    : 'linear-gradient(135deg, #4f46e5, #8b5cf6)',
                  color: '#ffffff',
                  boxShadow: isStudent
                    ? '0 8px 32px rgba(6,182,212,0.3)'
                    : '0 8px 32px rgba(99,102,241,0.3)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                {loading ? (
                  <span>Authenticating Session...</span>
                ) : (
                  <>
                    <span>
                      {isStudent ? 'Sign In — Student Portal' : 'Sign In — Faculty Portal'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Features mini strip */}
            <div
              className="mt-6 grid grid-cols-3 gap-2"
            >
              {isStudent ? (
                <>
                  <div className="flex flex-col items-center gap-1 p-2.5 rounded-xl" style={{ background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(34,211,238,0.1)' }}>
                    <Clock className="w-4 h-4" style={{ color: '#22d3ee' }} />
                    <span className="text-[10px] font-semibold text-center" style={{ color: '#94a3b8' }}>Timed Exams</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 p-2.5 rounded-xl" style={{ background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(34,211,238,0.1)' }}>
                    <Shield className="w-4 h-4" style={{ color: '#22d3ee' }} />
                    <span className="text-[10px] font-semibold text-center" style={{ color: '#94a3b8' }}>Proctored</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 p-2.5 rounded-xl" style={{ background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(34,211,238,0.1)' }}>
                    <Award className="w-4 h-4" style={{ color: '#22d3ee' }} />
                    <span className="text-[10px] font-semibold text-center" style={{ color: '#94a3b8' }}>Marksheet</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col items-center gap-1 p-2.5 rounded-xl" style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(139,92,246,0.1)' }}>
                    <BookOpen className="w-4 h-4" style={{ color: '#a78bfa' }} />
                    <span className="text-[10px] font-semibold text-center" style={{ color: '#94a3b8' }}>Exam Builder</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 p-2.5 rounded-xl" style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(139,92,246,0.1)' }}>
                    <UserCheck className="w-4 h-4" style={{ color: '#a78bfa' }} />
                    <span className="text-[10px] font-semibold text-center" style={{ color: '#94a3b8' }}>Student Monitor</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 p-2.5 rounded-xl" style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(139,92,246,0.1)' }}>
                    <Award className="w-4 h-4" style={{ color: '#a78bfa' }} />
                    <span className="text-[10px] font-semibold text-center" style={{ color: '#94a3b8' }}>Analytics</span>
                  </div>
                </>
              )}
            </div>

            {/* Register link (students only) */}
            {isStudent && (
              <div
                className="mt-5 text-center text-xs pt-4"
                style={{ borderTop: '1px solid rgba(255,255,255,0.06)', color: '#64748b' }}
              >
                New candidate?{' '}
                <Link
                  to="/register"
                  className="font-bold transition-colors hover:underline"
                  style={{ color: '#22d3ee' }}
                >
                  Register Candidate Account
                </Link>
              </div>
            )}
            {!isStudent && (
              <div
                className="mt-5 text-center text-xs pt-4"
                style={{ borderTop: '1px solid rgba(255,255,255,0.06)', color: '#64748b' }}
              >
                Faculty access is granted by the{' '}
                <span className="font-bold" style={{ color: '#a78bfa' }}>
                  Controller of Examinations
                </span>{' '}
                only.
              </div>
            )}
          </div>
        </div>

        {/* ── Bottom Institutional Seal ── */}
        <div className="mt-6 text-center">
          <p className="text-[11px] font-semibold tracking-widest uppercase" style={{ color: '#334155' }}>
            ASG-IIT • NAAC 'A+' Grade • AICTE Approved
          </p>
          <p className="text-[10px] mt-1" style={{ color: '#1e293b' }}>
            © 2026 ASG-IIT Examination Cell • All Rights Reserved
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
