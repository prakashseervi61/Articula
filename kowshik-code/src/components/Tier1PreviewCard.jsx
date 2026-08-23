import React from 'react';
import { Sparkles, Lock, ArrowUpRight } from 'lucide-react';

export default function Tier1PreviewCard({ title, description, icon: Icon }) {
  return (
    <div className="clinical-card p-4 border-dashed border-indigo-200 bg-slate-50/70 relative overflow-hidden group">
      
      {/* Top Banner Tag */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-1.5 text-indigo-700">
          {Icon && <Icon className="w-4 h-4 text-indigo-600" />}
          <h4 className="font-semibold text-slate-800 text-xs">{title}</h4>
        </div>
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-mono font-semibold bg-indigo-100 text-indigo-800 border border-indigo-200">
          <Sparkles className="w-2.5 h-2.5 mr-1 text-indigo-600" />
          Tier 1 — Planned
        </span>
      </div>

      <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
        {description}
      </p>

      {/* Disabled UI Mockup Overlay Container */}
      <div className="bg-white p-3 rounded border border-slate-200 opacity-60 pointer-events-none select-none space-y-2">
        <div className="h-2.5 bg-slate-200 rounded w-3/4 animate-pulse"></div>
        <div className="h-2 bg-slate-100 rounded w-1/2"></div>
        <div className="flex items-center justify-between pt-1">
          <div className="h-6 w-16 bg-indigo-50 rounded border border-indigo-100"></div>
          <div className="h-6 w-16 bg-slate-100 rounded"></div>
        </div>
      </div>

      {/* Hover Information Overlay */}
      <div className="mt-2 text-[10px] text-indigo-700 font-mono flex items-center justify-between">
        <span className="flex items-center gap-1"><Lock className="w-3 h-3 text-indigo-500" /> In design for Tier 1 specification</span>
        <span className="text-slate-400 group-hover:text-indigo-600 transition-colors">See Roadmap →</span>
      </div>

    </div>
  );
}
