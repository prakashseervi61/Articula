import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ShieldCheck, FileCheck, Award } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 py-8 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand & Mandate */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded bg-sky-600 flex items-center justify-center text-white">
                <Activity className="w-4 h-4" />
              </div>
              <span className="font-bold text-white text-base tracking-tight">ARTICULA</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-sky-400 border border-sky-800/50">
                v1.0.0
              </span>
            </div>
            <p className="text-slate-400 text-xs max-w-md leading-relaxed">
              AI-assisted, patient-specific knee intelligence platform fulfilling dual clinical requirements: automated medial meniscus quantitative thickness assessment and patient-specific femoral/tibial TKA implant sizing.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
              <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5 text-amber-400" /> Clinical Decision Support Platform</span>
              <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Clinical Verification Audit Pass</span>
              <span className="flex items-center gap-1"><FileCheck className="w-3.5 h-3.5 text-sky-400" /> CDS Functional Spec Verified</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-xs tracking-wider uppercase">Platform Views</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link to="/" className="hover:text-white transition-colors">Platform Overview</Link></li>
              <li><Link to="/how-it-works" className="hover:text-white transition-colors">How It Works (Methodology)</Link></li>
              <li><Link to="/workspace" className="hover:text-white transition-colors">Clinical Workbench</Link></li>
              <li><Link to="/mri-explorer" className="hover:text-white transition-colors">MRI Explorer & JSW Proxy</Link></li>
              <li><Link to="/implant-matching" className="hover:text-white transition-colors">Implant Sizing Engine</Link></li>
              <li><Link to="/report" className="hover:text-white transition-colors">Structured Clinical Report</Link></li>
            </ul>
          </div>

          {/* Regulatory & Versioning Info */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-xs tracking-wider uppercase">System Specification</h4>
            <ul className="space-y-1.5 text-[11px] font-mono text-slate-400">
              <li><span className="text-slate-500">Core Engine:</span> Xception + UNet-Knee v2.1</li>
              <li><span className="text-slate-500">Dataset Archive:</span> OAI & MOST Clinical</li>
              <li><span className="text-slate-500">Implant Catalog:</span> 2026 Orthopedic Database</li>
              <li><span className="text-slate-500">Classification:</span> Decision Support / CDS</li>
              <li><span className="text-slate-500">Regulatory Class:</span> Pre-Clinical Research Prototype</li>
            </ul>
          </div>

        </div>

        {/* Disclaimer Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
          <p>© 2026 ARTICULA Medical Intelligence. For research and clinical decision-support purposes only.</p>
          <div className="flex items-center space-x-4">
            <Link to="/about" className="text-slate-400 hover:text-white">Clinical Positioning Statement</Link>
            <span>•</span>
            <Link to="/about" className="text-slate-400 hover:text-white">Ethical AI Framework</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
