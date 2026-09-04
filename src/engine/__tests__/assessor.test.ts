import { describe, it, expect } from 'vitest';
import { runBorrowerAssessment } from '../assessor';
import { calculateEmi, calculateApr, calculatePrincipalFromEmi, formatInr } from '../calculator';
import { PERSONA_PRIYA, PERSONA_RAVI, PERSONA_ANITA } from '../personas';

describe('Financial Math Core', () => {
  it('calculates standard reducing balance EMI correctly', () => {
    // ₹10,00,000 at 12% p.a. for 36 months -> standard EMI is ₹33,214
    const emi = calculateEmi(1000000, 12, 36);
    expect(emi).toBe(33214);
  });

  it('calculates principal from target EMI accurately', () => {
    const emi = 33214;
    const principal = calculatePrincipalFromEmi(emi, 12, 36);
    expect(Math.abs(principal - 1000000)).toBeLessThan(100);
  });

  it('calculates RBI APR higher than nominal rate due to upfront fee + GST', () => {
    // ₹5,00,000 at 11% for 36 months with 1.5% fee + 18% GST (Total fee 1.77%)
    const apr = calculateApr(500000, 11, 36, 1.5);
    expect(apr).toBeGreaterThan(11.0);
    expect(apr).toBeLessThan(13.0);
  });

  it('formats Indian rupees properly with commas (Lakhs / Crores)', () => {
    expect(formatInr(800000)).toBe('₹8,00,000');
    expect(formatInr(1500000)).toBe('₹15,00,000');
    expect(formatInr(14000)).toBe('₹14,000');
  });
});

describe('Persona 1: Priya (Bengaluru Salaried SWE)', () => {
  const result = runBorrowerAssessment(PERSONA_PRIYA.inputs);

  it('gives BORROW_LESS verdict for wedding consumption', () => {
    expect(result.o1Verdict.decision).toBe('BORROW_LESS');
    expect(result.o1Verdict.recommendedAmount).toBeLessThanOrEqual(500000);
    expect(result.o1Verdict.reason).toContain('wedding');
  });

  it('clearly separates high lender sanction from borrower safe capacity', () => {
    // Lender will sanction up to ~18-20L on 1.1L salary, but safe is lower
    expect(result.o2Capacity.lenderLikelySanction).toBeGreaterThan(1500000);
    expect(result.o2Capacity.recommendedBenchmark).toBe('BORROWER_SAFE');
  });

  it('provides prime salaried rate band (10.0% - 11.75%)', () => {
    expect(result.o3FairRate.minRate).toBeLessThanOrEqual(10.5);
    expect(result.o3FairRate.maxRate).toBeLessThanOrEqual(12.0);
    expect(result.o3FairRate.processingFeePercent).toBe(1.0);
  });

  it('generates high confidence score with tight band', () => {
    expect(result.confidence.scorePercent).toBeGreaterThanOrEqual(80);
    expect(result.confidence.bandWidth).toBe('NARROW');
  });
});

describe('Persona 2: Ravi (Mysuru Kirana Owner)', () => {
  const result = runBorrowerAssessment(PERSONA_RAVI.inputs);

  it('routes to Secured LAP rather than usurious unsecured business loan', () => {
    expect(result.o1Verdict.decision).toBe('BORROW');
    expect(result.o3FairRate.recommendedProduct).toContain('Loan Against Property');
    expect(result.o3FairRate.minRate).toBeLessThanOrEqual(9.5);
  });

  it('proves asset-backed sanction on ₹45L property supports ₹15L request', () => {
    expect(result.o2Capacity.lenderLikelySanction).toBeGreaterThanOrEqual(1500000);
  });

  it('provides counter-scripts against DSAs pushing unsecured loans', () => {
    expect(result.negotiationCard.primaryCounterScript).toContain('Loan Against Property');
  });
});

describe('Persona 3: Anita (Hubballi Gig Rider)', () => {
  const result = runBorrowerAssessment(PERSONA_ANITA.inputs);

  it('triggers RESTRUCTURE_FIRST alert due to 30%+ predatory app loans & bounce', () => {
    expect(result.o1Verdict.decision).toBe('RESTRUCTURE_FIRST');
    expect(result.o3FairRate.predatoryWarning).toBe(true);
  });

  it('warns that formal bank unsecured sanction is zero', () => {
    expect(result.o2Capacity.lenderLikelySanction).toBe(0);
  });

  it('gives clear guidance on EV hypothecation vs predatory cash loans', () => {
    expect(result.o1Verdict.suggestedAction).toContain('margin money');
  });
});
