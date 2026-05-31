You are the Codex-side adversarial evaluator in a dual-system gobbi evaluation (Preparation loop). A separate Claude evaluator judges the same artifact independently — divergence is the anti-groupthink signal. Verify, do not trust.

# What you are evaluating

A PREPARATION readiness report (NOT implementation) for packaging gobbi as a Claude Code plugin. Its job: verify project-memory + workspace-skill readiness for Planning/Execution and resolve 5 Ideation-deferred design-details into concrete recommendations. Judge: is the READY verdict sound? Are the 5 resolved items correct + complete? Did it miss a gap that breaks Execution? Are the user-ratified decisions consistently reflected (no stale contradiction)?

Primary artifact (read IN FULL):
  .gobbi/projects/gobbi/sessions/2026-05-30-0fd65721-c39f-4305-b296-9961aee8e1c1/preparation/rawdata/preparation.md
Discussion log (ratifications):
  .gobbi/projects/gobbi/sessions/2026-05-30-0fd65721-c39f-4305-b296-9961aee8e1c1/preparation/rawdata/discussion-log.md
Staged decisions + design:
  .gobbi/projects/gobbi/sessions/2026-05-30-0fd65721-c39f-4305-b296-9961aee8e1c1/preparation/staging/decisions/*.md
  .gobbi/projects/gobbi/sessions/2026-05-30-0fd65721-c39f-4305-b296-9961aee8e1c1/preparation/staging/design/*.md
Locked idea (context):
  .gobbi/projects/gobbi/sessions/2026-05-30-0fd65721-c39f-4305-b296-9961aee8e1c1/ideation/artifacts/gobbi-plugin-ideation.md

# User-ratified decisions the artifact MUST reflect consistently (flag any stale contradiction)
- Hook steady-state = Option C (dev-vs-installed split): .claude/settings.json keeps dev registration; plugin hooks.json serves installed users; keep the two coherent; fire-exactly-once validation for installed case; double-fire caveat accepted. (Leader originally recommended Option A/replace — verify NO artifact still asserts A as THE decision.)
- Permissions = keep project-local + verify auto-grant via post-install invocability check.
- Package all 18 skills (incl. gobbi-hook-authoring).
- Layout: plugins/gobbi/ package; repo-root .claude-plugin/marketplace.json; plugins/gobbi/.claude-plugin/plugin.json; materialized real copies; named re-sync trigger + drift gate.

# Verify these concrete claims against ground truth (do not trust the report)
- Skill count = 18: run `ls .gobbi/projects/gobbi/skills/ | wc -l` and confirm gobbi-hook-authoring is the unmirrored 18th (`ls .claude/skills/`).
- Agents: exactly 5 .md + 5 .toml in `.gobbi/projects/gobbi/agents/`.
- `.claude/settings.json` carries 3 hook-event blocks (SessionStart + PostToolUse + PostToolUseFailure); confirm matchers.
- Package root + marketplace shape: compare against `git show e083fad^:.claude-plugin/marketplace.json` (prior-art) and the official marketplace docs (the `source` value shape, the manifest-at-<root>/.claude-plugin/plugin.json rule).
- agents-key-is-file-path-array (REPLACES default) and skills-ADDS-to: confirm against official plugin docs.

# Key things to scrutinize
- Does the dev-vs-installed split (Option C) actually hold together? Are the coherence obligation (settings.json mirror hooks.json), the fire-exactly-once validation, and the double-fire caveat specified concretely enough for Planning to task? Any unhandled failure mode in Option C the report glosses?
- Is the materialization re-sync trigger + drift gate concrete enough, or hand-wavy?
- Is the READY verdict justified, or did the report declare readiness while a real gap remains (e.g. a skill/reference the executor needs, the auto-grant permissions unknown, the marketplace source path correctness)?

# How to report
Write ONE markdown file per perspective into (dir exists):
  .gobbi/projects/gobbi/sessions/2026-05-30-0fd65721-c39f-4305-b296-9961aee8e1c1/preparation/evaluation/iter1/codex/
Files: project.md, structure.md, performance.md, aesthetics.md, usage.md, consistency.md, risk.md, overall.md (7 perspectives in fixed order + overall).

Each finding: Type (scenario_gap|checklist_gap|design_flaw|assumption_risk|general) / Severity (Critical|High|Medium|Low) / Confidence (0|25|50|75|100) / Evidence (path+quote or verified fact+source) / Why-it-matters / Suggested-direction.

overall.md ends with EXACTLY this last line: VERDICT: PASS  (or REVISE / FAIL), computed by: any Critical>=75 -> FAIL; else any High>=50 -> REVISE; else PASS.

Findings only, no code. Do not soften to seem agreeable; do not manufacture findings.