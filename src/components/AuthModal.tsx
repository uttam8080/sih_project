import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  Sparkles,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import { UserProfile, Language } from '../types';
import { INDIAN_STATES_DISTRICTS } from '../data/seedData';
import { translations } from '../lib/translations';

interface AuthModalProps {
  isOpen: boolean;
  language: Language;
  onClose: () => void;
  onAuthSuccess: (profile: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  language,
  onClose,
  onAuthSuccess,
}) => {
  const t = translations[language] || translations.en;

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState<string>('entrepreneur@grambiz.ai');
  const [password, setPassword] = useState<string>('password123');
  const [fullName, setFullName] = useState<string>('Ramesh Kumar');
  const [phone, setPhone] = useState<string>('9876543210');
  const [selectedState, setSelectedState] = useState<string>('Odisha');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Ganjam');
  const [prefLang, setPrefLang] = useState<Language>(language);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user: UserProfile = {
      id: `user_${Date.now()}`,
      user_id: `user_${Date.now()}`,
      full_name: fullName || 'Rural Entrepreneur',
      phone,
      state: selectedState,
      district: selectedDistrict,
      preferred_language: prefLang,
      role: 'user',
      created_at: new Date().toISOString(),
    };
    onAuthSuccess(user);
    onClose();
  };

  const handleQuickDemoLogin = (profileType: 'odisha_dairy' | 'up_shg' | 'admin') => {
    let demoUser: UserProfile;
    if (profileType === 'odisha_dairy') {
      demoUser = {
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
    } else if (profileType === 'up_shg') {
      demoUser = {
        id: 'user_pooja_up',
        user_id: 'user_pooja_up',
        full_name: 'Pooja Devi (SHG Lead)',
        phone: '9450098765',
        state: 'Uttar Pradesh',
        district: 'Varanasi',
        preferred_language: 'hi',
        role: 'user',
        created_at: new Date().toISOString(),
      };
    } else {
      demoUser = {
        id: 'user_admin',
        user_id: 'user_admin',
        full_name: 'GramBiz District Officer',
        phone: '9999988888',
        state: 'Odisha',
        district: 'Ganjam',
        preferred_language: 'en',
        role: 'admin',
        created_at: new Date().toISOString(),
      };
    }
    onAuthSuccess(demoUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6 text-center">
          <div className="w-14 h-14 rounded-2xl overflow-hidden ring-1 ring-emerald-600/20 shadow-md flex items-center justify-center mx-auto mb-3 bg-emerald-900">
            <img
              src="/grambiz-logo.png"
              alt="GramBiz AI Logo"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            {mode === 'login' ? 'Welcome to GramBiz AI' : 'Create Entrepreneur Account'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Access hyper-local business feasibility reports and save your financial planning profiles.
          </p>
        </div>

        {/* Quick Demo Sign In Chips */}
        <div className="mb-6 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
            1-Click Demo Profiles (Instant Access)
          </span>
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('odisha_dairy')}
              className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition cursor-pointer"
            >
              🥛 Ramesh (Odisha Dairy)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('up_shg')}
              className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100 transition cursor-pointer"
            >
              🧵 Pooja (UP Boutique SHG)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('admin')}
              className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-purple-50 text-purple-800 border border-purple-200 hover:bg-purple-100 transition cursor-pointer"
            >
              🛡️ Admin Officer
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">{t.state}</label>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full px-2.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white"
                  >
                    {Object.keys(INDIAN_STATES_DISTRICTS).map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">{t.district}</label>
                  <input
                    type="text"
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-full px-2.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition shadow-sm hover:shadow cursor-pointer mt-2"
          >
            {mode === 'login' ? 'Sign In to GramBiz AI' : 'Create Account & Continue'}
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-slate-500">
          {mode === 'login' ? (
            <div>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-emerald-700 font-bold hover:underline cursor-pointer"
              >
                Register here
              </button>
            </div>
          ) : (
            <div>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-emerald-700 font-bold hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
