# Usage — T9c iter2 re-run (commit c001694)

## Locked Frame (Stage 1)
- **S-USG-1** A zero-context reader can identify each doc from its frontmatter + title alone (§4.1 bar).
  - [x] READMEs: name=`{dir}-index`, description states "Index for the gobbi project {dir} directory".
  - [x] reviews doc: name + description state the subject (worktree-create config-step review).
- **S-USG-2 (adversarial)** features/README scope — does a consumer reading it get the right tier signal?
  - [x] `scope: project`, `feature: null` (prior iter1 defect was scope:feature; now corrected). The features-index README is a project-level placeholder, not a per-feature identity doc, so scope:project is the user's stated intent and the correct reader signal.
- **S-USG-3** Mistake docs remain actionable (bodies intact, detection signals preserved).
  - [x] Body line-count delta 0 on 3 files; +1 on naming-standard (tags frontmatter line). No section/prose loss.
- not-applicable: a11y/i18n — plain-markdown memory docs with scannable headings; no locale-sensitive content.

## Stage 2 findings
None. Each doc is operable cold. features/README scope:project matches the task-spec explicit constraint and the reader's expectation for a project-root index placeholder.

VERDICT: PASS
