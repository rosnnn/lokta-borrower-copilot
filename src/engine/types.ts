export type EmploymentType =
  | 'salaried_mnc'
  | 'salaried_pvt'
  | 'self_employed_business'
  | 'informal_gig';

export type LoanPurpose =
  | 'wedding_consumption'
  | 'business_expansion'
  | 'vehicle_ev'
  | 'home_renovation'
  | 'emergency_medical'
  | 'debt_consolidation';

export type AssetBacking =
  | 'none'
  | 'property_commercial'
  | 'property_residential'
  | 'vehicle_hypothecation'
  | 'gold';

export type CreditScoreTier =
  | 'excellent_750_plus'
  | 'good_700_749'
  | 'fair_650_699'
  | 'poor_below_650'
  | 'new_to_credit'
  | 'dont_know';

export type EmployerCategory = 'tier_1_mnc' | 'tier_2_mid' | 'unlisted_sme';
export type SalaryMode = 'bank_transfer' | 'cash_cheque';

export interface BorrowerInputs {
  // Must Questions (8 Core)
  purpose: LoanPurpose;
  amountRequested: number;
  employmentType: EmploymentType;
  monthlyInflow: number; // Net Monthly Takehome or Avg Monthly Cash Profit
  livingExpenses: number; // Essential household groceries, utilities, school fees
  rent: number; // Monthly rent paid
  existingEmis: number; // Sum of ongoing loan EMIs
  creditScoreTier: CreditScoreTier;
  assetBacking: AssetBacking;
  age: number;

  // Adaptive Additional Questions
  // Salaried
  employerCategory?: EmployerCategory;
  tenureYears?: number; // Total professional experience
  salaryMode?: SalaryMode;

  // Self-Employed
  annualItrProfit?: number; // Reported net income on ITR (₹)
  yearsInBusiness?: number;
  propertyValuation?: number; // Market value of unencumbered property (₹)
  coApplicantIncome?: number; // Monthly net earnings of co-applicant (₹)
  bankingTurnoverShare?: number; // 0 to 100 percentage of sales through bank/UPI

  // Informal / Gig
  platformPayoutProof?: boolean; // Has verifiable aggregator statements / UPI ledger
  overdueBouncesCount?: number; // Bounces in last 3-6 months
  highCostDebtAmount?: number; // Outstanding amount in instant apps / local moneylenders (₹)
  highCostDebtApr?: number; // Interest rate of existing app loans (e.g. 36%)
  productiveYieldMonthly?: number; // Incremental monthly net earnings from new asset (e.g. ₹6,000 extra from EV scooter)

  // Universal
  emergencySavingsMonths?: number; // Months of living expenses saved
  lenderQuotedRate?: number; // If borrower already has a quote (e.g. 14.5%)
  lenderQuotedFeePercent?: number; // e.g. 2.5%
}

export type VerdictDecision =
  | 'BORROW'
  | 'BORROW_LESS'
  | 'DONT_BORROW'
  | 'RESTRUCTURE_FIRST';

export interface OutputO1_Verdict {
  decision: VerdictDecision;
  badge: 'green' | 'yellow' | 'red' | 'purple';
  headline: string;
  reason: string;
  detailedWhy: string[];
  suggestedAction: string;
  recommendedAmount: number;
}

export interface OutputO2_Capacity {
  lenderLikelySanction: number;
  lenderMethodExplanation: string;
  borrowerSafeCapacity: number;
  borrowerMethodExplanation: string;
  recommendedBenchmark: 'LENDER' | 'BORROWER_SAFE';
  gapReason: string;
  utilizationPercent: number; // Requested amount as % of safe capacity
  isStretched: boolean;
}

export interface RateDeterminant {
  factor: string;
  effect: 'lowers' | 'raises' | 'neutral';
  impactBps: number;
  description: string;
}

export interface AlternativeProduct {
  name: string;
  minRate: number;
  maxRate: number;
  note: string;
}

export interface OutputO3_FairRate {
  recommendedProduct: string;
  alternativeProducts: AlternativeProduct[];
  minRate: number;
  maxRate: number;
  medianRate: number;
  processingFeePercent: number;
  processingFeeAmount: number;
  processingFeeGst: number;
  totalUpfrontCharges: number;
  minApr: number;
  maxApr: number;
  predatoryWarning: boolean;
  predatoryThreshold: number;
  rateDeterminants: RateDeterminant[];
}

export interface TenureOption {
  tenureMonths: number;
  monthlyEmi: number;
  totalInterest: number;
  totalOutflow: number;
  projectedFoir: number;
  safe: boolean;
  recommendationNote: string;
}

export interface StressScenarioResult {
  title: string;
  stressFactor: string;
  stressedInflowOrRate: string;
  resultingEmi: number;
  resultingFoir: number;
  isPass: boolean;
  verdict: string;
  impactNote: string;
}

export interface OutputO4_SafeEmi {
  recommendedTenureMonths: number;
  maxSafeEmiCeiling: number;
  currentEmiAtTarget: number;
  foirCurrent: number;
  foirProjected: number;
  foirCeiling: number;
  tenureTradeoffs: TenureOption[];
  stressScenarios: {
    incomeDrop: StressScenarioResult;
    rateHike: StressScenarioResult;
    expenseShock: StressScenarioResult;
  };
}

export interface LeverageBadge {
  title: string;
  subtitle: string;
  strength: 'strong' | 'moderate' | 'caution';
}

export interface ObjectionHandler {
  lenderPitch: string;
  borrowerCounter: string;
  tacticalTip: string;
}

export interface NegotiationCard {
  borrowerProfileSummary: string;
  leverageBadges: LeverageBadge[];
  targetRate: number;
  rateCeiling: number;
  targetApr: number;
  maxProcessingFeePercent: number;
  suggestedTenureMonths: number;
  primaryCounterScript: string;
  objectionHandlers: ObjectionHandler[];
  walkAwayRedlines: string[];
  branchChecklist: string[];
}

export interface ConfidenceBreakdown {
  scorePercent: number;
  bandWidth: 'NARROW' | 'MODERATE' | 'WIDE';
  bandLabel: string;
  answeredMustCount: number;
  totalMustCount: number;
  answeredAdditionalCount: number;
  totalApplicableAdditionalCount: number;
  tighteningFactors: string[];
  wideningFactors: string[];
}

export interface AssessmentResult {
  inputs: BorrowerInputs;
  o1Verdict: OutputO1_Verdict;
  o2Capacity: OutputO2_Capacity;
  o3FairRate: OutputO3_FairRate;
  o4SafeEmi: OutputO4_SafeEmi;
  negotiationCard: NegotiationCard;
  confidence: ConfidenceBreakdown;
  assumptionsUsed: string[];
}

export interface PersonaDefinition {
  id: 'priya' | 'ravi' | 'anita';
  name: string;
  age: number;
  location: string;
  employmentLabel: string;
  tagline: string;
  narrative: string;
  requestedSummary: string;
  inputs: BorrowerInputs;
  expectedTakeaway: string;
}
