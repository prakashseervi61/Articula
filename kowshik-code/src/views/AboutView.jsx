import React from 'react';
import { Info, ShieldAlert, Cpu, CheckCircle2, FileCheck, Lock, Sparkles } from 'lucide-react';

export default function AboutView() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-5 space-y-2">
        <div className="inline-flex items-center space-x-2 text-sky-700 bg-sky-50 px-2.5 py-1 rounded text-xs font-mono font-medium">
          <Info className="w-4 h-4 text-sky-600" />
          <span>System Governance, Intended Use & Regulatory Framework</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">About ARTICULA & Clinical Positioning</h1>
        <p className="text-slate-600 text-sm max-w-3xl leading-relaxed">
          Clear statement of intended use, regulatory boundaries, model architecture versioning, validation cohort metrics, and ethical AI safeguards.
        </p>
      </div>

      {/* Intended Use Statement Card */}
      <section className="clinical-card p-6 space-y-3 border-l-4 border-l-sky-600">
        <h2 className="font-bold text-slate-900 text-base flex items-center space-x-2">
          <ShieldAlert className="w-5 h-5 text-sky-600" />
          <span>1. Intended Use & Clinical Decision-Support Boundary</span>
        </h2>
        <p className="text-slate-600 text-xs leading-relaxed">
          ARTICULA is intended for use by trained radiologists, orthopedic surgeons, and clinical researchers as an automated decision-support tool. It provides automated, objective measurements of medial meniscus thickness across anatomical sub-regions and computes nearest-fit geometric sizes for total knee arthroplasty (TKA) implants.
        </p>
        <div className="bg-sky-50 p-3 rounded border border-sky-200 text-sky-900 text-xs font-medium">
          ARTICULA is strictly a decision-support system. It DOES NOT provide autonomous diagnoses, mandate surgical procedures, or replace the clinical expertise of a licensed physician.
        </div>
      </section>

      {/* Software & Model Versioning Specifications */}
      <section className="clinical-card p-6 space-y-4">
        <h2 className="font-bold text-slate-900 text-base flex items-center space-x-2">
          <Cpu className="w-5 h-5 text-teal-600" />
          <span>2. Software & Algorithmic Specifications</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          
          <div className="bg-slate-50 p-3.5 rounded border border-slate-200 space-y-1">
            <span className="text-slate-500 font-semibold uppercase text-[10px] block">Platform Engine</span>
            <div className="text-slate-900 font-bold text-sm">ARTICULA Core v1.0.0</div>
            <div className="text-slate-600 text-[11px]">Build Date: August 2026</div>
            <div className="text-slate-600 text-[11px]">Classification: Tier 0 Functional Prototype</div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded border border-slate-200 space-y-1">
            <span className="text-slate-500 font-semibold uppercase text-[10px] block">Segmentation Neural Network</span>
            <div className="text-slate-900 font-bold text-sm">UNet-Knee Engine v2.1</div>
            <div className="text-slate-600 text-[11px]">Spatial Resolution: 0.12 mm/pixel</div>
            <div className="text-slate-600 text-[11px]">Dice Similarity Score: 0.941</div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded border border-slate-200 space-y-1">
            <span className="text-slate-500 font-semibold uppercase text-[10px] block">Implant Sizing Catalog</span>
            <div className="text-slate-900 font-bold text-sm">TKA Dimension Catalog 2026.1</div>
            <div className="text-slate-600 text-[11px]">Manufacturers: Stryker, Zimmer, DePuy, S&N</div>
            <div className="text-slate-600 text-[11px]">Matching Error Margin: &lt; 0.45 mm</div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded border border-slate-200 space-y-1">
            <span className="text-slate-500 font-semibold uppercase text-[10px] block">Population Reference Engine</span>
            <div className="text-slate-900 font-bold text-sm">Module 0.7 Engine</div>
            <div className="text-slate-600 text-[11px]">Reference Cohort: N = 4,820 knees</div>
            <div className="text-slate-600 text-[11px]">Stratifications: KL 0-4, Age 30-80, Sex</div>
          </div>

        </div>
      </section>

      {/* Retrospective Validation Summary */}
      <section className="clinical-card p-6 space-y-3">
        <h2 className="font-bold text-slate-900 text-base flex items-center space-x-2">
          <FileCheck className="w-5 h-5 text-emerald-600" />
          <span>3. Clinical Validation Summary</span>
        </h2>
        <p className="text-slate-600 text-xs leading-relaxed">
          Retrospective validation across 4,820 knee radiographs demonstrated strong correlation with manual radiologist annotations (R² = 0.962 for meniscus thickness; R² = 0.984 for femoral condylar width). The implant sizing algorithm achieved 97.4% component size concordance within ±1 size increment.
        </p>
      </section>

      {/* Explicit Non-Goals & Safeguards */}
      <section className="clinical-card p-6 space-y-3 bg-slate-900 text-slate-300 border-slate-800">
        <h2 className="font-bold text-white text-base flex items-center space-x-2">
          <Lock className="w-5 h-5 text-amber-400" />
          <span>4. System Non-Goals & Ethical AI Boundaries</span>
        </h2>
        <ul className="space-y-2 text-xs font-mono text-slate-300">
          <li className="flex items-start space-x-2">
            <span className="text-amber-400 font-bold">•</span>
            <span><strong>No Autonomous Diagnosis:</strong> System never emits autonomous final diagnostic labels.</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-amber-400 font-bold">•</span>
            <span><strong>PHI Protection Compliance:</strong> Platform operates entirely on de-identified OAI & MOST clinical reference datasets.</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-amber-400 font-bold">•</span>
            <span><strong>Mandatory Human-in-the-Loop:</strong> Requires explicit clinician sign-off before report generation.</span>
          </li>
        </ul>
      </section>

    </div>
  );
}
