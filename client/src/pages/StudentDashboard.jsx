import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import {
  GraduationCap,
  BookOpen,
  Timer,
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Sparkles,
  FileText,
  AlertCircle,
  Loader2,
  Calendar,
  Layers,
  User,
  Building2,
  ShieldCheck,
  Zap,
  TrendingUp,
  Cpu,
  Database,
  Code2,
  Network,
  Layout,
  Terminal,
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [examsRes, resultsRes] = await Promise.all([
        api.get('/exams'),
        api.get('/results/student'),
      ]);

      if (examsRes.data.success) {
        setExams(examsRes.data.exams || []);
      }
      if (resultsRes.data.success) {
        setResults(resultsRes.data.results || []);
      }
    } catch (err) {
      console.error('Fetch student dashboard error:', err);
      setError('Failed to load examination data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Compute Metrics
  const totalTaken = results.length;
  const passedCount = results.filter((r) => r.status === 'Pass').length;
  const avgPercentage = totalTaken > 0
    ? (results.reduce((acc, curr) => acc + curr.percentage, 0) / totalTaken).toFixed(1)
    : 0;
  const pendingExams = exams.filter((e) => !e.isCompleted && e.is_active).length;

  // Helper to pick subject icon for the 6 core curriculum courses
  const getSubjectIcon = (code) => {
    if (code?.includes('301')) return <Layout className="w-5 h-5 text-cyan-400" />; // Web Framework
    if (code?.includes('302')) return <Cpu className="w-5 h-5 text-amber-400" />; // OS
    if (code?.includes('303')) return <Code2 className="w-5 h-5 text-indigo-400" />; // Java
    if (code?.includes('304')) return <Database className="w-5 h-5 text-emerald-400" />; // DBMS
    if (code?.includes('305')) return <Layers className="w-5 h-5 text-purple-400" />; // SE
    if (code?.includes('306')) return <Terminal className="w-5 h-5 text-blue-400" />; // Python
    return <BookOpen className="w-5 h-5 text-indigo-400" />;
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-8 h-8 text-cyan-500 animate-spin mb-3" />
        <p className="text-xs font-semibold tracking-wide">Accessing GGIT Candidate Portal...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner with University Identity */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-indigo-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
              <Building2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>GG Institute of Technology • Candidate Assessment Terminal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-xs text-slate-300 flex flex-wrap items-center gap-2">
              <span>University Roll No: <strong className="font-mono text-cyan-300">{user?.roll_no || 'N/A'}</strong></span>
              <span>•</span>
              <span>Department: <strong className="text-white">{user?.department || 'BCA'}</strong></span>
              <span>•</span>
              <span>Academic Year: <strong className="text-indigo-300 font-bold">{user?.year || 'FY'}</strong></span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold">Verified Candidate</span>
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={fetchData}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 transition-colors shadow-sm"
            >
              Refresh Portal
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Scheduled Active Tests</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white mb-1">{pendingExams}</div>
          <span className="text-[11px] text-cyan-400 font-semibold flex items-center gap-1">
            <Zap className="w-3 h-3" /> Ready for Live Attempt
          </span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-indigo-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed Exams</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white mb-1">{totalTaken}</div>
          <span className="text-[11px] text-slate-400 font-semibold">
            Official Evaluation Records
          </span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Passed Assessments</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-400 mb-1">{passedCount}</div>
          <span className="text-[11px] text-emerald-400/80 font-semibold">
            {totalTaken > 0 ? `${((passedCount / totalTaken) * 100).toFixed(0)}% Pass Rate` : 'No attempts recorded'}
          </span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Performance</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white mb-1">{avgPercentage}%</div>
          <span className="text-[11px] text-amber-400 font-semibold">
            Cumulative Academic Score
          </span>
        </div>
      </div>

      {/* Section 1: Active Scheduled Exams */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              Available Semester Examinations (GGIT Schedule)
            </h2>
            <p className="text-xs text-slate-400">
              Select an assessment to review proctoring guidelines and begin your live timed test
            </p>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-slate-900 text-indigo-300 border border-slate-800">
            {exams.length} Total Exams
          </span>
        </div>

        {exams.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 text-center text-slate-400">
            <p className="text-sm font-semibold">No active examinations available right now.</p>
            <p className="text-xs text-slate-500 mt-1">Please check back when your instructor schedules an exam.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {exams.map((exam) => {
              const isDone = exam.isCompleted;

              return (
                <div
                  key={exam._id}
                  className={`rounded-3xl border p-6 flex flex-col justify-between transition-all duration-300 shadow-xl ${
                    isDone
                      ? 'bg-slate-900/50 border-slate-800/80 opacity-90'
                      : 'bg-slate-900/90 border-cyan-500/30 hover:border-cyan-400 hover:shadow-cyan-500/10 hover:-translate-y-1'
                  }`}
                >
                  <div>
                    {/* Header tags */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-slate-800 border border-slate-700">
                          {getSubjectIcon(exam.subject?.subject_code)}
                        </div>
                        <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {exam.subject?.subject_code || 'BCA'}
                        </span>
                      </div>

                      {isDone ? (
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Submitted
                        </span>
                      ) : (
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                          Active
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-white mb-2 line-clamp-2">
                      {exam.title}
                    </h3>
                    <p className="text-xs text-slate-400 mb-5">
                      Subject: <span className="text-slate-200 font-semibold">{exam.subject?.subject_name}</span>
                    </p>

                    {/* Metadata chips */}
                    <div className="grid grid-cols-3 gap-2 bg-slate-950/80 p-3 rounded-2xl border border-slate-800 mb-6 text-center text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Duration</span>
                        <span className="font-bold text-slate-200 flex items-center justify-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-cyan-400" />
                          {exam.duration_mins}m
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Total Marks</span>
                        <span className="font-bold text-white mt-0.5 block">
                          {exam.total_marks} Marks
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Pass Threshold</span>
                        <span className="font-bold text-emerald-400 mt-0.5 block">
                          {exam.passing_marks} Marks
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div>
                    {isDone ? (
                      <Link
                        to={`/student/results/${exam.resultId}`}
                        className="w-full py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-all border border-slate-700"
                      >
                        <FileText className="w-4 h-4 text-emerald-400" />
                        <span>View Marksheet & Grade</span>
                      </Link>
                    ) : (
                      <Link
                        to={`/student/exam/${exam._id}/lobby`}
                        className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/20 transition-all hover:scale-[1.01]"
                      >
                        <span>Enter Exam Lobby & Start</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Section 2: Student Examination History */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-400" />
              Academic Examination Transcripts & Score History
            </h2>
            <p className="text-xs text-slate-400">
              Historical record of all your submitted exams with official GGIT evaluation records
            </p>
          </div>
        </div>

        {results.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 text-center text-slate-400">
            <p className="text-sm font-semibold">No examination records found yet.</p>
            <p className="text-xs text-slate-500 mt-1">Your completed exams and marksheets will appear here after you take a test.</p>
          </div>
        ) : (
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase font-bold tracking-wider">
                    <th className="p-4">Examination / Course</th>
                    <th className="p-4">Submission Date</th>
                    <th className="p-4 text-center">Score</th>
                    <th className="p-4 text-center">Percentage</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-center">Proctoring Log</th>
                    <th className="p-4 text-right">Official Marksheet</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  {results.map((res) => (
                    <tr key={res._id} className="hover:bg-slate-850/50 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-white text-xs">{res.exam?.title || 'Academic Exam'}</p>
                        <p className="text-[11px] text-indigo-300 font-mono">
                          {res.exam?.subject?.subject_code} - {res.exam?.subject?.subject_name}
                        </p>
                      </td>
                      <td className="p-4 text-slate-400 text-xs">
                        {new Date(res.submitted_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="p-4 text-center font-bold text-white text-xs">
                        {res.total_score} / {res.exam?.total_marks}
                      </td>
                      <td className="p-4 text-center font-mono font-bold text-xs">
                        <span className={res.percentage >= 50 ? 'text-emerald-400' : 'text-rose-400'}>
                          {res.percentage}%
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            res.status === 'Pass'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {res.status}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        {res.tab_switch_count > 0 ? (
                          <span className="text-[10px] font-bold text-rose-400 px-2 py-0.5 rounded-full bg-rose-950 border border-rose-800">
                            ⚠️ {res.tab_switch_count} Violations
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800">
                            🛡️ Clean
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          to={`/student/results/${res._id}`}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 text-xs font-bold transition-all shadow-sm"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>View Transcript</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
