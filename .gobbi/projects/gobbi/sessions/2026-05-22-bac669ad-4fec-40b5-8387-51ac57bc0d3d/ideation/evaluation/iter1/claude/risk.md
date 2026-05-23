---
perspective: risk
iter: 1
system: claude
artifact: sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/ideation/artifacts/idea.md
phase: ideation
verdict: PASS
---

## Artifact Summary + Memory reads

(See project.md; same artifact.)

**Memory reads**: Same as project.md.

not-applicable (Privacy/PII) — No new PII or sensitive-data surface. Session IDs are not PII; transcript paths are local filesystem paths.

not-applicable (License/IP) — No external code borrowed; bash+jq is standard tooling; no license concern.

not-applicable (Cost/budget impact) — Developer-local bash hook; no paid API calls; no cost-runaway scenario possible.

---

## Locked Frame (Stage 1)

### Scenario 1: Rollback path is identified for each irreversible step
**Attached checklist:**
- [ ] Skill doc edits are reversible (git revert); no data migrations
- [ ] `.claude/hooks/session-start.sh` creation is reversible (delete file)
- [ ] `.claude/settings.json` hooks block addition is reversible (remove the block)

### Scenario 2: Blast radius is bounded
**Attached checklist:**
- [ ] Files touched are enumerated (12 skill files + session.template.json + orchestration/SKILL.md + settings.json + new hook)
- [ ] No runtime behavior changes (CLI code out of scope)
- [ ] `$CLAUDE_SESSION_ID` drop has downstream blast radius confirmed (no caller breaks)

### Scenario 3: Security surface delta is named
**Attached checklist:**
- [ ] The hook reads stdin JSON from Claude Code's process and writes to `$CLAUDE_ENV_FILE` — no network calls, no external I/O
- [ ] `$CLAUDE_ENV_FILE` path is controlled by Claude Code; no injection vector via the hook script itself

### Scenario 4: Irreversible steps gated with caution
**Attached checklist:**
- [ ] No irreversible steps identified (all changes are text edits + new file + JSON edit)

### Scenario 5: Two-week smell test
**Attached checklist:**
- [ ] No load-bearing "we'll improve this later" promises that create maintenance debt
- [ ] Maintenance burden named (none beyond the TS+bun port deferred)

### Scenario 6: Scope drift check — design touches files outside Scope Contract (adversarial)
**Attached checklist:**
- [ ] Scope Contract In-Scope files match Design A-G task targets
- [ ] No file in the hook contract or tasks falls outside the defined scope

### Scenario 7: `$CLAUDE_SESSION_ID` drop has zero callers breaking (adversarial)
**Attached checklist:**
- [ ] All 13 occurrences in skills are being renamed (not just some)
- [ ] No other location in `.gobbi/` or `.claude/` references `$CLAUDE_SESSION_ID` that would be left broken after the rename

---

## Per-scenario per-check results

### Scenario 1: Rollback

- Skill doc edits reversible: **YES** — plain markdown; git revert.
- hook creation reversible: **YES** — delete file; remove settings.json block.
- No data migration: **YES** — confirmed; no DB or persisted data changed.

### Scenario 2: Blast radius

- Files enumerated: **YES** — 12 skill files, session.template.json, orchestration/SKILL.md, settings.json, new hook = ~16 files.
- No runtime behavior changes: **YES** — CLI code excluded per scope.
- `$CLAUDE_SESSION_ID` drop has no broken callers: **PARTIAL** — see F-RISK-01 below.

### Scenario 3: Security surface

- No network calls: **YES** — bash+jq reads stdin, writes to `$CLAUDE_ENV_FILE`.
- `$CLAUDE_ENV_FILE` path controlled by Claude Code: **YES** — the var is set by the Claude Code runtime, not by user input.
- No injection vector: **YES** — the hook uses `jq -r` to extract fields. Values from stdin JSON are written as `export KEY=value` lines. If a field value contains shell metacharacters (e.g., `session_id` with a semicolon), this could be an injection risk. See F-RISK-02.

### Scenario 4: Irreversible steps

- No irreversible steps: **YES** — confirmed.

### Scenario 5: Two-week smell test

- No load-bearing "improve later" promises: **YES** — deferred items (TS+bun port, CLI stamping) are in the Deferred section, not in the implementation.
- Maintenance burden named: **YES** — the hook is bash+jq; migration to TS+bun is deferred but explicitly tracked.

### Scenario 6: Scope drift

- Scope Contract In-Scope matches Design targets: **YES** — Task A through G all target files in the In-Scope list. No out-of-scope file references found in the Design section.

### Scenario 7: `$CLAUDE_SESSION_ID` zero callers broken (adversarial)

- All 13 occurrences renamed: **YES** — inventory of 13 verified by live grep.
- No other `$CLAUDE_SESSION_ID` outside `.gobbi/.../skills/`: **CONCERN** — see F-RISK-03.

---

## Typed findings

### F-RISK-01

```yaml
finding-id: risk-01-session-id-in-evaluation-skill-path-conventions
type: assumption_risk
domain: docs-sync
disposition: open
confidence: 75
severity: Medium
```

**Evidence**: `evaluation/SKILL.md:563` is in the P1 rename inventory (row 12). That line is the "path conventions" block that currently reads:
"`{session-id}` — Claude Code session ID from `$CLAUDE_SESSION_ID` (or the Codex session ID under Codex)."

After the rename, it will read `$CLAUDE_CODE_SESSION_ID`. However, `evaluation/SKILL.md` is the evaluator agent's primary reference for the path conventions — and evaluator agents are spawned by the manager with fresh context. The evaluator's session path conventions now reference `$CLAUDE_CODE_SESSION_ID`, which IS a runtime-set var. BUT: the `$CLAUDE_CODE_SESSION_ID` for an evaluator subagent is the EVALUATOR's session ID, not the manager's session ID. The session directory path uses the MANAGER's session ID (the one used to create the session directory at Configuration). 

If an evaluator reads its path conventions and tries to use `$CLAUDE_CODE_SESSION_ID` to construct its own output path, it will get its own session UUID (e.g., `abc-123`) rather than the manager's session UUID (e.g., `bac669ad`). The output path will be wrong.

The current (broken) docs reference `$CLAUDE_SESSION_ID` which is ALSO wrong (empty for subagents). The rename from one empty/wrong var to another may not fix the actual path-construction problem for subagent evaluators.

**Why it matters**: After the rename, subagent evaluators still cannot reliably construct the correct session directory path from their own env vars alone — the manager must pass the session path as a delegation input (which it does in practice, but the skills do not say so). The docs will continue to describe a broken path-construction strategy, just using the wrong var's correct name instead of the wrong var's wrong name.

**Suggested direction**: Planning should note: the path conventions block in each skill file should ideally say "the manager passes the session-dir path as a delegation input; do not derive it from env vars alone." However, changing the path conventions semantics is beyond P1 scope. As a minimum: Preparation should verify whether the rename-only is sufficient for the correctness story, or whether a broader note is needed.

---

### F-RISK-02

```yaml
finding-id: risk-02-hook-jq-shell-injection-not-addressed
type: assumption_risk
domain: security
disposition: open
confidence: 50
severity: Medium
```

**Evidence**: The hook contract says the hook reads stdin JSON and appends `export VAR=value` lines to `$CLAUDE_ENV_FILE`. The contract does not specify how values are escaped before being written. A typical bash implementation might do:
`echo "export CLAUDE_SESSION_ID=$(jq -r '.session_id' <<< "$stdin")" >> "$CLAUDE_ENV_FILE"`

If `session_id` contains shell metacharacters (e.g., `` ` ``, `$(`, `"`, `;`), this would produce a malformed or injection-capable line in the env file. Claude Code controls the hook stdin payload so this is a low-probability risk, but the hook contract does not specify the escaping strategy.

**Why it matters**: The env file is sourced by Claude Code. A malformed line could corrupt env state; a more cleverly crafted value could execute arbitrary commands when sourced.

**Suggested direction**: The hook contract should specify: values written to `$CLAUDE_ENV_FILE` are quoted (e.g., with single-quote wrapping or `printf '%q'`). Execution should implement this.

---

### F-RISK-03

```yaml
finding-id: risk-03-session-id-outside-skills-scope
type: assumption_risk
domain: docs-sync
disposition: open
confidence: 75
severity: Low
```

**Evidence**: Exit criterion 1 says `rg -n 'CLAUDE_SESSION_ID' .gobbi/projects/gobbi/skills/` returns empty. This scope is correctly narrowed to `.../skills/`. The `mistake/SKILL.md` at line 129 references `$CLAUDE_SESSION_ID` (in the "Output paths" section at the bottom). This file IS in the inventory (row 3). After the rename it will reference `$CLAUDE_CODE_SESSION_ID`.

However, `orchestration/workflow/evaluation.md` also references `$CLAUDE_SESSION_ID` at line 292. This file IS in the inventory (row 6). After the rename it will reference `$CLAUDE_CODE_SESSION_ID`.

The exit criterion scope (`rg .gobbi/projects/gobbi/skills/`) covers both. The risk: are there any `$CLAUDE_SESSION_ID` references in `.claude/` directories that are NOT symlinks to the skills tree and thus not covered by the rg scope?

Verified: `.claude/skills/` contains only symlinks to `.gobbi/projects/gobbi/skills/`. `.claude/agents/` contains no env-var refs (confirmed by grep). So the exit criterion scope is sufficient.

Finding downgraded to Low after verification. Still noted as a finding because the artifact does not explicitly confirm that `.claude/` is covered by the rename via symlinks (it mentions it out-of-scope but does not confirm the symlink coverage).

**Suggested direction**: Add a note to exit criterion 1: "Note: `.claude/skills/` is a symlink tree; the rg scope on `.gobbi/projects/gobbi/skills/` covers it."

---

## Low-confidence appendix

(None.)
