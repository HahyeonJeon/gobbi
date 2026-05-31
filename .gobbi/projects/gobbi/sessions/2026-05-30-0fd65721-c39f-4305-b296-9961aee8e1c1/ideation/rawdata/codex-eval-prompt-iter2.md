You are the Codex-side adversarial evaluator in a dual-system gobbi evaluation, iteration 2. A separate Claude evaluator judges the same artifact independently — divergence is the anti-groupthink signal. Be skeptical; verify, do not trust.

# What you are evaluating

The iter-2 REVISED IDEATION artifact (NOT an implementation) for packaging gobbi as a Claude Code plugin + authoring a claude-plugin skill. In iter-1 YOU (Codex) returned REVISE and the manager agreed; this iter-2 draft is the revision. Confirm your iter-1 findings are resolved and find anything still missing or newly broken.

Primary artifact (read IN FULL):
  .gobbi/projects/gobbi/sessions/2026-05-30-0fd65721-c39f-4305-b296-9961aee8e1c1/ideation/rawdata/draft-iter2.md

Your own iter-1 findings (verify each is resolved):
  .gobbi/projects/gobbi/sessions/2026-05-30-0fd65721-c39f-4305-b296-9961aee8e1c1/ideation/evaluation/iter1/codex/*.md
Discussion log (ratified decisions iter-1 + iter-2):
  .gobbi/projects/gobbi/sessions/2026-05-30-0fd65721-c39f-4305-b296-9961aee8e1c1/ideation/rawdata/discussion-log.md
Staged references (6, incl. 2 new):
  .gobbi/projects/gobbi/sessions/2026-05-30-0fd65721-c39f-4305-b296-9961aee8e1c1/ideation/staging/references/*.md

Verify internal/git claims against ground truth:
  .codex-plugin/plugin.json ; .claude/settings.json ; .claude/hooks/*.sh ; .gobbi/projects/gobbi/agents/ (note .md Claude prompts vs .toml Codex wrappers)
  git history: git show ba8aa42 (removed invalid hooks/agents fields) ; git show c79d28e (#251 materialize symlinks) ; git show 62b95a0:plugins/gobbi-core/... ; git show e083fad^:<old plugin.json path> for the last-live old manifest shape.

# User's binding iter-2 decisions the artifact must reflect (do NOT re-litigate; check fidelity)
1. Fresh v0.5 plugin named `gobbi` (NOT a gobbi-core resurrection).
2. The plugin ships ONLY skills + agents + hooks as a bounded self-contained package (.claude-plugin/plugin.json + skills/ + agents/ + hooks/). Install copies ONLY those — never session memory, never repo content. This SUPERSEDES iter-1 DD-2 (repo-root).
3. marketplace.json in scope (Claude schema). Skill = general guide + layered gobbi section at canonical path + .claude mirror symlink. Feature = install-runtime.

# iter-1 findings that MUST be resolved (state RESOLVED/UNRESOLVED for each)
- P1 (you rated High/100): false "no prior attempt" claim — must be corrected with git-sha-cited prior gobbi-core history mined for solutions.
- R1 (High/75): repo-root copies 77M session memory into cache — must be resolved by the bounded package + a cache-contents validation gate.
- S1 (High/75): `agents` key is an array of FILE PATHS that REPLACES the default dir; must enumerate the 5 role .md files and exclude .toml wrappers.
- U1 (High/75): worktree-local install can test the wrong checkout — must add a worktree-faithful test scenario.
- R2 (Medium/75): hook double-registration must be an explicit Planning-blocking decision with options + fire-exactly-once validation.
- U2 (Medium/75): permissions disposition must be user-operable.
- A1 (Medium/100): ratified/proposed label conflicts — must be consistent now.

# New crux to scrutinize
The draft recommends MATERIALIZED real copies (not symlinks) inside the bounded package, creating a canonical-tree↔package-copy drift/sync surface. Assess: is that the right call given the escaping-symlink-skip behavior and the #251 prior art? Is the drift/sync surface adequately named and assigned (to the claude-plugin skill / a build step)? Any unhandled failure mode?

# How to report
Write ONE markdown file per perspective into (dir exists):
  .gobbi/projects/gobbi/sessions/2026-05-30-0fd65721-c39f-4305-b296-9961aee8e1c1/ideation/evaluation/iter2/codex/
Files: project.md, structure.md, performance.md, aesthetics.md, usage.md, consistency.md, risk.md, overall.md
Walk the 7 perspectives in fixed order (project, structure, performance, aesthetics, usage, consistency, risk), one file each, then overall.md.

Each finding uses: Type (scenario_gap|checklist_gap|design_flaw|assumption_risk|general) / Severity (Critical|High|Medium|Low) / Confidence (0|25|50|75|100) / Evidence (path+quote or verified external fact + source) / Why-it-matters / Suggested-direction. For each iter-1 finding, explicitly mark RESOLVED or UNRESOLVED with evidence.

In overall.md synthesize and end with EXACTLY this last line: VERDICT: PASS  (or REVISE / FAIL), computed by:
  any Critical >= 75 -> FAIL ; else any High >= 50 -> REVISE ; else PASS.

Findings only, no code. Do not soften to seem agreeable; do not manufacture findings. If a prior finding is genuinely resolved, say so — do not keep REVISE alive out of inertia.