import React, { useState } from 'react';
import {
  Sparkles,
  Globe,
  User,
  LogOut,
  Compass,
  FileText,
  Calculator,
  ShieldCheck,
  Menu,
  X,
  ChevronDown,
  Plus,
} from 'lucide-react';
import { Language, UserProfile } from '../types';
import { translations } from '../lib/translations';

interface NavbarProps {
  currentView: string;
  language: Language;
  currentUser: UserProfile | null;
  onNavigate: (view: string) => void;
  onLanguageChange: (lang: Language) => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  onStartAnalysis: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  language,
  currentUser,
  onNavigate,
  onLanguageChange,
  onOpenAuth,
  onLogout,
  onStartAnalysis,
}) => {
  const t = translations[language] || translations.en;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const navLinks = [
    { id: 'landing', label: 'Home' },
    { id: 'dashboard', label: t.dashboard },
    { id: 'recommendations', label: t.findViableBusinesses },
    { id: 'calculator', label: t.repaymentCalculator },
    { id: 'schemes', label: 'Govt Schemes' },
  ];

  if (currentUser?.role === 'admin') {
    navLinks.push({ id: 'admin', label: 'Admin' });
  }

  const languages: { code: Language; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिंदी' },
    { code: 'or', label: 'Odia', native: 'ଓଡ଼ିଆ' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Brand Logo */}
          <div
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-sm ring-1 ring-emerald-600/20 group-hover:scale-105 transition-transform bg-emerald-900">
              <img
                src="/grambiz-logo.png"
                alt="GramBiz AI Logo"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-slate-900 flex items-center gap-1">
                GramBiz <span className="text-emerald-700 font-extrabold text-sm px-1.5 py-0.2 bg-emerald-100 rounded-md">AI</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-400 block -mt-0.5 tracking-wide">
                Rural Advisory & Financing
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-50/80 p-1.5 rounded-2xl border border-slate-200/80">
            {navLinks.map((link) => {
              const isActive = currentView === link.id;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => onNavigate(link.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    isActive
                      ? 'bg-white text-emerald-800 shadow-xs border border-slate-200/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="flex items-center gap-2.5">
            {/* Language Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-600" />
                <span className="uppercase">{language}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => {
                        onLanguageChange(l.code);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs font-medium flex items-center justify-between hover:bg-emerald-50 transition cursor-pointer ${
                        language === l.code ? 'text-emerald-700 font-bold bg-emerald-50/50' : 'text-slate-700'
                      }`}
                    >
                      <span>{l.native}</span>
                      <span className="text-[10px] text-slate-400 uppercase">{l.code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Launch Button */}
            <button
              type="button"
              onClick={onStartAnalysis}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-xs hover:shadow cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.startNewAnalysis}</span>
            </button>

            {/* User Profile / Login */}
            {currentUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div
                  onClick={() => onNavigate('dashboard')}
                  className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center cursor-pointer border border-emerald-300"
                  title={currentUser.full_name}
                >
                  {currentUser.full_name.charAt(0).toUpperCase()}
                </div>
                <button
                  type="button"
                  onClick={onLogout}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                className="px-4 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-xs transition cursor-pointer"
              >
                Sign In
              </button>
            )}

            {/* Mobile menu trigger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-slate-100 space-y-1 animate-in fade-in">
            {navLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => {
                  onNavigate(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  currentView === link.id
                    ? 'bg-emerald-50 text-emerald-900'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                onStartAnalysis();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 text-white mt-2"
            >
              + {t.startNewAnalysis}
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
