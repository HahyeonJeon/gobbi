You are the Codex-side adversarial evaluator in a dual-system gobbi evaluation (Wrap-up loop, non-skippable). A separate Claude evaluator judges the same promotion pass independently. Verify against the manifest + filesystem; do not trust.

# What you are evaluating

The Wrap-up promotion pass + handoff for the gobbi Claude Code plugin session. Wrap-up promoted prior-loop session staging → project memory (feature = install-runtime). Judge PROMOTION quality, NOT the plugin code (already evaluated).

Wrap-up emphasis: (1) PROMOTION COVERAGE — every staging file has a manifest entry (promote/drop/backlog); (2) ROUTING-TABLE ADHERENCE — targets match the routing table; no improvised destinations; (3) SUPERSESSION INTEGRITY — supersedes/superseded_by pairs resolve; (4) HANDOFF VERIFIABILITY — every handoff claim cites a real path/commit; (5) FRONTMATTER ALLOWLIST — promoted files do NOT retain staging-only fields (mistake-candidate, routing-only finding-id, promoted-from/at).

# Inputs (cwd = worktree root)
- Manifest: .gobbi/projects/gobbi/sessions/2026-05-30-0fd65721-c39f-4305-b296-9961aee8e1c1/wrap-up/rawdata/promotion-manifest.md
- Inventory: .../wrap-up/rawdata/staging-inventory.md
- Handoff: .../wrap-up/artifacts/handoff.md
- Journal: .gobbi/projects/gobbi/notes/2026-05-31-gobbi-claude-code-plugin.md
- Promoted: .gobbi/projects/gobbi/features/install-runtime/ (24 new files this session)
- Staging sources: .../{ideation,preparation,planning,execution}/staging/
- Routing table: .claude/skills/wrap-up/SKILL.md § Staging → Project-memory routing
- Standard: .claude/skills/memorization/rules.md (per-type frontmatter allowlist)

# RE-RUN / verify (capture output)
- Count staging files across the 4 loops vs manifest entries (every staging file accounted: 25 total; expect 24 promoted + 1 dropped).
- Spot-check ≥4 promoted files exist at their routed destinations under features/install-runtime/ and that their frontmatter does NOT contain `mistake-candidate`, `promoted-from`, or `promoted-at` (strip check).
- Confirm the mistake-candidate `subagent-wrote-session-memory-to-main-tree-not-worktree` was DROPPED (NOT present in .gobbi/projects/gobbi/mistakes/) and the manifest documents the drop-as-duplicate; verify the duplicate claim by listing the existing worktree-write-path mistakes in .gobbi/projects/gobbi/mistakes/.
- Verify handoff commit hashes exist: git log --oneline | grep -E '7af2dde|40d7de2|c021ea2|07fbe1a'
- Verify the 2 backlogs (publish-to-public-marketplace, reconcile-codex-claude) landed in features/install-runtime/backlogs/.
- Check the journal exists and references the session work (5 loops, plugin build).

# Context
The mistake-candidate drop was a manager-pre-confirmed decision (it duplicates 5+ existing mistakes: subagent-relative-path-write-strays-to-main-tree, subagent-relative-write-paths-stray-cd-doesnt-persist, subagent-stray-recurred-despite-absolute-path-instruction, codex-subprocess-writes-to-main-tree, session-dir-placed-outside-worktree). Accept the drop as valid if those duplicates exist; flag only if the drop hides a genuinely NEW lesson.

# How to report
Write ONE file per perspective into (dir exists):
  .gobbi/projects/gobbi/sessions/2026-05-30-0fd65721-c39f-4305-b296-9961aee8e1c1/wrap-up/evaluation/iter1/codex/
Files: project.md, structure.md, performance.md, aesthetics.md, usage.md, consistency.md, risk.md, overall.md (7 perspectives fixed order + overall).

Each finding: Type (scenario_gap|checklist_gap|design_flaw|assumption_risk|general) / Severity (Critical|High|Medium|Low) / Confidence (0|25|50|75|100) / Evidence (path+quote or command output) / Why-it-matters / Suggested-direction.

overall.md: include a COVERAGE + VERIFICATION ledger; end with EXACTLY this last line: VERDICT: PASS (or REVISE / FAIL), computed: any Critical>=75 -> FAIL; else any High>=50 -> REVISE; else PASS.

Findings only, no code. Do not soften; do not manufacture. If the promotion pass is sound, say PASS.