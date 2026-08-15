# Handoff · Grok system integration

> **Work status:** Complete
>
> The accepted Grok third-runtime stack is on `feat/grok-system-integration` at `83cd0771`. This note is the
> tracked Wrap-up operator brief. It records Git intent only. It does not claim that the Memory commit, merge,
> push, or cleanup occurred.

| Context | Value |
|---|---|
| Caller context | `Workflow Wrap-up Phase 2 Memory` |
| Session | `76cdda92-29f7-4141-94da-3ea9060b9cdb` |
| Prepared | `2026-08-15T14:49:00Z` |
| Base | `develop @ f689de3f8e341483b0a53a187b4ee3aee4a95996` |
| Work branch | `feat/grok-system-integration` |
| Worktree | `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/2026-08-15-grok-integration-76cdda92-29f7-4141-94da-3ea9060b9cdb` |
| Work head and tree | `83cd0771e82aa12952e94bc3775cab3a6ba08924` tree `4ef307d403bc06dafef391b24d58c4d64bc4d96f` |
| Git intent | `local Memory commit, then fast-forward develop to the accepted work head; no push; no cleanup` |

## Delivered

- **Third Grok discovery and install stack:** Linked `.grok/skills` to the same canonical skills as the
  Claude and Codex mirrors. Added a Grok-native marketplace path and a project `.grok/plugins` pointer to
  `./plugins/gobbi`. Claude marketplace and Codex `plugin add` stay.
  **Evidence:** `3783ea61`, `909cc2dd`, `2e899cbc`.
- **Named Partner policy:** Session policy is `disabled` or one or two of `{claude-code,codex,grok}`. Launch
  skips the active runtime. An empty launch set after skip stays valid and is not rewritten to `disabled`.
  **Evidence:** `bb366784`, `076e913a`.
- **Measured Grok Partner launch:** Grok 1.0.4 launches with `--sandbox workspace`. Session and project
  postimage may change only the contracted writing path. `--always-approve` is not the restricting flag.
  Each launch starts through a local wrapper subagent. Claude and Codex command rows stay. Agent Teams stays
  Claude-only.
  **Evidence:** `6f86bc2b`, `f2ec3d8a`, `552e2025`, `abef1601`, `83cd0771`.

## Accepted commits

`3783ea61` through `83cd0771` on `feat/grok-system-integration`:

- `3783ea61016e8dd9cc1662f0781174678678a2c3` — feat(grok): add linked .grok/skills discovery mirror
- `909cc2dd72852f93afa11044f6a18fa68b4b4cc5` — feat(grok): add project plugin pointer and name Grok
- `bb366784a87affc9429b15cc3aa742efec4135e8` — feat(gobbi): replace Partner boolean with named runtime set
- `3c276e26dee676db11fcd1a03923ebd9869daf2d` — docs(partner): record measured Grok launch
- `6f86bc2b0464d50c2a0d6a876c0bceb77590c361` — docs(partner): record Grok launch as Unavailable
- `2e899cbcdd21bcb8c5ca6c44278b5862bf321b94` — docs(grok): record third runtime contract and participants
- `f2ec3d8ae0977d3c312848610e9872e245781977` — feat(partner): allow Grok launch with named home residual writes
- `552e2025fe3cb07f314a662b226b74f884d23568` — fix(partner): align write-containment rule with Grok-home exception
- `076e913aaff91683424cf292ed9a968032f830f8` — docs(partner): state skip-self in runtime-neutral terms
- `abef16011e92eb9c996075a785ba0bab517317ee` — docs(partner): drop named Grok-home residual-write comments
- `83cd0771e82aa12952e94bc3775cab3a6ba08924` — feat(partner): launch through wrapper subagents

## Memory

- **Created:** `.gobbi/projects/gobbi/memory/history/2026-08-15-grok-system-integration.md` and
  `.gobbi/projects/gobbi/memory/reports/note/2026-08-15-grok-system-integration.md`.
- **Updated:** `.gobbi/projects/gobbi/memory/history/README.md`,
  `.gobbi/projects/gobbi/memory/reports/README.md`,
  `.gobbi/projects/gobbi/memory/learnings/work/tips.md`,
  `.gobbi/projects/gobbi/memory/backlogs/project.md`, and
  `.gobbi/projects/gobbi/memory/backlogs/README.md`.
- **No change:** `design/feature/partner.md`, `design/architecture/plugin-skill-locator.md`,
  `design/architecture/consumer-project-bootstrap.md`, and `design/feature/agent-teams.md` already match the
  accepted tree.
- **Moved or removed:** None.

## Quality and decisions

- **Verification:** Five Execution tasks passed. Whole-Execution product at `83cd0771` passed. EXE-01 record
  repair is included. This session Partner policy stays `disabled`.
- **Decisions to respect:** Grok is a first-class runtime stack. `.grok/skills` is a discovery mirror, not
  `{gobbi-skills-root}`. Partner token is `disabled` or one or two named runtimes with skip-self. Grok launch
  requires the write-bound AND rule. Claude and Codex install paths stay. Agent Teams stays Claude-only.
  Publication is local. Cleanup is not authorized. Unused Cowork UUID `d4c7aef4-8a1f-4eea-882b-52f43db41674`
  and branch `feat/grok-integration` stay protected.
- **Limits and risks:** The Memory commit, fast-forward of `develop`, push, and cleanup have not been
  attempted. This session did not launch Partner. Project `.grok/config.toml` remains deferred.

## Continue

> **Next objective:** Manager evaluates the pre-Git Memory tree. Do not commit from this brief.

**Read first**

1. `.gobbi/projects/gobbi/memory/history/2026-08-15-grok-system-integration.md`
2. `.gobbi/projects/gobbi/memory/reports/note/2026-08-15-grok-system-integration.md`
3. `.gobbi/projects/gobbi/memory/design/feature/partner.md`

**First command**

```bash
git -C /playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/2026-08-15-grok-integration-76cdda92-29f7-4141-94da-3ea9060b9cdb status --short --branch
```
