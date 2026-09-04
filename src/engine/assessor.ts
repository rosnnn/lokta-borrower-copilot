import {
  BorrowerInputs,
  AssessmentResult,
  OutputO1_Verdict,
  OutputO2_Capacity,
  OutputO3_FairRate,
  OutputO4_SafeEmi,
  NegotiationCard,
  RateDeterminant,
  AlternativeProduct,
  TenureOption,
  LeverageBadge,
  ObjectionHandler
} from './types';
import {
  calculateEmi,
  calculatePrincipalFromEmi,
  calculateApr,
  calculateFoirPercent,
  calculateConfidenceScore,
  formatInr
} from './calculator';

export function runBorrowerAssessment(inputs: BorrowerInputs): AssessmentResult {
  const confidence = calculateConfidenceScore(inputs);
  const assumptionsUsed: string[] = [];

  // ==========================================
  // 1. PRODUCT SELECTION & BASE PRICING LOGIC
  // ==========================================
  let recommendedProduct = 'Unsecured Personal Loan';
  let baseMinRate = 12.5;
  let baseMaxRate = 15.5;
  let standardTenureMonths = 36;
  let standardPfPercent = 1.5;

  const rateDeterminants: RateDeterminant[] = [];
  const alternativeProducts: AlternativeProduct[] = [];

  // Determine Product Routing
  if (inputs.employmentType === 'self_employed_business') {
    if (inputs.assetBacking === 'property_commercial' || inputs.assetBacking === 'property_residential') {
      recommendedProduct = 'Loan Against Property (LAP) - Secured Business';
      baseMinRate = 9.25;
      baseMaxRate = 11.25;
      standardTenureMonths = 84; // 7 years
      standardPfPercent = 1.0;
      assumptionsUsed.push('Routed to Secured LAP due to unencumbered commercial/residential property backing.');
      rateDeterminants.push({
        factor: 'Secured Real Estate Collateral',
        effect: 'lowers',
        impactBps: -800,
        description: 'Pledging unencumbered property drops interest rate from 18-22% (unsecured business) down to 9.25-11.25% (LAP).'
      });
      alternativeProducts.push({
        name: 'Unsecured MSME Business Loan',
        minRate: 18.0,
        maxRate: 24.0,
        note: 'Not recommended: Costs 2x more interest and limits tenure to 36 months.'
      });
    } else {
      recommendedProduct = 'Unsecured Business Loan';
      baseMinRate = 17.5;
      baseMaxRate = 22.0;
      standardTenureMonths = 36;
      standardPfPercent = 2.0;
    }
  } else if (inputs.purpose === 'vehicle_ev' || inputs.assetBacking === 'vehicle_hypothecation') {
    recommendedProduct = 'Two-Wheeler / Commercial EV Hypothecation Loan';
    baseMinRate = 12.5;
    baseMaxRate = 15.5;
    standardTenureMonths = 36;
    standardPfPercent = 2.0;
    rateDeterminants.push({
      factor: 'Vehicle Asset Hypothecation',
      effect: 'lowers',
      impactBps: -300,
      description: 'Lender holds hypothecation charge on vehicle RC, offering better rates than pure personal loans.'
    });
    alternativeProducts.push({
      name: 'Digital Instant App Loan',
      minRate: 30.0,
      maxRate: 42.0,
      note: 'DANGER: Predatory weekly/monthly debt traps. Avoid at all costs.'
    });
  } else if (inputs.employmentType === 'salaried_mnc') {
    recommendedProduct = 'Prime Salaried Personal Loan (Category-A)';
    baseMinRate = 10.5;
    baseMaxRate = 12.25;
    standardTenureMonths = 48;
    standardPfPercent = 1.0;
    rateDeterminants.push({
      factor: 'Top-Tier MNC Employer',
      effect: 'lowers',
      impactBps: -150,
      description: 'Cat-A MNC corporate tie-up unlocks prime rate bands across top private & PSU banks.'
    });
  }

  // Credit Score Impact on Rate
  if (inputs.creditScoreTier === 'excellent_750_plus') {
    baseMinRate -= 0.5;
    baseMaxRate -= 0.5;
    rateDeterminants.push({
      factor: 'Prime Credit Score (750+)',
      effect: 'lowers',
      impactBps: -75,
      description: 'CIBIL 750+ qualifies for lowest risk-tier pricing with waiver on carded rates.'
    });
  } else if (inputs.creditScoreTier === 'good_700_749') {
    // Neutral benchmark
  } else if (inputs.creditScoreTier === 'fair_650_699') {
    baseMinRate += 1.5;
    baseMaxRate += 2.5;
    rateDeterminants.push({
      factor: 'Average Credit Score (650-699)',
      effect: 'raises',
      impactBps: 200,
      description: 'Below 700 triggers NBFC-tier risk pricing.'
    });
  } else if (inputs.creditScoreTier === 'poor_below_650' || (inputs.overdueBouncesCount && inputs.overdueBouncesCount > 0)) {
    baseMinRate += 3.5;
    baseMaxRate += 5.5;
    rateDeterminants.push({
      factor: 'Delinquencies / Recent Bounces',
      effect: 'raises',
      impactBps: 450,
      description: 'Recent loan bounce forces lenders into high-risk subprime underwriting.'
    });
  } else if (inputs.creditScoreTier === 'dont_know') {
    baseMaxRate += 2.0;
    rateDeterminants.push({
      factor: 'Unverified Credit History',
      effect: 'raises',
      impactBps: 150,
      description: 'Unknown score widens the ceiling until bureau verification.'
    });
  }

  // Co-applicant impact
  if (inputs.coApplicantIncome && inputs.coApplicantIncome > 0) {
    baseMinRate = Math.max(8.75, baseMinRate - 0.25);
    baseMaxRate = Math.max(9.75, baseMaxRate - 0.5);
    rateDeterminants.push({
      factor: `Co-Applicant Income (+${formatInr(inputs.coApplicantIncome)}/mo)`,
      effect: 'lowers',
      impactBps: -50,
      description: 'Adding spouse/co-borrower improves debt-service coverage ratio.'
    });
  }

  const minRate = Math.round(baseMinRate * 100) / 100;
  const maxRate = Math.round(baseMaxRate * 100) / 100;
  const medianRate = Math.round(((minRate + maxRate) / 2) * 100) / 100;

  // Upfront Fee & APR calculation
  const processingFeeAmount = Math.round(inputs.amountRequested * (standardPfPercent / 100));
  const processingFeeGst = Math.round(processingFeeAmount * 0.18);
  const totalUpfrontCharges = processingFeeAmount + processingFeeGst;

  const minApr = calculateApr(inputs.amountRequested, minRate, standardTenureMonths, standardPfPercent);
  const maxApr = calculateApr(inputs.amountRequested, maxRate, standardTenureMonths, standardPfPercent + 0.5);

  const predatoryWarning = inputs.highCostDebtApr !== undefined && inputs.highCostDebtApr >= 24;

  const o3FairRate: OutputO3_FairRate = {
    recommendedProduct,
    alternativeProducts,
    minRate,
    maxRate,
    medianRate,
    processingFeePercent: standardPfPercent,
    processingFeeAmount,
    processingFeeGst,
    totalUpfrontCharges,
    minApr,
    maxApr,
    predatoryWarning,
    predatoryThreshold: 24.0,
    rateDeterminants
  };

  // ==========================================
  // 2. O2: LENDER SANCTION vs BORROWER SAFE CAPACITY
  // ==========================================
  
  // A. Lender Likely Sanction
  let lenderLikelySanction = 0;
  let lenderMethodExplanation = '';

  if (inputs.assetBacking === 'property_commercial' && inputs.propertyValuation && inputs.propertyValuation > 0) {
    // LAP: Based on 50% LTV of property OR 60% of combined household income over 10 years
    const ltvSanction = inputs.propertyValuation * 0.55;
    const totalHouseholdInflow = inputs.monthlyInflow + (inputs.coApplicantIncome || 0);
    const incomeSanction = calculatePrincipalFromEmi(totalHouseholdInflow * 0.55 - inputs.existingEmis, medianRate, 120);
    lenderLikelySanction = Math.min(ltvSanction, Math.max(inputs.amountRequested, incomeSanction));
    lenderMethodExplanation = `Based on 55% LTV on your ₹${(inputs.propertyValuation / 100000).toFixed(1)}L shop property + combined ₹${((totalHouseholdInflow) / 1000).toFixed(0)}k/mo household cashflow over 10-yr LAP.`;
  } else if (inputs.employmentType === 'salaried_mnc' || inputs.employmentType === 'salaried_pvt') {
    // Bank FOIR model: 60% for salaried > ₹1L, 50% for others
    const lenderFoirCap = inputs.monthlyInflow >= 100000 ? 0.60 : 0.50;
    const lenderAvailableEmi = Math.max(0, (inputs.monthlyInflow * lenderFoirCap) - inputs.existingEmis);
    lenderLikelySanction = calculatePrincipalFromEmi(lenderAvailableEmi, medianRate, 60); // 5 yr max PL
    lenderMethodExplanation = `Lender uses an aggressive ${Math.round(lenderFoirCap * 100)}% FOIR ceiling on your ₹${(inputs.monthlyInflow / 1000).toFixed(0)}k net salary over a 5-year tenure.`;
  } else if (inputs.employmentType === 'self_employed_business') {
    // Unsecured based solely on ITR net profit (standard conservative bank approach)
    const monthlyItrProfit = (inputs.annualItrProfit || (inputs.monthlyInflow * 6)) / 12;
    const lenderAvailableEmi = Math.max(0, (monthlyItrProfit * 0.50) - inputs.existingEmis);
    lenderLikelySanction = calculatePrincipalFromEmi(lenderAvailableEmi, 19.0, 36);
    lenderMethodExplanation = `Without collateral, banks discount cash turnover and sanction strictly on ITR Net Profit (₹${formatInr(inputs.annualItrProfit || 0)}/yr) at 19% over 3 yrs.`;
  } else {
    // Informal / Gig
    if (inputs.overdueBouncesCount && inputs.overdueBouncesCount > 0) {
      lenderLikelySanction = 0;
      lenderMethodExplanation = 'Formal banks will reject personal loan applications due to recent overdue/bounce record and informal income proof.';
    } else if (inputs.purpose === 'vehicle_ev') {
      lenderLikelySanction = Math.round(inputs.amountRequested * 0.85); // 85% EV LTV
      lenderMethodExplanation = 'EV NBFCs will sanction up to 85% on-road asset hypothecation value with basic KYC and platform onboarding.';
    } else {
      lenderLikelySanction = 35000;
      lenderMethodExplanation = 'Capped at micro-finance / digital app thresholds (₹25,000 - ₹50,000) at high interest rates.';
    }
  }

  // B. Borrower Safe Capacity
  let safeFoirCapPercent = 0.38; // 38% for salaried
  let incomeReliability = 1.0;

  if (inputs.employmentType === 'self_employed_business') {
    safeFoirCapPercent = 0.30; // 30% for business with seasonal swings
    incomeReliability = 0.85; // 15% discount for cash variance
  } else if (inputs.employmentType === 'informal_gig') {
    safeFoirCapPercent = 0.25; // 25% for single-earner informal
    incomeReliability = 0.80;
  }

  // Monthly cashflow headroom
  const effectiveInflow = (inputs.monthlyInflow * incomeReliability) + 
                          ((inputs.coApplicantIncome || 0) * 0.85) + 
                          ((inputs.productiveYieldMonthly || 0) * 0.70);
  
  const essentialCosts = inputs.livingExpenses + inputs.rent + inputs.existingEmis;
  const emergencyReserveAllocation = inputs.monthlyInflow * 0.05; // 5% buffer
  
  const cashflowSurplusForDebt = Math.max(0, effectiveInflow - essentialCosts - emergencyReserveAllocation);
  const foirBasedBudget = Math.max(0, (inputs.monthlyInflow * safeFoirCapPercent) - inputs.existingEmis);

  // The true monthly safe debt capacity is the MIN of cashflow headroom and prudential FOIR cap
  const maxSafeMonthlyEmi = Math.round(Math.min(cashflowSurplusForDebt, foirBasedBudget));

  // Determine Safe Loan Tenure
  let safeTenureMonths = 36;
  if (inputs.assetBacking === 'property_commercial' || inputs.assetBacking === 'property_residential') {
    safeTenureMonths = 84; // 7 years for LAP
  } else if (inputs.purpose === 'wedding_consumption') {
    safeTenureMonths = 36; // 3 years max for consumption to prevent lingering debt
  } else if (inputs.purpose === 'vehicle_ev') {
    safeTenureMonths = 36;
  } else if (inputs.employmentType === 'salaried_mnc') {
    safeTenureMonths = 48;
  }

  const borrowerSafeCapacity = calculatePrincipalFromEmi(maxSafeMonthlyEmi, medianRate, safeTenureMonths);
  const utilizationPercent = borrowerSafeCapacity > 0 ? Math.round((inputs.amountRequested / borrowerSafeCapacity) * 100) : 100;
  const isStretched = inputs.amountRequested > borrowerSafeCapacity;

  let gapReason = '';
  let borrowerMethodExplanation = '';

  if (inputs.employmentType === 'salaried_mnc' || inputs.employmentType === 'salaried_pvt') {
    borrowerMethodExplanation = `Maintains a safe ${Math.round(safeFoirCapPercent * 100)}% FOIR ceiling on your take-home, leaving ₹${formatInr(inputs.monthlyInflow - inputs.rent - inputs.livingExpenses - inputs.existingEmis - maxSafeMonthlyEmi)} for lifestyle, emergency buffer, and future goals.`;
    if (lenderLikelySanction > borrowerSafeCapacity) {
      gapReason = `Lenders ignore your ₹${formatInr(inputs.rent)} rent and future goals, pushing loans up to ${formatInr(lenderLikelySanction)}. Sticking to your safe capacity (${formatInr(borrowerSafeCapacity)}) protects you from lifestyle entrapment.`;
    } else {
      gapReason = 'Safe capacity aligns well with lender underwriting limits.';
    }
  } else if (inputs.employmentType === 'self_employed_business') {
    borrowerMethodExplanation = `Based on a realistic 30% debt cap against conservative shop earnings (${formatInr(effectiveInflow)}/mo including wife's income) over a 7-year LAP.`;
    if (inputs.assetBacking === 'property_commercial') {
      gapReason = `While an unsecured loan only sanctions ${formatInr(lenderLikelySanction)}, pledging your shop in a LAP safely supports your requested ${formatInr(inputs.amountRequested)} with manageable ₹18-20k/mo EMIs.`;
    } else {
      gapReason = 'Without collateral, safe business borrowing is strictly limited by monthly cash surplus.';
    }
  } else {
    // Informal
    borrowerMethodExplanation = `Based on a tight 25% debt ceiling (max EMI ${formatInr(maxSafeMonthlyEmi)}/mo) factoring in 2 kids and single-earner risk.`;
    gapReason = inputs.overdueBouncesCount && inputs.overdueBouncesCount > 0
      ? `Recent bounces close standard bank doors. Borrowing is only safe if done via specialized EV hypothecation where ₹${inputs.productiveYieldMonthly || 4000}/mo fuel savings directly pay the EMI.`
      : 'Safe capacity is tightly bounded by high essential living costs.';
  }

  const o2Capacity: OutputO2_Capacity = {
    lenderLikelySanction,
    lenderMethodExplanation,
    borrowerSafeCapacity,
    borrowerMethodExplanation,
    recommendedBenchmark: 'BORROWER_SAFE',
    gapReason,
    utilizationPercent,
    isStretched
  };

  // ==========================================
  // 3. O1: VERDICT & REASONING ENGINE
  // ==========================================
  let decision: OutputO1_Verdict['decision'] = 'BORROW';
  let badge: OutputO1_Verdict['badge'] = 'green';
  let headline = 'Borrow with Structured Product';
  let reason = '';
  const detailedWhy: string[] = [];
  let suggestedAction = '';
  let recommendedAmount = inputs.amountRequested;

  // Rule 1: Predatory Debt / Recent Bounce Crisis (e.g. Anita)
  if (inputs.overdueBouncesCount && inputs.overdueBouncesCount > 0 && inputs.highCostDebtAmount && inputs.highCostDebtAmount > 20000) {
    decision = 'RESTRUCTURE_FIRST';
    badge = 'red';
    headline = "Do Not Take New Unsecured Debt — Restructure Predatory Loans First";
    reason = `You currently have ${formatInr(inputs.highCostDebtAmount)} in high-interest app loans with a recent bounce. Taking another loan before fixing this will cause immediate default.`;
    detailedWhy.push(`Existing app loans at 30%+ APR are draining ₹3,500+/month in non-stop interest penalties.`);
    detailedWhy.push(`A recent loan bounce reduces your bureau score and attracts aggressive recovery calls.`);
    detailedWhy.push(`For the EV scooter: Do NOT borrow cash. Seek direct OEM/NBFC asset hypothecation where vehicle fuel savings (₹4,000/mo) offset the EMI, OR approach an MFI/NGO to consolidate the ₹35k app debt first.`);
    suggestedAction = "1) Close or consolidate the 3 app loans immediately. 2) If buying the EV, apply only for direct asset financing with 15% margin money.";
    recommendedAmount = 0; // Don't take cash personal loan
  }
  // Rule 2: Over-borrowing for Non-Productive / Consumption Expense (e.g. Priya)
  else if (inputs.purpose === 'wedding_consumption' && inputs.amountRequested > 500000) {
    decision = 'BORROW_LESS';
    badge = 'yellow';
    headline = `Borrow Less: Cap Wedding Loan to ${formatInr(Math.min(500000, borrowerSafeCapacity))}`;
    reason = `Taking ₹${(inputs.amountRequested / 100000).toFixed(1)}L for a wedding at ~11.5% creates an unnecessary ₹20,000+/month EMI for 4 years on a non-earning expense.`;
    detailedWhy.push(`Wedding expenses generate 0 financial return. Borrowing ₹8,00,000 locks up ₹1,95,000 in pure interest.`);
    detailedWhy.push(`You already carry a ₹14,000 car EMI and ₹28,000 rent. A full ₹8L loan pushes your fixed monthly commitments to 58% of salary.`);
    detailedWhy.push(`Lenders will happily sanction ₹18L+ because of your MNC salary, but servicing it will delay your wealth creation and home purchase plans.`);
    suggestedAction = `Limit the loan to ₹4,00,000 - ₹5,00,000 and fund the remaining ₹3,00,000 by trimming discretionary ceremony line items or short-term personal savings.`;
    recommendedAmount = Math.min(500000, borrowerSafeCapacity);
  }
  // Rule 3: Productive Business Borrowing with Solid Collateral (e.g. Ravi)
  else if (inputs.purpose === 'business_expansion' && inputs.assetBacking === 'property_commercial') {
    decision = 'BORROW';
    badge = 'purple';
    headline = `Borrow via Secured LAP (₹${(inputs.amountRequested / 100000).toFixed(1)}L at ~9.5% - 11%)`;
    reason = `Your ₹45L unencumbered shop allows you to borrow at prime LAP rates (~10%) over 7-10 years, making the ₹15L loan easily serviceable from shop cashflow.`;
    detailedWhy.push(`Productive Purpose: Adding a second stock line and delivery vehicle increases retail sales and gross margins.`);
    detailedWhy.push(`Huge Rate Savings: Avoid unsecured business loans (18-22%). LAP saves you over ₹4,50,000 in interest over 5 years.`);
    detailedWhy.push(`Manageable Outflow: A 7-year LAP EMI is ~₹24,800/mo, which is well within your ₹40k-80k shop earnings + ₹18k wife's salary.`);
    suggestedAction = `Apply for a 7-to-10 year Loan Against Property with public sector banks (SBI/Canara) or top housing NBFCs (Bajaj Housing) with your wife as co-applicant.`;
    recommendedAmount = inputs.amountRequested;
  }
  // Rule 4: Stretched Borrowing (Requested > Safe Capacity)
  else if (isStretched) {
    decision = 'BORROW_LESS';
    badge = 'yellow';
    headline = `Borrow Less: Reduce Request to Safe Limit (${formatInr(borrowerSafeCapacity)})`;
    reason = `Your requested amount (${formatInr(inputs.amountRequested)}) exceeds your safe cashflow ceiling (${formatInr(borrowerSafeCapacity)}).`;
    detailedWhy.push(`Current living expenses, rent, and debt obligations leave insufficient headroom for the requested EMI.`);
    detailedWhy.push(`Exceeding safe capacity risks default if unexpected emergencies or medical expenses arise.`);
    suggestedAction = `Scale down the borrowing amount to ${formatInr(borrowerSafeCapacity)} or extend tenure if supported by an asset.`;
    recommendedAmount = borrowerSafeCapacity;
  }
  // Rule 5: Clean Standard Borrowing
  else {
    decision = 'BORROW';
    badge = 'green';
    headline = `Borrow with Confidence (${formatInr(inputs.amountRequested)})`;
    reason = `Your debt-to-income ratio is healthy and monthly cashflow comfortably supports this borrowing amount.`;
    detailedWhy.push(`Projected total EMI stays within safe prudential limits.`);
    detailedWhy.push(`Strong credit and income profile qualify you for competitive market rates.`);
    suggestedAction = `Compare 2-3 top lender quotes using the Negotiation Card below to lock in the lowest APR.`;
    recommendedAmount = inputs.amountRequested;
  }

  const o1Verdict: OutputO1_Verdict = {
    decision,
    badge,
    headline,
    reason,
    detailedWhy,
    suggestedAction,
    recommendedAmount
  };

  // ==========================================
  // 4. O4: SAFE EMI CEILING, TENURE TRADEOFF & STRESS TEST
  // ==========================================
  const currentEmiAtTarget = calculateEmi(inputs.amountRequested, medianRate, standardTenureMonths);
  const foirCurrent = calculateFoirPercent(inputs.existingEmis, inputs.monthlyInflow);
  const foirProjected = calculateFoirPercent(inputs.existingEmis + currentEmiAtTarget, inputs.monthlyInflow);
  const foirCeiling = Math.round(safeFoirCapPercent * 100);

  // Tenure tradeoff options
  const tenureCandidates = inputs.assetBacking === 'property_commercial'
    ? [36, 60, 84, 120]
    : [24, 36, 48, 60];

  const tenureTradeoffs: TenureOption[] = tenureCandidates.map((tMonths) => {
    const emi = calculateEmi(inputs.amountRequested, medianRate, tMonths);
    const totalOutflow = emi * tMonths;
    const totalInterest = totalOutflow - inputs.amountRequested;
    const projectedFoir = calculateFoirPercent(inputs.existingEmis + emi, inputs.monthlyInflow);
    const safe = emi <= maxSafeMonthlyEmi;

    let recommendationNote = 'Balanced EMI & Interest';
    if (tMonths === 24) recommendationNote = 'Lowest Interest, Heavy Monthly EMI';
    else if (tMonths === 60 || tMonths === 120) recommendationNote = 'Lowest EMI, High Total Interest Cost';
    else if (tMonths === standardTenureMonths) recommendationNote = '★ Recommended Optimal Tenure';

    return {
      tenureMonths: tMonths,
      monthlyEmi: emi,
      totalInterest,
      totalOutflow,
      projectedFoir,
      safe,
      recommendationNote
    };
  });

  // Stress Scenarios
  // 1. Income Drop: 20% drop
  const stressedInflow = inputs.monthlyInflow * 0.80;
  const stressedFoirIncomeDrop = calculateFoirPercent(inputs.existingEmis + currentEmiAtTarget, stressedInflow);
  const isIncomeDropPass = stressedFoirIncomeDrop <= (safeFoirCapPercent * 100 + 10);

  // 2. Rate Hike: +200 bps
  const stressedRate = medianRate + 2.0;
  const stressedEmiRateHike = calculateEmi(inputs.amountRequested, stressedRate, standardTenureMonths);
  const stressedFoirRateHike = calculateFoirPercent(inputs.existingEmis + stressedEmiRateHike, inputs.monthlyInflow);
  const isRateHikePass = stressedEmiRateHike <= (maxSafeMonthlyEmi * 1.12);

  // 3. Expense Shock: +₹5,000/mo inflation / medical
  const stressedSurplusLeft = inputs.monthlyInflow - inputs.livingExpenses - inputs.rent - inputs.existingEmis - currentEmiAtTarget - 5000;
  const isExpenseShockPass = stressedSurplusLeft >= 0;

  const o4SafeEmi: OutputO4_SafeEmi = {
    recommendedTenureMonths: standardTenureMonths,
    maxSafeEmiCeiling: maxSafeMonthlyEmi,
    currentEmiAtTarget,
    foirCurrent,
    foirProjected,
    foirCeiling,
    tenureTradeoffs,
    stressScenarios: {
      incomeDrop: {
        title: 'Income Drops 20%',
        stressFactor: 'Loss of overtime, retail dip, or partial layoff',
        stressedInflowOrRate: `${formatInr(stressedInflow)}/mo`,
        resultingEmi: currentEmiAtTarget,
        resultingFoir: stressedFoirIncomeDrop,
        isPass: isIncomeDropPass,
        verdict: isIncomeDropPass ? 'PASSED: Debt remains manageable' : 'STRESSED: Debt takes over 50% of income',
        impactNote: isIncomeDropPass
          ? `Surplus remains sufficient to cover basic expenses.`
          : `At ${stressedFoirIncomeDrop}% FOIR, you would be forced to dip into savings to pay rent.`
      },
      rateHike: {
        title: 'Interest Rate Rises +2.00%',
        stressFactor: 'RBI Repo Rate Hike on floating rate loan',
        stressedInflowOrRate: `${stressedRate.toFixed(2)}% p.a.`,
        resultingEmi: stressedEmiRateHike,
        resultingFoir: stressedFoirRateHike,
        isPass: isRateHikePass,
        verdict: isRateHikePass ? 'PASSED: EMI buffer absorbs hike' : 'STRESSED: EMI increases significantly',
        impactNote: `Monthly EMI increases by ${formatInr(stressedEmiRateHike - currentEmiAtTarget)}/mo (+${formatInr((stressedEmiRateHike - currentEmiAtTarget) * standardTenureMonths)} over tenure).`
      },
      expenseShock: {
        title: 'Household Expense Shock (+₹5,000/mo)',
        stressFactor: 'Medical emergency, family support, or inflation',
        stressedInflowOrRate: `+₹5,000/mo costs`,
        resultingEmi: currentEmiAtTarget,
        resultingFoir: foirProjected,
        isPass: isExpenseShockPass,
        verdict: isExpenseShockPass ? 'PASSED: Positive residual cashflow' : 'FAILED: Monthly deficit created',
        impactNote: isExpenseShockPass
          ? `You still retain ${formatInr(stressedSurplusLeft)}/month net cushion.`
          : `Creates a monthly cashflow deficit of ${formatInr(Math.abs(stressedSurplusLeft))}/month.`
      }
    }
  };

  // ==========================================
  // 5. NEGOTIATION CARD GENERATION
  // ==========================================
  const leverageBadges: LeverageBadge[] = [];

  if (inputs.creditScoreTier === 'excellent_750_plus') {
    leverageBadges.push({
      title: 'CIBIL 780+ Prime Score',
      subtitle: 'Qualifies for Tier-1 corporate carded rate pricing',
      strength: 'strong'
    });
  }
  if (inputs.employmentType === 'salaried_mnc') {
    leverageBadges.push({
      title: 'Cat-A MNC Salary Account',
      subtitle: 'Zero foreclosure charge eligible under corporate tie-up',
      strength: 'strong'
    });
  }
  if (inputs.assetBacking === 'property_commercial' && inputs.propertyValuation) {
    leverageBadges.push({
      title: `Unencumbered ₹${(inputs.propertyValuation / 100000).toFixed(0)}L Commercial Asset`,
      subtitle: 'Low 33% LTV provides supreme lender security',
      strength: 'strong'
    });
  }
  if (inputs.coApplicantIncome && inputs.coApplicantIncome > 0) {
    leverageBadges.push({
      title: `Co-Applicant (+${formatInr(inputs.coApplicantIncome)}/mo)`,
      subtitle: 'Dual household earner stability',
      strength: 'moderate'
    });
  }
  if (foirCurrent < 20) {
    leverageBadges.push({
      title: 'Low Existing Debt (FOIR < 20%)',
      subtitle: 'Clean balance sheet with no repayment baggage',
      strength: 'strong'
    });
  }

  // Tactical Objection Handlers & Negotiation Script
  let primaryCounterScript = '';
  const objectionHandlers: ObjectionHandler[] = [];

  if (inputs.employmentType === 'salaried_mnc') {
    primaryCounterScript = `“My CIBIL is ${inputs.creditScoreTier === 'excellent_750_plus' ? '780+' : 'good'} and I have been with a Tier-1 MNC for ${inputs.tenureYears || 5} years with existing FOIR under 15%. Top private banks (HDFC/ICICI) offer 10.50% - 11.25% for my profile. If you cannot match 11.25% with a 1.0% processing fee cap and zero foreclosure penalty after 12 months, I will proceed with my salary account bank.”`;
    
    objectionHandlers.push({
      lenderPitch: '“Our system generated 14.25% for you because personal loan card rates start there.”',
      borrowerCounter: '“14.25% is for open-market retail applicants. Tier-1 MNC employees are classified as Category-A Corporate with special pricing grids between 10.75% and 11.50%. Please escalate to your credit manager for special grid approval.”',
      tacticalTip: 'Do not negotiate with the branch executive; ask for the Credit Relationship Manager or Branch Manager.'
    });

    objectionHandlers.push({
      lenderPitch: '“You must take our mandatory Credit Shield Insurance of ₹28,000 added to the loan.”',
      borrowerCounter: '“Per RBI Master Direction (2023), bundling credit life insurance with personal loans is voluntary. I already maintain a ₹1 Crore term life insurance policy. Do not add this premium to my principal.”',
      tacticalTip: 'Check the sanction letter draft carefully. If insurance is added, refuse to sign until it is removed.'
    });
  } else if (inputs.employmentType === 'self_employed_business') {
    primaryCounterScript = `“I run an established kirana business for 14 years and own my shop premises worth ₹45,00,000 unencumbered. I am not interested in an unsecured business loan at 19-22%. I am offering first-charge registered mortgage on this commercial property for a Loan Against Property (LAP) at 9.50% - 10.50% over 7 years with my spouse as co-applicant.”`;

    objectionHandlers.push({
      lenderPitch: '“Your ITR only shows ₹4.2 Lakhs net profit, so we can only sanction ₹4 Lakhs on business loan.”',
      borrowerCounter: '“That is for unsecured loans. Under LAP / SME surrogate programs (Gross Turnover / Banking Surrogate), you evaluate my ₹60k-80k/mo banking cashflow and 33% LTV on a ₹45L commercial property. Please route this through your Secured Mortgage / SME desk, not the retail unsecured sales team.”',
      tacticalTip: 'Never let a DSA (Direct Selling Agent) route you through NBFC unsecured apps when you possess clear property deeds.'
    });

    objectionHandlers.push({
      lenderPitch: '“Processing fee for LAP is 2% plus legal & valuation charges.”',
      borrowerCounter: '“PSU and top private banks cap LAP processing fees at 0.5% to 1.0% max (up to ₹15,000). I will agree to 0.75% + actual legal/valuation receipts.”',
      tacticalTip: 'Demand a fee waiver or cap before handing over property document copies for legal search.'
    });
  } else {
    // Informal / Gig (Anita)
    primaryCounterScript = `“I do not want an unsecured digital personal loan at 30%+ APR. I am purchasing an electric delivery vehicle for commercial work that saves ₹4,000/month in petrol. I require a standard vehicle hypothecation loan at 13.5% - 15% with 15% margin money from an OEM-tied EV lender (e.g. Hero Fincorp / Bajaj), with monthly EMI capped under ₹3,800.”`;

    objectionHandlers.push({
      lenderPitch: '“Take our instant 15-day digital loan on the app; approval in 2 minutes.”',
      borrowerCounter: '“Instant app loans charge over 36% APR with heavy roll-over penalties. I will only accept formal monthly EMI vehicle financing from RBI-regulated NBFCs with hypothecation on RC.”',
      tacticalTip: 'Decline all instant SMS/WhatsApp pre-approved loan links. Work directly with the EV dealership finance counter.'
    });
  }

  const walkAwayRedlines = [
    `Never accept an interest rate higher than ${maxRate.toFixed(2)}% p.a. (fair ceiling for your risk profile).`,
    `Never pay an upfront processing fee exceeding ${(standardPfPercent + 0.5).toFixed(1)}% + GST.`,
    `Refuse any loan with mandatory single-premium insurance bundled into the disbursement.`,
    `Ensure foreclosure / prepayment penalty is 0% (mandatory for floating rate individual loans per RBI).`,
    `Verify that interest is calculated on Daily Reducing Balance, never Flat Rate.`
  ];

  const branchChecklist = [
    'Original Aadhaar & PAN card copy',
    inputs.employmentType === 'salaried_mnc' ? 'Last 3 months salary slips + 6 months bank statement' : 'Last 12 months bank statement / UPI merchant summary',
    inputs.assetBacking === 'property_commercial' ? 'Copy of registered Sale Deed, Title Search & Tax Receipts' : 'Vehicle Quotation / Proforma Invoice from authorized dealer',
    'Official email ID / employer badge / business registration (Udyam)',
    'Written counter-offer script printed or saved on phone'
  ];

  const borrowerProfileSummary = `${inputs.age} yrs · ${inputs.employmentType.replace('_', ' ').toUpperCase()} · Inflow: ${formatInr(inputs.monthlyInflow)}/mo · Credit: ${inputs.creditScoreTier.replace('_', ' ').toUpperCase()}`;

  const negotiationCard: NegotiationCard = {
    borrowerProfileSummary,
    leverageBadges,
    targetRate: minRate,
    rateCeiling: maxRate,
    targetApr: minApr,
    maxProcessingFeePercent: standardPfPercent,
    suggestedTenureMonths: standardTenureMonths,
    primaryCounterScript,
    objectionHandlers,
    walkAwayRedlines,
    branchChecklist
  };

  return {
    inputs,
    o1Verdict,
    o2Capacity,
    o3FairRate,
    o4SafeEmi,
    negotiationCard,
    confidence,
    assumptionsUsed
  };
}
