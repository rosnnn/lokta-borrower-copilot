import React, { useState } from 'react';
import { AssessmentResult } from '../engine/types';
import { calculateEmi, calculateFoirPercent, formatInr } from '../engine/calculator';
import { SlidersHorizontal, AlertTriangle, ShieldCheck } from 'lucide-react';

interface StressTesterProps {
  result: AssessmentResult;
}

export const StressTester: React.FC<StressTesterProps> = ({ result }) => {
  const { inputs, o3FairRate, o4SafeEmi } = result;

  const [incomeDropPct, setIncomeDropPct] = useState<number>(20);
  const [rateHikeBps, setRateHikeBps] = useState<number>(200); // 2.0%
  const [extraExpense, setExtraExpense] = useState<number>(5000);
  const [testTenure, setTestTenure] = useState<number>(o4SafeEmi.recommendedTenureMonths);

  // Dynamic calculations under custom stress
  const stressedIncome = Math.max(1000, inputs.monthlyInflow * (1 - incomeDropPct / 100));
  const stressedRate = o3FairRate.medianRate + (rateHikeBps / 100);
  const stressedEmi = calculateEmi(inputs.amountRequested, stressedRate, testTenure);
  const totalStressedDebt = inputs.existingEmis + stressedEmi;
  const stressedFoir = calculateFoirPercent(totalStressedDebt, stressedIncome);

  const stressedDisposableSurplus = stressedIncome - inputs.livingExpenses - inputs.rent - extraExpense - totalStressedDebt;
  const isHealthy = stressedDisposableSurplus >= 0 && stressedFoir <= (o4SafeEmi.foirCeiling + 10);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.35rem', fontFamily: 'var(--display)', fontWeight: 600 }}>
          Live Financial Stress Simulator
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
          Test your borrowing resilience against real-world shocks (income loss, repo rate hikes, inflation).
        </p>
      </div>

      <div className="grid-2">
        
        {/* Left Column: Interactive Shock Sliders */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--rule)', paddingBottom: '0.5rem' }}>
            <SlidersHorizontal size={18} color="var(--accent)" />
            <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>Adjust Stress Parameters</h3>
          </div>

          {/* Shock 1: Income Drop */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>1. Monthly Income Contraction</label>
              <span className="num" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--danger)' }}>
                -{incomeDropPct}% ({formatInr(stressedIncome)}/mo)
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={60}
              step={5}
              value={incomeDropPct}
              onChange={(e) => setIncomeDropPct(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--danger)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--muted)' }}>
              <span>0% (Normal)</span>
              <span>-30% (Severe)</span>
              <span>-60% (Crisis)</span>
            </div>
          </div>

          {/* Shock 2: Interest Rate Spike */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>2. Floating Rate Spike</label>
              <span className="num" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--warn)' }}>
                +{rateHikeBps / 100}% (Total: {stressedRate.toFixed(2)}%)
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={500}
              step={25}
              value={rateHikeBps}
              onChange={(e) => setRateHikeBps(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--warn)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--muted)' }}>
              <span>+0%</span>
              <span>+2.5%</span>
              <span>+5.0%</span>
            </div>
          </div>

          {/* Shock 3: Unplanned Expenses */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>3. Monthly Expense Shock (Medical / Inflation)</label>
              <span className="num" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                +{formatInr(extraExpense)}/mo
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={25000}
              step={1000}
              value={extraExpense}
              onChange={(e) => setExtraExpense(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--ink)' }}
            />
          </div>

          {/* Tenure Adjuster */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Loan Tenure</label>
              <span className="num" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                {testTenure} Months ({testTenure / 12} Yrs)
              </span>
            </div>
            <input
              type="range"
              min={12}
              max={120}
              step={12}
              value={testTenure}
              onChange={(e) => setTestTenure(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent)' }}
            />
          </div>

        </div>

        {/* Right Column: Stressed Health Metrics */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--rule)', paddingBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>Simulated Financial Vital Signs</h3>
            <span className={`badge ${isHealthy ? 'badge-green' : 'badge-red'}`}>
              {isHealthy ? 'SOLVENT' : 'DEFAULT RISK'}
            </span>
          </div>

          {/* Big Health Banner */}
          <div style={{
            background: isHealthy ? 'var(--success-soft)' : 'var(--danger-soft)',
            border: `1px solid ${isHealthy ? 'var(--success-border)' : 'var(--danger-border)'}`,
            padding: '1rem',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            {isHealthy ? <ShieldCheck size={28} color="var(--success)" /> : <AlertTriangle size={28} color="var(--danger)" />}
            <div>
              <div style={{ fontWeight: 600, color: isHealthy ? 'var(--success)' : 'var(--danger)', fontSize: '0.95rem' }}>
                {isHealthy ? 'Borrower Survives Stress Test' : 'Cashflow Deficit Under Stress'}
              </div>
              <div style={{ fontSize: '0.82rem', color: isHealthy ? 'var(--ink)' : 'var(--danger)' }}>
                {isHealthy
                  ? `You retain ${formatInr(stressedDisposableSurplus)}/month positive cushion after all living costs and debt.`
                  : `Monthly deficit of ${formatInr(Math.abs(stressedDisposableSurplus))}. Savings will be depleted rapidly.`}
              </div>
            </div>
          </div>

          {/* Metric Rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--rule-light)' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Stressed Monthly EMI:</span>
              <span className="num" style={{ fontWeight: 600, fontSize: '0.95rem' }}>{formatInr(stressedEmi)} / mo</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--rule-light)' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Stressed FOIR (Debt-to-Income):</span>
              <span className="num" style={{ fontWeight: 600, fontSize: '0.95rem', color: stressedFoir <= o4SafeEmi.foirCeiling ? 'var(--success)' : 'var(--danger)' }}>
                {stressedFoir}% (Safe Ceiling: {o4SafeEmi.foirCeiling}%)
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--rule-light)' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Net Residual Surplus Left:</span>
              <span className="num" style={{ fontWeight: 700, fontSize: '1.05rem', color: stressedDisposableSurplus >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                {formatInr(stressedDisposableSurplus)} / mo
              </span>
            </div>
          </div>

          {/* Takeaway recommendation */}
          <div style={{ background: 'var(--bg2)', padding: '0.75rem 1rem', borderRadius: '6px', fontSize: '0.82rem', color: 'var(--muted)' }}>
            <strong>Prudential Rule:</strong> Always keep a minimum 3-6 month emergency living reserve before taking a loan so rate hikes never trigger missed payments.
          </div>

        </div>

      </div>

    </div>
  );
};
