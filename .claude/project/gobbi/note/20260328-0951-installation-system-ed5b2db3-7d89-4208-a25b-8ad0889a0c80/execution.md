# Execution: Gobbi Installation System

## Overview

Built an npm package (`gobbi`) with `npx gobbi init` and `npx gobbi update` commands. Zero npm dependencies, Node.js >= 18, uses built-ins only (util.parseArgs, readline, fs.cp).

## Delegation Summary

### Wave 1 — Foundation (parallel)

**Task 1: Package scaffolding** — general-purpose agent
- Created: package.json, bin/gobbi.js, src/cli.js, scripts/build-templates.sh, .gitignore
- Key decision: build-templates.sh explicitly copies both `gobbi` (entry-point, no hyphen) and `gobbi-*` (hyphenated skills)
- Verification: CLI usage display works, build script populates templates/ with 17 skills, 5 agents, 9 hooks

**Task 2: Library modules** — general-purpose agent
- Created: src/lib/{detect, files, claude-md, settings, hooks, project}.js
- Key decisions: readline askQuestion helper duplicated in hooks.js and project.js (self-contained modules), mergeHookConfig deduplicates by command string
- Verification: All modules importable, named exports, fs/promises throughout

### Wave 2 — Commands (parallel)

**Task 3: Init command** — general-purpose agent
- Created: src/commands/init.js
- Full flow: detect → copy skills/agents/GOBBI.md → trigger line → core hooks → notification hooks (interactive) → project dir (interactive) → summary
- Verification: Clean init works, double-init detected with exit code 1

**Task 4: Update command** — general-purpose agent
- Created: src/commands/update.js
- Full flow: detect → replace all gobbi* skills except gobbi-hack → replace agents → replace GOBBI.md → verify trigger → replace core hooks → preserve notification hooks → offer new hooks → summary
- Verification: Modified skills restored, gobbi-hack preserved, .claude/project/ preserved
- Note: CORE_HOOK_SCRIPTS constant duplicated from hooks.js (acknowledged, minor)

### Wave 3 — Documentation

**Task 5: README** — general-purpose agent
- Rewrote README.md with: what is gobbi, quick start, git manual install, commands, hooks, required permissions, development, license
- Verification: All sections present, no code changes

## Post-Execution Evaluation

3 evaluator agents (positive, moderate, critical) assessed the implementation.

**Positive (PASS)**: Clean architecture, correct gobbi/gobbi-* handling, zero dependencies, idempotent operations, settings split.

**Moderate + Critical (both REVISE)**: Found 4 blocking bugs + 3 non-blocking issues.

### Bug Fixes (Task 6)

**B1: --help/--version crash** — Added to parseArgs options config with early-exit handlers in cli.js.

**B2: New hooks copy without settings entries** — Exported NOTIFICATION_HOOK_ENTRIES from hooks.js, imported in update.js, call mergeHookConfig after installing new hooks.

**B3: False "new hooks" on every update** — Added KNOWN_NOTIFICATION_SCRIPTS list to update.js, filtered from new-hook detection. Only genuinely new hooks (from future gobbi versions) trigger the prompt.

**B4: Path traversal in project name** — Added validation rejecting names with `..`, `/`, `\`. Also verifies resolved path stays inside `.claude/project/`.

**N1: No error handler** — Added .catch() to run() in bin/gobbi.js for clean error messages.

**N4: No blank line on prepend** — Changed to double newline separator in claude-md.js.

**N5: Frontmatter breakage** — Detect `---` frontmatter and insert trigger after closing `---` instead of before.

## Final Verification Results

All passing:
1. `bash scripts/build-templates.sh` — 17 skills, 5 agents, 9 hooks in templates/
2. `init --non-interactive` in clean dir — full install, correct output
3. Double init — "already installed", exit code 1
4. Update restores modified skills — gobbi-plan/SKILL.md content replaced
5. gobbi-hack/ preserved — patches/test.patch.md survived update
6. .claude/project/ preserved — myproject/note/test.md survived update
7. `--help` — prints usage, exit 0
8. `--version` — prints 0.1.0, exit 0

## Files Created

```
package.json
bin/gobbi.js
src/cli.js
src/commands/init.js
src/commands/update.js
src/lib/detect.js
src/lib/files.js
src/lib/claude-md.js
src/lib/settings.js
src/lib/hooks.js
src/lib/project.js
scripts/build-templates.sh
.gitignore
README.md
```
