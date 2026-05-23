---
loop: planning
iter: 2
artifact_type: task-list
created_at: 2026-05-23
status: final
supersedes:
  - /playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/planning/rawdata/draft-iter1.md
related:
  - /playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/planning/rawdata/draft-iter2.md
  - /playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/planning/artifacts/memory-reads.md
  - /playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/ideation/artifacts/idea.md
  - /playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/preparation/artifacts/preparation.md
---

# Plan — gobbi-orchestration-workflow-improvements (Canonical for Execution)

> Planning Loop PASS (iter 2). Dual-system evaluation: Claude PASS + Codex PASS.
> iter 1 REVISE → iter 2 PASS via surgical fix (5 mandatory fixes landed, 1 optional Iron Law 11-deferred).
> Execution reads this file as its authoritative briefing source.

---

## Scope Contract

**Source:** `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/ideation/artifacts/idea.md` lines 31-93 (locked at Ideation iter 3 PASS).

```yaml
artifact_type: scope-contract
feature: gobbi-orchestration-workflow-improvements
goal: "Repair four discipline gaps in gobbi orchestration/workflow that broke last session — codex invocation lacks a canonical best-practices anchor; memorization runs late and unloaded; wrap-up never checks prior-loop compliance; naming convention is documented but unenforced — plus two minor polish items in the gobbi entry skill."
created-by: 2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068
created-at: 2026-05-23
```

**7 in-scope items (A–G):** A (codex skill), B (memorization moment-of-capture), C (delegation hard gate), D (wrap-up Step 2.5), E (coverage ownership matrix row + path conventions H3), F (gobbi Glossary move), G (gobbi Step 4 rewrite).

**15 checklist items:** `idea.md:245-261`.

**10 cross-links:** `idea.md:311-326`.

**Decisions locked at Ideation:** `idea.md:62-73`. Pre-resolved: 5 Types vocabulary, `allowed-tools` frontmatter convention, triple-symlink discipline for codex.

---

## Concern Resolutions (4 items, all closed)

All 4 concerns inherited from `preparation.md:121-157` are resolved. Concern 4 (symlinks) was resolved at Preparation EXIT. Details below.

### Concern 1 — Wrap-up Step 2.5 anchor placement (Item D) — ADDRESSED

**Resolution:** Option (b) — new `### Step 2.5 — prior-loop MEMORIZATION compliance check` H3 inserted between `### WORK discipline` (ends ~line 184) and `## Staging → Project-memory routing` (line 185). Procedure table row 2 (Step 2) gets a one-line "see § Step 2.5 below" pointer. Execution must verify insertion point with `sed -n '176,190p' .agents/skills/wrap-up/SKILL.md` immediately before editing.

**Decision record:** `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/planning/staging/decisions/concern-1-wrap-up-step-2-5-anchor.md` (`disposition: addressed`).

### Concern 2 — `memorization/SKILL.md § Path conventions` anchor casing (Item E, Cross-Link 7) — ADDRESSED

**Resolution:** Option (b) — promote `**Path conventions**` to `### Path conventions` H3 at `memorization/SKILL.md:224`. Follow-up backlog candidate staged for the two other sites (`mistake/SKILL.md:126`, `planning/SKILL.md:459`) — out of scope this session.

**Decision record:** `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/planning/staging/decisions/concern-2-path-conventions-anchor-casing.md` (`disposition: addressed`).

### Concern 3 — Coverage Ownership Matrix exact cell text (Item E) — RESOLVED (user selected Draft A)

**Resolution:** User selected Draft A at Planning iter 2 REVISE re-entry. Row text inlined verbatim in Task 05 brief:

| Cross-cutting concern | Owning perspective(s) | What's verified |
|---|---|---|
| **Memorization staging shape + naming** | Consistency + Aesthetics | Per-finding `{slug}.md` filename convention (no bulk files); 5-Type vocabulary (`scenario_gap` / `checklist_gap` / `design_flaw` / `assumption_risk` / `general`) in frontmatter; Domain routing matches `evaluation/SKILL.md § Complete Domain → staging destination routing`; Slug+collision policy compliance per `evaluation/SKILL.md:385-393` |

**Decision record:** `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/planning/staging/decisions/concern-3-coverage-ownership-cell-text.md` (`disposition: addressed`, `status: resolved`).

### Concern 5 — `Constraints` body block vs `## Constraints` H2 — ADDRESSED (informational)

**Resolution:** Keep `**Constraints**` body block per locked Idea Design A (8 H2 section contract). 6/6 sampled project skills use `## Constraints` H2, but promoting Constraints would break the `grep -c "^## " SKILL.md` MUST return 8 lock from `idea.md:75-84`. Task 06 brief cites "body block per locked Idea Design A (8 H2 section contract)" — no references to non-existent `_claude/SKILL.md`. Follow-up backlog candidate staged to normalize in a future session once the H2-count contract is revisited.

**Decision record:** `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/planning/staging/decisions/concern-5-constraints-body-block-vs-h2.md` (`disposition: addressed`).

---

## File Map

13 files modified (8 source files + 4 template files + 1 cross-link target). No new files (codex content fills the pre-promoted stub). Source-of-truth paths confirmed via Preparation `preparation.md:73-86`.

| File | Op | Touched by Items | Responsibility |
|---|---|---|---|
| `.gobbi/projects/gobbi/skills/codex/SKILL.md` | Modify (fill stub content) | A (checklists 1, 14, 15) | New skill content — 8 H2 sections, Constraints body block, anti-patterns |
| `.agents/skills/codex/SKILL.md` (directory symlink target) | Verify | A (checklist 2) | Confirm `.agents/skills/codex` directory symlink resolves; count = 17 |
| `.claude/skills/codex/SKILL.md` (file symlink) | Verify | A (checklist 2) | Confirm file symlink resolves to source-of-truth path |
| `.agents/skills/gobbi/SKILL.md` | Modify | A (checklist 3), F (checklist 11), G (checklist 12) | Skill Map row + Glossary move + Step 4 rewrite |
| `.agents/skills/memorization/SKILL.md` | Modify | B (checklist 4), E (checklist 10) | Core Principle "Moment-of-capture" + Path conventions H3 promotion + cross-link to Coverage Ownership Matrix |
| `.agents/skills/mistake/SKILL.md` | Modify | B (checklist 5) | P2 strengthening + reciprocal link to memorization |
| `.agents/skills/delegation/SKILL.md` | Modify | C (checklist 6) | Core Principle + Load Directives table row |
| `.agents/skills/delegation/templates/assistant.md` | Modify | C (checklist 7) | Include `memorization/SKILL.md` in Skills tier |
| `.agents/skills/delegation/templates/leader.md` | Modify | C (checklist 7) | Include `memorization/SKILL.md` in Skills tier |
| `.agents/skills/delegation/templates/executor.md` | Modify | C (checklist 7) | Include `memorization/SKILL.md` in Skills tier |
| `.agents/skills/wrap-up/SKILL.md` | Modify | D (checklist 8) | Insert `### Step 2.5` H3 + procedure table pointer + Exit checklist update |
| `.agents/skills/evaluation/SKILL.md` | Modify | E (checklist 9) | Coverage Ownership Matrix new row |
| `.agents/skills/orchestration/templates/settings.default.json` | Verify only (NO diff) | G (checklist 13) | Confirm defaults; no schema change |

**Path discipline:** Edit operations MUST use the canonical source-of-truth path (the file the symlink points to), not the symlink path. Symlinks reflect changes automatically.

---

## Task List

7 Execution tasks, ordered 01–07. Each task = one worktree + one branch + one focused commit + one PR (base=develop) per `git/SKILL.md` worktree+PR mode.

**Effective Execution order:** `01 → 02 → 03 → 04 → 05 → 06 → 07`

### Task 01 — 01-gobbi-polish-fg

```yaml
id: 01-gobbi-polish-fg
what: "Rewrite gobbi/SKILL.md § Step 4 to ask 1 mode question (default auto) + customize gate (Item G); move § Glossary block from before § Session Bootstrap Order (current lines 15-29) to after Session Bootstrap Order ends (Item F)."
traces-to:
  - "idea.md checklist 11 — Edit gobbi/SKILL.md: move § Glossary (lines 15-29) to after § Session Bootstrap Order (~line 124)"
  - "idea.md checklist 12 — Edit gobbi/SKILL.md § Step 4 (lines 99-114): rewrite from 2 questions to 1 question (mode, default auto) + customize gate"
  - "idea.md checklist 13 — Verify settings.default.json defaults; no diff"
requires: []
files:
  - {path: ".agents/skills/gobbi/SKILL.md", op: modify}
  - {path: ".agents/skills/orchestration/templates/settings.default.json", op: verify-only}
inputs:
  - "idea.md Decision Log #10 (Polish 1-4 locked)"
  - "idea.md I9 (Glossary lines 15-29) + I10 (Step 4 lines 99-114)"
outputs:
  - "gobbi/SKILL.md with Glossary moved + 1-question Step 4"
verifies:
  - "awk '/^## Glossary/{a=NR}/^## Session Bootstrap Order/{s=NR}END{print s, a}' .agents/skills/gobbi/SKILL.md | awk '$1 < $2 {exit 0} {exit 1}'  # Glossary now after Session Bootstrap Order"
  - "awk '/^### 4\\./,/^### 5\\./' .agents/skills/gobbi/SKILL.md | grep -cE 'evaluation mode|git workflow mode' | awk '$1 == 0 {exit 0} {exit 1}'  # legacy questions removed"
  - "awk '/^### 4\\./,/^### 5\\./' .agents/skills/gobbi/SKILL.md | grep -cE 'mode.*auto|auto.*default'  # new 1-question with auto default present"
  - "jq -e '.mode == \"auto\" and .git.pr.open == false and .git.pr.draft == false' .agents/skills/orchestration/templates/settings.default.json  # settings.default.json unchanged + still correct"
  - "git diff --name-only develop... | grep -v 'gobbi/SKILL.md' | grep -v '^$' | wc -l | awk '$1 == 0 {exit 0} {exit 1}'  # ONLY gobbi/SKILL.md modified"
```

**Agent assignment:**

- Agent type: `executor` | Model: sonnet (default)
- Required skills: `principles`, `mistake`, `execution/SKILL.md`, `git/SKILL.md`, `memorization/SKILL.md`
- Required mistakes:
  - `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/mistakes/codex-eval-session-write-path-nested-in-worktree.md`
  - `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/mistakes/manager-rm-rf-without-investigating-tracked-files.md`
  - `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/preparation/staging/decisions/manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md`
- Brief discipline: MUST `Read` `idea.md` lines 99-114 + lines 15-29 BEFORE editing. Verbatim-spec recheck — copy from source, not from memory or brief.
- PR: branch `feat/gobbi-skill-polish-fg`, title `docs(gobbi): move Glossary; rewrite Step 4 to 1-question mode + customize gate`

---

### Task 02 — 02-memorization-moment-of-capture

```yaml
id: 02-memorization-moment-of-capture
what: "Add Core Principle 'Moment-of-capture, not end-of-loop' to memorization/SKILL.md with link to mistake/SKILL.md P2; strengthen mistake/SKILL.md P2 with reciprocal link back. Place memorization Core Principle after 'Store what survives, not what's transient', before 'Templates over freeform' per idea.md:278."
traces-to:
  - "idea.md checklist 4 — Edit memorization/SKILL.md: add Core Principle 'Moment-of-capture, not end-of-loop' with link to mistake/SKILL.md P2"
  - "idea.md checklist 5 — Edit mistake/SKILL.md P2: strengthen 'Do not defer to MEMORIZATION' + add reciprocal link"
  - "idea.md Cross-Link Manifest 1 + 2 (idea.md:316-317)"
requires: []
files:
  - {path: ".agents/skills/memorization/SKILL.md", op: modify}
  - {path: ".agents/skills/mistake/SKILL.md", op: modify}
inputs:
  - "idea.md Design B (idea.md:276-280)"
  - "idea.md I6 (T1/T2/T5 staging-empty witness)"
outputs:
  - "Reciprocal moment-of-capture link wired between memorization and mistake skills"
verifies:
  - "grep -c 'Moment-of-capture\\|moment-of-capture' .agents/skills/memorization/SKILL.md | awk '$1 >= 1 {exit 0} {exit 1}'  # principle present"
  - "grep -c 'mistake/SKILL.md' .agents/skills/memorization/SKILL.md | awk '$1 >= 1 {exit 0} {exit 1}'  # forward link"
  - "grep -c 'memorization/SKILL.md' .agents/skills/mistake/SKILL.md | awk '$1 >= 1 {exit 0} {exit 1}'  # reciprocal link"
  - "grep -n 'Moment-of-capture' .agents/skills/memorization/SKILL.md | head -1 | awk -F: '{print $1}' | xargs -I{} sh -c 'awk \"/^## Core Principles/,/^## /\" .agents/skills/memorization/SKILL.md | grep -q Moment-of-capture' # principle is inside Core Principles section"
  - "git diff --name-only develop... | sort | diff - <(echo -e '.agents/skills/memorization/SKILL.md\\n.agents/skills/mistake/SKILL.md' | sort)  # ONLY these 2 files modified"
```

**Agent assignment:**

- Agent type: `executor` | Model: sonnet (default)
- Required skills: `principles`, `mistake`, `execution/SKILL.md`, `git/SKILL.md`, `memorization/SKILL.md`
- Required mistakes:
  - `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/mistakes/codex-eval-session-write-path-nested-in-worktree.md`
  - `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/preparation/staging/decisions/manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md`
- Brief discipline: "place after 'Store what survives'" verified by reading current `memorization/SKILL.md` Core Principles section BEFORE editing. Not from brief alone.
- PR: branch `feat/memorization-moment-of-capture`, title `docs(memorization): add moment-of-capture Core Principle + mistake P2 reciprocal`

---

### Task 03 — 03-delegation-memorization-hard-gate

```yaml
id: 03-delegation-memorization-hard-gate
what: "Add to delegation/SKILL.md a Core Principle requiring memorization/SKILL.md in Load Directives Skills tier for any MEMORIZATION dispatch + corresponding entry in The Load Directives Block (§ at line 79-84 of delegation/SKILL.md); update delegation/templates/{assistant,leader,executor}.md to include memorization/SKILL.md in their Skills tier. Evaluator template EXCLUDED."
traces-to:
  - "idea.md checklist 6 — Edit delegation/SKILL.md: add Core Principle + table row"
  - "idea.md checklist 7 — Edit per-role templates assistant + leader + executor; evaluator excluded"
  - "idea.md Cross-Link Manifest 3 (idea.md:318)"
requires: [02-memorization-moment-of-capture]   # link target must exist before delegation references it
files:
  - {path: ".agents/skills/delegation/SKILL.md", op: modify}
  - {path: ".agents/skills/delegation/templates/assistant.md", op: modify}
  - {path: ".agents/skills/delegation/templates/leader.md", op: modify}
  - {path: ".agents/skills/delegation/templates/executor.md", op: modify}
inputs:
  - "idea.md Design C (idea.md:282-285)"
  - "idea.md I6 (delegation hard-gate pathology α witness)"
  - "delegation/SKILL.md:79-104 (canonical Load Directives Block)"
outputs:
  - "Delegation hard gate wired: principle + template enforcement for MEMORIZATION dispatches"
verifies:
  - "grep -c 'memorization/SKILL.md' .agents/skills/delegation/SKILL.md | awk '$1 >= 2 {exit 0} {exit 1}'  # ≥2 hits: principle + template/example"
  - "grep -q 'memorization/SKILL.md' .agents/skills/delegation/templates/assistant.md"
  - "grep -q 'memorization/SKILL.md' .agents/skills/delegation/templates/leader.md"
  - "grep -q 'memorization/SKILL.md' .agents/skills/delegation/templates/executor.md"
  - "! grep -q '`memorization/SKILL.md`' .agents/skills/delegation/templates/evaluator.md  # evaluator REMAINS excluded"
  - "git diff --name-only develop... | sort | diff - <(echo -e '.agents/skills/delegation/SKILL.md\\n.agents/skills/delegation/templates/assistant.md\\n.agents/skills/delegation/templates/executor.md\\n.agents/skills/delegation/templates/leader.md' | sort)"
```

**Agent assignment:**

- Agent type: `executor` | Model: sonnet (default)
- Required skills: `principles`, `mistake`, `execution/SKILL.md`, `git/SKILL.md`, `delegation/SKILL.md`, `memorization/SKILL.md`
- Required mistakes:
  - `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/mistakes/codex-eval-session-write-path-nested-in-worktree.md`
  - `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/preparation/staging/decisions/manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md`
- Brief discipline: verbatim text for new Core Principle AND table-row content in `delegation/SKILL.md § The Load Directives Block` MUST be inlined in brief. Read `delegation/SKILL.md:79-104` before writing.
- PR: branch `feat/delegation-memorization-hard-gate`, title `docs(delegation): MEMORIZATION dispatches must include memorization/SKILL.md in Load Directives`

---

### Task 04 — 04-wrap-up-step-2-5

```yaml
id: 04-wrap-up-step-2-5
what: |
  Insert ### Step 2.5 H3 in wrap-up/SKILL.md between '### WORK discipline' (line 176) and '## Staging → Project-memory routing' (line 185). Section content: 4-category gap table (zero-staging / shape-mismatch / template-mismatch / directory-absent), mechanical/judgment classification using the 5 Types {scenario_gap, checklist_gap, design_flaw, assumption_risk, general}, auto-backfill + collision policy reference to evaluation/SKILL.md:385-393, NEEDS_CONTEXT trigger for judgment-required, gap report destination rawdata/promotion-manifest.md. Update the WORK Procedure table at line 134 row 2 to flag Step 2.5's existence between Step 2 and Step 3. Update Exit checklist (line 158-173) to add: '[ ] Step 2.5 prior-loop compliance scan recorded in promotion-manifest.md'. Also apply COD-CONS-003 micro-fix in this same task: 'Domain=`testing`' → 'Domain=`test`' if such an illustrative example is authored.

  # ==== BRIEF DISCIPLINE (Iron Law 7 — mirror Task 06 discipline) ====
  # The manager brief for this task MUST include the following directives VERBATIM:
  #
  # 1. (READ-REQUIRED) Executor MUST Read /playinganalytics/git/gobbi/.gobbi/projects/gobbi/skills/evaluation/SKILL.md lines 344-352 (5-Type vocabulary canonical source) and lines 385-393 (Slug+collision policy canonical source) BEFORE writing the Step 2.5 classification logic. Do NOT reconstruct from memory or brief — copy verbatim from the canonical file.
  #
  # 2. (5-TYPE VOCABULARY VERBATIM) The 5 Types are inlined here for reference but the canonical file MUST still be re-read before edit:
  #      scenario_gap, checklist_gap, design_flaw, assumption_risk, general.
  #    Mechanical-class = {scenario_gap, checklist_gap, general}. These auto-backfill via Step 2.5.
  #    Judgment-required = {design_flaw, assumption_risk}. These trigger NEEDS_CONTEXT.
  #
  # 3. (4-CATEGORY GAP TABLE VERBATIM) The 4 gap categories inlined verbatim:
  #      | Category | Condition | Auto-backfill? | NEEDS_CONTEXT? |
  #      |---|---|---|---|
  #      | zero-staging      | Prior loop's staging dir is empty           | N/A      | YES |
  #      | shape-mismatch    | Files exist but per-finding {slug}.md convention violated (bulk files / wrong shape) | mechanical-class only | judgment only |
  #      | template-mismatch | Frontmatter type: missing or off-vocabulary | mechanical-class only | judgment only |
  #      | directory-absent  | Staging directory does not exist            | NO       | YES |
  #
  # 4. (VERIFICATION GATE — POST-EDIT) After Step 2.5 edit, executor MUST run:
  #      grep -E "scenario_gap|checklist_gap|design_flaw|assumption_risk|general" /playinganalytics/git/gobbi/.agents/skills/wrap-up/SKILL.md
  #    The output MUST contain at least 5 matching lines (one per Type). Paste output verbatim into PR description.
  #
  # 5. (COD-CONS-003 INLINE FIX) If any illustrative example cites Domain= field, use 'test' not 'testing'. Verify with: ! grep -q 'Domain=`testing`' .agents/skills/wrap-up/SKILL.md
  #
  # 6. (CROSS-LINK MANIFEST 4+5+6) The Step 2.5 body MUST cite evaluation/SKILL.md at least twice (5-Type source + Slug+collision policy source). Verify: grep -c 'evaluation/SKILL.md' .agents/skills/wrap-up/SKILL.md | awk '$1 >= 2 {exit 0} {exit 1}'
traces-to:
  - "idea.md checklist 8 — Insert Step 2.5 between Steps 2 and 3 with 4-category gap table, 5-Type classification, auto-backfill + Slug+collision policy pre-write check, NEEDS_CONTEXT trigger, gap report; update Exit checklist"
  - "idea.md Cross-Link Manifest 4 + 5 + 6 (idea.md:319-321)"
  - "preparation.md:127-131 (Concern 1 resolution — Option b adopted)"
  - "idea.md Decision Log #18 (5-Type vocabulary)"
requires: []
files:
  - {path: ".agents/skills/wrap-up/SKILL.md", op: modify}
inputs:
  - "idea.md Design D (idea.md:286-292)"
  - "idea.md I7 + I11 + I12 witness"
  - "evaluation/SKILL.md:344-352 (5 Types) + :356 (Domain routing) + :385-393 (Slug+collision)"
outputs:
  - "wrap-up/SKILL.md with Step 2.5 prior-loop compliance scan procedure + cross-links to evaluation/SKILL.md"
verifies:
  - "grep -c '^### Step 2.5\\|Step 2\\.5' .agents/skills/wrap-up/SKILL.md | awk '$1 >= 1 {exit 0} {exit 1}'"
  - "grep -E 'scenario_gap|checklist_gap|design_flaw|assumption_risk|general' .agents/skills/wrap-up/SKILL.md | wc -l | awk '$1 >= 5 {exit 0} {exit 1}'  # 5-Type vocab verbatim, ≥5 matching lines"
  - "grep -ciE 'mechanical|judgment-required' .agents/skills/wrap-up/SKILL.md | awk '$1 >= 2 {exit 0} {exit 1}'"
  - "grep -c 'zero-staging\\|shape-mismatch\\|template-mismatch\\|directory-absent' .agents/skills/wrap-up/SKILL.md | awk '$1 >= 4 {exit 0} {exit 1}'  # all 4 gap categories present"
  - "grep -c 'evaluation/SKILL.md' .agents/skills/wrap-up/SKILL.md | awk '$1 >= 2 {exit 0} {exit 1}'  # cross-links 4+5+6 wired"
  - "grep -c 'promotion-manifest' .agents/skills/wrap-up/SKILL.md | awk '$1 >= 2 {exit 0} {exit 1}'  # gap report destination cited"
  - "! grep -q 'Domain=`testing`' .agents/skills/wrap-up/SKILL.md  # COD-CONS-003 micro-fix: no `testing` typo"
  - "git diff --name-only develop... | sort | diff - <(echo '.agents/skills/wrap-up/SKILL.md')"
```

**Agent assignment:**

- Agent type: `executor` | Model: sonnet (default)
- Required skills: `principles`, `mistake`, `execution/SKILL.md`, `git/SKILL.md`, `wrap-up/SKILL.md`, `evaluation/SKILL.md` (5-Type + Slug+collision source — MUST be loaded into context before writing), `memorization/SKILL.md`
- Required mistakes:
  - `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/mistakes/codex-eval-session-write-path-nested-in-worktree.md`
  - `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/preparation/staging/decisions/manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md`
- Brief discipline: highest-risk task for vocabulary-from-memory regression. Manager brief MUST inline verbatim 5-Type list + 4-category gap table + directive to Read `evaluation/SKILL.md:344-393` immediately before writing.
- PR: branch `feat/wrap-up-step-2-5-compliance`, title `docs(wrap-up): insert Step 2.5 prior-loop MEMORIZATION compliance check`

---

### Task 05 — 05-coverage-ownership-naming-row

```yaml
id: 05-coverage-ownership-naming-row
what: |
  Add new row to evaluation/SKILL.md § Coverage Ownership Matrix (around line 110, after the 'Error budget impact' row). The row text is RESOLVED (user selected Draft A at Planning iter 2 entry) — inline VERBATIM:

    | **Memorization staging shape + naming** | Consistency + Aesthetics | Per-finding `{slug}.md` filename convention (no bulk files); 5-Type vocabulary (`scenario_gap` / `checklist_gap` / `design_flaw` / `assumption_risk` / `general`) in frontmatter; Domain routing matches `evaluation/SKILL.md § Complete Domain → staging destination routing`; Slug+collision policy compliance per `evaluation/SKILL.md:385-393` |

  Promote `**Path conventions**` to `### Path conventions` H3 at memorization/SKILL.md:224. Add a one-line cross-link sentence under the new H3 pointing at evaluation/SKILL.md § Coverage Ownership Matrix § Memorization staging shape + naming. Stage backlog candidate at /playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/planning/staging/backlogs/project/normalize-path-conventions-h3.md for the mistake/SKILL.md:126 + planning/SKILL.md:459 sites (out-of-scope this session).
traces-to:
  - "idea.md checklist 9 — Add Coverage Ownership Matrix row"
  - "idea.md checklist 10 — Add cross-link from memorization Path Conventions to evaluation/SKILL.md § Coverage Ownership Matrix"
  - "idea.md Cross-Link Manifest 7 (idea.md:322)"
  - "preparation.md:133-145 (Concern 2 + 3 resolutions)"
requires: [02-memorization-moment-of-capture]   # avoid file-conflict with Task 02 on memorization/SKILL.md
files:
  - {path: ".agents/skills/evaluation/SKILL.md", op: modify}
  - {path: ".agents/skills/memorization/SKILL.md", op: modify}
inputs:
  - "idea.md Design E (idea.md:294-296)"
  - "Concern 3 RESOLVED — user selected Draft A; verbatim cell text in what: above"
  - "preparation.md Concern 2 (H3 promotion approach)"
outputs:
  - "Coverage Ownership Matrix has Memorization staging shape + naming row (Draft A verbatim); memorization/SKILL.md § Path conventions is stable H3 anchor with cross-link to evaluation matrix"
  - "backlogs/project/normalize-path-conventions-h3.md staged (low-cost follow-up)"
verifies:
  - "grep -c 'Memorization staging shape\\|staging shape + naming' .agents/skills/evaluation/SKILL.md | awk '$1 >= 1 {exit 0} {exit 1}'"
  - "grep -c '^### Path conventions' .agents/skills/memorization/SKILL.md | awk '$1 >= 1 {exit 0} {exit 1}'  # H3 promoted"
  - "grep -c 'Coverage Ownership Matrix' .agents/skills/memorization/SKILL.md | awk '$1 >= 1 {exit 0} {exit 1}'  # cross-link wired"
  - "awk '/^## Coverage Ownership Matrix/,/^---/' .agents/skills/evaluation/SKILL.md | grep -cE 'Consistency.*Aesthetics|Aesthetics.*Consistency'  # Owner perspectives in new row include Consistency + Aesthetics"
  - "grep -c 'scenario_gap.*checklist_gap.*design_flaw.*assumption_risk.*general\\|`{slug}.md` filename convention' .agents/skills/evaluation/SKILL.md | awk '$1 >= 1 {exit 0} {exit 1}'  # Draft A verbatim cell text inlined"
  - "test -f /playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/planning/staging/backlogs/project/normalize-path-conventions-h3.md  # backlog staged (absolute path)"
  - "git diff --name-only develop... | grep -v 'sessions/' | sort | diff - <(echo -e '.agents/skills/evaluation/SKILL.md\\n.agents/skills/memorization/SKILL.md' | sort)"
```

**Agent assignment:**

- Agent type: `executor` | Model: sonnet (default)
- Required skills: `principles`, `mistake`, `execution/SKILL.md`, `git/SKILL.md`, `evaluation/SKILL.md`, `memorization/SKILL.md`
- Required mistakes:
  - `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/mistakes/codex-eval-session-write-path-nested-in-worktree.md`
  - `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/preparation/staging/decisions/manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md`
- Brief discipline: briefing contains the user-selected Draft A cell text VERBATIM (Concern 3 RESOLVED at iter 2 entry). No memory-based reconstruction permitted.
- PR: branch `feat/coverage-ownership-naming-row`, title `docs(evaluation): Coverage Ownership Matrix row for Memorization staging shape + naming`

---

### Task 06 — 06-codex-skill-content

```yaml
id: 06-codex-skill-content
what: "Fill the 8 H2 sections of .gobbi/projects/gobbi/skills/codex/SKILL.md (currently stub at the promoted path). Sections (locked, do NOT rename or reorder): (1) When to load, (2) Invocation patterns, (3) Why subagents must use codex exec, (4) Sandbox + CWD discipline, (5) Hang + timeout discipline, (6) Use cases, (7) Cost + sandbox budget awareness, (8) Anti-patterns. Plus Constraints body block (NOT H2 #9 — preserves H2 count contract). Target length: ~350-450 lines per Idea Design A. Add Skill Map row to gobbi/SKILL.md § Skill Map § Cross-cutting skills. Cite empirical witnesses I1-I14 + E1-E5 inline. The Constraints body block annotation MUST reference 'body block per locked Idea Design A (8 H2 section contract)' — no references to non-existent skill files."
traces-to:
  - "idea.md checklist 1 — Create codex SKILL.md with frontmatter + 8 H2 sections locked"
  - "idea.md checklist 3 — Add row to gobbi/SKILL.md § Skill Map § Cross-cutting skills"
  - "idea.md checklist 14 — Use cases section with both spawn patterns + post-eval find sanity check + mistake citation"
  - "idea.md checklist 15 — Anti-patterns section ≥8 entries including subagent-cannot-spawn-plugin-agent + missing-symlink entries"
  - "idea.md Cross-Link Manifest 8 + 9 + 10 (idea.md:323-325)"
requires: [01-gobbi-polish-fg]   # Skill Map row edit lands after Item F/G touched gobbi/SKILL.md to avoid conflict
files:
  - {path: ".gobbi/projects/gobbi/skills/codex/SKILL.md", op: modify}
  - {path: ".agents/skills/gobbi/SKILL.md", op: modify}    # Skill Map row addition (checklist 3)
inputs:
  - "idea.md Design A (idea.md:269-274)"
  - "idea.md Insights I1, I2, I3, I4, I5, I13, I14 + E1, E2, E3, E4, E5"
  - "mistakes/codex-eval-session-write-path-nested-in-worktree.md (anchor citation for Sandbox + CWD section)"
  - "Current stub state at .gobbi/projects/gobbi/skills/codex/SKILL.md (8 H2 sections + Constraints body block already in place)"
outputs:
  - "Content-complete codex skill at 350-450 lines, 8 H2 sections preserved, Constraints body block expanded with concrete MUST/NEVER/ALWAYS bullets"
verifies:
  - "test \"$(grep -c '^## ' .gobbi/projects/gobbi/skills/codex/SKILL.md)\" = '8'   # exactly 8 H2 sections (contract)"
  - "grep -q '^## When to load' .gobbi/projects/gobbi/skills/codex/SKILL.md"
  - "grep -q '^## Invocation patterns' .gobbi/projects/gobbi/skills/codex/SKILL.md"
  - "grep -q '^## Why subagents must use' .gobbi/projects/gobbi/skills/codex/SKILL.md"
  - "grep -q '^## Sandbox + CWD discipline' .gobbi/projects/gobbi/skills/codex/SKILL.md"
  - "grep -q '^## Hang + timeout discipline' .gobbi/projects/gobbi/skills/codex/SKILL.md"
  - "grep -q '^## Use cases' .gobbi/projects/gobbi/skills/codex/SKILL.md"
  - "grep -q '^## Cost + sandbox budget awareness' .gobbi/projects/gobbi/skills/codex/SKILL.md"
  - "grep -q '^## Anti-patterns' .gobbi/projects/gobbi/skills/codex/SKILL.md"
  - "grep -q '^name: codex' .gobbi/projects/gobbi/skills/codex/SKILL.md"
  - "grep -q '^allowed-tools:' .gobbi/projects/gobbi/skills/codex/SKILL.md && ! grep -q '^when-to-load:' .gobbi/projects/gobbi/skills/codex/SKILL.md"
  - "grep -c 'codex exec\\|--cd\\|workspace-write\\|read-only' .gobbi/projects/gobbi/skills/codex/SKILL.md | awk '$1 >= 5 {exit 0} {exit 1}'"
  - "grep -c 'codex-eval-session-write-path' .gobbi/projects/gobbi/skills/codex/SKILL.md | awk '$1 >= 1 {exit 0} {exit 1}'  # mistake cited"
  - "grep -ci 'anti-pattern' .gobbi/projects/gobbi/skills/codex/SKILL.md | awk '$1 >= 8 {exit 0} {exit 1}'  # ≥8 anti-pattern entries"
  - "grep -c '/playinganalytics/git/gobbi' .gobbi/projects/gobbi/skills/codex/SKILL.md | awk '$1 >= 2 {exit 0} {exit 1}'  # absolute-path mandate present"
  - "wc -l .gobbi/projects/gobbi/skills/codex/SKILL.md | awk '$1 >= 300 && $1 <= 500 {exit 0} {exit 1}'  # length 300-500 (target 350-450 with tolerance)"
  - "test -L .claude/skills/codex/SKILL.md  # file symlink resolves"
  - "test -L .agents/skills/codex && test -d .agents/skills/codex  # directory symlink + resolves"
  - "test \"$(ls .agents/skills/ | wc -l)\" = '17'  # post-ship symlink count"
  - "grep -E 'codex' .agents/skills/gobbi/SKILL.md | grep -i 'skill map\\|cross-cutting' || awk '/## Skill Map/,/^## /' .agents/skills/gobbi/SKILL.md | grep -q codex   # Skill Map row added"
```

**Agent assignment:**

- Agent type: `executor` | Model: sonnet (default)
- Required skills: `principles`, `mistake`, `execution/SKILL.md`, `git/SKILL.md`, `codex` (the skill being filled — current stub state is required reading), `gobbi` (Skill Map target)
- Required mistakes:
  - `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/mistakes/codex-eval-session-write-path-nested-in-worktree.md` (CRITICAL — the witness this skill cites; accuracy required for Sandbox + CWD section)
  - `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/preparation/staging/decisions/manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md`
- Brief discipline (EXTREME-DISCIPLINE REQUIRED — 300-500 lines, strongest history of section-name + vocabulary drift):
  1. Inline the 8 H2 section names VERBATIM from `idea.md` (NOT from memory): `## When to load`, `## Invocation patterns`, `## Why subagents must use codex exec`, `## Sandbox + CWD discipline`, `## Hang + timeout discipline`, `## Use cases`, `## Cost + sandbox budget awareness`, `## Anti-patterns`.
  2. Cite `idea.md:269-274` + `idea.md:245-261` as Read-required-before-write. Executor MUST `Read /playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/ideation/artifacts/idea.md` lines 269-274 BEFORE authoring each H2's body content.
  3. Re-state both finding-Type vocabularies (the 5 Types) explicitly so anti-patterns and use-cases reference them correctly.
  4. Include verification gates per the `verifies:` block above as a mandatory pre-PR self-check.
  5. The Constraints body block annotation MUST reference "body block per locked Idea Design A (8 H2 section contract)" — no references to non-existent skill files.
- PR: branch `feat/codex-skill-content`, title `docs(codex): content-complete skill — 8 H2 sections, anti-patterns, sandbox+CWD discipline`

---

### Task 07 — 07-cross-link-sweep

```yaml
id: 07-cross-link-sweep
what: "Final cross-link verification + name/path drift check across all 10 Cross-Link Manifest entries (idea.md:311-326). Run grep + sed-based smoke tests confirming each link source contains the expected reference and each target file has the expected anchor heading. Stage findings as decisions if any link is broken. No source-file edits — this is a verification-only task that writes only to session staging if findings exist."
traces-to:
  - "idea.md Cross-Link Manifest 1-10 (idea.md:311-326)"
  - "idea.md Success Criteria 1-9 (idea.md:75-84)"
requires: [01-gobbi-polish-fg, 02-memorization-moment-of-capture, 03-delegation-memorization-hard-gate, 04-wrap-up-step-2-5, 05-coverage-ownership-naming-row, 06-codex-skill-content]
files:
  - {path: "/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/planning/staging/decisions/{slug}.md", op: create-if-needed}
inputs:
  - "All 6 prior-task outputs (the 10 Cross-Link Manifest entries should be wired by end of Task 06)"
outputs:
  - "Cross-link verification log + 0 findings (PASS) OR finding-staging files (REVISE-triggering)"
verifies:
  - "# Link 1: memorization → mistake/SKILL.md P2 — grep memorization for 'mistake/SKILL.md' AND 'P2'"
  - "grep -E 'mistake/SKILL.md.*P2|mistake/SKILL\\.md#p2' .agents/skills/memorization/SKILL.md"
  - "# Link 2: mistake/SKILL.md P2 → memorization Moment-of-capture (reciprocal)"
  - "awk '/^### P2/,/^### P3/' .agents/skills/mistake/SKILL.md | grep -E 'memorization/SKILL.md|Moment-of-capture'"
  - "# Link 3: delegation/SKILL.md → memorization/SKILL.md § Procedure"
  - "grep -E 'memorization/SKILL.md' .agents/skills/delegation/SKILL.md"
  - "# Link 4+5+6: wrap-up Step 2.5 → evaluation Type vocabulary / Slug+collision / Domain routing"
  - "awk '/^### Step 2.5|Step 2\\.5/,/^### |^## /' .agents/skills/wrap-up/SKILL.md | grep -c 'evaluation/SKILL.md' | awk '$1 >= 2 {exit 0} {exit 1}'"
  - "# Link 7: memorization Path Conventions → evaluation Coverage Ownership Matrix"
  - "awk '/^### Path conventions/,/^### |^## /' .agents/skills/memorization/SKILL.md | grep -q 'Coverage Ownership Matrix'"
  - "# Link 8: codex Sandbox + CWD → mistakes/codex-eval-session-write-path"
  - "awk '/^## Sandbox \\+ CWD discipline/,/^## /' .gobbi/projects/gobbi/skills/codex/SKILL.md | grep -q 'codex-eval-session-write-path'"
  - "# Link 9: codex Hang + timeout → git/SKILL.md background-mode"
  - "awk '/^## Hang \\+ timeout discipline/,/^## /' .gobbi/projects/gobbi/skills/codex/SKILL.md | grep -q 'git/SKILL.md'"
  - "# Link 10: gobbi/SKILL.md Skill Map → codex skill"
  - "awk '/^## Skill Map/,/^## /' .agents/skills/gobbi/SKILL.md | grep -q codex"
```

**Agent assignment:**

- Agent type: `assistant` (verification-only, no source-file edits)
- Model: sonnet (default)
- Required skills: `principles`, `mistake`, `memorization/SKILL.md`
- Required mistakes:
  - `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/preparation/staging/decisions/manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md`
- Justification: `assistant` not `executor` — mechanical grep/sed sweep + decision-staging only, no source-file modifications. Matches `delegation/SKILL.md § Agent Roster`.
- PR: branch `chore/bundle-a-cross-link-sweep`, title `chore(verification): Bundle A cross-link consistency sweep`

---

## Dependency Graph (DAG)

```
01-gobbi-polish-fg ──────────────────────────────────────────────┐
                                                                  ↓
02-memorization-moment-of-capture ──────┬─────────────────────── 06-codex-skill-content ──┐
                                        ↓                                                  │
                               03-delegation-memorization-hard-gate ──────────────────────┤
                                        ↓                                                  │
                               05-coverage-ownership-naming-row ──────────────────────────┤
                                                                                           ↓
04-wrap-up-step-2-5 ────────────────────────────────────────────────────────── 07-cross-link-sweep
```

| Task | Depends on | Blocks | Files touched |
|---|---|---|---|
| 01-gobbi-polish-fg | — | 06 | `.agents/skills/gobbi/SKILL.md`, `.agents/skills/orchestration/templates/settings.default.json` (verify) |
| 02-memorization-moment-of-capture | — | 03, 05 | `.agents/skills/memorization/SKILL.md`, `.agents/skills/mistake/SKILL.md` |
| 03-delegation-memorization-hard-gate | 02 | 07 | `.agents/skills/delegation/SKILL.md`, `delegation/templates/{assistant,leader,executor}.md` |
| 04-wrap-up-step-2-5 | — | 07 | `.agents/skills/wrap-up/SKILL.md` |
| 05-coverage-ownership-naming-row | 02 | 07 | `.agents/skills/evaluation/SKILL.md`, `.agents/skills/memorization/SKILL.md` |
| 06-codex-skill-content | 01 | 07 | `.gobbi/projects/gobbi/skills/codex/SKILL.md`, `.agents/skills/gobbi/SKILL.md` |
| 07-cross-link-sweep | 01, 02, 03, 04, 05, 06 | — | session staging only |

**Conflict flags:**

- `.agents/skills/memorization/SKILL.md` is touched by Tasks 02 AND 05 — sequential ordering enforced (02 before 05). Task 05 must rebase onto Task 02's merged state. No parallel safe.
- `.agents/skills/gobbi/SKILL.md` is touched by Tasks 01 AND 06 — sequential ordering enforced (01 before 06). Task 06's Skill Map row addition must rebase onto Task 01's merged state. No parallel safe.
- All other tasks touch disjoint files.

**Parallel lanes (documentation only — Execution runs sequentially):**

| Lane | Tasks | Order |
|---|---|---|
| L1 (gobbi skill) | 01 → 06 | Sequential — both touch `gobbi/SKILL.md` |
| L2 (memorization) | 02 → 05 | Sequential — both touch `memorization/SKILL.md` |
| L3 (delegation) | 03 | Solo — runs after 02 (link target dep) |
| L4 (wrap-up) | 04 | Solo — no overlap |
| L5 (sweep) | 07 | Final — depends on 01-06 |

**Effective Execution order:** `01 → 02 → 03 → 04 → 05 → 06 → 07`

---

## Cross-Link Manifest (10 entries)

Maps each Idea cross-link to the Task that wires it. Source: `idea.md:311-326`.

| # | Link source | Link target | Wired by Task |
|---|---|---|---|
| 1 | `memorization/SKILL.md` (new Core Principle) | `mistake/SKILL.md P2` | 02 |
| 2 | `mistake/SKILL.md P2` (reciprocal) | `memorization/SKILL.md` Moment-of-capture | 02 |
| 3 | `delegation/SKILL.md` (Core Principle + Load Directives row) | `memorization/SKILL.md § Procedure` | 03 |
| 4 | `wrap-up/SKILL.md § Step 2.5` | `evaluation/SKILL.md § Finding Metadata` (5-Type vocabulary) | 04 |
| 5 | `wrap-up/SKILL.md § Step 2.5` | `evaluation/SKILL.md:385-393` (Slug+collision policy) | 04 |
| 6 | `wrap-up/SKILL.md § Step 2.5` | `evaluation/SKILL.md` (Domain routing) | 04 |
| 7 | `memorization/SKILL.md § Path conventions` (H3) | `evaluation/SKILL.md § Coverage Ownership Matrix` | 05 |
| 8 | `codex/SKILL.md § Sandbox + CWD discipline` | `mistakes/codex-eval-session-write-path-nested-in-worktree.md` | 06 |
| 9 | `codex/SKILL.md § Hang + timeout discipline` | `git/SKILL.md` (background-mode) | 06 |
| 10 | `gobbi/SKILL.md § Skill Map` | `codex` skill | 06 |

**Verified by Task 07 sweep:** all 10 entries checked post-ship with grep + awk smoke tests.

---

## Decisions Log (P1–P12)

| # | Topic | Decision | Source |
|---|---|---|---|
| P1 | Concern 1 (Wrap-up Step 2.5 anchor) | Option (b) — new `### Step 2.5` H3 inserted between `### WORK discipline` (~line 184) and `## Staging → Project-memory routing` (line 185), table row 2 flags Step 2.5 existence. | `preparation.md:127-131` + leader empirical verification |
| P2 | Concern 2 (memorization Path conventions anchor) | Option (b) — promote `**Path conventions**` to `### Path conventions` H3 at memorization/SKILL.md:224. | `preparation.md:133-139` + leader empirical verification |
| P3 | Concern 3 (Coverage Ownership Matrix cell text) | RESOLVED — user selected Draft A at Planning iter 2 entry. Row text inlined verbatim throughout Plan + Task 05 brief. | User selection at iter 2 entry; concern-3 decision record |
| P4 | Concern 4 (symlinks) | RESOLVED at Preparation — symlinks created at Preparation EXIT; Task 06 verifies presence only. | `preparation.md:147-151` |
| P5 | Concern 5 (Constraints body block vs H2) | KEEP body block per locked 8-H2 Idea contract. Annotation references "body block per locked Idea Design A (8 H2 section contract)" — no references to non-existent skill files. | `idea.md` Decisions Locked + empirical 6/6 sample |
| P6 | Task bundling | 7 separate tasks; no bundling of F+G with codex content, no bundling of B+C. | This Plan § Bundling considered + rejected |
| P7 | Execution order | Sequential 01 → 02 → 03 → 04 → 05 → 06 → 07 — F+G first (pacing), B before C+E (link-target dep), wrap-up before codex (largest task last), sweep last. | This Plan § Dependency table + § Parallel lanes |
| P8 | Iron Law 7 brief discipline | Every executor brief MUST `Read` the Ideation source verbatim before authoring; verbatim text inlined in the brief, not from memory. Cited mistake: `manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md` (session-staged). | Session mistake-candidate + `preparation.md:117` |
| P9 | Task 07 agent type | `assistant` (verification-only) not `executor` — mechanical grep/sed sweep, no source-file edits. | `delegation/SKILL.md § Agent Roster` |
| P10 | COD-CONS-003 disposition | Inline micro-fix in Task 04 (`Domain=\`testing\`` → `Domain=\`test\``) per `idea.md:92-93`. | Idea deferral list |
| P11 (iter2) | Iter1 codex-eval REVISE fix-list | Iter2 surgical fix: (1) Concern 3 RESOLVED — Draft A inlined verbatim; (2) all session paths absolute per worktree-nesting mistake; (3) Task 04 brief discipline strengthened to match Task 06 — Read-required + 5-Type vocab verbatim + 4-category gap table verbatim + post-edit verification gate; (4) `_claude/SKILL.md` references removed (Concern 5 cleanup); (5) `manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md` added to Task 01 Required mistakes. | iter1 codex eval (COD-PROJ-001 / COD-CONS-001 / COD-USAGE-001 / COD-RISK-002 / COD-OVERALL-001 / COD-STRUCT-001 / COD-RISK-001 / COD-OVERALL-002 / COD-USAGE-002 / COD-OVERALL-003 / COD-CONS-002) + Claude eval F-CONS-03 + manager iter2 brief |
| P12 (iter2) | Fix 6 (markdown anchors) disposition | SKIPPED this iter — Iron Law 11 risk (would require inventing fake anchors on evaluation/SKILL.md which doesn't have stable anchor IDs). Line refs preserved as evidence-based citations. Staged as Wrap-up backlog candidate. | iter1 Claude eval F-RISK-02 (marked OPTIONAL); Iron Law 11 |

---

## NOT in Scope

Out-of-scope items deferred per `idea.md:54-61`:

- 1-2 skill-loading discipline (eager-load) — root cause investigation needed.
- 1-3 worktree-first session architecture — failure mode not yet named.
- 2-1 Auto mode silence semantics — coupled to memorization fix outcome.
- 2-2 Chat mode tiki-taka redesign — user-deferred.
- 4-1 session.json subagent metadata + tokensUsed hook — feasibility unverified.
- Any change to `packages/cli/src/` — path does not exist.
- Pathology β (manager inline-bypass) — conditional on Wrap-up Step 2.5 detection.
- Normalize `Path conventions` to H3 across `mistake/SKILL.md:126` + `planning/SKILL.md:459` — Concern 2 spillover; staged as project backlog by Task 05.
- Normalize `Constraints` to `## Constraints` H2 across all skills — Concern 5 spillover; conflicts with locked 8-H2 codex contract.
- COD-CONS-003 (`Domain=\`testing\`` → `Domain=\`test\``) — micro-fix applied inline in Task 04.
- Markdown anchors over line refs in Cross-Link Manifest 4/5/6 — Fix 6, OPTIONAL, SKIPPED per Iron Law 11.

---

## Self-Review (Sub-step E)

### Spec coverage: 15/15 — full coverage

| Idea checklist item | Task |
|---|---|
| 1 — codex SKILL.md 8 H2 sections | 06 |
| 2 — codex symlinks (file + directory) | Resolved at Preparation EXIT; verified by 06 + 07 |
| 3 — gobbi/SKILL.md § Skill Map row | 06 |
| 4 — memorization Core Principle | 02 |
| 5 — mistake P2 reciprocal | 02 |
| 6 — delegation Core Principle + table row | 03 |
| 7 — delegation per-role templates | 03 |
| 8 — wrap-up Step 2.5 | 04 |
| 9 — evaluation Coverage Ownership Matrix row | 05 |
| 10 — memorization Path Conventions cross-link | 05 |
| 11 — gobbi/SKILL.md Glossary move | 01 |
| 12 — gobbi/SKILL.md Step 4 rewrite | 01 |
| 13 — settings.default.json verify (no diff) | 01 (verify-only) |
| 14 — codex Use cases section | 06 |
| 15 — codex Anti-patterns section ≥8 | 06 |

### Placeholder scan: PASS — zero occurrences

`grep -nE "TBD|TODO|to be defined|<\\.\\.\\.>|XXX|FIXME"` — zero in task scopes, success criteria, or verification commands. Concern 3 RESOLVED at iter 2 entry — no Plan-level NEEDS_CONTEXT blocks remain.

### Type / name consistency: PASS — no drift

- 5 Types vocabulary (`scenario_gap`, `checklist_gap`, `design_flaw`, `assumption_risk`, `general`) consistent across Tasks 04 + 05 + 07 + briefing language. Cited file:line: `evaluation/SKILL.md:344-352`.
- 8 H2 sections (codex skill) consistent between Task 06 verifies block + Idea Design A (`idea.md:269-274`).
- `allowed-tools` frontmatter convention consistent; `when-to-load` explicitly excluded (Task 06 verify).
- Cross-Link Manifest — all 10 entries map to Tasks 02/03/04/05/06/07 verifies.
- File paths — all source-of-truth paths confirmed. Session paths absolute throughout (Fix 2).
- No residual `_claude/SKILL.md` references in operational task content (Fix 4).

### Anti-pattern scan: PASS

- No "TBD" / "TODO" / "Similar to Task N" markers.
- Every task has both an anchor (`traces-to`) and explicit `files:` block.
- No test-writing tasks.
- No implementation code or step-by-step recipes in `what` fields.

---

## Evaluation Summary (2-iter dual-system)

| Iter | Claude verdict | Codex verdict | Aggregate | Critical | High |
|---|---|---|---|---|---|
| 1 | PASS | REVISE | REVISE | 0 | 8 (Codex: Concern 3 unlocked, relative paths, Task 04 brief weakness, `_claude` refs) |
| 2 | PASS | PASS | **PASS** | 0 | 0 |

**Iter 1 REVISE root causes (Codex):** (1) Concern 3 still marked user-decision despite user locking Draft A — COD-PROJ-001, COD-CONS-001, COD-USAGE-001, COD-RISK-002, COD-OVERALL-001; (2) relative/ellipsis session paths instead of absolute main-tree — COD-STRUCT-001, COD-RISK-001, COD-OVERALL-002; (3) Task 04 verbatim-spec discipline weaker than Task 06 — COD-USAGE-002, COD-OVERALL-003; (4) residual `_claude/SKILL.md` reference after Concern 5 resolution — COD-CONS-002.

**Codex sandbox note (iter 1):** First attempt hit sandbox project-root detection issue (`writing outside of project; rejected`) — empirical witness for codex skill `--add-dir` requirement (Item A). Retry with `--cd` + `--add-dir` succeeded.

**Iter 2 PASS confirmation (both systems):** All 5 mandatory surgical fixes verified. Fix 6 (optional markdown anchors) correctly skipped with Iron Law 11 rationale (P12 Decisions log). 28 absolute path occurrences vs 0 in iter 1. Zero scope creep, zero locked-decision reopening, zero new Iron Law violations.

**Iter 2 remaining findings (all disposition: addressed or informational):**
- Claude Consistency: 1 Low (conf 25, informational, non-gating)
- Codex per-perspective: all `disposition: addressed` findings carried from iter 1; no new threshold findings
