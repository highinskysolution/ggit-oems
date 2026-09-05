import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  LogOut,
  User,
  Shield,
  BookOpen,
  Layers,
  Building2,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout, isStudent, isTeacher, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Keep live exam test room clean and distraction-free
  const isLiveExam = location.pathname.includes('/student/exam/') && location.pathname.includes('/take');
  if (isLiveExam) return null;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-2">
          {/* Brand Logo: ASG-IIT */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-all duration-300 border border-indigo-400/30">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-950 rounded-full flex items-center justify-center text-[9px] font-bold text-white">
                  ✓
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                    ASG-IIT
                  </span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                    OEMS 2.0
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-semibold tracking-wide hidden sm:block">
                  ASG-IIT • Examination Portal
                </p>
              </div>
            </Link>
          </div>

          {/* Navigation Links (when authenticated) */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center space-x-1.5">
              {isStudent && (
                <Link
                  to="/student/dashboard"
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    location.pathname === '/student/dashboard'
                      ? 'bg-indigo-600/25 text-indigo-200 border border-indigo-500/40 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-850'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <span>Candidate Dashboard</span>
                </Link>
              )}

              {isTeacher && (
                <Link
                  to="/teacher/dashboard"
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    location.pathname === '/teacher/dashboard'
                      ? 'bg-indigo-600/25 text-indigo-200 border border-indigo-500/40 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-850'
                  }`}
                >
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <span>Faculty Examination Portal</span>
                </Link>
              )}

              {isAdmin && (
                <>
                  <Link
                    to="/admin/dashboard"
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                      location.pathname === '/admin/dashboard'
                        ? 'bg-amber-600/25 text-amber-200 border border-amber-500/40 shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-850'
                    }`}
                  >
                    <Shield className="w-4 h-4 text-amber-400" />
                    <span>Controller of Examinations (Admin)</span>
                  </Link>
                  <Link
                    to="/teacher/dashboard"
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-850 transition-colors"
                  >
                    Faculty Suite
                  </Link>
                </>
              )}
            </nav>
          )}

          {/* Right Side: User Profile & Auth Links */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3 pl-2 border-l border-slate-800">
                <div className="flex flex-col items-end">
                  <span className="text-xs font-bold text-white">{user.name}</span>
                  <div className="flex items-center gap-1.5">
                    {user.roll_no && (
                      <span className="text-[10px] text-slate-400 font-mono">
                        {user.roll_no}
                      </span>
                    )}
                    <span
                      className={`text-[9px] px-2 py-0.2 rounded-full font-black uppercase tracking-wider ${
                        user.role === 'admin'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : user.role === 'teacher'
                          ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors border border-transparent hover:border-rose-500/20"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-bold text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 rounded-xl shadow-md shadow-indigo-600/30 transition-all"
                >
                  Register Account
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
