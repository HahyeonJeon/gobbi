You are the Codex-side adversarial evaluator in a dual-system gobbi evaluation (Planning loop). A separate Claude evaluator judges the same plan independently — divergence is the anti-groupthink signal. Verify, do not trust.

# What you are evaluating

A PLANNING artifact: an ordered 8-task decomposition that becomes the Execution Loop's input (Execution runs one task at a time against it). Judge the DECOMPOSITION quality — correct, complete, well-ordered, executable, in-scope — NOT the design (the design basis already passed dual-system eval; do not re-litigate it).

Primary (read IN FULL):
  .gobbi/projects/gobbi/sessions/2026-05-30-0fd65721-c39f-4305-b296-9961aee8e1c1/planning/rawdata/plan.md
Staged plan + decision:
  .gobbi/projects/gobbi/sessions/2026-05-30-0fd65721-c39f-4305-b296-9961aee8e1c1/planning/staging/plans/gobbi-claude-code-plugin-build.md
  .gobbi/projects/gobbi/sessions/2026-05-30-0fd65721-c39f-4305-b296-9961aee8e1c1/planning/staging/decisions/plugin-plan-decomposition-and-ordering.md
Design basis (context only):
  .gobbi/projects/gobbi/sessions/2026-05-30-0fd65721-c39f-4305-b296-9961aee8e1c1/ideation/artifacts/gobbi-plugin-ideation.md
  .gobbi/projects/gobbi/sessions/2026-05-30-0fd65721-c39f-4305-b296-9961aee8e1c1/preparation/artifacts/preparation-readiness.md

# Ratified deliverable set the plan must COMPLETELY cover (check each maps to a task; flag missing/creep)
- plugins/gobbi/.claude-plugin/plugin.json (name gobbi; skills dir-pointer ADDS-to; agents 5-.md file-array REPLACES, exclude .toml; hooks ./hooks/hooks.json)
- plugins/gobbi/skills/ = materialized real copies of 18 canonical skills
- plugins/gobbi/agents/ = 5 role .md real copies (exclude 5 .toml)
- plugins/gobbi/hooks/ = 2 scripts + hooks.json (${CLAUDE_PLUGIN_ROOT}, 3 registrations mirroring live settings.json; dev-vs-installed split Option C)
- repo-root .claude-plugin/marketplace.json (Claude schema, source ./plugins/gobbi)
- scripts/sync-plugin-package.sh (materialize + drift gate; named re-sync trigger)
- fire-exactly-once hook validation (installed case; PostToolUseFailure trigger; marker per hook_event_name)
- post-install invocability check (gobbi:codex + gobbi:gobbi-hook-authoring + an agent) + CONDITIONAL +2 permissions.allow entries
- claude-plugin SKILL (general guide + layered gobbi section) + .claude/skills/claude-plugin/SKILL.md mirror symlink
- docs: install-runtime feature memory update (Principle 8)

# Verify against ground truth (do not trust the plan's numbers)
- `ls .gobbi/projects/gobbi/skills/ | wc -l` = 18; `ls .gobbi/projects/gobbi/agents/` = 5 .md + 5 .toml; `.claude/settings.json` = 3 hook blocks (matchers); prior-art `git show e083fad^:.claude-plugin/marketplace.json` source shape.

# Scrutinize especially
1. Completeness: is any ratified deliverable NOT covered by a task? Any task doing out-of-scope work?
2. Ordering/dependencies: graph is 01→{02,03}; 02→04; {03,04}→05→06; {01..06}→07→08. Is it truly acyclic + bottom-up? Is fire-once (05) correctly after install (needs marketplace 04 + hooks 03)? Is permissions (06) correctly after invocability check?
3. The cache-contents allow-set gate has NO standalone task — it's folded into T1 `--check` + asserted at T5 install. Is that adequate, or a coverage gap (a Critical risk if the install copies session memory / repo content)?
4. Verification anchors: are they actually runnable in this markdown-only repo (no test suite)? Is `claude plugin validate` assumed present? Are the fire-once + invocability checks concrete enough to execute?
5. Each task ONE category? Any task that should be split? Any two tasks editing the same file (conflict)?

# How to report
Write ONE file per perspective into (dir exists):
  .gobbi/projects/gobbi/sessions/2026-05-30-0fd65721-c39f-4305-b296-9961aee8e1c1/planning/evaluation/iter1/codex/
Files: project.md, structure.md, performance.md, aesthetics.md, usage.md, consistency.md, risk.md, overall.md (7 perspectives fixed order + overall).

Each finding: Type (scenario_gap|checklist_gap|design_flaw|assumption_risk|general) / Severity (Critical|High|Medium|Low) / Confidence (0|25|50|75|100) / Evidence (path+quote or verified fact) / Why-it-matters / Suggested-direction.

overall.md ends with EXACTLY this last line: VERDICT: PASS (or REVISE / FAIL), computed: any Critical>=75 -> FAIL; else any High>=50 -> REVISE; else PASS.

Findings only, no code. Do not soften; do not manufacture. If the plan is sound, say PASS.