import React, { useId } from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '' }) => {
  const id = useId();
  
  const sizes = {
    sm: { icon: 'h-8 w-8', text: 'text-base' },
    md: { icon: 'h-10 w-10', text: 'text-lg' },
    lg: { icon: 'h-14 w-14', text: 'text-xl' },
    xl: { icon: 'h-20 w-20', text: 'text-2xl' },
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className={`${sizes[size].icon} relative`}>
        {/* Abstract logo - three overlapping circles with cutouts */}
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            {/* Mask for large circle - cuts out the intersection with medium circle */}
            <mask id={`largeMask-${id}`}>
              <rect width="100" height="100" fill="white" />
              <circle cx="38" cy="62" r="22" fill="black" />
            </mask>
            {/* Mask for medium circle - cuts out intersections */}
            <mask id={`mediumMask-${id}`}>
              <rect width="100" height="100" fill="white" />
              <circle cx="58" cy="38" r="28" fill="black" />
              <circle cx="22" cy="78" r="14" fill="black" />
            </mask>
            {/* Mask for small circle - cuts out intersection with medium */}
            <mask id={`smallMask-${id}`}>
              <rect width="100" height="100" fill="white" />
              <circle cx="38" cy="62" r="22" fill="black" />
            </mask>
          </defs>
          
          {/* Large circle (top right) */}
          <circle cx="58" cy="38" r="28" fill="#16a34a" mask={`url(#largeMask-${id})`} />
          
          {/* Medium circle (middle) */}
          <circle cx="38" cy="62" r="22" fill="#22c55e" mask={`url(#mediumMask-${id})`} />
          
          {/* Small circle (bottom left) */}
          <circle cx="22" cy="78" r="14" fill="#15803d" mask={`url(#smallMask-${id})`} />
        </svg>
      </div>
      {showText && (
        <span className={`font-semibold text-slate-900 dark:text-white ${sizes[size].text} tracking-tight`}>
          Zero
        </span>
      )}
    </div>
  );
};
