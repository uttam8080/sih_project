import { LoanScheme, FinancialCalculation, AmortizationPeriod } from '../types';

export const DEFAULT_SCHEMES: LoanScheme[] = [
  {
    id: 'scheme_micro_finance',
    name: 'Micro Finance Scheme',
    description: 'Designed for small village micro-enterprises, cottage industries, and initial scale ventures.',
    min_project_cost: 10000,
    max_project_cost: 140000, // Up to ₹1.40 Lakh
    max_loan_amount: 125000,   // Max ₹1.25 Lakh
    funding_percentage: 90,    // 90% loan
    interest_rate: 6.5,        // 6.5% p.a.
    tenure_months: 36,         // 3 years
    moratorium_months: 3,      // 3 months
    active: true,
    tags: ['Micro', 'Low Interest', 'Rural Priority', '3 Months Moratorium'],
    created_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'scheme_term_loan',
    name: 'Term Loan Scheme',
    description: 'Tailored for expanding agro-processing, commercial livestock, manufacturing units, and semi-urban enterprises.',
    min_project_cost: 140001,  // Above ₹1.40 Lakh
    max_project_cost: 5000000, // Up to ₹50 Lakh
    max_loan_amount: 4500000,  // Max ₹45 Lakh
    funding_percentage: 90,    // 90% loan
    interest_rate: 8.0,        // 8% p.a.
    tenure_months: 84,         // 7 years
    moratorium_months: 6,      // 6 months
    active: true,
    tags: ['Term Loan', 'Growth Capital', 'Subsidized', '6 Months Moratorium'],
    created_at: '2026-01-01T00:00:00.000Z',
  },
];

/**
 * Deterministic calculation of Project Cost and Loan based on Available Margin.
 * Margin is assumed to be 10% of Project Cost.
 * Loan is 90% of Project Cost (capped at Scheme max loan).
 */
export function calculateFinancialStructure(
  margin: number,
  schemes: LoanScheme[] = DEFAULT_SCHEMES
): FinancialCalculation {
  const safeMargin = Math.max(0, Number(margin) || 0);

  // Core Deterministic Formula
  const projectCost = safeMargin > 0 ? safeMargin / 0.10 : 0;
  const theoreticalLoan = projectCost * 0.90;

  // Determine applicable scheme
  let applicableScheme: LoanScheme | null = null;
  let isAboveSchemeLimit = false;

  if (projectCost > 0) {
    if (projectCost <= 140000) {
      applicableScheme = schemes.find((s) => s.id === 'scheme_micro_finance') || schemes[0];
    } else if (projectCost <= 5000000) {
      applicableScheme = schemes.find((s) => s.id === 'scheme_term_loan') || schemes[1];
    } else {
      // Above supported maximum (₹50 Lakh)
      isAboveSchemeLimit = true;
      applicableScheme = null;
    }
  }

  // Cap loan by scheme max if applicable
  let loanAmount = theoreticalLoan;
  if (applicableScheme && loanAmount > applicableScheme.max_loan_amount) {
    loanAmount = applicableScheme.max_loan_amount;
  }

  // Calculate EMI estimate
  let monthlyEMI = 0;
  let totalInterest = 0;
  let totalRepayment = loanAmount;

  if (applicableScheme && loanAmount > 0) {
    const rate = applicableScheme.interest_rate;
    const totalTenure = applicableScheme.tenure_months;
    const moratorium = applicableScheme.moratorium_months;

    const repaymentResult = calculateRepaymentDetails(loanAmount, rate, totalTenure, moratorium);
    monthlyEMI = repaymentResult.postMoratoriumEMI;
    totalInterest = repaymentResult.totalInterest;
    totalRepayment = repaymentResult.totalRepayment;
  }

  return {
    availableMargin: safeMargin,
    projectCost,
    loanAmount,
    marginPercentage: 10,
    applicableScheme,
    isAboveSchemeLimit,
    monthlyEMI,
    totalInterest,
    totalRepayment,
  };
}

/**
 * Calculates repayment schedule details with Moratorium
 */
export function calculateRepaymentDetails(
  loanAmount: number,
  annualInterestRate: number,
  tenureMonths: number,
  moratoriumMonths: number
): {
  monthlyEMI: number;
  postMoratoriumEMI: number;
  totalInterest: number;
  totalRepayment: number;
  schedule: AmortizationPeriod[];
  yearlySchedule: AmortizationPeriod[];
} {
  const P = Math.max(0, loanAmount);
  const r = (annualInterestRate / 100) / 12; // monthly interest rate
  const totalMonths = Math.max(1, tenureMonths);
  const morMonths = Math.min(moratoriumMonths, totalMonths - 1);
  const repaymentMonths = totalMonths - morMonths;

  // Monthly EMI for the active repayment period:
  // EMI = P * r * (1+r)^n / ((1+r)^n - 1)
  let emi = 0;
  if (r > 0 && repaymentMonths > 0) {
    const factor = Math.pow(1 + r, repaymentMonths);
    emi = (P * r * factor) / (factor - 1);
  } else if (repaymentMonths > 0) {
    emi = P / repaymentMonths;
  }

  let currentBalance = P;
  let totalInterest = 0;
  const schedule: AmortizationPeriod[] = [];

  for (let m = 1; m <= totalMonths; m++) {
    const isMoratorium = m <= morMonths;
    const openingBalance = currentBalance;
    const interest = openingBalance * r;
    totalInterest += interest;

    let principal = 0;
    let payment = 0;

    if (isMoratorium) {
      // During moratorium, interest is paid to keep principal constant
      principal = 0;
      payment = interest;
      currentBalance = openingBalance;
    } else {
      payment = emi;
      principal = payment - interest;
      
      // Prevent negative balance on last month rounding
      if (principal > currentBalance || m === totalMonths) {
        principal = currentBalance;
        payment = principal + interest;
        currentBalance = 0;
      } else {
        currentBalance -= principal;
      }
    }

    schedule.push({
      period: m,
      label: `Month ${m}${isMoratorium ? ' (Moratorium)' : ''}`,
      openingBalance: Math.round(openingBalance),
      principal: Math.round(principal),
      interest: Math.round(interest),
      payment: Math.round(payment),
      closingBalance: Math.round(Math.max(0, currentBalance)),
      isMoratorium,
    });

    if (currentBalance <= 0 && !isMoratorium) {
      break;
    }
  }

  // Aggregate into yearly / quarterly schedule for clean scannable display
  const yearlySchedule: AmortizationPeriod[] = [];
  const yearsCount = Math.ceil(totalMonths / 12);

  for (let y = 1; y <= yearsCount; y++) {
    const startM = (y - 1) * 12 + 1;
    const endM = Math.min(y * 12, schedule.length);
    const monthsInYear = schedule.filter((s) => s.period >= startM && s.period <= endM);

    if (monthsInYear.length === 0) continue;

    const openingBalance = monthsInYear[0].openingBalance;
    const closingBalance = monthsInYear[monthsInYear.length - 1].closingBalance;
    const sumPrincipal = monthsInYear.reduce((acc, curr) => acc + curr.principal, 0);
    const sumInterest = monthsInYear.reduce((acc, curr) => acc + curr.interest, 0);
    const sumPayment = monthsInYear.reduce((acc, curr) => acc + curr.payment, 0);

    yearlySchedule.push({
      period: y,
      label: `Year ${y} (Months ${startM}–${endM})`,
      openingBalance,
      principal: sumPrincipal,
      interest: sumInterest,
      payment: sumPayment,
      closingBalance,
    });
  }

  return {
    monthlyEMI: Math.round(emi),
    postMoratoriumEMI: Math.round(emi),
    totalInterest: Math.round(totalInterest),
    totalRepayment: Math.round(P + totalInterest),
    schedule,
    yearlySchedule,
  };
}
