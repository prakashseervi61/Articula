import React, { useState } from 'react';

const DICTIONARY = {
  OA: 'Osteoarthritis',
  KL: 'Kellgren-Lawrence (Knee Osteoarthritis Severity Grading System)',
  TKA: 'Total Knee Arthroplasty (Knee Replacement Surgery)',
  DICOM: 'Digital Imaging and Communications in Medicine',
  CDS: 'Clinical Decision Support',
  AP: 'Anterior-Posterior (Depth Dimension)',
  SNR: 'Signal-to-Noise Ratio (Image Quality Metric in dB)',
  SaMD: 'Software as a Medical Device',
  UNet: 'Deep Learning Convolutional Neural Network for Medical Image Segmentation'
};

/**
 * Tooltip Abbreviation Component
 * Renders medical acronyms with a subtle dotted underline and an interactive hover tooltip
 * displaying the full expanded clinical term.
 */
export default function Abbr({ text, title, children }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const termKey = (text || children || '').toString().trim();
  const expansion = title || DICTIONARY[termKey] || termKey;
  const displayContent = children || text;

  return (
    <span
      className="relative inline-flex items-center border-b border-dotted border-sky-400/80 cursor-help font-semibold text-sky-300 hover:text-sky-200 transition-colors"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      title={`${termKey} — ${expansion}`}
    >
      <span>{displayContent}</span>

      {showTooltip && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-950 text-white text-[11px] font-mono rounded-md shadow-2xl border border-sky-500/60 whitespace-nowrap z-[100] pointer-events-none transition-all">
          <span className="text-sky-400 font-bold mr-1.5">{termKey} =</span>
          <span className="text-slate-200">{expansion}</span>
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-950"></span>
        </span>
      )}
    </span>
  );
}
