import React, { useState, useEffect } from 'react';
import {
  Compass,
  Sparkles,
  MapPin,
  IndianRupee,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Briefcase,
  Layers,
  ChevronRight,
  Filter,
  CheckCircle2,
} from 'lucide-react';
import {
  BusinessRecommendationCard,
  Language,
  UserProfile,
} from '../types';
import { INDIAN_STATES_DISTRICTS } from '../data/seedData';
import { formatINR } from '../lib/utils';
import { apiService } from '../services/apiService';
import { InfoTooltip } from './InfoTooltip';
import { translations } from '../lib/translations';

interface BusinessRecommendationsViewProps {
  currentUser: UserProfile | null;
  language: Language;
  initialLocation?: { state: string; district: string; block: string; village: string };
  initialMargin?: number;
  onSelectBusinessToAnalyze: (params: {
    state: string;
    district: string;
    block: string;
    village: string;
    margin: number;
    categoryId: string;
    businessType: string;
  }) => void;
}

export const BusinessRecommendationsView: React.FC<BusinessRecommendationsViewProps> = ({
  currentUser,
  language,
  initialLocation,
  initialMargin = 100000,
  onSelectBusinessToAnalyze,
}) => {
  const t = translations[language] || translations.en;

  const [state, setState] = useState<string>(
    initialLocation?.state || currentUser?.state || 'Odisha'
  );
  const [district, setDistrict] = useState<string>(
    initialLocation?.district || currentUser?.district || 'Ganjam'
  );
  const [block, setBlock] = useState<string>(initialLocation?.block || 'Hinjilicut');
  const [village, setVillage] = useState<string>(initialLocation?.village || 'Rampur Gram Panchayat');
  const [margin, setMargin] = useState<number>(initialMargin);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [recommendations, setRecommendations] = useState<BusinessRecommendationCard[]>([]);

  const availableDistricts = INDIAN_STATES_DISTRICTS[state]?.districts || ['Ganjam', 'Puri', 'Cuttack'];

  const fetchRecommendations = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.getBusinessRecommendations(
        { state, district, block, village },
        margin,
        language
      );
      setRecommendations(data);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [state, district]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-3">
            <Compass className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI Rural Business Discovery Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Which Business is Viable in Your Area?
          </h1>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            Discover ranked business opportunities tailored to your district's demographic consumption, local agricultural surplus, and available margin capital.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">{t.state}</label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 bg-white"
            >
              {Object.keys(INDIAN_STATES_DISTRICTS).map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">{t.district}</label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 bg-white"
            >
              {availableDistricts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">{t.availableMarginCapital}</label>
              <span className="text-xs font-bold text-emerald-700">{formatINR(margin)}</span>
            </div>
            <input
              type="number"
              min={5000}
              max={2000000}
              step={5000}
              value={margin}
              onChange={(e) => setMargin(Math.max(5000, Number(e.target.value) || 0))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-900"
            />
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={fetchRecommendations}
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition shadow-sm hover:shadow cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isLoading ? 'Scanning...' : 'Find Opportunities'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recommendations.map((rec, index) => (
          <div
            key={rec.id || index}
            className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-sm hover:border-emerald-300 hover:shadow-md transition flex flex-col justify-between group"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center shrink-0 border border-emerald-100 group-hover:scale-105 transition-transform">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider block">
                      {rec.category}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                      {rec.businessName}
                    </h3>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-extrabold">
                    <span>{rec.feasibilityScore}</span>
                    <span className="text-[10px] text-emerald-700 font-normal">/100</span>
                  </div>
                </div>
              </div>

              {/* Rationale */}
              <p className="text-xs text-slate-600 leading-relaxed mb-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                {rec.briefRationale}
              </p>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-2.5 mb-5 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">Market Demand</span>
                  <span className="font-bold text-emerald-700">{rec.marketDemand}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">Competition</span>
                  <span className="font-bold text-slate-800">{rec.competition}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">Est. Project Cost</span>
                  <span className="font-bold text-slate-900 truncate block">
                    {rec.estimatedInvestment}
                  </span>
                </div>
              </div>
            </div>

            {/* Launch Analysis Action */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
              <div className="text-[11px] text-slate-500">
                Min. Margin: <strong>{formatINR(rec.recommendedMarginMin)}</strong>
              </div>

              <button
                type="button"
                onClick={() =>
                  onSelectBusinessToAnalyze({
                    state,
                    district,
                    block,
                    village,
                    margin,
                    categoryId: rec.businessCategoryId,
                    businessType: rec.businessName,
                  })
                }
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs cursor-pointer group-hover:translate-x-0.5"
              >
                <span>Analyze Business</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
