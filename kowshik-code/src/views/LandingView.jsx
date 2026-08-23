import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Ruler, Cpu, ShieldCheck, ArrowRight, Layers, FileText, CheckCircle2, ChevronRight, BarChart3, Database, ScanLine } from 'lucide-react';

export default function LandingView() {
  const navigate = useNavigate();
  const [activePipelineStep, setActivePipelineStep] = useState(2);

  const pipelineSteps = [
    {
      step: 1,
      title: "1. DICOM Image Ingestion & Quality Gate",
      subtitle: "Spatial resolution, sharpness & contrast verification",
      desc: "Validates incoming knee radiographs for exposure artifacts, contrast ratio, SNR (dB), and spatial pixel calibration before AI processing.",
      icon: ShieldCheck,
      details: "Quality Threshold: Sharpness > 80%, SNR > 20dB"
    },
    {
      step: 2,
      title: "2. Multi-Class Anatomical Segmentation",
      subtitle: "UNet-Knee Engine boundary extraction",
      desc: "Extracts pixel-accurate anatomical boundaries for Femoral Condyles, Tibial Plateau, and Medial Meniscus.",
      icon: Layers,
      details: "Model: UNet-Knee v2.1 | Resolution: 0.12mm/px"
    },
    {
      step: 3,
      title: "3. Medial Meniscus Quantitative Extraction",
      subtitle: "Anterior, Middle & Posterior sub-regional thickness (mm)",
      desc: "Derives sub-millimeter thickness metrics at defined anatomical landmarks correlated with osteoarthritis severity and patient demographics.",
      icon: Activity,
      details: "Confidence score generated per sub-region"
    },
    {
      step: 4,
      title: "4. TKA Implant Nearest-Match Sizing",
      subtitle: "Geometric sizing against standardized implant catalog",
      desc: "Maps measured femoral condylar width, tibial plateau width, and AP depths against implant manufacturer dimensions to compute nearest-fit sizes.",
      icon: Ruler,
      details: "Database: Stryker, Zimmer, DePuy, Smith & Nephew"
    },
    {
      step: 5,
      title: "5. Clinician Verification & Structured Report",
      subtitle: "Clinician sign-off, overrides & audit logging",
      desc: "Enables clinicians to verify automated outputs, apply numerical overrides, append clinical notes, and generate exportable reports.",
      icon: FileText,
      details: "Includes persistent decision-support disclaimer"
    }
  ];

  return (
    <div className="space-y-12 pb-12">
      
      {/* Hero Header Section */}
      <section className="bg-slate-900 text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-6">


            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              AI-Assisted Orthopedic <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400">Knee Intelligence</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              ARTICULA combines X-Ray Kellgren-Lawrence severe grading, transparent Grad-CAM explainability heatmaps, MRI joint-space width measurements, and patient-specific total knee arthroplasty (TKA) implant sizing into one unified clinical workflow.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/workspace"
                className="bg-sky-600 hover:bg-sky-500 text-white font-semibold px-6 py-3 rounded-lg text-sm flex items-center space-x-2 shadow-lg shadow-sky-900/40 transition-all hover:scale-105"
              >
                <span>Launch Interactive Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/mri-explorer"
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium px-5 py-3 rounded-lg text-sm flex items-center space-x-2 transition-all hover:scale-105"
              >
                <ScanLine className="w-4 h-4 text-teal-400" />
                <span>Try MRI Explorer</span>
              </Link>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center space-x-6 text-xs text-slate-400 font-mono">
              <span>Engine: v1.0.0</span>
              <span>•</span>
              <span>UNet-Knee v2.1</span>
              <span>•</span>
              <span>Non-Diagnostic CDS</span>
            </div>
          </div>

          {/* Hero Visual Card */}
          <div className="lg:col-span-5">
            <div className="clinical-card bg-slate-950 border-slate-800 p-5 space-y-4 shadow-2xl relative">
              <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-3">
                <span className="text-slate-400 font-mono font-medium">REAL-TIME DICOM ANALYSIS DEMO</span>
                <span className="text-emerald-400 font-mono text-[10px] bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">PASS (94%)</span>
              </div>

              {/* Mini Interactive Segmentation Preview Graphic */}
              <div className="relative bg-slate-900 rounded border border-slate-800 p-4 flex items-center justify-center">
                <svg viewBox="0 0 300 200" className="w-full h-44 drop-shadow">
                  {/* Bone Contours */}
                  <path d="M 40,30 C 60,15 150,15 260,30 C 270,70 250,110 200,120 C 150,125 100,125 40,30 Z" fill="#334155" opacity="0.7" />
                  <path d="M 50,140 C 90,130 180,130 250,140 C 260,170 240,195 50,195 Z" fill="#334155" opacity="0.7" />
                  {/* Segmentation Layers */}
                  <path d="M 40,30 C 60,15 150,15 260,30 C 270,70 250,110 200,120 Z" fill="#06b6d4" opacity="0.4" stroke="#0891b2" strokeWidth="1" />
                  <path d="M 50,140 C 90,130 180,130 250,140 Z" fill="#10b981" opacity="0.4" stroke="#059669" strokeWidth="1" />
                  <path d="M 60,125 C 80,122 130,122 150,125 C 140,130 70,130 60,125 Z" fill="#f59e0b" opacity="0.7" stroke="#d97706" strokeWidth="1.5" />
                </svg>

                {/* Callout Chips */}
                <div className="absolute top-3 left-3 bg-slate-950/90 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded text-[10px] font-mono">
                  Femur: 71.5mm
                </div>
                <div className="absolute bottom-3 left-3 bg-slate-950/90 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded text-[10px] font-mono">
                  Tibia: 68.2mm
                </div>
                <div className="absolute top-1/2 right-3 -translate-y-1/2 bg-slate-950/90 text-amber-300 border border-amber-800 px-2 py-0.5 rounded text-[10px] font-mono">
                  Meniscus: 2.83mm
                </div>
              </div>

              <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between">
                <span>Nearest Fit: Stryker Triathlon (Size 4/3)</span>
                <span className="text-teal-400">Delta: 0.35mm</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Dual Core Capabilities Grid */}
        <section className="space-y-6">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">Dual Core Clinical Requirements</h2>
            <p className="text-slate-600 text-sm">
              ARTICULA combines sub-millimeter soft tissue degradation assessment with high-precision total joint replacement pre-operative sizing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Requirement 1 Card */}
            <div className="clinical-card p-6 space-y-4 border-t-4 border-t-amber-500 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                1. Quantitative Medial Meniscus Thickness
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Automated sub-regional measurement of medial meniscus thickness at defined anatomical locations (anterior, middle, posterior horns), contextualized against osteoarthritis status (KL Grades 0-4), patient age, and sex demographics.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 font-mono pt-2">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Anterior, Middle & Posterior sub-zone extraction</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Module 0.7 statistical population comparison</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Confidence scoring per landmark node</span>
                </li>
              </ul>
            </div>

            {/* Requirement 2 Card */}
            <div className="clinical-card p-6 space-y-4 border-t-4 border-t-sky-600 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                <Ruler className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                2. TKA Anatomical Sizing & Implant Matching
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Automated, patient-specific femoral condylar and tibial plateau anatomical measurements for total knee arthroplasty (TKA), matched against a standardized implant dimension catalog to determine optimal component fit.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 font-mono pt-2">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Femoral Condyle & Tibial Plateau width (mm)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Anterior-Posterior (AP) depth calculations</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Euclidean distance nearest-match lookup</span>
                </li>
              </ul>
            </div>

          </div>
        </section>

        {/* Interactive 5-Stage Pipeline Visualizer */}
        <section className="bg-slate-900 text-white rounded-xl p-6 sm:p-8 space-y-8 border border-slate-800 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <span className="text-sky-400 font-mono text-xs font-semibold uppercase tracking-wider">End-to-End Processing Architecture</span>
              <h2 className="text-2xl font-bold text-white mt-1">Tier 0 Intelligence Pipeline</h2>
            </div>
            <Link
              to="/workspace"
              className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold px-4 py-2 rounded flex items-center space-x-1.5 self-start md:self-auto"
            >
              <span>Test Pipeline in Workspace</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Pipeline Nodes Selector Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {pipelineSteps.map((s) => {
              const Icon = s.icon;
              const isActive = activePipelineStep === s.step;
              return (
                <button
                  key={s.step}
                  onClick={() => setActivePipelineStep(s.step)}
                  className={`p-3 rounded-lg text-left transition-all border ${
                    isActive
                      ? 'bg-sky-950 border-sky-500 text-white shadow-md'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${isActive ? 'bg-sky-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
                      0{s.step}
                    </span>
                    <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-500'}`} />
                  </div>
                  <div className="font-semibold text-xs truncate">{s.title.split('.')[1]}</div>
                </button>
              );
            })}
          </div>

          {/* Active Step Details Panel */}
          {pipelineSteps.find(s => s.step === activePipelineStep) && (
            <div className="bg-slate-950 p-6 rounded-lg border border-slate-800 space-y-4">
              {(() => {
                const current = pipelineSteps.find(s => s.step === activePipelineStep);
                const Icon = current.icon;
                return (
                  <>
                    <div className="flex items-center space-x-3 text-sky-400">
                      <Icon className="w-6 h-6" />
                      <div>
                        <h3 className="font-bold text-white text-base">{current.title}</h3>
                        <p className="text-xs text-slate-400 font-mono">{current.subtitle}</p>
                      </div>
                    </div>

                    <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
                      {current.desc}
                    </p>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                      <span>Specification: {current.details}</span>
                      <span className="text-sky-400">Execution latency: &lt; 450ms</span>
                    </div>
                  </>
                );
              })()}
            </div>
          )}

        </section>

        {/* Clinical Positioning Statement */}
        <section className="clinical-card p-6 bg-slate-900 text-slate-300 border-slate-800 space-y-3">
          <h3 className="font-bold text-white text-sm uppercase tracking-wider font-mono">
            Regulatory & Decision-Support Statement
          </h3>
          <p className="text-xs leading-relaxed text-slate-300">
            ARTICULA is developed specifically as a <strong>Clinical Decision-Support (CDS) and Research Platform</strong>. It provides objective, quantitative anatomical metrics and nearest-fit component suggestions to assist qualified radiologists and orthopedic surgeons. ARTICULA is not an autonomous diagnostic or treatment device, does not make independent clinical determinations, and does not replace professional clinical judgment.
          </p>
        </section>

      </div>
    </div>
  );
}
