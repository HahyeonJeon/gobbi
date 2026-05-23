---
name: gobbi-orchestration-workflow-improvements
description: "Bundle A — new `codex` skill (content-complete best-practices) + memorization moment-of-capture discipline (γ) + memorization delegation hard gate (α) + Wrap-up Step 2.5 prior-loop compliance check + naming-convention enforcement via Consistency-perspective evaluator check + two gobbi/SKILL.md polish edits (glossary placement; legacy setup-question reduction)."
phase: ideation
iter: 1
verdict: pending
session-id: 2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068
loop: ideation
artifact_type: idea-draft
created_at: 2026-05-23
status: draft
feature: gobbi-orchestration-workflow-improvements
related:
  - sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/ideation/rawdata/discussion-log.md
  - sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/ideation/staging/decisions/iter1-user-redirects.md
  - sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/ideation/artifacts/idea.md
  - sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/wrap-up/artifacts/handoff.md
---

# Idea — Gobbi Orchestration + Workflow Improvements (Bundle A)

## Scope Contract

```yaml
artifact_type: scope-contract
feature: gobbi-orchestration-workflow-improvements
goal: "Repair the four discipline gaps in gobbi orchestration/workflow that broke last session — codex invocation lacks a canonical best-practices anchor; memorization runs late and unloaded; wrap-up never checks prior-loop compliance; naming convention is documented but unenforced — plus two minor polish items in the gobbi entry skill."
created-by: 2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068
created-at: 2026-05-23
```

### In-Scope (7 items, LOCKED)

| # | Item | Deliverable surface |
|---|---|---|
| A | New `codex` skill — content-complete best-practices for Codex in Claude Code. Covers invocation patterns (universal `codex exec` via Bash first; manager-only `codex:codex-rescue` plugin agent second; user-only `/codex:adversarial-review` slash command third), sandbox semantics (`read-only` / `workspace-write` / `danger-full-access`), CWD + worktree path discipline, hang/timeout patterns, dual-system evaluator-spawn as **one** documented use case. | Source-of-truth at `.gobbi/projects/gobbi/skills/codex/SKILL.md` (new); symlink at `.claude/skills/codex/SKILL.md` (matches existing skill-dir convention); `gobbi/SKILL.md § Skill Map` row added (cross-cutting). |
| B | Memorization moment-of-capture discipline (pathology γ — write-as-you-go). Corrections, decisions, and mistake-candidates are noted at moment-of-occurrence during WORK, not deferred to MEMORIZATION. | `memorization/SKILL.md` (procedure section adds a "moment-of-capture" Core Principle pointing at `mistake/SKILL.md` P2); `mistake/SKILL.md` (P2 wording made stronger and links to memorization's MEMORIZATION-phase staging); leader / executor / assistant agent specs link the same. |
| C | Memorization delegation hard gate (pathology α — every MEMORIZATION dispatch loads `memorization/SKILL.md` in Load Directives). | `delegation/SKILL.md` (Load Directives section adds a phase→required-skill table row stating MEMORIZATION dispatches MUST list `memorization/SKILL.md` in Load Directives Skills tier); per-role templates under `delegation/templates/` cross-checked. |
| D | Wrap-up Step 2.5 — prior-loop MEMORIZATION compliance check. Between Wrap-up WORK Step 2 (staging inventory) and Step 3 (feature destination), insert a compliance gate that scans each prior loop's `rawdata/` and `staging/` for shape conformance, **classifies each gap as `mechanical` (deterministic routing → auto-backfill inline) or `judgment-required` (design/decision arbitration → aggregate into NEEDS_CONTEXT)**. | `wrap-up/SKILL.md` (insert "Step 2.5 — Prior-loop memorization compliance check" between current Steps 2 and 3; document gap classification rules; update Exit checklist + Constraints). |
| E | Naming-convention enforcement vehicle. Codify enforcement via the **Consistency evaluator perspective** at the MEMORIZATION-output evaluation step (not a CLI lint — no `packages/cli/` source exists in the current repo state). | `evaluation/SKILL.md § Coverage Ownership Matrix` (add a "Memorization staging shape + naming" row pointing at Consistency + Aesthetics); `memorization/SKILL.md` (cross-link from naming-convention section). |
| F | Polish 1-1 — move the `## Glossary` section in `gobbi/SKILL.md` from its current position (currently between Introduction and § Session Bootstrap Order at line 15) to **after** § Session Bootstrap Order so the actionable bootstrap appears first to a fresh reader. | `gobbi/SKILL.md` (1 Edit). |
| G | Polish 1-4 — drop legacy setup questions in the bootstrap flow. Eval-mode + git-mode are removed from the bootstrap prompts (Step 4 in `gobbi/SKILL.md`) and become settings.json defaults; bootstrap asks only the **mode** (chat/auto) and optionally "customize defaults?" | `gobbi/SKILL.md § 4. Ask the user 2 setup questions` rewritten (becomes "Ask 1 setup question + optional customize gate"); `orchestration/SKILL.md § Step 1 — Workflow Configuration` row 1 + row 2 confirmed already match this shape; `orchestration/templates/settings.default.json` carries the defaults that previously came from the questions. **NOTE**: there is NO `orchestration/workflow/configuration.md` file in the current repo (`find .claude/skills/orchestration/workflow -name "configuration*"` returns empty) — Configuration is documented inside `orchestration/SKILL.md § Step 1`. The original brief's reference to `workflow/configuration.md` is replaced by `orchestration/SKILL.md § Step 1`. |

### Out-of-Scope (explicit)

- 1-2 skill-loading discipline (eager-load loop skills at session start) — **defer**; root cause distinguishing investigation still needed (docs gap vs compaction eviction vs discipline failure).
- 1-3 worktree-first session architecture — **defer**; failure mode not yet named; memory persistence collision with `git/SKILL.md` Memory Access Matrix unresolved.
- 2-1 Auto mode silence semantics — **defer**; coupled to memorization fix (this session's B+C); address next.
- 2-2 Chat mode tiki-taka redesign — **user-deferred** explicitly.
- 4-1 session.json subagent metadata + tokensUsed hook — **defer**; technical feasibility (can the hook access subagent token counts?) unverified.
- Prior session's carry-forward backlogs **F-STRUCT-01** + **F-RISK-01** — remain in `.gobbi/projects/gobbi/backlogs/` untouched.
- Workspace-level `_claude` skill — out of bundle.
- Any change to `packages/cli/src/` — that path **does not exist** in the current repo state (verified `ls /playinganalytics/git/gobbi/packages/cli/src/` exits 2). No CLI lint can be added.
- Pathology β (memorization inline-bypass / manager bypasses MEMORIZATION delegation entirely) — **conditional**: see Research Insights § Memorization pathology evidence below; γ + α are sufficient absent β evidence, and β was **not** observed in last session.

### Decisions Locked (in DISCUSSION before WORK entered — see discussion-log)

- **Bundle A only**: codex + memorization + polish; no codex-only or memorization-only deliverables this session.
- **Content-complete codex skill** (not skeleton + follow-up).
- **Codex skill scope is broad** — best practices for codex in claude code, not evaluator-spawn-only.
- **Codex invocation priority** (post-iter1 user redirect, see `iter1-user-redirects.md` § Decision 2): `codex exec` via Bash is the **universal primary pattern** for both manager AND subagents; `codex:codex-rescue` plugin agent is the **manager-only secondary pattern** (subagents lack the Agent tool); `/codex:adversarial-review` is the **user-only tertiary pattern** (`disable-model-invocation: true`).
- **Memorization fix uses γ + α** (write-as-you-go + delegation hard gate). β not in scope unless evidence found this iteration.
- **Wrap-up Step 2.5 in scope** (motivator: empirical T2-T7 staging gap observed this session — see Research Insights § I6 + I7).
- **Wrap-up Step 2.5 escalation shape** (post-iter1 user redirect, see `iter1-user-redirects.md` § Decision 1): **hybrid** — auto-backfill mechanical gaps inline (deterministic Type+Domain routing); NEEDS_CONTEXT only for judgment-required gaps (design_flaw routing-ambiguity, `disposition: open` findings needing user arbitration, findings that span multiple staging subdirs).
- **No re-opening** of 1-2 / 1-3 / 2-1 / 2-2 / 4-1.

### Success Criteria

1. `.gobbi/projects/gobbi/skills/codex/SKILL.md` exists (source-of-truth), `.claude/skills/codex/SKILL.md` is the symlink pointing at it, the skill is loaded under `gobbi/SKILL.md § Skill Map`, and covers (a) **invocation patterns in priority order**: (i) `codex exec` via Bash as the universal pattern, (ii) `Agent(subagent_type="codex:codex-rescue", ...)` as the manager-only convenience pattern, (iii) `/codex:adversarial-review` as the user-only pattern; (b) sandbox modes + selection rubric; (c) CWD / worktree absolute-path discipline citing `codex-eval-session-write-path-nested-in-worktree.md`; (d) hang patterns + recommended foreground/background discipline; (e) dual-system evaluator-spawn as one cited use case, showing BOTH the manager-spawn `codex:codex-rescue` pattern AND the subagent-call `codex exec` pattern; (f) explicit "Why subagents must use `codex exec`" subsection with the empirical tool-surface witness.
2. `memorization/SKILL.md` has a Core Principle "Moment-of-capture, not end-of-loop" with explicit anchor to `mistake/SKILL.md` P2; `mistake/SKILL.md` P2 reciprocally points back.
3. Every `delegation/templates/{leader,executor,evaluator,assistant}.md` template carries an explicit Load Directives entry that triggers `memorization/SKILL.md` whenever the dispatched phase includes MEMORIZATION-equivalent work. The `delegation/SKILL.md` Core Principles section names the gate explicitly.
4. `wrap-up/SKILL.md` carries a numbered Step 2.5 with: (a) inputs (prior loops' rawdata + staging dirs), (b) scan procedure, (c) gap-classification table (zero-staging, naming-shape, missing-template) with each gap categorized as `mechanical` or `judgment-required`, (d) auto-backfill mechanism for mechanical gaps, (e) NEEDS_CONTEXT trigger + `user-question:` shape for aggregated judgment-required gaps, (f) audit trail (gap report appended to `rawdata/promotion-manifest.md`).
5. `evaluation/SKILL.md § Coverage Ownership Matrix` carries the new "Memorization staging shape + naming" row.
6. `gobbi/SKILL.md` has Glossary below Session Bootstrap Order; Step 4 asks one mode question + optional customize gate (eval-mode + git-mode removed from bootstrap prompts and confirmed as settings.json defaults).
7. No `packages/cli/` writes (confirmed not present in repo).
8. All edits respect `.claude/CLAUDE.md` "Never edit gobbi skills without asking the user with AskUserQuestion" — but the user has pre-approved the 7-item scope above via DISCUSSION lock.
9. Codex skill cites empirically-grounded sandbox claims (codex CLI `codex exec --help` output) with file/line refs.

### Deferred

- Pathology β (manager inline-bypass) — re-open only if Wrap-up Step 2.5 detects it in a future session.
- CLI lint enforcement for naming convention — wait until a `packages/cli/src/` exists (currently absent — see Research Insights § Infrastructure baseline).
- session.json subagent tokensUsed instrumentation — needs hook-token-access feasibility check.
- Worktree-first session architecture — needs failure-mode reproduction.
- Auto-mode silence semantics — needs coupling to memorization fix outcome.
- Hangcheck heuristic / timeout (e.g., `timeout 600 codex exec ...`) — research surfaced no built-in timeout; recommendation belongs in codex skill but is a procedural guidance, not an implemented helper.

---

## Framed Problem

### Root cause

Four behavioral discipline gaps in gobbi's orchestration + workflow layer compounded across last session:

1. **No canonical codex usage anchor.** `codex:codex-rescue` is a thin forwarder (`.claude/plugins/cache/openai-codex/codex/1.0.2/agents/codex-rescue.md:9-13`); `codex-cli-runtime` (`.claude/plugins/cache/openai-codex/codex/1.0.2/skills/codex-cli-runtime/SKILL.md:1-43`) is an internal helper contract marked `user-invocable: false`. Neither tells the **gobbi manager** how to invoke codex for evaluator spawns, how to handle sandbox + CWD, or how to detect hangs. As a result, the codex-eval session-write-path mistake (`.gobbi/projects/gobbi/mistakes/codex-eval-session-write-path-nested-in-worktree.md:19-22`) happened — the manager's delegation prompt lacked an explicit absolute-path mandate. Evidence: 16 codex eval directories spawned in last session and the codex evaluator wrote to `worktrees/.../sessions/...` instead of the main-tree absolute path.
2. **Memorization runs late, unloaded, and the staging discipline is not enforced.** Empirically last session (`2026-05-22-bac669ad`), per `find sessions/.../rawdata` and `find sessions/.../staging`: every loop's `rawdata/` is empty except wrap-up's, and `staging/` is sparse — `ideation/staging/` has 5 files (acceptable), `preparation/staging/decisions/` has 1 file, `planning/staging/decisions/` has 1 file, `execution/T1/staging/decisions/` has 1 file, but T2-T7 staging are **completely empty** despite each task having full `evaluation/iter1/{claude,codex}/` content. So evaluations ran but their findings never staged. The MEMORIZATION-phase staging discipline (per `memorization/SKILL.md:144-166`) was not executed for T2-T7. Two distinct pathologies:
   - **γ (write-as-you-go)** — corrections noted in transcript during DISCUSSION are not staged at moment-of-occurrence; they leak to MEMORIZATION which runs without them.
   - **α (delegation hard gate)** — when MEMORIZATION was delegated, the dispatch prompt did not include `memorization/SKILL.md` in Load Directives; the assistant skipped the staging step because it didn't load the staging procedure.
3. **Wrap-up never re-validates prior-loop output shapes.** `wrap-up/SKILL.md` WORK Steps 2-4 (`wrap-up/SKILL.md:135-140`) enumerate staging files but **assume** prior loops' MEMORIZATION discipline was clean. Last session's empty execution T2-T7 staging dirs prove the assumption is unsafe. A prior-loop compliance check between Step 2 and Step 3 would catch this and either backfill or escalate.
4. **Naming convention exists but has no enforcement vehicle.** `memorization/SKILL.md` Memory Access Matrix (`memorization/SKILL.md:36-46`) and Path Conventions block (`memorization/SKILL.md:223-231`) define the staging path naming convention. Last session's filename inconsistencies (e.g., `ideation/staging/decisions/ideation-decisions.md` — single bulk file vs the prescribed per-finding `{slug}.md` template) violate it. There is no automated check; with `packages/cli/src/` absent, a CLI lint is infeasible. The **Consistency** evaluator perspective (`evaluation/SKILL.md:92` lines: "Did everything that should change together, change together? Code ↔ docs ↔ tests ↔ types ↔ comments ↔ indexes — are they synchronized?") plus the **Aesthetics** perspective (`evaluation/SKILL.md:90` lines: "Does it follow project naming / formatting conventions?") are the natural enforcement seam — but they need an explicit seed scenario referencing the memorization path conventions.

The 1-1 + 1-4 polish items are independently witnessed: 1-1 by user observation during bootstrap (Glossary appears mid-skill before users have seen the workflow); 1-4 by the existing `orchestration/SKILL.md:98-99` already documenting Configuration Step 1 row 1/2 with the "use defaults vs customize" gate — the redundant Step 4 setup questions in `gobbi/SKILL.md:99-114` duplicate work that's already settings-driven.

### Impact

- **Who is affected**: every future gobbi session that spawns codex evaluators, runs MEMORIZATION, or relies on Wrap-up to promote findings. The user (`@HahyeonJeon`) explicitly raised this — last session's findings were silently lost across T2-T7 because staging never ran.
- **Severity**: medium-high. Lost findings degrade the system's promise (a correction not recorded is repeated across sessions — `.claude/CLAUDE.md:33`). Codex sandbox + path mistakes cause real cleanup work (last session: `rm -rf` violation recovery via `git restore`).
- **Cost of inaction**: every future session repeats T2-T7 staging gaps; codex invocations continue to write to wrong paths; Wrap-up promotion-manifest accuracy degrades over time; naming convention drift accumulates silently.

### Success criteria

(see Scope Contract § Success Criteria above — 9 verifiable bullets)

### Prior attempts

- 2026-05-22 session (`bac669ad`) shipped PR #265 (env-var audit + SessionStart hook), and recorded the codex-eval-session-write-path mistake (`mistakes/codex-eval-session-write-path-nested-in-worktree.md`) + the rm-rf mistake (`mistakes/manager-rm-rf-without-investigating-tracked-files.md`). Neither resulted in a codex skill or a memorization fix — both deferred.
- No prior attempt at Wrap-up Step 2.5.
- No prior attempt at naming-convention enforcement.
- 1-1 Glossary placement — never raised before; this session's `/gobbi` reload surfaced it.
- 1-4 Setup-question reduction — `orchestration/SKILL.md` Configuration Step 1 already encodes the "use defaults vs customize" pattern; the duplication in `gobbi/SKILL.md § 4` is a docs-sync drift that was never cleaned up.

### Counterfactual / steel-man

**Steel-man against this bundle**: "These four items are unrelated discipline gaps; bundling them increases blast radius. Ship them as four separate sessions so each gets a focused evaluation."

**Counter-evidence**: The user (in discussion-log § Round 2 grill) explicitly considered bundle granularity and locked Bundle A because the four items share a single witness session (`2026-05-22-bac669ad`) and a shared root cause (orchestration/workflow discipline gaps). Splitting them would force four ideation→planning→execution cycles for a coherent ≤ 1-day docs-edit bundle. The polish items (F, G) are zero-risk one-line edits; the codex skill (A) is the new content; B+C+D+E are coordinated discipline edits to existing skills. Coupling matters: B (memorization moment-of-capture) is the source-side fix; C (delegation hard gate) is the prompt-side fix; D (wrap-up compliance check) is the detection-side fix; E (naming convention via Consistency) is the verification-side fix. Splitting B+C+D+E across sessions risks shipping one without the others, which would re-create the asymmetry.

Mitigation against the steel-man: **per-item scope discipline** — each item gets its own task in Planning, sequential execution; the EVALUATION phase will catch cross-item drift via Consistency perspective.

### Re-framing conclusion

No more ambitious framing hides inside the literal ask. The user's framing of "improve gobbi orchestration/workflow" is concrete enough; the bundle of 7 items is the right granularity. Items 1-2 (skill-loading) and 1-3 (worktree-first) were considered for re-framing into a broader "session-architecture overhaul" — explicitly **rejected** in DISCUSSION because failure modes are not yet named (see Out-of-Scope).

---

## Research Insights

Internal and external research, surfaced separately per `ideation/SKILL.md` Sub-step C.

### Internal Insights (codebase + project memory)

**I1 — `codex:codex-rescue` is a thin forwarder; no orchestration logic.**
Source: `~/.claude/plugins/cache/openai-codex/codex/1.0.2/agents/codex-rescue.md:9-46` + `~/.claude/plugins/cache/openai-codex/codex/1.0.2/skills/codex-cli-runtime/SKILL.md:14-16`.
Insight: The `codex:codex-rescue` agent's "only job is to forward the user's rescue request to the Codex companion script. Do not do anything else." (line 12). It invokes `node "${CLAUDE_PLUGIN_ROOT}/scripts/codex-companion.mjs" task ...` (line 21). The runtime skill is marked `user-invocable: false` — gobbi cannot reuse it directly in our own skill load; we must document the patterns at the gobbi-skill level, not delegate to the plugin's internal contract.
Why it applies: Any "best practices for codex" skill we write must respect that `codex:codex-rescue` is the model-invokable entry point (per `agents/codex-rescue.md:2-3` description), and the gobbi codex skill is the **prescriptive wrapper** that tells the manager when to use which command (`/codex:rescue` for tasks, `/codex:adversarial-review` for review-only, raw `codex exec` for any in-line invocation, especially from subagents that lack the Agent tool).

**I2 — `/codex:adversarial-review` has `disable-model-invocation: true`.**
Source: `~/.claude/plugins/cache/openai-codex/codex/1.0.2/commands/adversarial-review.md:5`.
Insight: The adversarial-review slash command is **user-only**; the agent cannot trigger it model-side. This is the gobbi evaluator-spawn pain point — when the orchestrator wants a codex adversarial review of WORK output, the manager must **ask the user to type `/codex:adversarial-review`**. `codex:codex-rescue` is the model-invokable alternative for tasks but not for review.
Why it applies: The codex skill must explicitly disambiguate these two paths, otherwise the manager will reach for the model-invokable codex-rescue agent in a review context and produce the wrong shape of output (rescue is write-capable by default, review is read-only).

**I3 — Codex sandbox defaults to `read-only`; write requires `--write` flag through the plugin or `--sandbox workspace-write` on raw `codex exec`.**
Source: `~/.claude/plugins/cache/openai-codex/codex/1.0.2/scripts/codex-companion.mjs:460` (`sandbox: request.write ? "workspace-write" : "read-only"`) + `~/.claude/plugins/cache/openai-codex/codex/1.0.2/scripts/lib/codex.mjs:61,75` (default `read-only`) + raw `codex exec --help`: `-s, --sandbox <SANDBOX_MODE>` with `[possible values: read-only, workspace-write, danger-full-access]`.
Insight: For evaluator spawns (read-only assessment) the default is correct. For codex-rescue tasks that should edit files, `--write` is required. Without `--write`, codex appears to "do nothing" — actually it ran but the sandbox refused writes, producing confusing partial outputs.
Why it applies: The codex skill needs a sandbox-mode selection rubric: evaluator (read-only), rescue-task (workspace-write via `--write` flag), automation in externally-sandboxed CI (`--dangerously-bypass-approvals-and-sandbox`). Plus a sandbox-troubleshooting section ("did codex appear to do nothing? check sandbox mode").

**I4 — Codex CWD is set via `-C, --cd <DIR>`; defaults to `process.cwd()`.**
Source: `codex exec --help` lines 65-66: "`-C, --cd <DIR>` — Tell the agent to use the specified directory as its working root" + `codex-companion.mjs` invokes `process.cwd()` as default.
Insight: When the gobbi manager (running in the main tree) spawns `codex:codex-rescue` from inside a worktree session, the codex sandbox's CWD inherits the worktree path. Any path the agent constructs as relative is rooted at the worktree, not the main tree. This is **exactly** the root cause documented in `mistakes/codex-eval-session-write-path-nested-in-worktree.md:19-29`.
Why it applies: The codex skill must encode the absolute-path-mandate rule explicitly: every codex delegation prompt that involves session writes must carry the main-tree absolute path `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/{session-id}/...`. This is `mistakes/codex-eval-session-write-path-nested-in-worktree.md`'s § Corrected approach made into a positive skill rule.

**I5 — Codex CLI has no built-in timeout flag for `codex exec`.**
Source: `codex exec --help` enumerated 100+ flags; no `--timeout` flag. Companion script `codex-companion.mjs` calls `runAppServerTurn(cwd, options)` (line 891 area) without an explicit timeout — `DEFAULT_STATUS_WAIT_TIMEOUT_MS = 240000` (4 minutes) in `codex-companion.mjs:64` is a **status poll** timeout, not a hard execution cap.
Insight: There is no first-class hang-detection. The plugin uses background mode + `/codex:status` polling for long-running invocations (`commands/adversarial-review.md:31-32` recommends background when scope is wider than 1-2 files). For raw `codex exec`, shell `timeout` is the only mechanism: `timeout 600 codex exec --json ...`. For codex-rescue invocations, the recommendation is foreground for clearly-bounded asks, background otherwise (`agents/codex-rescue.md:24`).
Why it applies: The codex skill's hang-detection section must say (a) there is no built-in timeout, (b) use foreground only for clearly-bounded rescue tasks, (c) use background for anything wider, (d) when shelling out raw, wrap in `timeout` with a generous ceiling.

**I6 — Memorization staging discipline is documented but unenforced last session.**
Source: empirical `find /playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/{execution/T2,T3,T4,T5,T6,T7}/staging` — directories exist but contain only `decisions/` subdirectory and (for T2-T7) zero files. Compare to `memorization/SKILL.md:144-166` which prescribes "every `disposition: addressed` and `disposition: open` finding ... per the deterministic Type + Domain routing." All 6 execution tasks have populated `evaluation/iter1/{claude,codex}/` files (≥7 per-perspective + overall files each), so findings existed but were never staged.
Why it applies: This is the empirical witness for the γ + α memorization fix in items B + C. The fix shape: **moment-of-capture** (write as you go, don't defer; γ) + **delegation hard gate** (every MEMORIZATION dispatch loads `memorization/SKILL.md`; α). β (manager inline-bypass) is NOT witnessed — the manager DID spawn assistant agents for MEMORIZATION (subagents are referenced in the session-final.md WORK Outputs table); the failure was inside the spawn (assistant didn't load the staging skill and didn't run the staging procedure).

**I7 — Wrap-up has no prior-loop compliance check between staging-inventory and routing.**
Source: `wrap-up/SKILL.md:134-143` shows 7 sequential WORK steps. Step 2 builds staging inventory; Step 4 applies routing table; nothing between them validates that the inventory **is what the prior loops should have produced**. The empirical T2-T7 staging gap from last session would not be caught — wrap-up sees 0 staging files for T6 and dutifully promotes 0 files, producing a clean promotion-manifest entry "T6 — 0 files staged" that hides the data loss.
Why it applies: A new Step 2.5 — "Prior-loop memorization compliance check" — slots between Step 2 (inventory) and Step 3 (feature destination). It scans each prior loop's evaluation findings count vs staging files count; ratio gaps are classified as `mechanical` (auto-backfill) or `judgment-required` (NEEDS_CONTEXT).

**I8 — No `packages/cli/src/` source tree in current repo state.**
Source: `ls /playinganalytics/git/gobbi/packages/cli/src/` exits 2 (No such file or directory). Cross-checked with project memory note from `MEMORY.md` lines about v0.5.0 redesign Phases 4-10 indicating the CLI was redesigned multiple times and the current tree may be in a different layout.
Why it applies: Item E (naming-convention enforcement) cannot use a CLI lint vehicle — there is no CLI source to extend. The only available vehicle is an **evaluator-perspective check** (Consistency + Aesthetics seed scenarios) at the MEMORIZATION-output evaluation gate, or a hard gate inside `wrap-up/SKILL.md` Step 2.5 (item D). The bundle is more coherent if E rides on D (Step 2.5 runs a naming-shape check) plus a Consistency-perspective seed scenario at the MEMORIZATION evaluation step.

**I9 — `gobbi/SKILL.md` Glossary appears at line 15-29, before § Session Bootstrap Order (line 32).**
Source: `gobbi/SKILL.md:15-29` (Glossary table) followed by `gobbi/SKILL.md:32-124` (Session Bootstrap Order).
Why it applies: Item F asks the Glossary to move below Session Bootstrap Order so the actionable bootstrap is the first content a fresh manager reads.

**I10 — `gobbi/SKILL.md` Step 4 asks 2 questions (eval-mode + git-workflow-mode); `orchestration/SKILL.md` Step 1 row 1-2 (lines 98-99) already encodes a "use defaults vs customize" pattern.**
Source: `gobbi/SKILL.md:99-114` (Question 1 + Question 2 sections) vs `orchestration/SKILL.md:98-99` (rows 1-2: "use defaults as-is, or customize?" → "walk through each section via AskUserQuestion to collect overrides").
Why it applies: Item G consolidates — Step 4 drops the explicit eval-mode + git-mode questions; defaults flow from settings.json; the customize gate (already in Configuration Step 1 row 1) covers overrides. `find .claude/skills/orchestration/workflow -name "configuration*"` returns empty — there is **no** `orchestration/workflow/configuration.md`; Configuration is documented inside `orchestration/SKILL.md § Step 1`.

**I11 — `evaluation/SKILL.md § Coverage Ownership Matrix` is the canonical seam for cross-cutting concern → perspective mapping.**
Source: `evaluation/SKILL.md:98-110` ("Cross-cutting concerns that have no obvious single owner are assigned to specific perspectives **as required seed coverage** to prevent silent omission."). Privacy → Risk + Consistency; Licensing → Risk + Consistency; Dependency supply chain → Risk + Structure; Observability → Structure + Usage; etc.
Why it applies: Item E adds one row: "Memorization staging shape + naming → Consistency + Aesthetics" so every evaluator at Stage 1 must include a seed scenario testing staging filename/template conformance.

**I12 — Item D's witness is the empirical T2-T7 staging gap observed this session.**
Source: `find /playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-22-bac669ad-.../execution/T*/staging` — directories exist but T2-T7 contain zero files despite each task having full `evaluation/iter1/{claude,codex}/` content. The prior session's `wrap-up/artifacts/handoff.md` § "What the Next Session Inherits" (lines 106-119) does NOT enumerate "Wrap-up Step 2.5 compliance check" as a numbered carry-forward — the manager's earlier "carry-forward item #3" framing was loose.
Why it applies: Honesty about provenance. Item D's witness is the concrete empirical staging gap (this session's `find` evidence + I6 + I7), not a prior numbered handoff item.

**I13 — Subagent role specs (`.claude/agents/{leader,executor,evaluator,assistant}.md`) lack the Agent tool; only `.claude/agents/manager.md` has `tools: "*"`.**
Source: `.claude/agents/manager.md` frontmatter `tools: "*"` + `.claude/agents/leader.md` / `executor.md` / `evaluator.md` / `assistant.md` frontmatter explicitly enumerating tool lists that omit `Agent`. `~/.claude/plugins/cache/openai-codex/codex/1.0.2/agents/codex-rescue.md` itself declares `tools: Bash` — even the plugin agent is a thin Bash wrapper around `codex exec`.
Insight: Subagents in gobbi **cannot** spawn the `codex:codex-rescue` plugin agent because that requires the Agent tool. The codex plugin agent's own implementation reduces to `codex exec` via Bash. Therefore the universal lowest-common-denominator invocation pattern — usable by manager AND subagents — is **`codex exec` via Bash**.
Why it applies: Restructures Design A — `codex exec` via Bash must be documented as the **primary** universal pattern; plugin-agent spawn is a manager-only convenience that itself reduces to `codex exec`. This empirically resolves the user's open question ("there were some blocks") from `iter1-user-redirects.md § Decision 2`.

### External Insights (codex CLI + plugin behavior, ecosystem)

**E1 — Codex CLI architecture: app-server + thread-based execution model.**
Source: `~/.claude/plugins/cache/openai-codex/codex/1.0.2/scripts/lib/codex.mjs:607-650` shows `withAppServer(cwd, fn)` → `CodexAppServerClient.connect(cwd)` → `client.request("thread/start", buildThreadParams(...))`. Each codex invocation creates a thread on the app-server, runs a turn, and disconnects.
Insight: Codex is NOT a stateless CLI — it manages threads (`thread/start`, `thread/resume`) and each `task` invocation can either start fresh or `--resume-last` to continue a prior thread (`commands/rescue.md:36-37`). Misunderstanding this leads to two failure modes: (a) repeated `task` invocations without `--resume-last` lose prior context, (b) resume invocations of stale threads pick up wrong context.
Why it applies: The codex skill's invocation-patterns section must explain the thread model and when to `--resume` vs `--fresh`. The `commands/rescue.md:23-37` rules are the source of truth for the manager's decision.

**E2 — Codex sandbox is Linux-bubblewrap by default on Linux; macOS uses Seatbelt; Windows uses restricted token.**
Source: `codex sandbox --help` enumerates `macos` (Seatbelt), `linux` (bubblewrap), `windows` (restricted token). `codex sandbox linux --help` confirms bubblewrap default and adds `--permissions-profile <NAME>` for named profiles + `--include-managed-config` for managed envs.
Insight: On Linux, codex's sandbox uses bubblewrap. The `workspace-write` mode allows writes to the CWD subtree only; `--add-dir <DIR>` extends the writable set. **Worktree path is NOT in the main-tree's writable set by default** — this is the technical mechanism behind I4's path mistake.
Why it applies: The codex skill must explain the writable-set extension via `--add-dir` for cases where codex needs to write to both the main tree (session memory) and a worktree (code under test). Quote `codex exec --help`: `--add-dir <DIR>` (line 67-68: "Additional directories that should be writable alongside the primary workspace").

**E3 — Codex effort levels: `none|minimal|low|medium|high|xhigh`.**
Source: `~/.claude/plugins/cache/openai-codex/codex/1.0.2/scripts/codex-companion.mjs:71` (`VALID_REASONING_EFFORTS = new Set([...])`).
Insight: Effort defaults are model-dependent; leaving `--effort` unset is recommended per `codex-cli-runtime/SKILL.md:18-19`. The gobbi codex skill should not prescribe non-default effort.

**E4 — Codex models: default model is configured in `~/.codex/config.toml`; aliases include `spark → gpt-5.3-codex-spark`.**
Source: `~/.claude/plugins/cache/openai-codex/codex/1.0.2/scripts/codex-companion.mjs:67` (`MODEL_ALIASES = new Map([["spark", "gpt-5.3-codex-spark"]])`).
Insight: Don't override `--model` unless the user explicitly requests; let the codex config govern model selection. The codex skill should explicitly say "Do not pass `--model` from the gobbi orchestrator unless the user specified a model."

**E5 — Plugin authorization: `/codex:setup` is required before first use.**
Source: `commands/setup.md:1-30` shows the setup flow: detect `codex` binary; run `codex login`; optionally enable the stop-review gate.
Why it applies: The codex skill should reference `/codex:setup` as a precondition. Gobbi should not attempt to install codex itself — that is `/codex:setup`'s job.

---

## Scenarios

Per `ideation/SKILL.md` Sub-step D — golden / edge / failure / adversarial. Anchored to insights.

### Golden — A new gobbi session that needs a codex review during EVALUATION

1. Manager dispatches evaluator agents; one is the Claude evaluator (in-process), the other is the codex evaluator.
2. Per the new codex skill, manager has two options:
   - **Option A — `codex exec` directly via Bash** (universal pattern): manager constructs the command with `--cd /playinganalytics/git/gobbi`, `-s read-only`, and an inline-pasted absolute main-tree session-write path in the prompt. Runs via the Bash tool.
   - **Option B — `Agent(subagent_type="codex:codex-rescue", ...)`** (manager-only convenience pattern): spawns the plugin agent which itself shells out to `codex exec`. Manager benefits from a separate agent thread for the spawn.
3. For full adversarial review the manager **asks the user** to type `/codex:adversarial-review` (per `disable-model-invocation: true`).
4. Codex returns findings; manager parses; staging applies the routing table.
5. **No path mistake** because the absolute path was inline-pasted (or `--cd` was set to the main-tree absolute). (Anchored to I4 + E2 + I13.)

### Golden — A WORK phase produces a correction; memorization is captured at moment-of-occurrence

1. Leader is mid-WORK; user corrects an approach via AskUserQuestion.
2. Per the new `memorization/SKILL.md` Core Principle "Moment-of-capture, not end-of-loop" (added in item B), the leader writes the correction to `sessions/.../{loop}/rawdata/correction-notes.md` (or staging/decisions/{slug}.md with `mistake-candidate: true`) **before** continuing.
3. MEMORIZATION at end of iter dispatches the assistant with a Load Directives block that includes `memorization/SKILL.md` (per item C). The assistant reads the correction-notes, stages them, and persists. (Anchored to I6.)

### Golden — A subagent needs an inline codex second-opinion mid-WORK

1. Executor is mid-implementation, hits an ambiguous design question.
2. Executor cannot spawn `codex:codex-rescue` — executor's agent spec (`.claude/agents/executor.md`) lacks the Agent tool (per I13).
3. Per the new codex skill, executor calls `codex exec` directly via the Bash tool, with `--cd /playinganalytics/git/gobbi` and `-s read-only`. Inline prompt asks the targeted question.
4. Codex returns the second-opinion to stdout; executor parses and continues.
5. **No Agent-tool requirement, no plugin-agent spawn.** (Anchored to I13.)

### Edge — Codex CWD inheritance from worktree

1. Manager is operating in worktree mode; cwd is `.gobbi/projects/gobbi/worktrees/feat/branch/`.
2. Manager invokes `codex exec` via Bash (or spawns `codex:codex-rescue`).
3. Without `--cd`, codex sandbox CWD inherits the worktree path. Any session write the agent attempts as relative is rooted at the worktree, not the main tree.
4. Per the new codex skill, the invocation **explicitly sets** `--cd /playinganalytics/git/gobbi` and the delegation prompt inlines the absolute main-tree path `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/{session-id}/...` for all session writes; do not use relative or `pwd`-derived paths.
5. Codex's write completes at the correct main-tree path. If sandbox refuses (workspace-write sandbox confined to the wrong subtree), codex returns NEEDS_CONTEXT and the manager runs a manager-proxy write. (Anchored to I4 + E2 + `mistakes/codex-eval-session-write-path-nested-in-worktree.md`.)

### Edge — Wrap-up detects a prior-loop staging gap

1. Wrap-up WORK Step 2 enumerates staging inventory. Execution T3 has 0 staging files but `evaluation/iter1/{claude,codex}/` has 8 findings each.
2. Wrap-up WORK Step 2.5 (new) detects the gap and **classifies each finding** as `mechanical` or `judgment-required` per the classification rules (item D's specification).
3. Per item D's hybrid escalation shape:
   - **Mechanical findings** (finding's `Type` + `Domain` route deterministically to one staging subdir per `evaluation/SKILL.md § Finding Metadata`) → Step 2.5 auto-writes the staging file from the finding's content **inline**, no user gate.
   - **Judgment-required findings** (design_flaw flagged routing-ambiguity, `disposition: open` requiring user arbitration, or finding spans multiple staging subdirs) → aggregated into a single NEEDS_CONTEXT surfacing with a `user-question:` block. Options offered to the user typically include: (a) decide the routing for each judgment-required finding, (b) document the gap in handoff and proceed, (c) abort wrap-up and re-enter Execution MEMORIZATION.
4. Wrap-up resumes Step 3 with mechanically-backfilled staging present and judgment-required gaps either resolved by the user or explicitly documented. (Anchored to I7 + iter1 user redirect § Decision 1.)

### Failure — Codex hangs during evaluator spawn

1. Manager invokes codex via `codex exec` (foreground) or `codex:codex-rescue --background`.
2. The codex run takes > 10 minutes without progress events.
3. Per item A's hang-detection section, the gobbi manager **does not have a built-in timeout** — for `codex exec` via Bash, the recommendation is wrapping with `timeout 600 codex exec ...`. For `codex:codex-rescue --background`, manager polls via `/codex:status` (user-only command per the plugin docs) or checks the background bash job.
4. Manager surfaces to user: "Codex evaluator has been running for 10 minutes without progress. Wait / abort / restart?"
5. On user-decided abort, manager invokes `/codex:cancel` (user-only). (Anchored to I5.)

### Adversarial — Subagent attempts to spawn `codex:codex-rescue` plugin agent

1. Executor (subagent) tries to invoke `Agent(subagent_type="codex:codex-rescue", ...)`.
2. Invocation fails because executor's agent spec lacks the Agent tool (per `.claude/agents/executor.md` — I13).
3. Per item A's "Why subagents must use `codex exec`" subsection + Anti-patterns section, executor reaches for `codex exec` via Bash instead, with appropriate `--cd`, sandbox, and absolute-path discipline.
4. Codex returns the result inline; executor continues. (Anchored to I13 + iter1 user redirect § Decision 2.)

### Adversarial — Memorization is silently skipped because Load Directives omitted `memorization/SKILL.md`

1. Manager dispatches the MEMORIZATION assistant with a delegation prompt that **does not** list `memorization/SKILL.md` in Load Directives Skills tier (regression of item C).
2. Per item D's Step 2.5 (new), Wrap-up later detects the staging gap and classifies it. For purely-mechanical gaps (deterministic routing), Step 2.5 auto-backfills inline. For judgment-required gaps, Step 2.5 surfaces a single NEEDS_CONTEXT.
3. Either way, the gap is no longer silent. The regression itself (delegation Load Directives omission) becomes a `mistake-candidate` in the next session.
4. Item C is preventive; item D is detective (with hybrid auto-fix for mechanical cases). Both are needed because regressions happen. (Anchored to I6 + I7.)

### Adversarial — Naming convention drift: someone bulk-stages findings into `ideation-decisions.md` instead of per-finding `{slug}.md`

1. Memorization assistant writes one bulk file `staging/decisions/ideation-decisions.md` instead of per-finding files.
2. Wrap-up Step 2.5 (item D) detects the shape mismatch — single bulk file with > 1 finding-id frontmatter is a violation. Shape gap is classified as `judgment-required` (splitting a bulk file is not a deterministic operation; user must confirm split boundaries when finding-ids aren't clean).
3. EVALUATION of WRAP-UP runs with the new Consistency seed scenario (item E): "Did staging filenames follow `{slug}.md` per finding-id, or were findings bulk-coalesced?" Finding is raised; verdict REVISE; bulk file is split before promotion. (Anchored to I11.)

---

## Implementation Checklist

Each item maps to a specific design decision and a confirmed insight.

| # | Checklist item | Anchored insight | Validation method |
|---|---|---|---|
| 1 | Create `.gobbi/projects/gobbi/skills/codex/SKILL.md` (source-of-truth) with frontmatter (name, description, allowed-tools), 5+ H2 sections: (a) When to load, (b) Invocation patterns — `codex exec` first / plugin agent second / slash command third, (c) Why subagents must use `codex exec`, (d) Sandbox + CWD discipline, (e) Hang + timeout discipline, (f) Use cases (incl. evaluator-spawn + subagent second-opinion), (g) Anti-patterns. | I1, I2, I3, I4, I5, I13, E1, E2 | `cat .gobbi/projects/gobbi/skills/codex/SKILL.md \| grep "^## "` returns 5+ H2 sections; `find . -name SKILL.md -path '*/skills/codex/*'` returns the source file |
| 2 | Create symlink `.claude/skills/codex/SKILL.md` → `../../../.gobbi/projects/gobbi/skills/codex/SKILL.md` (matches existing convention; source-of-truth lives in `.gobbi/projects/gobbi/skills/`, `.claude/skills/` is the symlinked mirror — verified via `ls -la` on existing skill dirs). | docs-sync hygiene | `ls -la .claude/skills/codex/SKILL.md` shows symlink pointing into `.gobbi/projects/gobbi/skills/codex/SKILL.md` |
| 3 | Add a row to `gobbi/SKILL.md § Skill Map § Cross-cutting skills` for `codex` (one-liner: "Codex CLI / plugin best practices — `codex exec` (universal) / `codex:codex-rescue` (manager-only) / `/codex:adversarial-review` (user-only) invocation patterns; sandbox + CWD discipline; hang detection."). | I1, I13 | `grep "codex" gobbi/SKILL.md` returns the new row |
| 4 | Edit `memorization/SKILL.md`: add a new Core Principle bullet "Moment-of-capture, not end-of-loop" between existing bullets ~line 58-80; reciprocal link to `mistake/SKILL.md` P2. | I6 | `grep "moment-of-capture\|Moment-of-capture" memorization/SKILL.md` returns ≥ 1 hit |
| 5 | Edit `mistake/SKILL.md` P2 (line 70-80): strengthen "Do not defer to MEMORIZATION" with explicit "Stage the candidate in-loop at `sessions/.../{loop}/staging/decisions/{slug}.md`" sentence; add reciprocal link to `memorization/SKILL.md` Core Principle. | I6 | `grep "MEMORIZATION\|memorization/SKILL.md" mistake/SKILL.md` returns ≥ 2 hits |
| 6 | Edit `delegation/SKILL.md`: add a Core Principle "MEMORIZATION dispatches always include `memorization/SKILL.md` in Load Directives Skills tier"; add a table row in the Load Directives block section ("Memorization phase → mandatory skill: `memorization`"). | I6 | `grep -c "memorization/SKILL.md" delegation/SKILL.md` returns ≥ 2 |
| 7 | Edit per-role templates under `delegation/templates/`: every template's example Load Directives block includes `memorization/SKILL.md` when the role's job includes MEMORIZATION (executor at EXECUTION+MEMORIZATION; leader at WORK+MEMORIZATION; assistant explicitly; evaluator does NOT memorize, so excluded). | I6 | grep each template; assistant + leader + executor reference `memorization/SKILL.md`; evaluator does not |
| 8 | Edit `wrap-up/SKILL.md`: insert "Step 2.5 — Prior-loop memorization compliance check" between current Steps 2 and 3 (`wrap-up/SKILL.md:137-138`). Include: inputs (rawdata + staging across prior loops), scan procedure, gap-classification table (zero-staging, naming-shape, missing-template) **with each gap categorized as `mechanical` (deterministic Type+Domain routing → auto-backfill inline) or `judgment-required` (design_flaw routing ambiguity, `disposition: open` user arbitration, or multi-subdir spans → aggregate NEEDS_CONTEXT)**, auto-backfill mechanism, NEEDS_CONTEXT trigger with `user-question:` block schema for judgment-required aggregations. Update Exit checklist (`wrap-up/SKILL.md:166-174`) to include the new step. | I7 + iter1-user-redirects § Decision 1 | `grep "Step 2.5\|prior-loop memorization compliance" wrap-up/SKILL.md` returns the new section; `grep "mechanical\|judgment-required" wrap-up/SKILL.md` returns ≥ 1 each |
| 9 | Edit `evaluation/SKILL.md § Coverage Ownership Matrix`: add new row "Memorization staging shape + naming → Consistency + Aesthetics" with cell text "Per-finding `{slug}.md` files exist; filenames follow path conventions; templates stamped correctly. Aesthetics checks naming-convention; Consistency checks that every finding has a corresponding staging file." | I11 | `grep "staging shape" evaluation/SKILL.md` returns 1 hit; row count of Coverage Ownership Matrix increases by 1 |
| 10 | Edit `memorization/SKILL.md`: cross-link the Path Conventions block (`memorization/SKILL.md:223-231`) to `evaluation/SKILL.md § Coverage Ownership Matrix § Memorization staging shape + naming`. | I11 | `grep "Coverage Ownership Matrix" memorization/SKILL.md` returns 1 hit |
| 11 | Edit `gobbi/SKILL.md`: move § Glossary block (lines 15-29) to a new position **after** § Session Bootstrap Order (after current line 124). | I9 | `awk '/^## Glossary/{print NR}' gobbi/SKILL.md` returns a number > the line number of `## Session Bootstrap Order` |
| 12 | Edit `gobbi/SKILL.md § Step 4` (lines 99-114): rewrite from "ask 2 questions" to "ask 1 question (mode: chat/auto), then ask 'customize defaults?' (yes/no). If yes, defer to `orchestration/SKILL.md § Step 1` row 2 walk-through. If no, persist defaults from settings.json." | I10 | `awk '/^### 4\./,/^### 5\./' gobbi/SKILL.md` shows 1 mode question + optional customize gate; no eval-mode / git-workflow-mode questions |
| 13 | Add `evaluation-mode: ask-each-time` + `git-workflow-mode: direct` (or whatever the user-confirmed defaults are) to `.gobbi/projects/gobbi/sessions/` template — actually, verify `orchestration/templates/settings.default.json` already encodes these (it should) and don't duplicate. | I10 | `cat orchestration/templates/settings.default.json \| jq '.evaluation, .git'` returns the defaults; no schema change required |
| 14 | Add a session-level test in the codex skill's "Use cases" section showing the gobbi-evaluator-spawn pattern: BOTH the manager-spawn `codex:codex-rescue` pattern AND the subagent-call `codex exec` pattern. Full delegation-prompt template, including the absolute main-tree path, sandbox=read-only flag, `--cd` flag set to main-tree absolute, output-schema flag. Cite `mistakes/codex-eval-session-write-path-nested-in-worktree.md` as the witness. | I4, I13, mistake | `grep "main-tree absolute\|CWD=main-tree\|codex-eval-session-write-path\|codex exec" .claude/skills/codex/SKILL.md` returns ≥ 2 (one per pattern) |
| 15 | Add a section to the codex skill: "Anti-patterns" listing (a) using `codex:codex-rescue` for review work (should be `/codex:adversarial-review`), (b) **trying to spawn a codex plugin agent from a subagent context (will fail; subagents lack the Agent tool — use `codex exec` via Bash instead)**, (c) omitting the absolute path or `--cd` in invocation, (d) running codex foreground for open-ended tasks that exceed 2-3 minutes, (e) overriding `--model` without a user request, (f) overriding `--effort` without a user request, (g) using `--dangerously-bypass-approvals-and-sandbox` without an externally-sandboxed environment. | I1, I2, I13, E3, E4 | `grep "Anti-pattern\|anti-pattern\|subagents lack" .claude/skills/codex/SKILL.md` returns ≥ 1 hit each |

---

## Design

Directional design decisions per item A-G. Each names a chosen direction, rationale, anchored insight, and validation method. Detailed mechanism (exact wording, exact line edits) is deferred to Execution.

### Design A — `codex` skill structure

**Direction**: Single SKILL.md file at `.gobbi/projects/gobbi/skills/codex/SKILL.md` (source-of-truth, matching project convention) with a symlink at `.claude/skills/codex/SKILL.md`, ~300-400 lines (comparable to other cross-cutting skills like `git/SKILL.md` or `discussion/SKILL.md`, slightly longer to accommodate the multi-pattern invocation section + the "Why subagents must use `codex exec`" subsection). 6-7 H2 sections plus frontmatter + Constraints block (per `_claude/SKILL.md` writing standard).

**Symlink direction (concern 4 — resolved)**: source-of-truth lives at `.gobbi/projects/gobbi/skills/codex/SKILL.md`; symlink at `.claude/skills/codex/SKILL.md` points to it via the relative path `../../../.gobbi/projects/gobbi/skills/codex/SKILL.md`. This matches the existing convention verified via `ls -la` on adjacent skill directories.

**Section outline**:

1. **When to load** (1-2 paragraphs) — load when the manager is about to spawn a codex agent, when any agent (manager or subagent) is about to invoke `codex exec` via Bash, or when the manager wants to request a user-only codex slash command. Subagent delegation prompts that involve codex MUST include this skill in Load Directives.

2. **Invocation patterns** — reordered per iter1 user redirect § Decision 2 to **priority order from universal-to-restricted**:

   **(a) `codex exec` via Bash — UNIVERSAL primary pattern (manager AND subagents).** Document:
   - Why universal: subagents (leader/executor/evaluator/assistant) lack the Agent tool per `.claude/agents/{role}.md`, so they cannot spawn the `codex:codex-rescue` plugin agent. Manager has Agent tool but `codex exec` is still the lowest-common-denominator pattern and is what the plugin agent shells out to internally (`~/.claude/plugins/cache/openai-codex/codex/1.0.2/agents/codex-rescue.md` declares `tools: Bash`).
   - Invocation template: `codex exec --cd /playinganalytics/git/gobbi -s <sandbox-mode> [-c <config-override>] [--add-dir <DIR>] <prompt-or-file>` — see Sandbox + CWD section for sandbox-mode + `--cd` discipline.
   - Timeout discipline: `timeout 600 codex exec ...` for any unbounded request; foreground only for clearly-bounded asks (≤ 2-3 minutes expected).
   - CWD discipline: always pass `--cd` set to the main-tree absolute path; never inherit the worktree CWD.
   - Output parsing: codex emits structured stdout the caller parses; `--json` flag for machine-readable output.

   **(b) `Agent(subagent_type="codex:codex-rescue", ...)` — MANAGER-ONLY secondary pattern.** Document:
   - Only the manager (`.claude/agents/manager.md` declares `tools: "*"`) can spawn this; subagents cannot (per (a)).
   - Plugin agent is a thin wrapper around `codex exec`. Use case: manager wants a separate agent thread for the spawn (e.g., parallel-evaluation flows, ad-hoc rescue / second-opinion work that benefits from an isolated context).
   - Reduces to `codex exec` under the hood — every behavior documented in (a) (CWD, sandbox, timeout) still applies; the plugin just owns the spawn ergonomics.

   **(c) `/codex:adversarial-review` — USER-ONLY tertiary pattern.** Document:
   - `disable-model-invocation: true` per `~/.claude/plugins/cache/openai-codex/codex/1.0.2/commands/adversarial-review.md:5` — neither manager nor subagent can invoke. Manager must **ASK USER** to type the slash command at evaluation gates where a full plugin-driven adversarial review is wanted (vs the embeddable `codex exec` path in (a)).

3. **Why subagents must use `codex exec`** (NEW subsection, per iter1 user redirect § Decision 2). Empirical witness:
   - Cite `.claude/agents/leader.md`, `.claude/agents/executor.md`, `.claude/agents/evaluator.md`, `.claude/agents/assistant.md` — each frontmatter enumerates a tool list that does NOT include `Agent`. Subagents therefore cannot spawn other agents (plugin or otherwise).
   - Cite `.claude/agents/manager.md` — `tools: "*"` — only the manager has Agent tool surface.
   - Cite `~/.claude/plugins/cache/openai-codex/codex/1.0.2/agents/codex-rescue.md` — declares `tools: Bash`, confirming the plugin agent is itself a thin Bash wrapper around `codex exec`.
   - Conclusion: `codex exec` via Bash is the only invocation surface available to subagents. The "blocks" historically observed when subagents tried to use codex plugin agents resolve to this tool-surface mismatch.

4. **Sandbox + CWD discipline** — sandbox modes table (`read-only` / `workspace-write` / `danger-full-access`); when to use which; CWD inheritance from the calling shell; the absolute-path-mandate (citing `mistakes/codex-eval-session-write-path-nested-in-worktree.md`); `--add-dir` for cross-tree writability; manager-proxy write fallback when sandbox blocks.

5. **Hang + timeout discipline** — no built-in timeout in `codex exec`; foreground vs background selection rubric; `timeout(1)` wrapping for raw `codex exec` automation (universal pattern); `/codex:status` polling for background plugin-agent runs; `/codex:cancel` (user-only) for stuck plugin-driven runs.

6. **Use cases** — three subsections, each with a worked example:

   **(a) Dual-system evaluator spawn** — show BOTH patterns:
   - Manager-spawn pattern: manager calls `Agent(subagent_type="codex:codex-rescue", ...)` for parallel-evaluation flows where an isolated agent thread is wanted.
   - Subagent in-line second-opinion pattern: an evaluator subagent (or leader, or executor) calls `codex exec --cd /playinganalytics/git/gobbi -s read-only ...` directly via the Bash tool for an inline second opinion, without spawning a separate agent thread.
   - Both patterns share the same CWD, sandbox, and absolute-path discipline; only the spawn ergonomics differ.

   **(b) Codex-rescue for stuck Claude work** — manager-only; uses `codex:codex-rescue` for ad-hoc rescue.

   **(c) External adversarial review at session end** — user-only; manager ASKS USER to type `/codex:adversarial-review`.

7. **Anti-patterns** — see checklist item 15. Key new anti-pattern: "Trying to spawn a codex plugin agent from a subagent context — will fail; subagents lack Agent tool. Use `codex exec` via Bash directly."

8. **Constraints** — bullet list per the project's `_claude/SKILL.md` standard.

**Rationale**: One file matches every other gobbi cross-cutting skill (no `git/templates/` or `discussion/templates/` proliferation). The reordered invocation-patterns section reflects the empirical tool-surface reality — `codex exec` is the universal lowest-common-denominator; plugin agent is a manager-only convenience that reduces to the same; slash command is user-only. The new "Why subagents must use `codex exec`" subsection inlines the empirical witness so future readers don't repeat the user's "I remember there were some blocks" investigation.

**Anchored insight**: I1, I2, I3, I4, I5, I13, E1, E2, E3, E4, E5 + iter1 user redirect § Decision 2.

**Validation method**: After Execution, `find .gobbi/projects/gobbi/skills/codex -name SKILL.md` returns 1 file; `ls -la .claude/skills/codex/SKILL.md` shows the symlink; `grep "^## " .gobbi/projects/gobbi/skills/codex/SKILL.md` returns 6-8 H2 sections; manual read confirms (i) Invocation patterns subsection orders `codex exec` first / plugin-agent second / slash-command third, (ii) "Why subagents must use `codex exec`" subsection cites the four `.claude/agents/{role}.md` tool lists + the plugin agent's `tools: Bash` field, (iii) Use cases dual-system shows both spawn patterns, (iv) Anti-patterns includes the subagent-cannot-spawn-plugin-agent entry.

### Design B — Memorization moment-of-capture (Core Principle bullet)

**Direction**: Add a new Core Principle bullet to `memorization/SKILL.md § Core Principles` (line 54-86 region) AFTER "Store what survives, not what's transient" (line 78-80) and BEFORE "Templates over freeform" (line 82-84). New bullet titled **"Moment-of-capture, not end-of-loop"**. Body: 2-3 sentences stating that corrections, decisions, and mistake-candidates are written to staging/rawdata at the moment of occurrence during WORK, not deferred to MEMORIZATION. Cross-link to `mistake/SKILL.md` P2.

**Rationale**: γ pathology is a discipline gap inside WORK, but the corrective documentation lives in MEMORIZATION (the staging contract). Adding it as a Core Principle of memorization makes it visible to every agent that loads memorization for any reason. The reciprocal link from `mistake/SKILL.md` P2 closes the loop.

**Anchored insight**: I6.

**Alternative considered**: Add to `mistake/SKILL.md` only (it's already there as P2 — "Do not defer to MEMORIZATION"). **Rejected** because mistake skill is one of many WORK-time skills; the memorization skill is loaded by every MEMORIZATION dispatch, so adding it there has higher visibility.

**Validation method**: `grep "Moment-of-capture\|moment-of-capture" memorization/SKILL.md` returns ≥ 1 hit; reciprocal grep in `mistake/SKILL.md` returns the link to memorization.

### Design C — Memorization delegation hard gate

**Direction**: Add a new entry to the `delegation/SKILL.md § The Load Directives Block` section's "Why this order" subsection (`delegation/SKILL.md:99`). New text: "When the delegated phase includes MEMORIZATION (every loop's MEMORIZATION sub-phase, plus Wrap-up's WORK promotion routing), `memorization/SKILL.md` MUST appear in tier 3 (Skills). The dispatching manager verifies this at prompt-construction time. Subagents that load Load Directives in order will load it before WORK begins." Then add it to the per-role templates' example Skills lists (assistant for sure; leader and executor when MEMORIZATION is part of their dispatch).

**Rationale**: α pathology root cause was Load Directives lacking the memorization skill, so the assistant didn't load the staging procedure. The fix is to make the requirement explicit at the delegation contract level.

**Anchored insight**: I6.

**Alternative considered**: Add a verification step inside the assistant's MEMORIZATION procedure (assistant checks "did I load memorization/SKILL.md?" at Step 1). **Rejected** as duplicative — if the Load Directives include it, it's loaded; if they don't, no internal self-check will save the agent.

**Validation method**: `grep -c "memorization/SKILL.md" delegation/SKILL.md` returns ≥ 2 (Core Principles or What Every Delegation Prompt Contains section + Constraints).

### Design D — Wrap-up Step 2.5

**Direction**: Insert a new Step 2.5 between Step 2 (staging inventory) and Step 3 (feature destination) in `wrap-up/SKILL.md § WORK Phase` table (`wrap-up/SKILL.md:135-143`).

**Step 2.5 specification (restructured per iter1 user redirect § Decision 1 — hybrid escalation)**:

- **Inputs**: prior loops' `rawdata/` + `staging/` + `evaluation/iter*/{claude,codex}/` (read-only).

- **Procedure**:
  1. For each prior loop (ideation, preparation, planning, execution/T*, ...), enumerate evaluation findings per perspective × system in `evaluation/iter{n}/{system}/{perspective}.md`.
  2. Count staging files per loop's `staging/{type}/`.
  3. Compute gap metrics: (a) **zero-staging gap** — `staging/` is empty but `evaluation/` has findings; (b) **shape gap** — staging files exist but filenames don't match `{slug}.md` per finding-id; (c) **template gap** — staging files exist but template frontmatter is missing or wrong (e.g., `decisions/{slug}.md` lacks `mistake-candidate:` when it should have one).
  4. **Classify each gap** per the classification rules below:
     - **`mechanical`** = the finding's `Type` + `Domain` route deterministically to one staging subdir per `evaluation/SKILL.md § Finding Metadata`. Examples: a `correction` finding with a single `Domain` value; a `decision-record` finding with a single canonical destination; a `mistake-candidate` with `disposition: addressed`.
     - **`judgment-required`** = ANY of: the finding is a `design_flaw` that flags routing ambiguity; the finding has `disposition: open` requiring user arbitration; the finding spans multiple staging subdirs (e.g., a finding that is BOTH a decision-record AND a mistake-candidate); the finding's `Type` is missing or unrecognized.
  5. **Auto-fill mechanical gaps inline** — Step 2.5 reads the evaluation file, applies the deterministic Type+Domain routing, writes the staging file at the canonical path. No user gate. Each auto-fill is logged in the gap report.
  6. **Aggregate judgment-required gaps into a single NEEDS_CONTEXT** — emit `STATUS: NEEDS_CONTEXT` with a `user-question:` block listing all judgment-required gaps grouped by loop + per-finding routing options. Options typically include: (a) decide the routing for each judgment-required finding inline, (b) document the gap in handoff and proceed, (c) abort wrap-up and re-enter the upstream loop's MEMORIZATION.

- **Output**: gap report appended to `rawdata/promotion-manifest.md` (creating the file if not yet present) — one section per loop, listing each gap with verdict `clean` / `auto-filled-mechanical` / `needs-context-judgment-required`.

- **Classification audit trail**: the classification rules MUST be documented in `wrap-up/SKILL.md` so users can audit the assistant's gap-classification. The classification table in the skill enumerates: (i) what makes a gap mechanical, (ii) what makes a gap judgment-required, (iii) examples of each, (iv) the deterministic routing source (`evaluation/SKILL.md § Finding Metadata`).

**Rationale**: Pure NEEDS_CONTEXT (the original recommendation) introduces friction even for trivially-deterministic gaps (e.g., a single `correction` finding with a single `Domain` value clearly routes to one staging path). Pure auto-backfill elevates autonomy past Iron Law 4 when the routing is non-deterministic. The hybrid threads the needle: mechanical = autonomy is safe, the routing has only one defensible target; judgment-required = the user owns the call. The classification rules being explicit in `wrap-up/SKILL.md` makes the assistant's behavior auditable.

**Anchored insight**: I7 + iter1 user redirect § Decision 1.

**Alternative considered**: Pure NEEDS_CONTEXT (original iter1 recommendation) — **rejected** by user as too friction-heavy for mechanical cases. Pure auto-backfill — **rejected** by user as too aggressive on autonomy. The hybrid is the user's selected option.

**Validation method**: `grep "Step 2.5" wrap-up/SKILL.md` returns the new step; `grep -i "mechanical\|judgment-required" wrap-up/SKILL.md` returns the classification rules; Wrap-up Exit checklist contains "[ ] Step 2.5 prior-loop compliance check produced a gap report".

### Design E — Naming convention enforcement via Consistency-perspective evaluator check

**Direction**: Add a row to `evaluation/SKILL.md § Coverage Ownership Matrix` (`evaluation/SKILL.md:103-110`) mapping the new cross-cutting concern "Memorization staging shape + naming" to **Consistency + Aesthetics** perspectives. The row text specifies what to verify: (a) per-finding `{slug}.md` files exist for every evaluation finding; (b) filenames match the kebab-case slug derived from the finding's primary symptom; (c) templates are stamped (frontmatter schema correct).

Cross-link from `memorization/SKILL.md § Path Conventions` (line 223-231) pointing at the matrix row for verification semantics.

**Rationale**: I8 establishes CLI lint is infeasible (no `packages/cli/src/`). Evaluator-perspective enforcement is the natural alternative — every loop's EVALUATION already runs the 7 perspectives; adding a seed scenario covering staging shape costs zero new infrastructure. Item D's Step 2.5 is the detection pass (caught at Wrap-up); item E is the evaluation-time signal (caught earlier, at every loop's EVALUATION).

**Anchored insight**: I8, I11.

**Alternative considered**: A bash one-liner in `wrap-up/SKILL.md` Step 2.5 (`grep -L 'mistake-candidate:' .../staging/decisions/*.md`) — **rejected** as too narrow; the matrix-row approach generalizes.

**Validation method**: After Execution, `grep -A1 "staging shape\|staging shape + naming" evaluation/SKILL.md` returns the new row text + perspective assignment.

### Design F — Glossary placement in `gobbi/SKILL.md`

**Direction**: Move the Glossary block (currently `gobbi/SKILL.md:15-29`) to a new position immediately **before** `## Workflow Overview` (currently line 128) and **after** § Session Bootstrap Order (ends ~ line 124). The Glossary becomes the orientation map a fresh manager reads after running the bootstrap, not before.

**Rationale**: A fresh manager's first need is to run the bootstrap (env vars + settings + project-memory check + workflow entry). Once bootstrapped, the manager benefits from the Glossary as a quick vocabulary anchor before entering the substantive workflow.

**Anchored insight**: I9.

**Validation method**: `awk '/^## Glossary/{a=NR}/^## Workflow Overview/{b=NR}/^## Session Bootstrap Order/{s=NR}END{print s, a, b}' gobbi/SKILL.md` shows Session Bootstrap Order line < Glossary line < Workflow Overview line.

### Design G — Drop legacy setup questions in `gobbi/SKILL.md § 4`

**Direction**: Rewrite Step 4 (`gobbi/SKILL.md:97-114`) from "Ask the user 2 setup questions" to "Ask the user 1 setup question + optional customize gate". Specifically:

- **Question 1 — mode** (NEW; not in current Step 4 but already in `orchestration/SKILL.md § Step 1` row 1): "Chat mode (you confirm at every gate) or Auto mode (manager proceeds without asking)?" Default Chat.
- **Question 2 — customize?**: "Use defaults for evaluation + git workflow + per-step settings, or customize?" Default "use defaults". If "customize", defer to `orchestration/SKILL.md § Step 1` row 2 (the existing per-section walk-through).
- **Remove**: Question 1 (evaluation mode) + Question 2 (git workflow mode) as standalone bootstrap questions.

The eval-mode and git-mode defaults move to `orchestration/templates/settings.default.json` (likely already there — verify in Execution).

**Rationale**: `orchestration/SKILL.md § Step 1` already encodes the "use defaults vs customize" pattern. The existing `gobbi/SKILL.md § 4` duplicates and partially overlaps that mechanism. Consolidating to a single mode-question + customize-gate path resolves the docs-sync drift.

**Note (concern 1 — resolved)**: There is NO `.claude/skills/orchestration/workflow/configuration.md` file in the current repo — `find .claude/skills/orchestration/workflow -name "configuration*"` returns empty. Configuration is documented inside `orchestration/SKILL.md § Step 1`. The original briefing's reference to `workflow/configuration.md` is replaced everywhere by `orchestration/SKILL.md § Step 1`.

**Anchored insight**: I10.

**Validation method**: `awk '/^### 4\./,/^### 5\./' gobbi/SKILL.md` returns ≤ 2 AskUserQuestion mentions (the mode question + the customize gate); zero mentions of "Always evaluate" / "Skip evaluation" / "Direct commit" / "Git workflow" as bootstrap-question options (those move to settings.json defaults).

---

## Decisions Log

Captured from DISCUSSION (see `sessions/.../ideation/rawdata/discussion-log.md`) plus this WORK phase plus the post-WORK iter1 user redirects (see `sessions/.../ideation/staging/decisions/iter1-user-redirects.md`).

| # | Topic | Decision | Source |
|---|---|---|---|
| 1 | Scope bundle | Bundle A (codex + memorization + polish) selected over codex-only or memorization-only. | discussion-log § Round 1 + Scope lock |
| 2 | Codex skill depth | Content-complete this session, not skeleton + follow-up. | discussion-log § Round 3 |
| 3 | Codex skill breadth | "Best practices for codex in claude code" (broad), not evaluator-spawn-specific. | discussion-log § Round 2 |
| 4 | Memorization pathology | γ + α (write-as-you-go + delegation hard gate). β (manager inline-bypass) conditional on evidence. | discussion-log § Round 2 |
| 5 | β evidence finding | β NOT observed last session — assistant agents WERE spawned for MEMORIZATION (per wrap-up session-final.md WORK Outputs table). The α failure was inside the spawn (Load Directives gap), not at the manager's choice to spawn. **Conclusion: β stays out of scope; γ + α suffice.** | I6 + Research |
| 6 | Wrap-up Step 2.5 | IN scope. | discussion-log § Round 2 |
| 7 | Step 2.5 escalation shape | **Hybrid: auto-backfill mechanical gaps inline (deterministic Type+Domain routing per `evaluation/SKILL.md § Finding Metadata`) + aggregate NEEDS_CONTEXT for judgment-required gaps (design_flaw routing-ambiguity, `disposition: open` user arbitration, multi-subdir spans).** Classification rules documented in `wrap-up/SKILL.md` for auditability. | iter1-user-redirects § Decision 1 (post-WORK user redirect) |
| 8 | Naming-convention enforcement vehicle | **Evaluator-perspective check** (Consistency + Aesthetics) via a new row in `evaluation/SKILL.md § Coverage Ownership Matrix`, **NOT** CLI lint (no `packages/cli/src/` exists). Step 2.5 (item D) carries the staging-shape detection at Wrap-up; Consistency seed scenario carries it at every loop's EVALUATION. | I8 + I11 |
| 9 | Polish 1-1 (Glossary placement) | Move Glossary to after § Session Bootstrap Order. | I9 |
| 10 | Polish 1-4 (setup-question reduction) | Reduce from 2 questions to 1 (mode) + customize gate; defaults flow from settings.json. Configuration's customize walk-through lives in `orchestration/SKILL.md § Step 1` row 2, NOT a `workflow/configuration.md` file (verified non-existent). | I10 + verified-not-exists |
| 11 | Deferrals (1-2, 1-3, 2-1, 2-2, 4-1, prior carry-forwards #1/#2/#4) | All explicitly out of scope. | discussion-log § Deferred |
| 12 | Configuration file path discrepancy (concern 1 — resolved) | Original brief referenced `orchestration/workflow/configuration.md` for item G; file does not exist (`find .claude/skills/orchestration/workflow -name "configuration*"` empty). **Substitute everywhere with `orchestration/SKILL.md § Step 1`.** Auto-resolved by deterministic `find` verification. | iter1-user-redirects § "Concerns resolved without user input" + this WORK |
| 13 | Provenance for item D | **Witness is concrete and empirical**: this session's `find /playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-22-bac669ad-.../execution/T*/staging` shows T2-T7 staging dirs contain zero files despite each task having full `evaluation/iter1/{claude,codex}/` content. The prior session's `handoff.md` § "What the Next Session Inherits" does NOT enumerate "Wrap-up Step 2.5 compliance check" as a numbered carry-forward — the briefing's earlier "carry-forward item #3" framing was loose. Provenance phrasing tightened per concern 6 resolution. | I12 + iter1-user-redirects § Concern 6 |
| 14 | Codex invocation priority (concern 5 — resolved + REDIRECT 1) | **`codex exec` via Bash is the UNIVERSAL primary pattern (manager AND subagents).** `codex:codex-rescue` plugin agent is the MANAGER-ONLY secondary pattern (subagents lack Agent tool per `.claude/agents/{leader,executor,evaluator,assistant}.md`). `/codex:adversarial-review` is the USER-ONLY tertiary pattern (`disable-model-invocation: true`). Empirical witness: the plugin agent itself declares `tools: Bash` and reduces to `codex exec` under the hood. | iter1-user-redirects § Decision 2 (post-WORK user redirect) + manager empirical investigation |
| 15 | Symlink direction (concern 4 — resolved) | **Source-of-truth at `.gobbi/projects/gobbi/skills/codex/SKILL.md`; symlink at `.claude/skills/codex/SKILL.md`** (pointing via `../../../.gobbi/projects/gobbi/skills/codex/SKILL.md`). Matches existing convention verified by `ls -la` on adjacent skill directories. | iter1-user-redirects § "Concerns resolved without user input" |

---

## Open Concerns / Items to flag (DONE_WITH_CONCERNS triggers)

**Status update (post-iter1 user redirect)**: Concerns 1, 2, 4, 5, 6 from the original iter1 list are RESOLVED — see Decisions Log rows 12, 7, 15, 14, 13 respectively. Only concern 3 remains, and it is a Planning-phase clarification (non-blocking for ideation evaluation).

1. **Item E's exact text for the new Coverage Ownership Matrix row** — proposed text is in Design E above; Planning/Execution should confirm the cell content with the user before editing `evaluation/SKILL.md`. (Original numbering: concern 3.)

---

## What's NOT covered (intentional)

- **Bundle internal sequencing for Planning.** Decomposition into Planning tasks is a Planning Loop concern, not Ideation. This draft enumerates the per-item file-level surface but does NOT specify which task ships first or any task-graph.
- **Exact wording of every edit.** Direction + anchored insight + validation method only; Execution writes the prose.
- **Test plan.** None of these edits are code; verification is a `grep`-based check per the validation methods enumerated.

End of draft-iter1 (post-redirect amendment).
