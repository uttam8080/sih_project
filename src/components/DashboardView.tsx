import React from 'react';
import {
  Plus,
  Compass,
  FileText,
  IndianRupee,
  TrendingUp,
  MapPin,
  Calendar,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Calculator,
  Briefcase,
} from 'lucide-react';
import {
  BusinessAnalysis,
  UserProfile,
  Language,
} from '../types';
import { formatINR, formatINRLakhs, getScoreBadge } from '../lib/utils';
import { translations } from '../lib/translations';

interface DashboardViewProps {
  currentUser: UserProfile | null;
  analyses: BusinessAnalysis[];
  language: Language;
  onStartNewAnalysis: () => void;
  onOpenRecommendations: () => void;
  onOpenCalculator: () => void;
  onViewAnalysis: (analysis: BusinessAnalysis) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  analyses,
  language,
  onStartNewAnalysis,
  onOpenRecommendations,
  onOpenCalculator,
  onViewAnalysis,
}) => {
  const t = translations[language] || translations.en;

  const totalAnalyses = analyses.length;
  const maxProjectCost = analyses.reduce((acc, a) => Math.max(acc, a.project_cost || 0), 0);
  const maxLoanAmount = analyses.reduce((acc, a) => Math.max(acc, a.loan_amount || 0), 0);
  const avgScore = totalAnalyses > 0 ? Math.round(analyses.reduce((acc, a) => acc + (a.feasibility_score || 0), 0) / totalAnalyses) : 84;

  const userName = currentUser?.full_name || 'Entrepreneur';

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-700/60 text-emerald-200 border border-emerald-500/40 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>GramBiz AI Advisory Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Namaste, {userName} 👋
          </h1>
          <p className="text-emerald-100/80 text-xs sm:text-sm mt-2 leading-relaxed">
            Assess local rural business viability, structure 90% debt financing under government schemes, and de-risk your investment before taking a single loan.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <button
              type="button"
              onClick={onStartNewAnalysis}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm transition shadow-sm hover:shadow cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t.startNewAnalysis}</span>
            </button>

            <button
              type="button"
              onClick={onOpenRecommendations}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-950/70 hover:bg-emerald-950 text-white border border-emerald-700/60 font-semibold text-xs sm:text-sm transition cursor-pointer"
            >
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>{t.findViableBusinesses}</span>
            </button>

            <button
              type="button"
              onClick={onOpenCalculator}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm transition cursor-pointer"
            >
              <Calculator className="w-4 h-4 text-emerald-300" />
              <span>EMI & Amortization</span>
            </button>
          </div>
        </div>

        {/* Decorative background grid */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-12 translate-y-12">
          <Briefcase className="w-96 h-96 text-white" />
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
            <span>Completed Analyses</span>
            <FileText className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalAnalyses}</div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">
            Avg. Feasibility: {avgScore}/100
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
            <span>Total Project Capacity</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{formatINR(maxProjectCost)}</div>
          <div className="text-[11px] text-blue-700 font-medium mt-1">
            10x Personal Margin Contribution
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
            <span>Potential Loan Access</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-800">{formatINR(maxLoanAmount)}</div>
          <div className="text-[11px] text-slate-400 mt-1">90% Government Subsidized</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
            <span>Active Schemes</span>
            <IndianRupee className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">2 Schemes</div>
          <div className="text-[11px] text-amber-700 font-medium mt-1">
            Micro Finance & Term Loan
          </div>
        </div>
      </div>

      {/* Recent Analyses Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{t.recentAnalyses}</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review feasibility reports, SWAT matrices, and repayment plans.
            </p>
          </div>

          <button
            type="button"
            onClick={onStartNewAnalysis}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition cursor-pointer self-start sm:self-auto border border-emerald-200"
          >
            <Plus className="w-4 h-4" />
            <span>New Analysis</span>
          </button>
        </div>

        {analyses.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">No analyses generated yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
              Start your first rural business feasibility check in less than 2 minutes.
            </p>
            <button
              type="button"
              onClick={onStartNewAnalysis}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              Start Analysis Now →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analyses.map((analysis) => {
              const badge = getScoreBadge(analysis.feasibility_score);
              return (
                <div
                  key={analysis.id}
                  onClick={() => onViewAnalysis(analysis)}
                  className="p-5 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:shadow-md transition bg-slate-50/50 hover:bg-white cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
                        {analysis.business_category_name || 'Agro & Enterprise'}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${badge.bg} ${badge.color}`}>
                        {analysis.feasibility_score}/100 Score
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1 mb-1">
                      {analysis.business_type}
                    </h3>

                    <div className="flex items-center gap-1 text-xs text-slate-500 mb-4">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">
                        {analysis.village}, {analysis.district}
                      </span>
                    </div>

                    {/* Financial Snapshot */}
                    <div className="grid grid-cols-2 gap-2 p-3 bg-white rounded-xl border border-slate-100 text-xs mb-4">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Margin</span>
                        <span className="font-bold text-slate-800">
                          {formatINR(analysis.available_margin)}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Potential Loan</span>
                        <span className="font-bold text-emerald-700">
                          {formatINR(analysis.loan_amount)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200/70 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(analysis.created_at).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>

                    <span className="font-bold text-emerald-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>View Report</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
