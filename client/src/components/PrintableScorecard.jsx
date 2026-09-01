import React from 'react';
import { GraduationCap } from 'lucide-react';

const PrintableScorecard = ({ result, allStudentResults = [] }) => {
  if (!result || !result.exam) return null;

  const { student, exam, total_score, percentage, status } = result;

  // Compile list of subjects/exams
  // If allStudentResults is provided and has items, use it; otherwise use the current exam
  const subjectRows = allStudentResults && allStudentResults.length > 0
    ? allStudentResults
    : [result];

  const grandMaxMarks = subjectRows.reduce((sum, r) => sum + (r.exam?.total_marks || 0), 0);
  const grandMarksObtained = subjectRows.reduce((sum, r) => sum + (r.total_score || 0), 0);
  const grandPercentage = grandMaxMarks > 0 ? ((grandMarksObtained / grandMaxMarks) * 100).toFixed(1) : percentage;
  const isOverallPass = subjectRows.every((r) => r.status === 'Pass');

  return (
    <div className="bg-white text-slate-900 p-8 rounded-3xl border border-slate-300 shadow-2xl max-w-3xl mx-auto print:border-none print:shadow-none print:p-0 print:m-0 font-sans">
      {/* Official Institutional Header */}
      <div className="border-b-2 border-slate-900 pb-5 mb-6 text-center">
        <div className="flex items-center justify-center space-x-3 mb-2">
          <div className="w-12 h-12 bg-indigo-700 rounded-xl flex items-center justify-center text-white">
            <GraduationCap className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-950 uppercase">
              GG Institute of Technology
            </h1>
            <p className="text-[11px] font-bold text-indigo-700 uppercase tracking-widest">
              Office of the Controller of Examinations • Semester Grade Report
            </p>
          </div>
        </div>
        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
          Bachelor of Computer Applications (BCA) • Official Academic Marksheet
        </p>
      </div>

      {/* Primary Candidate Details (Name, Roll Number, Department, Year) */}
      <div className="bg-slate-50 border border-slate-300 rounded-xl p-4 mb-6 grid grid-cols-3 gap-4 text-xs">
        <div>
          <span className="text-[10px] font-bold text-slate-500 uppercase block">Candidate Name</span>
          <span className="text-base font-black text-slate-900">{student?.name || 'N/A'}</span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-500 uppercase block">University Roll Number</span>
          <span className="text-base font-mono font-black text-indigo-700">{student?.roll_no || 'N/A'}</span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-500 uppercase block">Department & Year</span>
          <span className="text-sm font-bold text-slate-900">
            {student?.department || 'BCA'} {student?.year ? `(${student.year})` : ''}
          </span>
        </div>
      </div>

      {/* Subject-Wise Marks Statement Table */}
      <div className="mb-6 overflow-hidden rounded-xl border border-slate-300">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-300 text-slate-800 font-bold uppercase text-[11px]">
              <th className="p-3 text-center w-12">#</th>
              <th className="p-3">Subject Code</th>
              <th className="p-3">Subject Title</th>
              <th className="p-3 text-center">Max Marks</th>
              <th className="p-3 text-center">Pass Marks</th>
              <th className="p-3 text-center font-black">Marks Obtained</th>
              <th className="p-3 text-center">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {subjectRows.map((row, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                <td className="p-3 text-center font-mono font-semibold text-slate-500">{idx + 1}</td>
                <td className="p-3 font-mono font-bold text-slate-800">
                  {row.exam?.subject?.subject_code || 'BCA301'}
                </td>
                <td className="p-3 font-semibold text-slate-900">
                  {row.exam?.subject?.subject_name || row.exam?.title}
                </td>
                <td className="p-3 text-center font-semibold text-slate-700">
                  {row.exam?.total_marks || 0}
                </td>
                <td className="p-3 text-center text-slate-600">
                  {row.exam?.passing_marks || 0}
                </td>
                <td className="p-3 text-center font-black text-sm text-indigo-700">
                  {row.total_score}
                </td>
                <td className="p-3 text-center">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      row.status === 'Pass'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          {/* Table Footer / Grand Total Summary */}
          <tfoot>
            <tr className="bg-slate-100 border-t-2 border-slate-400 font-bold text-slate-900 text-xs">
              <td colSpan={3} className="p-3 text-right uppercase font-black">
                Grand Total / Aggregate:
              </td>
              <td className="p-3 text-center font-black">{grandMaxMarks}</td>
              <td className="p-3 text-center text-slate-500">—</td>
              <td className="p-3 text-center font-black text-base text-indigo-700">
                {grandMarksObtained}
              </td>
              <td className="p-3 text-center">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase ${
                    isOverallPass
                      ? 'bg-emerald-600 text-white'
                      : 'bg-rose-600 text-white'
                  }`}
                >
                  {isOverallPass ? 'PASSED' : 'FAILED'} ({grandPercentage}%)
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Official Verification Signatures */}
      <div className="pt-10 border-t border-slate-300 grid grid-cols-2 gap-8 text-center text-xs text-slate-600">
        <div>
          <div className="h-8 flex items-end justify-center">
            <span className="font-mono text-[10px] text-slate-400 italic">Digitally Verified Record</span>
          </div>
          <div className="border-t border-slate-400 pt-1 font-bold text-slate-900">
            Course Instructor / Examiner
          </div>
          <p className="text-[10px] text-slate-500">Department of Computer Applications</p>
        </div>

        <div>
          <div className="h-8 flex items-end justify-center">
            <span className="font-mono text-[10px] text-slate-400 italic">Dr. V. Malhotra</span>
          </div>
          <div className="border-t border-slate-400 pt-1 font-bold text-slate-900">
            Controller of Examinations
          </div>
          <p className="text-[10px] text-slate-500">GG Institute of Technology (GGIT)</p>
        </div>
      </div>
    </div>
  );
};

export default PrintableScorecard;
