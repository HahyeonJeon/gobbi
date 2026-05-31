# Structure Perspective - Codex Evaluation

## Artifact Summary + Memory reads

The design chooses repo root as the Claude plugin root and points plugin component keys at canonical real files under `.gobbi/projects/gobbi/skills|agents`, avoiding the `.claude/` symlink mirror. I verified the current mirror shape with `ls -la .claude/skills/gobbi/` and `readlink .claude/skills/gobbi/SKILL.md`, and verified the canonical agents directory contains both Markdown role prompts and TOML Codex wrappers.

## Locked Frame (Stage 1)

- Scenario: the proposed plugin manifest component paths map cleanly to the Claude plugin schema.
- Scenario (adversarial): a directory-pointer pattern that is valid for skills is incorrectly generalized to agents.
- Scenario: the canonical source tree includes exactly the content intended for the plugin payload.

## Per-scenario per-check results

- DD-2's symlink-avoidance reasoning is internally sound: `.claude/skills/gobbi/SKILL.md` points to `../../../.gobbi/projects/gobbi/skills/gobbi/SKILL.md`, while the canonical `.gobbi/projects/gobbi/skills/` files are real.
- The draft overgeneralizes the skills directory-pointer shape to agents without proving the Claude `agents` manifest key accepts a directory.

## Typed findings

### S1 - Agent manifest path is underspecified and may be structurally wrong

- Type: design_flaw
- Severity: High
- Confidence: 75
- Evidence: `ideation/rawdata/draft-iter1.md:231-239` recommends `agents` -> `./.gobbi/projects/gobbi/agents/`. Official Claude docs describe the `agents` manifest field as custom "agent files" and show file paths such as `./custom/agents/reviewer.md` and `./custom/agents/security.md` (`https://code.claude.com/docs/en/plugins-reference`, component path fields and examples). Local evidence: `.gobbi/projects/gobbi/agents/` contains both `manager.md` and `manager.toml` style files.
- Why-it-matters: DD-1 requires five role agents to install. If Planning copies the artifact literally and sets `agents` to a directory the schema expects as file paths, the plugin may validate poorly or silently fail to load the agents. Even if directories are accepted in practice, pointing at the whole directory risks including Codex TOML wrappers that are not Claude agent files.
- Suggested-direction: Keep the ratified canonical-source principle, but make the agent component shape explicit before Planning: either cite evidence that a directory is valid for `agents`, or name the five canonical `.md` agent files as the intended manifest entries and explicitly exclude the `.toml` wrappers.

## Low-confidence appendix

None.
