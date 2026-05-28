VERDICT: REVISE

## Summary

P1 reshaped 11 of the 14 `features/agents/` docs (commit `999a403`, +146/-94) to the §4 dev-doc
standard. I diffed every file against `999a403^`, read both versions in full, and ran the §4.3 D5
scan, the §4.5 leak gate, and the scope check.

Content-preservation verdict (highest priority): on the heaviest reshape
(`design/execution-intake-notes-cross-cutting.md`, 70 lines) and on every other reshaped doc, no
substantive fact, bullet, code block, or mistake-path was deleted. The symlink-edit policy (6
bullets), all 3 + 1 mistake load paths, branch/commit/trailer conventions, and the bash-n/shellcheck
gate all survive verbatim. Task-code labels (T1/T2/T3, "Tasks 01-06", "row 5.5", `COD-RISK-003`,
`D-x` codes) were de-crypted into descriptive prose — legitimate §4.3 work, not deletion. The
§4.5 leak gate is clean; the scope is correctly bounded to `features/agents/` with no `archive/`
touch; the README was not touched.

The reshape is overwhelmingly sound. One real defect blocks a clean PASS: the shared-executor
discussion DROPPED a now-valid companion cross-reference (`lock2-shared-executor-mega-task-risk`)
that the original `## Source` carried, and did not give that file the `## Related` section its type
template prescribes. This is the exact failure pattern recorded in
`mistakes/evaluator-false-pass-without-diffing.md` ("missed a dropped `related:` key") — a cross-ref
that §4.4 KEEP-list and §4.3 both say must be preserved. Two lower-severity cross-reference / section
gaps round out the findings.

## Findings

[design_flaw] [severity High] [confidence 95] Dropped companion cross-reference in shared-executor
discussion. `features/agents/discussions/2026-05-24-shared-executor-context-continuity.md:39` — the
original `## Source` ended with "Companion decision:
`features/agents/design/lock2-shared-executor-mega-task-risk.md` when promoted." That companion file
HAS since been promoted (it exists at `features/workflow/backlogs/lock2-shared-executor-mega-task-risk.md`).
The reshaped `## Source` (new line 39-40) drops the companion pointer entirely — verified by
`grep -i 'lock2\|companion\|mega-task'` on the new file returning nothing. The discussions template
prescribes a `## Related` section precisely for inter-doc links (the sibling
`scope-literal-ask-vs-broader-verifier.md` got one in the same commit), but this file was reshaped to
Context/Question/Options/User decision/Implication/Source with NO `## Related`. Net: a now-resolvable
cross-reference was silently lost during a prose-quality pass. §4.4 lists cross-reference/linking keys
as NEVER-strip; §4.3 keeps provenance/cross-links. Why it matters: a future reader of this discussion
can no longer find the companion risk record that motivated the single-executor decision — the exact
"trapped knowledge" the standard exists to prevent. Suggested direction: restore the companion pointer
as a `## Related` entry pointing at the file's real current path.

[checklist_gap] [severity Low] [confidence 90] Stale cross-reference path preserved verbatim in
scope-literal discussion. `features/agents/discussions/scope-literal-ask-vs-broader-verifier.md`
`## Related` (new) points at `features/agents/backlogs/broader-delegation-contract-verifier.md`, but
that backlog actually lives at PROJECT level `.gobbi/projects/gobbi/backlogs/broader-delegation-contract-verifier.md`
(verified by `find`). The original `## Source` carried the same now-wrong feature-level path with an
"if/when promoted" hedge; the reshape promoted it into a hard `## Related` link while the hedge is gone
and the file now exists at a different path. Not a P1-introduced path error (faithfully copied), but
P1 is the prose-quality pass and converting a hedged pointer into a confident wrong link degrades it.
Why it matters: a reader following the link hits a non-existent path. Suggested direction: correct the
path to the project-level backlog.

[general] [severity Low] [confidence 90] `D-5` code listed as needing expansion but has no checklist
row. `features/agents/checklists/d-ref-codes-missing-inline-expansion.md` — frontmatter `description`
and the new intro paragraph both enumerate `D-3-3, D-4, D-5, D-9` as codes needing inline expansion,
but the table + Item details cover only D-3-3 / D-4 / D-9. D-5 is orphaned. PRE-EXISTING: the original
also listed D-5 in the title/Situation while the original table had only the same 3 rows, so P1 did NOT
introduce this — it preserved an existing inconsistency. Flagged at Low because the new self-contained
intro ("This checklist enumerates the briefs that need the expansion") makes the omission read as a
completeness claim. Why it matters: a reader expects a D-5 row and finds none. Suggested direction:
either add a D-5 row or drop D-5 from the description/intro (out-of-scope decision for the user).

[general] [severity Low] [confidence 85] References docs carry `related:` frontmatter but no body
`## Related` (concern c). The 4 `references/*.md` docs have `related:` frontmatter; the references
TYPE template (`templates/references.md:62`) prescribes a body `## Related` section. None of the 4 has
one. PRE-EXISTING and out of P1's reshape scope: P1 applied only minimal prose de-crypt to the
references docs (no §4.2 section reshape), so their original Insight/Why-it-applies/Source/Excerpt/Usage-history
structure is unchanged (verified `## ` headings identical old vs new). P1 did not introduce the gap and
arguably was not chartered to add sections to docs it only de-crypted. Flagged for visibility, not as a
P1 regression. Suggested direction: defer to a references-specific conformance sweep.

## Concern assessments

(a) description-value edits on 5 docs — ACCEPTABLE, not frontmatter overreach. All 5 edits change the
VALUE of the BASE `description` key to replace `T2`/`T3` task codes with descriptive phrasing
(verified: `git show | grep '^[-+]description:'`). No key was added or removed; `name`, `type`,
`related`, etc. untouched. `description` is the one-line cold-read surface (§2.1, §4.1 zero-context
bar) and a `T2`/`T3` token in it is a load-bearing session coordinate per §4.3. De-crypting the value
is squarely in-scope for a prose-quality pass. PASS.

(b) no `notes/` file created — CORRECT, with one caveat. I read every reshaped doc: no chronological
session-journal narrative was deleted or compressed away; each doc's content was reshaped IN PLACE into
its type's contract sections (design→ADR, discussions→discussion template, backlog→backlog template,
checklist→checklist template). None contained misclassified journal narrative requiring extraction to
`notes/`, so creating no `notes/` file is correct. The §4.3 "never delete narrative" rule is honored
because nothing was deleted — it was reclassified within-type. CAVEAT: the one thing that WAS lost is
not narrative but a cross-reference (Finding 1) — that is a §4.4 KEEP-list issue, not a notes/ issue.
PASS on the narrative claim; the cross-ref loss is tracked as Finding 1.

(c) 4 references docs have `related:` frontmatter but no body `## Related` — REAL template gap, but
PRE-EXISTING and outside P1's de-crypt-only touch on those docs (see Finding 4). Not a P1 regression.

## Verification outputs

=== git show 999a403 --stat ===
11 files changed, 146 insertions(+), 94 deletions(-) — all under features/agents/:
  backlogs/privacy-retention-agents-metadata-deferred.md          24 +++-----
  checklists/d-ref-codes-missing-inline-expansion.md              41 ++++++++-----
  design/execution-intake-notes-cross-cutting.md                  70 +++++++++++++-------
  design/memorization-delegation-hard-gate.md                     22 +++++--
  discussions/2026-05-24-shared-executor-context-continuity.md    18 +++---
  discussions/scope-literal-ask-vs-broader-verifier.md            27 +++++----
  references/autogen-pydantic-tool-schema-validation.md           12 ++--
  references/claude-code-agent-sdk-task-output.md                  8 +--
  references/langgraph-skill-catalog-pattern.md                    8 +--
  references/rbac-matrix-single-source-of-truth.md                 8 +--
  scenarios/hook-silence-no-agents-mutation-diagnostic.md          2 +-

=== §4.3 D5 scan (grep -rnE 'T[0-9]+-|iter[0-9]|draft-iter|COD-[0-9]|row-[0-9]' ... | grep -v archive) ===
design/execution-intake-notes-cross-cutting.md:43: .../mistakes/manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md
design/execution-intake-notes-cross-cutting.md:49: .../mistakes/manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md
  → Both hits are the literal FILENAME of a real project mistake file inside a code block
    (the `iter2` substring matches the advisory regex). §4.3 explicitly says review each hit;
    a literal mention inside a path/quote is legitimate. NOT a leak — these are load-bearing
    cross-reference paths, not session coordinates to resolve. PASS.

=== §4.5 leak gate (find ... -not archive | xargs grep -lE '^(mistake-candidate|...|session-id):') ===
(empty — gate clean)

=== Scope check ===
All 11 changed files under features/agents/; no archive/, no sessions/, no other dirs. README untouched.

=== Cross-reference resolution checks ===
lock2-shared-executor-mega-task-risk.md  → EXISTS at features/workflow/backlogs/ (was promoted; dropped from discussion — Finding 1)
broader-delegation-contract-verifier.md  → EXISTS at .gobbi/projects/gobbi/backlogs/ (project-level; discussion links wrong feature-level path — Finding 2)
backlog Originating session path .../2026-05-23-1b26cf20-.../  → resolves (dir present)

=== §4.2 section-contract conformance (per reshaped doc) ===
design/memorization-delegation-hard-gate.md   Context/Decision/Rationale/Alternatives considered/Consequences  → ADR match ✓
design/execution-intake-notes-cross-cutting.md Context/Decision/Rationale/Alternatives considered/Consequences/Source → ADR match ✓
discussions/scope-literal-...                  Context/Question/Options considered/User decision/Implication/Related → template match ✓
discussions/2026-05-24-shared-executor-...     Context/Question/Options considered/User decision/Implication/Source → MISSING ## Related (Finding 1)
backlogs/privacy-retention-...                 Context/Why deferred/When to pick up/Suggested approach/Originating session → template match ✓
checklists/d-ref-codes-...                     table+Anchor col / Item details / Status notes → per-scenario template match ✓ (D-5 row gap, Finding 3)
scenarios/hook-silence-...                     1-line de-crypt only; structure unchanged ✓

## Must-preserve list (remediation must not break these)

- The full content-preservation already achieved: every symlink-policy bullet, all 4 mistake paths,
  branch/commit/trailer conventions, bash-n/shellcheck gate in execution-intake-notes survive verbatim.
- The §4.2 ADR/template reshapes on the 2 design docs, 2 discussions, backlog, and checklist are
  correct and should not be reverted.
- The T2/T3/COD/row/D-code de-crypt across all docs (including the 5 description-value edits) is good
  §4.3 work — do not re-introduce the task codes.
- The clean §4.5 leak gate and the correctly-bounded scope (features/agents/ only, no archive touch).
