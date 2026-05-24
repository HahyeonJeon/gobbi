# Project — iter1 Claude

## Stage 0 — Artifact Summary

**Artifact**: `sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/ideation/rawdata/draft-iter1.md` — Ideation Loop iter1 WORK output for feature `session-foundations-bundle-b` (T1 worktree-first session architecture with NEW absorbed; T3 session.json subagent metadata PostToolUse hook + shell-script reconstructor; T2 deferred mid-Sub-step D).

**What** — Two scoped infrastructure changes: (T1) move worktree creation from Execution-start to Configuration row 5.5; absorb NEW (Preparation `generate-now` commit-on-branch); qualify `git/SKILL.md:33` rule; per-iteration session-memory commits. (T3) Bash+jq PostToolUse hook + reconstructor populating `session.json.agents[]` from transcript `toolUseResult`.

**Why** — Witness `1829fa3` (PR #267 shipped `.gobbi/projects/gobbi/skills/codex/SKILL.md` body without its `.claude/skills/codex/SKILL.md` + `.agents/skills/codex` symlinks because they were authored from main-tree `cwd` and never landed on the worktree branch). Witness T3-I-1 — `agents[]` length = 1 after 17+ Task spawns in prior session 7ea62d36 (~95% data loss).

**How** — Doc edits across `orchestration/SKILL.md` (row 5.5 insert + row 6 narrative replacement), `git/SKILL.md` (qualified rule + Matrix row + P2 note), `preparation/SKILL.md:62` (extend narrow exception with `git -C "$worktreePath" add/commit`), `gobbi/SKILL.md` (cross-ref), 5 `workflow/{loop}.md` (per-iteration commit cadence), `delegation/SKILL.md` (structured-header convention); 2 new shell scripts under `.claude/{hooks,scripts}/`; 1 `.claude/settings.json` block.

**W/W/H gate** — PASS. What is concrete (file edits enumerated + 2 new scripts). Why is witness-anchored (`1829fa3` + empirical `len(agents[])==1`). How has actionable first steps + cited line numbers; "detailed mechanism deferred to Execution" is a legitimate Ideation deferral.

**Scope Contract source** — embedded in artifact frontmatter + § Scope Contract; In/Out enumerated explicitly; 8 deferred items routed to specific backlog files (verified extant).

**Downstream consumers** — Planning (decomposes into ordered tasks; § Cross-task observations § Ordering recommendation supplies 9-task seed); Execution (file-by-file edits + 2 new shell scripts); Wrap-up (PR merge ships session memory).

### Memory reads

- `.claude/skills/principles/SKILL.md` (Iron Laws + Principle 12 W/W/H gate)
- `.claude/skills/mistake/SKILL.md`
- `.claude/skills/evaluation/SKILL.md` (Stage 0–3 procedure + Finding schema)
- `.claude/skills/ideation/evaluation.md` (per-perspective seed scenarios)
- `.claude/skills/git/SKILL.md` (lines 17–35, 153–165) — citation verification
- `.claude/skills/preparation/SKILL.md` lines 55–75 — citation verification
- `.claude/skills/orchestration/SKILL.md` lines 95–115 — citation verification
- `.claude/skills/orchestration/templates/session.template.json` lines 1–60 — schema verification
- `.claude/skills/git/conventions.md` lines 118–162 — trailer format verification
- `.claude/skills/gobbi/SKILL.md` lines 35–44, 113–120 — citation verification
- `.claude/settings.json` lines 30–42 — hook block shape verification
- `.gobbi/projects/gobbi/rules/stub-redirect-format.md`
- All 7 promoted mistakes under `.gobbi/projects/gobbi/mistakes/`
- All 12 staged references at `sessions/.../ideation/staging/references/` (sampled `claude-code-hooks-12-lifecycle-events.md` + `claude-code-posttooluse-hook-schema.md`)
- 8 staged backlog items (1 feature + 7 project) — existence + content verified
- Prior session transcript line 164–165 at `~/.claude/projects/-playinganalytics-git-gobbi/7ea62d36-...jsonl` — T3-I-2 claim empirically confirmed (toolUseResult.usage has 10 keys including input_tokens/output_tokens/cache_read_input_tokens/cache_creation_input_tokens, matching the draft's claim)
- `.gobbi/projects/gobbi/features/` — listed: `env-var-audit`, `gobbi-orchestration-workflow-improvements`, no overlap with `session-foundations-bundle-b`
- Sub-step A/C/D rawdata files (full read)

## Stage 1 — Locked Frame

### Scenarios (Project)

**S-P-1: Root cause is actual root cause, not symptom** (seed)
- [a] "Why?" terminates at a cause that, if absent, would obviate the work
- [b] Prior attempts are documented (or "no prior attempts" affirmatively confirmed)
- [c] No scope drift between framed problem and design

**S-P-2: Scope Contract is sharp enough for executor refusal** (seed)
- [a] Explicit feature / out-of-scope fields with non-overlapping boundaries
- [b] Backlog routing exists for every non-chosen candidate task
- [c] No "etc." / "and related" phrasing

**S-P-3: "Why now?" concrete + measurable success criteria** (seed)
- [a] Success criteria observable from artifacts, not vibes
- [b] Trigger named with specific reference (commit, session, issue)

**S-P-4: Counterfactual taken seriously, not strawmanned** (seed, adversarial)
- [a] Counterfactual presents strongest "do nothing" argument
- [b] Reason for rejection stated with evidence

**S-P-5: Re-framing check produced defensible outcome** (seed)
- [a] Re-framing outcome recorded with reasoning
- [b] If "no change" — defensible against alternative framings

**S-P-6: Adjacent feature/scope absorbs this idea quietly** (seed, adversarial)
- [a] Idea checked against `.gobbi/projects/gobbi/features/` — no silent overlap
- [b] Any overlap is explicit split or merge

**S-P-7: Risky premise has an assumption-ledger entry** (seed)
- [a] Load-bearing assumptions named
- [b] Each cites evidence OR is surfaced as `assumption_risk`

**S-P-8: Hypothesis / testability stated** (seed)
- [a] Observable confirming signal named
- [b] Observable falsifying signal named

**S-P-9: Prior-art search real, not nominal** (seed)
- [a] Search ran across project memory + codebase + adjacent libs + community
- [b] Negative results recorded
- [c] Top-3 closest prior arts characterized

**S-P-10: Citation discipline — every line-number claim survives verbatim re-check** (adversarial, NEW from `manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md`)
- [a] Every `file:line` citation resolves to the asserted content
- [b] Every "verbatim" quote can be `grep`-found at the cited path
- [c] No drift between Sub-step C and the draft's restatement

### Coverage Ownership matrix items routed elsewhere
- Privacy, Cost — Risk owns
- Accessibility, I18n, Observability — Usage owns

## Stage 2 — Findings

### S-P-1 results
- [a] PASS — "Why" for T1 terminates at "cwd is main tree until Execution → symlink misroutes" (witness `1829fa3`); for T3 at "manager has no synchronous side-channel from Task return → manager forgets to append" (witness `len(agents[])==1`). Both causes are necessary conditions whose absence would obviate the work.
- [b] PASS — § Prior attempts enumerated per task: T1 cites `codex-eval-session-write-path-nested-in-worktree.md` (inverse), `preparation/SKILL.md:62` narrow exception, `1829fa3` finalize hand-fix; T3 explicitly "None on record" with rationale.
- [c] PASS — Design D-1/D-2/D-3/D-4/D-5 each anchors to the T1 framed problem; D-3-1/D-3-2/D-3-3/D-3-4 each anchor to the T3 framed problem; no design item escapes framing.

### S-P-2 results
- [a] PASS — In-Scope enumerates 2 items; Out-of-Scope enumerates 7 items; non-overlapping.
- [b] PASS — Deferred section lists 8 items; each routes to a specific staging path; all 8 backlog files exist at the cited paths (verified via `ls`).
- [c] PASS — No "etc." / "and related" found by reading the Scope Contract section verbatim.

### S-P-3 results
- [a] PASS — Success criteria are observable: `jq '.git.worktreePath' session.json` non-null; `len(agents[]) >= N+1`; commit subjects match `^chore\(session\): record .* iter[0-9]+ memory$`.
- [b] PASS — Witnesses cited: `1829fa3` SHA, `len(d['agents'])==1` python command, `session.json:285`.

### S-P-4 results
- [a] PARTIAL — Strongest "do nothing" steel-man is presented as "bootstrap cost of worktree + dependency install on every session." Counter-evidence is "this repo has no `package.json` at root." This is solid for *this* project, but the steel-man does not address a stronger argument: **read-only investigation sessions where worktree-first creates branch + commit noise even when no shippable artifact is produced**. The E-2 scenario merely accepts this cost rather than steel-manning against it. The draft's own E-2 description ("This is heavier than the prior 'main-tree direct' path") concedes the cost without rebutting.
- [b] PASS — Reason recorded.

### S-P-5 results — PASS. Sub-step A round 2 CP-1.3-β confirmed worktree-first lock; CP-NEW-β confirmed NEW dependency on T1; CP-1.2-α and CP-1.2-β resolved before T2 deferral.

### S-P-6 results
- [a] PASS — `ls .gobbi/projects/gobbi/features/` returns `env-var-audit`, `gobbi-orchestration-workflow-improvements`, `README.md`. The 7ea62d36 mistakes are tagged `feature: gobbi-orchestration-workflow-improvements`. T1 + T3 share infrastructure but are scoped under a NEW feature `session-foundations-bundle-b` which has no features/ directory yet (draft is OK — feature is being framed THIS session per Ideation contract).
- [b] N/A.

### S-P-7 results
- [a] PASS — Implicit ledger: "the rich `toolUseResult` is empirical (currently observable but not in the documented public API)" — surfaced in Sub-step C and re-stated in draft F-2 mitigation.
- [b] PARTIAL — The empirical-toolUseResult assumption is acknowledged but not formally tagged as `assumption_risk`. **The `PostToolUseFailure` event existence is taken from a community blog (`claudefa.st`); the official Claude Code hook schema doc cited in `claude-code-posttooluse-hook-schema.md` (T3-E-1) does NOT confirm `PostToolUseFailure` as a shell-command-supported event.** This is a load-bearing assumption for D-3-3 dual registration with no `assumption_risk` tag.

### S-P-8 results
- [a] PASS — Confirming signals: post-T1 next session has `git.worktreePath` non-null after Configuration; `len(agents[]) >= N+1`; `^chore\(session\): record .*` commit subjects.
- [b] PARTIAL — Falsifying signals are *implicit* in the success criteria (e.g., null `worktreePath` ⇒ T1 failed) but not stated as named falsifying signals.

### S-P-9 results — PASS (see Sub-step C — 4 external refs per task; deferred T2 references preserved).

### S-P-10 results (citation discipline, NEW adversarial)
- [a] FAIL — **D-3 specifies trailer `AI-Provenance-Record: gobbi://session/{session-id}/loop/preparation/promote-now`** (line 278 of the draft). But `git/conventions.md:118` shows the canonical format is `gobbi://session/{session-id}/task/{task-id}` — uses `task/`, not `loop/`. No `loop/` form appears anywhere in `conventions.md`. The draft INVENTED a non-canonical trailer path-segment. This is the EXACT shape of `leader-iter2-verification-claim-without-evidence.md`: a claim of conformance with a cited source where the cited source says something different.
- [b] PASS — All other line-number citations spot-checked: `git/SKILL.md:33` is the Critical rule paragraph (verified); `git/SKILL.md:155-162` is P2 Create worktree (verified, ends at line 161); `preparation/SKILL.md:62` is the narrow-exception paragraph (verified); `orchestration/SKILL.md:103` is row 6 (verified); `.claude/settings.json:31-39` is the SessionStart block (verified at lines 30–40); `gobbi/SKILL.md:39` is the `CLAUDE_TRANSCRIPT_PATH` row (verified); transcript line 165 toolUseResult.usage has the claimed keys (verified empirically).
- [c] PASS — No drift between Sub-step C → draft.

### Typed findings

```yaml
finding-id: P1-iter1
type: design_flaw
domain: process
disposition: open
confidence: 100
severity: High
surfaced-by: claude
```
**P1 — Invented `loop/` segment in `AI-Provenance-Record` trailer contradicts `git/conventions.md:118` canonical `task/` form.** Draft D-3 (line 278) and Implementation Checklist T1-I-T1.d (line 241) both prescribe `gobbi://session/{session-id}/loop/preparation/promote-now`. `conventions.md:118` defines the format as `gobbi://session/{session-id}/task/{task-id}` with no `loop/` variant. The promote-now commit is generated by Preparation loop, so a task-id-shape ("preparation-promote-now") would be a legitimate value — but the path segment must remain `task/{task-id}`. This is exactly the failure pattern of `leader-iter2-verification-claim-without-evidence.md` (claiming source-grounded fix with a non-source value). **If left unfixed, executor will write trailers that violate the locked convention.** Evidence: draft line 278, line 241; `git/conventions.md:118` (the only `AI-Provenance-Record:` row). Suggested direction: either (i) align to canonical `task/{task-id}` where `task-id` is `preparation-promote-now-iter{n}` or similar, OR (ii) propose an explicit extension to `conventions.md` and surface as a contribution point (currently no such CP exists).

```yaml
finding-id: P2-iter1
type: assumption_risk
domain: process
disposition: open
confidence: 75
severity: High
surfaced-by: claude
```
**P2 — `PostToolUseFailure` is treated as a confirmed Claude Code event but the official-docs reference (T3-E-1) does not confirm it for shell-command hooks.** Draft D-3-3 (line 314, 251) and Implementation Checklist T3-I-T3.c (line 251) prescribe registering `PostToolUseFailure` matcher `"Task"` in `.claude/settings.json`. Verification: `claude-code-posttooluse-hook-schema.md` (the T3-E-1 official-docs reference) mentions `PostToolUse` and `tool_use_id` but NOT `PostToolUseFailure`. `claude-code-hooks-12-lifecycle-events.md` (a `claudefa.st` community blog, T3-E-4) is the sole source for "Yes" availability for shell hooks. This is an empirical-vs-documented gap with no falsification plan. **If `PostToolUseFailure` is not actually shell-command-supported, failed-spawn audit fails silently — exactly the failure pattern T3 exists to prevent.** Evidence: `claude-code-posttooluse-hook-schema.md` lines 15–42 (no PostToolUseFailure mention); `claude-code-hooks-12-lifecycle-events.md` line 20 (sole community source). Suggested direction: tag D-3-3 as an `assumption_risk` requiring empirical verification at Execution-time (write a minimal failing-Task fixture; confirm the event fires), with explicit fallback design (PostToolUse-only registration).

```yaml
finding-id: P3-iter1
type: design_flaw
domain: process
disposition: open
confidence: 50
severity: Medium
surfaced-by: claude
```
**P3 — Steel-man for "do nothing on T1" doesn't address the strongest counter (read-only investigation sessions paying branch + commit overhead).** Draft § Counterfactual (line 100) rebuts only the "dependency-install cost" argument by noting "this repo has no `package.json` at root." But the stronger steel-man is: read-only investigation sessions (research-only, mistake-promotion-only, doc-lookup) create a worktree + branch + at-least-one session-memory commit + a PR for zero shippable change, generating noise in the issues/PR list. E-2 acknowledges this cost but accepts it rather than rebutting it. Evidence: draft lines 99–101, 197–198. Suggested direction: either steel-man more aggressively (state the stronger argument + counter), or accept the cost explicitly as a known trade-off ("uniform worktree-first costs investigation sessions a PR overhead; user-locked at Sub-step A round 1").

```yaml
finding-id: P4-iter1
type: checklist_gap
domain: process
disposition: open
confidence: 75
severity: Medium
surfaced-by: claude
```
**P4 — No checklist item explicitly verifies the migration path from THIS session through to the first post-merge session.** T1-I-T1.h is a one-line Wrap-up note flagging the migration boundary, but there is no concrete "smoke test" criterion the next session must satisfy other than "future-session check on `git.worktreePath` non-null." Concretely missing: (i) does THIS session ship its OWN T1 docs via the legacy main-tree path while the docs themselves describe the new path? (ii) what's the first command the next session runs to validate row 5.5 fired? (iii) where does the migration witness get recorded — Wrap-up summary, a mistake, or a new note? Evidence: draft lines 245, 322. Suggested direction: add T1-I-T1.h sub-checks: (h.1) confirm THIS session's PR commits land on its main-tree-side branch as-is; (h.2) define the precise `jq` command + expected non-null output as the validation gate; (h.3) decide where the migration-boundary witness is recorded.

### Low-confidence appendix
- (none above 25)

## Verdict

**REVISE** — P1 (`AI-Provenance-Record` `loop/` vs `task/`) is a High-severity citation-discipline failure at Confidence 100 — the exact shape of a previously-promoted mistake. P2 (`PostToolUseFailure` assumption) is a High-severity assumption-risk that compromises D-3-3. Neither rises to Critical (the rest of the artifact is sound and the fixes are local); both must be addressed before Planning consumes the draft.
