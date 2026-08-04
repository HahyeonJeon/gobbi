---
name: memory
description: "MUST load when writing a temporary session record or memorizing durable project context. Memory is one operation with explicit Temporary Record and Memorize actions."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Memory

Memory keeps temporary session evidence and durable project memory useful and current. **Temporary Record**
writes compact recovery evidence below `sessions/*`. **Memorize** selects durable future value from the
session and closure evidence, then updates tracked `memory/*`.

The active worktree, project, and session determine the roots. Cowork or Workflow owns each exact temporary
output path and schema. Memory owns containment, temporary-write safety, durable judgment, and category
routing.

## Principles

### Preserve only useful future context

Temporary records preserve only accepted recovery context while their worktree remains. Durable memory should
help future work understand or decide something; transient state and operational exhaust stay temporary.

### Write simply and compactly

Give each memory file a short, descriptive title and write compactly with short, direct sentences in plain
language. Organize it with clear sections and headings, using lists for parallel points and tables for
repeated fields or comparisons.

### Keep memory up to date

Temporary records are inputs to later memorization, not durable memory. Revise, move, or remove stale durable
content while preserving completed point-in-time records under their category rules.

## Rules

- **MUST select `Temporary Record` or `Memorize` from the active task and validate one caller-supplied new or
  legacy session identity inside the verified worktree and project.** Stop without writing when format,
  containment, UUID uniqueness, or ownership is ambiguous or conflicting.
- **MUST keep every Temporary Record output below the active project's `sessions/*` tree and out of Git
  history.** Cowork or Workflow owns the exact output; never judge durable value, route a memory category,
  stage, or commit during this action.
- **MUST read the full session root during Memorize, including readable legacy session
  layouts.** Session placement is input evidence, not proof of durable value and not a required new layout.
- **MUST load every applicable category skill before changing tracked `memory/*`.** Load both source and
  destination categories for a move, and stop when required category guidance is incomplete.
- **MUST verify and repair every write before returning.** Prove exact containment, content, affected paths,
  and unchanged protected paths for the selected action.
- **NEVER delete a session root or its contents directly.** A session may disappear only with separately
  authorized worktree cleanup after its recovery value has been resolved.

## Procedure

### Phase 1 — Resolve the active memory context

#### 1.1 Select and validate the action

- Determine the action and verified worktree from the active task. Require the caller's full lowercase
  hyphenated session UUID, original UTC session-start date, and exact session root. For a new identity, also
  require its normalized slug. For a legacy identity, require `slug: not-applicable`. Memory validates those
  values and never derives a branch, worktree leaf, or Git identity.
- Inside the verified worktree, resolve `.gobbi/projects/<project>/sessions/` as `{sessions-root}`, the
  caller-supplied `.gobbi/projects/<project>/sessions/<session>/` as `{session-root}`, and
  `.gobbi/projects/<project>/memory/` as `{memory-root}`. Reject parent traversal, a symbolic-link path
  component, a different project, and any resolved root outside the verified worktree.
- Parse the session leaf with exactly one permanent grammar:

```text
new:    <YYYY-MM-DD>-<slug>-<full-uuid>
legacy: <YYYY-MM-DD>-<full-uuid>
```

```regex
new:    ^\d{4}-\d{2}-\d{2}-[a-z0-9]+(?:-[a-z0-9]+)*-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$
legacy: ^\d{4}-\d{2}-\d{2}-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$
```

- Require the parsed date to be the real Gregorian calendar date of the original UTC session start. For a new
  leaf, require the parsed date, slug, and UUID to equal the caller values. Require a 1-20
  character slug and reject exactly `con`, `prn`, `aux`, `nul`, `com1` through `com9`, and `lpt1` through
  `lpt9`, case-insensitively. For a legacy leaf, require the parsed date and UUID to equal the caller values
  and require no slug. Keep a readable legacy root in its original shape; never rename, migrate, or rewrite
  its leaf.
- Inspect existing leaves below `{sessions-root}` before either action. The caller UUID may resolve to only
  the supplied `{session-root}`. Reject another leaf containing that UUID, more than one root matching the
  caller identity, a leaf that matches both classifications, or any competing date or slug. Report every
  conflicting root; never choose one, append a suffix, or create a replacement.
- For `Temporary Record`, use the exact output Cowork or Workflow owns below `{session-root}`. For `Memorize`,
  use the full `{session-root}`, frozen closure evidence, and `{memory-root}`.
- Evidence is the selected action, caller identity, matched format, resolved roots, containment checks, UUID
  inventory, and exact output or input boundary. Stop without writing when any evidence is missing,
  ambiguous, or conflicting.

### Phase 2 — Write a temporary record

#### 2.1 Write, verify, and return the compact output

- Enter only for `Temporary Record`. Confirm the exact output resolves below `{session-root}` and no path below
  that root is tracked.
- Write the smallest accepted state needed for recovery or later Memorize, using the schema owned by Cowork or
  Workflow. Exclude secrets, transcripts, raw logs, token data, private capture, and unsupported claims.
- Reread the output and confirm its content and containment. Confirm no session path is tracked, staged, or
  committed; repair an in-scope content defect and repeat this step, or stop on a boundary failure.
- Return the action, session root, written path or explicit no-write result, checks, and recovery state.

### Phase 3 — Memorize durable project context

#### 3.1 Review and route durable value

- Enter only for `Memorize`. Read the full session root, frozen closure evidence, accepted commits, current
  project state, and existing project memory. Read legacy `{session-root}/memory/` content as temporary input
  without rewriting it.
- Keep only evidence-backed context that will help future work. Reject secrets, raw conversation, speculative
  conclusions, temporary routing state, plans, evaluation packages, receipts, and other operational exhaust
  unless a category skill independently justifies their durable content.
- Route each retained item through the applicable category skill:

| Durable content | Category skill | Home below the project memory root |
|---|---|---|
| Current project design and direction | [`design/SKILL.md`](design/SKILL.md) | `design/` |
| Reusable knowledge and repeated mistakes | [`learnings/SKILL.md`](learnings/SKILL.md) | `learnings/` |
| Completed work reports | [`reports/SKILL.md`](reports/SKILL.md) | `reports/` |
| Completed session history and project progression | [`history/SKILL.md`](history/SKILL.md) | `history/` |
| Durable sources and supporting inputs | [`materials/SKILL.md`](materials/SKILL.md) | `materials/` |
| Deferred project or feature outcomes | [`backlogs/SKILL.md`](backlogs/SKILL.md) | `backlogs/` |

- Use this durable memory directory structure:

```text
.gobbi/projects/<project>/memory/
├── design/
│   ├── README.md
│   ├── architecture/
│   ├── feature/
│   ├── process/
│   └── roadmap/
├── learnings/
│   ├── design/
│   │   ├── tips.md
│   │   └── mistakes.md
│   ├── work/
│   │   ├── tips.md
│   │   └── mistakes.md
│   ├── memory/
│   │   ├── tips.md
│   │   └── mistakes.md
│   ├── dev/
│   │   ├── tips.md
│   │   └── mistakes.md
│   └── {domain}/
│       ├── tips.md
│       └── mistakes.md
├── reports/
│   ├── README.md
│   ├── note/
│   │   └── YYYY-MM-DD-{descriptive-title}.md
│   ├── review/
│   │   └── YYYY-MM-DD-{descriptive-title}.md
│   └── analysis/
│       └── YYYY-MM-DD-{descriptive-title}.md
├── history/
│   ├── README.md
│   └── YYYY-MM-DD-{descriptive-title}.md
├── materials/
│   ├── README.md
│   ├── references/
│   ├── assets/
│   ├── docs/
│   └── data/
└── backlogs/
    ├── README.md
    ├── project.md
    └── {feature}.md
```

  The tree shows valid homes, not a scaffold; create only paths that hold real memory. Each category skill
  remains the exact structure and naming owner.
- Load each applicable category skill, review related records and navigation, then decide the exact create,
  update, move, or delete set. At session close, create history only when the session produced durable change.

#### 3.2 Update and verify durable memory

- Update only files, indexes, and links below `{memory-root}` according to the loaded category skills. Preserve
  unique current knowledge and completed point-in-time records.
- Reread every changed path and related navigation. Confirm category compliance, tracked-root containment,
  intended placement, no unexplained duplicate, and unchanged session input.
- Repair each in-scope defect and repeat verification. Return the action, source session root, exact durable
  path set or verified no-change result, loaded categories, checks, and any retained recovery state.

## References

| File | Description |
|---|---|
| [`design/SKILL.md`](design/SKILL.md) | Defines current architecture, feature, process, and roadmap memory. |
| [`learnings/SKILL.md`](learnings/SKILL.md) | Defines reusable knowledge and repeatable failure patterns. |
| [`reports/SKILL.md`](reports/SKILL.md) | Defines durable notes, reviews, and analyses. |
| [`history/SKILL.md`](history/SKILL.md) | Defines compact completed-session history. |
| [`materials/SKILL.md`](materials/SKILL.md) | Defines durable source materials and supporting evidence. |
| [`backlogs/SKILL.md`](backlogs/SKILL.md) | Defines deferred outcomes and their reasons. |
