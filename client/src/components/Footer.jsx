import React from 'react';
import { GraduationCap, ShieldCheck, Code, CheckCircle2, Building2, Award } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();

  if (location.pathname.includes('/take')) return null;

  return (
    <footer className="border-t border-slate-850 bg-slate-950 text-slate-400 text-xs py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Institutional info */}
          <div className="space-y-3.5 md:col-span-2">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-md">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <span className="font-black text-sm text-white tracking-wide block">
                  GG Institute of Technology (GGIT)
                </span>
                <span className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider">
                  Controller of Examinations • Digital Assessment Division
                </span>
              </div>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-lg">
              Official institutional examination portal for the Department of Computer Applications (BCA). Engineered with real-time countdown synchronization, automated grading, anti-cheating window monitors, and IEEE 830 compliant evaluation standards.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3" /> NAAC 'A+' Accredited
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                <ShieldCheck className="w-3 h-3" /> Anti-Cheating Proctoring
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                <Award className="w-3 h-3" /> IEEE 830 Standard
              </span>
            </div>
          </div>

          {/* Col 2: Institutional Portals */}
          <div>
            <h4 className="text-white font-bold mb-3.5 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              GGIT Portals
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/student/dashboard" className="hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                  <span>Candidate Test Room</span>
                </Link>
              </li>
              <li>
                <Link to="/teacher/dashboard" className="hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                  <span>Faculty Examination Portal</span>
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                  <span>Student & Faculty Sign In</span>
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                  <span>New User Registration</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Academic Department */}
          <div>
            <h4 className="text-white font-bold mb-3.5 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-cyan-400" />
              Department Details
            </h4>
            <div className="space-y-1.5 text-xs text-slate-400">
              <p><strong className="text-slate-300">Institute:</strong> GG Institute of Technology</p>
              <p><strong className="text-slate-300">Degree:</strong> Bachelor of Computer Applications (BCA)</p>
              <p><strong className="text-slate-300">Course:</strong> Software Engineering (SE)</p>
              <p><strong className="text-slate-300">Session:</strong> Academic Year 2026</p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/80 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <p>© 2026 GG Institute of Technology (GGIT). All academic evaluation and examination rights reserved.</p>
          <p className="flex items-center gap-1 text-slate-400">
            Official Examination System • Powered by MERN Stack
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
