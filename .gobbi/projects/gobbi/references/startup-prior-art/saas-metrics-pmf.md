---
name: saas-metrics-pmf
description: SaaS/PLG metrics, PMF measurement, and unit-economics canon mined for gradable, de-vanity quality axes (applicable-or-proven-irrelevant, per the startup skill's own grammar).
type: references
scope: project
feature: null
status: active
created: 2026-07-14
session: 97d3ef5a-1b8a-4dab-b884-9f686e185b22
tags: []
keywords: [saas-metrics, plg, pmf, unit-economics, vanity-metrics, willingness-to-pay, prior-art]
author: claude
title: SaaS / Startup Metrics / PLG / PMF — Gradable Quality Axes
source: Multiple primary sources — see § F. External references below (as-is research cluster, not atomized per one-insight-per-file; kept whole per this session's user-approved promotion plan)
accessed: 2026-07-14
ref_type: other
---

# R3 — SaaS / Startup Metrics / PLG / PMF: gradable quality axes for the `startup` skill

Research leader R3 (one of five parallel). Cluster: SaaS metrics, PLG, PMF measurement, unit
economics, willingness-to-pay evidence. Feeds the synthesis leader's "add startup-domain quality
axes" half of the scenario/checklist work.

**Read-first framing (how these axes must be applied).** gobbi's `startup` skill designs ANY
project — an open-source solo-user tool (gobbi itself), an internal tool, or a commercial SaaS.
Most SaaS benchmarks below (LTV:CAC, NRR, Rule of 40) do NOT apply to a non-commercial project.
So every axis is written to plug into the skill's EXISTING checklist grammar — "evidenced to this
standard, **or proven irrelevant with a reason**" (see `startup/checklists.md`
STARTUP-STRUCT-SCENARIO-04-CHECK-01, STARTUP-PERF-SCENARIO-03-CHECK-03). The axis grades whether a
claim, once made, is EVIDENCED and NON-VANITY — not whether every project must have a CAC. A project
that makes NO market/growth/monetization claim passes each commercial axis as `proven-irrelevant`.
The value the skill lacks today: it has strong PROCESS/STRUCTURE checks but **no domain check that a
market, demand, retention, unit-economics, or growth claim is measured the right way** — that is
exactly the vanity-metric gap this cluster closes.

**Note (session outcome — read before applying).** This cluster's commercial/business-model axes
(A6–A11, business-model coherence, GTM) were locked OUT of the `startup` skill's final scope — see
[[scope-narrowed-to-design-craft]]. This document is preserved as-is for its evergreen prior-art
value; the applicability of specific axes to gobbi's own `startup` skill is governed by that decision,
not by this reference.

---

## A. Startup quality axes (primary deliverable)

Each axis: **what it measures** · **how to evidence/measure concretely** · **GOOD vs BAD/vanity
value** · **→ gradable check** (the sentence that can become a checklist item).

### A1 — Product-market-fit signal (Sean Ellis 40% test)
- **Measures:** whether users would be *disappointed to lose* the product — dependency, not
  satisfaction.
- **Evidence:** survey users who (a) used the core product, (b) at least twice, (c) within the last
  2 weeks; ask "How would you feel if you could no longer use [product]? — Very / Somewhat / Not
  disappointed." PMF benchmark = **≥40% "very disappointed."** (Sean Ellis, benchmarked across
  hundreds of startups.)
- **GOOD:** a defined PMF measurement plan with the exact question, the qualified respondent filter,
  and the 40% threshold named. **BAD/vanity:** "users love it" / NPS / raw satisfaction stars, or a
  PMF claim with no falsifiable threshold.
- **→ Check:** *If the project claims product-market fit or "users want this," the claim names a
  falsifiable signal (e.g. the Sean-Ellis ≥40%-very-disappointed test with a qualified respondent
  filter), not an unmeasured "users love it," or is proven-irrelevant with a reason.*
- **Source:** https://review.firstround.com/how-superhuman-built-an-engine-to-find-product-market-fit/ · https://www.fitsignal.com/blog/sean-ellis-40-percent-test

### A2 — Retention-curve flattening (the purest PMF signal)
- **Measures:** whether a cohort's % still active stops declining and plateaus — involuntary behavior,
  not stated opinion.
- **Evidence:** cohort retention curve (% of an install/signup cohort active at week/month N). A
  healthy curve drops steeply as tire-kickers churn, then **flattens to a stable plateau**; a curve
  that decays to ~0 = no PMF. Prefer measured 12/24-month cohort data over a predicted curve.
- **GOOD:** retention framed as a flattening cohort curve with a named plateau/active definition.
  **BAD/vanity:** cumulative "total users" growth; "retention is good" with no cohort, no time axis.
- **→ Check:** *If the project asserts users stick/return, the evidence is a cohort retention curve
  that flattens (not cumulative totals), with an explicit active-user definition, or proven-irrelevant.*
- **Source:** Brian Balfour / Reforge, via https://www.failory.com/blog/retention-rate-metrics · https://www.caseyaccidental.com/p/caseys-guide-to-finding-product-market-fit

### A3 — High-expectation-customer / target-segment definition
- **Measures:** whether the product targets a *specific* most-demanding user, not "everyone."
- **Evidence:** a named HXC persona derived by segmenting the "very disappointed" responders (the
  Superhuman "Nicole" — exec handling 100–200 emails/day who values speed). Superhuman's PMF score
  jumped 22%→32% just by filtering the survey to the HXC segment — same product.
- **GOOD:** one concrete beachhead segment with a sharp profile and why they're most disappointed to
  lose it. **BAD/vanity:** "SMBs and enterprises and prosumers"; TAM-as-target; no segment at all.
- **→ Check:** *The project names one specific high-expectation/beachhead user segment (not "everyone"
  / a whole market), and the durable direction traces to that segment, or proven-irrelevant.*
- **Source:** https://review.firstround.com/how-superhuman-built-an-engine-to-find-product-market-fit/

### A4 — North-Star metric = the core value delivered
- **Measures:** whether there is ONE metric capturing delivered customer value that leads revenue.
- **Evidence:** a single metric that is a *leading indicator* of value and business results (Airbnb
  nights booked, Slack messages sent, Facebook DAU). Must reflect product value, not an internal
  vanity count.
- **GOOD:** one North-Star tied to the moment the user gets value, with a stated why-it-leads-revenue.
  **BAD/vanity:** "signups" or "registered users" as the headline; a lagging revenue figure with no
  value proxy; five "north stars."
- **→ Check:** *If the project defines a headline success metric, it is a single value-delivered
  leading indicator (not registered-users / downloads / a cumulative count), or proven-irrelevant.*
- **Source:** https://amplitude.com/blog/pirate-metrics-framework · https://growthmethod.com/the-north-star-metric/

### A5 — Activation & time-to-value (PLG)
- **Measures:** how fast a new user reaches the first real outcome, and the % who cross the activation
  threshold that correlates with paid conversion.
- **Evidence:** a defined activation event (the "aha" that predicts retention/conversion), an
  activation rate, and a time-to-value target. PLG thesis: minimize time-to-value; the product sells
  itself. A Product-Qualified Lead (PQL) = account crossing that activation threshold.
- **GOOD:** an explicit activation event + short time-to-value + measured activation rate.
  **BAD/vanity:** "onboarding is easy"; signup counted as activation; no first-value moment named.
- **→ Check:** *If the project relies on self-serve adoption, it names a concrete activation event and
  a time-to-value target (not "easy onboarding"), or proven-irrelevant (e.g. sales-led / internal
  tool).*
- **Source:** Wes Bush / ProductLed & OpenView — https://productled.com/book/product-led-growth · https://openviewpartners.com/blog/how-to-start-product-led-growth-with-wes-bush-and-blake-bartlett/

### A6 — CAC measured paid + fully-loaded
- **Measures:** true cost to acquire a paying customer.
- **Evidence:** **Paid CAC** (spend on paid channels ÷ customers from paid) is what investors weight,
  NOT blended (all-in ÷ all customers) which hides that organic dilutes the true paid cost. Must
  include referral fees, credits, discounts. Note CAC rises with scale (cheap early cohorts mislead).
- **GOOD:** CAC stated as paid + fully-loaded, with the channel split. **BAD/vanity:** blended CAC
  presented as "our CAC"; CAC excluding referral/discount costs; CAC from the cheapest early cohort.
- **→ Check:** *If the project claims an acquisition cost, it is paid + fully-loaded (referrals,
  credits, discounts included), not a blended figure that hides paid cost, or proven-irrelevant.*
- **Source:** https://a16z.com/16-startup-metrics/

### A7 — LTV and LTV:CAC (≥3:1) with the LTV-seduction caution
- **Measures:** whether a customer returns more than they cost.
- **Evidence:** LTV = contribution margin per customer × average lifespan (1 ÷ churn), on **net
  profit / gross margin, not revenue**. Healthy **LTV:CAC ≥ 3:1**; top quartile 4:1–6:1. The 3:1 rule
  assumes stable churn, real multi-year cohort data, and payback < 12 months. Bill Gurley's "dangerous
  seduction": predicted-future-LTV inflates the number — prefer measured 12/24-month historical LTV.
- **GOOD:** LTV:CAC ≥3:1 built on margin + measured cohort churn. **BAD/vanity:** LTV on revenue not
  margin; LTV from an optimistic predicted retention curve; ratio quoted with no payback or churn base.
- **→ Check:** *If the project claims a viable LTV:CAC, LTV is computed on margin (not revenue) from
  measured churn, the ratio is ≥~3:1, and it is not a predicted-curve inflation, or proven-irrelevant.*
- **Source:** https://a16z.com/16-startup-metrics/ · http://abovethecrowd.com/2012/09/04/the-dangerous-seduction-of-the-lifetime-value-ltv-formula/ · https://foundrycro.com/blog/ltv-cac-ratio-benchmarks-2026/

### A8 — CAC payback period (< 12 months)
- **Measures:** months of gross profit to recover CAC — the real capital-efficiency gate (a great
  LTV:CAC with a 36-month payback can still starve a company of cash).
- **Evidence:** CAC ÷ (monthly gross-margin revenue per customer). Healthy **< 12 months**; elite B2B
  6–12 months (best 80–90 days); 4th quartile > 24 months.
- **GOOD:** payback stated and < ~12 months, cross-checked against runway. **BAD/vanity:** LTV:CAC
  shown without payback; payback ignoring gross margin.
- **→ Check:** *If acquisition economics are claimed, CAC payback is stated (on gross-margin dollars)
  and reconciled against runway, not hidden behind a headline LTV:CAC, or proven-irrelevant.*
- **Source:** https://www.digitalapplied.com/blog/saas-unit-economics-2026-cac-ltv-payback-reference

### A9 — Gross margin (SaaS floor ~75–80%)
- **Measures:** how much of each revenue dollar survives cost of delivery — the multiplier under every
  other unit-economics number.
- **Evidence:** (revenue − COGS incl. hosting, support, delivery) ÷ revenue. SaaS story floor ≈75%;
  best-in-class ≥85%. A 3:1 LTV:CAC at 80% margin is a far stronger business than at 50% margin.
- **GOOD:** margin stated with COGS breakdown, ≥~75% for a SaaS claim. **BAD/vanity:** "high margin"
  unquantified; margin excluding hosting/support; a services-heavy business framed as pure SaaS.
- **→ Check:** *If the project claims software-like economics, gross margin is quantified with a COGS
  breakdown and meets the ~75%+ SaaS floor, or proven-irrelevant (e.g. hardware/services/OSS).*
- **Source:** https://www.fiscallion.io/blog/saas-gross-margin-benchmark-what-investors-actually-expect-at-every-stage · https://k38consulting.com/saas-gross-margin-benchmarks/

### A10 — Net / gross revenue retention (NRR ≥100%; best-in-class ≥120%)
- **Measures:** whether the existing customer base grows (expansion) or leaks (churn) on its own.
- **Evidence:** **NRR** = (starting MRR + expansion − contraction − churn) ÷ starting MRR;
  **GRR** = same without expansion (the true leak). Good NRR 100–120%; best-in-class ≥120% (base grows
  20%/yr with zero new sales); <100% concerning. Always show GRR too — NRR can hide churn under
  expansion.
- **GOOD:** NRR and GRR both stated; NRR ≥100%. **BAD/vanity:** NRR alone (net churn understates the
  losses); "low churn" with no definition of the churn base.
- **→ Check:** *If the project claims retention/expansion economics, both NRR and GRR are stated (NRR
  alone can mask churn), with NRR ≥~100%, or proven-irrelevant.*
- **Source:** https://a16z.com/16-startup-metrics/ · https://optif.ai/learn/questions/b2b-saas-net-revenue-retention-benchmark/

### A11 — Growth efficiency at scale (Rule of 40 · magic number · burn multiple)
- **Measures:** whether growth is *paid for efficiently*, not bought with unlimited burn.
- **Evidence:** **Rule of 40** = revenue-growth % + profit(EBITDA) margin % ≥ 40. **Magic number** =
  (ΔARR × 4) ÷ prior-quarter S&M; >0.75 decent, >1.0 strong. **Burn multiple** = net burn ÷ net-new
  ARR; toward 1.0-or-better is efficient. (David Sacks playbook: measure growth quality + capital
  efficiency + customer love; ignore vanity stats.)
- **GOOD:** at least one efficiency metric stated, growth reconciled with burn. **BAD/vanity:** growth
  rate alone; "we grew 300%" off a tiny base with unbounded burn.
- **→ Check:** *If the project claims efficient growth/scaling, it pairs a growth number with an
  efficiency metric (Rule of 40 / magic number / burn multiple), not a raw growth rate, or
  proven-irrelevant.*
- **Source:** https://www.capitaly.vc/blog/david-sacks-playbook-saas-burn-multiple-rule-40-ndr-2025 · https://www.wallstreetprep.com/knowledge/rule-of-40/

### A12 — Willingness-to-pay evidence (demand ladder + Van Westendorp)
- **Measures:** whether real demand at a real price is proven, not assumed.
- **Evidence (demand ladder, weakest→strongest):** survey "yes" / pre-launch waitlist (curiosity
  only) → landing-page conversion to a meaningful action (3–5%+ email/pre-order/demo) → **smoke test**
  with friction (long form, fake "buy") → **signed LOI / paid pilot / pre-sale** (strongest, esp.
  B2B). **Pricing:** Van Westendorp Price Sensitivity Meter — 4 questions (too expensive / too cheap /
  expensive-but-consider / bargain) yielding an acceptable price range and optimal price point.
- **GOOD:** demand backed by a costly signal (LOI, pre-sale, paid pilot, or a friction smoke test) and
  a price point with a method. **BAD/vanity:** waitlist size / survey "would you use this?" / "yes"
  intent treated as demand; a price picked with no research.
- **→ Check:** *If the project claims market demand or a price, the evidence is a costly signal
  (LOI / pre-sale / paid pilot / friction smoke test), not waitlist size or survey "yes," and any
  price cites a method (e.g. Van Westendorp), or proven-irrelevant.*
- **Source:** https://www.saasvalidation.tech/pre-launch-waitlists-measure-curiosity-not-intent/ · https://www.producttalk.org/2023/05/willingness-to-pay/ · https://en.wikipedia.org/wiki/Van_Westendorp's_Price_Sensitivity_Meter

### A13 — AARRR funnel coverage (each stage has a real metric)
- **Measures:** whether the growth story covers all five stages — Acquisition, Activation, Retention,
  Referral, Revenue — or over-indexes on top-of-funnel.
- **Evidence:** one defined metric per stage (Dave McClure's pirate metrics). McClure's warning:
  founders obsess over features/acquisition and skip retention + revenue, building products that don't
  scale or monetize.
- **GOOD:** all five stages named with a metric each; retention and revenue not skipped. **BAD/vanity:**
  only acquisition/signups; no referral or revenue mechanism named.
- **→ Check:** *If the project has a growth/GTM story, each of the five AARRR stages carries a defined
  metric (retention and revenue not skipped for top-of-funnel), or proven-irrelevant.*
- **Source:** https://amplitude.com/blog/pirate-metrics-framework · https://mcgaw.io/wp-content/uploads/2016/04/PirateMetrics_Final.pdf

### A14 — Four-fits business-model coherence (Balfour)
- **Measures:** whether product, market, channel, and revenue model *reinforce* each other — PMF alone
  doesn't scale.
- **Evidence:** four fits — Market↔Product, Product↔Channel, Channel↔Model, Model↔Market. Each
  constrains the others (a $10/mo product cannot fund a high-touch sales channel; a viral product
  needs a channel that carries virality).
- **GOOD:** channel and pricing/model are coherent with product and market. **BAD/vanity:** a
  low-ACV product with an enterprise-sales channel; a channel assumed but never matched to the model.
- **→ Check:** *If the project defines a channel and a revenue model, they are coherent with the
  product and target market (the four fits hold), with any mismatch flagged, or proven-irrelevant.*
- **Source:** https://brianbalfour.com/four-fits-growth-framework · https://brianbalfour.com/essays/product-market-fit-isnt-enough

### A15 — Growth mechanism: loop vs bought funnel
- **Measures:** whether growth compounds (a loop feeds its own top) or is linearly bought (funnel
  needs ever-more input).
- **Evidence:** name the loop — user action → output → new users back into the loop (referral,
  content, paid-recycled-into-CAC). Funnel = add X/month, linear. Loop = geometric.
- **GOOD:** a named growth loop, or an honest "we buy growth via channel X at CAC Y." **BAD/vanity:**
  assuming "viral" / "word of mouth" with no loop mechanism; a hockey-stick projection with no engine.
- **→ Check:** *If the project projects compounding growth, it names the specific growth loop
  mechanism (not an unspecified "viral / word of mouth"), or states growth is bought and reconciles
  it with CAC, or proven-irrelevant.*
- **Source:** https://www.reforge.com/blog/growth-loops

---

## B. Vanity-metric traps (de-vanity the checklist)

One line each — "looks like signal, isn't." These are the discriminators a de-vanity check must catch.

1. **Cumulative charts** — total-users / cumulative-revenue curves go "up and to the right even when
   the business is shrinking." Non-cumulative (per-month) is the honest form. (a16z)
2. **Registered / total users vs active users** — registered is a cumulative metric that rises while
   usage falls, and "has been gamed"; active users (with a stated definition) is the real one. (a16z)
3. **Downloads / signups** — "really just a vanity metric" unless tied to engagement/retention. (a16z)
4. **Chart crimes** — truncated/unlabeled Y-axis, shrunk scale, % gains with no absolute base
   ("impressive off a small base"). (a16z)
5. **Gross vs net conflation** — net churn "understates the losses" vs gross; net burn vs gross burn;
   NRR hides churn that GRR exposes. (a16z)
6. **LTV over-count** — LTV on revenue instead of margin; LTV from a *predicted* future retention
   curve (Gurley's "dangerous seduction"). (a16z / Gurley)
7. **Bookings ≠ revenue ≠ GMV** — bookings excludes LOIs/verbal; GMV ≠ revenue (marketplace take
   only); ARR ≠ one month's all-in bookings × 12 (that smuggles in one-time/setup/services fees). (a16z)
8. **Blended CAC** — masks a high paid CAC by averaging in free organic customers. (a16z)
9. **Waitlist / survey "yes"** — "measures curiosity, not intent"; stated intent to pay ≠ demand.
   (saasvalidation / producttalk)
10. **Top-down TAM** — "1% of a $50B market" — a percent of a huge number is not evidence of reachable
    demand (companion to A12; flagged across a16z sizing guidance).
11. **Single-source traffic** — one acquisition channel presented as durable growth = platform risk.
    (a16z 16-more)
12. **Presentation-order / cumulative framing** — choosing the flattering cut (cumulative, no base
    period) instead of the material one. (a16z 16-more)

---

## C. Design / business-model craft (direction-level, for the design-bearing branches)

- **Business-model coherence (four fits).** Pricing model, channel, product, and market must
  reinforce, not fight (A14). The most common silent failure: a self-serve/low-ACV product bolted to a
  high-touch sales motion, or a "viral" product on a channel that can't carry virality. (Balfour)
- **GTM / distribution fit.** Choose the motion from the product's nature: PLG works for
  quick-time-to-value, low-complexity, "blue ocean" products; complex products need sales-led. Wes
  Bush's MOAT: dominant players → freemium or free-trial; differentiated → free-trial/demo; disruptive
  → freemium. 97% of buyers prefer to try before they buy — a bias toward self-serve where feasible.
  (Bush / OpenView)
- **Unit-economics sanity as a system, not a single ratio.** Gross margin is the multiplier; payback
  is the cash gate; LTV:CAC is the return; NRR/GRR is the durability. A design that names one and hides
  the rest is unsound — context beats any single number (a 2.5:1 with 9-mo payback + 120% NRR beats a
  4:1 with 36-mo payback + 95% NRR). (a16z / fiscallion)
- **Pricing as a designed model tied to a value metric.** Price should track the unit of value the
  customer consumes and be set with a method (Van Westendorp range / willingness-to-pay research), not
  guessed. A price with no method is a design gap, not a detail. (Van Westendorp)
- **PMF is measured before scale, and it is a leading indicator not a guarantee.** Superhuman treated
  the 40%-very-disappointed score as the *weekly* leading metric to optimize (22%→58% over three
  quarters via survey→segment→analyze→implement, 50/50 roadmap: half reinforce fans, half remove
  fence-sitter objections). The design lesson: build the PMF *engine* (a repeatable measure-and-improve
  loop), not a one-time claim. (Vohra / First Round)

---

## D. Load-bearing truths (each with a why)

1. **A market/growth/monetization claim without a falsifiable metric is not a claim — it's a hope.**
   *Why:* the whole point of these frameworks is to replace "users will love it" with a number that
   can fail. This is the single biggest gap in the current checklist (strong on process, silent on
   whether a business claim is measured right).
2. **PMF = dependency, not satisfaction.** *Why:* satisfied users leave for a better option; dependent
   users can't. The Sean-Ellis question measures "disappointed to lose," which is why 40% predicts
   word-of-mouth growth. (Ellis)
3. **The retention curve flattening is the purest PMF signal because it is involuntary behavior.**
   *Why:* surveys capture stated opinion; a plateauing cohort curve captures what users actually do.
   Any PMF check should prefer behavioral evidence over stated. (Balfour)
4. **Segment before you score — "everyone" is a non-answer.** *Why:* Superhuman's score rose 10 points
   by filtering to the high-expectation customer with zero product change; a target of "everyone"
   guarantees a diluted, unmeasurable PMF. (Vohra)
5. **Gross vs net is where honesty hides.** *Why:* net churn, net burn, and NRR each look better than
   their gross twin by construction; requiring BOTH is the cheapest, highest-value de-vanity rule.
   (a16z)
6. **Cumulative and registered-user counts always rise — so they prove nothing.** *Why:* a metric that
   cannot go down cannot signal health; the check must reject cumulative framing and undefined "active."
   (a16z)
7. **Blended CAC and revenue-based LTV both flatter the business.** *Why:* blended hides paid cost;
   revenue-LTV ignores the cost of delivery. Unit-economics claims must specify paid CAC and
   margin-based LTV or they are unsound. (a16z / Gurley)
8. **Payback period, not LTV:CAC, is the cash-survival gate.** *Why:* a 5:1 ratio with a 30-month
   payback still bankrupts a company that can't fund the gap; payback must be stated alongside the
   ratio. (digitalapplied)
9. **Demand is proven by costly signals, not cheap ones.** *Why:* a waitlist signup or survey "yes"
   costs the respondent nothing; an LOI, pre-sale, paid pilot, or friction-laden smoke test costs
   something, so it actually predicts behavior. Grade demand by the cost of the signal. (saasvalidation)
10. **Price needs a method.** *Why:* willingness-to-pay is researchable (Van Westendorp, pricing
    interviews); a guessed price is an un-evidenced load-bearing assumption exactly like a guessed
    market size. (Van Westendorp)
11. **PMF alone does not scale — the four fits do.** *Why:* companies with PMF still fail to grow when
    channel and model don't cohere with product and market; a design check must look past PMF to
    channel↔model↔market fit. (Balfour)
12. **Growth is either a loop or a purchase — name which.** *Why:* a hockey-stick projection with no
    named loop mechanism and no CAC-funded funnel is a fantasy; forcing "loop or bought" makes the
    growth story falsifiable. (Reforge)
13. **Efficiency metrics gate growth claims.** *Why:* "we grew 300%" off a tiny base with unbounded
    burn is vanity; Rule of 40 / magic number / burn multiple force growth to be *paid for*. (Sacks)
14. **Applicability is a first-class outcome — most axes are `proven-irrelevant` for an OSS/internal
    tool.** *Why:* gobbi is solo-user OSS; forcing a CAC onto it would be as wrong as omitting PMF from
    a SaaS. The gradable check is "evidenced OR proven-irrelevant with a reason," matching the skill's
    existing grammar — never "every project must have this number."

---

## E. Directly reusable checks (gradable pass/fail — drop-in for scenario/checklist)

Written in `startup/checklists.md` grammar (one falsifiable sentence; each admits PASS / FAIL /
`n/a`-proven-irrelevant, mirroring the existing "or proven irrelevant with a reason" pattern). These
would live under a new "Market / demand / economics" scenario family (candidate perspectives:
Consistency for claim-vs-evidence, Risk for un-evidenced load-bearing business claims).

1. Every load-bearing market, demand, growth, retention, or monetization claim names a **falsifiable
   metric with a threshold or a measurement method** — not "users will love it" / "huge market" — or
   is recorded `proven-irrelevant` with a reason.
2. Any **product-market-fit** claim cites a falsifiable signal (e.g. Sean-Ellis ≥40%-very-disappointed
   with a qualified-respondent filter, or a flattening cohort retention curve), not stated satisfaction.
3. Any **retention / stickiness** claim is evidenced by a cohort curve that flattens, with an explicit
   **active-user definition** — never a cumulative total-users count.
4. The project names **one specific target/beachhead segment** (not "everyone" or a whole market), and
   durable directions trace to it.
5. Any **headline success metric** is a single value-delivered leading indicator, not registered-users,
   downloads, or another cumulative count that only rises.
6. Any **acquisition-cost** figure is **paid + fully-loaded** (referrals, credits, discounts), not a
   blended average that hides paid cost.
7. Any **LTV / LTV:CAC** claim computes LTV on **margin (not revenue)** from measured cohort churn,
   states **CAC payback** alongside the ratio, and is not a predicted-curve inflation.
8. Any **retention-economics** claim states **both NRR and GRR** (NRR alone can mask churn under
   expansion).
9. Any **gross-margin / "software economics"** claim is **quantified with a COGS breakdown** (hosting,
   support, delivery included), not an unquantified "high margin."
10. Any **efficient-growth / scaling** claim pairs the growth number with an **efficiency metric**
    (Rule of 40 / magic number / burn multiple), not a raw growth rate off a small base.
11. Any **market-demand or price** claim rests on a **costly signal** (signed LOI / pre-sale / paid
    pilot / friction smoke test) — not waitlist size or survey "yes" — and any price cites a **method**
    (e.g. Van Westendorp).
12. Any **growth / GTM** story covers **all five AARRR stages** with a metric each (retention and
    revenue not skipped for top-of-funnel).
13. Any defined **channel + revenue model** is **coherent with product and market** (the four fits
    hold); a mismatch is flagged, not hidden.
14. Any **compounding-growth projection** names the specific **growth-loop mechanism**, or states growth
    is bought and reconciles it with CAC — no unspecified "viral / word of mouth."
15. **No chart-crime / cumulative-framing vanity** in any promoted metric: no cumulative presentation
    of a non-cumulative metric (revenue, new users, bookings), no undefined "active," no % gain without
    an absolute base.
16. **Bookings / revenue / GMV / ARR are not conflated**: bookings excludes LOIs; GMV ≠ revenue; ARR
    excludes one-time/setup/services fees; each term is used precisely.

---

## F. External references (Source / Insight / Why — for the synthesis leader)

- **Sean Ellis 40% test** — https://www.fitsignal.com/blog/sean-ellis-40-percent-test — *Insight:*
  ≥40% "very disappointed" among qualified users is the falsifiable PMF benchmark. *Why:* gives A1/E2 a
  concrete threshold to grade against.
- **Superhuman PMF engine (Vohra)** — https://review.firstround.com/how-superhuman-built-an-engine-to-find-product-market-fit/ —
  *Insight:* 4-question survey + HXC segmentation + 50/50 roadmap; score is the weekly leading metric.
  *Why:* grounds A1/A3 and the "PMF is an engine, measured before scale" truth (D4).
- **a16z 16 Startup Metrics** — https://a16z.com/16-startup-metrics/ — *Insight:* precise definitions +
  the vanity cautions (paid vs blended CAC, margin-LTV, gross vs net, downloads-are-vanity). *Why:* the
  spine of B (vanity traps) and A6–A10.
- **a16z 16 More Startup Metrics** — https://a16z.com/16-more-startup-metrics/ — *Insight:* cumulative
  charts, registered-vs-active, chart crimes, single-source traffic. *Why:* the presentation-level
  vanity discriminators (B1–B4, B11–B12).
- **Bill Gurley, LTV seduction** — http://abovethecrowd.com/2012/09/04/the-dangerous-seduction-of-the-lifetime-value-ltv-formula/ —
  *Insight:* predicted-future-LTV inflates; use measured historical LTV. *Why:* A7/D7.
- **LTV:CAC & payback benchmarks** — https://foundrycro.com/blog/ltv-cac-ratio-benchmarks-2026/ ·
  https://www.digitalapplied.com/blog/saas-unit-economics-2026-cac-ltv-payback-reference — *Insight:*
  ≥3:1 (top 4–6:1), payback <12 mo. *Why:* thresholds for A7/A8.
- **NRR/GRR benchmarks** — https://optif.ai/learn/questions/b2b-saas-net-revenue-retention-benchmark/ —
  *Insight:* good 100–120%, best-in-class ≥120%. *Why:* A10.
- **Gross-margin benchmarks** — https://www.fiscallion.io/blog/saas-gross-margin-benchmark-what-investors-actually-expect-at-every-stage —
  *Insight:* ~75% SaaS floor, ≥85% best-in-class. *Why:* A9.
- **Rule of 40 / magic number / burn multiple (Sacks)** — https://www.capitaly.vc/blog/david-sacks-playbook-saas-burn-multiple-rule-40-ndr-2025 ·
  https://www.wallstreetprep.com/knowledge/rule-of-40/ — *Insight:* efficiency gates on growth. *Why:* A11.
- **AARRR pirate metrics (McClure)** — https://amplitude.com/blog/pirate-metrics-framework ·
  https://mcgaw.io/wp-content/uploads/2016/04/PirateMetrics_Final.pdf — *Insight:* five funnel stages;
  founders skip retention+revenue. *Why:* A13.
- **North Star metric (Amplitude/Ellis/Rachitsky)** — https://growthmethod.com/the-north-star-metric/ —
  *Insight:* one value-delivered leading indicator. *Why:* A4.
- **PLG (Wes Bush / OpenView)** — https://productled.com/book/product-led-growth ·
  https://openviewpartners.com/blog/how-to-start-product-led-growth-with-wes-bush-and-blake-bartlett/ —
  *Insight:* time-to-value, activation threshold, PQL, MOAT free-trial-vs-freemium. *Why:* A5, GTM craft.
- **Four Fits & Growth Loops (Balfour/Reforge)** — https://brianbalfour.com/four-fits-growth-framework ·
  https://brianbalfour.com/essays/product-market-fit-isnt-enough · https://www.reforge.com/blog/growth-loops —
  *Insight:* PMF alone doesn't scale; loops compound, funnels are linear. *Why:* A14, A15.
- **Willingness-to-pay & demand evidence** — https://www.saasvalidation.tech/pre-launch-waitlists-measure-curiosity-not-intent/ ·
  https://www.producttalk.org/2023/05/willingness-to-pay/ · https://en.wikipedia.org/wiki/Van_Westendorp's_Price_Sensitivity_Meter —
  *Insight:* demand ladder (waitlist=curiosity → LOI/pre-sale=strongest); Van Westendorp 4-question PSM.
  *Why:* A12, the strongest de-vanity lever for demand claims.

---

## G. Verification / confidence notes

- **Verified via WebFetch (primary source read):** a16z "16 Startup Metrics" and "16 More Startup
  Metrics" (definitions + vanity cautions); First Round Superhuman article (4 survey questions, 40%,
  22%→58%, 50/50 split, HXC). High confidence.
- **Verified via WebSearch (multi-source corroboration):** Sean-Ellis 40% + respondent filter;
  LTV:CAC ≥3:1 and payback <12mo; NRR 100–120%/≥120%; gross margin ~75–85%; Rule of 40 / magic number
  >0.75–1.0 / burn multiple ~1.0; AARRR; North Star; PLG time-to-value/PQL/MOAT; Van Westendorp 4
  questions; four fits; growth loops. Corroborated across ≥2 independent sources each; benchmark exact
  numbers vary slightly by year/source (flagged as "≈").
- **Not independently re-derived (secondary-source):** the "10%+ monthly loop growth vs 3–5% funnel"
  figure and some 2026 benchmark medians come from vendor blogs; treat the *direction* as reliable and
  the *exact number* as indicative, not canonical. The founder-canon numbers (40% test, ≥3:1, Rule of
  40) are stable across a decade of sources.
- **Scope caveat for the synthesis leader:** these are SaaS/commercial-startup axes. For gobbi's own
  solo-user OSS context most A6–A11 axes resolve `proven-irrelevant`; the *broadly applicable* ones for
  ANY project design are A1–A5 (PMF/segment/value/activation), A12 (demand evidence), A14 (model
  coherence), and the whole of B (vanity discipline) — those are the highest-yield additions.

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-07-14 | 97d3ef5a-1b8a-4dab-b884-9f686e185b22 | Ideation prior-art base for the `startup` skill rewrite; the commercial axes (A6–A15) were ultimately locked out per [[scope-narrowed-to-design-craft]], but the de-vanity discipline (§B) and demand-evidence axes (A1–A5, A12) informed the design-craft families |

## Related

- [[scope-narrowed-to-design-craft]] — the decision that locked the commercial axes (A6–A15, §C) out of
  the `startup` skill's final scope
