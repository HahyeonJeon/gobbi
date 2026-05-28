---
name: evaluator-returned-verdict-inline-no-per-perspective-files
description: "Claude evaluator returned verdict inline; did not write the contracted per-perspective files when the Write tool was absent."
type: mistakes
scope: project
feature: null
status: active
created: 2026-05-23
session: 7ea62d36-e826-4ce6-9e90-9e948007b068
tags: [process, evaluation, orchestration]
domain: process
supersedes: null
superseded_by: null
---

# Evaluator returns verdict inline; no per-perspective files written

## What happened

T05 Claude evaluator (iter1) returned a PASS verdict with full per-perspective findings inline in its response. It did NOT write the contracted 8 per-perspective .md files (project / structure / performance / aesthetics / usage / consistency / risk / overall) to the evaluation output dir despite the brief explicitly requiring those output paths.

Manager wrote a proxy overall.md to preserve the verdict and 2 Low findings to disk for audit-trail continuity, but project / structure / performance / aesthetics / usage / consistency / risk per-perspective files are missing from `sessions/.../execution/T5/evaluation/iter1/claude/`.

## Why it happens

The `evaluator` agent type's `tools` list per `.claude/agents/evaluator.md` is `Read, Grep, Glob, Bash` — **no `Write` tool**. The evaluator interpreted this absence (plus possibly some directive in the agent system prompt to "not write report .md files") as forbidding file writes, and chose to return findings inline.

This is BOTH a tools issue (no Write means writes must go via Bash heredoc) AND a behavioral issue (the evaluator chose inline rather than `cat > file.md << EOF` via Bash). Prior evaluators in this session DID write files (via Bash heredoc); this one chose differently.

## Correct approach

Either:

1. **Add `Write` to evaluator's `tools` list** (in `.claude/agents/evaluator.md`) so file writes are first-class. The evaluator brief already specifies output paths; the role's tool surface should match.

2. **Make Bash-heredoc-write explicit in the evaluator brief**. Add a line: "If you lack the Write tool, use `mkdir -p <dir> && cat > <path> << 'EOF' ... EOF` via Bash for each of the 8 per-perspective files. Do NOT return findings inline — the per-perspective files are the audit trail."

3. **Add a verification gate to the manager's post-evaluation step**: after evaluator returns DONE, manager runs `ls -1 sessions/.../evaluation/iter{N}/{system}/ | wc -l` — must return 8. If not, re-dispatch the evaluator with explicit Bash-write instructions.

Recommended: combine (2) into the evaluator brief template at `.claude/skills/delegation/templates/evaluator.md` AND (3) as a manager-side check.

## How to detect

- Evaluator's response begins with verdict + findings TABLE in the chat
- `ls sessions/.../evaluation/iter{N}/{system}/` shows fewer than 8 files (or only `overall.md`)
- Evaluator self-narrates a directive conflict like "I should NOT write report .md files, but the brief requires per-perspective files... I'll return inline."

## Source

- T05 iter1 Claude eval: agent ID `a0bf7024f118377d1` returned verdict + inline findings; `ls execution/T5/evaluation/iter1/claude/` after dispatch showed 0 files (manager later wrote proxy overall.md).
- Comparison: prior evaluators in this session (Ideation iter1-3, Preparation iter1-3, Planning iter1-2, Execution T1-T4) all wrote 8 per-perspective files via Bash heredoc.
- Tool surface verification: `grep "^tools:" .claude/agents/evaluator.md` → `tools: Read, Grep, Glob, Bash` (no Write).
