import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  Lock,
  Mail,
  User,
  Building,
  Hash,
  ArrowRight,
  AlertCircle,
  Calendar,
  Sparkles,
  CheckCircle2,
  Info,
} from 'lucide-react';

const DEPARTMENTS = [
  { id: 'BCA', name: 'BCA', desc: 'Bachelor of Computer Applications' },
  { id: 'BSc IT', name: 'BSc IT', desc: 'B.Sc Information Technology' },
  { id: 'AI', name: 'AI', desc: 'Artificial Intelligence & Data Science' },
];

const YEARS = [
  { id: 'FY', name: 'FY', desc: 'First Year' },
  { id: 'SY', name: 'SY', desc: 'Second Year' },
  { id: 'TY', name: 'TY', desc: 'Third Year' },
];

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    roll_no: '',
    department: 'BCA',
    year: 'FY',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    let value = e.target.value;
    if (e.target.name === 'roll_no') {
      // Clean and auto-uppercase roll number
      value = value.toUpperCase().replace(/[^A-Z0-9_-]/g, '').slice(0, 15);
    }
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Roll number validation
    if (!formData.roll_no || formData.roll_no.trim().length < 4) {
      setError('Please provide a valid University Roll Number (at least 4 characters, e.g. BCA2024001).');
      return;
    }

    setLoading(true);

    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: 'student',
        roll_no: formData.roll_no.trim(),
        department: formData.department,
        year: formData.year,
      });
      navigate('/student/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-xl w-full space-y-6 relative z-10">
        {/* Institutional Header */}
        <div className="text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-500 flex items-center justify-center shadow-xl shadow-cyan-500/25 mb-4 border border-cyan-400/30">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            GG Institute of Technology
          </h2>
          <p className="mt-1 text-xs text-cyan-300 font-semibold tracking-wide">
            Student Candidate Registration Portal
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-slate-900/90 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          {error && (
            <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
            {/* 1. Department Selection (BCA, BSc IT, AI) */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                1. Select Academic Department
              </label>
              <div className="grid grid-cols-3 gap-2">
                {DEPARTMENTS.map((dept) => (
                  <button
                    key={dept.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, department: dept.id })}
                    className={`p-3 rounded-2xl text-left border transition-all ${
                      formData.department === dept.id
                        ? 'bg-gradient-to-r from-cyan-950 to-slate-900 border-cyan-500 text-white ring-1 ring-cyan-500/50 shadow-md shadow-cyan-950'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <span className="block font-black text-xs text-white">{dept.name}</span>
                    <span className="text-[10px] text-slate-400 line-clamp-1">{dept.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Year Selection (FY, SY, TY) */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                2. Academic Year Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {YEARS.map((yr) => (
                  <button
                    key={yr.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, year: yr.id })}
                    className={`py-2.5 px-3 rounded-2xl text-center border transition-all ${
                      formData.year === yr.id
                        ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 font-bold shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-xs font-black block">{yr.name}</span>
                    <span className="text-[10px] text-slate-400">{yr.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Full Candidate Name */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Full Candidate Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* 4. Institutional Email */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Institutional Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@ggit.edu or candidate@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* 5. Roll Number (Strict Unique Validation) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  University Roll Number (Unique ID)
                </label>
                <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                  Max 15 Chars • No Repetition
                </span>
              </div>
              <div className="relative">
                <Hash className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="roll_no"
                  required
                  maxLength={15}
                  value={formData.roll_no}
                  onChange={handleChange}
                  placeholder={`e.g. ${formData.department.replace(' ', '')}2024001`}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono font-bold placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all tracking-wider"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Must be unique across GGIT (e.g. <code>{formData.department.replace(' ', '')}2024001</code>).
              </p>
            </div>

            {/* 6. Password */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Account Password (min 6 characters)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/25 transition-all disabled:opacity-50 hover:scale-[1.01]"
            >
              {loading ? (
                <span>Registering Student Candidate...</span>
              ) : (
                <>
                  <span>Register as Student ({formData.department} - {formData.year})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Teacher account notice */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
            <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <span>
              <strong>Faculty Notice:</strong> Teacher accounts are authorized exclusively by the Administrator. If you are an instructor, please sign in with your faculty credentials.
            </span>
          </div>

          <div className="text-center text-xs text-slate-400 border-t border-slate-800 pt-4">
            Already registered with GGIT?{' '}
            <Link
              to="/login"
              className="font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Sign In to Portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
