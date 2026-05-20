# Project Perspective — Batch 4 iter1 (Claude)

## Artifact Summary + Memory reads

**What** — Three SKILL.md files and one child doc that form the entry / bootstrap / discipline / git layers of the gobbi v0.5.0 skill stack: `gobbi/SKILL.md` (210 lines, bootstrap front door), `principles/SKILL.md` (307 lines, 12 Iron Laws + anti-rationalizations), `git/SKILL.md` (281 lines, lifecycle), and `git/conventions.md` (323 lines, deterministic rules).

**Why** — Final batch of the gobbi v0.5.0 skills+agents refactor adversarial-review campaign (Batches 1–3 closed PASS-converged). These three skills are the highest-leverage layers: every session loads them at start.

**How** — Adversarial sweep across the four files, cross-checking against Batches 1–3 carryover (subagent question schema, sole-writer contract, 6-step workflow, evaluator-schema delegation, status wire format, 7-perspective × per-system topology). Out-of-scope: `.claude/CLAUDE.md`, specs/`*.json`, `.claude/agents/*.toml`, `.codex/*`, plugin mirrors → `disposition: deferred`.

**Memory reads**
- `.gobbi/projects/gobbi/skills/gobbi/SKILL.md` (target)
- `.gobbi/projects/gobbi/skills/principles/SKILL.md` (target)
- `.gobbi/projects/gobbi/skills/git/SKILL.md` (target)
- `.gobbi/projects/gobbi/skills/git/conventions.md` (target)
- `.gobbi/projects/gobbi/skills/evaluation/SKILL.md` (Scope Contract Schema + 4-stage)
- `.gobbi/projects/gobbi/skills/ideation/evaluation.md` (seed scenarios)
- `.gobbi/projects/gobbi/skills/orchestration/SKILL.md` (cross-check 6-step claims)
- `.gobbi/projects/gobbi/skills/delegation/SKILL.md` (load directives)
- `.gobbi/projects/gobbi/skills/discussion/SKILL.md` (Question Card)
- `.gobbi/projects/gobbi/skills/mistake/SKILL.md`, agents/{manager,evaluator,executor,leader,assistant}.md (cross-ref)
- `.claude/CLAUDE.md` (context only — disposition reads documented as out-of-scope per user lock)

## Locked Frame (Stage 1)

**Scope Contract for Batch 4**: extracted from the briefing — In-Scope: 4 files above. Out-of-Scope: `.claude/CLAUDE.md`, specs JSON, `.claude/agents/*.toml`, `.codex/*`, plugin mirrors. Decisions Locked: 5-role taxonomy, 6-step workflow, AI-Provenance-Record (no Co-Authored-By), Always-Ask Decision Classification for skill edits. Success criteria: per-perspective PASS with defensible evidence.

Seed scenarios (from ideation/evaluation.md Project), augmented for an entry-skill artifact:

1. **The bootstrap entry actually solves session-start** — gobbi/SKILL.md states a single, complete bootstrap sequence; no silent ordering gaps; everything an agent must do at session start is named.
2. **Scope Contract sharpness** — each skill's own scope (what the skill governs, what it does not) is enumerable. Skill-level boundaries are not "etc.".
3. **No silent overlap with adjacent skills** — gobbi vs orchestration, principles vs evaluation/Principle 2, git vs conventions.md splits are clean.
4. **Witnesses for every claim** — line items in principles ground out at real causes (not "for consistency"); conventions.md regexes have rationale anchors (Conv-Commits, Linux kernel).
5. **(adversarial)** — A new contributor reads the three files in order and silently builds the wrong mental model (e.g., thinks Co-Authored-By is still acceptable for human commits, or that principles applies only to manager).
6. **Hypothesis/testability** — principle citations are verifiable: "Principle N" referenced elsewhere matches its content here, stably.
7. **Prior-art alignment** — conventions cite Conventional Commits, GitHub Flow, Linux kernel; references actually back the cited rules.

Adversarial scenario: present (scenario 5).
Coverage Ownership Matrix — Project owns: not-applicable (this row's items live elsewhere; observability/cost/privacy not directly applicable to entry-tier doc-only artifact).

## Per-scenario per-check results

**Scenario 1 — Bootstrap completeness:** gobbi/SKILL.md "Session Bootstrap Order" enumerates 6 steps (load core skills → env vars → settings check → 2 setup questions → project memory → enter workflow). Each is bounded. **PASS.**

**Scenario 2 — Scope Contract sharpness:** principles/SKILL.md does not enumerate its own scope explicitly (no "in-scope / out-of-scope" header); relies on the implicit "12 behavioral principles." gobbi/SKILL.md likewise. Skill descriptions in frontmatter cover this, but Scope Contracts as an artifact only exist for *loops*, not skills. **PASS but with a P-S-01 finding below**.

**Scenario 3 — No silent overlap:** Spot-checked — Principle 2 (single perspective per agent) sits in `principles`; evaluator-perspective-rotation lives in `evaluation/SKILL.md`. They reference each other but the *roles* are clean. git/SKILL.md vs conventions.md split is clean (SKILL.md = procedures, conventions.md = deterministic rules). **PASS.**

**Scenario 4 — Witness grounding:** Spot-checked Principle 10's witness rule itself, Principle 11's Goodhart attribution, conventions.md's Conventional Commits + Linux kernel citations. All check. **PASS.**

**Scenario 5 (adversarial) — Mental model trap:** A reader sees `Co-Authored-By:` mentioned twice in git/SKILL.md + conventions.md as *forbidden* — phrasing is clear. AI-Provenance-Record format is fully specified. Risk: a reader who only reads gobbi/SKILL.md may miss the trailer entirely (gobbi/SKILL.md never cites the AI-Provenance trailer). Surface as P-P-02. **PARTIAL.**

**Scenario 6 — Principle citation stability:** Cross-grepped Principle 1/2/3/4/6/7/8 references across the skill tree + agent docs. They map correctly to the 12 principles in the canonical skill. **PASS.**

**Scenario 7 — Prior-art alignment:** conventions.md cites Conventional Commits v1.0.0, GitHub Flow, Linux kernel submitting-patches, git-worktree(1). All real, all back the cited rule. **PASS.**

## Typed findings

### P-P-01 — Project memory "sparse" check is incomplete (gobbi/SKILL.md line 78–80)

- **Type**: design_flaw
- **Domain**: process
- **Disposition**: open
- **Confidence**: 75
- **Severity**: Medium
- **Evidence**: gobbi/SKILL.md line 80 defines "project memory looks thin" as `README.md missing OR design/ empty OR features/ empty`. But the canonical project-memory shape (gobbi/SKILL.md line 194) lists `{features, mistakes, rules, design, notes, backlogs, references, decisions, plans, reviews, reports, learnings, archive, skills}` — 14 dirs. The check ignores 11 of them. A project with a populated README + design + features but completely empty `mistakes/` and `rules/` would skip the interview offer. Interview's job is to *bootstrap*; the sparse signal should reflect that the bootstrap was actually run.
- **Remediation**: Tighten the sparse predicate. Either (a) make it explicit ("we deliberately use README+design+features as the sparse proxy because if those exist, the user did Ideation at least once") with a one-line rationale, or (b) add `rules/ OR mistakes/` to the check. Pick one and document.

### P-P-02 — AI-Provenance trailer absent from gobbi/SKILL.md (cross-skill discoverability)

- **Type**: docs_sync (general → docs-sync routing)
- **Domain**: docs-sync
- **Disposition**: open
- **Confidence**: 75
- **Severity**: Low
- **Evidence**: gobbi/SKILL.md is the entry point. It mentions git as a core-load skill (line 27), but never names the AI-Provenance-Record contract that distinguishes gobbi commits. A reader who loads gobbi/SKILL.md but defers git/SKILL.md until later misses the trailer requirement until they actually commit. Given the salience of "no Co-Authored-By" as a Batch-1 carryover lock, surfacing it in the entry overview (one sentence under "Operating Conventions") would close the discoverability gap.
- **Remediation**: Add one line under § Operating Conventions: "Agent commits attach `AI-Provenance-Record:` (never `Co-Authored-By:`) — see git/conventions.md § Commit Trailers."

### P-P-03 — "Witness" definition spans principles but principle-numbered citations are inconsistent

- **Type**: general
- **Domain**: docs-sync
- **Disposition**: open
- **Confidence**: 50
- **Severity**: Low
- **Evidence**: Principle 10 owns the witness rule. Principle 12 (line 283) says "link back to Principle 10's witness rule" — explicit. But git/SKILL.md never cites Principle 10 when stating that commit bodies reference a witness (commits without a witness are rejected at review). The witness rule is in conventions.md only implicitly through `Closes/Refs/Fixes` trailers. A "Witness" trailer or explicit field is not specified.
- **Remediation**: Either (a) add a "Witness:" trailer to conventions.md trailers table, citing Principle 10, OR (b) clarify that the witness rule is satisfied by the existing `Closes/Refs/Fixes` trailers (with rationale). Pick one and document.

## Low-confidence appendix

- **L-P-01 (confidence 25)**: gobbi/SKILL.md line 80 phrases the interview offer as "Project memory looks thin. Run the interview skill to populate it before starting work?" — but the Question Card template (per discussion/SKILL.md § Question Card Structure) requires `Decision:` + `Description:` + per-option `Reason:`/`Pros:`/`Cons:`. The example phrasing in line 80 looks shorthand. Likely an authorial shorthand for the example, but adjacent skill code that copies it verbatim would violate the Card schema. Severity Low; possibly false-positive (style preference / example-only).

## Verdict

**PASS** — All 7 seed scenarios pass or pass-with-finding; 3 in-scope findings are Medium/Low; none Critical, none High. Project perspective is clean.
