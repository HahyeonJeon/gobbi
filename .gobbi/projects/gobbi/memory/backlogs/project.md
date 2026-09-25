# Project Backlog

## Future Markdown link checking must inspect the plugin mirror

**Backlogged at:** 2026-08-02T12:16:00Z

**What:** When Markdown link checking is reimplemented, use `find -xtype f` or an equivalent symlink-following
strategy so it inspects Markdown leaves under `.claude/skills/` instead of skipping the plugin mirror.

**Why backlogged:** Not currently unsafe — every mirror leaf points at a canonical file the checker already
checks directly — but it is false assurance: a future task that points the checker at the mirror itself, or at
a report claiming the mirror was checked, would get a false pass with zero files found. Deferred because
fixing it will newly inspect 159 previously-unseen documents and may surface real, currently-hidden findings;
that needs its own reviewed task rather than a one-line fix folded into unrelated work.

**Context:** Discovered and root-caused during the 2026-08-02 locator session. Full record:
[`reports/review/2026-08-02-locator-partner-agentteams-review.md`](../reports/review/2026-08-02-locator-partner-agentteams-review.md).

## `.codex/config.toml` is inert

**Backlogged at:** 2026-08-02T12:16:00Z

**What:** Decide whether to fix, repurpose, or remove the repository's `.codex/config.toml`.

**Why backlogged:** Measured that Codex CLI `0.146.0` loads only `$CODEX_HOME/config.toml`, never a
repository-local `.codex/config.toml` — confirmed with `codex doctor --json`. The file's stated intent
("Repository Codex model/effort policy") does not apply today; it stayed unnoticed because both files happen
to name the same model. Blast radius: `[agents] max_threads`/`max_depth` and the sandbox posture in that file
are also not applied. User decision: record it, decide separately.

**Context:** Measured fact recorded in
[`learnings/codex/tips.md`](../learnings/codex/tips.md#codexconfigtoml-at-a-repository-root-is-inert).

## Project `.grok/config.toml`

**Backlogged at:** 2026-08-15T14:49:00Z

**What:** Decide whether Gobbi should add a repository `.grok/config.toml`.

**Why backlogged:** The 2026-08-15 DISCUSSION lock deferred it. Official Grok config is user-level
`~/.grok/config.toml`. Codex already showed that a repository config can be unused. Measure before adding a
project file.

**Context:** Official marketplace sources use `[[marketplace.sources]]` in `~/.grok/config.toml`. This
checkout already has a project plugin pointer at `.grok/plugins/gobbi`. User-level
`[toolset.bash] timeout_secs` is a Grok host setting, not a reason to add a project config. Revisit if
measurement shows Grok reads a project config that Gobbi needs.

## Consumer-project README setup section

**Backlogged at:** 2026-08-01T15:05:03Z

**What:** Add a setup section to the project README covering how `.gobbi/` bootstraps in a consumer project.

**Why backlogged:** Out of scope for the 2026-08-01 bootstrap fix, which focused on skill and ignore-rule
behavior rather than user-facing documentation.

**Context:** The layout is defined in `gobbi/SKILL.md` Procedure Step 1.1, while Cowork Configuration and
Workflow's `Create the worktree and configuration` step own mode-specific bootstrap. The current design is recorded in
[`design/architecture/consumer-project-bootstrap.md`](../design/architecture/consumer-project-bootstrap.md).

## Flat consumer-project layout

**Backlogged at:** 2026-08-01T15:05:03Z

**What:** Evaluate migrating the consumer-project layout from the nested `.gobbi/projects/<project>/...`
form to a flat top-level form.

**Why backlogged:** The user considered and rejected a flat layout during the 2026-08-01 bootstrap fix in
favor of keeping the current nested form; a future migration remains a deliberately deferred, not foreclosed,
outcome.

**Context:** The current nested layout and the rejection are recorded in
[`design/architecture/consumer-project-bootstrap.md`](../design/architecture/consumer-project-bootstrap.md).

## Guardrail gaps in two `.toml` role wrappers

**Backlogged at:** 2026-08-02T12:16:00Z

**What:** Decide whether `assistant.toml` needs a git/scope guardrail clause and whether `manager.toml` needs
the conflict-precedence clause the other four role wrappers carry.

**Why backlogged:** Direct comparison of the five live role contracts and wrappers shows that
`assistant.toml` has no git/scope guardrail clause, though the assistant role writes to the worktree during
RECORD and Wrap-up WORK. `manager.toml` lacks the conflict-precedence clause the other four wrappers carry,
which reads as a pre-existing asymmetry rather than a clear defect. Both need a user decision on whether the
omission is intentional.

**Context:** Raised during the 2026-08-02 locator session while converting the five role-contract wrappers;
pre-existing, not introduced by that conversion.

## Locator no-brief fallback unverified for a spawned specialist

**Backlogged at:** 2026-08-02T12:16:00Z

**What:** Verify, or redesign, the locator's no-brief fallback for a spawned specialist role (leader, executor,
evaluator, assistant) that must derive `{gobbi-skills-root}` and `{gobbi-agents-root}` from its own contract's
location without a supplied pair.

**Why backlogged:** A spawned specialist has no `Skill` tool unless its role's `tools:` frontmatter grants one,
so it cannot read the "Base directory for this skill" report the acquisition step depends on. Measured across
three spawned test runs: all three found the root by filesystem search and `PATH` inspection instead of the
documented step, and one run's justification was confabulated. The design holds today because the manager
always supplies both roots in every brief, so this fallback path is not exercised in practice. User decision:
record it, do not fix now.

**Context:** Full mechanism and the measurement behind this gap are in
[`design/architecture/plugin-skill-locator.md`](../design/architecture/plugin-skill-locator.md#open).

## Reconsider plugin-only distribution

**Backlogged at:** 2026-08-01T15:05:03Z

**What:** Reconsider whether Gobbi should stay plugin-only or add another distribution channel.

**Why backlogged:** Out of scope for the 2026-08-01 bootstrap fix, which worked within plugin-only
distribution rather than changing it.

**Context:** Plugin-only distribution for v1.0.0 is the reason the v0.5.0 bootstrap CLI has no successor; see
[`reports/analysis/2026-08-01-consumer-project-bootstrap-gap.md`](../reports/analysis/2026-08-01-consumer-project-bootstrap-gap.md).

## Revive a bootstrap CLI

**Backlogged at:** 2026-08-01T15:05:03Z

**What:** Reconsider shipping a CLI binary that performs the consumer-project bootstrap, similar to the
`packages/cli` binary v0.5.0 shipped before v1.0.0 moved to plugin-only distribution.

**Why backlogged:** The 2026-08-01 fix solved the same gap by defining the layout inline in `gobbi/SKILL.md`
and assigning bootstrap to the selected Cowork or Workflow owner instead, without reviving a CLI.

**Context:** `packages/cli` was deleted when Gobbi moved to plugin-only distribution for v1.0.0; that
deletion is the root cause analyzed in
[`reports/analysis/2026-08-01-consumer-project-bootstrap-gap.md`](../reports/analysis/2026-08-01-consumer-project-bootstrap-gap.md).

## Authoring and Design Execution handoff placeholders

**Backlogged at:** 2026-09-25T15:10:31Z

**What:** Replace the placeholder `handoff.md` in Authoring Execution and Design Execution. Coding Execution
deleted its copy and returns the Delegation Handoff with a short list of Execution fields.

**Why backlogged:** The 2026-09-25 coding review found the same defect in the sibling families. The topic
contract kept Authoring and Design out of scope.

**Context:** Both files read "This file is a placeholder. The handoff fields are not written yet." See
[Authoring Execution](../../skills/authoring/authoring-execution/SKILL.md), [Design
Execution](../../skills/design/design-execution/SKILL.md), and [Coding
Execution](../../skills/coding/coding-execution/SKILL.md) Step 5.1 for the Coding form.

## Authoring and Design Ideation and Planning templates

**Backlogged at:** 2026-09-25T15:10:31Z

**What:** Decide whether Authoring and Design Ideation and Planning should match Coding: flat templates and
flat results, no optional Requirements snapshot, and one level-label vocabulary.

**Why backlogged:** Coding Ideation and Coding Planning made these changes on 2026-09-25. The topic contract
kept the sibling families out of scope.

**Context:** Authoring and Design Ideation keep nested `templates/ideation/` with `discussion/` and
`requirements/` subdirectories and an optional Requirements snapshot. Authoring and Design Planning keep nested
`templates/planning/` with `tasks/tasks-index.md` and `tasks/tasks-NN.md`. Authoring Ideation labels a level
`inherited/current`, where Coding Ideation uses `Inherited`. See the [Authoring skill
family](../design/feature/authoring-skill-family.md) and [Design skill family](../design/feature/design-skill-family.md).

## Review gating wording outside Coding

**Backlogged at:** 2026-09-25T15:10:31Z

**What:** Replace "non-gating" Review wording outside Coding with the live contract: a domain Review derives a
contract-gate verdict, and Cowork and Workflow gate on it. Reconcile the self-review wording at the same time.

**Why backlogged:** The Coding root and Coding family design were corrected on 2026-09-25. The topic contract
kept the Authoring and Design families and process memory out of scope.

**Context:** "Non-gating" remains in the [Authoring](../../skills/authoring/SKILL.md) and
[Design](../../skills/design/SKILL.md) root Intros, in the [Authoring skill
family](../design/feature/authoring-skill-family.md) and [Design skill
family](../design/feature/design-skill-family.md) designs, and in [Identity-and-load role
contracts](../design/process/identity-and-load-role-contracts.md), which also allows caller-permitted disclosed
self-review. Coding Review requires a reviewer who did not design, author, or implement the target. See
[Review](../design/process/evaluation.md).

## Stale draft lines in Authoring and Design skills

**Backlogged at:** 2026-09-25T15:10:31Z

**What:** Remove the "This skill is a draft adapted from …" line from Authoring Planning, Authoring Review,
Design Planning, and Design Review. In the two Review skills, also replace "prompts 3 and 4" with the prompt
names.

**Why backlogged:** Coding Planning and Coding Review dropped these lines on 2026-09-25. The topic contract
kept Authoring and Design out of scope.

**Context:** The line tells a cold reader the skill may not bind, and it names retired Planning and Evaluation
skills. The Review prompt table has named rows, not numbers. See [Authoring
Review](../../skills/authoring/authoring-review/SKILL.md) and [Design
Review](../../skills/design/design-review/SKILL.md).

## Review depth wording drift in process memory

**Backlogged at:** 2026-09-25T15:24:58Z

**What:** Align the Review depth section of the [Review](../design/process/evaluation.md#review-depth) process
design with the live Coding Review table. Add "indexed integrity" to the `planning-decomposition` row. Replace
"Execution documentation checklist", which no skill defines. Name the Coding Ideation and Coding Planning
checklists where the text says "its own checklist".

**Why backlogged:** The 2026-09-25 coding review found the drift. The topic contract kept process memory out of
scope.

**Context:** The live bar and baseline checklist for each `review-depth` token are in the [Coding
Review](../../skills/coding/coding-review/SKILL.md) review-depth table.
