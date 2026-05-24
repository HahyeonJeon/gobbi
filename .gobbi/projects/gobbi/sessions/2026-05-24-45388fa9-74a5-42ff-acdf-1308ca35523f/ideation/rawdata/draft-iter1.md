# Draft Idea — Bundle C foundation follow-ups — iter1

**Session**: 2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f
**Phase**: Ideation iter1 (Sub-steps A → D synthesized in a single leader draft per Auto-mode directive)
**Author**: leader (PI/PM)
**Status**: DRAFT — awaiting manager review + AskUserQuestion confirmation of in-scope set + feature name before WORK staging.

---

## TL;DR

The user-locked direction "Bundle C — foundation follow-ups (Recommended)" lists 5 candidate backlog items. Investigation shows the 5 candidates are **not a single coherent feature** — they split into two distinct themes plus one obsolete item:

- **Theme α — Hooks-domain authoring discipline (2 items)**: `gobbi-hook-authoring-skill` + `hooks-domain-mistakes-watchlist`. These are paired by design (the skill backlog explicitly cites the watchlist as a precondition input).
- **Theme β — Session-lifecycle aggregation (1 item)**: `session-lifecycle-worktree-boundaries-design-doc`. Aggregation reference doc; orthogonal to Theme α.
- **Resolved-by-shipped-code (1 item, RECOMMEND CLOSE)**: `f-struct-01-jq-sh-env-passthrough` — the suggested fix is already present in merged `session-start.sh` (lines 73-77; commit `159eb21`).
- **Still load-bearing, but a separate, project-wide-impact Ideation (1 item, RECOMMEND DEFER)**: `f-risk-01-subagent-ccsi-semantics` — the skill docs still cite `$CLAUDE_CODE_SESSION_ID` literally; the backlog itself says "warrants its own Ideation session". Conflating it with hook-authoring/design-doc work would violate Iron Law 4 (scope contract) and the cluster cohesion test.

**Recommended in-scope set for this session: 3 items** — the 2 Theme α items (paired) + the 1 Theme β item — under feature name `session-foundations-bundle-c`. The name still works because all 3 in-scope items anchor to the same 2026-05-23-1b26cf20 session (post-Bundle-B follow-ups) and aggregate to the same conceptual surface (post-Bundle-B foundation hardening). f-struct-01 closes (already shipped); f-risk-01 stays in backlog with a forward pointer.

This is the load-bearing finding the manager must surface to the user before Planning. See "Open questions for the user" at the bottom.

---

## Scope Contract (proposed — NOT yet user-locked)

```yaml
artifact_type: scope-contract
feature: session-foundations-bundle-c
goal: Land the 3 cohering Bundle-B follow-up items (hook-authoring skill + hooks mistakes watchlist + session-lifecycle design doc) plus close obsolete f-struct-01; defer f-risk-01 to its own dedicated Ideation per its own recommendation.
created-by: 2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f
created-at: 2026-05-24T14:30:00Z
```

### In-Scope (3 ship + 1 close + 1 defer-keep)

1. **`gobbi-hook-authoring-skill`** (Theme α — primary; status `deferred` → `in-progress`)
   - Witness: 2 working hooks now exist on develop — `.claude/hooks/session-start.sh` (79 lines; commit `159eb21`) and `.claude/hooks/post-tool-use-agents.sh` (251 lines; in commit `dfb7d6d` aka Bundle B PR #268). Both encode the bash + jq + flock + strict-mode + guards stack. N=2 witness threshold (set by the backlog file at `.gobbi/projects/gobbi/backlogs/gobbi-hook-authoring-skill.md` § "When to pick up") is satisfied.
   - Trigger satisfied: backlog § "When to pick up" reads "T3 ships AND `post-tool-use-agents.sh` is exercised by ≥1 real session". `post-tool-use-agents.sh` is registered in `.claude/settings.json` (Bundle B T09 — see `dfb7d6d` stat line); it will fire on EVERY Agent/Task tool call this session, including this very leader spawn. So by the time Planning runs, the script has been exercised by the current session — trigger met.
   - Suggested-approach reference: backlog § "Suggested approach" lays out the canonical stamping flow (interview skill wave + stage at `sessions/.../preparation/staging/skills/gobbi-hook-authoring/SKILL.md` + promote-now per `preparation/SKILL.md` narrow-exception).

2. **`hooks-domain-mistakes-watchlist`** (Theme α — paired; status `deferred` → `in-progress`)
   - Witness: backlog file at `.gobbi/projects/gobbi/backlogs/hooks-domain-mistakes-watchlist.md` § "When to pick up" lists two triggers: (a) N≥2 hooks-domain mistakes accumulate, OR (b) 3rd hook author proposes. Trigger (a) is **NOT yet satisfied** (`ls .gobbi/projects/gobbi/mistakes/` shows zero entries with `domain: hooks` — only `process` and `workflow`).
   - However, the backlog itself describes the work as **"ad-hoc per execution session — no large pre-meditated work"** and explicitly calls this "a reminder, not a workstream". This means the appropriate action here is **NOT a new skill or design doc** — it is one of (i) close the backlog because it's a perpetual reminder rather than a discrete deliverable, OR (ii) attach the "hooks domain tag convention" to `mistake/SKILL.md` (cited in the backlog's "Suggested approach" tail). Option (ii) is small, concrete, and within Bundle C's hook-authoring orbit. **Recommended: option (ii) — add `hooks` to the documented domain tag list in `mistake/SKILL.md`, and update the backlog file's status to capture-as-they-emerge-permanent (no separate watchlist artifact)**. The skill-extraction trigger remains future-deferred.
   - This is itself a **defer-policy-rationalization** check per the task brief: the backlog item exists primarily as a witness-bound reminder; lifting it without N≥2 captured mistakes risks speculative codification. The recommended Bundle-C scope is the **smallest concrete change** (single skill edit + backlog status update) that the witness DOES support — not the larger pre-emptive watchlist.

3. **`session-lifecycle-worktree-boundaries-design-doc`** (Theme β; status `deferred` → `in-progress`)
   - Witness: backlog file at `.gobbi/projects/gobbi/backlogs/session-lifecycle-worktree-boundaries-design-doc.md` § "When to pick up" reads "After T1 ships AND N=2 sessions have exercised the worktree-first pattern end-to-end". T1 shipped (commit `dfb7d6d` includes T01–T10). The post-Bundle-B "follow-up" session that completed T02–T10 was direct mode (per session.json review: bundle B's worktreePath was `null`). The CURRENT session (this one) is the FIRST `worktree-pr` session running with row 5.5 active end-to-end — meaning N=2 sessions exercised end-to-end pattern will be satisfied only after THIS session's Wrap-up squash-merges.
   - **Tension surfaced for user**: writing the design doc THIS session (Theme β in-scope) writes it before N=2 end-to-end is empirically validated. Strict reading of the backlog defers until N=2 is hit. Two policy options:
     - **(β-1) Ship the design doc this session, treat this session itself as N=2** (counting Bundle B as N=1 by virtue of completion + this session as N=2 by virtue of running the pattern). Risk: the "lessons-learned-after-N=2" section the backlog calls for is shallow because this session hasn't completed Wrap-up yet.
     - **(β-2) Defer Theme β to the NEXT session after this one's Wrap-up succeeds.** That makes the next session the third worktree-pr ship, with two completed end-to-end demonstrations to draw lessons from. Pure-Theme-α Bundle C this session; Theme β next session.
   - **Recommended: β-2 (defer Theme β)** — the design doc's load-bearing content is the "lessons learned" section, which requires retrospective material this session cannot yet produce. Without β-2, the design doc risks documenting "as conceived" rather than "as held up", exactly the failure mode the backlog calls out.
   - If user picks β-2, Bundle C narrows to **Theme α only (2 items)** and the feature name still holds.

4. **`f-struct-01-jq-sh-env-passthrough`** (status `open` → `closed` — recommend close-no-implement)
   - Empirical resolution: the suggested fix ("Option A: `printf '%q'` for passthrough re-exports") is already present in shipped `session-start.sh` lines 73-77 (commit `159eb21`, merged 2026-05-22 with env-var-audit PR #265). The backlog file's "Suggested resolution" snippet literally matches lines 73-77.
   - Action: change `.gobbi/projects/gobbi/backlogs/f-struct-01-jq-sh-env-passthrough.md` frontmatter `status: open` → `status: closed` + `closed_by: 159eb21` + add a one-line "Closed — fix already shipped in `session-start.sh` lines 73-77 via env-var-audit PR #265 (commit `159eb21`); discovered during Bundle C ideation, 2026-05-24". This is the closure note, NOT new implementation work. Scope it to Theme α work (one of the executor tasks during Bundle C) so it lands in the same PR as the skill stamping.

5. **`f-risk-01-subagent-ccsi-semantics`** (status `open` → stays `open`; recommend DEFER out of Bundle C)
   - Empirical check: skill files at `mistake/SKILL.md:129`, `research/SKILL.md:145` (and 10 other skills cited in the backlog) still document `{session-id} — Claude Code session ID from $CLAUDE_CODE_SESSION_ID`. The doc-level risk is **NOT** resolved by Bundles A or B.
   - But the backlog file at `.gobbi/projects/gobbi/backlogs/f-risk-01-subagent-ccsi-semantics.md` § "Suggested next step" explicitly reads "This topic warrants its own Ideation session... it is cross-feature (affects all 12 skills, all loops, all subagent delegation patterns) and should be scoped as a project-level design decision rather than tacked onto a feature session."
   - Bundle C's scope (3 backlog items rooted in hook-authoring + design-doc) is the WRONG vehicle for a 12-skill cross-cutting docs+semantics decision among 3 candidate mitigations. Adding it would violate Iron Law 4 (scope is bounded by contract) — the user picked direction "Bundle C foundation follow-ups", not "12-skill subagent semantics redesign".
   - Action: leave the backlog file as-is (status `open`). Cite the deferral rationale in this session's Wrap-up HANDOFF as a follow-up trigger for a future dedicated Ideation session.

### Out-of-Scope (do not absorb)

- Implementation of any 3rd hook (would change the witness count premise of the gobbi-hook-authoring skill — out of scope per backlog § "When to pick up").
- Editing any of the 12 skill files cited by `f-risk-01` for session-id-source semantics. That is the `f-risk-01` work, deferred.
- Refactoring `session-start.sh` or `post-tool-use-agents.sh` — these are inputs (witnesses) to the gobbi-hook-authoring skill, not deliverables. Editing them would be Principle 10 violation (no witness).
- Any change to `mistake/SKILL.md` beyond adding `hooks` to its domain-tag examples (recommended Theme α paired-item resolution under In-Scope #2). Larger edits are out.
- Smoke-test gate T1.h work — orchestration row 5.5 ships in develop; the smoke gate is for Memorization, not Ideation. Flag it in Wrap-up briefing, do not lift it into Bundle C.

### Decisions Locked (proposed pending AUQ)

- **DL-1**: Cluster splits into 2 themes; bundle stays singular under name `session-foundations-bundle-c` because Theme β anchors to the same 2026-05-23-1b26cf20 session as Theme α (post-Bundle-B follow-up surface) and both ship as foundation hardening.
- **DL-2**: `f-struct-01` closes inline; `f-risk-01` defers to its own future Ideation per the backlog's own recommendation.
- **DL-3**: `hooks-domain-mistakes-watchlist` resolves via the smallest concrete edit the witness supports (add `hooks` to documented domain tags in `mistake/SKILL.md` + status update on the backlog), not via a new watchlist artifact. The skill-extraction trigger stays deferred.
- **DL-4** (PENDING USER): Theme β β-1 (ship now, N=2 self-counted) vs β-2 (defer to next session for empirical N=2). See "Open questions for the user".

### Success Criteria

- **SC-1**: `gobbi-hook-authoring` project skill staged at `sessions/.../preparation/staging/skills/gobbi-hook-authoring/SKILL.md` (per `preparation/SKILL.md` generate-now narrow-exception) and promoted to `.gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md` via worktree-branch commit per the Bundle-B-shipped flow.
- **SC-2**: `mistake/SKILL.md` adds `hooks` to its documented domain-tag list AND the `hooks-domain-mistakes-watchlist.md` backlog file's status is updated to clarify "perpetual capture reminder; skill extraction triggers at N≥2".
- **SC-3**: `f-struct-01-jq-sh-env-passthrough.md` backlog file's status moves from `open` to `closed` with the inline closure note citing `159eb21` lines 73-77.
- **SC-4** (CONDITIONAL on DL-4 = β-1): `.gobbi/projects/gobbi/design/session-lifecycle-worktree-boundaries.md` lands using `memorization/templates/design.md`, structured per the backlog § "Suggested approach" 5-section shape.
- **SC-5**: All scoped backlog files are updated (closed or status-noted) in the same PR as the skill stamping, satisfying Iron Law 8 (docs ship with implementation).
- **SC-6**: PR description references the witness for each in-scope item (Iron Law 10).

### Deferred

- `f-risk-01-subagent-ccsi-semantics` — out of Bundle C; needs its own Ideation per the backlog's own recommendation (`.gobbi/projects/gobbi/backlogs/f-risk-01-subagent-ccsi-semantics.md` § "Suggested next step").
- Theme β (if user picks β-2 at DL-4) — defer to next session after this one's Wrap-up demonstrates end-to-end N=2.
- `gobbi-hook-authoring` skill's "Mistakes / anti-rationalizations" body section — must stay sparse this session because zero hooks-domain mistakes exist. Section becomes substantive at N≥2 (separate trigger; see In-Scope #2).

---

## Framed Problem

**Root cause**
Bundle B (PR #268, commit `dfb7d6d`, merged 2026-05-23) landed the worktree-first + agents[] hooks foundation but, by Iron Law 11 (no metric gaming) and Principle 10 (witness-bound), deferred four follow-up artifacts to backlogs rather than over-stuffing the bundle: hook-authoring skill, hooks-domain mistakes watchlist, session-lifecycle design doc, plus 2 carried-over pre-Bundle-B items from env-var-audit (`f-risk-01`, `f-struct-01`). The deferral was correct at the time. After Bundle B's merge, the deferral triggers for SOME (not all) of those items have fired: `post-tool-use-agents.sh` now exists as the N=2 witness for hook-authoring, and `f-struct-01`'s suggested fix is empirically present in shipped code. The root cause of this session is **deferred-witness debt that has come due** — 3 of 5 items have triggers fired; 1 is resolved; 1 still warrants its own dedicated Ideation.

Evidence:
- `git log --oneline --since=2026-05-21 -- .claude/ .gobbi/projects/gobbi/` shows `dfb7d6d` (Bundle B) + `7c0a6d0` (Bundle A) + `159eb21` (env-var-audit) all merged.
- `wc -l .claude/hooks/{session-start.sh,post-tool-use-agents.sh}` returns 79 + 251 lines = 2 working hook witnesses on develop.
- `.gobbi/projects/gobbi/mistakes/` listing shows 15 mistake files; zero carry `domain: hooks` (filter via grep — only `process` and `workflow` domains present).

**Impact**
- **Who is affected**: future hook authors (currently zero, but Bundle B's hooks infrastructure invites future surface area for PreToolUse / SubagentStop / Stop events); project memory's mistakes-domain coverage (hooks gap is real); future session-lifecycle readers (the worktree-first design is distributed across 9+ surfaces with no single-doc explanation).
- **Severity**: medium per the 3 backlog files' own assessments (`gobbi-hook-authoring-skill.md` "effort: medium / 1 focused session"; `hooks-domain-mistakes-watchlist.md` "ad-hoc"; `session-lifecycle-...md` "effort: medium / post-T1 ship"). No production blocker — each backlog file says "not needed in-session" for its own surface.
- **Cost of inaction**: deferred witness debt accumulates. The longer the gap, the staler the witnesses; specifically the design doc's "as conceived vs. as held up" lesson becomes weaker as memory of T1's actual surfaces fades.

**Success criteria**
- See Scope Contract § "Success Criteria" SC-1..SC-6 above.

**Prior attempts**
- Bundle A (PR #267, `7c0a6d0`, 2026-05-23) addressed orchestration/workflow polish; did not touch these 5 items.
- Bundle B (PR #268, `dfb7d6d`, 2026-05-23) shipped T01–T10 worktree-first + agents[] hooks; explicitly deferred the 3 items anchored to its session. Bundle B's HANDOFF at `.gobbi/projects/gobbi/sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/HANDOFF.md` lines 14-15 records the deferral state at emergency-stop.
- env-var-audit (PR #265, `159eb21`, 2026-05-22) deferred `f-risk-01` and `f-struct-01` to backlog; `f-struct-01`'s suggested fix went into the same PR's `session-start.sh` lines 73-77 inadvertently (per code inspection — Option A `printf '%q'` for passthrough re-exports). The backlog file was promoted with `status: open` regardless. So `f-struct-01` is in a "deferred-on-paper, resolved-in-code" state, which Bundle C cleans up.

**Counterfactual / steel-man**
Strongest argument against running Bundle C: "These 5 items are independently small; just close them ad-hoc in future feature sessions as triggers fire. Don't manufacture a Bundle C just to absorb backlog cruft." Counter-evidence: (i) the user picked this direction explicitly from a 4-option list (manager → user → confirmed); (ii) Theme α's two items are paired by design (the skill backlog cites the watchlist as input); (iii) `f-struct-01`'s open-vs-shipped-code inconsistency is itself a docs-sync defect (Iron Law 8) that should not linger; (iv) post-Bundle-B is the precise moment when witness triggers fire — letting them lapse without action increases defer-policy-rationalization risk over time. The steel-man stands partially — it correctly warns against over-bundling — and motivates the descope to **3 in-scope items (or 2 with β-2)** rather than blindly lifting all 5.

**Re-framing conclusion**
None — the literal ask ("Bundle C foundation follow-ups") is the right framing. The re-framing test would be "should this be a single Ideation on subagent semantics + a single design doc + a hook skill?", which is exactly the descope this draft proposes. The framing is preserved; the SCOPE is descoped.

---

## Research Insights

### Internal Insights

**I-1 — N=2 hook witnesses exist on develop**
- **Source**: `.claude/hooks/session-start.sh` (79 lines, `set -euo pipefail` line 27, `jq -r @sh` lines 51-66, `printf '%q'` passthrough lines 73-77); `.claude/hooks/post-tool-use-agents.sh` (251 lines, in Bundle B PR #268 stat from `git show dfb7d6d --stat`).
- **Insight**: The N=2 witness threshold the `gobbi-hook-authoring-skill` backlog explicitly required is satisfied as of `dfb7d6d`'s merge. Both witnesses encode the same pattern stack — strict mode + ENV_FILE guard + jq quoting + REQUIRED/OPTIONAL/PASSTHROUGH partitioning. `post-tool-use-agents.sh` additionally introduces flock + dual-event registration + two-tier extraction + tool_use_id correlation per the backlog file's "Context" section.
- **Why**: Confirms the skill backlog's lift trigger; informs Sub-step D design as the source-of-truth for what the skill body codifies.

**I-2 — `f-struct-01`'s suggested fix is present in shipped code**
- **Source**: `.claude/hooks/session-start.sh` lines 73-77: `for _var in CLAUDE_PROJECT_DIR CLAUDE_PLUGIN_ROOT CLAUDE_PLUGIN_DATA; do if [[ -n "${!_var:-}" ]]; then printf 'export %s=%q\n' "${_var}" "${!_var}" >> "${CLAUDE_ENV_FILE}"; fi; done`. Compare backlog file `.gobbi/projects/gobbi/backlogs/f-struct-01-jq-sh-env-passthrough.md` § "Suggested resolution" Option A: `printf 'export CLAUDE_PROJECT_DIR=%q\n' "$CLAUDE_PROJECT_DIR" >> "$CLAUDE_ENV_FILE"`. Substantively the same pattern.
- **Insight**: The backlog item is empirically resolved by code merged in `159eb21` (env-var-audit PR #265). Closing the backlog is documentation cleanup, not new implementation work.
- **Why**: Drives the recommendation to close `f-struct-01` inline as part of Bundle C rather than carry it forward as open work.

**I-3 — `f-risk-01`'s doc-level risk persists post-Bundles-A+B**
- **Source**: `mistake/SKILL.md:129` reads `{session-id} — Claude Code session ID from $CLAUDE_CODE_SESSION_ID`; `research/SKILL.md:145` carries identical text. Grep across the 12 skills cited in `.gobbi/projects/gobbi/backlogs/f-risk-01-subagent-ccsi-semantics.md` (mistake, wrap-up, research, orchestration/workflow/evaluation, planning, execution, ideation, memorization, interview, evaluation, preparation, gobbi) confirms the pattern persists.
- **Insight**: `f-risk-01` is real and unresolved. Operational risk is low (delegation prompts pass parent session-id explicitly, per the manager's current practice — see current session's delegation prompt header structure), but the documentation risk identified in the backlog still applies.
- **Why**: Confirms the deferral recommendation: this is a documentation-redesign decision across 12 surfaces, not a sub-task of Bundle C.

**I-4 — Bundle B's HANDOFF claims "emergency stop" but the merged PR shipped all 10 tasks**
- **Source**: `.gobbi/projects/gobbi/sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/HANDOFF.md` line 3: "EMERGENCY STOP mid-Execution". But `git show dfb7d6d --stat` shows all 13 files Bundle B set out to ship (orchestration row 5.5, git skill qualifier, preparation narrow-exception, hooks, scripts, settings, etc.). The merge commit message reads "15 commits, T01-T10" — full bundle.
- **Insight**: The Bundle-B HANDOFF artifact is stale relative to the merged PR. The "follow-up" session that completed T02–T10 wrote (or did not write) a separate HANDOFF; the env-var-audit session HANDOFF was also not written (`ls 2026-05-22-bac669ad/.../HANDOFF.md` returns "no such file"). This is a docs-sync mistake worth noting in Wrap-up but does NOT block Bundle C scope decisions.
- **Why**: Trust the merged git tree, not the partial HANDOFF, when reasoning about what shipped. Recorded here so the Bundle C planning doesn't accidentally re-derive an obsolete "emergency stop" framing.

**I-5 — Project mistakes show recent post-Bundle-B captures around worktree edits**
- **Source**: `.gobbi/projects/gobbi/mistakes/executor-mirror-path-vs-worktree-physical-copy.md` (2026-05-24, session `1b26cf20`, domain `process`), `manager-context-overflow-with-large-bundle.md` (same date, finding-id WRAP-MIST-003, domain `process`).
- **Insight**: Bundle B's Wrap-up generated several process-domain mistakes around worktree/main-tree path discipline and bundle-size discipline. These constrain Bundle C's plan: keep the task count modest (≤ 5 tasks) and use worktree-absolute paths in every executor brief.
- **Why**: Directly bears on Bundle C's planning approach. Cited for Planning, not for Idea scope decisions.

### External Insights

External research was scoped down for this Ideation: the candidate items are all internal documentation / skill / backlog work in the project's own conventions. No new library, framework, or external API is being adopted. The witness for each item is internal-only by design (the witness IS the project's own merged code and prior session memory). Per `research/SKILL.md` "Stay in scope" and "Insights, not link dumps" principles, external research was deliberately limited to the **one** decision where prior art could materially shift direction: the choice of writing direction for project skills.

**E-1 — Anthropic's published skill-authoring guidance for Claude Code**
- **Source**: `docs.anthropic.com/en/docs/claude-code/skills` (Anthropic Claude Code skills documentation) — canonical structure: name, description, allowed-tools, body procedures.
- **Insight**: The project's existing skills (e.g., `mistake/SKILL.md`, `research/SKILL.md`) already conform to this shape — frontmatter + Core Principles + Procedures + Constraints + Output paths. Bundle C's `gobbi-hook-authoring` skill should follow the same shape, not invent a project-local schema.
- **Why**: Anchors the skill template choice (use `interview/templates/project-skill.md` as the backlog itself recommends).

**E-2 — `printf '%q'` is Bash-specific; portable shell uses `printf '%s'` + manual quoting OR sh-safe library**
- **Source**: GNU Bash manual `printf` builtin (`gnu.org/software/bash/manual/bash.html#index-printf`) — `%q` produces a string Bash can re-parse safely; not part of POSIX sh.
- **Insight**: `session-start.sh` line 1 declares `#!/usr/bin/env bash` (line 1) and line 71 comments `Uses bash %q for shell-safe quoting (safe here: shebang is bash).` This is a deliberate, audited choice consistent with f-struct-01's "Option A" Bash-bound pattern. The `gobbi-hook-authoring` skill should document this Bash-vs-POSIX boundary so future hook authors don't port the pattern blindly to a `/bin/sh` shebang.
- **Why**: Direct input to the skill body's "Strict-mode preamble" and "jq quoting discipline" sections.

External insight target was the minimum needed to anchor the directional design decisions. Coverage is sufficient.

---

## Scenarios

**S-1 (golden, Theme α)** — A future contributor adds a third hook (`pre-tool-use-validator.sh`). They load the new `gobbi-hook-authoring` project skill, read the strict-mode + ENV_FILE guard + jq quoting sections, and emit a hook that satisfies the same pattern stack without reinventing it. The skill's "Mistakes / anti-rationalizations" section is initially sparse (zero hooks-domain mistakes yet); contributor encounters one during execution; moment-of-capture stages a mistake-candidate per `mistake/SKILL.md` P2; the hooks-domain mistake count becomes N=1.

**S-2 (golden, Theme β — IF β-1)** — A new contributor (or a future reader of the project) asks "where do session writes go relative to worktree boundaries?" Today they grep across 9+ surfaces. After Bundle C ships, they read `.gobbi/projects/gobbi/design/session-lifecycle-worktree-boundaries.md` and get the answer in one document with pointers to the 9 distributed implementation surfaces.

**S-3 (edge, Theme α)** — `mistake/SKILL.md` domain-tag list update is small enough to merit a single skill edit. Verification: `grep -n "domain" mistake/SKILL.md` after the edit shows `hooks` listed alongside `process`, `workflow`, etc. The backlog file's status update is a single frontmatter line change.

**S-4 (failure, scope-drift)** — During Bundle C execution, an executor sees the f-risk-01 backlog file and wants to "fix it while they're in here" by editing the 12 cited skills. This violates Iron Law 4 (scope is bounded) and Iron Law 10 (witness-bound, but a different witness — that decision needs its own Ideation). Bundle C planning must explicitly out-of-scope this; executor briefs must NOT include f-risk-01 in any allowed-paths list.

**S-5 (failure, defer-policy-rationalization)** — During Bundle C execution, an executor decides to write a substantive `hooks-domain-mistakes-watchlist.md` artifact (e.g., "5 anticipated pitfalls"). This is Iron Law 10 violation — zero hooks-domain mistakes exist; the watchlist content would be speculation. Plan must constrain Theme α paired-item resolution to the smallest concrete change the witness supports (per In-Scope #2).

**S-6 (adversarial, witness staleness)** — A reviewer challenges the gobbi-hook-authoring skill's "two-tier extraction" pattern, citing that only `post-tool-use-agents.sh` uses it (`session-start.sh` does not). Response: the skill body documents two-tier extraction as a `post-tool-use-agents.sh`-specific pattern within a "Patterns by event type" section; not all hooks use it. Witness count is N=1 for two-tier extraction, but N=2 for the broader strict-mode + ENV_FILE + jq stack. Skill body must distinguish per-pattern witness counts.

---

## Implementation Checklist

Per `ideation/SKILL.md` Sub-step D-2: every item anchored to a confirmed insight.

- **CL-1**: Stage `gobbi-hook-authoring/SKILL.md` at `sessions/.../preparation/staging/skills/gobbi-hook-authoring/SKILL.md` using `interview/templates/project-skill.md`. Body sections per backlog § "Suggested approach" 4-8. Anchored to I-1, E-1, E-2.
- **CL-2**: Promote staged skill to `.gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md` via worktree-branch commit per `preparation/SKILL.md` narrow-exception (updated by Bundle B T03/T10). Anchored to I-1, I-5.
- **CL-3**: Edit `mistake/SKILL.md` to add `hooks` to the documented domain-tag examples list. Anchored to I-1 + the backlog's own § "Suggested approach" tail bullet ("Add a `hooks` domain tag convention to `mistake/SKILL.md`").
- **CL-4**: Update `.gobbi/projects/gobbi/backlogs/hooks-domain-mistakes-watchlist.md` status field to clarify perpetual-capture-reminder semantics + skill-extraction trigger condition. Anchored to backlog file's own § "Why deferred".
- **CL-5**: Update `.gobbi/projects/gobbi/backlogs/f-struct-01-jq-sh-env-passthrough.md` frontmatter `status: open` → `status: closed`, add `closed_by: 159eb21`, append inline closure note citing `session-start.sh` lines 73-77. Anchored to I-2.
- **CL-6** (CONDITIONAL on DL-4 = β-1): Write `.gobbi/projects/gobbi/design/session-lifecycle-worktree-boundaries.md` using `memorization/templates/design.md`, structured per the backlog § "Suggested approach" 5-section shape (problem / approach / surfaces / validation / lessons). Anchored to I-4 + backlog file's own structure.
- **CL-7**: PR description and commit messages cite the witness for each item per Iron Law 10 (`gobbi-hook-authoring`: `dfb7d6d` two hooks; `mistake/SKILL.md` edit: backlog tail bullet; `f-struct-01` close: `159eb21` lines 73-77; design doc: T1 shipped via `dfb7d6d`). Anchored to all of the above + project mistake `worktree-physical-file-missing-when-checked-out.md` discipline.

---

## Design

Directional design decisions (no implementation detail; mechanism is Execution-scope).

**D-1 — Skill body sourcing pattern**
- **Decision**: The `gobbi-hook-authoring` skill body sources content from the 2 hook witnesses + Bundle B/env-var-audit session memory + this Ideation's Decisions Log. No external prior art is copied in.
- **Rationale**: Anchored to I-1 (N=2 internal witnesses exist; sufficient on their own per the backlog's witness premise) and E-1 (project skills follow Anthropic-doc shape; no new external dependency).
- **Validation**: Manual review by the Planning evaluator confirms every section traces to an internal witness file path or session-memory file path.

**D-2 — Watchlist resolution shape (smallest-witness-supports)**
- **Decision**: Theme α paired item resolves via (a) single skill edit (`mistake/SKILL.md` domain tag list) + (b) single backlog file status update. NO new artifact (no `watchlist.md` file).
- **Rationale**: Anchored to backlog file `hooks-domain-mistakes-watchlist.md` § "Suggested approach" ("ad-hoc per execution session — no large pre-meditated work") and Iron Law 10 (zero hooks-domain witnesses → no speculative content). This sizes the resolution to exactly the witness available.
- **Validation**: Grep `domain` in `mistake/SKILL.md` after edit shows `hooks` listed; grep `status` in the backlog file shows the clarified semantics. The skill-extraction trigger remains future-deferred (backlog file still active, just clarified).

**D-3 — f-struct-01 close-in-PR-with-Bundle-C**
- **Decision**: Bundle C's PR includes the `f-struct-01` backlog status update inline as a small "doc cleanup" commit, not as a separate PR.
- **Rationale**: Anchored to I-2 (code already shipped) and Iron Law 8 (docs ship with implementation — here the implementation was earlier, but the docs-update belongs at first opportunity).
- **Validation**: PR body's "Closes/Updates" section cites the f-struct-01 backlog file and the parent commit `159eb21`.

**D-4 — f-risk-01 out-of-scope, with a structured pointer for the future**
- **Decision**: Bundle C's Wrap-up HANDOFF includes an explicit "next Ideation candidate" section pointing at f-risk-01 with the 3 candidate mitigations from the backlog file.
- **Rationale**: Anchored to I-3 (still real) and Iron Law 4 (Bundle C scope is bounded); backlog file § "Suggested next step" explicitly asks for its own Ideation.
- **Validation**: Next-session manager's `/gobbi` resume reads HANDOFF and the f-risk-01 candidate surfaces in the direction-picker.

**D-5 — Theme β decision (β-1 vs β-2) — PENDING USER**
- **Decision**: Defer DL-4 to AskUserQuestion (manager-owned). Leader recommendation is β-2 (defer Theme β to the next session for empirical N=2 lessons).
- **Rationale**: Anchored to I-4 (Bundle B HANDOFF is stale; this session is the first true worktree-pr end-to-end demonstrator; one demonstrator is insufficient lessons material). The user has authority on this — it's a workflow-cadence decision (Iron Law 9 — judged from user's POV).
- **Validation**: User picks β-1 or β-2 via AUQ; the Scope Contract finalizes accordingly before Sub-step D's WORK staging.

**D-6 — Task count cap from Bundle B Wrap-up mistake**
- **Decision**: Bundle C's plan caps at ≤ 5 implementation tasks (CL-1..CL-6) to avoid the `manager-context-overflow-with-large-bundle` failure mode.
- **Rationale**: Anchored to I-5 (Bundle B's own captured process-domain mistake recommends ≤ 8 plan tasks AND iter-cap × dual-system math; Bundle C at 5-6 tasks with iter ≤ 2 is well within budget).
- **Validation**: Planning loop's task count check passes; no mid-Execution context-pressure escalations.

### Validation strategy (loop-level)

- **Pre-WORK**: Manager runs AskUserQuestion on DL-4 (Theme β β-1 vs β-2) and confirms the Scope Contract.
- **WORK**: Leader writes the rawdata draft (this file finalized) + stages references + stages backlog updates.
- **EVALUATION**: Dual-system (Claude + Codex) per `evaluation/SKILL.md`. Perspectives selected per `orchestration/workflow/evaluation.md` (Project + Overall always; recommend Consistency + Risk for this scope-heavy bundle).
- **MEMORIZATION**: On PASS, write canonical `artifacts/bundle-c-ideation-pass.md` for Planning consumption. On REVISE, re-enter DISCUSSION with findings.

---

## Decisions Log

This iter1 draft was produced by the leader in a single pass under Auto-mode directive (no inter-step AUQ exchanges yet). All decisions below are LEADER PROPOSALS — they become user-confirmed on the manager's AskUserQuestion before WORK staging.

| # | Decision | Status | Source |
|---|---|---|---|
| LDP-1 | Cluster splits into 2 themes (α: hook-authoring + watchlist; β: design doc) | PROPOSED | TL;DR rationale + In-Scope §; Iron Law 4 |
| LDP-2 | `f-struct-01` recommended close — fix in `session-start.sh` lines 73-77 | PROPOSED | I-2 |
| LDP-3 | `f-risk-01` recommended deferred — own Ideation | PROPOSED | I-3 + backlog § "Suggested next step" |
| LDP-4 | Theme β β-1 (ship now) vs β-2 (defer next session) | **PENDING USER** (DL-4) | D-5 |
| LDP-5 | Watchlist item resolves via smallest-witness-supports edit (mistake/SKILL.md domain tag + backlog status update) | PROPOSED | D-2 + backlog § "Suggested approach" |
| LDP-6 | Feature name = `session-foundations-bundle-c` | PROPOSED | DL-1 |
| LDP-7 | Task count ≤ 5–6 (CL-1..CL-6) to honor Bundle B Wrap-up mistake | PROPOSED | I-5 + D-6 |
| LDP-8 | Bundle B HANDOFF "emergency stop" framing is stale; trust merged tree | LEADER-NOTED | I-4 — recorded for Wrap-up |

### Memory reads register (Sub-step A required enumeration)

| Path | Purpose | Read result |
|---|---|---|
| `.gobbi/projects/gobbi/backlogs/f-risk-01-subagent-ccsi-semantics.md` | Primary spec | Read in full |
| `.gobbi/projects/gobbi/backlogs/f-struct-01-jq-sh-env-passthrough.md` | Primary spec | Read in full |
| `.gobbi/projects/gobbi/backlogs/gobbi-hook-authoring-skill.md` | Primary spec | Read in full |
| `.gobbi/projects/gobbi/backlogs/hooks-domain-mistakes-watchlist.md` | Primary spec | Read in full |
| `.gobbi/projects/gobbi/backlogs/session-lifecycle-worktree-boundaries-design-doc.md` | Primary spec | Read in full |
| `.gobbi/projects/gobbi/sessions/2026-05-23-1b26cf20-.../HANDOFF.md` | Anchor session deferral rationale | Read; flagged as stale (I-4) |
| `.gobbi/projects/gobbi/sessions/2026-05-22-bac669ad-.../` | env-var-audit anchor — no HANDOFF.md found | Confirmed absence; not blocking |
| `.gobbi/projects/gobbi/mistakes/` (15 files; spot-read 2) | Domain filter for process/workflow/hooks | Zero `domain: hooks`; many `domain: process` |
| `.claude/hooks/session-start.sh`, `.claude/hooks/post-tool-use-agents.sh` | N=2 witnesses for Theme α | Both present; pattern confirmed |
| `.claude/skills/git/SKILL.md`, `.claude/skills/orchestration/SKILL.md` | Verify Bundle B's row 5.5 + worktreePath rules shipped | Confirmed (`git show dfb7d6d --stat`) |
| `.claude/skills/mistake/SKILL.md`, `research/SKILL.md` (and 10 others by reference) | Verify f-risk-01 persistence | `$CLAUDE_CODE_SESSION_ID` still cited literally in path conventions sections |
| `.gobbi/projects/gobbi/rules/stub-redirect-format.md` | Project rule (only one) | Read; not directly applicable to this Ideation but noted for future doc-supersession work |
| `git log --oneline --since=2026-05-21 -- .claude/ .gobbi/projects/gobbi/` | Confirm Bundles A+B + env-var-audit merge state | Confirmed at `cf426f7`, `dfb7d6d`, `7c0a6d0`, `159eb21` |

---

## Open questions for the user (for manager to surface via AskUserQuestion)

### Q1 — Theme β timing (DL-4 / LDP-4)

**Question**: "The session-lifecycle design-doc backlog requires N=2 end-to-end worktree-pr sessions before authoring (per its own 'When to pick up' clause). This session is the first true worktree-pr ship; the design doc's 'lessons-learned-after-N=2' section will be shallow if written now. Pick one:"

- **β-2 (Recommended)**: Defer Theme β to the next session. Ship only Theme α (2 in-scope items + 1 close) in Bundle C.
- **β-1**: Ship Theme β this session. Self-count this session + the prior Bundle B as N=2; the design doc's lessons section will draw from Bundle B's process-mistake captures + this session's smoke-test result.

### Q2 — Bundle C feature name confirmation

**Question**: "Proposed `session.json.feature` value is `session-foundations-bundle-c`. If you pick β-1, the name fits. If you pick β-2, the name still fits (3→2 items) but you could alternatively name it `gobbi-hook-authoring-bundle` to reflect the pure-Theme-α framing. Pick one:"

- **Recommended**: `session-foundations-bundle-c` (keep the name; covers both Q1 outcomes).
- Alternative: `gobbi-hook-authoring-bundle` (only if Q1 = β-2; tighter cluster framing).

### Q3 — f-struct-01 close confirmation

**Question**: "f-struct-01's suggested fix is already present in shipped `session-start.sh` lines 73-77 (`printf '%q'` for passthrough re-exports — Option A from the backlog file's own suggested resolution). Recommend closing the backlog file inline as part of Bundle C's PR (single-line frontmatter + closure note). Confirm?"

- **Yes (Recommended)**: Close inline.
- **No**: Leave open; address in a separate doc-cleanup pass.

### Q4 — f-risk-01 defer confirmation

**Question**: "f-risk-01 is real (skill docs at `mistake/SKILL.md:129` etc. still cite `$CLAUDE_CODE_SESSION_ID` literally) but its own backlog file recommends its own Ideation session because it touches 12 skills + has 3 mitigation candidates. Recommend deferring out of Bundle C. Confirm?"

- **Yes (Recommended)**: Defer; HANDOFF surfaces it as next-Ideation candidate.
- **No**: Absorb into Bundle C (scope-expansion risk — would violate Iron Law 4 unless rescoped explicitly).

---

## Deferred (recap)

- `f-risk-01-subagent-ccsi-semantics` — out of Bundle C; own Ideation needed.
- Theme β (`session-lifecycle-worktree-boundaries-design-doc`) — conditional on Q1 answer.
- Skill-extraction trigger for hooks-domain mistakes (N≥2 threshold not yet met) — remains deferred regardless of Bundle C outcome.
- Smoke-test gate T1.h (orchestration row 5.5 worktree creation verification) — Memorization-scope, not Ideation; flagged for this session's Wrap-up.

---

**End of draft-iter1.md**
