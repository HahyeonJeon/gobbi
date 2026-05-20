# Consistency Perspective — 5-Role Agent Taxonomy (iter2, claude)

## Artifact Summary + W/W/H

See `project.md`. Consistency = sync between the 5 files + their dependencies (CLAUDE.md, delegation, evaluation, mistake, principles).

## Memory reads

- `iter1/claude/consistency.md` (inheritance — 6 findings, 3 of them Critical)
- `agents/*.md`
- `skills/delegation/SKILL.md`
- `skills/evaluation/SKILL.md` § Perspectives + Finding Metadata
- `skills/mistake/SKILL.md` (new)
- `skills/principles/SKILL.md`
- `.claude/CLAUDE.md` (user-locked, for deferred-disposition judgment only)

## Locked Frame (Stage 1)

### S-C-1 (inherited): 5 agent files share vocabulary
- [ ] Status enum names
- [ ] Lifecycle section names

### S-C-2 (inherited): Agent Roster sync
- [ ] delegation/SKILL.md:217-223 table matches role files

### S-C-3 (inherited iter1 Critical): Evaluator schema matches evaluation/SKILL.md (F-C-01)
- [ ] Type / Domain / Disposition / Confidence / Severity all aligned
- [ ] Verdict threshold rule matches (F-C-02)

### S-C-4 (inherited iter1 Critical): Workflow phase list canonical (F-C-03/04)
- [ ] CLAUDE.md ↔ delegation ↔ agent files agree on phase enumeration

### S-C-5 (inherited): Principles citations supported
- [ ] Principle references inside role files match principle text

### S-C-6 (adversarial inherited): Cross-file references resolve
- [ ] mistake skill exists (F-C-05 — iter1 Critical)
- [ ] orchestration/workflow/{phase}.md targets exist
- [ ] Tool surfaces match prose (F-C-06)

### S-C-7 (Privacy / Licensing) — not-applicable

### S-C-8 (NEW iter2): Two AskUserQuestion exception lists (regression from F-U-NEW-01)
- [ ] manager.md ↔ assistant.md statement of "only exception(s)" agrees

### S-C-9 (NEW iter2): Mistake skill internal consistency
- [ ] Procedures P1-P4 internally consistent + cross-skill refs (memorization, wrap-up, evaluation) resolve

## Per-scenario per-check results (Stage 2)

### S-C-1
- (a) Status enum: all 5 files use the 4-state enum or its manager-translated equivalent. Consistent.
- (b) Lifecycle subsections: 5 files use Study/Plan/Execute/Verify/Memorize (evaluator uses Study/Assess/Report — phase-appropriate variance). Consistent.

### S-C-2
- (a) Role names: match across `agents/*.md` and `delegation/SKILL.md:217-223`
- (b) Models: opus/opus/sonnet/opus/sonnet — match
- (c) Descriptions: aligned

### S-C-3 (F-C-01, F-C-02 — iter1 Critical + High)
- **F-C-01 addressed**: evaluator.md:35 + delegation/templates/evaluator.md:90 both load Finding schema from `evaluation/SKILL.md`. No local schema definition. Domain + Disposition fields present (evaluator.md:79-82).
- **F-C-02**: evaluator.md:87 says "any Critical finding with confidence ≥ 75 → `FAIL`; any High with confidence ≥ 50 → `REVISE`; otherwise → `PASS`" — matches `evaluation/SKILL.md:242` thresholds EXACTLY. → **F-C-02 addressed**

### S-C-4 (F-C-03, F-C-04 — iter1 Critical + High)
- delegation/SKILL.md:213 "Canonical phase list: `.claude/CLAUDE.md`. All agent + skill docs align to Configuration → Ideation → Preparation → Planning → Execution → Wrap-up"
- manager.md:40 "Canonical phase list: Configuration → Ideation → Preparation → Planning → Execution → Wrap-up"
- leader.md:32-34 lists ideation / preparation / research / planning (Research positioned as a phase tag the leader receives in a brief; reconciled by Research = Ideation sub-step C per `leader.md:33` parenthetical)
- `.claude/CLAUDE.md` (user-locked): still lists "Ideation → Planning → Execution → Memorization → Handoff" (5 productive steps + Configuration) — **does NOT match** delegation/manager's "Configuration → Ideation → Preparation → Planning → Execution → Wrap-up"
- For the bundle: agent + delegation files agree on canonical list → **F-C-03 disposition: addressed (bundle-internal); CLAUDE.md drift = deferred (user-locked, see prompt's out-of-scope clause)**
- The CLAUDE.md drift is a real consistency gap that the user lock specifically excludes from iter2 regression scope. Recording as `deferred` with backlog pointer below.
- F-C-04 (research as a phase): leader.md:33 mitigates by noting Research is "loaded by ideation Sub-step C, or whenever the brief calls for it". The leader receives Research as a brief tag, not as a separate state-machine phase. Marginal — **F-C-04 disposition: addressed**

### S-C-5
- Principle citations checked: evaluator.md:12 cites Principle 2; principles/SKILL.md:48 confirms. executor.md:102 cites 3-strike rule (Principle 1); principles/SKILL.md:40 confirms. Consistent.

### S-C-6 (F-C-05 + F-C-06)
- **F-C-05** (mistake skill absent): `skills/mistake/SKILL.md` NOW EXISTS (created in iter2 Task B). 133 lines, peer-conformant shape. → **F-C-05 disposition: addressed (canonical project path); deferred for the runtime `.claude/skills/mistake/` symlink which is out-of-scope per user lock**
  - Verified: `.claude/skills/mistake/` does NOT exist as a symlink, but `.claude/skills/principles/` also does NOT exist (the actual symlink is `.claude/skills/gobbi-principles/`). Both are runtime-infrastructure concerns flagged as user-locked out-of-scope in the prompt's "Out-of-scope" list. Note for backlog: the `.claude/skills/` runtime tree is inconsistent with the in-bundle skill names (`principles` and `mistake`); this is real but deferred.
- **F-C-06** (assistant Write tool missing): assistant.md:5 frontmatter still lists tools as `Read, Grep, Glob, Bash, WebSearch, WebFetch` — NO Write. But assistant.md:17 says "Write surface: `sessions/{date}-{session-id}/{loop}/staging/`…" — assistant needs Write to do MEMORIZATION + Wrap-up WORK. **Tool-vs-policy regression persists**: the iter2 expansion of assistant's role (Task C + F) made the Write-tool absence MORE acute, not less. assistant.md:18 even says "This is the **sole project-memory write surface** in the entire workflow" — under what tool? → **F-C-06 disposition: open (newly more severe in iter2 — regression class)**

### S-C-8 (NEW iter2 — AskUserQuestion exception consistency)
- See usage.md F-U-NEW-01. Same finding from a different lens — Consistency owns the cross-file lexical contradiction. → **F-C-NEW-01** (High/100, regression)

### S-C-9 (NEW iter2 — mistake skill internal consistency)
- P3 staging path: `sessions/.../staging/decisions/{slug}.md` with `mistake-candidate: true` (skill line 86)
- This matches `evaluation/SKILL.md:338` (Domain `process` routing: "staging/decisions/{slug}.md with frontmatter `mistake-candidate: true`")
- Wrap-up promotion table at mistake/SKILL.md:121-124 matches the routing convention
- No internal contradictions

## Typed findings (Stage 2)

| ID | Type | Domain | Disposition | Confidence | Severity | Evidence | Why it matters |
|---|---|---|---|---|---|---|---|
| **F-C-01** | `design_flaw` | `docs-sync` | **addressed** | 100 | n/a | evaluator.md:35 + delegation/templates/evaluator.md:90 delegate schema to evaluation/SKILL.md | iter1 Critical resolved |
| **F-C-02** | `design_flaw` | `process` | **addressed** | 100 | n/a | evaluator.md:87 verdict thresholds match evaluation/SKILL.md:242 | iter1 High resolved |
| **F-C-03** | `design_flaw` | `docs-sync` | **addressed (bundle) / deferred (CLAUDE.md)** | 100 | n/a | manager.md:40 + delegation/SKILL.md:213 agree; CLAUDE.md user-locked | iter1 Critical resolved at bundle scope |
| **F-C-04** | `design_flaw` | `docs-sync` | **addressed** | 75 | n/a | leader.md:33 reconciles Research as Ideation sub-step C | iter1 High resolved |
| **F-C-05** | `design_flaw` | `process` | **addressed (bundle) / deferred (runtime symlink)** | 100 | n/a | skills/mistake/SKILL.md exists; runtime .claude/skills/mistake/ absent but user-locked out-of-scope | iter1 Critical resolved at bundle scope |
| **F-C-06** | `design_flaw` | `docs-sync` | **open (worse than iter1)** | 100 | **High** | assistant.md:5 no Write tool; assistant.md:12,17,18 + Task C/F expansion now make assistant the **sole project-memory writer** without the tool | iter1 was Medium; iter2 expanded the role without granting the tool — regression in severity |
| **F-C-NEW-01** | `design_flaw` | `docs-sync` | open | 100 | **High (regression)** | manager.md:12 "Interview is the only named exception"; assistant.md:27 "Wrap-up WORK step 4 is the single exception" | Two REVISE tasks landed contradictory exception statements |
| **F-C-DEF-01** | `general` | `docs-sync` | **deferred** | 75 | Medium | .claude/CLAUDE.md phase list ("Ideation → Planning → Execution → Memorization → Handoff") doesn't match canonical bundle list ("Configuration → Ideation → Preparation → Planning → Execution → Wrap-up") | Real consistency gap; user-locked out of iter2 scope. Backlog: align CLAUDE.md to bundle canonical list (or vice versa) |
| **F-C-DEF-02** | `general` | `process` | **deferred** | 75 | Medium | .claude/skills/ has `gobbi-principles/` but agents reference `principles`; no `mistake/` symlink; runtime resolution unclear | Runtime tree out-of-scope per user lock. Backlog: reconcile `.claude/skills/` with in-bundle skill names |

## Per-perspective verdict

**FAIL** — F-C-06 (High/100, **worsened from iter1 Medium to iter2 High** by Task C+F role expansion without tool grant) + F-C-NEW-01 (High/100, regression from Task E+F interaction). No Criticals remain — but the regression class is the dominant signal.

iter1 had **3 Criticals** (F-C-01, F-C-03, F-C-05) — all addressed. That is genuine progress. iter2 introduced 1 new High (F-C-NEW-01) and worsened 1 inherited Medium to High (F-C-06).

Per the rule (no Critical ≥ 75; one or more High ≥ 50): **REVISE**.

But for cross-perspective Overall judgment: iter1 was FAIL on 3 Criticals; iter2 is REVISE on 2 Highs — fix-to-introduce ratio favors iter2, net improvement.

## Low-confidence appendix

(none below threshold)
