export interface RuleMetadata {
  id: string;
  category: 'Affordability' | 'Pricing' | 'Eligibility' | 'Stress' | 'Safety';
  ruleName: string;
  value: string;
  rationale: string;
  source: string;
}

export const DOMAIN_RULES: Record<string, RuleMetadata> = {
  SALARIED_BANK_FOIR_HIGH: {
    id: 'SALARIED_BANK_FOIR_HIGH',
    category: 'Eligibility',
    ruleName: 'Lender Salaried FOIR (Income > ₹1L)',
    value: '60% - 65% of net monthly income',
    rationale: 'Top banks sanction aggressive EMIs for high-income earners assuming higher residual surplus after basic expenses.',
    source: 'HDFC / ICICI Bank Prime Salaried Underwriting Norms (2025-2026)'
  },
  SALARIED_BANK_FOIR_MID: {
    id: 'SALARIED_BANK_FOIR_MID',
    category: 'Eligibility',
    ruleName: 'Lender Salaried FOIR (Income ₹40k - ₹1L)',
    value: '50% of net monthly income',
    rationale: 'Standard bank ceiling for middle-income salaried applicants.',
    source: 'SBI / Axis Bank Retail Credit Guidelines'
  },
  BORROWER_SAFE_FOIR_SALARIED: {
    id: 'BORROWER_SAFE_FOIR_SALARIED',
    category: 'Safety',
    ruleName: 'Borrower Safe FOIR Ceiling (Salaried)',
    value: '38% of net monthly income',
    rationale: 'Keeps 62% of income free for rent, living costs, inflation, and retirement/investments. Prevents cashflow entrapment.',
    source: 'Lokta Borrower Prudential Standard / CFP Board Affordability'
  },
  BORROWER_SAFE_FOIR_SELF_EMPLOYED: {
    id: 'BORROWER_SAFE_FOIR_SELF_EMPLOYED',
    category: 'Safety',
    ruleName: 'Borrower Safe FOIR Ceiling (Self-Employed / Kirana)',
    value: '30% of average monthly net profit',
    rationale: 'Business income fluctuates wildly month-to-month. A 30% debt cap ensures the shop survives lean monsoon/post-festival dips.',
    source: 'Lokta Small Business Stress Framework'
  },
  BORROWER_SAFE_FOIR_INFORMAL: {
    id: 'BORROWER_SAFE_FOIR_INFORMAL',
    category: 'Safety',
    ruleName: 'Borrower Safe FOIR Ceiling (Informal / Gig)',
    value: '25% of baseline monthly inflow',
    rationale: 'Gig platforms offer no sick leave or insurance. High fixed debt can trigger instant default if the rider falls sick or vehicle breaks down.',
    source: 'Lokta Informal Worker Protection Guideline'
  },
  LAP_COMMERCIAL_LTV: {
    id: 'LAP_COMMERCIAL_LTV',
    category: 'Eligibility',
    ruleName: 'Commercial Property LAP LTV',
    value: '50% - 55% of fair market value',
    rationale: 'Lenders discount commercial shops compared to residential flats due to liquidity and local title nuances.',
    source: 'RBI Master Circular on Housing & Non-Housing Real Estate Lending'
  },
  EV_TWO_WHEELER_LTV: {
    id: 'EV_TWO_WHEELER_LTV',
    category: 'Eligibility',
    ruleName: 'EV / Two-Wheeler Asset Hypothecation LTV',
    value: '80% - 85% of on-road vehicle cost',
    rationale: 'Asset finance NBFCs hypothecate the vehicle registration, requiring 15-20% margin money.',
    source: 'Hero Fincorp / Bajaj Finance Two-Wheeler Norms'
  },
  PRIME_PL_RATE_BAND: {
    id: 'PRIME_PL_RATE_BAND',
    category: 'Pricing',
    ruleName: 'Prime Personal Loan Interest Rate Band',
    value: '10.50% - 12.00% p.a.',
    rationale: 'Offered to CIBIL >750 salaried borrowers in listed Category-A MNCs.',
    source: 'SBI Xpress Credit / HDFC QuickPL Market Benchmarks Q1 2026'
  },
  LAP_SECURED_RATE_BAND: {
    id: 'LAP_SECURED_RATE_BAND',
    category: 'Pricing',
    ruleName: 'Loan Against Property (LAP) Prime Rate Band',
    value: '9.25% - 11.25% p.a.',
    rationale: 'Backed by unencumbered registered commercial/residential immovable collateral.',
    source: 'Bajaj Housing / PNB Housing LAP Grid 2026'
  },
  UNSECURED_BUSINESS_RATE_BAND: {
    id: 'UNSECURED_BUSINESS_RATE_BAND',
    category: 'Pricing',
    ruleName: 'Unsecured Business Loan Rate Band',
    value: '18.00% - 24.00% p.a.',
    rationale: 'Unsecured business loans to proprietorships without strong audited balance sheets carry steep risk premiums.',
    source: 'NBFC MSME Lending Cards'
  },
  PREDATORY_APPLOAN_ALERT: {
    id: 'PREDATORY_APPLOAN_ALERT',
    category: 'Safety',
    ruleName: 'Predatory Instant App Loan Threshold',
    value: 'APR > 24.00% or weekly/15-day roll cycles',
    rationale: 'Short-tenure digital app loans charge 30-48% APR with heavy penalties, triggering debt spirals for low-income borrowers.',
    source: 'RBI Digital Lending Guidelines (2022/2024)'
  },
  GST_ON_PROCESSING_FEE: {
    id: 'GST_ON_PROCESSING_FEE',
    category: 'Pricing',
    ruleName: 'GST on Financial Services',
    value: '18.0% mandatory tax on all upfront processing and admin fees',
    rationale: 'All upfront lender fees attract 18% GST under Indian tax law, inflating true upfront out-of-pocket costs.',
    source: 'GST Council of India Services Classification'
  },
  STRESS_INCOME_SHOCK: {
    id: 'STRESS_INCOME_SHOCK',
    category: 'Stress',
    ruleName: 'Stress Test: Income Contraction',
    value: '20% reduction in net monthly earnings',
    rationale: 'Simulates loss of overtime, seasonal slowdown in retail, or temporary loss of family income.',
    source: 'Lokta Stress Testing Framework'
  },
  STRESS_RATE_SHOCK: {
    id: 'STRESS_RATE_SHOCK',
    category: 'Stress',
    ruleName: 'Stress Test: Rate Spike',
    value: '+200 bps (+2.00%) floating rate expansion',
    rationale: 'Simulates RBI monetary tightening cycle on floating rate loans (e.g. LAP or floating PL).',
    source: 'RBI Financial Stability Report Historical Volatility'
  },
  PRODUCTIVE_PURPOSE_BONUS: {
    id: 'PRODUCTIVE_PURPOSE_BONUS',
    category: 'Affordability',
    ruleName: 'Productive Asset Cashflow Recognition',
    value: 'Incremental earnings recognized after 30% operational haircut',
    rationale: 'When a loan buys a working asset (e.g., Kirana delivery vehicle, EV delivery bike), it increases net disposable income, improving true debt service ability.',
    source: 'Lokta Micro-Enterprise Cashflow Underwriting Rule'
  }
};

export const RULES_TABLE_LIST = Object.values(DOMAIN_RULES);
