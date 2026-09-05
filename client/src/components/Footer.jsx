import React from 'react';
import {
  GraduationCap,
  ShieldCheck,
  Building2,
  Award,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();

  if (location.pathname.includes('/take')) return null;

  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400 text-xs py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Institutional info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <span className="font-black text-sm text-white tracking-wide block">
                  ASG-IIT
                </span>
                <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">
                  Office of the Controller of Examinations
                </span>
              </div>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Premier Autonomous Institution of Higher Education & Research. Committed to transparent, merit-driven evaluation and state-of-the-art proctored assessment standards.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <Award className="w-3 h-3" /> NAAC 'A+' Grade
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                <ShieldCheck className="w-3 h-3" /> AICTE Approved
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                <Building2 className="w-3 h-3" /> UGC Autonomous
              </span>
            </div>
          </div>

          {/* Col 2: Academic Departments */}
          <div>
            <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              Academic Departments
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="hover:text-slate-200 transition-colors">
                Department of Computer Applications (BCA)
              </li>
              <li className="hover:text-slate-200 transition-colors">
                Department of Information Technology (BSc IT)
              </li>
              <li className="hover:text-slate-200 transition-colors">
                Department of Artificial Intelligence & Data Science (AI)
              </li>
              <li className="hover:text-slate-200 transition-colors">
                Postgraduate & Research Programmes (MCA / MSc)
              </li>
              <li className="hover:text-slate-200 transition-colors">
                Center for Advanced Computing & Security
              </li>
            </ul>
          </div>

          {/* Col 3: Institutional Portals & Services */}
          <div>
            <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-cyan-400" />
              Institutional Services
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/student/dashboard" className="text-slate-400 hover:text-cyan-300 transition-colors">
                  Candidate Examination Portal
                </Link>
              </li>
              <li>
                <Link to="/teacher/dashboard" className="text-slate-400 hover:text-indigo-300 transition-colors">
                  Faculty Evaluation & Question Management
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-slate-400 hover:text-slate-200 transition-colors">
                  Institutional SSO Authentication
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-slate-400 hover:text-slate-200 transition-colors">
                  Student Assessment Registration
                </Link>
              </li>
              <li className="text-slate-500 pt-1">
                Semester Evaluation Cycle: <strong className="text-slate-300">2025–2026</strong>
              </li>
            </ul>
          </div>

          {/* Col 4: Examination Cell & Campus Contact */}
          <div>
            <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
              Examination Cell & Campus
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>ASG-IIT Main Campus, Institutional Knowledge Park, Tech Zone 4</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="font-mono text-[11px] text-slate-300">coe@asg-iit.edu.in</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-mono text-[11px] text-slate-300">+91 (022) 2854-9900</span>
              </p>
              <div className="pt-2">
                <span className="inline-block px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                  Helpdesk: <span className="text-emerald-400 font-bold">Mon–Sat (9 AM – 5 PM)</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <p>© 2026 ASG-IIT. All institutional and academic rights reserved.</p>
          <div className="flex items-center gap-6 text-slate-400">
            <span className="hover:text-slate-200 cursor-pointer transition-colors">Academic Integrity Policy</span>
            <span>•</span>
            <span className="hover:text-slate-200 cursor-pointer transition-colors">Evaluation Guidelines</span>
            <span>•</span>
            <span className="hover:text-slate-200 cursor-pointer transition-colors">Terms of Assessment</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
