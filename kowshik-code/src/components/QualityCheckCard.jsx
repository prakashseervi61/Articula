import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Sliders, ShieldCheck } from 'lucide-react';
import Abbr from './Abbr';

export default function QualityCheckCard({ quality }) {
  if (!quality) {
    return (
      <div className="clinical-card p-4 space-y-2 border-l-4 border-l-slate-400 bg-slate-50/50">
        <div className="flex items-center space-x-2 text-slate-700 font-semibold text-xs">
          <ShieldCheck className="w-4 h-4 text-slate-400" />
          <span><Abbr text="DICOM">DICOM</Abbr> Quality Gate Standby</span>
        </div>
        <p className="text-xs text-slate-500 font-mono leading-relaxed">
          Awaiting image file ingestion...
        </p>
      </div>
    );
  }

  const isPass = quality.status === 'Pass';
  const isWarn = quality.status === 'Warning';

  return (
    <div className="clinical-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-sky-600" />
          <h3 className="font-semibold text-slate-900 text-xs tracking-tight">
            <Abbr text="DICOM">DICOM</Abbr> Quality Gate Protocol
          </h3>
        </div>
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium font-mono border ${
            isPass
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : isWarn
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : 'bg-red-50 text-red-700 border-red-200'
          }`}
        >
          {isPass ? (
            <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
          ) : isWarn ? (
            <AlertTriangle className="w-3 h-3 mr-1 text-amber-600" />
          ) : (
            <XCircle className="w-3 h-3 mr-1 text-red-600" />
          )}
          {quality.status.toUpperCase()} ({quality.overallScore}%)
        </span>
      </div>

      <p className="text-[11px] text-slate-600 leading-relaxed bg-slate-50 p-2 rounded border border-slate-200 font-mono">
        {quality.notes}
      </p>

      <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
        <div className="bg-slate-50 p-2 rounded border border-slate-200">
          <span className="block text-slate-400 font-medium text-[10px]">Sharpness</span>
          <span className="font-mono font-semibold text-slate-800">{quality.sharpnessIndex}%</span>
        </div>
        <div className="bg-slate-50 p-2 rounded border border-slate-200">
          <span className="block text-slate-400 font-medium text-[10px]">Contrast Ratio</span>
          <span className="font-mono font-semibold text-slate-800">{quality.contrastRatio}%</span>
        </div>
        <div className="bg-slate-50 p-2 rounded border border-slate-200">
          <span className="block text-slate-400 font-medium text-[10px]"><Abbr text="SNR">SNR</Abbr></span>
          <span className="font-mono font-semibold text-slate-800">{quality.snrDb} dB</span>
        </div>
      </div>
    </div>
  );
}
