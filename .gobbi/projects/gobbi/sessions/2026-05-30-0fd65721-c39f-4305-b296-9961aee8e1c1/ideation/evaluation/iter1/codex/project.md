# Project Perspective - Codex Evaluation

## Artifact Summary + Memory reads

The draft proposes packaging gobbi as a Claude Code plugin plus creating a reusable `claude-plugin` skill. The user-ratified direction is full breadth: skills, five role agents, two hooks, repo-root plugin source pointing at canonical `.gobbi/projects/gobbi/{skills,agents}` real files, hook registration moved to plugin `hooks/hooks.json`, in-repo Claude marketplace, and the skill homed under the canonical skills tree with a `.claude/skills` mirror symlink.

Memory and evidence read: `ideation/rawdata/draft-iter1.md`; `ideation/rawdata/discussion-log.md`; all four `ideation/staging/references/*.md`; both `ideation/staging/backlogs/feature/*.md`; `.codex-plugin/plugin.json`; `.agents/plugins/marketplace.json`; `.claude/settings.json`; `.claude/hooks/session-start.sh`; `.claude/hooks/post-tool-use-agents.sh`; `.claude/skills/gobbi/SKILL.md` symlink; `.gobbi/projects/gobbi/features/install-runtime/README.md`; relevant project mistakes `skills-mirror-symlinks-not-copies.md` and `evaluator-false-pass-without-diffing.md`; rule `stub-redirect-format.md`; official Claude docs at `https://code.claude.com/docs/en/plugins-reference` and `https://code.claude.com/docs/en/plugin-marketplaces`.

## Locked Frame (Stage 1)

- Scenario: the design satisfies the ratified user goal without dropping any ratified decision.
- Scenario (adversarial): the draft's claimed prior-art base is incomplete, causing Planning to optimize around a false history.
- Scenario: scope stays on `install-runtime` and defers public marketplace/Codex-manifest reconciliation correctly.

## Per-scenario per-check results

- Ratified decisions are mostly reflected: DD-1 through DD-6 appear in `draft-iter1.md:43-50`.
- Deferrals for public publishing and Codex manifest reconciliation are present in `draft-iter1.md:35-40` and backed by staged backlog files.
- Prior-art fidelity fails: the draft claims no prior `.claude-plugin/` attempt, but git history contains one.

## Typed findings

### P1 - Prior `.claude-plugin` package history was missed

- Type: assumption_risk
- Severity: High
- Confidence: 100
- Evidence: `ideation/rawdata/draft-iter1.md:94-100` says, "No prior `.claude-plugin/` attempt on record (`ls` confirms absent; git log shows none)." Git history contradicts this: commit `62b95a0` contains `.claude-plugin/marketplace.json` with a `gobbi-core` plugin entry and `plugins/gobbi-core/.claude-plugin/plugin.json`; `git show 62b95a0:.claude-plugin/marketplace.json` includes `"name": "gobbi-core", "source": "./plugins/gobbi-core"`.
- Why-it-matters: This is not harmless archaeology. The prior Claude plugin package directly overlaps the current design space: marketplace shape, dedicated plugin subtree, copied skills/agents/hooks, settings/permissions, and hook registration. Even if obsolete after reset, the artifact must say why that prior package is not being revived or borrowed from. Otherwise Planning starts from a false "first attempt" premise.
- Suggested-direction: Preserve the ratified current direction unless new evidence overturns it, but revise the draft to include a prior-attempt analysis: what existed in `62b95a0`, why it was wiped/reset, which lessons apply now, and which old choices are intentionally rejected.

## Low-confidence appendix

None.
