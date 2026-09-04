# Lokta Borrower Copilot

> A personal lending assistant that helps an Indian borrower answer four essential questions before walking into a lender: **Should I borrow at all? How much am I really eligible for? What is a fair rate for me? What EMI should I agree to?** Plus a branch-ready **Negotiation Card**.

Built for the **Lokta Borrower Copilot Build Challenge**.

---

## 🚀 Quickstart (< 1 Minute Setup)

Prerequisites: **Node.js (v18+)** and **npm**.

```bash
# 1. Install dependencies
npm install

# 2. Run automated test suite
npm test

# 3. Start local development server
npm run dev
```

Open your browser at `http://localhost:5173` (or the URL displayed in your terminal).

---

## 📁 The Four Challenge Deliverables

All required deliverables are located directly at the project root:

1. **The Working Application**:
   - Client-side React 19 + TypeScript + Vite app with real-time reactive domain rules.
   - Built-in one-click presets for **Priya**, **Ravi**, and **Anita**, plus custom assessment mode.
   - Decoupled domain engine in `src/engine/`.
2. [`RULES.md`](./RULES.md):
   - Exhaustive table of every rule, threshold, interest rate spread, FOIR cap, LTV limit, and stress assumption (*what · value · why · source or judgement*).
3. [`RUNTHROUGHS.md`](./RUNTHROUGHS.md):
   - Complete step-by-step walkthrough of Priya, Ravi, and Anita: questions asked, outputs generated (O1–O4), and the resulting Negotiation Cards.
4. [`WALKTHROUGH.md`](./WALKTHROUGH.md):
   - 5-minute written walkthrough covering domain decisions, engineering architecture, what to build next, what to cut, and follow-up defense strategy.

---

## 🧠 What the App Does

```
+----------------------------------------------------------------------------------------------------+
|                                    LOKTA BORROWER COPILOT ENGINE                                   |
+----------------------------------------------------------------------------------------------------+
|  INPUTS:                                                                                           |
|  - 8 Must Questions (Purpose, Amount, Employment, Inflows, Rent, Living Costs, EMIs, Credit Tier)  |
|  - Adaptive Additional Questions (Category, Vintage, ITR vs Cash, Collateral, Co-applicant, etc.)   |
+-------------------------------------------------+--------------------------------------------------+
                                                  |
                                                  v
+----------------------------------------------------------------------------------------------------+
|  OUTPUT O1: PRUDENTIAL VERDICT                                                                     |
|  - Borrow / Borrow Less / Don't Borrow / Restructure First with 1-sentence rationale.              |
+----------------------------------------------------------------------------------------------------+
|  OUTPUT O2: DUAL MAXIMUMS                                                                          |
|  - Lender Likely Sanction vs. Borrower Safe Capacity (clearly separated with safe recommendation). |
+----------------------------------------------------------------------------------------------------+
|  OUTPUT O3: FAIR INTEREST RATE & ALL-IN APR                                                        |
|  - Prime risk-band pricing, product routing (LAP vs Unsecured), and RBI APR disclosure (+GST/fees).|
+----------------------------------------------------------------------------------------------------+
|  OUTPUT O4: SAFE MONTHLY EMI CEILING & STRESS TESTING                                              |
|  - Monthly debt ceiling, tenure tradeoff matrix, and 3 stress shocks (-20% income, +2% rate).      |
+----------------------------------------------------------------------------------------------------+
|  NEGOTIATION CARD                                                                                  |
|  - 1-Page branch playbook with borrower leverage badges, counter-scripts & walk-away redlines.     |
+----------------------------------------------------------------------------------------------------+
```

---

## 🧪 Automated Testing

The rules engine is 100% testable without DOM dependencies. Run the unit test suite:

```bash
npm test
```

### Verified Test Suites:
- `Financial Math Core`: Standard reducing balance EMI, inverse EMI, and Newton-Raphson APR with 18% GST.
- `Priya (Salaried SWE)`: Correct `BORROW_LESS` verdict for wedding consumption, prime PL rate band (10.0%–11.75%), high lender vs safe capacity divergence.
- `Ravi (Kirana Owner)`: Successful routing to Secured LAP (9.25%–11.25%), unlock of ₹20L+ collateral sanction against ₹45L commercial property.
- `Anita (Gig Rider)`: Trigger of `RESTRUCTURE_FIRST` alert due to 30%+ predatory app loans with recent bounce; proper guidance on EV hypothecation.

---

## 🛠️ Tech Stack & Philosophy

- **Framework**: React 19 + TypeScript + Vite.
- **Styling**: Pure CSS with design tokens (`Newsreader`, `Source Sans 3`, `IBM Plex Mono`), zero heavy UI framework overhead.
- **Aesthetics**: Editorial dark/light themes, Indian currency notation (`₹X,XX,XXX`), print-optimized stylesheet for 1-page physical negotiation cards.
- **Zero Remote Dependencies**: Zero backend required, 100% private client-side execution, no bureau pull required.
