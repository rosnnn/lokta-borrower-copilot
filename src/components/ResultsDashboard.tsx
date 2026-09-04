import React, { useState } from 'react';
import { AssessmentResult } from '../engine/types';
import { formatInr } from '../engine/calculator';
import {
  TrendingDown,
  TrendingUp,
  ArrowRight,
  Info
} from 'lucide-react';

interface ResultsDashboardProps {
  result: AssessmentResult;
  onOpenNegotiation: () => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ result, onOpenNegotiation }) => {
  const { o1Verdict, o2Capacity, o3FairRate, o4SafeEmi, inputs } = result;
  const [selectedTenure, setSelectedTenure] = useState<number>(o4SafeEmi.recommendedTenureMonths);

  const activeTenureOption = o4SafeEmi.tenureTradeoffs.find(t => t.tenureMonths === selectedTenure) || o4SafeEmi.tenureTradeoffs[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* ==================================================== */}
      {/* OUTPUT 1 (O1): BORROW / DONT BORROW / BORROW LESS    */}
      {/* ==================================================== */}
      <div
        className="card"
        style={{
          borderLeft: `6px solid ${
            o1Verdict.decision === 'BORROW'
              ? 'var(--success)'
              : o1Verdict.decision === 'BORROW_LESS'
              ? 'var(--warn)'
              : 'var(--danger)'
          }`,
          background: 'var(--bg3)',
          position: 'relative'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent)', background: 'var(--accent-soft)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
              OUTPUT O1
            </span>
            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, color: 'var(--muted)' }}>
              Prudential Verdict
            </span>
          </div>

          <span
            className={`badge ${
              o1Verdict.decision === 'BORROW'
                ? 'badge-green'
                : o1Verdict.decision === 'BORROW_LESS'
                ? 'badge-yellow'
                : 'badge-red'
            }`}
            style={{ fontSize: '0.85rem', padding: '0.35rem 0.8rem' }}
          >
            {o1Verdict.decision.replace('_', ' ')}
          </span>
        </div>

        <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--display)', fontWeight: 600, lineHeight: 1.25, marginBottom: '0.5rem', color: 'var(--ink)' }}>
          {o1Verdict.headline}
        </h3>

        <p style={{ fontSize: '1.02rem', color: 'var(--ink-secondary)', marginBottom: '1rem', lineHeight: 1.45 }}>
          {o1Verdict.reason}
        </p>

        {/* Detailed Reasons */}
        <div style={{ background: 'var(--bg2)', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid var(--rule)', marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted)', marginBottom: '0.5rem' }}>
            Why This Verdict:
          </div>
          <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.9rem', color: 'var(--ink)' }}>
            {o1Verdict.detailedWhy.map((why, idx) => (
              <li key={idx} style={{ marginBottom: '0.35rem' }}>
                {why}
              </li>
            ))}
          </ul>
        </div>

        {/* Suggested Action Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--rule-light)' }}>
          <div style={{ fontSize: '0.88rem', color: 'var(--accent)', fontWeight: 500 }}>
            <strong>Actionable Next Step:</strong> {o1Verdict.suggestedAction}
          </div>
          {o1Verdict.recommendedAmount > 0 && o1Verdict.recommendedAmount !== inputs.amountRequested && (
            <div style={{ fontSize: '0.85rem', background: 'var(--warn-soft)', color: 'var(--warn)', padding: '0.3rem 0.65rem', borderRadius: '6px', fontWeight: 600 }}>
              Prudent Target: {formatInr(o1Verdict.recommendedAmount)}
            </div>
          )}
        </div>
      </div>

      {/* ==================================================== */}
      {/* OUTPUT 2 (O2): DUAL CAPACITY (LENDER vs BORROWER)    */}
      {/* ==================================================== */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent)', background: 'var(--accent-soft)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
              OUTPUT O2
            </span>
            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, color: 'var(--muted)' }}>
              Dual Maximum Capacity
            </span>
          </div>

          <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
            Benchmark to Follow: <strong style={{ color: 'var(--accent)' }}>Borrower Safe Capacity</strong>
          </div>
        </div>

        <div className="grid-2" style={{ marginBottom: '1rem' }}>
          
          {/* Card A: Lender Sanction */}
          <div style={{
            background: 'var(--bg2)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--rule)',
            position: 'relative'
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)', marginBottom: '0.25rem' }}>
              What a Lender Will Likely Sanction
            </div>
            <div className="num" style={{ fontSize: '1.8rem', fontWeight: 600, color: o2Capacity.lenderLikelySanction > 0 ? 'var(--ink)' : 'var(--danger)', marginBottom: '0.5rem' }}>
              {o2Capacity.lenderLikelySanction > 0 ? formatInr(o2Capacity.lenderLikelySanction) : '₹0 (Rejection Risk)'}
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted)', margin: 0 }}>
              {o2Capacity.lenderMethodExplanation}
            </p>
          </div>

          {/* Card B: Borrower Safe Capacity */}
          <div style={{
            background: 'var(--accent-soft)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            border: '2px solid var(--accent)',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent)' }}>
                ★ What You Can Safely Carry
              </div>
              <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>
                Safe Limit
              </span>
            </div>
            <div className="num" style={{ fontSize: '1.8rem', fontWeight: 600, color: 'var(--accent)', marginBottom: '0.5rem' }}>
              {formatInr(o2Capacity.borrowerSafeCapacity)}
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--ink)', margin: 0 }}>
              {o2Capacity.borrowerMethodExplanation}
            </p>
          </div>

        </div>

        {/* Gap Explanation Callout */}
        <div style={{ background: 'var(--bg)', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid var(--rule)', fontSize: '0.88rem' }}>
          <strong>The Gap Explained:</strong> {o2Capacity.gapReason}
        </div>
      </div>

      {/* ==================================================== */}
      {/* OUTPUT 3 (O3): FAIR INTEREST RATE & ALL-IN APR       */}
      {/* ==================================================== */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent)', background: 'var(--accent-soft)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
              OUTPUT O3
            </span>
            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, color: 'var(--muted)' }}>
              Fair Interest Rate Band &amp; True APR
            </span>
          </div>

          <span className="badge badge-purple" style={{ fontSize: '0.78rem' }}>
            {o3FairRate.recommendedProduct}
          </span>
        </div>

        {/* Rate Band & APR Highlight Boxes */}
        <div className="grid-3" style={{ marginBottom: '1.25rem' }}>
          
          <div style={{ background: 'var(--bg2)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--rule)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              Fair Interest Rate Band
            </div>
            <div className="num" style={{ fontSize: '1.6rem', fontWeight: 600, color: 'var(--accent)' }}>
              {o3FairRate.minRate}% – {o3FairRate.maxRate}%
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.2rem' }}>
              Nominal reducing rate p.a.
            </div>
          </div>

          <div style={{ background: 'var(--bg2)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--rule)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              All-In Cost (True APR)
            </div>
            <div className="num" style={{ fontSize: '1.6rem', fontWeight: 600, color: 'var(--ink)' }}>
              {o3FairRate.minApr}% – {o3FairRate.maxApr}%
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.2rem' }}>
              Includes {o3FairRate.processingFeePercent}% PF + 18% GST ({formatInr(o3FairRate.totalUpfrontCharges)})
            </div>
          </div>

          <div style={{ background: 'var(--bg2)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--rule)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              Max Upfront Fee Cap
            </div>
            <div className="num" style={{ fontSize: '1.6rem', fontWeight: 600, color: 'var(--ink)' }}>
              {o3FairRate.processingFeePercent}% + GST
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.2rem' }}>
              Ceiling to accept ({formatInr(o3FairRate.totalUpfrontCharges)} total)
            </div>
          </div>

        </div>

        {/* Rate Determinants / Why this rate */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted)', marginBottom: '0.5rem' }}>
            What Moves Your Rate:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
            {o3FairRate.rateDeterminants.map((det, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--bg)',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '6px',
                  border: '1px solid var(--rule)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.6rem'
                }}
              >
                {det.effect === 'lowers' ? (
                  <TrendingDown size={18} color="var(--success)" style={{ flexShrink: 0, marginTop: '2px' }} />
                ) : det.effect === 'raises' ? (
                  <TrendingUp size={18} color="var(--danger)" style={{ flexShrink: 0, marginTop: '2px' }} />
                ) : (
                  <Info size={18} color="var(--muted)" style={{ flexShrink: 0, marginTop: '2px' }} />
                )}
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink)' }}>
                    {det.factor} ({det.impactBps > 0 ? `+${det.impactBps}` : det.impactBps} bps)
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
                    {det.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alternative Product / Predatory Warning */}
        {o3FairRate.alternativeProducts.length > 0 && (
          <div style={{ background: 'var(--warn-soft)', border: '1px solid var(--warn-border)', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--warn)' }}>
            <strong>Comparison with other products:</strong> {o3FairRate.alternativeProducts[0].name} ({o3FairRate.alternativeProducts[0].minRate}% - {o3FairRate.alternativeProducts[0].maxRate}%) — {o3FairRate.alternativeProducts[0].note}
          </div>
        )}
      </div>

      {/* ==================================================== */}
      {/* OUTPUT 4 (O4): EMI CEILING, TENURE & STRESS TESTING  */}
      {/* ==================================================== */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent)', background: 'var(--accent-soft)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
              OUTPUT O4
            </span>
            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, color: 'var(--muted)' }}>
              Safe Monthly EMI Ceiling &amp; Stress Testing
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>Projected FOIR:</span>
            <span className="num" style={{ fontWeight: 600, color: o4SafeEmi.foirProjected <= o4SafeEmi.foirCeiling ? 'var(--success)' : 'var(--danger)' }}>
              {o4SafeEmi.foirProjected}% (Ceiling: {o4SafeEmi.foirCeiling}%)
            </span>
          </div>
        </div>

        {/* Monthly Ceiling Hero */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg2)', padding: '1rem 1.25rem', borderRadius: '8px', border: '1px solid var(--rule)', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 600, color: 'var(--muted)' }}>
              Maximum Safe Monthly EMI Ceiling
            </div>
            <div className="num" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent)' }}>
              {formatInr(o4SafeEmi.maxSafeEmiCeiling)}<span style={{ fontSize: '0.9rem', fontWeight: 400, color: 'var(--muted)' }}> / month</span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
              Estimated EMI at Requested {formatInr(inputs.amountRequested)}:
            </div>
            <div className="num" style={{ fontSize: '1.4rem', fontWeight: 600, color: activeTenureOption.safe ? 'var(--ink)' : 'var(--warn)' }}>
              {formatInr(activeTenureOption.monthlyEmi)} / mo
            </div>
          </div>
        </div>

        {/* Tenure Tradeoff Table / Selector */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted)', marginBottom: '0.5rem' }}>
            Tenure Tradeoff Matrix (Select to compare):
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--rule)' }}>
                  <th style={{ padding: '0.6rem 0.8rem', textAlign: 'left' }}>Tenure</th>
                  <th style={{ padding: '0.6rem 0.8rem', textAlign: 'right' }}>Monthly EMI</th>
                  <th style={{ padding: '0.6rem 0.8rem', textAlign: 'right' }}>Total Interest</th>
                  <th style={{ padding: '0.6rem 0.8rem', textAlign: 'right' }}>Total Outflow</th>
                  <th style={{ padding: '0.6rem 0.8rem', textAlign: 'center' }}>Safety Status</th>
                </tr>
              </thead>
              <tbody>
                {o4SafeEmi.tenureTradeoffs.map((opt) => {
                  const isSelected = opt.tenureMonths === selectedTenure;
                  return (
                    <tr
                      key={opt.tenureMonths}
                      onClick={() => setSelectedTenure(opt.tenureMonths)}
                      style={{
                        background: isSelected ? 'var(--accent-soft)' : 'transparent',
                        borderBottom: '1px solid var(--rule)',
                        cursor: 'pointer',
                        fontWeight: isSelected ? 600 : 400
                      }}
                    >
                      <td style={{ padding: '0.6rem 0.8rem' }}>
                        {opt.tenureMonths} Months ({opt.tenureMonths / 12} Yrs)
                        <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{opt.recommendationNote}</div>
                      </td>
                      <td className="num" style={{ padding: '0.6rem 0.8rem', textAlign: 'right' }}>
                        {formatInr(opt.monthlyEmi)}
                      </td>
                      <td className="num" style={{ padding: '0.6rem 0.8rem', textAlign: 'right', color: 'var(--muted)' }}>
                        {formatInr(opt.totalInterest)}
                      </td>
                      <td className="num" style={{ padding: '0.6rem 0.8rem', textAlign: 'right' }}>
                        {formatInr(opt.totalOutflow)}
                      </td>
                      <td style={{ padding: '0.6rem 0.8rem', textAlign: 'center' }}>
                        <span className={`badge ${opt.safe ? 'badge-green' : 'badge-yellow'}`} style={{ fontSize: '0.72rem' }}>
                          {opt.safe ? 'Safe' : 'Stretched'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stress Scenarios Grid */}
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted)', marginBottom: '0.5rem' }}>
            Stress Case Health Check (What if income drops or rate rises?):
          </div>
          <div className="grid-3">
            {Object.values(o4SafeEmi.stressScenarios).map((sc, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--bg)',
                  padding: '0.85rem',
                  borderRadius: '8px',
                  border: `1px solid ${sc.isPass ? 'var(--rule)' : 'var(--danger-border)'}`
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink)' }}>{sc.title}</span>
                  <span className={`badge ${sc.isPass ? 'badge-green' : 'badge-red'}`} style={{ fontSize: '0.68rem' }}>
                    {sc.isPass ? 'PASSED' : 'STRESSED'}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '0.4rem' }}>
                  {sc.stressFactor}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--ink-secondary)' }}>
                  {sc.impactNote}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* CTA to Open Negotiation Card */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.5rem' }}>
        <button
          onClick={onOpenNegotiation}
          style={{
            background: 'var(--accent)',
            color: 'var(--accent-ink)',
            border: 'none',
            padding: '0.85rem 1.75rem',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          <span>Open Branch Negotiation Card &amp; Counter-Scripts</span>
          <ArrowRight size={18} />
        </button>
      </div>

    </div>
  );
};
