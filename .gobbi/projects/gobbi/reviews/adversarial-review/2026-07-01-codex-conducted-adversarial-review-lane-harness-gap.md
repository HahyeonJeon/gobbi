---
name: codex-conducted-adversarial-review-lane-harness-gap
description: Lane H review for D8 reference harness comparison and gap discovery
type: reviews
scope: project
feature: null
status: active
created: 2026-07-01
session: 019f1ef9-a676-7f12-8d78-922f12cb64e9
tags: [evaluation, codex, process]
keywords: [d8, reference-harness, gap-discovery, codex-conducted]
author: codex
review_kind: adversarial-review
subject: "Gobbi general surface — D8 reference harness comparison and gap discovery"
verdict: needs-attention
---

# Lane H — D8 Reference Harness Comparison And Gap Discovery

This lane reviews reference-harness gaps that materially affect Gobbi design.

## Method

Lane H compared Gobbi's review method and skill/package design against current primary or
current-source references where those references materially affected the comparison: Codex skill
invocation policy, OpenAI eval dataset/grader practice, OpenAI Agents tracing, Claude Code subagent
isolation, and LangGraph persistence/interrupts.

The lane remained read-only and did not edit files. It also deduped against the 2026-06-29 review
corpus. A potential pending-decision finding was dropped as a duplicate of prior D7-R1.

Local commands and checks used included:

- required load reads for `AGENTS.md`, evaluator role prompt, principles, mistake, evaluation,
  research, coding, and the 2026-07-01 charter
- `find .gobbi/projects/gobbi/rules -type f -name '*.md' -print | sort`, which failed because
  `.gobbi/projects/gobbi/rules` is absent in the worktree
- recursive mistake reads
- targeted `rg -n` checks over prior review files, reference templates, memory references,
  skill-writing docs, plugin manifests, and evaluation docs
- symlink-aware checks with `find -L` and `readlink`
- `jq empty plugins/gobbi/.codex-plugin/plugin.json`
- `git rev-parse --show-toplevel`, `git rev-parse --abbrev-ref HEAD`, `git rev-parse HEAD`, and
  `git status --short`

External primary sources checked by the lane: Codex skills documentation for `agents/openai.yaml`
and implicit invocation policy; OpenAI evals documentation for datasets, ground truth, and graders;
OpenAI Agents SDK tracing documentation; Claude Code subagent documentation; and LangGraph
persistence/interrupt documentation.

Lane concern: `.gobbi/projects/gobbi/rules` does not exist in this worktree, so the evaluator role's
project-rules load directive had no files to read.

## Findings

### GEN-D8-001: Reference records cannot preserve the dated harness-refresh matrix D3 said future work needs
- Type: design_flaw
- Domain: compliance
- Severity: Medium
- Confidence: 100
- Priority: medium
- Disposition: open
- Runner: codex
- Dimension: D8
- Owner-surface: template
- Location: `.gobbi/projects/gobbi/skills/memory/templates/references.md:28`
- Expected: Reference-harness inputs record stable source identity, source authority, license/reuse posture, and freshness/materiality so D8 comparisons can be rerun without re-inferring provenance.
- Observed: The reference template requires only `title`, `source`, `accessed`, and `ref_type`; author/date/version are optional body text, and no field captures license, reuse mode, source authority, immutable pin, or refresh materiality.
- Evidence: `references.md:28` defines the complete reference extension set; `references.md:57-59` makes author/date/version optional body content. Prior D3 says a later refresh should produce `mechanism / source URL / license / copy-adapt-ignore` before implementation at `2026-06-29-gobbi-adversarial-review-d3-d5.md:83`. Current reference records use moving repo roots such as `source: https://github.com/eyaltoledano/claude-task-master` and body `docs/tutorial.md` with no commit/sha at `claude-task-master-dependency-tasks.md:14,28-29`. The lane's exact `rg -n "license|copy-adapt|source_authority|immutable|commit|sha|last_verified"` check found no schema support beyond the research skill's generic target mention.
- False-positive check: new variant. Prior D3-014 asks for a future refresh matrix; this finding is the current schema gap that prevents storing that matrix as durable memory.
- Proposed remediation: Add structured reference provenance fields or a dedicated harness-comparison template for `source_authority`, `stable_anchor`, `version_or_commit`, `license`, `reuse_policy`, `last_checked`, and `refresh_materiality`.
- Verification: A future D8 refresh can fill those fields for all four prior harness references and any newly refreshed official sources without prose-only side notes.

### GEN-D8-002: Codex skill invocation policy is not modeled in Gobbi skill authoring
- Type: design_flaw
- Domain: docs-sync
- Severity: Medium
- Confidence: 100
- Priority: medium
- Disposition: open
- Runner: codex
- Dimension: D8
- Owner-surface: skill
- Location: `.gobbi/projects/gobbi/skills/skill-writing/SKILL.md:99`
- Expected: Gobbi's skill-authoring guidance describes both Claude and Codex invocation controls for packaged skills and requires trigger checks when descriptions become invocation interfaces.
- Observed: `skill-writing` models slash visibility and model auto-invocation through Claude-specific frontmatter only: `user-invocable` and `disable-model-invocation`. The repo has no `agents/openai.yaml` files, and the Codex plugin manifest exposes package-level default prompts only.
- Evidence: `skill-writing/SKILL.md:104-109` defines discoverability axes without Codex `agents/openai.yaml`; `plugins/gobbi/.codex-plugin/plugin.json:18-34` packages skills and default prompts but no per-skill invocation policy. `find .agents/skills plugins/gobbi/skills .gobbi/projects/gobbi/skills -name openai.yaml -print` returned no files. Current Codex docs say `agents/openai.yaml` can set `allow_implicit_invocation`, defaulting to true, and recommend testing prompts against descriptions for trigger behavior.
- False-positive check: none. This is not the older D3-001 manual-discovery gap; it is a current Codex policy surface missing from the authoring standard.
- Proposed remediation: Extend `skill-writing` with a Codex invocation-policy subsection and a trigger-test checklist. Decide which Gobbi skills should allow implicit Codex invocation and which should require explicit `$skill` use.
- Verification: `rg -n "openai.yaml|allow_implicit_invocation|trigger behavior|test prompts" .gobbi/projects/gobbi/skills/skill-writing/SKILL.md plugins/gobbi/skills` shows Codex policy guidance and at least one checked example.

### GEN-D8-003: Review methodology has no executable regression corpus for prior adversarial findings
- Type: scenario_gap
- Domain: test
- Severity: Medium
- Confidence: 75
- Priority: medium
- Disposition: open
- Runner: codex
- Dimension: D8
- Owner-surface: docs
- Location: `.gobbi/projects/gobbi/skills/evaluation/SKILL.md:558`
- Expected: A reference-grade review harness converts recurring review failures into rerunnable cases with inputs, expected finding class, and grader/check criteria.
- Observed: Gobbi evaluation writes prose per-perspective Markdown files only. The charter requires lane reports and aggregation, but no fixture/dataset/run format exists for replaying known defects such as stale reference anchors, missing second-pass validation, or bad skill-load directives.
- Evidence: `evaluation/SKILL.md:562-565` defines only per-perspective and overall Markdown outputs. `find . -maxdepth 5 \( -iname '*eval*.jsonl' -o -iname '*eval*.yaml' -o -iname '*fixture*' -o -path './evals/*' -o -path './tests/evals/*' \) -print` returned no files. OpenAI eval guidance treats representative test data, ground truth, and testing criteria/graders as first-class parts of an eval run, with JSONL test data carrying inputs and labels.
- False-positive check: none. Prior D3 confirms Gobbi is ahead on dual-system anti-groupthink; this finding preserves that differentiator and adds a small regression harness for review methodology.
- Proposed remediation: Add a read-only review regression corpus format under reviews or tests: minimal bad artifact, expected finding metadata, expected evidence pattern, and checker command. Seed it from prior D1/D2/D4 mistakes.
- Verification: A future session can run a documented command over the corpus and prove that Gobbi's evaluators still surface the expected finding class and evidence anchors.

### GEN-D8-004: Critical/High second-pass validation is required but not part of the finding schema
- Type: checklist_gap
- Domain: process
- Severity: Medium
- Confidence: 100
- Priority: medium
- Disposition: open
- Runner: codex
- Dimension: D8
- Owner-surface: template
- Location: `.gobbi/projects/gobbi/plans/workflow/2026-07-01-codex-conducted-adversarial-review-charter.md:316`
- Expected: The body-level finding shape carries structured second-pass state for every Critical/High finding: validator, status, evidence, and blocker or `needs-second-pass`.
- Observed: The charter requires independent second-pass validation before marking Critical/High findings confirmed, but the finding record shape has no field for second-pass status. Aggregators must infer it from free text.
- Evidence: `2026-07-01-codex-conducted-adversarial-review-charter.md:316-320` requires second-pass validation or `needs-second-pass`; the template at lines `333-350` includes metadata, evidence, false-positive check, remediation, and future verification, but no validation-status field. This conflicts with the charter's own aggregation rule to order and deduplicate lane reports at lines `322-327`.
- False-positive check: none.
- Proposed remediation: Add structured fields such as `Second-pass: confirmed | needs-second-pass | not-required`, `Second-pass-runner`, `Second-pass-evidence`, and `Second-pass-blocker`.
- Verification: A synthetic High finding without the field fails a schema check; a Medium finding may set `Second-pass: not-required`.
