import React, { useState } from 'react';
import { CheckCircle2, Edit3, Flag, ShieldAlert, Save, RotateCcw } from 'lucide-react';

export default function ClinicianVerification({ caseData, onUpdateCase }) {
  if (!caseData) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [clinicianName, setClinicianName] = useState(caseData.verification?.verifiedBy || "Dr. E. Thorne, MD");
  const [notes, setNotes] = useState(caseData.verification?.notes || "");
  
  // Editable measurement values state
  const [editedAnt, setEditedAnt] = useState(caseData.measurements?.meniscus?.anteriorMm);
  const [editedMid, setEditedMid] = useState(caseData.measurements?.meniscus?.middleMm);
  const [editedPost, setEditedPost] = useState(caseData.measurements?.meniscus?.posteriorMm);
  const [editedFemurW, setEditedFemurW] = useState(caseData.measurements?.bone?.femoralCondyleWidthMm);
  const [editedTibiaW, setEditedTibiaW] = useState(caseData.measurements?.bone?.tibialPlateauWidthMm);

  const status = caseData.verification?.status || "Pending";

  const handleAccept = () => {
    const updated = {
      ...caseData,
      verification: {
        status: "Accepted",
        verifiedBy: clinicianName,
        timestamp: new Date().toISOString(),
        notes: notes || "Measurements verified and approved by clinician without modification."
      },
      auditTrail: [
        ...caseData.auditTrail,
        {
          timestamp: new Date().toISOString(),
          action: "Clinician Acceptance Sign-off",
          user: clinicianName,
          details: "Verified automated quantitative values."
        }
      ]
    };
    onUpdateCase(updated);
    setIsEditing(false);
  };

  const handleSaveEdits = () => {
    const updated = {
      ...caseData,
      measurements: {
        ...caseData.measurements,
        meniscus: {
          ...caseData.measurements.meniscus,
          anteriorMm: parseFloat(editedAnt),
          middleMm: parseFloat(editedMid),
          posteriorMm: parseFloat(editedPost)
        },
        bone: {
          ...caseData.measurements.bone,
          femoralCondyleWidthMm: parseFloat(editedFemurW),
          tibialPlateauWidthMm: parseFloat(editedTibiaW)
        }
      },
      verification: {
        status: "Edited",
        verifiedBy: clinicianName,
        timestamp: new Date().toISOString(),
        notes: notes || "Manual measurement overrides applied by reviewing clinician."
      },
      auditTrail: [
        ...caseData.auditTrail,
        {
          timestamp: new Date().toISOString(),
          action: "Clinician Measurement Override",
          user: clinicianName,
          details: `Overrides: Ant=${editedAnt}mm, Mid=${editedMid}mm, Post=${editedPost}mm`
        }
      ]
    };
    onUpdateCase(updated);
    setIsEditing(false);
  };

  const handleFlag = () => {
    const updated = {
      ...caseData,
      verification: {
        status: "Flagged",
        verifiedBy: clinicianName,
        timestamp: new Date().toISOString(),
        notes: notes || "Flagged for re-acquisition due to quality/anatomy ambiguity."
      },
      auditTrail: [
        ...caseData.auditTrail,
        {
          timestamp: new Date().toISOString(),
          action: "Case Flagged for Review",
          user: clinicianName,
          details: "Quality or anatomical boundary review requested"
        }
      ]
    };
    onUpdateCase(updated);
    setIsEditing(false);
  };

  return (
    <div className="clinical-card p-4 space-y-4 border-slate-300">
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-sky-700" />
          <h3 className="font-semibold text-slate-900 text-xs tracking-tight">Clinician Verification Sign-Off</h3>
        </div>
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium border ${
            status === 'Accepted'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : status === 'Edited'
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : status === 'Flagged'
              ? 'bg-red-50 text-red-700 border-red-200'
              : 'bg-slate-100 text-slate-600 border-slate-200'
          }`}
        >
          STATUS: {status.toUpperCase()}
        </span>
      </div>

      {/* Editing Mode Form */}
      {isEditing ? (
        <div className="space-y-3 bg-slate-50 p-3 rounded border border-slate-200 text-xs">
          <div className="font-medium text-slate-800 pb-1 border-b border-slate-200">
            Manual Measurement Override (mm):
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[10px] text-slate-500 font-medium">Ant Meniscus</label>
              <input
                type="number"
                step="0.1"
                value={editedAnt}
                onChange={(e) => setEditedAnt(e.target.value)}
                className="w-full px-2 py-1 bg-white border border-slate-300 rounded font-mono text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-500 font-medium">Mid Meniscus</label>
              <input
                type="number"
                step="0.1"
                value={editedMid}
                onChange={(e) => setEditedMid(e.target.value)}
                className="w-full px-2 py-1 bg-white border border-slate-300 rounded font-mono text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-500 font-medium">Post Meniscus</label>
              <input
                type="number"
                step="0.1"
                value={editedPost}
                onChange={(e) => setEditedPost(e.target.value)}
                className="w-full px-2 py-1 bg-white border border-slate-300 rounded font-mono text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div>
              <label className="block text-[10px] text-slate-500 font-medium">Femur Width (mm)</label>
              <input
                type="number"
                step="0.1"
                value={editedFemurW}
                onChange={(e) => setEditedFemurW(e.target.value)}
                className="w-full px-2 py-1 bg-white border border-slate-300 rounded font-mono text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-500 font-medium">Tibia Width (mm)</label>
              <input
                type="number"
                step="0.1"
                value={editedTibiaW}
                onChange={(e) => setEditedTibiaW(e.target.value)}
                className="w-full px-2 py-1 bg-white border border-slate-300 rounded font-mono text-xs"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center space-x-2">
            <button
              onClick={handleSaveEdits}
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-medium py-1.5 px-3 rounded flex items-center justify-center space-x-1 text-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Overrides</span>
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium py-1.5 px-3 rounded text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        /* Action Buttons */
        <div className="space-y-3">
          
          <div className="space-y-2">
            <label className="block text-[11px] text-slate-600 font-medium">Reviewing Clinician:</label>
            <input
              type="text"
              value={clinicianName}
              onChange={(e) => setClinicianName(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[11px] text-slate-600 font-medium">Verification Clinical Notes:</label>
            <textarea
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add qualitative notes or clinical reasoning..."
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800"
            ></textarea>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1">
            
            <button
              onClick={handleAccept}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-2 rounded flex items-center justify-center space-x-1 text-xs transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Accept</span>
            </button>

            <button
              onClick={() => setIsEditing(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-2 rounded flex items-center justify-center space-x-1 text-xs transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>

            <button
              onClick={handleFlag}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-2 rounded flex items-center justify-center space-x-1 text-xs transition-colors"
            >
              <Flag className="w-3.5 h-3.5" />
              <span>Flag</span>
            </button>

          </div>

        </div>
      )}

    </div>
  );
}
