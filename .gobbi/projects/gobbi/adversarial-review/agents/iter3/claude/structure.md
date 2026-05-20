# Structure Perspective — 5-Role Agent Taxonomy (iter3, claude)

## Artifact Summary + W/W/H

See `project.md`. Structure = 5-file decomposition coherence + cross-file coupling + drift detector presence (the iter2 stuck Critical).

## Memory reads

- `iter2/claude/structure.md` (inheritance — 7 findings, 1 stuck Critical: F-S-04)
- `iter2/claude/overall.md` § Stuck findings table
- `agents/*.md` (full)
- `skills/delegation/SKILL.md` (Agent Roster lines 217-223)
- `skills/mistake/SKILL.md`
- `skills/git/SKILL.md` (iter3 Fix 4 § Forbidden Operations)

## Locked Frame (Stage 1)

### S-S-1 (inherited, addressed in iter2): Memorization owner single (F-S-01)
- [ ] Single role owns Memorization; verify no regression

### S-S-2 (inherited, open): Leader Write tool surface (F-S-02)
- [ ] leader.md Write tool surface narrowed or policy-gate enforceable

### S-S-3 (inherited, open partial improvement): Hub-and-spoke fragility (F-S-03)
- [ ] Manager phase-table completeness
- [ ] Recovery mechanism for misroute

### S-S-4 (inherited, iter1 Critical now disputed per iter3): Drift detector (F-S-04)
- [ ] Per iter3 contract, F-S-04 = disputed. Verify the disputed disposition is documented in a discoverable location

### S-S-5 (inherited, open Low): Implicit ideation Sub-step C coupling (F-S-05)

### S-S-6 (adversarial inherited): Coordinator anti-pattern

### S-S-7 (inherited iter2 NEW): mistake skill placement + peer-conformance
- [ ] Verify no regression in mistake skill shape

### S-S-8 (inherited iter2 NEW): assistant two-mode shape (F-S-NEW-02)
- [ ] Two modes (MEMORIZATION + lookup) in assistant.md — bleed check post-Fix 3

### S-S-9 (adversarial NEW iter3): Did Fix 1 introduce dangling refs of its own?
- [ ] executor.md:30 `orchestration/workflow/execution.md` exists
- [ ] executor.md:34 `execution` skill exists; `git` skill exists
- [ ] No new dangling references introduced

### S-S-10 (adversarial NEW iter3): Did Fix 4 introduce structural drift in git/SKILL.md?
- [ ] git/SKILL.md issue #258 reference is structurally appropriate (not breaking the Forbidden Operations table contract)

## Per-scenario per-check results (Stage 2)

### S-S-1 (F-S-01)
- (a) Single owner: manager.md:34-38 + manager.md:86-87 + assistant.md:12 still align → **addressed (carry from iter2)**

### S-S-2 (F-S-02)
- (a) leader.md:4 `tools: AskUserQuestion, Read, Grep, Glob, Bash, WebSearch, WebFetch, Write` — Write still granted
- (b) leader.md:15 still policy-gates: "No `Write`-tool calls on source code, no `Edit`. Your `Write` access is for ideation / preparation / research / planning artifacts only." Unchanged from iter2.
- (c) NEW iter3 angle: the AskUserQuestion-grant-vs-prose contradiction exists ON THE SAME LINE in leader.md. The Write contradiction (Write granted + policy-only-for-artifacts) and the AskUserQuestion contradiction (AskUserQuestion granted + "do not call directly") are the same anti-pattern. → **open (carry from iter2); see F-P-iter3-NEW-01 (Project) for the cross-cutting parallel**

### S-S-3 (F-S-03 — hub fragility)
- (a) Manager phase table: 6 phases including Preparation (manager.md:33-38). Same as iter2.
- (b) Recovery mechanism for misroute: still none. F-R-06 carry-forward (Risk perspective owns).
- → **open (carry from iter2)**

### S-S-4 (F-S-04 — drift detector, iter1 Critical, iter3 disputed)
- (a) Drift detector: still absent from CI/lint/schema (verified — no test file or lint target asserts agents/*.md ↔ delegation/SKILL.md sync)
- (b) iter3 Fix 4: git/SKILL.md:123 adds explicit disclosure: "Cross-layer drift is not yet detected automatically. Until issue #258 lands, every PR that touches multiple layers ... must be hand-reviewed for drift via adversarial review per `evaluation/SKILL.md`. See issue #258 for the planned validator."
- (c) Placement: directly under § Forbidden Operations header, before § Safe-list exceptions. Discoverable.
- (d) The fix moves the gap from "silent absence of mechanism" to "explicit disclosure with backlog pointer". For the project's documentation discipline this is acceptable per the iter3 contract.
- → **F-S-04 disposition: disputed (per manager-supplied iter3 contract)**

### S-S-5 (F-S-05)
- (a) leader.md:33 still says "loaded by ideation Sub-step C". Unchanged from iter2. → **open (Low, carry)**

### S-S-6 (adversarial — coordinator)
- (a) manager.md:15 single-line-edits exception unchanged. F-P-07 (Project) covers.

### S-S-7 (mistake skill peer-conformance)
- (a) skills/mistake/SKILL.md unchanged in iter3. iter2 verification still holds. No regression. → **F-S-NEW-01 (verification) addressed**

### S-S-8 (assistant two-mode bleed)
- (a) assistant.md:10 still declares two modes
- (b) iter3 Fix 3 added Write + Edit to frontmatter — this **strengthens** the two-mode clarity because the description text (line 3) now explicitly says "Has Write/Edit access bounded to session staging during MEMORIZATION + Wrap-up phases ...; read-only in lookup mode." That clarifies the bleed.
- (c) Lifecycle section (lines 50-93): Memorize lifecycle (lines 86-93) still tries to cover both modes briefly; the Fix 3 description tightening helps but does not collapse the structural noise iter2 flagged.
- → **F-S-NEW-02 (iter2): open (carry, Medium); slightly improved by Fix 3 description**

### S-S-9 (NEW iter3 — Fix 1 dangling-ref check)
- (a) `skills/orchestration/workflow/execution.md` → verified present (ls returned the file)
- (b) `skills/execution/SKILL.md` → verified present (ls confirmed `execution` is one of 16 existing skills)
- (c) `skills/git/SKILL.md` → verified present
- (d) executor.md:35 references `.claude/` and issue #258 — not a skill load target; cleanly deferred
- (e) No new dangling refs introduced by Fix 1. → **F-EXEC-DANGLING addressed cleanly**

### S-S-10 (NEW iter3 — Fix 4 structural drift)
- (a) git/SKILL.md:123 note placement: directly below the Forbidden Operations table, before the Safe-list exceptions section. Structurally clean.
- (b) The note is in prose paragraph form, not a table-row addition. Acceptable — disclosure pattern, not contractual table-of-prohibitions.
- (c) The note references issue #258 (concrete) — the surrounding Forbidden Operations table is unchanged. No table contract violated.
- (d) git/SKILL.md still loads its frontmatter `allowed-tools: Read, Grep, Glob, Bash, Write` — unchanged from iter2. Fix 4 was a content addition only.
- → **no finding**

## Typed findings (Stage 2)

| ID | Type | Domain | Disposition | Confidence | Severity | Evidence | Why it matters |
|---|---|---|---|---|---|---|---|
| **F-S-01** | `design_flaw` | `process` | addressed (carry) | 100 | n/a | manager.md:34-38; assistant.md:12 | iter1 High closed in iter2; preserved in iter3 |
| **F-S-02** | `assumption_risk` | `security` | open (carry) | 75 | Medium | leader.md:4 Write still in tools; policy-gates only | Same as iter2 |
| **F-S-03** | `design_flaw` | `process` | open (carry) | 75 | High → effective Medium | No misroute recovery mechanism; F-R-06 covers | Same as iter2 |
| **F-S-04** | `scenario_gap` | `docs-sync` | **disputed (per iter3 contract)** | n/a | n/a | git/SKILL.md:123 explicit cross-layer disclosure + issue #258 reference | Per manager contract: drift detector tracked as #258 follow-up |
| **F-S-05** | `assumption_risk` | `docs-sync` | open (carry) | 50 | Low | leader.md:33 unchanged | Carry-forward |
| **F-S-NEW-01** | `general` | `docs-sync` | addressed (verification, carry) | 100 | n/a | mistake skill unchanged, peer-conformant | Carry from iter2 |
| **F-S-NEW-02** | `design_flaw` | `process` | open (carry, slightly improved) | 50 | Medium | assistant.md two-mode lifecycle bleed mitigated by Fix 3 description tightening | Two-mode role file remains noisier than peer 1-mode files |
| **F-S-iter3-NEW-01** | `general` | `docs-sync` | addressed (verification) | 100 | n/a | Fix 1 references `execution` + `git` skills + `.claude/`-defer-to-#258 — all targets exist | Fix 1 introduces no new dangling refs |
| **F-S-iter3-NEW-02** | `general` | `docs-sync` | addressed (verification) | 100 | n/a | Fix 4 note placement under Forbidden Operations is structurally clean | Fix 4 introduces no structural drift in git/SKILL.md |

## Per-perspective verdict

**PASS** — Per the iter3 contract, F-S-04 is disputed (not open). No open Critical findings; the open High (F-S-03 carry-forward, effective Medium) is unchanged from iter2 and not in iter3 REVISE scope. iter3 fixes (1 + 4) verified structurally clean — no new dangling refs introduced, no table contract violated.

Per the threshold rule: no Critical ≥ 75; no NEW High in this perspective's open-finding set; **PASS**.

This is a meaningful upgrade from iter2 FAIL (which hung on F-S-04 Critical/100). The disputed disposition is user-locked per iter3 contract, and Fix 4 records the gap explicitly with a backlog pointer — that pattern moves Structure from FAIL to PASS for the bundle's purposes.

Cross-perspective note: the AskUserQuestion frontmatter contradiction (F-P-iter3-NEW-01) is structurally similar to F-S-02's Write-tool-vs-policy split, but its primary owner is the Project perspective (the role boundary contract). Structure records it as a parallel finding pattern.

## Low-confidence appendix

- F-S-05 (Low/50) — carry-forward
