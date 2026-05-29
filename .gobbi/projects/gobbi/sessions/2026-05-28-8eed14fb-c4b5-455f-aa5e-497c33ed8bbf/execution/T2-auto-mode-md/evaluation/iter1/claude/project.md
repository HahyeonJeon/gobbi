# T2 auto-mode.md — Project Perspective (iter1, claude)

## Artifact Summary

**What.** `auto-mode.md` — 202-line canonical Auto-Mode specification replacing the prior 636-byte placeholder at `.gobbi/projects/gobbi/skills/orchestration/auto-mode.md`.

**Why.** Plan T2 (id `02-auto-mode-canonical-spec`) implements Idea §4 — codify the implicit Auto-Mode discipline (Always-Ask interrupts, per-loop defaults, banner conditioning, maxIterations-exhaustion silence). Closes the `auto-mode-silence-vs-always-ask` backlog.

**How.** Six numbered sections (§1 posture, §2 Always-Ask, §3 defaults, §4 banner, §5 maxIter exhaustion, §6 settings) + cross-references. References (not duplicates) `discussion/SKILL.md § Decision Classification` and `planning/SKILL.md § Core Principles § USER CHALLENGE`.

**Scope contract source.** Plan T2 `files:` block + Idea §4 (`<worktree>/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-.../{ideation,planning}/artifacts/`).

**Downstream consumers.** T3 (SKILL.md amendment) and the manager at runtime when Auto-mode session is active.

## Memory reads

- Idea §4 (lines 272–306)
- Plan T2 (lines 176–234)
- `.claude/skills/discussion/SKILL.md` (Decision Classification + Always-Ask categories)
- `.claude/skills/planning/SKILL.md` (Core Principles + USER CHALLENGE)
- Companion `chat-mode.md` (style baseline)
- `mistakes/skills-mirror-symlinks-not-copies.md` (mirror discipline)

## Locked Frame (Stage 1)

**Scenario P1.** Right problem: codify Auto-Mode discipline per Idea §4.
- [x] Replaces placeholder (was 636 B; now 12 267 B / 202 lines)
- [x] All §4 sub-topics (4.1 posture / 4.2 Always-Ask / 4.3 defaults / 4.4 flag-don't-fix) present and §-headed

**Scenario P2.** Scope contract honored — no edits beyond `auto-mode.md`.
- [x] Only one file modified (verified by Plan T2 `files:` list)
- [x] §6 explicitly defers `models.*` resolution (Finding #8 deferred — out-of-scope here per Plan)
- [x] No banner-injection code edit (`R8 deferred` honored — §4 closes with "currently not modified by this redesign")

**Scenario P3.** Plan T2 six success criteria all literally satisfied.
- [x] ≥ 80 lines → 202
- [x] 3 Always-Ask categories named with one Auto example → §2.3 table rows 1-3
- [x] References `discussion/SKILL.md § Decision Classification` with precise anchor (§2.1 + Cross-references)
- [x] References `planning/SKILL.md § Core Principles § USER CHALLENGE` (§2.4 + Cross-references)
- [x] Restates §4.3 Auto defaults (maxIter / evaluate / Preparation runs / full MEMORIZATION / discuss user-or-agent split → §3)
- [x] Documents §4.4 banner-conditioning explicitly → §4 (full section)

**Scenario P4 (adversarial).** Out-of-scope inclusion (mode-question, R8 banner harness, models.* block).
- [x] §3 "Single mode question at session start" cites PR #267 lock — does NOT re-litigate the prior lock
- [x] §4 last paragraph "banner text is injected by the harness (currently not modified by this redesign)" — explicit no-touch
- [x] models.* block deliberately absent — defers to upstream backlog

## Stage 2 — Project verdict

- **Verdict: PASS.** Every Plan T2 success criterion is satisfied with on-file evidence. Scope is held; deferred items (R8 banner harness, models.* block) are acknowledged but not edited. No scope drift detected.

## Findings (open)

None at Project confidence ≥ 50.

## Low-confidence appendix

- (Conf 25) §6 duplicates §3's default-set as a "second summary" table. Both tables encode identical data; the duplication is intentional (Idea §5 cross-doc landing page), but it raises a minor maintenance risk if one updates without the other. Style/maintenance, not Project-scope.
