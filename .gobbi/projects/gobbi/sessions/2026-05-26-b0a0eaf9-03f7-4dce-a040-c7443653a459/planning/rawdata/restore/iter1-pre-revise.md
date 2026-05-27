# Restore point — iter 1 pre-REVISE
# Captured: 2026-05-26
# To re-run: copy this file back to draft-iter1.md

---
loop: planning
iter: 1
artifact_type: plan-draft
created_at: 2026-05-26
status: draft
related:
  - ideation/artifacts/idea.md
  - ideation/artifacts/scope-contract.md
  - ideation/artifacts/design-options.md
  - preparation/artifacts/handoff.md
  - preparation/staging/decisions/context-budget-wave-ordering-carry-forward.md
---

# Planning Draft (iter 1) — dev-doc-level project-memory standard

> **Finalized after manager↔user decision round.** All five user decisions (DL-A..DL-E below) are
> ratified and baked in. There are no remaining gates: every task in this plan executes **this
> session** (Decision 1), T10 is **IN** (Decision 2), evaluation is **MAX-RIGOR dual-system on every
> task** (Decision 3), the population baseline is **count-corrected to 222/18/204/63** (Decision 4),
> and T9 is **split into three bounded sub-tasks** (Decision 5).

## Scope reference

- **Locked design:** `ideation/artifacts/idea.md` + `scope-contract.md` + `design-options.md`
  (10 decisions D1-D10, FIX-1 type-aware predicate).
- **Readiness:** `preparation/artifacts/handoff.md` (READY) + carry-forward
  `preparation/staging/decisions/context-budget-wave-ordering-carry-forward.md` (HONORED — see DL-A).

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
| FIX-1 leak set | 59 | **63** (+4 in `features/agents/`) |
| Backlog-disposition (legit, preserved) | 27/28 | 28 |

**Success Criterion 2 restated:** 100% base-schema conformance + 0 illegitimate staging-key leaks,
measured over **204 content docs / 222 total**; leak target measured against the **63**-file baseline
(→ 0 outside `archive/`). Verification commands + outputs are pasted in § File map → Counts note.

---

## File map

All paths relative to worktree root `/.../worktrees/chore/session-2026-05-25-a10c82d6/`.
Project-memory root abbreviated `PM = .gobbi/projects/gobbi`.

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
| T1 agents | `features/agents/**` (incl README) | 14 | 1 | 4 |
| T2 evaluation | `features/evaluation/**` (incl README) | 15 | 2 | 8 |
| T3 git-workflow A | `features/git-workflow/{discussions,design,decisions}/**` | 20 | — | — |
| T4 git-workflow B | `features/git-workflow/{backlogs,changelogs,checklists,plans,references,scenarios}/** + README.md` | 21 | — | — |
| T5 guardrails | `features/guardrails/**` (incl README) | 10 | 1 | 5 |
| T6 install-runtime A | `features/install-runtime/{discussions,design,decisions,changelogs}/**` | 24 | — | — |
| T7 install-runtime B | `features/install-runtime/{backlogs,checklists,references,scenarios}/** + README.md` | 20 | — | — |
| T8 project-memory | `features/project-memory/**` (incl README) | 4 | 0 | 2 |
| T9a workflow | `features/workflow/**` (incl README) | 26 | 2 | 14 |
| T9b project-tier high-touch | `PM/{decisions,design,learnings,notes,backlogs}/*.md` (each incl dir README) | 35 | — | — |
| T9c project-tier remainder + 2 index READMEs | `PM/{references,reviews,rules,plans,mistakes}/*.md` + `features/README.md` + `PM/README.md` | 33 | — | 1 |

**Cross-foot:** feature groups (T1-T9a) = 14+15+20+21+10+24+20+4+26 = **154**; project-tier (T9b+T9c)
= 35+33 = **68**; total = **222** ✓. git-workflow A+B = 41; install-runtime A+B = 44.

### Wave 2 — Prose (per-feature/group rewrite toward the quality bar) — THIS SESSION (Decision 1)
Same 204 content docs, grouped identically to Wave 1; **one prose task per feature group + project-tier**
= **P1-P7** (7 tasks). Each applies type-purity (D1/Diátaxis), per-type section contracts (D4), and
self-contained prose (D5; judgment-based de-crypt of remaining cryptic body references).

### Wave 3 — Tier-3 nav — THIS SESSION (Decision 1)
**N1**: verify each of the 18 README "Subdirectories" sections lists the subdirs that actually exist;
optional top-level index pointer. Runs LAST.

### Enforcement (grep gate) — THIS SESSION
- **T11**: `PM/skills/memorization/rules.md` §4 includes (or references) the mechanical type-aware
  grep-gate command; the gate is a runnable verification, not a behavior change.

### Counts note — CORRECTED `find` (no agents exclusion) re-verified at HEAD d2b5b37

```
# total P_live files (exclude archive anywhere, sessions/skills/tmp, top-level agents/ spec dir;
# KEEP features/agents/):
$ find .gobbi/projects/gobbi -type f -name '*.md' \
    -not -path ".gobbi/projects/gobbi/archive/*" -not -path "*/archive/*" \
    -not -path ".gobbi/projects/gobbi/sessions/*" -not -path ".gobbi/projects/gobbi/skills/*" \
    -not -path ".gobbi/projects/gobbi/tmp/*" -not -path ".gobbi/projects/gobbi/agents/*" | wc -l
222

# READMEs:
$ find ... -name 'README.md' ... | wc -l
18

# content docs (non-README):
$ find ... -name '*.md' ! -name 'README.md' ... | wc -l
204

# FIX-1 leak files (key-set S unconditional + disposition only outside backlogs/, full predicate,
# INCLUDING features/agents/):
<bash loop applying the D6 predicate over the 222 in-scope files>
63
# of which, in features/agents/ (the 4 the filter bug hid):
#   features/agents/design/memorization-delegation-hard-gate.md
#   features/agents/backlogs/privacy-retention-agents-metadata-deferred.md
#   features/agents/scenarios/hook-silence-no-agents-mutation-diagnostic.md
#   features/agents/checklists/d-ref-codes-missing-inline-expansion.md
```
59 (filter-bugged) + 4 (agents) = **63** ✓ reproduces the corrected baseline exactly.

---

## Tasks

This plan defines **18 in-session tasks** (Decision 1 — everything ships this session):
**T0** (foundation) + **Wave 1 conformance T1-T9 (T9 split → T9a/T9b/T9c, so 11 conformance tasks)**
+ **T10** (AGENTS.md, IN per Decision 2) + **T11** (grep gate) + **Wave 2 prose P1-P7** + **Wave 3 nav N1**.
Counting the T9 split, the executable task list is **20 records** (T0, T1, T2, T3, T4, T5, T6, T7, T8,
T9a, T9b, T9c, T10, T11, P1, P2, P3, P4, P5, P6, P7, N1) — the user-facing "18 tasks" is the pre-split
shape (T9 as one); the split raises conformance from 9 to 11 sub-tasks. Every task below carries the
canonical YAML schema. **Evaluation cadence: dual-system (Claude + Codex) on EVERY task** (Decision 3).

### T0 — Author the dev-doc quality standard (FOUNDATION)
```yaml
id: 00-author-dev-doc-standard
what: Add a new "Dev-document quality standard" section (§4) to the canonical memorization/rules.md defining the positive quality bar (D3), per-type section contracts (D4), self-contained-prose rule (D5), the FIX-1 type-aware frontmatter conformance predicate (D6), and the mechanical grep-gate command — leading with positive guidance plus real before/after examples drawn from this tree.
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
verifies: "grep -nE '^## .*[Dd]ev-document quality' .gobbi/projects/gobbi/skills/memorization/rules.md returns the new section; AND git diff --name-only in the worktree lists skills/memorization/rules.md (NOT the .claude symlink); AND the section contains a positive definition + a before/after table + the FIX-1 predicate text + the grep-gate command."
```

### T1 — Conformance: features/agents (14 docs)
```yaml
id: 01-conform-agents
what: Bring all features/agents content docs + README to the base frontmatter schema and apply the FIX-1 type-aware staging-key strip (preserve legitimate per-type keys; strip disposition only on non-backlogs files), and de-crypt confirmed cryptic session-coordinates from evergreen-type doc bodies in this group.
traces-to:
  - "Conformance wave (wave 1, mechanical): type-aware frontmatter base-schema normalization + FIX-1 type-aware allowlist strip of illegitimate staging-routing keys + de-crypt cryptic session-internal coordinates from doc bodies."
requires: [00-author-dev-doc-standard]
files:
  - path: ".gobbi/projects/gobbi/features/agents/**/*.md"
    op: modify
inputs: [dev-doc-quality-standard-section]
outputs: [agents-conformant]
verifies: "Type-aware leak gate over features/agents returns 0 leak files (baseline 4); AND all 14 docs carry the 9 base keys (baseline 1 conformant); AND git diff --name-only confirms only worktree features/agents paths changed."
```

### T2 — Conformance: features/evaluation (15 docs)
```yaml
id: 02-conform-evaluation
what: Bring all features/evaluation content docs + README to the base frontmatter schema, apply the FIX-1 type-aware staging-key strip, and de-crypt confirmed cryptic session-coordinates from evergreen-type bodies in this group.
traces-to:
  - "Conformance wave (wave 1, mechanical): type-aware frontmatter base-schema normalization + FIX-1 type-aware allowlist strip of illegitimate staging-routing keys + de-crypt cryptic session-internal coordinates from doc bodies."
requires: [00-author-dev-doc-standard]
files:
  - path: ".gobbi/projects/gobbi/features/evaluation/**/*.md"
    op: modify
inputs: [dev-doc-quality-standard-section]
outputs: [evaluation-conformant]
verifies: "Type-aware leak gate over features/evaluation returns 0 (baseline 8); all 15 docs carry 9 base keys (baseline 2); git diff confirms only worktree features/evaluation paths changed."
```

### T3 — Conformance: features/git-workflow A — discussions+design+decisions (20 docs)
```yaml
id: 03-conform-git-workflow-a
what: Bring features/git-workflow discussions, design, and decisions content docs to the base frontmatter schema, apply the FIX-1 type-aware staging-key strip, and de-crypt confirmed cryptic session-coordinates from evergreen-type bodies in this group (includes the design/worktree-create-before-session-stamp.md de-crypt witness from idea.md).
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
verifies: "Type-aware leak gate over the three subdirs returns 0; all 20 docs carry 9 base keys; git diff confirms only those worktree paths changed."
```

### T4 — Conformance: features/git-workflow B — rest + README (21 docs)
```yaml
id: 04-conform-git-workflow-b
what: Bring the remaining features/git-workflow content docs (backlogs, changelogs, checklists, plans, references, scenarios) and the feature README to the base frontmatter schema, apply the FIX-1 type-aware staging-key strip (preserve disposition on backlogs), and de-crypt confirmed cryptic session-coordinates from evergreen-type bodies in this group.
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
verifies: "Type-aware leak gate over the whole features/git-workflow tree (A+B) returns 0; all 41 docs carry 9 base keys; disposition preserved on every backlogs file; git diff confirms only worktree features/git-workflow paths changed."
```

### T5 — Conformance: features/guardrails (10 docs)
```yaml
id: 05-conform-guardrails
what: Bring all features/guardrails content docs + README to the base frontmatter schema, apply the FIX-1 type-aware staging-key strip, and de-crypt confirmed cryptic session-coordinates from evergreen-type bodies in this group.
traces-to:
  - "Conformance wave (wave 1, mechanical): type-aware frontmatter base-schema normalization + FIX-1 type-aware allowlist strip of illegitimate staging-routing keys + de-crypt cryptic session-internal coordinates from doc bodies."
requires: [00-author-dev-doc-standard]
files:
  - path: ".gobbi/projects/gobbi/features/guardrails/**/*.md"
    op: modify
inputs: [dev-doc-quality-standard-section]
outputs: [guardrails-conformant]
verifies: "Type-aware leak gate over features/guardrails returns 0 (baseline 5); all 10 docs carry 9 base keys (baseline 1); git diff confirms only worktree features/guardrails paths changed."
```

### T6 — Conformance: features/install-runtime A — discussions+design+decisions+changelogs (24 docs)
```yaml
id: 06-conform-install-runtime-a
what: Bring features/install-runtime discussions, design, decisions, and changelogs content docs to the base frontmatter schema, apply the FIX-1 type-aware staging-key strip, and de-crypt confirmed cryptic session-coordinates from evergreen-type bodies in this group.
traces-to:
  - "Conformance wave (wave 1, mechanical): type-aware frontmatter base-schema normalization + FIX-1 type-aware allowlist strip of illegitimate staging-routing keys + de-crypt cryptic session-internal coordinates from doc bodies."
requires: [00-author-dev-doc-standard]
files:
  - path: ".gobbi/projects/gobbi/features/install-runtime/{discussions,design,decisions,changelogs}/**/*.md"
    op: modify
inputs: [dev-doc-quality-standard-section]
outputs: [install-runtime-a-conformant]
verifies: "Type-aware leak gate over the four subdirs returns 0; all 24 docs carry 9 base keys; git diff confirms only those worktree paths changed."
```

### T7 — Conformance: features/install-runtime B — rest + README (20 docs)
```yaml
id: 07-conform-install-runtime-b
what: Bring the remaining features/install-runtime content docs (backlogs, checklists, references, scenarios) and the feature README to the base frontmatter schema, apply the FIX-1 type-aware staging-key strip (preserve disposition on backlogs), and de-crypt confirmed cryptic session-coordinates from evergreen-type bodies in this group.
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
verifies: "Type-aware leak gate over the whole features/install-runtime tree (A+B) returns 0; all 44 docs carry 9 base keys; disposition preserved on every backlogs file; git diff confirms only worktree features/install-runtime paths changed."
```

### T8 — Conformance: features/project-memory (4 docs)
```yaml
id: 08-conform-project-memory
what: Bring all features/project-memory content docs + README to the base frontmatter schema, apply the FIX-1 type-aware staging-key strip, and de-crypt confirmed cryptic session-coordinates from evergreen-type bodies in this group.
traces-to:
  - "Conformance wave (wave 1, mechanical): type-aware frontmatter base-schema normalization + FIX-1 type-aware allowlist strip of illegitimate staging-routing keys + de-crypt cryptic session-internal coordinates from doc bodies."
requires: [00-author-dev-doc-standard]
files:
  - path: ".gobbi/projects/gobbi/features/project-memory/**/*.md"
    op: modify
inputs: [dev-doc-quality-standard-section]
outputs: [project-memory-conformant]
verifies: "Type-aware leak gate over features/project-memory returns 0 (baseline 2); all 4 docs carry 9 base keys (baseline 0); git diff confirms only worktree features/project-memory paths changed."
```

### T9a — Conformance: features/workflow (26 docs) — T9 SPLIT 1/3 (Decision 5)
```yaml
id: 09a-conform-workflow
what: Bring all features/workflow content docs + README to the base frontmatter schema, apply the FIX-1 type-aware staging-key strip (preserve disposition on backlogs), and de-crypt confirmed cryptic session-coordinates from evergreen-type bodies in this group.
traces-to:
  - "Conformance wave (wave 1, mechanical): type-aware frontmatter base-schema normalization + FIX-1 type-aware allowlist strip of illegitimate staging-routing keys + de-crypt cryptic session-internal coordinates from doc bodies."
requires: [00-author-dev-doc-standard]
files:
  - path: ".gobbi/projects/gobbi/features/workflow/**/*.md"
    op: modify
inputs: [dev-doc-quality-standard-section]
outputs: [workflow-conformant]
verifies: "Type-aware leak gate over features/workflow returns 0 (baseline 14); all 26 docs carry 9 base keys (baseline 2); disposition preserved on backlogs; git diff confirms only worktree features/workflow paths changed."
```

### T9b — Conformance: project-tier high-touch — decisions+design+learnings+notes+backlogs (35 docs) — T9 SPLIT 2/3
```yaml
id: 09b-conform-project-tier-high-touch
what: Bring the project-tier decisions, design, learnings, notes, and backlogs typed dirs (each incl its dir README) to the base frontmatter schema, apply the FIX-1 type-aware staging-key strip (preserve disposition on backlogs files), and de-crypt confirmed cryptic session-coordinates from evergreen-type bodies.
traces-to:
  - "Conformance wave (wave 1, mechanical): type-aware frontmatter base-schema normalization + FIX-1 type-aware allowlist strip of illegitimate staging-routing keys + de-crypt cryptic session-internal coordinates from doc bodies."
requires: [00-author-dev-doc-standard]
files:
  - path: ".gobbi/projects/gobbi/{decisions,design,learnings,notes,backlogs}/*.md"
    op: modify
inputs: [dev-doc-quality-standard-section]
outputs: [project-tier-high-touch-conformant]
verifies: "Type-aware leak gate over the five dirs returns 0; all 35 docs carry 9 base keys; disposition preserved on every backlogs file; git diff confirms only those worktree project-tier paths changed."
```

### T9c — Conformance: project-tier remainder + 2 index READMEs — references+reviews+rules+plans+mistakes + features/README + project-root README (33 docs) — T9 SPLIT 3/3
```yaml
id: 09c-conform-project-tier-remainder
what: Bring the project-tier references, reviews, rules, plans, and mistakes typed dirs (each incl its dir README) plus features/README.md and the project-root README.md to the base frontmatter schema, apply the FIX-1 type-aware staging-key strip (preserve legitimate per-type keys — priority/domain on mistakes, verdict/review_kind/subject on reviews), and de-crypt confirmed cryptic session-coordinates from evergreen-type bodies.
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
verifies: "Type-aware leak gate over the five dirs + 2 index READMEs returns 0 (baseline 1); all 33 docs carry 9 base keys; priority/domain preserved on mistakes; verdict/review_kind/subject preserved on reviews; git diff confirms only those worktree paths changed."
```

### T10 — Reconcile AGENTS.md 12→13 principle count (INCLUDED — Decision 2)
```yaml
id: 10-reconcile-agents-md-principle-count
what: Update AGENTS.md and .codex/AGENTS.md from "12 principles" to "13 principles" and add the P13 row, matching .claude/CLAUDE.md, as a narrow count-consistency fix. Edit the WORKTREE copies ONLY — both files exist in BOTH the main tree and the worktree.
traces-to:
  - "Reconcile AGENTS.md + .codex/AGENTS.md to 13 principles + add P13 row (PR-1 finding, Low) — user-confirmed IN."
requires: [00-author-dev-doc-standard]
files:
  - path: "AGENTS.md"
    op: modify
  - path: ".codex/AGENTS.md"
    op: modify
inputs: [dev-doc-quality-standard-section]
outputs: [agents-md-principle-count-reconciled]
verifies: "grep -c '13 principles' AGENTS.md .codex/AGENTS.md returns >=1 each; the P13 row is present in both; git diff --name-only confirms the WORKTREE copies changed (NOT the main-tree copies at /playinganalytics/git/gobbi/AGENTS.md or /playinganalytics/git/gobbi/.codex/AGENTS.md)."
```

### T11 — Wire the mechanical grep gate (ENFORCEMENT, minimal)
```yaml
id: 11-wire-grep-gate
what: Add the minimal mechanical type-aware grep-gate command to the standard (or a referenced verification doc) covering features/ and project-tier dirs, as a runnable verification command (NOT a behavior change, NOT a new eval perspective).
traces-to:
  - "IN-SCOPE only as the minimal mechanical grep gate extended to features/ — a verification command, NOT a behavior change."
requires: [00-author-dev-doc-standard, 01-conform-agents, 02-conform-evaluation, 04-conform-git-workflow-b, 05-conform-guardrails, 07-conform-install-runtime-b, 08-conform-project-memory, 09a-conform-workflow, 09b-conform-project-tier-high-touch, 09c-conform-project-tier-remainder]
files:
  - path: ".gobbi/projects/gobbi/skills/memorization/rules.md"
    op: modify
inputs: [dev-doc-quality-standard-section, agents-conformant, evaluation-conformant, git-workflow-conformant, guardrails-conformant, install-runtime-conformant, project-memory-conformant, workflow-conformant, project-tier-high-touch-conformant, project-tier-remainder-conformant]
outputs: [grep-gate-wired]
verifies: "Running the documented grep-gate command over all of P_live returns 0 leak files outside archive/ (the cumulative success criterion, baseline 63); the command excludes archive/ (anywhere) + sessions/skills/tmp/ + the top-level agents/ spec dir, and KEEPS features/agents/; git diff confirms only worktree skills/memorization/rules.md changed."
```

### P1 — Prose: features/agents (14 docs)
```yaml
id: P1-prose-agents
what: Per-type prose rewrite of features/agents docs toward the quality bar — apply type-purity (D1/Diátaxis), the per-type section contracts (D4), and self-contained prose (D5; judgment-based de-crypt of remaining cryptic body references). Reclassify any mislabeled session-journal to notes/ rather than deleting (D9).
traces-to:
  - "Prose-quality wave (wave 2): per-type prose rewrite toward the quality bar."
requires: [01-conform-agents]
files:
  - path: ".gobbi/projects/gobbi/features/agents/**/*.md"
    op: modify
inputs: [agents-conformant]
outputs: [agents-prose-quality]
verifies: "Evaluator runs the §4 section-contract checklist on sample docs per type -> pass; D5 grep-assistable cryptic-coord scan on evergreen-type bodies returns 0 for confirmed cases; git diff confirms only worktree features/agents paths changed."
```

### P2 — Prose: features/evaluation (15 docs)
```yaml
id: P2-prose-evaluation
what: Per-type prose rewrite of features/evaluation docs toward the quality bar — apply D1/D4/D5; reclassify mislabeled session-journals to notes/ (D9), never delete.
traces-to:
  - "Prose-quality wave (wave 2): per-type prose rewrite toward the quality bar."
requires: [02-conform-evaluation]
files:
  - path: ".gobbi/projects/gobbi/features/evaluation/**/*.md"
    op: modify
inputs: [evaluation-conformant]
outputs: [evaluation-prose-quality]
verifies: "Evaluator runs the §4 section-contract checklist on sample docs per type -> pass; D5 cryptic-coord scan returns 0 for confirmed cases; git diff confirms only worktree features/evaluation paths changed."
```

### P3 — Prose: features/git-workflow (41 docs)
```yaml
id: P3-prose-git-workflow
what: Per-type prose rewrite of the whole features/git-workflow tree toward the quality bar — apply D1/D4/D5; reclassify mislabeled session-journals to notes/ (D9), never delete.
traces-to:
  - "Prose-quality wave (wave 2): per-type prose rewrite toward the quality bar."
requires: [04-conform-git-workflow-b]
files:
  - path: ".gobbi/projects/gobbi/features/git-workflow/**/*.md"
    op: modify
inputs: [git-workflow-conformant]
outputs: [git-workflow-prose-quality]
verifies: "Evaluator runs the §4 section-contract checklist on sample docs per type -> pass; D5 cryptic-coord scan returns 0 for confirmed cases; git diff confirms only worktree features/git-workflow paths changed."
```

### P4 — Prose: features/guardrails (10 docs)
```yaml
id: P4-prose-guardrails
what: Per-type prose rewrite of features/guardrails docs toward the quality bar — apply D1/D4/D5; reclassify mislabeled session-journals to notes/ (D9), never delete.
traces-to:
  - "Prose-quality wave (wave 2): per-type prose rewrite toward the quality bar."
requires: [05-conform-guardrails]
files:
  - path: ".gobbi/projects/gobbi/features/guardrails/**/*.md"
    op: modify
inputs: [guardrails-conformant]
outputs: [guardrails-prose-quality]
verifies: "Evaluator runs the §4 section-contract checklist on sample docs per type -> pass; D5 cryptic-coord scan returns 0 for confirmed cases; git diff confirms only worktree features/guardrails paths changed."
```

### P5 — Prose: features/install-runtime (44 docs)
```yaml
id: P5-prose-install-runtime
what: Per-type prose rewrite of the whole features/install-runtime tree toward the quality bar — apply D1/D4/D5; reclassify mislabeled session-journals to notes/ (D9), never delete.
traces-to:
  - "Prose-quality wave (wave 2): per-type prose rewrite toward the quality bar."
requires: [07-conform-install-runtime-b]
files:
  - path: ".gobbi/projects/gobbi/features/install-runtime/**/*.md"
    op: modify
inputs: [install-runtime-conformant]
outputs: [install-runtime-prose-quality]
verifies: "Evaluator runs the §4 section-contract checklist on sample docs per type -> pass; D5 cryptic-coord scan returns 0 for confirmed cases; git diff confirms only worktree features/install-runtime paths changed."
```

### P6 — Prose: features/project-memory + features/workflow (4 + 26 = 30 docs)
```yaml
id: P6-prose-project-memory-and-workflow
what: Per-type prose rewrite of features/project-memory and features/workflow docs toward the quality bar — apply D1/D4/D5; reclassify mislabeled session-journals to notes/ (D9), never delete.
traces-to:
  - "Prose-quality wave (wave 2): per-type prose rewrite toward the quality bar."
requires: [08-conform-project-memory, 09a-conform-workflow]
files:
  - path: ".gobbi/projects/gobbi/features/project-memory/**/*.md"
    op: modify
  - path: ".gobbi/projects/gobbi/features/workflow/**/*.md"
    op: modify
inputs: [project-memory-conformant, workflow-conformant]
outputs: [project-memory-prose-quality, workflow-prose-quality]
verifies: "Evaluator runs the §4 section-contract checklist on sample docs per type -> pass; D5 cryptic-coord scan returns 0 for confirmed cases; git diff confirms only worktree features/{project-memory,workflow} paths changed."
```

### P7 — Prose: project-tier (all 10 typed dirs + 2 index READMEs = 68 docs)
```yaml
id: P7-prose-project-tier
what: Per-type prose rewrite of all project-tier typed dirs (decisions/design/learnings/notes/backlogs/references/reviews/rules/plans/mistakes, each incl dir README) plus features/README.md and the project-root README.md toward the quality bar — apply D1/D4/D5; reclassify mislabeled session-journals to notes/ (D9), never delete; preserve legitimate per-type keys.
traces-to:
  - "Prose-quality wave (wave 2): per-type prose rewrite toward the quality bar."
requires: [09b-conform-project-tier-high-touch, 09c-conform-project-tier-remainder]
files:
  - path: ".gobbi/projects/gobbi/{decisions,design,learnings,notes,backlogs,references,reviews,rules,plans,mistakes}/*.md"
    op: modify
  - path: ".gobbi/projects/gobbi/features/README.md"
    op: modify
  - path: ".gobbi/projects/gobbi/README.md"
    op: modify
inputs: [project-tier-high-touch-conformant, project-tier-remainder-conformant]
outputs: [project-tier-prose-quality]
verifies: "Evaluator runs the §4 section-contract checklist on sample docs per type -> pass; D5 cryptic-coord scan returns 0 for confirmed cases; legitimate per-type keys intact; git diff confirms only worktree project-tier paths changed."
```

### N1 — Tier-3 nav: README Subdirectories accuracy (Wave 3)
```yaml
id: N1-readme-subdirs-nav
what: Verify each of the 18 feature/index README "Subdirectories" sections lists the subdirs that actually exist; optionally add a top-level index pointer. Runs LAST; must not block tier-1.
traces-to:
  - "IN-SCOPE as a light final wave (tertiary priority): verify each feature README.md's Subdirectories section lists the subdirs that actually exist; optionally add a top-level index pointer."
requires: [P1-prose-agents, P2-prose-evaluation, P3-prose-git-workflow, P4-prose-guardrails, P5-prose-install-runtime, P6-prose-project-memory-and-workflow, P7-prose-project-tier]
files:
  - path: ".gobbi/projects/gobbi/**/README.md"
    op: modify
inputs: [agents-prose-quality, evaluation-prose-quality, git-workflow-prose-quality, guardrails-prose-quality, install-runtime-prose-quality, project-memory-prose-quality, workflow-prose-quality, project-tier-prose-quality]
outputs: [readme-nav-accurate]
verifies: "Each README Subdirectories list matches `ls -d <feature>/*/` for that dir; no missing or phantom subdir entries across all 18 READMEs; git diff confirms only worktree README.md paths changed."
```

---

## Dependency table

| Task | Depends on | Blocks | Files touched |
|---|---|---|---|
| T0 standard | — | T1-T11, all prose, N1 | `skills/memorization/rules.md` |
| T1 agents | T0 | T11, P1 | `features/agents/**` |
| T2 evaluation | T0 | T11, P2 | `features/evaluation/**` |
| T3 git-workflow A | T0 | T4 | `features/git-workflow/{discussions,design,decisions}/**` |
| T4 git-workflow B | T0, T3 | T11, P3 | `features/git-workflow/{backlogs,changelogs,checklists,plans,references,scenarios,README}` |
| T5 guardrails | T0 | T11, P4 | `features/guardrails/**` |
| T6 install-runtime A | T0 | T7 | `features/install-runtime/{discussions,design,decisions,changelogs}/**` |
| T7 install-runtime B | T0, T6 | T11, P5 | `features/install-runtime/{backlogs,checklists,references,scenarios,README}` |
| T8 project-memory | T0 | T11, P6 | `features/project-memory/**` |
| T9a workflow | T0 | T11, P6 | `features/workflow/**` |
| T9b project-tier high-touch | T0 | T11, P7 | `{decisions,design,learnings,notes,backlogs}/*.md` |
| T9c project-tier remainder | T0 | T11, P7 | `{references,reviews,rules,plans,mistakes}/*.md` + `features/README.md` + `README.md` |
| T10 AGENTS.md | T0 | — | `AGENTS.md`, `.codex/AGENTS.md` (WORKTREE copies) |
| T11 grep gate | T0, T1, T2, T4, T5, T7, T8, T9a, T9b, T9c | — | `skills/memorization/rules.md` |
| P1 prose agents | T1 | N1 | `features/agents/**` |
| P2 prose evaluation | T2 | N1 | `features/evaluation/**` |
| P3 prose git-workflow | T4 | N1 | `features/git-workflow/**` |
| P4 prose guardrails | T5 | N1 | `features/guardrails/**` |
| P5 prose install-runtime | T7 | N1 | `features/install-runtime/**` |
| P6 prose pm+workflow | T8, T9a | N1 | `features/{project-memory,workflow}/**` |
| P7 prose project-tier | T9b, T9c | N1 | project-tier dirs + 2 index READMEs |
| N1 nav | P1, P2, P3, P4, P5, P6, P7 | — | all 18 README.md |

**Ordering decision (HONORS carry-forward — DL-A):** ALL Wave-1 conformance for a given file group
completes and commits BEFORE any Wave-2 prose touches the same file. This is the carry-forward's
"do not interleave conformance + prose edits on the same file" rule, satisfied by the per-group
`requires` edges (each Pk requires its matching Wave-1 conformance task). Within Wave 1, split halves
of a feature (T3→T4, T6→T7) are sequenced (B requires A) because they share the same feature tree and
the cumulative-feature leak gate in B verifies A+B together. T0 blocks every retrofit task (the standard
is the spec they verify against). T11 (grep gate) requires all 10 Wave-1 conformance tasks because it
verifies the cumulative 0-leak criterion over all of P_live. N1 runs last (after all prose) so the
nav reflects the final tree.

---

## Parallel lanes

Execution runs **sequentially** (one task at a time) — lanes are documentation only. Recommended
execution order: T0 → T1 → T2 → T3 → T4 → T5 → T6 → T7 → T8 → T9a → T9b → T9c → T10 → T11 →
P1 → P2 → P3 → P4 → P5 → P6 → P7 → N1.

| Lane | Tasks | Order |
|---|---|---|
| Foundation | T0 | first, alone |
| Conformance (independent features) | T1, T2, T5, T8, T9a, T9b, T9c | any order after T0 |
| Conformance (git-workflow chain) | T3 → T4 | T3 before T4 |
| Conformance (install-runtime chain) | T6 → T7 | T6 before T7 |
| Reconciliation | T10 | any time after T0 |
| Enforcement | T11 | after all 10 conformance tasks |
| Prose | P1..P7 | each after its matching Wave-1 conformance task |
| Nav | N1 | last, after all prose |

**Conflict flags:**
- ⚠ T3 and T4 both touch `features/git-workflow/` — sequential (T4 requires T3), not parallel-safe.
- ⚠ T6 and T7 both touch `features/install-runtime/` — sequential (T7 requires T6).
- ⚠ T0 and T11 both touch `skills/memorization/rules.md` — T11 requires T0; sequential. No other task
  touches `rules.md`.
- ⚠ Each Pk prose task touches the SAME files as its Wave-1 conformance task (e.g., P1 ↔ T1 on
  `features/agents/**`) — the `requires` edge (Pk requires the conformance task) is the conflict
  mitigation: conformance is committed before prose touches the file (carry-forward honored).
- ⚠ N1 touches all 18 README.md — each of those READMEs is also touched by a prose task (P1-P7).
  N1 requires all prose tasks, so it runs strictly after; no concurrent edit.
- ⚠ T9c and P7 both edit `features/README.md` + `PM/README.md` (the 2 index READMEs); N1 also edits
  them. Ordering T9c → P7 → N1 (via `requires`) serializes the three. Not parallel-safe.
- ✓ No two Wave-1 conformance tasks share any file (disjoint feature/dir globs).

---

## Agent assignments

Defaults per `delegation/SKILL.md`: executor→sonnet. Conformance + reconciliation + grep-gate tasks are
single-category mechanical/doc edits → `executor`. Prose tasks (P1-P7) are judgment-heavier rewrites but
still single-category documentation work → `executor` (no `leader`/sub-decomposition: the split decisions
are made HERE). T0 is authoring (single-category doc work) → `executor`.

**Evaluation cadence (Decision 3 — MAX RIGOR):** **dual-system evaluation (Claude Code + Codex) on EVERY
task** — T0, every conformance task (T1-T9c), T10, T11, every prose task (P1-P7), and N1 — PLUS the
Planning-loop EVALUATION on this plan itself. No single-system shortcut on any task, including trivial
iter2 fixes. The manager runs the two-evaluator reconciliation per `evaluation/SKILL.md` after each task.

**Required skills (ALL tasks):** `principles`, `mistake`, `execution`, `memorization`, plus `git`
(every task commits). Retrofit/standard tasks also load the dev-doc quality standard §4 in
`memorization/rules.md` (the spec they verify against — T0 authors it; all others read it).

**Required mistakes (ALL retrofit/standard/prose tasks):**
- `skills-mirror-symlinks-not-copies` + `edit-tool-refuses-symlink-paths` — T0/T11 edit the CANONICAL
  `rules.md`, never the `.claude/` symlink.
- `executor-main-tree-edit-near-miss` + `executor-mirror-path-vs-worktree-physical-copy` +
  `worktree-physical-file-missing-when-checked-out` — every edit targets the WORKTREE-physical path,
  verified via `git diff --name-only` in the worktree. **CRITICAL for T10** (`AGENTS.md` and
  `.codex/AGENTS.md` exist in BOTH the main tree and the worktree — edit the WORKTREE copies only).
- `sendmessage-continued-cwd-resets-to-main-tree` — re-`cd` to the worktree root at the start of every
  Bash call; never rely on persisted cwd.
- `naming-standard-needs-positive-guidance-not-just-blocklist` — T0 leads with positive guidance.
- `design-literal-retire-instruction-without-replacement` — never delete narrative; reclassify to
  `notes/` (D9). Applies to any prose task that finds a mislabeled session-journal.
- `manager-context-overflow-with-large-bundle` — manager-level; informs the ≤35-doc wave-bounding,
  the T9 3-way split, and the 22-task single-session sequencing under dual-system eval.

| Task | Agent | Model | Eval | Skills (beyond the 5 always) | Mistakes (key) |
|---|---|---|---|---|---|
| T0 | executor | sonnet | dual-system | dev-doc std §4 (authors) | symlink-canonical, worktree-edit, cwd-reset, naming-positive |
| T1 | executor | sonnet | dual-system | dev-doc std §4 | worktree-edit, cwd-reset, never-delete |
| T2 | executor | sonnet | dual-system | dev-doc std §4 | worktree-edit, cwd-reset, never-delete |
| T3 | executor | sonnet | dual-system | dev-doc std §4 | worktree-edit, cwd-reset, never-delete |
| T4 | executor | sonnet | dual-system | dev-doc std §4 | worktree-edit, cwd-reset, never-delete |
| T5 | executor | sonnet | dual-system | dev-doc std §4 | worktree-edit, cwd-reset, never-delete |
| T6 | executor | sonnet | dual-system | dev-doc std §4 | worktree-edit, cwd-reset, never-delete |
| T7 | executor | sonnet | dual-system | dev-doc std §4 | worktree-edit, cwd-reset, never-delete |
| T8 | executor | sonnet | dual-system | dev-doc std §4 | worktree-edit, cwd-reset, never-delete |
| T9a | executor | sonnet | dual-system | dev-doc std §4 | worktree-edit, cwd-reset, never-delete |
| T9b | executor | sonnet | dual-system | dev-doc std §4 | worktree-edit, cwd-reset, never-delete |
| T9c | executor | sonnet | dual-system | dev-doc std §4 | worktree-edit, cwd-reset, never-delete, preserve-per-type-keys |
| T10 | executor | sonnet | dual-system | dev-doc std §4 | **worktree-edit (CRITICAL — AGENTS.md + .codex/AGENTS.md in BOTH trees)**, cwd-reset |
| T11 | executor | sonnet | dual-system | dev-doc std §4 | symlink-canonical, worktree-edit, cwd-reset |
| P1 | executor | sonnet | dual-system | dev-doc std §4 | worktree-edit, cwd-reset, never-delete, reclassify-to-notes |
| P2 | executor | sonnet | dual-system | dev-doc std §4 | worktree-edit, cwd-reset, never-delete, reclassify-to-notes |
| P3 | executor | sonnet | dual-system | dev-doc std §4 | worktree-edit, cwd-reset, never-delete, reclassify-to-notes |
| P4 | executor | sonnet | dual-system | dev-doc std §4 | worktree-edit, cwd-reset, never-delete, reclassify-to-notes |
| P5 | executor | sonnet | dual-system | dev-doc std §4 | worktree-edit, cwd-reset, never-delete, reclassify-to-notes |
| P6 | executor | sonnet | dual-system | dev-doc std §4 | worktree-edit, cwd-reset, never-delete, reclassify-to-notes |
| P7 | executor | sonnet | dual-system | dev-doc std §4 | worktree-edit, cwd-reset, never-delete, reclassify-to-notes, preserve-per-type-keys |
| N1 | executor | sonnet | dual-system | dev-doc std §4 | worktree-edit, cwd-reset |

No non-default agent type or model override is proposed. Justification: every task is a single-category
documentation edit/authoring task with a runnable verification — the canonical `executor`+sonnet profile
fits. The T9 split decisions are made in this plan, not delegated, so no `leader` agent is needed.

---

## Self-review report

### Spec coverage (every Success Criterion / In-Scope item → a task)

| Source item | Task(s) |
|---|---|
| SC1 written standard scoreable | T0 |
| SC2 100% base schema + 0 leaks (denominator = 204 content / 222 total; leak baseline 63) | T1-T9c (per-group), T11 (cumulative) |
| SC3 every type has a section contract | T0 (D4) |
| SC4 positive guidance + examples | T0 (D3) |
| In-Scope conformance wave (Wave 1) | T1, T2, T3, T4, T5, T6, T7, T8, T9a, T9b, T9c |
| In-Scope prose wave (Wave 2) | P1, P2, P3, P4, P5, P6, P7 |
| In-Scope tier-2 grep gate | T11 |
| In-Scope tier-3 nav wave (Wave 3) | N1 |
| AGENTS.md reconciliation (Low — user-confirmed IN) | T10 |
| FIX-1 disposition preservation on backlogs | T4, T7, T9a, T9b verifies |
| FIX-1 per-type-key preservation (mistakes/reviews) | T9c, P7 verifies |
| D9 reclassify-not-delete | mistake injected into every prose task |
| D10 exclude frozen archive/ | every leak gate + grep gate excludes `archive/` |

Every task has a `traces-to` anchor (exact text from scope-contract.md / idea.md). No anchor-less task.
Every In-Scope / Success-Criterion item maps to ≥1 task. **Every P_live doc (222) is assigned to exactly
one Wave-1 conformance task** (154 feature + 68 project-tier = 222 — see § File map cross-foot) and to
exactly one Wave-2 prose task (same partition, P3 spans full git-workflow / P5 full install-runtime /
P6 pm+workflow / P7 full project-tier).

### Placeholder scan
`TBD / TODO / to be defined / <...> / XXX / FIXME` scan over all task `what` + `verifies` fields:
**0 hits.** No PENDING / DEFER flags remain — all five user decisions are ratified (DL-A..DL-E). The one
angle-bracket token in the Counts note (`<bash loop applying the D6 predicate>`) is a prose description
of the verification method inside a fenced code block, not a task-field placeholder.

### Type / name consistency
- File globs use one spelling per feature/dir; all verified against real dirs via `find` (§ Counts note).
- `outputs`/`inputs` chain consistently:
  - T0 emits `dev-doc-quality-standard-section`, consumed by every retrofit task.
  - T3 emits `git-workflow-a-conformant` → consumed by T4; T4 emits `git-workflow-conformant`.
  - T6 emits `install-runtime-a-conformant` → consumed by T7; T7 emits `install-runtime-conformant`.
  - T9a→`workflow-conformant`, T9b→`project-tier-high-touch-conformant`, T9c→`project-tier-remainder-conformant`.
  - T11 consumes all 10 `*-conformant` outputs — every consumed name is produced upstream.
  - Each Pk consumes its matching `*-conformant` output and emits `*-prose-quality`; N1 consumes all
    7 `*-prose-quality` outputs. **0 dangling references.**
- The FIX-1 key-set S and predicate P are referenced by name (not re-derived) — consistent with
  `design-options.md` D6.

### Self-review findings (closed)
- **SR-FINDING-1 (resolved by Decision 4 / DL-D):** Population baseline undercount 208→222, 191→204,
  leak 59→63. Filter bug excluded `features/agents/`. Plan restated against the true figures; the
  corrected `find` is re-run and pasted in the Counts note. NOT a scope change (agents always in-scope).
- **SR-FINDING-2 (resolved by Decision 5 / DL-E):** T9 (93 docs) exceeds the ceiling → split into
  T9a (workflow 26) / T9b (project-tier high-touch 35) / T9c (project-tier remainder + 2 index READMEs 33).
  Each ≤35. Cross-foots to 93 (T9 total) and to 222 (whole plan).

---

## NOT in scope

- Re-homing docs / re-litigating PR #272's re-home + naming standard.
- Big-bang single-pass rewrite (waves are explicit; conformance precedes prose per file).
- **A new dev-doc-quality EVALUATION PERSPECTIVE or full Principle-13 quality-facet encoding** —
  DEFERRED (FLAG-2; backlog `ideation/staging/backlogs/project/evaluation-perspective-for-dev-doc-quality.md`).
  Distinct from the dual-system eval cadence in Decision 3, which uses the EXISTING perspectives.
- **`.claude/`-published-doc authoring standard surgery** (the `claude` skill's domain) — DEFERRED
  (FLAG-3); this plan only edits project-memory under `.gobbi/projects/gobbi/` + the two `AGENTS.md`
  copies. It does not change the `.claude/` published-docs authoring standard.
- Frozen `archive/` docs (anywhere, incl. nested `features/*/archive/`) — excluded from standard,
  retrofit, prose, and gate (D10).
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
  docs; the two large features split into halves (T3/T4, T6/T7); T9 split 3-way. Reference
  `manager-context-overflow-with-large-bundle`. Source:
  `preparation/staging/decisions/context-budget-wave-ordering-carry-forward.md`.
- **DL-B (Decision 1 — SESSION SCOPE = ALL 18 TASKS THIS SESSION):** No deferral. T0 + Wave 1
  conformance (T1-T9c) + T10 + T11 grep gate + Wave 2 prose (P1-P7) + Wave 3 nav (N1) all execute this
  session. The prior draft's "defer Waves 2-3 to follow-up" recommendation is REMOVED.
- **DL-C (Decision 2 — T10 INCLUDED):** AGENTS.md 12→13 reconciliation is IN this session
  (user-confirmed). PENDING/DEFER flag removed. Carries the `executor-main-tree-edit` mistake — both
  `AGENTS.md` and `.codex/AGENTS.md` exist in the main tree AND the worktree; the executor edits the
  WORKTREE copies only, verified via `git diff --name-only`.
- **DL-D (Decision 4 — COUNT CORRECTION, not scope change):** TRUE baseline at HEAD d2b5b37 =
  **222 files / 18 READMEs / 204 content docs / 63 leaks**. The locked 208/191/59 figures were computed
  with a `find` predicate that wrongly excluded in-scope `features/agents/` (14 docs, 4 leaks). SC2
  denominator restated to 204 content / 222 total; leak target measured against 63. `features/agents/`
  stays fully in scope (T1). Corrected `find` commands + outputs pasted in § File map → Counts note.
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
