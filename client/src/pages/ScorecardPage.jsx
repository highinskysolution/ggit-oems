import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/client';
import confetti from 'canvas-confetti';
import PrintableScorecard from '../components/PrintableScorecard';
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  Printer,
  ArrowRight,
  Sparkles,
  HelpCircle,
  GraduationCap,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Loader2,
  BookOpen,
  Building2,
  ShieldCheck,
  Hash,
  User,
  Layers,
} from 'lucide-react';

const ScorecardPage = () => {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [allStudentResults, setAllStudentResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showReview, setShowReview] = useState(true);

  useEffect(() => {
    const fetchScorecard = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/results/${id}`);
        if (res.data.success) {
          setResult(res.data.result);
          setAllStudentResults(res.data.allStudentResults || [res.data.result]);

          // Fire celebratory confetti if Passed!
          if (res.data.result.status === 'Pass') {
            confetti({
              particleCount: 90,
              spread: 80,
              origin: { y: 0.6 },
              colors: ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6'],
            });
          }
        }
      } catch (err) {
        console.error('Fetch scorecard error:', err);
        setError('Failed to load evaluation marksheet.');
      } finally {
        setLoading(false);
      }
    };

    fetchScorecard();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-8 h-8 text-cyan-500 animate-spin mb-3" />
        <p className="text-xs font-medium">Generating official ASG-IIT marksheet display...</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center">
        <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-white mb-2">Marksheet Record Unavailable</h2>
        <p className="text-xs text-slate-400 mb-6">{error || 'Unable to retrieve result record.'}</p>
        <Link
          to="/student/dashboard"
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const { exam, student, total_score, percentage, status, correct_count, wrong_count, unanswered_count, time_taken_seconds, answers, tab_switch_count } = result;

  const isPassed = status === 'Pass';
  const durationMins = Math.floor((time_taken_seconds || 0) / 60);
  const durationSecs = (time_taken_seconds || 0) % 60;

  // Grade calculation
  let gradeLetter = 'F';
  if (percentage >= 90) gradeLetter = 'O (Outstanding)';
  else if (percentage >= 80) gradeLetter = 'A+ (Excellent)';
  else if (percentage >= 70) gradeLetter = 'A (Very Good)';
  else if (percentage >= 60) gradeLetter = 'B+ (Good)';
  else if (percentage >= 50) gradeLetter = 'B (Above Average)';
  else if (percentage >= 40) gradeLetter = 'C (Pass)';

  const subjectRows = allStudentResults.length > 0 ? allStudentResults : [result];
  const grandMaxMarks = subjectRows.reduce((sum, r) => sum + (r.exam?.total_marks || 0), 0);
  const grandMarksObtained = subjectRows.reduce((sum, r) => sum + (r.total_score || 0), 0);
  const grandPercentage = grandMaxMarks > 0 ? ((grandMarksObtained / grandMaxMarks) * 100).toFixed(1) : percentage;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold mb-2">
            <Building2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>ASG-IIT • Official Academic Marksheet</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Semester Examination Marks Statement
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Official evaluation record for <strong className="text-white">{student?.name}</strong> • Roll No: <strong className="font-mono text-cyan-300">{student?.roll_no}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/25 hover:scale-[1.02]"
            title="Print Official ASG-IIT Marksheet"
          >
            <Printer className="w-4 h-4 text-white" />
            <span>Print Official Marksheet</span>
          </button>

          <Link
            to="/student/dashboard"
            className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md hover:scale-[1.02]"
          >
            <span>Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Primary Candidate Card: NAME, ROLL NUMBER & OVERALL RESULT */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/90 to-slate-900 border border-indigo-500/40 p-6 sm:p-8 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Candidate Name */}
          <div className="flex items-center space-x-3.5 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
            <div className="w-11 h-11 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
              <User className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Candidate Name</span>
              <span className="text-base font-black text-white">{student?.name}</span>
              <span className="text-[11px] text-cyan-300 font-semibold block">
                {student?.department || 'BCA'} {student?.year ? `(${student.year})` : ''}
              </span>
            </div>
          </div>

          {/* Roll Number */}
          <div className="flex items-center space-x-3.5 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
            <div className="w-11 h-11 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0">
              <Hash className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">University Roll Number</span>
              <span className="text-base font-mono font-black text-cyan-300">{student?.roll_no || 'BCA2024001'}</span>
              <span className="text-[11px] text-slate-400 block">ASG-IIT Registered ID</span>
            </div>
          </div>

          {/* Status & Grade */}
          <div className="flex items-center space-x-3.5 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${isPassed ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400' : 'bg-rose-500/20 border border-rose-500/30 text-rose-400'}`}>
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Semester Status</span>
              <span className={`text-base font-black ${isPassed ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isPassed ? 'PASSED' : 'FAILED'} ({percentage}%)
              </span>
              <span className="text-[11px] text-indigo-300 font-bold block">{gradeLetter}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subject-Wise Marks Display Table (Requested in Audio) */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            Subject-Wise Marks Statement (All Subjects)
          </h2>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-slate-800 text-cyan-300 border border-slate-700">
            {subjectRows.length} Subject(s) Evaluated
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase font-bold text-[11px] tracking-wider">
                <th className="p-3 text-center w-12">#</th>
                <th className="p-3">Subject Code</th>
                <th className="p-3">Subject Title</th>
                <th className="p-3 text-center">Max Marks</th>
                <th className="p-3 text-center">Pass Marks</th>
                <th className="p-3 text-center font-black">Marks Obtained</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 text-slate-200">
              {subjectRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-850/50 transition-colors">
                  <td className="p-3 text-center font-mono font-semibold text-slate-500">{idx + 1}</td>
                  <td className="p-3 font-mono font-bold text-indigo-300">
                    {row.exam?.subject?.subject_code || 'BCA301'}
                  </td>
                  <td className="p-3 font-bold text-white">
                    {row.exam?.subject?.subject_name || row.exam?.title}
                  </td>
                  <td className="p-3 text-center font-semibold text-slate-300">
                    {row.exam?.total_marks || 0}
                  </td>
                  <td className="p-3 text-center text-slate-400">
                    {row.exam?.passing_marks || 0}
                  </td>
                  <td className="p-3 text-center font-black text-sm text-cyan-400">
                    {row.total_score}
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                        row.status === 'Pass'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-950/90 border-t-2 border-slate-700 font-bold text-white text-xs">
                <td colSpan={3} className="p-3 text-right uppercase font-black">
                  Aggregate Total / Final Result:
                </td>
                <td className="p-3 text-center font-black text-slate-300">{grandMaxMarks}</td>
                <td className="p-3 text-center text-slate-500">—</td>
                <td className="p-3 text-center font-black text-base text-cyan-300">
                  {grandMarksObtained}
                </td>
                <td className="p-3 text-center">
                  <span
                    className={`inline-block px-3.5 py-1 rounded-full text-xs font-black uppercase ${
                      isPassed
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                        : 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                    }`}
                  >
                    {isPassed ? 'PASSED' : 'FAILED'} ({grandPercentage}%)
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Question by Question Review Accordion */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              Detailed Answer Key & Evaluation Review (FR-RE-03)
            </h3>
            <p className="text-xs text-slate-400">
              Question-by-question breakdown with chosen options and academic explanations
            </p>
          </div>
          <button
            onClick={() => setShowReview(!showReview)}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
          >
            <span>{showReview ? 'Collapse All' : 'Expand All'}</span>
            {showReview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {showReview && (
          <div className="space-y-4">
            {answers?.map((ansItem, idx) => {
              const q = ansItem.questionId;
              if (!q) return null;

              const isCorrect = ansItem.isCorrect;
              const isUnanswered = ansItem.selectedOption === -1;
              const userSelectedOption = ansItem.selectedOption;
              const correctOption = q.correct_option;

              return (
                <div
                  key={idx}
                  className={`rounded-2xl border p-5 transition-all ${
                    isCorrect
                      ? 'bg-emerald-950/20 border-emerald-500/30'
                      : isUnanswered
                      ? 'bg-slate-950/40 border-slate-800'
                      : 'bg-rose-950/20 border-rose-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-slate-800 text-slate-200 border border-slate-700">
                        Q{idx + 1}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400">
                        Marks: {ansItem.marksAwarded} / {q.marks || 1}
                      </span>
                    </div>

                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                        isCorrect
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : isUnanswered
                          ? 'bg-slate-700 text-slate-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" /> Correct (+{ansItem.marksAwarded})
                        </>
                      ) : isUnanswered ? (
                        'Not Attempted'
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" /> Incorrect (0)
                        </>
                      )}
                    </span>
                  </div>

                  {/* Question Text */}
                  <p className="text-sm font-semibold text-white mb-4">
                    {q.question_text}
                  </p>

                  {/* 4 Options Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-3">
                    {q.options?.map((opt, optIdx) => {
                      const isOptionCorrect = optIdx === correctOption;
                      const isOptionChosen = optIdx === userSelectedOption;

                      let optStyles = 'bg-slate-950/60 border-slate-800 text-slate-300';
                      if (isOptionCorrect) {
                        optStyles = 'bg-emerald-900/40 border-emerald-500 text-emerald-200 font-bold';
                      } else if (isOptionChosen && !isCorrect) {
                        optStyles = 'bg-rose-900/40 border-rose-500 text-rose-200 line-through';
                      }

                      return (
                        <div
                          key={optIdx}
                          className={`p-3 rounded-xl border flex items-center justify-between ${optStyles}`}
                        >
                          <div className="flex items-center space-x-2">
                            <span className="font-mono font-bold">{String.fromCharCode(65 + optIdx)}.</span>
                            <span>{opt}</span>
                          </div>
                          {isOptionCorrect && (
                            <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded">
                              Answer Key
                            </span>
                          )}
                          {isOptionChosen && !isOptionCorrect && (
                            <span className="text-[10px] uppercase font-bold text-rose-400 bg-rose-950 px-1.5 py-0.5 rounded">
                              Your Choice
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Academic Explanation */}
                  {q.explanation && (
                    <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300">
                      <p className="font-semibold text-indigo-300 mb-0.5">💡 Academic Explanation:</p>
                      <p className="text-slate-400">{q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Container for official print view */}
      <div className="hidden print:block">
        <PrintableScorecard result={result} allStudentResults={subjectRows} />
      </div>
    </div>
  );
};

export default ScorecardPage;
