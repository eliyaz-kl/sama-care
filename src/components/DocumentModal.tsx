import React, { useState } from 'react';
import { TriageCase } from '../types';

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCase: TriageCase;
  onInjectCitation: (citation: string) => void;
}

export const DocumentModal: React.FC<DocumentModalProps> = ({
  isOpen,
  onClose,
  currentCase,
  onInjectCitation,
}) => {
  const [zoom, setZoom] = useState(100);

  if (!isOpen) return null;

  const handleCitation = () => {
    onInjectCitation(
      `استناداً إلى مبادئ حماية عملاء المؤسسات المالية المعتمدة من البنك المركزي السعودي (ساما) وتعاميم شركة سمة (مرجع قضية: ${currentCase.samaRef})، يُلزم الالتزام بمهلة المعالجة وتقديم الإفادة الرسمية.`
    );
    onClose();
  };

  return (
    <div
      id="pdfModal"
      className="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-inverse-surface/60 backdrop-blur-sm transition-opacity duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="modalContainer"
        className="bg-surface-container-lowest w-full max-w-4xl h-[90vh] max-h-[870px] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-surface-container-high transition-all"
      >
        {/* Header Bar */}
        <div className="h-14 px-space-lg bg-surface-container-low flex items-center justify-between shrink-0 border-b border-surface-container-high">
          <div className="flex items-center gap-space-sm">
            <div className="p-1.5 rounded-lg bg-error-container text-error flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-[14px] text-on-surface font-bold">
                {currentCase.policyTitle}
              </h3>
              <span className="font-code-sm text-[11px] text-outline">
                Verified Compliance Document • Page 7 of 24
              </span>
            </div>
          </div>

          <div className="flex items-center gap-space-xs">
            <div className="flex items-center bg-surface-container rounded-md overflow-hidden border border-outline-variant/40">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(80, z - 10))}
                className="px-2 py-0.5 text-on-surface hover:bg-surface-container-high font-code-sm text-[12px]"
                title="Zoom Out"
              >
                -
              </button>
              <span className="px-2 py-0.5 text-on-surface font-code-sm text-[11px]">
                Zoom {zoom}%
              </span>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(130, z + 10))}
                className="px-2 py-0.5 text-on-surface hover:bg-surface-container-high font-code-sm text-[12px]"
                title="Zoom In"
              >
                +
              </button>
            </div>
            <button
              id="closePdfModalBtn"
              type="button"
              onClick={onClose}
              title="Close Document Viewer"
              className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Content Body Split */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          
          {/* Main PDF Page Viewer */}
          <div className="md:col-span-8 p-space-lg overflow-y-auto bg-surface flex flex-col gap-space-md">
            <div
              className="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm text-on-surface flex flex-col gap-space-md font-body-md text-body-md border border-surface-container-high/60 transition-all origin-top"
              style={{ transform: `scale(${zoom / 100})` }}
            >
              <div className="flex items-center justify-between pb-space-sm text-outline border-b border-surface-container-high/50">
                <span className="font-label-sm text-[10px] tracking-widest uppercase">
                  CONSUMER FINANCIAL COMPLIANCE • 12 CFR PART 1005 (REGULATION E)
                </span>
                <span className="font-code-sm text-[10px]">REF: #REG-E-2024-883</span>
              </div>

              <h2 className="font-headline-md text-headline-md text-on-surface">
                Section 1005.11: Unauthorized Fund Transfers &amp; Recall Procedures
              </h2>

              <p className="text-on-surface-variant leading-relaxed">
                Under federal regulatory guidance, upon notification by a consumer regarding suspected unauthorized
                electronic fund transfers or international wire emissions, financial institutions must execute rapid
                response interdiction.
              </p>

              <div className="p-space-md rounded-xl bg-secondary-fixed/50 text-on-surface border border-secondary/30 shadow-sm flex flex-col gap-space-xs">
                <div className="flex items-center gap-1.5 text-secondary font-label-md text-label-md font-bold">
                  <span className="material-symbols-outlined text-[16px]">bookmark</span>
                  <span>HIGHLIGHTED MANDATE: IMMEDIATE CORRESPONDENT INTERDICTION</span>
                </div>
                <p className="font-body-md text-body-md leading-relaxed font-medium">
                  &ldquo;For consumer transactions exceeding $10,000 where unauthorized access is reported within sixty
                  (60) days, the institution shall immediately dispatch a{' '}
                  <strong className="font-bold text-secondary underline">
                    SWIFT MT192 / ISO 20022 camt.056 stop-recall message
                  </strong>{' '}
                  to the beneficiary clearing entity, place an outbound transfer freeze on affected accounts, and
                  provide provisional credit within 10 business days (expedited to 24 hours for Premier Wealth
                  accounts).&rdquo;
                </p>
                <div className="flex items-center justify-between pt-space-2xs text-[11px] font-code-sm text-on-surface-variant">
                  <span>Policy Clause: REG_E_11_EXPEDITED</span>
                  <span className="font-semibold text-secondary">
                    Ratified by Fraud &amp; Compliance Committee
                  </span>
                </div>
              </div>

              <p className="text-on-surface-variant leading-relaxed">
                Failure to transmit interdiction within 4 hours of customer notification may shift liability to
                originating financial institution. Active web sessions and API tokens must be invalidated
                synchronously.
              </p>

              <div className="flex justify-between items-center pt-space-lg text-outline-variant text-[11px] font-code-sm border-t border-surface-container-high/50">
                <span>Ratified Standard (CFPB / EBA Harmonized)</span>
                <span>Doc Page 7</span>
              </div>
            </div>
          </div>

          {/* Right Inspector Drawer */}
          <aside className="md:col-span-4 bg-surface-container-low p-space-md overflow-y-auto flex flex-col justify-between gap-space-md border-l border-surface-container-high">
            <div className="flex flex-col gap-space-md">
              <div className="flex flex-col gap-space-xs font-body-sm text-body-sm">
                <div className="p-space-xs rounded-lg bg-surface-container-lowest flex justify-between items-center border border-surface-container-high/50">
                  <span className="text-on-surface-variant">Disputed Amount</span>
                  <span className="font-code-sm font-bold text-error">
                    {currentCase.amount || '$14,850.00 USD'}
                  </span>
                </div>
                <div className="p-space-xs rounded-lg bg-surface-container-lowest flex justify-between items-center border border-surface-container-high/50">
                  <span className="text-on-surface-variant">Recall SLA Target</span>
                  <span className="font-code-sm font-bold text-secondary">&lt; 30 Minutes</span>
                </div>
                <div className="p-space-xs rounded-lg bg-surface-container-lowest flex justify-between items-center border border-surface-container-high/50">
                  <span className="text-on-surface-variant">Provisional Credit</span>
                  <span className="font-code-sm font-semibold text-on-surface">Eligible (24h)</span>
                </div>
                <div className="p-space-xs rounded-lg bg-surface-container-lowest flex justify-between items-center border border-surface-container-high/50">
                  <span className="text-on-surface-variant">Target Account</span>
                  <span className="font-code-sm text-on-surface">Premier {currentCase.accountNumber}</span>
                </div>
              </div>

              <div className="p-space-sm rounded-xl bg-surface-container-highest text-on-surface flex flex-col gap-1 border border-surface-container-high">
                <div className="flex items-center gap-1 text-secondary font-label-md text-label-md font-semibold">
                  <span className="material-symbols-outlined text-[16px]">security</span>
                  <span>Compliance Verified</span>
                </div>
                <p className="font-body-sm text-[11px] text-on-surface-variant">
                  Customer notification timestamp verified. Mandatory Swift recall broadcast camt.056 meets strict
                  CFPB Regulation E safe harbor standards.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-space-xs">
              <button
                type="button"
                onClick={handleCitation}
                className="w-full py-2.5 rounded-xl bg-secondary text-on-secondary font-label-md text-label-md font-semibold flex items-center justify-center gap-1.5 shadow-sm hover:opacity-90 transition-opacity cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">add_link</span>
                <span>Insert Regulation Citation</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors text-center border border-outline-variant/40 cursor-pointer"
              >
                Close Viewer
              </button>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
};
