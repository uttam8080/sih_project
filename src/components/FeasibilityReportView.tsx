import React, { useState } from 'react';
import {
  Download,
  Share2,
  Bookmark,
  CheckCircle,
  MapPin,
  Calendar,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  Building2,
  Users,
  Target,
  ArrowRight,
  Layers,
  Percent,
  Compass,
  PieChart as PieIcon,
  Info,
  Printer,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
} from 'recharts';
import jsPDF from 'jspdf';
import {
  BusinessAnalysis,
  FeasibilityReport,
  Language,
} from '../types';
import { formatINR, formatINRLakhs, getScoreColor, getScoreBadge } from '../lib/utils';
import { FinancialCard } from './FinancialCard';
import { FinancialCalculator } from './FinancialCalculator';
import { InfoTooltip } from './InfoTooltip';
import { translations } from '../lib/translations';

interface FeasibilityReportViewProps {
  analysis: BusinessAnalysis;
  report: FeasibilityReport;
  language: Language;
  onStartNewAnalysis: () => void;
  onOpenCalculator?: () => void;
}

export const FeasibilityReportView: React.FC<FeasibilityReportViewProps> = ({
  analysis,
  report,
  language,
  onStartNewAnalysis,
}) => {
  const t = translations[language] || translations.en;
  const [showFullRepayment, setShowFullRepayment] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [shareCopied, setShareCopied] = useState<boolean>(false);

  // Radar chart data for category scores
  const radarData = [
    { subject: 'Market Demand', A: report.category_scores.marketDemand, fullMark: 100 },
    { subject: 'Competition', A: report.category_scores.competition, fullMark: 100 },
    { subject: 'Capital Fit', A: report.category_scores.capitalSuitability, fullMark: 100 },
    { subject: 'Growth', A: report.category_scores.growthPotential, fullMark: 100 },
    { subject: 'Risk Control', A: report.category_scores.risk, fullMark: 100 },
    { subject: 'Operations', A: report.category_scores.operationalFeasibility, fullMark: 100 },
  ];

  // Pie chart data for customer segments
  const pieColors = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'];
  const segmentData = report.market_reach.customerSegments.map((s, idx) => ({
    name: s.name,
    value: s.sharePercentage,
    description: s.description,
    color: pieColors[idx % pieColors.length],
  }));

  // Download PDF Report using jsPDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header banner
    doc.setFillColor(16, 185, 129); // emerald-600
    doc.rect(0, 0, pageWidth, 28, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('GramBiz AI — Rural Business Advisory Feasibility Report', 14, 18);

    // Business Summary
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(14);
    doc.text(`Business: ${analysis.business_type}`, 14, 40);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Location: ${analysis.village}, ${analysis.block}, ${analysis.district}, ${analysis.state}`, 14, 48);
    doc.text(`Generated Date: ${new Date(report.created_at).toLocaleDateString('en-IN')}`, 14, 54);

    // Financial Structure
    doc.setFillColor(241, 245, 249);
    doc.rect(14, 62, pageWidth - 28, 32, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Financial & Loan Structuring Summary', 18, 70);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`Available Margin Capital: Rs. ${analysis.available_margin.toLocaleString('en-IN')}`, 18, 78);
    doc.text(`Potential Project Cost: Rs. ${analysis.project_cost.toLocaleString('en-IN')}`, 18, 84);
    doc.text(`Potential Loan Amount: Rs. ${analysis.loan_amount.toLocaleString('en-IN')}`, 110, 78);
    doc.text(`Government Scheme: ${analysis.scheme_name || 'Term Loan Scheme'}`, 110, 84);

    // Feasibility Score
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(`Overall Feasibility Score: ${report.feasibility_score} / 100`, 14, 106);

    // Market Reach
    doc.setFontSize(11);
    doc.text('Market Reach & Demographic Intelligence (Estimated):', 14, 118);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`• 0-5 km Catchment: ~${report.market_reach.radius0to5km.estimatedConsumers.toLocaleString('en-IN')} consumers (${report.market_reach.radius0to5km.description})`, 18, 126);
    doc.text(`• 5-10 km Catchment: ~${report.market_reach.radius5to10km.estimatedConsumers.toLocaleString('en-IN')} consumers (${report.market_reach.radius5to10km.description})`, 18, 134);

    // SWOT Highlights
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Key Strengths:', 14, 148);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    report.swot.strengths.slice(0, 3).forEach((s, idx) => {
      doc.text(`- ${s}`, 18, 156 + idx * 6);
    });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Top Recommendations:', 14, 180);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    report.recommendations.slice(0, 3).forEach((r, idx) => {
      doc.text(`${idx + 1}. [${r.priority} Priority - ${r.category}] ${r.title}: ${r.recommendation}`, 18, 188 + idx * 8);
    });

    // Disclaimer
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(
      'Disclaimer: Financial amounts and scheme eligibility are estimates based on 10% promoter contribution and priority sector rules. Please consult your local branch manager.',
      14,
      280,
      { maxWidth: pageWidth - 28 }
    );

    doc.save(`GramBiz_Feasibility_Report_${analysis.district}_${analysis.business_type.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
    }
  };

  const badge = getScoreBadge(report.feasibility_score);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>AI Feasibility & Financial Structuring Report</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {analysis.business_type}
            </h1>
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm text-slate-500 mt-2 font-medium">
              <span className="flex items-center gap-1 text-slate-700">
                <MapPin className="w-4 h-4 text-emerald-600" />
                {analysis.village}, {analysis.block}, {analysis.district}, {analysis.state}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-slate-400" />
                {new Date(report.created_at).toLocaleDateString('en-IN', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleDownloadPDF}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition cursor-pointer shadow-xs"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Download PDF</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>{shareCopied ? 'Link Copied!' : 'Share'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsSaved(!isSaved)}
              className={`inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition cursor-pointer ${
                isSaved
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-emerald-600 text-emerald-600' : ''}`} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>

            <button
              type="button"
              onClick={onStartNewAnalysis}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold transition cursor-pointer shadow-xs"
            >
              <span>+ New Analysis</span>
            </button>
          </div>
        </div>

        {/* Top Scores & Key Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 items-center">
          {/* Main Feasibility Score Radial */}
          <div className="flex items-center gap-5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-200"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-500"
                  strokeDasharray={`${report.feasibility_score}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xl font-extrabold text-slate-900 leading-none">
                  {report.feasibility_score}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">/100</span>
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Overall Feasibility
              </div>
              <div className="text-lg font-bold text-slate-900 mt-0.5">{badge.label}</div>
              <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold mt-1 ${badge.bg} ${badge.color}`}>
                High Success Potential
              </span>
            </div>
          </div>

          {/* Radar Chart */}
          <div className="md:col-span-2 h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" />
                <Radar
                  name="Feasibility Score"
                  dataKey="A"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Financial Structure Summary Card */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            Financial & Loan Structuring (Deterministic 10% / 90%)
          </h3>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
            Verified Application Logic
          </span>
        </div>

        <FinancialCard
          financial={{
            availableMargin: analysis.available_margin,
            projectCost: analysis.project_cost,
            loanAmount: analysis.loan_amount,
            applicableScheme: {
              id: analysis.scheme_id,
              name: analysis.scheme_name || 'Term Loan Scheme',
              min_project_cost: 0,
              max_project_cost: 5000000,
              max_loan_amount: 4500000,
              funding_percentage: 90,
              interest_rate: analysis.scheme_id === 'scheme_micro_finance' ? 6.5 : 8.0,
              tenure_months: analysis.scheme_id === 'scheme_micro_finance' ? 36 : 84,
              moratorium_months: analysis.scheme_id === 'scheme_micro_finance' ? 3 : 6,
              active: true,
              created_at: '',
              updated_at: '',
            },
            interestRate: analysis.scheme_id === 'scheme_micro_finance' ? 6.5 : 8.0,
            tenureMonths: analysis.scheme_id === 'scheme_micro_finance' ? 36 : 84,
            moratoriumMonths: analysis.scheme_id === 'scheme_micro_finance' ? 3 : 6,
            monthlyEMI: Math.round((analysis.loan_amount * 0.08) / 12),
            isAboveSchemeLimit: false,
          }}
          language={language}
          onViewRepaymentPlan={() => setShowFullRepayment(!showFullRepayment)}
        />

        {showFullRepayment && (
          <div className="mt-4 pt-4 border-t border-slate-200 animate-in fade-in duration-200">
            <FinancialCalculator
              initialLoanAmount={analysis.loan_amount}
              initialRate={analysis.scheme_id === 'scheme_micro_finance' ? 6.5 : 8.0}
              initialTenureMonths={analysis.scheme_id === 'scheme_micro_finance' ? 36 : 84}
              initialMoratoriumMonths={analysis.scheme_id === 'scheme_micro_finance' ? 3 : 6}
              language={language}
            />
          </div>
        )}
      </div>

      {/* Market Reach & Customer Breakdown */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-600" />
              Market Reach & Demographic Catchment
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Demographic consumer estimates across local village clusters and block transport radius.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
            Estimated Data
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Catchment Radius Cards */}
          <div className="space-y-4 lg:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                  0 to 5 km Catchment (Immediate)
                </div>
                <div className="text-2xl font-bold text-emerald-950 mt-1">
                  ~{report.market_reach.radius0to5km.estimatedConsumers.toLocaleString('en-IN')}{' '}
                  <span className="text-xs font-normal text-emerald-700">Consumers</span>
                </div>
                <p className="text-xs text-emerald-800 mt-2 leading-relaxed">
                  {report.market_reach.radius0to5km.description}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
                <div className="text-xs font-semibold text-blue-800 uppercase tracking-wider">
                  5 to 10 km Catchment (Block Radius)
                </div>
                <div className="text-2xl font-bold text-blue-950 mt-1">
                  ~{report.market_reach.radius5to10km.estimatedConsumers.toLocaleString('en-IN')}{' '}
                  <span className="text-xs font-normal text-blue-700">Consumers</span>
                </div>
                <p className="text-xs text-blue-800 mt-2 leading-relaxed">
                  {report.market_reach.radius5to10km.description}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-600">Total Addressable Local Population</span>
              <span className="font-bold text-slate-900 text-sm">
                ~{report.market_reach.totalPotentialMarket.estimatedPopulation.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Customer Segment Breakdown */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
            <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Buyer Segment Distribution
            </div>
            <div className="h-36 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={segmentData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={55}
                    paddingAngle={3}
                  >
                    {segmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    formatter={(val: any) => [`${val}%`, 'Share']}
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '11px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1.5 mt-2">
              {segmentData.map((seg, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
                    <span className="text-slate-700 truncate">{seg.name}</span>
                  </div>
                  <span className="font-bold text-slate-900">{seg.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Opportunity Analysis Cards */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="mb-5">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            Identified Business Opportunities & Channels
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Viable product pathways and commercial off-take opportunities tailored to {analysis.district}.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {report.opportunity_analysis.map((opp) => (
            <div
              key={opp.id}
              className="p-5 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-xs transition bg-slate-50/50 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {opp.demandIndicator} Demand
                  </span>
                  <span className="text-[11px] font-medium text-slate-400">
                    Risk: <strong className="text-slate-700">{opp.riskLevel}</strong>
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1.5">{opp.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">{opp.whyItMayWork}</p>
              </div>

              <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">Est. Investment</span>
                <span className="font-bold text-emerald-700">{opp.investmentRequirement}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hyper-Local SWOT Matrix */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="mb-5">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-600" />
            Hyper-Local SWOT Analysis
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Internal operational capabilities vs external rural market environment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Strengths */}
          <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-3 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Strengths (Internal Advantages)
            </h4>
            <ul className="space-y-2 text-xs text-emerald-950">
              {report.swot.strengths.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-3 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Weaknesses (Operational Challenges)
            </h4>
            <ul className="space-y-2 text-xs text-amber-950">
              {report.swot.weaknesses.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Opportunities */}
          <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-800 mb-3 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              Opportunities (Market Tailwinds)
            </h4>
            <ul className="space-y-2 text-xs text-blue-950">
              {report.swot.opportunities.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Threats */}
          <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-200/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800 mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-rose-600" />
              Threats (External Risks)
            </h4>
            <ul className="space-y-2 text-xs text-rose-950">
              {report.swot.threats.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Local Risk Matrix & Mitigations */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="mb-5">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            Local Risk Analysis & Actionable Mitigations
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Key failure modes in rural enterprises and preventative safeguards.
          </p>
        </div>

        <div className="space-y-3">
          {report.local_risks.map((risk, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="font-bold text-slate-900 text-sm">{risk.category}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    risk.riskLevel === 'High'
                      ? 'bg-rose-100 text-rose-800'
                      : risk.riskLevel === 'Moderate' || risk.riskLevel === 'Medium'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {risk.riskLevel} Risk
                </span>
              </div>
              <p className="text-slate-600 mb-2 leading-relaxed">
                <strong>Vulnerability: </strong>
                {risk.explanation}
              </p>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950">
                <strong>Mitigation Strategy: </strong>
                {risk.mitigation}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Competitor & Pricing Intelligence Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Competitor Intelligence */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                Competitor Intelligence
              </h3>
              <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                Estimated Cluster
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5 mb-4 text-center">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-lg font-bold text-slate-900">
                  {report.competitor_analysis.businessesWithin5km}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Within 5 km</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-lg font-bold text-slate-900">
                  {report.competitor_analysis.businessesWithin10km}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Within 10 km</div>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                <div className="text-lg font-bold text-emerald-800">
                  {report.competitor_analysis.competitionLevel}
                </div>
                <div className="text-[10px] text-emerald-600 mt-0.5">Intensity</div>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              {report.competitor_analysis.localInsights}
            </p>
          </div>
        </div>

        {/* Pricing Intelligence */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Percent className="w-4 h-4 text-emerald-600" />
                Pricing & Unit Economics
              </h3>
              <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                Estimated Benchmarks
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] text-slate-400 block">Suggested Selling Price</span>
                <span className="text-sm font-bold text-emerald-700">
                  {report.pricing_analysis.suggestedSellingPrice}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] text-slate-400 block">Estimated Unit Margin</span>
                <span className="text-sm font-bold text-slate-900">
                  {report.pricing_analysis.unitMarginEstimate}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Local Market Price Range:</span>
                <span className="font-semibold text-slate-800">{report.pricing_analysis.localPriceRange}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Target Purchasing Power:</span>
                <span className="font-semibold text-slate-800">{report.pricing_analysis.customerPurchasingRange}</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 mt-3">
              <strong>Strategy: </strong>
              {report.pricing_analysis.recommendedPricingStrategy}
            </p>
          </div>
        </div>
      </div>

      {/* AI Business Advisor Recommendations */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="mb-5">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            AI Business Advisor Action Plan
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Top 3 sequential steps to de-risk capital and launch smoothly.
          </p>
        </div>

        <div className="space-y-3.5">
          {report.recommendations.map((rec, idx) => (
            <div
              key={rec.id || idx}
              className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-emerald-200 transition"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
                  {idx + 1}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{rec.title}</h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                      {rec.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium mt-1">{rec.recommendation}</p>
                  <p className="text-[11px] text-slate-500 mt-1">{rec.explanation}</p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-700 shrink-0 self-end sm:self-center">
                {rec.priority} Priority
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Verified vs Estimated Notes & Safety Disclaimer */}
      <div className="p-6 rounded-3xl bg-slate-900 text-slate-200 space-y-3">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
          <Info className="w-4 h-4" />
          Transparency & Financial Safety Disclosures
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
          <div>
            <span className="font-semibold text-white block mb-1">
              Verified Data & Application Rules:
            </span>
            <ul className="list-disc pl-4 space-y-1 text-slate-400">
              <li>10% Margin Capital to 90% Subsidized Loan formula is deterministic.</li>
              <li>Loan schemes (Micro Finance & Term Loan) match priority sector rules.</li>
            </ul>
          </div>
          <div>
            <span className="font-semibold text-white block mb-1">
              Estimated AI Market Intelligence:
            </span>
            <ul className="list-disc pl-4 space-y-1 text-slate-400">
              <li>Demographic catchments, competitor counts, and prices are indicative.</li>
              <li>Individual credit approval depends on bank appraisal and documentation.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
