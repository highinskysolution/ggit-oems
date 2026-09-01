import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import {
  Shield,
  Users,
  GraduationCap,
  Layers,
  Search,
  Clock,
  Calendar,
  CheckCircle2,
  RefreshCw,
  Loader2,
  AlertCircle,
  Hash,
  Mail,
  User,
  Building2,
  Activity,
  UserPlus,
  X,
  Lock,
  LogOut,
  KeyRound,
  ArrowRight,
} from 'lucide-react';

const DEPARTMENTS = ['BCA', 'BSc IT', 'AI'];

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalStudents: 0, totalTeachers: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthError, setIsAuthError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Modal State for Authorizing Faculty Member
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [facultyForm, setFacultyForm] = useState({
    name: '',
    email: '',
    department: 'BCA',
    password: '',
  });
  const [modalLoading, setModalLoading] = useState(false);
  const [modalMsg, setModalMsg] = useState({ type: '', text: '' });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      setIsAuthError(false);

      const res = await api.get('/auth/users');
      if (res.data.success) {
        setUsers(res.data.users || []);
        setStats(res.data.stats || {
          totalUsers: res.data.users?.length || 0,
          totalStudents: res.data.users?.filter((u) => u.role === 'student').length || 0,
          totalTeachers: res.data.users?.filter((u) => u.role === 'teacher').length || 0,
        });
      }
    } catch (err) {
      console.error('Fetch users error:', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setIsAuthError(true);
        setError('Your administrator session has expired or requires authentication with the Master Key.');
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to load user access logs.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateFaculty = async (e) => {
    e.preventDefault();
    setModalMsg({ type: '', text: '' });
    setModalLoading(true);

    try {
      const res = await api.post('/auth/faculty', facultyForm);
      if (res.data.success) {
        setModalMsg({ type: 'success', text: res.data.message });
        setFacultyForm({ name: '', email: '', department: 'BCA', password: '' });
        fetchUsers();
        setTimeout(() => {
          setIsModalOpen(false);
          setModalMsg({ type: '', text: '' });
        }, 1500);
      }
    } catch (err) {
      setModalMsg({
        type: 'error',
        text: err.response?.data?.message || err.message || 'Failed to create faculty account.',
      });
    } finally {
      setModalLoading(false);
    }
  };

  // Filter users based on search and role
  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      u.name?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term) ||
      u.roll_no?.toLowerCase().includes(term) ||
      u.department?.toLowerCase().includes(term);

    return matchesRole && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold mb-2">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>GGIT • System User Access & Login Activity Terminal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Registered Users & Login Audit Log
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time tracking of all students and faculty members registered and logged into GGIT
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition-all"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Authorize Faculty</span>
          </button>

          <button
            onClick={fetchUsers}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 transition-all shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : ''}`} />
            <span>Refresh Log</span>
          </button>

          <button
            onClick={() => {
              logout();
              navigate('/admin/login');
            }}
            className="px-3 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
            title="Sign Out of Admin Terminal"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock</span>
          </button>
        </div>
      </div>

      {/* Auth Error or Normal Error Alert with 1-click Re-login */}
      {error && (
        <div className="p-5 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-slate-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white text-sm">Session Authentication Required</p>
              <p className="text-slate-300 text-xs mt-0.5">{error}</p>
            </div>
          </div>
          <Link
            to="/admin/login"
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-600/25 transition-all shrink-0"
          >
            <KeyRound className="w-4 h-4" />
            <span>Sign In to Admin Gateway</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Active Users</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{stats.totalUsers}</div>
          <span className="text-[11px] text-amber-400 font-semibold flex items-center gap-1 mt-1">
            <Activity className="w-3 h-3" /> System Accounts In Database
          </span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Student Candidates</span>
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-cyan-300">{stats.totalStudents}</div>
          <span className="text-[11px] text-slate-400 font-semibold mt-1 block">
            Registered Candidates (FY, SY, TY)
          </span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:border-indigo-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Faculty Examiners</span>
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-indigo-300">{stats.totalTeachers}</div>
          <span className="text-[11px] text-slate-400 font-semibold mt-1 block">
            Admin-Authorized Course Instructors
          </span>
        </div>
      </div>

      {/* Main Log Table Section */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          {/* Role Filter Tabs */}
          <div className="flex items-center space-x-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold">
            <button
              onClick={() => setRoleFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                roleFilter === 'all'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Users ({users.length})
            </button>
            <button
              onClick={() => setRoleFilter('student')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                roleFilter === 'student'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Students ({stats.totalStudents})
            </button>
            <button
              onClick={() => setRoleFilter('teacher')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                roleFilter === 'teacher'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Faculty ({stats.totalTeachers})
            </button>
          </div>

          {/* Search Input */}
          <div className="relative min-w-[280px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, roll no, or email..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
            />
          </div>
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin mb-3" />
            <p className="text-xs font-semibold">Loading access activity log...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No matching users found in the system log.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase font-bold text-[11px] tracking-wider">
                  <th className="p-3.5 text-center w-12">#</th>
                  <th className="p-3.5">User Name</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5">Department & Year</th>
                  <th className="p-3.5">University Roll No</th>
                  <th className="p-3.5">Email Address</th>
                  <th className="p-3.5">Last Logged In</th>
                  <th className="p-3.5">Account Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 text-slate-200">
                {filteredUsers.map((u, idx) => (
                  <tr key={u._id || idx} className="hover:bg-slate-850/50 transition-colors">
                    <td className="p-3.5 text-center font-mono font-semibold text-slate-500">
                      {idx + 1}
                    </td>

                    {/* User Name */}
                    <td className="p-3.5">
                      <div className="flex items-center space-x-2.5">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                          u.role === 'admin'
                            ? 'bg-amber-500/20 text-amber-300'
                            : u.role === 'teacher'
                            ? 'bg-indigo-500/20 text-indigo-300'
                            : 'bg-cyan-500/20 text-cyan-300'
                        }`}>
                          {u.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-black text-white text-xs">{u.name}</p>
                          <span className="text-[10px] text-slate-400 capitalize">{u.role}</span>
                        </div>
                      </div>
                    </td>

                    {/* Role Badge */}
                    <td className="p-3.5">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          u.role === 'admin'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : u.role === 'teacher'
                            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                            : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        }`}
                      >
                        {u.role === 'admin' ? 'Master Admin' : u.role === 'teacher' ? 'Faculty' : 'Student'}
                      </span>
                    </td>

                    {/* Department & Year */}
                    <td className="p-3.5">
                      <span className="font-bold text-slate-200">
                        {u.department || 'BCA'}
                      </span>
                      {u.year && u.year !== 'N/A' && (
                        <span className="ml-1.5 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">
                          {u.year}
                        </span>
                      )}
                    </td>

                    {/* Roll No */}
                    <td className="p-3.5 font-mono">
                      {u.roll_no ? (
                        <span className="font-bold text-cyan-300">{u.roll_no}</span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>

                    {/* Email */}
                    <td className="p-3.5 text-slate-300 font-mono text-[11px]">
                      {u.email}
                    </td>

                    {/* Last Logged In Timestamp */}
                    <td className="p-3.5 text-slate-300">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                        <Clock className="w-3.5 h-3.5 text-emerald-400" />
                        <span>
                          {u.last_login
                            ? new Date(u.last_login).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : 'Never Logged In'}
                        </span>
                      </div>
                    </td>

                    {/* Created Date */}
                    <td className="p-3.5 text-slate-400 text-[11px]">
                      {u.createdAt
                        ? new Date(u.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Authorize New Faculty Member */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold mb-2">
                <UserPlus className="w-3.5 h-3.5 text-indigo-400" />
                <span>Admin Provisioning</span>
              </div>
              <h3 className="text-xl font-black text-white">Authorize Faculty Examiner</h3>
              <p className="text-xs text-slate-400 mt-1">
                Create login credentials for a verified instructor (BCA, BSc IT, AI)
              </p>
            </div>

            {modalMsg.text && (
              <div
                className={`p-3.5 rounded-2xl text-xs flex items-center gap-2 ${
                  modalMsg.type === 'success'
                    ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
                }`}
              >
                {modalMsg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{modalMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleCreateFaculty} autoComplete="off" className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Faculty Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={facultyForm.name}
                    onChange={(e) => setFacultyForm({ ...facultyForm, name: e.target.value })}
                    placeholder="e.g. Prof. Anjali Roy"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Faculty Institutional Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={facultyForm.email}
                    onChange={(e) => setFacultyForm({ ...facultyForm, email: e.target.value })}
                    placeholder="e.g. anjali@ggit.edu"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Assigned Department
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {DEPARTMENTS.map((dept) => (
                    <button
                      key={dept}
                      type="button"
                      onClick={() => setFacultyForm({ ...facultyForm, department: dept })}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                        facultyForm.department === dept
                          ? 'bg-indigo-600 border-indigo-500 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Temporary Password (min 6 characters)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    value={facultyForm.password}
                    onChange={(e) => setFacultyForm({ ...facultyForm, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={modalLoading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all disabled:opacity-50"
              >
                {modalLoading ? (
                  <span>Authorizing Account...</span>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Authorize & Save Faculty Member</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
