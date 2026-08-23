import React from 'react';
import { Link } from 'react-router-dom';
import ImplantTable from '../components/ImplantTable';
import ImplantMatchCard from '../components/ImplantMatchCard';
import { findNearestImplantMatch } from '../data/implantDatabase';
import { Ruler, Database, CheckCircle2, Sparkles, UploadCloud, Upload, ArrowRight } from 'lucide-react';

export default function ImplantMatchingView({ activeCase, setActiveCase }) {
  // If no knee radiograph image has been uploaded / selected, display the Upload Standby state
  if (!activeCase) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header */}
        <div className="border-b border-slate-200 pb-5 space-y-2">
          <div className="inline-flex items-center space-x-2 text-teal-700 bg-teal-50 px-2.5 py-1 rounded text-xs font-mono font-medium">
            <Ruler className="w-4 h-4 text-teal-600" />
            <span>Module 0.4 TKA Implant Sizing & Geometric Matching Engine</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">TKA Implant Sizing & Matching</h1>
          <p className="text-slate-600 text-sm max-w-3xl leading-relaxed">
            Patient-specific femoral and tibial anatomical measurements mapped against authentic surgical dimension catalogs from leading TKA implant manufacturers (<strong className="text-slate-800">Stryker®</strong>, <strong className="text-slate-800">Zimmer Biomet®</strong>, <strong className="text-slate-800">DePuy Synthes®</strong>, and <strong className="text-slate-800">Smith & Nephew®</strong>) to compute nearest geometric fit.
          </p>
        </div>

        {/* Upload Standby Prompt Card */}
        <div className="bg-slate-900 text-white rounded-2xl p-8 sm:p-12 text-center space-y-5 border border-slate-800 shadow-xl max-w-3xl mx-auto my-8">
          <div className="w-16 h-16 bg-teal-500/10 border border-teal-500/30 rounded-2xl flex items-center justify-center mx-auto text-teal-400">
            <UploadCloud className="w-8 h-8" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white tracking-tight">
              No Knee Radiograph Image Uploaded
            </h2>
            <p className="text-slate-400 text-sm max-w-lg mx-auto leading-relaxed">
              TKA implant sizing recommendations are generated dynamically from patient anatomical measurements extracted upon radiograph analysis. Please upload a knee radiograph in the Workspace to view recommendations.
            </p>
          </div>

          <div className="pt-2">
            <Link
              to="/workspace"
              className="inline-flex items-center space-x-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs px-5 py-3 rounded-lg shadow-md transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Go to Workspace & Upload Knee Radiograph</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>

        {/* Interactive Reference Catalog Table */}
        <ImplantTable activeMatch={null} />

      </div>
    );
  }

  const includeImplantSizing = activeCase?.includeImplantSizing !== false;

  // Active patient case exists (knee radiograph uploaded or case selected)
  const bone = activeCase?.measurements?.bone || {
    femoralCondyleWidthMm: 71.5,
    tibialPlateauWidthMm: 68.2,
    femoralApMm: 58.4,
    tibialApMm: 46.1
  };

  // Dynamically compute nearest implant match based on patient radiograph measurements
  const implantMatch = activeCase?.implantMatch || findNearestImplantMatch(
    bone.femoralCondyleWidthMm,
    bone.tibialPlateauWidthMm,
    bone.femoralApMm,
    bone.tibialApMm
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-5 space-y-2">
        <div className="inline-flex items-center space-x-2 text-teal-700 bg-teal-50 px-2.5 py-1 rounded text-xs font-mono font-medium">
          <Ruler className="w-4 h-4 text-teal-600" />
          <span>Module 0.4 TKA Implant Sizing & Geometric Matching Engine</span>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">TKA Implant Sizing & Matching</h1>
            <p className="text-slate-600 text-sm max-w-3xl leading-relaxed mt-1">
              Patient-specific femoral and tibial anatomical measurements mapped against authentic surgical dimension catalogs from leading TKA implant manufacturers (<strong className="text-slate-800">Stryker®</strong>, <strong className="text-slate-800">Zimmer Biomet®</strong>, <strong className="text-slate-800">DePuy Synthes®</strong>, and <strong className="text-slate-800">Smith & Nephew®</strong>) to compute nearest geometric fit.
            </p>
          </div>

          {/* Toggle Button for Client Sizing Preference */}
          <button
            type="button"
            onClick={() => {
              if (setActiveCase) {
                setActiveCase({ ...activeCase, includeImplantSizing: !includeImplantSizing });
              }
            }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer flex items-center space-x-2 ${
              includeImplantSizing
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>{includeImplantSizing ? 'Implant Sizing Enabled' : 'Implant Sizing Excluded'}</span>
          </button>
        </div>
      </div>

      {!includeImplantSizing ? (
        /* Client Preference Excluded Banner */
        <div className="bg-slate-900 text-white rounded-2xl p-8 sm:p-10 border border-slate-800 shadow-xl space-y-4 text-center max-w-2xl mx-auto my-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
            <Ruler className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Implant Sizing Excluded by Client Preference
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto leading-relaxed pt-1">
              This patient profile was initially processed with TKA implant sizing excluded. Would you like to generate the implant sizing result now?
            </p>
          </div>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                if (setActiveCase) {
                  setActiveCase({ ...activeCase, includeImplantSizing: true });
                }
              }}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs rounded-lg shadow-sm transition-all cursor-pointer inline-flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-teal-300" />
              <span>Generate TKA Implant Sizing Result</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Side-by-Side Target Metrics vs Recommendation */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Patient Target Dimensions (4 cols) */}
            <div className="lg:col-span-4 clinical-card p-5 space-y-4 border-l-4 border-l-sky-600">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h3 className="font-semibold text-slate-900 text-xs tracking-tight">
                  Patient Anatomical Target ({activeCase?.id || 'Uploaded Radiograph'})
                </h3>
                <span className="text-[10px] font-mono text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                  Confidence: {bone.confidence || 94}%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">Femoral Condyle Width</span>
                  <span className="text-base font-bold text-slate-900">{bone.femoralCondyleWidthMm} mm</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">Tibial Plateau Width</span>
                  <span className="text-base font-bold text-slate-900">{bone.tibialPlateauWidthMm} mm</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">Femoral AP Depth</span>
                  <span className="text-base font-bold text-slate-900">{bone.femoralApMm} mm</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">Tibial AP Depth</span>
                  <span className="text-base font-bold text-slate-900">{bone.tibialApMm} mm</span>
                </div>
              </div>
            </div>

            {/* Recommended Nearest Match Card (8 cols) */}
            <div className="lg:col-span-8">
              <ImplantMatchCard implantMatch={implantMatch} activeCase={activeCase} bone={bone} />
            </div>

          </div>

          {/* Interactive Catalog Table */}
          <ImplantTable activeMatch={{ implant: implantMatch }} activeCase={activeCase} />
        </>
      )}

    </div>
  );
}
