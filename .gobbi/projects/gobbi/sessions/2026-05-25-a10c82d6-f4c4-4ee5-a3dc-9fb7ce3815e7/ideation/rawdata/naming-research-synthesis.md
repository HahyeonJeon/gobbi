# Naming Research Synthesis (Ideation rawdata)

Two parallel research assistants (IA frameworks + slug conventions). Full reports in transcript. Sources: Diátaxis, Johnny.Decimal, PARA, Zettelkasten, ADR/MADR, RFC/PEP, Conventional Commits, Google/Microsoft style guides, Harvard/US-National-Archives data-management, Jekyll/Hugo.

## Convergent portable principles

1. **Separate stable address from mutable description.** Opaque/stable identifier never renames; human title evolves. (Zettelkasten timestamp-ID, ADR NNNN, RFC serial, JD AC.ID.)
2. **Category lives in a facet, not in the slug content.** In gobbi the **directory already encodes the type facet** (decisions/, mistakes/, …) → do NOT repeat the type/dir in the filename.
3. **Type ≠ status.** Status/lifecycle goes in frontmatter, never the filename — else lifecycle transitions force renames.
4. **Never reuse or rename a permanent identifier.** Supersede via `supersedes:` frontmatter + new file; keep the old.
5. **One record = one concept (atomicity).** Multi-topic bundle files defeat naming and linking. Kills loop-phase decision bundles.
6. **Actionability is orthogonal to type** (PARA active/stable/terminal) → already handled by archive/ move-on-terminal.
7. **Keep categorization shallow** (~10 max; JD "no more than 10", Diátaxis 7-item ToC).
8. **Slug = stable concept, 3–5 words, ≤~35 chars, kebab-case, lowercase, hyphens only.**
9. **Length proportional to sibling count, inversely to path specificity** — narrow dir → shorter slug.
10. **Date-prefix only intrinsically time-indexed content;** evergreen content stays bare-slug, date in frontmatter.

## Slug anti-pattern blocklist (forbidden in slugs)
- loop/phase prefix (`ideation-`, `planning-`)
- finding-ID prefix (`f-aes-01-`)
- sequential/positional prefix (`item-1-2-`, `task-04-`, `step-3-`)
- restating the parent directory (`gobbi-install-…` inside features/gobbi-install/)
- status words (`final-`, `locked-`, `approved-`)
- version numbers (`v2-`, `schema-v5-`)
- date embedded in evergreen slug
- wording excerpts of a finding/discussion
- person/author names
- opaque auto-IDs with no human component
- bundled-scope slug (one file, many unrelated topics)
- uninformative generics (`misc-`, `common-`, `helper-`, `notes.md`)

## Implication for gobbi
Directory-as-category + disciplined concept slug solves "too specific/too ambiguous" without adding a prefix vocabulary. Temporal split: date-prefix {notes, reviews, reports, changelogs, decisions, plans, archive-entries}; bare-slug {features, mistakes, rules, learnings, design, references, backlogs}. Atomicity + the anti-pattern blocklist are the load-bearing fixes.
