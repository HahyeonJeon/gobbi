# Consistency Perspective — Batch 4 iter1 (Claude)

## Artifact Summary + Memory reads

(See `project.md` § Artifact Summary.)

## Locked Frame (Stage 1)

The Consistency lens asks: **Does everything that should sync, sync?** For Batch 4 this includes:
- Internal consistency within each of the four files
- Cross-file consistency among the three skills + conventions.md
- Cross-skill consistency with adjacent skills (orchestration, delegation, discussion, evaluation, mistake, memorization)
- Consistency with the locked Batch 1–3 carryover decisions
- Consistency with `.claude/CLAUDE.md` (out-of-scope writes; in-scope reads for drift detection)

Seed scenarios:

1. **Scope Contract / Framed Problem / Design coherence** — adapted: each skill's description (frontmatter) matches its body.
2. **Cited insights match what's claimed** — adapted: every cross-skill citation (e.g., "see delegation/SKILL.md § X") points at a real section with the claimed content.
3. **Scenario ↔ Checklist alignment** — adapted: every constraint in the Constraints section is supported by guidance earlier in the document.
4. **Glossary terms consistent** — no synonym drift (e.g., "Wrap-up" vs "Wrapup", "subagent" vs "sub-agent").
5. **(adversarial)** — Internal vs external sources tension that is not resolved (e.g., Principle 2 says "ONE PERSPECTIVE" while evaluation skill says one evaluator walks all 7 perspectives sequentially).

Adversarial scenario: present (scenario 5).

Coverage matrix — Consistency owns part of Privacy / Licensing / Supply chain / Docs-sync. For doc-only artifacts here: not-applicable (no PII, no licensing, no deps).

## Per-scenario per-check results

**Scenario 1 — Frontmatter ↔ body coherence:**
- gobbi: frontmatter "Entry point for gobbi... Bootstraps the session, fixes the 5-role agent taxonomy, and points at every other skill the workflow needs." Body: ✓ bootstraps, ✓ taxonomy, ✓ skill map. **PASS.**
- principles: "Behavioral discipline floor for every gobbi agent." Body: ✓ 12 principles. **PASS.**
- git: "Git / GitHub workflow with worktree isolation." Body: ✓ worktree, ✓ branches, ✓ PRs. **PASS.**

**Scenario 2 — Cross-skill citations resolve:** Spot-checked:
- gobbi/SKILL.md line 60 → discussion/SKILL.md#question-card-structure → exists at line 39.
- gobbi/SKILL.md line 118 → delegation/SKILL.md#the-status-contract — verified existence.
- gobbi/SKILL.md line 142 → memorization/SKILL.md#output-paths — verified existence.
- git/SKILL.md line 108 → discussion/SKILL.md#decision-classification — verified existence.
- principles/SKILL.md does not cite other skills by anchor — pure behavioral floor.
- **PASS.**

**Scenario 3 — Constraints supported by guidance:** Spot-checked git/SKILL.md Constraints (line 262–280); each MUST has body guidance earlier (push from manager only → § Role Boundaries; AI-Provenance trailer → § Core Principles + conventions.md). **PASS.**

**Scenario 4 — Glossary terms:**
- "subagent" (not "sub-agent" or "sub_agent") consistent across all three files. **PASS.**
- "Wrap-up" with hyphen and capital W consistent. **PASS.**
- "AskUserQuestion" (one word, camelCase) consistent. **PASS.**
- "AI-Provenance-Record" hyphenated, consistent in git/SKILL.md and conventions.md. **PASS.**
- "Co-Authored-By" — same hyphenation everywhere it appears as the forbidden form. **PASS.**

**Scenario 5 (adversarial) — Internal-vs-external tension:** Examined. See C-C-01 below — there is a real Principle 2 vs evaluation topology tension.

## Typed findings

### C-C-01 — Principle 2 wording vs evaluation topology (Batch 3 carryover)

- **Type**: design_flaw
- **Domain**: process
- **Disposition**: open
- **Confidence**: 75
- **Severity**: High
- **Evidence**: principles/SKILL.md Principle 2 (line 47–48): "**Iron Law:** ONE AGENT, ONE PERSPECTIVE, ONE CATEGORY." Body (line 53): "_Evaluation perspective:_ the agent that creates work must never evaluate it." This is unambiguously about creator-vs-evaluator separation.

  But evaluation/SKILL.md (the Batch 1–3 carryover topology) defines a per-system × all-7-sequential pattern: ONE evaluator agent runs all 7 perspectives in a fixed order (Project → Structure → Performance → Aesthetics → Usage → Consistency → Risk) per Stage 2. This is one agent holding seven perspectives.

  The Iron Law's literal reading ("ONE AGENT, ONE PERSPECTIVE") is incompatible with the evaluation topology. The body clarifies that "perspective" in Principle 2 means *creator vs evaluator*, not *evaluation perspective slot*. But the *Iron Law itself* uses "PERSPECTIVE" in the bare form — and gives the reader no signal that the term has been narrowed.

  This is the same lexical-overload problem Batch 3 should have surfaced: the word "perspective" carries two distinct meanings (creator-stance vs evaluator-lens) that the Iron Law conflates.

- **Remediation**: Either (a) tighten the Iron Law to "ONE AGENT, ONE STANCE, ONE CATEGORY" (using "stance" for the creator/evaluator distinction, leaving "perspective" free for the evaluator's 7-lens rotation), or (b) add a single explanatory clause to Principle 2's body: "Note: 'perspective' here means creator/evaluator stance, not the 7 evaluator lenses in `evaluation/SKILL.md`. One evaluator agent may iterate all 7 lenses sequentially in one assignment." Option (b) is lower-disruption.

### C-C-02 — Mistake-promotion mechanism conflict between gobbi/SKILL.md and `.claude/CLAUDE.md`

- **Type**: design_flaw
- **Domain**: process
- **Disposition**: open
- **Confidence**: 75
- **Severity**: Medium
- **Evidence**: 
  - gobbi/SKILL.md line 154: "Wrap-up promotes session-staged mistake candidates to project memory. The `mistake` skill's procedure covers P1 (record immediately), P2 (staging path), and P3 (promotion via `gobbi mistake promote`)."
  - This describes TWO promotion mechanisms: (a) Wrap-up's MEMORIZATION pass and (b) the `gobbi mistake promote` CLI command.
  - `.claude/CLAUDE.md` (out-of-scope, read-only for drift) says: "After the session ends, run `gobbi mistake promote` to promote corrections to permanent workspace-level skill storage — promotion does not cause context reload."
  - The two mechanisms target different destinations: Wrap-up → `.gobbi/projects/{project-name}/mistakes/` (project memory); `gobbi mistake promote` → workspace-level skill storage. Both exist; the relationship is layered (project → workspace). But gobbi/SKILL.md line 154 does not clarify this layering — it lists them as if they were variants of the same step.
- **Remediation**: Rewrite gobbi/SKILL.md line 154 to make the layering explicit. Something like: "Wrap-up's MEMORIZATION promotes session-staged mistake candidates to project memory (`.gobbi/projects/{project-name}/mistakes/`). After the session ends, `gobbi mistake promote` further promotes mature mistakes from project memory to workspace-level skill storage (cross-project). Two layers, two destinations."

### C-C-03 — `.claude/CLAUDE.md` claims "5 productive steps"; gobbi/SKILL.md says "6-step state machine"

- **Type**: general
- **Domain**: docs-sync
- **Disposition**: deferred
- **Confidence**: 100
- **Severity**: High
- **Evidence**: `.claude/CLAUDE.md` (out-of-scope per Batch 4 lock) says: "Every non-trivial task follows these 5 productive steps. ... The 6-step state machine (Configuration as the CLI init phase, plus the 5 productive steps)..." This *can* be reconciled (Configuration is CLI-only; 5 productive steps + Configuration = 6 total). But gobbi/SKILL.md line 11 says: "The productive workflow runs as a 6-step state machine: Configuration → Ideation → Preparation → Planning → Execution → Wrap-up". gobbi/SKILL.md counts Configuration as productive; `.claude/CLAUDE.md` does not. Additionally, `.claude/CLAUDE.md` lists 5 productive steps as: Ideation, Planning, Execution, Memorization, Handoff — which is the v0.4.x naming. gobbi/SKILL.md uses: Configuration, Ideation, Preparation, Planning, Execution, Wrap-up. Two distinct step lists. **This is the same `.claude/CLAUDE.md` drift caught in Batch 1 — issue #259's manager entry-point SOP gap.**
- **Disposition justification**: `.claude/CLAUDE.md` is out-of-scope per the user lock; this finding is deferred to issue #259.
- **Remediation**: Out-of-scope; track at issue #259.

### C-C-04 — Subject regex max-length mismatch in conventions.md

- **Type**: general
- **Domain**: docs-sync
- **Disposition**: open
- **Confidence**: 75
- **Severity**: Medium
- **Evidence**: conventions.md line 59 subject regex: `^(feat|fix|hotfix|chore|docs|refactor|test|ci|perf|build|style)(\([a-z0-9-]+\))?!?: [a-z].{1,67}[^.]$`. Constraint at line 64: "Total subject length ≤ 72 chars."

  Math: minimum type+colon+space prefix is `ci: ` = 4 chars; max body is `[a-z]` (1 char) + `.{1,67}` (up to 67) + `[^.]` (1 char) = 69 body chars. Total max: 4 + 69 = 73 chars. With scope `(feat-flag):`, that's `feat(feat-flag): ` = 17 chars + 69 = 86 chars. The regex does not enforce the ≤72 cap; it overshoots by 1 char with the cheapest type and by much more with a scope.

  The regex enforces *body shape*, not total length. The "≤ 72" constraint is text-only.
- **Remediation**: Either (a) accept that the regex enforces shape and the length-cap is a separate textual check ("the agent verifies both the regex match AND `len(subject) <= 72` before committing"), or (b) replace the regex with a stricter form that pinpoints the cap. Option (a) is the easier path — add one sentence clarifying the regex is *not* a length validator.

### C-C-05 — Branch regex makes issue number optional but Rules table makes it required-when-applicable

- **Type**: general
- **Domain**: docs-sync
- **Disposition**: open
- **Confidence**: 50
- **Severity**: Low
- **Evidence**: conventions.md line 18 branch regex: `^(feat|fix|hotfix|chore|docs|refactor|test|ci|perf|build|style)/(\d+-)?([a-z0-9]+(-[a-z0-9]+)*)$`. The `(\d+-)?` makes the issue-number prefix optional. But the Rules table (line 41+) row "Issue number when issue exists" lists `feat/oauth-login` (no number) as a fail when issue #42 exists. The regex cannot enforce conditional presence — only the agent's procedural check can. Acceptable but worth surfacing: an agent that runs only the regex will pass cases the Rules row would fail.
- **Remediation**: Add one line: "The regex enforces shape; conditional rules (e.g., 'issue number required when issue exists') are procedural checks the agent must run alongside the regex."

## Low-confidence appendix

- **L-C-01 (confidence 25)**: principles/SKILL.md uses both "Iron Law" and "the Iron Law summary in CLAUDE.md" (line 9 and 307). The "Iron Law" + numbered principle is internal; "Iron Law summary in CLAUDE.md" cross-references a table that is out of scope here. Cross-reference is correct (Iron Law table at `.claude/CLAUDE.md` lines 30–43 per system reminder). No drift, but the absence of the same table in the skill itself (per S-S-01) makes the cross-reference load-bearing. Possibly false-positive.

## Verdict

**REVISE** — 1 High-severity finding (C-C-01, Principle 2 wording) with confidence ≥ 50, per Stage 2 rule. C-C-02 (mistake promotion layering) and C-C-04 (regex vs length cap) are Medium with confidence ≥ 50; together they push this perspective toward REVISE rather than PASS. C-C-03 deferred (out-of-scope, issue #259).

**Note**: C-C-01 is a wording-only fix in Principle 2 (option (b) — add one explanatory clause). Per Batch 3 carryover, the topology decision is locked; the principles wording needs to catch up.
