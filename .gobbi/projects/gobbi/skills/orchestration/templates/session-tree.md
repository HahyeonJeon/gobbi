# Session-tree spec

The single source of truth for the per-session working tree at
`.gobbi/projects/{project-name}/sessions/{date}-{session-id}/`.

Every skill doc that names a session path points here. The scaffold script
[`scaffold-session-dir.sh`](../scripts/scaffold-session-dir.sh) materializes this
tree; the verify script [`verify-session-tree.sh`](../scripts/verify-session-tree.sh)
diffs the script's output against this doc and fails on drift. This doc — not the
prose scattered across the skills — defines the shape.

---

## Canonical session tree

```
sessions/{date}-{session-id}/                  ← session root
├── session.json                  metadata — telemetry (manager init + assistant UPSERT)
├── state.json                    metadata — workflow state machine (manager)
├── settings.json                 metadata — resolved config (cascade)
├── session.json.lock             metadata — advisory write-lock
├── transcripts/                  SINGLE transcript surface — every agent, whole session:
│   ├── manager-{sessionId}.jsonl       manager transcript (id = session id)
│   └── {role}-{agentId}.jsonl          one immutable file per agent run,
│                                        accumulating across ALL loops by distinct
│                                        agentId, never overwritten.
│                                   Copied by the assistant at MEMORIZATION.
│                                   Session-scoped, gitignored, never promoted,
│                                   removed at worktree cleanup. NO per-loop transcripts/.
└── {N}-{loop}/                   number-prefixed loop dir (one per workflow loop):
                                    1-ideation  2-preparation  3-planning
                                    4-execution  5-wrap-up
    ├── working/                  raw working capture (the only scratch surface):
    │   ├── draft-iter{n}.md            mutable working draft (WORK)
    │   ├── discussion-log.md           append-only AskUserQuestion journal (manager)
    │   └── research/{slug}.md          pre-staging external refs (leader, research skill)
    ├── evaluation/               per-iter dual-system eval:
    │   └── iter{n}/{claude,codex}/{perspective}.md + overall.md
    ├── staging/                  typed-finding stagings (Wrap-up promotion source):
    │   └── {scenarios,checklists,decisions,references,design,discussions,
    │        backlogs/{feature,project},reviews,reports,changelogs,learnings,notes,
    │        skills (2-preparation only), plans (3-planning only)}/{slug}.md
    └── outputs/                  PASS-only loop output:
        └── {free-filename}.md          carries the Artifact frontmatter schema

# 4-execution/ per-task nesting (recursive 4-slot interior; no per-task transcripts/):
4-execution/
├── staging/{...}/                loop-level (cross-task) staging
└── task-{NN}-{slug}/             e.g. task-01-scaffold-script/
    ├── working/
    │   └── research/
    ├── evaluation/
    ├── staging/
    └── outputs/
    # No transcripts/ here — every agent's transcript lives in session-root transcripts/.

# interview/ — BOOTSTRAP EXCEPTION:
# NOT a workflow loop, NOT swept to the flat-4-slot + number-prefix shape.
# Keeps its own bootstrap shape. Explicitly out of scope for this spec.
```

The loop interior is **4 slots only** — `working/`, `evaluation/`, `staging/`,
`outputs/`. There is no per-loop `transcripts/` dir. The single session-root
`transcripts/` holds every agent's transcript for the whole session.

---

## The `{N}-{loop}` ordinal map

On-disk loop dirs carry a number prefix. The number is the loop's order in the
workflow, fixed:

| `{N}` | `{loop}` | On-disk dir |
|---|---|---|
| 1 | ideation | `1-ideation` |
| 2 | preparation | `2-preparation` |
| 3 | planning | `3-planning` |
| 4 | execution | `4-execution` |
| 5 | wrap-up | `5-wrap-up` |

`{N}-{loop}` is the only valid on-disk loop-dir form. `{date}` is the session
start date in `YYYY-MM-DD`. `{session-id}` is the parent session's Claude Code
session id (8-4-4-4-12 UUID). `{n}` is the per-loop (or per-task) iteration
number. `{slug}` is a kebab-case identifier set by the writer.

---

## SEAM-3 — on-disk prefix vs bare JSON key (TRAP)

This is the single most error-prone part of the spec. Read it before editing any
session-path prose.

- **On disk**: loop dirs carry the `{N}-` prefix — `1-ideation`, `4-execution`.
- **In JSON**: the `workflow.{loop}` keys in `session.json` and `state.json` stay
  **BARE** — `workflow.ideation`, `workflow.execution`. No number prefix, ever.

The number prefix is a filesystem-ordering device only. The state machine keys it
by bare loop name. Do NOT add `{N}-` to a JSON key, and do NOT strip it from a dir
path. A renamed JSON key breaks the state machine; an unprefixed dir breaks the
scaffold/verify contract. The two namespaces are deliberately different shapes for
the same loop.

---

## Per-slot dir contract

Each loop dir (and each `4-execution/task-{NN}-{slug}/`) holds exactly these four
slots.

| Slot | Holds | Writer | Created | Lifecycle |
|---|---|---|---|---|
| `working/` | Mutable scratch: `draft-iter{n}.md` (WORK draft), `discussion-log.md` (append-only AskUserQuestion journal), `research/{slug}.md` (pre-staging external refs) | executor / leader (drafts, research); manager (discussion-log) | At loop/task entry | Session-scoped, gitignored, never promoted, removed at cleanup |
| `evaluation/` | `iter{n}/{claude,codex}/{perspective}.md` + `overall.md` — per-iter dual-system evaluation output | evaluator | At loop/task entry | Session-scoped, gitignored, never promoted, removed at cleanup |
| `staging/` | Typed-finding stagings — the **only** Wrap-up promotion source | executor / leader / assistant | At loop/task entry | Session-scoped, gitignored; **promoted** by Wrap-up into tracked project/feature memory |
| `outputs/` | PASS-only loop output; `{free-filename}.md` carrying the Artifact frontmatter schema | assistant (MEMORIZATION, PASS only) | On PASS (`--pass`) | Session-scoped, gitignored, never promoted, removed at cleanup |

`working/research/` is created together with `working/` at every loop/task entry.
`outputs/` is created only on a PASS iteration (the scaffold script's `--pass`
flag).

---

## Per-loop staging-subdir vocabulary

`staging/` holds typed-finding subdirs. The base vocabulary is shared by every
loop; two loops add one extra subdir each.

Base (every loop): `scenarios`, `checklists`, `decisions`, `references`, `design`,
`discussions`, `backlogs/feature`, `backlogs/project`, `reviews`, `reports`,
`changelogs`, `learnings`, `notes`.

Loop-specific additions:

| Loop | Extra staging subdir |
|---|---|
| `2-preparation` | `skills/` |
| `3-planning` | `plans/` |

No other loop carries `skills/` or `plans/`. The scaffold script embeds this
vocabulary in a `case` block keyed by loop name; this table is the source it is
verified against.

---

## Transcript rules

- One **single** session-root `transcripts/` dir. There is no per-loop or per-task
  `transcripts/`.
- File name: `{role}-{agentId}.jsonl`, one immutable file per agent run. The
  manager's file is `manager-{sessionId}.jsonl` (its id is the session id).
- Each agent's transcript **accumulates across all loops** by its distinct
  `agentId`; it is never overwritten.
- The assistant **copies** transcripts into `transcripts/` at MEMORIZATION.
- Transcripts are **gitignored, session-scoped, never promoted, and removed at
  worktree cleanup**. Promoting a transcript is a constraint violation.
- The scaffold script **never** creates `transcripts/`. The manager creates it in
  Configuration alongside the root JSON files.

---

## Spec-to-script binding

- The scaffold script [`scaffold-session-dir.sh`](../scripts/scaffold-session-dir.sh)
  **embeds** the per-loop dir manifest (the 4 slots + the per-loop staging
  vocabulary) in a `case "$step_loop" in` block.
- This doc is the **human-readable single source of truth**. When the manifest and
  this doc disagree, this doc is correct and the script is the drift.
- The verify script [`verify-session-tree.sh`](../scripts/verify-session-tree.sh)
  scaffolds a throwaway step-dir and diffs the script's output against the tree
  declared here. Drift is **caught by the check**, never silently tolerated.
- **COD-STRUCTURE-2 narrowing**: the verify diff covers **only** the
  script-created loop/task subtree (the `{N}-{loop}/` or `task-{NN}-{slug}/`
  interior). It does **not** diff the manager-created session-root invariants —
  `transcripts/`, `session.json`, `state.json`, `settings.json`,
  `session.json.lock`. Those are created by the manager, never by the scaffold
  script, so diffing them against the script's output would always fail. The
  script's verify target is the `<step-dir>` subtree only.

---

## D7 — lifecycle property: the whole `sessions/` tree is gitignored

- `sessions/` is gitignored (`.gitignore:21`), worktree-local, and removed at
  worktree cleanup. Nothing under `sessions/` survives the session by itself.
- The per-iter "commit session memory" cadence commits **no** session content,
  because the tree is gitignored. Iteration boundaries are recorded in
  `session.json.workflow.{loop}.iterations[]`, not in git.
- Durable cross-session memory exists **only** via Wrap-up promotion: Wrap-up
  copies promotable `staging/` content into tracked `features/`, `mistakes/`,
  `rules/`, `design/`, `notes/`, `backlogs/`, etc. Only promoted content survives.

---

## Wrap-up promotion-inventory rule

- Wrap-up inventories **`staging/` only** for promotion. It never inventories
  `transcripts/`, `working/`, `evaluation/`, or `outputs/` as promotable.
  Promoting a transcript (or any non-`staging/` dir) is a constraint violation.
- **F-P2**: the exclusion targets `transcripts/` (and `working/`, `evaluation/`,
  `outputs/`) — it does **not** exclude all non-loop dirs. `interview/staging/`
  remains a **valid** promotion source: in mature-project reruns the interview
  writes to its `staging/`, not directly to project memory, and Wrap-up must
  enumerate it. Do NOT over-narrow the rule to "workflow-loop `staging/` only" in a
  way that drops `interview/staging/`.

---

## interview/ bootstrap exception

`interview/` is **not** a workflow loop. It is the bootstrap surface used at
session start. It keeps its own bootstrap shape — it is **not** swept to the
flat-4-slot model and does **not** carry a `{N}-` number prefix. The scaffold
script rejects `interview/` as a `<step-dir>` (it is not in the fixed loop set).
`interview/staging/` is still a valid Wrap-up promotion source (see the rule
above), but the interior shape of `interview/` is out of scope for this spec.

---

## Path-validation contract (scaffold script, fail-closed)

The scaffold script enforces these rules before creating anything. On any failure
it exits non-zero and creates **nothing**.

- `<session-root>` must be an **absolute** path. A relative path is rejected.
- `<step-dir>` must be one of the fixed loop set — `1-ideation`, `2-preparation`,
  `3-planning`, `4-execution`, `5-wrap-up` — **or** a single execution task dir of
  the form `4-execution/task-{NN}-{slug}`, where `{NN}` is `[0-9]{2}` and `{slug}`
  matches `[a-z0-9-]{1,40}`.
- A `<step-dir>` containing `..`, a leading `/`, or stray/duplicate slashes is
  rejected.
- Any `<step-dir>` outside the fixed set (including `interview`) is rejected.

The same allowed-set is the manifest the script materializes — a single source for
both validation and creation.
