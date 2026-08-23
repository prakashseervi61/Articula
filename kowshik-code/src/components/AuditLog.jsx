import React from 'react';
import { History, Clock, User, ShieldCheck } from 'lucide-react';
import { formatIST } from '../utils/dateUtils';

export default function AuditLog({ logs }) {
  if (!logs || logs.length === 0) return null;

  return (
    <div className="clinical-card p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center space-x-2">
          <History className="w-4 h-4 text-sky-600" />
          <h3 className="font-semibold text-slate-900 text-xs tracking-tight">Case Audit Trail Log</h3>
        </div>
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
        {logs.map((log, idx) => (
          <div key={idx} className="bg-slate-50 p-2 rounded border border-slate-200 text-[11px] space-y-1 font-mono">
            <div className="flex items-center justify-between text-[10px]">
              <span className="font-semibold text-slate-800 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-sky-600" />
                {log.action}
              </span>
              <span className="text-slate-400 flex items-center gap-0.5">
                <Clock className="w-2.5 h-2.5" />
                {formatIST(log.timestamp)}
              </span>
            </div>
            <div className="text-slate-600 text-[10px] flex items-center justify-between">
              <span>{log.details}</span>
              <span className="text-slate-400 flex items-center gap-0.5">
                <User className="w-2.5 h-2.5 text-slate-400" />
                {log.user}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
