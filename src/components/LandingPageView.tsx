import React, { useState } from 'react';
import {
  Sparkles,
  MapPin,
  IndianRupee,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Users,
  Compass,
  FileText,
  Percent,
  HelpCircle,
  Briefcase,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { BusinessCategory, Language } from '../types';
import { INDIAN_STATES_DISTRICTS } from '../data/seedData';
import { formatINR, formatINRLakhs } from '../lib/utils';
import { calculateFinancialStructure } from '../lib/financialEngine';
import { InfoTooltip } from './InfoTooltip';
import { translations } from '../lib/translations';

interface LandingPageViewProps {
  categories: BusinessCategory[];
  language: Language;
  onStartWizardWithParams: (params: {
    state: string;
    district: string;
    block: string;
    village: string;
    margin: number;
    categoryId: string;
    businessType: string;
  }) => void;
  onOpenRecommendations: () => void;
  onOpenCalculator: () => void;
  onOpenSchemes: () => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  categories,
  language,
  onStartWizardWithParams,
  onOpenRecommendations,
  onOpenCalculator,
  onOpenSchemes,
}) => {
  const t = translations[language] || translations.en;

  // Hero Quick Form State
  const [heroState, setHeroState] = useState<string>('Odisha');
  const [heroDistrict, setHeroDistrict] = useState<string>('Ganjam');
  const [heroMargin, setHeroMargin] = useState<number>(100000);
  const [heroCategory, setHeroCategory] = useState<string>('cat_dairy');

  // Interactive Live Calculator Preview State
  const [previewMargin, setPreviewMargin] = useState<number>(100000);
  const previewFinancial = calculateFinancialStructure(previewMargin);

  // FAQ open states
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const availableDistricts = INDIAN_STATES_DISTRICTS[heroState]?.districts || ['Ganjam', 'Puri'];

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cat = categories.find((c) => c.id === heroCategory) || categories[0];
    onStartWizardWithParams({
      state: heroState,
      district: heroDistrict,
      block: 'Hinjilicut',
      village: 'Rampur Gram Panchayat',
      margin: heroMargin,
      categoryId: cat.id,
      businessType: cat.name,
    });
  };

  const faqs = [
    {
      q: 'How does GramBiz AI calculate my loan and project cost?',
      a: 'GramBiz AI uses deterministic application rules: your available margin is treated as the 10% promoter contribution required by Indian government priority schemes. Hence, Project Cost = Margin ÷ 10%, and Potential Loan = Project Cost × 90%. AI is never used for arithmetic calculations, ensuring 100% financial precision.',
    },
    {
      q: 'Which government financing schemes are supported?',
      a: 'Currently, the platform natively evaluates Micro Finance Schemes (up to ₹1.4 Lakh project cost, 6.5% interest, 3-year tenure with 3-month grace) and Term Loan Schemes (up to ₹50 Lakh project cost, 8.0% interest, 7-year tenure with 6-month grace period).',
    },
    {
      q: 'Can I use GramBiz AI in Hindi or Odia?',
      a: 'Yes! The entire advisory platform, feasibility reports, SWOT analysis, and loan breakdown are available in English, Hindi (हिंदी), and Odia (ଓଡ଼ିଆ).',
    },
    {
      q: 'What if I have capital but don’t know what business to start?',
      a: 'Click on "Discover Viable Businesses". Our hyper-local AI discovery engine scans your district and suggests high-demand, low-risk business opportunities tailored to your margin capital.',
    },
    {
      q: 'Is this an official bank loan approval?',
      a: 'No. GramBiz AI provides feasibility planning, market advisory, and financial structuring estimates to prepare you for bank applications. Final loan sanctions are issued by the respective commercial banks after physical verification.',
    },
  ];

  return (
    <div className="space-y-16 pb-12 animate-in fade-in duration-300">
      {/* HERO SECTION */}
      <div className="relative bg-gradient-to-b from-emerald-50/80 via-white to-slate-50/50 rounded-3xl border border-slate-200/80 p-6 sm:p-12 overflow-hidden shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column Text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>AI Rural Business Advisory & Financial Planning</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Start the Right Business.{' '}
              <span className="text-emerald-700 block">Build It With Confidence.</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
              An AI-driven hyper-local business advisory platform helping rural and semi-urban entrepreneurs in India answer: <strong className="text-slate-900">Which business is viable in my area?</strong> and <strong className="text-slate-900">How much loan can I structure?</strong>
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-700 pt-2">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Hyper-Local Market Feasibility</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Deterministic 90% Loan Structuring</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>English, Hindi & Odia</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Quick Mini-Form */}
          <div className="lg:col-span-5 bg-white rounded-2xl border-2 border-emerald-600/30 p-6 shadow-xl shadow-emerald-900/5">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Instant Feasibility Check
              </span>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                Free & Instant
              </span>
            </div>

            <form onSubmit={handleHeroSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">{t.state}</label>
                  <select
                    value={heroState}
                    onChange={(e) => {
                      setHeroState(e.target.value);
                      const dList = INDIAN_STATES_DISTRICTS[e.target.value]?.districts || [];
                      if (dList.length > 0) setHeroDistrict(dList[0]);
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 bg-white"
                  >
                    {Object.keys(INDIAN_STATES_DISTRICTS).map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">{t.district}</label>
                  <select
                    value={heroDistrict}
                    onChange={(e) => setHeroDistrict(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 bg-white"
                  >
                    {availableDistricts.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-700">
                    {t.availableMarginCapital} (₹)
                  </label>
                  <span className="text-xs font-extrabold text-emerald-700">
                    {formatINR(heroMargin)}
                  </span>
                </div>
                <input
                  type="number"
                  min={5000}
                  max={2000000}
                  step={5000}
                  value={heroMargin}
                  onChange={(e) => setHeroMargin(Math.max(5000, Number(e.target.value) || 0))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Business Category</label>
                <select
                  value={heroCategory}
                  onChange={(e) => setHeroCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 bg-white"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick Calculated Preview */}
              <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-100 text-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 block">Est. Project Cost</span>
                  <span className="font-bold text-slate-900">{formatINR(heroMargin * 10)}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-emerald-700 block">90% Potential Loan</span>
                  <span className="font-bold text-emerald-800">{formatINR(heroMargin * 9)}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition shadow-sm hover:shadow cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Analyze Local Business Feasibility</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS (4 STEPS) */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Simple 4-Step Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            How GramBiz AI Guides Your Journey
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Engineered specifically for first-time rural entrepreneurs, SHG groups, and small business owners.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs relative">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 font-extrabold flex items-center justify-center text-sm mb-4">
              01
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1.5">Enter Location & Margin</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Specify your state, district, block, and village along with the personal capital you have saved.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs relative">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 font-extrabold flex items-center justify-center text-sm mb-4">
              02
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1.5">Choose or Discover Business</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Select from 10+ verified rural industry categories or let our AI recommend top local demand opportunities.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs relative">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 font-extrabold flex items-center justify-center text-sm mb-4">
              03
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1.5">Deterministic Loan Structuring</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Get an instant mathematical 10% Margin / 90% Debt calculation matching Micro Finance or Term Loan schemes.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs relative">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 font-extrabold flex items-center justify-center text-sm mb-4">
              04
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1.5">AI Feasibility & Action Plan</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Receive hyper-local SWOT, local risk matrix, competitor insights, pricing benchmarks, and exportable PDF report.
            </p>
          </div>
        </div>
      </div>

      {/* CORE FEATURES (6 BENTO CARDS) */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Comprehensive Platform
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Built for Real Rural Economics
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
            <MapPin className="w-8 h-8 text-emerald-600 mb-3" />
            <h3 className="text-base font-bold text-slate-900 mb-1.5">
              Hyper-Local Market Feasibility
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Considers rural weekly haats, block headquarters distances, and agro-commodity supply surpluses.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
            <IndianRupee className="w-8 h-8 text-emerald-600 mb-3" />
            <h3 className="text-base font-bold text-slate-900 mb-1.5">
              Deterministic Financial Calculations
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              100% transparent arithmetic formulas (Project Cost = Margin / 10%) without unpredictable AI hallucinations.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
            <Layers className="w-8 h-8 text-emerald-600 mb-3" />
            <h3 className="text-base font-bold text-slate-900 mb-1.5">
              Actionable SWOT & Local Risk Matrix
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Evaluates rural electric supply, seasonal monsoon bottlenecks, raw material price swings, and credit risk.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
            <Users className="w-8 h-8 text-emerald-600 mb-3" />
            <h3 className="text-base font-bold text-slate-900 mb-1.5">
              Competitor & Pricing Intelligence
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Analyzes nearby clusters within 5km and 10km, penetration pricing strategies, and estimated unit gross margins.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
            <ShieldCheck className="w-8 h-8 text-emerald-600 mb-3" />
            <h3 className="text-base font-bold text-slate-900 mb-1.5">
              Full Repayment & Amortization Planner
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Configures grace periods (moratorium), annual interest rates, tenure schedules, and CSV export.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
            <FileText className="w-8 h-8 text-emerald-600 mb-3" />
            <h3 className="text-base font-bold text-slate-900 mb-1.5">
              Exportable PDF Bank Readiness Kit
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Generate standardized, professional PDF feasibility reports to share with bank branch managers.
            </p>
          </div>
        </div>
      </div>

      {/* LIVE INTERACTIVE FINANCIAL CALCULATOR PREVIEW */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Interactive Financial Structuring
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold">
              See How Much Project Capacity Your Margin Unlocks
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Slide your available savings to see the exact project cost and loan entitlement calculated deterministically under government scheme rules.
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenCalculator}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm transition cursor-pointer"
              >
                <span>Open Full Amortization Planner</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 bg-slate-800/80 rounded-2xl border border-slate-700 p-6 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">Your Margin Savings:</span>
                <span className="text-xl font-bold text-emerald-400">
                  {formatINR(previewMargin)}
                </span>
              </div>
              <input
                type="range"
                min={10000}
                max={500000}
                step={5000}
                value={previewMargin}
                onChange={(e) => setPreviewMargin(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-400 block">Promoter Margin (10%)</span>
                <span className="text-base font-bold text-slate-100 mt-1 block">
                  {formatINR(previewFinancial.availableMargin)}
                </span>
              </div>

              <div className="p-3 bg-emerald-950/60 rounded-xl border border-emerald-700/60">
                <span className="text-[10px] text-emerald-300 block">Total Project Cost</span>
                <span className="text-base font-bold text-emerald-400 mt-1 block">
                  {formatINR(previewFinancial.projectCost)}
                </span>
              </div>

              <div className="p-3 bg-blue-950/60 rounded-xl border border-blue-700/60">
                <span className="text-[10px] text-blue-300 block">Potential 90% Loan</span>
                <span className="text-base font-bold text-blue-400 mt-1 block">
                  {formatINR(previewFinancial.loanAmount)}
                </span>
              </div>
            </div>

            {previewFinancial.applicableScheme && (
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 text-xs flex flex-wrap items-center justify-between gap-2 text-slate-300">
                <span>
                  Matching Scheme: <strong>{previewFinancial.applicableScheme.name}</strong>
                </span>
                <span className="text-emerald-400 font-semibold">
                  {previewFinancial.applicableScheme.interest_rate}% Interest • {previewFinancial.applicableScheme.moratorium_months}m Grace Period
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* GOVERNMENT SCHEMES OVERVIEW */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Priority Sector Financing
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-0.5">
              Supported Government Loan Schemes
            </h2>
          </div>

          <button
            type="button"
            onClick={onOpenSchemes}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition cursor-pointer border border-emerald-200"
          >
            <span>View Full Schemes Guide</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-bold text-slate-900">Micro Finance Scheme</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Up to ₹1.4 Lakh
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                Designed for nano-enterprises, small grocery shops, tailoring units, and women SHG members.
              </p>
              <div className="space-y-2 text-xs text-slate-700">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span>Interest Rate:</span>
                  <span className="font-bold">6.5% p.a.</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span>Loan Tenure:</span>
                  <span className="font-bold">3 Years (36 Months)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Moratorium (Grace):</span>
                  <span className="font-bold text-emerald-700">3 Months</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-bold text-slate-900">Term Loan Scheme</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                  ₹1.4 Lakh – ₹50 Lakh
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                Designed for agro-processing mills, commercial dairy units, poultry farms, and machinery investment.
              </p>
              <div className="space-y-2 text-xs text-slate-700">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span>Interest Rate:</span>
                  <span className="font-bold">8.0% p.a.</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span>Loan Tenure:</span>
                  <span className="font-bold">7 Years (84 Months)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Moratorium (Grace):</span>
                  <span className="font-bold text-blue-700">6 Months</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ SECTION */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-xs">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
            Questions Rural Entrepreneurs Ask
          </h2>
        </div>

        <div className="space-y-3 max-w-2xl mx-auto">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left font-bold text-sm text-slate-900 flex items-center justify-between gap-4 bg-slate-50/50 hover:bg-slate-100 transition cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="p-4 bg-white text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* BOTTOM CTA BANNER */}
      <div className="bg-gradient-to-r from-emerald-700 to-teal-800 rounded-3xl p-8 sm:p-12 text-white text-center shadow-lg">
        <h2 className="text-2xl sm:text-4xl font-extrabold mb-3">
          Ready to Test Your Business Idea?
        </h2>
        <p className="text-emerald-100 text-xs sm:text-sm max-w-lg mx-auto mb-6">
          Generate an instant feasibility analysis, de-risk your investment, and prepare your structured repayment plan in under 2 minutes.
        </p>

        <button
          type="button"
          onClick={() =>
            onStartWizardWithParams({
              state: heroState,
              district: heroDistrict,
              block: 'Hinjilicut',
              village: 'Rampur Gram Panchayat',
              margin: 100000,
              categoryId: 'cat_dairy',
              businessType: 'Dairy Farming & Milk Chilling Unit',
            })
          }
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white hover:bg-slate-100 text-emerald-950 font-bold text-sm sm:text-base transition shadow-md cursor-pointer"
        >
          <span>Start Free Business Analysis →</span>
        </button>
      </div>
    </div>
  );
};
