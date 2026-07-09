---
name: skill-writing
description: "Use when authoring a new gobbi skill — frontmatter schema, section skeleton, length norm, and the script-owned mirror wiring procedure."
allowed-tools: Read, Grep, Glob, Bash
---

# Skill Writing

Reference skill for authoring a NEW gobbi skill. Load it when a task creates a new
`SKILL.md` under `.gobbi/projects/{project-name}/skills/{name}/`, or asks how a skill is
written and wired. It teaches the frontmatter schema, the four discoverability axes, the
six-section skeleton, the length norm, the standalone-vs-child-doc rule, and the exact
wiring procedure that makes a new skill loadable in both runtimes.

This skill is self-contained — it restates no owner it relies on. Every fact it borrows has
one owning file, named in § References; the body states the fact and References records the
owner, so a change in the owner does not silently rot a copy here. The discipline that
governs this skill governs the skills you write with it.

---

## Principles

> **A skill teaches one coherent capability to an agent that loads it cold.**

A skill is loaded fresh by an agent with no prior context. The first paragraph states what
the skill is and when to load it; the rest teaches the capability in the section order every
other skill uses. A reader who opens the skill cold learns the capability from the skill
alone — not from the session that wrote it.

> **Understanding and enforcement are different jobs.**

Principles teach the mental model; Rules state the pass/fail floor; Procedure gives the steps.
Mixing those jobs makes the same fact appear in several sections, where the copies drift. The
six-section order exists to keep each job in exactly one place.

> **Single source of truth — every fact has one owning file, and a copy drifts.**

Every fact a skill states has exactly one owning file. The skill states the fact plainly and
records its owner in § References; it never copies the owner's content. A copied fact drifts
the moment the owner changes, so single source of truth is the rule the whole tree obeys — a
skill that restates an owner breaks it.

> **A wiring claim is only as true as the owner it was read from.**

A claim about a wiring mechanism — a symlink, a sync script, a permission — is trustworthy
only when it was read from the owner itself: the script's source, the live symlink, the
settings file. An assumption or an end-state guess is not evidence. This is the
highest-value discipline here: a load-path once asserted without a file-existence check
shipped a dead reference into a briefing.

> **A skill is not done until it is loadable.**

Authoring the `SKILL.md` body is half the job. The skill exists for an agent to load, so it
is done only when both runtimes can load it and the wiring check confirms it. A skill on disk
that no runtime loads is an unfinished skill.

---

## Rules

### Must-Follow

- **MUST name the file `SKILL.md`** in the canonical skill directory, with `name` matching that
  directory — the loader resolves a skill by its dir name.
- **MUST carry the three required keys, plus optional keys ONLY from the named allowlist in
  § Procedure P1; NEVER a memory-file field.** The three required keys (`name`, `description`,
  `allowed-tools`) are the baseline; an allowlist key is added only for non-default behavior. A
  skill is not a memory file, so `type` / `scope` / `status` / `tags` never appear.
- **MUST match the description grammar to the load mode** — `MUST load …` for a deterministic
  load, `Use when …` / `Load when …` for an on-demand load. A mismatched grammar misleads the
  reader about when the skill loads.
- **MUST follow the six-section order** (Frontmatter → Intro → Principles → Rules → Procedure
  → References; § Procedure P3); place Memory Access Matrix and Output paths as Procedure
  sub-sections ONLY when the skill's work writes. A read-only reference skill omits both.
- **MUST keep Intro, Principles, and Rules source-free** — those three sections name no other
  file. Ownership links live in § References; load/read actions live in § Procedure. A cross-doc
  mention scattered through the body is what drifts; the register in References is the one place
  to audit it.
- **MUST state each borrowed fact plainly and record its owner in § References** — never copy
  the owner's content into the body, because a copied fact drifts when the owner changes.
- **MUST base every wiring claim on the owner read directly** — the script source, the live
  symlink, the settings file — never an assumption. Assert "the script creates the mirror"
  only after reading the loop that creates it.
- **MUST verify loadability empirically before declaring the skill done** — the sync check
  exits 0 and each mirror symlink resolves under `readlink`. A skill no runtime loads is
  unfinished.

### Must-Not-Follow

- **NEVER copy an owner's content into the body** instead of stating the fact and naming the
  owner — the copy drifts the moment the owner changes. Fix: state the fact plainly; record
  the owner path + section in § References.
- **NEVER assert a wiring surface without verifying it** — writing "the skill is mirrored to
  Codex" without running the sync check, or "the load path exists" without `test -f`. A
  load-path once asserted without a check shipped a dead reference into a briefing. Fix: verify
  the MECHANISM by reading its owner (script / settings / symlink), not the end-state.
- **NEVER hand-create the script-owned mirror symlinks** — a hand-made one drifts from what the
  sync check expects. Fix: run the sync script and let it build every mirror.
- **NEVER edit the plugin manifests for a new skill** — conventional skill directories auto-load
  with no manifest key, and a manifest key has caused load failures. Fix: leave the manifests
  untouched.
- **NEVER add a `Skill()` permission unless zero-prompt preapproval is wanted** — it is a
  tool-permission gate, not a discoverability gate; the skill loads without it. Fix: omit it
  and accept a first-use tool prompt, or add it only to silence that prompt.
- **NEVER add a Skill-Map table row for a meta/authoring skill** — those belong in the
  value-feature prose, not the Loop / Cross-cutting / Supporting table. Fix: add the dedicated
  prose mention instead.
- **NEVER split a skill into child docs by length alone** — a child doc is justified by
  ownership of a SET of artifacts, a too-long lookup reference, per-unit orchestration, or an
  independent-audience sub-procedure. Fix: default to standalone; split only on one of those.

---

## Procedure

Author a new skill in five procedures. Before starting, read two or three existing skills that
match the shape you need as shape references — `research/SKILL.md` for a short standalone skill,
`claude-plugin/SKILL.md` for a standalone meta/authoring skill. The codebase is the style guide.

### P1 — Frontmatter schema

A skill's frontmatter carries three REQUIRED keys, in this order — `name`, `description`,
`allowed-tools` (verify: every head under `.gobbi/projects/gobbi/skills/*/SKILL.md` carries
these three). The schema is "three required keys plus a named optional allowlist," NOT "exactly
three and no others": an official optional field is valid when the skill needs the non-default
behavior.

```yaml
---
name: {skill-name}
description: {one line; grammar depends on how the skill loads — see below}
allowed-tools: Read, Grep, Glob, Bash
---
```

- **`name`** — MUST equal the skill's directory name (`skills/{name}/` → `name: {name}`).
- **`description`** — one line. Quote-wrap the value if it contains a colon. The grammar splits
  by how the skill is loaded:
  - **Deterministic load** (a phase or role always loads it) → open with `MUST load …`.
    Examples: `execution`, `evaluation`, `principles`.
  - **On-demand load** (loaded only when a task touches the domain) → open with `Use when …`
    or `Load when …`. Examples: `claude-plugin`, `git`. A new authoring/reference skill is
    on-demand.
- **`allowed-tools`** — comma-list of the tools the skill's work needs. A read-only reference
  skill lists `Read, Grep, Glob, Bash`; a skill whose work edits files adds `Write, Edit`.
- **OPTIONAL — a NAMED allowlist, added only for non-default behavior.** `user-invocable: false`
  hides the skill from `/`; `disable-model-invocation: true` stops the model auto-loading it;
  the rare official `license` / `compatibility` / `metadata` are added only with a stated
  reason. Omit every allowlist key and the skill is `/`-visible and model-auto-loadable.
- **FORBIDDEN — any memory-file frontmatter field.** A skill is not a memory file; the
  11-field memory frontmatter standard governs the typed memory trees and its own Scope
  boundary excludes `skills/`. Do NOT stamp a skill with `type` / `scope` / `status` / `tags`
  or any other memory field.

### P2 — The four discoverability / invocation axes

A skill's reach is set on four independent axes. The first three are discoverability; the
fourth is a tool-permission gate, NOT a discoverability gate.

| Axis | Set by | Default | Set non-default when |
|---|---|---|---|
| **Mirror availability** | which runtimes the skill is wired into (P5) | both runtimes | a skill is intentionally one-runtime-only |
| **`/`-visibility** | `user-invocable` frontmatter (Claude Code skill) | `true` (`/`-visible) | the skill is internal machinery the user should never invoke by slash — set `user-invocable: false` |
| **Model auto-invocation** | `disable-model-invocation` frontmatter | `false` (model may auto-load) | the model must NEVER auto-load it (it is destructive or strictly user-triggered) — set `disable-model-invocation: true` |
| **Tool-permission preapproval** | a `Skill()` entry in `.claude/settings.json` + `allowed-tools` | NO `Skill()` entry | zero-prompt preapproval is wanted (P5 step 5) |

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

### P3 — The six-section SKILL.md skeleton

Every skill follows one fixed section order. Author your skill in it:

1. **Frontmatter** — the P1 schema: `name → description → allowed-tools`, optional allowlist
   keys after. Purpose: machine + agent discovery. No prose, no memory fields.
2. **`# {Skill Name}` + Intro** — the H1 title (the skill name, Title Case) plus one or two
   short paragraphs: what the skill is and when to load it. A role-defining skill's Intro MAY
   exceed the short norm — it may carry the role definition plus its reference tables. Intro
   states no procedure detail, no enforcement bullet, and names no other file.
3. **`## Principles`** — the mental model, conceptual only. Three to six entries, each a
   one-line `> **…**` blockquote followed by a short rationale paragraph explaining WHY it is
   true. No `MUST` / `NEVER` / `ALWAYS`, no procedure step, no cross-doc citation. Test: if a
   line can be graded pass/fail against a specific edit, it is a Rule, not a Principle.
4. **`## Rules`** — the enforceable floor, in two labeled sub-groups: `### Must-Follow`
   (`MUST` / `ALWAYS` bullets) and `### Must-Not-Follow` (`NEVER` bullets / anti-patterns).
   Each bullet is self-contained: a terse inline rationale, and for an anti-pattern its
   one-line fix — a reader never jumps to Principles to understand a Rule. No cross-doc
   citation.
5. **`## Procedure`** — the step-by-step SOP, PLUS the map of when to read which child doc or
   other skill. Numbered procedures (`### P1 …`) OR phase tables (loop skills). For a
   write-performing skill, the operational `### Memory Access Matrix` and `### Output paths`
   live here as sub-sections (or a child-doc pointer when large); a read-only skill omits both.
   Procedure is the ONE section whose body may name another file — as an inline load/read
   ACTION ("Read `<path>` § … when …", "run `<script>`").
6. **`## References`** — the single traceability home: a section-level ownership register. One
   entry per owner, naming WHICH FACT the owner validates — `{owner path + section} validates
   {the claim in this skill}`. This is the one section that holds the inline markdown links
   (each `[label]` pointing to an owner path), so the markdown-link guard resolves them.
   References states no new fact; it only names owners.

Same-file `§` section pointers are allowed anywhere they aid navigation — they are in-file
navigation, not a cross-doc citation. A path used as a value (a file the procedure reads or
writes) is not a citation and stays where it is used. A see-also link is not a load action; it
goes in References, never in the body.

Frontmatter, Intro, Principles, Rules, Procedure, and References are the six always-present
sections. The two write-only blocks — Memory Access Matrix and Output paths — are CONDITIONAL
and appear only inside Procedure when the skill's work writes; a read-only reference skill omits
both.

### P4 — Length norm + standalone-vs-child-doc

**Length norm.** Gobbi skills run ~140-600 lines (median ~340). Meta/authoring skills are
short — aim for ~150-280 lines. Length is bounded by single source of truth: a skill that
copies its owners' content bloats; a skill that states the fact and records the owner stays
tight.

**Standalone vs child-doc.** Default to a single standalone `SKILL.md`. Split into child docs
ONLY when the skill owns one of:

- **(a)** a SET of stamped per-instance artifacts — templates the skill ships (e.g.
  `delegation/templates/{role}.md`).
- **(b)** a deterministic rule-reference too long for the body — a conventions doc a reader
  consults by lookup, not by reading top-to-bottom.
- **(c)** per-step / per-loop / per-role orchestration docs — one doc per unit.
- **(d)** a self-contained sub-procedure a different phase or audience reads independently, or
  a block whose inline length would push the parent well past the length norm.

A child doc is justified by ownership of a set, a too-long lookup reference, per-unit
orchestration, or an independent-audience sub-procedure — never by length alone. When in doubt,
standalone. The Procedure section MUST describe when to read each child doc it points to.

**The `mistakes.md` companion.** Separately from length-driven child docs, a skill MAY carry a
`mistakes.md` companion in its dir — the skill-owned mistakes home (the hybrid model). It holds
the traps that belong to this skill's domain, one `## ` section per trap. It is a skill-surface
doc OUT of the memory frontmatter standard, governed by its own `check-skill-mistakes.sh` guard,
not by `validate-frontmatter.sh`. Wrap-up promotion writes it (Always-Ask routing). A brief that
lists `skills/{name}/SKILL.md` in its Load Directives ALSO lists `skills/{name}/mistakes.md` as a
companion path, so the trap loads in the skill's context. It is mirrored into
`.claude/skills/{name}/` by the same DERIVED per-file sync as `SKILL.md` — the sync script
enumerates every agent-exposed child, so the companion needs no separate wiring step (P5).

### P5 — Wiring a new skill (the sync script owns every mirror)

A skill has three mirror surfaces, at different granularity (verified by `readlink`). All three
are SCRIPT-OWNED — `scripts/sync-plugin-package.sh` builds and validates every one:

| Surface | Shape | Owner |
|---|---|---|
| `.claude/skills/{name}/` | a REAL directory holding one symlink PER FILE — every agent-exposed child of the canonical skill, DERIVED (`SKILL.md`, any companion such as `mistakes.md`, and support subdirs `scripts/`/`templates/`/`workflow/` mirrored as real dirs of per-file symlinks) | **SCRIPT-OWNED** |
| `.agents/skills/{name}` | ONE whole-dir symlink (`-> ../../.gobbi/projects/gobbi/skills/{name}`) | **SCRIPT-OWNED** |
| `plugins/gobbi/skills` | ONE whole-dir symlink for ALL skills (`-> ../../.gobbi/projects/gobbi/skills`) | **SCRIPT-OWNED** |

`scripts/sync-plugin-package.sh` iterates every canonical skill dir and creates/refreshes ALL
three mirrors: the `.agents/skills/{name}` whole-dir symlink (its loop), the plugin whole-dir
symlinks, AND the `.claude/skills/{name}` per-file mirror. The `.claude/skills` mirror is built
from a DERIVED per-skill enumeration of agent-exposed children (no hardcoded file list) —
per-file symlinks inside real directories, for top-level files AND support subdirs, at the `../`
depth that matches each leaf's nesting. `--check` validates it as per-skill BIDIRECTIONAL parity
(the mirror child set equals the canonical child set, with `readlink -e` per leaf), exiting
non-zero on any drift. Read the script's build loop and `--check` mode before relying on this.
No mirror surface is wired by hand.

Wire a new skill in this order, each step with its verify command:

1. **Run the sync script — it builds every mirror.** From the worktree root:
   ```bash
   bash scripts/sync-plugin-package.sh
   ```
   This creates/refreshes `.agents/skills/{name}`, the plugin whole-dir symlinks, AND the
   `.claude/skills/{name}` per-file mirror. The `.claude/skills` mirror is DERIVED from the
   canonical skill's agent-exposed children, so a new `SKILL.md`, a `mistakes.md` companion, any
   child doc, and any support subdir (`scripts/`/`templates/`/`workflow/`) are mirrored
   automatically — you name none of them and wire nothing by hand.
2. **Confirm every mirror is intact.** The check must exit 0:
   ```bash
   bash scripts/sync-plugin-package.sh --check; echo "exit=$?"
   ```
   `--check` validates all three mirrors, including `.claude/skills/{name}` per-skill
   bidirectional parity (a missing child OR a stale extra both fail). Spot-check a leaf:
   `readlink -e .claude/skills/{name}/SKILL.md` resolves to the canonical file.
3. **plugin.json — NO edit.** Both `plugin.json` manifests are metadata-only; conventional
   `skills/` directories auto-load without a manifest key. Adding a `skills` key has caused load
   failures. Do not edit `plugin.json` for a new skill.
4. **Add a value-features prose mention in `gobbi/SKILL.md`.** A meta/authoring skill gets a
   dedicated prose mention in the Product value-features section (mirror the existing "Install /
   runtime is documented, not a skill." paragraph), NOT a Loop / Cross-cutting / Supporting
   Skill-Map table row. Skill-Map placement is not uniform: some skills have a table row, some
   are named only in value-feature prose (`skill-writing` and `agent-writing` are named in the
   authoring-skills paragraph), and some are not in `gobbi/SKILL.md` at all — `claude-plugin`
   appears NOWHERE in it (verify: `grep -c claude-plugin .gobbi/projects/gobbi/skills/gobbi/SKILL.md`
   → 0). So a new meta skill does not need a row; this step is the deliberate choice to give it a
   dedicated prose paragraph. Verify your mention landed:
   `grep -n '{name}' .gobbi/projects/gobbi/skills/gobbi/SKILL.md`.
5. **`Skill()` permission — ONLY if zero-prompt preapproval is wanted.** Add a `Skill({name})`
   entry to `.claude/settings.json` ONLY when you want the runtime to never prompt on the skill's
   tool use. It is NOT required for the skill to load (P2). If you skip it, `.claude/settings.json`
   is UNCHANGED.

Final verify across the wiring: run the markdown-link guard to confirm no new broken links. The
guard REQUIRES at least one path argument (no-arg exits 2) — pass the new skill's file or dir:
```bash
bash .gobbi/projects/gobbi/skills/orchestration/scripts/check-markdown-links.sh \
  .gobbi/projects/gobbi/skills/{name}/SKILL.md
```
A clean run prints `ALL LINKS RESOLVE (...)` and exits 0.

---

## References

Each entry names an owner and the specific claim in this skill that the owner validates. To
audit a fact, find its claim here and follow the one owner link.

- [`claude-plugin/SKILL.md`](../claude-plugin/SKILL.md) § Component auto-loading — validates:
  conventional `skills/` directories auto-load with no `plugin.json` manifest key (P5 step 3;
  the "NEVER edit `plugin.json`" Rule).
- [`claude-plugin/SKILL.md`](../claude-plugin/SKILL.md) — validates: the plugin package layout,
  the three script-owned mirror surfaces, symlink dereference rules, and the standalone
  meta/authoring-skill exemplar shape (P5; the Intro/Procedure shape reference).
- [`research/SKILL.md`](../research/SKILL.md) — validates: the short standalone skill exemplar
  shape (the Procedure shape-reference load-action).
- [`gobbi/SKILL.md`](../gobbi/SKILL.md) — validates: a meta/authoring skill gets a value-feature
  prose mention, not a Skill-Map table row (P5 step 4; the Skill-Map Rule).
- [`memory/rules.md`](../memory/rules.md) § 2 — validates: the 11-field memory-FILE frontmatter
  standard governs the typed memory trees (contrast — a skill carries NONE of these fields; P1).
- [`memory/rules.md`](../memory/rules.md) § Scope boundary — validates: skill-surface docs
  (`SKILL.md`, the `mistakes.md` companion) are OUT of the memory frontmatter standard (P1; P4).
- [`mistake/SKILL.md`](../mistake/SKILL.md) — validates: Wrap-up promotion writes the skill-owned
  `mistakes.md` companion under Always-Ask routing (P4).
- [`mistakes.md#planning-asserted-skill-without-verifying`](mistakes.md#planning-asserted-skill-without-verifying)
  — validates: the verify-before-asserting trap — a load-path asserted without `test -f` shipped
  a dead reference into a briefing (the "wiring claim" Principle; the "NEVER assert a wiring
  surface" Rule).
- [`agent-writing/SKILL.md`](../agent-writing/SKILL.md) — validates: authoring a NEW agent — the
  sibling skill that shares the mirror + verify-before-assert discipline.
