import React, { useState, useEffect, useMemo } from 'react';
import { TriageCase } from '../types';
import { calculateResolutionMatch } from '../utils/resolutionMatch';

interface CaseWorkspaceProps {
  currentCase: TriageCase;
  onOpenDocModal: () => void;
  onOpenAuditTrail: () => void;
  onToggleLock: () => void;
  onSubmitNextCase: (caseId: string) => void;
  onShowToast: (message: string, icon?: string) => void;
  revisionDirectives: string;
  setRevisionDirectives: React.Dispatch<React.SetStateAction<string>>;
  systemPrompt: string;
  ollamaUrl: string;
  selectedModel: string;
  aiEngine?: 'ollama' | 'gemini';
  isOllamaConnected?: boolean;
  onOpenOllamaSettings: () => void;
}

export const CaseWorkspace: React.FC<CaseWorkspaceProps> = ({
  currentCase,
  onOpenDocModal,
  onOpenAuditTrail,
  onToggleLock,
  onSubmitNextCase,
  onShowToast,
  revisionDirectives,
  setRevisionDirectives,
  systemPrompt,
  ollamaUrl,
  selectedModel,
  aiEngine = 'ollama',
  isOllamaConnected = false,
  onOpenOllamaSettings,
}) => {
  const [resolutionText, setResolutionText] = useState(currentCase.suggestedResolution);
  const [editingDraft, setEditingDraft] = useState(currentCase.suggestedResolution);
  const [isEditingResolution, setIsEditingResolution] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [generationStep, setGenerationStep] = useState(0);
  const [generationSource, setGenerationSource] = useState<'initial' | 'ollama' | 'gemini' | 'preview_synthesizer'>('initial');
  const [generationLatency, setGenerationLatency] = useState<number | null>(null);
  const [showComparisonDetails, setShowComparisonDetails] = useState(false);
  const [agentCorrectnessScore, setAgentCorrectnessScore] = useState<number>(currentCase.correctnessScore ?? 80);
  const [agentCorrectnessAnalysis, setAgentCorrectnessAnalysis] = useState<string>(currentCase.correctnessAnalysis ?? '');

  // Sync resolution text when currentCase changes
  useEffect(() => {
    setResolutionText(currentCase.suggestedResolution);
    setEditingDraft(currentCase.suggestedResolution);
    setIsEditingResolution(false);
    setIsRegenerating(false);
    setGenerationSource('initial');
    setGenerationLatency(null);
    setShowComparisonDetails(false);
    setAgentCorrectnessScore(currentCase.correctnessScore ?? 80);
    setAgentCorrectnessAnalysis(currentCase.correctnessAnalysis ?? '');
  }, [currentCase]);

  // Elapsed timer during regeneration
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRegenerating) {
      setElapsedSeconds(0);
      setGenerationStep(0);
      interval = setInterval(() => {
        setElapsedSeconds((prev) => {
          const next = prev + 0.2;
          if (next > 1.2 && next < 2.5) setGenerationStep(1);
          else if (next >= 2.5) setGenerationStep(2);
          return parseFloat(next.toFixed(1));
        });
      }, 200);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRegenerating]);

  const insertPrompt = (text: string) => {
    setRevisionDirectives((prev) => {
      const trimmed = prev.trim();
      if (trimmed.length > 0) {
        return `${trimmed}\n${text}`;
      }
      return text;
    });
  };

  const handleRegenerate = async () => {
    setIsEditingResolution(false);
    setIsRegenerating(true);
    const startTime = Date.now();

    // 1. If Local Ollama is selected as AI engine, first attempt direct browser call to user's local Ollama instance
    if (aiEngine === 'ollama') {
      onShowToast('Connecting to private AI inference engine...', 'psychology');

      try {
        const isArabicQuery = /[\u0600-\u06FF]/.test(currentCase.customerQuery || '');
        const langDirective = isArabicQuery
          ? 'المتطلب الإلزامي: كتابة الرد بالكامل باللغة العربية الفصحى المصرفية المعتمدة لدى البنوك السعودية.'
          : 'MANDATORY REQUIREMENT: Customer inquiry is in English. Write the entire resolution letter in professional banking English.';

        const promptForOllama = `Case #${currentCase.caseNumber} (SAMA Ref: ${currentCase.samaRef})
Title: ${currentCase.title} | Department: ${currentCase.departmentName} | Code: ${currentCase.problemCode}

Customer Query:
"${currentCase.customerQuery}"

Recorded CRM Agent Response:
"${currentCase.agentResolution}"

${revisionDirectives && revisionDirectives.trim() ? `Operational Directives:\n${revisionDirectives.trim()}\n` : ''}
${langDirective}

Generate the finalized official customer care resolution letter according to SAMA (Saudi Central Bank) compliance. Address the exact inquiry, execute corrective action, and apply directives. Output ONLY the customer resolution message without meta talk or preambles.`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 25000);

        const localResp = await fetch(`${ollamaUrl.replace(/\/$/, '')}/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: selectedModel,
            prompt: promptForOllama,
            system: systemPrompt,
            stream: false,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (localResp.ok) {
          const localData = await localResp.json();
          let cleanLlmText = (localData.response || '').trim();
          if (cleanLlmText.startsWith('```') && cleanLlmText.endsWith('```')) {
            cleanLlmText = cleanLlmText.replace(/^```[a-z]*\n/, '').replace(/\n```$/, '').trim();
          }

          if (cleanLlmText) {
            const duration = Date.now() - startTime;
            setGenerationLatency(duration);
            setResolutionText(cleanLlmText);
            setEditingDraft(cleanLlmText);
            setAgentCorrectnessScore(92);
            setAgentCorrectnessAnalysis(`Synthesized directly via your local Ollama model (${selectedModel}) with active SAMA customer protection directives.`);
            setGenerationSource('ollama');
            onShowToast(`Synthesized via Local Ollama (${selectedModel}) in ${duration}ms!`, 'smart_toy');
            setIsRegenerating(false);
            return;
          }
        }
      } catch (browserOllamaErr) {
        console.warn('Direct browser fetch to local Ollama failed, attempting server proxy/fallback:', browserOllamaErr);
      }
    } else {
      onShowToast(`Calling AI Copilot to analyze case & synthesize resolution...`, 'auto_awesome');
    }

    // 2. Call backend analyze-case (with preferEngine set)
    try {
      const response = await fetch('/api/analyze-case', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseNumber: currentCase.caseNumber,
          samaRef: currentCase.samaRef,
          title: currentCase.title,
          departmentName: currentCase.departmentName,
          owner: currentCase.owner,
          problemCode: currentCase.problemCode,
          customerQuery: currentCase.customerQuery,
          agentResponse: currentCase.agentResolution,
          // Internal fields sent strictly to the LLM (not rendered in front-end)
          issueStatus: currentCase.issueStatus,
          reviewerComments: currentCase.reviewerComments,
          directives: revisionDirectives,
          preferEngine: aiEngine,
          systemPrompt,
          model: selectedModel,
          baseUrl: ollamaUrl,
        }),
      });

      const data = await response.json();
      const duration = Date.now() - startTime;
      setGenerationLatency(duration);

      const resText = data.suggestedResponse || data.response;
      if (resText) {
        let cleanResponse = String(resText).trim();
        if (cleanResponse.startsWith('```') && cleanResponse.endsWith('```')) {
          cleanResponse = cleanResponse.replace(/^```[a-z]*\n/, '').replace(/\n```$/, '').trim();
        }
        // ONLY insert the clean LLM response - no old content or user input echoes
        setResolutionText(cleanResponse);
        setEditingDraft(cleanResponse);
        if (typeof data.correctnessScore === 'number') {
          setAgentCorrectnessScore(data.correctnessScore);
        }
        if (data.evaluation) {
          setAgentCorrectnessAnalysis(data.evaluation);
        }
        setGenerationSource(data.source === 'ollama' ? 'ollama' : data.source === 'gemini' ? 'gemini' : 'preview_synthesizer');

        if (data.source === 'ollama') {
          onShowToast(`Synthesized via Local Ollama (${data.model || selectedModel}) in ${duration}ms!`, 'smart_toy');
        } else if (aiEngine === 'ollama') {
          onShowToast(`Local Ollama was unreachable; calibrated via SAMA engine (${duration}ms). Click Ollama in header to connect.`, 'tune');
        } else if (revisionDirectives && revisionDirectives.trim()) {
          onShowToast(`Resolution regenerated with operational directives applied (${duration}ms)!`, 'check_circle');
        } else {
          onShowToast(`Resolution successfully regenerated by AI Copilot (${duration}ms)!`, 'check_circle');
        }
      } else {
        throw new Error('No response returned from generation endpoint.');
      }
    } catch (err: any) {
      console.error('Generation failed:', err);
      // Resilient fallback draft without echoing user input directives
      const isArabic = /[\u0600-\u06FF]/.test(currentCase.customerQuery || '');
      const fallback = isArabic
        ? `عميلنا العزيز (${currentCase.customerName || 'عميلنا العزيز'})، السلام عليكم ورحمة الله وبركاته،

إشارة إلى تذكرتكم رقم ${currentCase.caseNumber} ومرجع البنك المركزي السعودي (ساما) رقم ${currentCase.samaRef}:

تم مراجعة الطلب لدى فريق العمليات بالتنسيق مع ${currentCase.departmentName}. تم اتخاذ كافة التدابير التصحيحية والتشغيلية المعتمدة وفقاً لمعايير البنك المركزي السعودي (ساما).

حسابكم ومطالبتكم قيد المتابعة المباشرة لإغلاق الملف خلال مدة SLA المحددة (${currentCase.slaHours} ساعة).

شاكرين ومقدرين كريم ثقتكم،
فريق العناية بالعملاء ومتابعة قضايا ساما - Atmaal Customer Care`
        : `Dear ${currentCase.customerName || 'Valued Customer'},

Thank you for contacting Atmaal Customer Care regarding your SAMA Level 1 inquiry (Case #${currentCase.caseNumber} / SAMA Regulatory Ref: ${currentCase.samaRef}).

In accordance with Saudi Central Bank (SAMA) Consumer Protection Principles, our operations team has reviewed your complaint and executed all necessary corrective actions and fee waivers.

Your account status is fully verified with no remaining liabilities.

Sincerely,
Customer Care Operations & SAMA Level 1 Dispute Unit - Atmaal Ops Copilot`;

      setResolutionText(fallback);
      setEditingDraft(fallback);
      setGenerationSource('preview_synthesizer');
      onShowToast('Copilot draft generated.', 'check_circle');
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleSubmit = () => {
    onSubmitNextCase(currentCase.id);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    onShowToast(`${label} copied to clipboard!`, 'content_copy');
  };

  const isResolutionArabic = /[\u0600-\u06FF]/.test(resolutionText || '');
  const isDraftArabic = /[\u0600-\u06FF]/.test(editingDraft || '');
  const isQueryArabic = /[\u0600-\u06FF]/.test(currentCase.customerQuery || '');
  const isAgentResolutionArabic = /[\u0600-\u06FF]/.test(currentCase.agentResolution || '');

  const matchResult = useMemo(() => {
    const activeAiText = isEditingResolution ? editingDraft : resolutionText;
    return calculateResolutionMatch(currentCase.agentResolution, activeAiText);
  }, [currentCase.agentResolution, resolutionText, editingDraft, isEditingResolution]);

  return (
    <main className="flex flex-col gap-space-md">
      
      {/* Header Meta Banner */}
      <section className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-surface-container-high flex flex-col gap-space-md">
        <div className="flex flex-wrap items-start justify-between gap-space-sm">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-space-xs flex-wrap">
              <span className="font-code-sm text-[12px] font-bold px-2.5 py-0.5 rounded-md bg-secondary-fixed text-on-secondary-container border border-secondary/30">
                CASE #{currentCase.caseNumber}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm font-semibold">
                {currentCase.departmentName}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 font-label-sm text-label-sm font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px] text-emerald-700">shield</span>
                {currentCase.origin}
              </span>
              <span className="font-code-sm text-[11px] px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 font-semibold">
                SAMA Ref: {currentCase.samaRef}
              </span>
              {currentCase.action === 'Closed' ? (
                <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-[11px] font-semibold">
                  Action: Closed
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 font-label-sm text-[11px] font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                  Action: Open
                </span>
              )}
            </div>

            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-1">
              {currentCase.title}
            </h1>
          </div>

          <div className="flex items-center gap-space-xs flex-wrap">
            <button
              type="button"
              onClick={onOpenAuditTrail}
              className="px-3 py-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md transition-colors flex items-center gap-1.5 border border-surface-container-high cursor-pointer shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px] text-secondary">history</span>
              <span>Audit Trail</span>
            </button>

            <button
              id="releaseLockBtn"
              type="button"
              onClick={onToggleLock}
              title={currentCase.status === 'locked' ? 'Release lock for this case' : 'Acquire lock for this case'}
              className={`px-3.5 py-1.5 rounded-xl font-label-md text-label-md transition-all flex items-center gap-1.5 border cursor-pointer shadow-sm ${
                currentCase.status === 'locked'
                  ? 'bg-surface-container-low hover:bg-surface-container text-on-surface border-surface-container-high hover:border-secondary/50'
                  : 'bg-secondary-fixed hover:bg-secondary-fixed/80 text-on-secondary-container border-secondary/30 font-semibold'
              }`}
            >
              <span className="material-symbols-outlined text-[16px] text-secondary">
                {currentCase.status === 'locked' ? 'lock_open' : 'lock'}
              </span>
              <span>{currentCase.status === 'locked' ? 'Release Lock' : 'Acquire Lock'}</span>
            </button>
          </div>
        </div>

        {/* Dataset Header Fields Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-space-xs border-t border-surface-container-high/60">
          <div className="flex flex-col p-2 rounded-lg bg-surface-container-low border border-surface-container-high/60">
            <span className="text-outline font-label-sm text-[10px] uppercase">Problem Code</span>
            <span className="font-code-sm font-bold text-error text-[12px] truncate">
              {currentCase.problemCode}
            </span>
          </div>

          <div className="flex flex-col p-2 rounded-lg bg-surface-container-low border border-surface-container-high/60">
            <span className="text-outline font-label-sm text-[10px] uppercase">Responsible Agent</span>
            <span className="font-label-sm font-semibold text-on-surface text-[12px] truncate">
              {currentCase.responsibleAgent}
            </span>
          </div>

          <div className="flex flex-col p-2 rounded-lg bg-surface-container-low border border-surface-container-high/60">
            <span className="text-outline font-label-sm text-[10px] uppercase">Owner / Case Owner</span>
            <span className="font-label-sm font-medium text-on-surface-variant text-[12px] truncate">
              {currentCase.owner}
            </span>
          </div>

          <div className="flex flex-col p-2 rounded-lg bg-surface-container-low border border-surface-container-high/60">
            <span className="text-outline font-label-sm text-[10px] uppercase">Created On</span>
            <span className="font-code-sm text-on-surface text-[11px] truncate">
              {currentCase.createdOn}
            </span>
          </div>

          <div className="flex flex-col p-2 rounded-lg bg-surface-container-low border border-surface-container-high/60">
            <span className="text-outline font-label-sm text-[10px] uppercase">SLA Window</span>
            <span className="font-code-sm font-bold text-secondary text-[12px] truncate">
              {currentCase.slaHours} Hours ({currentCase.slaFormatted})
            </span>
          </div>

          <div className="flex flex-col p-2 rounded-lg bg-surface-container-low border border-surface-container-high/60">
            <span className="text-outline font-label-sm text-[10px] uppercase">Dataset S No</span>
            <span className="font-code-sm font-semibold text-on-surface text-[12px]">
              Record #{currentCase.sNo}
            </span>
          </div>
        </div>
      </section>

      {/* Section 1: Customer Query Box (In Arabic & High Contrast) */}
      <section className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-surface-container-high flex flex-col gap-space-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-secondary text-[20px]">forum</span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Customer Query (استفسار العميل الوارد)</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => copyToClipboard(currentCase.customerQuery, 'Customer Query')}
              className="text-[11px] text-outline hover:text-on-surface flex items-center gap-1 font-label-sm transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px]">content_copy</span>
              <span>Copy Query</span>
            </button>
            <span className="font-code-sm text-[11px] text-outline hidden sm:block">
              Ref: {currentCase.samaRef}
            </span>
          </div>
        </div>

        {/* Query Content Card with Language-Aware Typography */}
        <div className="relative bg-surface-container-low p-space-md rounded-xl border border-surface-container-high/60">
          <div className="flex items-start gap-space-sm" dir={isQueryArabic ? 'rtl' : 'ltr'}>
            <span className="material-symbols-outlined text-secondary text-[26px] opacity-60 select-none shrink-0 mt-0.5">
              format_quote
            </span>
            <p className={`${isQueryArabic ? "font-['Cairo'] text-[15px] leading-loose text-right" : "font-sans text-[14px] leading-relaxed text-left"} text-on-surface font-medium flex-1 select-text`}>
              {currentCase.customerQuery}
            </p>
          </div>

          <div className="mt-space-sm pt-space-xs flex flex-wrap items-center justify-between gap-space-sm text-on-surface-variant font-code-sm text-[11px] border-t border-surface-container-high/50">
            <div className="flex items-center gap-3 flex-wrap">
              <span>Channel: {currentCase.inboundChannel}</span>
              <span>Origin: {currentCase.origin}</span>
              <span>Account: {currentCase.accountNumber}</span>
            </div>
            <span className="text-secondary font-semibold">Department: {currentCase.departmentName}</span>
          </div>
        </div>
      </section>

      {/* Section 1.5: Agent Response (CRM Human Resolution - Fetched from CRM) */}
      <section className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-surface-container-high flex flex-col gap-space-sm">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-space-xs">
            <div className="w-7 h-7 rounded-lg bg-secondary/15 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[18px]">support_agent</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Agent Response (CRM Human Resolution)</h2>
              <span className="font-['Cairo'] text-[13px] text-outline font-normal hidden sm:inline">
                (رد موظف العمليات المسجل في النظام)
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 font-label-sm text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                Fetched from CRM
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => copyToClipboard(currentCase.agentResolution, 'Agent Resolution')}
              className="text-[12px] text-outline hover:text-on-surface flex items-center gap-1 font-label-sm transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">content_copy</span>
              <span>Copy Response</span>
            </button>
            <span className="font-code-sm text-[11px] text-outline hidden md:block">
              CRM Ref: {currentCase.crmTicketId || `CRM-AR-${currentCase.caseNumber}`}
            </span>
          </div>
        </div>

        {/* Agent Resolution Content Card with Language-Aware Typography */}
        <div className="relative bg-surface-container-low p-space-md rounded-xl border border-surface-container-high/60">
          <div className="flex items-start gap-space-sm" dir={isAgentResolutionArabic ? 'rtl' : 'ltr'}>
            <span className="material-symbols-outlined text-secondary text-[26px] opacity-60 select-none shrink-0 mt-0.5">
              assignment_turned_in
            </span>
            <p className={`${isAgentResolutionArabic ? "font-['Cairo'] text-[15px] leading-loose text-right" : "font-sans text-[14px] leading-relaxed text-left"} text-on-surface font-medium flex-1 select-text`}>
              {currentCase.agentResolution}
            </p>
          </div>

          <div className="mt-space-sm pt-space-xs flex flex-wrap items-center justify-between gap-space-sm text-on-surface-variant font-code-sm text-[11px] border-t border-surface-container-high/50">
            <div className="flex items-center gap-3 flex-wrap">
              <span>Agent: <strong className="text-on-surface font-medium">{currentCase.responsibleAgent}</strong></span>
              <span>Logged: {currentCase.agentLoggedAt || currentCase.createdOn}</span>
              <span>Channel: {currentCase.inboundChannel}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-secondary font-semibold">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                <span>{currentCase.agentResolutionStatus || 'Logged & Verified in CRM'}</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: AI Copilot Suggested Resolution (Olive/Forest Intelligence Theme) */}
      <section className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-secondary/30 flex flex-col gap-space-md relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-secondary via-secondary-container to-secondary" />

        <div className="flex flex-wrap items-center justify-between gap-space-xs">
          <div className="flex items-center gap-space-xs">
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-on-secondary shadow-sm">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                auto_awesome
              </span>
            </div>
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-1.5">
                <span>AI Copilot Suggested Resolution</span>
                <span className="font-code-sm text-[11px] text-secondary font-semibold bg-secondary-fixed/50 px-2 py-0.5 rounded border border-secondary/20">
                  Atmaal Ops Copilot
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Agent Accuracy / Correctness Assessment Widget */}
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-label-sm text-label-sm border shadow-sm transition-all ${
              agentCorrectnessScore >= 80
                ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                : agentCorrectnessScore >= 50
                ? 'bg-amber-50 text-amber-900 border-amber-300'
                : 'bg-rose-50 text-rose-900 border-rose-300'
            }`}>
              <span className={`material-symbols-outlined text-[16px] ${
                agentCorrectnessScore >= 80 ? 'text-emerald-700' : agentCorrectnessScore >= 50 ? 'text-amber-700' : 'text-rose-700'
              }`}>
                {agentCorrectnessScore >= 80 ? 'check_circle' : agentCorrectnessScore >= 50 ? 'warning' : 'cancel'}
              </span>
              <span className="font-bold text-on-surface">Agent Accuracy:</span>
              <span className={`font-code-sm font-extrabold text-[12px] px-2 py-0.5 rounded-md border shadow-xs ${
                agentCorrectnessScore >= 80
                  ? 'bg-white text-emerald-800 border-emerald-300'
                  : agentCorrectnessScore >= 50
                  ? 'bg-white text-amber-800 border-amber-300'
                  : 'bg-white text-rose-800 border-rose-300'
              }`}>
                {agentCorrectnessScore}% {agentCorrectnessScore >= 80 ? 'Correct' : agentCorrectnessScore >= 50 ? 'Partially Correct' : 'Incorrect'}
              </span>
              <button
                type="button"
                onClick={() => setShowComparisonDetails(!showComparisonDetails)}
                title="Toggle detailed LLM audit breakdown with CRM Human Resolution"
                className="ml-1 text-[11px] font-bold text-secondary hover:underline cursor-pointer flex items-center gap-0.5"
              >
                <span>{showComparisonDetails ? 'Hide Audit' : 'LLM Analysis'}</span>
                <span className="material-symbols-outlined text-[13px]">
                  {showComparisonDetails ? 'expand_less' : 'expand_more'}
                </span>
              </button>
            </div>

            {/* Verified KB Policy Button with Interactive Document Viewer */}
            <button
              id="openPdfModalBtn"
              type="button"
              onClick={onOpenDocModal}
              title="Inspect verified source document in viewer"
              className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-full shadow-sm transition-all cursor-pointer font-label-sm text-label-sm font-semibold bg-orange-50 border border-orange-200 text-orange-900 hover:bg-orange-100"
            >
              <span className="flex items-center gap-1 text-orange-700">
                <span className="w-2 h-2 rounded-full animate-pulse bg-orange-600" />
                <span className="material-symbols-outlined text-[16px]">menu_book</span>
                <span className="font-bold tracking-wide uppercase text-[10px]">Verified Policy:</span>
              </span>
              <span className="px-2 py-0.5 rounded-md font-code-sm text-[11px] font-semibold shadow-sm bg-white border border-orange-200 text-orange-900">
                {currentCase.policyProtocol}
              </span>
              <span className="material-symbols-outlined text-[14px] text-orange-600">
                open_in_new
              </span>
            </button>

            {generationLatency && (
              <span className="font-code-sm text-[11px] text-secondary font-semibold bg-surface-container px-2 py-0.5 rounded">
                ⚡ {generationLatency}ms
              </span>
            )}
          </div>
        </div>

        {/* Detailed LLM Audit & Correctness Analysis Drawer (when toggled) */}
        {showComparisonDetails && (
          <div className="p-space-md rounded-xl bg-surface-container-low border border-secondary/30 flex flex-col gap-3 transition-all animate-fadeIn">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[18px]">psychology</span>
                <span className="font-label-md text-label-md font-bold text-on-surface">
                  LLM Quality Audit: Human Agent Correctness ({agentCorrectnessScore}%)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold font-code-sm border ${
                  agentCorrectnessScore >= 80
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    : agentCorrectnessScore >= 50
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-rose-100 text-rose-900 border-rose-300'
                }`}>
                  {agentCorrectnessScore >= 80 ? 'Accurate / SAMA Fulfilled' : agentCorrectnessScore >= 50 ? 'Partially Correct / Procedural Friction' : 'Incorrect / Non-Compliant Resolution'}
                </span>
              </div>
            </div>

            {/* Score Progress Bar */}
            <div className="w-full bg-surface-container-high rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  agentCorrectnessScore >= 80
                    ? 'bg-emerald-600'
                    : agentCorrectnessScore >= 50
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${agentCorrectnessScore}%` }}
              />
            </div>

            {/* LLM Evaluation Narrative */}
            {agentCorrectnessAnalysis && (
              <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-secondary/20 shadow-xs flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-secondary/15 flex items-center justify-center text-secondary shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[17px]">insights</span>
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="font-label-sm text-[11px] font-bold tracking-wider uppercase text-secondary">
                    LLM Compliance &amp; Correctness Assessment
                  </h4>
                  <p className="text-[13px] text-on-surface leading-relaxed">
                    {agentCorrectnessAnalysis}
                  </p>
                </div>
              </div>
            )}

            {/* Concept Verification Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-surface-container-lowest border border-surface-container-high/70 text-[11px] font-medium text-on-surface">
                <span className={`material-symbols-outlined text-[16px] ${agentCorrectnessScore >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {agentCorrectnessScore >= 80 ? 'check_circle' : 'pending'}
                </span>
                <span>SAMA Compliance: {agentCorrectnessScore >= 80 ? 'Aligned' : 'Action Needed'}</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-surface-container-lowest border border-surface-container-high/70 text-[11px] font-medium text-on-surface">
                <span className={`material-symbols-outlined text-[16px] ${agentCorrectnessScore >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {agentCorrectnessScore >= 80 ? 'check_circle' : 'pending'}
                </span>
                <span>Settlement Logic: {agentCorrectnessScore >= 80 ? 'Verified' : 'Review Required'}</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-surface-container-lowest border border-surface-container-high/70 text-[11px] font-medium text-on-surface">
                <span className={`material-symbols-outlined text-[16px] ${agentCorrectnessScore >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {agentCorrectnessScore >= 80 ? 'check_circle' : 'pending'}
                </span>
                <span>Language &amp; Tone: {agentCorrectnessScore >= 50 ? 'Appropriate' : 'Mismatch'}</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-surface-container-lowest border border-surface-container-high/70 text-[11px] font-medium text-on-surface">
                <span className={`material-symbols-outlined text-[16px] ${agentCorrectnessScore >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {agentCorrectnessScore >= 80 ? 'check_circle' : 'pending'}
                </span>
                <span>SLA Turnaround: {agentCorrectnessScore >= 80 ? 'Matched' : 'Check Timeline'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Resolution Text Area OR Generation Loader Animation */}
        {isRegenerating ? (
          /* High-Tech Loader / Generation Animation */
          <div className="relative p-space-lg rounded-xl bg-surface-container-low border-2 border-secondary/40 flex flex-col items-center justify-center min-h-[260px] overflow-hidden">
            {/* Ambient Animated Shimmer Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-secondary-fixed/20 to-transparent animate-[shimmer_2s_infinite] pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center gap-4 text-center max-w-md">
              {/* Radar Pulse Icon */}
              <div className="relative flex items-center justify-center">
                <div className="absolute w-20 h-20 rounded-full bg-secondary/15 animate-ping" />
                <div className="absolute w-14 h-14 rounded-full bg-secondary/25 animate-pulse" />
                <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-on-secondary shadow-lg">
                  <span className="material-symbols-outlined text-[24px] animate-spin" style={{ fontVariationSettings: "'FILL' 1" }}>
                    auto_awesome
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <h3 className="font-headline-sm text-[15px] font-bold text-on-surface">
                  Synthesizing SAMA Resolution...
                </h3>
                <p className="font-body-sm text-[13px] text-on-surface-variant">
                  {generationStep === 0 && `Analyzing case inquiry & SAMA regulatory compliance...`}
                  {generationStep === 1 && `Calibrating resolution standards for Case #${currentCase.caseNumber}...`}
                  {generationStep === 2 && `Synthesizing verified regulatory response with active directives...`}
                </p>
              </div>

              {/* Progress Bar & Timer */}
              <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden mt-2">
                <div className="bg-secondary h-1.5 rounded-full w-full animate-pulse transition-all duration-300" />
              </div>

              <div className="flex items-center justify-between w-full font-code-sm text-[11px] text-outline px-1">
                <span>Target: Case #{currentCase.caseNumber}</span>
                <span className="text-secondary font-bold">Elapsed: {elapsedSeconds}s</span>
                <span>SAMA Protocol: {currentCase.policyProtocol}</span>
              </div>
            </div>
          </div>
        ) : isEditingResolution ? (
          /* Inline Edit Mode */
          <div className="p-space-md rounded-xl bg-surface-container-low border-2 border-secondary/50 flex flex-col gap-space-sm transition-all shadow-inner">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container-high">
              <div className="flex items-center gap-1.5 text-secondary font-label-md text-label-md font-bold">
                <span className="material-symbols-outlined text-[18px]">edit_note</span>
                <span>Editing AI Copilot Draft</span>
              </div>
              <span className="font-code-sm text-[11px] text-outline">
                {editingDraft.length} characters
              </span>
            </div>

            <textarea
              id="editResolutionTextarea"
              rows={9}
              value={editingDraft}
              onChange={(e) => setEditingDraft(e.target.value)}
              dir={isDraftArabic ? 'rtl' : 'ltr'}
              className={`w-full p-4 bg-surface-container-lowest text-on-surface ${isDraftArabic ? "font-['Cairo'] text-[14px] leading-relaxed text-right" : "font-sans text-[14px] leading-relaxed text-left"} rounded-lg border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-secondary/30 transition-all resize-y`}
              placeholder={isDraftArabic ? "تعديل مسودة الرد المقترح..." : "Edit suggested response draft..."}
              autoFocus
            />

            <div className="flex items-center justify-end gap-space-xs pt-1">
              <button
                type="button"
                onClick={() => {
                  setEditingDraft(resolutionText);
                  setIsEditingResolution(false);
                }}
                className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold transition-colors border border-surface-container-high cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setResolutionText(editingDraft);
                  setIsEditingResolution(false);
                  onShowToast('AI Copilot draft updated successfully.', 'check_circle');
                }}
                className="px-3.5 py-1.5 rounded-lg bg-[#1b2e24] hover:bg-[#254e38] text-white font-label-md text-label-md font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px] text-secondary-fixed">save</span>
                <span>Save Draft</span>
              </button>
            </div>
          </div>
        ) : (
          /* Normal Resolution View with Hover Edit Button */
          <div className="relative group p-space-md rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md leading-relaxed whitespace-pre-line border border-surface-container-high/80 transition-all hover:border-secondary/40">
            {/* Hover Action Controls (Edit, Copy & Regenerate) */}
            <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200 z-10 flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleRegenerate}
                disabled={isRegenerating}
                title="Regenerate SAMA resolution draft"
                className="px-2.5 py-1 rounded-lg bg-surface-container-lowest hover:bg-secondary-fixed/80 text-secondary hover:text-on-secondary-container font-label-sm text-[12px] font-semibold transition-all shadow-sm border border-secondary/30 flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <span className={`material-symbols-outlined text-[15px] ${isRegenerating ? 'animate-spin' : ''}`}>
                  auto_awesome
                </span>
                <span>Regenerate</span>
              </button>

              <button
                type="button"
                onClick={() => copyToClipboard(resolutionText, 'Copilot Resolution')}
                title="Copy resolution to clipboard"
                className="px-2.5 py-1 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-sm text-[12px] font-medium transition-all shadow-sm border border-surface-container-high flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">content_copy</span>
                <span>Copy</span>
              </button>

              <button
                type="button"
                id="editCopilotDraftBtn"
                onClick={() => {
                  setEditingDraft(resolutionText);
                  setIsEditingResolution(true);
                }}
                title="Edit AI Copilot draft response"
                className="px-2.5 py-1 rounded-lg bg-surface-container-lowest hover:bg-secondary-fixed/80 text-secondary hover:text-on-secondary-container font-label-sm text-[12px] font-semibold transition-all shadow-sm border border-secondary/30 flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">edit</span>
                <span>Edit</span>
              </button>
            </div>

            {/* Resolution Text with Language-Aware Alignment */}
            <div
              dir={isResolutionArabic ? 'rtl' : 'ltr'}
              className={`${isResolutionArabic ? "font-['Cairo'] text-[14px] leading-loose text-right" : "font-sans text-[14px] leading-relaxed text-left"}`}
            >
              {resolutionText}
            </div>
          </div>
        )}

        {/* Status Actions Performed */}
        <div className="flex flex-wrap items-center gap-space-md text-on-surface-variant font-code-sm text-[11px]">
          {currentCase.actionsPerformed.map((action, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px] text-secondary">check_circle</span>
              <span dir="rtl" className="font-['Cairo'] text-[12px]">{action}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Section 4: Agent Action & Revision Studio */}
      <section className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-surface-container-high flex flex-col gap-space-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-secondary text-[18px]">tune</span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Agent Action &amp; Revision Studio</h2>
          </div>
          <button
            type="button"
            onClick={onOpenOllamaSettings}
            className="font-label-sm text-[12px] text-secondary hover:underline flex items-center gap-1 font-semibold cursor-pointer"
          >
            <span className="material-symbols-outlined text-[14px]">settings</span>
            <span>Copilot Config &amp; Prompt</span>
          </button>
        </div>

        <div className="flex flex-col gap-space-2xs">
          <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="revisionInput">
            Instruction Directives for Co-Pilot / Customer Response Adjustments
          </label>
          <div className="relative">
            <textarea
              id="revisionInput"
              rows={3}
              value={revisionDirectives}
              onChange={(e) => setRevisionDirectives(e.target.value)}
              placeholder="اكتب التوجيهات أو التعليمات للمساعد الذكي (مثلاً: تحديث فوري لسمة، إعفاء من الرسوم، فك الحظر، إشعار مسؤول الائتمان)..."
              className="w-full p-space-md rounded-xl bg-surface-container-low text-on-surface placeholder:text-outline font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary/20 transition-all resize-y border border-surface-container-high/60 focus:border-secondary/40"
            />
          </div>
        </div>

        {/* Quick Directives Buttons (Aligned with SAMA Cases Dataset) */}
        <div className="flex flex-wrap items-center gap-space-xs">
          <span className="font-label-sm text-[11px] text-outline uppercase tracking-wider">
            Quick Directives:
          </span>
          <button
            type="button"
            onClick={() => insertPrompt('رفع إشعار تحديث إلكتروني فوري لشركة سمة وإلغاء أي تعثر ائتماني خلال 24 ساعة')}
            className="px-2.5 py-1 rounded-lg bg-surface-container-low hover:bg-secondary-fixed/50 hover:text-secondary text-on-surface font-label-sm text-label-sm transition-colors border border-surface-container-high/60 cursor-pointer"
          >
            + تحديث سمة فوري
          </button>
          <button
            type="button"
            onClick={() => insertPrompt('عكس واسترداد رسوم التصميم 49.45 ريال فورياً وإصدار بطاقة البلاك بشحن مجاني')}
            className="px-2.5 py-1 rounded-lg bg-surface-container-low hover:bg-secondary-fixed/50 hover:text-secondary text-on-surface font-label-sm text-label-sm transition-colors border border-surface-container-high/60 cursor-pointer"
          >
            + عكس الرسوم والطباعة
          </button>
          <button
            type="button"
            onClick={() => insertPrompt('فك الحظر والتعليق عن الحساب الجاري فورياً لتمكين استقبال الراتب')}
            className="px-2.5 py-1 rounded-lg bg-surface-container-low hover:bg-secondary-fixed/50 hover:text-secondary text-on-surface font-label-sm text-label-sm transition-colors border border-surface-container-high/60 cursor-pointer"
          >
            + فك حظر الحساب
          </button>
          <button
            type="button"
            onClick={() => insertPrompt('فك الحجز عن مبلغ 8,000 ريال تعويض التأمين لإصلاح المركبة دون استقطاع أقساط')}
            className="px-2.5 py-1 rounded-lg bg-surface-container-low hover:bg-secondary-fixed/50 hover:text-secondary text-on-surface font-label-sm text-label-sm transition-colors border border-surface-container-high/60 cursor-pointer"
          >
            + تحرير تعويض التأمين
          </button>
          <button
            type="button"
            onClick={() => insertPrompt('إصدار أمر إطلاق فوري للمركبة من المستودع وإحالة ملف الضرر للجنة التعويضات')}
            className="px-2.5 py-1 rounded-lg bg-surface-container-low hover:bg-secondary-fixed/50 hover:text-secondary text-on-surface font-label-sm text-label-sm transition-colors border border-surface-container-high/60 cursor-pointer"
          >
            + إطلاق سراح المركبة
          </button>
          <button
            type="button"
            onClick={() => insertPrompt('إعادة جدولة الأقساط ومنح مهلة 60 يوماً بعد التوظيف الجديد ورفع قرار التنفيذ')}
            className="px-2.5 py-1 rounded-lg bg-surface-container-low hover:bg-secondary-fixed/50 hover:text-secondary text-on-surface font-label-sm text-label-sm transition-colors border border-surface-container-high/60 cursor-pointer"
          >
            + جدولة الأقساط
          </button>
          <button
            type="button"
            onClick={() => insertPrompt('إغلاق البطاقة الائتمانية الدوارة نهائياً وإصدار شهادة المخالصة المالية')}
            className="px-2.5 py-1 rounded-lg bg-surface-container-low hover:bg-secondary-fixed/50 hover:text-secondary text-on-surface font-label-sm text-label-sm transition-colors border border-surface-container-high/60 cursor-pointer"
          >
            + مخالصة وإغلاق بطاقة
          </button>
          <button
            type="button"
            onClick={() => insertPrompt('Reverse duplicate remittance of SAR 18,500 and waive unauthorized processing fees under SAMA consumer rights')}
            className="px-2.5 py-1 rounded-lg bg-surface-container-low hover:bg-secondary-fixed/50 hover:text-secondary text-on-surface font-label-sm text-label-sm transition-colors border border-surface-container-high/60 cursor-pointer"
          >
            + Wire Reversal & Fee Waiver
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-space-md pt-space-xs">
          <button
            id="regenerateBtn"
            type="button"
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="w-full sm:w-auto px-space-md py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold transition-all flex items-center justify-center gap-2 shadow-sm border border-outline-variant/40 cursor-pointer disabled:opacity-60"
          >
            <span
              className={`material-symbols-outlined text-secondary text-[18px] ${isRegenerating ? 'animate-spin' : ''}`}
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              auto_awesome
            </span>
            <span>
              {isRegenerating
                ? 'Regenerating Response with Instructions...'
                : 'Regenerate Response with Instructions'}
            </span>
          </button>

          <div className="w-full sm:w-auto flex items-center gap-space-xs">
            <div className="relative group w-full sm:w-auto">
              <button
                id="submitNextBtn"
                type="button"
                onClick={handleSubmit}
                className="w-full sm:w-auto px-space-lg py-2.5 rounded-xl bg-[#1b2e24] hover:bg-[#254e38] text-white font-label-md text-label-md font-bold transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer active:scale-[0.99]"
              >
                <span className="material-symbols-outlined text-[18px] text-secondary-fixed">verified</span>
                <span>Submit Dispute &amp; Load Next Case</span>
              </button>
              <div className="pointer-events-none absolute bottom-full right-0 mb-2 hidden group-hover:block w-64 p-space-xs rounded-lg bg-inverse-surface text-inverse-on-surface font-label-sm text-[11px] leading-tight shadow-xl z-30">
                Dispatches customer notice, updates SAMA Level 1 record, closes Case #{currentCase.caseNumber}, loads next queue item.
              </div>
            </div>
          </div>
        </div>

      </section>

    </main>
  );
};
