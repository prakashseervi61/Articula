import React from 'react';
import { Ruler, CheckCircle2, ArrowRight, ShieldCheck, Database } from 'lucide-react';
import Abbr from './Abbr';

export default function ImplantMatchCard({ implantMatch, activeCase, bone }) {
  if (!implantMatch) {
    return (
      <div className="clinical-card p-4 space-y-2 border-l-4 border-l-slate-400 bg-slate-50/50">
        <div className="flex items-center space-x-2 text-slate-700 font-semibold text-xs">
          <Database className="w-4 h-4 text-slate-400" />
          <span><Abbr text="TKA">TKA</Abbr> Implant Sizing Standby</span>
        </div>
        <p className="text-xs text-slate-500 font-mono leading-relaxed">
          Upload a knee radiograph or select a case to calculate nearest-fit <Abbr text="TKA">TKA</Abbr> component recommendations.
        </p>
      </div>
    );
  }

  if (implantMatch.isFail || implantMatch.manufacturer === 'N/A') {
    return (
      <div className="clinical-card p-4 space-y-2 border-l-4 border-l-red-600 bg-red-50/50">
        <div className="flex items-center space-x-2 text-red-700 font-bold text-xs">
          <Database className="w-4 h-4 text-red-600" />
          <span><Abbr text="TKA">TKA</Abbr> Implant Sizing Aborted</span>
        </div>
        <p className="text-xs text-red-900 font-mono leading-relaxed">
          Geometric sizing matching requires valid femoral and tibial anatomical measurements. Matching aborted due to DICOM Quality Gate failure.
        </p>
      </div>
    );
  }

  const { manufacturer, model, femoralSize, tibialSize, fitScore, fitErrorMm, deltas } = implantMatch;

  // Extract patient anatomical measurements from radiograph
  const femoralWidth = activeCase?.measurements?.bone?.femoralCondyleWidthMm || bone?.femoralCondyleWidthMm || 71.2;
  const tibialWidth = activeCase?.measurements?.bone?.tibialPlateauWidthMm || bone?.tibialPlateauWidthMm || 68.2;
  
  // Standard reference component baseline width (Size 4 = 71.2mm)
  const referenceWidth = 71.2;
  const scaleRatio = femoralWidth / referenceWidth;
  
  // Smoothly bound visual scale factor between 0.82x and 1.25x
  const scaleFactor = Math.min(Math.max(scaleRatio, 0.82), 1.25);
  const scalePercentage = Math.round(scaleFactor * 100);

  return (
    <div className="clinical-card p-5 space-y-4 border-l-4 border-l-teal-600 bg-white shadow-sm">
      
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <Database className="w-4 h-4 text-teal-600" />
          <h3 className="font-bold text-slate-900 text-xs sm:text-sm tracking-tight">
            <Abbr text="TKA">TKA</Abbr> Implant Sizing Nearest-Match
          </h3>
        </div>
        <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 font-bold">
          Fit Match: {fitScore}%
        </span>
      </div>

      {/* Grid: High-Res 3D Implant Render + Match Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* 3D TKA Implant Render Showcase Viewport */}
        <div className="lg:col-span-7 bg-slate-950 rounded-xl p-4 border border-slate-800 text-center relative overflow-hidden group shadow-lg">
          <div className="absolute top-3 left-3 z-10">
            <div className="text-[10px] font-mono font-bold bg-slate-900/90 text-sky-400 border border-sky-800/60 px-2.5 py-1 rounded shadow-md tracking-wider">
              3D ANATOMICAL IMPLANT SYSTEM
            </div>
          </div>

          {/* Render Area with Dynamic Scaled Implant Image */}
          <div className="w-full h-80 sm:h-96 lg:h-[420px] flex items-center justify-center relative overflow-hidden">
            <img
              src="/assets/tka_implant.png"
              alt="3D TKA Total Knee Arthroplasty Implant Components"
              className="w-full h-full object-contain rounded p-2 drop-shadow-[0_10px_25px_rgba(0,0,0,0.6)] transition-transform duration-700 ease-out"
              style={{
                transform: `scale(${scaleFactor})`
              }}
            />
          </div>

          <div className="text-xs font-mono text-slate-300 pt-2.5 border-t border-slate-800 flex justify-around px-3 bg-slate-900/40 rounded-b">
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-slate-300 inline-block"></span>
              <span>CoCr Femoral Condyle</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block"></span>
              <span>UHMWPE Articular Bearing</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-slate-400 inline-block"></span>
              <span>Titanium Tibial Tray</span>
            </span>
          </div>
        </div>

        {/* Recommended Component Details */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-slate-900 text-white p-3.5 rounded-lg space-y-2 shadow-sm border border-slate-800">
            <div className="flex items-center justify-between">
              <div className="text-[10px] uppercase tracking-wider text-teal-400 font-bold font-mono">
                {manufacturer} • {model}
              </div>
              <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-700/60">
                FDA Cleared 510(k)
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-base font-bold tracking-tight">
                Femoral {femoralSize} / Tibial {tibialSize}
              </span>
              <span className="text-[11px] font-mono text-teal-300 font-bold" title="L2 Euclidean Spatial Mismatch Distance in mm">
                Fit Deviation: {fitErrorMm} mm
              </span>
            </div>

            {implantMatch.material && (
              <div className="text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-800/80 truncate">
                Material: <span className="text-slate-300 font-sans">{implantMatch.material}</span>
              </div>
            )}
          </div>

          {/* Delta Metrics Grid */}
          <div className="space-y-1">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
              Anatomical Fit Deltas (vs Patient Target):
            </span>

            <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono">
              
              <div className="bg-slate-50 p-1.5 rounded border border-slate-200 flex justify-between">
                <span className="text-slate-600">Femoral Width:</span>
                <span className={deltas?.femoralWidth >= 0 ? 'text-amber-700 font-bold' : 'text-sky-700 font-bold'}>
                  {deltas?.femoralWidth > 0 ? `+${deltas.femoralWidth}` : deltas?.femoralWidth} mm
                </span>
              </div>

              <div className="bg-slate-50 p-1.5 rounded border border-slate-200 flex justify-between">
                <span className="text-slate-600">Tibial Width:</span>
                <span className={deltas?.tibialWidth >= 0 ? 'text-amber-700 font-bold' : 'text-sky-700 font-bold'}>
                  {deltas?.tibialWidth > 0 ? `+${deltas.tibialWidth}` : deltas?.tibialWidth} mm
                </span>
              </div>

              <div className="bg-slate-50 p-1.5 rounded border border-slate-200 flex justify-between">
                <span className="text-slate-600">Femoral <Abbr text="AP">AP</Abbr>:</span>
                <span className={deltas?.femoralAp >= 0 ? 'text-amber-700 font-bold' : 'text-sky-700 font-bold'}>
                  {deltas?.femoralAp > 0 ? `+${deltas.femoralAp}` : deltas?.femoralAp} mm
                </span>
              </div>

              <div className="bg-slate-50 p-1.5 rounded border border-slate-200 flex justify-between">
                <span className="text-slate-600">Tibial <Abbr text="AP">AP</Abbr>:</span>
                <span className={deltas?.tibialAp >= 0 ? 'text-amber-700 font-bold' : 'text-sky-700 font-bold'}>
                  {deltas?.tibialAp > 0 ? `+${deltas.tibialAp}` : deltas?.tibialAp} mm
                </span>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
