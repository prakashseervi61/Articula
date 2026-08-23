import React, { useEffect, useState } from 'react';
import PopulationChart from '../components/PopulationChart';
import Tier1PreviewCard from '../components/Tier1PreviewCard';
import { BarChart3, Users, FileSpreadsheet, ShieldCheck, Sparkles } from 'lucide-react';

export default function PopulationView({ activeCase }) {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetch('/api/analytics')
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('Analytics unavailable')))
      .then(setAnalytics)
      .catch(() => setAnalytics(null));
  }, []);

  const totalImages = analytics?.grades?.reduce((sum, row) => sum + row.images, 0) || 9786;
  const totalMri = analytics?.acl?.reduce((sum, row) => sum + row.exams, 0) || 917;
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-5 space-y-2">
        <div className="inline-flex items-center space-x-2 text-sky-700 bg-sky-50 px-2.5 py-1 rounded text-xs font-mono font-medium">
          <BarChart3 className="w-4 h-4 text-sky-600" />
          <span>Module 0.7 Population Analytics & Epidemiological Research</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Population & Reference Cohort Analysis</h1>
        <p className="text-slate-600 text-sm max-w-3xl leading-relaxed">
          Evaluate medial meniscus quantitative thickness (mm) against normative and osteoarthritis-stratified reference distributions across age, sex, and Kellgren-Lawrence severity grades.
        </p>
      </div>

      {/* Main Population Chart Component */}
      <PopulationChart activeCase={activeCase} />

      {/* Cohort Summary Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="clinical-card p-4 text-center space-y-1">
          <span className="text-slate-500 font-mono text-[10px] uppercase tracking-wider block">Reference Dataset Size</span>
          <span className="text-2xl font-bold font-mono text-slate-900">{totalImages.toLocaleString()}</span>
          <span className="text-slate-400 text-[11px] block">Bundled X-ray images</span>
        </div>

        <div className="clinical-card p-4 text-center space-y-1">
          <span className="text-slate-500 font-mono text-[10px] uppercase tracking-wider block">MRI Cohort Database</span>
          <span className="text-2xl font-bold font-mono text-emerald-600">{totalMri.toLocaleString()}</span>
          <span className="text-slate-400 text-[11px] block">MRI exams with ACL metadata</span>
        </div>

        <div className="clinical-card p-4 text-center space-y-1">
          <span className="text-slate-500 font-mono text-[10px] uppercase tracking-wider block">KL 3 Severe OA Mean</span>
          <span className="text-2xl font-bold font-mono text-amber-600">2.65 mm</span>
          <span className="text-slate-400 text-[11px] block">49% Thinning vs Control</span>
        </div>

        <div className="clinical-card p-4 text-center space-y-1">
          <span className="text-slate-500 font-mono text-[10px] uppercase tracking-wider block">KL 4 Bone-on-Bone Mean</span>
          <span className="text-2xl font-bold font-mono text-rose-600">1.80 mm</span>
          <span className="text-slate-400 text-[11px] block">Severe Cartilage Loss</span>
        </div>

      </div>

      {/* Tier 1 Preview Component */}
      <div className="pt-2">
        <Tier1PreviewCard
          title="Reference-Population Percentile Radar Comparison"
          description="Multi-axial percentile visualization comparing joint space width, condylar flare, meniscus thickness, and osteophyte density against age/sex matched controls."
          icon={Sparkles}
        />
      </div>

    </div>
  );
}
