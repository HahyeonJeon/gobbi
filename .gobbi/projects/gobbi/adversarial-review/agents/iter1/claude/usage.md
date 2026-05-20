# Usage Perspective — 5-Role Agent Taxonomy (iter1, claude)

## Artifact Summary + W/W/H

See `project.md`. Usage = the next consumer's POV — the operator running gobbi, the future-self maintaining these definitions, the manager subagent looking up "which role do I delegate to?", the evaluator looking up "what perspective am I?".

## Memory reads

- `agents/*.md`
- `delegation/SKILL.md` § Agent Roster (line 217) — primary consumer reference
- `evaluation/SKILL.md` § Perspectives (line 85) — primary consumer reference

## Locked Frame (Stage 1)

### S-U-1: A new operator at 3am reads one of these files and knows what the role does
- [ ] First paragraph answers "what is this role?"
- [ ] Out-of-scope precedes lifecycle (sets boundaries before procedure)
- [ ] Status enum is unambiguous

### S-U-2: A manager subagent (or human reading the manager's spec) can decide "which role do I spawn for this work?"
- [ ] The 5 files together exhaust the work categories — no work falls between roles
- [ ] When two roles could apply, a tiebreaker exists

### S-U-3: An evaluator subagent reads evaluator.md + the brief and knows which perspective doc to load
- [ ] evaluator.md's perspective vocabulary matches evaluation/SKILL.md exactly
- [ ] The path template `{target-type}/evaluation/{perspective}.md` resolves to an existing file

### S-U-4 (adversarial): A consumer forms the wrong mental model
- [ ] "leader" terminology — does the role-name pattern leak the wrong concept (industry "team lead" vs gobbi "PI/PM")?
- [ ] "(or leader)" alternates in manager.md:84 — operator cannot decide which to pick

### S-U-5: Status contract enum disambiguation
- [ ] `DONE_WITH_CONCERNS` vs `NEEDS_CONTEXT` boundary is clear from the agent file
- [ ] `BLOCKED` is reserved for unrecoverable state
- [ ] Can two statuses co-occur (e.g., BLOCKED + NEEDS_CONTEXT)? Disambiguation rule given?

### S-U-6 (Accessibility / I18n — Coverage Matrix Usage)
- not-applicable: these agent files are agent-facing markdown specs; no UI, no human end-user strings. Operator accessibility (scannable headings, skip-friendly structure) is verified under S-A-3 in aesthetics.md

### S-U-7 (Observability — Coverage Matrix Usage)
- [ ] Each agent's status output is observable (parseable by manager)
- [ ] Each agent's failure modes are communicated by the status contract

## Per-scenario per-check results (Stage 2)

### S-U-1
- (a) First paragraph self-describes: **YES** — all 5 files
- (b) Out-of-scope first: **YES**
- (c) Status enum unambiguous: **NO** — see S-U-5

### S-U-2
- (a) Roles exhaust work: **NO** — Memorization and Wrap-up phases have no clear role owner (F-P-05 from project.md). Synthesizer role missing (F-P-08) → carry-forward
- (b) Tiebreaker for "(or leader)" cases: **NO** — manager.md:84 "executor (or leader)" — no rule for choosing → **F-U-01**

### S-U-3
- (a) Vocabulary matches: **NO** — `architecture`/`user` in evaluator.md vs `Structure`/`Usage` in evaluation/SKILL.md (already F-A-02). For Usage, the consequence is the *operator* sees a different vocabulary in two places and cannot resolve → **F-U-02** (cross-perspective amplifier)
- (b) Path template resolves: **PARTIAL** — evaluator.md:40 says `agents/evaluation/{perspective}.md` for evaluating an agent — but `agents/evaluation/` does not exist as a directory; the bundle is the 5 role files only. No per-perspective evaluation child docs under `agents/` → **F-U-03**

### S-U-4 (adversarial)
- (a) Leader name confusion: see F-A-01 — low severity
- (b) "(or leader)" ambiguity: **YES — F-U-01**

### S-U-5 — Status contract disambiguation
- (a) DONE_WITH_CONCERNS vs NEEDS_CONTEXT: leader.md:108-111, executor.md:96-99 — the boundary is "concerns" (you completed but flag things) vs "context" (you cannot complete without more input). The wording is clear, but **co-occurrence is unaddressed**: what if you completed the work AND need additional context for the next step? → **F-U-04**
- (b) BLOCKED reserved: **YES**
- (c) Disambiguation rule: **NO** — no agent file states "statuses are mutually exclusive; pick the most severe; if X and Y co-occur, prefer X" → **F-U-04 (linked)**

### S-U-7
- (a) Observable: **YES** — manager.md:116 "parses the status line first"
- (b) Failure modes via status: **YES** — 4-state enum covers it

## Typed findings (Stage 2)

| ID | Type | Domain | Disposition | Confidence | Severity | Evidence | Why it matters |
|---|---|---|---|---|---|---|---|
| **F-U-01** | `design_flaw` | `process` | open | **100** | High | manager.md:84 "spawn an executor (or leader) with the `memorization` skill load directive" — no tiebreaker | Manager cannot decide deterministically. Two managers with same input choose differently. Defeats "deterministic delegation" goal of delegation/SKILL.md |
| **F-U-02** | `design_flaw` | `docs-sync` | open | **100** | High | evaluator.md:12 lists `project, overall, architecture, performance, aesthetics, usage, consistency, risk, user`; evaluation/SKILL.md:85 fixes 7 + Overall. Operator sees both | A delegating manager passes `perspective: architecture`; evaluator child doc lookup fails because evaluation/SKILL.md has no "architecture" perspective. Delegation breaks at runtime |
| **F-U-03** | `scenario_gap` | `docs-sync` | open | 75 | High | evaluator.md:40 `agents/evaluation/{perspective}.md` — that directory does not exist in the bundle; this very review wrote outputs to `adversarial-review/agents/iter1/claude/` instead | Agent told to load a doc that doesn't exist. Either the doc must be created, or the agent file must redirect to evaluation/SKILL.md's child docs (`ideation/evaluation.md` etc.) |
| **F-U-04** | `scenario_gap` | `process` | open | 75 | Medium | No agent file states mutual-exclusion semantics for status enum; co-occurrence not addressed | Operator who built work but needs follow-up context picks one status and loses information; manager dispatches deterministically on wrong status |

## Per-perspective verdict

**FAIL** — F-U-02 (High/100) breaks delegation at runtime: an evaluator spawned with perspective `architecture` or `user` will fail to find its child doc. F-U-03 (High/75) reinforces. F-U-01 (High/100) defeats determinism. The bundle is unusable as written for evaluation dispatch.

## Low-confidence appendix

(none below threshold)
