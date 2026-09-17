import React from 'react';
import { ViewTab, TriageCase } from '../types';

interface SecondaryViewsProps {
  view: ViewTab;
  cases: TriageCase[];
  onSelectCase: (c: TriageCase) => void;
  onBackToQueue: () => void;
}

export const SecondaryViews: React.FC<SecondaryViewsProps> = ({
  view,
  cases,
  onSelectCase,
  onBackToQueue,
}) => {
  if (view === 'inquiry-workbench') {
    return (
      <div className="flex flex-col gap-space-md">
        <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-surface-container-high">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface">Inquiry Workbench</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                Active customer queries, tier-1 priority inquiries, and verified communication logs.
              </p>
            </div>
            <button
              type="button"
              onClick={onBackToQueue}
              className="px-3 py-1.5 rounded-xl bg-secondary text-on-secondary font-label-md text-label-md cursor-pointer"
            >
              Back to Live Queue Copilot
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
            {cases.slice(0, 4).map((c) => (
              <div
                key={c.id}
                onClick={() => {
                  onSelectCase(c);
                  onBackToQueue();
                }}
                className="p-space-md rounded-xl bg-surface-container-low border border-surface-container-high hover:border-secondary transition-all cursor-pointer shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-code-sm text-secondary font-bold">{c.caseNumber}</span>
                  <span className="font-label-sm text-[11px] px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-container">
                    {c.slaFormatted}
                  </span>
                </div>
                <h4 className="font-headline-sm text-[14px] text-on-surface font-semibold mb-1">{c.title}</h4>
                <p className="font-body-sm text-[12px] text-on-surface-variant line-clamp-2">{c.originalCustomerMessage}</p>
                <div className="mt-3 pt-2 border-t border-surface-container-high flex items-center justify-between text-[11px] text-outline">
                  <span>Customer: {c.customerName}</span>
                  <span className="text-secondary font-semibold">Inspect in Copilot &rarr;</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (view === 'escalation-hub') {
    const urgentCases = cases.filter((c) => c.priority === 'P1' || c.category === 'urgent');
    return (
      <div className="flex flex-col gap-space-md">
        <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-error/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-error animate-ping" />
              <div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface">Escalation Hub</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  High-severity P1 security events requiring immediate compliance intervention and wire freezes.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onBackToQueue}
              className="px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md cursor-pointer border border-outline-variant/40"
            >
              Return to Triage
            </button>
          </div>

          <div className="space-y-3">
            {urgentCases.map((c) => (
              <div
                key={c.id}
                onClick={() => {
                  onSelectCase(c);
                  onBackToQueue();
                }}
                className="p-space-md rounded-xl bg-error-container/20 border border-error/30 hover:border-error transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-code-sm font-bold text-error">{c.caseNumber}</span>
                    <span className="px-2 py-0.5 rounded bg-error text-on-error font-label-sm text-[10px]">
                      P1 ESCALATED
                    </span>
                    <span className="font-body-sm text-[12px] text-outline">{c.timeAgo}</span>
                  </div>
                  <h4 className="font-headline-sm text-[15px] text-on-surface font-semibold">{c.title}</h4>
                  <p className="font-body-sm text-[12px] text-on-surface-variant mt-0.5">
                    Account: {c.accountNumber} • Problem Code: {c.problemCode}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-code-sm text-error font-bold">{c.amount || '$14,850.00'}</span>
                  <button
                    type="button"
                    className="px-3 py-1 rounded-lg bg-error text-on-error font-label-sm text-label-sm"
                  >
                    Acquire Lock &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (view === 'performance-analytics') {
    return (
      <div className="flex flex-col gap-space-md">
        <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-surface-container-high">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface">Analytics &amp; SLA Dashboard</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Real-time operational metrics, copilot synthesis throughput, and regulatory dispute adherence.
              </p>
            </div>
            <button
              type="button"
              onClick={onBackToQueue}
              className="px-3 py-1.5 rounded-xl bg-secondary text-on-secondary font-label-md text-label-md cursor-pointer"
            >
              Back to Live Queue
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md mb-6">
            <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container-high">
              <span className="font-label-sm text-outline uppercase tracking-wider">Average Triage Latency</span>
              <p className="font-headline-lg text-[28px] text-secondary font-bold mt-1">310 ms</p>
              <span className="text-[11px] text-secondary font-semibold">&uarr; 14% faster than target SLA</span>
            </div>
            <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container-high">
              <span className="font-label-sm text-outline uppercase tracking-wider">Regulation E Compliance</span>
              <p className="font-headline-lg text-[28px] text-secondary font-bold mt-1">99.4%</p>
              <span className="text-[11px] text-secondary font-semibold">Audited by Compliance Core</span>
            </div>
            <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container-high">
              <span className="font-label-sm text-outline uppercase tracking-wider">Copilot Autopilot Accuracy</span>
              <p className="font-headline-lg text-[28px] text-on-surface font-bold mt-1">94.8%</p>
              <span className="text-[11px] text-outline">Over 1,420 weekly cases</span>
            </div>
            <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container-high">
              <span className="font-label-sm text-outline uppercase tracking-wider">Resolved Today</span>
              <p className="font-headline-lg text-[28px] text-on-surface font-bold mt-1">89 Cases</p>
              <span className="text-[11px] text-secondary font-semibold">14 Pending / 4 In Review</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container-high">
            <h4 className="font-headline-sm text-on-surface mb-2">Hourly Triage Resolution Volume</h4>
            <div className="flex items-end gap-2 h-32 pt-4">
              {[35, 52, 68, 85, 92, 78, 64, 88, 95, 80, 72, 89].map((val, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t bg-secondary hover:bg-secondary-container transition-colors"
                    style={{ height: `${val}%` }}
                  />
                  <span className="font-code-sm text-[10px] text-outline">{idx + 8}h</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'knowledge-base') {
    return (
      <div className="flex flex-col gap-space-md">
        <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-surface-container-high">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface">Regulatory Knowledge Base</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Authoritative compliance standards, SWIFT messaging protocols, and CFPB Regulation E guidelines.
              </p>
            </div>
            <button
              type="button"
              onClick={onBackToQueue}
              className="px-3 py-1.5 rounded-xl bg-secondary text-on-secondary font-label-md text-label-md cursor-pointer"
            >
              Back to Queue
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
            <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container-high flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-secondary mb-2">
                  <span className="material-symbols-outlined text-[20px]">menu_book</span>
                  <span className="font-code-sm font-bold text-[12px]">REG-E-2024-883</span>
                </div>
                <h4 className="font-headline-sm text-[15px] font-semibold text-on-surface">12 CFR Part 1005 (Regulation E)</h4>
                <p className="font-body-sm text-[12px] text-on-surface-variant mt-1">
                  Section 1005.11 unauthorized electronic fund transfers, mandatory SWIFT camt.056 stop-recall timelines.
                </p>
              </div>
              <span className="text-[11px] text-secondary font-semibold mt-4">Verified by Compliance &bull; 24 pages</span>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container-high flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-secondary mb-2">
                  <span className="material-symbols-outlined text-[20px]">public</span>
                  <span className="font-code-sm font-bold text-[12px]">SWIFT-GPI-2024</span>
                </div>
                <h4 className="font-headline-sm text-[15px] font-semibold text-on-surface">SWIFT GPI Universal Confirmations</h4>
                <p className="font-body-sm text-[12px] text-on-surface-variant mt-1">
                  Correspondent banking deduction codes, MT103 field 71A interpretations, and MT199 narrative tracing rules.
                </p>
              </div>
              <span className="text-[11px] text-secondary font-semibold mt-4">Verified by Treasury &bull; 18 pages</span>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container-high flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-secondary mb-2">
                  <span className="material-symbols-outlined text-[20px]">credit_card</span>
                  <span className="font-code-sm font-bold text-[12px]">CARD-TOKEN-102</span>
                </div>
                <h4 className="font-headline-sm text-[15px] font-semibold text-on-surface">EMVCo Digital Tokenization Standards</h4>
                <p className="font-body-sm text-[12px] text-on-surface-variant mt-1">
                  Instant virtual card lifecycle provisioning, Apple Pay/Google Wallet token swaps, and zero-liability hotlisting.
                </p>
              </div>
              <span className="text-[11px] text-secondary font-semibold mt-4">Verified by Card Ops &bull; 32 pages</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'automation-rules') {
    return (
      <div className="flex flex-col gap-space-md">
        <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-surface-container-high">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface">Triage Rules &amp; Prompts</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Autonomous heuristic triggers, LLM guardrails, and automated clearing house API webhooks.
              </p>
            </div>
            <button
              type="button"
              onClick={onBackToQueue}
              className="px-3 py-1.5 rounded-xl bg-secondary text-on-secondary font-label-md text-label-md cursor-pointer"
            >
              Back to Queue
            </button>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container-high flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-code-sm text-secondary font-bold">RULE-AUTO-LOCK-01</span>
                  <span className="px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-container font-label-sm text-[10px]">ACTIVE</span>
                </div>
                <h4 className="font-headline-sm text-[14px] text-on-surface font-semibold mt-1">
                  High-Risk Wire Instant Rail Freeze
                </h4>
                <p className="font-body-sm text-[12px] text-on-surface-variant">
                  If unauthorized debit reported &gt; $10,000 USD, automatically engage debit rail lock across customer accounts.
                </p>
              </div>
              <span className="font-code-sm text-[12px] text-secondary font-semibold">100% Autopilot</span>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container-high flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-code-sm text-secondary font-bold">RULE-REG-E-EXPEDITE</span>
                  <span className="px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-container font-label-sm text-[10px]">ACTIVE</span>
                </div>
                <h4 className="font-headline-sm text-[14px] text-on-surface font-semibold mt-1">
                  Premier Wealth 24h Provisional Credit Expediter
                </h4>
                <p className="font-body-sm text-[12px] text-on-surface-variant">
                  If customer tier is Premier Wealth, expedite standard 10-day Reg-E provisional credit to 24-hour SLA.
                </p>
              </div>
              <span className="font-code-sm text-[12px] text-secondary font-semibold">99.8% Accuracy</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
