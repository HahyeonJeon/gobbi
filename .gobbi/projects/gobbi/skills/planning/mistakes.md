---
type: mistakes
skill: planning
description: "Recorded traps for planning — load before doing planning work"
updated: 2026-07-19
---

# Planning — Mistakes

> Load before any planning work. Each `## ` section is one active trap; `## Archived` holds superseded ones.

## Readiness Scan Must Disposition Out of Worktree Writes

`priority: high` · `domain: process` · `added: 2026-06-24` · `status: active` · `tags: [process]`

**What happened** — A readiness gate issued a "0 blocking gaps" claim for a campaign whose plan included trimming a home-directory file outside the worktree and PR. The scan covered only repo-local signals and named no writer, access evidence, or reversal. A worktree-sandboxed evaluator then reported the home file as not writable, but that proxy result did not represent the actual writer's access.
**Why it happens** — A repo-only readiness scan misses in-scope writes to home directories and external services. Those surfaces have separate ownership, authority, and reversibility. Sandbox access checks can also produce false negatives when the evaluator is not the eventual writer.
**How to detect** — The locked scope or concrete task map includes a write outside the worktree or PR, while the readiness report's clean claim does not name the actual writer, exact surface, authority/access evidence, reversibility, and go/no-go disposition.
**Correct approach** — Every external write gets an explicit disposition: actual writer/owner, exact surface, read-only authority/access evidence gathered from that writer's real context, reversibility, and go/no-go. Scope a clean claim to repo-local work plus fully dispositioned external writes. Treat a sandbox proxy's writability result as evidence about that sandbox only; confirm authority from the actual writer before classifying the task.

## Plan Verification As Contract Not Must Pass Now Shell

`priority: high` · `domain: process` · `added: 2026-06-25` · `status: active` · `tags: [verification, process]`

**What happened** — A Planning task plan wrote each task's `verifies:` gate as runnable shell intended to exit 0 AS WRITTEN in the plan. Two failures followed, surviving two REVISE iterations: (1) the gates ran a whole-file `check-markdown-links.sh` over target files that carry pre-existing, out-of-scope broken links, so the gate exits 1 regardless of whether the edit is correct — it can NEVER pass; (2) shell-mechanic bugs — a `! grep …` drift check is inert under `set -e` (the negation's exit is ignored), and the cross-file contract block was unreachable (chained after a failing link check). The leader tried to fix it by patching the shell twice; both REVISEs failed.
**Why it happens** — An altitude error: the plan treated verification as must-exit-0-NOW shell, before the edits exist and against files with pre-existing breakage the feature will not fix. A plan cannot carry a passing run of a gate whose subject content does not exist yet, and a whole-file guard conflates "did my edit succeed" with "is the entire pre-existing file clean."
**How to detect** — (a) A `verifies:` gate that runs a whole-file linter/guard over a file you did not fully author (pre-existing issues will block it); (b) `! grep …` used as a failing assertion under `set -e` (it never fails); (c) a gate chained after another that can fail on out-of-scope conditions (unreachable); (d) two REVISEs on the same verification axis — the signal to stop patching and fix the model.
**Correct approach** — Specify verification as a CONTRACT + METHOD the executor runs at its Verify phase against the real edited files, not must-pass-now shell. (A) Content assertions — `grep -q '<exact string the edit adds>' <abs-path>` proves the edit landed. (B) Baseline-diff for linters/guards on files with pre-existing issues — capture the guard's failing-line baseline BEFORE editing; after editing assert `comm -13 before after` is empty (NO NEW failures vs baseline); never "absolute zero failures" when the file has out-of-scope pre-existing breakage. (C) Standalone, correctly-failing contract gates — run independently (never chained after a gate that can fail on out-of-scope conditions); use `if grep -rIlE '<drift>' <files>; then exit 1; fi` (has teeth), not `! grep` under `set -e`; scope drift patterns to avoid matching pre-existing prose. The plan states WHAT must be true + the METHOD; the executor runs the actual commands at Verify and pastes real exit codes.

### Related
- [[verification-gate-must-be-runnable-not-placeholder]] — the complementary trap (a gate that is a placeholder, not runnable)

## Verification Gate Must Be Runnable Not Placeholder

`priority: high` · `domain: verification` · `added: 2026-06-24` · `status: active` · `tags: [verification, process]`

**What happened** — A Planning task plan's `verifies:` gates contained `<...>` fill-in placeholder tokens — e.g. `<run family-b>`, `<flat-by-area-filter>` — framed as deliberate "tell-what-not-how" executor-fill points. The planning leader PASS'd them; the Codex evaluator REVISE'd (High/100): a verification GATE with a placeholder is not runnable as-is — the checker must be invented by whoever runs it, reintroducing false-PASS risk. An earlier iter also REVISE'd because gates were prose, or asserted exit-0 on a guard that currently exits 1 — counts and exit-codes not re-baselined against a fresh live run. Two REVISE rounds were required.
**Why it happens** — A verification GATE is distinct from an implementation step. The executor legitimately decides HOW to implement (so implementation prose in `what:` can be high-level). But a GATE is what the MANAGER/EVALUATOR runs to confirm the task is complete — it must run verbatim. When a gate holds a `<...>` fill-in, the checker is invented or guessed at run time. That is the executor-invents-the-check / false-PASS risk the whole discipline exists to prevent. The mistaken assumption: "executor-fill" style is acceptable in a `verifies:` block because it is acceptable in a `what:` block. Additionally, counts and exit-codes in gates must be re-derived from a fresh live run at plan time, not guessed from the scope model.
**How to detect** — A `verifies:` / acceptance block contains any `<...>` token that is NOT one of the plan's defined path constants (e.g. `<WT>`, `<PM>`); a gate cites a count or exit-code that was not produced by a fresh run of the actual command against the current tree; a gate says "run X" without giving X's full invocation. On receiving a plan, ask: "Can I copy this gate command into a shell right now and run it?" If the answer is no, it is a placeholder.
**Correct approach** — Every gate in a `verifies:` block must be a command runnable AS-IS with zero fill-in. Two rules. (1) No `<...>` tokens in runnable lines — the only angle-bracket tokens permitted are documented path constants (`<WT>`, `<PM>`); any per-file run-time value must be expressed as a WHOLE-TREE PROPERTY CHECK instead. (2) Re-baseline every count and exit-code from a fresh live run before declaring the plan ready for evaluation. A forward-reference to a command a task BUILDS is acceptable only if stated as its exact intended invocation (e.g. `bash <PM>/scripts/check-skill-mistakes.sh <file>` — the deliverable's exact run form), never a vague placeholder like `<run new-script>`.
