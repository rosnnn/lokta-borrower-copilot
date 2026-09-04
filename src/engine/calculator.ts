import { BorrowerInputs, ConfidenceBreakdown } from './types';

/**
 * Standard Monthly Equated Monthly Installment (EMI) calculation
 * EMI = [P * r * (1 + r)^n] / [((1 + r)^n) - 1]
 */
export function calculateEmi(
  principal: number,
  annualRatePercent: number,
  tenureMonths: number
): number {
  if (principal <= 0 || tenureMonths <= 0) return 0;
  if (annualRatePercent <= 0) return Math.round(principal / tenureMonths);

  const monthlyRate = annualRatePercent / 12 / 100;
  const factor = Math.pow(1 + monthlyRate, tenureMonths);
  const emi = (principal * monthlyRate * factor) / (factor - 1);
  return Math.round(emi);
}

/**
 * Inverse EMI: Calculates Maximum Principal for a given monthly debt budget
 * P = [EMI * ((1 + r)^n - 1)] / [r * (1 + r)^n]
 */
export function calculatePrincipalFromEmi(
  monthlyEmiBudget: number,
  annualRatePercent: number,
  tenureMonths: number
): number {
  if (monthlyEmiBudget <= 0 || tenureMonths <= 0) return 0;
  if (annualRatePercent <= 0) return Math.round(monthlyEmiBudget * tenureMonths);

  const monthlyRate = annualRatePercent / 12 / 100;
  const factor = Math.pow(1 + monthlyRate, tenureMonths);
  const principal = (monthlyEmiBudget * (factor - 1)) / (monthlyRate * factor);
  return Math.round(principal);
}

/**
 * Calculates RBI-compliant Annual Percentage Rate (APR) including Upfront Fees + 18% GST
 * Net Disbursed = Principal - (Fee + GST)
 * Solves for internal rate of return r such that Net Disbursed = sum(EMI / (1+r)^t)
 */
export function calculateApr(
  principal: number,
  annualNominalRate: number,
  tenureMonths: number,
  feePercent: number,
  gstRate: number = 0.18
): number {
  if (principal <= 0 || tenureMonths <= 0) return annualNominalRate;

  const feeAmount = principal * (feePercent / 100);
  const feeGst = feeAmount * gstRate;
  const totalUpfrontCost = feeAmount + feeGst;
  const netDisbursed = principal - totalUpfrontCost;

  if (netDisbursed <= 0) return annualNominalRate;

  const regularEmi = calculateEmi(principal, annualNominalRate, tenureMonths);

  // Numerical Newton-Raphson approximation for monthly IRR
  let monthlyYield = annualNominalRate / 12 / 100;
  for (let i = 0; i < 30; i++) {
    let pv = 0;
    let pvDerivative = 0;
    for (let t = 1; t <= tenureMonths; t++) {
      const discount = Math.pow(1 + monthlyYield, -t);
      pv += regularEmi * discount;
      pvDerivative -= t * regularEmi * Math.pow(1 + monthlyYield, -t - 1);
    }
    const diff = pv - netDisbursed;
    if (Math.abs(diff) < 0.01) break;
    if (Math.abs(pvDerivative) < 1e-7) break;
    monthlyYield = monthlyYield - diff / pvDerivative;
  }

  const annualizedApr = monthlyYield * 12 * 100;
  return Number.isFinite(annualizedApr) ? Math.max(annualNominalRate, Math.round(annualizedApr * 100) / 100) : annualNominalRate;
}

/**
 * Format numbers into Indian Lakhs/Crores Rupee format (e.g. ₹8,00,000)
 */
export function formatInr(amount: number): string {
  if (isNaN(amount)) return '₹0';
  const isNegative = amount < 0;
  const absolute = Math.round(Math.abs(amount));
  
  const str = absolute.toString();
  let lastThree = str.substring(str.length - 3);
  const otherNumbers = str.substring(0, str.length - 3);
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
  return `${isNegative ? '-' : ''}₹${formatted}`;
}

/**
 * FOIR (Fixed Obligation to Income Ratio) calculation
 */
export function calculateFoirPercent(monthlyDebtOutflow: number, monthlyGrossInflow: number): number {
  if (monthlyGrossInflow <= 0) return 100;
  return Math.round((monthlyDebtOutflow / monthlyGrossInflow) * 1000) / 10;
}

/**
 * Evaluates the confidence score based on must vs adaptive additional questions answered.
 * Confidence widens (ranges widen) when key details are missing or unknown.
 */
export function calculateConfidenceScore(inputs: BorrowerInputs): ConfidenceBreakdown {
  const tighteningFactors: string[] = [];
  const wideningFactors: string[] = [];

  let baseScore = 55; // Starts at 55% with only basic must questions
  const totalMustCount = 8;
  let answeredMustCount = 8;

  // Track additional questions applicable for the profile
  let totalApplicableAdditional = 0;
  let answeredAdditional = 0;

  // Credit score impact
  if (inputs.creditScoreTier === 'excellent_750_plus' || inputs.creditScoreTier === 'good_700_749') {
    baseScore += 10;
    tighteningFactors.push(`Verified CIBIL Tier (${inputs.creditScoreTier === 'excellent_750_plus' ? '750+' : '700-749'}) provides tight rate bounds.`);
  } else if (inputs.creditScoreTier === 'dont_know') {
    baseScore -= 15;
    wideningFactors.push('Unknown credit score forces conservative lender pricing (+150 to +300 bps wider band).');
  } else if (inputs.creditScoreTier === 'new_to_credit') {
    baseScore -= 5;
    wideningFactors.push('New-to-credit (NTC) profile requires surrogate banking / collateral validation.');
  }

  // Profile-specific adaptive questions
  if (inputs.employmentType === 'salaried_mnc' || inputs.employmentType === 'salaried_pvt') {
    totalApplicableAdditional = 3;
    if (inputs.employerCategory) {
      answeredAdditional++;
      baseScore += 8;
      tighteningFactors.push(`Employer category (${inputs.employerCategory.toUpperCase()}) confirmed for Category-A bank pricing.`);
    } else {
      wideningFactors.push('Unspecified employer tier leaves lender FOIR band between 50% and 65%.');
    }

    if (inputs.tenureYears !== undefined && inputs.tenureYears > 0) {
      answeredAdditional++;
      baseScore += 6;
      tighteningFactors.push(`Job stability (${inputs.tenureYears} years) satisfies bank underwriting norms.`);
    }

    if (inputs.salaryMode) {
      answeredAdditional++;
      baseScore += 6;
      tighteningFactors.push('Direct bank transfer salary slips confirmed.');
    }
  } else if (inputs.employmentType === 'self_employed_business') {
    totalApplicableAdditional = 4;
    if (inputs.annualItrProfit !== undefined && inputs.annualItrProfit > 0) {
      answeredAdditional++;
      baseScore += 10;
      tighteningFactors.push(`Declared ITR Net Profit (${formatInr(inputs.annualItrProfit)}/yr) provides formal banking eligibility anchor.`);
    } else {
      wideningFactors.push('Missing ITR net income leaves standard bank sanction uncertain.');
    }

    if (inputs.propertyValuation !== undefined && inputs.propertyValuation > 0) {
      answeredAdditional++;
      baseScore += 12;
      tighteningFactors.push(`Unencumbered property (${formatInr(inputs.propertyValuation)}) unlocks high-value LAP secured route.`);
    }

    if (inputs.coApplicantIncome !== undefined && inputs.coApplicantIncome > 0) {
      answeredAdditional++;
      baseScore += 6;
      tighteningFactors.push(`Co-applicant income (${formatInr(inputs.coApplicantIncome)}/mo) strengthens household debt coverage.`);
    }

    if (inputs.yearsInBusiness !== undefined && inputs.yearsInBusiness >= 3) {
      answeredAdditional++;
      baseScore += 6;
      tighteningFactors.push(`Business vintage (${inputs.yearsInBusiness} yrs) satisfies 3-year commercial stability criteria.`);
    }
  } else if (inputs.employmentType === 'informal_gig') {
    totalApplicableAdditional = 4;
    if (inputs.platformPayoutProof !== undefined) {
      answeredAdditional++;
      baseScore += 8;
      tighteningFactors.push(inputs.platformPayoutProof ? 'Verifiable platform payout history provided.' : 'Cash/informal income requires NBFC surrogate.');
    }

    if (inputs.overdueBouncesCount !== undefined) {
      answeredAdditional++;
      baseScore += 8;
      if (inputs.overdueBouncesCount > 0) {
        wideningFactors.push(`Recent overdue / bounce count (${inputs.overdueBouncesCount}) limits prime banks; directs to NBFC/Asset route.`);
      } else {
        tighteningFactors.push('Clean recent repayment track record.');
      }
    }

    if (inputs.highCostDebtAmount !== undefined) {
      answeredAdditional++;
      baseScore += 8;
      if (inputs.highCostDebtAmount > 0) {
        wideningFactors.push(`Existing high-cost app debt (${formatInr(inputs.highCostDebtAmount)}) must be factored into urgent cashflow drain.`);
      }
    }

    if (inputs.productiveYieldMonthly !== undefined && inputs.productiveYieldMonthly > 0) {
      answeredAdditional++;
      baseScore += 8;
      tighteningFactors.push(`Productive asset cashflow yield (+${formatInr(inputs.productiveYieldMonthly)}/mo) credited to repayment capacity.`);
    }
  }

  if (inputs.emergencySavingsMonths !== undefined) {
    if (inputs.emergencySavingsMonths >= 3) {
      baseScore += 5;
      tighteningFactors.push(`Healthy emergency buffer (${inputs.emergencySavingsMonths} months) provides cashflow shock resilience.`);
    } else if (inputs.emergencySavingsMonths === 0) {
      wideningFactors.push('Zero emergency fund increases borrower vulnerability to default.');
    }
  }

  const finalScore = Math.max(35, Math.min(98, baseScore));
  let bandWidth: 'NARROW' | 'MODERATE' | 'WIDE' = 'MODERATE';
  let bandLabel = 'Moderate Band (±1.5%)';

  if (finalScore >= 80) {
    bandWidth = 'NARROW';
    bandLabel = 'Tight / High Precision Band (±0.5% - 0.75%)';
  } else if (finalScore < 60) {
    bandWidth = 'WIDE';
    bandLabel = 'Wide Range (±2.0% - 3.5%) due to missing specifics';
  }

  return {
    scorePercent: finalScore,
    bandWidth,
    bandLabel,
    answeredMustCount,
    totalMustCount,
    answeredAdditionalCount: answeredAdditional,
    totalApplicableAdditionalCount: totalApplicableAdditional,
    tighteningFactors,
    wideningFactors
  };
}
