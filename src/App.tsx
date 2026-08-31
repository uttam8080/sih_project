import React, { useState, useEffect } from 'react';
import {
  BusinessCategory,
  LoanScheme,
  BusinessAnalysis,
  FeasibilityReport,
  MarketDataRecord,
  CompetitorRecord,
  UserProfile,
  Language,
} from './types';
import { db } from './lib/supabase';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPageView } from './components/LandingPageView';
import { DashboardView } from './components/DashboardView';
import { AnalysisWizard } from './components/AnalysisWizard';
import { FeasibilityReportView } from './components/FeasibilityReportView';
import { BusinessRecommendationsView } from './components/BusinessRecommendationsView';
import { FinancialCalculator } from './components/FinancialCalculator';
import { GovernmentSchemesView } from './components/GovernmentSchemesView';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';

export const App: React.FC = () => {
  // Navigation State
  const [currentView, setCurrentView] = useState<string>('landing');
  const [language, setLanguage] = useState<Language>('en');

  // User Auth State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('grambiz_current_user_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    // Default demo entrepreneur profile
    return {
      id: 'user_ramesh_odisha',
      user_id: 'user_ramesh_odisha',
      full_name: 'Ramesh Patel',
      phone: '9861012345',
      state: 'Odisha',
      district: 'Ganjam',
      preferred_language: 'en',
      role: 'user',
      created_at: new Date().toISOString(),
    };
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Core Data Collections
  const [categories, setCategories] = useState<BusinessCategory[]>([]);
  const [schemes, setSchemes] = useState<LoanScheme[]>([]);
  const [analyses, setAnalyses] = useState<BusinessAnalysis[]>([]);
  const [marketData, setMarketData] = useState<MarketDataRecord[]>([]);
  const [competitors, setCompetitors] = useState<CompetitorRecord[]>([]);

  // Active Report Details
  const [activeAnalysis, setActiveAnalysis] = useState<BusinessAnalysis | null>(null);
  const [activeReport, setActiveReport] = useState<FeasibilityReport | null>(null);

  // Wizard Props Transition
  const [wizardParams, setWizardParams] = useState<any>(null);

  // Recommendations Props Transition
  const [recParams, setRecParams] = useState<any>(null);

  // Initial Data Fetch
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [cats, schs, ans, mkt, comps] = await Promise.all([
          db.getCategories(),
          db.getSchemes(),
          db.getAnalyses(),
          db.getMarketData(),
          db.getCompetitors(),
        ]);
        setCategories(cats);
        setSchemes(schs);
        setAnalyses(ans);
        setMarketData(mkt);
        setCompetitors(comps);
      } catch (err) {
        console.error('Error loading data:', err);
      }
    };
    loadInitialData();
  }, []);

  // Save current user to storage
  const handleAuthSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('grambiz_current_user_v1', JSON.stringify(user));
    } catch {}
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('grambiz_current_user_v1');
    } catch {}
  };

  // Launch Wizard with parameters
  const handleStartWizardWithParams = (params: any) => {
    setWizardParams(params);
    setCurrentView('wizard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Wizard Completion Callback
  const handleWizardComplete = (analysis: BusinessAnalysis, report: FeasibilityReport) => {
    setActiveAnalysis(analysis);
    setActiveReport(report);
    setAnalyses((prev) => [analysis, ...prev.filter((a) => a.id !== analysis.id)]);
    setCurrentView('report');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // View Existing Analysis from Dashboard
  const handleViewAnalysis = async (analysis: BusinessAnalysis) => {
    setActiveAnalysis(analysis);
    let report = await db.getReportByAnalysisId(analysis.id);
    if (!report) {
      // Create a fallback report if one wasn't explicitly saved
      report = {
        id: `rep_${analysis.id}`,
        analysis_id: analysis.id,
        feasibility_score: analysis.feasibility_score || 84,
        category_scores: {
          marketDemand: 88,
          competition: 74,
          capitalSuitability: 92,
          growthPotential: 85,
          risk: 70,
          operationalFeasibility: 89,
        },
        market_reach: {
          radius0to5km: {
            estimatedConsumers: 14000,
            description: `Direct accessibility across ${analysis.village} and surrounding settlements.`,
            isEstimate: true,
          },
          radius5to10km: {
            estimatedConsumers: 42000,
            description: `Connecting ${analysis.block} sub-district markets and weekly haats.`,
            isEstimate: true,
          },
          totalPotentialMarket: {
            estimatedPopulation: 65000,
            targetBuyersMonthly: 2600,
            isEstimate: true,
          },
          customerSegments: [
            { name: 'Rural Households', sharePercentage: 55, description: 'Direct daily consumption' },
            { name: 'Local Tea Stalls & Eateries', sharePercentage: 25, description: 'Recurring bulk supplies' },
            { name: 'Cooperatives / Traders', sharePercentage: 20, description: 'Contract collection points' },
          ],
        },
        opportunity_analysis: [
          {
            id: 'opp_1',
            title: 'Direct Village & Haat Retail',
            whyItMayWork: `Eliminates intermediaries in ${analysis.district} to capture full retail margin.`,
            demandIndicator: 'High',
            investmentRequirement: `₹${(analysis.available_margin * 0.4).toLocaleString('en-IN')}`,
            expectedDifficulty: 'Low',
            riskLevel: 'Low',
          },
          {
            id: 'opp_2',
            title: 'Value-Added Local Packaging',
            whyItMayWork: 'Branded packaging fetches a 20-35% price premium over loose bulk commodities.',
            demandIndicator: 'Very High',
            investmentRequirement: `₹${(analysis.available_margin * 0.6).toLocaleString('en-IN')}`,
            expectedDifficulty: 'Medium',
            riskLevel: 'Moderate',
          },
        ],
        swot: {
          strengths: [
            `Direct premises access in ${analysis.village}`,
            `Subsidized 90% debt under ${analysis.scheme_name || 'Government Scheme'}`,
            'Family labor participation reduces overhead wages',
            'Strong local trust network with community buyers',
          ],
          weaknesses: [
            'Initial 3-month working capital discipline required',
            'Dependence on local single-phase electric grid stability',
            'Pressure for informal customer credit',
          ],
          opportunities: [
            `Expansion into adjoining blocks across ${analysis.district}`,
            'Digital UPI payments to eliminate cash delays',
            'Sourcing partnerships with local SHGs and farmer producer organizations',
          ],
          threats: [
            'Seasonal raw material price fluctuations',
            'Monsoon logistics slowdowns on unpaved rural roads',
            'Price discounting from large regional city wholesalers',
          ],
        },
        local_risks: [
          {
            category: 'Raw Material & Supply Chain',
            riskLevel: 'Medium',
            explanation: `Commodity costs in ${analysis.district} fluctuate across non-harvest seasons.`,
            mitigation: 'Establish forward supply agreements with 2-3 local farmer groups.',
          },
          {
            category: 'Customer Credit & Working Capital',
            riskLevel: 'Medium',
            explanation: 'Excessive credit sales can strain daily cash liquidity.',
            mitigation: 'Cap credit limits per buyer and incentivize instant cash/UPI payments.',
          },
        ],
        competitor_analysis: {
          estimatedSimilarBusinesses: 3,
          businessesWithin5km: 1,
          businessesWithin10km: 2,
          competitionLevel: 'Low',
          localInsights: `Underserved demand within ${analysis.village}; local buyers currently travel 7km to ${analysis.block}.`,
          isEstimate: true,
        },
        pricing_analysis: {
          suggestedSellingPrice: '₹42 – ₹48 / unit',
          localPriceRange: '₹40 – ₹52 / unit',
          customerPurchasingRange: '₹35 – ₹50 / unit',
          recommendedPricingStrategy: 'Penetration pricing: offer superior freshness at competitive rates.',
          unitMarginEstimate: '22% – 28%',
          isEstimate: true,
        },
        recommendations: [
          {
            id: 'rec_1',
            title: 'Staged Initial Scaling',
            recommendation: 'Operate at 50% capacity for the first 90 days to test supply-chain stability.',
            explanation: 'Allows smooth adjustment during the scheme moratorium period without cash strain.',
            priority: 'High',
            category: 'Scale',
          },
          {
            id: 'rec_2',
            title: 'Multi-Channel Distribution',
            recommendation: 'Split sales across direct households (60%) and local retail/dhabas (40%).',
            explanation: 'Protects daily cash collections even if one institutional buyer delays settlement.',
            priority: 'High',
            category: 'Marketing',
          },
        ],
        ai_model: 'gemini-3.7-flash',
        created_at: analysis.created_at,
      };
    }
    setActiveReport(report);
    setCurrentView('report');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open Recommendations with Location
  const handleOpenRecommendationsWithLocation = (
    loc: { state: string; district: string; block: string; village: string },
    margin: number
  ) => {
    setRecParams({ location: loc, margin });
    setCurrentView('recommendations');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Admin Scheme / Category Saves
  const handleSaveScheme = async (scheme: LoanScheme) => {
    await db.saveScheme(scheme);
    const updated = await db.getSchemes();
    setSchemes(updated);
  };

  const handleSaveCategory = async (cat: BusinessCategory) => {
    await db.saveCategory(cat);
    const updated = await db.getCategories();
    setCategories(updated);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        language={language}
        currentUser={currentUser}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onLanguageChange={(l) => setLanguage(l)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onStartAnalysis={() => {
          setWizardParams(null);
          setCurrentView('wizard');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {currentView === 'landing' && (
          <LandingPageView
            categories={categories}
            language={language}
            onStartWizardWithParams={handleStartWizardWithParams}
            onOpenRecommendations={() => {
              setRecParams(null);
              setCurrentView('recommendations');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenCalculator={() => {
              setCurrentView('calculator');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenSchemes={() => {
              setCurrentView('schemes');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'dashboard' && (
          <DashboardView
            currentUser={currentUser}
            analyses={analyses}
            language={language}
            onStartNewAnalysis={() => {
              setWizardParams(null);
              setCurrentView('wizard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenRecommendations={() => {
              setRecParams(null);
              setCurrentView('recommendations');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenCalculator={() => {
              setCurrentView('calculator');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onViewAnalysis={handleViewAnalysis}
          />
        )}

        {currentView === 'wizard' && (
          <AnalysisWizard
            categories={categories}
            currentUser={currentUser}
            language={language}
            initialValues={wizardParams}
            onComplete={handleWizardComplete}
            onExploreRecommendations={handleOpenRecommendationsWithLocation}
            onCancel={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'report' && activeAnalysis && activeReport && (
          <FeasibilityReportView
            analysis={activeAnalysis}
            report={activeReport}
            language={language}
            onStartNewAnalysis={() => {
              setWizardParams(null);
              setCurrentView('wizard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenCalculator={() => {
              setCurrentView('calculator');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'recommendations' && (
          <BusinessRecommendationsView
            currentUser={currentUser}
            language={language}
            initialLocation={recParams?.location}
            initialMargin={recParams?.margin || 100000}
            onSelectBusinessToAnalyze={(params) => {
              setWizardParams(params);
              setCurrentView('wizard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'calculator' && (
          <div className="space-y-6">
            <FinancialCalculator language={language} />
          </div>
        )}

        {currentView === 'schemes' && (
          <GovernmentSchemesView
            schemes={schemes}
            language={language}
            onSelectSchemeToCalculate={(margin) => {
              setWizardParams({
                state: 'Odisha',
                district: 'Ganjam',
                block: 'Hinjilicut',
                village: 'Rampur Gram Panchayat',
                margin,
                categoryId: 'cat_dairy',
                businessType: 'Dairy Farming & Milk Chilling Unit',
              });
              setCurrentView('wizard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboard
            schemes={schemes}
            categories={categories}
            analyses={analyses}
            marketData={marketData}
            competitors={competitors}
            language={language}
            onSaveScheme={handleSaveScheme}
            onSaveCategory={handleSaveCategory}
          />
        )}
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        language={language}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Footer */}
      <Footer
        language={language}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onLanguageChange={(l) => setLanguage(l)}
      />
    </div>
  );
};

export default App;
