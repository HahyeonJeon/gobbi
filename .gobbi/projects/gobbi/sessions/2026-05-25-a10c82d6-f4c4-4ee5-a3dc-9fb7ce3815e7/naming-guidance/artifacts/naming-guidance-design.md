# Naming-Guidance Improvement — Design Spec

**Session:** a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7
**Phase:** planning (design artifact for an executor)
**Status:** design only — the executor implements the edits + renames below.

---

## 0. Problem framing (the witness)

USER FEEDBACK: memory-file names still encode **positions / sequence indices / cryptic internal
references** that mean nothing to a reader with zero session context:

- `task-01`, `tasks-07-08`, `d-1`, `d-3-2` — positional / sequence index.
- `row-5-5`, `decimal-row-numbering-55`, `1-3`, `1-2`, `4-1`, `t1g`, `t1j` — cryptic internal
  references (table row coordinates, checkpoint IDs, task codes from a session that is now gone).
- `main` — uninformative generic (a plan named after a git branch / default-file convention).

The W5 soften (rules.md §1.3) correctly removed the **mechanical slug blocklist** — it false-flagged
legitimate content words (`-decisions`, `-discussion`, `-references`, date prefixes on chronological
types). But the soften left §1.3 as a *negative-only smell list* with **no positive statement of what
a GOOD name is**. A reader cannot derive "name the subject" from "avoid finding-ID prefixes."

**Goal of this change:** add *positive descriptiveness* guidance — a name should let any reader with
zero session context understand the file's **subject/concept**, chosen the way a careful developer
names things (development-vibe kebab-case naming the concept, not its position in a list). The
anti-patterns stay, but reframed around the real failure (non-descriptive **position / index /
cryptic** tokens), explicitly NOT around content words. No hard regex gate is reintroduced.

**Placement (USER DECISION 1 — HYBRID):**
- **Principle 13** STATES the rule as a concise clause in its existing Iron-Law + rationale shape —
  no big tables in P13.
- The detailed **anti-patterns table + good/bad examples** live in `skills/memorization/rules.md` §1
  (expanding the existing softened §1.3), which P13 references.

---

## 1. The Principle 13 clause (exact proposed text)

P13's Iron Law stays as-is (`NO DOCUMENT WORK WITHOUT A SPEC AND A CRUD PLAN.`) — naming is part of
the Create operation, not a new law. The clause is added as a **new short subsection** inside the
P13 section, inserted **between the Procedure block (step 4 "Then edit…") and the "Delineation from
Principle 8" paragraph** (i.e., after line 371, before line 373 in
`skills/principles/SKILL.md`).

### Exact markdown to insert

```markdown
**Naming is part of the Create operation — name the subject, not its position.** Every file or
directory a CRUD plan creates must carry a name that lets a reader *with zero session context*
understand its **subject** — the concept the file is about. Name the concept in clear,
development-vibe kebab-case (the name a careful developer would choose). A name must NOT encode the
record's **position in a list, its sequence index, or a cryptic internal reference** — `task-01`,
`d-1`, `tasks-07-08`, `row-5-5`, `1-3`, `t1g`, `main` are addresses inside a session that no longer
exists; they are noise to the next reader. This is *positive descriptiveness*, not a regex gate:
content words that describe the subject (`-decisions`, `-rollback`, date prefixes on chronological
types) are encouraged. The anti-patterns table, the smell categories, and concrete good/bad
examples live in `memorization/rules.md` §1.3 — consult it when naming any memory file.
```

**Rationale for placement:** the clause sits at the end of the Procedure (where Create operations
are enumerated) so it reads as "…and when you Create, name it like this." It defers all detail to
rules.md §1.3, keeping P13's body lean per USER DECISION 1.

**Iron Law Index row 13** (line 33) is **unchanged** — the one-liner still summarizes the whole
principle; naming is a facet of it, not a 14th law. The CLAUDE.md Iron Law table is likewise
unchanged (no new row). *This keeps the P13 blast radius to one file.*

---

## 2. The rules.md §1 expansion (exact proposed markdown)

This **replaces** the current §1.3 (`skills/memorization/rules.md` lines 40–58) with an expanded
version: a short **positive core rule**, the reframed **anti-patterns table** (now organized by the
real failure categories), and a new **good-vs-bad examples table** drawn from the real offenders.
The §1.1 / §1.2 subsections and everything below §1.3 stay untouched.

### Exact replacement markdown for §1.3

```markdown
### 1.3 Slug naming preferences (name the subject, not its position)

A slug is a **stable address that names the concept**. The test: *could a reader with zero session
context tell what this file is about from its name alone?* Name it the way a careful developer
names a module — the subject, in clear kebab-case. The patterns below are **smells / preferences**,
not a hard-enforced blocklist (no regex gate). Content-word suffixes (`-decisions`, `-discussion`,
`-references`, `-rollback`) are **encouraged** — they describe the subject. Date prefixes on the
date-prefixed types (§1.2) are meaningful chronology, not a smell. The smell is always a
**non-descriptive position / sequence index / cryptic internal reference** — a token that addresses
the record inside a session (table rows, checkpoint IDs, task codes, list positions) instead of
naming what it is about.

**Anti-patterns — by failure category:**

| Category | Bad example | Why it fails the zero-context reader | Fix (name the subject) |
|---|---|---|---|
| Positional / sequence index | `task-01`, `tasks-07-08`, `d-1`, `d-3-2`, `item-1-2`, `step-2-5` | "task 01 of what plan?" — the number is an address in a vanished session, not a subject | name the work: `worktree-create-row-insertion`, `shared-executor-context-continuity` |
| Cryptic internal reference | `row-5-5`, `decimal-row-numbering-55`, `1-3`, `4-1`, `t1g`, `t1j` | table coordinates / checkpoint IDs / task codes mean nothing without the session's working state | name the topic: `state-init-before-worktree`, `direct-mode-opt-out-doc-home` |
| Uninformative generic | `main`, `misc-`, `common-`, `notes.md`, `helper-` | tells the reader nothing about the subject; "main" is a branch/file convention, not a concept | name the deliverable: `orch-workflow-improvements` |
| Loop / phase prefix (non-descriptive) | `ideation-decisions.md`, `planning-` | the workflow phase is in frontmatter; the prefix adds noise without subject | one file per concept, concept slug |
| Restating the parent dir | `gobbi-install-…` inside `features/gobbi-install/` | the directory already carries the facet (§1.1 rule 1) | drop the prefix |
| Status / version words | `final-`, `locked-`, `approved-`, `v2-`, `schema-v5-` | lifecycle / version belong in frontmatter; a transition would force a rename (§1.1 rules 4–5) | status/version → frontmatter |
| Wording excerpt of a finding | `concern-3-coverage-ownership-cell-text` | quotes the finding instead of naming its subject | name the concept |
| Bundled scope (many topics, one file) | `iter1-user-redirects.md` | violates one-record-one-concept (§3) | split per topic |
| Person / author names · opaque auto-IDs | — | not a subject; not human-readable | omit / add a human component |

**Good vs bad — real before/after (from this project's history):**

| Bad (position/index/cryptic) | Good (names the subject) | What the subject actually is |
|---|---|---|
| `2026-05-24-task-01-row-5-5-worktree-create` | `2026-05-24-worktree-create-config-step` | changelog: shipped worktree-create into the Config step procedure |
| `d-1-worktree-row-5-5` | `worktree-create-before-session-stamp` | design: create worktree before session.json stamps git fields |
| `decimal-row-numbering-55` | `config-table-row-numbering-choice` | checklist: pick integer-renumber vs decimal row in the Config table |
| `2026-05-24-t1g-direct-mode-home-orchestration-skill` | `2026-05-24-direct-mode-opt-out-doc-home` | discussion: where the direct-mode opt-out is documented |
| `reframing-1-3` | `worktree-first-vs-collapsing-strategies` | discussion: worktree-first chosen over two-surface / symlink |
| `2026-05-23-main` | `2026-05-23-orch-workflow-improvements` | plan: the orch/workflow-improvements Execution plan |

The fix is never "delete the date" or "delete a content word" — it is "replace the position /
index / cryptic token with a word that names the subject."
```

**Note for the executor:** the reframed table folds the old §1.3 12-row list into 9 category rows
(the old rows 1, 3, 5, 6, 8, 11, 12 are preserved as categories; the position/index and
cryptic-reference categories are *new and primary*; old rows 9+10 merge into one "person/auto-ID"
row). Do not drop any old smell — verify each old row maps to a category in the new table.

---

## 3. Rename mapping (offenders → subject-named)

Date-prefixed types keep their date prefix (meaningful chronology, §1.2). Bare-slug types stay
bare. Only the **position/index/cryptic token** is replaced with a subject word; the file's actual
content (read for each row) supplies the subject. Frontmatter `slug:` fields that mirror the
filename must be updated to match (flagged in the Notes column).

| # | Old path | New path | Rationale (subject from content) | Inbound refs to repoint |
|---|---|---|---|---|
| 1 | `reviews/2026-05-24-execution-task-01-dual-system-eval.md` | `reviews/2026-05-24-worktree-create-config-step-dual-system-eval.md` | Dual-system adversarial review of the Config-step worktree-create commits (not "task 01"). | `notes/2026-05-24-session-foundations-bundle-b.md` (1) |
| 2 | `features/git-workflow/changelogs/2026-05-24-task-01-row-5-5-worktree-create.md` | `features/git-workflow/changelogs/2026-05-24-worktree-create-config-step.md` | Changelog: shipped worktree-create into the Config Step 1 procedure. | none |
| 3 | `features/git-workflow/design/d-1-worktree-row-5-5.md` | `features/git-workflow/design/worktree-create-before-session-stamp.md` | Design: create worktree before the session.json git-field stamp. Update frontmatter `slug:` + `design-id` note. | `design/session-lifecycle-worktree-boundaries.md`, `features/evaluation/discussions/eval-fail-revise-escalation.md` (2) |
| 4 | `features/git-workflow/checklists/decimal-row-numbering-55.md` | `features/git-workflow/checklists/config-table-row-numbering-choice.md` | Checklist: choose integer-renumber vs decimal row in the Config table. | none |
| 5 | `features/git-workflow/discussions/2026-05-24-t1g-direct-mode-home-orchestration-skill.md` | `features/git-workflow/discussions/2026-05-24-direct-mode-opt-out-doc-home.md` | Discussion: where the direct-mode opt-out is documented (LOCK #5). | none |
| 6 | `features/git-workflow/discussions/2026-05-24-t1j-rollback-home-preparation-skill.md` | `features/git-workflow/discussions/2026-05-24-promote-now-rollback-doc-home.md` | Discussion: where promote-now rollback semantics live (LOCK #4). | none |
| 7 | `features/git-workflow/discussions/reframing-1-3.md` | `features/git-workflow/discussions/worktree-first-vs-collapsing-strategies.md` | Discussion: worktree-first locked over two-surface / symlink. Update frontmatter `slug:`. | none |
| 8 | `features/git-workflow/discussions/new-dependency-on-1-3.md` | `features/git-workflow/discussions/promote-now-depends-on-worktree-first.md` | Discussion: promote-now commit-on-branch depends on worktree-first. Update frontmatter `slug:`. | none |
| 9 | `features/install-runtime/discussions/mirror-policy-round-1.md` | `features/install-runtime/discussions/mirror-policy-workspace-canonical-superseded.md` | First lock (workspace-canonical), later superseded. Subject = the *position taken*, not the round. Already `status: superseded`. Update frontmatter `slug` if present. | (its sibling references it via `superseded_by` — see row 9b) |
| 9b | `features/install-runtime/discussions/mirror-policy-round-2-re-lock.md` | `features/install-runtime/discussions/mirror-policy-mirror-canonical-relock.md` | NOT in briefed list, but the supersede *pair* of #9 — renaming only one half re-creates the index it removes (`round-1` gone but `round-2` left dangling). Subject = the corrected position (mirror-canonical). Repoint `superseded_by` in #9 and the back-ref; repoint inbound `superseded_by` in #9b's own frontmatter. | the two files cross-reference each other |
| 10 | `features/workflow/plans/2026-05-23-main.md` | `features/workflow/plans/2026-05-23-orch-workflow-improvements.md` | Plan for the gobbi-orchestration-workflow-improvements feature; "main" is uninformative. Update frontmatter `slug: main` → new slug. | `features/workflow/changelogs/2026-05-26-bundle-a-rehome.md` (1) |
| 11 | `features/agents/discussions/2026-05-24-shared-executor-tasks-07-08.md` | `features/agents/discussions/2026-05-24-shared-executor-context-continuity.md` | Discussion: bundle two tasks into one executor for jq/stdin context continuity (LOCK #2). The subject is *why* shared, not *which task numbers*. | none |

### `cross-layer-drift-gate` — judgment call, NOT auto-renamed

`features/guardrails/checklists/cross-layer-drift-gate.md` — this name **already names the subject**:
a checklist gate that verifies alignment across the hook / settings / skills / session-metadata
layers. "cross-layer" + "drift-gate" are content words, no position/index/cryptic token. **Keep as
is.** (Listed here only because the brief asked for a judgment.) Optional polish if the manager
wants more specificity: `four-surface-alignment-gate` — but this is *not* required and arguably
loses the "drift" framing. Recommendation: **keep `cross-layer-drift-gate`**.

### Broader offender family found in the scan (NOT in the briefed list — manager decision needed)

The scan surfaced a consistent **wider pattern** of the same two failure categories. These are
genuine offenders by the new §1.3 but were not in the briefed ~10. Flagged for the manager to
decide scope (include in PR #272 now, or file a follow-up):

- **git-workflow design D-family:** `d-2-qualified-git-rule.md`, `d-3-promote-now-commit-on-branch.md`,
  `d-4-per-iter-session-commit.md`, `d-5-direct-mode-retained.md` — drop the `d-N` design-ID prefix
  (the H1 title already names the subject, e.g. → `qualified-git-rule`, `promote-now-commit-on-branch`,
  `per-iteration-session-commit`, `direct-mode-retained`).
- **install-runtime design D-3-family:** `d-3-1-hook-bash-jq-stack` … `d-3-6-correlation-key` (6 files)
  — drop `d-3-N`; H1 titles supply subjects (`hook-bash-jq-stack`, `reconstructor-verify-and-fix`,
  `dual-hook-registration-resolver`, `metadata-extraction-input-vs-result`, `flock-serialization`,
  `tool-use-id-correlation-key`).
- **cryptic checkpoint-ID discussions:** `failure-mode-1-3-confirm`, `root-cause-1-2-hypothesis`,
  `reframing-1-2-broader-verifier`, `mechanism-4-1-option-c`, `cp-d-1-dual-hook-registration`,
  `cp-d-2-commit-subject-scope` — `1-3`/`1-2`/`4-1`/`cp-d-N` are CP checkpoint IDs; H1 titles name the
  subject.
- **`step-2-5` workflow family:** `wrap-up-step-2-5-compliance-check`, `-anchor-placement`,
  `-escalation-default`, `-escalation-shape`, `step-2-5-example-non-canonical-domain-value` —
  borderline: "wrap-up-step-2-5" is a *real, stable* workflow-step coordinate (Wrap-up Step 2.5),
  arguably a meaningful structural reference rather than a vanished-session index. **Recommend
  KEEP** these — flagged only for transparency.

**Recommendation:** Keep PR #272 scoped to the **briefed 11 + the mirror-policy sibling (#9b)** to
respect the user contract (Principle 4). File the broader D-family / CP-family sweep as a follow-up
backlog item so the manager/user can ratify the larger blast radius deliberately. The new §1.3
guidance will catch them at the next touch regardless.

---

## 4. Open questions / judgment calls for the manager

1. **Scope of the rename sweep (Principle 4).** The brief named ~10; the scan found ~25 files in the
   same two failure categories. Recommendation above: do the briefed 11 + forced sibling #9b now;
   defer the D-family/CP-family sweep to a follow-up. **Confirm or expand.**

2. **`mirror-policy-round-2-re-lock` (#9b) is a forced co-rename.** Renaming only `round-1` leaves a
   dangling `round-2` index and a half-fixed supersede pair. Including #9b is the *correct* CRUD
   blast radius (P13), even though it is outside the briefed list. **Confirm inclusion.**

3. **`cross-layer-drift-gate`** — recommend KEEP (already subject-named). Confirm no reword wanted.

4. **Ambiguous subject — `2026-05-24-shared-executor-tasks-07-08` (#11).** The faithful subject is
   "shared executor for context continuity," but if the manager prefers the names to still hint at
   *which* work, an alternative is `2026-05-24-hook-and-reconstructor-shared-executor` (names the two
   deliverables: the PostToolUse hook + the reconstructor). Both are subject-named; pick one.

5. **Frontmatter `slug:` / `design-id` fields.** Several offenders carry a `slug:` (and `design-id`)
   in frontmatter mirroring the filename (#3, #7, #8, #9, #10). The executor must update these to
   match the new filename (P13 blast radius). `design-id: D-1` etc. may be kept as a historical
   marker in the body but should not drive the filename. **Confirm: update `slug:` fields, keep
   `design-id` as body-only historical note.**

6. **Inbound-reference repointing (P13 blast radius).** Four offenders have inbound references that
   must be repointed in the same PR (#1→1 file, #3→2 files, #9/#9b→each other, #10→1 file). The
   executor's CRUD plan must include these as Update operations, not just the renames.
