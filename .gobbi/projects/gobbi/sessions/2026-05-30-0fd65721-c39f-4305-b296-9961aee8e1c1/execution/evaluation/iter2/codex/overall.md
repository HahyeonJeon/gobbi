# Execution Iter-2 Focused Re-check — Codex Overall

P1 RESOLVED — `scripts/validate-plugin-hooks-fire-once.sh` no longer documents nonexistent `--url` / `--branch` flags, uses a positional marketplace source, keeps cleanup, and parses cleanly.

Evidence:

```text
$ grep -c -- '--url' scripts/validate-plugin-hooks-fire-once.sh ; grep -c -- '--branch' scripts/validate-plugin-hooks-fire-once.sh
0
0

$ grep -n 'marketplace add' scripts/validate-plugin-hooks-fire-once.sh
61:#   claude plugin marketplace add \

$ sed -n '55,68p' scripts/validate-plugin-hooks-fire-once.sh
#   # The worktree root contains .claude-plugin/marketplace.json which
#   # indexes the gobbi plugin.  <source> is a positional argument (URL,
#   # local path, or GitHub repo).  No flag selects a specific remote branch.
#   #
#   # Optional: pass --sparse ".claude-plugin plugins" to limit the checkout
#   # to only the plugin-relevant dirs.
#   claude plugin marketplace add \
#     /playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-30-0fd65721
#
#   # List available plugins and identify the gobbi marketplace entry name:
#   claude plugin marketplace list
#   # (note the <marketplace-name> shown for "gobbi")
#
#   # Install using the marketplace-qualified name:

$ grep -n 'marketplace remove' scripts/validate-plugin-hooks-fire-once.sh
187:#   claude plugin marketplace remove <marketplace-id>

$ bash -n scripts/validate-plugin-hooks-fire-once.sh ; echo exit=$?
exit=0
```

S1 RESOLVED — `scripts/sync-plugin-package.sh --check` now rejects both a missing required allow-set member and an unexpected extra member, while the restored package passes.

Evidence:

```text
$ bash scripts/sync-plugin-package.sh --check ; echo clean=$?
sync-plugin-package.sh: checking allow-set membership in /playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-30-0fd65721/plugins/gobbi ...
sync-plugin-package.sh:   allow-set: OK (entries: .claude-plugin agents hooks skills)
sync-plugin-package.sh: checking content sync ...
sync-plugin-package.sh:   skills: in sync
sync-plugin-package.sh:   agents: in sync (5 .md files, 0 .toml)
sync-plugin-package.sh:   hooks/session-start.sh: in sync (+x)
sync-plugin-package.sh:   hooks/post-tool-use-agents.sh: in sync (+x)
sync-plugin-package.sh:   symlinks: 0 (all real files)
sync-plugin-package.sh: --check PASSED
clean=0

$ mv plugins/gobbi/hooks /tmp/h2 ; bash scripts/sync-plugin-package.sh --check ; echo missing=$? ; mv /tmp/h2 plugins/gobbi/hooks
sync-plugin-package.sh: checking allow-set membership in /playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-30-0fd65721/plugins/gobbi ...
FAIL allow-set: required entry missing from plugins/gobbi/: hooks
sync-plugin-package.sh: checking content sync ...
FAIL: package dir missing: /playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-30-0fd65721/plugins/gobbi/hooks
sync-plugin-package.sh: --check FAILED
missing=1

$ mkdir plugins/gobbi/STRAY ; bash scripts/sync-plugin-package.sh --check ; echo stray=$? ; rmdir plugins/gobbi/STRAY
sync-plugin-package.sh: checking allow-set membership in /playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-30-0fd65721/plugins/gobbi ...
FAIL allow-set: unexpected entry in plugins/gobbi/: STRAY
sync-plugin-package.sh: checking content sync ...
sync-plugin-package.sh: --check FAILED
stray=1

$ bash scripts/sync-plugin-package.sh --check ; echo restored=$?
sync-plugin-package.sh: checking allow-set membership in /playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-30-0fd65721/plugins/gobbi ...
sync-plugin-package.sh:   allow-set: OK (entries: .claude-plugin agents hooks skills)
sync-plugin-package.sh: checking content sync ...
sync-plugin-package.sh:   skills: in sync
sync-plugin-package.sh:   agents: in sync (5 .md files, 0 .toml)
sync-plugin-package.sh:   hooks/session-start.sh: in sync (+x)
sync-plugin-package.sh:   hooks/post-tool-use-agents.sh: in sync (+x)
sync-plugin-package.sh:   symlinks: 0 (all real files)
sync-plugin-package.sh: --check PASSED
restored=0
```

C1 RESOLVED — `features/install-runtime/README.md` now has a 2026-05-31 recent-activity row referencing the plugin package build.

Evidence:

```text
$ grep -n '2026-05-31' .gobbi/projects/gobbi/features/install-runtime/README.md
10:last_updated: 2026-05-31
65:| 2026-05-31 | 0fd65721 | Plugin package build: plugins/gobbi/ + .claude-plugin/marketplace.json, 19 packaged skills, DD-8 dev-vs-installed hook split, claude-plugin skill (skill 19) |
```

## Regression

No regression found in the requested sweep.

Evidence:

```text
$ claude plugin validate --strict ./plugins/gobbi ; echo validate=$?
Validating plugin manifest: /playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-30-0fd65721/plugins/gobbi/.claude-plugin/plugin.json

✔ Validation passed
validate=0

$ git status --short .claude/settings.json

$ git diff --name-only -- plugins/gobbi/

$ ls plugins/gobbi/skills/ | wc -l ; find plugins/gobbi -type l | wc -l
19
0
```

VERDICT: PASS
