---
name: skill-writing
description: "Use when authoring a new gobbi skill — frontmatter schema, section skeleton, length norm, and the script-owned vs hand-owned wiring procedure."
allowed-tools: Read, Grep, Glob, Bash
---

# Skill Writing

Reference skill for authoring a NEW gobbi skill. Load it when a task creates a new
`SKILL.md` under `.gobbi/projects/{project-name}/skills/{name}/`, or asks how a skill is
written and wired. It teaches the frontmatter schema, the four discoverability axes, the
canonical section skeleton, the length norm, the standalone-vs-child-doc rule, and the
exact wiring procedure that makes a new skill loadable in both runtimes.

This skill is self-contained — it does not depend on any `.claude/` doc-authoring standard.
The canonical owner of every fact below is a live file in the tree; this skill POINTS to
each owner instead of restating it, so a single change in the owner does not silently rot
a copy here. The discipline that governs this skill governs the skills you write with it.

The best reference is the existing skills. Before authoring, read two or three that match
the shape you need — `research/SKILL.md` for a short standalone skill, `claude-plugin/SKILL.md`
and `gobbi-hook-authoring/SKILL.md` for standalone meta/authoring skills. The codebase is
the style guide.

---

## Core Principles

> **A skill teaches one coherent capability — write it for the agent who loads it cold.**

A skill is loaded fresh by an agent with no prior context. State what the skill is and when
to load it in the first paragraph, then teach the capability in the section order every
other skill uses. A reader who opens the skill cold must learn the capability from the skill
alone — not from the session that wrote it.

> **Point to the one canonical owner; never restate it.**

Every fact a skill states has exactly one owning file. Name that owner and link to it; do
not copy its content. A copied fact drifts the moment the owner changes. When a skill needs
a rule that lives elsewhere — a frontmatter standard, a template, a procedure — it cites the
owner's path and section, and the reader follows the link. Single source of truth is the
rule the whole tree obeys; a skill that restates an owner violates it.

> **Verify every wiring claim by reading the owner — never assert it.**

A skill that documents a wiring mechanism (a symlink, a sync script, a permission) MUST base
each claim on the owner read directly — the script's source, the live symlink, the settings
file — not on an assumption or an end-state guess. Assert "the script creates the Codex
mirror" only after reading the loop in `scripts/sync-plugin-package.sh` that creates it.
This is the highest-value discipline here: see [`mistakes/planning-asserted-skill-without-verifying.md`](../../mistakes/planning-asserted-skill-without-verifying.md)
— a load-path was asserted without `test -f`, and the dead reference reached the briefing.

> **A new skill is not done until it is loadable, verified empirically.**

Authoring the `SKILL.md` body is half the job. The skill is done only when it is wired into
both runtimes AND the wiring is verified by running the check — `sync-plugin-package.sh --check`
exits 0, and each hand-created `.claude/skills/{name}/SKILL.md` symlink resolves under
`readlink`. A skill on disk that no runtime loads is an unfinished skill.

---

## Procedures

### P1 — Frontmatter schema

A skill's frontmatter carries three STANDARD keys, in this order — the set every gobbi skill
uses (verify: each head under `.gobbi/projects/gobbi/skills/*/SKILL.md` carries these three).
The official Claude Code skill schema also allows OPTIONAL fields — `user-invocable` and
`disable-model-invocation` (the discoverability axes in P2), among others — which a skill adds
only when it needs the non-default behavior. So the three below are the baseline, not a closed
set: do not add a key without a reason, but the optional official fields are valid when needed.

```yaml
---
name: {skill-name}
description: {one line; the grammar depends on how the skill loads — see below}
allowed-tools: Read, Grep, Glob, Bash
---
```

- **`name`** — MUST equal the skill's directory name (`skills/{name}/` → `name: {name}`).
- **`description`** — one line. Quote-wrap the value if it contains a colon. The grammar
  splits by how the skill is loaded:
  - **Deterministic load** (a phase or role always loads it) → open with `MUST load …`.
    Examples: `execution` ("MUST load for Execution …"), `evaluation`, `principles`.
  - **On-demand load** (loaded only when a task touches the domain) → open with `Use when …`
    or `Load when …`. Examples: `claude-plugin` ("Use when authoring …"), `git`
    ("Load when managing branches …"). A new authoring/reference skill is on-demand.
- **`allowed-tools`** — comma-list of the tools the skill's work needs. A read-only reference
  skill lists `Read, Grep, Glob, Bash`; a skill whose work edits files adds `Write, Edit`.

**Skill frontmatter is NOT memory-file frontmatter.** A skill is not a memory file. The
11-required-field memory frontmatter standard ([`memory/rules.md` § 2](../memory/rules.md))
governs files under the typed memory trees — its own Scope boundary excludes `skills/`. A
skill carries the three standard keys (plus any official optional field it needs, P2) — never
the memory fields. Do not stamp a skill with `type` / `scope` / `status` / `tags` or any other
memory field.

### P2 — The four discoverability / invocation axes

A skill's reach is set on four independent axes. The first three are discoverability; the
fourth is a tool-permission gate, NOT a discoverability gate.

| Axis | Set by | Default | Set non-default when |
|---|---|---|---|
| **Mirror availability** | which runtimes the skill is wired into (P5) | both runtimes | a skill is intentionally one-runtime-only |
| **`/`-visibility** | `user-invocable` frontmatter (Claude Code skill) | `true` (`/`-visible) | the skill is internal machinery the user should never invoke by slash — set `user-invocable: false` |
| **Model auto-invocation** | `disable-model-invocation` frontmatter | `false` (model may auto-load) | the model must NEVER auto-load it (it is destructive or strictly user-triggered) — set `disable-model-invocation: true` |
| **Tool-permission preapproval** | a `Skill()` entry in `.claude/settings.json` + `allowed-tools` | NO `Skill()` entry | zero-prompt preapproval is wanted (P5 step 6) |

The defaults (`user-invocable: true`, `disable-model-invocation: false`) need no frontmatter
key — omit both and the skill is `/`-visible and model-auto-loadable. A reference/authoring
skill keeps the defaults: the model should auto-load it at authoring time, and the user may
invoke it.

**`Skill()` is a permission, not discoverability.** A skill loads and appears without any
`Skill()` entry — `claude-plugin` and `codex`, for example, are mirrored and load with no
`Skill()` perm. The mirror count and the perm count are not equal; confirm the gap live rather
than trusting a number that drifts as skills are added:
```bash
ls .claude/skills | wc -l                  # mirrored skills
grep -c 'Skill(' .claude/settings.json     # preapproved skills
```
The difference is the count of mirrored-but-unpermissioned skills. The `Skill()` entry only
preapproves the skill's tool use so the runtime does not prompt. Omitting it does not hide the
skill; it only means the first tool use may prompt.

### P3 — The canonical SKILL.md section skeleton

Skills follow one section order (stable when a section is present; not every section appears
in every skill). Author your skill in this order:

1. **`# Title`** — the skill's name, Title Case.
2. **Intro paragraph** — what the skill is + when to load it. One or two short paragraphs.
3. **`## Memory Access Matrix`** — *conditional.* Only for skills whose work writes to the
   session record or memory (e.g. `execution`, `research`, `mistake`). A read-only reference
   skill OMITS it.
4. **`## Core Principles`** — blockquote-led. Each principle is a one-line `> **…**`
   blockquote, followed by a short paragraph of rationale. Three to six principles.
5. **`## Procedures`** (`### P1 …`) OR phase tables — the substantive how-to. Reference
   skills use `### P1` / `### P2` numbered procedures; loop skills use phase tables.
6. **`## Constraints`** — MUST / NEVER bullets. The enforceable floor.
7. **`## Anti-patterns`** — *optional.* Named failure modes with the fix. Authoring and
   hook skills carry one; short skills may fold anti-patterns into Constraints.
8. **`## Output paths`** — *conditional.* Only for skills that write files (session-record
   or runtime). A reference skill that writes nothing OMITS it.
9. **`## Cross-references`** — links to the owners and sibling skills the body pointed at.

The two conditional-on-writing sections — **Memory Access Matrix** and **Output paths** —
appear ONLY when the skill's work writes. A pure reference/authoring skill (read-only
`allowed-tools`) omits both.

### P4 — Length norm + standalone-vs-child-doc

**Length norm.** Gobbi skills run ~140-600 lines (median ~340). Meta/authoring skills are
short — `claude-plugin` is 264, `gobbi-hook-authoring` is 280. Aim for ~150-280 lines for a
meta/reference skill. Length is bounded by the point-don't-restate discipline: a skill that
copies its owners' content bloats; a skill that points stays tight.

**Standalone vs child-doc.** Default to a single standalone `SKILL.md`. Split into child
docs ONLY when the skill owns one of:

- **(a)** a SET of stamped per-instance artifacts — templates the skill ships (e.g.
  `delegation/templates/{role}.md`).
- **(b)** a deterministic rule-reference too long for the body — a conventions doc a reader
  consults by lookup, not by reading top-to-bottom.
- **(c)** per-step or per-loop orchestration docs — one doc per workflow step (e.g.
  `orchestration/workflow/{step}.md`).

A single coherent procedure stays ONE file. When in doubt, standalone — a child doc is
justified by ownership of a set or a too-long reference, not by length alone.

**The `mistakes.md` companion.** Separately from length-driven child docs, a skill MAY carry
a `mistakes.md` companion in its dir — the **skill-owned mistakes home** (the hybrid model). It
holds the traps that belong to this skill's domain, one `## ` section per trap. It is a
skill-surface doc (OUT of the memory frontmatter standard — [`memory/rules.md` § Scope boundary](../memory/rules.md)),
governed by its own `check-skill-mistakes.sh` guard, not by `validate-frontmatter.sh`. Wrap-up
promotion writes it (Always-Ask routing — see [`mistake/SKILL.md`](../mistake/SKILL.md)); a brief
that lists `skills/{name}/SKILL.md` in its Load Directives ALSO lists `skills/{name}/mistakes.md`
as a companion path, so the trap loads in the skill's context. Wire it with the same per-file
`.claude` symlink as `SKILL.md` (P5 step 1).

### P5 — Wiring a new skill (SCRIPT-OWNED vs HAND-OWNED)

A skill has three mirror surfaces, at different granularity (verified by `readlink`):

| Surface | Shape | Owner |
|---|---|---|
| `.claude/skills/{name}/` | a REAL directory holding one symlink PER FILE (`SKILL.md -> ../../../.gobbi/projects/gobbi/skills/{name}/SKILL.md`, plus one per companion the skill exposes — e.g. `mistakes.md`) | **HAND-CREATED** |
| `.agents/skills/{name}` | ONE whole-dir symlink (`-> ../../.gobbi/projects/gobbi/skills/{name}`) | **SCRIPT-OWNED** |
| `plugins/gobbi/skills` | ONE whole-dir symlink for ALL skills (`-> ../../.gobbi/projects/gobbi/skills`) | **SCRIPT-OWNED** |

`scripts/sync-plugin-package.sh` iterates every canonical skill dir and creates/refreshes
the `.agents/skills/{name}` per-skill symlink (its loop) plus the three plugin whole-dir
symlinks. It does NOT touch `.claude/skills/` — that surface manages only `.claude/hooks/`.
So the Codex mirror and the plugin mirror are produced for you by the script; only the
Claude per-file symlink is yours to hand-create. Read the script's loop and `--check`
mode before relying on this split.

Wire a new skill in this order, each step with its verify command:

1. **Hand-create the Claude per-file symlink(s).** From the worktree root:
   ```bash
   mkdir -p .claude/skills/{name}
   ln -s ../../../.gobbi/projects/gobbi/skills/{name}/SKILL.md .claude/skills/{name}/SKILL.md
   ```
   Verify: `readlink -e .claude/skills/{name}/SKILL.md` resolves to the canonical file.
   If the skill ships child docs, create one per-file symlink for each file the skill exposes.
   A skill carrying a `mistakes.md` companion (the skill-owned mistakes home, hybrid model)
   needs the SAME per-file symlink:
   ```bash
   ln -s ../../../.gobbi/projects/gobbi/skills/{name}/mistakes.md .claude/skills/{name}/mistakes.md
   ```
   Only `.claude` needs this per-file action: the `.agents/skills/{name}` and `plugins/gobbi/skills`
   whole-dir symlinks (step 2) point at the WHOLE skill dir, so they auto-expose `mistakes.md`
   with no extra step.
2. **Run the sync script.** It auto-creates `.agents/skills/{name}` and refreshes the plugin
   whole-dir symlinks:
   ```bash
   bash scripts/sync-plugin-package.sh
   ```
3. **Confirm the mirror is intact.** The check must exit 0:
   ```bash
   bash scripts/sync-plugin-package.sh --check; echo "exit=$?"
   ```
4. **plugin.json — NO edit.** Both `plugin.json` manifests are metadata-only; conventional
   `skills/` directories auto-load without a manifest key (see
   [`claude-plugin/SKILL.md` § Component auto-loading](../claude-plugin/SKILL.md)). Adding a
   `skills` key has caused load failures. Do not edit `plugin.json` for a new skill.
5. **Add a value-features prose mention in `gobbi/SKILL.md`.** A meta/authoring skill gets a
   dedicated prose mention in the Product value-features section (mirror the existing
   "Install / runtime is documented, not a skill." paragraph), NOT a Loop / Cross-cutting /
   Supporting Skill-Map table row. Skill-Map placement is not uniform: some skills have a
   table row, some are named only in value-feature prose (`gobbi-hook-authoring` is named in
   the `install-runtime` prose), and some are not in `gobbi/SKILL.md` at all — `claude-plugin`
   appears NOWHERE in it (verify: `grep -c claude-plugin .gobbi/projects/gobbi/skills/gobbi/SKILL.md`
   → 0). So a new meta skill does not need a row; this DD-5 step is the deliberate choice to
   give it a dedicated prose paragraph. Verify your mention landed:
   `grep -n '{name}' .gobbi/projects/gobbi/skills/gobbi/SKILL.md`.
6. **`Skill()` permission — ONLY if zero-prompt preapproval is wanted.** Add a `Skill({name})`
   entry to `.claude/settings.json` ONLY when you want the runtime to never prompt on the
   skill's tool use. It is NOT required for the skill to load (P2). If you skip it,
   `.claude/settings.json` is UNCHANGED.

Final verify across the wiring: run the markdown-link guard to confirm no new broken links.
The guard REQUIRES at least one path argument (no-arg exits 2) — pass the new skill's file or
dir:
```bash
bash .gobbi/projects/gobbi/skills/orchestration/scripts/check-markdown-links.sh \
  .gobbi/projects/gobbi/skills/{name}/SKILL.md
```
A clean run prints `ALL LINKS RESOLVE (...)` and exits 0.

---

## Constraints

- **MUST name the file `SKILL.md`** under `.gobbi/projects/{project-name}/skills/{name}/`,
  with `name: {name}` matching the directory.
- **MUST carry exactly the three frontmatter keys** — `name`, `description`, `allowed-tools`
  — and no others. Skill frontmatter is not memory-file frontmatter.
- **MUST match the description grammar to the load mode** — `MUST load …` for deterministic
  loads, `Use when …` / `Load when …` for on-demand.
- **MUST follow the canonical section order** (P3); include Memory Access Matrix and Output
  paths ONLY when the skill's work writes.
- **MUST point to the one canonical owner, not restate it** — every borrowed fact links to
  its owner; a copied fact drifts.
- **MUST verify every wiring claim by reading the owner** — read the script source, `readlink`
  the symlink, read `.claude/settings.json` — never assert a wiring surface exists.
- **MUST verify loadability empirically** before declaring the skill done —
  `sync-plugin-package.sh --check` exits 0 AND each hand-created `.claude/skills/{name}` symlink
  resolves under `readlink`.
- **NEVER edit `plugin.json`** for a new skill — conventional `skills/` auto-load; a manifest
  key has caused load failures.
- **NEVER add a `Skill()` permission unless zero-prompt preapproval is wanted** — it is a
  permission gate, not a discoverability gate; the skill loads without it.
- **NEVER create the `.agents/skills/{name}` or plugin symlinks by hand** — they are
  script-owned; run `sync-plugin-package.sh` and let it create them.

## Anti-patterns

- **Restating an owner instead of pointing.** Copying the frontmatter standard, a template,
  or a procedure into the new skill. The copy drifts the moment the owner changes. Cite the
  owner's path + section and let the reader follow the link.

- **Asserting a wiring surface without verifying it.** Writing "the skill is mirrored to
  Codex" without running `--check`, or "the load path exists" without `test -f`. The recorded
  trap [`mistakes/planning-asserted-skill-without-verifying.md`](../../mistakes/planning-asserted-skill-without-verifying.md)
  is exactly this: a path was asserted, never `test`-ed, and the dead reference shipped into a
  briefing. Verify a MECHANISM by reading its owner (script / settings / symlink), not by
  reading the end-state.

- **Hand-creating the script-owned symlinks.** Manually `ln -s`-ing `.agents/skills/{name}`
  or the plugin dir. They are produced by `sync-plugin-package.sh`; a hand-made one drifts
  from what `--check` expects. Hand-create ONLY the `.claude/skills/{name}` per-file symlink.

- **Adding a Skill-Map table row for a meta skill.** Putting an authoring/reference skill in
  the Loop / Cross-cutting / Supporting table. Meta/entry skills live in value-feature prose,
  not the table. Add the dedicated prose mention instead.

- **Editing `plugin.json` to register the skill.** Adding a `skills` key for the new skill.
  Conventional `skills/` directories auto-load with no manifest key; a manifest key has caused
  load failures. Leave both manifests untouched.

- **Splitting into child docs by length alone.** Breaking a single coherent procedure into
  multiple files because the body feels long. A child doc is justified by ownership of a SET
  of artifacts, a too-long deterministic reference, or per-step orchestration docs — not by
  length. Default to standalone.

## Cross-references

- Plugin package layout, manifest auto-load, symlink dereference rules → [`claude-plugin/SKILL.md`](../claude-plugin/SKILL.md)
- A short standalone skill exemplar → [`research/SKILL.md`](../research/SKILL.md)
- A standalone authoring-skill exemplar → [`gobbi-hook-authoring/SKILL.md`](../gobbi-hook-authoring/SKILL.md)
- Skill Map placement + Product value-features convention → [`gobbi/SKILL.md`](../gobbi/SKILL.md)
- Memory-FILE frontmatter standard (contrast — NOT skill frontmatter) → [`memory/rules.md`](../memory/rules.md)
- The verify-before-asserting trap → [`mistakes/planning-asserted-skill-without-verifying.md`](../../mistakes/planning-asserted-skill-without-verifying.md)
- Authoring a new agent (sibling skill, shared mirror + verify discipline) → [`agent-writing/SKILL.md`](../agent-writing/SKILL.md)
