# Preparation iter1 — Sub-steps A → D Findings

Phase: preparation
Iter: 1
Bundle: `session-foundations-bundle-b` (T1 worktree-first + T3 PostToolUseFailure hook + reconstructor; T2 deferred)
Canonical Ideation artifact: `sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/ideation/artifacts/bundle-b-ideation-pass.md` (PASS iter3)

---

## Sub-step A — Readiness Signal List

Files / surfaces Planning + Execution will touch (extracted from the Implementation Checklist § T1 + § T3 in the Ideation artifact and the Design table D-1 → D-5 / D-3-1 → D-3-6):

### T1 (worktree-first session architecture) surfaces

| # | Surface | Touch type | Source signal |
|---|---|---|---|
| A1 | `.claude/skills/orchestration/SKILL.md` row 5.5 | INSERT | T1-I-T1.a |
| A2 | `.claude/skills/git/SKILL.md` line ~33 (Memory Access Matrix qualified rule) | EDIT | T1-I-T1.b |
| A3 | `.claude/skills/git/SKILL.md` P2 note (Configuration row 5.5 invocation) | INSERT | T1-I-T1.c |
| A4 | `.claude/skills/preparation/SKILL.md` narrow-exception extension (2-line `git -C "$worktreePath"` add+commit) | EDIT | T1-I-T1.d |
| A5 | `.claude/skills/gobbi/SKILL.md` Session Bootstrap Order cross-reference | EDIT | T1-I-T1.e |
| A6 | 5 workflow phase docs under `.claude/skills/orchestration/workflow/` (per-iter commit cadence) | EDIT (5 files) | T1-I-T1.f |
| A7 | `.claude/skills/CLAUDE.md` (entry-point reflow if Session Bootstrap Order shifts) | LIKELY EDIT | inferred from D-1+E5 |
| A8 | `.claude/skills/delegation/SKILL.md` grep audit for main-tree boilerplate | EDIT | T1-I-T1.i |
| A9 | Rollback semantics doc patch (preparation/SKILL.md or git/SKILL.md) | INSERT | T1-I-T1.j |
| A10 | `session.template.json` (or its bootstrap consumer) `git.worktreePath` + `git.branch` fields | VERIFY/EDIT | success criterion 1 + smoke test T1-I-T1.h |

### T3 (PostToolUseFailure hook + reconstructor) surfaces

| # | Surface | Touch type | Source signal |
|---|---|---|---|
| B1 | `.claude/hooks/post-tool-use-agents.sh` (NEW) | CREATE | T3-I-T3.a |
| B2 | `.claude/scripts/reconstruct-agents.sh` (NEW) | CREATE — directory absent | T3-I-T3.b |
| B3 | `.claude/settings.json` hooks block — add PostToolUse + PostToolUseFailure entries | EDIT | T3-I-T3.c |
| B4 | `.claude/skills/orchestration/SKILL.md` row 6 + agents[] narrative | EDIT | T3-I-T3.d |
| B5 | `.claude/skills/delegation/SKILL.md` structured-header convention + migration note + flock note | EDIT | T3-I-T3.e + T3-I-T3.g |
| B6 | `staging/backlogs/feature/schema-extension-agents-status-field.md` | ALREADY STAGED | T3-I-T3.f |
| B7 | `staging/backlogs/feature/dot-gobbi-project-json-bootstrap.md` | ALREADY STAGED | T3-I-T3.h |
| B8 | `session.template.json` agents[] schema (current 14-field manager skeleton — see Specific items #2 below) | REFERENCE ONLY (no field add this session) | per D-3-4 + B6 deferral |

### Cross-cutting verification surfaces

- `git/conventions.md` line ~118 AI-Provenance-Record trailer (consumed by D-3 promote-now commit + D-4 per-iter commit; iter3 Fix A locked `chore/session-` registry compliance per `:22`/`:64`/`:261`).
- `flock` binary on $PATH (D-3-5 prerequisite).
- `jq` binary on $PATH (D-3-1 prerequisite; assumed since `session-start.sh` already uses it).
- POSIX-shell-safe quoting precedent (`session-start.sh` `@sh` pattern).

---

## Sub-step B — Design + Memory Readiness

### Inputs scanned

- `.gobbi/projects/gobbi/features/` → 2 dirs: `env-var-audit` (unrelated), `gobbi-orchestration-workflow-improvements` (Bundle A — closely related prior session)
- `.gobbi/projects/gobbi/design/` → README only, empty otherwise
- `.gobbi/projects/gobbi/decisions/` → README only, empty otherwise
- `.gobbi/projects/gobbi/notes/` → 3 journal entries including `2026-05-23-orch-workflow-improvements.md` (Bundle A handoff — directly seeds this bundle's deferred items)
- `.gobbi/projects/gobbi/mistakes/` → 8 active project mistakes
- Ideation staging at `sessions/.../ideation/staging/` (11 design + 17 discussions + 9 checklists + 9 decisions + 12 references + 2 scenarios + backlog tree present)
- Feature directory for `session-foundations-bundle-b` → **DOES NOT YET EXIST** at `.gobbi/projects/gobbi/features/session-foundations-bundle-b/` (will be created at Wrap-up promotion)

### Gaps found

| # | Gap | Severity | Evidence |
|---|---|---|---|
| B-G1 | Feature directory `features/session-foundations-bundle-b/` does not exist | Low | Expected — Wrap-up bootstraps it from staged backlogs/feature/* + decisions; not blocking Planning |
| B-G2 | `staging/backlogs/feature/` exists but checked — Two items already staged (verified via `ls`): `schema-extension-agents-status-field.md` + `dot-gobbi-project-json-bootstrap.md` | None | Both expected per Ideation §Deferred — verifies Sub-step A's understanding |
| B-G3 | No project-level design doc for "session lifecycle / worktree boundaries" — but Ideation D-1…D-5 + design staging captures everything Planning needs | Low | Speculative recording; not blocking |
| B-G4 | No mistakes/ entry whose domain is `hooks` (T3 hook authoring is unprecedented in this repo) | Medium | All 8 mistakes are `process` domain (workflow / brief construction / deletion safety). Zero prior pitfalls captured for shell-hook authoring discipline. |
| B-G5 | No mistakes/ entry whose domain is `workflow` / `session-mechanics` for worktree-first bootstrap | Medium | T1 introduces a Configuration-time worktree creation step (row 5.5) — never shipped before. Two mistakes from `2026-05-22-bac669ad` ARE adjacent: `codex-eval-session-write-path-nested-in-worktree.md` + `manager-rm-rf-without-investigating-tracked-files.md` — both directly relevant; Execution must surface them. |
| B-G6 | No design staging item enumerating the **5 workflow phase docs** that need per-iter commit cadence (T1-I-T1.f targets 5 files but the design files in staging name only `D-4`) | Low-Medium | Planning needs to know exact file set: `ideation.md`, `preparation.md`, `planning.md`, `execution.md`, `wrap-up.md` under `.claude/skills/orchestration/workflow/`. Inferable but not explicit. |
| B-G7 | No staged design doc for `.claude/scripts/` directory creation pattern (B2 creates the directory) | Low | Trivial; `mkdir -p` at executor time suffices. |

### Resolution proposals

| Gap | Proposal | Rationale |
|---|---|---|
| B-G1 | `skip` | Wrap-up creates the dir during staging→project promotion. Planning + Execution do not need it pre-created. |
| B-G2 | `skip` | Already staged. |
| B-G3 | `defer` to backlog | A separate design doc for "session lifecycle / worktree boundaries" is a useful long-term artifact but not needed in-session — the design staging files already carry the decisions Planning will consume. |
| B-G4 | `defer` to backlog | A "hook-authoring" mistake doesn't yet exist because hooks are new. We will capture mistakes mid-Execution if any arise. No retrospective entry to stage. |
| B-G5 | `generate-now` (minimal) | Two existing mistakes ARE relevant — the resolution is to **explicitly cite them in Planning task briefs** so executor agents load them at Study phase. No new staging file needed; this is a *Planning-brief annotation* requirement, not a new mistake. Recommend the manager add to Planning's brief: "Executors implementing T1 MUST load `codex-eval-session-write-path-nested-in-worktree.md` + `manager-rm-rf-without-investigating-tracked-files.md` before starting." |
| B-G6 | `generate-now` (staging design doc) | Stage `preparation/staging/design/workflow-phase-doc-set-for-per-iter-cadence.md` explicitly listing the 5 files. Tiny, removes Planning ambiguity. Cheap. |
| B-G7 | `skip` | Trivial — Executor `mkdir -p .claude/scripts/` is part of T3-I-T3.b creation. |

---

## Sub-step C — Execution Skills Readiness

### Required-skills enumeration (per surface from Sub-step A)

| Surface family | Workspace skills executor would load | Project-specific skills needed |
|---|---|---|
| Markdown skill edits (A1, A2, A3, A4, A5, A6, A7, A8, A9, B4, B5) | `claude/SKILL.md` (docs writing standard); `git/SKILL.md` (worktree path discipline); `delegation/SKILL.md`; `execution/SKILL.md` | none — docs editing has no project-specific shape gap |
| Bash + jq hook authoring (B1) | none currently — no workspace bash/shell skill | **candidate**: hook-authoring project skill (`session-start.sh` pattern + flock + two-tier extraction + strict-mode + guards) |
| Shell-script reconstructor (B2) | same as above | overlaps with hook-authoring candidate |
| JSON config edits (B3, session.template.json field add) | none formal; `claude/SKILL.md` references JSON conventions implicitly | none |
| Worktree-first bootstrap (A1 + A10 + adjacent infra) | `git/SKILL.md` + `gobbi/SKILL.md` + new row 5.5 from this bundle | **candidate**: session-architecture project skill (worktree-first + session-dir-in-worktree + per-iter commit) |
| `.claude/scripts/` directory conventions | none currently | **candidate**: shell-script conventions skill |

### Candidate skill proposals (3 considered; recommendations follow)

#### Candidate skill 1 — `gobbi-hook-authoring`

- **Why**: T3 creates a 2nd shell hook (`post-tool-use-agents.sh`). Only one precedent (`session-start.sh`). The bash + jq + `@sh` quoting + strict-mode + `$CLAUDE_ENV_FILE` guard pattern is non-trivial; adding `flock`, dual-event handling (PostToolUse + PostToolUseFailure), and tool_use_id correlation makes T3 the first "rich" hook. Executor agents authoring B1 will likely reinvent or under-engineer the pattern.
- **Why NOT this loop**: Per preparation/SKILL.md § Core Principles, skills are generated NOW only if Planning + Execution NEED them in-session. The skill could be authored AFTER T3 ships (extracting the now-2-witness pattern into a skill — N=2 precedent is the right time per the gobbi-orchestration-workflow-improvements design-item-e cadence). Generating it now would be speculative — we only have N=1 working witness (`session-start.sh`).
- **Recommendation**: `defer` to backlog (post-T3 ship). Add to `staging/backlogs/project/gobbi-hook-authoring-skill.md` — generate AFTER T3 ships, when N=2 patterns exist for extraction.

#### Candidate skill 2 — `gobbi-session-architecture`

- **Why**: T1 codifies "worktree-first with session-dir-in-worktree" as the canonical session pattern. This will be re-loaded every session post-T1.
- **Why NOT this loop**: The pattern is already documented in the surfaces T1 EDITS (orchestration row 5.5, git/SKILL.md qualified rule, preparation/SKILL.md narrow exception, gobbi/SKILL.md bootstrap order). A separate project skill would duplicate. The workspace `orchestration/SKILL.md` IS the session-architecture authority post-T1.
- **Recommendation**: `skip`. T1's edits ARE the codification — a separate skill would be redundant.

#### Candidate skill 3 — `gobbi-shell-script-conventions`

- **Why**: `.claude/scripts/` doesn't exist yet; B2 creates the directory + first occupant. A conventions skill could anchor future scripts.
- **Why NOT this loop**: One file does not warrant a skill (N=1 trap). Establish via the script's own header comments; extract to skill at N≥2.
- **Recommendation**: `skip`. Re-evaluate after `.claude/scripts/` accumulates ≥2 scripts.

### Summary

**No `generate-now` skill decisions for Sub-step C.** Existing workspace skills (`git/`, `delegation/`, `execution/`, `claude/`, `orchestration/`) plus Ideation's design staging are sufficient for Planning + Execution. Hook-authoring skill deferred to post-T3 (witness accumulation pattern, matches Bundle A design-item-e).

---

## Sub-step D — Gap Resolution Plan

Consolidated table (manager's input for AskUserQuestion per row):

| # | Gap | Category | Severity | Proposal | Rationale |
|---|---|---|---|---|---|
| D-1 | Feature dir `features/session-foundations-bundle-b/` absent | memory | Low | `skip` | Wrap-up bootstraps from staged backlogs/decisions at promotion. Planning/Execution do not need it pre-created. |
| D-2 | No mistakes/ in `hooks` domain (no prior hook-authoring pitfalls captured) | memory | Medium | `defer` to backlog | Hooks are new; no retrospective entry to stage. Will capture mid-Execution if any arise. |
| D-3 | No mistakes/ in `workflow` / `session-mechanics` for worktree-first — BUT two adjacent mistakes EXIST and must be cited in Planning briefs (`codex-eval-session-write-path-nested-in-worktree.md` + `manager-rm-rf-without-investigating-tracked-files.md`) | memory | Medium | `generate-now` (Planning-brief annotation only, no new staging file) | Existing mistakes are directly relevant. Manager MUST include explicit load directive in Planning task briefs for T1. |
| D-4 | Workflow phase doc set for per-iter cadence (T1-I-T1.f) not explicitly enumerated in any staged design file | design | Low-Medium | `generate-now` (stage `preparation/staging/design/workflow-phase-doc-set-for-per-iter-cadence.md`) | Tiny staging file enumerating the 5 phase-doc files (`ideation.md`, `preparation.md`, `planning.md`, `execution.md`, `wrap-up.md`); removes Planning ambiguity. |
| D-5 | `.claude/scripts/` directory doesn't exist (B2 creates it) | design | Low | `skip` | Executor `mkdir -p` is part of B2; no design artifact needed. |
| D-6 | Long-term project-level "session lifecycle / worktree boundaries" design doc | design | Low | `defer` to backlog | Useful future artifact; not needed in-session. |
| D-7 | `gobbi-hook-authoring` project skill (B1 + B2 unprecedented pattern density) | skill | Medium | `defer` to backlog | N=1 currently (`session-start.sh`). Extract to skill AFTER T3 ships when N=2. Matches Bundle A design-item-e witness-accumulation cadence. |
| D-8 | `gobbi-session-architecture` project skill (worktree-first canonical pattern) | skill | Low | `skip` | T1's edits to `orchestration/SKILL.md`/`git/SKILL.md`/`preparation/SKILL.md`/`gobbi/SKILL.md` ARE the codification. Separate skill would duplicate. |
| D-9 | `gobbi-shell-script-conventions` project skill (B2 introduces `.claude/scripts/`) | skill | Low | `skip` | N=1; codify via script header comments. Re-evaluate at N≥2. |

**Net gap-resolution recommendation summary:**
- 2 `generate-now` (D-3 brief annotation + D-4 tiny staging design file)
- 3 `defer` to backlog (D-2 hooks domain, D-6 lifecycle design, D-7 hook-authoring skill)
- 4 `skip` (D-1 feature dir, D-5 scripts dir, D-8 session-architecture skill, D-9 shell-script-conventions skill)
- 0 `re-Ideate`

---

## Specific items check

8 items verified empirically:

| # | Item | Status | Evidence |
|---|---|---|---|
| 1 | `git/conventions.md` AI-Provenance-Record trailer line 118 | **PRESENT** | `sed -n '115,125p'` shows the canonical trailer table at lines 116-119. iter3 Fix A line citations (`:22`/`:64`/`:261`) all still extant. |
| 2 | `session.template.json` `agents[]` schema | **PRESENT (at non-canonical path)** | Brief assumed `.claude/templates/session.template.json` — that path is ABSENT. Actual locations: `.claude/skills/orchestration/templates/session.template.json` + `.gobbi/projects/gobbi/skills/orchestration/templates/session.template.json` (project mirror). Both contain 14-field manager skeleton matching D-3-4 extraction targets (id, name, type, step, phase, iter, model, system, transcriptPath, tokensUsed.{input,output,cacheRead,cacheCreation}, startedAt, finishedAt). NOTE: no `status` field — confirms T3-I-T3.f deferral is intentional. |
| 3 | `session-start.sh` bash+jq precedent | **PRESENT** | `/playinganalytics/git/gobbi/.claude/hooks/session-start.sh` (4109 bytes, exec bit set). Demonstrates `set -euo pipefail`, `$CLAUDE_ENV_FILE` guard, `jq -r @sh` quoting, REQUIRED/OPTIONAL/PASSTHROUGH partitioning. Directly anchorable for B1. |
| 4 | `.claude/settings.json` hooks block | **PRESENT** | `/playinganalytics/git/gobbi/.claude/settings.json` (879 bytes). Lines 31-39 show `"hooks": { "SessionStart": [ { "matcher": "startup\|resume\|clear\|compact", "hooks": [ { "type": "command", "command": ".claude/hooks/session-start.sh" } ] } ] }`. T3-I-T3.c will add sibling `PostToolUse` + `PostToolUseFailure` arrays. |
| 5 | `flock` availability | **PRESENT** | `/usr/bin/flock` — util-linux 2.39.3. D-3-5 `flock -x` prerequisite satisfied on this build system. |
| 6 | `.gobbi/project.json` | **ABSENT** | Confirmed by `ls`. Matches iter3 Fix C — backlog already staged at `staging/backlogs/feature/dot-gobbi-project-json-bootstrap.md`. D-3-3-resolver step (ii) directory-scan is the currently active path. |
| 7 | `.claude/scripts/` directory | **ABSENT** | `ls` returns ENOENT. Executor will `mkdir -p .claude/scripts/` as part of B2 creation. |
| 8 | `preparation/SKILL.md` narrow-exception text | **PRESENT** | Line 62 — "Exception — generated skills: when a `generate-now` decision produces a project-specific skill, that skill is **promoted to project memory before Planning starts**…". T1-I-T1.d will EXTEND this to cover the worktree-branch commit (2-line `git -C "$worktreePath" add` + `git -C "$worktreePath" commit` with AI-Provenance-Record trailer). |

**Discrepancy noted (item #2):** the brief assumed `session.template.json` lives at `.claude/templates/` — actual canonical path is `.claude/skills/orchestration/templates/session.template.json`. This is a minor brief-text imprecision; the file IS present (with a project mirror at `.gobbi/projects/gobbi/skills/orchestration/templates/session.template.json`). Flagged so Planning task briefs cite the correct path. Not a blocking issue.

---

## Adversarial-mode scan results

Per Karpathy 4 modes + Coverage Ownership Matrix:

### Prior overlapping feature work in `.gobbi/projects/gobbi/features/`

- **`gobbi-orchestration-workflow-improvements/`** (closed 2026-05-23 — Bundle A). 7 design items shipped (item-a Codex skill, item-b memorization moment-of-capture, item-c memorization-delegation hard gate, item-d wrap-up step 2.5, item-e naming convention enforcement, item-f glossary placement, item-g drop legacy setup questions). 9 decisions staged. **No overlap with T1 or T3** — Bundle A explicitly deferred 1-3 (worktree-first session architecture) and 4-1 (subagent hook) for THIS session. Confirms Bundle B is the planned successor; no prior implementation exists that would duplicate or conflict.
- **`env-var-audit/`** (closed 2026-05-22). SessionStart hook + 15 CLAUDE_* env vars. Bash + jq + `@sh` precedent matches T3-E-1/E-5 hook design. Direct precedent for B1's authoring stack.

### Mistakes flagged for Execution awareness (domain: hooks / workflow / session-mechanics)

| Mistake | Severity | Relevance to Execution |
|---|---|---|
| `codex-eval-session-write-path-nested-in-worktree.md` | medium | **DIRECTLY relevant to T1**. Codex evaluator sandbox CWD inside worktree → wrote staging files to worktree-nested path instead of main-tree absolute. **Executor agents implementing T1 row 5.5 + T1-I-T1.d MUST be briefed** that session writes use the main-tree absolute path regardless of `cwd`. Corrected approach: "All session writes MUST use absolute `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/{session-id}/…`" must appear in every executor brief. |
| `manager-rm-rf-without-investigating-tracked-files.md` | high | **DIRECTLY relevant to T1 worktree operations**. Manager `rm -rf`'d `.gobbi/` chain inside worktree, deleting tracked files. Any executor/manager performing worktree cleanup must `git status --short` + `git ls-files` before `rm -rf`. |
| `leader-iter2-verification-claim-without-evidence.md` | high | Process discipline — Iron Law 7 violation. Relevant for Planning/Execution evaluator phases (vocabulary/enumeration fixes require verbatim grep verification). |
| `manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md` | high | Process discipline — manager MUST Read locked spec before constructing "verbatim" briefs. Highly relevant to Planning when decomposing this Ideation artifact into task briefs. |
| `memorization-delegation-prompts-must-load-memorization-skill.md` | (not read in detail, but title implies) | Relevant for MEMORIZATION dispatch at any loop — already addressed in Bundle A design-item-c hard gate. |
| `evaluator-returned-verdict-inline-no-per-perspective-files.md` | (relevant for EVALUATION) | Process discipline at Planning/Execution EVALUATION phases — manager must brief evaluators on per-perspective file requirement. |
| `claude-evaluator-step4-only-vs-codex-whole-file-grep.md` | (relevant for EVALUATION) | Dual-system divergence pattern — Codex catches whole-file issues Claude misses on changed-section-only scans. |
| `codex-rescue-agent-fire-and-forget-without-result-capture.md` | (relevant if any Codex evaluation needed) | Use `codex exec` directly, not `codex:codex-rescue`. |

**3 mistakes are critical Planning-brief inputs for T1 execution**: `codex-eval-session-write-path-nested-in-worktree.md`, `manager-rm-rf-without-investigating-tracked-files.md`, and `manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md`. The last is procedural (applies to Planning's own brief construction); the first two are content-relevant for executors implementing worktree-touching tasks.

### Rules in `.gobbi/projects/gobbi/rules/` constraining the bundle

- **`stub-redirect-format.md`** — Format for superseded docs (Variant A mapping table / Variant B narrative). **Relevance**: If any T1 edit *supersedes* an existing doc (e.g., replacing the old "session writes use main tree" rule wholesale rather than qualifying it), the superseded text must follow this format. Likely LOW relevance — T1 *qualifies* the existing `git/SKILL.md:33` rule rather than superseding any doc. T3 *replaces* orchestration narrative for row 6 — unclear if any narrative becomes a stub. Flag for Planning to check during decomposition.

No other rules detected (only 1 file in `rules/`).

---

## Manager-facing contribution points (AskUserQuestion drafts)

Per Sub-step D table — manager should ask the user per gap. Rows where proposal is `skip` are presented as confirmations; `defer` rows confirm backlog routing; `generate-now` rows confirm the specific artifact.

### Card 1 — D-3 (Planning-brief annotation for adjacent mistakes)

**Question**: Two existing project mistakes (`codex-eval-session-write-path-nested-in-worktree.md` + `manager-rm-rf-without-investigating-tracked-files.md`) are directly relevant to T1 worktree work. Should Planning include an explicit load directive for these in every T1 executor brief?

- (Recommended) Yes — add explicit load directive in each T1 task brief
- No — rely on default mistake-skill load to surface them
- Custom — specify

### Card 2 — D-4 (workflow-phase-doc-set staging file)

**Question**: T1-I-T1.f targets the per-iter commit cadence across 5 workflow phase docs but the file set is implicit. Should we stage a tiny design file `preparation/staging/design/workflow-phase-doc-set-for-per-iter-cadence.md` listing the 5 files explicitly (`ideation.md`, `preparation.md`, `planning.md`, `execution.md`, `wrap-up.md` under `.claude/skills/orchestration/workflow/`)?

- (Recommended) Yes — generate-now, removes Planning ambiguity
- No — Planning can enumerate the file set at decomposition time
- Custom — specify

### Card 3 — D-7 (gobbi-hook-authoring skill timing)

**Question**: `gobbi-hook-authoring` project skill could codify the bash+jq+flock+strict-mode pattern. Defer to backlog until N=2 (after T3 ships) or generate now?

- (Recommended) Defer to backlog — generate after T3 ships (N=2 witness pattern; matches Bundle A item-e cadence)
- Generate now — codify pre-emptively from N=1 (`session-start.sh`) before T3 implementation
- Skip permanently — script headers suffice

### Card 4 — D-2 (no hook-authoring mistakes yet)

**Question**: No mistakes/ entry exists in `hooks` domain because hooks are new. Confirm backlog deferral (capture mid-Execution if any arise)?

- (Recommended) Defer to backlog — capture mid-Execution as they emerge
- Pre-emptively stage a "future hook pitfalls watch-list" — speculative
- Skip

### Card 5 — D-6 (project-level session-lifecycle design doc)

**Question**: A future "session lifecycle / worktree boundaries" design doc would aggregate T1's distributed edits into a single reference. Defer to backlog?

- (Recommended) Defer to backlog
- Generate-now (stage `preparation/staging/design/session-lifecycle-worktree-boundaries.md`)
- Skip

### Cards 6-9 — D-1, D-5, D-8, D-9 (all `skip` confirmations)

These 4 can be batched into a single confirmation card:

**Question**: Confirm the following gaps require no action this loop?

- D-1: Feature dir bootstrap deferred to Wrap-up (skip pre-create)
- D-5: `.claude/scripts/` directory created at executor time via `mkdir -p` (skip pre-create)
- D-8: `gobbi-session-architecture` skill — T1's edits ARE the codification (skip; no duplicate skill)
- D-9: `gobbi-shell-script-conventions` skill — N=1 currently (skip; re-evaluate at N≥2)

- (Recommended) Confirm all 4 as skip
- Address one or more individually — specify which

---

## Notes for Planning intake

- **Path correction**: Planning task briefs touching `session.template.json` must cite `.claude/skills/orchestration/templates/session.template.json` (NOT `.claude/templates/session.template.json` — that path doesn't exist).
- **Mirror awareness**: `.gobbi/projects/gobbi/skills/orchestration/templates/session.template.json` is a project mirror — Planning must decide if changes propagate to both or only the workspace copy.
- **Bundle A handoff anchor**: `notes/2026-05-23-orch-workflow-improvements.md` "Open items carried" explicitly cites this bundle's items (1-3 + 4-1) as deferred — Bundle B is the planned successor; no surprise re-litigation needed.
- **Iron Law 7 procedural reminder**: Manager constructing Planning task briefs for this bundle MUST Read the Ideation artifact freshly when authoring any "verbatim" instruction (per `manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md`). Memory-only briefs from the 553-line Ideation rawdata will drift.
