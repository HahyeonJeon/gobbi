# Usage Perspective — 5-Role Agent Taxonomy (iter5, claude)

## Artifact Summary + W/W/H

See `project.md`. Usage = next-consumer POV (operator, manager subagent, evaluator subagent, fresh subagent loaded by the manager).

## Memory reads

- `iter4/claude/usage.md` (REVISE — F-U-iter4-NEW-01 + -02 High/100)
- `agents/*.md`
- `skills/gobbi/SKILL.md` (Fix 2 target)
- `skills/orchestration/workflow/preparation.md` (Fix 1 target)
- `agents/{leader,executor,evaluator,assistant}.md` (Fix 5 targets)
- `skills/delegation/SKILL.md` (Fix 4 + Fix 5 targets)
- `agents/manager.md` (Fix 3 target)

## Locked Frame (Stage 1)

### S-U-1 (inherited): 3am operator reads one file knows the role
### S-U-2 (inherited, addressed): `(or X)` ambiguity (F-U-01)
### S-U-3 (inherited, addressed Sweep 3): Evaluator path templates (F-U-03)
### S-U-4 (adversarial inherited): Terms consistent
### S-U-5 (inherited, open): Status enum co-occurrence (F-U-04)
### S-U-6 (Accessibility / I18n): not-applicable
### S-U-7 (Observability): status output parseable
### S-U-8 (iter2 NEW, addressed): AskUserQuestion manager-owned (F-U-NEW-01)
### S-U-9 (iter3 NEW, addressed): wrap-up/SKILL.md AskUserQuestion contract
### S-U-10 (iter4 carry, candidate close): Fresh subagent reads conflicting mistake-skill claim (F-U-iter4-NEW-01)
### S-U-11 (iter4 carry, candidate close): Fresh leader reads conflicting preparation.md (F-U-iter4-NEW-02)
### S-U-12 (NEW iter5): Fresh subagent reads wrong-phase-dispatch — do they know what to do?
### S-U-13 (NEW iter5): Fresh reader of delegation/SKILL.md — does the cross-pollination note land cleanly?
### S-U-14 (NEW iter5 adversarial): Does the retirement map answer a fresh reader's "what happened to v0.4 roles?" question?

## Per-scenario per-check results (Stage 2)

### S-U-1 — first paragraph self-describes for each of 5 roles ✓

### S-U-2 (F-U-01) — addressed (carry)

### S-U-3 (F-U-03) — addressed (carry from Sweep 3)

### S-U-4 — carry F-A-01 Low

### S-U-5 (F-U-04) — open (Medium, carry)

### S-U-7 — status output parseable

### S-U-8 (F-U-NEW-01) — addressed (carry)

### S-U-9 (F-U-iter3-NEW-01) — addressed (carry)

### S-U-10 (F-U-iter4-NEW-01 — fresh subagent + mistake skill)
- gobbi/SKILL.md:154 (post-Fix-2): "The `mistake` skill lives at `skills/mistake/SKILL.md`. Every agent MUST load it before starting work."
- A fresh subagent reading gobbi/SKILL.md gets: skill exists, path is `skills/mistake/SKILL.md`, MUST load before starting
- This matches the Load Directives in every delegation template, matches CLAUDE.md project instructions, and matches the filesystem
- Zero conflicting mental models. ✓
- → **F-U-iter4-NEW-01 disposition: addressed (Fix 2)**

### S-U-11 (F-U-iter4-NEW-02 — fresh leader + preparation.md)
- preparation.md (post-Fix-1) reads as a single coherent contract: leader stages → Wrap-up promotes
- Lines 10, 64, 72, 88-92 all agree
- preparation/SKILL.md:30 Memory Access Matrix says project memory READ-ONLY for leader
- Cross-doc consistency: orchestration workflow doc + role skill doc + wrap-up sole-writer claim ALL agree
- Fresh leader subagent reading these files forms a single, consistent mental model: "I stage, Wrap-up promotes"
- → **F-U-iter4-NEW-02 disposition: addressed (Fix 1)**

### S-U-12 (NEW iter5 — wrong-phase-dispatch usability)
- A fresh subagent receiving a wrong-phase delegation reads its own role doc's BLOCKED sub-bullet:
  - leader.md:112 — instructs emit `BLOCKED` with `reason: wrong-phase-dispatch` + one-line redirect
- The role-specific example in each doc ("e.g., a leader receiving an implementation task") teaches the consumer what counts as wrong-phase
- The manager-side handling in delegation/SKILL.md:126 says "**Re-dispatch**, not abort" — so the subagent's BLOCKED is not session-terminal
- 3am test: a tired subagent reading "this task belongs to executor — please re-dispatch" knows exactly what to write and what happens next
- → no NEW finding; Fix 5 is highly usable

### S-U-13 (NEW iter5 — delegation cross-pollination note readability)
- Reader walking delegation/SKILL.md hits per-role templates table, then the "Cross-pollination mechanism" paragraph at line 52
- Paragraph names: (a) what was retired (v0.4.x dual-stance), (b) what replaces it (single leader per dispatch + dual-system evaluation), (c) why the new shape works (Claude/Codex divergence as anti-groupthink signal), (d) where to read more (`orchestration/workflow/evaluation.md` § Why dual-system is mandatory)
- The note answers the question "Wait, where's the dual-stance from v0.4?" without forcing a reader to dig through the retirement map
- → no NEW finding; well-positioned

### S-U-14 (NEW iter5 — retirement map answers fresh reader)
- A fresh contributor opening `agents/manager.md` reaches "## Retirement map (v0.4.x → v0.5.0)" at line 46
- Encounters a 3-column table covering all 6 retired v0.4.x roles
- Each row has Notes that explain the consolidation rationale
- Pre-iter5: a fresh contributor reading `agents/` for the first time would need to grep across 4 prior sessions' worth of memory to figure out what `pi`/`researcher`/`gobbi-agent`/`agent-evaluator`/`project-evaluator`/`skills-evaluator` were and where they went
- Post-iter5: the answer is the first piece of context in manager.md, the entry-point agent
- One minor note (overlap with S-S-12 finding): manager.md row 1 cross-reference "see delegation/SKILL.md § Anti-trust Block" points to a section that does NOT actually carry the cross-pollination content (it lives at delegation/SKILL.md:52 under "Per-role Templates"). A fresh reader following the cross-ref to "Anti-trust Block" reads about the evaluator anti-trust contract instead of the cross-pollination mechanism. They eventually find it by scrolling, but the cross-ref is imprecise.
- → **F-U-iter5-NEW-01** (Low/50 — minor cross-reference target precision in manager.md retirement map; reader resolves it but spends 30 sec)

## Typed findings (Stage 2)

| ID | Type | Domain | Disposition | Confidence | Severity | Evidence | Why it matters |
|---|---|---|---|---|---|---|---|
| **F-U-01** | `design_flaw` | `process` | addressed (carry) | 100 | n/a | `(or X)` 0 hits | Carry |
| **F-U-02** | `design_flaw` | `docs-sync` | addressed (carry) | 100 | n/a | Carry | Carry |
| **F-U-03** | `scenario_gap` | `docs-sync` | addressed (Sweep 3, carry) | 100 | n/a | evaluator.md negative ratchet | Carry |
| **F-U-04** | `scenario_gap` | `process` | open (carry) | 75 | Medium | Status co-occurrence rule still absent | Carry |
| **F-U-NEW-01** | `design_flaw` | `docs-sync` | addressed (carry) | 100 | n/a | manager.md ↔ assistant.md aligned | Carry |
| **F-U-iter3-NEW-01** | `design_flaw` | `docs-sync` | addressed (Sweep 1, carry) | 100 | n/a | wrap-up consistency | Carry |
| **F-U-iter4-NEW-01** | `design_flaw` | `docs-sync` | **addressed (Fix 2)** | 100 | n/a | gobbi/SKILL.md:154 + filesystem + executor.md aligned | iter4 regression closed |
| **F-U-iter4-NEW-02** | `design_flaw` | `docs-sync` | **addressed (Fix 1)** | 100 | n/a | preparation.md ↔ preparation/SKILL.md ↔ wrap-up — all agree | iter4 regression closed |
| **F-U-iter5-NEW-01** | `general` | `docs-sync` | open (NEW iter5, minor) | 50 | Low | manager.md retirement map row 1 cross-references "Anti-trust Block" but the cross-pollination content lives earlier under "Per-role Templates" — reader spends 30 sec resolving | Reader-traceability minor |

## Per-perspective verdict

**PASS** — Both iter4 High/100 regressions closed cleanly (F-U-iter4-NEW-01 + -02). Fix 5 + Fix 4 + Fix 3 all enhance Usage. One Low/50 finding introduced (cross-reference precision).

Per the rule: no Critical ≥ 75; no High ≥ 50 in `open` / newly-surfaced state. F-U-04 Medium is carry. → **PASS**.

iter4 was REVISE; iter5 restores PASS. The fresh-subagent and fresh-leader contract-confusion failure modes that iter4 introduced are both closed.

## Low-confidence appendix

(none)
