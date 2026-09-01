import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-3xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-6">
        <GraduationCap className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-black text-white mb-2">404</h1>
      <h2 className="text-lg font-bold text-slate-300 mb-4">Page Not Found</h2>
      <p className="text-xs text-slate-400 max-w-sm mb-6">
        The requested academic resource or examination session could not be found.
      </p>
      <Link
        to="/"
        className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to OEMS Portal</span>
      </Link>
    </div>
  );
};

export default NotFoundPage;
