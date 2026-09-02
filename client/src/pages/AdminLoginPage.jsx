import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Key, Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff, Sparkles, Building2, ShieldCheck } from 'lucide-react';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim() || !adminKey.trim()) {
      setError('Please provide Email, Password, and Admin Master Key.');
      return;
    }

    setLoading(true);

    try {
      await adminLogin(email.trim(), password.trim(), adminKey.trim());
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid administrator credentials or master key.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Dark ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-amber-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full space-y-6 relative z-10">
        <div className="text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center shadow-xl shadow-amber-500/25 mb-4 border border-amber-400/30">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
            Restricted Access
          </span>
          <h2 className="text-2xl font-black tracking-tight text-white mt-2">
            Administrator Gateway
          </h2>
          <p className="mt-1 text-xs text-slate-400 font-medium">
            Controller of Examinations • Master Key Authentication
          </p>
        </div>

        <div className="bg-slate-900/90 backdrop-blur-2xl border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  autoComplete="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@oems.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Master Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-amber-300 flex items-center gap-1">
                  <Key className="w-3.5 h-3.5 text-amber-400" />
                  Admin Login Key (Master Key)
                </label>
                <button
                  type="button"
                  onClick={() => setAdminKey('GGIT-ADMIN-2026')}
                  className="text-[10px] text-amber-400 hover:text-amber-300 underline font-mono cursor-pointer"
                >
                  Auto-fill Key
                </button>
              </div>
              <div className="relative">
                <Key className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showKey ? 'text' : 'password'}
                  required
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  placeholder="e.g. GGIT-ADMIN-2026"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-amber-500/40 text-amber-200 text-xs font-mono placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  tabIndex={-1}
                >
                  {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Authorized Master Key: <code className="text-amber-400 font-bold">GGIT-ADMIN-2026</code>
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-600/25 transition-all disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating Administrator...</span>
              ) : (
                <>
                  <span>Unlock System Access Log Terminal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <Link to="/" className="text-xs text-slate-400 hover:text-slate-200 transition-colors">
              ← Return to Main Portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
