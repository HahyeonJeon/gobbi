---
name: gobbi-orchestration-workflow-improvements
description: "Bundle A — new `codex` skill (content-complete best-practices) + memorization moment-of-capture discipline (γ) + memorization delegation hard gate (α) + Wrap-up Step 2.5 prior-loop compliance check + naming-convention enforcement via Consistency-perspective evaluator check + two gobbi/SKILL.md polish edits (glossary placement; legacy setup-question reduction)."
phase: ideation
iter: 3
iter3_revised_at: 2026-05-23
verdict: pending
session-id: 2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068
loop: ideation
artifact_type: idea-draft
created_at: 2026-05-23
status: draft
feature: gobbi-orchestration-workflow-improvements
related:
  - sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/ideation/rawdata/discussion-log.md
  - sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/ideation/rawdata/draft-iter1.md
  - sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/ideation/rawdata/draft-iter2.md
  - sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/ideation/staging/decisions/iter1-user-redirects.md
  - sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/ideation/artifacts/idea.md
  - sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/wrap-up/artifacts/handoff.md
---

# Idea — Gobbi Orchestration + Workflow Improvements (Bundle A)

## Iter3 Changelog

Surgical fixes against aggregated iter2 EVALUATION findings (Claude 3 Critical + Codex 1 High). iter1 and iter2 files preserved at `draft-iter1.md` and `draft-iter2.md`. Each entry cites the originating finding ID.

| Change | Finding ID(s) | Where |
|---|---|---|
| **Finding-Type vocabulary regression repaired**: iter2 inverted the prior vocabulary error rather than fixing it (claimed the 5 Types are `improvement / bug / scenario_gap / checklist_gap / design_flaw`). Empirically re-verified `sed -n '344,352p' .gobbi/projects/gobbi/skills/evaluation/SKILL.md` — the actual 5 Types are: **`scenario_gap`, `checklist_gap`, `design_flaw`, `assumption_risk`, `general`**. The terms `improvement` and `bug` are NOT in the 5-Type set. Iter2 had 10 propagation sites using the wrong vocabulary (lines 32, 224, 307, 309, 363, 489, 506, 512, 570, 580). Mechanical mapping applied: `improvement` → `general`; `bug` → `assumption_risk`. Re-spec of `mechanical` vs `judgment-required` classification: **mechanical Type set = `{scenario_gap, checklist_gap, general}`** (deterministic routing under § Complete Domain → staging destination routing); **judgment-required Type set = `{design_flaw, assumption_risk}`** (inherently adversarial / arbitration-required by Type definition). | Claude STRUCT-Critical (perspective-Structure), Claude CONS-Critical, Claude RISK-Critical, Codex STRUCT-High (COD-STRUCT-001 carried) | Iter2-Changelog row 3 (this row's antecedent); Decisions Log row 7 (updated); Design D § Step 2.5 specification "Classify each gap" subsection; Implementation Checklist row 8; Scenarios § Edge "Wrap-up detects a prior-loop staging gap" + § Adversarial "Memorization silently skipped"; Research Insight I11; Decisions Log row 17 (recap) |
| **`.agents/skills` directory-symlink count corrected**: iter2 claimed 17 entries; empirical `ls /playinganalytics/git/gobbi/.agents/skills/ \| wc -l` returns **16**. Sixteen symlinks enumerated: delegation, discussion, evaluation, execution, git, gobbi, ideation, interview, memorization, mistake, orchestration, planning, preparation, principles, research, wrap-up. The new `codex` symlink (Decisions Log row 15 / I14) brings the count to 17 only after the bundle ships; pre-bundle baseline is 16. | Codex STRUCT-High (count check) | Iter2-Changelog row 2; Scope Contract § In-Scope row A; Research Insight I14; Implementation Checklist row 2; Design A § Symlink direction; Decisions Log row 15 |
| **Cross-link manifest phantom anchor (#6) corrected**: iter2 cross-link manifest item #6 cited `evaluation/SKILL.md § Staging routing` — no such heading exists. The actual heading is `### Complete Domain → staging destination routing (general Type)` at `evaluation/SKILL.md:356`. All four occurrences of the phantom `§ Staging routing` anchor (iter2 lines 309, 489, 504, 594) replaced with the correct heading reference. Also affects Design D § Step 2.5 spec wording and the mechanical-routing source description. | Claude STRUCT-Critical (cross-link manifest), F-CLAUDE-S-02 follow-up | Cross-link manifest item #6; Design D § Step 2.5 Step 4 (mechanical classification); Design D § classification-audit-trail clause; Scenarios § Edge "Wrap-up detects a prior-loop staging gap" |
| **`.claude/CLAUDE.md:50` citation re-verified** (F-CLAUDE-U-02 partial): iter2 cites `.claude/CLAUDE.md:50` for the mistake-discipline rule. Empirical `sed -n '50p' /playinganalytics/git/gobbi/.claude/CLAUDE.md` returns the paragraph beginning "Every agent MUST load the `mistake` skill before starting work. When the user corrects any approach, immediately record it as a mistake in `.gobbi/projects/{name}/mistakes/`. After the session ends, run `gobbi mistake promote` to promote corrections to permanent workspace-level skill storage — promotion does not cause context reload. **A correction not recorded is a correction repeated across sessions. Mistakes are the highest-value knowledge in this system.**" The citation is **verbatim accurate** — no change required to the line number. This row documents the iter3 verification (no-op confirmation). | F-CLAUDE-U-02 (re-verification only) | Scope Contract § Success Criteria #8; Framed Problem § Impact |

**Scope of iter3**: surgical fixes only — no new design directions, no new sections, no re-derivation. Most of iter2's prose is verbatim. iter2 file preserved at `draft-iter2.md`.

---

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
| A | New `codex` skill — content-complete best-practices for Codex in Claude Code. Covers invocation patterns (universal `codex exec` via Bash first; manager-only `codex:codex-rescue` plugin agent second; user-only `/codex:adversarial-review` slash command third), sandbox semantics (`read-only` / `workspace-write` / `danger-full-access`), CWD + worktree path discipline, hang/timeout patterns, dual-system evaluator-spawn as **one** documented use case. | Source-of-truth at `.gobbi/projects/gobbi/skills/codex/SKILL.md` (new); **two** symlinks: `.claude/skills/codex/SKILL.md` (Claude Code surface) AND `.agents/skills/codex` directory symlink (Codex surface, matching existing **16-entry** pattern at `.agents/skills/`; the codex symlink brings the count to 17 post-ship); `gobbi/SKILL.md § Skill Map` row added (cross-cutting). |
| B | Memorization moment-of-capture discipline (pathology γ — write-as-you-go). Corrections, decisions, and mistake-candidates are noted at moment-of-occurrence during WORK, not deferred to MEMORIZATION. | `memorization/SKILL.md` (procedure section adds a "moment-of-capture" Core Principle pointing at `mistake/SKILL.md` P2); `mistake/SKILL.md` (P2 wording made stronger and links to memorization's MEMORIZATION-phase staging); leader / executor / assistant agent specs link the same. |
| C | Memorization delegation hard gate (pathology α — every MEMORIZATION dispatch loads `memorization/SKILL.md` in Load Directives). | `delegation/SKILL.md` (Load Directives section adds a phase→required-skill table row stating MEMORIZATION dispatches MUST list `memorization/SKILL.md` in Load Directives Skills tier); per-role templates under `delegation/templates/` cross-checked. |
| D | Wrap-up Step 2.5 — prior-loop MEMORIZATION compliance check. Between Wrap-up WORK Step 2 (staging inventory) and Step 3 (feature destination), insert a compliance gate that scans each prior loop's `rawdata/` and `staging/` for shape conformance, **classifies each gap as `mechanical` (deterministic routing → auto-backfill inline) or `judgment-required` (design/decision arbitration → aggregate into NEEDS_CONTEXT)**. Auto-backfill respects `evaluation/SKILL.md § Slug + collision policy`. | `wrap-up/SKILL.md` (insert "Step 2.5 — Prior-loop memorization compliance check" between current Steps 2 and 3; document gap classification rules; update Exit checklist + Constraints). |
| E | Naming-convention enforcement vehicle. Codify enforcement via the **Consistency evaluator perspective** at the MEMORIZATION-output evaluation step (not a CLI lint — no `packages/cli/` source exists in the current repo state). | `evaluation/SKILL.md § Coverage Ownership Matrix` (add a "Memorization staging shape + naming" row pointing at Consistency + Aesthetics); `memorization/SKILL.md` (cross-link from naming-convention section). |
| F | Polish 1-1 — move the `## Glossary` section in `gobbi/SKILL.md` from its current position (currently between Introduction and § Session Bootstrap Order at line 15) to **after** § Session Bootstrap Order so the actionable bootstrap appears first to a fresh reader. | `gobbi/SKILL.md` (1 Edit). |
| G | Polish 1-4 — drop legacy setup questions in the bootstrap flow. Eval-mode + git-mode are removed from the bootstrap prompts (Step 4 in `gobbi/SKILL.md`) and become settings.json defaults; bootstrap asks only the **mode** (chat/auto, default auto per existing settings) and optionally "customize defaults?" | `gobbi/SKILL.md § 4. Ask the user 2 setup questions` rewritten (becomes "Ask 1 setup question + optional customize gate"); `orchestration/SKILL.md § Step 1 — Workflow Configuration` row 1 + row 2 confirmed already match this shape; `orchestration/templates/settings.default.json` carries the defaults that previously came from the questions (verified: `.mode = "auto"`, `.workflow.ideation.evaluate.mode = "always"`, `.git.pr = {open: false, draft: false}`). **NOTE**: there is NO `orchestration/workflow/configuration.md` file in the current repo (`find .claude/skills/orchestration/workflow -name "configuration*"` returns empty) — Configuration is documented inside `orchestration/SKILL.md § Step 1`. The original brief's reference to `workflow/configuration.md` is replaced by `orchestration/SKILL.md § Step 1`. |

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
- Changing `settings.default.json` mode default — out of scope; the existing `"mode": "auto"` is retained and is the default Question 1 now reports.

### Decisions Locked (in DISCUSSION before WORK entered — see discussion-log)

- **Bundle A only**: codex + memorization + polish; no codex-only or memorization-only deliverables this session.
- **Content-complete codex skill** (not skeleton + follow-up).
- **Codex skill scope is broad** — best practices for codex in claude code, not evaluator-spawn-only.
- **Codex invocation priority** (post-iter1 user redirect, see `iter1-user-redirects.md` § Decision 2): `codex exec` via Bash is the **universal primary pattern** for both manager AND subagents; `codex:codex-rescue` plugin agent is the **manager-only secondary pattern** (subagents lack the Agent tool); `/codex:adversarial-review` is the **user-only tertiary pattern** (`disable-model-invocation: true`).
- **Memorization fix uses γ + α** (write-as-you-go + delegation hard gate). β not in scope unless evidence found this iteration.
- **Wrap-up Step 2.5 in scope** (motivator: empirical T1/T2/T5 memorization-gap + T3/T4/T6/T7 eval-also-skipped both observed this session — see Research Insights § I6 + I12).
- **Wrap-up Step 2.5 escalation shape** (post-iter1 user redirect, see `iter1-user-redirects.md` § Decision 1): **hybrid** — auto-backfill mechanical gaps inline (deterministic Type+Domain routing using the actual 5 Types from `evaluation/SKILL.md`) with `evaluation/SKILL.md § Slug + collision policy` pre-write check; NEEDS_CONTEXT only for judgment-required gaps.
- **No re-opening** of 1-2 / 1-3 / 2-1 / 2-2 / 4-1.

### Success Criteria

1. `.gobbi/projects/gobbi/skills/codex/SKILL.md` exists (source-of-truth); `.claude/skills/codex/SKILL.md` is a file symlink pointing at it; `.agents/skills/codex` is a directory symlink at `.agents/skills/codex -> ../../.gobbi/projects/gobbi/skills/codex` matching the existing 16-entry pattern (codex addition brings the count to 17 post-ship); the skill is loaded under `gobbi/SKILL.md § Skill Map`, and covers (a) **invocation patterns in priority order**: (i) `codex exec` via Bash as the universal pattern, (ii) `Agent(subagent_type="codex:codex-rescue", ...)` as the manager-only convenience pattern, (iii) `/codex:adversarial-review` as the user-only pattern; (b) sandbox modes + selection rubric; (c) CWD / worktree absolute-path discipline citing `codex-eval-session-write-path-nested-in-worktree.md` + a `find` post-eval sanity check; (d) hang patterns + recommended foreground/background discipline; (e) dual-system evaluator-spawn as one cited use case, showing BOTH the manager-spawn `codex:codex-rescue` pattern AND the subagent-call `codex exec` pattern; (f) explicit "Why subagents must use `codex exec`" subsection with the empirical tool-surface witness; (g) cost / budget awareness subsection.
2. `memorization/SKILL.md` has a Core Principle "Moment-of-capture, not end-of-loop" with explicit anchor to `mistake/SKILL.md` P2; `mistake/SKILL.md` P2 reciprocally points back.
3. Every `delegation/templates/{leader,executor,evaluator,assistant}.md` template carries an explicit Load Directives entry that triggers `memorization/SKILL.md` whenever the dispatched phase includes MEMORIZATION-equivalent work. The `delegation/SKILL.md` Core Principles section names the gate explicitly.
4. `wrap-up/SKILL.md` carries a numbered Step 2.5 with: (a) inputs (prior loops' rawdata + staging dirs), (b) scan procedure, (c) gap-classification table (zero-staging, naming-shape, missing-template, **directory-absent**) with each gap categorized as `mechanical` or `judgment-required`, (d) auto-backfill mechanism with `evaluation/SKILL.md § Slug + collision policy` pre-write check, (e) NEEDS_CONTEXT trigger + `user-question:` shape for aggregated judgment-required gaps, (f) audit trail (gap report appended to `rawdata/promotion-manifest.md`).
5. `evaluation/SKILL.md § Coverage Ownership Matrix` carries the new "Memorization staging shape + naming" row.
6. `gobbi/SKILL.md` has Glossary below Session Bootstrap Order; Step 4 asks one mode question (default **auto**, matching `orchestration/templates/settings.default.json:3`) + optional customize gate (eval-mode + git-mode removed from bootstrap prompts and confirmed as settings.json defaults).
7. No `packages/cli/` writes (confirmed not present in repo).
8. User has pre-approved the 7-item scope via DISCUSSION lock (see `discussion-log.md` § Scope lock + `iter1-user-redirects.md`); the bundle respects the mistake-discipline rule per `.claude/CLAUDE.md:50` ("Every agent MUST load the `mistake` skill before starting work. When the user corrects any approach, immediately record it as a mistake in `.gobbi/projects/{name}/mistakes/`").
9. Codex skill cites empirically-grounded sandbox claims (codex CLI `codex exec --help` output) with file/line refs.

### Deferred

- Pathology β (manager inline-bypass) — re-open only if Wrap-up Step 2.5 detects it in a future session.
- CLI lint enforcement for naming convention — wait until a `packages/cli/src/` exists (currently absent — see Research Insights § Infrastructure baseline).
- session.json subagent tokensUsed instrumentation — needs hook-token-access feasibility check.
- Worktree-first session architecture — needs failure-mode reproduction.
- Auto-mode silence semantics — needs coupling to memorization fix outcome.
- Hangcheck heuristic / timeout (e.g., `timeout 600 codex exec ...`) — research surfaced no built-in timeout; recommendation belongs in codex skill but is a procedural guidance, not an implemented helper.
- `settings.default.json` mode-default change (if desired in future) — separate session.

---

## Framed Problem

### Root cause

Four behavioral discipline gaps in gobbi's orchestration + workflow layer compounded across last session:

1. **No canonical codex usage anchor.** `codex:codex-rescue` is a thin forwarder (`~/.claude/plugins/cache/openai-codex/codex/1.0.2/agents/codex-rescue.md:9-13`); `codex-cli-runtime` (`~/.claude/plugins/cache/openai-codex/codex/1.0.2/skills/codex-cli-runtime/SKILL.md:1-43`) is an internal helper contract marked `user-invocable: false`. Neither tells the **gobbi manager** how to invoke codex for evaluator spawns, how to handle sandbox + CWD, or how to detect hangs. As a result, the codex-eval session-write-path mistake (`.gobbi/projects/gobbi/mistakes/codex-eval-session-write-path-nested-in-worktree.md:19-22`) happened — the manager's delegation prompt lacked an explicit absolute-path mandate. Evidence: 16 codex eval directories spawned in last session and the codex evaluator wrote to `worktrees/.../sessions/...` instead of the main-tree absolute path.

2. **Memorization runs late, unloaded, and the staging discipline is not enforced.** Empirically last session (`2026-05-22-bac669ad`), per `find sessions/.../execution/T*/evaluation -type f | wc -l` (re-verified iter2):
   - T1 = 8 eval files, T2 = 13, T5 = 9 — **full evaluations, but staging directories empty/absent** → memorization gap (γ + α).
   - T3 = 3, T4 = 2, T6 = 2, T7 = 2 — **partial evaluations AND staging directories empty/absent** → eval-also-skipped (separate problem; β/discipline failure further upstream).
   - The witness for items B + C (γ + α memorization fix) is the **T1/T2/T5** loops where the evaluator did its job and produced 8/13/9 findings respectively, but those findings never reached staging. This is the cleanest empirical proof of the memorization-skip pathology.
   - The T3/T4/T6/T7 loops are a separate witness for item D (Wrap-up Step 2.5 detection): even when evaluation is partial, the gap should not be silent.
   - The MEMORIZATION-phase staging discipline (per `memorization/SKILL.md:144-166`) was not executed for any of T1-T7. Two distinct pathologies:
     - **γ (write-as-you-go)** — corrections noted in transcript during DISCUSSION are not staged at moment-of-occurrence; they leak to MEMORIZATION which runs without them.
     - **α (delegation hard gate)** — when MEMORIZATION was delegated, the dispatch prompt did not include `memorization/SKILL.md` in Load Directives; the assistant skipped the staging step because it didn't load the staging procedure.

3. **Wrap-up never re-validates prior-loop output shapes.** `wrap-up/SKILL.md` WORK Steps 2-4 (`wrap-up/SKILL.md:135-140`) enumerate staging files but **assume** prior loops' MEMORIZATION discipline was clean. Last session's empty execution T1-T7 staging dirs (with T2 and T3 staging *directories absent entirely*, not just empty) prove the assumption is unsafe. A prior-loop compliance check between Step 2 and Step 3 would catch this and either backfill or escalate.

4. **Naming convention exists but has no enforcement vehicle.** `memorization/SKILL.md` Memory Access Matrix (`memorization/SKILL.md:36-46`) and Path Conventions block (`memorization/SKILL.md:223-231`) define the staging path naming convention. Last session's filename inconsistencies (e.g., `ideation/staging/decisions/ideation-decisions.md` — single bulk file vs the prescribed per-finding `{slug}.md` template) violate it. There is no automated check; with `packages/cli/src/` absent, a CLI lint is infeasible. The **Consistency** evaluator perspective (`evaluation/SKILL.md:92` lines: "Did everything that should change together, change together? Code ↔ docs ↔ tests ↔ types ↔ comments ↔ indexes — are they synchronized?") plus the **Aesthetics** perspective (`evaluation/SKILL.md:90` lines: "Does it follow project naming / formatting conventions?") are the natural enforcement seam — but they need an explicit seed scenario referencing the memorization path conventions.

The 1-1 + 1-4 polish items are independently witnessed: 1-1 by user observation during bootstrap (Glossary appears mid-skill before users have seen the workflow); 1-4 by the existing `orchestration/SKILL.md:98-99` already documenting Configuration Step 1 row 1/2 with the "use defaults vs customize" gate — the redundant Step 4 setup questions in `gobbi/SKILL.md:99-114` duplicate work that's already settings-driven.

### Impact

- **Who is affected**: every future gobbi session that spawns codex evaluators, runs MEMORIZATION, or relies on Wrap-up to promote findings. The user (`@HahyeonJeon`) explicitly raised this — last session's findings were silently lost across T1/T2/T5 (full evals, empty staging) and T3/T4/T6/T7 (partial evals, empty staging) because staging never ran.
- **Severity**: medium-high. Lost findings degrade the system's promise (a correction not recorded is repeated across sessions — `.claude/CLAUDE.md:50`). Codex sandbox + path mistakes cause real cleanup work (last session: `rm -rf` violation recovery via `git restore`).
- **Cost of inaction**: every future session repeats T1-T7 staging gaps; codex invocations continue to write to wrong paths; Wrap-up promotion-manifest accuracy degrades over time; naming convention drift accumulates silently.

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
Why it applies: The codex skill must encode the absolute-path-mandate rule explicitly: every codex delegation prompt that involves session writes must carry the main-tree absolute path `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/{session-id}/...`. This is `mistakes/codex-eval-session-write-path-nested-in-worktree.md`'s § Corrected approach made into a positive skill rule. The mistake file lists THREE correctives: (1) explicit absolute-path mandate in delegation prompt, (2) `--cd` set to main-tree absolute, (3) **post-eval `find` sanity check** confirming files landed at the correct path. The codex skill encodes all three.

**I5 — Codex CLI has no built-in timeout flag for `codex exec`.**
Source: `codex exec --help` enumerated 100+ flags; no `--timeout` flag. Companion script `codex-companion.mjs` calls `runAppServerTurn(cwd, options)` (line 891 area) without an explicit timeout — `DEFAULT_STATUS_WAIT_TIMEOUT_MS = 240000` (4 minutes) in `codex-companion.mjs:64` is a **status poll** timeout, not a hard execution cap.
Insight: There is no first-class hang-detection. The plugin uses background mode + `/codex:status` polling for long-running invocations (`commands/adversarial-review.md:31-32` recommends background when scope is wider than 1-2 files). For raw `codex exec`, shell `timeout` is the only mechanism: `timeout 600 codex exec --json ...`. For codex-rescue invocations, the recommendation is foreground for clearly-bounded asks, background otherwise (`agents/codex-rescue.md:24`).
Why it applies: The codex skill's hang-detection section must say (a) there is no built-in timeout, (b) use foreground only for clearly-bounded rescue tasks, (c) use background for anything wider, (d) when shelling out raw, wrap in `timeout` with a generous ceiling.

**I6 — Memorization staging discipline is documented but unenforced last session (refined witness per iter2 re-verification).**
Source: empirical `find /playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/execution/T{1..7}/evaluation -type f | wc -l` returns 8, 13, 3, 2, 9, 2, 2 respectively for T1-T7. Cross-checked against staging directories which are either empty (T1, T4, T5, T6, T7) or absent (T2, T3). All 7 execution tasks have populated `evaluation/iter*/{claude,codex}/` files in some quantity, but T1 (8 files), T2 (13 files), T5 (9 files) are the cleanest witnesses — **full evaluations existed; staging never ran**. T3/T4/T6/T7 are a separate, more severe witness — **partial evaluations AND no staging**.
Why it applies: This is the empirical witness for the γ + α memorization fix in items B + C. The fix shape: **moment-of-capture** (write as you go, don't defer; γ) + **delegation hard gate** (every MEMORIZATION dispatch loads `memorization/SKILL.md`; α). β (manager inline-bypass) is NOT witnessed — the manager DID spawn assistant agents for MEMORIZATION (subagents are referenced in the session-final.md WORK Outputs table); the failure was inside the spawn (assistant didn't load the staging skill and didn't run the staging procedure). The witness refinement matters: iter1 conflated "T2-T7 had full evals" — actually only T1/T2/T5 had full evals; T3/T4/T6/T7 had partial evals which is a separate problem class that further motivates item D detection.

**I7 — Wrap-up has no prior-loop compliance check between staging-inventory and routing.**
Source: `wrap-up/SKILL.md:134-143` shows 7 sequential WORK steps. Step 2 builds staging inventory; Step 4 applies routing table; nothing between them validates that the inventory **is what the prior loops should have produced**. The empirical T1-T7 staging gap from last session would not be caught — wrap-up sees 0 staging files for T6 and dutifully promotes 0 files, producing a clean promotion-manifest entry "T6 — 0 files staged" that hides the data loss.
Why it applies: A new Step 2.5 — "Prior-loop memorization compliance check" — slots between Step 2 (inventory) and Step 3 (feature destination). It scans each prior loop's evaluation findings count vs staging files count; ratio gaps are classified as `mechanical` (auto-backfill, respecting `evaluation/SKILL.md § Slug + collision policy`) or `judgment-required` (NEEDS_CONTEXT).

**I8 — No `packages/cli/src/` source tree in current repo state.**
Source: `ls /playinganalytics/git/gobbi/packages/cli/src/` exits 2 (No such file or directory). Cross-checked with project memory note from `MEMORY.md` lines about v0.5.0 redesign Phases 4-10 indicating the CLI was redesigned multiple times and the current tree may be in a different layout.
Why it applies: Item E (naming-convention enforcement) cannot use a CLI lint vehicle — there is no CLI source to extend. The only available vehicle is an **evaluator-perspective check** (Consistency + Aesthetics seed scenarios) at the MEMORIZATION-output evaluation gate, or a hard gate inside `wrap-up/SKILL.md` Step 2.5 (item D). The bundle is more coherent if E rides on D (Step 2.5 runs a naming-shape check) plus a Consistency-perspective seed scenario at the MEMORIZATION evaluation step.

**I9 — `gobbi/SKILL.md` Glossary appears at line 15-29, before § Session Bootstrap Order (line 32).**
Source: `gobbi/SKILL.md:15-29` (Glossary table) followed by `gobbi/SKILL.md:32-124` (Session Bootstrap Order).
Why it applies: Item F asks the Glossary to move below Session Bootstrap Order so the actionable bootstrap is the first content a fresh manager reads.

**I10 — `gobbi/SKILL.md` Step 4 asks 2 questions (eval-mode + git-workflow-mode); `orchestration/SKILL.md` Step 1 row 1-2 (lines 98-99) already encodes a "use defaults vs customize" pattern; settings defaults verified empirically.**
Source: `gobbi/SKILL.md:99-114` (Question 1 + Question 2 sections) vs `orchestration/SKILL.md:98-99` (rows 1-2: "use defaults as-is, or customize?" → "walk through each section via AskUserQuestion to collect overrides"). Verified `jq '.mode, .workflow.ideation.evaluate.mode, .git.pr' .gobbi/projects/gobbi/skills/orchestration/templates/settings.default.json` returns `"auto"`, `"always"`, `{"open": false, "draft": false}`.
Why it applies: Item G consolidates — Step 4 drops the explicit eval-mode + git-mode questions; defaults flow from settings.json (verified existing); the customize gate (already in Configuration Step 1 row 1) covers overrides. `find .claude/skills/orchestration/workflow -name "configuration*"` returns empty — there is **no** `orchestration/workflow/configuration.md`; Configuration is documented inside `orchestration/SKILL.md § Step 1`. Question 1 default value is **auto** (matches settings).

**I11 — `evaluation/SKILL.md § Coverage Ownership Matrix` is the canonical seam for cross-cutting concern → perspective mapping. § Finding Metadata (lines 329-385) defines the actual 5-Type vocabulary used by routing; § Slug + collision policy (lines 385-393) defines idempotent staging writes.**
Source: `evaluation/SKILL.md:98-110` ("Cross-cutting concerns that have no obvious single owner are assigned to specific perspectives **as required seed coverage** to prevent silent omission."). Privacy → Risk + Consistency; Licensing → Risk + Consistency; Dependency supply chain → Risk + Structure; Observability → Structure + Usage; etc. The 5-Type vocabulary at `evaluation/SKILL.md:344-352` enumerates: **`scenario_gap`, `checklist_gap`, `design_flaw`, `assumption_risk`, `general`** (re-verified iter3 via `sed -n '344,352p'`). The `general` Type routes by Domain per the table at `evaluation/SKILL.md:356` (`### Complete Domain → staging destination routing (general Type)`). The Slug + collision policy at `evaluation/SKILL.md:385-393` requires stable `finding-id`, pre-write check, same-id overwrite, different-id suffix disambiguation, cross-loop loop-name suffix.
Why it applies: Item E adds one row: "Memorization staging shape + naming → Consistency + Aesthetics" so every evaluator at Stage 1 must include a seed scenario testing staging filename/template conformance. Item D's auto-backfill uses the actual 5-Type set (`scenario_gap`, `checklist_gap`, `design_flaw`, `assumption_risk`, `general`) and the Slug + collision policy as the deterministic-routing source-of-truth. `design_flaw` and `assumption_risk` are inherently adversarial / judgment-required by Type definition; only `scenario_gap`, `checklist_gap`, and `general` (with a single Domain value) qualify as mechanical.

**I12 — Item D's witness is the empirical T1-T7 staging gap observed this session, refined for precision.**
Source: re-verified `find /playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-22-bac669ad-.../execution/T*/evaluation -type f | wc -l` returns 8/13/3/2/9/2/2 for T1-T7. Staging directories either empty or absent across all 7. The prior session's `wrap-up/artifacts/handoff.md` § "What the Next Session Inherits" (lines 106-119) does NOT enumerate "Wrap-up Step 2.5 compliance check" as a numbered carry-forward — the manager's earlier "carry-forward item #3" framing was loose.
Why it applies: Honesty about provenance. Item D's witness is the concrete empirical staging gap split across two pathology classes: (a) T1/T2/T5 had full eval + empty/absent staging → pure memorization-skip (item D detects, items B+C prevent); (b) T3/T4/T6/T7 had partial eval + empty/absent staging → eval-also-skipped (item D detects, but root cause is upstream and may need separate follow-up).

**I13 — Subagent role specs (`.claude/agents/{leader,executor,evaluator,assistant}.md`) lack the Agent tool; only `.claude/agents/manager.md` has `tools: "*"`.**
Source: `.claude/agents/manager.md` frontmatter `tools: "*"` + `.claude/agents/leader.md` / `executor.md` / `evaluator.md` / `assistant.md` frontmatter explicitly enumerating tool lists that omit `Agent`. `~/.claude/plugins/cache/openai-codex/codex/1.0.2/agents/codex-rescue.md` itself declares `tools: Bash` — even the plugin agent is a thin Bash wrapper around `codex exec`.
Insight: Subagents in gobbi **cannot** spawn the `codex:codex-rescue` plugin agent because that requires the Agent tool. The codex plugin agent's own implementation reduces to `codex exec` via Bash. Therefore the universal lowest-common-denominator invocation pattern — usable by manager AND subagents — is **`codex exec` via Bash**.
Why it applies: Restructures Design A — `codex exec` via Bash must be documented as the **primary** universal pattern; plugin-agent spawn is a manager-only convenience that itself reduces to `codex exec`. This empirically resolves the user's open question ("there were some blocks") from `iter1-user-redirects.md § Decision 2`.

**I14 (REFINED iter3) — `.agents/skills/` is the codex-side mirror of `.claude/skills/`, populated with directory symlinks into `.gobbi/projects/gobbi/skills/`.**
Source: `ls /playinganalytics/git/gobbi/.agents/skills/ | wc -l` returns **16** (re-verified iter3 — iter2 incorrectly stated 17). The 16 entries: `delegation, discussion, evaluation, execution, git, gobbi, ideation, interview, memorization, mistake, orchestration, planning, preparation, principles, research, wrap-up`. Every one a directory symlink of the form `<skill-name> -> ../../.gobbi/projects/gobbi/skills/<skill-name>`. The pattern is uniform.
Why it applies: For the new codex skill to be loadable **by codex itself** (the eat-your-own-dogfood principle), the source-of-truth directory at `.gobbi/projects/gobbi/skills/codex/` requires a `.agents/skills/codex -> ../../.gobbi/projects/gobbi/skills/codex` directory symlink alongside the `.claude/skills/codex/SKILL.md` file symlink. A codex skill that codex itself can't load is a contradiction the bundle must not ship. The bundle's shipping adds one symlink, bringing the count from 16 → 17. Item A is updated to require **both** symlinks (Decisions Log row 15 amended).

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
5. After codex completes, the manager runs the post-eval `find` sanity check: `find /playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/{session-id} -newer <recent-marker> -type f` to verify files landed at the main-tree absolute path, not the worktree.
6. **No path mistake** because the absolute path was inline-pasted (or `--cd` was set to the main-tree absolute) AND verified post-hoc. (Anchored to I4 + E2 + I13 + mistake file corrective #3.)

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
5. Codex's write completes at the correct main-tree path. If sandbox refuses (workspace-write sandbox confined to the wrong subtree), codex returns NEEDS_CONTEXT and the manager runs a manager-proxy write.
6. Post-eval `find` sanity check confirms files at main-tree path (no worktree nesting). (Anchored to I4 + E2 + `mistakes/codex-eval-session-write-path-nested-in-worktree.md`.)

### Edge — Wrap-up detects a prior-loop staging gap (refined per iter3 finding-Type vocabulary)

1. Wrap-up WORK Step 2 enumerates staging inventory. Execution T3 has 0 staging files but `evaluation/iter1/{claude,codex}/` has 3 findings.
2. Wrap-up WORK Step 2.5 (new) detects the gap and **classifies each finding** as `mechanical` or `judgment-required` per the classification rules (item D's specification using the actual 5 Types from `evaluation/SKILL.md:344-352`: `scenario_gap`, `checklist_gap`, `design_flaw`, `assumption_risk`, `general`).
3. Per item D's hybrid escalation shape:
   - **Mechanical findings** (finding's `Type` ∈ {`scenario_gap`, `checklist_gap`, `general`} + single `Domain` value that routes deterministically per `evaluation/SKILL.md § Complete Domain → staging destination routing (general Type)` at line 356) → Step 2.5 auto-writes the staging file from the finding's content **inline**, applying `evaluation/SKILL.md § Slug + collision policy` pre-write check (compute slug; check for existing file at destination; if same `finding-id`, overwrite; if different `finding-id`, disambiguate with `-2`, `-3` numeric suffix; record disambiguation in `rawdata/promotion-manifest.md`). No user gate.
   - **Judgment-required findings** (`Type` ∈ {`design_flaw`, `assumption_risk`} — these Types are inherently adversarial / arbitration-required by definition; OR `disposition: open` requiring user arbitration; OR `Type`/`Domain` missing/unrecognized) → aggregated into a single NEEDS_CONTEXT surfacing with a `user-question:` block.
4. Wrap-up resumes Step 3 with mechanically-backfilled staging present and judgment-required gaps either resolved by the user or explicitly documented. (Anchored to I7 + I11 + iter1 user redirect § Decision 1.)

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
2. Per item D's Step 2.5 (new), Wrap-up later detects the staging gap and classifies it. For purely-mechanical gaps (deterministic routing using the actual 5 Types — `scenario_gap` / `checklist_gap` / `general`), Step 2.5 auto-backfills inline with the Slug + collision policy pre-write check. For judgment-required gaps (`design_flaw` / `assumption_risk` / open-disposition / missing-metadata), Step 2.5 surfaces a single NEEDS_CONTEXT.
3. Either way, the gap is no longer silent. The regression itself (delegation Load Directives omission) becomes a `mistake-candidate` in the next session.
4. Item C is preventive; item D is detective (with hybrid auto-fix for mechanical cases). Both are needed because regressions happen. (Anchored to I6 + I7.)

### Adversarial — Naming convention drift: someone bulk-stages findings into `ideation-decisions.md` instead of per-finding `{slug}.md`

1. Memorization assistant writes one bulk file `staging/decisions/ideation-decisions.md` instead of per-finding files.
2. Wrap-up Step 2.5 (item D) detects the shape mismatch — single bulk file with > 1 finding-id frontmatter is a violation. Shape gap is classified as `judgment-required` (splitting a bulk file is not a deterministic operation; user must confirm split boundaries when finding-ids aren't clean).
3. EVALUATION of WRAP-UP runs with the new Consistency seed scenario (item E): "Did staging filenames follow `{slug}.md` per finding-id, or were findings bulk-coalesced?" Finding is raised; verdict REVISE; bulk file is split before promotion. (Anchored to I11.)

### Adversarial — Codex skill ships missing `.agents/skills/codex` symlink → codex itself can't load the skill

1. Bundle A ships the codex skill with only the Claude-side symlink (`.claude/skills/codex/SKILL.md`).
2. Manager later asks codex (via `codex exec` or `codex:codex-rescue`) to consult the codex best-practices skill before performing a sensitive operation.
3. Codex looks under `.agents/skills/codex` (per its own skill-load convention) — directory absent. Codex falls back to its default (potentially conflicting) behavior. The dogfood promise breaks.
4. Per item A's amended deliverable surface (Decisions Log row 15), the bundle ships BOTH symlinks: `.claude/skills/codex/SKILL.md` AND `.agents/skills/codex` directory symlink. Adversarial path is closed. (Anchored to I14.)

---

## Implementation Checklist

Each item maps to a specific design decision and a confirmed insight.

| # | Checklist item | Anchored insight | Validation method |
|---|---|---|---|
| 1 | Create `.gobbi/projects/gobbi/skills/codex/SKILL.md` (source-of-truth) with frontmatter (name, description, allowed-tools), **8 H2 sections**: (1) When to load, (2) Invocation patterns — `codex exec` first / plugin agent second / slash command third, (3) Why subagents must use `codex exec`, (4) Sandbox + CWD discipline, (5) Hang + timeout discipline, (6) Use cases (incl. evaluator-spawn + subagent second-opinion + post-eval `find` sanity check), (7) Cost + sandbox budget awareness, (8) Anti-patterns. Plus Constraints block. | I1, I2, I3, I4, I5, I13, I14, E1, E2 | `grep -c "^## " .gobbi/projects/gobbi/skills/codex/SKILL.md` returns 8; `find . -name SKILL.md -path '*/skills/codex/*'` returns the source file |
| 2 | Create **two symlinks** for the codex skill: (a) file-level `.claude/skills/codex/SKILL.md -> ../../../.gobbi/projects/gobbi/skills/codex/SKILL.md` (Claude Code surface); (b) directory-level `.agents/skills/codex -> ../../.gobbi/projects/gobbi/skills/codex` (Codex surface, matching the existing 16-entry pattern verified via `ls /playinganalytics/git/gobbi/.agents/skills/ \| wc -l` returning 16; codex addition brings the count to 17 post-ship). | docs-sync hygiene + I14 | `ls -la .claude/skills/codex/SKILL.md` shows file symlink; `ls -la .agents/skills/codex` shows directory symlink pointing into `.gobbi/projects/gobbi/skills/codex` |
| 3 | Add a row to `gobbi/SKILL.md § Skill Map § Cross-cutting skills` for `codex` (one-liner: "Codex CLI / plugin best practices — `codex exec` (universal) / `codex:codex-rescue` (manager-only) / `/codex:adversarial-review` (user-only) invocation patterns; sandbox + CWD discipline; hang detection."). | I1, I13 | `grep "codex" gobbi/SKILL.md` returns the new row |
| 4 | Edit `memorization/SKILL.md`: add a new Core Principle bullet "Moment-of-capture, not end-of-loop" between existing bullets ~line 58-80; reciprocal link to `mistake/SKILL.md` P2. | I6 | `grep "moment-of-capture\|Moment-of-capture" memorization/SKILL.md` returns ≥ 1 hit |
| 5 | Edit `mistake/SKILL.md` P2 (line 70-80): strengthen "Do not defer to MEMORIZATION" with explicit "Stage the candidate in-loop at `sessions/.../{loop}/staging/decisions/{slug}.md`" sentence; add reciprocal link to `memorization/SKILL.md` Core Principle. | I6 | `grep "MEMORIZATION\|memorization/SKILL.md" mistake/SKILL.md` returns ≥ 2 hits |
| 6 | Edit `delegation/SKILL.md`: add a Core Principle "MEMORIZATION dispatches always include `memorization/SKILL.md` in Load Directives Skills tier"; add a table row in the Load Directives block section ("Memorization phase → mandatory skill: `memorization`"). | I6 | `grep -c "memorization/SKILL.md" delegation/SKILL.md` returns ≥ 2 |
| 7 | Edit per-role templates under `delegation/templates/`: every template's example Load Directives block includes `memorization/SKILL.md` when the role's job includes MEMORIZATION (executor at EXECUTION+MEMORIZATION; leader at WORK+MEMORIZATION; assistant explicitly; evaluator does NOT memorize, so excluded). | I6 | grep each template; assistant + leader + executor reference `memorization/SKILL.md`; evaluator does not |
| 8 | Edit `wrap-up/SKILL.md`: insert "Step 2.5 — Prior-loop memorization compliance check" between current Steps 2 and 3 (`wrap-up/SKILL.md:137-138`). Include: inputs (rawdata + staging across prior loops), scan procedure, gap-classification table (**zero-staging, naming-shape, missing-template, directory-absent** — the 4th category per F-CLAUDE-C-01) with each gap categorized as `mechanical` (Type ∈ {`scenario_gap`, `checklist_gap`, `general`} + single Domain → deterministic routing per `evaluation/SKILL.md § Complete Domain → staging destination routing (general Type)` at line 356, plus `evaluation/SKILL.md § Finding Metadata` lines 344-352 for Type definitions) or `judgment-required` (Type ∈ {`design_flaw`, `assumption_risk`} inherently adversarial by definition; `disposition: open` user arbitration; Type/Domain missing/unrecognized; multi-subdir spans → aggregate NEEDS_CONTEXT); auto-backfill mechanism with `evaluation/SKILL.md § Slug + collision policy` pre-write check (lines 385-393: compute slug; check existing same-finding-id → overwrite; different finding-id → numeric suffix); NEEDS_CONTEXT trigger with `user-question:` block schema. Update Exit checklist (`wrap-up/SKILL.md:166-174`). | I7 + I11 + iter1-user-redirects § Decision 1 | `grep "Step 2.5\|prior-loop memorization compliance" wrap-up/SKILL.md` returns the new section; `grep "mechanical\|judgment-required" wrap-up/SKILL.md` returns ≥ 1 each; `grep "Slug + collision\|finding-id" wrap-up/SKILL.md` confirms collision policy referenced; `grep "scenario_gap\|checklist_gap\|design_flaw\|assumption_risk\|general" wrap-up/SKILL.md` confirms 5-Type vocabulary |
| 9 | Edit `evaluation/SKILL.md § Coverage Ownership Matrix`: add new row "Memorization staging shape + naming → Consistency + Aesthetics" with cell text "Per-finding `{slug}.md` files exist; filenames follow path conventions; templates stamped correctly. Aesthetics checks naming-convention; Consistency checks that every finding has a corresponding staging file." | I11 | `grep "staging shape" evaluation/SKILL.md` returns 1 hit; row count of Coverage Ownership Matrix increases by 1 |
| 10 | Edit `memorization/SKILL.md`: cross-link the Path Conventions block (`memorization/SKILL.md:223-231`) to `evaluation/SKILL.md § Coverage Ownership Matrix § Memorization staging shape + naming`. | I11 | `grep "Coverage Ownership Matrix" memorization/SKILL.md` returns 1 hit |
| 11 | Edit `gobbi/SKILL.md`: move § Glossary block (lines 15-29) to a new position **after** § Session Bootstrap Order (after current line 124). | I9 | `awk '/^## Glossary/{print NR}' gobbi/SKILL.md` returns a number > the line number of `## Session Bootstrap Order` |
| 12 | Edit `gobbi/SKILL.md § Step 4` (lines 99-114): rewrite from "ask 2 questions" to "ask 1 question (mode: chat/auto, **default auto** per `orchestration/templates/settings.default.json:3`), then ask 'customize defaults?' (yes/no). If yes, defer to `orchestration/SKILL.md § Step 1` row 2 walk-through. If no, persist defaults from settings.json." | I10 | `awk '/^### 4\./,/^### 5\./' gobbi/SKILL.md` shows 1 mode question (default auto) + optional customize gate; no eval-mode / git-workflow-mode questions |
| 13 | Verify `orchestration/templates/settings.default.json` already encodes the defaults (`.mode = "auto"`, `.workflow.ideation.evaluate.mode = "always"`, `.git.pr = {open: false, draft: false}` — confirmed via `jq` in iter2 prep); no schema change required. | I10 | `jq '.mode, .workflow.ideation.evaluate.mode, .git.pr' orchestration/templates/settings.default.json` returns the values; no diff applied |
| 14 | Add a session-level test in the codex skill's "Use cases" section showing the gobbi-evaluator-spawn pattern: BOTH the manager-spawn `codex:codex-rescue` pattern AND the subagent-call `codex exec` pattern. Full delegation-prompt template, including the absolute main-tree path, sandbox=read-only flag, `--cd` flag set to main-tree absolute, output-schema flag. **Post-eval `find` sanity check** (3rd corrective from the mistake file): after any codex evaluator completes, run `find <session-dir> -newer <marker> -type f` to confirm files at correct main-tree path. Cite `mistakes/codex-eval-session-write-path-nested-in-worktree.md` as the witness. | I4, I13, mistake | `grep "main-tree absolute\|CWD=main-tree\|codex-eval-session-write-path\|codex exec\|find " .claude/skills/codex/SKILL.md` returns ≥ 3 (one per pattern + find verification) |
| 15 | Add a section to the codex skill: "Anti-patterns" listing (a) using `codex:codex-rescue` for review work (should be `/codex:adversarial-review`), (b) **trying to spawn a codex plugin agent from a subagent context (will fail; subagents lack the Agent tool — use `codex exec` via Bash instead)**, (c) omitting the absolute path or `--cd` in invocation, (d) running codex foreground for open-ended tasks that exceed 2-3 minutes, (e) overriding `--model` without a user request, (f) overriding `--effort` without a user request, (g) using `--dangerously-bypass-approvals-and-sandbox` without an externally-sandboxed environment, (h) **shipping a codex skill without the `.agents/skills/codex` directory symlink** (codex can't load its own skill). | I1, I2, I13, I14, E3, E4 | `grep "Anti-pattern\|anti-pattern\|subagents lack" .claude/skills/codex/SKILL.md` returns ≥ 1 hit each |

---

## Design

Directional design decisions per item A-G. Each names a chosen direction, rationale, anchored insight, and validation method. Detailed mechanism (exact wording, exact line edits) is deferred to Execution.

### Design A — `codex` skill structure

**Direction**: Single SKILL.md file at `.gobbi/projects/gobbi/skills/codex/SKILL.md` (source-of-truth, matching project convention) with **two symlinks** (one for Claude, one for Codex itself), **8 H2 sections** locked, ~350-450 lines (comparable to other cross-cutting skills like `git/SKILL.md` or `discussion/SKILL.md`, slightly longer to accommodate the multi-pattern invocation section + the "Why subagents must use `codex exec`" subsection + the cost subsection).

**Symlink direction (concern 4 — resolved, EXPANDED per iter2 / COD-PROJ-002; count corrected iter3)**:
- Source-of-truth: `.gobbi/projects/gobbi/skills/codex/SKILL.md`
- **Symlink 1 (Claude surface)**: `.claude/skills/codex/SKILL.md -> ../../../.gobbi/projects/gobbi/skills/codex/SKILL.md` (file-level symlink — matches existing per-skill convention verified via `ls -la .claude/skills/`).
- **Symlink 2 (Codex surface)**: `.agents/skills/codex -> ../../.gobbi/projects/gobbi/skills/codex` (directory-level symlink — matches existing **16-entry** pattern verified via `ls /playinganalytics/git/gobbi/.agents/skills/ | wc -l` returning 16; every entry is a directory symlink of this exact form. Adding the codex symlink brings the count to 17 post-ship).
- **Why both**: Bundle A's codex skill is the canonical best-practices anchor. A codex skill that codex itself cannot load is a contradiction — codex must be able to consult its own best-practices skill when it operates. Shipping only the Claude-side symlink would leave the dogfood promise broken.

**Section outline (8 sections LOCKED)**:

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

4. **Sandbox + CWD discipline** — sandbox modes table (`read-only` / `workspace-write` / `danger-full-access`); when to use which; CWD inheritance from the calling shell; the absolute-path-mandate (citing `mistakes/codex-eval-session-write-path-nested-in-worktree.md`); `--add-dir` for cross-tree writability; manager-proxy write fallback when sandbox blocks; **post-eval `find` sanity check** as the third corrective from the mistake file.

5. **Hang + timeout discipline** — no built-in timeout in `codex exec`; foreground vs background selection rubric; `timeout(1)` wrapping for raw `codex exec` automation (universal pattern); `/codex:status` polling for background plugin-agent runs; `/codex:cancel` (user-only) for stuck plugin-driven runs.

6. **Use cases** — three subsections, each with a worked example:

   **(a) Dual-system evaluator spawn** — show BOTH patterns:
   - Manager-spawn pattern: manager calls `Agent(subagent_type="codex:codex-rescue", ...)` for parallel-evaluation flows where an isolated agent thread is wanted.
   - Subagent in-line second-opinion pattern: an evaluator subagent (or leader, or executor) calls `codex exec --cd /playinganalytics/git/gobbi -s read-only ...` directly via the Bash tool for an inline second opinion, without spawning a separate agent thread.
   - Both patterns share the same CWD, sandbox, and absolute-path discipline; only the spawn ergonomics differ.
   - **Post-eval verification step (NEW iter2)**: after either pattern completes, run `find /playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/{session-id} -newer <marker> -type f` to confirm codex writes landed at the main-tree absolute path, not the worktree (the 3rd corrective from `mistakes/codex-eval-session-write-path-nested-in-worktree.md`).

   **(b) Codex-rescue for stuck Claude work** — manager-only; uses `codex:codex-rescue` for ad-hoc rescue.

   **(c) External adversarial review at session end** — user-only; manager ASKS USER to type `/codex:adversarial-review`.

7. **Cost + sandbox budget awareness (NEW iter2 per COD-PERF-001)** — Codex invocations cost OpenAI API tokens (separate budget from Claude). Guidance:
   - **When to choose codex vs claude**: codex for adversarial / second-opinion work where independent reasoning surface is the goal; claude for primary execution / reasoning where the manager's loaded context is the asset. Don't reach for codex just because it's available — every spawn has cost.
   - **Default to `read-only` sandbox** for evaluator + second-opinion spawns; this prevents accidental writes that could compound cost via re-run / cleanup churn.
   - **`--effort` left unset** unless the user asks for a specific tier; effort level multiplies token usage.
   - **Foreground for clearly-bounded asks (≤ 2-3 min)** to bound cost; background + `/codex:status` polling for wider scopes (avoid unbounded foreground runs that block on hangs and accumulate cost).
   - **No `--model` override** unless the user asked for it; the configured default in `~/.codex/config.toml` reflects the user's cost preferences.

8. **Anti-patterns** — see checklist item 15. Key anti-patterns: subagent-cannot-spawn-plugin-agent; missing `.agents/skills/codex` directory symlink (codex can't load its own skill); skipping post-eval `find` sanity check.

**Constraints**: bullet list per the project's `_claude/SKILL.md` standard.

**Rationale**: One file matches every other gobbi cross-cutting skill (no `git/templates/` or `discussion/templates/` proliferation). The reordered invocation-patterns section reflects the empirical tool-surface reality — `codex exec` is the universal lowest-common-denominator; plugin agent is a manager-only convenience that reduces to the same; slash command is user-only. The new "Why subagents must use `codex exec`" subsection inlines the empirical witness so future readers don't repeat the user's "I remember there were some blocks" investigation. The triple-symlink discipline (source + two symlinks) ensures codex itself can load the skill. The cost subsection brings token-budget awareness to a previously invisible dimension.

**Anchored insight**: I1, I2, I3, I4, I5, I13, I14, E1, E2, E3, E4, E5 + iter1 user redirect § Decision 2.

**Validation method**: After Execution, `find .gobbi/projects/gobbi/skills/codex -name SKILL.md` returns 1 file; `ls -la .claude/skills/codex/SKILL.md` shows the file symlink; `ls -la .agents/skills/codex` shows the directory symlink; `grep -c "^## " .gobbi/projects/gobbi/skills/codex/SKILL.md` returns exactly 8; manual read confirms (i) Invocation patterns subsection orders `codex exec` first / plugin-agent second / slash-command third, (ii) "Why subagents must use `codex exec`" subsection cites the four `.claude/agents/{role}.md` tool lists + the plugin agent's `tools: Bash` field, (iii) Use cases dual-system shows both spawn patterns AND post-eval `find` verification, (iv) Cost subsection explicit, (v) Anti-patterns includes the subagent-cannot-spawn-plugin-agent entry AND the missing-symlink entry.

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

**Step 2.5 specification (restructured per iter1 user redirect § Decision 1 — hybrid escalation; finding-Type vocabulary corrected per iter3 against the actual 5 Types verified at `evaluation/SKILL.md:344-352`; collision policy added per COD-RISK-001; directory-absent gap added per F-CLAUDE-C-01)**:

- **Inputs**: prior loops' `rawdata/` + `staging/` + `evaluation/iter*/{claude,codex}/` (read-only).

- **Procedure**:
  1. For each prior loop (ideation, preparation, planning, execution/T*, ...), enumerate evaluation findings per perspective × system in `evaluation/iter{n}/{system}/{perspective}.md`.
  2. Count staging files per loop's `staging/{type}/`; note staging-dir presence/absence.
  3. Compute gap metrics across **4 categories**:
     - (a) **zero-staging gap** — `staging/` directory exists and is empty but `evaluation/` has findings;
     - (b) **directory-absent gap (NEW per F-CLAUDE-C-01)** — `staging/` directory does not exist at all (e.g., last session's T2/T3); treated as a strict superset of zero-staging;
     - (c) **shape gap** — staging files exist but filenames don't match `{slug}.md` per finding-id;
     - (d) **template gap** — staging files exist but template frontmatter is missing or wrong (e.g., `decisions/{slug}.md` lacks `mistake-candidate:` when it should have one).
  4. **Classify each gap** using the **actual 5-Type vocabulary** from `evaluation/SKILL.md:344-352` (re-verified iter3 via `sed -n '344,352p'`): `scenario_gap`, `checklist_gap`, `design_flaw`, `assumption_risk`, `general`:
     - **`mechanical`** = the finding's `Type` ∈ {`scenario_gap`, `checklist_gap`, `general`} AND has a single `Domain` value AND routes deterministically to one staging subdir. For `general`-Type findings, routing follows `evaluation/SKILL.md § Complete Domain → staging destination routing (general Type)` at line 356 (the Domain → staging-subdir table). For `scenario_gap` / `checklist_gap`, routing is built into the Type per `evaluation/SKILL.md:344-352` ("Stage at `sessions/{date}-{session-id}/{loop}/staging/scenarios/{slug}.md`" and "Stage at `.../staging/checklists/{slug}.md`, anchored to its scenario"). Example: a `general` finding tagged Domain=`testing` with `disposition: addressed` routes uniquely to the testing-domain staging path per the Domain table.
     - **`judgment-required`** = ANY of: the finding's `Type` ∈ {`design_flaw`, `assumption_risk`} (these Types are inherently adversarial / arbitration-required by Type definition — `design_flaw` surfaces a concrete flaw and on PASS stages as deferred risk; `assumption_risk` surfaces an assumption that may not hold and stages as an assumption note possibly requiring user input); OR the finding has `disposition: open` requiring user arbitration; OR the finding's `Type` or `Domain` is missing or unrecognized; OR the finding spans multiple staging subdirs.
     - **Note (iter3 vocabulary correction)**: the terms `improvement` and `bug` (used in iter2 draft) are NOT in the 5-Type vocabulary. Corrections / decisions / mistake-candidates that look like "constructive improvements" surface as `general`-Type findings (catch-all routed by Domain); broken-invariant findings surface as `design_flaw`; potentially-wrong assumptions surface as `assumption_risk`. The `mistake-candidate: true` frontmatter is an orthogonal flag on any of these Types, not a Type itself.
  5. **Auto-fill mechanical gaps inline, with collision policy (NEW per COD-RISK-001)** — for each mechanical finding:
     - Compute the slug per `evaluation/SKILL.md § Slug + collision policy` (lines 385-393): kebab-case, ≤ 60 chars, derived from finding's primary symptom (not from Type/Domain).
     - **Pre-write check**: read any existing file at `staging/{type}/{slug}.md`:
       - File absent → write.
       - File present, same `finding-id` in frontmatter → overwrite (re-run idempotency).
       - File present, different `finding-id` → disambiguate slug with `-2`, `-3` numeric suffix; record disambiguation in the gap report.
       - Cross-loop slug collision detected (e.g., planning + execution both stage same slug with different finding-ids) → use loop-name suffix per the policy.
     - Write the staging file from the finding's content; record in gap report as `auto-filled-mechanical`.
  6. **Aggregate judgment-required gaps into a single NEEDS_CONTEXT** — emit `STATUS: NEEDS_CONTEXT` with a `user-question:` block listing all judgment-required gaps grouped by loop + per-finding routing options. Options typically include: (a) decide the routing for each judgment-required finding inline, (b) document the gap in handoff and proceed, (c) abort wrap-up and re-enter the upstream loop's MEMORIZATION.

- **Output**: gap report appended to `rawdata/promotion-manifest.md` (creating the file if not yet present) — one section per loop, listing each gap with verdict `clean` / `auto-filled-mechanical` / `auto-filled-mechanical-with-disambiguation` / `needs-context-judgment-required`.

- **Classification audit trail**: the classification rules MUST be documented in `wrap-up/SKILL.md` so users can audit the assistant's gap-classification. The classification table in the skill enumerates: (i) what makes a gap mechanical (Type ∈ {`scenario_gap`, `checklist_gap`, `general`} + single Domain + clear disposition), (ii) what makes a gap judgment-required (Type ∈ {`design_flaw`, `assumption_risk`}, `disposition: open`, missing/unrecognized Type/Domain, multi-subdir spans), (iii) examples of each, (iv) the deterministic routing source (`evaluation/SKILL.md § Finding Metadata` lines 344-352 for Type definitions + `evaluation/SKILL.md § Complete Domain → staging destination routing (general Type)` at line 356 for `general`-Type Domain routing), (v) the collision policy source (`evaluation/SKILL.md § Slug + collision policy` lines 385-393).

**Rationale**: Pure NEEDS_CONTEXT (the original recommendation) introduces friction even for trivially-deterministic gaps (e.g., a single `general` finding with a single `Domain` value clearly routes to one staging path via the Domain table). Pure auto-backfill elevates autonomy past Iron Law 4 when the routing is non-deterministic. The hybrid threads the needle: mechanical = autonomy is safe, the routing has only one defensible target AND the collision policy makes re-runs idempotent; judgment-required = the user owns the call. Using the actual 5-Type vocabulary makes the classification rules implementable; referencing the existing collision policy makes the auto-backfill safe under re-execution.

**Anchored insight**: I7 + I11 + iter1 user redirect § Decision 1.

**Alternative considered**: Pure NEEDS_CONTEXT (original iter1 recommendation) — **rejected** by user as too friction-heavy for mechanical cases. Pure auto-backfill — **rejected** by user as too aggressive on autonomy. The hybrid is the user's selected option.

**Validation method**: `grep "Step 2.5" wrap-up/SKILL.md` returns the new step; `grep -i "mechanical\|judgment-required" wrap-up/SKILL.md` returns the classification rules; `grep "scenario_gap\|checklist_gap\|design_flaw\|assumption_risk\|general" wrap-up/SKILL.md` confirms the 5-Type vocabulary; `grep "Slug + collision\|finding-id" wrap-up/SKILL.md` confirms collision policy reference; `grep "Complete Domain.*staging destination routing\|line 356" wrap-up/SKILL.md` confirms the correct Domain-routing anchor; `grep "directory-absent" wrap-up/SKILL.md` confirms the 4th gap category; Wrap-up Exit checklist contains "[ ] Step 2.5 prior-loop compliance check produced a gap report".

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

- **Question 1 — mode** (NEW; not in current Step 4 but already in `orchestration/SKILL.md § Step 1` row 1): "Chat mode (you confirm at every gate) or Auto mode (manager proceeds without asking)?" **Default auto** — verified via `jq '.mode' .gobbi/projects/gobbi/skills/orchestration/templates/settings.default.json` → `"auto"`. (Per COD-USAGE-001, this default matches the existing settings rather than introducing a Chat-default that would diverge from `settings.default.json:3`.)
- **Question 2 — customize?**: "Use defaults for evaluation + git workflow + per-step settings, or customize?" Default "use defaults". If "customize", defer to `orchestration/SKILL.md § Step 1` row 2 (the existing per-section walk-through).
- **Remove**: Question 1 (evaluation mode) + Question 2 (git workflow mode) as standalone bootstrap questions.

The eval-mode and git-mode defaults already live in `orchestration/templates/settings.default.json` — verified via `jq '.workflow.ideation.evaluate.mode, .git.pr'` returning `"always"` and `{"open": false, "draft": false}` respectively. No schema change required.

**Rationale**: `orchestration/SKILL.md § Step 1` already encodes the "use defaults vs customize" pattern. The existing `gobbi/SKILL.md § 4` duplicates and partially overlaps that mechanism. Consolidating to a single mode-question + customize-gate path resolves the docs-sync drift. The mode default (auto) is sourced from the existing settings rather than overridden, so behavior continuity is preserved.

**Note (concern 1 — resolved)**: There is NO `.claude/skills/orchestration/workflow/configuration.md` file in the current repo — `find .claude/skills/orchestration/workflow -name "configuration*"` returns empty. Configuration is documented inside `orchestration/SKILL.md § Step 1`. The original briefing's reference to `workflow/configuration.md` is replaced everywhere by `orchestration/SKILL.md § Step 1`.

**Anchored insight**: I10.

**Validation method**: `awk '/^### 4\./,/^### 5\./' gobbi/SKILL.md` returns ≤ 2 AskUserQuestion mentions (the mode question with default auto + the customize gate); zero mentions of "Always evaluate" / "Skip evaluation" / "Direct commit" / "Git workflow" as bootstrap-question options (those move to settings.json defaults).

---

## Decisions Log

Captured from DISCUSSION (see `sessions/.../ideation/rawdata/discussion-log.md`) plus this WORK phase plus the post-WORK iter1 user redirects (see `sessions/.../ideation/staging/decisions/iter1-user-redirects.md`) plus iter2 aggregated-eval revisions plus iter3 vocabulary repair.

| # | Topic | Decision | Source |
|---|---|---|---|
| 1 | Scope bundle | Bundle A (codex + memorization + polish) selected over codex-only or memorization-only. | discussion-log § Round 1 + Scope lock |
| 2 | Codex skill depth | Content-complete this session, not skeleton + follow-up. | discussion-log § Round 3 |
| 3 | Codex skill breadth | "Best practices for codex in claude code" (broad), not evaluator-spawn-specific. | discussion-log § Round 2 |
| 4 | Memorization pathology | γ + α (write-as-you-go + delegation hard gate). β (manager inline-bypass) conditional on evidence. | discussion-log § Round 2 |
| 5 | β evidence finding | β NOT observed last session — assistant agents WERE spawned for MEMORIZATION (per wrap-up session-final.md WORK Outputs table). The α failure was inside the spawn (Load Directives gap), not at the manager's choice to spawn. **Conclusion: β stays out of scope; γ + α suffice.** | I6 + Research |
| 6 | Wrap-up Step 2.5 | IN scope. | discussion-log § Round 2 |
| 7 | Step 2.5 escalation shape (iter3 vocabulary correction) | **Hybrid: auto-backfill mechanical gaps inline (deterministic Type+Domain routing per `evaluation/SKILL.md § Finding Metadata` lines 344-352 using the actual 5 Types: `scenario_gap`, `checklist_gap`, `design_flaw`, `assumption_risk`, `general`) + aggregate NEEDS_CONTEXT for judgment-required gaps. Mechanical Type set = `{scenario_gap, checklist_gap, general}` (these route deterministically — `scenario_gap`/`checklist_gap` to type-specific staging paths per the Type table; `general` routed by Domain per `evaluation/SKILL.md § Complete Domain → staging destination routing (general Type)` at line 356). Judgment-required Type set = `{design_flaw, assumption_risk}` (inherently adversarial / arbitration-required by Type definition). Additional judgment-required triggers: `disposition: open` user arbitration, missing/unrecognized Type/Domain, multi-subdir spans. Auto-backfill respects `evaluation/SKILL.md § Slug + collision policy` lines 385-393 (stable finding-id, pre-write check, same-id overwrite, different-id suffix disambiguation).** Classification rules documented in `wrap-up/SKILL.md` for auditability. | iter1-user-redirects § Decision 1 (post-WORK user redirect); iter3 corrections per Claude STRUCT/CONS/RISK-Critical + Codex STRUCT-High |
| 8 | Naming-convention enforcement vehicle | **Evaluator-perspective check** (Consistency + Aesthetics) via a new row in `evaluation/SKILL.md § Coverage Ownership Matrix`, **NOT** CLI lint (no `packages/cli/src/` exists). Step 2.5 (item D) carries the staging-shape detection at Wrap-up; Consistency seed scenario carries it at every loop's EVALUATION. | I8 + I11 |
| 9 | Polish 1-1 (Glossary placement) | Move Glossary to after § Session Bootstrap Order. | I9 |
| 10 | Polish 1-4 (setup-question reduction) | Reduce from 2 questions to 1 (mode, **default auto** per `orchestration/templates/settings.default.json:3`) + customize gate; defaults flow from settings.json. Configuration's customize walk-through lives in `orchestration/SKILL.md § Step 1` row 2, NOT a `workflow/configuration.md` file (verified non-existent). | I10 + verified-not-exists + iter2 corrections per COD-USAGE-001 |
| 11 | Deferrals (1-2, 1-3, 2-1, 2-2, 4-1, prior carry-forwards #1/#2/#4) | All explicitly out of scope. | discussion-log § Deferred |
| 12 | Configuration file path discrepancy (concern 1 — resolved) | Original brief referenced `orchestration/workflow/configuration.md` for item G; file does not exist (`find .claude/skills/orchestration/workflow -name "configuration*"` empty). **Substitute everywhere with `orchestration/SKILL.md § Step 1`.** Auto-resolved by deterministic `find` verification. | iter1-user-redirects § "Concerns resolved without user input" + this WORK |
| 13 | Provenance for item D (refined iter2 per COD-PROJ-001 / COD-CONS-001) | **Witness is concrete and empirical, distinguished by pathology class**: this session's `find /playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-22-bac669ad-.../execution/T*/evaluation -type f \| wc -l` returned 8/13/3/2/9/2/2 for T1-T7. **T1 (8) / T2 (13) / T5 (9) are the cleanest memorization-gap witnesses** — full evaluations existed; staging never ran. **T3 (3) / T4 (2) / T6 (2) / T7 (2) are eval-also-skipped witnesses** — partial evaluations AND no staging, a separate problem class. The iter1 draft's "T2-T7 had full evaluation content" claim is corrected. The prior session's `handoff.md` § "What the Next Session Inherits" does NOT enumerate "Wrap-up Step 2.5 compliance check" as a numbered carry-forward — the briefing's earlier "carry-forward item #3" framing was loose. | I12 + iter1-user-redirects § Concern 6 + iter2 re-verification |
| 14 | Codex invocation priority (concern 5 — resolved + REDIRECT 1) | **`codex exec` via Bash is the UNIVERSAL primary pattern (manager AND subagents).** `codex:codex-rescue` plugin agent is the MANAGER-ONLY secondary pattern (subagents lack Agent tool per `.claude/agents/{leader,executor,evaluator,assistant}.md`). `/codex:adversarial-review` is the USER-ONLY tertiary pattern (`disable-model-invocation: true`). Empirical witness: the plugin agent itself declares `tools: Bash` and reduces to `codex exec` under the hood. | iter1-user-redirects § Decision 2 (post-WORK user redirect) + manager empirical investigation |
| 15 | Symlink direction (concern 4 — resolved; EXPANDED iter2 per COD-PROJ-002; count corrected iter3) | **Source-of-truth at `.gobbi/projects/gobbi/skills/codex/SKILL.md`; TWO symlinks**: (a) `.claude/skills/codex/SKILL.md -> ../../../.gobbi/projects/gobbi/skills/codex/SKILL.md` (Claude file-level), (b) `.agents/skills/codex -> ../../.gobbi/projects/gobbi/skills/codex` (Codex directory-level, matching the **16-entry** pattern verified via `ls /playinganalytics/git/gobbi/.agents/skills/ \| wc -l` returning 16; adding codex brings count to 17 post-ship). **Both are required**: a codex skill that codex itself cannot load is a contradiction. | iter1-user-redirects § "Concerns resolved without user input" + iter2 per COD-PROJ-002 + I14 (iter3 count repair) |
| 16 | iter2 changelog discipline | Every iter2 revision is logged in the top-of-file Iter2 Changelog table with originating finding ID, change summary, and target sections. iter1 file preserved at `draft-iter1.md`. | iter2 leader brief constraint |
| 17 | Codex skill section count locked at 8 | Resolved iter1's inconsistent counts (5+/6-7/8) to a single locked value of 8 H2 sections: When to load / Invocation patterns / Why subagents must use `codex exec` / Sandbox + CWD / Hang + timeout / Use cases / Cost + sandbox budget awareness / Anti-patterns. Plus Constraints block. | F-CLAUDE-S-01 / F-CLAUDE-A-02 |
| 18 (NEW iter3) | Finding-Type vocabulary repair + mechanical/judgment-required re-spec + count correction + phantom anchor fix | iter2 regressed COD-STRUCT-001 by substituting an invalid vocabulary (`improvement`, `bug`) for the actual 5 Types. iter3 empirically re-verified the actual 5 Types via `sed -n '344,352p' .gobbi/projects/gobbi/skills/evaluation/SKILL.md`: **`scenario_gap`, `checklist_gap`, `design_flaw`, `assumption_risk`, `general`**. All 10 propagation sites in iter2 corrected. Mechanical classification re-spec: mechanical Type set = `{scenario_gap, checklist_gap, general}`; judgment-required Type set = `{design_flaw, assumption_risk}` (inherently adversarial by definition). Also: (a) corrected `.agents/skills` directory-symlink count from 17 → 16 (the codex addition brings it to 17 post-ship); (b) corrected cross-link manifest phantom anchor — `evaluation/SKILL.md § Staging routing` does NOT exist; correct anchor is `§ Complete Domain → staging destination routing (general Type)` at line 356; (c) re-verified `.claude/CLAUDE.md:50` mistake-discipline citation as accurate (no-op confirmation). | Claude STRUCT-Critical + Claude CONS-Critical + Claude RISK-Critical + Codex STRUCT-High (carried COD-STRUCT-001); F-CLAUDE-S-02 (phantom anchor); F-CLAUDE-U-02 (citation verification) |

### Cross-link manifest (NEW iter2 per F-CLAUDE-S-02; item #6 anchor corrected iter3)

Bundle A creates the following cross-skill links the Execution phase must wire — auditable as a single list to prevent silent omissions:

| Link | From → To | Purpose | Item |
|---|---|---|---|
| 1 | `memorization/SKILL.md § Core Principle "Moment-of-capture"` → `mistake/SKILL.md § P2` | Reciprocal: the moment-of-capture rule anchors to the mistake-discipline principle. | B |
| 2 | `mistake/SKILL.md § P2` → `memorization/SKILL.md § Core Principle "Moment-of-capture"` | Reverse leg of link 1. | B |
| 3 | `delegation/SKILL.md § Load Directives / Core Principles` → `memorization/SKILL.md § Procedure` | Delegation hard-gate references the staging procedure that must be loaded. | C |
| 4 | `wrap-up/SKILL.md § Step 2.5` → `evaluation/SKILL.md § Finding Metadata` (lines 344-352) | Type-vocabulary source for the 5 Types used in mechanical/judgment-required classification. | D |
| 5 | `wrap-up/SKILL.md § Step 2.5` → `evaluation/SKILL.md § Slug + collision policy` (lines 385-393) | Collision-policy source for auto-backfill pre-write check. | D |
| 6 | `wrap-up/SKILL.md § Step 2.5` → `evaluation/SKILL.md § Complete Domain → staging destination routing (general Type)` (line 356) — **CORRECTED iter3**: iter2 cited phantom anchor `§ Staging routing` which does NOT exist in `evaluation/SKILL.md`. | Deterministic-routing source for `general`-Type mechanical destinations (the Domain → staging-subdir table). | D |
| 7 | `memorization/SKILL.md § Path Conventions` → `evaluation/SKILL.md § Coverage Ownership Matrix § Memorization staging shape + naming` | Verification semantics for naming convention enforcement. | E |
| 8 | `codex/SKILL.md § Sandbox + CWD discipline` → `.gobbi/projects/gobbi/mistakes/codex-eval-session-write-path-nested-in-worktree.md` | Witness anchor for the absolute-path mandate + post-eval `find` corrective. | A |
| 9 | `codex/SKILL.md § Hang + timeout discipline` → `git/SKILL.md` background-mode guidance (where applicable) | Reuse existing background-job discipline rather than duplicating. | A |
| 10 | `gobbi/SKILL.md § Skill Map § Cross-cutting` → `.claude/skills/codex/SKILL.md` (or `.gobbi/projects/gobbi/skills/codex/SKILL.md` per project convention) | Entry-point cross-reference so the codex skill is discoverable. | A |

---

## Open Concerns / Items to flag (DONE_WITH_CONCERNS triggers)

**Status update (post-iter3 revision)**: All Codex-High findings (COD-PROJ-001/002, COD-CONS-001, COD-STRUCT-001, COD-USAGE-001, COD-RISK-001, COD-OVERALL-001) were addressed in iter2; iter2's regression on COD-STRUCT-001 (invalid `improvement`/`bug` vocabulary) is repaired in iter3 against the empirically-verified 5 Types. All Claude-Critical findings from iter2 evaluation (Structure, Consistency, Risk) are addressed via the iter3 vocabulary repair + phantom-anchor fix + count correction. F-CLAUDE-U-02 (citation) re-verified accurate as a no-op. Only the original Item E text concern remains pending — it is a Planning-phase clarification (non-blocking for ideation evaluation).

1. **Item E's exact text for the new Coverage Ownership Matrix row** — proposed text is in Design E above; Planning/Execution should confirm the cell content with the user before editing `evaluation/SKILL.md`. (Original numbering: concern 3.)

---

## What's NOT covered (intentional)

- **Bundle internal sequencing for Planning.** Decomposition into Planning tasks is a Planning Loop concern, not Ideation. This draft enumerates the per-item file-level surface but does NOT specify which task ships first or any task-graph.
- **Exact wording of every edit.** Direction + anchored insight + validation method only; Execution writes the prose.
- **Test plan.** None of these edits are code; verification is a `grep`-based check per the validation methods enumerated.
- **`settings.default.json` mode-default change.** The existing `"mode": "auto"` is the de facto default and Question 1 now reports it; changing the setting itself is a separate future session.

End of draft-iter3 (surgical fix against aggregated iter2 EVALUATION findings — vocabulary repair + count correction + phantom-anchor fix + citation verification).
