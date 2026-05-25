# Project — T04 gobbi-hook-authoring (iter1, claude)

## Artifact Summary + Memory reads
**What**: New project skill `.gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md` (254 lines) authored from N=2 in-tree hook witnesses, byte-identical staged twin, backlog `gobbi-hook-authoring-skill.md` flipped deferred→closed. Commit `9dbb5da`.
**Why**: Backlog item (anchor session 2026-05-23-1b26cf20) — codify the bash+jq+flock+strict-mode+env-file hook pattern now that N=2 witnesses exist (witness-bound, Principle 10). Plan task T04 / CL-2.
**How**: Stamp the `interview/templates/project-skill.md` shape, derive every rule from the two hooks, promote staged→project path, close backlog.
**Scope Contract**: delegation prompt (T04 of Bundle C). In-scope = 3 files (skill, staged twin, backlog). Out-of-scope = mistake/orchestration/CLAUDE/gobbi/wrap-up SKILLs, 10 sweep skills, `.claude/hooks/**`, `.claude/skills/gobbi-hook-authoring` symlink.
**Downstream consumers**: future hook authors + executors with hook tasks + hook-artifact evaluators.

**Memory reads**: principles SKILL; evaluation SKILL; execution/evaluation.md; mistake SKILL; rules/stub-redirect-format.md; mistakes/claude-evaluator-step4-only-vs-codex-whole-file-grep.md; mistakes/leader-iter2-verification-claim-without-evidence.md; both witness hooks; project-skill.md template; backlog.

## Locked Frame (Stage 1)
- **S1 Change-set matches contract 1:1** — checklist: (a) 3 files produced; (b) no extra files. [seed: change-set matches outputs]
- **S2 Verification gates pass on the change-set** — (a) ≥4 canonical H2s; (b) both witnesses cited; (c) M2-compliant; (d) staged≡promoted; (e) backlog closed.
- **S3 No file outside scope touched** — `git diff --name-only` confirms only the 3 contracted files.
- **S4 Commit message names the task + witness** — references T04/CL-2 + witnesses.
- **S5 (adversarial) "while I was in there" creep** — diff scanned for any change not mapping to a contract output (e.g., symlink, settings.json, hook edits).

## Per-scenario per-check results
- S1a YES — `git show --stat 9dbb5da`: backlog + staged SKILL + promoted SKILL (3 files). S1b YES — name-only shows exactly those 3.
- S2a YES — `grep -cE '^## (Core Principles|Procedures|Constraints|Output paths)'` = 4. S2b YES — witness citation count 18 (≥2 distinct). S2c YES — only 2 CCSI mentions, both factual hook-mechanics (L106 verbatim code line; L124 explicitly disclaims path-convention confusion); zero `{session-id}` path-convention rows. S2d YES — `diff staged promoted` → IDENTICAL. S2e YES — backlog `status: closed`.
- S3 YES — no out-of-scope file in the diff; `.claude/hooks/**` untouched; no symlink created (correctly OOS).
- S4 YES — commit body names T04/CL-2 + both witnesses + AI-Provenance-Record.
- S5 YES — backlog diff is status flip + a Closure section only; no orthogonal edits.

## Typed findings
None at Project severity ≥ Medium. The change-set is the right task, the whole task, and only the task.

Note (Low/100, process): executor's claimed-evidence file `execution/task-04/rawdata/draft-iter1.md` does not exist (only `codex-eval-prompt-iter1.md` + `codex-eval-stdout-iter1.log` present). Per Principle 2 the verdict rests on the deliverable, which fully verifies — so this is a report-hygiene note, not a deliverable defect.

**Verdict: PASS**

## Low-confidence appendix
(none)
