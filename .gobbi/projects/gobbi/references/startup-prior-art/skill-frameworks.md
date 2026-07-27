---
name: skill-frameworks
description: AI-agent skill frameworks (gstack, superpowers) plus requirement-elicitation/product-shaping canon (Shape Up, JTBD, Working Backwards), mined against gobbi's existing startup skill.
type: references
scope: project
feature: null
status: active
created: 2026-07-14
session: 97d3ef5a-1b8a-4dab-b884-9f686e185b22
tags: []
keywords: [gstack, superpowers, shape-up, jtbd, working-backwards, anti-sycophancy, dual-system, prior-art]
author: claude
title: Skill Frameworks + Requirement-Elicitation / Product-Shaping Craft
source: garrytan/gstack + obra/superpowers-skills (repo-verified via gh api) + Shape Up / JTBD / Working Backwards canon — see body for per-claim source tags (as-is research cluster, not atomized per one-insight-per-file; kept whole per this session's user-approved promotion plan)
accessed: 2026-07-14
ref_type: code
---

# R4 — Skill Frameworks + Requirement-Elicitation / Product-Shaping Craft

Cluster: **AI-agent skill frameworks (gstack, superpowers) + the craft of eliciting requirements and shaping a product BEFORE system design.** One of five parallel research leaders. Purpose: (a) how comparable AI-skill frameworks structure a startup/product workflow; (b) the elicitation + product-shape craft that a good interview-then-design skill should encode.

Anchor: gobbi's current `startup` skill (SKILL.md + topics.md, read this session). It already carries much of this prior art — 11-topic dependency-ordered tree (problem → boundary → solution → guardrails), product-shape-before-system-shape, one-question-per-turn, evidence-strength tagging, a study→recommend→decide micro-loop for design-bearing branches, and Startup-specific lenses inside ordinary dual-system Ideation evaluation. Findings below are framed as **what the prior art confirms** and **where it sharpens** gobbi's existing skill, not a greenfield design.

Source legend: `[gstack:<path>]` = raw file read from `garrytan/gstack` (verified via `gh api` this session). `[sp:<path>]` = raw file from `obra/superpowers-skills`. `[canon:...]` = product/spec canon (Shape Up verified via WebFetch; JTBD + Amazon working-backwards are widely-documented book canon, NOT repo-verified this session — flagged).

---

## A. Skill-authoring / workflow craft

How a good interview+design skill is structured; elicitation patterns; presenting design in sections for user validation.

### A1 — The whole framework is a lifecycle of narrow, single-purpose skills, not one mega-skill
- **Source** — `[gstack:docs/skills.md]`; gstack's flow is **think → plan → build → review → ship → reflect**, with a distinct skill per stage (`/office-hours` reframes; `/spec` writes a backlog-ready spec; `/plan-ceo-review` pressure-tests scope; `/plan-eng-review` locks architecture; `/ship`; `/retro`+`/learn`). Superpowers mirrors this with separate `brainstorming` → `using-git-worktrees` → `writing-plans` → `executing-plans` skills `[sp:skills/collaboration/brainstorming/SKILL.md]`.
- **Insight** — Both frameworks split "figure out WHAT" (office-hours/brainstorming) from "decompose HOW" (spec/writing-plans) from "review" — the exact Ideation / Planning / Evaluation seam gobbi already uses. The interview-and-shape skill is deliberately a **design-doc producer that is forbidden from implementing** (`[gstack:office-hours/SKILL.md]` "HARD GATE: Do NOT invoke any implementation skill... Your only output is a design document"; `[sp:.../brainstorming]` "before writing code").
- **Why** — Validates gobbi's `startup` boundary "NEVER design detailed mechanism... mechanism belongs to Ideation/Planning/Execution." The prior art is unanimous: the elicit-and-shape stage must hard-gate against implementation.

### A2 — One question per turn, STOP and wait, smart-skip what's already answered
- **Source** — `[gstack:office-hours/SKILL.md]` "Ask these questions ONE AT A TIME via AskUserQuestion... STOP after each question. Wait for the response before asking the next"; "Smart-skip: if the user's answers to earlier questions already cover a later question, skip it." `[sp:.../brainstorming]` "Ask ONE question at a time... Prefer multiple choice when possible."
- **Insight** — Identical to gobbi's `topics.md` "one question per turn" + evidence-led smart-skip. Superpowers adds **"prefer multiple choice when possible"** — a cheaper answer surface than open prose, which pairs with gobbi's Question Template.
- **Why** — Confirms gobbi's traversal rule; the multiple-choice preference is a low-cost refinement to the Question Template usage.

### A3 — Present the design in small SECTIONS and validate each before moving on (the pattern the user named)
- **Source** — `[sp:skills/collaboration/brainstorming/SKILL.md]` Phase 3: "Present in 200-300 word sections. Cover: Architecture, components, data flow, error handling, testing. **Ask after each section: 'Does this look right so far?'**" Phase 2 first: "Propose 2-3 different approaches... Ask which approach resonates."
- **Insight** — This is finer-grained than gobbi's per-Level-1-topic checkpoint. Superpowers validates the *synthesized design* in ~250-word chunks, not just the captured answers. It also explicitly allows **going backward**: "You can and should go backward when partner reveals a new constraint / validation shows a gap / partner questions the approach... Don't force forward linearly."
- **Why** — gobbi's Level-1 checkpoints validate *answers*; the section-by-section pattern validates the *design synthesis* incrementally, catching a wrong synthesis before the whole baseline is drafted. The explicit backward-transition rule maps to gobbi's "re-open an earlier branch on contradiction" but generalizes it to any new constraint.

### A4 — Elicitation is a diagnosis, and the posture is anti-sycophantic by rule
- **Source** — `[gstack:office-hours/SKILL.md]` § Anti-Sycophancy Rules names *forbidden phrases* ("That's an interesting approach", "There are many ways to think about this", "You might want to consider...", "That could work") and mandates: **"Take a position on every answer. State your position AND what evidence would change it."** § Response Posture: "Be direct to the point of discomfort. Comfort means you haven't pushed hard enough." "Push once, then push again — the first answer is usually the polished version; the real answer comes after the second or third push."
- **Insight** — gobbi's `discussion` "push-once-then-push-again" rule exists, but gobbi has no explicit **forbidden-phrase list** and no "take a position + name the evidence that flips it" mandate in the startup posture. gstack encodes false-neutrality as a failure ("'all options are valid' is a failure" — echoed in gobbi's own micro-loop, but only for design options, not for interview answers).
- **Why** — Gobbi Principle 4 already says "take a position and recommend... false neutrality is not refinement." gstack shows how to operationalize that *inside the interview* with a concrete anti-sycophancy contract — the single highest-value sharpening for gobbi's startup posture.

### A5 — Worked pushback exemplars (before/after) teach the posture better than a rule
- **Source** — `[gstack:office-hours/SKILL.md]` § Pushback Patterns: five vague→specific worked pairs, e.g. Vague market → "There are 10,000 AI developer tools. What specific task does a specific developer waste 2+ hours/week on... Name the person." Social proof → "Loving an idea is free. Has anyone offered to pay? Has anyone gotten angry when your prototype broke?" Undefined terms → "'Seamless' is not a product feature — it's a feeling. What specific step causes drop-off? What's the rate?" Each is labeled BAD (soft) vs GOOD (forcing).
- **Insight** — gobbi's `topics.md` has excellent *questions* but few worked *pushback* exemplars showing the model how to escalate a vague answer. gstack's FORCING vs SOFTENED exemplars (also in the Q3 "Desperate Specificity" forcing block) are a reusable teaching device.
- **Why** — A rule ("probe vague answers") under-specifies the escalation; the exemplar pins the target register. Directly reusable in gobbi's `topics.md` design-bearing branches.

### A6 — Independence at both creation and review (dual-system is prior art, not gobbi-only)
- **Source** — `[gstack:office-hours/SKILL.md]` Phase 3.5 "Cross-Model Second Opinion": runs Codex (`codex exec ... -s read-only`) on a structured summary *without the conversation* for genuine independence, then a Claude cross-model synthesis (agree/disagree/premise-revision). `[gstack:office-hours/sections/design-and-handoff.md]` § Spec Review Loop: dispatch an **independent reviewer subagent with fresh context that cannot see the brainstorming conversation**, review on 5 dimensions, fix, re-dispatch, max 3 iterations, convergence guard. Same loop in `[gstack:plan-ceo-review/SKILL.md]`; the `spec` skill runs a codex quality-score gate at Phase 4.5 `[gstack:spec/SKILL.md]`.
- **Insight** — gobbi's mandatory dual-system Ideation evaluation is the same idea, but gobbi makes it **non-skippable** whereas gstack treats the review as a "quality bonus, not a gate" (skips if the reviewer is unavailable). gobbi's stance is stronger. gstack's contribution is the **5-dimension review rubric** (Completeness / Consistency / Clarity / Scope / Feasibility) and the **convergence guard** ("if the reviewer returns the same issues on consecutive iterations, stop and persist as 'Reviewer Concerns'").
- **Why** — Confirms gobbi's dual-system gate as best practice; the 5-dim rubric + convergence guard are candidate refinements for the startup `evaluation.md`/`checklists.md` bundle, and the "review can't see the conversation" independence rule matches gobbi's evaluator separation.

### A7 — The interview produces a durable design doc whose sections map 1:1 to the interview answers
- **Source** — `[gstack:office-hours/sections/design-and-handoff.md]` Startup-mode design-doc template: Problem Statement / Demand Evidence (Q1) / Status Quo (Q2) / Target User & Narrowest Wedge (Q3+Q4) / Constraints / Premises (Phase 3) / Cross-Model Perspective / Approaches Considered / Recommended Approach / Open Questions / Success Criteria / Distribution Plan / Dependencies / The Assignment / "What I noticed about how you think."
- **Insight** — gstack writes one design doc per feature; gobbi's read-only Startup operation returns a structured evidence packet to ordinary Ideation, whose RECORD stage may later derive atomic typed candidates. The template's discipline—every section traces to evidence and stands alone for a reader who never saw the talk—still applies. gstack also carries a `Supersedes:` field creating a revision chain (gobbi does this only during later memory promotion).
- **Why** — Reinforces evidence→claim traceability and the need for a self-contained Ideation artifact without giving Startup a separate writer.

---

## B. Design craft truths

Problem-before-solution, product-shape-before-system-shape, references+alignment, reversible-first, scope-as-contract, working-backwards.

### B1 — Problem before solution, enforced as an explicit premise gate
- **Source** — `[gstack:office-hours/SKILL.md]` Phase 3 "Premise Challenge": "Before proposing solutions, challenge the premises: Is this the right problem? What happens if we do nothing — real pain or hypothetical? What existing code already partially solves this?" Output premises as agree/disagree statements the user MUST confirm before Phase 4. `[gstack:plan-ceo-review/SKILL.md]` Step 0A same three premise questions. `[canon: Amazon Working Backwards, Bryar & Carr 2021]` writes the PR/FAQ (press release + FAQ, from the customer's POV) BEFORE building — the discipline that forces the problem and customer value to be legible before any solution.
- **Insight** — gobbi walks problem→boundary→solution by tree order and finishes with a contradiction and viability challenge. An **explicit mid-conversation premise gate** ("here are the premises I now hold—agree/disagree?") before crossing from problem space into solution space makes the boundary fail-able.
- **Why** — A premise gate at the Group-II→Group-III boundary (before Topic 5 features) catches a wrong framing before product-shape work begins.

### B2 — Product shape before system shape ("right level of abstraction": solved, rough, bounded)
- **Source** — `[canon: Basecamp Shape Up, ch. 2, verified]` shape work "at the right level of abstraction: not too vague and not too concrete." Shaped work is **Rough** (low fidelity, room for the team's expertise), **Solved** ("all the main elements of the solution are there at the macro level and they connect together"), and **Bounded** (a fixed **appetite** — the time the team is allowed to spend). Tools: breadboarding + fat-marker sketches.
- **Insight** — This is the precise definition of gobbi's startup boundary: "sets the reference-informed DIRECTION... does NOT design mechanism (interface signatures, module internals, algorithms, schemas, task breakdown)." Shape Up gives the vocabulary: startup output should be *solved at the macro level and rough at the detail level*. gobbi's `topics.md` already orders "product shape (Topics 5-6) before system shape (Topics 7-8). Do not use an architecture or stack choice to narrow Topics 2-5 after the fact."
- **Why** — Shape Up is the canonical name for what gobbi's DIRECTION-not-mechanism boundary is doing; "rough + solved + bounded" is a crisp quality bar for judging whether a startup baseline is at the right altitude.

### B3 — Design from references, then decide WITH the user (never hand a finished design)
- **Source** — `[gstack:ETHOS.md]` § Search Before Building: **Layer 1** (tried-and-true — don't reinvent), **Layer 2** (new-and-popular — scrutinize), **Layer 3** (first-principles — prize above all); the prized outcome of research is "a clear reason why the conventional approach is wrong" (the "11 out of 10"). `[gstack:office-hours/SKILL.md]` Phase 2.75 runs this as a three-layer synthesis + a logged "EUREKA" when Layer-3 reasoning contradicts convention. `[gstack:plan-ceo-review]` § 0C-bis + office-hours Phase 4 make **alternatives MANDATORY**: 2-3 approaches, "one must be minimal-viable, one must be ideal-architecture," each with effort (S/M/L/XL) + risk + reuse, plus a RECOMMENDATION and a hard STOP for user approval.
- **Insight** — gobbi's study→recommend→decide micro-loop already presents 2-3 reference-backed options with a recommendation + evidence-to-change. gstack sharpens three things: (i) the **three-layer search discipline** (tried-true / new-popular / first-principles) as the structure of the prior-art study; (ii) the **"one minimal + one ideal, equal weight"** rule so the model doesn't default to the small option; (iii) effort/risk/reuse labels on every option. Both frameworks and gobbi agree the STOP-for-user-decision after options is non-negotiable.
- **Why** — Directly maps onto gobbi Principle 3 ("design with the user, based on references") and Startup's study/recommend/resolve step; the three-layer structure and minimal-vs-ideal equal-weight rule sharpen the evidence operation.

### B4 — Reversible-first: classify by reversibility × magnitude; move fast on two-way doors
- **Source** — `[gstack:plan-ceo-review/SKILL.md]` Cognitive Patterns #1 "Classification instinct — categorize every decision by reversibility × magnitude (Bezos one-way/two-way doors). Most things are two-way doors; move fast"; #6 "Only slow down for irreversible + high-magnitude decisions. 70% information is enough to decide." `[canon: Shape Up]` **appetite** (a fixed, reversible time-bet) instead of an estimate encodes the same reversible-first stance.
- **Insight** — gobbi `topics.md` Topic 4.4 already asks "Which scope choices are reversible, and which create an expensive commitment?" gstack elevates this to a *pervasive cognitive move* applied to every architecture/scope call, not just one branch — and pairs it with a speed rule (fast by default; slow only for one-way + high-magnitude).
- **Why** — Reinforces gobbi's reversibility branch; the "two-way door → move fast, don't over-interview" heuristic is a useful counterweight to over-probing, and pairs with gobbi's "probe up to twice then record-open."

### B5 — Scope is the user's explicit, committed contract — opt-in per item, no silent drift
- **Source** — `[gstack:plan-ceo-review/SKILL.md]` "In ALL modes, the user is 100% in control. Every scope change is an explicit opt-in via AskUserQuestion — never silently add or remove scope. Once the user selects a mode, COMMIT to it. Do not silently drift." Four scope postures: EXPANSION / SELECTIVE EXPANSION / HOLD SCOPE / REDUCTION, each with a per-item opt-in ceremony (A) add to scope / B) defer / C) skip). `[gstack:spec/SKILL.md]` Phase 2 "What is explicitly out of scope? Lock this early — it prevents creep later. Do NOT proceed until scope is locked."
- **Insight** — Exactly gobbi Principle 5 ("Scope is a contract"). gstack contributes (i) the explicit **"lock out-of-scope early, before solution work"** step (spec Phase 2) and (ii) the **per-item opt-in ceremony** so an expansion is never bundled — each is its own decision the user accepts or rejects, and rejected items are written to a "NOT in scope" section (not dropped silently). gobbi's Topic 4 (Scope, Boundaries & Non-goals) covers this; the "record every rejected item as an explicit non-goal" discipline is a sharpening.
- **Why** — Confirms gobbi's scope-contract principle; the "lock non-goals before solution space" ordering and the explicit rejected-items record strengthen gobbi's Topic 4 → Topic 5 gate.

### B6 — Working-backwards + JTBD: interview for the job/struggle/switch, describe the finished outcome first
- **Source** — `[canon: Jobs-to-be-Done — Christensen "Competing Against Luck" 2016; Bob Moesta/Chris Spiek switch interview]` interview for the *progress the user is trying to make* (the "job"), the *struggling moment*, and the *switch* from the old way; the **Four Forces** of a switch: **push** of the situation + **pull** of the new solution (drive change) vs **anxiety** of the new + **habit/allegiance** to the present (block change). `[canon: Amazon Working Backwards]` write the customer-facing outcome (PR/FAQ) first. NOT repo-verified this session — cite the primary sources.
- **Insight** — gobbi already has strong JTBD lineage: `topics.md` Topic 3.2 asks "What progress (not feature) is the user trying to make?" and uses the job-story form "When [situation], I want [motivation], so I can [outcome]"; Topic 2.1 asks the working-backwards question "If the project succeeds, what is materially different for its users?" The gap: gobbi captures push+pull (demand, alternatives, value) but under-weights the **blocking forces (anxiety of the new, habit of the old)** — the JTBD forces that explain why a real demand still fails to convert.
- **Why** — The Four Forces give a diagnostic for Topic 3.3/3.4 (alternatives + value): a switch fails not only for weak pull but for strong anxiety/habit — worth an explicit probe. Working-backwards validates gobbi's vision-first Topic 2.

---

## C. What gstack / superpowers judge as GOOD (their quality bars)

### C1 — For a PROBLEM: evidenced by behavior, named human, narrowest wedge, at least one chosen alternative
- **Source** — `[gstack:office-hours/SKILL.md]` § Operating Principles + the Q-bar: "**Specificity is the only currency**" (a name, a role, a company — "you can't email a category"); "**Interest is not demand** — behavior counts, money counts, panic-when-it-breaks counts" (a customer calling when the service is down 20 min = demand); "**The user's words beat the founder's pitch**"; "**Watch, don't demo**" (sit behind a user and bite your tongue); "**The status quo is your real competitor**" (the spreadsheet-and-Slack workaround; if "nothing" is the current solution the problem probably isn't painful enough); "**Narrow beats wide**." The design doc ships only when demand is behavior-evidenced, the actual user is named with a consequence, the narrowest wedge is articulated, and ≥1 alternative exists and was picked.
- **Insight** — gobbi `topics.md` already encodes most of this: Topic 3.3 "What observed behavior shows demand", Topic 3 "Prefer past-behavior and repository evidence over opinion or hypothetical, and never lead the answer — ask what actually happened, not what the user supposes." The gstack sharpening is the **evidence-strength ladder made explicit in the questions** ("not 'interested', not a waitlist — genuinely upset if it disappeared") and the "status quo IS the competitor" framing.
- **Why** — gobbi's `evaluation.md`/`checklists.md` Startup extension can adopt these as explicit checks for the problem/users/value topics inside ordinary Ideation evaluation.

### C2 — For a SPEC/design: concrete, executable, testable — no generic language
- **Source** — `[gstack:spec/SKILL.md]` Issue Quality Standards: "Name files, functions, line numbers, commands, outputs, evals, and real numbers"; **Phase 3 HARD requirement — read the code first**: "Before asking ANY Phase 3 question you MUST read at least one piece of evidence from the codebase... Do NOT ask 'what file should I look at?' — find it yourself" (this is the "magical moment": the user sees you grounded in their actual code). **Testable Acceptance Criteria**: "Numbered. Pass/fail. No subjective language" — GOOD: "Orders older than 30 days return HTTP 410 for all 4 user roles"; BAD: "The feature works correctly." `[gstack:office-hours/sections/design-and-handoff.md]` § Spec Review Loop 5 dims: Completeness / Consistency / Clarity ("could an engineer implement this without asking questions?") / Scope (YAGNI) / Feasibility.
- **Insight** — gobbi's Startup deliberately stops at DIRECTION (no mechanism), so the *spec-level* concreteness bar applies to Ideation/Planning, not Startup. But **"read the repo first, show the verified fact, then ask"** is Startup doctrine (`topics.md`: show verified facts first; the classifier separates verified facts from claims). gstack's contribution is naming it the *magical moment* and making it a hard gate before a code-touching question.
- **Why** — Validates gobbi's evidence-before-assertion principle and the "show the verified fact first" traversal rule; the pass/fail-no-subjective-language bar is reusable for gobbi's success-criteria topic (2.3) and any measurable-threshold quality-bar topic (9.2).

### C3 — For DESIGN synthesis: rough + solved + bounded; YAGNI; explore 2-3 alternatives before settling
- **Source** — `[sp:skills/collaboration/brainstorming/SKILL.md]` "Apply YAGNI ruthlessly. Explore 2-3 alternatives before settling. Present incrementally, validate as you go." `[gstack:plan-ceo-review/SKILL.md]` Engineering Preferences: "engineered enough — not under-engineered (fragile/hacky) and not over-engineered (premature abstraction)."
- **Insight** — The universal bar across all three frameworks: never settle on the first approach; explore a small option set; validate incrementally; keep the design at the "solved-but-rough" altitude. gobbi's micro-loop (2-3 options + recommendation) already meets this.
- **Why** — Confirms gobbi's option-set discipline; "engineered enough" (neither under nor over) is a useful quality phrase for gobbi's conventions/quality topics.

### C4 — DIVERGENCE to flag (not a recommendation): gstack "boil the ocean" vs gobbi scope-contract
- **Source** — `[gstack:ETHOS.md]` / `[gstack:office-hours]` § Completeness Principle: "AI makes completeness cheap, so the complete thing is the goal... the only thing out of scope is genuinely unrelated work"; plan-ceo "COMPLETENESS IS CHEAP... always prefer the fuller approach... 'ship the shortcut' is legacy thinking."
- **Insight** — This pushes scope *UP* by default. gobbi's Principle 5 (scope is a bounded contract) + Principle 10 (finish in-scope, don't defer) are more conservative: complete the *agreed* scope, do not expand it without a user decision. These are not contradictory (both finish the agreed thing completely) but the *default posture* differs — gstack defaults to ambition, gobbi defaults to the locked contract.
- **Why** — Flag for the synthesis leader: adopt gstack's "finish completely, no shortcuts" energy INSIDE gobbi's locked scope, but do NOT import "boil the ocean / push scope up by default" — it conflicts with gobbi's scope-contract-first, solo-user, engineering-merit stance. gobbi's EXPANSION-style ambition, if wanted, belongs as an explicit user-opt-in ceremony (B5), not a default.

---

## D. Load-bearing truths (with a why each)

1. **The interview-and-shape stage is a design-doc producer that is hard-gated from implementation.** — All three frameworks forbid code/mechanism at this stage; the deliverable is a shaped direction. (Validates gobbi startup's "NEVER design detailed mechanism" boundary.) `[gstack:office-hours HARD GATE]` `[sp:brainstorming]`
2. **Problem before solution must be an explicit gate, not an implicit ordering.** — gstack confirms premises with the user (agree/disagree) *before* crossing into solution space; a wrong framing caught here is far cheaper than in a late contradiction pass. `[gstack:office-hours Phase 3]`
3. **Product shape ("solved + rough + bounded") comes before system shape.** — Shape Up's canonical altitude is exactly gobbi's DIRECTION-not-mechanism boundary; the baseline should be solved at the macro level and rough at the detail level, with a bounded appetite. `[canon: Shape Up ch.2]`
4. **The posture is anti-sycophantic by contract: take a position on every answer and name the evidence that would flip it.** — False neutrality is a failure; comfort signals insufficient probing. This is the single biggest gap between gobbi's current (correct but mild) posture and the prior art. `[gstack:office-hours Anti-Sycophancy]`
5. **Push twice, then move on.** — First answer is the polished version; the real answer comes after the second push; but do not push indefinitely. Matches gobbi's push-once-then-again + record-open-after-two. `[gstack:office-hours Response Posture]` `[gobbi:topics.md]`
6. **Interest ≠ demand; evidence is behavior, money, or panic-when-it-breaks; the status quo workaround is the real competitor.** — The problem's reality bar is behavioral, not attitudinal. `[gstack:office-hours Operating Principles]`
7. **Watch real behavior; ask what actually happened, never what the user supposes.** — "Watch, don't demo"; surveys and demos lie. Already gobbi doctrine ("prefer past-behavior... never lead the answer"). `[gstack:office-hours]` `[gobbi:topics.md]`
8. **Design from references across three layers (tried-true / new-popular / first-principles); the prized output is a clear reason the conventional approach is wrong.** — Grounds recommendations in prior art and produces genuine insight, not a copy. Extends gobbi's "study prior art" step with structure. `[gstack:ETHOS.md]`
9. **Alternatives are mandatory: ≥2 options, one minimal + one ideal at equal weight, each with effort/risk/reuse, then STOP for the user's decision.** — Prevents both single-option tunnel vision and a default-to-small bias. Matches and sharpens gobbi's micro-loop. `[gstack:plan-ceo-review 0C-bis]` `[gstack:office-hours Phase 4]`
10. **Reversibility × magnitude governs how hard to interrogate: fast on two-way doors, slow only on irreversible + high-magnitude.** — A speed heuristic that bounds over-probing. `[gstack:plan-ceo-review Cognitive Patterns]`
11. **Scope is a per-item, explicitly-opted-in contract; lock non-goals early and record every rejected item as a non-goal — never silent drift.** — gobbi Principle 5, operationalized with a per-item ceremony and an early out-of-scope lock. `[gstack:plan-ceo-review]` `[gstack:spec Phase 2]`
12. **Independence at review: the reviewer cannot see the elicitation conversation; review on a fixed rubric (Completeness/Consistency/Clarity/Scope/Feasibility) with a convergence guard.** — gobbi's ordinary dual-system Ideation evaluation is the same idea; the rubric + convergence guard are reusable, and gobbi's non-skippable stance is stronger than gstack's "bonus, not a gate." `[gstack:office-hours Spec Review Loop]`
13. **The synthesis must stand alone for a reader who never saw the talk; every section traces to specific evidence.** — gstack's design-doc-with-section-per-answer discipline maps to gobbi's structured Startup packet and ordinary Ideation artifact. `[gstack:design-and-handoff]` `[gobbi:startup SKILL.md]`
14. **Every session ends with one concrete next action.** — office-hours mandates "The Assignment" (a real-world action, not "go build it"); gobbi ends with open questions carrying an owner + resolution method + rerun triggers — the same closure discipline. `[gstack:office-hours Important Rules]`
15. **AI recommends, the user decides — this rule overrides all others; expertise increases oversight, not autonomy.** — `[gstack:ETHOS.md]` "AI models recommend. Users decide." = gobbi's "user owns product intent." `[gstack:ETHOS.md]` `[gobbi:startup Principles]`

---

## E. Directly reusable patterns / questions

Concrete, liftable into gobbi's `startup` skill (esp. `topics.md`, SKILL.md § Principles/Rules, and the eval bundle). Each maps to an existing gobbi surface.

- **Anti-sycophancy contract** (→ startup Principles / discussion posture): a short forbidden-phrase list ("that's interesting", "there are many ways", "that could work", "you might consider") + the mandate "take a position on every answer AND state what evidence would change it." `[gstack:office-hours]`
- **Worked pushback exemplars** (→ topics.md design-bearing branches): pair each vague-answer class with a BAD (soft) / GOOD (forcing) exemplar — vague market → "name the person / the 2-hr/week task"; social proof → "has anyone paid / gotten angry when it broke?"; undefined term → "'seamless' is a feeling, not a feature — which step drops off, at what rate?" `[gstack:office-hours Pushback Patterns]`
- **Evidence ladder for demand** (→ Topic 3.3): "not 'interested', not a waitlist — would they be genuinely upset if it disappeared tomorrow? Has anyone paid? Panicked when it broke?" `[gstack:office-hours Q1]`
- **Status-quo-as-competitor probe** (→ Topic 3.3 alternatives): "What are users doing right now to solve this — even badly? What does that workaround cost? If the answer is 'nothing,' the problem may not be painful enough." `[gstack:office-hours Q2]`
- **Narrowest-wedge question** (→ Topic 5.1 smallest useful foundation): "What's the smallest version someone would pay for / get real value from this week, not after the platform? What if they had to do nothing at all to get value?" `[gstack:office-hours Q4]`
- **JTBD Four Forces probe** (→ Topic 3.3/3.4): beyond push (situation) + pull (new value), ask the blockers — "what anxiety about switching, and what habit/allegiance to the current way, would stop a user who genuinely has this problem?" `[canon: JTBD forces]`
- **Explicit premise gate** (→ new checkpoint at the Phase-II→Phase-III boundary, before Topic 5): "Here are the premises I now hold: 1)… 2)… 3)… — agree or disagree with each before we shape the solution." `[gstack:office-hours Phase 3]`
- **Three-layer prior-art study** (→ Startup study/recommend/resolve step): Layer 1 tried-true (don't reinvent) / Layer 2 new-popular (scrutinize) / Layer 3 first-principles (prize); note when Layer 3 contradicts convention. `[gstack:ETHOS.md]` `[gstack:office-hours prior-art stage]`
- **Alternatives rule** (→ Startup recommendation): "≥2 options; one MUST be minimal-viable, one MUST be ideal-architecture, at equal weight; label each with effort (S/M/L/XL) + risk + what it reuses; recommend one; STOP for the user's decision." `[gstack:plan-ceo-review 0C-bis]`
- **Design-in-sections validation** (→ finer-grained than Level-1 checkpoints): present each synthesized area in ~250-word sections and ask "Does this look right so far?"; go backward freely when a new constraint surfaces. `[sp:brainstorming Phase 3]`
- **5-dimension review rubric + convergence guard** (→ startup `evaluation.md`/`checklists.md`): Completeness / Consistency / Clarity ("implementable without asking?") / Scope (YAGNI) / Feasibility; if the reviewer repeats the same issue across iterations, stop and persist it as a "Reviewer Concern." `[gstack:design-and-handoff Spec Review Loop]`
- **Testable success-criteria bar** (→ Topic 2.3 success/failure, Topic 9.2 quality thresholds): "numbered, pass/fail, no subjective language" — GOOD "return HTTP 410 for all 4 roles" / BAD "works correctly." `[gstack:spec Testable Acceptance Criteria]`
- **"The Assignment" closure** (→ Startup input handoff): end with one concrete Ideation start point, each open question owning a resolution method. `[gstack:office-hours]`

---

## Gaps / unverified / flags for the synthesis leader

- **JTBD Four Forces + switch interview, and Amazon Working-Backwards PR/FAQ, are book canon cited from the literature — NOT repo-verified this session.** They are extremely well-documented (Christensen/Moesta; Bryar & Carr). Cite the primary sources if used; do not attribute to a repo file.
- **Shape Up is verified** for ch.2 (shaping / rough-solved-bounded / appetite / breadboarding) via WebFetch; the betting-table + cool-down details were not re-fetched (well-known canon).
- **gstack `spec` skill** — I captured its 5-phase flow (Understand-the-Why / Scope-and-Boundaries / Technical-Interrogation-read-code-first / Draft-Review / Quality-Gate + file-issue), its 14 quality standards, and its acceptance-criteria bar. I did NOT deep-read its redaction/dispatch tail (irrelevant to gobbi startup).
- **DIVERGENCE (C4):** gstack's default is "boil the ocean / push scope up." gobbi is scope-contract-first + solo-user + engineering-merit. Import gstack's "finish completely, no shortcuts" energy INSIDE the locked scope; do NOT import "expand scope by default." Any ambition belongs in an explicit user opt-in ceremony (B5), not a default posture. This is the one place the prior art should be adopted *selectively*, not wholesale.
- **Most of gobbi's `startup` skill already embodies this prior art** (dependency order, product-before-system, one-question-per-turn, evidence-first, study→recommend→decide, and Startup lenses inside ordinary dual-system evaluation). The highest-value *new* inputs are: (D4) the anti-sycophancy contract, (A5) worked pushback exemplars, (B1) an explicit premise gate before solution space, (B3/E) the three-layer prior-art study structure, and (B6) the JTBD blocking-forces probe. These are refinements to an already-strong skill, not a redesign.
- **Runtime coupling caveat:** gstack's skills are heavily runtime-coupled (bash preambles, telemetry, gbrain, AskUserQuestion host-resolution) — that machinery is gstack-specific plumbing, NOT design craft. Extract the *elicitation and shaping logic* only; ignore the operational scaffolding.

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-07-14 | 97d3ef5a-1b8a-4dab-b884-9f686e185b22 | Ideation prior-art base for the `startup` skill rewrite: the anti-sycophancy contract, worked pushback exemplars, the premise gate, and the three-layer prior-art study structure all shipped into `SKILL.md` / `topics.md` |

## Related

- [[scope-narrowed-to-design-craft]] — the decision this cluster's C4 divergence flag helped frame (gobbi's scope-contract-first stance vs gstack's completeness-is-cheap default)
