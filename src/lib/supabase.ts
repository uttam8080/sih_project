import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  UserProfile,
  BusinessCategory,
  LoanScheme,
  BusinessAnalysis,
  FeasibilityReport,
  RepaymentScheduleRecord,
  MarketDataRecord,
  CompetitorRecord,
} from '../types';
import {
  BUSINESS_CATEGORIES_DATA,
  DEFAULT_SCHEMES,
  SAMPLE_COMPETITORS,
  SAMPLE_MARKET_DATA,
  INITIAL_RECENT_ANALYSES,
} from '../data/seedData';

const supabaseUrl = ((import.meta as any).env?.VITE_SUPABASE_URL as string) || '';
const supabaseAnonKey = ((import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string) || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Local storage persistent fallback keys
const STORAGE_KEYS = {
  PROFILES: 'grambiz_profiles_v1',
  CATEGORIES: 'grambiz_categories_v1',
  SCHEMES: 'grambiz_schemes_v1',
  ANALYSES: 'grambiz_analyses_v1',
  REPORTS: 'grambiz_reports_v1',
  REPAYMENT_SCHEDULES: 'grambiz_repayment_schedules_v1',
  MARKET_DATA: 'grambiz_market_data_v1',
  COMPETITORS: 'grambiz_competitors_v1',
  CURRENT_USER: 'grambiz_current_user_v1',
};

// Safe Local Storage Initializer
function getStoredData<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function setStoredData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('Storage error:', err);
  }
}

// Initial storage bootstrap
export function initializeLocalStorage(): void {
  getStoredData(STORAGE_KEYS.CATEGORIES, BUSINESS_CATEGORIES_DATA);
  getStoredData(STORAGE_KEYS.SCHEMES, DEFAULT_SCHEMES);
  getStoredData(STORAGE_KEYS.COMPETITORS, SAMPLE_COMPETITORS);
  getStoredData(STORAGE_KEYS.MARKET_DATA, SAMPLE_MARKET_DATA);
  getStoredData(STORAGE_KEYS.ANALYSES, INITIAL_RECENT_ANALYSES);
}

// Ensure init on module evaluation
if (typeof window !== 'undefined') {
  initializeLocalStorage();
}

/**
 * High-level Database Repository API with Supabase + Local Resilience
 */
export const db = {
  // Profiles
  async getProfile(userId: string): Promise<UserProfile | null> {
    if (supabase) {
      const { data, error } = await supabase.from('profiles').select('*').eq('user_id', userId).single();
      if (!error && data) return data as UserProfile;
    }
    const profiles = getStoredData<UserProfile[]>(STORAGE_KEYS.PROFILES, []);
    return profiles.find((p) => p.user_id === userId || p.id === userId) || null;
  },

  async upsertProfile(profile: UserProfile): Promise<UserProfile> {
    if (supabase) {
      await supabase.from('profiles').upsert(profile);
    }
    const profiles = getStoredData<UserProfile[]>(STORAGE_KEYS.PROFILES, []);
    const existingIdx = profiles.findIndex((p) => p.user_id === profile.user_id || p.id === profile.id);
    if (existingIdx >= 0) {
      profiles[existingIdx] = profile;
    } else {
      profiles.push(profile);
    }
    setStoredData(STORAGE_KEYS.PROFILES, profiles);
    return profile;
  },

  // Business Categories
  async getCategories(): Promise<BusinessCategory[]> {
    if (supabase) {
      const { data, error } = await supabase.from('business_categories').select('*').eq('active', true);
      if (!error && data && data.length > 0) return data as BusinessCategory[];
    }
    return getStoredData<BusinessCategory[]>(STORAGE_KEYS.CATEGORIES, BUSINESS_CATEGORIES_DATA);
  },

  async saveCategory(category: BusinessCategory): Promise<BusinessCategory> {
    if (supabase) {
      await supabase.from('business_categories').upsert(category);
    }
    const list = getStoredData<BusinessCategory[]>(STORAGE_KEYS.CATEGORIES, BUSINESS_CATEGORIES_DATA);
    const idx = list.findIndex((c) => c.id === category.id);
    if (idx >= 0) list[idx] = category;
    else list.push(category);
    setStoredData(STORAGE_KEYS.CATEGORIES, list);
    return category;
  },

  // Loan Schemes
  async getSchemes(): Promise<LoanScheme[]> {
    if (supabase) {
      const { data, error } = await supabase.from('loan_schemes').select('*').order('min_project_cost', { ascending: true });
      if (!error && data && data.length > 0) return data as LoanScheme[];
    }
    return getStoredData<LoanScheme[]>(STORAGE_KEYS.SCHEMES, DEFAULT_SCHEMES);
  },

  async saveScheme(scheme: LoanScheme): Promise<LoanScheme> {
    if (supabase) {
      await supabase.from('loan_schemes').upsert(scheme);
    }
    const list = getStoredData<LoanScheme[]>(STORAGE_KEYS.SCHEMES, DEFAULT_SCHEMES);
    const idx = list.findIndex((s) => s.id === scheme.id);
    if (idx >= 0) list[idx] = scheme;
    else list.push(scheme);
    setStoredData(STORAGE_KEYS.SCHEMES, list);
    return scheme;
  },

  // Business Analyses
  async getAnalyses(userId?: string): Promise<BusinessAnalysis[]> {
    if (supabase && userId) {
      const { data, error } = await supabase
        .from('business_analyses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (!error && data) return data as BusinessAnalysis[];
    }
    const list = getStoredData<BusinessAnalysis[]>(STORAGE_KEYS.ANALYSES, INITIAL_RECENT_ANALYSES);
    if (userId) {
      return list.filter((a) => a.user_id === userId || a.user_id === 'user_default');
    }
    return list;
  },

  async getAnalysisById(id: string): Promise<BusinessAnalysis | null> {
    if (supabase) {
      const { data, error } = await supabase.from('business_analyses').select('*').eq('id', id).single();
      if (!error && data) return data as BusinessAnalysis;
    }
    const list = getStoredData<BusinessAnalysis[]>(STORAGE_KEYS.ANALYSES, INITIAL_RECENT_ANALYSES);
    return list.find((a) => a.id === id) || null;
  },

  async saveAnalysis(analysis: BusinessAnalysis): Promise<BusinessAnalysis> {
    if (supabase) {
      await supabase.from('business_analyses').upsert(analysis);
    }
    const list = getStoredData<BusinessAnalysis[]>(STORAGE_KEYS.ANALYSES, INITIAL_RECENT_ANALYSES);
    const idx = list.findIndex((a) => a.id === analysis.id);
    if (idx >= 0) list[idx] = analysis;
    else list.unshift(analysis);
    setStoredData(STORAGE_KEYS.ANALYSES, list);
    return analysis;
  },

  // Feasibility Reports
  async getReportByAnalysisId(analysisId: string): Promise<FeasibilityReport | null> {
    if (supabase) {
      const { data, error } = await supabase.from('feasibility_reports').select('*').eq('analysis_id', analysisId).single();
      if (!error && data) return data as FeasibilityReport;
    }
    const list = getStoredData<FeasibilityReport[]>(STORAGE_KEYS.REPORTS, []);
    return list.find((r) => r.analysis_id === analysisId) || null;
  },

  async saveReport(report: FeasibilityReport): Promise<FeasibilityReport> {
    if (supabase) {
      await supabase.from('feasibility_reports').upsert(report);
    }
    const list = getStoredData<FeasibilityReport[]>(STORAGE_KEYS.REPORTS, []);
    const idx = list.findIndex((r) => r.id === report.id || r.analysis_id === report.analysis_id);
    if (idx >= 0) list[idx] = report;
    else list.unshift(report);
    setStoredData(STORAGE_KEYS.REPORTS, list);
    return report;
  },

  // Competitors & Market Data
  async getCompetitors(district?: string, categoryId?: string): Promise<CompetitorRecord[]> {
    if (supabase) {
      let query = supabase.from('competitors').select('*');
      if (district) query = query.eq('district', district);
      if (categoryId) query = query.eq('business_category_id', categoryId);
      const { data, error } = await query;
      if (!error && data) return data as CompetitorRecord[];
    }
    let list = getStoredData<CompetitorRecord[]>(STORAGE_KEYS.COMPETITORS, SAMPLE_COMPETITORS);
    if (district) list = list.filter((c) => c.district.toLowerCase() === district.toLowerCase());
    if (categoryId) list = list.filter((c) => c.business_category_id === categoryId);
    return list;
  },

  async saveCompetitor(competitor: CompetitorRecord): Promise<CompetitorRecord> {
    if (supabase) {
      await supabase.from('competitors').upsert(competitor);
    }
    const list = getStoredData<CompetitorRecord[]>(STORAGE_KEYS.COMPETITORS, SAMPLE_COMPETITORS);
    const idx = list.findIndex((c) => c.id === competitor.id);
    if (idx >= 0) list[idx] = competitor;
    else list.push(competitor);
    setStoredData(STORAGE_KEYS.COMPETITORS, list);
    return competitor;
  },

  async getMarketData(district?: string): Promise<MarketDataRecord[]> {
    if (supabase) {
      let query = supabase.from('market_data').select('*');
      if (district) query = query.eq('district', district);
      const { data, error } = await query;
      if (!error && data) return data as MarketDataRecord[];
    }
    let list = getStoredData<MarketDataRecord[]>(STORAGE_KEYS.MARKET_DATA, SAMPLE_MARKET_DATA);
    if (district) list = list.filter((m) => m.district.toLowerCase() === district.toLowerCase());
    return list;
  },

  async saveMarketData(item: MarketDataRecord): Promise<MarketDataRecord> {
    if (supabase) {
      await supabase.from('market_data').upsert(item);
    }
    const list = getStoredData<MarketDataRecord[]>(STORAGE_KEYS.MARKET_DATA, SAMPLE_MARKET_DATA);
    const idx = list.findIndex((m) => m.id === item.id);
    if (idx >= 0) list[idx] = item;
    else list.push(item);
    setStoredData(STORAGE_KEYS.MARKET_DATA, list);
    return item;
  },
};

/**
 * PostgreSQL Schema & RLS Policies export for Supabase Setup
 */
export const SUPABASE_SQL_SCHEMA = `-- GramBiz AI PostgreSQL Schema & Row Level Security Setup for Supabase

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  state TEXT,
  district TEXT,
  preferred_language TEXT DEFAULT 'en',
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Business Categories Table
CREATE TABLE IF NOT EXISTS public.business_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  typical_margin_min NUMERIC DEFAULT 25000,
  typical_project_cost NUMERIC DEFAULT 250000,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Loan Schemes Table
CREATE TABLE IF NOT EXISTS public.loan_schemes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  min_project_cost NUMERIC NOT NULL,
  max_project_cost NUMERIC NOT NULL,
  max_loan_amount NUMERIC NOT NULL,
  funding_percentage NUMERIC DEFAULT 90,
  interest_rate NUMERIC NOT NULL,
  tenure_months INT NOT NULL,
  moratorium_months INT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Business Analyses Table
CREATE TABLE IF NOT EXISTS public.business_analyses (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  business_category_id TEXT REFERENCES public.business_categories(id),
  business_type TEXT NOT NULL,
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  block TEXT NOT NULL,
  village TEXT NOT NULL,
  available_margin NUMERIC NOT NULL,
  project_cost NUMERIC NOT NULL,
  loan_amount NUMERIC NOT NULL,
  scheme_id TEXT REFERENCES public.loan_schemes(id),
  feasibility_score INT DEFAULT 80,
  status TEXT DEFAULT 'completed',
  experience_level TEXT,
  space_available TEXT,
  team_size INT DEFAULT 1,
  existing_equipment TEXT,
  expected_customers TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Feasibility Reports Table (JSONB for Structured AI Sections)
CREATE TABLE IF NOT EXISTS public.feasibility_reports (
  id TEXT PRIMARY KEY,
  analysis_id TEXT REFERENCES public.business_analyses(id) ON DELETE CASCADE,
  feasibility_score INT NOT NULL,
  category_scores JSONB NOT NULL,
  market_reach JSONB NOT NULL,
  opportunity_analysis JSONB NOT NULL,
  strengths JSONB NOT NULL,
  weaknesses JSONB NOT NULL,
  opportunities JSONB NOT NULL,
  threats JSONB NOT NULL,
  local_risks JSONB NOT NULL,
  competitor_analysis JSONB NOT NULL,
  pricing_analysis JSONB NOT NULL,
  recommendations JSONB NOT NULL,
  ai_model TEXT DEFAULT 'gemini-3.7-flash',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Repayment Schedules Table
CREATE TABLE IF NOT EXISTS public.repayment_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id TEXT REFERENCES public.business_analyses(id) ON DELETE CASCADE,
  period INT NOT NULL,
  opening_balance NUMERIC NOT NULL,
  principal NUMERIC NOT NULL,
  interest NUMERIC NOT NULL,
  payment NUMERIC NOT NULL,
  closing_balance NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Market Data Table
CREATE TABLE IF NOT EXISTS public.market_data (
  id TEXT PRIMARY KEY,
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  block TEXT,
  business_category_id TEXT REFERENCES public.business_categories(id),
  metric TEXT NOT NULL,
  value TEXT NOT NULL,
  source TEXT NOT NULL,
  data_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Competitors Table
CREATE TABLE IF NOT EXISTS public.competitors (
  id TEXT PRIMARY KEY,
  business_category_id TEXT REFERENCES public.business_categories(id),
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  block TEXT NOT NULL,
  village TEXT,
  name TEXT NOT NULL,
  latitude NUMERIC NOT NULL,
  longitude NUMERIC NOT NULL,
  source TEXT DEFAULT 'Udyam / Panchayat Records',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security (RLS) Configuration
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feasibility_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repayment_schedules ENABLE ROW LEVEL SECURITY;

-- Public tables viewable by all users
ALTER TABLE public.business_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loan_schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on categories" ON public.business_categories FOR SELECT USING (true);
CREATE POLICY "Allow public read on schemes" ON public.loan_schemes FOR SELECT USING (true);
CREATE POLICY "Allow public read on market_data" ON public.market_data FOR SELECT USING (true);
CREATE POLICY "Allow public read on competitors" ON public.competitors FOR SELECT USING (true);

-- User specific RLS policies
CREATE POLICY "Users can manage their own profile" ON public.profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view and insert their own analyses" ON public.business_analyses FOR ALL USING (auth.uid()::text = user_id OR user_id = 'user_default');
CREATE POLICY "Users can view their reports" ON public.feasibility_reports FOR SELECT USING (true);
`;
