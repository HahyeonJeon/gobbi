---
name: codex-conducted-adversarial-review-lane-agents-skills
description: Lane B review for D2 agents, skills, and delegation completeness
type: reviews
scope: project
feature: null
status: active
created: 2026-07-01
session: 019f1ef9-a676-7f12-8d78-922f12cb64e9
tags: [evaluation, codex, process]
keywords: [d2, agents, skills, delegation, codex-conducted]
author: codex
review_kind: adversarial-review
subject: "Gobbi general surface — D2 agents, skills, and delegation completeness"
verdict: needs-attention
---

# Lane B — D2 Agents, Skills, And Delegation Completeness

This lane reviews role prompts, skill maps, load directives, custom-agent wrappers, and delegation contracts.

## Method

Lane B reviewed role prompts, skill maps, load directives, companion mistakes, custom-agent
wrappers, status contracts, and delegation templates. It verified basic Codex add-on surfaces:
`.agents/skills` resolves 22 skill symlinks; `.codex/agents` has all five wrapper symlinks;
`.codex/agents/evaluator.toml` is read-only; Codex wrappers do not pin model or effort.

Commands and checks used included:

- `test -d .gobbi/projects/gobbi/rules`
- `find -L .agents/skills -mindepth 1 -maxdepth 1 -type d -printf '%f\n' | sort`
- `find .agents/skills -mindepth 1 -maxdepth 1 -printf '%f -> %l\n' | sort`
- `find .codex/agents -mindepth 1 -maxdepth 1 -printf '%f -> %l\n' | sort`
- `rg -n "SKILLS LOADED" .gobbi/projects/gobbi/agents/*.md`
- `rg -n "SKILLS LOADED" .gobbi/projects/gobbi/skills/delegation/SKILL.md .gobbi/projects/gobbi/skills/delegation/templates/*.md`
- targeted line reads of `AGENTS.md`, `.codex/AGENTS.md`, role prompts, delegation templates, and prior D2 review artifacts

## Findings

### GEN-D2-001: Canonical role prompts send spawned agents to an absent rules directory
- Type: design_flaw
- Domain: process
- Severity: High
- Confidence: 100
- Priority: high
- Disposition: open
- Runner: codex
- Dimension: D2
- Owner-surface: agent
- Location: `.gobbi/projects/gobbi/agents/manager.md:27-31`; `.gobbi/projects/gobbi/agents/leader.md:27-30`; `.gobbi/projects/gobbi/agents/executor.md:29-33`; `.gobbi/projects/gobbi/agents/evaluator.md:34-37`; `.gobbi/projects/gobbi/agents/assistant.md:39-42`
- Expected: Canonical role prompts should direct every fresh agent to an existing rules source, or use the same no-`rules/` fallback that the delegation templates use.
- Observed: Every canonical role prompt tells agents to read all project rules under `.gobbi/projects/{project-name}/rules/`, but `test -d .gobbi/projects/gobbi/rules` returned `rules_dir_exists_exit=1`. The templates already include the safer fallback: read `skills/memory/rules.md` when `rules/` is absent.
- Evidence: The project's delegation mistake records this trap for delegation prompts at `.gobbi/projects/gobbi/skills/delegation/mistakes.md:12-19`. This is not a duplicate of prior D2-023; the current evidence is the canonical role-prompt/bootstrap variant, and `.codex/agents/*.toml` wrappers tell Codex agents to read these canonical prompts first.
- False-positive check: If a manager always uses fixed delegation templates, the fallback is present. The defect remains for direct role-prompt use, custom-agent bootstrap, or incomplete parent prompts that rely on the canonical role prompt as the contract.
- Proposed remediation: Update all five role prompts to either name the existing rules source or explicitly say: read all files under `rules/` if it exists; otherwise read `.gobbi/projects/{project-name}/skills/memory/rules.md`. Require a non-empty read or explicit absence note.
- Verification: Re-run `test -d .gobbi/projects/gobbi/rules` and `rg -n "All project rules" .gobbi/projects/gobbi/agents/*.md`; each prompt should have the same fallback as the templates.
- Second-pass: validated by Godel (`019f1f2d-20a4-71f0-a5e5-0ef5512dd3dc`). Severity remains High.

### GEN-D2-002: Delegation templates bypass the official native Codex `.agents/skills` load path
- Type: design_flaw
- Domain: docs-sync
- Severity: Medium
- Confidence: 100
- Priority: medium
- Disposition: open
- Runner: codex
- Dimension: D2
- Owner-surface: template
- Location: `AGENTS.md:5-13`; `.agents/skills/codex/SKILL.md:41-42`; `.agents/skills/codex/SKILL.md:458-459`; `.gobbi/projects/gobbi/skills/delegation/templates/leader.md:31-42`; `.gobbi/projects/gobbi/skills/delegation/templates/executor.md:32-43`; `.gobbi/projects/gobbi/skills/delegation/templates/evaluator.md:59-67`; `.gobbi/projects/gobbi/skills/delegation/templates/assistant.md:40-50`
- Expected: Native Codex load directives should use `.agents/skills/<skill>/SKILL.md`, matching the repo-local Codex entry point.
- Observed: The root instructions and Codex skill require `.agents/skills`, and the Codex wrappers follow that path, but all delegation templates hard-code `.gobbi/projects/<<project-name>>/skills/...` for skill loads.
- Evidence: `find -L .agents/skills -mindepth 1 -maxdepth 1 -type d -printf '%f\n' | sort` showed the expected 22 Codex skill directories, and `find .agents/skills ...` showed each is a symlink to the canonical skill. The templates still emit canonical paths instead of the Codex entry point.
- False-positive check: The canonical paths exist, so the subagent can read the skill content. The failure is a Codex-contract failure: a `SKILLS LOADED` checklist using canonical paths does not prove that the native Codex `.agents/skills` entry point works.
- Proposed remediation: Parameterize the template skill root by runtime. For native Codex, emit `.agents/skills/...`; for canonical or Claude bridge contexts, emit the intended canonical path explicitly.
- Verification: Render one Codex leader/executor/evaluator/assistant delegation prompt and confirm tier-1/tier-3 skill paths start with `.agents/skills/`, while project memory/mistake paths remain explicit.

### GEN-D2-003: Codex bootstrap and delegation taxonomy still understate where Evaluation runs
- Type: checklist_gap
- Domain: process
- Severity: Medium
- Confidence: 100
- Priority: medium
- Disposition: open
- Runner: codex
- Dimension: D2
- Owner-surface: docs
- Location: `AGENTS.md:57-69`; `.codex/AGENTS.md:57-69`; `.agents/skills/gobbi/SKILL.md:141`; `.agents/skills/delegation/SKILL.md:420-429`
- Expected: Evaluation routing should agree across bootstrap docs and delegation taxonomy: every productive step has an Evaluation sub-phase, with Evaluation mandatory after Execution and Wrap-up and optional after Ideation, Preparation, and Planning when policy allows.
- Observed: `AGENTS.md:69` and `.codex/AGENTS.md:69` say Evaluation runs inside only Ideation, Planning, and Execution. `.agents/skills/delegation/SKILL.md:429` says evaluator use is mandatory after Execution and optional after Ideation/Planning, omitting Preparation and Wrap-up. This contradicts `.agents/skills/gobbi/SKILL.md:141` and `.agents/skills/delegation/SKILL.md:420`, which says phase-list drift is a bug.
- Evidence: Prior D2-019 already found this class on other surfaces. This current finding is the Codex bootstrap and delegation-taxonomy variant: `.codex/AGENTS.md` and `.agents/skills/delegation/SKILL.md:429` are current evidence not covered by the older location list.
- False-positive check: The same docs also say Wrap-up has mandatory evaluation at `.codex/AGENTS.md:65`, so a careful human may recover the correct rule. A fresh spawned or bootstrap agent reading the later summary line can still under-spawn evaluators for Preparation and Wrap-up.
- Proposed remediation: Replace the short Evaluation sentence and evaluator taxonomy row with the canonical rule from `gobbi/SKILL.md:141`.
- Verification: `rg -n "Evaluation runs inside|mandatory after Execution|Evaluation sub-phase" AGENTS.md .codex/AGENTS.md .agents/skills/delegation/SKILL.md .agents/skills/gobbi/SKILL.md` should return one consistent lifecycle rule.

### GEN-D2-004: Canonical role status contracts do not require `SKILLS LOADED`
- Type: checklist_gap
- Domain: process
- Severity: Medium
- Confidence: 100
- Priority: medium
- Disposition: open
- Runner: codex
- Dimension: D2
- Owner-surface: agent
- Location: `.gobbi/projects/gobbi/agents/leader.md:124-132`; `.gobbi/projects/gobbi/agents/executor.md:114-122`; `.gobbi/projects/gobbi/agents/evaluator.md:98-106`; `.gobbi/projects/gobbi/agents/assistant.md:114-122`; `.gobbi/projects/gobbi/skills/delegation/SKILL.md:190-202`
- Expected: Spawned agents should always be told how to prove required skill loads, per the charter and delegation wire format.
- Observed: The delegation skill and templates require `SKILLS LOADED`, but canonical role prompt status contracts only require status/artifact/verdict-style reporting. `rg -n "SKILLS LOADED" .gobbi/projects/gobbi/agents/*.md` returned no matches.
- Evidence: `.gobbi/projects/gobbi/skills/delegation/SKILL.md:198-202` makes `SKILLS LOADED` mandatory and transcript-verifiable; `.gobbi/projects/gobbi/skills/delegation/SKILL.md:323` calls skill named without a path an anti-pattern. The role prompts are the files Codex wrappers load first.
- False-positive check: Delegation templates do include `SKILLS LOADED`. The gap is direct role-prompt/custom-agent invocation or any parent prompt that does not paste the full template.
- Proposed remediation: Add the same minimal wire-format requirement to each spawned role prompt, or explicitly state role prompts are incomplete without a delegation template and must reject bare dispatches that lack `SKILLS LOADED`.
- Verification: Re-run `rg -n "SKILLS LOADED" .gobbi/projects/gobbi/agents/*.md` and confirm each spawned role prompt contains the mandatory checklist and exact-path proof requirement.

### GEN-D2-005: Codex role table labels canonical TOML files as the Codex wrappers
- Type: general
- Domain: docs-sync
- Severity: Low
- Confidence: 100
- Priority: low
- Disposition: open
- Runner: codex
- Dimension: D2
- Owner-surface: docs
- Location: `AGENTS.md:33-43`; `.codex/AGENTS.md:33-43`; `AGENTS.md:106-110`; `.codex/AGENTS.md:106-110`
- Expected: The "Codex wrapper" column should point to `.codex/agents/<role>.toml`, matching the official Codex entry point and the later Navigate Deeper table.
- Observed: The role-prompt table's "Codex wrapper" column points to `.gobbi/projects/gobbi/agents/<role>.toml`, while the same document elsewhere says custom agents live at `.codex/agents/<role>.toml`.
- Evidence: `find .codex/agents -mindepth 1 -maxdepth 1 -printf '%f -> %l\n' | sort` showed the actual wrapper symlinks under `.codex/agents`, pointing to canonical TOML files. The table swaps the wrapper path with the canonical target path.
- False-positive check: The symlink targets exist, so this is not a runtime dead-end. It is still a fresh-agent/operator confusion bug on the custom-agent wrapper surface.
- Proposed remediation: Change the table column to `.codex/agents/{role}.toml` and, if useful, add a separate canonical TOML target column or prose note that those wrappers symlink to `.gobbi/projects/gobbi/agents/{role}.toml`.
- Verification: Re-run the `find .codex/agents ...` command and compare table entries against actual wrapper paths.
