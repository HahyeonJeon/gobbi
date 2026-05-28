# W5 Execution — draft-iter1

Session: 2026-05-25-a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7
Sub-step: W5 (W5-T1, W5-T2, W5-T3)
Date: 2026-05-25

---

## W5-T1 — Follow-up filing

### Pre-existing (verified)

- `backlogs/skills-agents-canonical-location.md` — FLAG-1, present, project-scope: true, disposition: open. NO duplicate filed.
- `backlogs/claude-doc-standard-skill-missing.md` — FLAG-2, present, project-scope: true, disposition: open. NO duplicate filed.

### Filed this sub-step

- `backlogs/stub-redirect-dangling-claude-skill-ref.md` — FLAG-3: rules/stub-redirect-format.md references `_claude/SKILL.md` which does not exist; repoint when FLAG-2 resolves. project-scope: true, disposition: open, priority: medium.
- `backlogs/feature-dir-frontmatter-full-normalization.md` — NEW residual: feature-dir files received scope+feature in W3 but legacy keys (date, loop, slug, promoted_from, promoted_at) not stripped; bounded normalization pass deferred. project-scope: true, disposition: open, priority: medium.

Commit: b1791f7

---

## W5-T2 — Mistake reword

File: `mistakes/executor-mirror-path-vs-worktree-physical-copy.md`

Verifies:
- `grep -q "branch-isolat"` → PASS
- `grep -q "worktree-absolute"` → PASS
- `grep -q "skills-mirror-symlinks-not-copies"` → PASS (cross-link added in ## Related + blockquote)
- `status: active` → PASS (not moved, not superseded)
- file still at `mistakes/` → PASS

Changes made:
- Title reworded from "Worktree-mode executors must edit worktree-internal canonical mirror, not main-tree canonical mirror" to "Worktree canonical files are branch-isolated — always use the worktree-absolute path"
- Description updated to emphasize branch-isolation
- Added "## Core lesson" section as top section (before ## Context) with the real lesson centered + explicit disambiguation blockquote pointing to `skills-mirror-symlinks-not-copies.md`
- Cross-link to `mistakes/skills-mirror-symlinks-not-copies.md` added in ## Related
- Frontmatter: status: active preserved; no other frontmatter changes

Commit: 5379917

---

## W5-T3 — Final Gate Suite Results

Run from cwd: `.gobbi/projects/gobbi/` (worktree)

```
GATE LINE 1: ls backlogs/ | grep -Ec '^(item-|f-[a-z]+-[0-9])'
RESULT: 0
EXPECTED: 0
STATUS: PASS

GATE LINE 2: find features -type f -name '*.md' [forbidden pattern list] | grep -v '/README.md$'
RESULT:
  features/install-runtime/discussions/env-var-audit-scope-discussion.md
  features/install-runtime/archive/references/2026-05-22-ideation-references.md
EXPECTED: empty
STATUS: FAIL (2 files)

GATE LINE 3: grep -rl mistake-candidate mistakes/ 2>/dev/null | xargs -r grep -l '^mistake-candidate:' | wc -l
RESULT: 0
EXPECTED: 0
STATUS: PASS

GATE LINE 4: grep -rl 'promoted-from\|promoted-at' mistakes/ learnings/ design/ | wc -l
RESULT: 1
EXPECTED: 0
STATUS: FAIL-QUALIFIED (body-text, not frontmatter — see note)

GATE LINE 5: head -1 rules/stub-redirect-format.md
RESULT: ---
EXPECTED: ---
STATUS: PASS

GATE LINE 6: grep -rL "^---" design/ learnings/ rules/ backlogs/ | grep -v '/README.md$' | wc -l
RESULT: 0
EXPECTED: 0
STATUS: PASS

GATE LINE 7: ls features/ | grep -vE '^(workflow|project-memory|agents|evaluation|guardrails|git-workflow|install-runtime|README.md)$'
RESULT: (empty)
EXPECTED: empty
STATUS: PASS

GATE LINE 8: ls archive/features/ | wc -l
RESULT: 4
EXPECTED: 4
STATUS: PASS

GATE LINE 9: find features/env-var-audit features/session-foundations-bundle-b ... -name '*.md' 2>/dev/null | wc -l
RESULT: 0
EXPECTED: 0
STATUS: PASS

GATE LINE 10: find sessions -type d -name tmp | wc -l
RESULT: 0
EXPECTED: 0
STATUS: PASS

GATE LINE 11: find sessions -name state.json | wc -l
RESULT: 6
EXPECTED: 6
STATUS: PASS

GATE LINE 12: symlink check
RESULT: Silent (all intact)
EXPECTED: silent
STATUS: PASS
```

### Gate failures — attribution

**GATE LINE 2 failures (2 files):**

1. `features/install-runtime/discussions/env-var-audit-scope-discussion.md`
   - Matches `-discussion.md` suffix (forbidden pattern `*-discussion.md`)
   - Wave attribution: W3 (sprint→value-feature migration + install-runtime population). The discussions/ subdir was created to hold this file and the forbidden suffix is a naming artifact from the sprint era. This file was migrated in W3 but its filename was not normalized.
   - Suggested fix: rename to a concept slug, e.g., `env-var-audit-scope.md` (discussions/ context makes the content clear without the `-discussion` suffix).

2. `features/install-runtime/archive/references/2026-05-22-ideation-references.md`
   - Matches `ideation-*` prefix (forbidden anti-pattern #1: loop/phase prefix)
   - Wave attribution: W3 (sprint→value-feature migration). File was migrated from the env-var-audit sprint and carries the loop prefix from its sprint origin.
   - Suggested fix: rename to a concept slug, e.g., `env-var-audit-external-sources.md`.

**GATE LINE 4 qualified failure:**

- `design/memory-system-redesign.md` line 48: body text says `promoted-from`, `promoted-at` are stripped by Wrap-up — this is a **documentation explanation of staging fields**, not a frontmatter key. The grep catches body-text occurrences, not just frontmatter. This is a gate-spec limitation (the gate was designed to catch frontmatter leaks in promoted files; this design doc legitimately documents those keys as staging-only).
- Wave attribution: W2 (design doc authoring — the design doc itself is a W2 artifact). Not a real failure; the gate spec should be tightened to check frontmatter-block-only occurrences (e.g., via `awk` between `---` delimiters). Flagged for the manager to assess whether the gate spec needs amendment.

---

AI-Provenance-Record: W5-T3 gate run, session 2026-05-25-a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7
