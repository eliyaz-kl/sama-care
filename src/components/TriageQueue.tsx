import React, { useState } from 'react';
import { TriageCase } from '../types';

interface TriageQueueProps {
  cases: TriageCase[];
  selectedCaseId: string;
  onSelectCase: (caseItem: TriageCase) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  onHideQueue?: () => void;
}

type FilterCategory = 'all' | 'urgent' | 'loan_ops' | 'card_ops' | 'car_leasing';

export const TriageQueue: React.FC<TriageQueueProps> = ({
  cases,
  selectedCaseId,
  onSelectCase,
  onRefresh,
  isRefreshing,
  onHideQueue,
}) => {
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('all');
  const [filterSearch, setFilterSearch] = useState('');

  const filteredCases = cases.filter((c) => {
    // category filter
    if (filterCategory === 'urgent' && c.category !== 'urgent') return false;
    if (filterCategory === 'loan_ops' && c.category !== 'loan_ops') return false;
    if (filterCategory === 'card_ops' && c.category !== 'card_ops') return false;
    if (filterCategory === 'car_leasing' && c.category !== 'car_leasing') return false;

    // text search
    if (filterSearch.trim()) {
      const q = filterSearch.toLowerCase();
      const matchNumber = c.caseNumber.toLowerCase().includes(q);
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchCode = c.problemCode.toLowerCase().includes(q);
      const matchDept = c.departmentName.toLowerCase().includes(q);
      const matchAgent = c.responsibleAgent.toLowerCase().includes(q);
      const matchSama = c.samaRef.toLowerCase().includes(q);
      const matchQuery = c.customerQuery.toLowerCase().includes(q);
      return matchNumber || matchTitle || matchCode || matchDept || matchAgent || matchSama || matchQuery;
    }

    return true;
  });

  const urgentCount = cases.filter((c) => c.category === 'urgent').length;
  const loanCount = cases.filter((c) => c.category === 'loan_ops').length;
  const cardCount = cases.filter((c) => c.category === 'card_ops').length;
  const leaseCount = cases.filter((c) => c.category === 'car_leasing').length;

  return (
    <section className="flex flex-col gap-space-md">
      <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-surface-container-high flex flex-col gap-space-md">

        {/* Search & Control Header */}
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center justify-between">
            <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-space-xs">
              <span>SAMA Triage Queue</span>
              <span className="font-code-sm text-label-sm px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-container font-semibold border border-secondary/20">
                {cases.length} Records
              </span>
            </h2>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={onRefresh}
                title="Refresh Live Queue"
                className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors cursor-pointer"
              >
                <span className={`material-symbols-outlined text-[18px] ${isRefreshing ? 'animate-spin text-secondary' : ''}`}>
                  sync
                </span>
              </button>
              {onHideQueue && (
                <button
                  type="button"
                  onClick={onHideQueue}
                  title="Hide Queue Panel"
                  className="px-2 py-1 rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors flex items-center gap-1 font-label-sm text-label-sm border border-surface-container-high/60 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">left_panel_close</span>
                  <span>Hide</span>
                </button>
              )}
            </div>
          </div>

          <div className="relative w-full mt-space-2xs">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
              search
            </span>
            <input
              type="text"
              value={filterSearch}
              onChange={(e) => setFilterSearch(e.target.value)}
              placeholder="Search Case #, Problem Code, Agent, SAMA Ref..."
              className="w-full h-9 pl-9 pr-3 rounded-xl bg-surface-container-low text-on-surface placeholder:text-outline font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary/20 transition-all border border-transparent focus:border-secondary/30"
            />
            {filterSearch && (
              <button
                type="button"
                onClick={() => setFilterSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-surface-container-low rounded-xl overflow-x-auto border border-surface-container-high/50 text-[12px]">
          <button
            type="button"
            onClick={() => setFilterCategory('all')}
            className={`px-2.5 py-1 rounded-lg font-label-md transition-all whitespace-nowrap cursor-pointer ${filterCategory === 'all'
                ? 'bg-surface-container-lowest text-on-surface shadow-sm font-semibold'
                : 'text-on-surface-variant hover:bg-surface-container-lowest/60'
              }`}
          >
            All ({cases.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterCategory('urgent')}
            className={`px-2.5 py-1 rounded-lg font-label-md transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer ${filterCategory === 'urgent'
                ? 'bg-surface-container-lowest text-error shadow-sm font-semibold'
                : 'text-error hover:bg-surface-container-lowest/60 font-semibold'
              }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-error" />
            Urgent ({urgentCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterCategory('loan_ops')}
            className={`px-2.5 py-1 rounded-lg font-label-md transition-all whitespace-nowrap cursor-pointer ${filterCategory === 'loan_ops'
                ? 'bg-surface-container-lowest text-on-surface shadow-sm font-semibold'
                : 'text-on-surface-variant hover:bg-surface-container-lowest/60'
              }`}
          >
            Loans &amp; SIMAH ({loanCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterCategory('card_ops')}
            className={`px-2.5 py-1 rounded-lg font-label-md transition-all whitespace-nowrap cursor-pointer ${filterCategory === 'card_ops'
                ? 'bg-surface-container-lowest text-on-surface shadow-sm font-semibold'
                : 'text-on-surface-variant hover:bg-surface-container-lowest/60'
              }`}
          >
            Cards ({cardCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterCategory('car_leasing')}
            className={`px-2.5 py-1 rounded-lg font-label-md transition-all whitespace-nowrap cursor-pointer ${filterCategory === 'car_leasing'
                ? 'bg-surface-container-lowest text-on-surface shadow-sm font-semibold'
                : 'text-on-surface-variant hover:bg-surface-container-lowest/60'
              }`}
          >
            Car Leasing ({leaseCount})
          </button>
        </div>

        {/* Ticket Cards Container */}
        <div className="flex flex-col gap-space-sm max-h-[720px] overflow-y-auto pr-0.5" id="queueList">
          {filteredCases.map((item) => {
            const isSelected = item.id === selectedCaseId;
            return (
              <article
                key={item.id}
                onClick={() => onSelectCase(item)}
                className={`relative p-space-md rounded-xl cursor-pointer transition-all shadow-sm group ${isSelected
                    ? 'bg-surface-container-low border-2 border-secondary/40'
                    : 'bg-surface-container-lowest hover:bg-surface-container-low/70 border border-surface-container-high/70'
                  }`}
              >
                <div className="flex items-center justify-between gap-2 mb-space-2xs">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {isSelected && item.status === 'locked' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-secondary text-on-secondary font-code-sm text-[11px] font-semibold tracking-wide shadow-sm">
                        <span className="material-symbols-outlined text-[12px]">lock</span>
                        LOCKED
                      </span>
                    ) : item.status === 'resolved' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-secondary-fixed text-on-secondary-container font-code-sm text-[11px] font-semibold">
                        <span className="material-symbols-outlined text-[12px]">task_alt</span>
                        RESOLVED
                      </span>
                    ) : item.status === 'locked' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface-container-high text-on-surface-variant font-code-sm text-[11px]">
                        <span className="material-symbols-outlined text-[12px]">lock</span>
                        LOCKED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant font-code-sm text-[11px]">
                        <span className="material-symbols-outlined text-[12px]">lock_open</span>
                        QUEUED
                      </span>
                    )}
                    <span className={`font-code-sm text-label-sm ${isSelected ? 'text-secondary font-bold' : 'text-on-surface font-semibold'}`}>
                      #{item.caseNumber}
                    </span>
                    <span className="text-[10px] font-code-sm px-1.5 py-0.2 rounded bg-surface-container text-outline">
                      {item.problemCode}
                    </span>
                    {item.agentResolution && (
                      <span className="text-[10px] font-code-sm px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold" title="CRM Human Resolution Record Loaded">
                        MSD
                      </span>
                    )}
                  </div>
                  <span className="font-code-sm text-[11px] text-outline">
                    {item.timeAgo}
                  </span>
                </div>

                <h3 className={`font-headline-sm text-[14px] leading-tight mb-space-xs transition-colors ${isSelected ? 'text-on-surface font-semibold' : 'text-on-surface font-medium group-hover:text-secondary'
                  }`}>
                  {item.title}
                </h3>

                <div className="flex items-center justify-between text-body-sm text-on-surface-variant pt-space-2xs">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="material-symbols-outlined text-[15px] text-secondary">
                      domain
                    </span>
                    <span className="font-body-sm text-[11px] text-on-surface font-medium truncate">
                      {item.departmentName}
                    </span>
                    <span className="text-outline text-[11px]">• Agent: {item.responsibleAgent}</span>
                  </div>

                  <span className="shrink-0 font-code-sm text-[11px] text-secondary font-semibold bg-secondary-fixed/40 px-1.5 py-0.5 rounded">
                    SAMA: {item.samaRef}
                  </span>
                </div>
              </article>
            );
          })}

          {filteredCases.length === 0 && (
            <div className="p-8 text-center bg-surface-container-low rounded-xl border border-surface-container-high text-on-surface-variant">
              <span className="material-symbols-outlined text-outline text-[32px] mb-2">inbox</span>
              <p className="font-headline-sm text-[14px]">No triage cases match filters</p>
              <p className="font-body-sm text-[12px] text-outline mt-1">Try broadening your search query or selecting All tabs.</p>
            </div>
          )}
        </div>

        {/* Lock Queue Footer Info Card */}
        <div className="p-space-sm rounded-xl bg-surface-container text-on-surface flex items-center gap-space-sm border border-surface-container-high">
          <span className="material-symbols-outlined text-secondary text-[20px] shrink-0">
            verified_user
          </span>
          <p className="font-body-sm text-[12px] text-on-surface-variant leading-snug">
            SAMA Level 1 dispute integration active. Exclusive lock prevents cross-agent collisions.
          </p>
        </div>

      </div>
    </section>
  );
};
