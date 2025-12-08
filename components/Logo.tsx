import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true }) => {
  const sizes = {
    sm: { icon: 'h-7 w-7', text: 'text-base' },
    md: { icon: 'h-9 w-9', text: 'text-lg' },
    lg: { icon: 'h-12 w-12', text: 'text-xl' },
    xl: { icon: 'h-16 w-16', text: 'text-2xl' },
  };

  return (
    <div className="flex items-center gap-2.5">
      <div className={`${sizes[size].icon} relative`}>
        {/* Abstract logo - overlapping circles forming a "0" shape */}
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Outer ring */}
          <circle cx="20" cy="20" r="16" stroke="#16a34a" strokeWidth="3" fill="none" />
          {/* Inner accent - leaf-like curve */}
          <path
            d="M20 8 C28 8, 32 16, 32 20 C32 28, 24 32, 20 32 C12 32, 8 24, 8 20 C8 12, 16 8, 20 8"
            fill="none"
            stroke="#22c55e"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Center dot */}
          <circle cx="20" cy="20" r="4" fill="#16a34a" />
          {/* Small accent leaf */}
          <path
            d="M26 10 Q30 14, 28 18"
            stroke="#4ade80"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>
      {showText && (
        <span className={`font-semibold text-slate-900 ${sizes[size].text} tracking-tight`}>
          Zero
        </span>
      )}
    </div>
  );
};
