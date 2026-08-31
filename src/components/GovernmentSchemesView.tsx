import React, { useState } from 'react';
import {
  ShieldCheck,
  IndianRupee,
  Calendar,
  Percent,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  FileCheck,
  Building,
} from 'lucide-react';
import { LoanScheme, Language } from '../types';
import { formatINR, formatINRLakhs } from '../lib/utils';
import { calculateFinancialStructure } from '../lib/financialEngine';
import { InfoTooltip } from './InfoTooltip';
import { translations } from '../lib/translations';

interface GovernmentSchemesViewProps {
  schemes: LoanScheme[];
  language: Language;
  onSelectSchemeToCalculate: (margin: number) => void;
}

export const GovernmentSchemesView: React.FC<GovernmentSchemesViewProps> = ({
  schemes,
  language,
  onSelectSchemeToCalculate,
}) => {
  const t = translations[language] || translations.en;

  const [inputMargin, setInputMargin] = useState<number>(100000);
  const financial = calculateFinancialStructure(inputMargin, schemes);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Priority Sector Lending Guide</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Government Financing Schemes & Loan Eligibility
          </h1>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            Understand how Indian priority enterprise lending schemes provide up to 90% project debt with subsidized interest rates and initial repayment moratoriums.
          </p>
        </div>

        {/* Quick Scheme Eligibility Check */}
        <div className="mt-6 p-5 bg-slate-50 rounded-2xl border border-slate-200/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">
                Check Matching Scheme for Your Available Margin:
              </label>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  min={5000}
                  max={2000000}
                  step={5000}
                  value={inputMargin}
                  onChange={(e) => setInputMargin(Math.max(0, Number(e.target.value) || 0))}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 w-44 bg-white"
                />
              </div>
            </div>

            <div className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200 flex items-center gap-4">
              <div>
                <span className="text-slate-400 block text-[10px]">Project Cost (10x)</span>
                <span className="font-bold text-slate-900">{formatINR(financial.projectCost)}</span>
              </div>
              <div>
                <span className="text-emerald-700 block text-[10px]">90% Loan Amount</span>
                <span className="font-bold text-emerald-800">{formatINR(financial.loanAmount)}</span>
              </div>
              <div>
                <span className="text-blue-700 block text-[10px]">Matching Scheme</span>
                <span className="font-bold text-blue-900">
                  {financial.applicableScheme ? financial.applicableScheme.name : 'Exceeds Limit'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Supported Schemes Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Micro Finance Scheme */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block">
                  Nano & Micro Enterprises
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">Micro Finance Scheme</h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                Up to ₹1.4 Lakh Project
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              Tailored for home-based units, rural tailoring boutiques, grocery stores, mobile recharge and digital service kiosks.
            </p>

            <div className="space-y-3 text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-6">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Maximum Loan Amount:</span>
                <span className="font-bold text-slate-900">₹1,25,000 (90% of ₹1.4L)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Subsidized Interest Rate:</span>
                <span className="font-bold text-emerald-700">6.5% per annum</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Loan Tenure:</span>
                <span className="font-bold text-slate-900">3 Years (36 Months)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Moratorium Grace Period:</span>
                <span className="font-bold text-slate-900">3 Months (Interest-only service)</span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600 mb-6">
              <div className="font-semibold text-slate-800">Key Documentation Required:</div>
              <ul className="list-disc pl-4 space-y-1 text-slate-500">
                <li>Aadhaar Card & PAN Card / Voter ID</li>
                <li>Gram Panchayat / Trade Proof or Electricity Bill</li>
                <li>Bank Savings Account Statement (6 months)</li>
              </ul>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onSelectSchemeToCalculate(12000)}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Structure Loan with Micro Finance →</span>
          </button>
        </div>

        {/* Term Loan Scheme */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block">
                  Small & Medium Agri Units
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">Term Loan Scheme</h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                ₹1.4 Lakh – ₹50 Lakh
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              Designed for commercial dairy farms, oil & flour processing mills, poultry broiler sheds, and farm machinery hiring centers.
            </p>

            <div className="space-y-3 text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-6">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Maximum Loan Amount:</span>
                <span className="font-bold text-slate-900">₹45,00,000 (90% of ₹50L)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Subsidized Interest Rate:</span>
                <span className="font-bold text-blue-700">8.0% per annum</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Loan Tenure:</span>
                <span className="font-bold text-slate-900">7 Years (84 Months)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Moratorium Grace Period:</span>
                <span className="font-bold text-slate-900">6 Months (Machinery setup grace)</span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600 mb-6">
              <div className="font-semibold text-slate-800">Key Documentation Required:</div>
              <ul className="list-disc pl-4 space-y-1 text-slate-500">
                <li>Udyam MSME Registration (Free online)</li>
                <li>Machinery Quotation / Invoice from manufacturer</li>
                <li>Land possession receipt / Rent agreement</li>
                <li>GramBiz AI Project Feasibility Report (Included)</li>
              </ul>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onSelectSchemeToCalculate(100000)}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Structure Loan with Term Loan →</span>
          </button>
        </div>
      </div>
    </div>
  );
};
