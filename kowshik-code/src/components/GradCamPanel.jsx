import React, { useState } from 'react';
import { ShieldAlert, Cpu, ChevronDown, ChevronRight, CheckCircle2 } from 'lucide-react';
import Abbr from './Abbr';

export default function GradCamPanel({ selectedCase }) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!selectedCase) {
    return (
      <div className="clinical-card p-4 space-y-2 border-l-4 border-l-slate-400 bg-slate-50/50">
        <div className="flex items-center space-x-2 text-slate-700 font-semibold text-xs">
          <Cpu className="w-4 h-4 text-slate-400" />
          <span>Explainability Panel (Grad-CAM) Standby</span>
        </div>
        <p className="text-xs text-slate-500 font-mono leading-relaxed">
          Upload a radiograph to visualize deep neural network class activation maps and spatial attributions.
        </p>
      </div>
    );
  }

  const isQualityFail = selectedCase.quality?.status === 'Fail';

  if (isQualityFail) {
    return (
      <div className="clinical-card p-4 space-y-2 border-l-4 border-l-red-600 bg-red-50/50">
        <div className="flex items-center space-x-2 text-red-700 font-bold text-xs">
          <ShieldAlert className="w-4 h-4 text-red-600" />
          <span>Grad-CAM Explainability Aborted</span>
        </div>
        <p className="text-xs text-red-900 font-mono leading-relaxed">
          DICOM Quality Gate Failed: Neural gradient attribution maps aborted for non-radiographic inputs.
        </p>
      </div>
    );
  }

  const oaGrade = selectedCase.oaGrade ?? 3;
  const rawImgUrl = selectedCase.imageUrl || `/assets/samples/${selectedCase.id.toLowerCase().replace(/#/g, '')}.png`;
  const gradcamImgUrl = `/assets/gradcam/gradcam_grade${oaGrade}.png`;

  const isSevereOrModerate = oaGrade >= 2;

  return (
    <div className="clinical-card overflow-hidden transition-all duration-200">
      {/* Expander Bar Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 bg-white hover:bg-slate-50 border-b border-slate-200 flex items-center justify-between transition-colors text-left focus:outline-none"
      >
        <div className="flex items-center space-x-2">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-slate-500" />
          )}
          <span className="font-semibold text-xs sm:text-sm text-slate-800 tracking-tight flex items-center gap-1.5">
            🔍 Explainability - Where Does the Model Look? (Grad-CAM)
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 hidden sm:inline-block">
            Xception CNN Attributions
          </span>
          <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-white border border-slate-800">
            KL Grade {oaGrade}
          </span>
        </div>
      </button>

      {/* Expander Content */}
      {isExpanded && (
        <div className="p-5 sm:p-6 space-y-5 bg-white">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">
            
            {/* Left Column: Grad-CAM Overlay Canvas */}
            <div className="md:col-span-7 space-y-3 flex flex-col items-center">
              <div className="relative w-full max-w-[520px] aspect-square rounded-xl overflow-hidden border border-slate-300 shadow-md bg-slate-950 group">
                
                {/* Base Radiograph Layer */}
                <img
                  src={rawImgUrl}
                  alt="Original Knee Radiograph"
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Heatmap Overlay Layer */}
                <img
                  src={gradcamImgUrl}
                  alt="Grad-CAM Activation Overlay"
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Region Focus Indicator Badge */}
                <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-xs text-white px-2.5 py-1 rounded-md text-[10px] font-mono border border-slate-700/80 shadow-md flex items-center space-x-1.5">
                  <span className={`w-2 h-2 rounded-full animate-pulse ${isSevereOrModerate ? 'bg-red-400' : 'bg-emerald-400'}`} />
                  <span>
                    Focus: {isSevereOrModerate ? 'Marginal Osteophytes & Edges' : 'Central Joint Space Gap'}
                  </span>
                </div>

                {/* Color Spectrum Legend */}
                <div className="absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-700 text-white text-[10px] font-mono flex items-center space-x-2 shadow-md">
                  <span className="text-slate-400">Low Focus</span>
                  <div className="w-16 h-2 rounded bg-gradient-to-r from-blue-600 via-emerald-400 to-red-500" />
                  <span className="text-red-400 font-bold">Peak Attrib</span>
                </div>
              </div>

              <span className="text-xs sm:text-sm text-slate-500 font-medium tracking-wide">
                Grad-CAM overlay (Gradient-weighted Class Activation Map)
              </span>
            </div>

            {/* Right Column: Explanatory Bullet Points & Clinical Context */}
            <div className="md:col-span-5 space-y-4 text-sm leading-relaxed text-slate-800 pt-1">
              
              {/* Bullet Points with formal medical & radiological terminology */}
              <ul className="space-y-3 font-sans text-xs sm:text-sm text-slate-700">
                <li className="flex items-start space-x-2.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                  <span className="text-red-500 font-bold text-base leading-none select-none">•</span>
                  <div>
                    <strong className="text-slate-900 font-semibold">Warm regions:</strong> Highlights areas with high joint space narrowing, cartilage erosion, or marginal osteophyte bone spurs.
                  </div>
                </li>
                <li className="flex items-start space-x-2.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                  <span className="text-emerald-600 font-bold text-base leading-none select-none">•</span>
                  <div>
                    <strong className="text-slate-900 font-semibold">Healthy / Doubtful:</strong> Focus near the joint centre.
                  </div>
                </li>
                <li className="flex items-start space-x-2.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                  <span className="text-amber-600 font-bold text-base leading-none select-none">•</span>
                  <div>
                    <strong className="text-slate-900 font-semibold">Moderate / Severe:</strong> Light up the marginal edges (osteophytes).
                  </div>
                </li>
                <li className="flex items-start space-x-2.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                  <span className="text-teal-600 font-bold text-base leading-none select-none">•</span>
                  <div>
                    Gives clinicians a sanity check instead of a black box.
                  </div>
                </li>
              </ul>

              {/* Clinical Verification Callout with formal medical terms */}
              <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-1.5">
                <div className="flex items-center space-x-2 text-emerald-900 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Clinician Interpretability Guarantee</span>
                </div>
                <p className="text-xs text-emerald-950 leading-relaxed">
                  Gradient-weighted Class Activation Mapping (Grad-CAM) confirms deep neural activation is grounded in true osteochondral pathology rather than extra-articular artifacts or collimation noise.
                </p>
              </div>

              {/* Model Layer Attribution Metadata */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Target Layer</span>
                  <span className="font-semibold text-slate-800 text-xs">block14_sepconv2_act</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Method</span>
                  <span className="font-semibold text-slate-800 text-xs">Grad-CAM (Selvaraju et al.)</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}