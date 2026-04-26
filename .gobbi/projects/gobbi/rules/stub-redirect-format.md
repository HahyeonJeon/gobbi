# Stub-redirect format for superseded docs

When a documentation file is superseded by another and the user chooses **stub redirect** (preserve URL, retain inbound links) over **delete**, follow this format. Establishes a consistent pattern across the project so readers arriving from old links know where to go and authors don't reinvent the format per pass.

---

## When to apply

- A documentation file's content has been moved or absorbed into another file.
- Inbound links to the original file should keep resolving (especially if the file has > 5 incoming links from elsewhere in the codebase).
- The user has explicitly chosen "stub redirect" over deletion.

When to delete instead: the file has zero incoming links (verify with `rg -n "<filename>" --type md`), the original was a placeholder, OR retention has no historical-context value.

---

## Two template variants

Pick based on whether the original doc had H2 sections.

### Variant A — Mapping table (when source doc HAS H2 sections)

Use when readers may have linked or remembered specific sections. Map each H2 in the original to its new location.

Required structure:
1. Title with " — superseded" suffix
2. Banner blockquote stating the supersession + date + retiring wave
3. One-paragraph orientation referencing the new file(s)
4. `## Where to find what was here` H2
5. Table mapping old sections → new locations with clickable `[label](path#anchor)` markdown links

Length cap: 25 lines.

### Variant B — Narrative-only (when source doc has NO H2 sections)

Use for short docs that were single-narrative. Do NOT invent fake mapping rows.

Required structure:
1. Title with " — superseded" suffix
2. Banner blockquote
3. One-paragraph narrative redirect with clickable section links

Length cap: 10 lines.

---

## Required rules

- **Title stability**: keep the original `# {Title}` heading recognizable; add " — superseded" suffix only. Inbound links rendered with the title text still produce sensible anchor text.
- **Clickable markdown links throughout**: never use `§ N` prose notation. Use `[label](path#anchor)` form so readers can click. Brace-expansion paths like `{README,scenarios,checklist,review}.md` are NOT markdown links — write 4 explicit links instead.
- **Anchor verification before commit**: every link target with `#anchor` must resolve to an existing `## ` heading in the target file. Verify by running `grep -nE '^## ' <target-file>` and matching exact heading text against GitHub's slug rules (lowercase, spaces → `-`, periods/punctuation stripped, em-dash and en-dash dropped).
- **Date the supersession**: include the date and the retiring wave/PR identifier so future readers know when the redirect was set up.
- **Forward-only**: stubs point AT the new doc; never point in both directions or duplicate content.
- **No frontmatter**: the project uses plain markdown. Hugo/MkDocs/Docusaurus frontmatter syntax is forbidden.
- **No HTML anchor injection**: `<a id="..."></a>` tags violate `_claude/SKILL.md` anti-pattern guidance and proliferate inconsistently across renderers.

---

## Section anchor stability

When the target file has numbered section headings (`## 1. The 6-step workflow`, `## 5. JIT prompt footer pattern`), the section number anchors the position even if the title evolves. Prefer numbered anchors for long-term stability.

When section IDs are likely to change in future waves, either (a) use the leaf-most stable anchor or (b) include a footer note in the stub: *"Section pointers reference {target} as of {date}. Future waves may reorganize the target — re-resolve from the current TOC if a pointer fails."*

---

## Origin

Wave A.2 (PR #151) established this format when reducing `deterministic-orchestration.md` and `just-in-time-prompt-injection.md` to stubs pointing at `orchestration/README.md`. Variant A used for the former (4 H2 sections to map); Variant B for the latter (zero H2 sections — narrative original). The `_orchestration/ARCHIVED.md` precedent (lines 1-7 banner, 73-85 mapping table) inspired the banner+table pattern.

---

## Related

See `_claude/SKILL.md` for the broader docs writing standard. See `docs-cleanup-parallelism.md` for the rule governing single vs split-agent docs cleanups (often the context that triggers stub-redirect work).
