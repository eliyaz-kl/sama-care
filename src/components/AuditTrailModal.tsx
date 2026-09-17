import React from 'react';
import { AuditLog, TriageCase } from '../types';

interface AuditTrailModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCase: TriageCase;
  auditLogs: AuditLog[];
}

export const AuditTrailModal: React.FC<AuditTrailModalProps> = ({
  isOpen,
  onClose,
  currentCase,
  auditLogs,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-inverse-surface/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-surface-container-lowest w-full max-w-2xl max-h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-surface-container-high">
        <div className="h-14 px-space-lg bg-surface-container-low flex items-center justify-between shrink-0 border-b border-surface-container-high">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-secondary text-[22px]">history</span>
            <div>
              <h3 className="font-headline-sm text-[15px] text-on-surface font-bold">
                Audit Trail &amp; Chain of Custody
              </h3>
              <span className="font-code-sm text-[11px] text-outline">
                Case #{currentCase.caseNumber} • Immutable Ledger
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-space-lg overflow-y-auto flex flex-col gap-4">
          <div className="relative pl-6 border-l-2 border-secondary/30 space-y-4">
            {auditLogs.map((log, index) => (
              <div key={index} className="relative">
                <span className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-secondary border-2 border-surface-container-lowest" />
                <div className="bg-surface-container-low p-3 rounded-xl border border-surface-container-high/60">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-headline-sm text-[13px] text-on-surface font-semibold">
                      {log.action}
                    </span>
                    <span className="font-code-sm text-[11px] text-outline">{log.timestamp}</span>
                  </div>
                  <p className="font-body-sm text-[12px] text-on-surface-variant">{log.details}</p>
                  <div className="mt-2 text-[10px] font-code-sm text-secondary flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">badge</span>
                    <span>Actor: {log.actor}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-space-md bg-surface-container-low border-t border-surface-container-high flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md cursor-pointer border border-outline-variant/40"
          >
            Close Audit Trail
          </button>
        </div>
      </div>
    </div>
  );
};
