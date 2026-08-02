# Project Backlog

## agent-writing template still hardcodes the agents path

**Backlogged at:** 2026-08-02T12:16:00Z

**What:** Remove the remaining hardcoded `.gobbi/projects/gobbi/agents/{role}.md` path from
`agent-writing/SKILL.md` (7 occurrences), replacing it with the `{gobbi-agents-root}` placeholder the five
live role-contract wrappers now use.

**Why backlogged:** The template and the five live `.toml` wrappers must change together, or the identity
check that compares the template's string against each wrapper's string breaks. The 2026-08-02 locator session
deliberately left this unfixed rather than half-fixing it — see
[`learnings/dev/mistakes.md`](../learnings/dev/mistakes.md#fixing-one-copy-of-a-duplicated-invariant).

**Context:** Raised during the same session that converted the five wrappers to reference the role contract's
resolved roots instead of a hardcoded path.

## check-markdown-links.sh never inspects the plugin mirror

**Backlogged at:** 2026-08-02T12:16:00Z

**What:** Change `scripts/check-markdown-links.sh`'s file discovery from `find -type f` to `find -xtype f` (or
equivalent), so it inspects the 159 symlink `.md` leaves under `.claude/skills/` rather than skipping all of
them.

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

## Consumer-project README setup section

**Backlogged at:** 2026-08-01T15:05:03Z

**What:** Add a setup section to the project README covering how `.gobbi/` bootstraps in a consumer project.

**Why backlogged:** Out of scope for the 2026-08-01 bootstrap fix, which focused on skill and ignore-rule
behavior rather than user-facing documentation.

**Context:** The bootstrap is defined in `gobbi/SKILL.md` Procedure Step 1.1 and recorded in
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

## Git skill stop condition missing a detection command

**Backlogged at:** 2026-08-01T15:05:03Z

**What:** Add a named detection command to the `git/SKILL.md` Step 2.1 stop condition for "a required path
component exists as a file or a symbolic link instead of a directory." The other stop conditions in that step
each name a detection command; this one only says to name the path and what it is.

**Why backlogged:** Trivially detectable by inspecting the path directly, so shipping the 2026-08-01 fix
without spending another review cycle on it was preferred to leaving the whole fix unshipped.

**Context:** The sibling stop conditions and this gap are described in
[`design/architecture/consumer-project-bootstrap.md`](../design/architecture/consumer-project-bootstrap.md#stop-conditions).

## Guardrail gaps in two `.toml` role wrappers

**Backlogged at:** 2026-08-02T12:16:00Z

**What:** Decide whether `assistant.toml` needs a git/scope guardrail clause and whether `manager.toml` needs
the conflict-precedence clause the other four role wrappers carry.

**Why backlogged:** `agent-writing/SKILL.md`'s P3 template requires a git/scope guardrail clause (c) for any
role that writes to the worktree; `assistant.toml` has none, though the assistant role writes to the worktree
during RECORD and Wrap-up WORK. `manager.toml` lacks the conflict-precedence clause the other four wrappers
carry, which reads as a pre-existing asymmetry rather than a clear defect. Both need a user decision on
whether the omission is intentional.

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
and bootstrapping it through the `git` skill instead, without reviving a CLI.

**Context:** `packages/cli` was deleted when Gobbi moved to plugin-only distribution for v1.0.0; that
deletion is the root cause analyzed in
[`reports/analysis/2026-08-01-consumer-project-bootstrap-gap.md`](../reports/analysis/2026-08-01-consumer-project-bootstrap-gap.md).

## Role-contract references to nonexistent consumer-project surfaces

**Backlogged at:** 2026-08-02T12:16:00Z

**What:** Fix four remaining role-contract gaps, same defect class as the 2026-08-02 locator fix but outside
that fix's scope: `plugins/gobbi/` is cited as a Codex runtime surface in `leader.md`, `executor.md`,
`evaluator.md`, and `assistant.md`, though that directory does not exist in a consumer project;
`executor.md` cites the user's own auto-memory file (`feedback_path_formatting`) as a memory rule, unreachable
from any consumer project; `assistant.md` names a "Project skill" that does not exist anywhere in the tree;
`assistant.md`'s frontmatter description still names `record/SKILL.md` and `wrap-up/SKILL.md Phase 2.1` by an
older convention.

**Why backlogged:** Each was raised during the 2026-08-02 locator session as a finding with no owning task and
was still present in the tree at session end. The first is the strongest candidate, being the same defect
class as the session's own reported cause; the "Project skill" gap would require inventing a destination
rather than converting an existing reference, so it needs a design decision, not a mechanical fix.

**Context:** Raised as findings F3, F4, F5, and F6 during the session that produced
[`design/architecture/plugin-skill-locator.md`](../design/architecture/plugin-skill-locator.md).
