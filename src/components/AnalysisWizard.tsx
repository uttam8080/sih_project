import React, { useState, useEffect } from 'react';
import {
  MapPin,
  IndianRupee,
  Briefcase,
  Layers,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  ShieldCheck,
  Building,
  Users,
  Compass,
  Loader2,
} from 'lucide-react';
import {
  BusinessCategory,
  Language,
  BusinessAnalysis,
  FeasibilityReport,
  UserProfile,
} from '../types';
import { INDIAN_STATES_DISTRICTS, SAMPLE_VILLAGES } from '../data/seedData';
import { formatINR, formatINRLakhs } from '../lib/utils';
import { calculateFinancialStructure } from '../lib/financialEngine';
import { apiService } from '../services/apiService';
import { InfoTooltip } from './InfoTooltip';
import { translations } from '../lib/translations';

interface AnalysisWizardProps {
  categories: BusinessCategory[];
  currentUser: UserProfile | null;
  language: Language;
  initialValues?: {
    state?: string;
    district?: string;
    block?: string;
    village?: string;
    margin?: number;
    categoryId?: string;
    businessType?: string;
  };
  onComplete: (analysis: BusinessAnalysis, report: FeasibilityReport) => void;
  onExploreRecommendations: (location: { state: string; district: string; block: string; village: string }, margin: number) => void;
  onCancel?: () => void;
}

export const AnalysisWizard: React.FC<AnalysisWizardProps> = ({
  categories,
  currentUser,
  language,
  initialValues,
  onComplete,
  onExploreRecommendations,
  onCancel,
}) => {
  const t = translations[language] || translations.en;

  const [step, setStep] = useState<number>(1);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [loadingProgressIndex, setLoadingProgressIndex] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Step 1: Location
  const [selectedState, setSelectedState] = useState<string>(
    initialValues?.state || currentUser?.state || 'Odisha'
  );
  const [selectedDistrict, setSelectedDistrict] = useState<string>(
    initialValues?.district || currentUser?.district || 'Ganjam'
  );
  const [blockName, setBlockName] = useState<string>(initialValues?.block || 'Hinjilicut');
  const [villageName, setVillageName] = useState<string>(
    initialValues?.village || 'Rampur Gram Panchayat'
  );

  // Step 2: Financial Margin
  const [marginCapital, setMarginCapital] = useState<number>(
    initialValues?.margin !== undefined ? initialValues.margin : 100000
  );

  // Step 3: Business Selection
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    initialValues?.categoryId || 'cat_dairy'
  );
  const [customBusinessType, setCustomBusinessType] = useState<string>(
    initialValues?.businessType || 'Dairy Farming & Milk Chilling Unit'
  );
  const [isUndecidedBusiness, setIsUndecidedBusiness] = useState<boolean>(false);

  // Step 4: Operational Details
  const [experienceLevel, setExperienceLevel] = useState<string>('2 years supporting family farm/trade');
  const [spaceAvailable, setSpaceAvailable] = useState<string>('Own 0.5 acre ancestral land / roadside plot');
  const [teamSize, setTeamSize] = useState<number>(2);
  const [existingEquipment, setExistingEquipment] = useState<string>('Power connection, basic storage shed & borewell');
  const [expectedCustomers, setExpectedCustomers] = useState<string>('Local village households, nearby tea stalls, and dairy cooperative milk booth');

  // Available districts based on selected state
  const availableDistricts = INDIAN_STATES_DISTRICTS[selectedState]?.districts || ['Ganjam', 'Puri', 'Cuttack'];
  const sampleBlocks =
    INDIAN_STATES_DISTRICTS[selectedState]?.blocks?.[selectedDistrict] || [
      'Hinjilicut',
      'Chhatrapur',
      'Digapahandi',
      'Central Block',
    ];

  // Update district if state changes
  useEffect(() => {
    if (!availableDistricts.includes(selectedDistrict)) {
      setSelectedDistrict(availableDistricts[0] || '');
    }
  }, [selectedState, availableDistricts, selectedDistrict]);

  // Live Deterministic Financial Calculation
  const financial = calculateFinancialStructure(marginCapital);

  // Loading animation sequence
  const loadingSteps = [
    'Analyzing your location and demographic catchment...',
    'Evaluating local market opportunity & demand deficits...',
    'Checking existing competitor presence & cluster data...',
    'Structuring debt-to-margin financing & scheme rules...',
    'Synthesizing customized AI SWOT & feasibility report...',
  ];

  useEffect(() => {
    let timer: any;
    if (isGenerating) {
      timer = setInterval(() => {
        setLoadingProgressIndex((prev) => {
          if (prev < loadingSteps.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 1200);
    }
    return () => clearInterval(timer);
  }, [isGenerating]);

  // Handle Category Select
  const handleCategorySelect = (category: BusinessCategory) => {
    setSelectedCategoryId(category.id);
    setCustomBusinessType(category.name);
    setIsUndecidedBusiness(false);
  };

  const handleNextStep = () => {
    setErrorMessage('');
    if (step === 1) {
      if (!selectedState || !selectedDistrict || !blockName.trim() || !villageName.trim()) {
        setErrorMessage('Please fill in all location fields (State, District, Block, and Village).');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (marginCapital < 5000) {
        setErrorMessage('Please enter a valid margin amount (minimum ₹5,000).');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (isUndecidedBusiness) {
        onExploreRecommendations(
          {
            state: selectedState,
            district: selectedDistrict,
            block: blockName,
            village: villageName,
          },
          marginCapital
        );
        return;
      }
      if (!selectedCategoryId) {
        setErrorMessage('Please select a business category or choose "I don\'t know what business to start".');
        return;
      }
      setStep(4);
    } else if (step === 4) {
      // Trigger Generation
      generateReport();
    }
  };

  const generateReport = async () => {
    setIsGenerating(true);
    setLoadingProgressIndex(0);
    setErrorMessage('');

    try {
      const selectedCategory = categories.find((c) => c.id === selectedCategoryId) || categories[0];

      const result = await apiService.generateFeasibilityAnalysis({
        userId: currentUser?.user_id || 'user_default',
        state: selectedState,
        district: selectedDistrict,
        block: blockName,
        village: villageName,
        margin: marginCapital,
        businessCategoryId: selectedCategory?.id || 'cat_dairy',
        businessCategoryName: selectedCategory?.name || 'Dairy Farming',
        businessType: customBusinessType || selectedCategory?.name || 'Micro Enterprise',
        experienceLevel,
        spaceAvailable,
        teamSize,
        existingEquipment,
        expectedCustomers,
        language,
      });

      // Small delay for smooth UX transition
      setTimeout(() => {
        setIsGenerating(false);
        onComplete(result.analysis, result.report);
      }, 1000);
    } catch (err: any) {
      setIsGenerating(false);
      setErrorMessage(err?.message || 'Unable to generate the report right now. Please try again.');
    }
  };

  // Step indicator labels
  const stepTitles = [
    'Location',
    'Financial Capacity',
    'Business Selection',
    'Operational Profile',
  ];

  if (isGenerating) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-sm text-center max-w-2xl mx-auto my-8">
        <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-30" />
          <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center shadow-inner">
            <Sparkles className="w-9 h-9 text-emerald-600 animate-pulse" />
          </div>
        </div>

        <h3 className="text-2xl font-bold text-slate-900 mb-2">Analyzing your local market...</h3>
        <p className="text-sm text-slate-500 mb-8 max-w-md mx-auto">
          GramBiz AI is evaluating market opportunities in{' '}
          <span className="font-semibold text-slate-700">
            {villageName}, {blockName}, {selectedDistrict}
          </span>
        </p>

        {/* Progress Timeline */}
        <div className="space-y-3.5 text-left max-w-md mx-auto">
          {loadingSteps.map((msg, idx) => {
            const isDone = idx < loadingProgressIndex;
            const isCurrent = idx === loadingProgressIndex;
            return (
              <div
                key={idx}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                  isCurrent
                    ? 'bg-emerald-50 text-emerald-900 font-semibold border border-emerald-200 shadow-xs'
                    : isDone
                    ? 'text-slate-600 bg-slate-50/50'
                    : 'text-slate-300'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 text-emerald-600 animate-spin shrink-0" />
                ) : (
                  <div className="w-5 h-5 rounded-full border border-slate-300 shrink-0" />
                )}
                <span className="text-xs sm:text-sm">{msg}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-xs text-slate-400">
          Applying 10% Margin × 90% Loan deterministic financing engine...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden max-w-3xl mx-auto">
      {/* Progress Bar & Header */}
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Step {step} of 4 — {stepTitles[step - 1]}
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-0.5">
              {step === 1 && 'Where do you want to start?'}
              {step === 2 && 'How much margin capital do you currently have?'}
              {step === 3 && 'What business are you planning to start?'}
              {step === 4 && 'A few operational details to tailor your plan'}
            </h2>
          </div>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="text-xs text-slate-500 hover:text-slate-700 font-medium px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Step dots */}
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                s <= step ? 'bg-emerald-600' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Form Body */}
      <div className="p-6 sm:p-8 space-y-6">
        {errorMessage && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs sm:text-sm flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold">Attention Required</div>
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        {/* STEP 1: LOCATION */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 text-xs text-emerald-900 leading-relaxed flex items-start gap-2.5">
              <MapPin className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Hyper-Local Intelligence Engine: </span>
                Our AI analyzes exact district consumer catchments, rural weekly haats, local commodity price benchmarks, and competitor densities based on your village location.
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* State */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">{t.state}</label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                >
                  {Object.keys(INDIAN_STATES_DISTRICTS).map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* District */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">{t.district}</label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                >
                  {availableDistricts.map((dst) => (
                    <option key={dst} value={dst}>
                      {dst}
                    </option>
                  ))}
                </select>
              </div>

              {/* Block */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">{t.block}</label>
                  <span className="text-[11px] text-slate-400">Tehsil / Sub-district</span>
                </div>
                <input
                  type="text"
                  placeholder="e.g. Hinjilicut, Nimapada"
                  value={blockName}
                  onChange={(e) => setBlockName(e.target.value)}
                  list="block-suggestions"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <datalist id="block-suggestions">
                  {sampleBlocks.map((b) => (
                    <option key={b} value={b} />
                  ))}
                </datalist>
              </div>

              {/* Village */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">{t.village}</label>
                  <span className="text-[11px] text-slate-400">Gram Panchayat</span>
                </div>
                <input
                  type="text"
                  placeholder="e.g. Rampur Gram Panchayat"
                  value={villageName}
                  onChange={(e) => setVillageName(e.target.value)}
                  list="village-suggestions"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <datalist id="village-suggestions">
                  {SAMPLE_VILLAGES.map((v) => (
                    <option key={v} value={v} />
                  ))}
                </datalist>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: FINANCIAL CAPACITY */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-bold text-slate-900 flex items-center">
                  {t.availableMarginCapital} (₹)
                  <InfoTooltip
                    title={t.availableMarginCapital}
                    content={t.availableMarginDesc}
                  />
                </label>
                <span className="text-base font-bold text-emerald-700">
                  {formatINR(marginCapital)}
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-3">
                Enter your available personal savings. The system will calculate your project capacity deterministically.
              </p>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold text-base">
                  ₹
                </div>
                <input
                  type="number"
                  min={5000}
                  max={2000000}
                  step={5000}
                  value={marginCapital}
                  onChange={(e) => setMarginCapital(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full pl-9 pr-4 py-3.5 rounded-2xl border-2 border-emerald-500/80 text-xl font-bold text-slate-900 focus:ring-4 focus:ring-emerald-500/20 focus:outline-none"
                />
              </div>

              {/* Quick Margin Preset Chips */}
              <div className="flex flex-wrap gap-2 mt-3">
                {[12000, 25000, 50000, 100000, 200000, 500000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setMarginCapital(val)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition cursor-pointer ${
                      marginCapital === val
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {formatINR(val)}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Deterministic Calculation Output Cards */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 pb-3 border-b border-slate-200">
                <span>Deterministic Financial Structuring</span>
                <span className="text-emerald-700">10% Margin / 90% Loan Rule</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-500 font-medium">Available Margin</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">
                    {formatINR(financial.availableMargin)}
                  </div>
                  <div className="text-[10px] text-slate-400">10% Your Capital</div>
                </div>

                <div className="bg-emerald-50/80 p-3.5 rounded-xl border border-emerald-200">
                  <div className="text-xs text-emerald-800 font-medium">{t.projectCost}</div>
                  <div className="text-lg font-bold text-emerald-900 mt-0.5">
                    {formatINR(financial.projectCost)}
                  </div>
                  <div className="text-[10px] text-emerald-700">Margin ÷ 0.10 (10x leverage)</div>
                </div>

                <div className="bg-blue-50/80 p-3.5 rounded-xl border border-blue-200">
                  <div className="text-xs text-blue-800 font-medium">{t.loanAmount}</div>
                  <div className="text-lg font-bold text-blue-900 mt-0.5">
                    {formatINR(financial.loanAmount)}
                  </div>
                  <div className="text-[10px] text-blue-700">Project Cost × 90%</div>
                </div>
              </div>

              {/* Explanatory Callout */}
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed">
                <p className="font-semibold text-slate-800 mb-0.5">
                  How this works:
                </p>
                <p>
                  "Your margin is assumed to represent 10% of the project cost." Under government priority enterprise schemes, a ₹{marginCapital.toLocaleString('en-IN')} contribution allows you to establish a business worth ₹{financial.projectCost.toLocaleString('en-IN')}, backed by a ₹{financial.loanAmount.toLocaleString('en-IN')} subsidized loan facility.
                </p>
              </div>

              {/* Scheme Route Banner */}
              {financial.applicableScheme ? (
                <div className="p-3 bg-emerald-100/60 rounded-xl border border-emerald-300 text-emerald-950 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>
                      Matched: <strong>{financial.applicableScheme.name}</strong> ({financial.applicableScheme.interest_rate}% p.a., {financial.applicableScheme.tenure_months}m tenure)
                    </span>
                  </div>
                  <span className="font-bold text-emerald-800 text-[11px]">
                    {financial.applicableScheme.moratorium_months}m Moratorium
                  </span>
                </div>
              ) : financial.isAboveSchemeLimit ? (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-300 text-amber-900 text-xs">
                  Your current margin capital would imply a project size above the maximum supported under these schemes (Max ₹50 Lakh).
                </div>
              ) : null}
            </div>
          </div>
        )}

        {/* STEP 3: BUSINESS SELECTION */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Undecided Button Card */}
            <div
              onClick={() => {
                setIsUndecidedBusiness(true);
                handleNextStep();
              }}
              className="p-5 rounded-2xl border-2 border-dashed border-emerald-400 bg-emerald-50/50 hover:bg-emerald-100/60 transition cursor-pointer text-center group"
            >
              <Compass className="w-8 h-8 text-emerald-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="text-base font-bold text-emerald-900">
                I don't know what business to start
              </h4>
              <p className="text-xs text-emerald-700 mt-1 max-w-md mx-auto">
                Let our AI recommend the top viable businesses in <strong>{selectedDistrict}</strong> matched to your ₹{marginCapital.toLocaleString('en-IN')} margin.
              </p>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 mt-3 group-hover:translate-x-1 transition-transform">
                <span>Discover AI Business Recommendations</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider absolute">
                Or choose an industry
              </span>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
              {categories.map((cat) => {
                const isSelected = selectedCategoryId === cat.id && !isUndecidedBusiness;
                return (
                  <div
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat)}
                    className={`p-3.5 rounded-xl border-2 transition cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/70 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-slate-900 truncate">
                        {cat.name}
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                        {cat.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Specific Business Name Custom Input */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-semibold text-slate-700">
                Specific Venture Name / Product Focus
              </label>
              <input
                type="text"
                value={customBusinessType}
                onChange={(e) => setCustomBusinessType(e.target.value)}
                placeholder="e.g. Dairy Farming & Milk Chilling Unit, Mini Oil Expeller Mill"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* STEP 4: OPERATIONAL DETAILS */}
        {step === 4 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <p className="text-xs text-slate-500">
              Provide additional optional context so the AI can generate hyper-specific SWOT and mitigating steps.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Previous Experience</label>
                <input
                  type="text"
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  placeholder="e.g. 2 years family farm, RSETI certificate"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Available Space / Shop</label>
                <input
                  type="text"
                  value={spaceAvailable}
                  onChange={(e) => setSpaceAvailable(e.target.value)}
                  placeholder="e.g. Own 200 sq ft shop at chowk, 0.5 acre plot"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">People Involved (Team Size)</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={teamSize}
                  onChange={(e) => setTeamSize(Number(e.target.value) || 1)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Existing Equipment / Infrastructure</label>
                <input
                  type="text"
                  value={existingEquipment}
                  onChange={(e) => setExistingEquipment(e.target.value)}
                  placeholder="e.g. Single phase power, storage shed, borewell"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Expected Customer Channels</label>
                <input
                  type="text"
                  value={expectedCustomers}
                  onChange={(e) => setExpectedCustomers(e.target.value)}
                  placeholder="e.g. Village households, local tea stalls, weekly haats"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-4">
        {step > 1 ? (
          <button
            type="button"
            onClick={() => {
              setErrorMessage('');
              setStep(step - 1);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs sm:text-sm transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        ) : (
          <div />
        )}

        <button
          type="button"
          onClick={handleNextStep}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition shadow-sm hover:shadow cursor-pointer"
        >
          <span>{step === 4 ? 'Generate Feasibility Report →' : 'Continue →'}</span>
        </button>
      </div>
    </div>
  );
};
