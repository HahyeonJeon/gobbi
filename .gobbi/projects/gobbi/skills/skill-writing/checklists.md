# Skill-Writing — Conformance Checklist

Sub-document of the `skill-writing` skill. Run it after P9, before P10 wiring, to confirm the finished
skill conforms to the standard form. Each line is answerable yes/no against the artifact with no judgment; a
single NO returns the skill to the step that owns it. The skill ships only when every line is YES.

## Frame (P1–P3)

- **P1** — the actor and load mode were set by their rules (not guessed); the outcome is one end state;
  the non-goals fence it; the description states the capability and its trigger.
- **P2** — two or three analogous skills were read; every borrowed claim's owner mechanism was read;
  conflicting conventions were resolved; the user locked the direction.
- **P3** — the claim-owner ledger is complete; the affected-file map is complete (every surface edited or
  marked N/A with a reason); the altitude decision is made; the six-section skeleton was laid.

## Sections (P4–P9)

- **P4** — `name` equals the directory; the three required keys appear in order; the description grammar
  matches the load mode; `allowed-tools` matches the write / no-write answer; no field from another schema
  appears.
- **P5** — the H1 is the skill name in Title Case; the Intro is at most two short paragraphs (what + when);
  it names no file, holds no link, and carries no WHY-clause.
- **P6** — three to six blockquote-plus-WHY Principles; none carries an imperative; each pairs to at least
  one Rule.
- **P7** — every Rule sits in a sub-group and opens MUST / ALWAYS or NEVER; each is self-contained
  (rationale present; every NEVER carries a Fix) and gradable yes/no on a finished skill; no Rule repeats a
  Procedure step verbatim.
- **P8** — the Procedure names another file only as an action; the write-only sub-sections and child-doc
  maps appear iff P3 required them; no step copies an owner's content.
- **P9** — every borrowed fact has exactly one § References owner (or the one-line empty case applies);
  § References states no new fact; links prefer sibling / same-directory over a fragile `../` climb.

## Whole skill

- The six sections are present, in order: Frontmatter → Intro → Principles → Rules → Procedure → References.
- The skill is one coherent, cold-load-sufficient capability — a fresh agent can perform it from the Intro
  and Procedure alone (proven empirically at the P10 cold-load).

Only when every line is YES does the skill move to P10 wiring.
