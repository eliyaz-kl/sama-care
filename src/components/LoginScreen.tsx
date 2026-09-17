import React, { useState } from 'react';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  // Prefilled credentials as requested, with placeholders removed
  const [email, setEmail] = useState('ahmed.awaad@atmaal.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [isGridAnimated, setIsGridAnimated] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
    }, 450);
  };

  return (
    <div className="relative w-full overflow-hidden flex flex-col items-center justify-center px-space-md py-space-xl md:py-space-3xl min-h-screen bg-surface font-body-md text-on-surface antialiased">
      {/* Fixed Clean Architectural Grid with LLM Neural Waves and Transformer Attention Streams */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Stationary SVG Architectural Coordinate Grid - Pristine lines without dots */}
        <svg
          className="w-full h-full text-secondary/30"
          height="100%"
          width="100%"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern height="44" id="clean-tech-grid" patternUnits="userSpaceOnUse" width="44">
              {/* Fine architectural coordinate lines */}
              <path d="M 44 0 L 0 0 0 44" fill="none" stroke="currentColor" strokeOpacity="0.28" strokeWidth="1" />
            </pattern>
          </defs>
          <rect fill="url(#clean-tech-grid)" height="100%" width="100%" />
        </svg>

        {isGridAnimated && (
          <>
            {/* 1. Transformer Multi-Head Attention Expansion Waves */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[580px] h-[580px] pointer-events-none">
              <div className="absolute inset-0 rounded-full border border-secondary/35 bg-radial from-secondary/15 via-secondary/5 to-transparent animate-neural-wave-1 pointer-events-none" />
              <div className="absolute inset-0 rounded-full border border-secondary/25 bg-radial from-secondary/10 via-secondary/5 to-transparent animate-neural-wave-2 pointer-events-none" />
            </div>

            {/* 2. Token Stream Context Beam (Forward Pass) */}
            <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/70 to-transparent shadow-[0_0_12px_rgba(46,125,82,0.8)] animate-token-stream-y pointer-events-none" />

            {/* 3. Transformer Attention Weight Scan (Layer Propagation) */}
            <div className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-secondary/55 to-transparent shadow-[0_0_10px_rgba(46,125,82,0.6)] animate-attention-stream-x pointer-events-none" />

            {/* 4. Ambient LLM Token & Inference Chips floating along grid lines */}
            <div className="absolute top-[18%] left-[12%] hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-container-low/70 border border-secondary/20 text-secondary font-code-sm text-[10px] animate-token-float">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>tokenize(&quot;SAMA_DISPUTE_P1&quot;)</span>
            </div>

            <div className="absolute top-[32%] right-[12%] hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-container-low/70 border border-secondary/20 text-secondary font-code-sm text-[10px] animate-token-float" style={{ animationDelay: '2s' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
              <span>attention_heads: 32 // kv_cache: 8k</span>
            </div>

            <div className="absolute bottom-[28%] left-[10%] hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-container-low/70 border border-secondary/20 text-secondary font-code-sm text-[10px] animate-token-float" style={{ animationDelay: '3.5s' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span>sentiment_polarity: -0.84 (Urgent)</span>
            </div>

            <div className="absolute bottom-[22%] right-[14%] hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-container-low/70 border border-secondary/20 text-secondary font-code-sm text-[10px] animate-token-float" style={{ animationDelay: '1.2s' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
              <span>inference_latency: 34ms</span>
            </div>

            {/* 5. LLM Project Telemetry HUD (Atmaal Fin-LLM Node) */}
            <div className="absolute top-7 left-8 text-secondary/70 font-code-sm text-[11px] select-none tracking-wider hidden lg:block space-y-0.5">
              <div className="flex items-center gap-1.5 text-secondary font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                <span>ATMAAL FIN-LLM // v2.4</span>
              </div>
              <div className="text-[10px] text-on-surface-variant/70">
                RUNTIME: ON-PREMISE AIR-GAPPED
              </div>
              <div className="text-[10px] text-on-surface-variant/70">
                INFERENCE NODE • SECURE HOST READY
              </div>
            </div>
          </>
        )}
      </div>

      {/* Atmospheric Ambient Glows */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[380px] bg-gradient-to-b from-secondary/15 via-secondary-container/15 to-transparent blur-3xl pointer-events-none rounded-full animate-pulse-glow" />
      <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[600px] h-[340px] bg-tertiary-fixed/15 blur-3xl pointer-events-none rounded-full animate-pulse-glow" />

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-[460px]">
        <div className="bg-surface-container-lowest rounded-2xl shadow-xl p-space-xl sm:p-space-2xl backdrop-blur-md border border-outline-variant/40">

          {/* Header with Larger Inside Logo & Singular Title */}
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-space-md">
              {/* Distinctive Modern FinTech Logo Icon with Enriched Inside Presence */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary via-[#163324] to-secondary flex items-center justify-center shadow-lg border border-secondary/35 relative group">
                <div className="absolute inset-0 rounded-2xl bg-secondary/20 blur-xs" />
                {/* Enlarged inside token symbol */}
                <div className="relative flex items-center justify-center text-on-primary">
                  <span
                    className="material-symbols-outlined text-[38px] leading-none"
                    style={{ fontVariationSettings: "'FILL' 1, 'wght' 600" }}
                  >
                    token
                  </span>
                </div>
                {/* Micro accent badge */}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-xs border-2 border-surface-container-lowest">
                  <span className="material-symbols-outlined text-[13px]">bolt</span>
                </div>
              </div>
            </div>

            {/* Singular Clean Title (Removed duplicate badge) */}
            <h1 className="font-headline-md text-headline-md text-on-surface mb-1 font-bold tracking-tight">
              Atmaal Operations Copilot
            </h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              CUSTOMER CARE WORKBENCH
            </p>
          </div>

          {/* Login Form with Prefilled Credentials & Clean Inputs */}
          <form className="space-y-space-md mt-space-xl" onSubmit={handleSubmit}>
            <div>
              <label className="block font-label-md text-label-md text-on-surface font-medium mb-1.5" htmlFor="work-email">
                Work Email
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-secondary/70 text-[18px]">
                  alternate_email
                </span>
                <input
                  id="work-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-surface-container-low rounded-lg font-body-md text-body-md text-on-surface focus:bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-secondary/40 focus:border-secondary border border-transparent transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-label-md text-label-md text-on-surface font-medium" htmlFor="password-input">
                  Password
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Password reset link sent to enterprise account.');
                  }}
                  className="font-label-sm text-label-sm text-secondary hover:text-on-secondary-container hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-secondary/70 text-[18px]">
                  lock
                </span>
                <input
                  id="password-input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-surface-container-low rounded-lg font-body-md text-body-md text-on-surface focus:bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-secondary/40 focus:border-secondary border border-transparent transition-colors"
                />
                <button
                  id="toggle-password"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-on-surface-variant hover:text-secondary flex items-center justify-center transition-colors cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  <span className="material-symbols-outlined text-[18px]" id="toggle-icon">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Remember workstation */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberDevice}
                  onChange={(e) => setRememberDevice(e.target.checked)}
                  className="w-4 h-4 rounded border-outline-variant text-secondary focus:ring-secondary/30 accent-secondary"
                />
                <span className="font-body-sm text-[12px] text-on-surface-variant">
                  Remember this device
                </span>
              </label>

              <span className="font-code-sm text-[11px] text-secondary flex items-center gap-1 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                Enterprise SSO
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-space-md py-3 px-space-md rounded-xl bg-primary hover:bg-[#1b2e24] text-on-primary font-headline-sm text-headline-sm active:scale-[0.99] transition-all duration-150 flex items-center justify-center gap-space-xs shadow-md border border-secondary/30 cursor-pointer disabled:opacity-75"
            >
              <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
              <span className="material-symbols-outlined text-[20px]">
                {isLoading ? 'progress_activity' : 'arrow_forward'}
              </span>
            </button>
          </form>

          {/* Bottom Security & Tech Certifications with Atmaal Fin-LLM */}
          <div className="mt-space-lg pt-space-md bg-surface-container-low/70 border-t border-outline-variant/20 -mx-space-xl sm:-mx-space-2xl -mb-space-xl sm:-mb-space-2xl px-space-xl sm:px-space-2xl pb-space-lg rounded-b-2xl flex flex-wrap items-center justify-center gap-y-2 gap-x-space-md text-center">
            <div className="flex items-center gap-1.5 text-on-surface-variant">
              <span className="material-symbols-outlined text-[15px] text-secondary">
                psychology
              </span>
              <span className="font-label-sm text-label-sm font-semibold">Atmaal Fin-LLM</span>
            </div>
            <span className="text-outline-variant font-body-sm">•</span>
            <div className="flex items-center gap-1.5 text-on-surface-variant">
              <span className="material-symbols-outlined text-[15px] text-secondary">
                enhanced_encryption
              </span>
              <span className="font-label-sm text-label-sm">256-bit TLS/AES</span>
            </div>
            <span className="text-outline-variant font-body-sm">•</span>
            <div className="flex items-center gap-1.5 text-on-surface-variant">
              <span className="material-symbols-outlined text-[15px] text-secondary">
                lock
              </span>
              <span className="font-label-sm text-label-sm">ISO 27001</span>
            </div>
          </div>

        </div>
      </div>

      {/* Inference Grid Animation Toggle in Bottom Left (Accessibility & Control) */}
      <div className="fixed bottom-3 left-4 z-20 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsGridAnimated(!isGridAnimated)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-lowest/85 hover:bg-surface-container-lowest text-on-surface-variant hover:text-on-surface font-code-sm text-[11px] border border-outline-variant/40 shadow-xs backdrop-blur-xs transition-all cursor-pointer"
          title={isGridAnimated ? 'Pause neural inference animation' : 'Resume neural inference animation'}
        >
          <span className="material-symbols-outlined text-[14px] text-secondary">
            {isGridAnimated ? 'psychology' : 'motion_photos_paused'}
          </span>
          <span>Inference Grid: {isGridAnimated ? 'Active' : 'Paused'}</span>
        </button>
      </div>
    </div>
  );
};
