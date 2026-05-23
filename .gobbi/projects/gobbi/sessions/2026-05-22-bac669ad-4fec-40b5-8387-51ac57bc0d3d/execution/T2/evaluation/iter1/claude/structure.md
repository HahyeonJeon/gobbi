# T2 Evaluation — Structure Perspective — iter1

Date: 2026-05-22
Perspective: structure
Evaluator: claude/sonnet-4-6
Target: commit 6a575f2 — `.claude/settings.json` SessionStart hook registration

## Stage 0 — What / Why / How

A JSON configuration file gains a `hooks` top-level key with a `SessionStart` sub-key. Structure perspective evaluates: JSON schema correctness, key ordering (cosmetic but worth noting), hook object shape, and whether the hook entry conforms to the Claude Code hooks schema.

## Stage 1 — Frame

Scenarios:
1. JSON structure validity and schema conformance
2. Hook object shape — required fields present (`type`, `command`), no unknown fields
3. Key ordering and readability (non-blocking)
4. Relative path correctness for hook command

## Stage 2 — Sequential Evaluation

### Scenario 1: JSON structure validity

`jq -e .` passes. Object nesting is: root object → `hooks` object → `SessionStart` array → entry object with `matcher` string and `hooks` array → hook object with `type` and `command`. Valid JSON, valid nesting. PASS.

### Scenario 2: Hook object shape

Entry object: `{ "matcher": "startup|resume|clear|compact", "hooks": [ { "type": "command", "command": "..." } ] }`.

Claude Code hooks schema (per docs): hook entries have `matcher` (string, regex) and `hooks` (array). Each hook item requires `type` (must be `"command"`) and `command` (string). Both required fields present. No unknown fields injected. PASS.

### Scenario 3: Key ordering

Root key order: `permissions` → `enabledPlugins` → `hooks`. JSON has no key order semantics; parsers must not rely on order. Claude Code's settings reader is JSON-standard. No risk. PASS (cosmetic note only).

### Scenario 4: Relative path for hook command

Command: `.claude/hooks/session-start.sh` — relative path, no leading `/`.

**Adversarial check:** Claude Code fires hooks with `$CLAUDE_PROJECT_DIR` as the working directory (documented behavior). A relative path beginning with `.claude/` resolves correctly when cwd == project root. If Claude Code fires the hook with a different cwd (e.g., a subdirectory), the relative path would break.

**Evidence:** Claude Code hooks documentation states hook commands run with the project directory as the working directory. The PR #229 precedent (commit 756c155) used a different hook (`/bin/echo`; absolute path) — it does not confirm the relative-path pattern was tested.

**Finding F-STR-01:**
- Type: assumption_risk
- Domain: config
- Disposition: open
- Confidence: 50 (no direct test; based on Claude Code docs claim of $CLAUDE_PROJECT_DIR cwd)
- Severity: Medium
- Evidence: `.claude/settings.json` line 36: `"command": ".claude/hooks/session-start.sh"` — relative path.
- Why it matters: If Claude Code resolves hook commands relative to a path other than the project root (e.g., the Claude binary's install dir), the hook silently fails to fire. The failure mode is silent — no error surfaced to the user, sessions just don't load env vars.
- Suggested direction: Confirm experimentally by firing a SessionStart event and observing whether the hook executes. Alternatively, use an absolute path constructed at hook-authoring time (`$CLAUDE_PROJECT_DIR/.claude/hooks/session-start.sh`) — but this would break across clones. The safest hedge is a test run with the relative path before merging.

## Findings

1. F-STR-01 (assumption_risk / config / Medium / Confidence 50): Relative path `.claude/hooks/session-start.sh` in hook `command` relies on Claude Code resolving the path from project root at hook-fire time. Not empirically verified; silent failure mode if assumption is wrong.

## Must-preserve

- The `hooks` object nesting under `SessionStart` array — matches Claude Code's expected schema.
- `type: "command"` — required field; do not rename or remove.

## Verdict

PASS (one Medium finding at Confidence 50 — below REVISE threshold of High/50)
