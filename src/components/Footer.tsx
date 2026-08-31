import React from 'react';
import { Sparkles, ShieldCheck, Heart, ExternalLink } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../lib/translations';

interface FooterProps {
  language: Language;
  onNavigate: (view: string) => void;
  onLanguageChange: (lang: Language) => void;
}

export const Footer: React.FC<FooterProps> = ({
  language,
  onNavigate,
  onLanguageChange,
}) => {
  const t = translations[language] || translations.en;

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Col 1 Brand */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg overflow-hidden ring-1 ring-emerald-500/30 bg-emerald-950 flex items-center justify-center">
                <img
                  src="/grambiz-logo.png"
                  alt="GramBiz AI Logo"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-base font-bold text-white tracking-tight">GramBiz AI</span>
            </div>
            <p className="text-slate-400 max-w-sm leading-relaxed text-[11px]">
              Empowering India's rural & semi-urban micro-entrepreneurs with hyper-local market intelligence and deterministic government priority loan structuring.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="text-[10px] text-slate-500">Languages:</span>
              <button
                type="button"
                onClick={() => onLanguageChange('en')}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition cursor-pointer ${
                  language === 'en' ? 'bg-emerald-800 text-emerald-200' : 'text-slate-400 hover:text-white'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('hi')}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition cursor-pointer ${
                  language === 'hi' ? 'bg-emerald-800 text-emerald-200' : 'text-slate-400 hover:text-white'
                }`}
              >
                हिंदी
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('or')}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition cursor-pointer ${
                  language === 'or' ? 'bg-emerald-800 text-emerald-200' : 'text-slate-400 hover:text-white'
                }`}
              >
                ଓଡ଼ିଆ
              </button>
            </div>
          </div>

          {/* Col 2 Platform Links */}
          <div className="space-y-2.5">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase">Platform</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-emerald-400 transition cursor-pointer"
                >
                  {t.dashboard}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('wizard')}
                  className="hover:text-emerald-400 transition cursor-pointer"
                >
                  {t.startNewAnalysis}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('recommendations')}
                  className="hover:text-emerald-400 transition cursor-pointer"
                >
                  {t.findViableBusinesses}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('calculator')}
                  className="hover:text-emerald-400 transition cursor-pointer"
                >
                  {t.repaymentCalculator}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3 Schemes & Database */}
          <div className="space-y-2.5">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase">
              Financing & Rules
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('schemes')}
                  className="hover:text-emerald-400 transition cursor-pointer"
                >
                  Micro Finance Scheme (₹1.4L)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('schemes')}
                  className="hover:text-emerald-400 transition cursor-pointer"
                >
                  Term Loan Scheme (₹50L)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('admin')}
                  className="hover:text-emerald-400 transition cursor-pointer"
                >
                  Supabase PostgreSQL Schema
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Safety Disclaimer */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p className="max-w-3xl leading-relaxed">
            <strong>Disclaimer:</strong> {t.financialSafetyDisclaimer} GramBiz AI provides automated feasibility assessments and planning models. Loan sanctions are subject to bank credit appraisal and verification.
          </p>
          <div className="shrink-0 text-slate-600">
            © {new Date().getFullYear()} GramBiz AI. Built for India.
          </div>
        </div>
      </div>
    </footer>
  );
};
