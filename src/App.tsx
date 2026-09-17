import React, { useState, useEffect } from 'react';
import { INITIAL_CASES, INITIAL_AUDIT_LOGS } from './data/mockData';
import { TriageCase, ViewTab } from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { TriageQueue } from './components/TriageQueue';
import { CaseWorkspace } from './components/CaseWorkspace';
import { LoginScreen } from './components/LoginScreen';
import { DocumentModal } from './components/DocumentModal';
import { AuditTrailModal } from './components/AuditTrailModal';
import { OllamaSettingsModal } from './components/OllamaSettingsModal';
import { Toast } from './components/Toast';
import { SecondaryViews } from './components/SecondaryViews';
import { DEFAULT_SYSTEM_PROMPT, OLLAMA_CONFIG } from './config/systemPrompt';

export default function App() {
  // Screen state: 'workbench' or 'login'
  const [currentScreen, setCurrentScreen] = useState<'workbench' | 'login'>('workbench');

  // Navigation tab
  const [activeTab, setActiveTab] = useState<ViewTab>('live-queue-copilot');

  // Sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Queue panel visibility (toggleable)
  const [isQueueVisible, setIsQueueVisible] = useState(true);

  // Cases data
  const [cases, setCases] = useState<TriageCase[]>(INITIAL_CASES);
  const [selectedCaseId, setSelectedCaseId] = useState<string>(INITIAL_CASES[0]?.id || '77042901');

  // Modals & drawers
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isOllamaModalOpen, setIsOllamaModalOpen] = useState(false);

  // Ollama & Copilot configuration state
  const [systemPrompt, setSystemPrompt] = useState<string>(DEFAULT_SYSTEM_PROMPT);
  const [ollamaUrl, setOllamaUrl] = useState<string>(OLLAMA_CONFIG.defaultBaseUrl);
  const [selectedModel, setSelectedModel] = useState<string>(OLLAMA_CONFIG.defaultModel);
  const [isOllamaConnected, setIsOllamaConnected] = useState<boolean>(false);
  const [aiEngine, setAiEngine] = useState<'ollama' | 'gemini'>('ollama');

  // Revision Directives input
  const [revisionDirectives, setRevisionDirectives] = useState('');

  // Search in global header
  const [globalSearch, setGlobalSearch] = useState('');

  // Queue refresh state
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState<{ show: boolean; message: string; icon: string }>({
    show: false,
    message: '',
    icon: 'check_circle',
  });

  const showToast = (message: string, icon = 'check_circle') => {
    setToast({ show: true, message, icon });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3800);
  };

  // Check Ollama status on startup & url change
  useEffect(() => {
    let isCancelled = false;
    const checkOllama = async () => {
      // 1. Direct browser ping to local Ollama
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        const directRes = await fetch(`${ollamaUrl.replace(/\/$/, '')}/api/tags`, {
          method: 'GET',
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (directRes.ok && !isCancelled) {
          const data = await directRes.json();
          const modelNames = (data.models || []).map((m: any) => m.name || m.model);
          setIsOllamaConnected(true);
          if (modelNames.length > 0 && !modelNames.includes(selectedModel)) {
            setSelectedModel(modelNames[0]);
          }
          return;
        }
      } catch {
        // Direct browser check failed (CORS or offline)
      }

      // 2. Server bridge check
      try {
        const res = await fetch(`/api/ollama/status?baseUrl=${encodeURIComponent(ollamaUrl)}`);
        const data = await res.json();
        if (!isCancelled) {
          if (data.connected) {
            setIsOllamaConnected(true);
            if (data.models?.length > 0 && !data.models.includes(selectedModel)) {
              setSelectedModel(data.models[0]);
            }
          } else {
            setIsOllamaConnected(false);
          }
        }
      } catch {
        if (!isCancelled) setIsOllamaConnected(false);
      }
    };
    checkOllama();
    return () => {
      isCancelled = true;
    };
  }, [ollamaUrl]);

  const currentCase = cases.find((c) => c.id === selectedCaseId) || cases[0];

  const handleSelectCase = (caseItem: TriageCase) => {
    setSelectedCaseId(caseItem.id);
    setCases((prev) =>
      prev.map((c) => (c.id === caseItem.id ? { ...c, status: 'locked' as const } : c))
    );
    showToast(`Acquired lease for Case #${caseItem.caseNumber} (SAMA: ${caseItem.samaRef})`, 'lock');
  };

  const handleRefreshQueue = () => {
    setIsRefreshing(true);
    showToast('Refreshing live SAMA triage feed across cluster...', 'sync');
    setTimeout(() => {
      setIsRefreshing(false);
      showToast(`Queue synchronized: ${cases.length} active customer inquiries`, 'cloud_done');
    }, 600);
  };

  const handleSubmitDispute = (caseId: string) => {
    const active = cases.find((c) => c.id === caseId);
    const caseNum = active ? active.caseNumber : '76000020';

    // Mark current case as resolved
    setCases((prevCases) =>
      prevCases.map((c) =>
        c.id === caseId ? { ...c, status: 'resolved' as const } : c
      )
    );

    showToast(`Case #${caseNum} Dispute Filed and Transferred to Fraud Operations.`, 'task_alt');

    // Find next pending or queued case
    const currentIndex = cases.findIndex((c) => c.id === caseId);
    const otherCases = cases.filter((c) => c.id !== caseId && c.status !== 'resolved');
    const nextCase = otherCases.length > 0 ? otherCases[0] : cases[(currentIndex + 1) % cases.length];

    setTimeout(() => {
      setSelectedCaseId(nextCase.id);
      setCases((prev) =>
        prev.map((c) => (c.id === nextCase.id ? { ...c, status: 'locked' as const } : c))
      );
      setRevisionDirectives('');
      showToast(`Loaded next case: #${nextCase.caseNumber}`, 'arrow_forward');
    }, 700);
  };

  const handleToggleLock = () => {
    const isCurrentlyLocked = currentCase.status === 'locked';
    const newStatus = isCurrentlyLocked ? ('queued' as const) : ('locked' as const);

    // Update case status to released (queued) or locked
    setCases((prevCases) =>
      prevCases.map((c) =>
        c.id === currentCase.id ? { ...c, status: newStatus } : c
      )
    );

    if (isCurrentlyLocked) {
      showToast(`Lock released for Case #${currentCase.caseNumber}.`, 'lock_open');
    } else {
      showToast(`Lock acquired for Case #${currentCase.caseNumber}.`, 'lock');
    }
  };

  const handleInjectCitation = (citation: string) => {
    setRevisionDirectives((prev) => {
      const trimmed = prev.trim();
      return trimmed ? `${trimmed} ${citation}` : citation;
    });
    showToast('Regulatory citation injected into revision directives', 'bookmark_added');
  };

  // If user is on the Login Screen
  if (currentScreen === 'login') {
    return (
      <div className="relative min-h-screen">
        <LoginScreen onLoginSuccess={() => setCurrentScreen('workbench')} />
      </div>
    );
  }

  // Filter cases by global search if present
  const displayCases = globalSearch.trim()
    ? cases.filter((c) => {
        const q = globalSearch.toLowerCase();
        return (
          c.caseNumber.toLowerCase().includes(q) ||
          c.customerName.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.accountNumber.toLowerCase().includes(q) ||
          c.samaRef.toLowerCase().includes(q) ||
          c.problemCode.toLowerCase().includes(q) ||
          c.departmentName.toLowerCase().includes(q)
        );
      })
    : cases;

  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface antialiased">
      {/* Fixed Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        searchQuery={globalSearch}
        onSearchChange={setGlobalSearch}
        onSwitchToLogin={() => setCurrentScreen('login')}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onOpenOllamaSettings={() => setIsOllamaModalOpen(true)}
        selectedModel={selectedModel}
        isOllamaConnected={isOllamaConnected}
        pendingCount={cases.filter((c) => c.status !== 'resolved').length}
        inReviewCount={cases.filter((c) => c.status === 'locked').length}
        resolvedTodayCount={cases.filter((c) => c.status === 'resolved').length}
      />

      {/* Collapsible Left Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={setIsSidebarOpen}
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
      />

      {/* Main Content Area */}
      <div
        id="mainContentWrapper"
        className={`transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'md:pl-sidebar-width' : 'pl-0'
        }`}
      >
        <main className="relative pt-16 bg-surface min-h-screen w-full px-space-md sm:px-space-lg max-w-full">
          <div className="flex flex-col w-full pb-space-3xl mx-auto">
            
            {/* Top Operational Banner with Status Scannability */}
            <div className="w-full bg-surface-container-lowest rounded-2xl p-space-md mb-space-md shadow-sm border border-surface-container-high flex flex-col md:flex-row md:items-center justify-between gap-space-sm mt-4">
              <div className="flex items-center gap-space-sm flex-wrap">
                <div className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse shrink-0" />
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
                  SAMA Level 1 Case Dispatch Engine
                </span>
                <span className="text-outline-variant font-label-md hidden sm:inline">/</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Responsible Officer:{' '}
                  <strong className="font-semibold text-on-surface">
                    {currentCase.responsibleAgent || 'Shahad'} (Customer Care Operations)
                  </strong>
                </span>
              </div>
              <div className="flex items-center gap-space-xs text-on-surface-variant bg-surface-container-low px-space-sm py-1 rounded-xl border border-surface-container-high/60">
                <span className="material-symbols-outlined text-[16px] text-secondary shrink-0">gavel</span>
                <span className="font-label-sm text-label-sm">
                  Dataset: Atmaal Customer Care • SAMA SLA Target: {currentCase.slaHours}h
                </span>
              </div>
            </div>

            {/* If secondary tab is selected */}
            {activeTab !== 'live-queue-copilot' ? (
              <SecondaryViews
                view={activeTab}
                cases={cases}
                onSelectCase={handleSelectCase}
                onBackToQueue={() => setActiveTab('live-queue-copilot')}
              />
            ) : (
              /* Main Asymmetric Split Workbench */
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
                {/* LEFT PANEL: Customer Requests Queue (xl:col-span-4) */}
                {isQueueVisible ? (
                  <div className="xl:col-span-4">
                    <TriageQueue
                      cases={displayCases}
                      selectedCaseId={selectedCaseId}
                      onSelectCase={handleSelectCase}
                      onRefresh={handleRefreshQueue}
                      isRefreshing={isRefreshing}
                      onHideQueue={() => setIsQueueVisible(false)}
                    />
                  </div>
                ) : (
                  <div className="xl:col-span-12 flex justify-start mb-2">
                    <button
                      type="button"
                      onClick={() => setIsQueueVisible(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-lowest text-secondary hover:bg-surface-container-low shadow-sm border border-surface-container-high text-[12px] font-label-md font-semibold cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">left_panel_open</span>
                      <span>Show Triage Queue Panel ({cases.length} Active)</span>
                    </button>
                  </div>
                )}

                {/* RIGHT PANEL: Ticket Workspace, Context, Copilot Studio (xl:col-span-8) */}
                <div className={isQueueVisible ? 'xl:col-span-8' : 'xl:col-span-12'}>
                  <CaseWorkspace
                    currentCase={currentCase}
                    onOpenDocModal={() => setIsDocModalOpen(true)}
                    onOpenAuditTrail={() => setIsAuditModalOpen(true)}
                    onToggleLock={handleToggleLock}
                    onSubmitNextCase={handleSubmitDispute}
                    onShowToast={showToast}
                    revisionDirectives={revisionDirectives}
                    setRevisionDirectives={setRevisionDirectives}
                    systemPrompt={systemPrompt}
                    ollamaUrl={ollamaUrl}
                    selectedModel={selectedModel}
                    aiEngine={aiEngine}
                    isOllamaConnected={isOllamaConnected}
                    onOpenOllamaSettings={() => setIsOllamaModalOpen(true)}
                  />
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* Interactive Regulation & SAMA Policy Document Viewer Modal */}
      <DocumentModal
        isOpen={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
        currentCase={currentCase}
        onInjectCitation={handleInjectCitation}
      />

      {/* Immutable Audit Trail Modal */}
      <AuditTrailModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        currentCase={currentCase}
        auditLogs={INITIAL_AUDIT_LOGS}
      />

      {/* Ollama Settings & System Prompt Modal */}
      <OllamaSettingsModal
        isOpen={isOllamaModalOpen}
        onClose={() => setIsOllamaModalOpen(false)}
        systemPrompt={systemPrompt}
        onSaveSystemPrompt={setSystemPrompt}
        ollamaUrl={ollamaUrl}
        onSaveOllamaUrl={setOllamaUrl}
        selectedModel={selectedModel}
        onSaveSelectedModel={setSelectedModel}
        onShowToast={showToast}
      />

      {/* Floating Notification Toast */}
      <Toast show={toast.show} message={toast.message} icon={toast.icon} />
    </div>
  );
}
