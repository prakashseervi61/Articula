import React from 'react';
import { Award, CheckCircle2, ShieldCheck, Sparkles, Layers, Box, AlertCircle } from 'lucide-react';
import { findTopNImplantMatches } from '../data/implantDatabase';

export default function Top3ImplantMatrixCard({ selectedCase }) {
  const boneData = selectedCase?.measurements?.bone || {};
  const femoralWidth = boneData.femoralCondyleWidthMm || boneData.femoralWidthMm || 71.5;
  const tibialWidth = boneData.tibialPlateauWidthMm || boneData.tibialWidthMm || 68.2;
  const femoralAp = boneData.femoralApMm || 58.4;
  const tibialAp = boneData.tibialApMm || 46.1;

  const topMatches = findTopNImplantMatches(
    femoralWidth,
    tibialWidth,
    femoralAp,
    tibialAp,
    3
  );

  return (
    <div className="clinical-card p-6 bg-white border border-slate-200 rounded-xl space-y-5 shadow-sm">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base tracking-tight">
              Ranked Top-3 Implant Sizing Recommendation Matrix
            </h3>
            <p className="text-xs text-slate-500 font-mono">
              Multi-Manufacturer 4D Geometric Fit Ranking • Inventory Status & Risk Scores
            </p>
          </div>
        </div>

        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono bg-emerald-50 text-emerald-700 border border-emerald-300">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>ACTIVE COMPARATIVE MATRIX</span>
        </span>
      </div>

      {/* Top 3 Recommendation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {topMatches.map((match, idx) => {
          const rank = idx + 1;
          const isTop1 = rank === 1;

          return (
            <div
              key={match.implant.id}
              className={`p-4 rounded-xl border transition-all duration-200 relative ${
                isTop1
                  ? 'bg-gradient-to-b from-sky-50/90 to-white border-sky-300 shadow-md ring-1 ring-sky-400'
                  : 'bg-slate-50/80 hover:bg-white border-slate-200 shadow-2xs'
              }`}
            >
              {/* Rank Pill Header */}
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono ${
                    isTop1
                      ? 'bg-sky-600 text-white shadow-xs'
                      : rank === 2
                      ? 'bg-slate-700 text-white'
                      : 'bg-slate-600 text-white'
                  }`}
                >
                  <span>Rank #{rank}</span>
                  {isTop1 && <Award className="w-3 h-3 text-amber-300 ml-0.5" />}
                </span>

                <span className="text-xs font-bold font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {match.fitScore}% Fit
                </span>
              </div>

              {/* Manufacturer & Model */}
              <div className="space-y-1 mb-3">
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 font-mono block">
                  {match.implant.manufacturer}
                </span>
                <h4 className="font-bold text-slate-900 text-sm leading-snug">
                  {match.implant.model}
                </h4>
                <div className="text-xs font-semibold text-sky-700 font-mono pt-0.5">
                  Femoral {match.implant.femoralSize} / Tibial {match.implant.tibialSize}
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="bg-white/80 border border-slate-200 rounded-lg p-2.5 space-y-1.5 text-[11px] font-mono text-slate-600 mb-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">Geometric Fit Error:</span>
                  <span className="font-bold text-slate-900">{match.fitErrorMm} mm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Femoral Width Delta:</span>
                  <span className={match.deltas.femoralWidth >= 0 ? "text-emerald-700 font-bold" : "text-amber-700 font-bold"}>
                    {match.deltas.femoralWidth >= 0 ? `+${match.deltas.femoralWidth}` : match.deltas.femoralWidth} mm
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tibial AP Delta:</span>
                  <span className={match.deltas.tibialAp >= 0 ? "text-emerald-700 font-bold" : "text-amber-700 font-bold"}>
                    {match.deltas.tibialAp >= 0 ? `+${match.deltas.tibialAp}` : match.deltas.tibialAp} mm
                  </span>
                </div>
              </div>

              {/* Overhang & Stock Status */}
              <div className="pt-2 border-t border-slate-100 flex flex-col space-y-1 text-[10px]">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center space-x-1">
                    <ShieldCheck className="w-3 h-3 text-sky-500" />
                    <span>Risk Index:</span>
                  </span>
                  <span className="font-bold text-slate-800">{match.overhangRisk}</span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center space-x-1">
                    <Box className="w-3 h-3 text-emerald-500" />
                    <span>Inventory Status:</span>
                  </span>
                  <span className="font-bold text-emerald-600 font-mono">IN STOCK (OR Ready)</span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
