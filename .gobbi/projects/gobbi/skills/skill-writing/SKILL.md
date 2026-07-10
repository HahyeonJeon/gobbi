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
  → References; § Procedure preamble), writing one section per step; place Memory Access Matrix
  and Output paths as Procedure sub-sections ONLY when the skill's work writes (§ Procedure P5).
  A read-only reference skill omits both.
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

Author a new skill by writing its six sections in the fixed order below, then wiring it so both
runtimes can load it. Before writing, read two or three existing skills that match the shape you
need as shape references — `research/SKILL.md` for a short standalone skill, `claude-plugin/SKILL.md`
for a standalone meta/authoring skill. The codebase is the style guide.

The section order is fixed: **Frontmatter → Intro → Principles → Rules → Procedure → References.**
Steps P1–P6 write one section each, in order; P7 wires the finished skill and verifies it loads.
Same-file `§` pointers are in-file navigation and are allowed in any section; a cross-doc see-also
is not — it belongs in References.

### P1 — Write the Frontmatter

A skill's frontmatter carries three REQUIRED keys, in this order — `name`, `description`,
`allowed-tools` (verify: every head under `.gobbi/projects/gobbi/skills/*/SKILL.md` carries these
three). The schema is "three required keys plus a named optional allowlist," NOT "exactly three and
no others": an official optional field is valid when the skill needs the non-default behavior.

```yaml
---
name: {skill-name}
description: {one line; grammar depends on how the skill loads — see below}
allowed-tools: Read, Grep, Glob, Bash
---
```

- **`name`** — MUST equal the skill's directory name (`skills/{name}/` → `name: {name}`).
- **`description`** — one line; quote-wrap if it contains a colon. The grammar matches how the skill
  loads: a **deterministic** load (a phase or role always loads it) opens with `MUST load …`; an
  **on-demand** load (loaded only when a task touches the domain) opens with `Use when …` / `Load when …`.
  A new authoring/reference skill is on-demand.
- **`allowed-tools`** — the smallest tool surface the skill's work needs. A read-only reference skill
  lists `Read, Grep, Glob, Bash`; a skill whose work edits files adds `Write, Edit`.
- **Optional allowlist keys set two of the four reach axes here.** `user-invocable: false` hides the
  skill from `/`; `disable-model-invocation: true` stops the model auto-loading it; the rare official
  `license` / `compatibility` / `metadata` only with a stated reason. Both discoverability defaults are
  visible / auto-loadable, so omit the key unless you want the non-default. (The other two reach axes —
  **mirror availability** and **`Skill()` permission** — are wiring decisions, set in P7.)
- **NEVER a memory-file field.** A skill is not a memory file; do not stamp it with `type` / `scope` /
  `status` / `tags` or any other memory field.

**Trap:** do not revive the "exactly three keys and no others" contradiction — the schema is required
baseline plus a named optional allowlist.

### P2 — Write the Intro

Write the H1 title (the skill name, Title Case) plus one or two short paragraphs: what the skill is,
and when to load it. The Intro orients a cold-loading agent; it does not instruct.

- **Keep it source-free** — name no other file, add no owner link, no exemplar pointer. Ownership lives
  in § References; load actions live in § Procedure.
- **No procedure detail, no enforcement bullet** — those are Procedure's and Rules' jobs.
- **Role-defining skill exception** — a skill that defines an agent role MAY carry a longer Intro: the
  role definition plus its reference tables. The exception is the role content itself, not extra rationale.
- **Trap: do not state rationale the Principles section owns.** If a sentence explains WHY something is
  true, it belongs in Principles, not the Intro. The same concept in both places is the exact drift the
  six-section split removes.

### P3 — Write the Principles

Write three to six entries. Each is a one-line concept in a `> **…**` blockquote, followed by a short
paragraph explaining WHY the concept is true. Principles teach the mental model — judgment, not compliance.

- **Conceptual only** — no `MUST` / `NEVER` / `ALWAYS`, no procedure step, no cross-doc citation.
- **The boundary test** — if a line can be graded pass/fail against a specific edit, it is a Rule, not a
  Principle; move it to § Rules.
- **Pair with Rules** — each Principle should have at least one matching Rule that makes it checkable; not
  every Rule needs a Principle (some are purely mechanical).
- **Trap:** a principle that says "do X" is a Rule in disguise.

### P4 — Write the Rules

Write the enforceable floor as scannable bullets in two labeled sub-groups: `### Must-Follow`
(`MUST` / `ALWAYS`) and `### Must-Not-Follow` (`NEVER` bullets / anti-patterns).

- **Each bullet is self-contained** — a terse inline rationale, and for an anti-pattern its one-line fix.
  A reader never jumps to Principles to understand a Rule.
- **Checkable** — every bullet reads as a review-checklist item, gradable against a draft skill.
- **Source-free** — no owner link, no other file name. A same-file `§` pointer is navigation, allowed.
- **Two sub-groups are the norm**; a very short skill with only a rule or two per side MAY use a single
  `## Rules` list when the split would leave near-empty sub-headings.
- **Trap:** do not duplicate a Procedure step as a Rule unless it is a true pass/fail boundary.

### P5 — Write the Procedure

Write the operational SOP: numbered `### P#` steps for a reference skill, or phase tables for a loop
skill. Every step says what to do, in what order, and how to know it is done.

- **The only section that may name another file** — and only as a load / read / run ACTION ("Read
  `<path>` § … when …", "run `<script>`"). A see-also pointer is not an action; it goes to References. A
  path used as a value (a file the procedure reads or writes) stays inline as a code span.
- **Conditional write-only sub-sections** — if the skill's work writes to the session record or memory,
  place `### Memory Access Matrix` and `### Output paths` here as sub-sections (or a child-doc pointer
  when large). A read-only skill omits both. These two are the only sections beyond the six that ever
  appear, and only inside Procedure.
- **Length norm.** Gobbi skills run ~140-600 lines (median ~340). A plain reference skill aims short; an
  authoring-SOP skill (this one, `agent-writing`) runs longer because the walkthrough itself is the value
  — completeness of the SOP wins over the line count. Length is still bounded by single source of truth: a
  skill that copies its owners' content bloats; one that states the fact and records the owner stays tight.
- **Standalone vs child-doc.** Default to a single standalone `SKILL.md`. Split into child docs ONLY when
  the skill owns one of: **(a)** a SET of stamped per-instance artifacts (templates, e.g.
  `delegation/templates/{role}.md`); **(b)** a deterministic rule-reference too long for the body, read by
  lookup; **(c)** per-step / per-loop / per-role orchestration docs, one per unit; **(d)** a self-contained
  sub-procedure a different phase or audience reads independently, or a block whose inline length would
  push the parent well past the norm. Never split by length alone. When the skill has child docs, the
  Procedure MUST map when to read each one.
- **The `mistakes.md` companion.** Separately from length-driven child docs, a skill MAY carry a
  `mistakes.md` companion in its dir — the skill-owned mistakes home (the hybrid model), one `## ` section
  per trap. It is a skill-surface doc OUT of the memory frontmatter standard, governed by its own
  `check-skill-mistakes.sh` guard, not by `validate-frontmatter.sh`. Wrap-up promotion writes it
  (Always-Ask routing). A brief that lists `skills/{name}/SKILL.md` in its Load Directives ALSO lists
  `skills/{name}/mistakes.md` as a companion path, so the trap loads in the skill's context. It is mirrored
  into `.claude/skills/{name}/` by the same DERIVED per-file sync as `SKILL.md`, so it needs no separate
  wiring step (P7).
- **Trap:** do not copy an owner's content into a step — state the local action, record ownership in
  § References.

### P6 — Write the References

Write a section-level ownership register: one entry per owner, naming WHICH FACT it validates —
`{owner path + section} validates {the claim in this skill}`. This is the one section that holds the
inline markdown links (each `[label]` pointing to an owner path), so the markdown-link guard resolves
them.

- **One owner per borrowed claim** — every fact the body borrows has exactly one entry; no bare see-also list.
- **States no new fact** — References only names owners for facts the body already stated.
- **Link shape is mirror-stable** — prefer sibling-skill and same-directory links; a deep `../` climb can
  resolve from the canonical path yet break through the `.claude` / `.agents` runtime mirrors. A repo-root
  script usually appears as a Procedure command code span, not a Reference link.
- **Trap:** a "related docs" list with no claim mapping is not an ownership register.

### P7 — Wire the skill and verify it loads

Wiring sets the remaining two reach axes and proves the skill loads. **Mirror availability** (default:
both runtimes; set one-runtime-only only when a skill is intentionally single-runtime) and **`Skill()`
permission** (default: no entry; add only for zero-prompt preapproval) are both decided here. A skill
on disk that no runtime loads is unfinished.

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
   tool use. It is NOT required for the skill to load (P1). If you skip it, `.claude/settings.json`
   is UNCHANGED.

   **`Skill()` is a permission, not discoverability.** A skill loads and appears without any
   `Skill()` entry — `claude-plugin` and `codex`, for example, are mirrored and load with no
   `Skill()` perm. The mirror count and the perm count are not equal; confirm the gap live rather
   than trusting a number that drifts as skills are added:
   ```bash
   ls .claude/skills | wc -l                  # mirrored skills
   grep -c 'Skill(' .claude/settings.json     # preapproved skills
   ```
   The difference is the count of mirrored-but-unpermissioned skills. Omitting the entry does not
   hide the skill; it only means the first tool use may prompt.

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
  conventional `skills/` directories auto-load with no `plugin.json` manifest key (P7 step 3;
  the "NEVER edit the plugin manifests" Rule).
- [`claude-plugin/SKILL.md`](../claude-plugin/SKILL.md) — validates: the plugin package layout,
  the three script-owned mirror surfaces, symlink dereference rules, and the standalone
  meta/authoring-skill exemplar shape (P7 mirror surfaces; the Procedure preamble shape-reference).
- [`research/SKILL.md`](../research/SKILL.md) — validates: the short standalone skill exemplar
  shape (the Procedure preamble shape-reference load-action).
- [`gobbi/SKILL.md`](../gobbi/SKILL.md) — validates: a meta/authoring skill gets a value-feature
  prose mention, not a Skill-Map table row (P7 step 4; the Skill-Map Rule).
- [`memory/rules.md`](../memory/rules.md) § 2 — validates: the 11-field memory-FILE frontmatter
  standard governs the typed memory trees (contrast — a skill carries NONE of these fields; P1).
- [`memory/rules.md`](../memory/rules.md) § Scope boundary — validates: skill-surface docs
  (`SKILL.md`, the `mistakes.md` companion) are OUT of the memory frontmatter standard (P1; P5).
- [`mistake/SKILL.md`](../mistake/SKILL.md) — validates: Wrap-up promotion writes the skill-owned
  `mistakes.md` companion under Always-Ask routing (P5).
- [`mistakes.md#planning-asserted-skill-without-verifying`](mistakes.md#planning-asserted-skill-without-verifying)
  — validates: the verify-before-asserting trap — a load-path asserted without `test -f` shipped
  a dead reference into a briefing (the "wiring claim" Principle; the "NEVER assert a wiring
  surface" Rule).
- [`agent-writing/SKILL.md`](../agent-writing/SKILL.md) — validates: authoring a NEW agent — the
  sibling skill that shares the mirror + verify-before-assert discipline.
