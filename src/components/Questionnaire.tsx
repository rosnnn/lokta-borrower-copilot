import React from 'react';
import { BorrowerInputs, LoanPurpose, EmploymentType, AssetBacking, CreditScoreTier, EmployerCategory, SalaryMode } from '../engine/types';
import { formatInr } from '../engine/calculator';


interface QuestionnaireProps {
  inputs: BorrowerInputs;
  onChange: (inputs: BorrowerInputs) => void;
}

export const Questionnaire: React.FC<QuestionnaireProps> = ({ inputs, onChange }) => {
  const updateField = <K extends keyof BorrowerInputs>(field: K, value: BorrowerInputs[K]) => {
    onChange({ ...inputs, [field]: value });
  };

  return (
    <div className="card questionnaire-pane" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Section Header */}
      <div style={{ borderBottom: '1px solid var(--rule)', paddingBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '1.25rem', fontFamily: 'var(--display)', fontWeight: 600 }}>
            Borrower Profile &amp; Adaptive Questionnaire
          </h2>
          <span className="badge badge-purple" style={{ fontSize: '0.75rem' }}>
            Live Reactive Engine
          </span>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '0.25rem' }}>
          Questions adapt automatically. Every additional answer tightens confidence and output bounds.
        </p>
      </div>

      {/* TIER 1: MUST QUESTIONS */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <span style={{
            background: 'var(--accent)',
            color: 'var(--accent-ink)',
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '0.15rem 0.45rem',
            borderRadius: '4px'
          }}>
            TIER 1
          </span>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
            Must Questions (The 8 Essentials)
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.1rem' }}>
          
          {/* 1. Purpose */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              1. Loan Purpose
            </label>
            <select
              value={inputs.purpose}
              onChange={(e) => updateField('purpose', e.target.value as LoanPurpose)}
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid var(--rule)',
                background: 'var(--bg)',
                color: 'var(--ink)'
              }}
            >
              <option value="wedding_consumption">Wedding / Personal Consumption</option>
              <option value="business_expansion">Business Expansion / Stock &amp; Inventory</option>
              <option value="vehicle_ev">Electric Scooter / Commercial Vehicle</option>
              <option value="home_renovation">Home Renovation / Improvement</option>
              <option value="debt_consolidation">Debt Consolidation / Emergency</option>
            </select>
          </div>

          {/* 2. Amount Requested */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>2. Amount Requested</label>
              <span className="num" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent)' }}>
                {formatInr(inputs.amountRequested)}
              </span>
            </div>
            <input
              type="range"
              min={25000}
              max={3000000}
              step={25000}
              value={inputs.amountRequested}
              onChange={(e) => updateField('amountRequested', Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--muted)' }}>
              <span>₹25k</span>
              <span>₹15 Lakh</span>
              <span>₹30 Lakh</span>
            </div>
          </div>

          {/* 3. Employment Type */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              3. Employment &amp; Income Type
            </label>
            <select
              value={inputs.employmentType}
              onChange={(e) => updateField('employmentType', e.target.value as EmploymentType)}
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid var(--rule)',
                background: 'var(--bg)',
                color: 'var(--ink)'
              }}
            >
              <option value="salaried_mnc">Salaried (Tier-1 MNC / Listed Corporate)</option>
              <option value="salaried_pvt">Salaried (Private / SME / Govt)</option>
              <option value="self_employed_business">Self-Employed (Kirana / Trade / MSME)</option>
              <option value="informal_gig">Informal / Gig Rider / Daily Earner</option>
            </select>
          </div>

          {/* 4. Net Monthly Inflow */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                4. Net Monthly Take-Home / Cash Profit
              </label>
              <span className="num" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent)' }}>
                {formatInr(inputs.monthlyInflow)}
              </span>
            </div>
            <input
              type="range"
              min={15000}
              max={250000}
              step={2000}
              value={inputs.monthlyInflow}
              onChange={(e) => updateField('monthlyInflow', Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent)' }}
            />
          </div>

          {/* 5. Rent Paid */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>5. Monthly Rent</label>
              <span className="num" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                {formatInr(inputs.rent)}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={80000}
              step={1000}
              value={inputs.rent}
              onChange={(e) => updateField('rent', Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent)' }}
            />
          </div>

          {/* 6. Living Expenses */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>6. Household Expenses</label>
              <span className="num" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                {formatInr(inputs.livingExpenses)}
              </span>
            </div>
            <input
              type="range"
              min={5000}
              max={80000}
              step={1000}
              value={inputs.livingExpenses}
              onChange={(e) => updateField('livingExpenses', Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent)' }}
            />
          </div>

          {/* 7. Existing EMIs */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>7. Existing Ongoing EMIs</label>
              <span className="num" style={{ fontSize: '0.85rem', fontWeight: 600, color: inputs.existingEmis > 0 ? 'var(--warn)' : 'var(--ink)' }}>
                {formatInr(inputs.existingEmis)}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={60000}
              step={1000}
              value={inputs.existingEmis}
              onChange={(e) => updateField('existingEmis', Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent)' }}
            />
          </div>

          {/* 8. Credit Score */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              8. Credit Score (CIBIL / Experian)
            </label>
            <select
              value={inputs.creditScoreTier}
              onChange={(e) => updateField('creditScoreTier', e.target.value as CreditScoreTier)}
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid var(--rule)',
                background: 'var(--bg)',
                color: 'var(--ink)'
              }}
            >
              <option value="excellent_750_plus">Prime: 750 or higher</option>
              <option value="good_700_749">Good: 700 - 749</option>
              <option value="fair_650_699">Fair: 650 - 699</option>
              <option value="poor_below_650">Subprime / Past Delinquencies (&lt; 650)</option>
              <option value="new_to_credit">New to Credit (Never Borrowed / No Score)</option>
              <option value="dont_know">I Don't Know My Score</option>
            </select>
          </div>

          {/* 9. Asset Backing */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              9. Primary Asset / Collateral
            </label>
            <select
              value={inputs.assetBacking}
              onChange={(e) => updateField('assetBacking', e.target.value as AssetBacking)}
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid var(--rule)',
                background: 'var(--bg)',
                color: 'var(--ink)'
              }}
            >
              <option value="none">None / Unsecured</option>
              <option value="property_commercial">Commercial Shop / Property (Clear Title)</option>
              <option value="property_residential">Residential Flat / House (Clear Title)</option>
              <option value="vehicle_hypothecation">Two-Wheeler / EV Hypothecation</option>
              <option value="gold">Gold Ornaments / Sovereign Bonds</option>
            </select>
          </div>

        </div>
      </div>

      {/* TIER 2: ADAPTIVE QUESTIONS (PROFILE SPECIFIC) */}
      <div style={{ background: 'var(--bg2)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--rule)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{
              background: 'var(--success)',
              color: '#fff',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '0.15rem 0.45rem',
              borderRadius: '4px'
            }}>
              TIER 2
            </span>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
              Adaptive Questions (Tightens Output Ranges)
            </h3>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--muted)', fontStyle: 'italic' }}>
            Customized for {inputs.employmentType.replace('_', ' ').toUpperCase()}
          </span>
        </div>

        {/* Dynamic branches based on employment */}
        {inputs.employmentType === 'salaried_mnc' || inputs.employmentType === 'salaried_pvt' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Employer Category
              </label>
              <select
                value={inputs.employerCategory || 'tier_1_mnc'}
                onChange={(e) => updateField('employerCategory', e.target.value as EmployerCategory)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--rule)', background: 'var(--bg3)', color: 'var(--ink)' }}
              >
                <option value="tier_1_mnc">Tier-1 MNC / Top 500 Listed Indian Corp</option>
                <option value="tier_2_mid">Mid-sized Corporate / Govt</option>
                <option value="unlisted_sme">Unlisted Private SME / Startup</option>
              </select>
              <span style={{ fontSize: '0.72rem', color: 'var(--success)', marginTop: '0.2rem', display: 'block' }}>
                ✓ Drops personal loan rate by 150 bps
              </span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Total Job Experience (Years)
              </label>
              <input
                type="number"
                min={0}
                max={35}
                value={inputs.tenureYears ?? 5}
                onChange={(e) => updateField('tenureYears', Number(e.target.value))}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--rule)', background: 'var(--bg3)', color: 'var(--ink)' }}
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--success)', marginTop: '0.2rem', display: 'block' }}>
                ✓ Qualifies for 5-yr max tenure
              </span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Salary Inflow Mode
              </label>
              <select
                value={inputs.salaryMode || 'bank_transfer'}
                onChange={(e) => updateField('salaryMode', e.target.value as SalaryMode)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--rule)', background: 'var(--bg3)', color: 'var(--ink)' }}
              >
                <option value="bank_transfer">Direct Corporate Bank Transfer (Salary Slip)</option>
                <option value="cash_cheque">Cash / Physical Cheque</option>
              </select>
            </div>
          </div>
        ) : null}

        {inputs.employmentType === 'self_employed_business' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Annual ITR Net Profit (Declared)
              </label>
              <input
                type="number"
                step={20000}
                value={inputs.annualItrProfit ?? 420000}
                onChange={(e) => updateField('annualItrProfit', Number(e.target.value))}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--rule)', background: 'var(--bg3)', color: 'var(--ink)' }}
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: '0.2rem', display: 'block' }}>
                Standard bank sanction benchmark
              </span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Commercial Property Valuation (₹)
              </label>
              <input
                type="number"
                step={100000}
                value={inputs.propertyValuation ?? 4500000}
                onChange={(e) => updateField('propertyValuation', Number(e.target.value))}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--rule)', background: 'var(--bg3)', color: 'var(--ink)' }}
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--success)', marginTop: '0.2rem', display: 'block' }}>
                ✓ Unlocks LAP at 9.25%-11.25% (Saves ~800 bps)
              </span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Co-Applicant Income (Monthly ₹)
              </label>
              <input
                type="number"
                step={2000}
                value={inputs.coApplicantIncome ?? 18000}
                onChange={(e) => updateField('coApplicantIncome', Number(e.target.value))}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--rule)', background: 'var(--bg3)', color: 'var(--ink)' }}
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--success)', marginTop: '0.2rem', display: 'block' }}>
                ✓ Expands total safe debt capacity
              </span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Business Vintage (Years)
              </label>
              <input
                type="number"
                value={inputs.yearsInBusiness ?? 14}
                onChange={(e) => updateField('yearsInBusiness', Number(e.target.value))}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--rule)', background: 'var(--bg3)', color: 'var(--ink)' }}
              />
            </div>
          </div>
        ) : null}

        {inputs.employmentType === 'informal_gig' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                High-Cost App Loans Outstanding (₹)
              </label>
              <input
                type="number"
                step={5000}
                value={inputs.highCostDebtAmount ?? 35000}
                onChange={(e) => updateField('highCostDebtAmount', Number(e.target.value))}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--rule)', background: 'var(--bg3)', color: 'var(--ink)' }}
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--danger)', marginTop: '0.2rem', display: 'block' }}>
                ⚠ Triggers Predatory Debt alert
              </span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Recent Loan Bounces (Last 3-6m)
              </label>
              <input
                type="number"
                min={0}
                max={10}
                value={inputs.overdueBouncesCount ?? 1}
                onChange={(e) => updateField('overdueBouncesCount', Number(e.target.value))}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--rule)', background: 'var(--bg3)', color: 'var(--ink)' }}
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--warn)', marginTop: '0.2rem', display: 'block' }}>
                Closes standard bank personal loans
              </span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Expected Incremental Asset Yield (₹/mo)
              </label>
              <input
                type="number"
                step={500}
                value={inputs.productiveYieldMonthly ?? 4500}
                onChange={(e) => updateField('productiveYieldMonthly', Number(e.target.value))}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--rule)', background: 'var(--bg3)', color: 'var(--ink)' }}
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--success)', marginTop: '0.2rem', display: 'block' }}>
                ✓ Fuel savings + extra gig income offsets EMI
              </span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Aggregator Platform Statements
              </label>
              <select
                value={inputs.platformPayoutProof ? 'yes' : 'no'}
                onChange={(e) => updateField('platformPayoutProof', e.target.value === 'yes')}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--rule)', background: 'var(--bg3)', color: 'var(--ink)' }}
              >
                <option value="yes">Yes (Zomato/Swiggy/Ola weekly pay slips)</option>
                <option value="no">No / Pure Cash</option>
              </select>
            </div>
          </div>
        ) : null}

        {/* Universal Additional: Emergency Buffer */}
        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--rule)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                Emergency Savings (Months of Living Expenses)
              </label>
              <span className="num" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                {inputs.emergencySavingsMonths ?? 3} Months
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={12}
              value={inputs.emergencySavingsMonths ?? 3}
              onChange={(e) => updateField('emergencySavingsMonths', Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent)' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Lender's Existing Quote Rate (% p.a. if offered)
            </label>
            <input
              type="number"
              step={0.25}
              placeholder="e.g. 14.5"
              value={inputs.lenderQuotedRate || ''}
              onChange={(e) => updateField('lenderQuotedRate', e.target.value ? Number(e.target.value) : undefined)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--rule)', background: 'var(--bg3)', color: 'var(--ink)' }}
            />
          </div>
        </div>

      </div>

    </div>
  );
};
