---
name: current-skill-gap-study
description: Adversarial gap map of the pre-rewrite startup skill (SKILL.md/topics.md/scenario.md/checklist.md/evaluation.md) against startup-interview and customer-discovery craft, produced before the rewrite.
type: references
scope: project
feature: null
status: active
created: 2026-07-14
session: 97d3ef5a-1b8a-4dab-b884-9f686e185b22
tags: []
keywords: [startup-skill, gap-analysis, vanity-metrics, principles-critique, adversarial-review, prior-art]
author: claude
title: Current `startup` Skill — Adversarial Gap Map (pre-rewrite baseline)
source: skills/startup/{SKILL.md, topics.md, scenario.md, checklist.md, evaluation.md, recording.md} — internal study, session base (as-is research cluster, not atomized per one-insight-per-file; kept whole per this session's user-approved promotion plan)
accessed: 2026-07-14
ref_type: code
---

# R5 — Current `startup` Skill: Adversarial Gap Map

Internal target map for the synthesis leader. Read-only study of the six `startup` skill files as they
stand at the session base. Every gap cites the exact file + section/heading + quoted text it critiques.
This maps gaps only; it proposes no fixes.

**Files studied (full):** `skills/startup/{SKILL.md, topics.md, scenario.md, checklist.md, evaluation.md}`
in full; `recording.md` via its heading structure only (it is a **locked-OUT** area — the
promotion/recovery machinery — so it is inventoried but NOT critiqued as a gap).

**Locked-OUT of critique (per brief) — do not read the findings below as asking to change these:** the
promotion/recovery machinery (`recording.md`), the P6.5 dual-system gate, the memory/record split, and the
product-shape-first STRUCTURE. I question topic ORDERING within that structure only (§ f), never the
structure itself.

**One cross-cutting tension to surface up front (a fork for the synthesis leader + user, NOT resolved here):**
The skill is named `startup` and this session judges it against startup-interview / customer-discovery
craft, yet gobbi's own memory records the project as **solo-user, open-source, engineering-merit-only**
(`feedback_solo_user_context`). Several "missing startup axes" below (willingness-to-pay, business model,
GTM, unit economics, moat) are commercial-viability axes that may be **deliberately** out of gobbi's own
scope. The gaps are real for a *general* "starting a new project / startup" skill; whether the skill should
grade **commercial viability** or only **product/project design** is the fork. I flag it; the synthesis
leader / user decides. This tension colors (c), (d)-coverage, and (e).

**Session outcome (read before applying).** The fork above was resolved: the user narrowed the rewrite
to design-craft only — see [[scope-narrowed-to-design-craft]]. This document is preserved as-is as the
adversarial baseline that motivated the rewrite; its "missing commercial axes" findings ((c) below) were
NOT adopted as new grading axes, though the demand-evidence craft they cite as strong survives as
elicitation principle.

---

## (g) Structural inventory (read this first — it frames a–f)

| File | Lines / size | Top-level sections | Notes |
|---|---|---|---|
| `SKILL.md` | 291 / 25.8 KB | frontmatter → intro → **## Principles (6)** → **## Rules** (Must-Follow 11, Must-Not-Follow 9) → **## Procedure** (7-phase table + P6.5; Phase gates; Design-decision micro-loop P3; Memory Access Matrix; Delete semantics; Output paths) → **## References** (9 owner links) | Principles + Procedure are the substance surface for this study. |
| `topics.md` | 470 / 25.7 KB | intro → Contents → **How to traverse** (8 rules + Design-bearing markers) → **Phase I Problem space** (T1-3) → **Phase II Boundary** (T4) → **Phase III Solution space** (T5-8) → **Phase IV Guardrails** (T9-11) → Level-1 checkpoints → Traversal/coverage/resume rules | **11 Level-1 topics, 44 Level-2 branches.** Each branch = a 3-bullet "prompt bank". |
| `scenario.md` | 258 / 26.9 KB | intro (artifact-under-eval def) → 7 perspectives → **20 scenario families** | Per family: Category / Situation / Good / Bad / Adversarial / Checklist IDs. |
| `checklist.md` | 217 / 23.4 KB | copy-then-tick preamble → 7 perspectives → **113 checks** (1:1 with scenario tree) | Per-perspective count below. |
| `evaluation.md` | 351 / 25.4 KB | Evaluation Frame intro → What/Why/How mapping → 7 perspective frames (Lens + Recommended verifications + Perspective anti-patterns) → Overall Stage-3 Karpathy anchors → P6.5 verdict routing (PASS/REVISE/FAIL) → Output reminder | The lens + anti-pattern text is where "what is judged" actually lives. |
| `recording.md` | 583 / 47.8 KB | 14 sections: four-layer capture; answer-ledger schema; session shape; topic→output effects; staging→destination contract; capture/synthesis; manifest/contradiction pass; root README; startup-close promotion (6 steps); frontmatter; rerun classification; resume classifier; standalone entry/exit; privacy/retention | **LOCKED-OUT — inventory only.** |

**Branch distribution across the 44 (T1:4, T2:3, T3:4, T4:4, T5:4, T6:4, T7:5, T8:4, T9:4, T10:4, T11:4):**
- Problem space (T1-3): **11 branches**
- Boundary (T4): **4 branches**
- Solution/system (T5-8): **17 branches**
- Guardrails (T9-11): **12 branches**

**Checklist checks by perspective (113 total):** Project 18 · Structure 18 · Performance 13 · Aesthetics 9
· Usage 13 · Consistency 14 · **Risk 28**.

**The load-bearing structural fact for this whole study:** the three memory-mechanics perspectives
(Structure + Consistency + Risk) hold **60 of 113 checks (~53%)**; Risk alone is **25%**. Project — the
only perspective adjacent to *startup substance* — is 18 checks (16%), and of those only **~2** (PROJ-01
CHECK-04/05) actually grade answer *substance*. So of 113 checks, **roughly 2–4 grade whether the startup
answers are any good**; the other ~110 grade coverage, memory hygiene, routing, secrets, traceability, and
promotion safety. This is appropriate for a memory-writing skill and near-empty for a startup interview.

---

## (a) Thin / generic / process-y scenarios (judge process, not startup substance)

**Headline:** Of the 20 scenario families in `scenario.md`, **none judges startup SUBSTANCE** — none can
FAIL a baseline because the problem is unreal, demand is weak, the business model is incoherent, or there is
no moat. Every family judges either (i) interview **process** (coverage / depth / ordering / study-loop) or
(ii) **memory-and-promotion mechanics** (atomicity / routing / secrets / collision-safety / traceability /
cold-read). A founder can complete a fully-covered, atomic, secret-free, traceable baseline **for a product
nobody wants** and clear P6.5.

Anchored breakdown:

- **Entire Structure family (STRUCT-01..04), Consistency family (CONS-01..03), Risk family (RISK-01..05)
  are memory/promotion mechanics** — correct for the skill's memory job, but they contribute **zero**
  startup-substance discrimination. E.g. `scenario.md` STRUCT-01 Good: *"each typed record holds one durable
  concept, follows its type's section contract, and carries a subject-named slug"* — pure record hygiene.
  RISK-03 Good: *"every candidate validates before the first write... a create collision halts"* — promotion
  safety. CONS-03 Good: *"sampled claims trace memory → manifest row → staged source → ledger answer"* —
  traceability. (These sit on the locked promotion/P6.5 machinery, so they are not gaps to fix — but they
  are also not startup-quality signal.)

- **The "substantive" claim is carried by ONE adversarial, and it is shallow.** `scenario.md`
  STARTUP-PROJ-SCENARIO-01 Adversarial: *"the coverage count is 44/44, but the weakest closures reveal depth
  theatre — several one-word answers were stamped `confirmed` with no probe."* Its Bad case names the
  discriminator literally: *"a shallow one-word answer such as 'developers', 'fast', or 'standard'."* This
  catches **one-word** non-answers only. A fluent, evidence-free paragraph ("our users are time-pressed
  developers who deeply value speed and will adopt this because it fits their workflow") sails through. The
  sole substance guard discriminates on **word count, not evidence**.

- **Ordering scenario judges sequence, not correctness.** PROJ-02 (*"Product intent constrains architecture
  and stack"*) Good: *"Topics 2-5 were confirmed before any future architecture... was locked."* This grades
  **that product came before system** — a process property — not whether the product decision was *right*.

- **Design-bearing scenario grades that the ritual happened.** PROJ-03 Good requires *"a decision brief with
  internal and external prior art, 2-3 credible options, an opinionated recommendation, an
  evidence-to-change..."* — this grades that the **study→recommend→decide loop ran and left artifacts**, not
  that the chosen direction is sound. Its Bad case is about missing artifacts / fabricated citations, not a
  bad decision.

- **Usage/Aesthetics families grade "did you write it down / can it be read", not "is it good".** USAGE-01
  Good: *"the README plus the typed records answer what the project is, who it serves, its boundary,
  value-features..."* — satisfied by **any** baseline that filled the topics, regardless of business
  viability. AESTH-01/02 grade cold-readability and stable names — real doc quality, zero startup substance.

- **The only place "cost" appears is infra COGS, not economics.** PERF-03 Good: *"recurring token / API /
  infra / storage costs... are recorded with an estimate."* This is an operational cost budget, never
  pricing / margin / CAC / LTV. So even the one economics-adjacent scenario is supply-side only.

**Net for (a):** the scenario set is well-built **for a memory-integrity skill** and effectively blind as a
**startup-quality** discriminator. The synthesis leader needs new SUBSTANCE families (demand-evidence
quality, WTP/business-model coherence, competition/moat) that can actually return FAIL — today no scenario
can.

---

## (b) Vanity / un-gradable checks

Two distinct problems. Most of the 113 checks are **highly gradable precisely because they grade mechanics**
(grep the ledger, count branches, run `validate-frontmatter.sh`, diff the manifest, run a secret scan). The
problem is not that mechanics checks are un-gradable — they are fine. The problem is:

**(b1) The handful of substance-adjacent checks lack a threshold or rubric (subjective / un-gradable):**

- `checklist.md` STARTUP-PROJ-SCENARIO-01-CHECK-04 — *"No branch marked `confirmed` rests only on a
  one-word, vague, or question-echoing answer without evidence, a concrete example, or a **meaningful
  explanation**."* "Vague" has no threshold; "meaningful explanation" is a pure judgment call and an escape
  hatch — a padded non-answer satisfies it. This is the **sole** substance guard and the least gradable check
  in the file.
- STARTUP-PROJ-SCENARIO-03-CHECK-02 — *"records 2-3 **credible** options, an **opinionated**
  recommendation."* "Credible" / "opinionated" are unanchored.
- STARTUP-PERF-SCENARIO-01-CHECK-02 — *"Uncertain or hard-to-reverse design-bearing branches received
  **deeper** study and discussion than verified routine facts."* "Deeper" is relative, no measure.
- STARTUP-PERF-SCENARIO-02-CHECK-01 — *"file count and total word count are **proportional to** the distinct
  durable decisions."* "Proportional" is unmeasurable without a rubric.

**(b2) Checks that reward that a step HAPPENED, not that the content is SOUND (activity, not evidence):**

- STARTUP-PROJ-SCENARIO-03-CHECK-01 — *"a decision brief with internal evidence and **2-3 identifiable
  external prior-art sources**."* Rewards the **existence of 2–3 sources**; three real-but-irrelevant
  citations pass the count. CHECK-04 (*"every cited source resolves and supports the claim"*) partially
  offsets, but "supports the claim" is again a judgment.
- STARTUP-CONS-SCENARIO-01-CHECK-01 — *"The §7 contradiction pass **records results** for vision vs scope,
  users vs journeys..."* Rewards that the pass **recorded** results, not that the results are correct.
  `evaluation.md` even names the anti-pattern (*"A contradiction pass asserted, not shown"*) — but the CHECK
  itself only requires results be recorded.
- STARTUP-RISK-SCENARIO-05-CHECK-01/02 — *"Two fresh evaluators... evaluated"* / *"Each system wrote all nine
  required files."* Grades that the gate ran and produced files (locked-machinery; not a fixable gap, but it
  is activity-counting, not quality).

**(b3) The real "vanity" problem is coverage-by-omission, not un-gradability.** The checklist is highly
gradable because it **only grades what is easy** (mechanics) and does **not attempt** the hard substance:
there is **no check** that grades whether demand evidence is strong, whether willingness-to-pay was probed,
whether the business model closes, whether there is a moat, or even whether the (well-elicited) Topic-3.3
demand evidence is **past-behavior vs hypothetical**. High gradability is bought by not grading substance at
all.

---

## (c) Missing startup quality axes

Mapping the 8 requested axes against the current skill:

| Axis | Status today | Where it lives (or its proxy) | Gap |
|---|---|---|---|
| **Demand evidence** | **PRESENT (strongest part of the tree)** | `topics.md` 3.3 *"What observed behavior shows demand, and how frequent is the need among the first users?"*; 3.3 *"What have they already spent in time, money, risk, or workaround effort?"*; 3.4 *"What has the first target user already done when the current alternative fell short — switched tools, built a workaround, or absorbed the cost?"* | Well-elicited (Mom-Test past-behavior style). BUT **no scenario/check grades the answer's quality** — a hypothetical or unquantified demand claim is not failable (see b3). Topic asks well; evaluation ignores it. |
| **Willingness-to-pay** | **ABSENT (proxy only)** | 3.1 lists *"pays for"* as a role; 3.3 *"spent in... money"* | No pricing, no revenue model, no price sensitivity, no "would they pay $X / at what price does it stop being worth it". Money appears only as a past-cost proxy. |
| **PMF signal** | **ABSENT (proxy only)** | 2.3 success outcomes; 10.4 *"What milestone proves enough value to justify the next investment?"* | No retention / engagement / repeat-use signal, no Sean-Ellis-style "how disappointed if it went away", no leading PMF indicator. |
| **Business-model coherence** | **ABSENT** | 1.4 (license/distribution/**governance** — legal, not economic); Topic 8 (**tech** stack/delivery/ops) | No revenue model, cost structure, monetization, or margin question anywhere. 1.4 is the nearest and it is a legal/governance lens. |
| **GTM / distribution** | **ABSENT (proxy only)** | 1.4 *"What external distribution, contribution, review-authority, or community-obligation model applies?"* (governance sense) | No acquisition channels, growth loops, launch strategy, or "how do users discover this". "Distribution" in 1.4 means license/redistribution, not go-to-market. |
| **Unit economics** | **ABSENT (COGS only)** | `checklist.md` PERF-03-CHECK-03 recurring token/API/infra/storage cost; `topics.md` 10.3 budget | Supply-side infra cost only. No CAC, LTV, payback, contribution margin — no revenue side. |
| **Moat / defensibility** | **ABSENT** | — | No question on defensibility, switching cost, network effects, data moat, or "why can't a competitor copy this". |
| **Competition** | **PARTIAL** | 3.3 *"What do target users do today instead — including manual work or doing nothing?"*; 3.4 alternative-fell-short | Substitutes / non-consumption covered (good JTBD framing). Absent: **named direct competitors, competitive positioning, why-us-vs-them, competitive response**. |

**Absent or proxy-only (6 of 8):** willingness-to-pay, PMF signal, business-model coherence, GTM/distribution,
unit economics, moat/defensibility. **Present/partial (2 of 8):** demand evidence (well-asked, un-graded),
competition-as-substitutes (direct-competitor axis missing). See the up-front tension: the six commercial
axes may be deliberately out of gobbi's solo-user scope — the synthesis leader/user must rule on whether the
skill judges commercial viability.

---

## (d) Weak questions in `topics.md` + coverage gaps + tree structure

**Current tree structure (for reference):** 11 topics in 4 phases — Phase I Problem space (T1 Existing
Reality, T2 Vision/Problem/Success, T3 Users/Jobs/Alternatives/Value), Phase II Boundary (T4 Scope), Phase
III Solution space (T5 Features, T6 Experience, T7 Architecture, T8 Stack), Phase IV Guardrails (T9
Conventions, T10 Risks, T11 Idioms). 44 branches; each branch is a 3-bullet **prompt bank** ("ask one axis
per turn", traverse rule 2). Design-bearing markers: core cluster T6–9 + 5.1–5.2 always; conditional set
4.4, 5.3, 5.4, 7.1, 8.4, 9.4, 10.4, 11.1, 11.2.

**The file is self-aware about question quality** — traverse rule 3 states the discipline verbatim:
*"Prefer past-behavior and repository evidence over opinion or hypothetical, and never lead the answer — ask
what actually happened, not what the user supposes would happen."* Several questions **violate the file's own
rule**:

**Hypothetical / future-tense (against rule 3):**
- 2.1 *"If the project succeeds, what is materially different for its users or operators?"* and *"What stays
  true in three years even if the implementation changes completely?"* — speculative/future.
- 2.3 *"What two to four observable outcomes **would prove** the project works?"* and *"What **would count as**
  a technically successful build but a failed project?"* — future conditional.
- 3.4 *"Which value claim **would we drop** if the supporting evidence never appears?"* — counterfactual.
- 4.3 *"What should a contributor never infer from the vision statement?"* — abstract/hypothetical.
- 4.4 *"What evidence or condition **would justify** expanding the boundary later?"* — future conditional.
- 10.4 *"What evidence **would** pause, pivot, narrow, or retire the project?"* — future conditional.

  These cluster in **inherently forward-looking topics** (vision, non-goals, risk, roadmap). This is a real
  **inconsistency** for the synthesis leader to resolve: either carve an explicit exception for
  inherently-forward branches, or convert to past-behavior proxies. Topic 3.3/3.4 is the **model to imitate**
  — it turns demand into past behavior (*"what have they already spent"*, *"what has the first target user
  already done"*) rather than "would they want it".

**Multi-axis bundles (against rule "one axis per turn").** The file *designs* branches as prompt banks and
flags 1.4 / 8.2 / 10.1 as multi-axis, so a bank is not itself a defect — but several bundle far more than
flagged and invite the manager to conflate axes in one answer:
- 3.1 *"Who uses it, and who operates, approves, supports, **pays for**, or is affected by it?"* — six roles;
  note WTP ("pays for") is buried as one word inside a six-way bundle, so it can be skipped silently.
- 7.4 *"What data is created, read, updated, deleted, retained, and exported?"* — six axes.
- 9.1 six pattern axes; 9.2 seven quality axes; 9.4 seven constraint axes.

  Low severity given the bank design, but the WTP-buried-in-3.1 case is worth pulling out because it is the
  only WTP touchpoint and it is un-prominent.

**Coverage gaps vs the startup dimensions (feeds c):** the whole problem-space phase (T1–3, 11 branches) has
**no branch** for pricing/WTP-as-money, direct competitors + positioning, market size, acquisition/growth, or
moat. There is no "Market & Business Model" topic and no "Growth / Distribution" topic. Because
product-shape-first is locked, these would slot as **new branches under/near Topic 3** (or a new problem-space
topic between T3 and T4), not a structure change.

**Emphasis imbalance (structural, feeds f):** the riskiest startup assumptions (demand, WTP, who-pays,
why-now, competition) get the **least** branch surface — Problem space is 11 of 44 branches — while
solution+system (T5–8) gets **17** and guardrails (T9–11) get **12**. For a startup interview the weight is
inverted: architecture/stack/ops/conventions out-mass the customer/demand/viability core.

---

## (e) Current Principles critique (all 6 quoted verbatim)

The `SKILL.md` ## Principles block has 6 principles. Verbatim + verdict on whether each is load-bearing for
**BOTH** interview craft AND project-design craft:

1. **"Dependency comes before detail."** — *"Problem, users, outcomes, and boundary give the product its
   shape; the product shape then constrains the system shape."* → **Structure principle, not craft.** It
   restates the (locked) product-shape-first ordering. Load-bearing for project design (sequencing) and for
   interview structure, but it is an ordering rule elevated to principle, not an elicitation or product
   insight. **Substance, but structural.**

2. **"Evidence comes before assertion."** — *"Marking each answer by its evidence strength keeps a plausible
   guess from hardening into a false foundation."* → **Genuinely load-bearing for BOTH.** The core of good
   customer discovery (separate fact from hope) and of safe design. **Best of the six.** Limit: it grades
   **tagging** evidence strength, not **hunting** for disconfirming evidence (falsification / say-vs-do) — a
   discovery expert would want an active-disconfirmation principle, not just a labeling one.

3. **"One answer can have many typed effects."** — *"the durable record follows the kind and scope of each
   concept... without ever bundling unrelated ideas into one document."* → **Memory-mechanics, not craft.**
   Describes gobbi's typed-record synthesis (a locked-machinery concern) dressed as a principle. **Filler as a
   startup/interview principle** — it is an implementation detail of the promotion layer.

4. **"A transcript is not memory."** — *"Durable memory is a separate synthesis that stands on its own."* →
   **Memory-mechanics (the record/memory split — locked area), not craft.** True and important for gobbi's
   plumbing; says nothing about interviewing a founder or designing a product. **Filler as a principle.**

5. **"The current reference beats historical accumulation."** — *"A baseline review tests the existing claims
   and classifies each change; it never stacks a new layer of prose over an outdated one."* → **Rerun/
   supersession mechanics (locked area), not craft.** Again plumbing elevated to principle. **Filler as a
   principle.**

6. **"The user owns product intent."** — *"The manager investigates, challenges, and recommends; the user
   decides."* → **Genuinely load-bearing for BOTH.** The design-partnering stance (gobbi P3/P4). **Second-best
   of the six.**

**Verdict:** only **#2 and #6** are genuine interview-AND-design craft. **#1** is a structure restatement.
**#3, #4, #5 are all memory/recording plumbing** — half the principle set describes the OUTPUT MACHINERY, not
the craft of the interview or the product. For a skill aspiring to startup-interview quality, the plumbing
principles crowd out craft.

**What the principle set is MISSING (interview/startup craft a customer-discovery expert would demand):**
- No **problem-before-solution / fall-in-love-with-the-problem** principle.
- No **riskiest-assumption-first** principle — the interview is mandatory-uniform over 44 branches
  (traverse rule: *"a first run covers all 11 Level-1 topics and every Level-2 branch. There is no quick or
  core tier."*) with **no** notion of testing the business-killing assumption first.
- No **seek-disconfirming-evidence / try-to-kill-the-idea** principle (falsification).
- No **say-vs-do** principle at principle altitude (it exists only as traverse rule 3, buried in topics.md).
- No **viability / can-this-be-a-business** principle.

**Constraint honored:** #3/#4/#5 sit on locked machinery, so I do **not** propose deleting the machinery.
The open question for the synthesis leader is whether that machinery earns a top-level **Principle** slot vs
demoting to **Rules** (freeing principle slots for craft). The principle set under-weights interview/startup
craft — that is the finding; the fix is the synthesis leader's.

---

## (f) Ordering critique through a customer-discovery lens

The **product-shape-first structure is locked** (T5–6 before T7–8; guardrails last) and holds up — product
before system is sound. The critique is **within-structure sub-ordering**, which (f) explicitly invites.

1. **Vision before problem (inside T2).** `topics.md` Topic 2 is *"Vision, Problem & Success"* and 2.1
   **Vision** is asked first (*"If the project succeeds, what is materially different..."*), then 2.2
   **Problem & root cause**. Customer-discovery orthodoxy (Blank, Christensen JTBD, the Mom Test) puts
   **problem before vision** — you earn the vision from the problem. Asking 2.1 first primes an aspirational
   answer before the problem is grounded. A discovery expert reorders within T2: **2.2 → 2.1 → 2.3** (problem
   leads).

2. **Success metrics (2.3) before the customer baseline (T3).** 2.3 asks *"What baseline and target can be
   measured, by whom, and by when?"* **before** T3 establishes who the user is and what they do today. You
   cannot set a success target before you know the customer's current baseline — which is exactly T3.3
   (*"What have they already spent..."*). Current order sets the **target before the baseline**. A discovery
   expert interleaves or moves customer + current-behavior (T3.1–3.3) ahead of success metrics (2.3).

3. **Demand evidence (3.3) is buried as branch 3.3 of 44.** For a startup, demand/willingness is the
   **riskiest** assumption; it is elicited well but **late**, after vision, problem, success, segments, and
   jobs. Risk-first discovery front-loads it.

4. **No riskiest-assumption-first override.** The traversal is strictly dependency-ordered and
   mandatory-uniform (*"no quick or core tier"*). A discovery expert wants a mechanism to surface the single
   business-killing assumption **early** (Ries leap-of-faith; YC "what most likely kills you") and then
   allocate depth to it — an ordering/traversal gap, not a structure change (could live as an early probe in
   T1/T2 that re-prioritizes depth).

**Net for (f):** the macro-order (product → system → guardrails) is sound and locked; the **problem-space
micro-order is inverted** from customer-discovery best practice (vision-before-problem, target-before-baseline,
demand-buried-late) and lacks a risk-first depth override. All fixes are within-structure.

---

## Top-of-file summary of the biggest gaps (for the synthesis leader)

1. **Evaluation is startup-substance-blind (a+b+g).** ~53% of 113 checks are memory mechanics; only ~2–4
   grade whether the startup answers are *good*. No scenario can FAIL a baseline for weak demand, no WTP, an
   incoherent business model, or no moat. The single substance guard (PROJ-01-CHECK-04) catches only one-word
   answers.
2. **Six of eight startup axes are absent or proxy-only (c):** WTP, PMF signal, business-model coherence,
   GTM/distribution, unit economics, moat. Demand evidence and substitutes are present; direct-competitor +
   positioning is missing.
3. **Half the Principles are memory plumbing, not craft (e):** only #2 (evidence) and #6 (user owns intent)
   are genuine interview-AND-design craft; #3/#4/#5 describe the record/promotion machinery. Missing:
   problem-first, riskiest-assumption-first, seek-disconfirming-evidence, say-vs-do, viability.
4. **Topics violate their own past-behavior rule in the forward-looking topics (d)** and bury WTP inside a
   six-way bundle in 3.1; the problem/demand/viability core is under-weighted (11 of 44 branches).
5. **Within-structure ordering is inverted from customer discovery (f):** vision-before-problem,
   target-before-baseline, demand-buried-late, no risk-first override.
6. **Cross-cutting fork (unresolved):** does a solo-user, open-source `startup` skill grade **commercial
   viability** at all, or only product/project design? This gates how much of (c)/(d)/(e) applies.

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-07-14 | 97d3ef5a-1b8a-4dab-b884-9f686e185b22 | The pre-rewrite adversarial baseline that framed the Ideation redesign (10 principles, 5 new families, problem-first reorder) |

## Related

- [[scope-narrowed-to-design-craft]] — the decision that resolved the cross-cutting commercial-viability
  fork this study raised
