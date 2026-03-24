import React, { useEffect, useMemo, useState } from 'react';
import { Logo } from './Logo';

type IntroSplashProps = {
  onDone: () => void;
  durationMs?: number;
};

export const IntroSplash: React.FC<IntroSplashProps> = ({ onDone, durationMs = 6500 }) => {
  const [videoFailed, setVideoFailed] = useState(false);
  const [gifFailed, setGifFailed] = useState(false);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return false;
    }
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(onDone, prefersReducedMotion ? 900 : durationMs);
    return () => window.clearTimeout(timeout);
  }, [durationMs, onDone, prefersReducedMotion]);

  const showVideo = !prefersReducedMotion && !videoFailed;
  const showGif = !prefersReducedMotion && videoFailed && !gifFailed;
  const showFallback = prefersReducedMotion || (videoFailed && gifFailed);

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden bg-[#061024] text-white">
      <style>{`
        @keyframes zeroPulse { 0%,100% { transform: scale(1); opacity: .5; } 50% { transform: scale(1.12); opacity: 1; } }
        @keyframes zeroSweep { 0% { transform: translateX(-120%); } 100% { transform: translateX(120%); } }
        @keyframes zeroFloat { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-14px); } }
        @keyframes zeroGlow { 0%,100% { filter: drop-shadow(0 0 0 rgba(34,197,94,0)); } 50% { filter: drop-shadow(0 0 20px rgba(34,197,94,.7)); } }
      `}</style>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,.35),transparent_42%),radial-gradient(circle_at_80%_10%,rgba(34,197,94,.3),transparent_40%),radial-gradient(circle_at_50%_80%,rgba(14,165,233,.26),transparent_45%)]" />

      {showVideo && (
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-55"
          autoPlay
          muted
          playsInline
          preload="auto"
          onError={() => setVideoFailed(true)}
        >
          <source src="/intro.mp4" type="video/mp4" />
        </video>
      )}

      {showGif && (
        <img
          src="/intro.gif"
          alt="Zero intro"
          className="absolute inset-0 h-full w-full object-cover opacity-45"
          onError={() => setGifFailed(true)}
        />
      )}

      {showFallback && (
        <div className="absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/20" style={{ animation: 'zeroPulse 2.3s ease-in-out infinite' }} />
          <div className="absolute left-1/2 top-1/2 h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-green-400/30" style={{ animation: 'zeroPulse 1.7s ease-in-out infinite' }} />
          <div className="absolute left-0 top-[62%] h-[2px] w-full bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent" style={{ animation: 'zeroSweep 1.9s linear infinite' }} />
        </div>
      )}

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <div className="rounded-3xl border border-white/15 bg-slate-950/45 px-8 py-10 backdrop-blur-md">
          <div className="mx-auto mb-4" style={{ animation: 'zeroFloat 2s ease-in-out infinite, zeroGlow 2s ease-in-out infinite' }}>
            <Logo size="xl" showText={false} className="justify-center" />
          </div>
          <h1 className="text-4xl font-black tracking-[0.28em] sm:text-5xl">ZERO</h1>
          <p className="mt-2 text-xs uppercase tracking-[0.34em] text-cyan-100/90 sm:text-sm">Smart Cities Start From Zero</p>

          <div className="mt-7 h-1.5 w-64 overflow-hidden rounded-full bg-slate-700/60 mx-auto">
            <div className="h-full w-1/2 bg-gradient-to-r from-green-400 via-emerald-300 to-cyan-300" style={{ animation: 'zeroSweep 1.2s linear infinite' }} />
          </div>
          <p className="mt-3 text-xs text-slate-200/80">Preparing your experience...</p>
        </div>
      </div>
    </div>
  );
};
