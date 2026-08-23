import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Activity, ShieldAlert, CheckCircle2, Sliders } from 'lucide-react';
import Abbr from './Abbr';

export default function KneeHealthFingerprint({ selectedCase }) {
  if (!selectedCase) {
    return (
      <div className="clinical-card p-4 space-y-2 border-l-4 border-l-slate-400 bg-slate-50/50">
        <div className="flex items-center space-x-2 text-slate-700 font-semibold text-xs">
          <Activity className="w-4 h-4 text-slate-400" />
          <span>Knee Health Fingerprint Standby</span>
        </div>
        <p className="text-xs text-slate-500 font-mono leading-relaxed">
          Upload a radiograph or select a case to generate the composite multi-parameter radar visualizer.
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
          <span>Knee Health Fingerprint Aborted</span>
        </div>
        <p className="text-xs text-red-900 font-mono leading-relaxed">
          DICOM Quality Gate Failed: Multi-parameter radar synthesis aborted due to invalid non-radiographic input.
        </p>
      </div>
    );
  }

  const oaGrade = selectedCase.oaGrade ?? 2;
  const meniscus = selectedCase.measurements?.meniscus || {};
  const midMm = meniscus.middleMm ?? 2.6;

  // Calculate composite multi-parameter joint health scores (0 - 100%)
  const jointSpaceScore = Math.max(15, Math.min(99, Math.round(100 - (oaGrade * 18.5) + (midMm * 3))));
  const meniscusScore = Math.max(20, Math.min(99, Math.round((midMm / 5.5) * 100)));
  const cartilageScore = Math.max(18, Math.min(99, Math.round(96 - (oaGrade * 17))));
  const boneQualityScore = Math.max(25, Math.min(99, Math.round(98 - (oaGrade * 11))));
  const osteophyteFreeScore = Math.max(10, Math.min(99, Math.round(97 - (oaGrade * 21))));

  const radarData = [
    { metric: 'Joint Space Volume', score: jointSpaceScore, reference: 85 },
    { metric: 'Meniscus Integrity', score: meniscusScore, reference: 85 },
    { metric: 'Cartilage Preservation', score: cartilageScore, reference: 85 },
    { metric: 'Subchondral Bone', score: boneQualityScore, reference: 85 },
    { metric: 'Osteophyte Absence', score: osteophyteFreeScore, reference: 85 }
  ];

  const overallHealthIndex = Math.round(
    (jointSpaceScore + meniscusScore + cartilageScore + boneQualityScore + osteophyteFreeScore) / 5
  );

  return (
    <div className="clinical-card p-4 space-y-4 border-l-4 border-l-cyan-500">
      
      {/* Card Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-cyan-600" />
          <div>
            <h3 className="font-semibold text-slate-900 text-xs tracking-tight">
              Knee Health Fingerprint (Radar Visualizer)
            </h3>
            <p className="text-[10px] text-slate-500 font-mono">
              Composite Multi-Parameter Joint Profile
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-mono font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
            Score: {overallHealthIndex}/100
          </span>
        </div>
      </div>

      {/* Radar Chart Visualizer */}
      <div className="h-56 w-full bg-slate-950 rounded-lg p-2 border border-slate-800 relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
            <PolarGrid stroke="#334155" strokeDasharray="3 3" />
            <PolarAngleAxis
              dataKey="metric"
              tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 8 }} />
            <Radar
              name="Patient Joint Score"
              dataKey="score"
              stroke="#06b6d4"
              fill="#06b6d4"
              fillOpacity={0.45}
            />
            <Radar
              name="Healthy Age-Matched Norm"
              dataKey="reference"
              stroke="#64748b"
              fill="#64748b"
              fillOpacity={0.15}
              strokeDasharray="2 2"
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '6px', fontSize: '11px', color: '#fff' }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Parameter Metrics Breakdown Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
        <div className="bg-slate-50 p-2 rounded border border-slate-200">
          <span className="text-[10px] text-slate-500 block">Joint Space</span>
          <span className="font-bold text-slate-800">{jointSpaceScore}%</span>
        </div>

        <div className="bg-slate-50 p-2 rounded border border-slate-200">
          <span className="text-[10px] text-slate-500 block">Meniscus Status</span>
          <span className="font-bold text-slate-800">{meniscusScore}%</span>
        </div>

        <div className="bg-slate-50 p-2 rounded border border-slate-200">
          <span className="text-[10px] text-slate-500 block">Cartilage Index</span>
          <span className="font-bold text-slate-800">{cartilageScore}%</span>
        </div>

        <div className="bg-slate-50 p-2 rounded border border-slate-200">
          <span className="text-[10px] text-slate-500 block">Subchondral Bone</span>
          <span className="font-bold text-slate-800">{boneQualityScore}%</span>
        </div>

        <div className="bg-slate-50 p-2 rounded border border-slate-200">
          <span className="text-[10px] text-slate-500 block">Osteophyte Free</span>
          <span className="font-bold text-slate-800">{osteophyteFreeScore}%</span>
        </div>

        <div className="bg-cyan-50 p-2 rounded border border-cyan-200">
          <span className="text-[10px] text-cyan-700 block"><Abbr text="KL">KL</Abbr> OA Grade</span>
          <span className="font-bold text-cyan-900">Grade {oaGrade}</span>
        </div>
      </div>

    </div>
  );
}
