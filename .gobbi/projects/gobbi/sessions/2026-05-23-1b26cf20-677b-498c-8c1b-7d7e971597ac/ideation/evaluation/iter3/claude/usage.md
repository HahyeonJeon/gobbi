# Usage — iter3 Claude

## Stage 0 — Target read

Usage lens: can the executor + future evaluators + the user pick up the draft and act on it? Are the new Fix A/B/C narratives actionable without re-reading iter2?

## Stage 1 — Inheritance

| Finding | Source | iter3 disposition |
|---|---|---|
| iter1 U1 (path-surface CL-1) | claude | addressed iter2; preserved |
| iter1 U2 (hook-silence diagnostic) | claude | not addressed iter2; not in iter3 scope |
| iter1 COD-USAGE-001 (path-surface) | codex | addressed iter2 CL-1 |
| iter1 COD-USAGE-002 (resolver) | codex | addressed iter2 D-3-3-resolver |
| iter1 COD-USAGE-003 (denominator) | codex | addressed iter2 line 74 |
| iter1 COD-USAGE-004 (header migration) | codex | addressed iter2 T3-I-T3.e |
| iter2 U3 (hook-silence diagnostic) | iter2 claude | open Medium 50; not in iter3 scope |

## Stage 2 — Usage walk

### U-A — Fix A actionability

D-1 narrative (line 308-313) provides:
- Branch name template: `chore/session-{date}-{ssid-short}`.
- Concrete example: `chore/session-2026-05-23-1b26cf20`.
- Three-fold validation: (1) line 22 regex compliance, (2) line 64 length, (3) line 261 label-color.
- Validation method: post-merge `jq '.git.branch'` regex match.

T1-I-T1.a (line 274) provides the exact edit point in `orchestration/SKILL.md`. T1-I-T1.h provides the executable Wrap-up gate (`jq '.git.branch'` matches `^chore/session-[0-9]{4}-[0-9]{2}-[0-9]{2}-[a-f0-9]{8}$`).

Executor needs nothing beyond the draft + `git/conventions.md`. **Actionable.**

### U-B — Fix B actionability

D-3-3 (line 366) preserves the verbatim quotes inline, so the executor authoring `.claude/settings.json` does not need to re-fetch the page to know what to register:
- Matcher: `"Task"` for both PostToolUse + PostToolUseFailure
- Exit code 2 semantics for PostToolUseFailure: non-blocking, surfaces stderr.
- Single-script handles both via `hook_event_name` branching.

The augmented staged reference at `claude-code-posttooluse-hook-schema.md` (line 25-75) provides the 31-event enumeration for context. **Actionable.**

### U-C — Fix C actionability

D-3-3-resolver step (i) annotation (line 377) gives the executor four pieces of decision support:
1. The file does not exist today (empirically verified).
2. Step (ii) currently works (single project under `.gobbi/projects/`).
3. Two pickup paths (in-Execution write OR defer).
4. Backlog pointer to the dedicated file with full context.

Backlog file (57 lines, structured) provides effort estimate (`< 5 minutes`), suggested approach (`{"name": "gobbi"}`, ~5 LOC), and when-to-pick-up cues. **Actionable.**

### U-D — Carry-forward orthogonality

The iter3 leader chose to preserve all iter2 actionability work (CL-1 path-surface explanation, T3-I-T3.e migration paragraph, D-3-3-resolver explicit precedence) — no usability regressions introduced.

### U-E — Auto-mode-friendly

iter3's WORK exit checklist (line 543-553) provides explicit empirical confirmations (`[x]` items with `grep -n "session/"`, whole-file scan citation, `ls -la` result, etc.). The executor / future evaluator can re-verify each `[x]` independently. **Auto-mode actionable.**

### U-F — Hook-silence diagnostic (inherited gap, not in iter3 scope)

iter2 U3 noted that the design provides recovery-via-reconstructor but no operator-facing diagnostic for "hook fired but no `agents[]` mutation visible." iter3 did not address; the scope contract excluded this. Deferred-Medium-50.

## Stage 3 — Findings

### F-USAGE-iter3-1 — Fix A/B/C all actionable without re-reading iter2 (POSITIVE)
- type: `general`
- domain: `usability`
- disposition: `addressed`
- confidence: 100
- severity: Low (informational)
- evidence: D-1 + T1-I-T1.a + T1-I-T1.h Fix A self-contained; D-3-3 + T3-I-T3.c Fix B verbatim inline; D-3-3-resolver + T3-I-T3.h Fix C self-contained with backlog pointer.
- why it matters: executor can pick up the draft at Planning without forcing a re-read of iter2.
- suggested direction: preserve as a template.

### F-USAGE-iter3-2 — U3 hook-silence diagnostic deferred (carry-forward)
- type: `scenario_gap`
- domain: `usability`
- disposition: `deferred`
- confidence: 50
- severity: Medium
- inherited-from: `iter2/claude/usage-U3`
- evidence: iter3 scope explicitly excluded any non-Fix-A/B/C change.
- why it matters: when the executor authors the hook script, the lack of a "hook ran but did not mutate session.json" diagnostic surface will surface as an Execution-time issue. The reconstructor partially mitigates (it's the recovery mechanism) but a positive-confirmation diagnostic would help.
- suggested direction: surface in Planning as a checklist item for the hook script's leading comment block — print a one-line "agents[<id>] appended" log to stderr after successful append (with `>/dev/null 2>&1` redirect available for production silence).

## Preserve list (carry to Planning)

1. The Fix B verbatim inline in D-3-3 — executor doesn't need network access.
2. The Fix C backlog file's "Suggested approach" + "When to pick up" sections — model for future deferred items.
3. The WORK exit checklist's empirical-confirmation pattern (`[x]` + grep/ls/regex result).
4. The Decisions-Locked bullet at line 68 — gives a one-paragraph summary the user can re-confirm if asked at session resume.

## Verdict

**PASS** — All three iter3 fixes are actionable for the executor and future evaluators; inherited U3 deferred per scope; no new High usage findings.
