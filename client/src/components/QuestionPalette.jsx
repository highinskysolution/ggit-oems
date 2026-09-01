import React from 'react';
import { CheckCircle2, Bookmark, CircleDot, HelpCircle } from 'lucide-react';

const QuestionPalette = ({
  questions = [],
  currentIndex = 0,
  answers = {}, // { questionId: selectedOptionNumber }
  flaggedQuestions = {}, // { questionId: boolean }
  onSelectQuestion,
}) => {
  // Compute counts
  let answeredCount = 0;
  let flaggedCount = 0;
  let unansweredCount = 0;

  questions.forEach((q) => {
    const isAnswered = answers[q._id] !== undefined && answers[q._id] !== -1;
    const isFlagged = !!flaggedQuestions[q._id];

    if (isFlagged) flaggedCount++;
    if (isAnswered) answeredCount++;
    if (!isAnswered && !isFlagged) unansweredCount++;
  });

  return (
    <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-700 pb-3 mb-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <CircleDot className="w-4 h-4 text-indigo-400" />
          Question Palette
        </h3>
        <span className="text-xs text-slate-400 font-medium">
          {currentIndex + 1} / {questions.length}
        </span>
      </div>

      {/* Legend & Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4 text-center">
        <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-lg p-2">
          <div className="flex items-center justify-center gap-1 text-emerald-400 text-xs font-bold mb-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            {answeredCount}
          </div>
          <span className="text-[10px] text-emerald-300 font-medium">Answered</span>
        </div>

        <div className="bg-amber-950/40 border border-amber-500/30 rounded-lg p-2">
          <div className="flex items-center justify-center gap-1 text-amber-400 text-xs font-bold mb-0.5">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            {flaggedCount}
          </div>
          <span className="text-[10px] text-amber-300 font-medium">Review</span>
        </div>

        <div className="bg-slate-700/40 border border-slate-600/30 rounded-lg p-2">
          <div className="flex items-center justify-center gap-1 text-slate-400 text-xs font-bold mb-0.5">
            <span className="w-2 h-2 rounded-full bg-slate-500"></span>
            {unansweredCount}
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Remaining</span>
        </div>
      </div>

      {/* Interactive Number Buttons Grid */}
      <div className="grid grid-cols-5 gap-2 max-h-64 overflow-y-auto pr-1">
        {questions.map((q, idx) => {
          const isCurrent = idx === currentIndex;
          const isAnswered = answers[q._id] !== undefined && answers[q._id] !== -1;
          const isFlagged = !!flaggedQuestions[q._id];

          let btnClass = 'bg-slate-700/70 text-slate-300 border-slate-600 hover:bg-slate-600'; // default unanswered

          if (isFlagged) {
            btnClass = 'bg-amber-600 text-amber-50 border-amber-400 font-bold shadow-md shadow-amber-600/30';
          } else if (isAnswered) {
            btnClass = 'bg-emerald-600 text-white border-emerald-400 font-bold shadow-md shadow-emerald-600/30';
          }

          return (
            <button
              key={q._id}
              onClick={() => onSelectQuestion(idx)}
              className={`relative h-10 w-full rounded-xl border text-xs font-semibold flex items-center justify-center transition-all ${btnClass} ${
                isCurrent
                  ? 'ring-2 ring-indigo-400 ring-offset-2 ring-offset-slate-900 scale-105 z-10'
                  : ''
              }`}
              title={`Question ${idx + 1} (${isFlagged ? 'Review' : isAnswered ? 'Answered' : 'Not Answered'})`}
            >
              {idx + 1}
              {isFlagged && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border border-slate-900"></span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionPalette;
