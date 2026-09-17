import React, { useState } from 'react';
import { ViewTab } from '../types';

interface HeaderProps {
  activeTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSwitchToLogin?: () => void;
  onToggleSidebar?: () => void;
  onOpenOllamaSettings?: () => void;
  selectedModel?: string;
  isOllamaConnected?: boolean;
  aiEngine?: 'ollama' | 'gemini';
  onToggleAiEngine?: (engine: 'ollama' | 'gemini') => void;
  pendingCount?: number;
  inReviewCount?: number;
  resolvedTodayCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab: _activeTab,
  onSelectTab,
  searchQuery,
  onSearchChange,
  onSwitchToLogin,
  onToggleSidebar,
  onOpenOllamaSettings,
  selectedModel = 'llama3',
  isOllamaConnected = false,
  pendingCount = 7,
  inReviewCount = 2,
  resolvedTodayCount = 18,
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-surface-container-lowest shadow-[0_1px_8px_rgba(20,46,32,0.06)] px-space-md border-b border-surface-container-high/60">
      <div className="h-16 w-full flex items-center justify-between gap-space-md">
        
        {/* Left Section: Brand & Workspace */}
        <div className="flex items-center gap-space-md shrink-0">
          {onToggleSidebar && (
            <button
              type="button"
              onClick={onToggleSidebar}
              className="md:hidden p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container-low"
              title="Toggle Menu"
            >
              <span className="material-symbols-outlined text-[22px]">menu</span>
            </button>
          )}

          <div
            className="flex items-center gap-space-xs cursor-pointer select-none"
            onClick={() => onSelectTab('live-queue-copilot')}
          >
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-on-secondary shadow-sm">
              <span className="material-symbols-outlined text-[19px]">account_balance</span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight leading-tight">
                Atmaal Ops Copilot
              </span>
              <span className="text-[10px] text-outline font-semibold tracking-wider uppercase leading-none">
                Atmaal Customer Care
              </span>
            </div>
          </div>

          <div className="h-5 w-px bg-outline-variant hidden md:block" />

          <div className="hidden md:flex items-center gap-space-xs bg-surface-container-low px-space-sm py-1.5 rounded-lg text-on-surface-variant font-label-md text-label-md border border-outline-variant/40">
            <span className="material-symbols-outlined text-[16px] text-secondary">shield</span>
            <span>SAMA Customer Care Hub</span>
            <span className="text-outline">/</span>
            <span className="text-on-surface font-semibold">Triage Level 1</span>
          </div>
        </div>

        {/* Center-Left Status Indicators */}
        <div className="hidden xl:flex items-center gap-space-xs shrink-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm border border-error/20">
            <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse" />
            <span>{pendingCount} SAMA Open</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-container font-label-sm text-label-sm border border-secondary/20">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
            <span>{inReviewCount} In Review</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-outline" />
            <span>{resolvedTodayCount} Resolved Today</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-auto hidden lg:block">
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search Case #, IBAN, Account #, SWIFT UETR, Card... (/)"
              className="w-full h-9 pl-9 pr-12 rounded-lg bg-surface-container-low text-on-surface placeholder:text-outline font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary/30 transition-all border border-transparent focus:border-secondary/40"
            />
            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-code-sm text-[10px]">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right Nav & User Profile */}
        <div className="flex items-center gap-space-sm shrink-0">
          {/* Notifications Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setNotificationOpen(!notificationOpen)}
              className="relative p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer"
              title="System Notifications"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-error" />
              </span>
            </button>

            {notificationOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-surface-container-lowest rounded-xl shadow-xl border border-surface-container-high p-space-sm z-50">
                <div className="flex items-center justify-between pb-2 border-b border-surface-container-high mb-2">
                  <span className="font-headline-sm text-[13px] text-on-surface font-semibold">Notifications</span>
                  <span className="text-[10px] font-code-sm text-secondary bg-secondary-fixed px-1.5 py-0.5 rounded">3 New</span>
                </div>
                <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                  <div className="p-2 rounded-lg bg-surface-container-low text-on-surface text-[12px] flex flex-col gap-0.5">
                    <span className="font-semibold text-error flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-error" />
                      SLA Alert: BNK-98421
                    </span>
                    <span className="text-on-surface-variant text-[11px]">18 minutes remaining before SWIFT recall compliance cutoff.</span>
                  </div>
                  <div className="p-2 rounded-lg hover:bg-surface-container-low text-on-surface text-[12px] flex flex-col gap-0.5">
                    <span className="font-semibold text-secondary flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                      Autopilot Batch Complete
                    </span>
                    <span className="text-on-surface-variant text-[11px]">8 drafts synthesized at 94.8% regulatory accuracy.</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Help Button */}
          <button
            type="button"
            onClick={() => alert('Atmaal Banking Ops Triage documentation & regulatory assistance desk.')}
            className="p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer"
            title="Help & Support"
          >
            <span className="material-symbols-outlined text-[20px]">help_outline</span>
          </button>

          {/* Profile Section */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 pl-space-xs hover:opacity-90 transition-opacity cursor-pointer"
            >
              <div className="relative flex items-center">
                <div className="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-headline-sm text-[13px] font-bold shadow-[0_1px_4px_rgba(0,0,0,0.1)]">
                  AA
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-600 ring-2 ring-surface-container-lowest" />
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="font-label-md text-label-md text-on-surface leading-tight font-semibold">
                  Ahmed Awaad
                </span>
                <span className="font-label-sm text-[10px] text-outline leading-tight">
                  Lead Ops Officer
                </span>
              </div>
              <span className="material-symbols-outlined text-[16px] text-outline hidden md:block">
                expand_more
              </span>
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-surface-container-lowest rounded-xl shadow-xl border border-surface-container-high py-1 z-50">
                <div className="px-4 py-2 border-b border-surface-container-high">
                  <p className="font-label-md text-[13px] font-semibold text-on-surface">Ahmed Awaad</p>
                  <p className="font-code-sm text-[11px] text-outline">ahmed.awaad@atmaal.com</p>
                  <p className="font-label-sm text-[10px] text-secondary mt-1 font-semibold">Officer ID: #OPS-9902 • Lead Triage</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    onSwitchToLogin?.();
                  }}
                  className="w-full text-left px-4 py-2 text-on-surface hover:bg-surface-container-low text-[13px] flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px] text-outline">switch_account</span>
                  <span>Switch Screen to Login</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    onSwitchToLogin?.();
                  }}
                  className="w-full text-left px-4 py-2 text-error hover:bg-error-container/20 text-[13px] flex items-center gap-2 cursor-pointer border-t border-surface-container-high"
                >
                  <span className="material-symbols-outlined text-[16px]">logout</span>
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
