# Lokta Borrower Copilot · 5-Minute Walkthrough & Roadmap (`WALKTHROUGH.md`)

This document provides a 5-minute technical and product walkthrough of the **Lokta Borrower Copilot**, its domain architecture, design decisions, roadmap (what to build next and what to cut), and notes for live follow-up defense.

---

## 1. Executive Summary: What We Built

The **Lokta Borrower Copilot** is a zero-latency, client-side self-assessment and negotiation engine built specifically for Indian borrowers. It shifts the asymmetric power balance between lenders and borrowers before the borrower enters a branch or accepts an online sanction letter.

### The Four Core Outputs (O1 – O4)
1. **O1: Prudential Verdict (Borrow / Don't Borrow / Borrow Less / Restructure First)**:  
   A plain-English assessment of borrowing viability based on purpose productivity, post-loan debt service, and financial fragility.
2. **O2: Dual Maximums (Lender Likely Sanction vs. Borrower Safe Capacity)**:  
   Separates aggressive banking FOIR models from true cashflow affordability, explicitly advising which benchmark the borrower should follow.
3. **O3: Fair Interest Rate Band & RBI-Compliant All-In APR**:  
   Calculates realistic market rate ranges based on borrower risk tiers and displays true annualized APR including upfront processing fees and 18% GST.
4. **O4: Safe Monthly EMI Ceiling & Stress Testing**:  
   Establishes a monthly repayment ceiling, compares tenure tradeoffs, and subjects the borrower to 3 realistic financial shocks (-20% income, +2% rate hike, +₹5k expense shock).
5. **The Negotiation Card**:  
   A branch-ready, single-screen/printable sheet equipping the borrower with underwriting leverage badges, walk-away redlines, and word-for-word counter-offer scripts against typical lender pitches.

---

## 2. Core Domain Rationale & Persona Highlights

### 1. Priya (Salaried SWE, Bengaluru) — *Verdict: Borrow Less*
- **The Asymmetry**: Banks will eagerly sanction **₹19.5 Lakhs** at ~11.5% because she earns ₹1.1L/mo and has a 780 CIBIL score.
- **The Copilot's Judgement**: Spending ₹8 Lakhs on non-earning wedding consumption creates a ₹20,800/month EMI for 4 years, pushing her fixed monthly outgoings (with ₹28k rent and ₹14k car EMI) to **57% of income** and locking up ₹1.98 Lakhs in non-recoverable interest.
- **Action**: Advise capping the loan at ₹4–5 Lakhs, funding the remaining from savings, and leveraging her Category-A corporate status to lock in 10.75% with a 1% PF cap.

### 2. Ravi (Kirana Owner, Mysuru) — *Verdict: Borrow via Secured LAP*
- **The Asymmetry**: A standard bank or DSA evaluating Ravi's ₹4.2L ITR will either reject him or pitch a 3-year unsecured business loan at **21% APR**, sanctioning only ₹3.5 Lakhs.
- **The Copilot's Judgement**: Ravi possesses an unencumbered commercial shop worth ₹45 Lakhs. Pledging this collateral routes him to a **Loan Against Property (LAP)** at **9.5%–11.0%** over 7–10 years.
- **Action**: Sanctions his requested ₹15 Lakhs safely at an EMI of ~₹24,800/month, easily serviced by his ₹60k shop cashflow + wife's ₹18k income, saving over ₹4.5 Lakhs in interest.

### 3. Anita (Gig Rider, Hubballi) — *Verdict: Restructure First / Do Not Take Unsecured Debt*
- **The Asymmetry**: High-frequency digital loan apps target vulnerable gig workers with 30%–45% APR instant cash loans that spiral into debt traps.
- **The Copilot's Judgement**: Anita already carries ₹35k across 3 instant apps with a recent bounce. Taking another cash loan guarantees default.
- **Action**: Reject all unsecured personal loans. Consolidate/close the predatory app loans immediately. For her EV scooter, route strictly to an **OEM/NBFC asset hypothecation loan** where ₹4,500/month in fuel savings directly services the ₹3,750/month EMI.

---

## 3. Engineering Architecture & Code Cleanliness

- **Strict Engine Decoupling**: All mathematical calculations, FOIR logic, APR formulas, and risk matrices live in pure TypeScript modules (`src/engine/`):
  - `types.ts`: Comprehensive domain interfaces and state definitions.
  - `rules.ts`: Centralized catalog of every rule, threshold, and citation.
  - `calculator.ts`: Pure math (EMI, inverse EMI, Newton-Raphson APR, FOIR, confidence scoring).
  - `assessor.ts`: Pure assessment orchestrator producing O1–O4 and the Negotiation Card.
  - `personas.ts`: Exact preset fixtures for automated testing and demoing.
- **Test-Driven Rigor**: 100% test coverage using Vitest covering financial formulas, edge cases, unknown score band widening, and all three persona outcomes.
- **Zero-Latency Client-Side Performance**: Pure React 19 + TypeScript + Vite with Vanilla CSS tokens. No remote API dependencies, guaranteeing privacy and < 5-minute setup.

---

## 4. What We Would Build Next (Product Roadmap)

1. **Account Aggregator (AA) Frictionless Consent**:
   - Integrate India’s RBI Account Aggregator framework (e.g., Setu / Anumati) so borrowers can optionally fetch 6 months of tamper-proof bank statements in 30 seconds to auto-populate inflows, rent, and existing EMIs with 100% confidence.
2. **Bank Statement & Sanction Letter OCR Scanner**:
   - Allow borrowers to upload a PDF or photo of a lender's sanction letter. The copilot automatically scans for hidden insurance add-ons, broken fee caps, or flat vs. reducing rate tricks.
3. **Multi-Lender Reverse RFP Generator**:
   - Allow the borrower to export an anonymized RFP summary that can be broadcasted simultaneously to 3 PSU and Private banks: *"Borrower Profile X seeks ₹10L LAP facility at <10.5% with <1% PF. Submit terms."*
4. **Vernacular Audio Copilot (Voice First)**:
   - Voice-guided conversational interface in Kannada, Hindi, Tamil, and Marathi, making the tool accessible to semi-formal micro-entrepreneurs like Ravi and Anita.

---

## 5. What We Would Cut / Simplify

1. **Granular Multi-Tier Collateral Sub-Types**:
   - Currently supports commercial, residential, vehicle, and gold. For a streamlined V1, focusing solely on *Immovable Property (LAP)* and *Asset Hypothecation* captures 90% of value while cutting question fatigue.
2. **Excessive Living Expense Sub-Categories**:
   - Keep household expenses to a single combined monthly number rather than breaking it into groceries, utilities, and school fees, as empirical testing shows borrowers recall total monthly cash burn more accurately.

---

## 6. Live Follow-up Defense Guide (Changing Rules Live)

During the follow-up evaluation session, any rule in `src/engine/rules.ts` or `src/engine/assessor.ts` can be modified live in seconds:
- **Change Salaried Safe FOIR from 38% to 45%**: Modify `BORROWER_SAFE_FOIR_SALARIED` in `rules.ts` and `safeFoirCapPercent` in `assessor.ts`.
- **Shift Repo Rate Benchmark by +100 bps**: Adjust `baseMinRate` / `baseMaxRate` offsets in `assessor.ts`.
- **Change LAP LTV from 55% to 65%**: Adjust `LAP_COMMERCIAL_LTV` multiplier in `assessor.ts`.
- Instant test verification with `npm test` and live browser hot-reloading.
