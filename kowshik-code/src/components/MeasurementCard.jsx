import React from 'react';
import { Ruler, Activity, CheckCircle, AlertCircle, BarChart2 } from 'lucide-react';
import Abbr from './Abbr';

export default function MeasurementCard({ measurements }) {
  if (!measurements) {
    return (
      <div className="clinical-card p-4 space-y-2 border-l-4 border-l-slate-400 bg-slate-50/50">
        <div className="flex items-center space-x-2 text-slate-700 font-semibold text-xs">
          <Activity className="w-4 h-4 text-slate-400" />
          <span>Quantitative Extraction Standby</span>
        </div>
        <p className="text-xs text-slate-500 font-mono leading-relaxed">
          Upload a knee radiograph or select a sample case to extract sub-regional meniscus thickness and <Abbr text="TKA">TKA</Abbr> bone sizing.
        </p>
      </div>
    );
  }

  if (measurements.isFail || measurements.meniscus?.status?.includes('Aborted')) {
    return (
      <div className="clinical-card p-4 space-y-2 border-l-4 border-l-red-600 bg-red-50/50">
        <div className="flex items-center space-x-2 text-red-700 font-bold text-xs">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <span>Quantitative Extraction Aborted</span>
        </div>
        <p className="text-xs text-red-900 font-mono leading-relaxed">
          DICOM Quality Gate Failed: Uploaded file is not a recognized weight-bearing knee radiograph. Soft tissue and bone metric extraction aborted to prevent erroneous clinical measurements.
        </p>
      </div>
    );
  }

  const { meniscus, bone } = measurements;

  return (
    <div className="space-y-4">
      
      {/* 1. Medial Meniscus Quantitative Thickness Card */}
      <div className="clinical-card p-4 space-y-3 border-l-4 border-l-amber-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-amber-600" />
            <h3 className="font-semibold text-slate-900 text-xs tracking-tight">
              Medial Meniscus Thickness (Quantified)
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
            Conf: {meniscus.confidence}%
          </span>
        </div>

        <p className="text-[11px] text-slate-500 font-mono">
          Status: <strong className="text-slate-800 font-semibold">{meniscus.status}</strong> | Ref: {meniscus.referenceRange}
        </p>

        {/* 3 Sub-region Grid */}
        <div className="grid grid-cols-3 gap-2">
          
          <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-center">
            <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-medium">Anterior</span>
            <span className="text-base font-bold font-mono text-slate-900">{meniscus.anteriorMm}</span>
            <span className="text-[10px] text-slate-400 font-mono"> mm</span>
          </div>

          <div className="bg-amber-50/60 p-2.5 rounded border border-amber-200 text-center">
            <span className="block text-[10px] text-amber-800 uppercase tracking-wider font-semibold">Middle</span>
            <span className="text-base font-bold font-mono text-amber-900">{meniscus.middleMm}</span>
            <span className="text-[10px] text-amber-700 font-mono"> mm</span>
          </div>

          <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-center">
            <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-medium">Posterior</span>
            <span className="text-base font-bold font-mono text-slate-900">{meniscus.posteriorMm}</span>
            <span className="text-[10px] text-slate-400 font-mono"> mm</span>
          </div>

        </div>

        {/* Confidence Indicator Bar */}
        <div className="space-y-1 pt-1">
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>Extraction Confidence</span>
            <span>{meniscus.confidence}% (High Precision)</span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full"
              style={{ width: `${meniscus.confidence}%` }}
            ></div>
          </div>
        </div>

      </div>

      {/* 2. Anatomical Bone Sizing Metrics Card */}
      <div className="clinical-card p-4 space-y-3 border-l-4 border-l-sky-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Ruler className="w-4 h-4 text-sky-600" />
            <h3 className="font-semibold text-slate-900 text-xs tracking-tight">
              <Abbr text="TKA">TKA</Abbr> Bone Anatomical Sizing
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200">
            Conf: {bone.confidence}%
          </span>
        </div>

        <p className="text-[11px] text-slate-500 font-mono">
          Contour: <strong className="text-slate-800 font-semibold">{bone.status}</strong> | Ref: {bone.referenceRange}
        </p>

        {/* 4 Dimension Parameters Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          
          <div className="bg-slate-50 p-2 rounded border border-slate-200">
            <span className="block text-[10px] text-slate-500 font-medium">Femoral Condyle Width</span>
            <div className="flex items-baseline space-x-1 mt-0.5">
              <span className="text-sm font-bold font-mono text-slate-900">{bone.femoralCondyleWidthMm}</span>
              <span className="text-[10px] text-slate-500 font-mono">mm</span>
            </div>
          </div>

          <div className="bg-slate-50 p-2 rounded border border-slate-200">
            <span className="block text-[10px] text-slate-500 font-medium">Tibial Plateau Width</span>
            <div className="flex items-baseline space-x-1 mt-0.5">
              <span className="text-sm font-bold font-mono text-slate-900">{bone.tibialPlateauWidthMm}</span>
              <span className="text-[10px] text-slate-500 font-mono">mm</span>
            </div>
          </div>

          <div className="bg-slate-50 p-2 rounded border border-slate-200">
            <span className="block text-[10px] text-slate-500 font-medium">Femoral <Abbr text="AP">AP</Abbr> Depth</span>
            <div className="flex items-baseline space-x-1 mt-0.5">
              <span className="text-sm font-bold font-mono text-slate-900">{bone.femoralApMm}</span>
              <span className="text-[10px] text-slate-500 font-mono">mm</span>
            </div>
          </div>

          <div className="bg-slate-50 p-2 rounded border border-slate-200">
            <span className="block text-[10px] text-slate-500 font-medium">Tibial <Abbr text="AP">AP</Abbr> Depth</span>
            <div className="flex items-baseline space-x-1 mt-0.5">
              <span className="text-sm font-bold font-mono text-slate-900">{bone.tibialApMm}</span>
              <span className="text-[10px] text-slate-500 font-mono">mm</span>
            </div>
          </div>

        </div>

        {/* Confidence Bar */}
        <div className="space-y-1 pt-1">
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>Sizing Accuracy Confidence</span>
            <span>{bone.confidence}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-sky-600 rounded-full"
              style={{ width: `${bone.confidence}%` }}
            ></div>
          </div>
        </div>

      </div>

    </div>
  );
}
