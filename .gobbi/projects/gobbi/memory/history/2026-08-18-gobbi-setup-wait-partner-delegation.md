# Standalone gobbi-setup, mode wait, partner sandbox, and delegation briefs completed

**Completed at:** 2026-08-18T15:37:21Z

## Changes

- Extracted consumer scaffolding and the prerequisite checker into standalone
  `gobbi-setup`. Renamed the writer `apply-setup.sh` to `setup.sh`. Gobbi entry
  no longer runs setup or the checker. Setup creates project-namespace `agents/`
  and `skills/` plus Memory-shaped `memory/*` README stubs, and does not invent
  learnings or backlog files. See
  [consumer project bootstrap](../design/architecture/consumer-project-bootstrap.md).
  Same-day earlier record
  [setup skill and package generation](2026-08-18-setup-skill-and-package-generation.md)
  still names `apply-setup.sh` as point-in-time truth.
- Stopped Cowork and Workflow from starting work after Configuration. Workflow
  phase TODOs are now User Review; `handoff.md` remains the recovery file.
  Intra-phase work stays autonomous. The session-start base is
  `git branch --show-current` of the checkout Gobbi started in and is never asked.
- Set Partner cwd and write root to the worktree. Partner may read outside the
  worktree, may change any worktree file, and may use workspace-bounded Bash.
  Main checkout stays read-only. No bypass or full-access flags. Cursor remains
  Unavailable. See [Partner](../design/feature/partner.md).
- Reworked Delegation so Role sits above Context; Task states the goal, a
  world-best quality bar, and the minimum result; purpose stays in Instructions;
  Materials is required, not exclusive. See
  [collaborative design and delegated results](../design/process/collaborative-design-and-delegated-results.md).
- Four commits on `feat/improve-skills` from `3aec2f8b`: `35f020cb`, `f569968e`,
  `09018664`, `8cde8234`.
