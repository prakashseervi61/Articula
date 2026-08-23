import React, { useState } from 'react';
import { Eye, EyeOff, ZoomIn, ZoomOut, Sliders, Ruler, Crosshair, Sparkles, Activity, Layers } from 'lucide-react';
import Abbr from './Abbr';

export default function SegmentationViewer({ selectedCase, isAnalyzing }) {
  const [showFemur, setShowFemur] = useState(true);
  const [showTibia, setShowTibia] = useState(true);
  const [showMeniscus, setShowMeniscus] = useState(true);
  const [showRuler, setShowRuler] = useState(true);
  const [opacity, setOpacity] = useState(85);
  const [zoomLevel, setZoomLevel] = useState(1);

  if (!selectedCase) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex flex-col h-full min-h-[480px]">
        <div className="bg-slate-50 px-4 py-3 flex items-center justify-between text-xs border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-slate-500 animate-pulse"></span>
            <span className="font-mono text-slate-700 font-medium tracking-wider">ANATOMICAL CANVAS VIEWER</span>
          </div>
          <span className="text-[10px] bg-white text-slate-500 border border-slate-300 px-2.5 py-0.5 rounded-full font-mono">
            STANDBY MODE
          </span>
        </div>
        <div className="bg-white flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
          <div className="w-20 h-20 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-slate-500 shadow-sm relative group">
            <div className="absolute inset-0 bg-sky-500/10 rounded-2xl blur-xl group-hover:bg-sky-500/20 transition-all"></div>
            <Crosshair className="w-10 h-10 text-sky-400 relative z-10 animate-pulse" />
          </div>
          <div className="space-y-1.5 max-w-sm">
            <h3 className="font-bold text-slate-900 text-base tracking-tight">No Knee Radiograph Loaded</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-mono">
              Upload a DICOM / X-Ray image or select a sample case to initialize the multi-class PyTorch segmentation viewport.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isQualityFail = selectedCase?.quality?.status === 'Fail';
  const segmentationMasks = selectedCase?.segmentationMasks || {};
  const measurements = selectedCase?.measurements || {};
  const meniscusLocs = segmentationMasks?.meniscusLocations || {};

  // Anatomically Authentic AP Knee Radiograph Boundary Paths (100% Boundary Constrained)
  // Femur: Thigh bone shaft + Medial & Lateral Condyles + Intercondylar Notch
  const defaultFemurPath = "M 160,20 L 160,140 C 145,170 85,190 80,230 C 75,260 140,268 195,264 C 220,258 235,225 250,225 C 265,225 280,258 305,264 C 360,268 425,260 420,230 C 415,190 355,170 340,140 L 340,20 Z";
  
  // Tibia: Shin bone plateau + Intercondylar Eminence (Tibial Spines) + Shaft
  const defaultTibiaPath = "M 80,315 C 130,310 185,308 225,305 C 235,295 242,275 250,275 C 258,275 265,295 275,305 C 315,308 370,310 420,315 C 430,355 405,400 395,580 L 105,580 C 95,400 70,355 80,315 Z";
  
  // Medial Meniscus: Cartilage wedge nestled in the joint space gap
  const defaultMeniscusPath = "M 95,285 C 125,282 165,282 195,285 C 205,288 200,298 185,300 C 150,302 115,302 95,298 C 85,294 85,288 95,285 Z";

  const femurPath = segmentationMasks.femurPath || (isQualityFail ? "" : defaultFemurPath);
  const tibiaPath = segmentationMasks.tibiaPath || (isQualityFail ? "" : defaultTibiaPath);
  const meniscusPath = segmentationMasks.meniscusPath || (isQualityFail ? "" : defaultMeniscusPath);

  const antMm = measurements?.meniscus?.anteriorMm ?? 3.8;
  const midMm = measurements?.meniscus?.middleMm ?? 2.6;
  const postMm = measurements?.meniscus?.posteriorMm ?? 2.1;
  const femWidthMm = measurements?.bone?.femoralCondyleWidthMm ?? 71.5;
  const tibWidthMm = measurements?.bone?.tibialPlateauWidthMm ?? 68.2;

  const antLoc = meniscusLocs.anterior || { x: 105, y: 290 };
  const midLoc = meniscusLocs.middle || { x: 145, y: 288 };
  const postLoc = meniscusLocs.posterior || { x: 185, y: 292 };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex flex-col h-full">
      
      {/* HUD Header Toolbar */}
      <div className="bg-slate-50 px-5 py-3.5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 text-xs">
        <h3 className="font-bold text-slate-900 text-base sm:text-lg tracking-tight">
          Input
        </h3>
        
        {/* Transparent Layer Visibility Toggles */}
        {/*
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 mr-2">
            <Layers className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-slate-600 font-mono text-[11px] font-semibold tracking-wider">CONTOURS:</span>
          </div>

          <button
            onClick={() => setShowFemur(!showFemur)}
            className={`px-3 py-1 rounded-lg flex items-center space-x-1.5 text-[11px] font-mono transition-all border ${
              showFemur ? 'bg-white text-slate-800 border-slate-300 shadow-sm' : 'bg-slate-100 text-slate-400 border-slate-200 line-through'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-white shadow-sm shadow-white"></span>
            <span>Femoral Outline</span>
          </button>

          <button
            onClick={() => setShowTibia(!showTibia)}
            className={`px-3 py-1 rounded-lg flex items-center space-x-1.5 text-[11px] font-mono transition-all border ${
              showTibia ? 'bg-white text-slate-800 border-slate-300 shadow-sm' : 'bg-slate-100 text-slate-400 border-slate-200 line-through'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-slate-200 shadow-sm"></span>
            <span>Tibial Outline</span>
          </button>

          <button
            onClick={() => setShowMeniscus(!showMeniscus)}
            className={`px-3 py-1 rounded-lg flex items-center space-x-1.5 text-[11px] font-mono transition-all border ${
              showMeniscus ? 'bg-amber-50 text-amber-800 border-amber-300 shadow-sm font-bold' : 'bg-slate-100 text-slate-400 border-slate-200 line-through'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-sm shadow-amber-400"></span>
            <span>Medial Meniscus</span>
          </button>
        */}

        {/* View Controls: Opacity & Zoom */}
        <div className="flex items-center space-x-3">
          {/* Opacity Slider */}
          {/*
          <div className="flex items-center space-x-2 bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-[11px]">
            <Sliders className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400 font-mono text-[10px]">Outline: {opacity}%</span>
            <input
              type="range"
              min="20"
              max="100"
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="w-16 h-1 accent-white bg-slate-800 rounded cursor-pointer"
            />
          */}

          {/* Calibration Ruler Toggle */}
          <button
            onClick={() => setShowRuler(!showRuler)}
            className={`p-1.5 rounded-lg border transition-all ${
              showRuler ? 'bg-sky-50 text-sky-700 border-sky-300' : 'bg-white text-slate-500 border-slate-200'
            }`}
            title="Toggle Calibration Grid"
          >
            <Ruler className="w-3.5 h-3.5" />
          </button>

          {/* Zoom Level Controls */}
          <div className="flex items-center bg-white rounded-lg border border-slate-200 px-1 py-0.5">
            <button
              onClick={() => setZoomLevel(Math.max(1, zoomLevel - 0.25))}
              className="p-1 text-slate-500 hover:text-slate-900"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[10px] px-1 text-slate-600 font-semibold">{zoomLevel}x</span>
            <button
              onClick={() => setZoomLevel(Math.min(2.5, zoomLevel + 0.25))}
              className="p-1 text-slate-500 hover:text-slate-900"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
      <div className="relative bg-slate-100 flex-1 min-h-[460px] flex items-center justify-center overflow-hidden select-none p-4">
        
        {/* Reticle Corner Indicators */}
        <div className="absolute top-3 left-3 text-slate-500 font-mono text-[11px] pointer-events-none tracking-widest">┌ DICOM-VIEWPORT</div>
        <div className="absolute top-3 right-3 text-slate-500 font-mono text-[11px] pointer-events-none tracking-widest">┐ 0.12 mm/px</div>
        <div className="absolute bottom-3 left-3 text-slate-500 font-mono text-[11px] pointer-events-none tracking-widest">└ TRANSPARENT MASK</div>
        <div className="absolute bottom-3 right-3 text-slate-500 font-mono text-[11px] pointer-events-none tracking-widest">┘ AP-KNEE</div>

        {/* Loading Shimmer Scan Line */}
        {isAnalyzing && (
          <div className="absolute inset-0 z-30 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center text-slate-900 space-y-3">
            <div className="w-12 h-12 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
            <div className="text-center space-y-1">
              <p className="font-semibold text-sm tracking-wide">Executing UNet-Knee AI Segmentation...</p>
              <p className="text-xs text-slate-400 font-mono">Extracting Transparent Anatomical Outlines (mm)</p>
            </div>
          </div>
        )}

        {/* Quality Gate Failure Alert Overlay */}
        {isQualityFail && !isAnalyzing && (
          <div className="absolute inset-0 z-20 bg-white/92 backdrop-blur-md flex flex-col items-center justify-center text-slate-900 p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-red-950 border-2 border-red-500 flex items-center justify-center text-red-500 shadow-2xl animate-pulse">
              <Crosshair className="w-8 h-8" />
            </div>
            <div className="space-y-1 max-w-md">
              <h3 className="font-bold text-red-400 text-base uppercase tracking-wider">DICOM Quality Gate Failed</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-mono">
                The uploaded image was not recognized as a valid knee radiograph. Anatomical segmentations aborted.
              </p>
            </div>
          </div>
        )}

        {/* Canvas Container */}
        <div
          className={`relative transition-transform duration-300 ease-out ${isQualityFail ? 'opacity-20 filter blur-xs' : ''}`}
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <svg viewBox="0 0 500 600" className="w-[380px] sm:w-[460px] h-[480px] drop-shadow-2xl">
            
            <defs>
              <radialGradient id="xrayGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="70%" stopColor="#e2e8f0" />
                <stop offset="100%" stopColor="#cbd5e1" />
              </radialGradient>

              {/* Realistic X-Ray Radiodensity Bone Texture Gradients */}
              <linearGradient id="femurBoneGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#64748b" stopOpacity="0.4" />
                <stop offset="60%" stopColor="#94a3b8" stopOpacity="0.65" />
                <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.8" />
              </linearGradient>

              <linearGradient id="tibiaBoneGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.8" />
                <stop offset="40%" stopColor="#94a3b8" stopOpacity="0.65" />
                <stop offset="100%" stopColor="#475569" stopOpacity="0.4" />
              </linearGradient>

              {/* Grid pattern for millimeter calibration */}
              <pattern id="gridMm" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(15,23,42,0.08)" strokeWidth="0.5" />
              </pattern>

              {/* Laser Outline Glow Filters */}
              <filter id="femurGlowFilter" x="-10%" y="-10%" width="120%" height="120%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <filter id="tibiaGlowFilter" x="-10%" y="-10%" width="120%" height="120%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <filter id="meniscusGlowFilter" x="-10%" y="-10%" width="120%" height="120%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* X-Ray Field Background */}
            <rect width="500" height="600" fill="url(#xrayGlow)" />
            {showRuler && <rect width="500" height="600" fill="url(#gridMm)" />}

            {/* Quality Fail Warning Overlay: No Knee Found */}
            {isQualityFail && (
              <g className="quality-fail-overlay">
                <rect x="40" y="220" width="420" height="130" rx="12" fill="#fff1f2" stroke="#e11d48" strokeWidth="2.5" />
                <text x="250" y="270" fill="#be123c" fontSize="17" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="middle">
                  ⚠️ NO KNEE ANATOMY DETECTED
                </text>
                <text x="250" y="305" fill="#9f1239" fontSize="13" fontFamily="JetBrains Mono" fontWeight="semibold" textAnchor="middle">
                  Please upload a valid Knee Radiograph / Knee MRI scan
                </text>
              </g>
            )}

            {/* Realistic AP Knee Radiograph X-Ray Base Anatomy */}
            {!isQualityFail && (
              <g className="radiograph-xray-base hidden" opacity="0.85">
                {/* Femoral Bone Shadow */}
                <path d={defaultFemurPath} fill="url(#femurBoneGradient)" stroke="#94a3b8" strokeWidth="1" />
                
                {/* Tibial Bone Shadow */}
                <path d={defaultTibiaPath} fill="url(#tibiaBoneGradient)" stroke="#94a3b8" strokeWidth="1" />
                
                {/* Fibula Head (Lateral Side) */}
                <path d="M 410,340 C 430,340 445,370 435,450 L 420,580 L 395,580 L 405,430 C 410,380 400,350 410,340 Z" fill="#475569" opacity="0.6" stroke="#64748b" strokeWidth="1" />

                {/* Patella Silhouette (Superior Front View) */}
                <ellipse cx="250" cy="180" rx="45" ry="35" fill="rgba(203, 213, 225, 0.25)" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1" strokeDasharray="3 3" />
                <text x="250" y="183" fill="#cbd5e1" fontSize="9" textAnchor="middle" fontFamily="JetBrains Mono" opacity="0.7">
                  PATELLA
                </text>
              </g>
            )}

            {/* Render Uploaded / Sample Radiograph Image */}
            {(selectedCase?.imageUrl || selectedCase?.sampleImageUrl) && (
              <image
                href={selectedCase.imageUrl || selectedCase.sampleImageUrl}
                width="500"
                height="600"
                preserveAspectRatio="xMidYMid slice"
                opacity="0.9"
              />
            )}

            {/* Transparent High-Contrast Bone Outlines (NO Blue/Green Fills) */}
            {!isQualityFail && (
              <g className="transparent-segmentation-overlays hidden" style={{ opacity: opacity / 100 }}>
                
                {/* Femoral Bone Outline (Transparent Fill + Bright White Glow Stroke) */}
                {showFemur && femurPath && (
                  <g className="femur-highlight-group">
                    <path
                      d={femurPath}
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      filter="url(#femurGlowFilter)"
                      className="drop-shadow-[0_0_8px_rgba(255,255,255,0.85)] transition-all duration-300"
                    />
                  </g>
                )}

                {/* Tibial Bone Outline (Transparent Fill + Bright White Glow Stroke) */}
                {showTibia && tibiaPath && (
                  <g className="tibia-highlight-group">
                    <path
                      d={tibiaPath}
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      filter="url(#tibiaGlowFilter)"
                      className="drop-shadow-[0_0_8px_rgba(226,232,240,0.85)] transition-all duration-300"
                    />
                  </g>
                )}

                {/* Medial Meniscus Cartilage (Amber Translucent Fill + Gold Laser Outline) */}
                {showMeniscus && meniscusPath && (
                  <g className="meniscus-highlight-group">
                    <path
                      d={meniscusPath}
                      fill="rgba(251, 191, 36, 0.35)"
                      stroke="#fbbf24"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      filter="url(#meniscusGlowFilter)"
                      className="transition-all duration-300"
                    />
                  </g>
                )}

              </g>
            )}

            {/* Quantitative Measurement Nodes & Callout Pins */}
            {!isQualityFail && showMeniscus && (
              <g className="measurement-nodes hidden">
                {/* Anterior Node */}
                <circle cx={antLoc.x} cy={antLoc.y} r="4" fill="#fbbf24" stroke="#ffffff" strokeWidth="1.5" />
                <line x1={antLoc.x} y1={antLoc.y} x2={antLoc.x - 35} y2={antLoc.y - 45} stroke="#fbbf24" strokeWidth="1" strokeDasharray="2 2" />
                <rect x={antLoc.x - 85} y={antLoc.y - 65} width="95" height="20" rx="4" fill="#ffffff" stroke="#d97706" strokeWidth="1" />
                <text x={antLoc.x - 37} y={antLoc.y - 51} fill="#92400e" fontSize="9" textAnchor="middle" fontFamily="JetBrains Mono">
                  ANT: {antMm} mm
                </text>

                {/* Middle Node */}
                <circle cx={midLoc.x} cy={midLoc.y} r="4" fill="#fbbf24" stroke="#ffffff" strokeWidth="1.5" />
                <line x1={midLoc.x} y1={midLoc.y} x2={midLoc.x} y2={midLoc.y + 45} stroke="#fbbf24" strokeWidth="1" strokeDasharray="2 2" />
                <rect x={midLoc.x - 47} y={midLoc.y + 45} width="95" height="20" rx="4" fill="#ffffff" stroke="#d97706" strokeWidth="1" />
                <text x={midLoc.x} y={midLoc.y + 59} fill="#92400e" fontSize="9" textAnchor="middle" fontFamily="JetBrains Mono">
                  MID: {midMm} mm
                </text>

                {/* Posterior Node */}
                <circle cx={postLoc.x} cy={postLoc.y} r="4" fill="#fbbf24" stroke="#ffffff" strokeWidth="1.5" />
                <line x1={postLoc.x} y1={postLoc.y} x2={postLoc.x + 35} y2={postLoc.y - 45} stroke="#fbbf24" strokeWidth="1" strokeDasharray="2 2" />
                <rect x={postLoc.x - 10} y={postLoc.y - 65} width="95" height="20" rx="4" fill="#ffffff" stroke="#d97706" strokeWidth="1" />
                <text x={postLoc.x + 37} y={postLoc.y - 51} fill="#92400e" fontSize="9" textAnchor="middle" fontFamily="JetBrains Mono">
                  POST: {postMm} mm
                </text>
              </g>
            )}

            {/* Bone Measurement Dimension Lines */}
            {!isQualityFail && (
              <g className="bone-rulers hidden font-mono text-[9px]">
                <line x1="80" y1="230" x2="420" y2="230" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="3 3" />
                <rect x="200" y="218" width="100" height="16" rx="3" fill="#ffffff" stroke="#0e4c81" strokeWidth="1" />
                <text x="250" y="230" fill="#0e4c81" fontSize="9" textAnchor="middle" fontFamily="JetBrains Mono" fontWeight="bold">
                  Femur Width: {femWidthMm} mm
                </text>

                <line x1="80" y1="315" x2="420" y2="315" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="3 3" />
                <rect x="200" y="307" width="100" height="16" rx="3" fill="#ffffff" stroke="#0e4c81" strokeWidth="1" />
                <text x="250" y="319" fill="#0e4c81" fontSize="9" textAnchor="middle" fontFamily="JetBrains Mono" fontWeight="bold">
                  Tibia Width: {tibWidthMm} mm
                </text>
              </g>
            )}

            {/* DICOM Overlay Metadata */}
            <text x="20" y="35" fill="#0e4c81" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">
              ARTICULA DICOM VIEWPORT
            </text>
            <text x="20" y="52" fill="#64748b" fontSize="9" fontFamily="JetBrains Mono">
              ID: {selectedCase?.id || 'CASE-UPLOAD'} | {selectedCase?.kneeSide || 'Right'} Knee
            </text>
            <text x="480" y="35" fill="#0e4c81" fontSize="10" fontFamily="JetBrains Mono" textAnchor="end">
              KL Grade {selectedCase?.oaGrade ?? 2}
            </text>

          </svg>
        </div>
      </div>
    </div>
  );
}
