import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  Briefcase,
  Layers,
  Database,
  Copy,
  Check,
  Plus,
  Edit2,
  Trash2,
  FileText,
  MapPin,
  IndianRupee,
} from 'lucide-react';
import {
  LoanScheme,
  BusinessCategory,
  BusinessAnalysis,
  MarketDataRecord,
  CompetitorRecord,
  Language,
} from '../types';
import { SUPABASE_SQL_SCHEMA } from '../lib/supabase';
import { formatINR } from '../lib/utils';
import { translations } from '../lib/translations';

interface AdminDashboardProps {
  schemes: LoanScheme[];
  categories: BusinessCategory[];
  analyses: BusinessAnalysis[];
  marketData: MarketDataRecord[];
  competitors: CompetitorRecord[];
  language: Language;
  onSaveScheme: (scheme: LoanScheme) => void;
  onSaveCategory: (category: BusinessCategory) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  schemes,
  categories,
  analyses,
  marketData,
  competitors,
  language,
  onSaveScheme,
  onSaveCategory,
}) => {
  const t = translations[language] || translations.en;

  const [activeTab, setActiveTab] = useState<
    'schemes' | 'categories' | 'analyses' | 'market' | 'competitors' | 'sql'
  >('schemes');
  const [copiedSql, setCopiedSql] = useState<boolean>(false);

  // Modal / Edit states for schemes
  const [editingScheme, setEditingScheme] = useState<LoanScheme | null>(null);
  const [editingCategory, setEditingCategory] = useState<BusinessCategory | null>(null);

  const handleCopySql = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2500);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-200 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
            <span>GramBiz Platform Administration</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Control Center</h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure loan schemes, business category taxonomies, market data indicators, and Supabase database schema.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap gap-1.5 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 self-start sm:self-auto">
          {[
            { id: 'schemes', label: 'Loan Schemes', icon: IndianRupee },
            { id: 'categories', label: 'Categories', icon: Briefcase },
            { id: 'analyses', label: 'All Analyses', icon: FileText },
            { id: 'market', label: 'Market Data', icon: Layers },
            { id: 'sql', label: 'PostgreSQL DDL & RLS', icon: Database },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SCHEMES TAB */}
      {activeTab === 'schemes' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Government Loan Schemes</h2>
            <button
              type="button"
              onClick={() =>
                setEditingScheme({
                  id: `scheme_${Date.now()}`,
                  name: 'New Custom Scheme',
                  min_project_cost: 0,
                  max_project_cost: 1000000,
                  max_loan_amount: 900000,
                  funding_percentage: 90,
                  interest_rate: 7.5,
                  tenure_months: 60,
                  moratorium_months: 6,
                  active: true,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                })
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Scheme</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-400 font-semibold border-b border-slate-100 uppercase text-[10px]">
                <tr>
                  <th className="px-4 py-3">Scheme Name</th>
                  <th className="px-4 py-3">Project Cost Range</th>
                  <th className="px-4 py-3">Max Loan</th>
                  <th className="px-4 py-3">Interest Rate</th>
                  <th className="px-4 py-3">Tenure</th>
                  <th className="px-4 py-3">Moratorium</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {schemes.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-bold text-slate-900">{s.name}</td>
                    <td className="px-4 py-3">
                      {formatINR(s.min_project_cost)} – {formatINR(s.max_project_cost)}
                    </td>
                    <td className="px-4 py-3 text-emerald-700 font-bold">{formatINR(s.max_loan_amount)}</td>
                    <td className="px-4 py-3">{s.interest_rate}% p.a.</td>
                    <td className="px-4 py-3">{s.tenure_months} mo</td>
                    <td className="px-4 py-3">{s.moratorium_months} mo</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Active
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => setEditingScheme(s)}
                        className="p-1 text-slate-400 hover:text-emerald-700 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Scheme Edit Modal */}
          {editingScheme && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
              <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
                <h3 className="text-base font-bold text-slate-900">Edit Loan Scheme Parameters</h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-semibold block mb-1">Scheme Name</label>
                    <input
                      type="text"
                      value={editingScheme.name}
                      onChange={(e) => setEditingScheme({ ...editingScheme, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold block mb-1">Max Project Cost (₹)</label>
                      <input
                        type="number"
                        value={editingScheme.max_project_cost}
                        onChange={(e) =>
                          setEditingScheme({ ...editingScheme, max_project_cost: Number(e.target.value) })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-200"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Max Loan Amount (₹)</label>
                      <input
                        type="number"
                        value={editingScheme.max_loan_amount}
                        onChange={(e) =>
                          setEditingScheme({ ...editingScheme, max_loan_amount: Number(e.target.value) })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-200"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Interest Rate (% p.a.)</label>
                      <input
                        type="number"
                        step={0.1}
                        value={editingScheme.interest_rate}
                        onChange={(e) =>
                          setEditingScheme({ ...editingScheme, interest_rate: Number(e.target.value) })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-200"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Tenure (Months)</label>
                      <input
                        type="number"
                        value={editingScheme.tenure_months}
                        onChange={(e) =>
                          setEditingScheme({ ...editingScheme, tenure_months: Number(e.target.value) })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-200"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingScheme(null)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onSaveScheme(editingScheme);
                      setEditingScheme(null);
                    }}
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CATEGORIES TAB */}
      {activeTab === 'categories' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Supported Business Categories</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((cat) => (
              <div key={cat.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="font-bold text-slate-900 text-sm">{cat.name}</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Active
                  </span>
                </div>
                <p className="text-slate-600 mb-3">{cat.description}</p>
                <div className="flex justify-between text-slate-500 text-[11px] pt-2 border-t border-slate-200">
                  <span>Min Margin: {formatINR(cat.typical_margin_min)}</span>
                  <span>Typical Cost: {formatINR(cat.typical_project_cost)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ALL ANALYSES AUDIT TAB */}
      {activeTab === 'analyses' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Generated Feasibility Analyses Audit Log</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-400 font-semibold border-b border-slate-100 uppercase text-[10px]">
                <tr>
                  <th className="px-4 py-3">Analysis ID</th>
                  <th className="px-4 py-3">Business</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3 text-right">Margin</th>
                  <th className="px-4 py-3 text-right">Project Cost</th>
                  <th className="px-4 py-3 text-right">Loan Amount</th>
                  <th className="px-4 py-3 text-center">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-xs">
                {analyses.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-400 font-sans">{a.id}</td>
                    <td className="px-4 py-3 font-sans font-bold text-slate-900">{a.business_type}</td>
                    <td className="px-4 py-3 font-sans">
                      {a.village}, {a.district}
                    </td>
                    <td className="px-4 py-3 text-right">{formatINR(a.available_margin)}</td>
                    <td className="px-4 py-3 text-right text-emerald-800">{formatINR(a.project_cost)}</td>
                    <td className="px-4 py-3 text-right font-bold text-blue-700">
                      {formatINR(a.loan_amount)}
                    </td>
                    <td className="px-4 py-3 text-center font-sans">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {a.feasibility_score}/100
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MARKET DATA TAB */}
      {activeTab === 'market' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900">District Market Benchmarks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {marketData.map((item) => (
              <div key={item.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900">{item.business_category_name}</span>
                  <span className="text-slate-400">
                    {item.district}, {item.state}
                  </span>
                </div>
                <div className="text-base font-extrabold text-emerald-700 my-1">{item.value}</div>
                <div className="text-slate-500">{item.metric}</div>
                <div className="text-[10px] text-slate-400 mt-2">Source: {item.source}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SQL DDL & RLS SCHEMA TAB */}
      {activeTab === 'sql' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Supabase PostgreSQL Schema & Row Level Security (RLS)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Full production DDL migration script for creating all 8 tables and security policies in Supabase.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCopySql}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer"
            >
              {copiedSql ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedSql ? 'Copied to Clipboard!' : 'Copy SQL Script'}</span>
            </button>
          </div>

          <pre className="p-5 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto max-h-96 leading-relaxed">
            {SUPABASE_SQL_SCHEMA}
          </pre>
        </div>
      )}
    </div>
  );
};
