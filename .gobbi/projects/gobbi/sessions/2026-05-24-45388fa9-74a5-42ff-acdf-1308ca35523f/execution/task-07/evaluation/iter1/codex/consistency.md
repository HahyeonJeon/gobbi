# Consistency

## Finding CONS-001

Type: design_flaw (docs-sync)
Severity: High
Confidence: 100
Evidence: `.codex/AGENTS.md:45` still says the 6-step state machine lives in `packages/cli/src/specs/` and is driven by `gobbi workflow init`; `.codex/AGENTS.md:80-82` still instructs agents to run `gobbi mistake promote` and write corrections directly to `.gobbi/projects/{name}/mistakes/`. This contradicts `.claude/CLAUDE.md:13` and `.claude/CLAUDE.md:50`, `.gobbi/projects/gobbi/skills/gobbi/SKILL.md:189-194`, `.gobbi/projects/gobbi/skills/wrap-up/SKILL.md:53-55`, and `.gobbi/projects/gobbi/skills/mistake/SKILL.md:11` / `:27` / `:45-47`. Verification: `ls packages/cli` fails with "No such file or directory"; targeted grep of the three contracted target docs returns 0 for `gobbi mistake promote`.
Why: `.codex/AGENTS.md` is a mandatory Codex session-start entrypoint in this repository, so the defect remains live for Codex agents even though the three contracted documentation surfaces were corrected. It preserves both stale mechanisms the task was supposed to eliminate: a nonexistent CLI command and direct project-memory mistake writes instead of session staging plus the Wrap-up sole-writer exception.
Suggested-direction: Revise `.codex/AGENTS.md` to mirror the corrected `.claude/CLAUDE.md` wording for line 13 and the mistake-promotion section, or update the canonical generator/source if this file is generated. Keep the four T07 target-file fixes as-is.

