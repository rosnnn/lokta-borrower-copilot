import React, { useState } from 'react';
import { AssessmentResult } from '../engine/types';
import { formatInr, calculateEmi } from '../engine/calculator';
import {
  Printer,
  Copy,
  Check,
  ShieldCheck,
  AlertOctagon
} from 'lucide-react';

interface NegotiationCardProps {
  result: AssessmentResult;
}

export const NegotiationCard: React.FC<NegotiationCardProps> = ({ result }) => {
  const { negotiationCard, o3FairRate, o4SafeEmi, inputs } = result;
  const [lenderQuote, setLenderQuote] = useState<number>(inputs.lenderQuotedRate || 14.0);
  const [copied, setCopied] = useState<boolean>(false);

  // Calculate difference if borrower tests lender's quote
  const fairMedianRate = o3FairRate.medianRate;
  const emiAtFairRate = calculateEmi(inputs.amountRequested, fairMedianRate, negotiationCard.suggestedTenureMonths);
  const emiAtLenderQuote = calculateEmi(inputs.amountRequested, lenderQuote, negotiationCard.suggestedTenureMonths);
  const monthlyOverpay = Math.max(0, emiAtLenderQuote - emiAtFairRate);
  const totalOverpay = monthlyOverpay * negotiationCard.suggestedTenureMonths;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(negotiationCard.primaryCounterScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Action Bar */}
      <div className="no-print" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontFamily: 'var(--display)', fontWeight: 600 }}>
            Borrower Negotiation Card
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
            One screen to hold up to the lender or loan agent. Defend your rate with data.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={handleCopyScript}
            style={{
              background: 'var(--bg3)',
              color: 'var(--ink)',
              border: '1px solid var(--rule)',
              padding: '0.45rem 0.85rem',
              borderRadius: '6px',
              fontSize: '0.85rem',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            {copied ? <Check size={16} color="var(--success)" /> : <Copy size={16} />}
            <span>{copied ? 'Copied Script!' : 'Copy Script'}</span>
          </button>

          <button
            onClick={handlePrint}
            style={{
              background: 'var(--accent)',
              color: 'var(--accent-ink)',
              border: 'none',
              padding: '0.45rem 1rem',
              borderRadius: '6px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Printer size={16} />
            <span>Print / Save 1-Page Card</span>
          </button>
        </div>
      </div>

      {/* THE PRINTABLE NEGOTIATION CARD TARGET */}
      <div
        className="card negotiation-card-print-target"
        style={{
          border: '2px solid var(--accent)',
          background: 'var(--bg3)',
          padding: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}
      >
        
        {/* Card Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid var(--rule)', paddingBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{ fontFamily: 'var(--display)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--ink)' }}>
                Lokta · <em style={{ color: 'var(--accent)' }}>Borrower Card</em>
              </span>
              <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
                CONFIDENTIAL BORROWER PLAYBOOK
              </span>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--muted)', fontFamily: 'var(--mono)' }}>
              {negotiationCard.borrowerProfileSummary}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600, color: 'var(--muted)' }}>
              Requested Facility
            </div>
            <div className="num" style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--accent)' }}>
              {formatInr(inputs.amountRequested)}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
              {o3FairRate.recommendedProduct}
            </div>
          </div>
        </div>

        {/* Leverage Badges */}
        <div>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, color: 'var(--muted)', marginBottom: '0.5rem' }}>
            Your Underwriting Strengths (Why You Deserve Prime Pricing):
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {negotiationCard.leverageBadges.map((badge, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--accent-soft)',
                  border: '1px solid var(--accent-light)',
                  padding: '0.4rem 0.75rem',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <ShieldCheck size={16} color="var(--accent)" />
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--accent)' }}>{badge.title}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>— {badge.subtitle}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Benchmarks Hero Grid */}
        <div className="grid-3" style={{ background: 'var(--bg2)', padding: '1.1rem', borderRadius: '8px', border: '1px solid var(--rule)' }}>
          <div>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 600, color: 'var(--muted)' }}>
              Target Interest Rate
            </div>
            <div className="num" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent)' }}>
              {negotiationCard.targetRate.toFixed(2)}% – {negotiationCard.rateCeiling.toFixed(2)}%
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Do not accept above ceiling</div>
          </div>

          <div>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 600, color: 'var(--muted)' }}>
              Processing Fee Cap
            </div>
            <div className="num" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--ink)' }}>
              Max {negotiationCard.maxProcessingFeePercent}% <span style={{ fontSize: '0.8rem', fontWeight: 400 }}>+ GST</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Total cap: {formatInr(o3FairRate.totalUpfrontCharges)}</div>
          </div>

          <div>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 600, color: 'var(--muted)' }}>
              Safe Monthly EMI Ceiling
            </div>
            <div className="num" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--success)' }}>
              {formatInr(o4SafeEmi.maxSafeEmiCeiling)}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Over {negotiationCard.suggestedTenureMonths}m tenure</div>
          </div>
        </div>

        {/* Interactive "Lender Quotes X%" Comparator */}
        <div className="no-print" style={{ background: 'var(--bg)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--rule)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink)' }}>
              Test What the Lender Quoted You:
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>Lender's Quote Rate:</span>
              <input
                type="number"
                step={0.25}
                value={lenderQuote}
                onChange={(e) => setLenderQuote(Number(e.target.value))}
                style={{ width: '80px', padding: '0.25rem 0.5rem', borderRadius: '4px', border: '1px solid var(--rule)', background: 'var(--bg3)', color: 'var(--ink)', fontWeight: 600 }}
              />
              <span style={{ fontSize: '0.82rem' }}>% p.a.</span>
            </div>
          </div>

          {lenderQuote > o3FairRate.maxRate ? (
            <div style={{ background: 'var(--warn-soft)', padding: '0.75rem 1rem', borderRadius: '6px', border: '1px solid var(--warn-border)', fontSize: '0.85rem', color: 'var(--warn)' }}>
              <strong>Lender Quote is {(lenderQuote - fairMedianRate).toFixed(2)}% higher than fair!</strong>
              <div style={{ marginTop: '0.25rem' }}>
                Accepting {lenderQuote}% would cost you an extra <span className="num" style={{ fontWeight: 700 }}>{formatInr(monthlyOverpay)}/month</span> ({formatInr(totalOverpay)} extra interest total). Use the counter-script below!
              </div>
            </div>
          ) : (
            <div style={{ background: 'var(--success-soft)', padding: '0.65rem 1rem', borderRadius: '6px', border: '1px solid var(--success-border)', fontSize: '0.85rem', color: 'var(--success)' }}>
              ✓ The lender's quote ({lenderQuote}%) is within or better than your fair pricing band!
            </div>
          )}
        </div>

        {/* PRIMARY COUNTER-OFFER SCRIPT */}
        <div style={{ background: 'var(--accent-soft)', padding: '1.25rem', borderRadius: '8px', borderLeft: '4px solid var(--accent)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--accent)' }}>
              Word-for-Word Branch Counter Script:
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--accent)', fontStyle: 'italic' }}>
              Say this directly to the loan manager
            </span>
          </div>
          <p style={{ fontSize: '0.98rem', fontFamily: 'var(--display)', fontStyle: 'italic', lineHeight: 1.5, margin: 0, color: 'var(--ink)' }}>
            {negotiationCard.primaryCounterScript}
          </p>
        </div>

        {/* OBJECTION BATTLECARDS */}
        <div>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, color: 'var(--muted)', marginBottom: '0.5rem' }}>
            Lender Objection Battlecards:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {negotiationCard.objectionHandlers.map((obj, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--bg2)',
                  padding: '0.85rem 1rem',
                  borderRadius: '6px',
                  border: '1px solid var(--rule)'
                }}
              >
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--danger)', marginBottom: '0.25rem' }}>
                  If Lender Claims: {obj.lenderPitch}
                </div>
                <div style={{ fontSize: '0.88rem', color: 'var(--ink)', marginBottom: '0.35rem' }}>
                  <strong>Your Counter:</strong> {obj.borrowerCounter}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', fontStyle: 'italic' }}>
                  💡 Tactical Tip: {obj.tacticalTip}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* WALK-AWAY REDLINES */}
        <div style={{ background: 'var(--danger-soft)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--danger-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
            <AlertOctagon size={16} color="var(--danger)" />
            <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--danger)' }}>
              Walk-Away Redlines (Do Not Sign If):
            </span>
          </div>
          <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.84rem', color: 'var(--danger)' }}>
            {negotiationCard.walkAwayRedlines.map((redline, idx) => (
              <li key={idx} style={{ marginBottom: '0.2rem' }}>
                {redline}
              </li>
            ))}
          </ul>
        </div>

        {/* Branch Checklist */}
        <div style={{ borderTop: '1px solid var(--rule)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--muted)' }}>
          <span><strong>Branch Carry Checklist:</strong> PAN/Aadhaar · Bank Statements · Quotation/Deed</span>
          <span>Verified by Lokta Copilot</span>
        </div>

      </div>

    </div>
  );
};
