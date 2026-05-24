## Artifact Summary + Memory reads

What: Performance evaluates whether iter3 reduces downstream work amplification. Why: the iter2 gap could create costly Execution debugging if a workspace symlink was replaced and Planning had no rule to prevent or detect it. How: iter3 adds the edit-method safety table, a runtime `test -L` check, and a deferred CI guard with pick-up triggers. Scope: no runtime performance path is changed; this is markdown readiness for Planning and Execution.

Memory reads: `draft-iter3.md`; `draft-iter2.md`; `preparation/evaluation/iter2/codex/performance.md`; relevant iter2 Structure/Usage/Consistency/Risk/Overall files; mirror-policy decision file; CI backlog; staging list; project mistakes and rules listed in `project.md`.

Tool evidence used: symlink count `53`; `test-L-exit=1` from `/tmp` reproduction; backlog pick-up triggers at lines 29-31; `status: deferred`; row-20 count `1`.

## Locked Frame (Stage 1)

Scenario PF1: Iter3 removes the expensive downstream ambiguity.
- Check PF1.1: Planning can identify the safe default edit method.
- Check PF1.2: Bulk rewrite guidance prevents workspace-path symlink replacement.
- Check PF1.3: Verification catches link replacement before task completion.

Scenario PF2: The durable guard is not prematurely implemented.
- Check PF2.1: CI/pre-commit work is deferred.
- Check PF2.2: Deferral rationale cites zero current repo defects.
- Check PF2.3: Pick-up triggers are concrete enough to avoid re-triage later.

Scenario PF3 (adversarial): The added process creates more cost than the risk warrants.
- Check PF3.1: The current required check is a single `test -L` gate only after non-Edit-tool workspace modifications.
- Check PF3.2: Common `Edit`-tool changes stay on the simple path.
- Check PF3.3: The backlog estimates low effort but does not add it to Bundle B.

## Per-scenario per-check results

PF1.1: Yes. The discipline list starts with "Prefer the Claude Code `Edit` tool" and says it preserves the inode and traverses the symlink.
PF1.2: Yes. Point 2 says bulk rewrites should edit via `.gobbi/projects/gobbi/skills/...` directly and never run `sed -i` or `perl -i` against workspace `.claude/skills/...` paths.
PF1.3: Yes. Point 3 requires `test -L .claude/skills/<path>` and gives restore guidance.
PF2.1: Yes. The new file is under `staging/backlogs/project/` and grep returned `status: deferred`.
PF2.2: Yes. The backlog says witness count for the bad-edit failure is currently zero in this repo.
PF2.3: Yes. It names three triggers: first real defect, `N>=2 future bundles`, and tooling change.
PF3.1: Yes. The gate is limited to "after any non-Edit-tool modification touching a workspace path"; it does not require all edits to run a heavier check.
PF3.2: Yes. `Edit` is marked YES in the safety table.
PF3.3: Yes. The backlog estimates "low (a half-day script + CI wire-up)" and owner "deferred".

## Iter2 finding dispositions

ID: COD-PERF-PREP2-001
disposition: addressed
evidence: Although the iter3 prompt listed the five High blocker findings, the iter2 Performance file also carried an open Medium downstream-cost risk. The new contract addresses it by making the safe edit path explicit, adding `test -L` detection, and deferring the heavier CI guard until a witness or exposure trigger exists.

## Typed findings

No new iter3 Performance findings.

## Low-confidence appendix

None.

VERDICT: PASS
