# Lokta Borrower Copilot · Rules, Thresholds & Assumptions Catalog (`RULES.md`)

This document provides complete, transparent documentation of every financial rule, prudential threshold, interest rate spread, fee assumption, and stress testing parameter utilized by the **Lokta Borrower Copilot** engine.

---

## 1. Complete Rules & Thresholds Catalog

| ID | What (Rule Name) | Value / Band | Why (Rationale) | Source or Judgement |
| :--- | :--- | :--- | :--- | :--- |
| **AFF-01** | **Borrower Safe FOIR Ceiling (Salaried)** | `38%` of net monthly income | Keeps 62% of income free for rent, living expenses, retirement, and investments. Prevents cashflow entrapment. | *Lokta Prudential Standard / CFP Board Affordability* |
| **AFF-02** | **Borrower Safe FOIR Ceiling (Self-Employed)** | `30%` of average monthly cash profit | Small business revenues fluctuate month-to-month. A 30% debt cap protects against lean seasons and working capital shortfalls. | *Lokta MSME Prudential Guideline* |
| **AFF-03** | **Borrower Safe FOIR Ceiling (Informal / Gig)** | `25%` of baseline monthly income | Informal/gig workers have no sick pay, insurance, or income guarantees. A tight 25% debt ceiling prevents rapid delinquency. | *Lokta Informal Worker Protection Guideline* |
| **AFF-04** | **Income Haircut (Self-Employed Cash)** | `15%` reduction on reported cash profit | Accounts for unrecorded inventory costs, supplier credit volatility, and informal leakage. | *My Judgement (Standard NBFC Surrogate Practice)* |
| **AFF-05** | **Income Haircut (Informal Gig)** | `20%` reduction on baseline earnings | Compensates for platform algorithmic volatility, fuel inflation, and downtime. | *My Judgement* |
| **AFF-06** | **Productive Asset Yield Credit** | `70%` of expected incremental monthly earnings | When a loan buys a revenue-generating asset (e.g. delivery EV saving petrol), net yield is recognized to service debt. | *Lokta Productive Underwriting Rule* |
| **AFF-07** | **Emergency Reserve Allocation** | `5%` of monthly inflow deducted prior to debt service | Enforces continuous buildup of 3-6 months liquid emergency runway before debt servicing. | *Lokta Financial Resilience Standard* |
| **ELIG-01** | **Lender Bank FOIR Ceiling (Salaried > ₹1L)** | `60% - 65%` of net monthly salary | Prime banks aggressively stretch debt allowances for high-income earners assuming higher residual surplus. | *HDFC / ICICI Bank Retail Underwriting Policy (2025-2026)* |
| **ELIG-02** | **Lender Bank FOIR Ceiling (Salaried ₹40k-₹1L)** | `50%` of net monthly salary | Standard retail credit policy for mid-income salaried applicants. | *SBI / Axis Bank Retail Credit Guidelines* |
| **ELIG-03** | **Lender Unsecured MSME Sanction (ITR Model)** | `50%` of declared ITR Net Profit over 36 months | Standard commercial banks discount cash turnover and underwrite strictly on filed ITR profit. | *PSU Bank MSME Underwriting Manual* |
| **ELIG-04** | **Commercial Property LAP LTV** | `50% - 55%` of fair market value | Immovable commercial collateral provides solid recovery backing, discounting for liquidity nuances. | *RBI Housing & Non-Housing Real Estate Lending Master Circular* |
| **ELIG-05** | **Residential Property LAP LTV** | `60% - 65%` of fair market value | Higher liquidity of residential property allows higher LTV than commercial shops. | *National Housing Bank (NHB) Guidelines* |
| **ELIG-06** | **EV / Two-Wheeler Hypothecation LTV** | `80% - 85%` of on-road invoice | Asset finance NBFCs hypothecate the vehicle registration, requiring 15-20% borrower margin money. | *Hero Fincorp / Bajaj Finance Two-Wheeler Policy* |
| **PRC-01** | **Prime Salaried Personal Loan Rate Band** | `10.50% - 12.00%` p.a. (Reducing) | Category-A MNC employees with CIBIL >750 qualify for prime corporate carded pricing. | *SBI Xpress Credit / HDFC QuickPL Market Grid (Q1 2026)* |
| **PRC-02** | **Mid-Tier Salaried Personal Loan Rate Band** | `12.50% - 15.50%` p.a. (Reducing) | Standard private/SME employees with 700-749 credit score. | *Retail Bank Standard Grids* |
| **PRC-03** | **Secured LAP (Commercial/Residential) Rate Band** | `9.25% - 11.25%` p.a. (Reducing) | First-charge registered mortgage on clear-title immovable property provides lowest risk spread. | *Bajaj Housing / PNB Housing LAP Grid (2026)* |
| **PRC-04** | **Unsecured Business Loan Rate Band** | `18.00% - 24.00%` p.a. (Reducing) | High risk premium charged by NBFCs for unsecured proprietorship loans. | *NBFC MSME Lending Cards* |
| **PRC-05** | **Two-Wheeler / EV Hypothecated Loan Rate Band** | `12.50% - 15.50%` p.a. (Reducing) | Secured by vehicle hypothecation on RC with platform tie-ups. | *OEM Dealership Finance Matrices* |
| **PRC-06** | **Predatory Instant App Loan Alert Threshold** | `> 24.00%` APR (often 30% - 48%) | Short-tenure digital app loans with weekly/15-day roll cycles and exorbitant rollover penalties. | *RBI Digital Lending Directions (2022/2024)* |
| **PRC-07** | **GST on Financial Services** | `18.0%` on all upfront processing and admin fees | Mandatory tax under Indian Goods and Services Tax Act. Deducted from disbursement. | *GST Council of India* |
| **PRC-08** | **Standard Processing Fee Cap (Salaried PL)** | `1.0%` of loan amount (+ 18% GST) | Prevents lenders from padding upfront origination costs. | *My Judgement / Prime Negotiation Benchmark* |
| **PRC-09** | **Standard Processing Fee Cap (Secured LAP)** | `0.75% - 1.0%` of loan amount (+ 18% GST) | LAP involves legal & technical valuation fees; base processing fee should not exceed 1%. | *My Judgement* |
| **STR-01** | **Stress Scenario: Income Contraction** | `-20%` net monthly inflow | Simulates loss of overtime, seasonal retail dips, or temporary family income disruptions. | *Lokta Financial Stability Framework* |
| **STR-02** | **Stress Scenario: Floating Rate Hike** | `+200 bps` (+2.00%) nominal rate increase | Simulates RBI monetary tightening cycle on floating rate loans (e.g. LAP). | *RBI Financial Stability Report Historical Rate Shocks* |
| **STR-03** | **Stress Scenario: Unplanned Expense Shock** | `+₹5,000/month` | Simulates inflation spikes, dependent medical bills, or emergency maintenance. | *Lokta Household Resilience Benchmark* |
| **CONF-01** | **Silence / Missing Field Confidence Penalty** | Range widens by `+150 to +300 bps` | When credit score, employer tier, or property backing are unknown, output bands widen to avoid false precision. | *Lokta Epistemic Honesty Standard* |
| **CONF-02** | **Unknown Credit Score Treatment** | Modeled as `Unverified / Average (675-725)` with wide bounds | "Don't know" is never treated as 300 (subprime) or 800 (prime); it is modeled with an expanded ±2.0% pricing band. | *Lokta Challenge Core Rule #3* |

---

## 2. Mathematical Formulas

### Equated Monthly Installment (EMI)
$$\text{EMI} = \frac{P \cdot r \cdot (1 + r)^n}{(1 + r)^n - 1}$$
*where $P$ is principal, $r = \frac{\text{Annual Rate}}{12 \times 100}$, and $n$ is tenure in months.*

### Maximum Safe Principal from Monthly Debt Budget
$$P_{\text{safe}} = \frac{\text{EMI}_{\text{budget}} \cdot \left((1 + r)^n - 1\right)}{r \cdot (1 + r)^n}$$

### RBI-Compliant All-In APR
Calculated by solving for the monthly internal rate of return $r_{\text{monthly}}$ such that:
$$\text{Principal} - (\text{Processing Fee} + \text{GST}) = \sum_{t=1}^{n} \frac{\text{EMI}}{(1 + r_{\text{monthly}})^t}$$
$$\text{APR} = r_{\text{monthly}} \times 12 \times 100$$

---

## 3. Honesty About Limits & Gaps

1. **No Live Bureau Pull**: This engine operates strictly on self-reported borrower statements. A live CIBIL/CRIF pull may reveal undisclosed co-sign obligations or historic write-offs.
2. **Title & Encumbrance Verification**: LAP calculations assume clear, marketable, non-agricultural commercial/residential property title without prior mortgages.
3. **Macroeconomic Rate Regime**: Nominal rate bands assume a repo rate environment of 6.50%. Macroeconomic rate cycles shift absolute rates up or down uniformly.
