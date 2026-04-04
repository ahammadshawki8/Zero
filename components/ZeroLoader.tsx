import React from 'react';

interface ZeroLoaderProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: {
    shell: 'h-10 w-10',
    core: 'h-4 w-4',
    text: 'text-xs',
    trackInset: 3,
  },
  md: {
    shell: 'h-14 w-14',
    core: 'h-5 w-5',
    text: 'text-sm',
    trackInset: 4,
  },
  lg: {
    shell: 'h-16 w-16',
    core: 'h-6 w-6',
    text: 'text-base',
    trackInset: 5,
  },
};

export const ZeroLoader: React.FC<ZeroLoaderProps> = ({
  label = 'Loading...',
  size = 'md',
  className = '',
}) => {
  const selected = sizeMap[size];
  const trackStyle = { inset: `${selected.trackInset}px` };

  return (
    <div className={`inline-flex flex-col items-center justify-center gap-3 ${className}`}>
      <style>{`
        @keyframes zero-loader-rotate {
          to { transform: rotate(360deg); }
        }
        @keyframes zero-loader-pulse {
          0%, 100% { transform: scale(0.92); opacity: 0.55; }
          50% { transform: scale(1.08); opacity: 0.95; }
        }
        @keyframes zero-loader-orbit {
          to { transform: rotate(360deg); }
        }
        @keyframes zero-loader-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <div className={`relative ${selected.shell}`}>
        <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-lg" style={{ animation: 'zero-loader-pulse 2.1s ease-in-out infinite' }} />

        <div
          className="absolute rounded-full border border-slate-200/80 dark:border-slate-700/80 bg-white/60 dark:bg-slate-900/40 backdrop-blur-sm"
          style={trackStyle}
        />

        <div
          className="absolute rounded-full border-2 border-transparent"
          style={{
            ...trackStyle,
            borderTopColor: '#10b981',
            borderRightColor: '#22d3ee',
            animation: 'zero-loader-rotate 900ms linear infinite',
          }}
        />

        <div className="absolute inset-0" style={{ animation: 'zero-loader-orbit 1.6s linear infinite' }}>
          <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
        </div>
        <div className="absolute inset-0" style={{ animation: 'zero-loader-orbit 1.9s linear infinite reverse' }}>
          <span className="absolute left-1/2 bottom-0 h-1.5 w-1.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`${selected.core} rounded-full bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400 shadow-[0_0_18px_rgba(16,185,129,0.45)]`} />
        </div>
      </div>

      <p
        className={`${selected.text} font-semibold tracking-[0.08em] text-slate-600 dark:text-slate-300 bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500 bg-[length:220%_100%] bg-clip-text text-transparent`}
        style={{ animation: 'zero-loader-shimmer 2.2s linear infinite' }}
      >
        {label}
      </p>
    </div>
  );
};

export const PageLoader: React.FC<ZeroLoaderProps> = ({ label = 'Loading...', size = 'md', className = '' }) => (
  <div className={`flex items-center justify-center py-12 ${className}`}>
    <ZeroLoader label={label} size={size} />
  </div>
);

export const InlineLoader: React.FC<ZeroLoaderProps> = ({ label = 'Loading...', size = 'sm', className = '' }) => (
  <div className={`flex items-center justify-center py-6 ${className}`}>
    <ZeroLoader label={label} size={size} />
  </div>
);

export const ButtonLoader: React.FC = () => (
  <span className="relative mr-2 inline-flex h-4 w-4 items-center justify-center">
    <span className="absolute inset-0 rounded-full border border-current/35" />
    <span className="absolute inset-[2px] rounded-full border-2 border-transparent border-t-current border-r-current/70 animate-spin" />
    <span className="absolute h-1 w-1 rounded-full bg-current/80" />
  </span>
);
