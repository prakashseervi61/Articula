import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import Abbr from './Abbr';

export default function DisclaimerBanner() {
  return (
    <div className="bg-sky-950/80 border-b border-sky-900/60 text-sky-200 px-4 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <p className="leading-tight">
            <strong className="text-white font-semibold">
              <Abbr text="CDS">CLINICAL DECISION SUPPORT</Abbr> NOTICE:
            </strong> ARTICULA provides quantitative meniscus measurements and <Abbr text="TKA">TKA</Abbr> implant sizing support. It is <span className="underline decoration-sky-500 underline-offset-2">not an autonomous diagnostic device</span>. All clinical recommendations require clinician review and confirmation.
          </p>
        </div>
        <div className="hidden sm:flex items-center space-x-2 shrink-0 ml-4 font-mono text-[11px] text-sky-300">
          <Info className="w-3.5 h-3.5 text-sky-400" />
          <span>Clinical Decision Support System — OAI & MOST Clinical Data Archive</span>
        </div>
      </div>
    </div>
  );
}
