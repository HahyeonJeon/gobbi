---
type: mistakes
skill: skill-writing
description: "Recorded traps for skill-writing — load before doing skill-writing work"
updated: 2026-07-19
---

# Skill-Writing — Mistakes

> Load before any skill-writing work. Each `## ` section is one active trap; `## Archived` holds superseded ones.

## Planning Asserted Skill Without Verifying

`priority: high` · `domain: process` · `added: 2026-06-13` · `status: active` · `tags: [process, planning, verification]`

**What happened** — During an iter2 REVISE, the planning leader performed a "full re-audit" of required skills to fix a finding (a task missing a required skill). The audit added `claude` to several tasks on the assumption that a `claude` authoring-standard skill existed. In fact the `skills/claude` skill does not exist — it is a known dangling reference. The leader asserted the skill assignment without running `test -e` / `test -f` on each referenced path. The finding was dual-corroborated: the Codex evaluator independently ran `test -e` on three candidate paths and confirmed all absent.
**Why it happens** — The planning leader treated the required-skills audit as a cross-reference exercise (does the skill conceptually fit the task?) rather than a verification exercise (does the skill file exist at the declared path?). The sibling verify-before-assert mistake was even a required-mistake input to this very planning loop — yet the same class of error recurred during the fix for a different cluster. The irony: the mistake was loaded and still repeated. Loading the mistake doc is insufficient; the verification discipline must be explicitly invoked at the point of making an existence claim.
**How to detect** — A planning artifact lists a required skill that is referenced by name but not verified to exist on disk; the planning loop's required-mistakes include the verify-before-assert trap but the leader did not run `test -f` on skill paths during the required-skills section; the Execution manager attempts to inject a Load Directives block with a path that resolves to nothing.
**Correct approach** — Before finalizing any required-skill list in a planning draft, run `test -f <skill-path>` (or `test -e`) on each skill path from the worktree root. The skill path is `.gobbi/projects/gobbi/skills/{skill-name}/SKILL.md` — the single canonical skill root for both Claude Code and Codex. A required skill that fails the existence test must be removed or substituted with one that exists. "Full re-audit" without file-existence verification is not a re-audit.

## Claude Skills Mirror Is Symlink Not Copy

`priority: high` · `domain: docs-sync` · `added: 2026-06-25` · `status: active` · `tags: [docs-sync, links]`

**What happened** — Three Ideation design iterations plus the first Planning draft all modeled `.claude/skills/{skill}` as a byte-identical COPY of the canonical `.gobbi/projects/gobbi/skills/{skill}` — prescribing "edit BOTH trees; verify `diff -q` parity" on every skill change. The model was wrong, and the dual-system EVALUATION caught it before it shipped.
**Why it happens** — Tool-verified, the `.claude/skills/*` entries are git SYMLINKS, not copies: `git ls-files -s` reports mode `120000` (symlink), not `100644`; `readlink` resolves to the same inode as the canonical file. Editing the canonical file updates the mirror path automatically. The byte-copy assumption produces three concrete defects: (1) "edit both" is redundant — a second find-replace on the mirror fails (the change is already there); (2) a `diff -q canonical mirror` guard is VACUOUS — same inode can never differ — false assurance; (3) a full-file `Write` to a mirror path converts the symlink to a regular file (mode `120000` → `100644`), BREAKING the mirror and causing the exact drift the model tried to prevent.
**How to detect** — Any plan or design that says "edit both the canonical and the `.claude` mirror" or "verify byte-identical parity between trees" is built on the wrong model. Before assuming copies, check `git ls-files -s <mirror-path>` for mode `120000`.
**Correct approach** — Edit the CANONICAL `.gobbi/projects/gobbi/skills/...` path ONLY — the mirror symlink reflects it for free. Use `Edit` (in-place), never `Write` (full-replace), and never target the mirror symlink path. Verification is: the canonical edit landed AND the mirror symlink is still intact (`git ls-files -s` still mode `120000`) — NOT a content `diff`.

### Related
- [`../claude-plugin/SKILL.md`](../claude-plugin/SKILL.md) — the `.claude` mirror wiring this trap spans (claude-plugin owns the plugin/symlink layout)

## Scrub Stack Idioms When Adapting To General Doc

`priority: high` · `domain: docs-sync` · `added: 2026-06-24` · `status: active` · `tags: [docs-sync, verification]`

**What happened** — Authoring a language-agnostic `coding` skill child-doc by mirroring gobbi's own `execution` skill child-doc (used as the shape reference) dragged in two kinds of contamination from the source: (1) a JS/TS test idiom — `test.skip` — leaked into a skill whose entire reason to exist is language-neutrality; (2) a present-tense runtime claim — "Loaded alongside execution evaluation" — that asserts a load-both wiring deferred per the scope contract. Both share one root: copying a project-internal doc for its shape inherits its stack-specific tokens and its as-wired-today claims.
**Why it happens** — The executor used the internal doc as a shape template and carried prose across without scrubbing it against the new doc's different contract (language-agnostic; wiring-deferred). A shape reference is for STRUCTURE, not for verbatim phrasing.
**How to detect** — You are authoring a general, reusable, or cross-project doc by mirroring a project-internal one. The source legitimately names a specific language, tool, or framework, or describes the system as it is wired today. Any of those tokens copied across is a leak.
**Correct approach** — When a shape reference is a project-internal doc and the target is general: take the STRUCTURE only, and scrub every carried sentence for (a) language, tool, or framework-specific idioms such as `test.skip`, naming conventions, or named libraries — restate as the language-agnostic property; (b) present-tense wiring or role claims the target's scope defers — restate as intent ("intended to complement…", "wiring deferred"). Grep the finished general doc for the source's stack tokens before declaring done.
**User feedback** — The dual-system evaluators surfaced the contamination. The manager recognized the root as shape-reference overreach — the executor used an internal doc for structure AND for phrasing.

## Planning Leader Asserted File Type Without Verifying

`priority: high` · `domain: process` · `added: 2026-06-07` · `status: active` · `tags: [process, planning, verification]`

**What happened** — A planning leader stated in cross-cutting plan notes that target files are "real files (NOT symlinks)" without running `test -L` or `ls -l` to verify. The assertion was wrong — the files ARE symlinks, and an executor using the stated paths would fail (the Edit tool refuses symlink paths). The manager caught the error during plan verification and patched every executor brief before dispatch.
**Why it happens** — The same citation/verification-fidelity failure as the sibling verify-before-assert trap: a file-property claim stated from assumption, not from a live check. The leader reasoned from prior knowledge rather than verifying against the actual file system.
**How to detect** — Any "X is/isn't a symlink / real file / exists" claim in a plan or brief with no cited verification command. If the claim says "NOT symlinks" or "real file" without a supporting `ls -l` / `find`, treat it as unverified.
**Correct approach** — Before asserting a target file's type, existence, or path in a plan or brief: run `test -L <path>` or `ls -l <path>` to check symlink status; run `find . -name <filename>` repo-wide to confirm the canonical location; cite the verification command in the plan note. The planning brief's assertion is the executor's spec — an unverified file-type claim becomes the executor's incorrect starting assumption.

### Related
- [[planning-asserted-skill-without-verifying]] — intra-file sibling: the same verify-before-assert family

## Doc Rewrite Reintroduces Retired Vocab

`priority: medium` · `domain: docs-sync` · `added: 2026-06-27` · `status: active` · `tags: [docs-sync, vocabulary]`

**What happened** — Rewriting docs to the new hybrid mistakes model, the fresh prose used the phrase "project / memory tier" — but `project / memory` is a RETIRED-vocab bigram (the `check-residual-vocab.sh` VOCAB list covers `memorize*` — the old pipeline label — `session / memory`, and `project / memory`). The guard plus the dual-system evaluation caught it after the fact, forcing a reword pass over already-written prose.
**Why it happens** — When authoring NEW prose, the writer reaches for natural phrasing without checking the project's retired-vocab list. New text feels exempt from a guard whose name ("residual") implies it only scans leftover OLD content — so the writer never runs the guard against prose they just wrote.
**How to detect** — Any doc rewrite or fresh authoring can introduce a retired bigram in the NEW prose; "residual-vocab" applies to new prose too, not only to leftover old content. The trigger: you just wrote or reworded a doc that names a renamed concept.
**Correct approach** — Run `check-residual-vocab.sh` on the changed files AFTER a doc rewrite, not only against old content. Treat the guard's VOCAB list as forbidden in new prose; on a hit, reword it (e.g. "project / memory tier" → "the project `mistakes/` tier"). Make the guard part of the rewrite's own verification, not a separate later cleanup.

### Related
- [[scrub-stack-idioms-when-adapting-to-general-doc]] — sibling docs-sync authoring-contamination trap (source tokens leak into new prose)

## Child-Doc Extraction Breaks Relative Links And Self-Anchors

`priority: high` · `domain: docs-sync` · `added: 2026-07-08` · `status: active` · `tags: [docs-sync, links, refactor]`

**What happened** — Splitting `skills/orchestration/SKILL.md`'s heavy sections into four `skills/orchestration/workflow/*.md` child docs (one directory level deeper) carried each extracted section's relative links and self-anchors across unchanged. A link target such as `../X` in the parent resolves against `skills/orchestration/`'s parent; the SAME link text copied into a child doc under `skills/orchestration/workflow/` resolves one level short instead. Self-anchors inside the extracted text needed repointing per whether their target heading traveled with the extraction or stayed behind in the parent.
**Why it happens** — Extraction is copy-then-relocate, and every relative reference inside the copied text is anchored to the ORIGINAL file's directory depth, not the new one. Nothing about the copy operation itself signals that the depth changed, so a straight copy silently ships broken links.
**How to detect** — Any doc-split or section-extraction plan that moves prose into a file at a deeper directory level without an explicit link-depth-adjustment step. Run the markdown-link guard scoped to the new child doc specifically — a broken relative link surfaces immediately; checking only the parent doc misses it.
**Correct approach** — On any section extraction one directory level deeper: (1) add one `../` segment to every relative link inside the extracted text; (2) repoint any link that now targets a sibling file at the new relative path (a reference like `skills/orchestration/workflow/state-machine.md` becomes bare `state-machine.md` once inside `skills/orchestration/workflow/`); (3) repoint every self-anchor per whether its target heading traveled with the extraction; (4) run the link guard against the new child doc before calling the split done.

## References Repo-Root Links Break Through The Mirror

`priority: high` · `domain: docs-sync` · `added: 2026-07-08` · `status: active` · `tags: [docs-sync, links]`

**What happened** — A `## References` link with a target of the form `../../../../../scripts/…` (a repo-root-anchored relative climb) resolved correctly from the canonical `SKILL.md` path but broke when the same file was read through the `.claude`/`.agents` runtime mirror symlink — the mirror sits at a different directory depth relative to the repo root, so the same fixed number of `../` segments lands somewhere else through it.
**Why it happens** — The canonical skill file and its mirror symlink are the SAME file by inode, but they are reached via two different directory depths (`.gobbi/projects/{project}/skills/{skill}/SKILL.md` vs the mirror path). A relative link that climbs a fixed `../` count to reach a repo-root path is depth-relative, so it resolves correctly from only ONE of the two access points, never both at once.
**How to detect** — A References (or similar) section containing a markdown link with three or more `../` segments climbing toward the repo root. Resolve the link from BOTH the canonical path and the `.claude`/`.agents` mirror path — if either fails, the link is depth-unstable.
**Correct approach** — Keep a skill's References section to two link shapes that stay depth-stable across the mirror: sibling-skill links (`../{other-skill}/SKILL.md` — same nesting depth on both sides) and same-directory links (`mistakes.md`). Reference a repo-root script (e.g. a guard under `scripts/`) as a Procedure code-span load-action — a bash command the reader runs — rather than as a markdown link, since a code span has no relative-path resolution to break.

### Related
- [[child-doc-extraction-breaks-relative-links-and-self-anchors]] — sibling extraction-time link trap from the same session

## Skill Core Principles Must Be Universal And Self-Standing

`priority: high` · `domain: docs-sync` · `added: 2026-07-11` · `status: active` · `tags: [docs-sync, process]`

**What happened** — Redrafting a skill's `## Core Principles`, the author first baked tool/system-specific machinery INTO the principle statements (a checklist name, the load-directive tier order, product names, internal file names); then, on the next draft, ended each principle with a `See § <body-section>` citation. The user rejected both: the principles read as internal-implementation notes, and a principle that ends in "See §" makes its meaning depend on another doc. Separately, removing a NAMED Core Principle left a stale present-tense reference to it in the skill's own `mistakes.md` companion — a Principle-9 blast-radius miss caught only at evaluation.
**Why it happens** — A skill's body already holds the mechanics, so it is tempting to name them in the principle for precision and to link down "for detail." But the Core Principles are the general/universal layer: they should state the durable idea completely, in tool-agnostic words, and stand on their own. And a skill's `mistakes.md` and other companions reference the principle set, so removing or renaming a principle silently breaks those references.
**How to detect** — A principle STATEMENT contains a product/file/mechanism noun (a checklist name, a tier label, a runtime name) instead of a universal statement; OR a principle ends in a `See §` / `(§ …)` cross-reference; OR, after removing a named principle, a grep of the skill's `mistakes.md` + companion docs for the removed principle's name/phrase finds a live present-tense reference.
**Correct approach** — State each Core Principle universally and completely — no tool/system jargon, no dependency on a body section to carry its meaning; let the body independently document the tool-specific application (no link needed). When removing or renaming a named principle, sweep the skill's `mistakes.md` and every doc that cited it (Principle-9 blast radius) in the SAME edit, re-pointing each reference to the surviving home.

## Quantitative Compaction Before Necessity

`priority: high` · `domain: docs-sync` · `added: 2026-07-15` · `status: active` · `tags: [docs-sync, process]`

**What happened** — A documentation-ownership redesign proposed word-count and percentage-reduction targets before classifying claims by necessity and owner. The metric would have governed deletion before the capability contract was known.
**Why it happens** — “Make it compact” is translated into a numerical proxy because counts are easy to measure. The proxy can reward deletion or relocation without proving that a cold-loading agent retains every necessary capability.
**How to detect** — A skill or documentation redesign has no complete claim-owner ledger yet, but a word, line, or percentage target already appears as an acceptance gate.
**Correct approach** — Build the claim-owner and necessity inventory first. Keep required content, remove content with no necessary role, and move owner-specific detail without duplication. Use size measurements only as descriptive evidence after the design is correct unless the user explicitly requests a quantitative limit.

## Softening Can Narrow Scope Like A Merge

`priority: high` · `domain: docs-sync` · `added: 2026-07-14` · `status: active` · `tags: [docs-sync, verification]`

**What happened** — Compacting a skill doc, a pre-edit hard rule ("NEVER hide expensive or
failure-prone work behind a `property`, `__repr__`, equality, hashing, or another special method") was
softened down to a short default that mentioned only "cheap properties / an expensive method" —
dropping the special-method BREADTH (`__repr__`/`__eq__`/`__hash__`/arithmetic dunders) and the
caller-expectation hazard the hard rule named.
**Why it happens** — The union-scope discipline (preserve every source condition when merging or
consolidating) was applied to MERGES of hard rules but not to hard-to-SOFT conversions. A soften feels
like "just relaxing strictness," so scope-preservation isn't checked — but softening rewrites the
sentence and can silently drop a condition exactly like a merge does.
**How to detect** — Any hard MUST/NEVER to prefer/consider/default-to conversion. Treat every such
conversion as a union-scope checkpoint: does the softened sentence still name every subject and hazard
the hard rule named?
**Correct approach** — When softening a rule, preserve its full union scope (every named subject, the
hazard, and the fix) — only the STRICTNESS relaxes (NEVER to prefer), never the coverage. Check
softened items for dropped conditions with the same discipline used for merges.

### Related
- [[execution-evaluator-union-check-must-cover-softened-items]] (`skills/evaluation/mistakes.md`) — the
  matching evaluator-side gap: a "no hard hazard dropped" pass must also diff the softened set

## Production Mode Is Not Skill Frontmatter

`priority: high` · `domain: docs-sync` · `added: 2026-07-16` · `status: active` · `tags: [docs-sync, schema]`

**What happened** — The manager instructed a Task-1 executor to stamp `production_mode: dual` in the
durable `.gobbi/projects/gobbi/skills/scenario/SKILL.md` frontmatter. The executor flagged it — it is
the sole conformance NO.
**Why it happens** — `production_mode` is a RECORD / loop-outputs provenance key, NOT skill
frontmatter. The skill-writing contract has four required keys
(`name`/`description`/`allowed-tools`/`skill-type`) plus P2's named optional allowlist; it rejects fields
owned by another schema. `production.md` stamps `production_mode` in an artifact's frontmatter ONLY for
the DEGRADED `claude-only` case (a durable degraded label). A genuinely dual-produced skill carries NO
`production_mode` — verified against python/startup/coding/research SKILL.md. Dual-production provenance
already lives in the session record (the loop's own working and outputs directories), not in the skill's
frontmatter.
**How to detect** — Any instinct to stamp workflow/session provenance (`production_mode`, `iter`,
`session`, `status`, or plain `type`) into a DURABLE skill's frontmatter. The sanctioned semantic
classifier is the exact field `skill-type`; plain `type` remains foreign. Skill frontmatter ≠
session-artifact frontmatter.
**Correct approach** — Do NOT stamp `production_mode` (or any session/RECORD schema key) in a skill's
frontmatter, even for dual production. Only the degraded claude-only artifact case carries a frontmatter
label, per production.md, and that is a session artifact, not a shipped skill. Stamp exactly one
`skill-type: preference|tool|operation` after `allowed-tools`, and let RECORD own provenance.

## Verify Owner Lifecycle Before Redesigning A Dependent Artifact

`priority: high` · `domain: docs-sync` · `added: 2026-07-19` · `status: active` · `tags: [docs-sync, refactor, verification]`

**What happened** — A skill-writing redesign initially treated the now-removed project-skill template as a
live authoring surface to reshape around the new three-type contract. The
user clarified that the template's only owner, Preparation, was being removed in a concurrent session and
that the correct terminal action was deletion after that removal landed. Redesigning it first would have
spent work on an artifact whose owning workflow was already scheduled to disappear.
**Why it happens** — A dependency is found during the blast-radius sweep and is assumed to be durable because
it is still present and referenced in the current worktree. The sweep checks present consumers but not the
owner's approved lifecycle or concurrent destination, so a terminal artifact is mistaken for a migration
target.
**How to detect** — Before redesigning a dependent template, child doc, helper, or compatibility surface, the
plan names its current owner and consumers but does not state whether that owner is staying, moving, merging,
or being removed. A concurrent branch or user decision already changes the owner's lifecycle, yet the
dependent artifact still has a rewrite task.
**Correct approach** — Verify the owner's approved lifecycle and destination before choosing CRUD for each
dependent artifact. If the owner is being removed, keep the dependency unchanged while it is still consumed,
then delete it only after the removal lands and a fresh reference sweep proves no live consumer remains. Do
not redesign a terminal dependency merely because it still exists in the current checkout.
