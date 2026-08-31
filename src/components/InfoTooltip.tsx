import React, { useState } from 'react';
import { HelpCircle, Info, X } from 'lucide-react';

interface InfoTooltipProps {
  title?: string;
  content: string;
  variant?: 'help' | 'info';
  className?: string;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({
  title,
  content,
  variant = 'help',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <span className={`relative inline-flex items-center align-middle ml-1.5 ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="text-slate-400 hover:text-emerald-700 transition-colors focus:outline-none cursor-pointer"
        aria-label="Financial Information"
      >
        {variant === 'help' ? (
          <HelpCircle className="w-4 h-4" />
        ) : (
          <Info className="w-4 h-4 text-emerald-600" />
        )}
      </button>

      {isOpen && (
        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 sm:w-72 p-3 bg-slate-900 text-slate-100 text-xs rounded-xl shadow-xl border border-slate-700 pointer-events-none transition-all duration-150 animate-in fade-in zoom-in-95">
          {title && (
            <div className="font-semibold text-emerald-400 mb-1 border-b border-slate-800 pb-1">
              {title}
            </div>
          )}
          <p className="leading-relaxed text-slate-200">{content}</p>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
        </div>
      )}
    </span>
  );
};
