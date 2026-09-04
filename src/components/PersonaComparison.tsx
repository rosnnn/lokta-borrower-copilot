import React from 'react';
import { PERSONAS_LIST } from '../engine/personas';
import { runBorrowerAssessment } from '../engine/assessor';
import { formatInr } from '../engine/calculator';
import { PersonaDefinition } from '../engine/types';
import { ArrowRight } from 'lucide-react';

interface PersonaComparisonProps {
  onSelectPersona: (persona: PersonaDefinition) => void;
}

export const PersonaComparison: React.FC<PersonaComparisonProps> = ({ onSelectPersona }) => {
  const evaluations = PERSONAS_LIST.map((p) => ({
    persona: p,
    assessment: runBorrowerAssessment(p.inputs)
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.35rem', fontFamily: 'var(--display)', fontWeight: 600 }}>
          Three Benchmark Borrowers: Comprehensive Run-Throughs
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
          Direct domain comparison of Priya (Salaried), Ravi (Kirana Owner), and Anita (Gig Worker) across all four outputs.
        </p>
      </div>

      {/* 3 Persona Cards Grid */}
      <div className="grid-3">
        {evaluations.map(({ persona, assessment }) => {
          const { o1Verdict, o2Capacity, o3FairRate, o4SafeEmi } = assessment;

          return (
            <div
              key={persona.id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderTop: `4px solid ${
                  o1Verdict.decision === 'BORROW'
                    ? 'var(--success)'
                    : o1Verdict.decision === 'BORROW_LESS'
                    ? 'var(--warn)'
                    : 'var(--danger)'
                }`
              }}
            >
              <div>
                {/* Persona Head */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--display)', fontWeight: 600 }}>
                      {persona.name}, {persona.age}
                    </h3>
                    <div style={{ fontSize: '0.78rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {persona.location} · {persona.employmentLabel.split(' ')[0]}
                    </div>
                  </div>

                  <span className={`badge ${
                    o1Verdict.decision === 'BORROW'
                      ? 'badge-green'
                      : o1Verdict.decision === 'BORROW_LESS'
                      ? 'badge-yellow'
                      : 'badge-red'
                  }`} style={{ fontSize: '0.72rem' }}>
                    {o1Verdict.decision.replace('_', ' ')}
                  </span>
                </div>

                <p style={{ fontSize: '0.84rem', color: 'var(--ink-secondary)', marginBottom: '0.75rem', lineHeight: 1.4 }}>
                  {persona.narrative}
                </p>

                <div style={{ background: 'var(--accent-soft)', padding: '0.45rem 0.65rem', borderRadius: '6px', fontSize: '0.82rem', marginBottom: '1rem' }}>
                  <strong>Ask:</strong> {persona.requestedSummary}
                </div>

                {/* Outputs Breakdown */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', borderTop: '1px solid var(--rule)', paddingTop: '0.75rem', fontSize: '0.82rem' }}>
                  
                  {/* O1 */}
                  <div>
                    <span style={{ fontWeight: 600, color: 'var(--muted)' }}>O1 Verdict:</span>
                    <div style={{ color: 'var(--ink)', fontWeight: 500 }}>{o1Verdict.headline}</div>
                  </div>

                  {/* O2 */}
                  <div>
                    <span style={{ fontWeight: 600, color: 'var(--muted)' }}>O2 Maximums:</span>
                    <div className="num" style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Lender: <strong>{o2Capacity.lenderLikelySanction > 0 ? formatInr(o2Capacity.lenderLikelySanction) : '₹0'}</strong></span>
                      <span>Safe: <strong style={{ color: 'var(--accent)' }}>{formatInr(o2Capacity.borrowerSafeCapacity)}</strong></span>
                    </div>
                  </div>

                  {/* O3 */}
                  <div>
                    <span style={{ fontWeight: 600, color: 'var(--muted)' }}>O3 Fair Rate &amp; APR:</span>
                    <div className="num" style={{ fontWeight: 600, color: 'var(--accent)' }}>
                      {o3FairRate.minRate}% – {o3FairRate.maxRate}% (APR: {o3FairRate.minApr}% - {o3FairRate.maxApr}%)
                    </div>
                  </div>

                  {/* O4 */}
                  <div>
                    <span style={{ fontWeight: 600, color: 'var(--muted)' }}>O4 Safe Monthly Ceiling:</span>
                    <div className="num" style={{ fontWeight: 600, color: 'var(--success)' }}>
                      {formatInr(o4SafeEmi.maxSafeEmiCeiling)} / month
                    </div>
                  </div>

                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectPersona(persona)}
                style={{
                  marginTop: '1.25rem',
                  background: 'var(--bg2)',
                  border: '1px solid var(--rule)',
                  color: 'var(--ink)',
                  padding: '0.5rem',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  transition: 'background 0.15s'
                }}
              >
                <span>Load {persona.name}&apos;s Assessment</span>
                <ArrowRight size={14} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Comparative Evaluation Matrix Table */}
      <div className="card">
        <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--display)', fontWeight: 600, marginBottom: '0.75rem' }}>
          Domain Reasoning Matrix
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--rule)' }}>
                <th style={{ padding: '0.6rem 0.8rem' }}>Borrower</th>
                <th style={{ padding: '0.6rem 0.8rem' }}>O1 Verdict Rationale</th>
                <th style={{ padding: '0.6rem 0.8rem' }}>Lender Sanction vs Safe Capacity</th>
                <th style={{ padding: '0.6rem 0.8rem' }}>Fair Rate Band &amp; Product</th>
                <th style={{ padding: '0.6rem 0.8rem' }}>Key Negotiation Advantage</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '0.75rem 0.8rem', fontWeight: 600, borderBottom: '1px solid var(--rule)' }}>
                  Priya (Salaried SWE)
                </td>
                <td style={{ padding: '0.75rem 0.8rem', borderBottom: '1px solid var(--rule)' }}>
                  <strong>Borrow Less:</strong> Non-earning wedding consumption creates 4-yr fixed drag. Advise capping at ₹4-5L max.
                </td>
                <td className="num" style={{ padding: '0.75rem 0.8rem', borderBottom: '1px solid var(--rule)' }}>
                  Lender: ₹19,50,000<br />Safe: <strong>₹7,80,000</strong>
                </td>
                <td style={{ padding: '0.75rem 0.8rem', borderBottom: '1px solid var(--rule)' }}>
                  10.00% – 11.75%<br /><span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Prime MNC Salaried PL</span>
                </td>
                <td style={{ padding: '0.75rem 0.8rem', borderBottom: '1px solid var(--rule)' }}>
                  CIBIL 780 + 5yr Tier-1 MNC tenure forces 10.75% corporate rate with 1% PF cap.
                </td>
              </tr>

              <tr>
                <td style={{ padding: '0.75rem 0.8rem', fontWeight: 600, borderBottom: '1px solid var(--rule)' }}>
                  Ravi (Kirana Owner)
                </td>
                <td style={{ padding: '0.75rem 0.8rem', borderBottom: '1px solid var(--rule)' }}>
                  <strong>Borrow via LAP:</strong> Productive business expansion. Avoid 21% unsecured business loan; pledge ₹45L shop premises for 10% LAP.
                </td>
                <td className="num" style={{ padding: '0.75rem 0.8rem', borderBottom: '1px solid var(--rule)' }}>
                  Lender (Unsec): ₹3,50,000<br />Lender (LAP): ₹24,75,000<br />Safe: <strong>₹15,00,000</strong>
                </td>
                <td style={{ padding: '0.75rem 0.8rem', borderBottom: '1px solid var(--rule)' }}>
                  9.25% – 11.25%<br /><span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Secured LAP (7-10 yr)</span>
                </td>
                <td style={{ padding: '0.75rem 0.8rem', borderBottom: '1px solid var(--rule)' }}>
                  Low 33% LTV on unencumbered commercial shop + wife co-applicant unlocks prime LAP rates.
                </td>
              </tr>

              <tr>
                <td style={{ padding: '0.75rem 0.8rem', fontWeight: 600 }}>
                  Anita (Gig Rider)
                </td>
                <td style={{ padding: '0.75rem 0.8rem' }}>
                  <strong>Restructure First:</strong> 3 app loans at 30%+ with recent bounce is a default trap. Take EV asset hypothecation only where fuel savings pay EMI.
                </td>
                <td className="num" style={{ padding: '0.75rem 0.8rem' }}>
                  Lender (Unsec): ₹0 (Rejected)<br />Lender (EV Hyp): ₹1,27,500<br />Safe: <strong>₹1,25,000</strong>
                </td>
                <td style={{ padding: '0.75rem 0.8rem' }}>
                  12.50% – 16.00%<br /><span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>EV Asset Hypothecation</span>
                </td>
                <td style={{ padding: '0.75rem 0.8rem' }}>
                  Avoid 30%+ instant digital loans; insist on OEM hypothecated EV asset loan.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
