## Findings

### U1 — Handoff pointers use shorthand paths that do not resolve from the worktree

Type: checklist_gap

Severity: High

Confidence: 100

Evidence:
- Command output:

```text
exists: plugins/gobbi/.claude-plugin/plugin.json
exists: plugins/gobbi/skills
exists: plugins/gobbi/hooks/hooks.json
exists: .claude-plugin/marketplace.json
exists: scripts/sync-plugin-package.sh
exists: .gobbi/projects/gobbi/skills/claude-plugin/SKILL.md
exists: .claude/skills/claude-plugin/SKILL.md
missing: features/install-runtime/README.md
missing: sessions/2026-05-30-0fd65721-c39f-4305-b296-9961aee8e1c1/execution/artifacts/execution-summary.md
missing: notes/2026-05-31-gobbi-claude-code-plugin.md
```

- The corresponding real paths do exist only with the project-memory prefix:

```text
exists: .gobbi/projects/gobbi/features/install-runtime/README.md
exists: .gobbi/projects/gobbi/sessions/2026-05-30-0fd65721-c39f-4305-b296-9961aee8e1c1/execution/artifacts/execution-summary.md
exists: .gobbi/projects/gobbi/notes/2026-05-31-gobbi-claude-code-plugin.md
```

Why-it-matters:
The handoff standard requires verifiable pointers. A future agent opening the handoff from the worktree root cannot directly open several cited artifacts, including the session journal, execution summary, and promoted feature README.

Suggested-direction:
Rewrite handoff pointers as repo-root-relative paths under `.gobbi/projects/gobbi/...`; replace `sessions/...` ellipses with the full session directory path.
