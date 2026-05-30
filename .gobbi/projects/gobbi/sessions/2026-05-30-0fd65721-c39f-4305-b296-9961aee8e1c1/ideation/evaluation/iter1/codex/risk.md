# Risk Perspective - Codex Evaluation

## Artifact Summary + Memory reads

The highest risk surfaces are install-cache payload boundaries, hook double-registration, symlink/security behavior, and externally documented marketplace path resolution. I spot-checked the official docs for symlink skipping and `${CLAUDE_PLUGIN_ROOT}`; those core DD-2/DD-3 premises are credible. The residual risks are mostly what the artifact does not yet force Planning to settle.

## Locked Frame (Stage 1)

- Scenario: installed plugin cache contains no sensitive or unnecessary project/session material.
- Scenario: project-local and plugin-provided hooks cannot both fire unintentionally.
- Scenario (adversarial): a security-motivated symlink rule is handled, but a different cache-copy path leaks more than intended.

## Per-scenario per-check results

- The symlink-skip premise is supported by the staged reference and official docs: escaping symlinks are skipped for security.
- The artifact flags hook double-registration but leaves it as a Planning residual.
- The artifact does not discuss the privacy/security impact of copying the whole repo root into a plugin cache.

## Typed findings

### R1 - Repo-root install may copy session memory into the global plugin cache

- Type: assumption_risk
- Severity: High
- Confidence: 75
- Evidence: `ideation/rawdata/draft-iter1.md:231-239` chooses repo root and canonical `.gobbi` paths; `draft-iter1.md:249-256` chooses local marketplace install. Official Claude docs state marketplace plugins are copied to `~/.claude/plugins/cache` (`https://code.claude.com/docs/en/plugins-reference`, plugin caching). Local size check shows `.gobbi/projects/gobbi/sessions` is 77M inside the repo-root payload candidate.
- Why-it-matters: The design fixes the escaping-symlink security problem by making `.gobbi` inside the plugin root, but that may also make session memory and other project-private material part of the installed cache. This changes the risk profile from "empty plugin due skipped symlinks" to "overbroad plugin cache payload."
- Suggested-direction: Add a risk gate before Execution: inspect what Claude actually copies for repo-root source, decide whether session memory must be excluded, and define a validation that checks the cache contents after install.

### R2 - Double-registration is surfaced, but still a real design hole

- Type: design_flaw
- Severity: Medium
- Confidence: 75
- Evidence: `ideation/rawdata/draft-iter1.md:51` leaves open whether plugin hooks replace or coexist with `.claude/settings.json`; `ideation/rawdata/discussion-log.md:24-25` says this is a non-blocking Planning residual. Current `.claude/settings.json:31-55` already registers `SessionStart`, `PostToolUse`, and `PostToolUseFailure` hooks. `session-start.sh` appends exports at `.claude/hooks/session-start.sh:51-55`; `post-tool-use-agents.sh` writes `session.json` at `.claude/hooks/post-tool-use-agents.sh:224-249`.
- Why-it-matters: If both project-local and plugin hook registrations fire, duplicate env exports and duplicate or competing `session.json` upserts are plausible. If the project-local hooks are removed too aggressively, existing non-plugin sessions may lose runtime behavior. This is not merely an implementation detail because DD-3 says registration is relocated.
- Suggested-direction: Treat hook-registration disposition as a Planning blocker, not a loose residual: choose the intended steady state and require a validation that proves each hook fires exactly once after install.

## Low-confidence appendix

None.
