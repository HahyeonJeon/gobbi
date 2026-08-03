# Locator, partner, and Agent Teams shipped

**Completed at:** 2026-08-02T12:06:41Z

## Changes

- Rebuilt skill and agent discovery for a plugin-installed consumer project: the Gobbi entry now takes the
  location its active entrypoint reports, derives `{gobbi-skills-root}` and `{gobbi-agents-root}` from it, and
  validates three sentinels before any role loads a skill — replacing 59 hardcoded
  `.gobbi/projects/gobbi/...` references across the five role contracts. Full design and the measured runtime
  facts behind it: [`design/architecture/plugin-skill-locator.md`](../design/architecture/plugin-skill-locator.md).
- Renamed the Claude-and-Codex dual system to **partner** and gave it one canonical owner,
  `gobbi/partner/SKILL.md`, covering both launch directions; deleted `codex/peer-adapters.md` and reduced
  `codex/SKILL.md` to CLI usage. Retargeted 14 duplicated policy regions in Workflow onto the new child.
  Design: [`design/feature/partner.md`](../design/feature/partner.md).
- Built `gobbi/agent-teams/SKILL.md` from nothing, closing the gap where a plugin cannot ship `env` or
  `permissions` and nothing previously checked whether Agent Teams' prerequisite setting had arrived. Added a
  preflight, a five-phase lifecycle, and a degraded terminal state; added a configuration gate at the entry
  recommending the prefixed `gobbi:*` identifier form for a consumer project. Design:
  [`design/feature/agent-teams.md`](../design/feature/agent-teams.md).
- Wired both systems into Cowork: executable partner rounds, a user-called Structured-depth creation offer,
  and commit-gated teammate reuse, closing the reported gap where neither system worked in that mode.
- Found and fixed a fifth defect during the work: the materialized Codex plugin package delivered almost
  nothing. Materialized it properly at version `1.0.1` behind a generator and a byte-equality guard — measured
  2 files growing to 172, all 64 nested `SKILL.md` files present.
- Ran an independent Claude evaluation (verdict REVISE, three High findings, all closed) and three external
  validation probes against fresh consumer fixtures on both runtimes, producing the first direct measurement
  of the plugin's skill-acquisition mechanism, its namespacing behavior, and the absence of any plugin-root
  environment variable on either runtime. Full record:
  [`reports/review/2026-08-02-locator-partner-agentteams-review.md`](../reports/review/2026-08-02-locator-partner-agentteams-review.md).
- Left four role-contract references and one link-checker coverage gap open with no owning task; recorded in
  [`backlogs/project.md`](../backlogs/project.md) rather than fixed in this session.
