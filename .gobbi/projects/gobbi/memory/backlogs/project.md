# Project Backlog

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
