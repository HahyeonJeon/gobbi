---
name: eval-a-ideation-i1-report
description: Fresh Claude evaluation of the react skill's Ideation iteration-1 design synthesis — REVISE, 3 High findings (F1-F3) plus a freeze-discipline addendum.
type: reviews
scope: project
feature: null
status: active
created: 2026-07-25
session: bae334bf-c3df-4155-bbd0-92d5a36f3feb
tags: [evaluation, docs-sync, verification]
keywords: [react-skill, ideation-evaluation, seven-perspectives, rule-source-narrowing, freeze-discipline]
author: claude
review_kind: adversarial-review
subject: 1-ideation/working/iteration-1/synthesis.md
verdict: revise
---

# Claude Evaluation Report — Ideation iteration 1, the `react` project skill

- **Assignment:** `EVAL-A-ideation-i1`
- **System:** claude · **Step:** ideation · **Iteration:** 1
- **Subject:** `1-ideation/working/iteration-1/synthesis.md`
- **Subject sha256:** `5775426dfb3571f1315f96da75aedddb6c3b2277d474c578b55e2ba2f3e93e8b`
- **Subject md5 / bytes / lines:** `9af5a271d002261b3b2d19dfe20b6e3e` · 98,665 · 1,243 — the
  manager-declared authoritative version. Verified: this report was formed against these exact bytes
  (§ Addendum A).
- **Supporting (frozen):** `open-decisions.md` (`2253b3c0…`), `drafts/claude.md`, `research/*.md` (5 reports)
- **VERDICT: REVISE**

## Independence statement

Fresh evaluator. Did not author, review, or contribute to the subject or any supporting artifact. Received
no peer evaluator output and sought none. No conflict to disclose. One capability limit is stated in
§ Limitations.

## Verdict derivation

Per `evaluation/SKILL.md` § Rules and the thresholds enforced by
`skills/evaluation/scripts/validate-evaluation-report.sh` (`FINDING_VERDICT_FILTER`):

- any `open`/`disputed` finding with `severity: Critical` and `confidence >= 75` → FAIL
- else any with `severity: High` and `confidence >= 50` → REVISE
- else PASS

Ledger: 0 Critical · 3 High (F1, F2, F3 — all confidence 100) · 5 Medium · 4 Low.
No Critical ⇒ not FAIL. Three High at confidence 100 ⇒ **REVISE**.

Findings F11–F12 were added after a mid-evaluation bundle re-freeze; see § Addendum. They do not
change the verdict, which was already REVISE on F1–F3.

Perspective roll-up: Project REVISE · Structure PASS · Performance PASS · Aesthetics PASS ·
Usage PASS · Consistency REVISE · Risk PASS · Overall PASS. Pessimistic aggregation ⇒ **REVISE**.

---

## Project

**VERDICT: REVISE**

The problem frame is strong and correctly root-caused. §1.2 identifies a *structural* cause (Gobbi's quality
model is skill-mediated and React has no mediator) rather than the surface symptom (React is undocumented),
and §1.1 evidences the divergence with five dated, checkable facts. The do-nothing case is implicitly
answered by that framing. Scope (§2) is enumerated in/out/deferred with a named destination or an explicit
drop for every deferred item, and §2.2 item 6 correctly records React Native as an exclusion rather than
deferred work. The change-set boundary (§2.5) survived an independent adversarial sweep (see Consistency).

Two evidence-integrity defects block acceptance.

### Findings

**F2 — The artifact's own rule table contradicts its stated success signal and obligation O-3.**

- Type: `design_flaw` · Domain: `process` · Disposition: `open` · Confidence: 100 · Severity: **High**
- Expected: §1.5's success signal — "Every rule resolves to a primary source in References; **no rule rests
  on an unverified claim**" — and O-3 — "Every `H{n}` resolves to a primary source named in References |
  For each rule, follow its References entry and confirm the source states it" — hold across the rule set.
- Observed: the artifact's own §5.4 table breaks both for two of sixteen rules.
  - `H13` (`synthesis.md:504`) Source column reads: *"Ecosystem consensus (UNVERIFIED class — stated as
    convention, not a React-team position)"*. This is a `### Must-Not-Follow` rule in `SKILL.md` whose
    declared evidence is explicitly UNVERIFIED.
  - `H8` (`synthesis.md:494`) Source column reads: *"In-scope decision (§8, D9); primary sources to be cited
    by Execution"* — no source exists at Ideation.
- Root cause: §1.5 and O-3 were written against assumption **A4** ("react.dev is the single primary authority
  for React's own semantics"), but A4's own row (`synthesis.md:1001`) records its disconfirming signal as
  **already fired**: *"A needed rule has no react.dev page — already true for testing, project structure, and
  virtualization."* The disconfirmation was recorded and then not propagated up to the success signal or the
  obligation that depends on it — `ideation/SKILL.md` Must-Not-Follow: *"NEVER lock a dependent detail while
  its parent decision is unresolved or disproven."*
- Alternative tested: that O-3 is satisfiable because §3.5's evidence-class discipline (O-13) covers H13.
  Rejected — O-13 requires a claim to *name its evidence class*; O-3 independently requires a *primary
  source*. Both are listed as separate, unconditional obligations; O-13 does not relax O-3, and §1.5's "no
  rule rests on an unverified claim" admits no evidence-class exception.
- Why it matters: Execution must run O-3 as a binary check against a rule set that, by the artifact's own
  table, cannot pass it. The available outs are all recorded project traps — softening the check
  (`acceptance-gate-and-conjunct-escape-hatch`, `verifies-must-be-self-failing`) or silently reclassifying
  H13. A check that its author already knows must fail is not a gate.
- Suggested direction: reconcile the three statements — either scope §1.5/O-3 to "every rule names its
  evidence class, and every rule claiming React-team authority resolves to a primary source", or change
  H13/H8's status. The manager and user own which.

**F3 — Internal-anatomy claims sit outside the evidence register that §0 promises covers every load-bearing
claim, and three of them are false.**

- Type: `assumption_risk` · Domain: `process` · Disposition: `open` · Confidence: 100 · Severity: **High**
- Expected: §0 states — *"**Provenance of the facts.** Every load-bearing claim carries a VERIFIED or
  UNVERIFIED marker in §3."*
- Observed: §3's register covers only **external-domain** facts (React core, RSC/lint, Electron, ecosystem).
  Every **internal-anatomy** claim — peer file shapes, peer principle/rule conventions, registration line
  numbers, mirror topology, sync-script and guard behaviour — is asserted inline in §4/§5/§6/§10 with no §3
  entry and no marker, while several carry the word "verified" in prose. I re-derived all of them. The
  wiring claims (§10) are exemplary and all hold (see Consistency must-preserve). Three peer-anatomy claims
  do not:

  | Claim | Location | Independent result |
  |---|---|---|
  | "Verified pattern from both peers: … each Principle is framed as a delta from a **named `coding` principle number**" | §4.1 (`synthesis.md:350-353`) | **False.** `typescript/SKILL.md` Principles: **0** numbered `coding` citations — all seven reference the parent by paraphrase ("The parent says study first…"). `python/SKILL.md`: exactly **one** ("coding Principle 17", `python/SKILL.md:60`). §4.1 then asserts "`react` follows all four." |
  | "House shape for every child (**verified pattern from both peers**): an **Ownership** paragraph…" | §6 (`synthesis.md:571-574`) | **False for python.** `**Ownership**` bold lead: typescript 8/8, python **0/8**. |
  | "…a **Split criterion** line citing the skill-writing clause that earns the split…" | §6 (`synthesis.md:571-574`) | **False for python.** `Split criterion`: typescript 8/8, python **0/8**. |

  Full matrix (16 peer children, four claimed elements): no element is present in all sixteen; `## Contents`
  is 7/8 in typescript (`runtime-deltas.md` lacks it); "deepens, and does not restate" is 6/8 in python
  (`concurrency.md`, `performance.md` lack it).
- Root cause: the evidence discipline was applied asymmetrically — external facts were dated, primary-sourced
  and registered; internal facts about the surrounding system were taken from a reading of one peer and
  attributed to both. `skill-writing/SKILL.md` Must-Follow: *"MUST verify mechanism claims from their owner
  and verify taught examples against the live surface."*
- Alternative tested: that these are design *choices* the artifact knowingly improves on, as with `skill-type`
  (D2 openly says "both peers omit it … `react` closes the gap for itself"). Rejected — D2 proves the artifact
  states divergence when it knows of it; here it states the opposite, that the pattern is inherited precedent.
- Why it matters: a cold planner reading "verified pattern from both peers" does not re-verify. Three
  structural elements presented as inherited convention are actually new inventions carrying no precedent
  warrant, and this iteration had no cross-review to catch it. The same phrase is the stated warrant for
  several other §4–§6 choices, so the reliability of the whole class is now in question, not just three rows.
- Suggested direction: bring internal-anatomy claims under §3's marker discipline, or restate each
  peer-pattern claim at its true scope ("typescript's pattern; python does not carry it; `react` follows
  typescript per D3").

---

## Structure

**VERDICT: PASS**

Ownership is the artifact's strongest structural work. The dual-parent seam (§4) is stated precisely, and
crucially states the `typescript` relation as *not* parenthood, with a testable line (§4.2 item 1: "a typing
fact that stays true when React is removed belongs to `typescript/typing.md`") plus six worked cases and a
per-section pointer list. I verified that pointer list against the live file: `typescript/typing.md` §1
unions, §2 generics, §4 `satisfies`/`as`, §6 narrowing, §7 `unknown`/`readonly`, §8 `interface` vs `type`,
§9 declaration files — **all seven section numbers and topics match exactly**. The plain-JavaScript fork
(§4.2 item 2) is a genuine structural insight neither peer needs, and it is threaded to the Intro, P1,
`typing.md`, and the three-axis review consistently.

The `rules.md` boundary (D12/OD-5) — the one role the locked file set left unspecified — is resolved
soundly. I verified both governing clauses the artifact cites: `skill-writing/SKILL.md` Must-Not-Follow
*"NEVER add policy only to an operation companion"* and `operation-skill.md` *"The parent is the sole policy
owner"*. The rejected alternative (hoist rules into `rules.md`) would indeed violate both. The reading is
correct and the residual risk is honestly flagged (A5) and checked (O-11).

Rule-ID scheme: I initially read §5.4's `H{n}` inventory as inconsistent with `typescript/SKILL.md`, whose
rules are unnumbered bullets. It is not — `typescript/evaluation.md:34` assigns `H1`–`H8` (Must-Follow) and
`H9`–`H13` (Must-Not-Follow) via its rule-key legend, continuous across both subsections. §5.4's H1–H9 /
H10–H16 split reproduces that model exactly, and fixing the ID→rule map at Ideation is an improvement on the
peers. O-4's "diff against `typescript` H1–H13" resolves correctly. No finding.

### Findings

**F8 — No obligation covers whether each of the eleven content children earns its split.**

- Type: `checklist_gap` · Domain: `process` · Disposition: `open` · Confidence: 100 · Severity: **Low**
- Expected: `skill-writing/SKILL.md` P4 gates child creation — *"default to one `SKILL.md`; add direct
  children only for an owned artifact set, a long lookup reference, per-unit orchestration, or a
  self-contained sub-procedure another consumer loads"* — and Must-Not-Follow *"NEVER split by length
  alone"*. §6 requires every child to carry a Split-criterion line, i.e. to justify itself.
- Observed: O-1 proves the *floor* via the P7 cold-load proof; no O-item covers child justification. Eleven
  content children (peers ship eight each) are locked by D11 with the altitude test deferred to Execution and
  unchecked. A7's escape hatch is scoped to the floor being too heavy, not to a child not earning its split.
- Root cause: the split criterion is specified by imitation of the peer form rather than by running the
  owner's altitude test per child during Ideation.
- Why it matters: Execution writes eleven self-justifications with nothing verifying any of them.
- Suggested direction: an obligation applying skill-writing P4's four altitude categories per child. Note the
  file set itself is user-locked (D11) and out of scope to revisit.

---

## Performance

**VERDICT: PASS**

For a documentation artifact the dominant resource is cold-load cost, and it is dispositioned rather than
hand-waved. A7 names the floor-weight assumption, states both failure directions ("too heavy to cold-load, or
too thin to be a floor"), and — importantly — commits to a *measurement* rather than an assertion: "The floor
is proven by that proof, not asserted" (the `skill-writing` P7 cold-load proof in both runtimes). O-1 carries
it as a binary obligation with `loaded_child_count: 1`. `ideation/checklists.md` IDEA-CK-05 asks for explicit
limits with a measurement commitment; that is satisfied.

I sanity-checked the order of magnitude A7 assumes: `python/SKILL.md` is 402 lines / 30,620 bytes;
`typescript/SKILL.md` is 422 lines / 24,344 bytes; whole skills are 212K and 196K. A floor of 7 principles +
16 rules + 8 procedure steps sits inside that envelope, so "sixteen rules is the right order of magnitude" is
a defensible estimate, not a guess.

The absence of a word/line/percentage target is **correct**, not a gap: `skill-writing/mistakes.md`
§ *Quantitative Compaction Before Necessity* records that a numeric target adopted before the claim-owner
inventory governs deletion before the capability contract is known. §5.6 builds the claim-owner ledger first.
The artifact complies with a trap it does not cite.

No external calls, no recurring cost, no paid resource, no N+1 surface. No findings — recorded as an honest
empty perspective, not an unexamined one.

---

## Aesthetics

**VERDICT: PASS**

Read cold, the artifact is navigable: an explicit reading-order guide (§ header, `synthesis.md:9-11`),
stable numbered sections, and consistent tables. Names are stable throughout — `H{n}`, `P{n}`, `O-{n}`,
`D{n}`, `OQ-{n}`, `A{n}`, `MC-{n}` are each used in exactly one sense and never collide. Every ID referenced
in one section resolves in another. There are no placeholders, no `TBD`, no empty scaffolding. §0 is a model
of honest front-matter: it states the single-system condition, what it costs, and what may not be inferred
from it, before any design content.

The skim/full-read test passes: §2.5, §5.7, §6.7's ownership blockquote, and §7.2's example-check paragraph
each carry their whole meaning in their first sentence.

### Findings

**F9 — Load-bearing decisions are restated four to five times each, creating a revision-drift surface.**

- Type: `general` · Domain: `docs-sync` · Disposition: `open` · Confidence: 100 · Severity: **Low**
- Observed, in the canonical artifact a revision must keep internally consistent:
  - React Native exclusion — §2.2 item 6, §2.3 closing line, §6.8, §8 D14, §12.1 OQ-3 (plus OD-2). Five sites.
  - The `coding` scope-anchor backlog — §2.3 table row, §4.1, §8 D15a, §12.1 OQ-4 (plus OD-3). Four sites.
  - The version-pinning policy — §5.7, §6.8 "Version policy here", §6.11, §8 D7. Four sites.
- Why it matters: the project records `sweep-every-occurrence-when-fixing-a-multi-surface-claim` for exactly
  this shape. An iteration-2 revision to any of these three must land in four or five places or the canonical
  artifact self-contradicts.
- Alternative tested: that decision-record / design / open-question views legitimately overlap by role.
  Partly true and why this is Low, not Medium — but §2.3's React Native paragraph and §6.8's are narrative
  restatements, not role-distinct views.
- Suggested direction: one owner per decision, pointers elsewhere. No content change implied.

---

## Usage

**VERDICT: PASS**

The four named consumers (§1.4) each get what they need, and I traced each. A planner can decompose from this
file alone: §10.4 gives the wiring sequence while explicitly disclaiming task decomposition ("It is not a task
decomposition; Planning owns that"), which respects the Ideation/Planning line. §11's 22 obligations each pair
a design obligation with a concrete check and a source, and both traces close. OQ-6 is correctly labelled
open-by-design with its discharge route named (Planning writes it into the four affected task briefs), rather
than being forced to a false resolved state.

Two findings make an executor's job harder than the artifact intends. Neither reaches the High bar.

### Findings

**F5 — The handed-off backlog file spec omits the two frontmatter keys its own type requires, so the file as
specified fails the memory validator.**

- Type: `checklist_gap` · Domain: `docs-sync` · Disposition: `open` · Confidence: 100 · Severity: **Medium**
- Expected: `skills/memory/rules.md:263` — *"Required: … `backlogs` → `priority` + `project-scope` … the
  validator FAILS a file of that type that omits it."*
- Observed: §2.3 and OD-3 specify the file as
  `.gobbi/projects/gobbi/backlogs/docs/coding-scope-anchor-enumerates-two-language-skills.md`, `type: backlogs`,
  `status: open` — and assign creation to Planning/Execution. `priority` and `project-scope` are never named.
  I confirmed the path root exists (`backlogs/docs/` is live) and that `backlogs` is a valid type
  (`memory/rules.md:217`), so only the required extensions are missing.
- Root cause: the type and status were carried from the decision discussion; the type's *required extension*
  contract was not read from its owner.
- Why it matters: Execution creates the file, `validate-frontmatter.sh` fails it, and the failure surfaces at
  the end of a writer chain rather than in the spec.
- Suggested direction: name both required keys in the spec, or point Planning at `memory/rules.md` § 2.

**F6 — The §10.1 "wording caution" is scoped to sites 2–4 but site 1 has the identical defect.**

- Type: `scenario_gap` · Domain: `docs-sync` · Disposition: `open` · Confidence: 100 · Severity: **Medium**
- Expected: §10.1's caution — *"All three currently read as a two-item *language*-skill set. `react` is not a
  language… The edit must not simply append `react` to a phrase that says 'language-specific'"* — applies
  wherever the defect exists.
- Observed: it is explicitly scoped to "sites 2–4". Site 1 is `skills/gobbi/SKILL.md:73`, verified live:
  `| [`python`](../python/SKILL.md) / [`typescript`](../typescript/SKILL.md) | **Language method skills.** |
  Relevant when the task enters that language. |` — the row label and the relevance note are both
  language-framed. Appending `react` makes the row's own description false, which is precisely what the
  caution exists to prevent.
- Root cause: the caution was derived from the three sites sharing the literal token "language-specific";
  site 1 expresses the same concept as "Language method skills", so a token-shaped sweep missed it —
  the recorded trap `sweep-must-grep-synonymous-phrasings-not-just-primary`.
- Why it matters: §10.1 is the executor's spec for the only four hand-edits in the change set. Site 1 is the
  canonical skill-map index — the one place every agent orients from.
- Suggested direction: extend the caution to all four sites.

---

## Consistency

**VERDICT: REVISE**

The change-set boundary claim is the artifact's best-evidenced work and it survived my strongest adversarial
probe. §2.5 asserts the change set is "exactly two things" — the `react/` directory and four registration
sites — and §10.2 names four deliberately-unchanged files. I swept the entire `skills/` and `agents/` tree
case-insensitively for every file co-enumerating the two language skills. Result: **exactly seven files,
every one accounted for** — the four change sites (`gobbi/SKILL.md:73`, `ideation/SKILL.md:68`,
`ideation/SKILL.md:174`, `evaluation/SKILL.md:309-310`) and the three unchanged (`coding/SKILL.md:293`,
`coding/evaluation.md:5`, `coding/review.md`), plus `ideation/evaluation.md:58` which D16 dispositions. No
fifth site exists. I also confirmed `ideation/scenarios.md` IDEA-SC-11 and `ideation/checklists.md`
IDEA-CK-11 describe domain routing generically and enumerate no skill names, so no co-touch is owed there.

The wiring section (§10.3–§10.6) verified claim-for-claim against the live tree — see must-preserve.

One High and two lesser findings.

### Findings

**F1 — §7.3 and obligation O-15 hard-wire a retired evaluation output model that contradicts the owning
contract, the live validator, and a recorded project trap.**

- Type: `design_flaw` · Domain: `docs-sync` · Disposition: `open` · Confidence: 100 · Severity: **High**
- Expected: the `react` skill teaches the current evaluation output contract, whose owner is
  `record`/`workflow`, not a peer language skill.
- Observed: §7.3 (`synthesis.md:937-939`) states — *"**Adds no evaluator artifact.** Each system still writes
  exactly **nine** outputs — seven perspective files, `overall.md`, and the copied phase `checklist.md`."*
  O-15 (`synthesis.md:1122`) then makes it binding: *"`evaluation.md` adds no tenth output … Read it; assert
  the **nine-output guarantee is stated**."* Four independent owner sources contradict this:
  1. `skills/record/record-map.md:72-73` fixes the outputs as `evaluation/iteration-{n}/claude.md` and
     `evaluation/iteration-{n}/codex.md` — **one file per system**, not nine.
  2. `skills/workflow/steps/evaluation.md` requires "one complete finding ledger and completed checklist"
     per system, schema- and validator-checked before aggregation.
  3. `skills/evaluation/scripts/validate-evaluation-report.sh` *enforces* single-file: `assert_human_report_shape`
     requires all seven `## <Perspective>` sections, eight `### Findings` ledgers, exactly one
     `## Evaluation Checklist`, and one embedded canonical machine-JSON block **in one file**. I ran
     `validate-evaluation-report.sh self-test` on the target branch: **PASS** — the contract is live and enforced.
  4. `skills/evaluation/mistakes.md` § *A Gobbi Peer Response Becomes One System Report* names the
     nine-file spread as the **recorded trap**: *"A Gobbi system evaluation is spread across per-perspective
     files … Correct approach: … require one schema-valid JSON response from each fresh evaluator … which
     atomically renders one `evaluation/iteration-{n}/{system}.md`."*
- Root cause: the claim was adopted from `python/evaluation.md:16` and `typescript/evaluation.md:16` as
  peer precedent. It is a **mechanism claim owned by `record`/`workflow`**, not by a language skill, and it
  was never checked against its owner — `skill-writing/SKILL.md` Must-Follow: *"MUST verify mechanism claims
  from their owner … A plausible command, path, field, or wiring statement is not evidence."* The stale
  claim currently lives in four skills (`python`, `typescript`, `web/evaluation.md:5`, and a reference in
  `startup/evaluation.md:129`); `web/evaluation.md:5` even attributes it to "the generic `evaluation` skill",
  which I read in full — `evaluation/SKILL.md` defines no output shape and explicitly defers storage to the
  caller. The attribution is false at its source.
- Alternative tested: that the nine-output model is still current and `record-map.md` describes only the
  *rendered* location. Rejected — the validator operates on a single file per system and would reject a
  nine-file submission outright; and the mistakes entry names the nine-file spread as the failure mode, not
  the norm.
- Why it matters: this ships a wrong instruction into a durable skill *and* elevates it to an obligation an
  evaluator must assert. It reproduces a defect the project has already recorded and paid for, and it adds a
  fifth carrier, making the eventual correction wider. It also contradicts §7.3's own next clause — "the
  caller owns the machine shape, the output path, and storage" — which is correct.
- Suggested direction: state the output contract from its owner or, better, state nothing and point at
  `record`/`workflow` — the peers' text is the thing to *not* copy here. Whether to fix the four existing
  carriers is a separate scope question for the user (D15 shows this project prefers recording such
  consequences over opportunistic fixes).

**F4 — The mandated Split-criterion line points at a skill-writing step that no longer owns the split
decision; eleven stale citations will ship.**

- Type: `checklist_gap` · Domain: `docs-sync` · Disposition: `open` · Confidence: 100 · Severity: **Medium**
- Expected: §6 requires every child to carry "a **Split criterion** line **citing the skill-writing clause
  that earns the split**" — so the cited clause address must be current.
- Observed: §6 mandates the pattern but never names the current clause, leaving the peer instances as the
  template. All eight `typescript` children cite **`skill-writing P3`** (`typing.md:9`, `convention.md:7`,
  `async-resources.md:9`, `packaging-publishing.md:8`, `testing.md:8`, `runtime-deltas.md:8`,
  `modules-tooling.md:8`, `design.md:8`). In the current `skill-writing/SKILL.md`, **P3 is "Study evidence
  and pass the user design gate"**; the altitude/split decision is **P4** ("Map ownership, blast radius, and
  document altitude"). The sub-letters still map — current P4's list has (b) a long lookup reference and
  (d) a self-contained sub-procedure — so only the step number is stale, replicated eight times.
- Root cause: `skill-writing` was renumbered after the peers were authored; the artifact took the citation
  form from the peer surface without resolving the target — the trap family `verify-rule-scope-before-citing`.
- Why it matters: eleven new children would ship a citation pointing a reader at the wrong step of the
  governing skill, doubling the existing drift instead of stopping it.
- Suggested direction: name the current clause (`skill-writing` P4 altitude decision) in §6.

**F7 — Site 1's quoted "current content" is not verbatim.**

- Type: `general` · Domain: `docs-sync` · Disposition: `open` · Confidence: 100 · Severity: **Low**
- Observed: §10.1 quotes site 1 as
  `| [python](../python/SKILL.md) / [typescript](../typescript/SKILL.md) | Language method skills. | … |`.
  The live line (`skills/gobbi/SKILL.md:73`) has backticks inside the link text:
  ``| [`python`](../python/SKILL.md) / [`typescript`](../typescript/SKILL.md) | … |``. Sites 2, 3 and 4 are
  quoted verbatim and match exactly.
- Why it matters: §10.1 is the executor's edit spec; a literal-match search on the quoted string finds
  nothing at the one site where the quote drifted.
- Suggested direction: requote from the live line.

---

## Risk

**VERDICT: PASS**

Blast radius is bounded and independently confirmed (see Consistency). The change is purely additive — one
new directory plus four single-line prose edits — so there is no migration, no data at risk, and no one-way
action. The only mutating external operation is the sync script in write mode (§10.4 step 2), and the
artifact correctly forbids hand-editing mirrors and cites the recorded reason (a full-file `Write` to a
`.claude` mirror converts the symlink to a regular file). §10.6's two live-tree cautions are both real
recorded traps and both correctly stated. Trust boundaries, licensing, privacy and destructive actions have
no surface here; `ideation/checklists.md` IDEA-CK-07 is N/A on inspected evidence.

Dependency risk is actively managed: D6 forbids any new dependency, React install, or harness, and I confirmed
none of the five guard scripts needs a `react`-specific edit.

The highest-risk assumption is correctly identified. A3 (cite-and-review is sufficient for example
correctness) is named as *the* residual risk, with the honest observation that "the mitigation is weaker than
the alternative the user declined, by the user's own explicit reasoning" — recorded as accepted residual risk
of D6, not as an unflagged gap. That is the right handling of a user-locked decision.

Rollback is not stated anywhere, which for a purely additive, git-tracked change set I judge immaterial rather
than a finding.

### Findings

**F10 — One research-flagged UNVERIFIED item is absent from the register that claims to carry them forward.**

- Type: `general` · Domain: `process` · Disposition: `open` · Confidence: 50 · Severity: **Low**
- Observed: §3.5 presents itself as the complete carry-forward ("Fifteen claim families are not
  primary-sourced"), and I confirmed the row count is exactly fifteen and that it faithfully carries every
  UNVERIFIED marker from `react-core.md` (7), `react-ecosystem.md` (3), and most of `react-electron.md`.
  One is dropped: `research/react-electron.md:83` flags the `contextBridge` TypeScript typing pattern as
  *"UNVERIFIED as 'the' canonical typing"*. It appears in no §3.5 row.
- Confidence is 50, not higher, because the artifact does not appear to *assert* a canonical bridge typing
  anywhere — §6.8 mentions only guarding `window.electronAPI` — so this is a register-completeness gap
  rather than an unverified claim asserted as fact.
- Why it matters: OQ-6 hands §3.5 to Planning as the authoring obligation. A claim absent from the register
  carries no obligation, and `runtime.md` is exactly where a bridge-typing example would land.
- Suggested direction: add the row, or record why it was judged out of scope.

---

## Overall

**VERDICT: PASS** — corrected. Overall's verdict derives from Overall's own findings, and its
only finding (F11) is Low, so the declared rule yields PASS. The REVISE force is carried by Project and
Consistency, and the aggregate is REVISE either way. My first pass wrote REVISE here while also stating
that Overall contributes no separate finding; those two cannot both hold under the derivation rule
declared above, so I corrected the verdict rather than invent an Overall finding to justify it.

This is a strong, unusually well-evidenced Ideation artifact with one systematic weakness.

The strength is real and I want it stated precisely, because a remediation could easily damage it. On
**external, time-sensitive facts** the artifact is close to exemplary. I re-verified independently against
the npm registry and the shipped package, and **every single check matched**: React `latest` = 19.2.8
published 2026-07-21; `babel-plugin-react-compiler` `latest` = 1.0.0 published 2025-10-07; and the entire
`eslint-plugin-react-hooks` finding — `latest` 7.1.1 published 2026-04-17, `6.0.0-rc.2` sitting on the `rc`
tag, `configs.recommended` = 2 core + **14** compiler rules = **16**, `recommended-latest` = **17** via
`void-use-memo`, **11** further rules defaulting to Off, `incompatible-library` and `unsupported-syntax` at
warn, the bundle's `meta.version` reading a stale `7.0.0`, and `component-hook-factories` deprecated to a
no-op in 7.1.0. I reproduced all of it from the tarball's own preset construction. Seven ecosystem versions
spot-checked, seven exact. The MC-1 methodology — resolve a preset contradiction against the published
artifact rather than adjudicating two prose pages — is correct, correctly bounded by its own stated limit
("the artifact tells you what the current release *does*, not what the vendor *intends next*"), and worth
promoting.

The systematic weakness is the mirror image of that strength, and it is the cross-perspective root cause
uniting F1, F3 and F4: **claims about the outside world were dated, primary-sourced and registered; claims
about the surrounding system were taken on faith from a peer file.** §0 promises one provenance discipline
("Every load-bearing claim carries a VERIFIED or UNVERIFIED marker in §3") and §3 delivers it for exactly one
of the two claim classes. Every defect I found of Medium severity or worse is an instance: a retired output
model copied from a peer (F1), three peer-anatomy patterns attributed to "both peers" that one peer does not
have (F3), a governing-clause citation stale by one step (F4), a required-frontmatter contract not read from
its owner (F5), and a synonym-shaped site missed by a token-shaped sweep (F6). None of these needed research
to catch — each is one `grep` against a file the artifact already names.

This is exactly the class of defect the absent second producer would have been most likely to catch, and §0
and D13 are right that fresh evaluation is the only remaining cross-check. I note it as corroboration of the
artifact's own stated risk, not as a criticism of the waiver.

Karpathy failure modes checked: no unnecessary novelty (the design follows peer precedent deliberately and
says where it diverges — D2); no unrelated bundled outcomes (the change-set boundary held under an
exhaustive sweep); no mechanism substituted for an outcome contract (obligations are outcome-shaped and
paired with evidence methods); one process-result contradiction, F2, where a success signal survives its own
disconfirmation. No premise is wrong — the problem framing is correct and well root-caused.

**Flagged observation, separated from the findings** (per brief §11): I record without asserting it as a
finding that D16 leaves `ideation/evaluation.md:58`'s routing probe naming only Python or TypeScript while
sites 2–4 gain `react`. The artifact's justification — it is an illustrative example, not an index — is
sound, and the decision is the user's. I raise it only because §10.1's own "wording caution" establishes that
these enumerations are read as sets; a future reader may see :58 as a fifth site the change missed. Recording
the reasoning at that line, as D15a does for the `coding` anchor, would close it. This is out of scope to
relitigate and needs no action.

### Findings

Overall contributes no separate finding. Its integrating judgment is carried by F1, F2 and F3, whose shared
root cause is stated above; duplicating them here would inflate the ledger without adding evidence.

### Must-preserve list

Remediation must not damage any of these:

1. **§3.2's OQ-2 lint-preset resolution and the MC-1 method behind it.** Independently reproduced in full
   from the 7.1.1 tarball, including both caveats. Do not weaken the roster, the counts, or the
   read-the-artifact-not-the-prose reasoning.
2. **§3.1/§3.4's dated external facts.** Every version and date I checked was exact. Preserve the fetch-date
   discipline and the §6.11 volatility guard.
3. **§2.5 + §10.1–§10.6, the wiring plan.** Verified claim-for-claim: four registration sites correct and
   exhaustive; `.claude/skills/{skill}/` per-file symlinks; `.agents/skills/{skill}` whole-directory symlink;
   `plugins/gobbi/skills` a directory symlink so a new skill needs zero action; `.codex/` has no skill mirror;
   `for_each_canonical_skill()` at `sync-plugin-package.sh:227` with zero hardcoded skill names; all five
   guards present and none needing a react-specific edit; `check-codex-plugin-smoke.sh` spot-checking
   `skills/codex/SKILL.md` and `skills/principles/SKILL.md`; `check-markdown-links.sh`'s single "python" hit
   being a fenced-code-language comment. Every one of these held.
4. **§0 and D13's honesty about the single-system condition.** Verified accurate: `drafts/` contains only
   `claude.md` and `cross-reviews/` is empty. The refusal to let absence of disagreement read as agreement is
   the right posture and must survive any rewrite.
5. **§4.2's typing seam.** The testable line, six worked cases, and the seven-section pointer list into
   `typescript/typing.md` — all seven verified correct against the live file.
6. **The plain-JavaScript fork (§4.2 item 2).** A genuine structural insight neither peer needs.
7. **D12/OD-5's `rules.md` reading.** Both governing clauses verified; the rejected hoist really would
   violate them.
8. **A3's honest residual-risk statement** and OQ-6's refusal to be marked resolved.
9. **The absence of a numeric size target**, which correctly complies with
   `skill-writing/mistakes.md` § *Quantitative Compaction Before Necessity*.

---

## Evaluation Checklist

Filled copy of `ideation/checklists.md`. Resolution: PASS · FAIL:`<finding-id>` · N/A:`<property>`.

- [x] **IDEA-CK-01 [GATE] Root outcome and scope** — **PASS.** Cause chain (§1.2, structural not
  informational) aligns with the design; scope enumerates in/out/deferred with a destination or explicit drop
  per item; D1–D11 record user approval. Independent sweep confirmed the scope contract is refusable and
  complete. Evidence: `synthesis.md` §1–§2, §8; case-insensitive co-enumeration sweep of `skills/`+`agents/`.
- [x] **IDEA-CK-02 [REQUIRED] Actor usability** — **PASS.** Four consumers named (§1.4) with arrival path and
  need; planner, executor, evaluator and maintainer traced through §5, §7, §10, §11 with no private-context
  dependency. Evidence: §1.4 actor ledger; cold read of §10.4 and §11.
- [x] **IDEA-CK-03 [REQUIRED] State and data behavior** — **N/A:`no runtime state`.** The subject is a
  document design; it defines no state machine, persisted data, or transition. Applicability tested against
  the only stateful surfaces in the change set (generated mirrors, §10.3), which are idempotent symlink
  creations with no invariant to violate. Not inferred — checked.
- [x] **IDEA-CK-04 [GATE] Owned acyclic design** — **PASS.** Fifteen files, one owner per concern; the two
  hardest seams (`async.md`/`server-client.md` via the eight-row table in §6.7; `react/typing.md` vs
  `typescript/typing.md` via §4.2) each carry a one-sentence disambiguator and worked cases. Dependency
  direction is acyclic: children point up to `SKILL.md` and sideways once. Evidence: §4.2, §6.1–§6.11;
  `typescript/typing.md` section-number verification.
- [x] **IDEA-CK-05 [REQUIRED] Resource bounds** — **PASS.** Cold-load cost is the dominant resource; A7 states
  the assumption in both failure directions and commits to the P7 cold-load proof as measurement (O-1),
  rather than asserting sufficiency. Envelope sanity-checked against peer sizes (402/422 lines). Evidence:
  A7, O-1, `wc` on `python`/`typescript` `SKILL.md`.
- [x] **IDEA-CK-06 [GATE] Failure and recovery** — **PASS.** Falsification signals are defined at artifact
  level (§1.6) and per assumption (§9), each with what fails and the disconfirming signal. The authoring
  failure paths that matter — cold-load proof failure, a wrong taught example, seam bleed — each route to a
  named owner and a named consequence. Evidence: §1.6, §9 A1–A8.
- [x] **IDEA-CK-07 [GATE] Trust and governance** — **N/A:`no trust, privacy, destructive or license surface`.**
  Applicability tested: the change set is additive documentation; no untrusted input, no privileged action,
  no sensitive data, no destructive operation, no borrowed licensed material. The one security *topic* in
  scope (Electron `contextIsolation`/`nodeIntegration`, H15) is taught content, not a surface this change
  exposes. Evidence: §2.5 change-set boundary; §10 wiring plan.
- [x] **IDEA-CK-08 [REQUIRED] Inclusion and locale** — **PASS.** Accessibility is dispositioned from inspected
  evidence rather than waved: D9 splits mechanics (in scope — semantic elements, ARIA correctness, focus
  management) from design judgment (out, to `ui`/`ux`), §2.2 item 2 states the dividing line, P4 gives the
  mechanics a principle home, and H8 makes it a rule. Locale is not applicable to the skill's own surface and
  is not claimed. Evidence: §2.1 item 9, §2.2 item 2, §5.3 P4 note, H8, D9.
- [x] **IDEA-CK-09 [GATE] Compatibility and reversal** — **PASS.** Existing consumers identified exhaustively
  by independent sweep; four sites change, three files deliberately unchanged with recorded consequence
  (D15/D15a), one dispositioned (D16). Purely additive, no migration, git-reversible. Rollback is not stated
  but is immaterial for an additive change set. Evidence: §10.1, §10.2, co-enumeration sweep.
- [x] **IDEA-CK-10 [GATE] Traceability and Planning readiness** — **FAIL:F2, FAIL:F3.** Cold-readability,
  link resolution, name stability and orphan checks all pass, and both obligation traces close. But the
  claim-to-source trace does not: §1.5's "no rule rests on an unverified claim" and O-3 are contradicted by
  the artifact's own H13/H8 rows (F2), and the internal-anatomy claim class carries no provenance marker
  despite §0's promise, with three such claims false (F3). Evidence: F2, F3 above.
- [x] **IDEA-CK-11 [GATE] Base and domain ownership** — **PASS.** Domain routing is correct and verified live:
  the artifact selects only applicable owners (`coding`, `typescript` conditionally, `skill-writing` +
  `operation-skill.md`), excludes `ui`/`ux` with a stated boundary (D10), and copies no owner's procedure.
  Every governing document it cites exists and holds the claimed authority — I ran the existence and content
  checks on all of them. The mixed-domain probe required by `ideation/evaluation.md:58` is exercised: this is
  a project-plus-language-adjacent design, and no skill is loaded by default. Evidence: §2.4, §4, §5.1;
  `test -f` and content verification of every cited skill path.
- [x] **IDEA-CK-12 [GATE] Validation evidence boundary** — **PASS.** Current and future evidence are cleanly
  separated: §3.1–§3.4 VERIFIED with sources, §3.5 UNVERIFIED with per-claim gaps, OQ-6 carried as a Planning
  obligation with owner (Planning briefs / Execution discharge), method (verify against primary source, or
  state as convention with evidence class named per O-13), pass/fail signal and later phase. No planned
  output is cited as produced; the harness is recorded as dropped, not deferred (§2.3), with its replacement
  obligation named (D6a). Evidence: §3.5, §12.2, OD-6, O-13.

**Coverage closure:** 12/12 rows resolved from inspected evidence — 10 PASS, 2 N/A with tested applicability,
1 row (IDEA-CK-10) carrying two FAILs. Closure is complete; acceptance is not granted, because a gate row
fails.

---

## Limitations and uncertainties

- **Capability:** network and shell were both available, so no claim in this report rests on close reading
  where execution was possible. The lint-preset roster was extracted statically from the shipped bundle
  because executing `package/index.js` requires `@babel/core`, which I did not install; my first extraction
  mis-parsed the field order and reported 13 rules, and I corrected it to 14 against the rule blocks directly
  before drawing any conclusion. No count in this report comes from the failed parse.
- **Not evaluated:** the five research reports were read for UNVERIFIED-marker fidelity and spot-checked, not
  independently re-researched end to end. `drafts/claude.md` was read for provenance only, since the
  synthesis supersedes it.
- **F10** is the only finding below confidence 75; it is labelled 50 and its basis is stated.
- **Out of scope, not evaluated:** the thirteen locked decisions were checked for faithful and consistent
  *implementation*, never for merit.

---

# Addendum — bundle re-freeze, §13, and the freeze-discipline failure

Added after the manager reported that the primary artifact changed after dispatch and re-declared the
authoritative subject. Nothing above was softened; the verdict was already REVISE and is unchanged.

## A. Which version this report evaluated

**This report was formed against the authoritative version**, byte-for-byte. Evidence:

- `sha256sum` of the current file = `5775426dfb35…` — identical to the digest I recorded in this report's
  header before the correction arrived, and identical to my end-of-run integrity re-check. `md5sum` =
  `9af5a271…`, `wc -c` = 98,665, matching the manager's declared authoritative row exactly.
- All seven line citations used in my findings resolve on the current bytes: `:494` (H8), `:504` (H13),
  `:937` (§7.3 nine outputs), `:1001` (A4), `:1122` (O-15), `:350` (§4.1), `:571` (§6 house shape).
- `open-decisions.md` = 7,622 bytes / `66761cb7…` and `drafts/claude.md` = 89,113 bytes / `cffe5d87…`,
  both matching the declared rows.

**One correction to the manager's account of the diff.** The instruction says the earlier 92,982-byte version
lacked §13 and that §13 was the appended difference. §13 is indeed the delta — `sed -n '1160,1243p' | wc -c`
= 5,682 bytes against a declared delta of 5,683 — but the inference drawn from it does not apply to me: my
*read* of the file already contained §13 at line 1162 with MC-1, MC-2 and MC-3 complete. The only stale datum
anywhere in my session is a directory listing taken at 14:44 reporting 92,982 bytes, before the 14:48:28
mtime. That byte count was never used in any finding. No re-read was required and no analysis was formed
against the superseded version.

## B. §13 assessed on its merits

The manager is correct that I read §13 without assessing it; that was a coverage gap in my first pass and it
is closed here.

**§13 is substantially sound and I am placing it on the must-preserve list.** My initial reading — that
mistake-candidates in the design artifact are misplaced, because `mistake/SKILL.md`'s Memory Access Matrix
makes `staging/decisions/{slug}.md` the only productive-step write surface and `1-ideation/staging/` is
empty (verified: 0 files) — did not survive checking. `record/SKILL.md` § 3 *Derive typed staging candidates*
contracts RECORD to "**Inspect the evidence** for durable value. A candidate must be one of the record-map
staging types and must have **a direct source**." The synthesis is evidence with a direct source, so RECORD
deriving typed candidates from §13 is inside its contract, not outside it. Further, `mistake/SKILL.md`
Procedure 2 step 3 requires the candidate note be written "**immediately** — do not defer to RECORD. If the
session is interrupted before RECORD runs, deferred notes are lost." §13 does exactly that. It is
directionally compliant, not misplaced. I record the rejected reading because it was my leading hypothesis
and the evidence refuted it.

Content quality is high. MC-1 carries all four required elements plus a well-drawn limit ("use the artifact
for present behavior and prose for future intent, and never let one answer the other's question") — and I
independently reproduced its entire substance from the 7.1.1 tarball, so it is a verified lesson, not a
plausible one. MC-2 is accurate: I confirmed `6.0.0-rc.2` sits on the `rc` tag while `latest` is 7.1.1, and
that `component-hook-factories` is deprecated to a no-op in 7.1.0. MC-3's refusal to create a duplicate for a
recurrence is correct discipline.

### Findings

**F11 — §13 names the wrong owner for promotion and asks for an operation that is not defined.**

- Type: `general` · Domain: `process` · Disposition: `open` · Confidence: 100 · Severity: **Low**
- Observed, two precise inaccuracies in an artifact otherwise scrupulous about one-owner-per-fact:
  1. §13's preamble: "Recorded here rather than only in conversation, so **RECORD promotes** them from the
     artifact." RECORD does not promote. `mistake/SKILL.md` Procedure 4 and
     `memory/templates/decisions.md` both fix the split: *"RECORD writes only the typed staging source.
     Wrap-up WORK is the only stage that promotes it to durable memory."* The correct sentence is that
     RECORD **stages** and Wrap-up **promotes**.
  2. MC-3 asks that "RECORD **strengthens the existing entry** instead of creating a duplicate." No such
     operation exists — the defined operations are write-new, supersede (`supersedes:` + `status:
     superseded` flip), and archive-on-terminal. MC-3 also identifies its two target traps only
     descriptively ("a manager-side read crossing an in-progress teammate write"; "a completion signal
     inferred from something other than the writer's own explicit report") rather than by slug, though
     linkage in this system is by plain slug.
- Root cause: the same asymmetry named in F3 — a claim about the surrounding system's mechanics stated from
  working familiarity rather than read from its owner.
- Why it matters: low practical impact, since a RECORD assistant loads `mistake/SKILL.md` and will follow it.
  The cost is that MC-3's recurrence-witness intent may be dropped, because the operation it requests is
  undefined and its targets are unnamed.
- Suggested direction: correct the verb, and name MC-3's two target slugs.

## C. The freeze-discipline failure

The manager raised this and instructed me not to suppress it. Recording it, with one scope correction.

**F12 — evaluators were dispatched against a subject the writer could still change; the pair aggregation is
now at risk even though this report is not.**

- Type: `assumption_risk` · Domain: `process` · Disposition: `open` · Confidence: 100 (mechanism) /
  75 (peer impact) · Severity: **Medium**
- Expected: the WORK writer's handoff completes and the subject is frozen *before* evaluator dispatch.
- Observed: the artifact was at 92,982 bytes when this evaluation began and 98,665 bytes at mtime
  `14:48:28`, i.e. it was written after dispatch.
- **Scope correction on the cited trap.** The manager pointed at
  `mistakes/verification/iteration-artifact-edited-in-place-destroys-snapshot`. On reading it, that trap does
  not squarely apply: its own detection clause is scoped to edits "below a **prior** `working/iteration-*` or
  `evaluation/iteration-*` directory," and to keeping a digest after a material change. This edit was to the
  **current** iteration's artifact before any evaluation report existed. Citing it would be the recorded
  `verify-rule-scope-before-citing` error. The squarely applicable trap is
  `skills/evaluation/mistakes.md` § **Freeze Canonical Candidate Before Evaluating** — *"Evaluators were
  dispatched while the WORK writer could still change the canonical candidate, so the reports reviewed
  different bytes from the later declared subject"* — together with
  `mistakes/assumption/evaluator-dispatch-before-work-handoff-complete`, the manager-side handshake for the
  same boundary. That is an exact match.
- Why it matters, concretely and actionably: **this report is unaffected** (§ Addendum A), but the pair may
  be. `skills/evaluation/scripts/validate-evaluation-report.sh` binds every report to a subject digest —
  `validate_report` asserts `.subjectSha256 == $subject` for each report, and `pair` applies the same
  `--expected-subject-sha256` to both. If the concurrently-running evaluator read the pre-14:48 bytes, its
  report is bound to a different subject and `pair` will refuse the aggregation; and if the manager instead
  declares the older digest, this report fails validation. Either way the pair cannot be aggregated until the
  peer's subject digest is confirmed equal to `5775426d…`.
- Suggested direction: before aggregating, confirm the peer report's `subjectSha256`. If it differs, that
  evaluation is bound to a superseded subject and `evaluation/SKILL.md`'s repeat-after-material-change rule
  applies to it, not to this one. The manager owns that call.
- Recorded without prejudice to the manager's handling: the correction was self-reported and the
  authoritative version was declared with digests, which is what made this verifiable in minutes.

## D. Must-preserve additions

10. **§13's MC-1 and MC-2.** MC-1's read-the-published-artifact method and its stated limit are independently
    reproduced and generalizable beyond React; MC-2's staleness account is accurate against the registry.
    Preserve both, and MC-3's refusal to duplicate an existing trap.

## E. Checklist impact

No row changes value. IDEA-CK-10 already carries `FAIL:F2, FAIL:F3`; F11 attaches to it as further
claim-to-source evidence without altering the resolution. F12 is a process condition on the evaluation
handoff rather than a property of the subject, so it resolves against no IDEA-CK row — recorded here so its
absence from the checklist is deliberate and visible, not an omission.

## F. Independence disclosure

While running a `find` over my own write root's parent to confirm my write footprint, I incidentally observed
that `1-ideation/evaluation/iteration-1/claude-b/` exists and contains `report.md` and `report.json`.

**I did not open either file, and did not inspect them further.** The brief's independence constraint is
binding: I neither saw nor sought the peer report, and nothing in this evaluation was adjusted toward or away
from it. Every finding above was fixed in writing before that directory appeared.

I raise it only because two facts about it are the manager's to check, and both are answerable without me:

1. **F12's open action.** The peer's `subjectSha256` must be confirmed equal to `5775426d…` before
   aggregation. That value is inside the file I must not read; the manager can read it.
2. **A pairing-contract question, stated conditionally because I cannot and will not verify it.** The
   directory is named `claude-b`, and `validate-evaluation-report.sh pair` requires one report with
   `system: claude` and one with `system: codex`, with distinct `runtimeIdentity` values — it has no
   missing-system waiver. If `claude-b` holds a second Claude-system report rather than the Codex report,
   `pair` will reject it, and the cross-system anti-groupthink control that §0 and D13 identify as this
   iteration's *only* remaining independent cross-check would not have been exercised. I make no claim about
   what that directory actually contains.
