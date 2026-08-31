import React, { useState, useMemo } from 'react';
import {
  IndianRupee,
  Calendar,
  Percent,
  Clock,
  Download,
  Info,
  TrendingDown,
  ShieldAlert,
  ArrowUpDown,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Language } from '../types';
import { formatINR, formatINRLakhs } from '../lib/utils';
import { calculateRepaymentDetails } from '../lib/financialEngine';
import { InfoTooltip } from './InfoTooltip';
import { translations } from '../lib/translations';

interface FinancialCalculatorProps {
  initialLoanAmount?: number;
  initialRate?: number;
  initialTenureMonths?: number;
  initialMoratoriumMonths?: number;
  language: Language;
}

export const FinancialCalculator: React.FC<FinancialCalculatorProps> = ({
  initialLoanAmount = 900000,
  initialRate = 8.0,
  initialTenureMonths = 84,
  initialMoratoriumMonths = 6,
  language,
}) => {
  const t = translations[language] || translations.en;

  const [loanAmount, setLoanAmount] = useState<number>(initialLoanAmount);
  const [interestRate, setInterestRate] = useState<number>(initialRate);
  const [tenureYears, setTenureYears] = useState<number>(Math.round(initialTenureMonths / 12));
  const [moratoriumMonths, setMoratoriumMonths] = useState<number>(initialMoratoriumMonths);
  const [scheduleView, setScheduleView] = useState<'yearly' | 'monthly'>('yearly');

  const tenureMonths = tenureYears * 12;

  const calculation = useMemo(() => {
    return calculateRepaymentDetails(
      loanAmount,
      interestRate,
      tenureMonths,
      moratoriumMonths
    );
  }, [loanAmount, interestRate, tenureMonths, moratoriumMonths]);

  // Chart data formatting
  const chartData = useMemo(() => {
    return calculation.yearlySchedule.map((item) => ({
      name: `Yr ${item.period}`,
      ClosingBalance: item.closingBalance,
      PrincipalPaid: item.principal,
      InterestPaid: item.interest,
      TotalPayment: item.payment,
    }));
  }, [calculation.yearlySchedule]);

  const activeSchedule = scheduleView === 'yearly' ? calculation.yearlySchedule : calculation.schedule;

  const exportCSV = () => {
    const headers = ['Period', 'Label', 'Opening Balance (₹)', 'Principal (₹)', 'Interest (₹)', 'Total Payment (₹)', 'Closing Balance (₹)'];
    const rows = activeSchedule.map((s) => [
      s.period,
      `"${s.label}"`,
      s.openingBalance,
      s.principal,
      s.interest,
      s.payment,
      s.closingBalance,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GramBiz_Repayment_Schedule_${loanAmount}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <IndianRupee className="w-6 h-6 text-emerald-600" />
              {t.repaymentCalculator} & Loan Structuring
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Deterministic amortization planning with configurable grace periods (moratorium) for rural micro-enterprises.
            </p>
          </div>

          <button
            type="button"
            onClick={exportCSV}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-xs sm:text-sm transition cursor-pointer self-start md:self-auto"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Export Schedule CSV</span>
          </button>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6 pt-6 border-t border-slate-100">
          {/* Loan Amount */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 flex items-center">
                Loan Amount
                <InfoTooltip
                  title="Loan Principal"
                  content="The total sanctioned loan under Micro Finance or Term Loan schemes."
                />
              </label>
              <span className="text-xs font-bold text-emerald-700">{formatINR(loanAmount)}</span>
            </div>
            <input
              type="number"
              min={10000}
              max={5000000}
              step={10000}
              value={loanAmount}
              onChange={(e) => setLoanAmount(Math.max(10000, Number(e.target.value) || 0))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <input
              type="range"
              min={10000}
              max={5000000}
              step={10000}
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
          </div>

          {/* Interest Rate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 flex items-center">
                Interest Rate (% p.a.)
                <InfoTooltip
                  title="Annual Interest Rate"
                  content="Priority sector schemes typically offer 6.5% to 8.0% per annum."
                />
              </label>
              <span className="text-xs font-bold text-emerald-700">{interestRate}%</span>
            </div>
            <input
              type="number"
              min={1}
              max={24}
              step={0.25}
              value={interestRate}
              onChange={(e) => setInterestRate(Math.max(1, Number(e.target.value) || 0))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <input
              type="range"
              min={4}
              max={15}
              step={0.25}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
          </div>

          {/* Tenure */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 flex items-center">
                Tenure (Years)
                <InfoTooltip
                  title="Loan Tenure"
                  content="Micro Finance is 3 years; Term Loan is up to 7 years."
                />
              </label>
              <span className="text-xs font-bold text-emerald-700">
                {tenureYears} Years ({tenureMonths} mo)
              </span>
            </div>
            <select
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value={1}>1 Year (12 months)</option>
              <option value={2}>2 Years (24 months)</option>
              <option value={3}>3 Years (36 months - Micro Finance)</option>
              <option value={5}>5 Years (60 months)</option>
              <option value={7}>7 Years (84 months - Term Loan)</option>
              <option value={10}>10 Years (120 months)</option>
            </select>
          </div>

          {/* Moratorium */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 flex items-center">
                Moratorium (Months)
                <InfoTooltip
                  title="Moratorium (Grace Period)"
                  content="Repayment of principal is deferred during initial business setup (interest serviced). Micro Finance offers 3 months; Term Loans offer 6 months."
                />
              </label>
              <span className="text-xs font-bold text-emerald-700">{moratoriumMonths} Months</span>
            </div>
            <select
              value={moratoriumMonths}
              onChange={(e) => setMoratoriumMonths(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value={0}>0 Months (No Grace Period)</option>
              <option value={3}>3 Months (Micro Finance Standard)</option>
              <option value={6}>6 Months (Term Loan Standard)</option>
              <option value={9}>9 Months</option>
              <option value={12}>12 Months (Agro Gestation)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-emerald-100 p-5 shadow-sm">
          <div className="text-xs font-medium text-slate-500 mb-1">Estimated Post-Moratorium EMI</div>
          <div className="text-2xl font-bold text-emerald-700">
            {formatINR(calculation.postMoratoriumEMI)} <span className="text-xs font-normal text-slate-500">/ mo</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1.5">
            Payable for {tenureMonths - moratoriumMonths} active months
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <div className="text-xs font-medium text-slate-500 mb-1">Total Interest Payable</div>
          <div className="text-2xl font-bold text-amber-700">
            {formatINR(calculation.totalInterest)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1.5">
            {((calculation.totalInterest / loanAmount) * 100).toFixed(1)}% of Principal
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <div className="text-xs font-medium text-slate-500 mb-1">Total Repayment Amount</div>
          <div className="text-2xl font-bold text-slate-900">
            {formatINR(calculation.totalRepayment)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1.5">Principal + Total Interest</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <div className="text-xs font-medium text-slate-500 mb-1">Moratorium Grace Window</div>
          <div className="text-2xl font-bold text-blue-700">
            {moratoriumMonths} <span className="text-xs font-normal text-slate-500">Months</span>
          </div>
          <div className="text-[11px] text-blue-600 mt-1.5 font-medium">
            Principal holiday for business stabilization
          </div>
        </div>
      </div>

      {/* Amortization Chart */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-emerald-600" />
          Loan Balance & Repayment Trajectory
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Visualizes remaining principal closing balance along with annual principal and interest distributions.
        </p>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="interestGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis
                stroke="#94a3b8"
                fontSize={12}
                tickFormatter={(val) => formatINRLakhs(val)}
                tickLine={false}
              />
              <Tooltip
                formatter={(val: any) => [formatINR(val), '']}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderRadius: '12px',
                  border: 'none',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="ClosingBalance"
                name="Closing Balance"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#balanceGrad)"
              />
              <Area
                type="monotone"
                dataKey="PrincipalPaid"
                name="Principal Paid"
                stroke="#3b82f6"
                strokeWidth={1.5}
                fill="#dbeafe"
              />
              <Area
                type="monotone"
                dataKey="InterestPaid"
                name="Interest Paid"
                stroke="#f59e0b"
                strokeWidth={1.5}
                fill="url(#interestGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Repayment Schedule Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Detailed Amortization & Repayment Schedule
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Accurate breakdown of opening balance, principal repayment, interest, and closing balances.
            </p>
          </div>

          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setScheduleView('yearly')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                scheduleView === 'yearly'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Yearly Summary
            </button>
            <button
              type="button"
              onClick={() => setScheduleView('monthly')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                scheduleView === 'monthly'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly View ({calculation.schedule.length} mo)
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-semibold border-b border-slate-100">
              <tr>
                <th className="px-4 py-3">Period</th>
                <th className="px-4 py-3 text-right">Opening Balance</th>
                <th className="px-4 py-3 text-right">Principal</th>
                <th className="px-4 py-3 text-right">Interest</th>
                <th className="px-4 py-3 text-right">Total Payment</th>
                <th className="px-4 py-3 text-right">Closing Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-xs">
              {activeSchedule.map((row) => (
                <tr
                  key={row.period}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    row.isMoratorium ? 'bg-blue-50/40 text-blue-900' : ''
                  }`}
                >
                  <td className="px-4 py-3 font-sans font-medium text-slate-900 flex items-center gap-1.5">
                    {row.label}
                    {row.isMoratorium && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-800 font-sans">
                        Grace
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">{formatINR(row.openingBalance)}</td>
                  <td className="px-4 py-3 text-right text-emerald-700 font-semibold">
                    {formatINR(row.principal)}
                  </td>
                  <td className="px-4 py-3 text-right text-amber-700">{formatINR(row.interest)}</td>
                  <td className="px-4 py-3 text-right font-bold text-slate-900">
                    {formatINR(row.payment)}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-600">{formatINR(row.closingBalance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Note */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Moratorium interest calculation is illustrative. Individual banking authorities may allow capitalization or quarterly interest servicing as per scheme rules.
          </span>
        </div>
      </div>
    </div>
  );
};
