---
type: mistakes
skill: memory
description: "Recorded traps for memory — load before doing memory work"
updated: 2026-06-27
---

# Memory — Mistakes

> Load before any memory work. Each `## ` section is one active trap; `## Archived` holds superseded ones.

## File Move Needs Link Resolution Check

`priority: high` · `domain: process` · `added: 2026-06-13` · `status: active` · `tags: [process, refactor, verification, links]`

**What happened** — During a repoint-cross-references task (after the memorization → memory/record skill split), the executor ran a token-residual grep to verify no stale `memorization` path refs remained. The grep returned 0 files — a green signal. Batch-1 evaluation then caught 36 broken cross-tier links. The token-grep was correct: those links did not contain the renamed token. But the link targets had moved, and the relative paths in the linking files now pointed at non-existent locations.
**Why it happens** — A file-MOVE refactor changes the destination of existing links. Links that reference the moved file via a path that does NOT contain the renamed token are invisible to a renamed-token grep: the grep checks for the old token in the link text, not whether the link resolves. A link like `../record/SKILL.md` correctly omits the old token yet still resolves to nothing if the target was created at a different relative depth, or not yet. The mistaken assumption: a residual-token grep that returns 0 is sufficient evidence a file-move left no broken links.
**How to detect** — The trigger: a planning task says "move file X to new location Y" or "rename directory A to B", AND the verify step only includes a grep for the old token/path, without any link-resolution step. Correct verify: run `check-markdown-links.sh` (or equivalent) over the affected tree, confirming zero NEW broken links vs the pre-move baseline.
**Correct approach** — Any refactor that moves or renames files MUST run a link-resolution check — one that actually follows the relative path from each linking file's location and confirms the target exists — in addition to (not instead of) a token-residual grep. The `check-markdown-links.sh` guard implements this: it extracts every inline and reference markdown link, resolves the relative path from the file's directory, and reports any that do not resolve. Run it as part of the Verify step for any task that moves or renames files.

## Label Rename Missed In Fence And Cross Doc

`priority: high` · `domain: docs-sync` · `added: 2026-06-19` · `status: active` · `tags: [process, docs-sync, rename-sweep, verification]`

**What happened** — A bulk label rename across the memory templates (`Why it matters` → `Reason`, `How to apply` → `How`) was applied to each template's own top-level section headings, but MISSED the same labels where they appear as body-field headings inside a fenced ```markdown example block. It also missed the same labels in two downstream surfaces: the `rules.md` §4.2 per-type section contract, and the `ideation` skill's prose. The Verify grep gate caught all three classes of miss before the work shipped.
**Why it happens** — "Rename the section labels" was read as "rename the document's own H2 headings." Two occurrence classes fell outside that reading. (1) In-fence example headings: a template's fenced example block contains the same labels as `##`-prefixed CONTENT lines, not the document's own structure; an edit pass that targets the doc's real headings skips them because they look like example text. (2) Cross-doc references: the label also lived in another doc's contract table and a third doc's prose; a per-template edit pass never visits those files.
**How to detect** — A rename brief that says only "rename the sections" / "rename the headings" while the same label also appears inside fenced example blocks and in other docs' contracts or prose. The trigger signal: the old label is still grep-findable across `.md` files after the "rename" is reported done.
**Correct approach** — A label rename MUST enumerate ALL occurrence classes up front, before editing: (1) top-level headings — the doc's own `##` section headings; (2) in-fence example headings — the same labels appearing as content inside fenced example blocks; (3) cross-doc anchor links whose anchor is derived from the renamed heading; (4) cross-doc prose / contract mentions. Then a repo-wide grep verify gate confirms ZERO occurrences of every old label remain across all `.md` files — not just the renamed template.

### Related
- [[plan-rename-must-enumerate-all-ref-classes]] — the broader rename trap (enumerate every reference class); this is its label-specific, inside-fence + cross-doc variant

## Plan Rename Must Enumerate All Ref Classes

`priority: high` · `domain: process` · `added: 2026-06-13` · `status: active` · `tags: [process, planning, vocabulary-sweep]`

**What happened** — The planning decomposition for the memorization → memory/record rename scoped the sweep to cover path references, sub-phase/storage prose, and Glossary / delegation hard-gate entries. It did NOT enumerate skill-NAME references, agent-wrapper capability descriptions, plugin inventory rows, or runtime-routing labels. Batch-2 evaluation surfaced five stale references the plan never scoped: a skill-name load in `assistant.toml`, a capability description in a runtime script, a plugin inventory entry, a Gobbi value-feature row, and a routing-label entry. These required a remediation sweep.
**Why it happens** — When planning a rename, the planner's natural reference classes are the file's path in link text and the concept's name in running prose. Less obvious classes — skill names in `required-skills` arrays, capability descriptions in wrapper prompts, inventory/list rows in plugin manifests, and routing labels in scripts or configuration — carry the old name without appearing as a path reference or a long-form prose sentence. A grep for one old path or prose phrase misses these structured-data contexts. The mistaken assumption: the co-touch enumeration is complete once it covers path refs in link text and concept-name occurrences in prose.
**How to detect** — The trigger: a planning task's `what` / `verifies` mention only path refs and prose without explicit mention of structured-data contexts (YAML arrays, JSON fields, wrapper prompts, runtime script/config strings). Correct planning: the task scope lists all reference classes and the verify step gives each retired path and phrase family its own scoped search.
**Correct approach** — Before a rename, enumerate every reference class: path refs; prose refs; skill-name and load-directive refs; inventories and manifests; wrapper descriptions; runtime script/config labels; in-fence examples; and cross-document anchors. Map each class to an explicit post-edit verification. Run the root-owned Markdown-link validator for links, the relevant owner validator for changed structured files, and exhaustive scoped `rg` searches for every retired path, label, and synonymous phrase. A green check is credible only when the searched patterns and scopes are stated with the result.

## Core Principle Framed As Action Not Documentation

`priority: high` · `domain: docs-sync` · `added: 2026-06-20` · `status: active` · `tags: [docs-sync, memory, process]`

**What happened** — When adding a `## Core principle` to each memory-template, the principles were first authored as principles for the ACTIVITY the type represents — not for documenting that activity. Examples: a `plans` principle of "Decompose the approach into ordered, verifiable sub-tasks" is how to PLAN, not how to write a plan doc; a `reviews` principle of "Assess an artifact across perspectives, then reach a verdict" is how to REVIEW, not how to write a review doc. The user corrected this: a memory-type's core principle must govern the DOCUMENTATION of that type, not the underlying action. It took three passes to land.
**Why it happens** — Asked to add a "principle" to a documentation template, the natural reach is the discipline of the underlying activity (planning, reviewing, deciding) — not the discipline of PRODUCING the document. The two are easy to conflate because the doc is ABOUT that activity, so the activity's discipline feels like the obvious principle to state.
**How to detect** — Two trigger signals, either one means the principle is action-framed and needs reframing. (1) The principle's verb is an ACTIVITY verb — decompose / assess / decide / review / plan — rather than a producing-the-doc verb (Record / Write / Capture / Keep / State). (2) The principle would read IDENTICALLY in a "how to DO X" guide and a "how to DOCUMENT X" template. If you could paste it into either with no change, it is about the action, not the document.
**Correct approach** — A documentation principle states what the `{type}` doc must CAPTURE and how to write it so a future reader is served. The directive verb names producing-the-doc — Record / Write / Capture / Keep / State [what the doc holds] — never the activity verb (Decompose / Assess / Decide). Derive the principle from two things: (1) the doc's READER — who opens this doc later, and what they need from it; (2) the FAILURE MODE of a bad doc of that type — what is lost when it is written poorly. State the principle so it serves the reader and forecloses that failure mode.
**User feedback** — The principle on each template must govern the documentation of the type, not the activity the type is about. A `plans` core principle states what a plan doc must capture so a future reader is served — not how to do the planning.

### Related
- [[label-rename-missed-in-fence-and-cross-doc]] — a sibling docs-sync trap from the same template-redesign session
