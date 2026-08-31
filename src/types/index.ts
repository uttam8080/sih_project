export type Language = 'en' | 'hi' | 'or';

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  email?: string;
  phone: string;
  state: string;
  district: string;
  preferred_language: Language;
  role?: 'user' | 'admin';
  created_at: string;
}

export interface BusinessCategory {
  id: string;
  name: string;
  icon?: string;
  description: string;
  typical_margin_min: number;
  typical_project_cost: number;
  high_demand_districts?: string[];
  active: boolean;
  created_at: string;
}

export interface LoanScheme {
  id: string;
  name: string;
  description?: string;
  min_project_cost: number;
  max_project_cost: number;
  max_loan_amount: number;
  funding_percentage: number;
  interest_rate: number;
  tenure_months: number;
  moratorium_months: number;
  active: boolean;
  tags?: string[];
  created_at: string;
  updated_at?: string;
}

export interface FinancialCalculation {
  availableMargin: number;
  projectCost: number;
  loanAmount: number;
  marginPercentage: number;
  applicableScheme: LoanScheme | null;
  isAboveSchemeLimit: boolean;
  monthlyEMI: number;
  totalInterest: number;
  totalRepayment: number;
}

export interface AmortizationPeriod {
  period: number; // Month or Quarter
  label: string;
  openingBalance: number;
  principal: number;
  interest: number;
  payment: number;
  closingBalance: number;
  isMoratorium?: boolean;
}

export interface BusinessAnalysis {
  id: string;
  user_id: string;
  business_category_id: string;
  business_type: string;
  business_category_name?: string;
  state: string;
  district: string;
  block: string;
  village: string;
  available_margin: number;
  project_cost: number;
  loan_amount: number;
  scheme_id: string;
  scheme_name?: string;
  feasibility_score: number;
  status: 'draft' | 'completed' | 'archived';
  experience_level?: string;
  space_available?: string;
  team_size?: number;
  existing_equipment?: string;
  expected_customers?: string;
  created_at: string;
  report?: FeasibilityReport;
}

export interface CategoryScores {
  marketDemand: number;
  competition: number;
  capitalSuitability: number;
  growthPotential: number;
  risk: number;
  operationalFeasibility: number;
}

export interface MarketReachData {
  radius0to5km: {
    estimatedConsumers: number;
    description: string;
    isEstimate: boolean;
  };
  radius5to10km: {
    estimatedConsumers: number;
    description: string;
    isEstimate: boolean;
  };
  totalPotentialMarket: {
    estimatedPopulation: number;
    targetBuyersMonthly: number;
    isEstimate: boolean;
  };
  customerSegments: {
    name: string;
    sharePercentage: number;
    description: string;
  }[];
}

export interface OpportunityItem {
  id: string;
  title: string;
  whyItMayWork: string;
  demandIndicator: 'High' | 'Very High' | 'Moderate' | 'Growing';
  investmentRequirement: string;
  expectedDifficulty: 'Low' | 'Medium' | 'High';
  riskLevel: 'Low' | 'Moderate' | 'High';
}

export interface SWOTAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface LocalRiskItem {
  category: string; // Supply chain, Seasonal demand, Raw material volatility, etc.
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  explanation: string;
  mitigation: string;
}

export interface CompetitorIntelligence {
  estimatedSimilarBusinesses: number;
  businessesWithin5km: number;
  businessesWithin10km: number;
  competitionLevel: 'Low' | 'Medium' | 'High';
  localInsights: string;
  isEstimate: boolean;
  sampleCompetitors?: {
    name: string;
    distanceKm: number;
    approxScale: string;
  }[];
}

export interface PricingIntelligence {
  suggestedSellingPrice: string;
  localPriceRange: string;
  customerPurchasingRange: string;
  recommendedPricingStrategy: string;
  unitMarginEstimate: string;
  isEstimate: boolean;
}

export interface AIRecommendation {
  id: string;
  title: string;
  recommendation: string;
  explanation: string;
  priority: 'High' | 'Medium' | 'Low';
  category: 'Scale' | 'Finance' | 'Marketing' | 'Operations';
}

export interface FeasibilityReport {
  id: string;
  analysis_id: string;
  feasibility_score: number;
  category_scores: CategoryScores;
  market_reach: MarketReachData;
  opportunity_analysis: OpportunityItem[];
  swot: SWOTAnalysis;
  local_risks: LocalRiskItem[];
  competitor_analysis: CompetitorIntelligence;
  pricing_analysis: PricingIntelligence;
  recommendations: AIRecommendation[];
  ai_model: string;
  created_at: string;
  verified_data_notes?: string[];
  estimated_data_notes?: string[];
}

export interface RepaymentScheduleRecord {
  id: string;
  analysis_id: string;
  period: number;
  opening_balance: number;
  principal: number;
  interest: number;
  payment: number;
  closing_balance: number;
  created_at: string;
}

export interface MarketDataRecord {
  id: string;
  state: string;
  district: string;
  block?: string;
  business_category_id: string;
  business_category_name?: string;
  metric: string;
  value: string;
  source: string;
  data_date: string;
  created_at: string;
}

export interface CompetitorRecord {
  id: string;
  business_category_id: string;
  business_category_name?: string;
  state: string;
  district: string;
  block: string;
  village?: string;
  name: string;
  latitude: number;
  longitude: number;
  source: string;
  created_at: string;
}

export interface BusinessRecommendationCard {
  id: string;
  businessCategoryId: string;
  businessName: string;
  category: string;
  feasibilityScore: number;
  estimatedInvestment: string;
  marketDemand: 'High' | 'Very High' | 'Moderate';
  competition: 'Low' | 'Medium' | 'High';
  risk: 'Low' | 'Moderate' | 'High';
  potentialScalability: 'High' | 'Medium' | 'Very High';
  briefRationale: string;
  recommendedMarginMin: number;
}
