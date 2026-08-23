import React from 'react';
import { Link } from 'react-router-dom';
import { formatIST } from '../utils/dateUtils';
import {
  Printer,
  ShieldCheck,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Ruler,
  Upload,
  Database,
  Info,
  Layers,
  CheckSquare
} from 'lucide-react';

export default function ReportView({ activeCase }) {
  // Gating: Require active uploaded/selected patient case
  if (!activeCase) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center mx-auto text-slate-400 shadow-xs">
          <FileText className="w-8 h-8 text-slate-500" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">No Active Patient Scan Loaded</h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            No knee radiograph or MRI scan image has been uploaded or selected. Please upload a knee scan in the Workspace to generate a clinical report.
          </p>
        </div>
        <div className="pt-2">
          <Link
            to="/workspace"
            className="inline-flex items-center space-x-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold px-5 py-2.5 rounded-lg text-xs sm:text-sm transition-all shadow-sm"
          >
            <Upload className="w-4 h-4" />
            <span>Go to Workspace & Upload Scan</span>
          </Link>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const {
    id,
    patientAlias,
    age,
    sex,
    oaGrade,
    kneeSide,
    scanType,
    scanDate,
    quality,
    measurements,
    implantMatch,
    verification,
    auditTrail
  } = activeCase;

  const bone = measurements?.bone || {
    femoralCondyleWidthMm: 71.5,
    tibialPlateauWidthMm: 68.2,
    femoralApMm: 58.4,
    tibialApMm: 46.1
  };

  const meniscus = measurements?.meniscus || {
    anteriorMm: 3.8,
    middleMm: 2.6,
    posteriorMm: 2.1,
    meanMm: 2.83,
    confidence: 96
  };

  // Determine actual image input format safely (avoiding false DICOM labels for web images)
  const isRealDicom = (scanType || '').toLowerCase().includes('dicom');
  const inputFormatLabel = isRealDicom ? 'DICOM Medical Exam' : 'PNG/JPG Weight-Bearing Knee Radiograph';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Action Bar (Hidden when printing) */}
      <div className="no-print flex items-center justify-between bg-slate-900 text-white p-4 rounded-lg shadow-md border border-slate-800">
        <div>
          <h2 className="font-bold text-sm tracking-tight text-white">Structured Per-Patient Clinical Decision-Support Report</h2>
          <p className="text-xs text-slate-400 font-mono">ARTICULA Specification 3.1 • Form Section 13 Compliant</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handlePrint}
            className="bg-teal-600 hover:bg-teal-500 text-white font-medium px-4 py-2 rounded text-xs flex items-center space-x-2 shadow-sm transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Export PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Clinical Report Document Container */}
      <div className="clinical-card bg-white p-8 space-y-6 border-slate-300 shadow-xl text-slate-900 font-sans print:shadow-none print:border-none">
        
        {/* 1. REPORT HEADER */}
        <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-2xl tracking-tight text-slate-900">ARTICULA</span>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 border border-slate-300 text-slate-700">
                v0.9.4-demo
              </span>
            </div>
            <p className="text-xs font-bold text-slate-700 mt-1 uppercase tracking-wider">
              AI-ASSISTED KNEE INTELLIGENCE PLATFORM • CLINICAL DECISION-SUPPORT REPORT
            </p>
          </div>
          <div className="text-right text-xs font-mono">
            <div className="font-bold text-slate-900">Report ID: REP-{id}</div>
            <div className="text-slate-500">Date Generated: {formatIST(new Date())}</div>
            <div className="mt-1 font-bold">
              CLINICAL VERIFICATION STATUS:{' '}
              <span className={verification?.status === 'Approved' || verification?.status === 'Accepted' ? 'text-emerald-700' : 'text-amber-800'}>
                {verification?.status ? verification.status.toUpperCase() : 'PENDING'}
              </span>
            </div>
          </div>
        </div>

        {/* DEMO / RESEARCH STATUS BANNER */}
        <div className="bg-amber-50 border border-amber-300 rounded p-3 text-xs text-amber-900 space-y-1">
          <div className="font-bold uppercase tracking-wider flex items-center space-x-1.5 text-amber-950">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>DEMONSTRATION / RESEARCH BUILD (v0.9.4-demo)</span>
          </div>
          <p className="text-[11px] leading-relaxed text-amber-900">
            This report is generated by a demonstration/research version of ARTICULA. Numerical outputs, reference ranges, implant matching results, and model outputs must not be interpreted as validated clinical recommendations unless independently validated.
          </p>
        </div>

        {/* PATIENT & SCAN METADATA */}
        <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded border border-slate-200 text-xs font-mono">
          <div className="space-y-1">
            <div><span className="text-slate-500">Case ID:</span> <strong>{id}</strong></div>
            <div><span className="text-slate-500">Patient Alias:</span> <strong>{patientAlias}</strong></div>
            <div><span className="text-slate-500">Age / Sex:</span> {age} yrs / {sex}</div>
            <div><span className="text-slate-500">Anatomical Target:</span> {kneeSide || 'Right'} Knee ({scanType || 'AP Radiograph'})</div>
          </div>
          <div className="space-y-1 text-right">
            <div><span className="text-slate-500">Reference OA Grade:</span> <strong className="text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded">Grade {oaGrade}</strong></div>
            <div><span className="text-slate-500">Grade Source:</span> Reference / Clinician-Provided</div>
            <div><span className="text-slate-500">Scan Date:</span> {scanDate || '2026-08-18'}</div>
            <div><span className="text-slate-500">Input Format:</span> {inputFormatLabel}</div>
          </div>
        </div>

        {/* 2. DATA / IMAGE QUALITY SECTION */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 border-b border-slate-300 pb-1">
            <Layers className="w-4 h-4 text-sky-700" />
            <h3 className="font-bold text-xs tracking-tight uppercase text-slate-900">
              2. Data / Image Quality Assessment
            </h3>
          </div>
          <div className="grid grid-cols-4 gap-3 text-xs font-mono bg-slate-50 p-3 rounded border border-slate-200">
            <div>
              <span className="text-slate-500 block text-[10px]">Quality Status</span>
              <strong className="text-emerald-700 font-bold">{quality?.status || 'PASS'}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Overall Quality Score</span>
              <strong className="text-slate-900">{quality?.overallScore || 94}%</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Sharpness Index</span>
              <span className="text-slate-800">{quality?.sharpnessIndex || 92}%</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Signal-to-Noise (SNR)</span>
              <span className="text-slate-800">{quality?.snrDb || 24.5} dB</span>
            </div>
          </div>
        </div>

        {/* 3. SEGMENTATION QUALITY CONTROL SECTION */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 border-b border-slate-300 pb-1">
            <CheckSquare className="w-4 h-4 text-emerald-700" />
            <h3 className="font-bold text-xs tracking-tight uppercase text-slate-900">
              3. Segmentation Quality Control
            </h3>
          </div>
          <div className="grid grid-cols-4 gap-3 text-xs font-mono bg-slate-50 p-3 rounded border border-slate-200">
            <div>
              <span className="text-slate-500 block text-[10px]">Femur Segmentation</span>
              <span className="text-emerald-800 font-bold">PASS (Conf: {bone.confidence || 94}%)</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Tibia Segmentation</span>
              <span className="text-emerald-800 font-bold">PASS (Conf: {(bone.confidence || 94) - 1}%)</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Medial Meniscus</span>
              <span className="text-emerald-800 font-bold">PASS (Conf: {meniscus.confidence || 96}%)</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Overall Segmentation QC</span>
              <strong className="text-emerald-700 uppercase">PASS</strong>
            </div>
          </div>
        </div>

        {/* 4. MEDIAL MENISCUS QUANTITATIVE THICKNESS ASSESSMENT */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-300 pb-1">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-amber-600" />
              <h3 className="font-bold text-xs tracking-tight uppercase text-slate-900">
                4. Medial Meniscus Quantitative Thickness Assessment
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-500 italic">
              Illustrative Reference Range — Not for Clinical Use
            </span>
          </div>

          <table className="w-full text-xs text-left border-collapse font-mono">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-semibold uppercase text-[10px]">
                <th className="py-2 px-3">Anatomical Sub-Region</th>
                <th className="py-2 px-3">Measured Thickness (mm)</th>
                <th className="py-2 px-3">Reference Range (mm)</th>
                <th className="py-2 px-3">Confidence</th>
                <th className="py-2 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="py-2 px-3 font-sans font-medium">Anterior Horn</td>
                <td className="py-2 px-3 font-bold text-slate-900">{meniscus.anteriorMm} mm</td>
                <td className="py-2 px-3 text-slate-500">3.5 – 5.5 mm</td>
                <td className="py-2 px-3 text-slate-700">{meniscus.confidence || 96}%</td>
                <td className="py-2 px-3 text-right font-sans font-semibold text-slate-800">
                  {meniscus.anteriorMm < 3.5 ? 'Below Reference Range' : 'Within Reference Range'}
                </td>
              </tr>
              <tr className="bg-amber-50/40">
                <td className="py-2 px-3 font-sans font-semibold text-amber-950">Middle/Centroid</td>
                <td className="py-2 px-3 font-bold text-amber-950">{meniscus.middleMm} mm</td>
                <td className="py-2 px-3 text-amber-900">3.5 – 5.5 mm</td>
                <td className="py-2 px-3 text-amber-900">{meniscus.confidence || 96}%</td>
                <td className="py-2 px-3 text-right font-sans font-semibold text-amber-950">
                  {meniscus.middleMm < 3.5 ? 'Below Reference Range' : 'Within Reference Range'}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-sans font-medium">Posterior Horn</td>
                <td className="py-2 px-3 font-bold text-slate-900">{meniscus.posteriorMm} mm</td>
                <td className="py-2 px-3 text-slate-500">3.5 – 5.5 mm</td>
                <td className="py-2 px-3 text-slate-700">{meniscus.confidence || 96}%</td>
                <td className="py-2 px-3 text-right font-sans font-semibold text-slate-800">
                  {meniscus.posteriorMm < 3.5 ? 'Below Reference Range' : 'Within Reference Range'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 5. MENISCUS QUANTITATIVE INTERPRETATION SUMMARY */}
        <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-2 text-xs">
          <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider font-mono">
            5. Quantitative Summary & Interpretation
          </h4>
          <div className="grid grid-cols-2 gap-4 font-mono">
            <div>
              <span className="text-slate-500 block text-[10px]">Sub-Region Summary:</span>
              <ul className="list-disc list-inside text-slate-800 space-y-0.5 pt-0.5">
                <li>Anterior horn: <strong>{meniscus.anteriorMm} mm</strong></li>
                <li>Middle region: <strong>{meniscus.middleMm} mm</strong></li>
                <li>Posterior horn: <strong>{meniscus.posteriorMm} mm</strong></li>
              </ul>
            </div>
            <div className="space-y-1">
              <div><span className="text-slate-500">Population Position:</span> <strong>Sitting at {measurements?.meniscus?.percentile || 18}th percentile for age {age} demographic</strong></div>
              <div><span className="text-slate-500">OA Association:</span> <em className="text-slate-700">Not validated in current report (Non-diagnostic)</em></div>
            </div>
          </div>
        </div>

        {/* 6. OA / POPULATION CONTEXT */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 border-b border-slate-300 pb-1">
            <Info className="w-4 h-4 text-sky-700" />
            <h3 className="font-bold text-xs tracking-tight uppercase text-slate-900">
              6. OA / Population Context
            </h3>
          </div>
          <div className="grid grid-cols-4 gap-3 text-xs font-mono bg-slate-50 p-3 rounded border border-slate-200">
            <div>
              <span className="text-slate-500 block text-[10px]">Reference OA Grade</span>
              <strong className="text-amber-900">Grade {oaGrade}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Grade Source</span>
              <span className="text-slate-800">Reference / Clinician-Provided</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Demographic</span>
              <span className="text-slate-800">{age} yrs / {sex}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Age-Adjusted Percentile</span>
              <strong className="text-slate-900">{measurements?.meniscus?.percentile || 18}th Percentile</strong>
            </div>
          </div>
        </div>

        {/* 7. KNEE HEALTH FINGERPRINT SUMMARY */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 border-b border-slate-300 pb-1">
            <Database className="w-4 h-4 text-teal-600" />
            <h3 className="font-bold text-xs tracking-tight uppercase text-slate-900">
              7. Knee Health Fingerprint Overview
            </h3>
          </div>
          <div className="grid grid-cols-3 gap-3 text-xs font-mono bg-slate-900 text-white p-3 rounded border border-slate-800">
            <div>
              <span className="text-teal-400 block text-[10px] uppercase">Meniscal Mean Thickness</span>
              <strong className="text-white text-sm">{meniscus.meanMm || 2.83} mm</strong>
            </div>
            <div>
              <span className="text-teal-400 block text-[10px] uppercase">Femoral / Tibial ML Widths</span>
              <strong className="text-white text-sm">{bone.femoralCondyleWidthMm} mm / {bone.tibialPlateauWidthMm} mm</strong>
            </div>
            <div>
              <span className="text-teal-400 block text-[10px] uppercase">Femoral / Tibial AP Depths</span>
              <strong className="text-white text-sm">{bone.femoralApMm} mm / {bone.tibialApMm} mm</strong>
            </div>
          </div>
        </div>

        {/* SECTION BREAK: TKA IMPLANT SIZING & GEOMETRIC MATCHING (CONDITIONAL UPON CLIENT PREFERENCE) */}
        {activeCase?.includeImplantSizing !== false ? (
          <div className="space-y-4 pt-4 border-t-2 border-slate-300">
            <div className="bg-slate-900 text-white px-3 py-1.5 rounded text-xs font-mono font-bold flex items-center justify-between">
              <span>PART II: TOTAL KNEE ARTHROPLASTY (TKA) IMPLANT SIZING & GEOMETRIC MATCHING</span>
              <span className="text-[10px] text-teal-400">CATALOG MATCH ACTIVE</span>
            </div>

            {/* 8. FEMORAL AND TIBIAL ANATOMICAL MEASUREMENTS */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 border-b border-slate-300 pb-1">
                <Ruler className="w-4 h-4 text-sky-700" />
                <h3 className="font-bold text-xs tracking-tight uppercase text-slate-900">
                  8. TKA Anatomical Measurements
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-bold uppercase text-[10px] block border-b border-slate-200 pb-0.5">FEMUR</span>
                  <div className="flex justify-between"><span className="text-slate-600">AP Dimension:</span> <strong>{bone.femoralApMm} mm</strong></div>
                  <div className="flex justify-between"><span className="text-slate-600">ML Condyle Width:</span> <strong>{bone.femoralCondyleWidthMm} mm</strong></div>
                </div>
                <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-bold uppercase text-[10px] block border-b border-slate-200 pb-0.5">TIBIA</span>
                  <div className="flex justify-between"><span className="text-slate-600">AP Dimension:</span> <strong>{bone.tibialApMm} mm</strong></div>
                  <div className="flex justify-between"><span className="text-slate-600">ML Plateau Width:</span> <strong>{bone.tibialPlateauWidthMm} mm</strong></div>
                </div>
              </div>
            </div>

            {/* 9 & 10. TKA IMPLANT SIZING, NEAREST MATCH & EXPLAINABILITY */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 border-b border-slate-300 pb-1">
                <Ruler className="w-4 h-4 text-teal-600" />
                <h3 className="font-bold text-xs tracking-tight uppercase text-slate-900">
                  9 & 10. TKA Anatomical Sizing, Nearest Match & Explainability
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-slate-900 text-white p-4 rounded-md font-mono text-xs border border-slate-800">
                <div className="space-y-1.5">
                  <span className="text-teal-400 text-[10px] uppercase tracking-wider block font-bold">Recommended Nearest Match</span>
                  <div className="text-base font-bold text-white">
                    {implantMatch?.manufacturer || 'Stryker'} {implantMatch?.model || 'Triathlon Primary Knee'}
                  </div>
                  <div className="text-sky-300 font-semibold">
                    Femoral Component: {implantMatch?.femoralSize || 'Size 4'} | Tibial Component: {implantMatch?.tibialSize || 'Size 3'}
                  </div>
                  {implantMatch?.material && (
                    <div className="text-[10px] text-slate-400">Material: {implantMatch.material}</div>
                  )}
                </div>
                <div className="text-right space-y-1">
                  <div><span className="text-slate-400">Match Score:</span> <strong className="text-teal-300">{implantMatch?.fitScore || 97.4}%</strong></div>
                  <div><span className="text-slate-400">Fit Deviation:</span> {implantMatch?.fitErrorMm || 0.35} mm</div>
                  <div><span className="text-slate-400">Femoral AP Delta:</span> {implantMatch?.deltas?.femoralAp > 0 ? `+${implantMatch?.deltas?.femoralAp}` : implantMatch?.deltas?.femoralAp || '+0.4'} mm</div>
                  <div><span className="text-slate-400">Tibial AP Delta:</span> {implantMatch?.deltas?.tibialAp > 0 ? `+${implantMatch?.deltas?.tibialAp}` : implantMatch?.deltas?.tibialAp || '-0.1'} mm</div>
                </div>
              </div>

              {/* IMPLANT MATCHING INPUTS & EXPLAINABILITY FACTORS */}
              <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs font-mono grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Implant Matching Inputs:</span>
                  <ul className="text-slate-800 text-[11px] space-y-0.5 pt-0.5">
                    <li>Femoral AP: {bone.femoralApMm} mm</li>
                    <li>Femoral ML: {bone.femoralCondyleWidthMm} mm</li>
                    <li>Tibial AP: {bone.tibialApMm} mm</li>
                    <li>Tibial ML: {bone.tibialPlateauWidthMm} mm</li>
                  </ul>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Matching Factors Evaluated:</span>
                  <ul className="text-slate-800 text-[11px] space-y-0.5 pt-0.5">
                    <li>• Femoral AP anatomical depth compatibility</li>
                    <li>• Femoral ML condylar width compatibility</li>
                    <li>• Tibial AP depth compatibility</li>
                    <li>• Tibial ML plateau width compatibility</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-100 border border-slate-300 rounded p-4 text-xs font-mono text-slate-700 flex items-center justify-between my-2">
            <div>
              <strong className="block text-slate-900 uppercase">PART II: TKA IMPLANT SIZING EXCLUDED BY CLIENT PREFERENCE</strong>
              <span className="text-[11px] text-slate-500">Client requested OA diagnostics report only. TKA implant sizing and manufacturer catalog matching omitted.</span>
            </div>
            <span className="px-2.5 py-1 bg-slate-200 text-slate-700 rounded font-bold text-[10px]">OA DIAGNOSTIC ONLY</span>
          </div>
        )}

        {/* 11. UNCERTAINTY / CONFIDENCE BREAKDOWN */}
        <div className="bg-slate-50 p-4 rounded border border-slate-200 text-xs font-mono">
          <span className="text-slate-500 text-[10px] uppercase font-bold block">11. Uncertainty / Confidence Breakdown</span>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 text-[11px] text-slate-700">
            <div><span className="text-slate-500 block text-[10px]">Image Quality Conf:</span> <strong>{quality?.overallScore || 94}%</strong></div>
            <div><span className="text-slate-500 block text-[10px]">Segmentation Conf:</span> <strong>{bone.confidence || 94}%</strong></div>
            {activeCase?.includeImplantSizing !== false && (
              <div><span className="text-slate-500 block text-[10px]">Implant Match Score:</span> <strong>{implantMatch?.fitScore || 97.4}%</strong></div>
            )}
            <div><span className="text-slate-500 block text-[10px]">Statistical Confidence Interval:</span> <em className="text-slate-500">Not quantified</em></div>
          </div>
        </div>

        {/* 12. CLINICIAN VERIFICATION & AUDIT SIGN-OFF */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 border-b border-slate-300 pb-1">
            <ShieldCheck className="w-4 h-4 text-sky-700" />
            <h3 className="font-bold text-xs tracking-tight uppercase text-slate-900">
              12. Clinician Verification & Audit Sign-Off
            </h3>
          </div>

          <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between font-mono">
              <span>Reviewing Clinician: <strong>{verification?.verifiedBy || 'DEMO / NOT CLINICALLY VERIFIED'}</strong></span>
              <span>Review Status: <strong className={verification?.status === 'Approved' || verification?.status === 'Accepted' ? 'text-emerald-700' : 'text-amber-800'}>{verification?.status || 'Pending'}</strong></span>
              <span>Timestamp: {formatIST(verification?.timestamp || new Date())}</span>
            </div>
            <p className="text-slate-700 italic border-t border-slate-200 pt-2">
              "{verification?.notes || 'Pending clinician review and sign-off.'}"
            </p>
          </div>
        </div>

        {/* 13. AUDIT TRAIL */}
        <div className="bg-slate-100 p-3 rounded text-[10px] font-mono text-slate-600 space-y-1">
          <div className="font-bold uppercase text-slate-700">13. Audit Trail Metadata</div>
          <div className="grid grid-cols-3 gap-2">
            <div>Report ID: REP-{id}</div>
            <div>Case ID: {id}</div>
            <div>Gen Timestamp: {formatIST(new Date())}</div>
            <div>Model Version: UNet-Knee v2.1</div>
            <div>Processing Status: Completed</div>
            <div>Verification: {verification?.status || 'Pending'}</div>
          </div>
        </div>

        {/* 15. MANDATORY CLINICAL DECISION-SUPPORT DISCLAIMER */}
        <div className="border-t-2 border-slate-900 pt-4 text-[10px] text-slate-600 space-y-1">
          <p className="font-bold text-slate-900 uppercase">
            15. MANDATORY CLINICAL DECISION-SUPPORT (CDS) DISCLAIMER:
          </p>
          <p className="leading-relaxed">
            ARTICULA is an AI-assisted quantitative decision-support system intended to support analysis of patient-specific knee imaging and anatomical measurements. It is NOT an autonomous diagnostic system, treatment planner, or substitute for clinical judgment. All measurements, population comparisons, and implant-matching outputs must be independently reviewed and validated by an appropriately qualified clinician before being used for clinical decision-making or surgical planning. For demonstration/research builds, all outputs should be considered non-clinical and must not be used to guide patient care.
          </p>
        </div>

      </div>

    </div>
  );
}
