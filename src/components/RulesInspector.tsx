import React, { useState } from 'react';
import { RULES_TABLE_LIST } from '../engine/rules';
import { Search, BookOpen, AlertCircle } from 'lucide-react';

export const RulesInspector: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = ['ALL', 'Affordability', 'Pricing', 'Eligibility', 'Safety', 'Stress'];

  const filteredRules = RULES_TABLE_LIST.filter((rule) => {
    const matchesCat = selectedCategory === 'ALL' || rule.category === selectedCategory;
    const matchesSearch =
      rule.ruleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.rationale.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.source.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <BookOpen size={22} color="var(--accent)" />
          <h2 style={{ fontSize: '1.35rem', fontFamily: 'var(--display)', fontWeight: 600 }}>
            Rules, Thresholds &amp; Assumptions Catalog (RULES.md)
          </h2>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
          Transparent documentation of every financial rule, threshold, band, and source used by the Lokta engine.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg2)', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid var(--rule)' }}>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                background: selectedCategory === cat ? 'var(--accent)' : 'var(--bg3)',
                color: selectedCategory === cat ? 'var(--accent-ink)' : 'var(--ink)',
                border: selectedCategory === cat ? '1px solid var(--accent)' : '1px solid var(--rule)',
                padding: '0.3rem 0.65rem',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: '260px' }}>
          <Search size={16} color="var(--muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search rules, thresholds..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.4rem 0.6rem 0.4rem 2rem',
              borderRadius: '6px',
              border: '1px solid var(--rule)',
              background: 'var(--bg3)',
              color: 'var(--ink)',
              fontSize: '0.82rem'
            }}
          />
        </div>
      </div>

      {/* Rules Table */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--rule)', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem 1rem', width: '12%' }}>Category</th>
                <th style={{ padding: '0.75rem 1rem', width: '22%' }}>Rule / Threshold</th>
                <th style={{ padding: '0.75rem 1rem', width: '18%' }}>Value / Band</th>
                <th style={{ padding: '0.75rem 1rem', width: '30%' }}>Rationale (Why)</th>
                <th style={{ padding: '0.75rem 1rem', width: '18%' }}>Source / Judgement</th>
              </tr>
            </thead>
            <tbody>
              {filteredRules.map((rule) => (
                <tr key={rule.id} style={{ borderBottom: '1px solid var(--rule-light)' }}>
                  <td style={{ padding: '0.75rem 1rem', verticalAlign: 'top' }}>
                    <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
                      {rule.category}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 600, verticalAlign: 'top', color: 'var(--ink)' }}>
                    {rule.ruleName}
                  </td>
                  <td className="num" style={{ padding: '0.75rem 1rem', verticalAlign: 'top', fontWeight: 600, color: 'var(--accent)' }}>
                    {rule.value}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', verticalAlign: 'top', color: 'var(--ink-secondary)', lineHeight: 1.45 }}>
                    {rule.rationale}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', verticalAlign: 'top', color: 'var(--muted)', fontSize: '0.78rem', fontStyle: 'italic' }}>
                    {rule.source}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Limits & Uncertainty Callout */}
      <div style={{ background: 'var(--bg2)', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--rule)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <AlertCircle size={18} color="var(--warn)" />
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, margin: 0, color: 'var(--ink)' }}>
            Honesty About Limits &amp; Assumptions
          </h3>
        </div>
        <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.5 }}>
          <li><strong>No Credit Bureau Pull:</strong> This app runs entirely client-side without storing personal data or pulling live CRIF/CIBIL APIs. Credit scores rely on user self-report.</li>
          <li><strong>Property Legal &amp; Valuation:</strong> Loan Against Property (LAP) sanction assumes clear unencumbered title and non-agricultural zoning.</li>
          <li><strong>Interest Rate Cycle:</strong> Rates are benchmarked to the 2026 RBI repo rate environment (6.50% base). Significant repo rate adjustments will shift the nominal rate bands uniformly.</li>
        </ul>
      </div>

    </div>
  );
};
