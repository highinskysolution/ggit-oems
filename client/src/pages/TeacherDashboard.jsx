import React, { useEffect, useState } from 'react';
import api from '../api/client';
import {
  Layers,
  BarChart3,
  BookOpen,
  PlusCircle,
  FolderPlus,
  Trash2,
  Edit3,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Users,
  Award,
  Clock,
  Sparkles,
  ArrowRight,
  Eye,
  FileSpreadsheet,
  AlertCircle,
  Loader2,
  X,
  ToggleLeft,
  ToggleRight,
  ShieldAlert,
  Zap,
  Check,
} from 'lucide-react';

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics', 'questions', 'create-exam', 'subjects'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Data states
  const [analytics, setAnalytics] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [exams, setExams] = useState([]);

  // Question Filter & Search states
  const [qSearch, setQSearch] = useState('');
  const [qSubjectFilter, setQSubjectFilter] = useState('');
  const [qDiffFilter, setQDiffFilter] = useState('');

  // Modals
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [selectedStudentResult, setSelectedStudentResult] = useState(null);
  const [showInlineQuestionForm, setShowInlineQuestionForm] = useState(false);

  // New Question Form State
  const [newQuestion, setNewQuestion] = useState({
    subject: '',
    question_text: '',
    options: ['', '', '', ''],
    correct_option: 0,
    marks: 1,
    difficulty: 'Medium',
    explanation: '',
  });

  // Inline Question inside Exam Wizard
  const [inlineQ, setInlineQ] = useState({
    question_text: '',
    options: ['', '', '', ''],
    correct_option: 0,
    marks: 1,
    difficulty: 'Medium',
    explanation: '',
  });

  // New Subject Form State
  const [newSubject, setNewSubject] = useState({
    subject_code: '',
    subject_name: '',
  });

  // New Exam Form State
  const [newExam, setNewExam] = useState({
    title: '',
    subject: '',
    duration_mins: 15,
    passing_marks: 3,
    instructions: '1. Total objective MCQs. 2. Auto-submission upon timer zero. 3. Anti-cheating window monitor active.',
    is_active: true,
    selectedQuestions: [],
  });

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, questionsRes, subjectsRes, examsRes] = await Promise.all([
        api.get('/results/analytics'),
        api.get('/questions'),
        api.get('/subjects'),
        api.get('/exams'),
      ]);

      if (analyticsRes.data.success) setAnalytics(analyticsRes.data);
      if (questionsRes.data.success) setQuestions(questionsRes.data.questions || []);
      if (subjectsRes.data.success) {
        setSubjects(subjectsRes.data.subjects || []);
        if (subjectsRes.data.subjects.length > 0 && !newQuestion.subject) {
          setNewQuestion((prev) => ({ ...prev, subject: subjectsRes.data.subjects[0]._id }));
          setNewExam((prev) => ({ ...prev, subject: subjectsRes.data.subjects[0]._id }));
        }
      }
      if (examsRes.data.success) setExams(examsRes.data.exams || []);
    } catch (err) {
      console.error('Fetch teacher data error:', err);
      setError('Failed to load faculty portal data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Filtered Questions
  const filteredQuestions = questions.filter((q) => {
    const matchesSearch = q.question_text.toLowerCase().includes(qSearch.toLowerCase());
    const matchesSubject = qSubjectFilter ? q.subject?._id === qSubjectFilter : true;
    const matchesDiff = qDiffFilter ? q.difficulty === qDiffFilter : true;
    return matchesSearch && matchesSubject && matchesDiff;
  });

  // Handlers for Questions
  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/questions', newQuestion);
      if (res.data.success) {
        setSuccessMsg('Question added to Question Bank successfully!');
        setShowAddQuestionModal(false);
        setNewQuestion({
          subject: subjects[0]?._id || '',
          question_text: '',
          options: ['', '', '', ''],
          correct_option: 0,
          marks: 1,
          difficulty: 'Medium',
          explanation: '',
        });
        fetchAllData();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create question.');
    }
  };

  // Real-time inline question creation directly inside Exam Creator
  const handleCreateInlineQuestion = async (e) => {
    e.preventDefault();
    setError('');
    if (!newExam.subject) {
      setError('Please select an Exam Subject first.');
      return;
    }

    try {
      const res = await api.post('/questions', {
        ...inlineQ,
        subject: newExam.subject,
      });

      if (res.data.success) {
        const createdQ = res.data.question;
        setSuccessMsg(`Created question & added to current exam!`);
        // Auto-select for this exam
        setNewExam((prev) => ({
          ...prev,
          selectedQuestions: [...prev.selectedQuestions, createdQ._id],
        }));
        // Reset inline form
        setInlineQ({
          question_text: '',
          options: ['', '', '', ''],
          correct_option: 0,
          marks: 1,
          difficulty: 'Medium',
          explanation: '',
        });
        setShowInlineQuestionForm(false);
        fetchAllData();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add inline question.');
    }
  };

  // Quick One-Click Question Generator for Subject
  const handleQuickGenerateQuestions = async () => {
    const currentSubId = qSubjectFilter || subjects[0]?._id;
    if (!currentSubId) return;

    const targetSubject = subjects.find((s) => s._id === currentSubId) || subjects[0];

    const samplePacks = [
      {
        subject: targetSubject._id,
        question_text: `Which principle in ${targetSubject.subject_name} ensures modular independence and fault isolation?`,
        options: ['High Cohesion & Low Coupling', 'Tight Coupling', 'Global State Access', 'Linear Dependency'],
        correct_option: 0,
        marks: 2,
        difficulty: 'Medium',
        explanation: 'High cohesion inside a module and loose coupling with outside components maximizes maintainability.',
      },
      {
        subject: targetSubject._id,
        question_text: `In standard academic curriculum for ${targetSubject.subject_code}, what is the time complexity of binary search on sorted data?`,
        options: ['O(N)', 'O(log N)', 'O(N^2)', 'O(1)'],
        correct_option: 1,
        marks: 1,
        difficulty: 'Easy',
        explanation: 'Binary search halves the search space at each comparison step, resulting in logarithmic O(log N) time.',
      },
      {
        subject: targetSubject._id,
        question_text: `Which testing technique verifies internal code logic, branches, and condition paths in ${targetSubject.subject_code}?`,
        options: ['White-Box Testing', 'Black-Box Testing', 'User Acceptance Testing', 'Boundary Value Analysis'],
        correct_option: 0,
        marks: 2,
        difficulty: 'Hard',
        explanation: 'White-box testing examines internal program structures, paths, and logic flows.',
      },
    ];

    try {
      const res = await api.post('/questions/bulk', { questions: samplePacks });
      if (res.data.success) {
        setSuccessMsg(`Generated ${samplePacks.length} new academic MCQs for ${targetSubject.subject_code}!`);
        fetchAllData();
      }
    } catch (err) {
      setError('Failed to generate sample questions.');
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    try {
      await api.delete(`/questions/${id}`);
      setSuccessMsg('Question deleted.');
      fetchAllData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete question.');
    }
  };

  // Handlers for Subjects
  const handleCreateSubject = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/subjects', newSubject);
      if (res.data.success) {
        setSuccessMsg('Subject added successfully!');
        setShowAddSubjectModal(false);
        setNewSubject({ subject_code: '', subject_name: '' });
        fetchAllData();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create subject.');
    }
  };

  const handleDeleteSubject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subject?')) return;
    try {
      await api.delete(`/subjects/${id}`);
      setSuccessMsg('Subject deleted.');
      fetchAllData();
    } catch (err) {
      setError(err.response?.data?.message || 'Cannot delete subject.');
    }
  };

  // Handlers for Exam Creation
  const handleToggleQuestionForExam = (qId) => {
    setNewExam((prev) => {
      const exists = prev.selectedQuestions.includes(qId);
      const updated = exists
        ? prev.selectedQuestions.filter((id) => id !== qId)
        : [...prev.selectedQuestions, qId];
      return { ...prev, selectedQuestions: updated };
    });
  };

  const handleSelectAllQuestionsForSubject = () => {
    const subjectQIds = questions
      .filter((q) => q.subject?._id === newExam.subject)
      .map((q) => q._id);

    const allSelected = subjectQIds.every((id) => newExam.selectedQuestions.includes(id));
    if (allSelected) {
      setNewExam((prev) => ({
        ...prev,
        selectedQuestions: prev.selectedQuestions.filter((id) => !subjectQIds.includes(id)),
      }));
    } else {
      setNewExam((prev) => ({
        ...prev,
        selectedQuestions: Array.from(new Set([...prev.selectedQuestions, ...subjectQIds])),
      }));
    }
  };

  // Calculate total marks for selected questions in exam creator
  const calculatedTotalMarks = newExam.selectedQuestions.reduce((acc, qId) => {
    const q = questions.find((item) => item._id === qId);
    return acc + (q?.marks || 1);
  }, 0);

  const handleCreateExam = async (e) => {
    e.preventDefault();
    setError('');

    if (newExam.selectedQuestions.length === 0) {
      setError('Please select at least one question from the Question Bank.');
      return;
    }

    try {
      const res = await api.post('/exams', {
        ...newExam,
        total_marks: calculatedTotalMarks,
        questions: newExam.selectedQuestions,
      });

      if (res.data.success) {
        setSuccessMsg('Examination created and published successfully!');
        setActiveTab('analytics');
        setNewExam({
          title: '',
          subject: subjects[0]?._id || '',
          duration_mins: 15,
          passing_marks: 3,
          instructions: '1. Total objective MCQs. 2. Auto-submission upon timer zero. 3. Anti-cheating window monitor active.',
          is_active: true,
          selectedQuestions: [],
        });
        fetchAllData();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create exam.');
    }
  };

  const handleToggleExamStatus = async (examId) => {
    try {
      await api.patch(`/exams/${examId}/toggle-status`);
      fetchAllData();
    } catch (err) {
      setError('Failed to update exam status.');
    }
  };

  const handleDeleteExam = async (examId) => {
    if (!window.confirm('Are you sure you want to delete this exam and its student submissions?')) return;
    try {
      await api.delete(`/exams/${examId}`);
      setSuccessMsg('Exam deleted.');
      fetchAllData();
    } catch (err) {
      setError('Failed to delete exam.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-3" />
        <p className="text-xs font-medium">Loading Faculty Management Suite...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Faculty Portal Header */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-purple-950/80 border border-indigo-500/30 p-6 sm:p-8 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Faculty Assessment & Proctoring Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Academic Examination Management
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Author categorized MCQs, configure timed exams in real-time, and audit anti-cheating logs.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-1.5 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-700/80">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'analytics'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics & Results</span>
          </button>

          <button
            onClick={() => setActiveTab('questions')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'questions'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Question Bank</span>
          </button>

          <button
            onClick={() => setActiveTab('create-exam')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'create-exam'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Exam Creator</span>
          </button>

          <button
            onClick={() => setActiveTab('subjects')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'subjects'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Subjects</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError('')}><X className="w-4 h-4" /></button>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* TAB 1: ANALYTICS & CLASS PERFORMANCE (FR-RE-04) */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Top Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 shadow-lg">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">Total Students</span>
              <span className="text-2xl font-black text-white">{analytics?.stats?.totalStudents || 0}</span>
              <span className="text-[10px] text-cyan-400 block mt-1">Enrolled candidates</span>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 shadow-lg">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">Total Exams</span>
              <span className="text-2xl font-black text-white">{analytics?.stats?.totalExams || 0}</span>
              <span className="text-[10px] text-indigo-400 block mt-1">Published assessments</span>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 shadow-lg">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">Questions Authored</span>
              <span className="text-2xl font-black text-white">{analytics?.stats?.totalQuestions || 0}</span>
              <span className="text-[10px] text-slate-400 block mt-1">In Question Bank</span>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 shadow-lg">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">Submissions</span>
              <span className="text-2xl font-black text-white">{analytics?.stats?.totalSubmissions || 0}</span>
              <span className="text-[10px] text-emerald-400 block mt-1">Graded answer sheets</span>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 shadow-lg">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">Class Pass Rate</span>
              <span className="text-2xl font-black text-emerald-400">{analytics?.stats?.overallPassRate || 0}%</span>
              <span className="text-[10px] text-emerald-400/80 block mt-1">
                Avg: {analytics?.stats?.overallAveragePercentage || 0}%
              </span>
            </div>
          </div>

          {/* Exam Summary Table */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-400" />
                  Examination Performance Summaries (FR-RE-04)
                </h2>
                <p className="text-xs text-slate-400">
                  Aggregated statistics per examination showing pass rates and score ranges
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900/80 border-b border-slate-700/80 text-slate-400 uppercase font-semibold">
                    <th className="p-3">Examination Title</th>
                    <th className="p-3">Subject</th>
                    <th className="p-3 text-center">Submissions</th>
                    <th className="p-3 text-center">Pass Rate</th>
                    <th className="p-3 text-center">Average Score</th>
                    <th className="p-3 text-center">High / Low</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50 text-slate-200">
                  {analytics?.examAnalytics?.map((ea) => (
                    <tr key={ea.examId} className="hover:bg-slate-750/50 transition-colors">
                      <td className="p-3 font-bold text-white">{ea.examTitle}</td>
                      <td className="p-3 font-mono text-indigo-300">{ea.subjectCode}</td>
                      <td className="p-3 text-center font-bold">{ea.submissions}</td>
                      <td className="p-3 text-center">
                        <span className={`font-bold ${ea.passRate >= 50 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {ea.passRate}%
                        </span>
                        <span className="text-[10px] text-slate-400 block">({ea.passCount}P / {ea.failCount}F)</span>
                      </td>
                      <td className="p-3 text-center font-bold text-white">
                        {ea.averageScore} / {ea.totalMarks} <span className="text-[10px] text-slate-400">({ea.averagePercentage}%)</span>
                      </td>
                      <td className="p-3 text-center font-mono text-slate-300">
                        <span className="text-emerald-400">{ea.highestScore}</span> / <span className="text-rose-400">{ea.lowestScore}</span>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleToggleExamStatus(ea.examId)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase transition-colors ${
                            ea.isActive
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-slate-700 text-slate-400'
                          }`}
                        >
                          {ea.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDeleteExam(ea.examId)}
                          className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                          title="Delete Exam"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Student Submissions & Anti-Cheating Logs */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              Recent Student Submissions & Proctoring Audits
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900/80 border-b border-slate-700/80 text-slate-400 uppercase font-semibold">
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Roll No</th>
                    <th className="p-3">Exam</th>
                    <th className="p-3 text-center">Score</th>
                    <th className="p-3 text-center">Percentage</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-center">Proctoring Flag</th>
                    <th className="p-3 text-right">Inspect Sheet</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50 text-slate-200">
                  {analytics?.recentResults?.map((r) => (
                    <tr key={r._id} className="hover:bg-slate-750/50 transition-colors">
                      <td className="p-3 font-bold text-white">{r.student?.name || 'Student'}</td>
                      <td className="p-3 font-mono text-cyan-300">{r.student?.roll_no || 'N/A'}</td>
                      <td className="p-3 text-slate-300">{r.exam?.title}</td>
                      <td className="p-3 text-center font-bold text-white">
                        {r.total_score} / {r.exam?.total_marks}
                      </td>
                      <td className="p-3 text-center font-bold text-slate-200">{r.percentage}%</td>
                      <td className="p-3 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            r.status === 'Pass'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        {r.tab_switch_count > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            <ShieldAlert className="w-3 h-3 text-rose-400" />
                            {r.tab_switch_count} Tab Switches
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <Check className="w-3 h-3" /> Clean
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={async () => {
                            const res = await api.get(`/results/${r._id}`);
                            if (res.data.success) {
                              setSelectedStudentResult(res.data.result);
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 font-semibold text-xs flex items-center gap-1 ml-auto transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Sheet</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: QUESTION BANK MANAGEMENT (FR-QB-01 to 04) */}
      {activeTab === 'questions' && (
        <div className="space-y-6">
          {/* Action Bar & Search / Filters */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search questions by text..."
                  value={qSearch}
                  onChange={(e) => setQSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Subject Filter */}
              <select
                value={qSubjectFilter}
                onChange={(e) => setQSubjectFilter(e.target.value)}
                className="py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none"
              >
                <option value="">All Subjects</option>
                {subjects.map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.subject_code} - {sub.subject_name}
                  </option>
                ))}
              </select>

              {/* Difficulty Filter */}
              <select
                value={qDiffFilter}
                onChange={(e) => setQDiffFilter(e.target.value)}
                className="py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none"
              >
                <option value="">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <button
                type="button"
                onClick={handleQuickGenerateQuestions}
                className="flex-1 md:flex-none px-3.5 py-2 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                title="Generate 3 curated MCQs for selected subject"
              >
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>+3 Sample MCQs</span>
              </button>

              <button
                onClick={() => setShowAddQuestionModal(true)}
                className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Question (MCQ)</span>
              </button>
            </div>
          </div>

          {/* Question List */}
          <div className="space-y-4">
            {filteredQuestions.length === 0 ? (
              <div className="p-8 text-center bg-slate-800/40 rounded-2xl border border-slate-700/60 text-slate-400 text-xs">
                No questions matching the search criteria. Click "Add Question (MCQ)" or "+3 Sample MCQs" to create questions.
              </div>
            ) : (
              filteredQuestions.map((q, idx) => (
                <div
                  key={q._id}
                  className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {q.subject?.subject_code}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          q.difficulty === 'Easy'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : q.difficulty === 'Hard'
                            ? 'bg-rose-500/20 text-rose-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {q.difficulty}
                      </span>
                      <span className="text-xs text-slate-400">
                        Weight: <strong className="text-cyan-300">{q.marks} Mark(s)</strong>
                      </span>
                    </div>

                    <button
                      onClick={() => handleDeleteQuestion(q._id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
                      title="Delete Question"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-sm font-semibold text-white">{q.question_text}</p>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {q.options?.map((opt, optIdx) => {
                      const isCorrect = optIdx === q.correct_option;
                      return (
                        <div
                          key={optIdx}
                          className={`p-2.5 rounded-xl border flex items-center justify-between ${
                            isCorrect
                              ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200 font-bold'
                              : 'bg-slate-900/60 border-slate-800 text-slate-300'
                          }`}
                        >
                          <span>
                            <strong className="font-mono mr-1.5">{String.fromCharCode(65 + optIdx)}.</strong>
                            {opt}
                          </span>
                          {isCorrect && (
                            <span className="text-[10px] text-emerald-400 uppercase font-bold bg-emerald-900/60 px-1.5 py-0.5 rounded">
                              Answer Key
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {q.explanation && (
                    <p className="text-xs text-slate-400 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800">
                      <strong className="text-indigo-300">Explanation:</strong> {q.explanation}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: EXAM CREATOR WIZARD WITH REAL-TIME ON-THE-FLY QUESTION CREATOR (FR-OE-01) */}
      {activeTab === 'create-exam' && (
        <div className="rounded-3xl bg-slate-800/80 border border-slate-700/80 p-6 sm:p-8 shadow-2xl space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-indigo-400" />
              Examination Creation Wizard (FR-OE-01)
            </h2>
            <p className="text-xs text-slate-400">
              Configure parameters, author questions in real-time or pick from Question Bank, and publish for student test rooms
            </p>
          </div>

          <form onSubmit={handleCreateExam} className="space-y-6">
            {/* Step 1: Basic Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Examination Title
                </label>
                <input
                  type="text"
                  required
                  value={newExam.title}
                  onChange={(e) => setNewExam({ ...newExam, title: e.target.value })}
                  placeholder="e.g. BCA301 - Mid-Term Database Systems Examination"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Subject / Course
                </label>
                <select
                  required
                  value={newExam.subject}
                  onChange={(e) => setNewExam({ ...newExam, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {subjects.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.subject_code} - {s.subject_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Duration (Minutes) (FR-OE-01)
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={newExam.duration_mins}
                  onChange={(e) => setNewExam({ ...newExam, duration_mins: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Passing Marks Threshold
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={newExam.passing_marks}
                  onChange={(e) => setNewExam({ ...newExam, passing_marks: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Real-time Inline Question Creator for Exam */}
            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-indigo-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    Real-Time Question Authoring (Add Questions Directly to this Exam)
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Write new MCQs on the fly and immediately attach them to this test
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowInlineQuestionForm(!showInlineQuestionForm)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
                >
                  {showInlineQuestionForm ? 'Close Form' : '+ Author Question On-the-Fly'}
                </button>
              </div>

              {showInlineQuestionForm && (
                <div className="pt-3 border-t border-indigo-800/50 space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Question Text</label>
                    <textarea
                      rows="2"
                      value={inlineQ.question_text}
                      onChange={(e) => setInlineQ({ ...inlineQ, question_text: e.target.value })}
                      placeholder="Type the question stem here..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-300">
                      4 Options (Select radio for correct answer)
                    </label>
                    {inlineQ.options.map((opt, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="inline_correct_opt"
                          checked={inlineQ.correct_option === idx}
                          onChange={() => setInlineQ({ ...inlineQ, correct_option: idx })}
                          className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="font-mono text-xs font-bold text-slate-400 w-4">
                          {String.fromCharCode(65 + idx)}.
                        </span>
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const updated = [...inlineQ.options];
                            updated[idx] = e.target.value;
                            setInlineQ({ ...inlineQ, options: updated });
                          }}
                          placeholder={`Option ${String.fromCharCode(65 + idx)} text`}
                          className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <label className="text-xs text-slate-300 font-semibold">Marks:</label>
                        <input
                          type="number"
                          min="1"
                          value={inlineQ.marks}
                          onChange={(e) => setInlineQ({ ...inlineQ, marks: Number(e.target.value) })}
                          className="w-16 px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                        />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <label className="text-xs text-slate-300 font-semibold">Difficulty:</label>
                        <select
                          value={inlineQ.difficulty}
                          onChange={(e) => setInlineQ({ ...inlineQ, difficulty: e.target.value })}
                          className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                        >
                          <option value="Easy">Easy</option>
                          <option value="Medium">Medium</option>
                          <option value="Hard">Hard</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleCreateInlineQuestion}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md"
                    >
                      Save & Attach to Exam
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Step 2: Question Selector with dynamic marks tally */}
            <div className="space-y-3 pt-4 border-t border-slate-700/60">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Select Questions from Question Bank ({newExam.selectedQuestions.length} Selected)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Calculated Total Marks: <strong className="text-cyan-400">{calculatedTotalMarks} Marks</strong>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSelectAllQuestionsForSubject}
                  className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs font-semibold text-slate-200 transition-colors"
                >
                  Select / Unselect All for Selected Subject
                </button>
              </div>

              {/* Questions Checklist */}
              <div className="max-h-72 overflow-y-auto space-y-2 border border-slate-700 rounded-2xl p-3 bg-slate-900/60">
                {questions.map((q) => {
                  const isChecked = newExam.selectedQuestions.includes(q._id);
                  const isMatchSubject = q.subject?._id === newExam.subject;

                  return (
                    <label
                      key={q._id}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer select-none transition-all ${
                        isChecked
                          ? 'bg-indigo-950/40 border-indigo-500/60 text-white'
                          : 'bg-slate-800/40 border-slate-700/50 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleQuestionForExam(q._id)}
                        className="mt-1 w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-600 focus:ring-indigo-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                            {q.subject?.subject_code}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            +{q.marks} Mark • {q.difficulty}
                          </span>
                        </div>
                        <p className="text-xs font-medium">{q.question_text}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Instructions & Active */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Special Instructions for Lobby Screen
              </label>
              <textarea
                rows="2"
                value={newExam.instructions}
                onChange={(e) => setNewExam({ ...newExam, instructions: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Publish Examination to Students</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: SUBJECT CATALOG (FR-QB-01) */}
      {activeTab === 'subjects' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-400" />
                Academic Subject Catalog (FR-QB-01)
              </h2>
              <p className="text-xs text-slate-400">
                Manage curriculum course codes and subject titles
              </p>
            </div>
            <button
              onClick={() => setShowAddSubjectModal(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all"
            >
              <FolderPlus className="w-4 h-4" />
              <span>Add Subject</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((s) => {
              const qCount = questions.filter((q) => q.subject?._id === s._id).length;
              const eCount = exams.filter((e) => e.subject?._id === s._id).length;

              return (
                <div
                  key={s._id}
                  className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-5 shadow-lg flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {s.subject_code}
                      </span>
                      <button
                        onClick={() => handleDeleteSubject(s._id)}
                        className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                        title="Delete Subject"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <h3 className="text-sm font-bold text-white mb-2">{s.subject_name}</h3>
                  </div>

                  <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                    <span>{qCount} Questions</span>
                    <span>{eCount} Exams</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL: Add Question */}
      {showAddQuestionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-indigo-400" />
                Add Multiple Choice Question (MCQ)
              </h3>
              <button onClick={() => setShowAddQuestionModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateQuestion} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Subject</label>
                  <select
                    value={newQuestion.subject}
                    onChange={(e) => setNewQuestion({ ...newQuestion, subject: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  >
                    {subjects.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.subject_code} - {s.subject_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Difficulty</label>
                  <select
                    value={newQuestion.difficulty}
                    onChange={(e) => setNewQuestion({ ...newQuestion, difficulty: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Question Text</label>
                <textarea
                  required
                  rows="3"
                  value={newQuestion.question_text}
                  onChange={(e) => setNewQuestion({ ...newQuestion, question_text: e.target.value })}
                  placeholder="Enter the question stem..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              {/* 4 Candidate Options */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">
                  4 Candidate Options (Select radio for Correct Answer Key)
                </label>
                {newQuestion.options.map((opt, optIdx) => (
                  <div key={optIdx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correct_opt"
                      checked={newQuestion.correct_option === optIdx}
                      onChange={() => setNewQuestion({ ...newQuestion, correct_option: optIdx })}
                      className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                      title="Mark as correct answer"
                    />
                    <span className="font-mono text-xs font-bold text-slate-400 w-4">
                      {String.fromCharCode(65 + optIdx)}.
                    </span>
                    <input
                      type="text"
                      required
                      value={opt}
                      onChange={(e) => {
                        const nextOpts = [...newQuestion.options];
                        nextOpts[optIdx] = e.target.value;
                        setNewQuestion({ ...newQuestion, options: nextOpts });
                      }}
                      placeholder={`Option ${String.fromCharCode(65 + optIdx)} text...`}
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500"
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Marks Weight</label>
                  <input
                    type="number"
                    min="1"
                    value={newQuestion.marks}
                    onChange={(e) => setNewQuestion({ ...newQuestion, marks: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Explanation (Optional)</label>
                  <input
                    type="text"
                    value={newQuestion.explanation}
                    onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
                    placeholder="Reasoning for review screen"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddQuestionModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
                >
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add Subject */}
      {showAddSubjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-indigo-400" />
                Add Academic Subject
              </h3>
              <button onClick={() => setShowAddSubjectModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Subject Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BCA306"
                  value={newSubject.subject_code}
                  onChange={(e) => setNewSubject({ ...newSubject, subject_code: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Subject Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Web Technologies & Cloud"
                  value={newSubject.subject_name}
                  onChange={(e) => setNewSubject({ ...newSubject, subject_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddSubjectModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
                >
                  Create Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Student Answer Sheet & Proctoring Inspector */}
      {selectedStudentResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Eye className="w-5 h-5 text-indigo-400" />
                  Student Graded Answer Sheet
                </h3>
                <p className="text-xs text-slate-400">
                  Student: <strong className="text-white">{selectedStudentResult.student?.name}</strong> ({selectedStudentResult.student?.roll_no})
                </p>
              </div>
              <button onClick={() => setSelectedStudentResult(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Score & Proctoring audit summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">Total Marks</p>
                  <p className="text-xl font-black text-white">
                    {selectedStudentResult.total_score} / {selectedStudentResult.exam?.total_marks} ({selectedStudentResult.percentage}%)
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    selectedStudentResult.status === 'Pass'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {selectedStudentResult.status}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">Anti-Cheating Window Audit</p>
                  <p className="text-sm font-bold text-white">
                    {selectedStudentResult.tab_switch_count || 0} Security Warning(s)
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                    (selectedStudentResult.tab_switch_count || 0) === 0
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-rose-500/20 text-rose-300'
                  }`}
                >
                  {(selectedStudentResult.tab_switch_count || 0) === 0 ? 'Clean Session' : 'Flagged'}
                </span>
              </div>
            </div>

            {/* Question by Question Inspection */}
            <div className="space-y-3">
              {selectedStudentResult.answers?.map((ans, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border text-xs ${
                    ans.isCorrect
                      ? 'bg-emerald-950/20 border-emerald-500/30'
                      : ans.selectedOption === -1
                      ? 'bg-slate-800/40 border-slate-700'
                      : 'bg-rose-950/20 border-rose-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-slate-200">Question {idx + 1}</span>
                    <span className="font-bold">
                      {ans.isCorrect ? '✅ Correct (+1)' : ans.selectedOption === -1 ? '⚪ Skipped' : '❌ Incorrect (0)'}
                    </span>
                  </div>
                  <p className="font-semibold text-white mb-2">{ans.questionId?.question_text}</p>
                  <p className="text-slate-400">
                    Selected Option:{' '}
                    <span className="font-bold text-slate-200">
                      {ans.selectedOption === -1 ? 'None' : `${String.fromCharCode(65 + ans.selectedOption)} (${ans.questionId?.options[ans.selectedOption]})`}
                    </span>
                  </p>
                  <p className="text-emerald-400">
                    Correct Option: <span className="font-bold">{String.fromCharCode(65 + ans.questionId?.correct_option)} ({ans.questionId?.options[ans.questionId?.correct_option]})</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
