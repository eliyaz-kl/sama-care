import React from 'react';
import { ViewTab } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onToggle: (open: boolean) => void;
  activeTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  urgentCount?: number;
  inquiryCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  activeTab,
  onSelectTab,
  urgentCount = 3,
  inquiryCount = 4,
}) => {
  return (
    <>
      {/* Expand Floating Trigger (visible when sidebar is hidden) */}
      {!isOpen && (
        <button
          id="expandSidebarBtn"
          type="button"
          onClick={() => onToggle(true)}
          title="Show Workflow Navigation"
          className="fixed left-0 top-20 z-40 flex items-center gap-1 px-3 py-2 rounded-r-xl bg-surface-container-lowest border-y border-r border-surface-container-high/80 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low shadow-md transition-all font-label-sm text-[12px] group cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px] text-secondary group-hover:translate-x-0.5 transition-transform">
            keyboard_double_arrow_right
          </span>
          <span className="font-semibold text-secondary">Workflows</span>
        </button>
      )}

      {/* Main Sidebar */}
      <aside
        id="mainSidebar"
        className={`fixed left-0 top-16 bottom-0 w-sidebar-width bg-surface-container-lowest z-40 flex flex-col justify-between py-space-md border-r border-surface-container-high/60 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col gap-space-sm px-space-sm overflow-y-auto">
          {/* Workflows Header */}
          <div className="px-space-sm py-1 flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
              Triage Workflows
            </span>
            <button
              id="hideSidebarBtn"
              type="button"
              onClick={() => onToggle(false)}
              title="Collapse Sidebar"
              className="px-1.5 py-0.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container-low transition-colors flex items-center gap-1 font-label-sm text-[11px] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">keyboard_double_arrow_left</span>
              <span>Hide</span>
            </button>
          </div>

          {/* Workflows Navigation */}
          <nav className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => onSelectTab('live-queue-copilot')}
              className={`flex items-center justify-between px-space-sm py-2 rounded-lg transition-colors text-left cursor-pointer ${
                activeTab === 'live-queue-copilot'
                  ? 'bg-secondary-fixed/70 text-on-surface font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
              }`}
            >
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-[18px] text-secondary">smart_toy</span>
                <span className="font-label-md text-label-md">Live Queue Copilot</span>
              </div>
              <span className="font-code-sm text-[11px] px-1.5 py-0.5 rounded bg-surface-container-highest text-secondary font-bold">
                14
              </span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('inquiry-workbench')}
              className={`flex items-center justify-between px-space-sm py-2 rounded-lg transition-colors font-label-md text-label-md text-left cursor-pointer ${
                activeTab === 'inquiry-workbench'
                  ? 'bg-secondary-fixed/70 text-on-surface font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
              }`}
            >
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-[18px] text-outline">inbox</span>
                <span>Inquiry Workbench</span>
              </div>
              <span className="font-code-sm text-[11px] px-1.5 py-0.5 rounded bg-surface-container-low text-outline">
                {inquiryCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('escalation-hub')}
              className={`flex items-center justify-between px-space-sm py-2 rounded-lg transition-colors font-label-md text-label-md text-left cursor-pointer ${
                activeTab === 'escalation-hub'
                  ? 'bg-secondary-fixed/70 text-on-surface font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
              }`}
            >
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-[18px] text-error">priority_high</span>
                <span>Escalation Hub</span>
              </div>
              <span className="font-code-sm text-[11px] px-1.5 py-0.5 rounded bg-error-container text-on-error-container font-semibold">
                {urgentCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('performance-analytics')}
              className={`flex items-center px-space-sm py-2 rounded-lg transition-colors font-label-md text-label-md text-left cursor-pointer ${
                activeTab === 'performance-analytics'
                  ? 'bg-secondary-fixed/70 text-on-surface font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
              }`}
            >
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-[18px] text-outline">bar_chart</span>
                <span>Analytics &amp; SLA</span>
              </div>
            </button>
          </nav>

          {/* Intelligence Engine Header */}
          <div className="px-space-sm pt-space-md pb-1">
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
              Intelligence Engine
            </span>
          </div>

          {/* Intelligence Engine Navigation */}
          <nav className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => onSelectTab('knowledge-base')}
              className={`flex items-center px-space-sm py-2 rounded-lg transition-colors font-label-md text-label-md text-left cursor-pointer ${
                activeTab === 'knowledge-base'
                  ? 'bg-secondary-fixed/70 text-on-surface font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
              }`}
            >
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-[18px] text-outline">library_books</span>
                <span>Knowledge Base</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('automation-rules')}
              className={`flex items-center px-space-sm py-2 rounded-lg transition-colors font-label-md text-label-md text-left cursor-pointer ${
                activeTab === 'automation-rules'
                  ? 'bg-secondary-fixed/70 text-on-surface font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
              }`}
            >
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-[18px] text-outline">auto_mode</span>
                <span>Triage Rules &amp; Prompts</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Autopilot Status Meter */}
        <div className="px-space-sm">
          <div className="p-space-sm rounded-xl bg-surface-container-low border border-surface-container-high/70 flex flex-col gap-space-2xs">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-on-surface-variant">Copilot Autopilot</span>
              <span className="font-code-sm text-[11px] text-secondary font-semibold">94.8% Acc</span>
            </div>
            <div className="w-full bg-surface-container-highest rounded-full h-1.5 mt-1 overflow-hidden">
              <div
                className="bg-secondary h-1.5 rounded-full transition-all duration-500"
                style={{ width: '94.8%' }}
              />
            </div>
            <span className="font-body-sm text-[11px] text-outline mt-1 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-secondary animate-ping" />
              Synthesizing drafts in background
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
