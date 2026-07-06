---
name: claude
description: "Use when authoring or editing any `.claude/` doc — CLAUDE.md, a skill SKILL.md, an agent .md, or a child doc. The prose, hierarchy, and anti-pattern standard for `.claude/` documentation."
allowed-tools: Read, Grep, Glob, Bash
---

# Claude

The documentation-authoring standard for the `.claude/` runtime tree. Load it when a task
writes or edits any `.claude/` doc — `CLAUDE.md`, a skill `SKILL.md`, an agent `.md`, or a
child doc under a skill dir. It teaches the writing principles for `.claude/` prose, the
CLAUDE.md → SKILL.md → child-doc hierarchy, the navigation conventions, and the anti-patterns
a `.claude/` doc must avoid.

This standard owns the **prose** contract — how a `.claude/` doc reads. It does NOT own the
**structural** contract: [`skill-writing/SKILL.md`](../skill-writing/SKILL.md) owns a skill's
frontmatter / section skeleton / mirror wiring, and [`agent-writing/SKILL.md`](../agent-writing/SKILL.md)
owns an agent's `.md`/`.toml` pair / frontmatter / wiring. Load the matching structural skill
alongside this one; this skill points to each owner instead of restating it. The behavioral
floor every rule here leans on is [`principles/SKILL.md`](../principles/SKILL.md) (Principles 6,
7, and 9).

The best reference is the tree itself. Before authoring, read `.claude/CLAUDE.md` for the
top-block + Navigate-deeper shape, and two or three `SKILL.md` files that match the doc you are
writing. The codebase is the style guide.

---

## Core Principles

> **Write for the agent who reads the doc cold.**

Every `.claude/` doc is loaded fresh by an agent with no prior context — no session, no working
tree, no conversation. State what the doc is and when it applies in the first paragraph, then
teach the rest so the reader acts correctly from the doc alone. A doc that only makes sense to
whoever wrote it has failed.

> **Say it plainly, briefly, and literally.**

Simple common words, short sentences (one idea each), no filler, no metaphor — Principle 7.
This is the single highest-leverage rule for `.claude/` prose: the docs are read and acted on
by agents under token pressure, and a wrong read gives a wrong result. Concision has a floor —
never compress a warning or a multi-step instruction into ambiguity.

> **Point to the one canonical owner; never restate it.**

Every fact has exactly one owning doc. Name that owner and link to it; do not copy its content.
A copied fact drifts the moment the owner changes. The top-block defers to the Glossary, a skill
defers to its owner, a child doc defers to its parent — single source of truth is the rule the
whole tree obeys.

> **Backtick every literal — path, env var, command, filename.**

A file or directory path, an environment variable, a command name, or a filename is written in
backticks: `` `.claude/CLAUDE.md` ``, `` `CLAUDE_CODE_SESSION_ID` ``, `` `bun test` ``. This is a
house convention throughout the tree; it lets a reader tell a literal from prose at a glance.

> **Start with docs, finish with docs; check CRUD + 5W1H before editing.**

Read the relevant docs before the task and ship the matching doc update in the same change
(Principle 6). Before editing, run CRUD (Create / Read / Update / Delete) and 5W1H over the
target AND every file the change reaches — mirrors, navigation tables, cross-links (Principle 9).
A doc edit has a blast radius; a stale mirror or a drifted table is a defect, not a follow-up.

---

## Procedures

### P1 — The `.claude/` doc surfaces this standard governs

The `.claude/` runtime tree holds four doc kinds, all authored to this prose standard:

| Surface | What it is | Structural owner |
|---|---|---|
| `.claude/CLAUDE.md` | The always-loaded top-block + the Navigate-deeper table (P3) | this standard |
| `.claude/skills/{name}/SKILL.md` | A skill's capability doc | [`skill-writing/SKILL.md`](../skill-writing/SKILL.md) |
| `.claude/skills/{name}/{child}.md` | A skill's child doc (a set, a long reference, per-step orchestration) | [`skill-writing/SKILL.md` § P4](../skill-writing/SKILL.md) |
| `.claude/agents/{role}.md` | An agent role's behavioral spec | [`agent-writing/SKILL.md`](../agent-writing/SKILL.md) |

**Edit the canonical file, never the `.claude/` mirror.** The `.claude/skills/` and
`.claude/agents/` entries are SYMLINK mirrors of the canonical tree under
`.gobbi/projects/gobbi/{skills,agents}/` — the workspace-visible views, not the source. Edit
the canonical path; the mirror reflects it for free. A full-file write to a mirror path converts
the symlink into a regular file and BREAKS the mirror. See
[`skill-writing/mistakes.md#claude-skills-mirror-is-symlink-not-copy`](../skill-writing/mistakes.md#claude-skills-mirror-is-symlink-not-copy).
`CLAUDE.md` itself is a real file at the repo root, edited directly.

### P2 — Writing principles for `.claude/` prose

Apply these to the body of every `.claude/` doc:

- **Plain / brief / literal.** "use" not "utilize"; ~15-20 words per sentence; cut filler
  ("just", "really", "in order to", "it's worth noting"); state the meaning, not a metaphor
  (Principle 7).
- **Backtick every literal.** Path, env var, command, filename — as above.
- **Define every abbreviation on first use.** `API (Application Programming Interface)` on first
  occurrence, then the short form. Never a cryptic internal abbreviation — write "Principle 7",
  not "P7" (Principle 7 anti-pattern; the [`discussion/SKILL.md` § Abbreviation rule](../discussion/SKILL.md#abbreviation-rule)
  states the same rule for user-facing text).
- **One concept per doc; point, do not restate.** A borrowed fact links to its owner. A doc that
  restates an owner drifts and breaks single-source-of-truth.
- **Match the surrounding doc.** Comment density, heading style, table shape, and terminology
  follow the docs already in the tree — do not invent a new house style (Principle 3).

### P3 — Doc hierarchy and navigation

`.claude/` docs form a three-tier hierarchy, widest-and-shortest at the top:

1. **`CLAUDE.md` top-block** — always loaded at session start. It states the core model in
   summary and DEFERS the canonical enums / vocabulary to their owner rather than restating them
   (the defer-to-Glossary pattern: the top-block names a term and links the
   [`gobbi/SKILL.md`](../gobbi/SKILL.md) Glossary instead of re-listing the values).
2. **`SKILL.md`** — the capability, loaded on demand. It teaches one coherent capability and
   points to its owners.
3. **Child docs** — a set of stamped artifacts, a too-long deterministic reference, or per-step
   orchestration; justified by ownership, not by length ([`skill-writing/SKILL.md` § P4](../skill-writing/SKILL.md)).

**Navigate-deeper table.** `CLAUDE.md` ends with a `| Document | Covers |` table — one row per
top-level doc, each a link plus a one-line "Covers". A skill ends with a `## Cross-references`
list — one bullet per owner or sibling the body pointed at, each written as a markdown link (a
`[label]` followed by the target path in parentheses). Keep both current: a new top-level doc
gets a Navigate-deeper row; a new outbound pointer gets a Cross-references bullet.

### P4 — Naming and structure (defer to the structural owners)

Naming and section structure are owned by the structural skills; this standard states only the
cross-cutting conventions and points to the owner for the rest:

- **Skill:** the directory name equals the `name` frontmatter equals the Title-Case `# Title`;
  the file is `SKILL.md`, placed DIRECTLY in the skill dir (no nested subdir for the SKILL.md
  itself). Frontmatter, the section skeleton, and the length norm are owned by
  [`skill-writing/SKILL.md` § P1-P4](../skill-writing/SKILL.md).
- **Agent:** the canonical `.md`/`.toml` pair, the four `.md` frontmatter keys, and the section
  contract are owned by [`agent-writing/SKILL.md` § P2](../agent-writing/SKILL.md).
- **Child doc:** kebab-case, names its subject, lives in the owning skill's dir.

The parallel standard for MEMORY docs (files under the typed memory trees) is
[`memory/rules.md` § 4](../memory/rules.md#4-dev-document-quality-standard) — the zero-context-reader
bar. This `claude` standard governs `.claude/` runtime docs; `memory/rules.md` governs memory
files. Do not cross the two.

---

## Constraints

- **MUST write plain, brief, literal prose** — Principle 7; no filler, no metaphor, no
  compressed-into-ambiguity warnings.
- **MUST backtick every path, env var, command, and filename** in prose.
- **MUST define every abbreviation on first use** and never use a cryptic internal abbreviation
  ("P7" for "Principle 7").
- **MUST point to the one canonical owner, not restate it** — every borrowed fact links to its
  owner; a copied fact drifts.
- **MUST edit the canonical `.gobbi/projects/gobbi/{skills,agents}/` file, never the `.claude/`
  mirror symlink** — a write to the mirror breaks it.
- **MUST keep navigation current** — a new top-level doc gets a `CLAUDE.md` Navigate-deeper row;
  a new outbound pointer gets a `## Cross-references` bullet (Principle 9).
- **MUST defer structure to the owner** — skill structure to [`skill-writing`](../skill-writing/SKILL.md),
  agent structure to [`agent-writing`](../agent-writing/SKILL.md); this standard owns prose only.
- **NEVER restate an owner's content** to save the reader a click — the copy drifts.

## Anti-patterns

- **AI-writing vocabulary.** The sycophantic-compression tells `delve`, `crucial`, `robust`,
  `comprehensive`, `nuanced`, `multifaceted`, `leverages`, `streamlines` — banned in `.claude/`
  doc prose as in user-facing text ([`discussion/SKILL.md` § Banned in question text](../discussion/SKILL.md#banned-in-question-text)).
  They signal compression over substance; write the specific claim instead.

- **Cryptic or undefined abbreviations.** Writing "P7" for "Principle 7", or a domain acronym
  with no first-use expansion. The reader may be cold — spell it out (Principle 7 anti-pattern).

- **Restating an owner instead of pointing.** Copying a frontmatter standard, a template, an
  enum, or a procedure into a doc that does not own it. Cite the owner's path + section and let
  the reader follow the link; the copy rots the moment the owner changes.

- **Editing the `.claude/` mirror.** A full-file write to `.claude/skills/{name}/SKILL.md`
  converts the symlink to a regular file and breaks the mirror. Edit the canonical file; the
  mirror follows. See [`skill-writing/mistakes.md#claude-skills-mirror-is-symlink-not-copy`](../skill-writing/mistakes.md#claude-skills-mirror-is-symlink-not-copy).

- **Unbacktick'd literals.** A bare `.claude/settings.json` or `bun test` in prose reads as
  ambiguous text. Backtick every path, command, env var, and filename.

> **Scope note on em dashes and anti-sycophancy phrases.** The em-dash-as-soft-connector ban and
> the anti-sycophancy phrase table in [`discussion/SKILL.md`](../discussion/SKILL.md#anti-sycophancy)
> apply to **user-facing** text (the AskUserQuestion content), NOT to `.claude/` doc prose — the
> discussion skill states this carve-out itself. Em dashes are the accepted connector style in
> `.claude/` docs. The AI-vocabulary ban above DOES apply to docs; the em-dash ban does not.

## Cross-references

- Skill structural + frontmatter + wiring contract → [`skill-writing/SKILL.md`](../skill-writing/SKILL.md)
- Agent `.md`/`.toml` structural + wiring contract → [`agent-writing/SKILL.md`](../agent-writing/SKILL.md)
- Plugin package layout, manifests, and the mirror symlinks → [`claude-plugin/SKILL.md`](../claude-plugin/SKILL.md)
- The behavioral floor (Principles 6, 7, 9) → [`principles/SKILL.md`](../principles/SKILL.md)
- Banned AI vocabulary + abbreviation rule → [`discussion/SKILL.md` § Banned in question text](../discussion/SKILL.md#banned-in-question-text)
- The entry point + Glossary the top-block defers to → [`gobbi/SKILL.md`](../gobbi/SKILL.md)
- The parallel prose standard for MEMORY docs → [`memory/rules.md` § 4](../memory/rules.md#4-dev-document-quality-standard)
- The mirror-is-symlink-not-copy trap → [`skill-writing/mistakes.md#claude-skills-mirror-is-symlink-not-copy`](../skill-writing/mistakes.md#claude-skills-mirror-is-symlink-not-copy)
