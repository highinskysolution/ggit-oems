import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/client';
import {
  GraduationCap,
  Timer,
  BookOpen,
  Award,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  Loader2,
  HelpCircle,
  FileCheck,
  Building2,
  ShieldCheck,
  Lock,
} from 'lucide-react';

const ExamLobbyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [alreadyAttempted, setAlreadyAttempted] = useState(false);
  const [existingResultId, setExistingResultId] = useState(null);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    const fetchExamLobby = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/exams/${id}`);
        if (res.data.success) {
          setExam(res.data.exam);
        }

        // Check if already attempted
        const resultsRes = await api.get('/results/student');
        if (resultsRes.data.success) {
          const matched = resultsRes.data.results.find(
            (r) => r.exam && r.exam._id === id
          );
          if (matched) {
            setAlreadyAttempted(true);
            setExistingResultId(matched._id);
          }
        }
      } catch (err) {
        console.error('Fetch exam error:', err);
        setError(err.response?.data?.message || 'Failed to load exam lobby.');
      } finally {
        setLoading(false);
      }
    };

    fetchExamLobby();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-8 h-8 text-cyan-500 animate-spin mb-3" />
        <p className="text-xs font-medium">Entering ASG-IIT Examination Lobby...</p>
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center">
        <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-white mb-2">Examination Session Unavailable</h2>
        <p className="text-xs text-slate-400 mb-6">{error || 'Exam could not be found or is inactive.'}</p>
        <Link
          to="/student/dashboard"
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header card with ASG-IIT institutional seal */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-indigo-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              ASG-IIT
            </span>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Official Examination Session</span>
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white mb-3">
          {exam.title}
        </h1>
        <p className="text-xs text-slate-300 leading-relaxed">
          Subject: <strong className="text-white">{exam.subject?.subject_code} - {exam.subject?.subject_name}</strong> • Course Examiner: <span className="font-semibold text-cyan-300">{exam.created_by?.name || 'Faculty Member'}</span>
        </p>

        {/* Exam specifications grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-center">
            <Timer className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Duration</span>
            <span className="text-base font-black text-white">{exam.duration_mins} Minutes</span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-center">
            <BookOpen className="w-5 h-5 text-indigo-400 mx-auto mb-1" />
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Questions</span>
            <span className="text-base font-black text-white">{exam.questions?.length || 0} MCQs</span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-center">
            <Award className="w-5 h-5 text-amber-400 mx-auto mb-1" />
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Marks</span>
            <span className="text-base font-black text-white">{exam.total_marks} Marks</span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Passing Marks</span>
            <span className="text-base font-black text-emerald-400">{exam.passing_marks} Marks</span>
          </div>
        </div>
      </div>

      {/* Single-attempt restriction notice if already taken (FR-OE-02) */}
      {alreadyAttempted ? (
        <div className="rounded-3xl bg-amber-950/40 border border-amber-500/40 p-6 sm:p-8 text-center space-y-4 shadow-xl">
          <ShieldAlert className="w-12 h-12 text-amber-400 mx-auto" />
          <h2 className="text-xl font-bold text-amber-200">
            Assessment Already Submitted (Single Attempt Rule)
          </h2>
          <p className="text-xs text-slate-300 max-w-lg mx-auto">
            Under ASG-IIT Examination Regulations (IEEE 830 FR-OE-02), candidate submissions are restricted to one attempt per scheduled examination. Your marksheet and answers have been recorded.
          </p>
          <div className="pt-2">
            <Link
              to={`/student/results/${existingResultId}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg transition-all"
            >
              <FileCheck className="w-4 h-4" />
              <span>View Official Examination Marksheet</span>
            </Link>
          </div>
        </div>
      ) : (
        /* Examination Instructions & Proctoring Rules */
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
              <FileCheck className="w-5 h-5 text-cyan-400" />
              ASG-IIT Candidate Examination Guidelines & Code of Conduct
            </h3>
            <p className="text-xs text-slate-400">
              Please read all rules carefully before entering the secure examination room:
            </p>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold shrink-0">
                1
              </span>
              <p>
                <strong className="text-white">Live Countdown Timer & Auto-Submit:</strong> A synchronized timer counts down in real time. The evaluation engine will <strong>automatically submit all chosen answers</strong> at <code>00:00:00</code>.
              </p>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-rose-950/30 border border-rose-900/50">
              <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold shrink-0">
                2
              </span>
              <p>
                <strong className="text-rose-200">🛡️ Anti-Cheating Window Proctoring:</strong> Tab switching, window blurring, minimizing, or copying text triggers security violation alerts and logs warnings in your official transcript.
              </p>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold shrink-0">
                3
              </span>
              <p>
                <strong className="text-white">Interactive Question Palette:</strong> Green indicates answered questions, Yellow indicates flagged for review, and Gray indicates unanswered questions.
              </p>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0">
                4
              </span>
              <p>
                <strong className="text-white">Instant Evaluation:</strong> Upon submission, your marks, percentage, GPA rating, and question review are calculated immediately.
              </p>
            </div>
          </div>

          {/* Acknowledgment Checkbox */}
          <div className="pt-4 border-t border-slate-800">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-indigo-600 bg-slate-950 border-slate-700 focus:ring-indigo-500"
              />
              <span className="text-xs text-slate-300 font-medium">
                I hereby declare that I am the authorized student candidate and agree to adhere strictly to ASG-IIT examination regulations and anti-cheating policies.
              </span>
            </label>
          </div>

          {/* Start CTA */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              to="/student/dashboard"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
            >
              Cancel
            </Link>

            <button
              disabled={!agreed}
              onClick={() => navigate(`/student/exam/${exam._id}/take`)}
              className="py-3 px-6 rounded-2xl bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-40 disabled:pointer-events-none hover:scale-105"
            >
              <span>Begin Live Proctored Examination</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamLobbyPage;
