import React, { useState, useEffect } from 'react';
import { UserCheck, CheckCircle2, XCircle, Flag, ShieldCheck, FileSignature, Clock, AlertCircle } from 'lucide-react';
import { formatIST } from '../utils/dateUtils';

export default function ClinicianVerificationPanel({ selectedCase, onUpdateVerification }) {
  if (!selectedCase || selectedCase.quality?.status === 'Fail' || selectedCase.measurements?.isFail) {
    return null;
  }

  const [doctorName, setDoctorName] = useState(
    selectedCase.verification?.isUserSubmitted ? (selectedCase.verification.verifiedBy || '') : ''
  );
  const [doctorNote, setDoctorNote] = useState(
    selectedCase.verification?.isUserSubmitted ? (selectedCase.verification.notes || '') : ''
  );
  const [status, setStatus] = useState(selectedCase.verification?.status || 'Pending');
  const [lastUpdated, setLastUpdated] = useState(
    selectedCase.verification?.timestamp || new Date().toISOString()
  );
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (selectedCase?.verification) {
      setDoctorName(selectedCase.verification.isUserSubmitted ? (selectedCase.verification.verifiedBy || '') : '');
      setDoctorNote(selectedCase.verification.isUserSubmitted ? (selectedCase.verification.notes || '') : '');
      setStatus(selectedCase.verification.status || 'Pending');
      setLastUpdated(selectedCase.verification.timestamp || new Date().toISOString());
      setValidationError('');
    }
  }, [selectedCase]);

  const handleAction = (newStatus) => {
    // Enforce required fields: Clinician Name and Clinician Notes cannot be left empty
    if (!doctorName || !doctorName.trim() || !doctorNote || !doctorNote.trim()) {
      setValidationError('Please enter both the Reviewing Clinician Name and Clinician Notes before accepting or rejecting the case.');
      return;
    }

    setValidationError('');
    const timestamp = new Date().toISOString();
    setStatus(newStatus);
    setLastUpdated(timestamp);

    if (onUpdateVerification) {
      onUpdateVerification({
        status: newStatus,
        verifiedBy: doctorName.trim(),
        notes: doctorNote.trim(),
        isUserSubmitted: true,
        timestamp
      });
    }
  };

  return (
    <div className="clinical-card p-6 bg-white border border-slate-200 rounded-xl space-y-5 shadow-sm">
      
      {/* Header Title & Live Status Badge */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600">
            <FileSignature className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base tracking-tight">
              Clinician Verification & Diagnostic Sign-Off
            </h3>
            <p className="text-xs text-slate-500 font-mono">
              Form Section 13 Audit Protocol • Mandatory Human-in-the-Loop Approval
            </p>
          </div>
        </div>

        {/* Dynamic Verification Status Badge */}
        <div className="flex items-center space-x-2">
          {status === 'Accepted' && (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>ACCEPTED & VERIFIED</span>
            </span>
          )}
          {status === 'Rejected' && (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono bg-rose-50 text-rose-700 border border-rose-300 shadow-xs">
              <XCircle className="w-3.5 h-3.5 text-rose-600" />
              <span>REJECTED</span>
            </span>
          )}
          {status === 'Flagged' && (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono bg-amber-50 text-amber-800 border border-amber-300 shadow-xs">
              <Flag className="w-3.5 h-3.5 text-amber-600" />
              <span>FLAGGED FOR REVIEW</span>
            </span>
          )}
          {status === 'Pending' && (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono bg-slate-100 text-slate-700 border border-slate-300 shadow-xs">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>SIGN-OFF PENDING</span>
            </span>
          )}
        </div>
      </div>

      {/* Required Input Validation Alert */}
      {validationError && (
        <div className="bg-rose-50 border border-rose-300 text-rose-800 rounded-lg p-3 text-xs flex items-center space-x-2 animate-fade-in font-sans">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span className="font-semibold">{validationError}</span>
        </div>
      )}

      {/* Form Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        
        {/* Doctor Name Input */}
        <div className="md:col-span-4 space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 flex items-center space-x-1.5">
            <UserCheck className="w-3.5 h-3.5 text-slate-500" />
            <span>Reviewing Doctor / Clinician Name <span className="text-rose-500">*</span></span>
          </label>
          <input
            type="text"
            value={doctorName}
            onChange={(e) => {
              setDoctorName(e.target.value);
              if (validationError) setValidationError('');
            }}
            placeholder="e.g. Dr. E. Thorne, MD (Orthopedic Surgery)"
            className={`w-full bg-slate-50 border rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all shadow-2xs ${
              validationError && (!doctorName || !doctorName.trim())
                ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-50/40'
                : 'border-slate-300'
            }`}
          />
        </div>

        {/* Doctor Diagnostic Notes Textarea */}
        <div className="md:col-span-8 space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 block">
            Clinician Notes & Assessment <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={2}
            value={doctorNote}
            onChange={(e) => {
              setDoctorNote(e.target.value);
              if (validationError) setValidationError('');
            }}
            placeholder="Enter clinician notes, diagnostic observations, or surgical planning modifications here..."
            className={`w-full bg-slate-50 border rounded-lg px-3 py-2 text-xs font-sans text-slate-900 leading-relaxed focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all shadow-2xs resize-none ${
              validationError && (!doctorNote || !doctorNote.trim())
                ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-50/40'
                : 'border-slate-300'
            }`}
          />
        </div>

      </div>

      {/* Verification Action Buttons Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100">
        
        <div className="text-[11px] font-mono text-slate-500 flex items-center space-x-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
          <span>Last Audit Timestamp: {formatIST(lastUpdated)}</span>
        </div>

        <div className="flex items-center space-x-3">
          
          {/* Reject Button */}
          <button
            type="button"
            onClick={() => handleAction('Rejected')}
            className={`px-4 py-2 rounded-lg text-xs font-bold font-mono flex items-center space-x-1.5 transition-all shadow-xs ${
              status === 'Rejected'
                ? 'bg-rose-600 text-white ring-2 ring-rose-600 shadow-md'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Reject Case</span>
          </button>

          {/* Flag Button */}
          <button
            type="button"
            onClick={() => handleAction('Flagged')}
            className={`px-4 py-2 rounded-lg text-xs font-bold font-mono flex items-center space-x-1.5 transition-all shadow-xs ${
              status === 'Flagged'
                ? 'bg-amber-600 text-white ring-2 ring-amber-600 shadow-md'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <Flag className="w-3.5 h-3.5" />
            <span>Flag for Review</span>
          </button>

          {/* Accept Button */}
          <button
            type="button"
            onClick={() => handleAction('Accepted')}
            className={`px-4 py-2 rounded-lg text-xs font-bold font-mono flex items-center space-x-1.5 transition-all shadow-xs ${
              status === 'Accepted'
                ? 'bg-emerald-600 text-white ring-2 ring-emerald-600 shadow-md'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Accept & Sign Off</span>
          </button>

        </div>

      </div>

    </div>
  );
}
