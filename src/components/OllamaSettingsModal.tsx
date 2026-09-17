import React, { useState, useEffect } from 'react';
import { DEFAULT_SYSTEM_PROMPT, OLLAMA_CONFIG } from '../config/systemPrompt';

interface OllamaSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  systemPrompt: string;
  onSaveSystemPrompt: (prompt: string) => void;
  ollamaUrl: string;
  onSaveOllamaUrl: (url: string) => void;
  selectedModel: string;
  onSaveSelectedModel: (model: string) => void;
  onShowToast: (message: string, icon?: string) => void;
}

export const OllamaSettingsModal: React.FC<OllamaSettingsModalProps> = ({
  isOpen,
  onClose,
  systemPrompt,
  onSaveSystemPrompt,
  ollamaUrl,
  onSaveOllamaUrl,
  selectedModel,
  onSaveSelectedModel,
  onShowToast,
}) => {
  const [localUrl, setLocalUrl] = useState(ollamaUrl || OLLAMA_CONFIG.defaultBaseUrl);
  const [localModel, setLocalModel] = useState(selectedModel || OLLAMA_CONFIG.defaultModel);
  const [localPrompt, setLocalPrompt] = useState(systemPrompt || DEFAULT_SYSTEM_PROMPT);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    connected: boolean;
    mode?: 'browser_direct' | 'server_bridge';
    models?: string[];
    message?: string;
  } | null>(null);
  const [testGenerationOutput, setTestGenerationOutput] = useState<string>('');
  const [isGeneratingTest, setIsGeneratingTest] = useState(false);

  useEffect(() => {
    setLocalUrl(ollamaUrl || OLLAMA_CONFIG.defaultBaseUrl);
    setLocalModel(selectedModel || OLLAMA_CONFIG.defaultModel);
    setLocalPrompt(systemPrompt || DEFAULT_SYSTEM_PROMPT);
  }, [isOpen, ollamaUrl, selectedModel, systemPrompt]);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    setTestGenerationOutput('');

    // 1. First test direct browser connection (since Ollama is usually running locally on the user's computer)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const directRes = await fetch(`${localUrl.replace(/\/$/, '')}/api/tags`, {
        method: 'GET',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (directRes.ok) {
        const data = await directRes.json();
        const modelNames = (data.models || []).map((m: any) => m.name || m.model);
        setTestResult({
          connected: true,
          mode: 'browser_direct',
          models: modelNames,
          message: `Connected directly from browser to local Ollama! Found ${modelNames.length} models.`,
        });
        if (modelNames.length > 0 && !modelNames.includes(localModel)) {
          setLocalModel(modelNames[0]);
        }
        setIsTesting(false);
        return;
      }
    } catch {
      // Direct browser connection failed (e.g. CORS or not running directly on this URL)
    }

    // 2. Test server-side bridge (in case user provided a tunnel, LAN IP, or container route)
    try {
      const res = await fetch(`/api/ollama/status?baseUrl=${encodeURIComponent(localUrl)}`);
      const data = await res.json();
      if (data.connected) {
        setTestResult({
          connected: true,
          mode: 'server_bridge',
          models: data.models,
          message: `Connected via Server Bridge to Ollama! Found ${data.models?.length || 0} models.`,
        });
        if (data.models && data.models.length > 0 && !data.models.includes(localModel)) {
          setLocalModel(data.models[0]);
        }
      } else {
        setTestResult({
          connected: false,
          message: `Could not connect to Ollama at ${localUrl}.`,
        });
      }
    } catch {
      setTestResult({
        connected: false,
        message: `Could not reach Ollama at ${localUrl}.`,
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleRunQuickTestGeneration = async () => {
    setIsGeneratingTest(true);
    setTestGenerationOutput('');
    try {
      // Try direct browser first
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      let text = '';

      try {
        const directResp = await fetch(`${localUrl.replace(/\/$/, '')}/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: localModel,
            prompt: 'Say: "Atmaal Ops Copilot connected to local Ollama successfully!" in 1 sentence.',
            stream: false,
          }),
          signal: controller.signal,
        });
        if (directResp.ok) {
          const directData = await directResp.json();
          text = directData.response || '';
        }
      } catch {
        // Fallback to server endpoint
        const serverResp = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: localModel,
            prompt: 'Say: "Atmaal Ops Copilot connected to local Ollama successfully!" in 1 sentence.',
            baseUrl: localUrl,
          }),
        });
        const serverData = await serverResp.json();
        text = serverData.response || serverData.suggestedResponse || '';
      }
      clearTimeout(timeoutId);

      setTestGenerationOutput(text.trim() || 'Received response from model.');
    } catch (err: any) {
      setTestGenerationOutput(`Test generation failed: ${err.message || 'Error communicating with Ollama'}`);
    } finally {
      setIsGeneratingTest(false);
    }
  };

  const handleSave = () => {
    onSaveOllamaUrl(localUrl);
    onSaveSelectedModel(localModel);
    onSaveSystemPrompt(localPrompt);
    onShowToast('Ollama configuration & system prompt saved successfully!', 'check_circle');
    onClose();
  };

  const handleResetPrompt = () => {
    setLocalPrompt(DEFAULT_SYSTEM_PROMPT);
    onShowToast('Reset system prompt to default SAMA guidelines.', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-surface-container-lowest rounded-2xl shadow-2xl border border-surface-container-high overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-surface-container-high flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-on-secondary shadow-sm">
              <span className="material-symbols-outlined text-[20px]">smart_toy</span>
            </div>
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface">
                Copilot Engine &amp; System Prompt
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Configure your local model connection and customize the AI Copilot persona
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-5">
          
          {/* Connection Settings */}
          <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container-high flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="font-label-md text-label-md font-bold text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-secondary">lan</span>
                <span>Local Inference Endpoint</span>
              </h3>
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting}
                className="px-3 py-1 rounded-lg bg-surface-container hover:bg-secondary-fixed/50 hover:text-secondary text-on-surface font-label-sm text-label-sm font-semibold transition-all border border-surface-container-high flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <span className={`material-symbols-outlined text-[15px] ${isTesting ? 'animate-spin text-secondary' : 'text-secondary'}`}>
                  {isTesting ? 'sync' : 'network_check'}
                </span>
                <span>{isTesting ? 'Checking...' : 'Test Connection'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-label-sm text-[11px] text-outline uppercase tracking-wider">
                    Base URL
                  </label>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setLocalUrl('http://127.0.0.1:11434')}
                      className="text-[10px] text-secondary hover:underline cursor-pointer"
                    >
                      127.0.0.1
                    </button>
                    <span className="text-outline text-[10px]">|</span>
                    <button
                      type="button"
                      onClick={() => setLocalUrl('http://localhost:11434')}
                      className="text-[10px] text-secondary hover:underline cursor-pointer"
                    >
                      localhost
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  value={localUrl}
                  onChange={(e) => setLocalUrl(e.target.value)}
                  placeholder="http://127.0.0.1:11434"
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-lowest text-on-surface font-code-sm text-[12px] border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-secondary/30"
                />
              </div>
              <div>
                <label className="block font-label-sm text-[11px] text-outline uppercase tracking-wider mb-1">
                  Model Name (e.g., llama3, mistral, qwen2.5)
                </label>
                <input
                  type="text"
                  value={localModel}
                  onChange={(e) => setLocalModel(e.target.value)}
                  placeholder="llama3"
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-lowest text-on-surface font-code-sm text-[12px] border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-secondary/30"
                />
              </div>
            </div>

            {testResult && (
              <div className={`p-3 rounded-xl border text-body-sm text-[12px] flex items-start gap-2.5 ${
                testResult.connected
                  ? 'bg-secondary-fixed/40 border-secondary/30 text-on-secondary-container'
                  : 'bg-error-container/30 border-error/30 text-on-error-container'
              }`}>
                <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">
                  {testResult.connected ? 'check_circle' : 'info'}
                </span>
                <div className="flex-1 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{testResult.message}</p>
                    {testResult.mode && (
                      <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-container font-code-sm text-[10px] font-bold">
                        {testResult.mode === 'browser_direct' ? '⚡ Direct Browser Link' : '🌐 Server Bridge'}
                      </span>
                    )}
                  </div>

                  {testResult.models && testResult.models.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1 mt-1">
                      <span className="text-[11px] text-outline">Detected models:</span>
                      {testResult.models.map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setLocalModel(m)}
                          className={`px-2 py-0.5 rounded font-code-sm text-[11px] transition-all cursor-pointer ${
                            localModel === m
                              ? 'bg-secondary text-on-secondary font-bold shadow-xs'
                              : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  )}

                  {testResult.connected && (
                    <div className="pt-2 border-t border-secondary/20 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={handleRunQuickTestGeneration}
                        disabled={isGeneratingTest}
                        className="px-3 py-1 rounded-lg bg-secondary text-on-secondary font-label-sm text-[11px] font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer disabled:opacity-50"
                      >
                        <span className={`material-symbols-outlined text-[13px] ${isGeneratingTest ? 'animate-spin' : ''}`}>
                          {isGeneratingTest ? 'sync' : 'play_arrow'}
                        </span>
                        <span>{isGeneratingTest ? 'Running LLM test...' : `Test ${localModel} Prompt`}</span>
                      </button>
                      <span className="text-[10px] text-outline">Sends a 1-sentence prompt to your local model</span>
                    </div>
                  )}

                  {testGenerationOutput && (
                    <div className="p-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-code-sm text-[11px] border border-secondary/30 mt-1">
                      <span className="text-secondary font-bold block mb-0.5">Model Output:</span>
                      {testGenerationOutput}
                    </div>
                  )}

                  {!testResult.connected && (
                    <div className="mt-1 flex flex-col gap-1.5 text-[11px] text-on-surface-variant bg-surface-container-lowest p-3 rounded-lg border border-surface-container-high">
                      <span className="font-bold text-on-surface">To connect your local Ollama instance:</span>
                      <p>
                        1. Start Ollama with CORS allowed (so your browser can communicate with your local machine):
                      </p>
                      <div className="flex items-center justify-between p-1.5 bg-surface-container rounded font-mono text-[11px] text-on-surface">
                        <code>OLLAMA_ORIGINS="*" ollama serve</code>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText('OLLAMA_ORIGINS="*" ollama serve');
                            onShowToast('Copied CORS command to clipboard', 'content_copy');
                          }}
                          className="text-secondary text-[11px] font-bold hover:underline px-1 cursor-pointer"
                        >
                          Copy
                        </button>
                      </div>
                      <p className="text-[10px] text-outline">
                        (On Windows PowerShell: <code>$env:OLLAMA_ORIGINS="*" ; ollama serve</code>)
                      </p>
                      <p>
                        2. Ensure your model is downloaded: <code>ollama pull {localModel}</code>
                      </p>
                      <p>
                        3. Then click <strong>"Test Connection"</strong> above.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* System Prompt Editor */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="font-label-md text-label-md font-bold text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-secondary">psychology</span>
                <span>System Prompt (Copilot Directive &amp; SAMA Guidelines)</span>
              </label>
              <button
                type="button"
                onClick={handleResetPrompt}
                className="text-[11px] text-secondary hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">restart_alt</span>
                <span>Reset to Default</span>
              </button>
            </div>
            <p className="font-body-sm text-[12px] text-outline">
              This prompt instructs the copilot on tone, SAMA compliance, structure, and Arabic output. You can edit it here or in <code className="bg-surface-container-low px-1 py-0.5 rounded">src/config/systemPrompt.ts</code>.
            </p>
            <textarea
              rows={9}
              value={localPrompt}
              onChange={(e) => setLocalPrompt(e.target.value)}
              className="w-full p-3 rounded-xl bg-surface-container-low text-on-surface font-mono text-[12px] leading-relaxed border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-secondary/30 resize-y"
              placeholder="Enter system prompt instructions..."
            />
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-surface-container-high bg-surface-container-low flex items-center justify-between">
          <span className="font-code-sm text-[11px] text-outline">
            Endpoint: {localUrl} • Model: {localModel}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-[#1b2e24] hover:bg-[#254e38] text-white font-label-md text-label-md font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-secondary-fixed">save</span>
              <span>Save &amp; Apply</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
