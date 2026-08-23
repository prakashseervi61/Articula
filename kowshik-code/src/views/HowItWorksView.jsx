import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, ShieldCheck, Layers, Activity, Ruler, Database, CheckCircle2 } from 'lucide-react';
import Abbr from '../components/Abbr';

export default function HowItWorksView() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header Title */}
      <div className="border-b border-slate-200 pb-5 space-y-2">
        <div className="inline-flex items-center space-x-2 text-sky-700 bg-sky-50 px-2.5 py-1 rounded text-xs font-mono font-medium">
          <Cpu className="w-4 h-4 text-sky-600" />
          <span>Algorithmic Methodology & Clinical Specifications</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">How ARTICULA Works</h1>
        <p className="text-slate-600 text-sm max-w-3xl leading-relaxed">
          Transparent clinical breakdown of the Tier 0 pipeline: from DICOM quality verification to UNet-Knee multi-class segmentation, quantitative meniscus extraction, and geometric implant sizing.
        </p>
      </div>

      {/* 5 Methodology Modules */}
      <div className="space-y-8">
        
        {/* Module 1: Quality Gate */}
        <section className="clinical-card p-6 space-y-4 border-l-4 border-l-sky-600">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base">Module 0.1: DICOM Quality Verification Protocol</h2>
              <span className="text-[11px] text-slate-500 font-mono">Automated Image Quality Assessment (IQA)</span>
            </div>
          </div>

          <p className="text-slate-600 text-xs leading-relaxed">
            Prior to segmentation, every knee radiograph undergoes automated quality screening to verify spatial resolution, edge sharpness, and radiopaque contrast. Scans failing minimum quality thresholds trigger a clinician warning or quality flag.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono pt-2">
            <div className="bg-slate-50 p-3 rounded border border-slate-200">
              <span className="block text-slate-500 font-medium text-[10px]">Sharpness Index</span>
              <span className="font-bold text-slate-900">High-frequency gradient magnitude &gt; 80%</span>
            </div>
            <div className="bg-slate-50 p-3 rounded border border-slate-200">
              <span className="block text-slate-500 font-medium text-[10px]">Contrast Ratio</span>
              <span className="font-bold text-slate-900">Bone-to-soft-tissue histogram spread &gt; 85%</span>
            </div>
            <div className="bg-slate-50 p-3 rounded border border-slate-200">
              <span className="block text-slate-500 font-medium text-[10px]">Signal-to-Noise Ratio</span>
              <span className="font-bold text-slate-900">SNR &gt; 20.0 dB threshold</span>
            </div>
          </div>
        </section>

        {/* Module 2: Segmentation */}
        <section className="clinical-card p-6 space-y-4 border-l-4 border-l-cyan-600">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base">Module 0.2: UNet-Knee Multi-Class Anatomical Segmentation</h2>
              <span className="text-[11px] text-slate-500 font-mono">Anatomical Mask Boundaries</span>
            </div>
          </div>

          <p className="text-slate-600 text-xs leading-relaxed">
            A deep convolutional encoder-decoder architecture (<Abbr text="UNet">UNet-Knee v2.1</Abbr>) trained on expert-annotated knee radiographs extracts pixel-accurate boundaries for three mutually exclusive anatomical structures:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-cyan-50/60 p-3 rounded border border-cyan-200">
              <span className="font-semibold text-cyan-900 block mb-1">1. Femoral Condyles</span>
              <p className="text-cyan-800 text-[11px]">Distal femoral cortical bone boundaries and condylar curvature.</p>
            </div>
            <div className="bg-emerald-50/60 p-3 rounded border border-emerald-200">
              <span className="font-semibold text-emerald-900 block mb-1">2. Tibial Plateau</span>
              <p className="text-emerald-800 text-[11px]">Proximal tibial plateau surface and intercondylar eminence.</p>
            </div>
            <div className="bg-amber-50/60 p-3 rounded border border-amber-200">
              <span className="font-semibold text-amber-900 block mb-1">3. Medial Meniscus</span>
              <p className="text-amber-800 text-[11px]">Medial fibrocartilaginous meniscus boundary and joint space volume.</p>
            </div>
          </div>
        </section>

        {/* Module 3: Quantitative Meniscus */}
        <section className="clinical-card p-6 space-y-4 border-l-4 border-l-amber-500">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base">Module 0.3: Sub-Regional Meniscus Thickness Derivation</h2>
              <span className="text-[11px] text-slate-500 font-mono">Sub-Millimeter Quantitative Metric Extraction</span>
            </div>
          </div>

          <p className="text-slate-600 text-xs leading-relaxed">
            Using spatial pixel calibration (0.12 mm/pixel), orthogonal Euclidean vectors compute thickness across three distinct anatomical sub-zones:
          </p>

          <div className="bg-slate-900 text-slate-200 p-4 rounded-md font-mono text-xs space-y-2">
            <div className="text-amber-400 font-bold">Landmark Measurement Equations:</div>
            <div>Anterior Horn Thickness (mm) = || P_ant(femur) - P_ant(tibia) ||_2 * PixelSpacing</div>
            <div>Middle Horn Thickness (mm)   = || P_mid(femur) - P_mid(tibia) ||_2 * PixelSpacing</div>
            <div>Posterior Horn Thickness (mm)  = || P_post(femur) - P_post(tibia) ||_2 * PixelSpacing</div>
          </div>
        </section>

        {/* Module 4: Implant Matching */}
        <section className="clinical-card p-6 space-y-4 border-l-4 border-l-teal-600">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base">Module 0.4: Nearest-Match TKA Sizing Engine</h2>
              <span className="text-[11px] text-slate-500 font-mono">Geometric Distance Sizing Optimization</span>
            </div>
          </div>

          <p className="text-slate-600 text-xs leading-relaxed">
            Patient bone dimensions are evaluated against standardized TKA implant manufacturer tables using 4-dimensional Euclidean distance minimization:
          </p>

          <div className="bg-slate-900 text-slate-200 p-4 rounded-md font-mono text-xs space-y-2">
            <div className="text-teal-400 font-bold">Minimum Distance Fitness Function:</div>
            <div>D_fit = sqrt( (W_femur - W_imp)^2 + (W_tibia - W_imp)^2 + (AP_femur - AP_imp)^2 + (AP_tibia - AP_imp)^2 )</div>
            <div className="text-slate-400 text-[11px] pt-1">Optimal Match = min(D_fit) across manufacturer catalog</div>
          </div>
        </section>

      </div>

      {/* Direct Action Link */}
      <div className="text-center pt-4">
        <Link
          to="/workspace"
          className="bg-sky-600 hover:bg-sky-500 text-white font-semibold px-6 py-3 rounded-md text-sm shadow-md inline-flex items-center space-x-2"
        >
          <span>Open Interactive Case Workspace</span>
          <CheckCircle2 className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
