import React, { useEffect, useState, useRef } from 'react';
import { Timer, AlertTriangle } from 'lucide-react';

const CountdownTimer = ({ durationMinutes, onTimeUp, initialSecondsLeft }) => {
  // Total duration in seconds
  const totalSeconds = durationMinutes * 60;
  const [secondsLeft, setSecondsLeft] = useState(
    initialSecondsLeft !== undefined ? initialSecondsLeft : totalSeconds
  );
  const onTimeUpRef = useRef(onTimeUp);
  onTimeUpRef.current = onTimeUp;

  useEffect(() => {
    if (secondsLeft <= 0) {
      if (onTimeUpRef.current) {
        onTimeUpRef.current();
      }
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (onTimeUpRef.current) {
            onTimeUpRef.current();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Urgency status
  const isUrgent = secondsLeft <= 120; // under 2 minutes
  const isCritical = secondsLeft <= 60; // under 1 minute

  let timerStyles = 'bg-slate-800 text-slate-200 border-slate-700';
  let badgeStyles = 'bg-indigo-500/20 text-indigo-300';

  if (isCritical) {
    timerStyles = 'bg-rose-950/80 text-rose-200 border-rose-600/60 animate-pulse';
    badgeStyles = 'bg-rose-500/30 text-rose-200 font-bold';
  } else if (isUrgent) {
    timerStyles = 'bg-amber-950/80 text-amber-200 border-amber-600/60';
    badgeStyles = 'bg-amber-500/30 text-amber-200';
  }

  return (
    <div
      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border shadow-lg transition-all ${timerStyles}`}
    >
      {isCritical ? (
        <AlertTriangle className="w-4 h-4 text-rose-400 animate-bounce" />
      ) : (
        <Timer className={`w-4 h-4 ${isUrgent ? 'text-amber-400' : 'text-indigo-400'}`} />
      )}
      <div className="flex flex-col">
        <span className="text-[10px] uppercase tracking-wider font-semibold opacity-70">
          Time Remaining
        </span>
        <span className="font-mono text-base font-bold tracking-wider">
          {formattedTime}
        </span>
      </div>
    </div>
  );
};

export default CountdownTimer;
