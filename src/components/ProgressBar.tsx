import React from 'react';

interface ProgressBarProps {
  value: number; // 0-based active scene index
  max: number;   // total scenes
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, max, className = "" }) => {
  // Calculate percentage (ensure it is between 0% and 100%)
  const percentage = max > 0 ? Math.min(Math.max((value / max) * 100, 0), 100) : 0;

  return (
    <div className={`w-full flex items-center gap-3 ${className}`}>
      {/* Track */}
      <div 
        className="flex-1 h-5 bg-gray-200 rounded-full overflow-hidden relative"
        style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)' }}
      >
        {/* Fill */}
        <div
          className="h-full bg-[#58cc02] rounded-full transition-all duration-300 ease-out relative"
          style={{ 
            width: `${percentage}%`,
            boxShadow: 'inset 0 -2px 0 rgba(0, 0, 0, 0.2)' 
          }}
        >
          {/* Highlight shine on top of the bar */}
          <div 
            className="absolute top-1 left-1 right-1 h-1.5 bg-white opacity-35 rounded-full"
            style={{ pointerEvents: 'none' }}
          />
        </div>
      </div>
      
      {/* Label (e.g. 3 / 10) */}
      <span className="font-feather text-gray-400 text-sm whitespace-nowrap">
        {Math.min(value + 1, max)} / {max}
      </span>
    </div>
  );
};
