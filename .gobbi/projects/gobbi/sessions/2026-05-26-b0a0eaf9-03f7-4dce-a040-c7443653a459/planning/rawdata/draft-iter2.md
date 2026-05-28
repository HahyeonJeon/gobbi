---
loop: planning
iter: 2
artifact_type: plan-draft
created_at: 2026-05-26
status: draft
supersedes: draft-iter1.md
related:
  - ideation/artifacts/idea.md
  - ideation/artifacts/scope-contract.md
  - ideation/artifacts/design-options.md
  - preparation/artifacts/handoff.md
  - preparation/staging/decisions/context-budget-wave-ordering-carry-forward.md
  - planning/evaluation/iter1/claude/overall.md
  - planning/evaluation/iter1/codex/overall.md
---

# Planning Draft (iter 2) — dev-doc-level project-memory standard

> **iter2 REVISE remediation.** The iter1 plan PASSED counts + ordering + schema under dual-system
> adversarial re-verification. Five surgical findings were flagged (Claude DOC-* + Codex F1/F2/F3),
> all of which converge on the SAME two roots plus three Medium/Low touch-ups. iter2 applies exactly
> those five fixes and preserves everything else verbatim. The approach, the 222/18/204/63 count
> system, the DAG/ordering invariant, the complete+disjoint partition, and the uniform schema do NOT
> change. Net structural change: three over-budget prose tasks split (+3 records → **25 executable
> records**); every `**` `files:` glob made archive-safe; the leak-gate key-set extended to underscore
> spellings; T10 retargeted to the real `.codex/AGENTS.md` (AGENTS.md is a symlink). See § Decisions
> log → iter2 remediation for the per-finding mapping.

> **Finalized after manager↔user decision round.** All five user decisions (DL-A..DL-E below) are
> ratified and baked in. There are no remaining gates: every task in this plan executes **this
> session** (Decision 1), T10 is **IN** (Decision 2), evaluation is **MAX-RIGOR dual-system on every
> task** (Decision 3), the population baseline is **count-corrected to 222/18/204/63** (Decision 4),
> and T9 is **split into three bounded sub-tasks** (Decision 5).

## Scope reference

- **Locked design:** `ideation/artifacts/idea.md` + `scope-contract.md` + `design-options.md`
  (10 decisions D1-D10, FIX-1 type-aware predicate).
- **Readiness:** `preparation/artifacts/handoff.md` (READY) + carry-forward
  `preparation/staging/decisions/context-budget-wave-ordering-carry-forward.md` (HONORED — see DL-A;
  iter2 extends the ≤~35 ceiling to the prose wave, closing F1/DOC-STRUCT-1).

**Project / Feature / Task triplet (verbatim from scope-contract.md):**
> - **Project:** gobbi
> - **Feature:** project-memory
> - **Task:** Author a dev-doc-level memory standard and retrofit live docs in waves
>   (conformance first, then prose). Builds on PR #272 branch; merge deferred.

**Primary deliverable:** written standard (new section in `memorization/rules.md`) + mechanical
conformance wave (Wave 1) + prose wave (Wave 2) + light tier-3 nav wave (Wave 3) + minimal grep-gate
enforcement. **All three waves ship this session** (Decision 1 — no deferral).

### POPULATION COUNT CORRECTION (ratified — Decision 4, DL-D)

The Ideation/Preparation baseline (`208 files / 17 READMEs / 191 content / 59 leaks`) was computed with an
**unanchored find filter** (`-not -path "*/agents/*"`) that accidentally excluded the **entire
`features/agents/` capability feature (14 docs)** — even though `agents` IS one of the 7 named in-scope
capability features. This is a **count correction, NOT a scope change** — `features/agents/` was always
in scope (it is T1). The TRUE baseline, re-measured at HEAD `d2b5b37` with a CORRECTED filter (excludes
`archive/` anywhere, `sessions/`/`skills/`/`tmp/`, and ONLY the top-level non-memory `agents/` agent-spec
dir — does NOT re-exclude `features/agents/`):

| Metric | Locked baseline (filter-bugged) | TRUE baseline (this plan) |
|---|---|---|
| P_live all files | 208 | **222** |
| READMEs | 17 | **18** (adds `features/agents/README.md`) |
| Content docs | 191 | **204** |
| FIX-1 leak set (hyphen-form keys) | 59 | **63** (+4 in `features/agents/`) |
| FIX-1 leak set (underscore-form keys, install-runtime) | — | **+5** (DOC-CONS-2; iter2 key-set extension) |
| Backlog-disposition (legit, preserved) | 27/28 | 28 |

**Success Criterion 2 restated (iter2):** 100% base-schema conformance + 0 illegitimate staging-key leaks,
measured over **204 content docs / 222 total**. The leak target is **the union of the 63 hyphen-form leak
files AND the 5 underscore-form leak files** in `features/install-runtime/` → **0 leaks of either spelling**
outside `archive/`. The +5 underscore files are NOT a population-count change (the 222/204 totals are
untouched); they are a **key-set-completeness fix** authorized by the iter2 brief, because the iter1
hyphen-only predicate would falsely certify those 5 files as clean (Iron Law 11 / Goodhart risk — see
§ Decisions log → iter2 remediation, finding 3). Verification commands + outputs are pasted in
§ File map → Counts note.

---

## File map

All paths relative to worktree root `/.../worktrees/chore/session-2026-05-25-a10c82d6/`.
Project-memory root abbreviated `PM = .gobbi/projects/gobbi`.

**Archive-safety invariant (iter2 — fixes DOC-PROJECT-1/DOC-CONS-1/DOC-RISK-2 + Codex implied):** No
task edit-set may include any path under `archive/` (top-level `PM/archive/` OR nested
`features/*/archive/`). The frozen archive set is **2 content docs + 5 READMEs** (enumerated in the
Counts note). Every `files:` glob that uses `**` is made archive-safe by **explicit subdir enumeration**
(the T3/T4/T6/T7 pattern) OR by carrying an explicit `-not -path "*/archive/*"` exclusion in BOTH the
edit-selection and the `verifies` gate, so the edit-glob matches the count predicate (which already
excludes archive). Tasks affected: T1, T2, T5, T8, T9a, P1, P2, P4, P6, N1 (all `**`), plus the prose
splits. T3/T4/T6/T7/T9b/T9c already enumerate subdirs and are archive-clean by construction.

### Foundation (1 file — Modify)
- `PM/skills/memorization/rules.md` — CANONICAL standard home. Add a new section
  (`§4 Dev-document quality standard`) appended after §3. Additive only (keeps merge-back surface
  minimal). `.claude/skills/memorization/rules.md` is a **SYMLINK mirror** that auto-reflects —
  DO NOT edit the symlink (see mistakes `skills-mirror-symlinks-not-copies`,
  `edit-tool-refuses-symlink-paths`).

### Wave 1 — Conformance (mechanical) — all 204 content docs + 18 READMEs grouped by feature + project tier

Grouped so files that change together (same feature dir) stay together. Counts are TRUE P_live
(HEAD d2b5b37). Each group ≤ ~35 docs (the context ceiling per `manager-context-overflow-with-large-bundle`).

| Group | Path glob | Total docs | Conformant today | Leak files |
|---|---|---|---|---|
| T1 agents | `features/agents/{README.md, <typed-dirs>/**}` (archive-safe; no nested archive) | 14 | 1 | 4 |
| T2 evaluation | `features/evaluation/**` (archive-safe; no nested archive) | 15 | 2 | 8 |
| T3 git-workflow A | `features/git-workflow/{discussions,design,decisions}/**` | 20 | — | — |
| T4 git-workflow B | `features/git-workflow/{backlogs,changelogs,checklists,plans,references,scenarios}/** + README.md` | 21 | — | — |
| T5 guardrails | `features/guardrails/**` (archive-safe; no nested archive) | 10 | 1 | 5 |
| T6 install-runtime A | `features/install-runtime/{discussions,design,decisions,changelogs}/**` | 24 | — | — |
| T7 install-runtime B | `features/install-runtime/{backlogs,checklists,references,scenarios}/** + README.md` | 20 | — | — |
| T8 project-memory | `features/project-memory/**` (archive-safe; no nested archive) | 4 | 0 | 2 |
| T9a workflow | `features/workflow/{discussions,design,decisions,backlogs,...}/**` (archive-safe — EXCLUDES `features/workflow/archive/`) | 26 | 2 | 14 |
| T9b project-tier high-touch | `PM/{decisions,design,learnings,notes,backlogs}/*.md` (single-level; archive subdir not matched) | 35 | — | — |
| T9c project-tier remainder + 2 index READMEs | `PM/{references,reviews,rules,plans,mistakes}/*.md` + `features/README.md` + `PM/README.md` | 33 | — | 1 |

**Cross-foot:** feature groups (T1-T9a) = 14+15+20+21+10+24+20+4+26 = **154**; project-tier (T9b+T9c)
= 35+33 = **68**; total = **222** ✓. git-workflow A+B = 41; install-runtime A+B = 44.

### Wave 2 — Prose (per-feature/group rewrite toward the quality bar) — THIS SESSION (Decision 1)
Same 204 content docs, grouped identically to Wave 1. iter2 SPLITS the three over-budget prose tasks
(P3=41, P5=44, P7=68) along the SAME A/B boundaries the conformance wave uses, so every prose task is
≤~35 docs (closes F1/DOC-STRUCT-1/DOC-PERF-1):
- **P3 (git-workflow 41) → P3a (20, mirrors T3) + P3b (21, mirrors T4).**
- **P5 (install-runtime 44) → P5a (24, mirrors T6) + P5b (20, mirrors T7).**
- **P7 (project-tier 68) → P7a (35, mirrors T9b) + P7b (33, mirrors T9c).**

Prose tasks: **P1, P2, P3a, P3b, P4, P5a, P5b, P6, P7a, P7b = 10 tasks**. Each applies type-purity
(D1/Diátaxis), per-type section contracts (D4), and self-contained prose (D5; judgment-based de-crypt of
remaining cryptic body references). Each prose sub-task `requires` its matching conformance task.

### Wave 3 — Tier-3 nav — THIS SESSION (Decision 1)
**N1**: verify each of the 18 README "Subdirectories" sections lists the subdirs that actually exist;
optional top-level index pointer. Archive-safe (EXCLUDES the 5 frozen `archive/` READMEs). Runs LAST,
requires all 10 prose tasks.

### Enforcement (grep gate) — THIS SESSION
- **T11**: `PM/skills/memorization/rules.md` §4 includes (or references) the mechanical type-aware
  grep-gate command (hyphen+underscore key-set; archive-safe); the gate is a runnable verification,
  not a behavior change.

### Counts note — CORRECTED `find` (no agents exclusion) re-verified at HEAD d2b5b37

All commands below were RUN at HEAD `d2b5b37` during iter2; outputs are pasted verbatim.

```
# total P_live files (exclude archive anywhere, sessions/skills/tmp, top-level agents/ spec dir;
# KEEP features/agents/):
$ find .gobbi/projects/gobbi -type f -name '*.md' \
    -not -path "*/archive/*" \
    -not -path ".gobbi/projects/gobbi/sessions/*" -not -path ".gobbi/projects/gobbi/skills/*" \
    -not -path ".gobbi/projects/gobbi/tmp/*" -not -path ".gobbi/projects/gobbi/agents/*" | wc -l
222

# READMEs (archive-safe — N1 edit set):
$ find .gobbi/projects/gobbi -type f -name 'README.md' -not -path "*/archive/*" \
    -not -path ".gobbi/projects/gobbi/sessions/*" -not -path ".gobbi/projects/gobbi/skills/*" \
    -not -path ".gobbi/projects/gobbi/tmp/*" | wc -l
18

# content docs (non-README): 222 - 18 = 204

# FROZEN ARCHIVE SET excluded from every task (2 content + 5 READMEs):
#   features/install-runtime/archive/references/2026-05-22-ideation-references.md   (content)
#   features/workflow/archive/decisions/2026-05-23-iter1-user-redirects.md          (content)
#   archive/README.md                                                               (README)
#   archive/features/env-var-audit/README.md                                        (README)
#   archive/features/gobbi-orchestration-workflow-improvements/README.md            (README)
#   archive/features/session-foundations-bundle-b/README.md                         (README)
#   archive/features/session-foundations-bundle-c/README.md                         (README)
# Proof the ** feature globs would have leaked (archive-safe form matches the count predicate exactly):
$ find .gobbi/projects/gobbi/features/workflow -type f -name '*.md' | wc -l                    # naive **
27
$ find .gobbi/projects/gobbi/features/workflow -type f -name '*.md' -not -path "*/archive/*" | wc -l  # archive-safe = T9a count
26
$ find .gobbi/projects/gobbi/features/install-runtime -type f -name '*.md' | wc -l             # naive **
45
$ find .gobbi/projects/gobbi/features/install-runtime -type f -name '*.md' -not -path "*/archive/*" | wc -l  # = 44 (T6+T7)
44

# FIX-1 leak files — hyphen-form key-set (the ratified 63 baseline, reproduces Decision 4):
#   = 59 (filter-bugged) + 4 (features/agents/) = 63   [Claude eval re-verified EXACTLY at iter1]
# the 4 features/agents/ leak files the filter bug hid:
#   features/agents/design/memorization-delegation-hard-gate.md
#   features/agents/backlogs/privacy-retention-agents-metadata-deferred.md
#   features/agents/scenarios/hook-silence-no-agents-mutation-diagnostic.md
#   features/agents/checklists/d-ref-codes-missing-inline-expansion.md

# FIX-1 leak files — UNDERSCORE-form key-set (iter2 DOC-CONS-2 extension), live install-runtime:
$ grep -rlE '^(promoted_from|promoted_at):' .gobbi/projects/gobbi/features/install-runtime \
    --include='*.md' | grep -v '/archive/' | wc -l
5
# the 5 underscore-form leak files (caught ONLY by the underscore extension — NONE carry a hyphen key):
#   features/install-runtime/discussions/env-var-audit-scope-discussion.md
#   features/install-runtime/decisions/pre-planning-readiness-decisions.md
#   features/install-runtime/decisions/env-file-load-semantics-decisions.md
#   features/install-runtime/decisions/task-decomposition-decisions.md
#   features/install-runtime/decisions/session-start-hook-script-decisions.md
# → SC2 leak target = 0 of {63 hyphen-form ∪ 5 underscore-form} outside archive/.
```

The 63 hyphen-form baseline is preserved verbatim from Decision 4 (Claude eval reproduced it exactly).
The +5 underscore files are a key-set completeness fix (not a population recount): without it the gate
would falsely report those 5 docs clean (Iron Law 11).

---

## Tasks

This plan defines **25 executable task records** (Decision 1 — everything ships this session). The iter2
prose splits (P3→P3a/P3b, P5→P5a/P5b, P7→P7a/P7b; +3 records) raise the iter1 total of 22 to **25**.
The full executable list is: **T0** (foundation) + **Wave 1 conformance T1, T2, T3, T4, T5, T6, T7, T8,
T9a, T9b, T9c** (11 records) + **T10** (.codex/AGENTS.md, IN per Decision 2) + **T11** (grep gate) +
**Wave 2 prose P1, P2, P3a, P3b, P4, P5a, P5b, P6, P7a, P7b** (10 records) + **Wave 3 nav N1** (1) =
**25**. Every task below carries the canonical YAML schema. **Evaluation cadence: dual-system (Claude +
Codex) on EVERY task** (Decision 3).

### T0 — Author the dev-doc quality standard (FOUNDATION)
```yaml
id: 00-author-dev-doc-standard
what: Add a new "Dev-document quality standard" section (§4) to the canonical memorization/rules.md defining the positive quality bar (D3), per-type section contracts (D4), self-contained-prose rule (D5), the FIX-1 type-aware frontmatter conformance predicate (D6 — illegitimate-key-set S includes BOTH hyphen AND underscore spellings of every staging-routing key), and the mechanical archive-safe grep-gate command — leading with positive guidance plus real before/after examples drawn from this tree.
traces-to:
  - "A written dev-doc-quality standard exists that an evaluator can score a memory doc against (objective checklist, not vibes)."
  - "Every doc TYPE has a required intra-doc section contract (what sections, in what order, what each holds)."
  - "The standard leads with POSITIVE guidance + good/bad examples (per the naming-standard mistake), not prohibitions only."
requires: []
files:
  - path: ".gobbi/projects/gobbi/skills/memorization/rules.md"
    op: modify
inputs:
  - "ideation/artifacts/design-options.md (D1-D10 + FIX-1 predicate)"
  - ".gobbi/projects/gobbi/skills/memorization/templates/*.md (per-type section contracts)"
outputs:
  - dev-doc-quality-standard-section
verifies: "grep -nE '^## .*[Dd]ev-document quality' .gobbi/projects/gobbi/skills/memorization/rules.md returns the new section; AND git diff --name-only in the worktree lists skills/memorization/rules.md (NOT the .claude symlink); AND the section contains a positive definition + a before/after table + the FIX-1 predicate text (illegitimate-key-set S with BOTH hyphen and underscore spellings) + the archive-safe grep-gate command (carries -not -path '*/archive/*')."
```

### T1 — Conformance: features/agents (14 docs)
```yaml
id: 01-conform-agents
what: Bring all features/agents content docs + README to the base frontmatter schema and apply the FIX-1 type-aware staging-key strip (preserve legitimate per-type keys; preserve disposition on backlogs; strip illegitimate staging keys in BOTH hyphen and underscore spellings on non-backlogs files), and de-crypt confirmed cryptic session-coordinates from evergreen-type doc bodies in this group. features/agents has no nested archive/ dir; the edit set is still archive-safe by exclusion.
traces-to:
  - "Conformance wave (wave 1, mechanical): type-aware frontmatter base-schema normalization + FIX-1 type-aware allowlist strip of illegitimate staging-routing keys + de-crypt cryptic session-internal coordinates from doc bodies."
requires: [00-author-dev-doc-standard]
files:
  - path: ".gobbi/projects/gobbi/features/agents/**/*.md"
    op: modify
    exclude: "**/archive/**"
inputs: [dev-doc-quality-standard-section]
outputs: [agents-conformant]
verifies: "Type-aware leak gate (hyphen+underscore key-set, -not -path '*/archive/*') over features/agents returns 0 leak files (baseline 4); AND all 14 docs carry the 9 base keys (baseline 1 conformant); AND `disposition` preserved on features/agents/backlogs/privacy-retention-agents-metadata-deferred.md; AND git diff --name-only confirms only worktree features/agents paths (no archive/) changed."
```

### T2 — Conformance: features/evaluation (15 docs)
```yaml
id: 02-conform-evaluation
what: Bring all features/evaluation content docs + README to the base frontmatter schema, apply the FIX-1 type-aware staging-key strip (hyphen+underscore key-set; preserve disposition on backlogs), and de-crypt confirmed cryptic session-coordinates from evergreen-type bodies in this group. No nested archive/ dir; edit set archive-safe by exclusion.
traces-to:
  - "Conformance wave (wave 1, mechanical): type-aware frontmatter base-schema normalization + FIX-1 type-aware allowlist strip of illegitimate staging-routing keys + de-crypt cryptic session-internal coordinates from doc bodies."
requires: [00-author-dev-doc-standard]
files:
  - path: ".gobbi/projects/gobbi/features/evaluation/**/*.md"
    op: modify
    exclude: "**/archive/**"
inputs: [dev-doc-quality-standard-section]
outputs: [evaluation-conformant]
verifies: "Type-aware leak gate (hyphen+underscore, -not -path '*/archive/*') over features/evaluation returns 0 (baseline 8); all 15 docs carry 9 base keys (baseline 2); git diff confirms only worktree features/evaluation paths (no archive/) changed."
```

### T3 — Conformance: features/git-workflow A — discussions+design+decisions (20 docs)
```yaml
id: 03-conform-git-workflow-a
what: Bring features/git-workflow discussions, design, and decisions content docs to the base frontmatter schema, apply the FIX-1 type-aware staging-key strip (hyphen+underscore), and de-crypt confirmed cryptic session-coordinates from evergreen-type bodies in this group (includes the design/worktree-create-before-session-stamp.md de-crypt witness from idea.md). Explicit subdir enumeration — archive-clean by construction.
traces-to:
  - "Conformance wave (wave 1, mechanical): type-aware frontmatter base-schema normalization + FIX-1 type-aware allowlist strip of illegitimate staging-routing keys + de-crypt cryptic session-internal coordinates from doc bodies."
requires: [00-author-dev-doc-standard]
files:
  - path: ".gobbi/projects/gobbi/features/git-workflow/discussions/**/*.md"
    op: modify
  - path: ".gobbi/projects/gobbi/features/git-workflow/design/**/*.md"
    op: modify
  - path: ".gobbi/projects/gobbi/features/git-workflow/decisions/**/*.md"
    op: modify
inputs: [dev-doc-quality-standard-section]
outputs: [git-workflow-a-conformant]
verifies: "Type-aware leak gate (hyphen+underscore) over the three subdirs returns 0; all 20 docs carry 9 base keys; git diff confirms only those worktree paths changed."
```

### T4 — Conformance: features/git-workflow B — rest + README (21 docs)
```yaml
id: 04-conform-git-workflow-b
what: Bring the remaining features/git-workflow content docs (backlogs, changelogs, checklists, plans, references, scenarios) and the feature README to the base frontmatter schema, apply the FIX-1 type-aware staging-key strip (hyphen+underscore; preserve disposition on backlogs), and de-crypt confirmed cryptic session-coordinates from evergreen-type bodies in this group. Explicit subdir enumeration — archive-clean.
traces-to:
  - "Conformance wave (wave 1, mechanical): type-aware frontmatter base-schema normalization + FIX-1 type-aware allowlist strip of illegitimate staging-routing keys + de-crypt cryptic session-internal coordinates from doc bodies."
requires: [00-author-dev-doc-standard, 03-conform-git-workflow-a]
files:
  - path: ".gobbi/projects/gobbi/features/git-workflow/{backlogs,changelogs,checklists,plans,references,scenarios}/**/*.md"
    op: modify
  - path: ".gobbi/projects/gobbi/features/git-workflow/README.md"
    op: modify
inputs: [dev-doc-quality-standard-section, git-workflow-a-conformant]
outputs: [git-workflow-conformant]
verifies: "Type-aware leak gate (hyphen+underscore) over the whole features/git-workflow tree (A+B) returns 0; all 41 docs carry 9 base keys; disposition preserved on every backlogs file; git diff confirms only worktree features/git-workflow paths changed."
```

### T5 — Conformance: features/guardrails (10 docs)
```yaml
id: 05-conform-guardrails
what: Bring all features/guardrails content docs + README to the base frontmatter schema, apply the FIX-1 type-aware staging-key strip (hyphen+underscore; preserve disposition on backlogs), and de-crypt confirmed cryptic session-coordinates from evergreen-type bodies in this group. No nested archive/ dir; edit set archive-safe by exclusion.
traces-to:
  - "Conformance wave (wave 1, mechanical): type-aware frontmatter base-schema normalization + FIX-1 type-aware allowlist strip of illegitimate staging-routing keys + de-crypt cryptic session-internal coordinates from doc bodies."
requires: [00-author-dev-doc-standard]
files:
  - path: ".gobbi/projects/gobbi/features/guardrails/**/*.md"
    op: modify
    exclude: "**/archive/**"
inputs: [dev-doc-quality-standard-section]
outputs: [guardrails-conformant]
verifies: "Type-aware leak gate (hyphen+underscore, -not -path '*/archive/*') over features/guardrails returns 0 (baseline 5); all 10 docs carry 9 base keys (baseline 1); `disposition` preserved on all 3 backlogs files (goodhart-factor-when-demanded-deferred.md, posttooluse-failure-webfetch-verification-gap.md, hook-event-count-31-vs-29-docs-sync.md); git diff confirms only worktree features/guardrails paths (no archive/) changed."
```

### T6 — Conformance: features/install-runtime A — discussions+design+decisions+changelogs (24 docs)
```yaml
id: 06-conform-install-runtime-a
what: Bring features/install-runtime discussions, design, decisions, and changelogs content docs to the base frontmatter schema, apply the FIX-1 type-aware staging-key strip (hyphen+underscore — this subgroup contains the 4 of 5 underscore-key leak docs in decisions/), and de-crypt confirmed cryptic session-coordinates from evergreen-type bodies. Explicit subdir enumeration — archive-clean.
traces-to:
  - "Conformance wave (wave 1, mechanical): type-aware frontmatter base-schema normalization + FIX-1 type-aware allowlist strip of illegitimate staging-routing keys + de-crypt cryptic session-internal coordinates from doc bodies."
requires: [00-author-dev-doc-standard]
files:
  - path: ".gobbi/projects/gobbi/features/install-runtime/{discussions,design,decisions,changelogs}/**/*.md"
    op: modify
inputs: [dev-doc-quality-standard-section]
outputs: [install-runtime-a-conformant]
verifies: "Type-aware leak gate (hyphen+underscore key-set — MUST catch promoted_from/promoted_at) over the four subdirs returns 0; the 4 underscore-key leak docs in decisions/ + discussions/ (env-var-audit-scope-discussion.md, pre-planning-readiness-decisions.md, env-file-load-semantics-decisions.md, task-decomposition-decisions.md, session-start-hook-script-decisions.md) carry NO underscore staging key after the strip; all 24 docs carry 9 base keys; git diff confirms only those worktree paths changed."
```

### T7 — Conformance: features/install-runtime B — rest + README (20 docs)
```yaml
id: 07-conform-install-runtime-b
what: Bring the remaining features/install-runtime content docs (backlogs, checklists, references, scenarios) and the feature README to the base frontmatter schema, apply the FIX-1 type-aware staging-key strip (hyphen+underscore; preserve disposition on backlogs), and de-crypt confirmed cryptic session-coordinates from evergreen-type bodies. Explicit subdir enumeration — archive-clean (the install-runtime/archive/references/ doc is excluded).
traces-to:
  - "Conformance wave (wave 1, mechanical): type-aware frontmatter base-schema normalization + FIX-1 type-aware allowlist strip of illegitimate staging-routing keys + de-crypt cryptic session-internal coordinates from doc bodies."
requires: [00-author-dev-doc-standard, 06-conform-install-runtime-a]
files:
  - path: ".gobbi/projects/gobbi/features/install-runtime/{backlogs,checklists,references,scenarios}/**/*.md"
    op: modify
  - path: ".gobbi/projects/gobbi/features/install-runtime/README.md"
    op: modify
inputs: [dev-doc-quality-standard-section, install-runtime-a-conformant]
outputs: [install-runtime-conformant]
verifies: "Type-aware leak gate (hyphen+underscore, -not -path '*/archive/*') over the whole features/install-runtime tree (A+B, excluding archive/) returns 0 — confirming ALL 5 underscore-key leak docs cleared; all 44 docs carry 9 base keys; disposition preserved on every backlogs file; git diff confirms only worktree features/install-runtime paths (no archive/) changed."
```

### T8 — Conformance: features/project-memory (4 docs)
```yaml
id: 08-conform-project-memory
what: Bring all features/project-memory content docs + README to the base frontmatter schema, apply the FIX-1 type-aware staging-key strip (hyphen+underscore; preserve disposition on backlogs), and de-crypt confirmed cryptic session-coordinates from evergreen-type bodies in this group. No nested archive/ dir; edit set archive-safe by exclusion.
traces-to:
  - "Conformance wave (wave 1, mechanical): type-aware frontmatter base-schema normalization + FIX-1 type-aware allowlist strip of illegitimate staging-routing keys + de-crypt cryptic session-internal coordinates from doc bodies."
requires: [00-author-dev-doc-standard]
files:
  - path: ".gobbi/projects/gobbi/features/project-memory/**/*.md"
    op: modify
    exclude: "**/archive/**"
inputs: [dev-doc-quality-standard-section]
outputs: [project-memory-conformant]
verifies: "Type-aware leak gate (hyphen+underscore, -not -path '*/archive/*') over features/project-memory returns 0 (baseline 2); all 4 docs carry 9 base keys (baseline 0); git diff confirms only worktree features/project-memory paths (no archive/) changed."
```

### T9a — Conformance: features/workflow (26 docs) — T9 SPLIT 1/3 (Decision 5)
```yaml
id: 09a-conform-workflow
what: Bring all features/workflow content docs + README to the base frontmatter schema, apply the FIX-1 type-aware staging-key strip (hyphen+underscore; preserve disposition on backlogs), and de-crypt confirmed cryptic session-coordinates from evergreen-type bodies in this group. ARCHIVE-SAFE — the edit set EXCLUDES features/workflow/archive/decisions/2026-05-23-iter1-user-redirects.md (the +1 the naive ** glob leaked).
traces-to:
  - "Conformance wave (wave 1, mechanical): type-aware frontmatter base-schema normalization + FIX-1 type-aware allowlist strip of illegitimate staging-routing keys + de-crypt cryptic session-internal coordinates from doc bodies."
requires: [00-author-dev-doc-standard]
files:
  - path: ".gobbi/projects/gobbi/features/workflow/**/*.md"
    op: modify
    exclude: "**/archive/**"
inputs: [dev-doc-quality-standard-section]
outputs: [workflow-conformant]
verifies: "find features/workflow -name '*.md' -not -path '*/archive/*' returns 26 (NOT 27 — proves archive excluded); type-aware leak gate (hyphen+underscore, -not -path '*/archive/*') over features/workflow returns 0 (baseline 14); all 26 docs carry 9 base keys (baseline 2); disposition preserved on backlogs; git diff confirms only worktree features/workflow paths (no archive/) changed."
```

### T9b — Conformance: project-tier high-touch — decisions+design+learnings+notes+backlogs (35 docs) — T9 SPLIT 2/3
```yaml
id: 09b-conform-project-tier-high-touch
what: Bring the project-tier decisions, design, learnings, notes, and backlogs typed dirs (each incl its dir README) to the base frontmatter schema, apply the FIX-1 type-aware staging-key strip (hyphen+underscore; preserve disposition on backlogs files), and de-crypt confirmed cryptic session-coordinates from evergreen-type bodies. Single-level glob (/*.md) — does not descend into PM/archive/.
traces-to:
  - "Conformance wave (wave 1, mechanical): type-aware frontmatter base-schema normalization + FIX-1 type-aware allowlist strip of illegitimate staging-routing keys + de-crypt cryptic session-internal coordinates from doc bodies."
requires: [00-author-dev-doc-standard]
files:
  - path: ".gobbi/projects/gobbi/{decisions,design,learnings,notes,backlogs}/*.md"
    op: modify
inputs: [dev-doc-quality-standard-section]
outputs: [project-tier-high-touch-conformant]
verifies: "Type-aware leak gate (hyphen+underscore) over the five dirs returns 0; all 35 docs carry 9 base keys; disposition preserved on every backlogs file; git diff confirms only those worktree project-tier paths changed (no PM/archive/)."
```

### T9c — Conformance: project-tier remainder + 2 index READMEs — references+reviews+rules+plans+mistakes + features/README + project-root README (33 docs) — T9 SPLIT 3/3
```yaml
id: 09c-conform-project-tier-remainder
what: Bring the project-tier references, reviews, rules, plans, and mistakes typed dirs (each incl its dir README) plus features/README.md and the project-root README.md to the base frontmatter schema, apply the FIX-1 type-aware staging-key strip (hyphen+underscore; preserve legitimate per-type keys — priority/domain on mistakes, verdict/review_kind/subject on reviews), and de-crypt confirmed cryptic session-coordinates from evergreen-type bodies. Single-level glob — does not descend into PM/archive/.
traces-to:
  - "Conformance wave (wave 1, mechanical): type-aware frontmatter base-schema normalization + FIX-1 type-aware allowlist strip of illegitimate staging-routing keys + de-crypt cryptic session-internal coordinates from doc bodies."
requires: [00-author-dev-doc-standard]
files:
  - path: ".gobbi/projects/gobbi/{references,reviews,rules,plans,mistakes}/*.md"
    op: modify
  - path: ".gobbi/projects/gobbi/features/README.md"
    op: modify
  - path: ".gobbi/projects/gobbi/README.md"
    op: modify
inputs: [dev-doc-quality-standard-section]
outputs: [project-tier-remainder-conformant]
verifies: "Type-aware leak gate (hyphen+underscore) over the five dirs + 2 index READMEs returns 0 (baseline 1); all 33 docs carry 9 base keys; priority/domain preserved on mistakes; verdict/review_kind/subject preserved on reviews; git diff confirms only those worktree paths changed (no PM/archive/, no features/*/archive/)."
```

### T10 — Reconcile .codex/AGENTS.md 12→13 principle count (INCLUDED — Decision 2)
```yaml
id: 10-reconcile-agents-md-principle-count
what: Update the REAL file .codex/AGENTS.md from "12 principles" to "13 principles" and add the P13 row, matching .claude/CLAUDE.md, as a narrow count-consistency fix. AGENTS.md (repo root) is a SYMLINK -> .codex/AGENTS.md (verified via `readlink AGENTS.md`), so it updates automatically — DO NOT edit the symlink path (mistake edit-tool-refuses-symlink-paths). Edit ONLY the WORKTREE copy .codex/AGENTS.md — both AGENTS.md and .codex/AGENTS.md exist in BOTH the main tree and the worktree; edit the worktree copy only (mistake executor-main-tree-edit).
traces-to:
  - "Reconcile AGENTS.md + .codex/AGENTS.md to 13 principles + add P13 row (PR-1 finding, Low) — user-confirmed IN."
requires: [00-author-dev-doc-standard]
files:
  - path: ".codex/AGENTS.md"
    op: modify
inputs: [dev-doc-quality-standard-section]
outputs: [agents-md-principle-count-reconciled]
verifies: "readlink AGENTS.md == .codex/AGENTS.md (confirms symlink, so editing the real file propagates); grep -c '13 principles' .codex/AGENTS.md returns >=1 AND `grep -c '13 principles' AGENTS.md` also returns >=1 via the symlink; the P13 row is present; grep -c '12 principles' .codex/AGENTS.md returns 0; git diff --name-only in the worktree lists ONLY .codex/AGENTS.md (NOT the main-tree copy at /playinganalytics/git/gobbi/.codex/AGENTS.md, and NOT a second AGENTS.md entry — the symlink target is the only changed path)."
```

### T11 — Wire the mechanical grep gate (ENFORCEMENT, minimal)
```yaml
id: 11-wire-grep-gate
what: Add the minimal mechanical type-aware grep-gate command to the standard (or a referenced verification doc) covering features/ and project-tier dirs, as a runnable verification command (NOT a behavior change, NOT a new eval perspective). The gate key-set S MUST include BOTH hyphen and underscore spellings of every staging-routing key, and MUST carry -not -path '*/archive/*'.
traces-to:
  - "IN-SCOPE only as the minimal mechanical grep gate extended to features/ — a verification command, NOT a behavior change."
requires: [00-author-dev-doc-standard, 01-conform-agents, 02-conform-evaluation, 04-conform-git-workflow-b, 05-conform-guardrails, 07-conform-install-runtime-b, 08-conform-project-memory, 09a-conform-workflow, 09b-conform-project-tier-high-touch, 09c-conform-project-tier-remainder]
files:
  - path: ".gobbi/projects/gobbi/skills/memorization/rules.md"
    op: modify
inputs: [dev-doc-quality-standard-section, agents-conformant, evaluation-conformant, git-workflow-conformant, guardrails-conformant, install-runtime-conformant, project-memory-conformant, workflow-conformant, project-tier-high-touch-conformant, project-tier-remainder-conformant]
outputs: [grep-gate-wired]
verifies: "Running the documented grep-gate command (hyphen+underscore key-set) over all of P_live returns 0 leak files outside archive/ — clearing BOTH the 63 hyphen-form baseline AND the 5 underscore-form install-runtime docs (cumulative SC2); the command excludes archive/ (anywhere) + sessions/skills/tmp/ + the top-level agents/ spec dir, and KEEPS features/agents/; git diff confirms only worktree skills/memorization/rules.md changed."
```

### P1 — Prose: features/agents (14 docs)
```yaml
id: P1-prose-agents
what: Per-type prose rewrite of features/agents docs toward the quality bar — apply type-purity (D1/Diátaxis), the per-type section contracts (D4), and self-contained prose (D5; judgment-based de-crypt of remaining cryptic body references). Reclassify any mislabeled session-journal to notes/ rather than deleting (D9). Archive-safe by exclusion.
traces-to:
  - "Prose-quality wave (wave 2): per-type prose rewrite toward the quality bar."
requires: [01-conform-agents]
files:
  - path: ".gobbi/projects/gobbi/features/agents/**/*.md"
    op: modify
    exclude: "**/archive/**"
inputs: [agents-conformant]
outputs: [agents-prose-quality]
verifies: "Evaluator runs the §4 section-contract checklist on sample docs per type -> pass; D5 grep-assistable cryptic-coord scan on evergreen-type bodies returns 0 for confirmed cases; git diff confirms only worktree features/agents paths (no archive/) changed."
```

### P2 — Prose: features/evaluation (15 docs)
```yaml
id: P2-prose-evaluation
what: Per-type prose rewrite of features/evaluation docs toward the quality bar — apply D1/D4/D5; reclassify mislabeled session-journals to notes/ (D9), never delete. Archive-safe by exclusion.
traces-to:
  - "Prose-quality wave (wave 2): per-type prose rewrite toward the quality bar."
requires: [02-conform-evaluation]
files:
  - path: ".gobbi/projects/gobbi/features/evaluation/**/*.md"
    op: modify
    exclude: "**/archive/**"
inputs: [evaluation-conformant]
outputs: [evaluation-prose-quality]
verifies: "Evaluator runs the §4 section-contract checklist on sample docs per type -> pass; D5 cryptic-coord scan returns 0 for confirmed cases; git diff confirms only worktree features/evaluation paths (no archive/) changed."
```

### P3a — Prose: features/git-workflow A — discussions+design+decisions (20 docs) — P3 SPLIT 1/2 (iter2)
```yaml
id: P3a-prose-git-workflow-a
what: Per-type prose rewrite of features/git-workflow discussions, design, and decisions docs toward the quality bar — apply D1/D4/D5; reclassify mislabeled session-journals to notes/ (D9), never delete. Mirrors the T3 conformance boundary. Explicit subdir enumeration — archive-clean.
traces-to:
  - "Prose-quality wave (wave 2): per-type prose rewrite toward the quality bar."
requires: [03-conform-git-workflow-a]
files:
  - path: ".gobbi/projects/gobbi/features/git-workflow/discussions/**/*.md"
    op: modify
  - path: ".gobbi/projects/gobbi/features/git-workflow/design/**/*.md"
    op: modify
  - path: ".gobbi/projects/gobbi/features/git-workflow/decisions/**/*.md"
    op: modify
inputs: [git-workflow-a-conformant]
outputs: [git-workflow-a-prose-quality]
verifies: "Evaluator runs the §4 section-contract checklist on sample docs per type -> pass; D5 cryptic-coord scan returns 0 for confirmed cases; git diff confirms only worktree features/git-workflow/{discussions,design,decisions} paths changed."
```

### P3b — Prose: features/git-workflow B — rest + README (21 docs) — P3 SPLIT 2/2 (iter2)
```yaml
id: P3b-prose-git-workflow-b
what: Per-type prose rewrite of the remaining features/git-workflow docs (backlogs, changelogs, checklists, plans, references, scenarios) and the feature README toward the quality bar — apply D1/D4/D5; reclassify mislabeled session-journals to notes/ (D9), never delete. Mirrors the T4 conformance boundary. Explicit subdir enumeration — archive-clean.
traces-to:
  - "Prose-quality wave (wave 2): per-type prose rewrite toward the quality bar."
requires: [04-conform-git-workflow-b, P3a-prose-git-workflow-a]
files:
  - path: ".gobbi/projects/gobbi/features/git-workflow/{backlogs,changelogs,checklists,plans,references,scenarios}/**/*.md"
    op: modify
  - path: ".gobbi/projects/gobbi/features/git-workflow/README.md"
    op: modify
inputs: [git-workflow-conformant, git-workflow-a-prose-quality]
outputs: [git-workflow-b-prose-quality]
verifies: "Evaluator runs the §4 section-contract checklist on sample docs per type -> pass; D5 cryptic-coord scan returns 0 for confirmed cases; git diff confirms only worktree features/git-workflow {backlogs,changelogs,checklists,plans,references,scenarios,README} paths changed."
```

### P4 — Prose: features/guardrails (10 docs)
```yaml
id: P4-prose-guardrails
what: Per-type prose rewrite of features/guardrails docs toward the quality bar — apply D1/D4/D5; reclassify mislabeled session-journals to notes/ (D9), never delete. Archive-safe by exclusion.
traces-to:
  - "Prose-quality wave (wave 2): per-type prose rewrite toward the quality bar."
requires: [05-conform-guardrails]
files:
  - path: ".gobbi/projects/gobbi/features/guardrails/**/*.md"
    op: modify
    exclude: "**/archive/**"
inputs: [guardrails-conformant]
outputs: [guardrails-prose-quality]
verifies: "Evaluator runs the §4 section-contract checklist on sample docs per type -> pass; D5 cryptic-coord scan returns 0 for confirmed cases; git diff confirms only worktree features/guardrails paths (no archive/) changed."
```

### P5a — Prose: features/install-runtime A — discussions+design+decisions+changelogs (24 docs) — P5 SPLIT 1/2 (iter2)
```yaml
id: P5a-prose-install-runtime-a
what: Per-type prose rewrite of features/install-runtime discussions, design, decisions, and changelogs docs toward the quality bar — apply D1/D4/D5; reclassify mislabeled session-journals to notes/ (D9), never delete. Mirrors the T6 conformance boundary. Explicit subdir enumeration — archive-clean.
traces-to:
  - "Prose-quality wave (wave 2): per-type prose rewrite toward the quality bar."
requires: [06-conform-install-runtime-a]
files:
  - path: ".gobbi/projects/gobbi/features/install-runtime/{discussions,design,decisions,changelogs}/**/*.md"
    op: modify
inputs: [install-runtime-a-conformant]
outputs: [install-runtime-a-prose-quality]
verifies: "Evaluator runs the §4 section-contract checklist on sample docs per type -> pass; D5 cryptic-coord scan returns 0 for confirmed cases; git diff confirms only worktree features/install-runtime/{discussions,design,decisions,changelogs} paths changed."
```

### P5b — Prose: features/install-runtime B — rest + README (20 docs) — P5 SPLIT 2/2 (iter2)
```yaml
id: P5b-prose-install-runtime-b
what: Per-type prose rewrite of the remaining features/install-runtime docs (backlogs, checklists, references, scenarios) and the feature README toward the quality bar — apply D1/D4/D5; reclassify mislabeled session-journals to notes/ (D9), never delete. Mirrors the T7 conformance boundary. Explicit subdir enumeration — archive-clean (install-runtime/archive/references/ excluded).
traces-to:
  - "Prose-quality wave (wave 2): per-type prose rewrite toward the quality bar."
requires: [07-conform-install-runtime-b, P5a-prose-install-runtime-a]
files:
  - path: ".gobbi/projects/gobbi/features/install-runtime/{backlogs,checklists,references,scenarios}/**/*.md"
    op: modify
  - path: ".gobbi/projects/gobbi/features/install-runtime/README.md"
    op: modify
inputs: [install-runtime-conformant, install-runtime-a-prose-quality]
outputs: [install-runtime-b-prose-quality]
verifies: "Evaluator runs the §4 section-contract checklist on sample docs per type -> pass; D5 cryptic-coord scan returns 0 for confirmed cases; git diff confirms only worktree features/install-runtime {backlogs,checklists,references,scenarios,README} paths (no archive/) changed."
```

### P6 — Prose: features/project-memory + features/workflow (4 + 26 = 30 docs)
```yaml
id: P6-prose-project-memory-and-workflow
what: Per-type prose rewrite of features/project-memory and features/workflow docs toward the quality bar — apply D1/D4/D5; reclassify mislabeled session-journals to notes/ (D9), never delete. ARCHIVE-SAFE — EXCLUDES features/workflow/archive/ (the +1 the naive ** glob leaked).
traces-to:
  - "Prose-quality wave (wave 2): per-type prose rewrite toward the quality bar."
requires: [08-conform-project-memory, 09a-conform-workflow]
files:
  - path: ".gobbi/projects/gobbi/features/project-memory/**/*.md"
    op: modify
    exclude: "**/archive/**"
  - path: ".gobbi/projects/gobbi/features/workflow/**/*.md"
    op: modify
    exclude: "**/archive/**"
inputs: [project-memory-conformant, workflow-conformant]
outputs: [project-memory-prose-quality, workflow-prose-quality]
verifies: "Evaluator runs the §4 section-contract checklist on sample docs per type -> pass; D5 cryptic-coord scan returns 0 for confirmed cases; find over the two trees with -not -path '*/archive/*' returns 30 (4+26 — confirms archive excluded); git diff confirms only worktree features/{project-memory,workflow} paths (no archive/) changed."
```

### P7a — Prose: project-tier high-touch — decisions+design+learnings+notes+backlogs (35 docs) — P7 SPLIT 1/2 (iter2)
```yaml
id: P7a-prose-project-tier-high-touch
what: Per-type prose rewrite of the project-tier high-touch typed dirs (decisions/design/learnings/notes/backlogs, each incl dir README) toward the quality bar — apply D1/D4/D5; reclassify mislabeled session-journals to notes/ (D9), never delete; preserve legitimate per-type keys. Mirrors the T9b conformance boundary. Single-level glob — does not descend into PM/archive/.
traces-to:
  - "Prose-quality wave (wave 2): per-type prose rewrite toward the quality bar."
requires: [09b-conform-project-tier-high-touch]
files:
  - path: ".gobbi/projects/gobbi/{decisions,design,learnings,notes,backlogs}/*.md"
    op: modify
inputs: [project-tier-high-touch-conformant]
outputs: [project-tier-high-touch-prose-quality]
verifies: "Evaluator runs the §4 section-contract checklist on sample docs per type -> pass; D5 cryptic-coord scan returns 0 for confirmed cases; disposition preserved on backlogs; git diff confirms only worktree PM/{decisions,design,learnings,notes,backlogs} paths changed (no PM/archive/)."
```

### P7b — Prose: project-tier remainder + 2 index READMEs — references+reviews+rules+plans+mistakes + features/README + project-root README (33 docs) — P7 SPLIT 2/2 (iter2)
```yaml
id: P7b-prose-project-tier-remainder
what: Per-type prose rewrite of the project-tier remainder typed dirs (references/reviews/rules/plans/mistakes, each incl dir README) plus features/README.md and the project-root README.md toward the quality bar — apply D1/D4/D5; reclassify mislabeled session-journals to notes/ (D9), never delete; preserve legitimate per-type keys (priority/domain on mistakes, verdict/review_kind/subject on reviews). Mirrors the T9c conformance boundary. Single-level glob — does not descend into PM/archive/.
traces-to:
  - "Prose-quality wave (wave 2): per-type prose rewrite toward the quality bar."
requires: [09c-conform-project-tier-remainder, P7a-prose-project-tier-high-touch]
files:
  - path: ".gobbi/projects/gobbi/{references,reviews,rules,plans,mistakes}/*.md"
    op: modify
  - path: ".gobbi/projects/gobbi/features/README.md"
    op: modify
  - path: ".gobbi/projects/gobbi/README.md"
    op: modify
inputs: [project-tier-remainder-conformant, project-tier-high-touch-prose-quality]
outputs: [project-tier-remainder-prose-quality]
verifies: "Evaluator runs the §4 section-contract checklist on sample docs per type -> pass; D5 cryptic-coord scan returns 0 for confirmed cases; legitimate per-type keys intact (priority/domain on mistakes, verdict/review_kind/subject on reviews); git diff confirms only worktree PM/{references,reviews,rules,plans,mistakes} + 2 index README paths changed (no PM/archive/, no features/*/archive/)."
```

### N1 — Tier-3 nav: README Subdirectories accuracy (Wave 3)
```yaml
id: N1-readme-subdirs-nav
what: Verify each of the 18 feature/index README "Subdirectories" sections lists the subdirs that actually exist; optionally add a top-level index pointer. Runs LAST; must not block tier-1. ARCHIVE-SAFE — EXCLUDES the 5 frozen archive/ READMEs (archive/README.md + 4 archive/features/*/README.md).
traces-to:
  - "IN-SCOPE as a light final wave (tertiary priority): verify each feature README.md's Subdirectories section lists the subdirs that actually exist; optionally add a top-level index pointer."
requires: [P1-prose-agents, P2-prose-evaluation, P3a-prose-git-workflow-a, P3b-prose-git-workflow-b, P4-prose-guardrails, P5a-prose-install-runtime-a, P5b-prose-install-runtime-b, P6-prose-project-memory-and-workflow, P7a-prose-project-tier-high-touch, P7b-prose-project-tier-remainder]
files:
  - path: ".gobbi/projects/gobbi/**/README.md"
    op: modify
    exclude: "**/archive/**"
inputs: [agents-prose-quality, evaluation-prose-quality, git-workflow-a-prose-quality, git-workflow-b-prose-quality, guardrails-prose-quality, install-runtime-a-prose-quality, install-runtime-b-prose-quality, project-memory-prose-quality, workflow-prose-quality, project-tier-high-touch-prose-quality, project-tier-remainder-prose-quality]
outputs: [readme-nav-accurate]
verifies: "find PM -name README.md -not -path '*/archive/*' -not -path '*/sessions/*' -not -path '*/skills/*' -not -path '*/tmp/*' returns 18 (NOT 23 — proves the 5 archive READMEs excluded); each README Subdirectories list matches `ls -d <feature>/*/` for that dir; no missing or phantom subdir entries across all 18 READMEs; git diff confirms only worktree README.md paths (no archive/) changed."
```

---

## Dependency table

| Task | Depends on | Blocks | Files touched |
|---|---|---|---|
| T0 standard | — | T1-T11, all prose, N1 | `skills/memorization/rules.md` |
| T1 agents | T0 | T11, P1 | `features/agents/**` (archive-safe) |
| T2 evaluation | T0 | T11, P2 | `features/evaluation/**` (archive-safe) |
| T3 git-workflow A | T0 | T4, P3a | `features/git-workflow/{discussions,design,decisions}/**` |
| T4 git-workflow B | T0, T3 | T11, P3b | `features/git-workflow/{backlogs,changelogs,checklists,plans,references,scenarios,README}` |
| T5 guardrails | T0 | T11, P4 | `features/guardrails/**` (archive-safe) |
| T6 install-runtime A | T0 | T7, P5a | `features/install-runtime/{discussions,design,decisions,changelogs}/**` |
| T7 install-runtime B | T0, T6 | T11, P5b | `features/install-runtime/{backlogs,checklists,references,scenarios,README}` |
| T8 project-memory | T0 | T11, P6 | `features/project-memory/**` (archive-safe) |
| T9a workflow | T0 | T11, P6 | `features/workflow/**` (archive-safe — excludes archive/) |
| T9b project-tier high-touch | T0 | T11, P7a | `{decisions,design,learnings,notes,backlogs}/*.md` |
| T9c project-tier remainder | T0 | T11, P7b | `{references,reviews,rules,plans,mistakes}/*.md` + `features/README.md` + `README.md` |
| T10 .codex/AGENTS.md | T0 | — | `.codex/AGENTS.md` (WORKTREE copy; AGENTS.md symlink auto-reflects) |
| T11 grep gate | T0, T1, T2, T4, T5, T7, T8, T9a, T9b, T9c (10 DIRECT edges) — covers ALL 11 conformance records by transitive closure (T3→T4, T6→T7) | — | `skills/memorization/rules.md` |
| P1 prose agents | T1 | N1 | `features/agents/**` (archive-safe) |
| P2 prose evaluation | T2 | N1 | `features/evaluation/**` (archive-safe) |
| P3a prose git-workflow A | T3 | P3b, N1 | `features/git-workflow/{discussions,design,decisions}/**` |
| P3b prose git-workflow B | T4, P3a | N1 | `features/git-workflow/{backlogs,changelogs,checklists,plans,references,scenarios,README}` |
| P4 prose guardrails | T5 | N1 | `features/guardrails/**` (archive-safe) |
| P5a prose install-runtime A | T6 | P5b, N1 | `features/install-runtime/{discussions,design,decisions,changelogs}/**` |
| P5b prose install-runtime B | T7, P5a | N1 | `features/install-runtime/{backlogs,checklists,references,scenarios,README}` |
| P6 prose pm+workflow | T8, T9a | N1 | `features/{project-memory,workflow}/**` (archive-safe) |
| P7a prose project-tier high-touch | T9b | P7b, N1 | `{decisions,design,learnings,notes,backlogs}/*.md` |
| P7b prose project-tier remainder | T9c, P7a | N1 | `{references,reviews,rules,plans,mistakes}/*.md` + 2 index READMEs |
| N1 nav | P1, P2, P3a, P3b, P4, P5a, P5b, P6, P7a, P7b (all 10 prose tasks) | — | all 18 README.md (archive-safe) |

**T11 dependency note (iter2 — closes Codex F3):** T11 carries **10 DIRECT `requires` edges** (T0 + the 9
leaf conformance records: T1, T2, T4, T5, T7, T8, T9a, T9b, T9c). It transitively depends on the
remaining 2 conformance records — **T3 via T4** (T4 requires T3) and **T6 via T7** (T7 requires T6) — so
its prerequisite closure is **all 11 conformance records**, even though the direct edge list has 10
entries. This is intentional: T4/T7 each verify their feature's A+B leak gate cumulatively, so requiring
the B half pulls in the A half. No phantom edge is needed.

**Ordering decision (HONORS carry-forward — DL-A):** ALL Wave-1 conformance for a given file group
completes and commits BEFORE any Wave-2 prose touches the same file. This is the carry-forward's
"do not interleave conformance + prose edits on the same file" rule, satisfied by the per-group
`requires` edges (each prose sub-task requires its matching Wave-1 conformance task). Within Wave 1, split
halves of a feature (T3→T4, T6→T7) are sequenced (B requires A) because they share the same feature tree
and the cumulative-feature leak gate in B verifies A+B together; the prose splits mirror this (P3b
requires P3a; P5b requires P5a; P7b requires P7a). T0 blocks every retrofit task (the standard is the
spec they verify against). T11 (grep gate) requires the 10 leaf conformance tasks (covering all 11 by
transitive closure) because it verifies the cumulative 0-leak criterion over all of P_live. N1 runs last
(after all 10 prose tasks) so the nav reflects the final tree.

---

## Parallel lanes

Execution runs **sequentially** (one task at a time) — lanes are documentation only. Recommended
execution order: T0 → T1 → T2 → T3 → T4 → T5 → T6 → T7 → T8 → T9a → T9b → T9c → T10 → T11 →
P1 → P2 → P3a → P3b → P4 → P5a → P5b → P6 → P7a → P7b → N1.

| Lane | Tasks | Order |
|---|---|---|
| Foundation | T0 | first, alone |
| Conformance (independent features) | T1, T2, T5, T8, T9a, T9b, T9c | any order after T0 |
| Conformance (git-workflow chain) | T3 → T4 | T3 before T4 |
| Conformance (install-runtime chain) | T6 → T7 | T6 before T7 |
| Reconciliation | T10 | any time after T0 |
| Enforcement | T11 | after the 10 leaf conformance tasks |
| Prose (split chains) | P3a → P3b; P5a → P5b; P7a → P7b | A before B in each |
| Prose (independent) | P1, P2, P4, P6 | each after its matching Wave-1 conformance task |
| Nav | N1 | last, after all 10 prose tasks |

**Conflict flags:**
- ⚠ T3 and T4 both touch `features/git-workflow/` — sequential (T4 requires T3), not parallel-safe.
- ⚠ T6 and T7 both touch `features/install-runtime/` — sequential (T7 requires T6).
- ⚠ P3a and P3b both touch `features/git-workflow/` — sequential (P3b requires P3a); disjoint subdir
  sets, but serialized to honor the carry-forward and avoid concurrent same-tree edits.
- ⚠ P5a and P5b both touch `features/install-runtime/` — sequential (P5b requires P5a).
- ⚠ P7a and P7b both touch the project tier — disjoint dir sets, but P7b requires P7a (serialized).
- ⚠ T0 and T11 both touch `skills/memorization/rules.md` — T11 requires T0; sequential. No other task
  touches `rules.md`.
- ⚠ Each prose task touches the SAME files as its matching Wave-1 conformance task (e.g., P1 ↔ T1 on
  `features/agents/**`; P3a ↔ T3; P5b ↔ T7) — the `requires` edge is the conflict mitigation:
  conformance is committed before prose touches the file (carry-forward honored).
- ⚠ N1 touches all 18 README.md — each of those READMEs is also touched by a prose task (P1-P7b).
  N1 requires all 10 prose tasks, so it runs strictly after; no concurrent edit.
- ⚠ T9c and P7b both edit `features/README.md` + `PM/README.md` (the 2 index READMEs); N1 also edits
  them. Ordering T9c → P7b → N1 (via `requires`) serializes the three. Not parallel-safe.
- ✓ No two Wave-1 conformance tasks share any file (disjoint feature/dir globs).
- ✓ No task edit-set includes any `archive/` path (top-level or nested) — every `**` glob is archive-safe.

---

## Agent assignments

Defaults per `delegation/SKILL.md`: executor→sonnet. Conformance + reconciliation + grep-gate tasks are
single-category mechanical/doc edits → `executor`. Prose tasks (P1-P7b) are judgment-heavier rewrites but
still single-category documentation work → `executor` (no `leader`/sub-decomposition: the split decisions
are made HERE). T0 is authoring (single-category doc work) → `executor`.

**Evaluation cadence (Decision 3 — MAX RIGOR):** **dual-system evaluation (Claude Code + Codex) on EVERY
task** — T0, every conformance task (T1-T9c), T10, T11, every prose task (P1-P7b), and N1 — PLUS the
Planning-loop EVALUATION on this plan itself. No single-system shortcut on any task, including trivial
iter2 fixes. The manager runs the two-evaluator reconciliation per `evaluation/SKILL.md` after each task.

**Required skills (ALL tasks):** `principles`, `mistake`, `execution`, `memorization`, plus `git`
(every task commits). Retrofit/standard tasks also load the dev-doc quality standard §4 in
`memorization/rules.md` (the spec they verify against — T0 authors it; all others read it).

**Required mistakes (ALL retrofit/standard/prose tasks):**
- `skills-mirror-symlinks-not-copies` + `edit-tool-refuses-symlink-paths` — T0/T11 edit the CANONICAL
  `rules.md`, never the `.claude/` symlink. **Also CRITICAL for T10:** `AGENTS.md` is a symlink →
  `.codex/AGENTS.md`; T10 edits the REAL file `.codex/AGENTS.md` only — editing the symlink path fails.
- `executor-main-tree-edit` (+ near-miss / mirror-path / worktree-physical variants) — every edit targets
  the WORKTREE-physical path, verified via `git diff --name-only` in the worktree. **CRITICAL for T10**
  (`.codex/AGENTS.md` exists in BOTH the main tree and the worktree — edit the WORKTREE copy only).
- `sendmessage-continued-cwd-resets-to-main-tree` — re-`cd` to the worktree root at the start of every
  Bash call; never rely on persisted cwd.
- `naming-standard-needs-positive-guidance-not-just-blocklist` — T0 leads with positive guidance.
- `design-literal-retire-instruction-without-replacement` — never delete narrative; reclassify to
  `notes/` (D9). Applies to any prose task that finds a mislabeled session-journal.
- `manager-context-overflow-with-large-bundle` — manager-level; informs the ≤35-doc wave-bounding,
  the T9 3-way split, the iter2 prose splits (P3/P5/P7), and the 25-task single-session sequencing under
  dual-system eval.

| Task | Agent | Model | Eval | Skills (beyond the 5 always) | Mistakes (key) |
|---|---|---|---|---|---|
| T0 | executor | sonnet | dual-system | dev-doc std §4 (authors) | symlink-canonical, worktree-edit, cwd-reset, naming-positive |
| T1 | executor | sonnet | dual-system | dev-doc std §4 | worktree-edit, cwd-reset, never-delete, preserve-disposition |
| T2 | executor | sonnet | dual-system | dev-doc std §4 | worktree-edit, cwd-reset, never-delete |
| T3 | executor | sonnet | dual-system | dev-doc std §4 | worktree-edit, cwd-reset, never-delete |
| T4 | executor | sonnet | dual-system | dev-doc std §4 | worktree-edit, cwd-reset, never-delete, preserve-disposition |
| T5 | executor | sonnet | dual-system | dev-doc std §4 | worktree-edit, cwd-reset, never-delete, preserve-disposition |
| T6 | executor | sonnet | dual-system | dev-doc std §4 | worktree-edit, cwd-reset, never-delete, underscore-key-strip |
| T7 | executor | sonnet | dual-system | dev-doc std §4 | worktree-edit, cwd-reset, never-delete, preserve-disposition |
| T8 | executor | sonnet | dual-system | dev-doc std §4 | worktree-edit, cwd-reset, never-delete |
| T9a | executor | sonnet | dual-system | dev-doc std §4 | worktree-edit, cwd-reset, never-delete, archive-exclude |
| T9b | executor | sonnet | dual-system | dev-doc std §4 | worktree-edit, cwd-reset, never-delete, preserve-disposition |
| T9c | executor | sonnet | dual-system | dev-doc std §4 | worktree-edit, cwd-reset, never-delete, preserve-per-type-keys |
| T10 | executor | sonnet | dual-system | dev-doc std §4 | **symlink-edit (AGENTS.md→.codex/AGENTS.md; edit REAL file only)**, **worktree-edit (CRITICAL — .codex/AGENTS.md in BOTH trees)**, cwd-reset |
| T11 | executor | sonnet | dual-system | dev-doc std §4 | symlink-canonical, worktree-edit, cwd-reset, underscore-key-set |
| P1 | executor | sonnet | dual-system | dev-doc std §4 | worktree-edit, cwd-reset, never-delete, reclassify-to-notes, archive-exclude |
| P2 | executor | sonnet | dual-system | dev-doc std §4 | worktree-edit, cwd-reset, never-delete, reclassify-to-notes, archive-exclude |
| P3a | executor | sonnet | dual-system | dev-doc std §4 | worktree-edit, cwd-reset, never-delete, reclassify-to-notes |
| P3b | executor | sonnet | dual-system | dev-doc std §4 | worktree-edit, cwd-reset, never-delete, reclassify-to-notes |
| P4 | executor | sonnet | dual-system | dev-doc std §4 | worktree-edit, cwd-reset, never-delete, reclassify-to-notes, archive-exclude |
| P5a | executor | sonnet | dual-system | dev-doc std §4 | worktree-edit, cwd-reset, never-delete, reclassify-to-notes |
| P5b | executor | sonnet | dual-system | dev-doc std §4 | worktree-edit, cwd-reset, never-delete, reclassify-to-notes |
| P6 | executor | sonnet | dual-system | dev-doc std §4 | worktree-edit, cwd-reset, never-delete, reclassify-to-notes, archive-exclude |
| P7a | executor | sonnet | dual-system | dev-doc std §4 | worktree-edit, cwd-reset, never-delete, reclassify-to-notes |
| P7b | executor | sonnet | dual-system | dev-doc std §4 | worktree-edit, cwd-reset, never-delete, reclassify-to-notes, preserve-per-type-keys |
| N1 | executor | sonnet | dual-system | dev-doc std §4 | worktree-edit, cwd-reset, archive-exclude |

No non-default agent type or model override is proposed. Justification: every task is a single-category
documentation edit/authoring task with a runnable verification — the canonical `executor`+sonnet profile
fits. The T9 split and the iter2 prose splits are decided in this plan, not delegated, so no `leader`
agent is needed.

---

## Self-review report

### Spec coverage (every Success Criterion / In-Scope item → a task)

| Source item | Task(s) |
|---|---|
| SC1 written standard scoreable | T0 |
| SC2 100% base schema + 0 leaks (denominator = 204 content / 222 total; leak target = 63 hyphen ∪ 5 underscore → 0) | T1-T9c (per-group), T11 (cumulative) |
| SC3 every type has a section contract | T0 (D4) |
| SC4 positive guidance + examples | T0 (D3) |
| In-Scope conformance wave (Wave 1) | T1, T2, T3, T4, T5, T6, T7, T8, T9a, T9b, T9c |
| In-Scope prose wave (Wave 2) | P1, P2, P3a, P3b, P4, P5a, P5b, P6, P7a, P7b |
| In-Scope tier-2 grep gate | T11 |
| In-Scope tier-3 nav wave (Wave 3) | N1 |
| AGENTS.md reconciliation (Low — user-confirmed IN) | T10 (edits real `.codex/AGENTS.md`) |
| FIX-1 disposition preservation on backlogs | T1, T4, T5, T7, T9a, T9b verifies |
| FIX-1 underscore-key strip (DOC-CONS-2) | T6, T7 verifies; T11 cumulative; T0 encodes underscore in key-set S |
| FIX-1 per-type-key preservation (mistakes/reviews) | T9c, P7b verifies |
| D9 reclassify-not-delete | mistake injected into every prose task |
| D10 exclude frozen archive/ | every leak gate + grep gate + every `**` `files:` glob excludes `archive/` |

Every task has a `traces-to` anchor (exact text from scope-contract.md / idea.md). No anchor-less task.
Every In-Scope / Success-Criterion item maps to ≥1 task. **Every P_live doc (222) is assigned to exactly
one Wave-1 conformance task** (154 feature + 68 project-tier = 222 — see § File map cross-foot) and to
exactly one Wave-2 prose task (same partition; P3a/P3b span git-workflow A/B; P5a/P5b span install-runtime
A/B; P6 = pm+workflow; P7a/P7b span project-tier high-touch/remainder).

### Placeholder scan
`TBD / TODO / to be defined / <...> / XXX / FIXME` scan over all task `what` + `verifies` fields:
**0 hits.** No PENDING / DEFER flags remain — all five user decisions are ratified (DL-A..DL-E). The
angle-bracket tokens in the Counts note / File map (`<typed-dirs>`, `<feature>`) are prose descriptions of
glob/command shape inside narrative, not task-field placeholders.

### Type / name consistency
- File globs use one spelling per feature/dir; every `**` glob is archive-safe (explicit `exclude` or
  enumeration) and matches the count predicate (re-verified in § Counts note: workflow 26, install-runtime
  44, READMEs 18).
- `outputs`/`inputs` chain consistently:
  - T0 emits `dev-doc-quality-standard-section`, consumed by every retrofit task.
  - T3 emits `git-workflow-a-conformant` → consumed by T4; T4 emits `git-workflow-conformant`.
  - T6 emits `install-runtime-a-conformant` → consumed by T7; T7 emits `install-runtime-conformant`.
  - T9a→`workflow-conformant`, T9b→`project-tier-high-touch-conformant`, T9c→`project-tier-remainder-conformant`.
  - T11 consumes the 10 leaf `*-conformant` outputs (all 11 conformance records by transitive closure).
  - Prose chain: P3a emits `git-workflow-a-prose-quality` → consumed by P3b; P5a→P5b; P7a→P7b. Each prose
    task consumes its matching `*-conformant` output and emits a `*-prose-quality` output; N1 consumes all
    11 `*-prose-quality` outputs (agents, evaluation, gw-a, gw-b, guardrails, ir-a, ir-b, project-memory,
    workflow, pt-high-touch, pt-remainder). **0 dangling references.**
- The FIX-1 key-set S and predicate P are referenced by name (not re-derived), now explicitly including
  underscore spellings — consistent with `design-options.md` D6 + the iter2 DOC-CONS-2 extension.

### Self-review findings (closed)
- **SR-FINDING-1 (resolved by Decision 4 / DL-D):** Population baseline undercount 208→222, 191→204,
  leak 59→63. Filter bug excluded `features/agents/`. Plan restated against the true figures; the
  corrected `find` is re-run and pasted in the Counts note. NOT a scope change (agents always in-scope).
- **SR-FINDING-2 (resolved by Decision 5 / DL-E):** T9 (93 docs) exceeds the ceiling → split into
  T9a (workflow 26) / T9b (project-tier high-touch 35) / T9c (project-tier remainder + 2 index READMEs 33).
  Each ≤35. Cross-foots to 93 (T9 total) and to 222 (whole plan).
- **SR-FINDING-3 (iter2, resolved by DL-H):** Prose tasks P3/P5/P7 (41/44/68) exceeded the ≤35 ceiling →
  split P3→P3a/P3b, P5→P5a/P5b, P7→P7a/P7b along the conformance A/B boundaries. Each ≤35. Task total
  22→25.
- **SR-FINDING-4 (iter2, resolved by DL-I):** Every `**` `files:` glob would leak frozen `archive/` docs
  (2 content + 5 READMEs) → all `**` globs made archive-safe; T3/T4/T6/T7/T9b/T9c already archive-clean.
- **SR-FINDING-5 (iter2, resolved by DL-J):** Leak gate key-set was hyphen-only → false "0 leaks" on 5
  underscore-key install-runtime docs → key-set S extended to underscore spellings.
- **SR-FINDING-6 (iter2, resolved by DL-K):** T10 mismodeled `AGENTS.md` as a 2nd real file → it is a
  symlink → `.codex/AGENTS.md`; T10 now edits only the real file.

---

## NOT in scope

- Re-homing docs / re-litigating PR #272's re-home + naming standard.
- Big-bang single-pass rewrite (waves are explicit; conformance precedes prose per file).
- **A new dev-doc-quality EVALUATION PERSPECTIVE or full Principle-13 quality-facet encoding** —
  DEFERRED (FLAG-2; backlog `ideation/staging/backlogs/project/evaluation-perspective-for-dev-doc-quality.md`).
  Distinct from the dual-system eval cadence in Decision 3, which uses the EXISTING perspectives.
- **`.claude/`-published-doc authoring standard surgery** (the `claude` skill's domain) — DEFERRED
  (FLAG-3); this plan only edits project-memory under `.gobbi/projects/gobbi/` + the `.codex/AGENTS.md`
  real file (AGENTS.md symlink auto-reflects). It does not change the `.claude/` published-docs authoring
  standard.
- Frozen `archive/` docs (anywhere, incl. nested `features/*/archive/` and top-level `PM/archive/`) —
  excluded from standard, retrofit, prose, gate, AND every task edit-glob (D10 + iter2 archive-safety
  invariant). The 7 frozen docs (2 content + 5 READMEs) are enumerated in the Counts note.
- Stripping `disposition` from `backlogs/` files or any legitimate per-type key — `priority`/`domain`
  on `mistakes/`, `verdict`/`review_kind`/`subject` on `reviews/` (FIX-1 safety invariant).
- The top-level non-memory `agents/` agent-spec dir (`.gobbi/projects/gobbi/agents/*.md/.toml`) —
  NOT memory; governed by its own conventions. Distinct from the in-scope `features/agents/`
  capability feature (T1/P1).
- Merging the PR #272 branch — deferred per the Ideation discussion
  (`ideation/staging/discussions/2026-05-26-build-on-272-branch-defer-merge.md`).

## Decisions log

- **DL-A (carry-forward HONORED):** Wave ordering = each file group's Wave-1 conformance committed before
  any Wave-2 prose touches the same file (per-group `requires` edges). Each retrofit task bounded ≤~35
  docs; the two large features split into halves (T3/T4, T6/T7); T9 split 3-way; **iter2 extends the same
  ceiling to the prose wave (P3/P5/P7 split)**. Reference `manager-context-overflow-with-large-bundle`.
  Source: `preparation/staging/decisions/context-budget-wave-ordering-carry-forward.md`.
- **DL-B (Decision 1 — SESSION SCOPE = ALL TASKS THIS SESSION):** No deferral. T0 + Wave 1
  conformance (T1-T9c) + T10 + T11 grep gate + Wave 2 prose (P1-P7b) + Wave 3 nav (N1) all execute this
  session. The prior draft's "defer Waves 2-3 to follow-up" recommendation is REMOVED.
- **DL-C (Decision 2 — T10 INCLUDED):** AGENTS.md 12→13 reconciliation is IN this session
  (user-confirmed). PENDING/DEFER flag removed. iter2: `AGENTS.md` is a symlink → `.codex/AGENTS.md`;
  T10 edits the REAL file `.codex/AGENTS.md` only (the symlink auto-reflects). Carries the
  `executor-main-tree-edit` + `edit-tool-refuses-symlink-paths` mistakes — `.codex/AGENTS.md` exists in
  the main tree AND the worktree; the executor edits the WORKTREE copy only, verified via
  `git diff --name-only`.
- **DL-D (Decision 4 — COUNT CORRECTION, not scope change):** TRUE baseline at HEAD d2b5b37 =
  **222 files / 18 READMEs / 204 content docs / 63 hyphen-form leaks**. The locked 208/191/59 figures were
  computed with a `find` predicate that wrongly excluded in-scope `features/agents/` (14 docs, 4 leaks).
  SC2 denominator restated to 204 content / 222 total; hyphen-leak target measured against 63.
  `features/agents/` stays fully in scope (T1). Corrected `find` commands + outputs pasted in
  § File map → Counts note.
- **DL-E (Decision 5 — T9 SPLIT):** The 93-doc T9 splits into three bounded sub-tasks (each ≤35):
  T9a `features/workflow` (26); T9b project-tier high-touch decisions+design+learnings+notes+backlogs (35);
  T9c project-tier remainder references+reviews+rules+plans+mistakes + features/README + project-root
  README (33). Each gets the canonical YAML schema + objective leak-gate verify. Cross-foots to 93 and
  to the whole-plan 222.
- **DL-F (Decision 3 — MAX-RIGOR EVAL CADENCE):** Dual-system evaluation (Claude Code + Codex) on EVERY
  task (T0, every conformance task, T10, T11, every prose task, N1) PLUS the Planning-loop EVALUATION.
  No single-system shortcut, including on trivial iter2 fixes. Recorded in § Agent assignments.
- **DL-G (CN-1 cross-foot, cosmetic):** Backlog-disposition legitimate count = 28 (this measurement) /
  27 under strict P_live; Execution uses the canonical figure consistently. Non-blocking; the 63-file
  leak set and the D6 predicate reproduce exactly (see Counts note). Source: design-options.md CN-1/N1.

### iter2 remediation (5 findings → fixes; preserves the iter1 approach + counts + ordering)

The iter1 plan PASSED on counts, ordering, schema, and partition (both systems re-verified 222/18/204/63
EXACTLY). Five surgical findings were flagged. Mapping each finding → fix:

- **DL-H — Finding 1 (Codex F1 = Claude DOC-STRUCT-1 / DOC-PERF-1, High): over-budget prose tasks.**
  P3 (41), P5 (44), P7 (68) abandoned the ≤35 ceiling that conformance honors. **Fix:** split along the
  conformance A/B boundaries — P3→P3a(20)/P3b(21) [T3/T4 boundary]; P5→P5a(24)/P5b(20) [T6/T7 boundary];
  P7→P7a(35)/P7b(33) [T9b/T9c boundary]. Each new prose sub-task `requires` its matching conformance task
  (P3a→T3, P3b→T4+P3a, P5a→T6, P5b→T7+P5a, P7a→T9b, P7b→T9c+P7a); N1 now requires all 10 prose tasks.
  Inputs/outputs re-threaded with new `*-a-prose-quality`/`*-b-prose-quality` names. **Task total 22→25.**
- **DL-I — Finding 2 (Claude DOC-PROJECT-1 / DOC-CONS-1 / DOC-RISK-2, High): archive-glob scope leak.**
  Every `**` `files:` glob (T1, T2, T5, T8, T9a, P1, P2, P4, P6, N1, plus the prose splits) would have
  edited frozen `archive/` docs (the 2 nested-feature-archive content docs + 5 top-level archive READMEs).
  **Fix:** every `**` glob carries `exclude: "**/archive/**"` in `files:` AND `-not -path "*/archive/*"` in
  `verifies`; T3/T4/T6/T7/T9b/T9c already enumerate subdirs (archive-clean by construction). Re-verified:
  workflow ** = 27 → archive-safe 26; install-runtime ** = 45 → 44; READMEs ** = 23 → 18 (all match the
  count predicate). Edit-glob now matches the count predicate exactly.
- **DL-J — Finding 3 (Claude DOC-CONS-2, Medium — Iron Law 11 gate-gaming): underscore staging keys.**
  The D6/FIX-1 key-set S was hyphen-only; 5 LIVE `features/install-runtime/` docs carry `promoted_from`/
  `promoted_at` (underscore) and NO hyphen key, so the iter1 gate would falsely certify them clean (SC2
  "0 leaks" false). **Fix:** key-set S extended to underscore spellings of every staging key (`promoted_from`,
  `promoted_at`, `staged_from`, `staged_at`, etc.) IN ADDITION to hyphen forms; T6/T7/T11 `verifies` gates
  detect both spellings; the 5 install-runtime docs are named in T6/T7 verifies. ALSO added explicit
  `disposition`-preservation assertions to T1 (agents — 1 backlog file) and T5 (guardrails — 3 backlog
  files), closing Codex F2. Re-verified: `grep -rlE '^(promoted_from|promoted_at):' install-runtime | grep
  -v /archive/ | wc -l` = 5; all 5 carry NO hyphen key (caught ONLY by the underscore extension).
- **DL-K — Finding 4 (Claude DOC-USAGE-2 / DOC-RISK-1, Medium): T10 symlink mismodel.** `AGENTS.md` is a
  SYMLINK → `.codex/AGENTS.md` (`readlink AGENTS.md` = `.codex/AGENTS.md`); editing the symlink path fails
  (mistake `edit-tool-refuses-symlink-paths`). **Fix:** T10 `files:` now lists ONLY `.codex/AGENTS.md`;
  `verifies` confirms the symlink, asserts `13 principles` in `.codex/AGENTS.md` (and via the symlink in
  `AGENTS.md`), `12 principles` count = 0, and `git diff --name-only` lists only `.codex/AGENTS.md`. The
  WORKTREE-edit guard is preserved (edit the worktree copy, not the main tree).
- **DL-L — Finding 5 (Codex F3, Low): count prose contradiction.** iter1 prose said "18 tasks"/"20
  records" while enumerating 22 IDs. **Fix:** normalized ALL count prose to the real total — **25
  executable records** after the prose splits (22 + 3). Added the T11 dependency note explaining its 10
  direct `requires` edges cover all 11 conformance records by transitive closure (T3→T4, T6→T7), with the
  direct prereqs listed.
