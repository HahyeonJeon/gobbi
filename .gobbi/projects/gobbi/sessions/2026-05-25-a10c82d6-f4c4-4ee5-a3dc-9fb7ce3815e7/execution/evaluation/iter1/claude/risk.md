# Risk Perspective — W0-core Execution Evaluation (iter1, claude)

**Lens:** Blast radius, reversibility, correctness of the new symlink, any irreversible operations.

---

## Frame (Stage 1)

**Scenario 1:** The symlink is relative and portable (no hardcoded absolute paths).
**Scenario 2:** The commit was made to the correct worktree branch, not to main.
**Scenario 3:** P13 adds no dangling references to nonexistent skills.
**Scenario 4:** The delegation wiring condition is correctly scoped (not unconditional).
**Scenario 5 (adversarial):** The symlink points to a path that won't exist on a fresh checkout of the branch.
**Scenario 6 (adversarial):** P13 references a missing skill doc (FLAG-2 mentions `claude` skill is absent).
**Scenario 7 (adversarial):** The CLAUDE.md edit breaks the session-start load sequence.

---

## Evaluation (Stage 2)

### Scenario 1: Relative symlink portability

**Checklist:**
- [x] Symlink stored in git as relative: `../../../.gobbi/projects/gobbi/skills/memorization/rules.md` (verified via `git show 90c46fd -- .claude/skills/memorization/rules.md`)
- [x] Path depth: from `.claude/skills/memorization/rules.md`, `../../../` = `.claude/skills/memorization/` → `.claude/skills/` → `.claude/` → worktree root → `.gobbi/projects/gobbi/skills/memorization/rules.md` — CORRECT
- [x] Matches the pattern of existing symlinks (SKILL.md, memory-map.md both use `../../../.gobbi/...`)
- [x] Portable: any `git clone` or `git worktree add` of this branch will have both the canonical file and the symlink, and the symlink will resolve

**Result:** PASS. No portability risk.

### Scenario 2: Correct branch

**Checklist:**
- [x] Commit is on `chore/session-2026-05-25-a10c82d6` (verified `git branch --all`)
- [x] The worktree's `.gobbi/projects/gobbi/skills/` contains the canonical files (not the main tree's)
- [x] No direct commits to main or develop

**Result:** PASS.

### Scenario 3: No dangling references in P13

**Checklist:**
- [x] P13 references `memorization/memory-map.md` — file exists
- [x] P13 references `memorization/rules.md` (self-referentially, as the CRUD standard home) — correct
- [x] P13 does NOT reference `skills/claude/SKILL.md` or any missing skill — the design §6 already removed this reference per MED-8 (citing the doc standard "generically" rather than naming the absent skill)
- [x] P13 step 3 blast-radius examples reference `principles/SKILL.md` + CLAUDE.md + `memorization/rules.md` + `memorization/templates/*` — all real paths

**Result:** PASS. P13 has no dangling skill references (MED-8 fix was carried through correctly).

### Scenario 4: Delegation wiring condition scoped

**Checklist:**
- [x] The condition "mandatory when the delegation writes or evaluates project memory" is present in all 3 agent templates (not unconditional)
- [x] `delegation/SKILL.md` "Project-memory standard gate" paragraph explains the gate condition explicitly
- [x] The evaluator template uses a slightly different condition ("load when evaluating project-memory artifacts") — appropriate distinction

**Result:** PASS.

### Scenario 5 (adversarial): Symlink path on fresh checkout

The symlink target is `../../../.gobbi/projects/gobbi/skills/memorization/rules.md`. On a fresh `git checkout chore/session-2026-05-25-a10c82d6`, both the symlink (`.claude/skills/memorization/rules.md`) and the canonical file (`.gobbi/projects/gobbi/skills/memorization/rules.md`) exist on the branch. The relative path resolves correctly. No risk.

However: on a **worktree** checkout (as is the case here), the canonical file is branch-isolated to the worktree path. The symlink is relative to the WORKTREE root, so it still resolves correctly within the worktree. This matches the behavior of the existing SKILL.md and memory-map.md symlinks. No new risk introduced.

### Scenario 6 (adversarial): FLAG-2 — missing `claude` skill

design §11 flags that `skills/claude/SKILL.md` is a dangling reference in CLAUDE.md's navigation table. This pre-existing issue is NOT affected by 90c46fd — the commit did NOT touch the navigation table's `claude skill` row. This remains a pre-existing deferred risk, not introduced by this commit.

### Scenario 7 (adversarial): CLAUDE.md session-start integrity

**Checklist:**
- [x] CLAUDE.md changes are additive (one new Iron Law row, prose count bump, navigation table count bump)
- [x] The file structure (headers, tables) is unchanged; only the count and one new table row are different
- [x] No load directives or session-start instructions were altered

**Result:** PASS.

---

## Findings

No risk findings. The symlink is relative, portable, and correctly scoped. P13 has no dangling skill references. The FLAG-2 dangling `claude skill` reference in CLAUDE.md is a PRE-EXISTING issue, not introduced by this commit.

**Verdict contribution: PASS**
