import React from 'react';
import { ShieldCheck, IndianRupee, HelpCircle, ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react';
import { FinancialCalculation, Language } from '../types';
import { formatINR, formatINRLakhs } from '../lib/utils';
import { InfoTooltip } from './InfoTooltip';
import { translations } from '../lib/translations';

interface FinancialCardProps {
  financial: FinancialCalculation;
  language: Language;
  onViewRepaymentPlan?: () => void;
  className?: string;
}

export const FinancialCard: React.FC<FinancialCardProps> = ({
  financial,
  language,
  onViewRepaymentPlan,
  className = '',
}) => {
  const t = translations[language] || translations.en;
  const scheme = financial.applicableScheme;

  return (
    <div className={`bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6 relative overflow-hidden ${className}`}>
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-5 pb-4 border-b border-slate-100">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
            {t.financialStructure}
          </div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            {scheme ? scheme.name : financial.isAboveSchemeLimit ? 'Exceeds Scheme Limit' : 'Self-Financed'}
          </h3>
        </div>

        {scheme && (
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
            {scheme.funding_percentage}% Scheme Funded
          </div>
        )}
      </div>

      {financial.isAboveSchemeLimit ? (
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-sm mb-4 flex items-start gap-2.5">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold mb-0.5">Project Limit Exceeded</div>
            <p className="text-xs leading-relaxed text-amber-800">
              Your current margin capital would imply a project size above the maximum supported (₹50 Lakh) under these micro-enterprise schemes.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          {/* Margin */}
          <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-100">
            <div className="flex items-center text-xs font-medium text-slate-500 mb-1">
              <span>{t.availableMarginCapital}</span>
              <InfoTooltip
                title={t.availableMarginCapital}
                content="The exact amount of personal savings you contribute (assumed to represent 10% of total project cost)."
              />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900">
              {formatINR(financial.availableMargin)}
            </div>
            <div className="text-[11px] text-emerald-700 font-medium mt-1">
              10% Promoter Contribution
            </div>
          </div>

          {/* Project Cost */}
          <div className="bg-emerald-50/50 rounded-xl p-3.5 border border-emerald-100/80">
            <div className="flex items-center text-xs font-medium text-emerald-900 mb-1">
              <span>{t.projectCost}</span>
              <InfoTooltip
                title={t.projectCost}
                content="Calculated deterministically as Available Margin / 10%. Represents total setup cost including machinery & working capital."
              />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-emerald-800">
              {formatINR(financial.projectCost)}
            </div>
            <div className="text-[11px] text-emerald-600 font-medium mt-1">
              {formatINRLakhs(financial.projectCost)} Total Capital
            </div>
          </div>

          {/* Potential Loan */}
          <div className="bg-blue-50/50 rounded-xl p-3.5 border border-blue-100/80">
            <div className="flex items-center text-xs font-medium text-blue-900 mb-1">
              <span>{t.loanAmount}</span>
              <InfoTooltip
                title={t.loanAmount}
                content="Calculated as 90% of Project Cost, up to the maximum ceiling permitted under the matching government scheme."
              />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-blue-800">
              {formatINR(financial.loanAmount)}
            </div>
            <div className="text-[11px] text-blue-600 font-medium mt-1">
              90% Potential Debt Facility
            </div>
          </div>
        </div>
      )}

      {/* Scheme Key Parameters */}
      {scheme && (
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-5 text-xs text-slate-700 space-y-2">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <span className="text-slate-400 block">{t.interestRate}</span>
              <span className="font-semibold text-slate-900 text-sm">{scheme.interest_rate}% p.a.</span>
            </div>
            <div>
              <span className="text-slate-400 block">{t.tenure}</span>
              <span className="font-semibold text-slate-900 text-sm">
                {Math.round(scheme.tenure_months / 12)} Years ({scheme.tenure_months}m)
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">{t.moratorium}</span>
              <span className="font-semibold text-slate-900 text-sm">{scheme.moratorium_months} Months</span>
            </div>
            <div>
              <span className="text-slate-400 block">Est. Post-Moratorium EMI</span>
              <span className="font-semibold text-emerald-700 text-sm">
                {formatINR(financial.monthlyEMI)} / mo
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Footer Disclaimer & Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
        <p className="text-[11px] text-slate-400 leading-relaxed max-w-lg">
          {t.financialSafetyDisclaimer}
        </p>

        {onViewRepaymentPlan && (
          <button
            type="button"
            onClick={onViewRepaymentPlan}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs sm:text-sm transition shadow-sm hover:shadow shrink-0 cursor-pointer"
          >
            <span>{t.repaymentPlan}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
