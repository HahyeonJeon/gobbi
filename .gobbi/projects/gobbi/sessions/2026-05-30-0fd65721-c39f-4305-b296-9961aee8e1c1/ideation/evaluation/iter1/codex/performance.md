# Performance Perspective - Codex Evaluation

## Artifact Summary + Memory reads

The draft's performance surface is mostly install/load cost rather than runtime hot paths. I checked local payload sizes and official cache behavior because DD-2/DD-4 combine repo-root plugin source with marketplace install.

## Locked Frame (Stage 1)

- Scenario: plugin install/update copies only the intended payload, or the artifact explicitly budgets the extra cost.
- Scenario (adversarial): repo-root source copies session memory and other non-plugin material into the plugin cache.
- Scenario: hook runtime cost remains bounded after plugin registration.

## Per-scenario per-check results

- Hook runtime behavior is already bounded in the existing scripts: `post-tool-use-agents.sh` exits early for non-Task/Agent tool names at `.claude/hooks/post-tool-use-agents.sh:55-58`.
- The artifact does not inventory plugin-cache payload size or cache churn under repo-root source.

## Typed findings

### PERF1 - Repo-root source has no payload budget despite cache-copy semantics

- Type: assumption_risk
- Severity: Medium
- Confidence: 75
- Evidence: `ideation/rawdata/draft-iter1.md:231-239` selects repo root as plugin root and canonical `.gobbi` component paths; `ideation/rawdata/draft-iter1.md:249-256` recommends in-repo marketplace install. Official Claude docs state marketplace plugins are copied into `~/.claude/plugins/cache` (`https://code.claude.com/docs/en/plugins-reference`, plugin caching). Local size check: current worktree is 81M; `.gobbi/` is 80M; `.gobbi/projects/gobbi/sessions` is 77M, while `.gobbi/projects/gobbi/skills` is 1.2M and `.gobbi/projects/gobbi/agents` is 84K.
- Why-it-matters: The design assumes repo-root source is only a path-resolution choice, but install/update cost may be dominated by session memory and other non-plugin material. Versioned cache copies could grow quickly as sessions accumulate.
- Suggested-direction: Add a Planning validation item that measures the installed cache payload and decides whether repo-root source needs an exclusion/payload-boundary strategy, while preserving DD-2's requirement that installed component paths reference real canonical files.

## Low-confidence appendix

None.
