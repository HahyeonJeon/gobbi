---
name: skill-writing
description: "Use when authoring a project skill, or revising, migrating, or splitting one — the frontmatter schema, the six-section standard form, the design gates, and the wiring + conformance procedure."
allowed-tools: Read, Grep, Glob, Bash
---

# Skill Writing

Skill for authoring a project skill — a standard operating procedure for one capability. Load it when
creating a new skill, or when revising, migrating, or splitting an existing one.

A skill does not just describe a capability; it standardizes how the capability is performed. It does
that by defining the specifications for its operations — how each step is done — so every agent that
loads it works the one specified way instead of improvising. A second, lesser standard governs the
document itself — every skill uses the same standard form: the same sections in the same order, the
same rules, one owner per borrowed fact. You standardize the operations; you fill a standard form to
present the procedure.

---

## Principles

> **A skill is a standard operating procedure for one capability.**

A skill is loaded by an agent with no prior context that must perform the work, not study a
subject. So it is written as an executable procedure for one coherent capability — ordered steps,
clear boundaries, and enough orientation to act without reconstructing the session that wrote it. It
standardizes the work by defining the specifications for its operations — how each step is done — so
every agent that loads the skill performs it the one specified way instead of improvising. A document
that only describes a topic transfers information but not a reliable practice; and because a skill
exists to be run, its worth is realized only when an agent can load it and follow it.

> **Evidence and the user shape the design.**

A skill is a shared contract every agent will obey, so its design is worth getting right over
getting done fast. Two sources shape it: research into how the capability actually works and where
it fails, and discussion with the user about intent and tradeoffs. The same discipline governs the
skill's claims — a statement about behavior or wiring is trustworthy only when read from the
mechanism that makes it true, never assumed. Together they keep a polished procedure from
standardizing the wrong work.

> **Standard form makes skills predictable to read.**

A set of skills is usable only if any one of them reads the same way. A shared section grammar gives
each kind of guidance — orientation, mental model, enforcement, action, ownership — a stable home,
so a cold-loading agent finds what it needs without learning a new layout each time. The uniformity
is functional, not cosmetic: it is what makes the corpus navigable and its skills interchangeable,
and a skill that deviates taxes every future reader. The standard form governs how a skill reads, not
how its operations are specified — that substance is the procedure's.

> **The SKILL.md holds the top-level flow; depth lives in child docs.**

The entry document is loaded first and often, so it stays legible by carrying the whole top-level
procedure and nothing heavier. Detail with its own depth — a long reference, a set of templates, a
per-unit sub-procedure — moves into a child doc the reader opens only when a step calls for it.
Separating the layers keeps the operation visible as a whole while giving complex detail room to
grow one hop away — present when needed, never crammed into the parent.

> **Every fact has one owner; a copy drifts.**

A skill leans on facts owned by other documents — a frontmatter standard, a script, a template. Copy
such a fact and the copy rots the moment the owner changes, and the two quietly disagree. So a skill
states the fact and records its owner, never restating what another file owns — which is why the
body stays free of borrowed detail and one source can settle any factual disagreement.

---

## Rules

### Must-Follow

- **MUST scope a skill to ONE coherent capability, cold-load-sufficient** — an agent with no prior
  context can perform the capability from the Intro + Procedure alone. A skill that bundles two
  capabilities, or needs the authoring session's context to act, fails this.
- **MUST ground the design in prior art and user alignment before locking the Procedure** — study
  the existing skills that share the shape and decide the design with the user; never author a new
  skill's shape from a first guess.
- **MUST name the file `SKILL.md`** in the canonical skill directory, with `name` matching that
  directory — the loader resolves a skill by its dir name.
- **MUST carry the three required keys, plus optional keys ONLY from the named allowlist in
  § Procedure P4; NEVER a field from another schema.** The three required keys (`name`, `description`,
  `allowed-tools`) are the baseline; an allowlist key is added only for non-default behavior. A skill
  carries only skill frontmatter, so keys like `type` / `scope` / `status` / `tags` (from a memory or
  config schema) never appear.
- **MUST match the description grammar to the load mode** — `MUST load …` for a deterministic
  load, `Use when …` / `Load when …` for an on-demand load. A mismatched grammar misleads the
  reader about when the skill loads.
- **MUST follow the six-section order** (Frontmatter → Intro → Principles → Rules → Procedure
  → References; § Procedure preamble), writing one section per step; place Memory Access Matrix
  and Output paths as Procedure sub-sections ONLY when the skill's work writes (§ Procedure P8).
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
- **MUST verify loadability empirically before declaring the skill done** — the project's skill
  guards pass and each runtime mirror resolves, AND the skill loads cold in each runtime and a fresh
  agent can follow it. Structural checks are necessary but not sufficient; a skill no runtime loads is
  unfinished.

### Must-Not-Follow

- **NEVER copy an owner's content into the body** instead of stating the fact and naming the
  owner — the copy drifts the moment the owner changes. Fix: state the fact plainly; record
  the owner path + section in § References.
- **NEVER assert a wiring surface without verifying it** — writing "the skill is mirrored"
  without running the check, or "the load path exists" without testing it. Fix: verify the
  MECHANISM by reading its owner (script / settings / mirror), not the end-state.
- **NEVER hand-create the runtime mirrors** — a hand-made one drifts from what the project's sync
  mechanism produces. Fix: run the sync mechanism and let it build every mirror.
- **NEVER edit the plugin / package manifest to register a skill** — conventional skill directories
  auto-load with no manifest key, and a manifest key can break loading. Fix: leave the manifest
  untouched.
- **NEVER add a tool-permission entry unless zero-prompt preapproval is wanted** — it is a
  permission gate, not a discoverability gate; the skill loads without it. Fix: omit it and accept a
  first-use tool prompt, or add it only to silence that prompt.
- **NEVER register a skill in the project's skill index against its convention** — follow the index's
  rule for the skill's kind (a project may list operational skills, name meta skills in prose, or omit
  some). Fix: place the skill by the index's convention, not by default.
- **NEVER split a skill into child docs by length alone** — a child doc is justified by
  ownership of a SET of artifacts, a too-long lookup reference, per-unit orchestration, or an
  independent-audience sub-procedure. Fix: default to standalone; split only on one of those.
- **NEVER collapse a per-unit artifact SET the skill owns into one monolithic file** — per-perspective
  review scenarios, per-item checklists, and the like. A monolith hides per-unit drift, blocks stable
  per-unit references, and ships no independently reusable piece. Fix: give each unit its own child doc
  per the P3 (a)/(c) split criteria; the owning skill records the multi-file contract.

---

## Procedure

Author a skill in three parts. **FRAME (P1–P3)** — lock the one capability, the evidence, and the user's
direction first. **WRITE (P4–P9)** — the six sections in fixed order, one per step, never paired or
collapsed. **WIRE (P10)** — build the mirrors, then prove a fresh agent finds and follows it.

**P1–P3 are a hard design gate:** draft no section until the capability, evidence, and direction are locked.
A skill framed wrong standardizes the wrong work under a polished, trustworthy-looking surface.

One flow fits every origin — create from scratch, extract from a session, revise, migrate, split. Only the
set of already-existing files differs, and P3's affected-file map captures that.

Every skill in the project uses the same **standard form** — the same six sections in the same order, the
same rules, one owner per borrowed fact. The steps below fill that fixed shape; after P9, the **conformance
checklist** (`checklists.md`) confirms the finished skill conforms to the standard form before wiring. The
shape is fixed; the operations the skill specifies are yours to design.

### P1 — Frame the one capability

Name the single capability in four parts:

- **Actor** — who loads and runs it. Pick the NARROWEST that always needs it: a phase or role that loads it
  every run → `phase:{x}` / `role:{x}`; many unrelated callers → `any-agent`. Take the name from a real
  consumer, not the topic.
- **Trigger / load mode** — by rule, not feel. **Deterministic** iff a phase or role loads it every time
  that phase/role runs; else **on-demand** (a task loads it when it touches the domain). The load mode sets
  the description grammar and the P4 frontmatter.
- **Outcome** — what a fresh agent produces by following the skill end to end.
- **Non-goals** — what it deliberately skips. One coherent, cold-load-sufficient capability; a second
  capability is a second skill. Can't state the outcome and non-goals in a sentence each? It isn't one thing
  yet — narrow it.

Draft the **description** — the line that makes the skill load: what it does AND when to load it (its
triggers), specific and a little pushy (skills under-trigger on vague ones), never first- or second-person.
The grammar matches the load mode — `MUST load …` (deterministic) or `Use when …` / `Load when …`
(on-demand; a new authoring/reference skill is on-demand). It goes into the P4 frontmatter.

### P2 — Study the evidence and pass the user design gate

Ground the design in prior art and in the mechanisms that own its facts, before locking anything.

- **Analogous skills** — read those sharing the shape (reference vs loop vs role, read-only vs state-writing)
  and follow their form; never author a shape from a first guess. Extract-from-session: the session record is
  a source too. Revise/migrate: the existing skill and its history are the prior art.
- **Consumers** — read the callers that will load this skill (a workflow step, a role, a delegation prompt),
  so the description and Procedure fit the real load. A net-new capability may have no consumer yet — say so,
  and design for the first intended caller.
- **External prior art** — study an established outside practice and keep only what improves the procedure;
  adapt it to the project's standard, never import it wholesale.
- **Applicable mistakes** — load `skills/skill-writing/mistakes.md` and any domain mistakes.
- **Owner mechanisms, not assumptions** — read every behavior or wiring claim from the mechanism that makes
  it true (script source, live symlink, settings file). A claim not read from its owner is a guess.
- **User design gate** — the user locks the direction (shape, altitude, scope) from reference-backed options,
  not a finished draft. **An explicit task direction already satisfies the gate:** when the user or the brief
  has stated the shape, record it and proceed — do not re-ask a settled decision.

### P3 — Map ownership, affected files, and altitude; lay the skeleton

With the capability and direction locked, design the structure before filling it.

- **Claim-owner ledger** — list every fact the skill will borrow and its ONE owner (path + section); this
  becomes § References at P9. A borrowed fact with no single owner: state it locally or drop it, never copy.
- **Affected-file map (blast radius)** — list every file the change touches beyond `SKILL.md`: the runtime
  mirror(s) the skill syncs into, the project's skill index, the permission / settings file, the skill
  guards, and any caller that loads the skill. On a migrate or split this map IS the job — which files move,
  shrink, or gain a child-doc pointer, kept consistent across all. Mark each surface by how it is touched —
  **authored** (you write it), **generated** (the mirrors the sync builds — never hand-edited),
  **conditionally-updated** (the skill index, the settings file), or **read-only** (guards you only run) — so
  you never run line-level CRUD on a generated mirror.
- **CRUD + 5W1H over the set** — for the target and each authored file, name what to Create, what to Read for
  consistency, what to Update (to the line), what to Delete; then who depends on it, what changes, when it
  applies, where else it must change, why, and how it propagates. Scale it: a one-file standalone collapses
  to a few lines; the full pass earns its keep on a migrate or multi-file split.
- **Altitude — standalone vs child docs** — default to one standalone `SKILL.md`. Split detail into a child
  doc ONLY when the skill owns one of: **(a)** a SET of stamped per-instance artifacts (a `templates/` set
  the skill ships); **(b)** a deterministic rule-reference too long for the body, read by
  lookup; **(c)** per-step / per-loop / per-role orchestration docs, one per unit; **(d)** a self-contained
  sub-procedure another phase or audience reads on its own, or a block whose inline length would push the
  parent well past the length norm. Never split by length alone. A child doc stays ONE hop from `SKILL.md`
  (no child of a child), and one over ~100 lines opens with a table of contents.
- **Lay the empty skeleton** — Frontmatter → Intro → Principles → Rules → Procedure → References as empty
  headings, plus stubs for any child docs the altitude decision requires. Fill it in the fixed order below,
  one section per step.

### P4 — Write the Frontmatter

Three REQUIRED keys, in order: `name`, `description`, `allowed-tools` (verify: every skill head in the
project carries all three). The schema is "three required keys plus a
named optional allowlist," NOT "exactly three and no others" — an official optional field is valid when the
skill needs its non-default behavior.

```yaml
---
name: {skill-name}
description: {one line; grammar depends on how the skill loads — see below}
allowed-tools: Read, Grep, Glob, Bash
---
```

- **`name`** — MUST equal the skill's directory name (`skills/{name}/` → `name: {name}`).
- **`description`** — the P1 draft, one line; quote-wrap if it holds a colon. Grammar matches the load:
  `MUST load …` (deterministic) or `Use when …` / `Load when …` (on-demand).
- **`allowed-tools`** — the smallest surface the skill's OWN work needs. Reads-and-informs →
  `Read, Grep, Glob, Bash`; work that PRODUCES or edits a file — even a "reference" skill whose output is a
  written artifact (a doc, a changelog entry) — adds `Write, Edit`. "Reference" is the shape, not the tool
  surface. Scope to the work, not to what you used to research it.
- **Optional allowlist keys** set two of the four reach axes: `user-invocable: false` hides it from `/`;
  `disable-model-invocation: true` stops the model auto-loading it; the rare official `license` /
  `compatibility` / `metadata` only with a stated reason. Both discoverability defaults are visible /
  auto-loadable — omit the key unless you want the non-default. (The other two axes — mirror availability and
  the `Skill()` permission — are P10 wiring.)
- **NEVER a field from another schema** — a skill carries only skill frontmatter, never keys borrowed from
  the project's memory, config, or other file standards (e.g. `type` / `scope` / `status` / `tags`).

**Trap:** do not revive "exactly three keys and no others" — the schema is required baseline plus a named
optional allowlist.

### P5 — Write the Intro

The H1 title (skill name, Title Case) plus one or two short paragraphs: what the skill is, and when to load
it. The Intro orients a cold-loading agent; it does not instruct.

- **Source-free** — name no other file, no owner link, no exemplar pointer. Ownership lives in § References;
  load actions in § Procedure.
- **No procedure detail, no enforcement bullet** — those are Procedure's and Rules' jobs.
- **Role-defining exception** — a skill that defines an agent role MAY carry a longer Intro: the role
  definition plus its reference tables. The exception is the role content, not extra rationale.
- **Trap** — a WHY sentence belongs in Principles, not the Intro.

### P6 — Write the Principles

Three to six entries, each a one-line concept in a `> **…**` blockquote followed by a short WHY paragraph.
Principles teach the mental model — judgment, not compliance.

- **Conceptual only** — no `MUST` / `NEVER` / `ALWAYS`, no procedure step, no cross-doc citation.
- **Boundary test** — a line gradable pass/fail against a specific edit is a Rule; move it to § Rules.
- **Pair with Rules** — each Principle has at least one matching Rule that makes it checkable; not every Rule
  needs a Principle.
- **Trap** — a principle that says "do X" is a Rule in disguise.

### P7 — Write the Rules

The enforceable floor, as scannable bullets in two labeled sub-groups: `### Must-Follow` (`MUST` / `ALWAYS`)
and `### Must-Not-Follow` (`NEVER` bullets / anti-patterns).

- **Self-contained** — each bullet carries a terse inline rationale, and each anti-pattern its one-line fix.
  A reader never jumps to Principles to understand a Rule.
- **Checkable** — every bullet reads as a review-checklist item, gradable against a draft skill.
- **Source-free** — no owner link, no other file name; a same-file `§` pointer is navigation, allowed.
- **Two sub-groups are the norm** — a very short skill with only a rule or two per side MAY use a single
  `## Rules` list when the split would leave near-empty sub-headings.
- **Rule vs Procedure step** — a Rule states an **invariant** (a condition any *finished* skill must satisfy,
  gradable without knowing the authoring order); a Procedure step states an **ordered action**. The same
  sentence never appears verbatim as both — the invariant once as the Rule, the act once as the Procedure
  gate.

### P8 — Write the Procedure

The operational SOP: numbered `### P#` steps for a reference skill, or phase tables for a loop skill. Every
step says what to do, in what order, and how to know it is done.

- **Match specificity to fragility** — judgment steps as prose that trusts the agent; fragile steps pinned to
  exact commands. State only what the agent cannot infer.
- **The only body section that names a file *as an action*** — a load / read / run action ("Read `<path>`
  § … when …", "run `<script>`"). References also names files, but as *ownership* links, not actions — that
  is its distinct job. A see-also pointer is not an action; it goes to References. A path used as a value
  stays inline as a code span.
- **Conditional write-only sub-sections** — if the skill's work writes to the session record or memory, place
  `### Memory Access Matrix` and `### Output paths` here (or a child-doc pointer when large); a read-only
  skill omits both. These two are the only sections beyond the six that ever appear, and only inside
  Procedure.
- **Child-doc mapping** — if P3's altitude decision moved detail into child docs, map when to read each one
  ("Read `<child>` when …"). The split criteria live in P3, not here.
- **Length norm** — skills run ~140–600 lines (median ~340). A reference skill aims short; an authoring-SOP
  skill (this one) runs longer — completeness beats line count. Length is still bounded by single source of
  truth: copying an owner's content bloats; stating the fact and recording the owner stays tight.
- **A per-skill companion (optional)** — separately from length-driven child docs, a skill MAY carry a
  companion doc in its dir if the project keeps one (e.g. a `mistakes.md` of recorded traps). It is a
  skill-surface doc governed by the project's skill guards, not by any other frontmatter standard, and a
  caller that loads `SKILL.md` also loads the companion. The same per-file sync that mirrors `SKILL.md`
  mirrors the companion, so it needs no separate wiring step (P10).
- **Trap** — do not copy an owner's content into a step; state the local action, record ownership in
  § References.

### P9 — Write the References

A section-level ownership register: one entry per owner naming WHICH FACT it validates —
`{owner path + section} validates {the claim in this skill}`. This is the one section holding the inline
markdown links (each `[label]` pointing to an owner path), so the markdown-link guard resolves them.

- **One owner per borrowed claim** — every borrowed fact has exactly one entry, drawn from the P3 ledger; no
  bare see-also list.
- **No borrowed facts?** A skill that owns all its content — the project files it touches are runtime inputs,
  not borrowed claims — writes a one-line section ("No borrowed claims; this skill owns its content."), never
  omitting it or inventing a link.
- **States no new fact** — References only names owners for facts the body already stated.
- **Mirror-stable links** — prefer sibling-skill and same-directory links; a deep `../` climb can resolve
  from the canonical path yet break through the runtime mirrors. A repo-root file (a script, or a doc like
  `CHANGELOG.md`) usually appears as a Procedure code span or a plain path, not a fragile `../` link.
- **Anchored entries** — link a `#anchor` only when the named section is the real owner, and record the exact
  target heading so P10 can verify its slug (the link guard is anchor-blind).
- **Trap** — a "related docs" list with no claim mapping is not an ownership register.

### Conformance checklist — close P1–P9 before wiring

Before P10 wiring, run the judgment-free conformance checklist — read `checklists.md`. A single NO sends you
back to the step that owns it; the skill moves to P10 only when every line is YES.

### P10 — Wire the skill and verify it loads cold

Writing the body is half the job. A skill exists to be loaded and run, so it is done only when a runtime
can load it and a fresh agent can follow it. Wiring also sets the last two reach axes: **mirror
availability** (default: every runtime the project mirrors into; make a skill single-runtime only as a
deliberate decision) and the **tool-permission entry** (default: none; add one only for zero-prompt
preapproval). P4 forward-references both as P10 wiring.

Wire and prove the skill in order, each step with its check:

- **Build the mirrors with the project's sync mechanism — never by hand.** Run the mechanism that owns the
  runtime mirrors; it derives every mirror from the canonical skill, including each child doc and companion
  the skill added. P3 marks the mirrors *generated* for this reason — a hand-made mirror drifts from what
  the guard expects.
- **Confirm mirror and reference integrity with the project's structural guards.** Run the mirror-parity
  check and the link / reference checks; both must report clean. Spot-check that one mirror leaf resolves
  to the canonical file. A failure means the sync did not build what the runtimes load — fix the sync and
  run it again, never hand-patch the mirror.
- **Leave the plugin / package manifest untouched.** Conventional skill directories auto-load with no
  manifest entry, and adding one can break loading. Registering the skill is the skill index's job, not
  the manifest's.
- **Place the skill in the project's skill index by the index's own convention.** The convention varies by
  the skill's kind — an operational skill may get an index row, a meta / authoring skill a prose mention,
  and some skills no entry at all. Follow the rule for this kind, do not add a row by default, and confirm
  the entry you added is present.
- **Add a tool-permission entry only for zero-prompt preapproval.** It is a permission gate, not a
  discoverability gate — the skill loads and appears without it. Omit it and accept a first-use tool
  prompt, or add it only to silence that prompt.
- **Prove each target runtime loads it cold.** Start the runtime with a clean context and load the skill
  through its normal entry; confirm it is found without help from the authoring session. Structural checks
  are necessary but not sufficient.
- **Run the fresh-agent proof in every target runtime.** Give an agent no prior context and confirm it can
  find the skill and perform the capability from the Intro + Procedure alone. A skill that passes every
  guard but that a fresh agent cannot follow is not done.

P10 passes only when the sync, the structural guards, the mirror spot-check, the cold load, and the
fresh-agent proof all pass.

---

## References

No borrowed claims — this skill owns its content: the standard form, its sections, and the authoring
procedure. It borrows no project-specific fact, so there is no external owner to register. A skill you
write with it that DOES borrow facts fills this section per P9 — one owner per borrowed claim.
