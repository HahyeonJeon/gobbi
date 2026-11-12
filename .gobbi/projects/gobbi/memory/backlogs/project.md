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

## Manifest descriptions omit Cursor plugin agents

**Backlogged at:** 2026-09-25T18:00:36Z

**What:** Correct the marketplace and Claude plugin descriptions, which say plugin agents cover only Claude
Code and Grok. The Cursor plugin manifest also declares agents.

**Why backlogged:** The v1.3.2 release review found it (review-03 Problem 3). The text predates that release
(since `69850fba`) and was outside the release contract.

**Context:** `.claude-plugin/marketplace.json` (`:7`, `:11`) and `plugins/gobbi/.claude-plugin/plugin.json`
(`:4`). The Grok and Cursor manifests declare `./runtimes/grok` and `./runtimes/cursor`; see
`.gobbi/projects/gobbi/agents/README.md`.

## Grok probe side effects in the user's home

**Backlogged at:** 2026-09-29T08:19:28Z

**What:** Check that `~/.grok/config.toml` still holds the user's settings, and remove the probe sessions from
`~/.grok/sessions/`.

**Why backlogged:** The 2026-09-26 Grok agent-name probe did not isolate `HOME`. Grok rewrote
`~/.grok/config.toml` on its first `grok agent stdio` start and left 13 sessions in two probe-repo folders. The
prior config content is unknown.

**Context:** The rewritten file parses. See [Probing an external CLI without isolating its
home](../learnings/dev/mistakes.md#probing-an-external-cli-without-isolating-its-home).

## Grok silent fallback for an unknown agent name

**Backlogged at:** 2026-09-29T08:19:28Z

**What:** Make a Grok launch fail, or report, when Grok does not resolve the named role. An unknown `--agent`
name falls back to `grok-build-plan` with no error.

**Why backlogged:** The 2026-09-26 probe found it outside the reviewer-roles topic.

**Context:** A saved session's `summary.json` field `agent_name` shows the role that Grok resolved. The same
probe's saved sessions showed model `grok-4.6` at `xhigh`, not the pinned `grok-4.7` at `high`; the probe ran
offline, so this is unconfirmed.

## Plugin package sync can copy `__pycache__`

**Backlogged at:** 2026-09-29T08:19:28Z

**What:** Keep Python bytecode out of `plugins/gobbi/`. Exclude `__pycache__` in
`scripts/sync-plugin-package.sh`, or ignore it in `.gitignore`.

**Why backlogged:** The ontology v2 execution found it. The fix was outside that design.

**Context:** The sync copies every canonical skill file and excludes only exact paths. `.gitignore` has no
`__pycache__` rule. An import of `ontology.py` from the canonical skill put `.pyc` files into the package once;
they were removed. `scripts/prove-ontology-cli.py` sets `sys.dont_write_bytecode` to avoid it.

## Blinded skill eval

**Backlogged at:** 2026-11-12T12:30:00Z

**What:** Add an evaluation of a skill in which the evaluating agent does not know which version it is judging.

**Why backlogged:** The Pstack comparison named it as a gap; no accepted topic took it.

**Context:** Raised by the Pstack comparison. Review today judges one result against its Goal and does not compare
skill versions blind. See [Review](../design/process/evaluation.md).

## Debugging method

**Backlogged at:** 2026-11-12T12:30:00Z

**What:** Decide whether Gobbi needs a debugging method, and where it lives.

**Why backlogged:** The Pstack comparison named it as a gap; the root-cause principle covers the goal but no
method.

**Context:** Raised by the Pstack comparison. Candidate homes are a Coding preference or Review, and the choice
needs a discussion.

## Recurring brief templates

**Backlogged at:** 2026-11-12T12:30:00Z

**What:** Decide whether to ship named brief templates for recurring delegations such as a study, a review, or a
fix.

**Why backlogged:** The Pstack comparison raised it; Delegation holds one general template, and a second template
layer has not been justified.

**Context:** Raised by the Pstack comparison. See [Delegation](../../skills/delegation/SKILL.md).

## Narrower ask threshold in Discussion

**Backlogged at:** 2026-11-12T12:30:00Z

**What:** Decide whether Discussion should ask in fewer cases than it does now.

**Why backlogged:** The Pstack comparison raised it; the current rule asks only where a wrong guess is costly, and
no evidence shows it still asks too often.

**Context:** Raised by the Pstack comparison. See [Discussion](../../skills/discussion/SKILL.md) Rule 1.

## Name the principle in rulings

**Backlogged at:** 2026-11-12T12:30:00Z

**What:** Decide whether a `Ruling:` line should name the principle that decided it.

**Why backlogged:** The Pstack comparison raised it; rulings record what, why, and cost if wrong, and the benefit
of a principle name is unmeasured.

**Context:** Raised by the Pstack comparison. See the Rulings rule in [Cowork](../../skills/cowork/SKILL.md) and
[Workflow](../../skills/workflow/SKILL.md).

## Unattended liveness of long runs

**Backlogged at:** 2026-11-12T12:30:00Z

**What:** Decide how a manager learns that a long background run, such as a Partner or a subagent, is stuck while
no one is watching.

**Why backlogged:** The Pstack comparison raised it; Partner relies on the exit report and `timeout`, which show an
ended run but not a silent hang inside the timeout.

**Context:** Raised by the Pstack comparison. See [Partner](../../skills/partner/SKILL.md) Run lifecycle.

## Generate the four role copies from one source

**Backlogged at:** 2026-11-12T12:30:00Z

**What:** Generate the four runtime copies of each role from one source, so the shared body is written once.

**Why backlogged:** The guard only checks that the role bodies are identical across runtimes; it does not generate
them, and seven roles in four runtimes is 28 files to keep in step.

**Context:** The `roles` check in [Repository guard](../design/architecture/repository-guard.md) reports drift.
Generation would extend `guard.py sync`.

## Stale hooks and scripts text in setup guides and README

**Backlogged at:** 2026-11-12T12:30:00Z

**What:** Rewrite the setup guides and README install steps that name the removed scripts and hooks, after the
scripts and hooks are reimplemented.

**Why backlogged:** Every script and hook was removed for reimplementation, so the text cannot be corrected until
the replacement exists.

**Context:** `skills/gobbi/setup/claude.md` lines 113-115 name removed hooks, and the CHANGELOG Removed entry
records the gap. See [Session hooks](../design/feature/stop-reminder.md).

## Step versus change wording

**Backlogged at:** 2026-11-12T12:30:00Z

**What:** Settle one term for a unit of work in skill prose: "step" or "change".

**Why backlogged:** Both terms appear for the same idea, and the session did not choose between them.

**Context:** Found while editing skills in the 2026-11 refactor. Ontology's one-term-per-concept test applies. See
[Ontology](../../skills/ontology/SKILL.md).

## `AA` in `ALLOWED_CAPS`

**Backlogged at:** 2026-11-12T12:30:00Z

**What:** Decide whether `AA` (as in WCAG 2.2 AA) stays in the allowed ALL-CAPS list of the skill checker.

**Why backlogged:** It is in `ALLOWED_CAPS` for one design-skill phrase, and an allow list that grows per phrase
weakens the check.

**Context:** See `ALLOWED_CAPS` in `skills/gobbi-skill/scripts/skill_checks/checks.py` and [Repository
guard](../design/architecture/repository-guard.md).

## Inert nested `Skill(...)` entries in `.claude/settings.json`

**Backlogged at:** 2026-11-12T12:30:00Z

**What:** Remove the nested `Skill(...)` permission entries in `.claude/settings.json` that grant nothing.

**Why backlogged:** They are inert, so they only mislead a reader of the settings file.

**Context:** Found while checking the Claude setup during the 2026-11 refactor.

## Socratic Method Phase 4 Status check

**Backlogged at:** 2026-11-12T12:30:00Z

**What:** Decide whether Socratic Method Phase 4 should check each element's Status field before the final pass.

**Why backlogged:** A review noted that the final pass does not confirm every element carries a Status; the
accepted work did not include it.

**Context:** See [Socratic Method](../../skills/socratic-method/SKILL.md) Phase 4 and [the
design](../design/feature/socratic-method-skill.md).

## Treat an ellipsis as no sentence end in the `sentences` check

**Backlogged at:** 2026-11-12T12:30:00Z

**What:** Make the `sentences` check treat `...` as a pause, not a sentence end.

**Why backlogged:** Review 04 found that an ellipsis can split one sentence into two and flag a bullet that has at
most two sentences.

**Context:** See the `sentences` check in [Repository guard](../design/architecture/repository-guard.md) and
`skill_checks/checks.py`.
