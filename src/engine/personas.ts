import { PersonaDefinition, BorrowerInputs } from './types';

export const PERSONA_PRIYA: PersonaDefinition = {
  id: 'priya',
  name: 'Priya',
  age: 29,
  location: 'Bengaluru',
  employmentLabel: 'Salaried Software Engineer (Tier-1 MNC)',
  tagline: 'High earner, prime credit, high lifestyle commitments',
  narrative: 'Software engineer at a large MNC for 5 years. Net ₹1,10,000/month. One car loan, EMI ₹14,000, 2 years left. Credit score 780. Rents at ₹28,000 in Bengaluru.',
  requestedSummary: 'Wants ₹8,00,000 personal loan for a wedding.',
  inputs: {
    purpose: 'wedding_consumption',
    amountRequested: 800000,
    employmentType: 'salaried_mnc',
    monthlyInflow: 110000,
    livingExpenses: 25000,
    rent: 28000,
    existingEmis: 14000,
    creditScoreTier: 'excellent_750_plus',
    assetBacking: 'none',
    age: 29,
    employerCategory: 'tier_1_mnc',
    tenureYears: 5,
    salaryMode: 'bank_transfer',
    emergencySavingsMonths: 4,
    lenderQuotedRate: 13.5,
    lenderQuotedFeePercent: 2.0
  },
  expectedTakeaway: 'Banks will eagerly sanction ₹18-20L+, but taking ₹8L for wedding consumption is sub-optimal. Copilot advises borrowing less (cap at ₹4-5L) and negotiating down to 10.75-11.25% with 1% PF.'
};

export const PERSONA_RAVI: PersonaDefinition = {
  id: 'ravi',
  name: 'Ravi',
  age: 42,
  location: 'Mysuru',
  employmentLabel: 'Self-Employed Kirana Store Owner',
  tagline: 'Cash-rich business, low ITR, prime unencumbered real estate asset',
  narrative: 'Kirana store for 14 years. Cash income ₹40,000–80,000/month; ITR shows ₹4,20,000/year. Owns shop premises (~₹45,00,000, unencumbered). Never taken formal loan; no bureau credit score. Wife earns ₹18,000 teaching.',
  requestedSummary: 'Wants ₹15,00,000 for a second stock line and a delivery vehicle.',
  inputs: {
    purpose: 'business_expansion',
    amountRequested: 1500000,
    employmentType: 'self_employed_business',
    monthlyInflow: 60000, // Average monthly cash profit
    livingExpenses: 20000,
    rent: 0, // Owns shop and house
    existingEmis: 0,
    creditScoreTier: 'new_to_credit',
    assetBacking: 'property_commercial',
    age: 42,
    annualItrProfit: 420000,
    yearsInBusiness: 14,
    propertyValuation: 4500000,
    coApplicantIncome: 18000,
    bankingTurnoverShare: 65,
    emergencySavingsMonths: 3,
    lenderQuotedRate: 19.5,
    lenderQuotedFeePercent: 2.5
  },
  expectedTakeaway: 'Unsecured business loan gives only ₹3.5L at 20%+. Copilot routes Ravi to a 7-10 yr Secured LAP against his ₹45L shop premises at 9.5-11%, easily supporting ₹15L with manageable ₹24k EMI.'
};

export const PERSONA_ANITA: PersonaDefinition = {
  id: 'anita',
  name: 'Anita',
  age: 35,
  location: 'Hubballi',
  employmentLabel: 'Informal Gig Delivery Rider & Home Tailoring',
  tagline: 'Single earner, tight cashflow, trapped in predatory app loans',
  narrative: 'Delivery-platform rider plus home tailoring. ₹26,000–30,000/month, two children, husband unemployed 8 months. Three app loans, ₹35,000 outstanding at 30%+, one EMI bounced last month.',
  requestedSummary: 'Wants ₹1,50,000 for an electric scooter to double delivery runs.',
  inputs: {
    purpose: 'vehicle_ev',
    amountRequested: 150000,
    employmentType: 'informal_gig',
    monthlyInflow: 28000,
    livingExpenses: 18000,
    rent: 4000,
    existingEmis: 3500, // ongoing app loans
    creditScoreTier: 'poor_below_650',
    assetBacking: 'vehicle_hypothecation',
    age: 35,
    platformPayoutProof: true,
    overdueBouncesCount: 1,
    highCostDebtAmount: 35000,
    highCostDebtApr: 36,
    productiveYieldMonthly: 4500, // fuel savings + extra deliveries
    emergencySavingsMonths: 0,
    lenderQuotedRate: 36.0,
    lenderQuotedFeePercent: 4.0
  },
  expectedTakeaway: 'CRITICAL ALERT: Do NOT take new unsecured debt. Prioritize closing the 3 predatory app loans. For the EV, apply only for direct asset financing where ₹4.5k/mo fuel savings service the loan.'
};

export const PERSONAS_LIST: PersonaDefinition[] = [
  PERSONA_PRIYA,
  PERSONA_RAVI,
  PERSONA_ANITA
];

export const DEFAULT_CUSTOM_INPUTS: BorrowerInputs = {
  purpose: 'personal_consumption' as any,
  amountRequested: 500000,
  employmentType: 'salaried_pvt',
  monthlyInflow: 65000,
  livingExpenses: 22000,
  rent: 15000,
  existingEmis: 5000,
  creditScoreTier: 'good_700_749',
  assetBacking: 'none',
  age: 30,
  emergencySavingsMonths: 2
};
