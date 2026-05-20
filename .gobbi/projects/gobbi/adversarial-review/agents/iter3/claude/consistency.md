# Consistency Perspective — 5-Role Agent Taxonomy (iter3, claude)

## Artifact Summary + W/W/H

See `project.md`. Consistency = sync between 5 agent files + their dependencies (CLAUDE.md user-locked, delegation, evaluation, mistake, principles, wrap-up, memorization, git).

## Memory reads

- `iter2/claude/consistency.md` (inheritance — 9 findings; 5 addressed, 2 deferred, 2 open including F-C-NEW-01 regression closed by Fix 2, F-C-06 closed by Fix 3)
- `agents/*.md` (full)
- `skills/delegation/SKILL.md`
- `skills/evaluation/SKILL.md`
- `skills/mistake/SKILL.md`
- `skills/principles/SKILL.md`
- `skills/wrap-up/SKILL.md`
- `skills/memorization/SKILL.md`
- `skills/git/SKILL.md` (iter3 Fix 4)
- `.claude/CLAUDE.md` (user-locked, deferred-disposition only)

## Locked Frame (Stage 1)

### S-C-1 (inherited, addressed): 5 agent files share vocabulary
### S-C-2 (inherited, addressed): Agent Roster sync
### S-C-3 (inherited, addressed iter2): Evaluator schema matches evaluation/SKILL.md (F-C-01)
### S-C-4 (inherited, addressed bundle / deferred CLAUDE.md): Workflow phase list canonical (F-C-03/04)
### S-C-5 (inherited, addressed): Principles citations supported
### S-C-6 (adversarial inherited): Cross-file references resolve (F-C-05 + F-C-06)
### S-C-7 (Privacy / Licensing): not-applicable
### S-C-8 (iter2 NEW): AskUserQuestion exception lists (F-C-NEW-01)
### S-C-9 (iter2 NEW): mistake skill internal consistency
### S-C-10 (NEW iter3): Fix 3 — assistant frontmatter tools ↔ description ↔ prose lifecycle ownership all aligned
### S-C-11 (NEW iter3 adversarial): Fix 2 sweep completeness — frontmatter tools list ↔ prose ↔ downstream skill files all aligned
### S-C-12 (NEW iter3): Fix 1 — executor.md load list ↔ existing skills directory; no dangling refs
### S-C-13 (NEW iter3): Fix 4 — git/SKILL.md issue #258 reference is internally consistent with the project's backlog reference convention

## Per-scenario per-check results (Stage 2)

### S-C-1 / S-C-2 / S-C-5 — carry-forward addressed (no regression detected)

### S-C-3 (F-C-01)
- (a) evaluator.md:35 still delegates schema load to `evaluation/SKILL.md` § Finding Metadata. No local schema. → **addressed (carry)**
- (b) evaluator.md:87 verdict thresholds match evaluation/SKILL.md:242 thresholds → **addressed (carry)**

### S-C-4 (F-C-03)
- (a) manager.md:40 + delegation/SKILL.md:213 canonical phase list aligned → **addressed (bundle); CLAUDE.md drift = deferred (user-locked)**

### S-C-6 (F-C-05 + F-C-06)
- (a) **F-C-05**: skills/mistake/SKILL.md still exists; runtime `.claude/skills/mistake/` symlink still absent but user-locked out-of-scope. → **addressed (bundle) / deferred (runtime symlink)**
- (b) **F-C-06** (assistant Write tool): iter3 Fix 3 patched assistant.md:4 to include `Write, Edit`. Description text at assistant.md:3 also updated to "Has Write/Edit access bounded to session staging during MEMORIZATION + Wrap-up phases ...; read-only in lookup mode." Tool surface + description + prose lifecycle ownership are now aligned. → **F-C-06 disposition: addressed**

### S-C-8 (F-C-NEW-01 iter2 regression)
- (a) manager.md:12 "Interview is the only named exception" preserved
- (b) assistant.md:27 now routes via NEEDS_CONTEXT, no second exception → **F-C-NEW-01 disposition: addressed**

### S-C-9 (mistake skill internal consistency)
- (a) skills/mistake/SKILL.md unchanged in iter3; iter2 verification carries → no finding

### S-C-10 (NEW iter3 — Fix 3 sweep)
- (a) assistant.md frontmatter (line 4): `Read, Grep, Glob, Bash, Write, Edit, WebSearch, WebFetch` ✓
- (b) assistant.md description (line 3): "Has Write/Edit access bounded to session staging during MEMORIZATION + Wrap-up phases ...; read-only in lookup mode." ✓
- (c) assistant.md prose lifecycle ownership (lines 12, 17, 18): claims sole project-memory writer ownership ✓
- (d) Internal consistency: tool grant + description + prose all match → **F-C-iter3-NEW-01 disposition: addressed (verification finding)**

### S-C-11 (NEW iter3 — Fix 2 sweep completeness)
- (a) **leader.md:4** `tools: AskUserQuestion, ...` — frontmatter still grants AskUserQuestion. leader.md:17 prose: "Do NOT call AskUserQuestion directly". **DIRECT CONTRADICTION**
- (b) **executor.md:4** `tools: AskUserQuestion, ...` — frontmatter still grants AskUserQuestion. executor.md:19 prose: "Do NOT call AskUserQuestion directly". **DIRECT CONTRADICTION**
- (c) assistant.md:4 — frontmatter does NOT have AskUserQuestion (consistent with prose). Fix 3 patched it.
- (d) evaluator.md:4 — frontmatter does NOT have AskUserQuestion. Consistent with prose.
- (e) The Fix 2 sweep removed AskUserQuestion from assistant frontmatter (incidentally; the main goal was Write+Edit) but did NOT sweep leader + executor frontmatter. The prose discipline change was applied across 4 subagent files (leader, executor, evaluator, assistant); only 2 of 4 frontmatter `tools:` lists were reconciled.
- (f) **Frontmatter is the hard contract; prose is a soft norm.** The Claude Code harness grants tools by frontmatter. A leader or executor at runtime has AskUserQuestion available and can call it despite the prose; the prose discipline becomes unenforceable.
- → **F-C-iter3-NEW-02** (High/100, regression class — Fix 2 sweep incomplete in tools-list dimension)

### S-C-11b (NEW iter3 — downstream skill file sweep)
- (a) **wrap-up/SKILL.md** line 4: `allowed-tools: ... AskUserQuestion` — frontmatter grants
- (b) **wrap-up/SKILL.md** line 137: "AskUserQuestion via manager" (escalation language — correct)
- (c) **wrap-up/SKILL.md** line 351 + 357: "MUST run user-confirm via AskUserQuestion" (direct-call language — wrong post-Fix 2)
- (d) Internal contradiction within wrap-up/SKILL.md itself: line 137 says "via manager" but lines 351, 357 say "MUST run AskUserQuestion" — the skill is internally inconsistent on AskUserQuestion ownership.
- (e) Cross-file: assistant.md:27 says NEEDS_CONTEXT escalation; wrap-up/SKILL.md says direct-call (in 2 of 3 places). When the assistant loads wrap-up/SKILL.md (per assistant.md:18), it gets contradictory contracts.
- → **F-C-iter3-NEW-03** (High/100, regression class — wrap-up/SKILL.md AskUserQuestion language not swept; also has internal inconsistency)

### S-C-12 (NEW iter3 — Fix 1 sweep)
- (a) executor.md:30 references `orchestration/workflow/execution.md` → verified present
- (b) executor.md:34 references `execution` skill + `git` skill → both verified present
- (c) executor.md:35 references issue #258 (not a skill load target) → cleanly deferred
- (d) No new dangling refs introduced. → **addressed (verification)**

### S-C-13 (NEW iter3 — Fix 4 reference convention)
- (a) git/SKILL.md:123 references "issue #258" — bare number format
- (b) executor.md:35 references "issue #258" — same format
- (c) Project's existing backlog reference convention: spot-checked `git log` for issue references — format consistent with `#NNN` short reference
- (d) Aesthetics owns the duplicate-sentence finding for the same location (F-A-iter3-NEW-01); Consistency concurs but ownership stays with Aesthetics.
- → no Consistency-owned finding (cross-file convention consistent)

## Typed findings (Stage 2)

| ID | Type | Domain | Disposition | Confidence | Severity | Evidence | Why it matters |
|---|---|---|---|---|---|---|---|
| **F-C-01** | `design_flaw` | `docs-sync` | addressed (carry) | 100 | n/a | evaluator.md:35 delegates schema | Closed iter2; preserved iter3 |
| **F-C-02** | `design_flaw` | `process` | addressed (carry) | 100 | n/a | evaluator.md:87 thresholds match | Closed iter2; preserved iter3 |
| **F-C-03** | `design_flaw` | `docs-sync` | addressed (bundle) / deferred (CLAUDE.md, carry) | 100 | n/a | manager.md:40 + delegation/SKILL.md:213 aligned | Closed bundle-internal iter2 |
| **F-C-04** | `design_flaw` | `docs-sync` | addressed (carry) | 75 | n/a | leader.md:33 Research = Ideation sub-step C | Closed iter2 |
| **F-C-05** | `design_flaw` | `process` | addressed (bundle) / deferred (runtime symlink, carry) | 100 | n/a | mistake skill exists | Closed bundle-internal iter2 |
| **F-C-06** | `design_flaw` | `docs-sync` | **addressed (Fix 3)** | 100 | n/a | assistant.md:4 includes Write+Edit; description text matches | iter1 Medium → iter2 High → iter3 closed cleanly |
| **F-C-NEW-01** | `design_flaw` | `docs-sync` | **addressed (Fix 2)** | 100 | n/a | manager.md:12 ↔ assistant.md:27 reconciled | iter2 regression closed |
| **F-C-iter3-NEW-01** | `general` | `docs-sync` | addressed (verification) | 100 | n/a | Fix 3 internal consistency (frontmatter ↔ description ↔ prose) verified | Verification finding |
| **F-C-iter3-NEW-02** | `design_flaw` | `docs-sync` | **open (NEW iter3 regression)** | 100 | **High** | leader.md:4 + executor.md:4 frontmatter `tools:` still grant `AskUserQuestion` while prose at leader.md:17 + executor.md:19 say "Do NOT call AskUserQuestion directly". Fix 2 swept prose; partial frontmatter sweep only | Frontmatter is the harness's hard contract; prose is soft norm. Discipline unenforceable while tool is granted |
| **F-C-iter3-NEW-03** | `design_flaw` | `docs-sync` | **open (NEW iter3 regression)** | 100 | **High** | wrap-up/SKILL.md:357 + 351 say "MUST run user-confirm via AskUserQuestion" (direct-call); line 137 says "via manager"; assistant.md:27 routes via NEEDS_CONTEXT. The skill file is BOTH internally inconsistent AND inconsistent with assistant.md | Wrap-up skill is loaded by assistant at runtime. Operator gets contradictory contracts within the same skill file + across files |
| **F-C-DEF-01** | `general` | `docs-sync` | deferred (carry) | 75 | Medium | CLAUDE.md phase list doesn't match canonical bundle | User-locked carry |
| **F-C-DEF-02** | `general` | `process` | deferred (carry) | 75 | Medium | .claude/skills/ runtime tree symlinks not reconciled | User-locked carry |

## Per-perspective verdict

**FAIL** — Two NEW High/100 regression findings (F-C-iter3-NEW-02 + F-C-iter3-NEW-03) caused by an incomplete Fix 2 sweep:
- Fix 2 patched prose in 4 subagent files but only reconciled 2 of 4 frontmatter `tools:` lists (assistant + evaluator). Leader + executor frontmatter still grant AskUserQuestion.
- Fix 2 did not touch wrap-up/SKILL.md, which has both internal inconsistency (line 137 vs lines 351 + 357) and cross-file contradiction with assistant.md.

iter1 had 3 Criticals (all closed in iter2). iter2 had 2 Highs (both closed in iter3). iter3 introduces 2 NEW Highs — same shape as iter2. The regression class is the load-bearing finding.

Per the rule: any Critical/75 → FAIL; any High/50 → REVISE. No Criticals; two Highs/100 → strict rule **REVISE**. But the third consecutive iter introducing the same shape (incomplete sweep) escalates this perspective's signal — calling it FAIL or REVISE doesn't change the diagnosis: the iter4 fix must address the systemic pattern, not just patch the specific contradictions.

Strict per-perspective rule: **REVISE**.

## Low-confidence appendix

(none below threshold)
