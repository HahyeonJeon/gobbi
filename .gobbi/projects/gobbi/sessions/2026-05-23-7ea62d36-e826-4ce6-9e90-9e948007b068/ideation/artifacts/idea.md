---
loop: ideation
iter: 3
artifact_type: idea
created_at: 2026-05-23
status: final
supersedes: []
related:
  - sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/ideation/rawdata/draft-iter3.md
  - sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/ideation/rawdata/draft-iter2.md
  - sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/ideation/rawdata/draft-iter1.md
  - sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/ideation/staging/decisions/iter1-user-redirects.md
  - sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/ideation/evaluation/iter3/claude/overall.md
  - sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/ideation/evaluation/iter3/codex/overall.md
feature: gobbi-orchestration-workflow-improvements
name: gobbi-orchestration-workflow-improvements
description: "Bundle A — new codex skill + memorization moment-of-capture discipline + memorization delegation hard gate + Wrap-up Step 2.5 prior-loop compliance check + naming-convention enforcement via Consistency evaluator + two gobbi/SKILL.md polish edits."
phase: ideation
verdict: pass
session-id: 2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068
---

# Idea — Gobbi Orchestration + Workflow Improvements (Bundle A)

> Planning Loop input. This is the final PASS artifact from Ideation iter3.
> Source: `draft-iter3.md`. Evaluation: Claude PASS (0 Critical/High/Medium, 2 Low informational) + Codex PASS (0 Critical/High/Medium, 1 Low COD-CONS-003).
> Do NOT re-open Ideation. Planning decomposes the 15 checklist items into tasks.

---

## Scope Contract

```yaml
artifact_type: scope-contract
feature: gobbi-orchestration-workflow-improvements
goal: "Repair four discipline gaps in gobbi orchestration/workflow that broke last session — codex invocation lacks a canonical best-practices anchor; memorization runs late and unloaded; wrap-up never checks prior-loop compliance; naming convention is documented but unenforced — plus two minor polish items in the gobbi entry skill."
created-by: 2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068
created-at: 2026-05-23
```

### In-Scope (7 items, LOCKED)

| # | Item | Deliverable surface |
|---|---|---|
| A | New `codex` skill — content-complete best-practices for Codex in Claude Code. Covers invocation patterns (`codex exec` universal first; `codex:codex-rescue` manager-only second; `/codex:adversarial-review` user-only third), sandbox semantics, CWD + worktree path discipline, hang/timeout patterns, dual-system evaluator-spawn as one documented use case. | Source-of-truth `.gobbi/projects/gobbi/skills/codex/SKILL.md` (new); file symlink `.claude/skills/codex/SKILL.md`; directory symlink `.agents/skills/codex` (16→17 post-ship); `gobbi/SKILL.md § Skill Map` row. |
| B | Memorization moment-of-capture discipline (pathology γ). Corrections/decisions/mistake-candidates noted at moment-of-occurrence during WORK, not deferred to MEMORIZATION. | `memorization/SKILL.md` (new Core Principle); `mistake/SKILL.md` P2 (reciprocal link). |
| C | Memorization delegation hard gate (pathology α). Every MEMORIZATION dispatch loads `memorization/SKILL.md` in Load Directives Skills tier. | `delegation/SKILL.md` (Core Principles + Load Directives table row); per-role templates `delegation/templates/` (assistant, leader, executor — not evaluator). |
| D | Wrap-up Step 2.5 — prior-loop MEMORIZATION compliance check. Between Step 2 and Step 3: scan each prior loop's `rawdata/` and `staging/` for shape conformance; classify gaps as `mechanical` (auto-backfill inline using actual 5 Types + Slug+collision policy) or `judgment-required` (NEEDS_CONTEXT). | `wrap-up/SKILL.md` (insert Step 2.5; update Exit checklist + Constraints). |
| E | Naming-convention enforcement via Consistency + Aesthetics evaluator perspectives. | `evaluation/SKILL.md § Coverage Ownership Matrix` (new row); `memorization/SKILL.md` (cross-link from Path Conventions). |
| F | Polish 1-1 — move `## Glossary` in `gobbi/SKILL.md` from before § Session Bootstrap Order to after it. | `gobbi/SKILL.md` (1 Edit). |
| G | Polish 1-4 — drop legacy setup questions; ask 1 question (mode, default auto) + customize gate. | `gobbi/SKILL.md § Step 4` (rewrite). |

### Out-of-Scope (explicit)

- 1-2 skill-loading discipline (eager-load) — defer; root cause investigation needed.
- 1-3 worktree-first session architecture — defer; failure mode not yet named.
- 2-1 Auto mode silence semantics — defer; coupled to memorization fix outcome.
- 2-2 Chat mode tiki-taka redesign — user-deferred explicitly.
- 4-1 session.json subagent metadata + tokensUsed hook — defer; feasibility unverified.
- Any change to `packages/cli/src/` — path does not exist in current repo state (`ls` exits 2).
- Pathology β (manager inline-bypass) — not observed; conditional on Wrap-up Step 2.5 detecting it.

### Decisions Locked

- **Bundle A only** (not split into sub-bundles).
- **Content-complete codex skill** — not skeleton + follow-up.
- **Codex invocation priority**: `codex exec` universal primary; `codex:codex-rescue` manager-only secondary; `/codex:adversarial-review` user-only tertiary.
- **Memorization fix**: γ + α. β not in scope unless evidence found.
- **Wrap-up Step 2.5**: hybrid auto-backfill (mechanical) + NEEDS_CONTEXT (judgment-required).
- **Naming-convention enforcement**: Consistency+Aesthetics evaluator check, NOT CLI lint.
- **No `packages/cli/` writes** — source tree absent.
- **`orchestration/SKILL.md § Step 1`** is the Configuration reference (no `workflow/configuration.md` file exists).

### Success Criteria

1. `.gobbi/projects/gobbi/skills/codex/SKILL.md` exists with 8 H2 sections; `.claude/skills/codex/SKILL.md` is file symlink; `.agents/skills/codex` is directory symlink (count 16→17); `gobbi/SKILL.md § Skill Map` row added; invocation patterns in priority order; "Why subagents must use `codex exec`" subsection; post-eval `find` sanity check; cost subsection.
2. `memorization/SKILL.md` has Core Principle "Moment-of-capture, not end-of-loop" linking to `mistake/SKILL.md` P2; P2 reciprocally links back.
3. `delegation/SKILL.md` + `delegation/templates/{assistant,leader,executor}.md` carry explicit Load Directives entry for `memorization/SKILL.md` in MEMORIZATION dispatches. Evaluator template excluded.
4. `wrap-up/SKILL.md` carries Step 2.5 with: inputs, scan procedure, 4-category gap table, mechanical/judgment-required classification (using actual 5 Types), auto-backfill + collision policy, NEEDS_CONTEXT trigger, gap report to `rawdata/promotion-manifest.md`. Exit checklist updated.
5. `evaluation/SKILL.md § Coverage Ownership Matrix` has new "Memorization staging shape + naming" row.
6. `gobbi/SKILL.md` has Glossary below Session Bootstrap Order; Step 4 asks 1 mode question (default auto) + customize gate.
7. No `packages/cli/` writes.
8. User pre-approved 7-item scope. Mistake-discipline rule per `.claude/CLAUDE.md:50` honored.
9. Codex skill cites empirically-grounded sandbox claims.

### Deferred

- Pathology β — re-open only if Wrap-up Step 2.5 detects it.
- CLI lint for naming convention — wait for `packages/cli/src/`.
- session.json subagent tokensUsed — feasibility check needed.
- Worktree-first architecture — failure-mode reproduction needed.
- Auto-mode silence semantics — after memorization fix outcome.
- COD-CONS-003: example `Domain=\`testing\`` → `Domain=\`test\`` — micro-fix in Execution of item D.

---

## Framed Problem

### Root Cause

Four behavioral discipline gaps in gobbi's orchestration + workflow layer compounded across session `2026-05-22-bac669ad`:

1. **No canonical codex usage anchor.** `codex:codex-rescue` is a thin forwarder (`agents/codex-rescue.md:12`); `codex-cli-runtime` is marked `user-invocable: false`. Neither tells the gobbi manager how to invoke codex for evaluator spawns, handle sandbox + CWD, or detect hangs. Result: the codex-eval-session-write-path mistake happened (`mistakes/codex-eval-session-write-path-nested-in-worktree.md:19-22`) because the delegation prompt lacked an explicit absolute-path mandate.

2. **Memorization runs late, unloaded, and staging discipline is not enforced.** Empirically session `2026-05-22-bac669ad`: T1 (8 eval files), T2 (13 eval files), T5 (9 eval files) had full evaluations but staging was empty/absent. T3, T4, T6, T7 had partial evaluations and staging empty/absent. Two distinct pathologies: γ (write-as-you-go — corrections not staged at moment-of-occurrence) and α (delegation hard gate — MEMORIZATION dispatched without `memorization/SKILL.md` in Load Directives).

3. **Wrap-up never re-validates prior-loop output shapes.** `wrap-up/SKILL.md` WORK Steps 2-4 enumerate staging files but assume prior MEMORIZATION was clean. T2/T3 had staging *directories absent entirely*. Wrap-up would have reported "0 files staged" as clean — silent data loss.

4. **Naming convention exists but has no enforcement vehicle.** `memorization/SKILL.md` Path Conventions define the `{slug}.md` per-finding naming. Last session's `ideation/staging/decisions/ideation-decisions.md` (bulk file) violates it. No automated check; `packages/cli/src/` absent.

### Impact

- **Who is affected**: every future gobbi session that spawns codex evaluators, runs MEMORIZATION, or relies on Wrap-up to promote findings.
- **Severity**: medium-high. Lost findings degrade the system's promise. Codex path mistakes cause real cleanup work.
- **Cost of inaction**: every future session repeats T1-T7 staging gaps; codex invocations continue to write to wrong paths; Wrap-up promotion-manifest accuracy degrades.

### Success Criteria

See Scope Contract § Success Criteria (9 verifiable bullets above).

### Prior Attempts

- 2026-05-22 session (`bac669ad`): PR #265 shipped env-var audit + SessionStart hook; recorded `codex-eval-session-write-path-nested-in-worktree.md` + `manager-rm-rf-without-investigating-tracked-files.md`. No codex skill or memorization fix shipped.
- No prior attempt at Wrap-up Step 2.5.
- No prior attempt at naming-convention enforcement.

### Counterfactual / Steel-man

"These four items are unrelated; bundling increases blast radius — ship as four separate sessions."

Counter-evidence: User explicitly considered granularity and locked Bundle A. The four items share witness session `bac669ad` and a shared root cause. B+C+D+E are coupled: B is source-side fix; C is prompt-side fix; D is detection-side fix; E is verification-side fix. Splitting risks shipping one without the others, recreating the asymmetry. Per-item scope discipline (each item = one Planning task, sequential execution) mitigates blast-radius concern.

### Re-framing Conclusion

None — the user's framing of "improve gobbi orchestration/workflow" is concrete enough. A broader "session-architecture overhaul" was considered and explicitly rejected because failure modes for 1-2/1-3 are not yet named.

---

## Research Insights

### Internal Insights (abridged for Planning consumption)

- **I1**: `codex:codex-rescue` is a thin forwarder; invokes `node codex-companion.mjs task ...`. Not a general-purpose codex wrapper.
- **I2**: `/codex:adversarial-review` has `disable-model-invocation: true` — user-only; manager must ask user to type it.
- **I3**: Codex sandbox defaults to `read-only`; write requires `--sandbox workspace-write` (raw `codex exec`) or `--write` (plugin agent).
- **I4**: Codex CWD defaults to `process.cwd()`; set explicitly via `-C, --cd <DIR>`. The worktree-nested-path mistake (`mistakes/codex-eval-session-write-path-nested-in-worktree.md:19-29`) traces to this.
- **I5**: No built-in timeout in `codex exec`. Shell `timeout 600 codex exec ...` is the mechanism for automation. `DEFAULT_STATUS_WAIT_TIMEOUT_MS = 240000` is a status poll timeout, not an execution cap.
- **I6**: T1 (8 eval files), T2 (13), T5 (9) in session `bac669ad` — full evaluations, staging empty/absent. T3 (3), T4 (2), T6 (2), T7 (2) — partial evaluations, staging empty/absent. Both pathology classes: γ (write-as-you-go) and α (delegation hard gate). β (manager inline-bypass) NOT observed — assistant agents were spawned; failure was inside the spawn.
- **I7**: `wrap-up/SKILL.md:134-143` shows no prior-loop compliance check between inventory and routing.
- **I8**: `ls /playinganalytics/git/gobbi/packages/cli/src/` exits 2 — path does not exist. CLI lint infeasible.
- **I9**: `gobbi/SKILL.md:15-29` Glossary appears before Session Bootstrap Order (line 32).
- **I10**: `gobbi/SKILL.md § Step 4` (lines 99-114) asks 2 questions. `orchestration/SKILL.md § Step 1` rows 1-2 already encode "use defaults vs customize" gate. Settings defaults verified: `"mode": "auto"`, `"workflow.ideation.evaluate.mode": "always"`, `"git.pr": {"open": false, "draft": false}`.
- **I11**: `evaluation/SKILL.md § Coverage Ownership Matrix` (lines 98-110) is the canonical cross-cutting concern → perspective mapping. 5-Type vocabulary at `evaluation/SKILL.md:344-352`: **`scenario_gap`, `checklist_gap`, `design_flaw`, `assumption_risk`, `general`** (re-verified iter3 via `sed -n '344,352p'`). Domain routing at `evaluation/SKILL.md § Complete Domain → staging destination routing (general Type)` (line 356). Slug+collision policy at lines 385-393.
- **I12**: Item D witness: T1/T2/T5 = full eval + empty/absent staging (pure memorization-skip, cleanest witness). T3/T4/T6/T7 = partial eval + empty/absent staging (eval-also-skipped, separate problem class).
- **I13**: `.claude/agents/{leader,executor,evaluator,assistant}.md` — all lack Agent tool. Only `.claude/agents/manager.md` has `tools: "*"`. `codex:codex-rescue` agent itself declares `tools: Bash` — thin Bash wrapper around `codex exec`.
- **I14**: `.agents/skills/` has **16** directory symlinks (verified `ls | wc -l`): delegation, discussion, evaluation, execution, git, gobbi, ideation, interview, memorization, mistake, orchestration, planning, preparation, principles, research, wrap-up. Adding codex brings count to 17 post-ship.

### External Insights (abridged)

- **E1**: Codex CLI uses app-server + thread-based execution. Each invocation creates a thread. `--resume-last` to continue prior thread; no resume = fresh context.
- **E2**: Linux sandbox uses bubblewrap. `workspace-write` allows writes to CWD subtree only. `--add-dir <DIR>` extends writable set for cross-tree writes (worktree + main-tree session path).
- **E3**: Effort levels `none|minimal|low|medium|high|xhigh`. Leave unset unless user requests — effort multiplies token cost.
- **E4**: Default model from `~/.codex/config.toml`. Alias: `spark → gpt-5.3-codex-spark`. Do NOT override `--model` unless user specified.
- **E5**: `/codex:setup` precondition for first use. Gobbi does not install codex itself.

---

## Scenarios

### Golden — A new gobbi session that needs a codex review during EVALUATION

1. Manager dispatches evaluator agents (one Claude, one Codex).
2. For Codex evaluator, manager has two options:
   - Option A: `codex exec --cd /playinganalytics/git/gobbi -s read-only ...` via Bash (universal).
   - Option B: `Agent(subagent_type="codex:codex-rescue", ...)` (manager-only convenience; reduces to `codex exec` internally).
3. For full adversarial review: manager **asks user** to type `/codex:adversarial-review` (per `disable-model-invocation: true`).
4. After codex completes, manager runs post-eval `find` sanity check: `find /playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/{session-id} -newer <marker> -type f` to confirm files at main-tree absolute path, not worktree.
5. No path mistake because absolute path was inline-pasted (or `--cd` set to main-tree) AND verified post-hoc.

### Golden — A WORK phase produces a correction; memorization is captured at moment-of-occurrence

1. Leader mid-WORK; user corrects an approach.
2. Per `memorization/SKILL.md` Core Principle "Moment-of-capture, not end-of-loop" (item B), leader writes the correction to `sessions/.../{loop}/rawdata/correction-notes.md` or `staging/decisions/{slug}.md` with `mistake-candidate: true` **before** continuing.
3. MEMORIZATION dispatch includes `memorization/SKILL.md` in Load Directives (item C). Assistant reads correction-notes, stages them, persists.

### Golden — A subagent needs an inline codex second-opinion mid-WORK

1. Executor mid-implementation, hits ambiguous design question.
2. Executor lacks Agent tool — cannot spawn `codex:codex-rescue`.
3. Per codex skill, executor calls `codex exec --cd /playinganalytics/git/gobbi -s read-only ...` via Bash tool.
4. Codex returns second-opinion to stdout; executor parses and continues.

### Edge — Codex CWD inheritance from worktree

1. Manager operating in worktree mode; CWD is inside worktree.
2. Invocation sets `--cd /playinganalytics/git/gobbi` (main-tree absolute) AND inlines the main-tree session-write path in the delegation prompt.
3. Codex writes to correct main-tree path. Post-eval `find` sanity check confirms. If sandbox refuses, manager runs manager-proxy write.

### Edge — Wrap-up detects a prior-loop staging gap

1. Step 2.5 detects Execution T3 has 0 staging files but 3 evaluation findings.
2. Classifies each finding:
   - `general` with single Domain → **mechanical** → auto-backfill with Slug+collision policy pre-write check.
   - `design_flaw` → **judgment-required** → NEEDS_CONTEXT.
3. Auto-backfilled mechanical findings recorded in `rawdata/promotion-manifest.md`; judgment-required gaps surfaced as single NEEDS_CONTEXT with `user-question:` block.

### Failure — Codex hangs during evaluator spawn

1. Manager runs `timeout 600 codex exec ...` (foreground with timeout).
2. Timeout triggers after 600 seconds.
3. Manager surfaces to user: "Codex evaluator has been running for 10 minutes. Wait / abort / restart?"
4. On abort: manager invokes `/codex:cancel` (user-only) or kills the background job.

### Adversarial — Subagent attempts to spawn `codex:codex-rescue` plugin agent

1. Executor tries `Agent(subagent_type="codex:codex-rescue", ...)`.
2. Fails: executor's agent spec lacks Agent tool.
3. Per codex skill Anti-patterns, executor reaches for `codex exec` via Bash instead.

### Adversarial — Memorization silently skipped (delegation Load Directives omission)

1. Manager dispatches MEMORIZATION without `memorization/SKILL.md` in Load Directives.
2. Wrap-up Step 2.5 later detects staging gap; classifies mechanical findings and auto-backfills; surfaces judgment-required findings as NEEDS_CONTEXT.
3. Either way the gap is not silent. Regression itself becomes a mistake-candidate next session.
4. Item C is preventive; item D is detective with hybrid auto-fix.

### Adversarial — Naming convention drift (bulk-staged findings)

1. Memorization assistant writes one bulk file `staging/decisions/ideation-decisions.md` instead of per-finding `{slug}.md`.
2. Wrap-up Step 2.5 detects shape mismatch — bulk file with multiple finding-ids is judgment-required (splitting is not deterministic).
3. EVALUATION of WRAP-UP Consistency seed scenario (item E) also raises finding. Verdict REVISE; bulk file split before promotion.

### Adversarial — Codex skill ships missing `.agents/skills/codex` symlink

1. Bundle A ships with only `.claude/skills/codex/SKILL.md` (Claude-side).
2. Manager asks codex to consult its skill — codex looks under `.agents/skills/codex/` and finds it absent. Falls back to default behavior. Dogfood promise broken.
3. Per item A, both symlinks ship together. Adversarial path closed.

---

## Implementation Checklist

Each item maps to a confirmed insight and has a validation method. 15 items, all machine-checkable.

| # | Checklist item | Anchored insight | Validation method |
|---|---|---|---|
| 1 | Create `.gobbi/projects/gobbi/skills/codex/SKILL.md` with frontmatter + 8 H2 sections locked (see Design A) | I1, I2, I3, I4, I5, I13, I14, E1, E2 | `grep -c "^## " .gobbi/projects/gobbi/skills/codex/SKILL.md` returns 8 |
| 2 | Create two symlinks: (a) file-level `.claude/skills/codex/SKILL.md -> ../../../.gobbi/projects/gobbi/skills/codex/SKILL.md`; (b) directory-level `.agents/skills/codex -> ../../.gobbi/projects/gobbi/skills/codex` | I14 | `ls -la .claude/skills/codex/SKILL.md` → file symlink; `ls -la .agents/skills/codex` → directory symlink; `ls .agents/skills/ | wc -l` → 17 |
| 3 | Add row to `gobbi/SKILL.md § Skill Map § Cross-cutting skills` for `codex` | I1, I13 | `grep "codex" gobbi/SKILL.md` returns new row |
| 4 | Edit `memorization/SKILL.md`: add Core Principle "Moment-of-capture, not end-of-loop" with link to `mistake/SKILL.md` P2 | I6 | `grep "Moment-of-capture\|moment-of-capture" memorization/SKILL.md` ≥ 1 |
| 5 | Edit `mistake/SKILL.md` P2: strengthen "Do not defer to MEMORIZATION" + add reciprocal link to `memorization/SKILL.md` | I6 | `grep "memorization/SKILL.md" mistake/SKILL.md` ≥ 1 |
| 6 | Edit `delegation/SKILL.md`: add Core Principle "MEMORIZATION dispatches always include `memorization/SKILL.md` in Load Directives Skills tier" + table row | I6 | `grep -c "memorization/SKILL.md" delegation/SKILL.md` ≥ 2 |
| 7 | Edit per-role templates `delegation/templates/`: assistant + leader + executor include `memorization/SKILL.md`; evaluator excluded | I6 | grep each template; assistant + leader + executor reference it; evaluator does not |
| 8 | Edit `wrap-up/SKILL.md`: insert Step 2.5 between Steps 2 and 3; include 4-category gap table, classification rules (5 Types: `scenario_gap`, `checklist_gap`, `design_flaw`, `assumption_risk`, `general`), auto-backfill + Slug+collision policy pre-write check, NEEDS_CONTEXT trigger, gap report to `rawdata/promotion-manifest.md`; update Exit checklist | I7, I11 + iter1 redirect § Decision 1 | `grep "Step 2.5" wrap-up/SKILL.md` returns new section; `grep -i "mechanical\|judgment-required" wrap-up/SKILL.md` ≥ 1 each; `grep "scenario_gap\|checklist_gap\|design_flaw\|assumption_risk\|general" wrap-up/SKILL.md` confirms 5-Type vocabulary; `grep "directory-absent" wrap-up/SKILL.md` confirms 4th gap category |
| 9 | Edit `evaluation/SKILL.md § Coverage Ownership Matrix`: add new row "Memorization staging shape + naming → Consistency + Aesthetics" | I11 | `grep "staging shape" evaluation/SKILL.md` returns 1 hit |
| 10 | Edit `memorization/SKILL.md`: add cross-link from Path Conventions block (lines 223-231) to `evaluation/SKILL.md § Coverage Ownership Matrix § Memorization staging shape + naming` | I11 | `grep "Coverage Ownership Matrix" memorization/SKILL.md` returns 1 hit |
| 11 | Edit `gobbi/SKILL.md`: move § Glossary (lines 15-29) to after § Session Bootstrap Order (~line 124) | I9 | `awk '/^## Glossary/{a=NR}/^## Session Bootstrap Order/{s=NR}END{print s, a}' gobbi/SKILL.md` shows s < a |
| 12 | Edit `gobbi/SKILL.md § Step 4` (lines 99-114): rewrite from 2 questions to 1 question (mode, default **auto**) + customize gate | I10 | `awk '/^### 4\./,/^### 5\./' gobbi/SKILL.md` shows 1 mode question (default auto) + customize gate; no standalone eval-mode or git-mode questions |
| 13 | Verify `orchestration/templates/settings.default.json` already encodes defaults (`.mode = "auto"`, `.workflow.ideation.evaluate.mode = "always"`, `.git.pr = {open:false, draft:false}`) — no schema change | I10 | `jq '.mode, .workflow.ideation.evaluate.mode, .git.pr' orchestration/templates/settings.default.json` returns those values; no diff applied |
| 14 | Add "Use cases" section to codex skill showing BOTH evaluator-spawn patterns (manager-spawn + subagent inline) AND post-eval `find` sanity check; cite `codex-eval-session-write-path-nested-in-worktree.md` | I4, I13 | `grep "main-tree absolute\|codex-eval-session-write-path\|codex exec\|find " .gobbi/projects/gobbi/skills/codex/SKILL.md` ≥ 3 |
| 15 | Add "Anti-patterns" section to codex skill with 8 anti-patterns including subagent-cannot-spawn-plugin-agent and missing-agents-symlink entries | I1, I2, I13, I14, E3, E4 | `grep "Anti-pattern\|anti-pattern\|subagents lack" .gobbi/projects/gobbi/skills/codex/SKILL.md` ≥ 1 each |

---

## Design (Summary for Planning)

Planning should decompose this into 15 tasks per checklist above. The design sections below are the authoritative direction for each item.

### Design A — `codex` Skill

- **Direction**: Single SKILL.md + two symlinks + 8 locked H2 sections (~350-450 lines).
- **Invocation order (locked)**: (1) `codex exec` universal, (2) `codex:codex-rescue` manager-only, (3) `/codex:adversarial-review` user-only.
- **Key subsections**: "Why subagents must use `codex exec`" (empirical tool-surface witness); Sandbox + CWD (absolute-path mandate citing mistake file + post-eval `find` check); Cost + sandbox budget awareness; Anti-patterns.
- **Symlinks**: file-level `.claude/skills/codex/SKILL.md` + directory-level `.agents/skills/codex` (both mandatory — dogfood requires codex to load its own skill).

### Design B — Memorization Moment-of-Capture

- **Direction**: New Core Principle bullet in `memorization/SKILL.md § Core Principles` + reciprocal link with `mistake/SKILL.md` P2.
- **Placement**: after "Store what survives, not what's transient", before "Templates over freeform".

### Design C — Delegation Hard Gate

- **Direction**: New text in `delegation/SKILL.md § Load Directives Block`; per-role templates updated (assistant/leader/executor only; not evaluator).
- **Wording**: "When the delegated phase includes MEMORIZATION, `memorization/SKILL.md` MUST appear in tier 3 (Skills)."

### Design D — Wrap-up Step 2.5

- **Direction**: New step between Step 2 and Step 3; hybrid auto-backfill (mechanical) + NEEDS_CONTEXT (judgment-required).
- **Classification**: mechanical = Type ∈ {`scenario_gap`, `checklist_gap`, `general`} + single Domain + deterministic routing. Judgment-required = Type ∈ {`design_flaw`, `assumption_risk`} or other triggers.
- **Collision policy**: `evaluation/SKILL.md § Slug + collision policy` (lines 385-393) governs all auto-backfill writes.
- **Note**: example at iter3 line 482 uses `Domain=\`testing\`` — change to `Domain=\`test\`` during Execution (COD-CONS-003 micro-fix).

### Design E — Naming Convention Enforcement

- **Direction**: One new row in `evaluation/SKILL.md § Coverage Ownership Matrix` + cross-link from `memorization/SKILL.md § Path Conventions`.
- **Open concern 3**: exact cell text for Coverage Ownership Matrix row — Planning's DISCUSSION should confirm with user.

### Design F — Glossary Placement

- **Direction**: Move Glossary block from `gobbi/SKILL.md:15-29` to after Session Bootstrap Order ends.
- **Execution**: single Edit (cut + paste). No logic change.

### Design G — Drop Legacy Setup Questions

- **Direction**: Rewrite `gobbi/SKILL.md § Step 4` to ask 1 mode question (default auto) + optional customize gate. Remove standalone eval-mode + git-mode questions.
- **Reference**: `orchestration/SKILL.md § Step 1` rows 1-2 (NOT `workflow/configuration.md` — that file does not exist).

---

## Cross-Link Manifest

Bundle A creates these skill-to-skill links. Execution must wire all 10:

| # | From → To | Purpose | Item |
|---|---|---|---|
| 1 | `memorization/SKILL.md § Core Principle "Moment-of-capture"` → `mistake/SKILL.md § P2` | Reciprocal moment-of-capture rule | B |
| 2 | `mistake/SKILL.md § P2` → `memorization/SKILL.md § Core Principle "Moment-of-capture"` | Reverse leg of link 1 | B |
| 3 | `delegation/SKILL.md § Load Directives / Core Principles` → `memorization/SKILL.md § Procedure` | Delegation hard gate references staging procedure | C |
| 4 | `wrap-up/SKILL.md § Step 2.5` → `evaluation/SKILL.md § Finding Metadata` (lines 344-352) | Type-vocabulary source (5 Types) | D |
| 5 | `wrap-up/SKILL.md § Step 2.5` → `evaluation/SKILL.md § Slug + collision policy` (lines 385-393) | Collision policy for auto-backfill | D |
| 6 | `wrap-up/SKILL.md § Step 2.5` → `evaluation/SKILL.md § Complete Domain → staging destination routing (general Type)` (line 356) | Deterministic Domain routing for `general`-Type mechanical destinations | D |
| 7 | `memorization/SKILL.md § Path Conventions` → `evaluation/SKILL.md § Coverage Ownership Matrix § Memorization staging shape + naming` | Naming convention verification semantics | E |
| 8 | `codex/SKILL.md § Sandbox + CWD discipline` → `mistakes/codex-eval-session-write-path-nested-in-worktree.md` | Witness anchor for absolute-path mandate | A |
| 9 | `codex/SKILL.md § Hang + timeout discipline` → `git/SKILL.md` background-mode guidance | Reuse existing background-job discipline | A |
| 10 | `gobbi/SKILL.md § Skill Map § Cross-cutting` → `.gobbi/projects/gobbi/skills/codex/SKILL.md` | Entry-point discovery for codex skill | A |

---

## Decisions Log (abridged for Planning)

| # | Topic | Decision |
|---|---|---|
| 1 | Scope bundle | Bundle A selected. |
| 2 | Codex skill depth | Content-complete this session. |
| 3 | Codex skill breadth | "Best practices for codex in claude code" (broad). |
| 4 | Memorization pathology | γ + α. β out of scope unless evidence found. |
| 7 | Step 2.5 escalation (LOCKED vocabulary) | Hybrid: mechanical auto-backfill (Type ∈ {`scenario_gap`, `checklist_gap`, `general`}) + NEEDS_CONTEXT for judgment-required (Type ∈ {`design_flaw`, `assumption_risk`}). Collision policy: `evaluation/SKILL.md § Slug + collision policy` lines 385-393. |
| 10 | Polish 1-4 | 1 question (mode, default **auto** per `settings.default.json:3`) + customize gate. `orchestration/SKILL.md § Step 1` is the reference (no `workflow/configuration.md`). |
| 14 | Codex invocation priority | `codex exec` via Bash = UNIVERSAL primary. `codex:codex-rescue` = manager-only secondary. `/codex:adversarial-review` = user-only tertiary. |
| 15 | Symlinks | Two symlinks required: `.claude/skills/codex/SKILL.md` (file) + `.agents/skills/codex` (directory). Baseline 16→17 post-ship. |
| 18 | Vocabulary repair (iter3) | `scenario_gap`, `checklist_gap`, `design_flaw`, `assumption_risk`, `general` are the 5 Types. `improvement` and `bug` are NOT Types. Mechanical set = {`scenario_gap`, `checklist_gap`, `general`}; judgment-required = {`design_flaw`, `assumption_risk`}. |

---

## Evaluation Summary (Cross-System Divergence)

### Iter 1 (REVISE)

- Claude: PASS (0 Critical/High, 11 Medium, 4 Low)
- Codex: REVISE (7 High, 2 Medium, 1 Low) — High findings: COD-PROJ-001 (T2/T3 witness conflation), COD-PROJ-002 (missing `.agents/skills/codex` directory symlink), COD-STRUCT-001 (wrong finding-Type vocabulary — `correction`/`decision-record`), COD-PERF-001 (no cost subsection), COD-AESTH-001/002, COD-USAGE-001 (mode default chat vs auto), COD-CONS-001/002.
- **Divergence**: Claude missed codex-specific structural issues; Codex found vocabulary and count issues Claude evaluated as in-scope.
- **Verdict**: REVISE (pessimistic union). Prior iter1 codex findings drove the bulk of iter2 corrections.

### Iter 2 (FAIL)

- Claude: FAIL (3 Critical — STRUCT vocabulary 10-site propagation, CONS vocabulary inconsistency, RISK broken vocabulary propagates to Execution; 2 High; 6 Medium; 13 Low)
- Codex: REVISE (1 High COD-STRUCT-001 + `.agents/skills` count 17; 1 Medium COD-CONS-002)
- **Divergence**: Claude escalated to FAIL (Critical threshold met); Codex REVISE only. Leader had claimed to fix COD-STRUCT-001 from iter1 but substituted one wrong vocabulary (`correction`/`decision-record`) with another wrong vocabulary (`improvement`/`bug`). Neither is in the actual 5-Type set.
- **Verdict**: FAIL — Claude Critical threshold triggers FAIL regardless of Codex REVISE.
- **Meta-mistake**: `leader-iter2-verification-claim-without-evidence.md` — leader claimed empirical verification but propagated wrong values. Staged as mistake-candidate at iter2.

### Iter 3 (PASS)

- Claude: PASS (0 Critical/High/Medium, 2 Low informational only — density of changelog row and closing line being stylistic)
- Codex: PASS (0 Critical/High/Medium, 1 Low COD-CONS-003 — example `Domain=\`testing\`` vs canonical `Domain=\`test\``)
- **Divergence**: None. Both systems agree on PASS. The 1 Low from Codex is an illustrative-example wording mismatch with no normative impact; deferred to Execution of item D as a micro-fix.
- **Key empirical witness from iter3 evaluation process**: `codex:codex-rescue` plugin agent was initially dispatched for the Codex iter3 evaluation. It returned a fire-and-forget placeholder ("task is still running") without writing any evaluation files. The manager authorized recovery via direct `codex exec` Bash invocation, which completed synchronously and produced all 8 evaluation files. This crash empirically validates Design A's emphasis on `codex exec` as the reliable synchronous path vs the plugin agent's async-fire-and-forget model. Staged as mistake-candidate `codex-rescue-agent-fire-and-forget-without-result-capture.md`.

### Cross-System Summary

Iter1 divergence (Claude PASS, Codex REVISE): Codex found structural and vocabulary issues missed by Claude. Resolved by iter2 revision.

Iter2 divergence (Claude FAIL, Codex REVISE): Claude escalated to FAIL on Critical vocabulary regression; Codex REVISE on same root cause. Leader had re-applied wrong vocabulary while claiming empirical verification — the meta-mistake. Resolved by iter3 surgical repair.

Iter3 convergence (both PASS): Both systems independently verified the vocabulary repair against `evaluation/SKILL.md:344-352`. Cross-system PASS is the strongest signal that the repair is correct.

**Durable lesson**: When fixing an enumeration or vocabulary, read the canonical source directly, copy values verbatim, and run `grep -n "<value>"` against the source to confirm. Never rely on memory or summary for vocabulary fixes (Principle 7 enforcement).

---

## What is NOT in this Artifact (Intentional)

- Bundle internal task sequencing — Planning decomposes 15 checklist items into ordered tasks.
- Exact wording of every edit — direction + anchored insight + validation only; Execution writes prose.
- Test plan — no code; verification is grep-based per validation methods.
- Settings.default.json mode-default change — out of scope; existing `"mode": "auto"` retained.
