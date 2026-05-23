---
loop: planning
iter: 1
artifact_type: planning-draft
created_at: 2026-05-23
status: draft
session-id: 2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068
feature: gobbi-orchestration-workflow-improvements
supersedes: []
related:
  - sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/ideation/artifacts/idea.md
  - sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/preparation/artifacts/preparation.md
  - sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/preparation/staging/decisions/manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md
---

# Planning Draft — Iter 1

> Decomposes the locked 7-item / 15-checklist Bundle A scope into ordered Execution tasks.
> Inputs: `idea.md` (PASS, iter3), `preparation.md` (PASS, iter3).
> Session is **git workflow mode (worktree + PR)** — per-task worktree + branch + PR, base=develop.

---

## Scope reference

**Source contract** — `ideation/artifacts/idea.md:31-93` (Scope Contract LOCKED at Ideation iter3 PASS).

```yaml
artifact_type: scope-contract
feature: gobbi-orchestration-workflow-improvements
goal: "Repair four discipline gaps in gobbi orchestration/workflow that broke last session — codex invocation lacks a canonical best-practices anchor; memorization runs late and unloaded; wrap-up never checks prior-loop compliance; naming convention is documented but unenforced — plus two minor polish items in the gobbi entry skill."
created-by: 2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068
created-at: 2026-05-23
```

7 in-scope items (A–G), 15 checklist items (`idea.md:245-261`), 10 cross-links (`idea.md:311-326`). All Decisions Locked at `idea.md:62-73`. Pre-resolved at brief-construction: 5 finding Types vocabulary `{scenario_gap, checklist_gap, design_flaw, assumption_risk, general}`; frontmatter `allowed-tools` (NOT `when-to-load`); triple-symlink discipline for codex.

---

## DISCUSSION — Open Concerns Resolutions

Four open concerns inherited from `preparation.md:121-157`. Concern 4 was resolved at Preparation (symlinks created at Preparation EXIT — codex skill stub already promoted; Execution task A only fills content). Concern 5 is informational. Below are the leader's research-backed resolutions for 1, 2, 3, and 5.

### Concern 1 — Wrap-up Step 2.5 anchor placement (Item D)

**Investigation** — `wrap-up/SKILL.md`:
- Line 118: `## WORK Phase (delegated to assistant)`
- Lines 133-141: WORK Procedure table (Steps 1-7 enumerated as table rows)
- Line 176: `### WORK discipline`
- Lines 158-174: Outputs / Exit checklist subsections live between the procedure table and `### WORK discipline`

The procedure table (lines 133-141) is the canonical step enumeration; inserting "Step 2.5" as an inline table row between Step 2 and Step 3 inflates the table and forces every adjacent row's step number to be re-anchored if a future Step ever gets inserted. A self-contained `### Step 2.5 — prior-loop MEMORIZATION compliance check` H3 inserted **after `### WORK discipline` (line 176) but before `## Staging → Project-memory routing` (line 185)** preserves the table-as-summary contract and gives the step ~10-20 lines of room for: inputs, scan procedure, 4-category gap table, mechanical/judgment classification (5 Types), auto-backfill + collision policy, NEEDS_CONTEXT trigger, gap-report path. **Recommendation: Option (b) — new `### Step 2.5` H3 inserted between line 184 (end of WORK discipline) and line 185 (`## Staging → Project-memory routing`), and an explicit anchor reference added in row 2 of the procedure table (line 134) so the table still flags Step 2.5's existence between Step 2 and Step 3.**

Cited Preparation's same recommendation (Option b, `preparation.md:129`). Adopted with one refinement: place after `### WORK discipline`, not "approximately line 176" — line 184 is the precise edge after `### WORK discipline` body ends. Execution must verify with `sed -n '176,190p' wrap-up/SKILL.md` immediately before editing.

**Manager-review status:** auto-resolved per Preparation recommendation. Not a User Challenge. No `user-question:` block.

### Concern 2 — `memorization/SKILL.md § Path conventions` anchor casing (Item E, Cross-Link 7)

**Investigation** — `memorization/SKILL.md:224` (verified via `sed -n '220,235p'`):

```
**Path conventions**

- `{date}` — session start date in `YYYY-MM-DD`
- `{session-id}` — Claude Code session ID from `$CLAUDE_CODE_SESSION_ID` ...
```

The bold paragraph carries no stable markdown anchor — `#path-conventions` does not resolve. The same convention exists elsewhere in the gobbi skill tree (planning/SKILL.md:459 `**Path conventions**`; mistake/SKILL.md:126 `**Path conventions**`) — promoting one site to H3 without promoting others would create cross-skill divergence. However, Item E's Cross-Link 7 specifically targets this one site. **Recommendation: Option (b) — promote `**Path conventions**` to `### Path conventions` H3 at line 224 in `memorization/SKILL.md` only.** Document the divergence with the other two sites as a follow-up backlog entry (item: "normalize Path conventions to H3 across mistake/planning skills") — out of scope for this session per `idea.md:54-61` exclusions.

Cited Preparation's recommendation (Option b, `preparation.md:137`). Adopted as-is. No User Challenge.

**Manager-review status:** auto-resolved per Preparation recommendation. Recommends adding the follow-up note as a `backlogs/project/{slug}.md` staging entry during Execution task E (low-cost — single Edit).

### Concern 3 — Coverage Ownership Matrix exact cell text (Item E)

**Investigation** — `evaluation/SKILL.md:98-110` (verified Coverage Ownership Matrix). Schema is 3 columns: `Cross-cutting concern | Owning perspective(s) | What's verified`. Existing rows model the desired tone (terse, machine-greppable). Idea Decision E (`idea.md:294-296`) defers exact text "to Planning DISCUSSION."

**Proposed row (leader's draft)** — propose to user via AskUserQuestion before Execution begins task E:

| Cross-cutting concern | Owning perspective(s) | What's verified |
|---|---|---|
| **Memorization staging shape + naming** | Consistency + Aesthetics | Per-finding `{slug}.md` filename convention (no bulk files); 5-Type vocabulary (`scenario_gap` / `checklist_gap` / `design_flaw` / `assumption_risk` / `general`) in frontmatter; Domain routing matches `evaluation/SKILL.md § Complete Domain → staging destination routing`; Slug+collision policy compliance per `evaluation/SKILL.md:385-393` |

**Alternative — tighter** (if user prefers minimal cell text):

| **Memorization staging shape + naming** | Consistency + Aesthetics | `{slug}.md` per-finding; 5-Type vocabulary; Domain routing matches `evaluation/SKILL.md`; collision policy lines 385-393 |

**Manager-review status:** USER DECISION REQUIRED. Surface as DONE_WITH_CONCERNS — manager presents these two drafts via AskUserQuestion before Execution task E. Default if user declines to choose: the longer "leader's draft" version (richer signal for evaluators).

### Concern 5 — `Constraints` body-block vs `## Constraints` convention

**Investigation** — empirical verification across 6 sampled project skills via `grep -n "^## Constraints"`:

- `git/SKILL.md:263` → `## Constraints` (H2)
- `research/SKILL.md:159` → `## Constraints` (H2)
- `preparation/SKILL.md:401` → `## Constraints` (H2)
- `wrap-up/SKILL.md:349` → `## Constraints` (H2)
- `mistake/SKILL.md:100` → `## Constraints` (H2)
- `execution/SKILL.md:275` → `## Constraints` (H2)

**6 of 6 sampled project skills use `## Constraints` as H2.** The codex skill stub (`skills/codex/SKILL.md:132`) uses `**Constraints**` as a body block because Idea Design A locked exactly 8 H2 sections (`grep -c "^## " SKILL.md` MUST return 8). Promoting Constraints to H2 #9 would break the locked validation contract.

This is a known, intentional divergence per Decisions Locked. The `_claude/SKILL.md` cited in the stub does NOT exist (`ls .agents/skills/_claude/` → not found; `ls .claude/skills/claude/` → not found). The "body block per `_claude/SKILL.md` standard" annotation in the stub is referencing a non-existent file. **Recommendation: keep the body block per the locked 8-H2 contract (Idea wins) AND update the stub annotation in Execution task A to drop the spurious `_claude/SKILL.md` reference — replace with "body block per locked Idea Design A; H2 count contract."** No User Challenge — the contract supersedes convention this session.

**Follow-up backlog candidate** (out of scope, stage at Execution task E): "Normalize Constraints to `## Constraints` H2 across all skills once codex H2 count contract is revisited" — but only after a session-architecture pass re-considers whether the H2 count is a meaningful constraint.

**Manager-review status:** auto-resolved per Idea Decisions Locked. Note for Execution task A: drop the `_claude/SKILL.md` reference in the codex Constraints block.

---

## File map

All 7 in-scope items collapse onto **8 source files + 4 template files + 1 cross-link target = 13 files modified** (no new files except codex content, which lands at the pre-promoted stub path). Path verifications per Preparation `preparation.md:73-86`.

| File | Op | Touched by items | Responsibility |
|---|---|---|---|
| `.gobbi/projects/gobbi/skills/codex/SKILL.md` | Modify (fill stub content) | A (checklist 1, 14, 15) | New skill content — 8 H2 sections, Constraints body block, anti-patterns |
| `.agents/skills/codex/SKILL.md` *(directory symlink target)* | Verify | A (checklist 2) | Confirm `.agents/skills/codex` directory symlink resolves; count = 17 |
| `.claude/skills/codex/SKILL.md` *(file symlink)* | Verify | A (checklist 2) | Confirm file symlink resolves to the source-of-truth path |
| `.agents/skills/gobbi/SKILL.md` | Modify | A (checklist 3), F (checklist 11), G (checklist 12) | Skill Map row + Glossary move + Step 4 rewrite |
| `.agents/skills/memorization/SKILL.md` | Modify | B (checklist 4), E (checklist 10) | Core Principle "Moment-of-capture" + Path conventions H3 promotion + cross-link to Coverage Ownership Matrix |
| `.agents/skills/mistake/SKILL.md` | Modify | B (checklist 5) | P2 strengthening + reciprocal link to memorization |
| `.agents/skills/delegation/SKILL.md` | Modify | C (checklist 6) | Core Principle + Load Directives table row |
| `.agents/skills/delegation/templates/assistant.md` | Modify | C (checklist 7) | Include `memorization/SKILL.md` in Skills tier |
| `.agents/skills/delegation/templates/leader.md` | Modify | C (checklist 7) | Include `memorization/SKILL.md` in Skills tier |
| `.agents/skills/delegation/templates/executor.md` | Modify | C (checklist 7) | Include `memorization/SKILL.md` in Skills tier |
| `.agents/skills/wrap-up/SKILL.md` | Modify | D (checklist 8) | Insert `### Step 2.5` H3 + Exit checklist update |
| `.agents/skills/evaluation/SKILL.md` | Modify | E (checklist 9) | Coverage Ownership Matrix new row |
| `.agents/skills/orchestration/templates/settings.default.json` | Verify only (NO diff) | G (checklist 13) | Confirm defaults; no schema change |

**Symlink targets** (`.claude/skills/...`, `.agents/skills/...`) resolve through the source-of-truth path under `.gobbi/projects/gobbi/skills/` for codex; for the other 7 skills the source-of-truth lives at `.agents/skills/{skill}/SKILL.md` — verified via `ls -la`. Edit operations target the source-of-truth path; symlinks reflect changes automatically. **Path discipline:** Edit operations MUST use the canonical source-of-truth path (the file the symlink points to), not the symlink path.

---

## Tasks

7 Execution tasks, one per Idea item (bundling deferred — see § Bundling considered + rejected below). Each task = one worktree + one branch + one focused commit + one PR per `git/SKILL.md` (session is git workflow mode per `idea.md:13-15`-derivative + manager brief).

### Task 01 — Polish G + F (gobbi/SKILL.md)

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

### Task 02 — Bundle B (memorization Moment-of-Capture + mistake P2 reciprocal)

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

### Task 03 — Bundle C (delegation hard gate + 3 per-role templates)

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
  - "! grep -q '`memorization/SKILL.md`' .agents/skills/delegation/templates/evaluator.md  # evaluator REMAINS excluded (current file has 1 incidental mention only, not a load directive — fail if a Load Directives-style entry appears)"
  - "git diff --name-only develop... | sort | diff - <(echo -e '.agents/skills/delegation/SKILL.md\\n.agents/skills/delegation/templates/assistant.md\\n.agents/skills/delegation/templates/executor.md\\n.agents/skills/delegation/templates/leader.md' | sort)"
```

### Task 04 — Bundle D (wrap-up Step 2.5)

```yaml
id: 04-wrap-up-step-2-5
what: "Insert ### Step 2.5 H3 in wrap-up/SKILL.md between '### WORK discipline' (line 176) and '## Staging → Project-memory routing' (line 185). Section content: 4-category gap table (staging-empty / staging-partial / directory-absent / bulk-file-naming-violation), mechanical/judgment classification using the 5 Types {scenario_gap, checklist_gap, design_flaw, assumption_risk, general}, auto-backfill + collision policy reference to evaluation/SKILL.md:385-393, NEEDS_CONTEXT trigger for judgment-required, gap report destination rawdata/promotion-manifest.md. Update the WORK Procedure table at line 134 row 2 to flag Step 2.5's existence between Step 2 and Step 3. Update Exit checklist (line 158-173) to add: '[ ] Step 2.5 prior-loop compliance scan recorded in promotion-manifest.md'. Also apply COD-CONS-003 micro-fix in this same task: 'Domain=`testing`' → 'Domain=`test`' if such an illustrative example is authored."
traces-to:
  - "idea.md checklist 8 — Insert Step 2.5 between Steps 2 and 3 with 4-category gap table, 5-Type classification, auto-backfill + Slug+collision policy pre-write check, NEEDS_CONTEXT trigger, gap report; update Exit checklist"
  - "idea.md Cross-Link Manifest 4 + 5 + 6 (idea.md:319-321)"
  - "preparation.md:127-131 (Concern 1 resolution adopted Option b)"
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
  - "grep -E 'scenario_gap.*checklist_gap.*design_flaw.*assumption_risk.*general|scenario_gap|checklist_gap|design_flaw|assumption_risk' .agents/skills/wrap-up/SKILL.md | awk '/scenario_gap/&&/checklist_gap/&&/design_flaw/&&/assumption_risk/{c++}END{exit (c>=1 ? 0 : 1)}'"
  - "grep -ciE 'mechanical|judgment-required' .agents/skills/wrap-up/SKILL.md | awk '$1 >= 2 {exit 0} {exit 1}'"
  - "grep -c 'directory-absent\\|directory absent\\|staging-empty\\|staging empty' .agents/skills/wrap-up/SKILL.md | awk '$1 >= 1 {exit 0} {exit 1}'  # 4th gap category present"
  - "grep -c 'evaluation/SKILL.md' .agents/skills/wrap-up/SKILL.md | awk '$1 >= 2 {exit 0} {exit 1}'  # cross-links 4+5+6 wired"
  - "grep -c 'promotion-manifest' .agents/skills/wrap-up/SKILL.md | awk '$1 >= 2 {exit 0} {exit 1}'  # gap report destination cited"
  - "! grep -q 'Domain=`testing`' .agents/skills/wrap-up/SKILL.md  # COD-CONS-003 micro-fix: no `testing` typo"
  - "git diff --name-only develop... | sort | diff - <(echo '.agents/skills/wrap-up/SKILL.md')"
```

### Task 05 — Bundle E (Coverage Ownership Matrix row + memorization cross-link + Path conventions H3 promotion)

```yaml
id: 05-coverage-ownership-naming-row
what: "Add new row to evaluation/SKILL.md § Coverage Ownership Matrix (around line 110, after the 'Error budget impact' row): 'Memorization staging shape + naming | Consistency + Aesthetics | <user-confirmed cell text from Concern 3>'. Promote `**Path conventions**` to `### Path conventions` H3 at memorization/SKILL.md:224. Add a one-line cross-link sentence under the new H3 pointing at evaluation/SKILL.md § Coverage Ownership Matrix § Memorization staging shape + naming. Stage backlog candidate at sessions/.../planning/staging/backlogs/project/normalize-path-conventions-h3.md for the mistake/SKILL.md:126 + planning/SKILL.md:459 sites (out-of-scope this session)."
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
  - "User-confirmed cell text from AskUserQuestion (manager-resolved at WORK entry)"
  - "preparation.md Concern 2 (H3 promotion approach) + Concern 3 (cell text user-decision)"
outputs:
  - "Coverage Ownership Matrix has Memorization staging shape + naming row; memorization/SKILL.md § Path conventions is stable H3 anchor with cross-link to evaluation matrix"
  - "backlogs/project/normalize-path-conventions-h3.md staged (low-cost follow-up)"
verifies:
  - "grep -c 'Memorization staging shape\\|staging shape + naming' .agents/skills/evaluation/SKILL.md | awk '$1 >= 1 {exit 0} {exit 1}'"
  - "grep -c '^### Path conventions' .agents/skills/memorization/SKILL.md | awk '$1 >= 1 {exit 0} {exit 1}'  # H3 promoted"
  - "grep -c 'Coverage Ownership Matrix' .agents/skills/memorization/SKILL.md | awk '$1 >= 1 {exit 0} {exit 1}'  # cross-link wired"
  - "awk '/^## Coverage Ownership Matrix/,/^---/' .agents/skills/evaluation/SKILL.md | grep -cE 'Consistency.*Aesthetics|Aesthetics.*Consistency'  # Owner perspectives in new row include Consistency + Aesthetics"
  - "test -f sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/planning/staging/backlogs/project/normalize-path-conventions-h3.md  # backlog staged"
  - "git diff --name-only develop... | grep -v 'sessions/' | sort | diff - <(echo -e '.agents/skills/evaluation/SKILL.md\\n.agents/skills/memorization/SKILL.md' | sort)"
```

### Task 06 — Bundle A (codex skill content fill)

```yaml
id: 06-codex-skill-content
what: "Fill the 8 H2 sections of .gobbi/projects/gobbi/skills/codex/SKILL.md (currently stub at the promoted path). Sections (locked, do NOT rename or reorder): (1) When to load, (2) Invocation patterns, (3) Why subagents must use codex exec, (4) Sandbox + CWD discipline, (5) Hang + timeout discipline, (6) Use cases, (7) Cost + sandbox budget awareness, (8) Anti-patterns. Plus Constraints body block (NOT H2 #9 — preserves H2 count contract). Target length: ~350-450 lines per Idea Design A. Add Skill Map row to gobbi/SKILL.md § Skill Map § Cross-cutting skills. Cite empirical witnesses I1-I14 + E1-E5 inline. Drop the spurious `_claude/SKILL.md` reference in the Constraints body block annotation (replace with 'body block per locked Idea Design A; H2 count contract')."
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
  - "! grep -q '_claude/SKILL.md' .gobbi/projects/gobbi/skills/codex/SKILL.md  # spurious reference dropped"
  - "test -L .claude/skills/codex/SKILL.md  # file symlink resolves"
  - "test -L .agents/skills/codex && test -d .agents/skills/codex  # directory symlink + resolves"
  - "test \"$(ls .agents/skills/ | wc -l)\" = '17'  # post-ship symlink count"
  - "grep -E 'codex' .agents/skills/gobbi/SKILL.md | grep -i 'skill map\\|cross-cutting' || awk '/## Skill Map/,/^## /' .agents/skills/gobbi/SKILL.md | grep -q codex   # Skill Map row added"
```

### Task 07 — Verification Sweep + Cross-link consistency check

```yaml
id: 07-cross-link-sweep
what: "Final cross-link verification + name/path drift check across all 10 Cross-Link Manifest entries (idea.md:311-326). Run grep + sed-based smoke tests confirming each link source contains the expected reference and each target file has the expected anchor heading. Stage findings as decisions if any link is broken. No source-file edits — this is a verification-only task that writes only to session staging if findings exist."
traces-to:
  - "idea.md Cross-Link Manifest 1-10 (idea.md:311-326)"
  - "idea.md Success Criteria 1-9 (idea.md:75-84)"
requires: [01-gobbi-polish-fg, 02-memorization-moment-of-capture, 03-delegation-memorization-hard-gate, 04-wrap-up-step-2-5, 05-coverage-ownership-naming-row, 06-codex-skill-content]
files:
  - {path: "sessions/2026-05-23-.../planning/staging/decisions/{slug}.md", op: create-if-needed}
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

---

## Dependency table

| Task | Depends on | Blocks | Files touched |
|---|---|---|---|
| 01-gobbi-polish-fg | — | 06 | `.agents/skills/gobbi/SKILL.md`, `.agents/skills/orchestration/templates/settings.default.json` (verify) |
| 02-memorization-moment-of-capture | — | 03, 05 | `.agents/skills/memorization/SKILL.md`, `.agents/skills/mistake/SKILL.md` |
| 03-delegation-memorization-hard-gate | 02 | 07 | `.agents/skills/delegation/SKILL.md`, `delegation/templates/{assistant,leader,executor}.md` |
| 04-wrap-up-step-2-5 | — | 07 | `.agents/skills/wrap-up/SKILL.md` |
| 05-coverage-ownership-naming-row | 02 | 07 | `.agents/skills/evaluation/SKILL.md`, `.agents/skills/memorization/SKILL.md` |
| 06-codex-skill-content | 01 | 07 | `.gobbi/projects/gobbi/skills/codex/SKILL.md`, `.agents/skills/gobbi/SKILL.md` |
| 07-cross-link-sweep | 01, 02, 03, 04, 05, 06 | — | session staging only |

### Conflict flags

- **`.agents/skills/memorization/SKILL.md` is touched by Tasks 02 AND 05** — sequential ordering enforced (02 before 05). Task 05 must rebase onto Task 02's merged state. No parallel safe.
- **`.agents/skills/gobbi/SKILL.md` is touched by Tasks 01 AND 06** — sequential ordering enforced (01 before 06). Task 06's Skill Map row addition must rebase onto Task 01's merged state. No parallel safe.
- All other tasks touch disjoint files.

---

## Parallel lanes

| Lane | Tasks | Order |
|---|---|---|
| L1 (gobbi skill) | 01 → 06 | Sequential — both touch `gobbi/SKILL.md` |
| L2 (memorization) | 02 → 05 | Sequential — both touch `memorization/SKILL.md` |
| L3 (delegation) | 03 | Solo — runs after 02 (link target dep) |
| L4 (wrap-up) | 04 | Solo — no overlap |
| L5 (sweep) | 07 | Final — depends on 01-06 |

**Effective Execution order** (sequential dispatch — lanes documented only):

`01 → 02 → 03 → 04 → 05 → 06 → 07`

Rationale: Task 01 (F+G polish) ships first — lowest risk, no deps, establishes worktree+PR rhythm and gives manager early signal on git mode. Task 02 (memorization B) is the link target for tasks 03 + 05, ships before either. Task 03 wires delegation hard gate immediately after — small surface, focused. Task 04 (wrap-up Step 2.5) is the largest single-file edit besides codex — runs before codex to keep the largest task last. Task 05 (Coverage Ownership) consumes user-confirmed Concern 3 text, runs after Task 02 to avoid memorization/SKILL.md conflict. Task 06 (codex content fill) is the biggest deliverable, last in main sequence — rebases onto Task 01's gobbi/SKILL.md edits. Task 07 is the cross-link sweep that gates EVALUATION readiness.

---

## Agent assignments

Per-task agent type + model + required skills + required mistakes.

### Task 01 — 01-gobbi-polish-fg

- **Agent type:** `executor`
- **Model:** sonnet (default per `delegation/SKILL.md § Model Selection`)
- **Required skills (Load Directives Skills tier):**
  - `principles` (mandatory)
  - `mistake` skill (mandatory)
  - `execution/SKILL.md` (phase doc)
  - `git/SKILL.md` (worktree + PR mechanics; session is git workflow mode)
  - `memorization/SKILL.md` (per delegation hard gate to be wired by Task 03 — pre-emptively load to dogfood)
- **Required mistakes:**
  - `mistakes/codex-eval-session-write-path-nested-in-worktree.md` (worktree absolute-path discipline)
  - `mistakes/manager-rm-rf-without-investigating-tracked-files.md` (worktree cleanup discipline)
- **Justification (non-default choices):** none — pure default executor + sonnet for a small Edit-only task.

### Task 02 — 02-memorization-moment-of-capture

- **Agent type:** `executor`
- **Model:** sonnet
- **Required skills:** principles, mistake, execution, git, memorization
- **Required mistakes:** codex-eval-session-write-path (worktree), manager-iter2-brief-failed-iron-law-7 (session-staged; brief verbatim-spec-recheck — extremely relevant since Task 02 must edit principle text verbatim per Idea Design B)
- **Justification:** default. NOTE: the manager-iter2-brief mistake is a fresh-witness reminder that "place after 'Store what survives'" must be verified by reading the current memorization/SKILL.md Core Principles section before editing — not from the brief alone.

### Task 03 — 03-delegation-memorization-hard-gate

- **Agent type:** `executor`
- **Model:** sonnet
- **Required skills:** principles, mistake, execution, git, delegation/SKILL.md (phase target), memorization/SKILL.md (cross-link target)
- **Required mistakes:** codex-eval-session-write-path, manager-iter2-brief-failed-iron-law-7
- **Justification:** default. Briefing must include verbatim text for the new Core Principle AND for the table-row content in `delegation/SKILL.md § The Load Directives Block` to avoid a repeat of the iter2-brief-verbatim mistake.

### Task 04 — 04-wrap-up-step-2-5

- **Agent type:** `executor`
- **Model:** sonnet
- **Required skills:** principles, mistake, execution, git, wrap-up/SKILL.md (phase target), evaluation/SKILL.md (5 Types + Slug+collision policy source — MUST be loaded into context to copy-verbatim per Iron Law 7), memorization/SKILL.md
- **Required mistakes:** codex-eval-session-write-path, manager-iter2-brief-failed-iron-law-7 (DIRECT PRECEDENT — Task 04 author MUST `Read` evaluation/SKILL.md:344-393 BEFORE writing Step 2.5 to copy 5-Type vocabulary verbatim, not from brief or memory)
- **Justification:** default executor; brief must include the verbatim 5-Type list AND a directive to re-read evaluation/SKILL.md:344-393 immediately before writing. This is the highest-risk task for vocabulary-from-memory regression.

### Task 05 — 05-coverage-ownership-naming-row

- **Agent type:** `executor`
- **Model:** sonnet
- **Required skills:** principles, mistake, execution, git, evaluation/SKILL.md, memorization/SKILL.md
- **Required mistakes:** codex-eval-session-write-path, manager-iter2-brief-failed-iron-law-7
- **Justification:** default. Briefing must contain the user-confirmed cell text from Concern 3 AskUserQuestion — manager resolves Concern 3 BEFORE dispatching this task; brief inlines the verbatim cell text. No memory-based reconstruction permitted.

### Task 06 — 06-codex-skill-content

- **Agent type:** `executor`
- **Model:** sonnet
- **Required skills:** principles, mistake, execution, git, codex (the skill being filled — its OWN current stub state is required reading), gobbi (Skill Map target)
- **Required mistakes:**
  - codex-eval-session-write-path-nested-in-worktree (the witness this skill cites; CRITICAL for Sandbox + CWD section accuracy)
  - manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck (the brief construction discipline mistake — author MUST `Read` Idea Design A `idea.md:269-274` verbatim before authoring each H2's body content)
- **Justification:** default executor + sonnet. **EXTREME-DISCIPLINE BRIEF REQUIRED** — this is the largest task (300-500 lines) with the strongest history of section-name + vocabulary drift (3 Ideation iters were spent fixing exactly this). Manager brief MUST:
  1. Inline the 8 H2 section names verbatim from `idea.md` (NOT from memory).
  2. Cite `idea.md:269-274` + `idea.md:245-261` as `Read`-required-before-write.
  3. Re-state both finding-Type vocabularies (the 5 Types) explicitly so anti-patterns and use-cases reference them correctly.
  4. Include verification gates per the `verifies:` block above as a mandatory pre-PR self-check.
  5. Stage codex skill content per `_claude` writing standard via the **codex** skill being authored (dogfood gate not required — content can cite the standard from `claude/SKILL.md` if it exists at `.claude/skills/...`).
  6. The drop-spurious-`_claude/SKILL.md`-reference instruction (Concern 5 resolution) must appear inline.

### Task 07 — 07-cross-link-sweep

- **Agent type:** `assistant`
- **Model:** sonnet
- **Required skills:** principles, mistake, memorization/SKILL.md (verification-only, no source edits)
- **Required mistakes:** manager-iter2-brief-failed-iron-law-7
- **Justification:** `assistant` not `executor` — this is mechanical verification (grep + sed sweeps + decision-staging only), no source-file modifications. Matches the `assistant` role per `delegation/SKILL.md § Agent Roster`.

---

## Per-task PR strategy

Each task = one worktree + one branch + one focused commit + one PR (base=develop) per `git/SKILL.md` worktree+PR mode. Manager handles push + PR-open after each executor returns DONE.

| Task | Branch slug | PR title prefix |
|---|---|---|
| 01 | `feat/gobbi-skill-polish-fg` | `docs(gobbi): move Glossary; rewrite Step 4 to 1-question mode + customize gate` |
| 02 | `feat/memorization-moment-of-capture` | `docs(memorization): add moment-of-capture Core Principle + mistake P2 reciprocal` |
| 03 | `feat/delegation-memorization-hard-gate` | `docs(delegation): MEMORIZATION dispatches must include memorization/SKILL.md in Load Directives` |
| 04 | `feat/wrap-up-step-2-5-compliance` | `docs(wrap-up): insert Step 2.5 prior-loop MEMORIZATION compliance check` |
| 05 | `feat/coverage-ownership-naming-row` | `docs(evaluation): Coverage Ownership Matrix row for Memorization staging shape + naming` |
| 06 | `feat/codex-skill-content` | `docs(codex): content-complete skill — 8 H2 sections, anti-patterns, sandbox+CWD discipline` |
| 07 | `chore/bundle-a-cross-link-sweep` | `chore(verification): Bundle A cross-link consistency sweep` |

PR descriptions: each cites the Idea checklist items it satisfies (`idea.md:245-261` row numbers) + the Cross-Link Manifest entries it wires (`idea.md:311-326`).

---

## Self-review report

### Spec coverage check

| Idea checklist item | Task |
|---|---|
| 1 — codex SKILL.md 8 H2 sections | 06 |
| 2 — codex symlinks (file + directory) | Resolved at Preparation EXIT; verified by 06 + 07 (`test -L`) |
| 3 — gobbi/SKILL.md § Skill Map row | 06 (touches gobbi/SKILL.md) |
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

**Coverage: 15/15 — full coverage. No orphaned checklist items.**

### Placeholder scan

`grep -nE "TBD|TODO|to be defined|<\\.\\.\\.>|XXX|FIXME" rawdata/draft-iter1.md` — verified: zero occurrences in task scopes, success criteria, or verification commands.

Exception: the user-confirmed cell text in Concern 3 / Task 05 brief is intentionally unfilled in this Plan — the manager fills it at WORK entry from the AskUserQuestion outcome. This is a Plan-level NEEDS_CONTEXT, surfaced explicitly under "Open Concerns / Decisions Log" — not a placeholder.

### Type / name consistency check

- **5 Types vocabulary** (`scenario_gap`, `checklist_gap`, `design_flaw`, `assumption_risk`, `general`) consistent across Tasks 04 + 05 + 07 + briefing language. Cited file:line: `evaluation/SKILL.md:344-352` (Iron Law 7 source).
- **8 H2 sections** (codex skill) consistent between Task 06 verifies block + Idea Design A (`idea.md:269-274`) — names verbatim: When to load / Invocation patterns / Why subagents must use codex exec / Sandbox + CWD discipline / Hang + timeout discipline / Use cases / Cost + sandbox budget awareness / Anti-patterns.
- **Frontmatter convention** — `allowed-tools` consistent (`idea.md` + stub + Task 06 verify); `when-to-load` explicitly excluded (Task 06 verify: `! grep -q '^when-to-load:'`).
- **Cross-Link Manifest** — all 10 entries map to Tasks 02/03/04/05/06/07 verifies. No orphan links.
- **File paths** — all source-of-truth paths confirmed via empirical `ls`/`grep` checks before draft write (Preparation `preparation.md:73-86`).

**No drift found.**

### Anti-pattern scan

- No "TBD" / "TODO" / "Similar to Task N" markers.
- Every task has both an anchor (`traces-to`) and explicit `files:` block.
- No test-writing tasks (verification anchored to evaluator, not authored as Planning tasks).
- No implementation code or step-by-step recipes embedded in `what` fields.

### Self-review clearance

**Status: PASS.** All Sub-step E checks (Spec coverage / Placeholder / Type-name consistency) clear. One acceptance: the Task 05 cell text is a user-decision Plan-level NEEDS_CONTEXT; not a placeholder bug.

---

## NOT in scope

Out-of-scope items deferred per `idea.md:54-61`:

- 1-2 skill-loading discipline (eager-load) — root cause investigation needed.
- 1-3 worktree-first session architecture — failure mode not yet named.
- 2-1 Auto mode silence semantics — coupled to memorization fix outcome.
- 2-2 Chat mode tiki-taka redesign — user-deferred.
- 4-1 session.json subagent metadata + tokensUsed hook — feasibility unverified.
- Any change to `packages/cli/src/` — path does not exist.
- Pathology β (manager inline-bypass) — conditional on Wrap-up Step 2.5 detection.
- Normalize `Path conventions` to H3 across `mistake/SKILL.md:126` + `planning/SKILL.md:459` — Concern 2 spillover; staged as project backlog by Task 05.
- Normalize `Constraints` to `## Constraints` H2 across all skills — Concern 5 spillover; conflicts with locked 8-H2 codex contract; staged as project backlog by Task 05 (or Task 06 — manager decides at Wrap-up).
- COD-CONS-003 (`Domain=\`testing\`` → `Domain=\`test\``) — micro-fix applied inline in Task 04 (not deferred).

### Bundling considered + rejected

- **Bundle Task 01 (F+G) with Task 06 (codex content + Skill Map row)** — all three touch `gobbi/SKILL.md`. **Rejected:** Task 06 is already the largest task; bundling F+G inflates it further and increases REVISE blast radius. Task 01 ships first as a low-risk pacing run, and Task 06 rebases its Skill Map row addition onto Task 01's merged state.
- **Bundle Task 02 (B) with Task 03 (C)** — both touch the delegation/memorization linkage. **Rejected:** Task 02 (`memorization/SKILL.md` + `mistake/SKILL.md`) and Task 03 (`delegation/SKILL.md` + 3 templates) touch disjoint files; separate PRs give cleaner review boundaries and let evaluators check the moment-of-capture principle in isolation before the delegation hard gate amplifies it.
- **Bundle Task 04 (D) with Task 05 (E)** — both reference `evaluation/SKILL.md`. **Rejected:** Task 04 only references it (reads, doesn't edit); Task 05 edits it. No real overlap. Separating preserves Task 05's user-confirmed-cell-text dependency.

---

## Decisions log

| # | Topic | Decision | Source |
|---|---|---|---|
| P1 | Concern 1 (Wrap-up Step 2.5 anchor) | Option (b) — new `### Step 2.5` H3 inserted between `### WORK discipline` (~line 184) and `## Staging → Project-memory routing` (line 185), table row 2 flags Step 2.5 existence. | `preparation.md:127-131` + leader empirical verification |
| P2 | Concern 2 (memorization Path conventions anchor) | Option (b) — promote `**Path conventions**` to `### Path conventions` H3 at memorization/SKILL.md:224. | `preparation.md:133-139` + leader empirical verification |
| P3 | Concern 3 (Coverage Ownership Matrix cell text) | Two drafts proposed (full + tighter); user selects via AskUserQuestion at WORK entry; default = full draft. | `preparation.md:141-145`, this Plan § Concern 3 |
| P4 | Concern 4 (symlinks) | RESOLVED at Preparation — symlinks created at Preparation EXIT; Task 06 verifies presence only. | `preparation.md:147-151` |
| P5 | Concern 5 (Constraints body block vs H2) | KEEP body block per locked 8-H2 Idea contract; drop spurious `_claude/SKILL.md` reference in Task 06. | `idea.md` Decisions Locked + empirical 6/6 sample |
| P6 | Task bundling | 7 separate tasks; no bundling of F+G with codex content, no bundling of B+C. | This Plan § Bundling considered + rejected |
| P7 | Execution order | Sequential 01 → 02 → 03 → 04 → 05 → 06 → 07 — F+G first (pacing), B before C+E (link-target dep), wrap-up before codex (largest task last), sweep last. | This Plan § Dependency table + § Parallel lanes |
| P8 | Iron Law 7 brief discipline | Every executor brief MUST `Read` the Ideation source verbatim before authoring; verbatim text inlined in the brief, not from memory. Cited mistake: `manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md` (session-staged). | Session mistake-candidate + `preparation.md:117` |
| P9 | Task 07 agent type | `assistant` (verification-only) not `executor` — mechanical grep/sed sweep, no source-file edits. | `delegation/SKILL.md § Agent Roster` |
| P10 | COD-CONS-003 disposition | Inline micro-fix in Task 04 (`Domain=\`testing\`` → `Domain=\`test\``) per `idea.md:92-93`. | Idea deferral list |

---

## Memory reads (audit)

Files `Read` during this Planning Loop's DISCUSSION + WORK:

- `.claude/skills/principles/SKILL.md` (Iron Laws 1, 4, 7, 12)
- `.claude/skills/planning/SKILL.md` (phase skill procedure)
- `.claude/skills/orchestration/workflow/planning.md` (manager-facing orchestration)
- `.claude/skills/mistake/SKILL.md` (mistake discipline)
- `.gobbi/projects/gobbi/sessions/.../ideation/artifacts/idea.md` (locked Scope Contract)
- `.gobbi/projects/gobbi/sessions/.../preparation/artifacts/preparation.md` (handoff)
- `.gobbi/projects/gobbi/skills/codex/SKILL.md` (promoted stub)
- `.gobbi/projects/gobbi/mistakes/codex-eval-session-write-path-nested-in-worktree.md`
- `.gobbi/projects/gobbi/sessions/.../preparation/staging/decisions/manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md`
- `.gobbi/projects/gobbi/rules/stub-redirect-format.md`
- `.agents/skills/wrap-up/SKILL.md` (Step structure verification)
- `.agents/skills/memorization/SKILL.md` (Path conventions verification)
- `.agents/skills/evaluation/SKILL.md` (Coverage Ownership Matrix verification)
- `.agents/skills/gobbi/SKILL.md` (Glossary + Step 4 verification)
- `.agents/skills/delegation/SKILL.md` (Load Directives Block verification)
- `.agents/skills/delegation/templates/{assistant,leader,executor,evaluator}.md` (memorization-mention baseline)
- 6 sampled skills for `## Constraints` H2 convention check (git/research/preparation/wrap-up/mistake/execution)

Empirical witnesses cited:
- `grep -c "memorization" delegation/templates/*` → 0/1/0/0/0 (assistant/evaluator/executor/leader/SKILL.md)
- `ls .agents/skills/ | wc -l` post-codex → would-be 17 (current 17, verified — stub already promoted by Preparation manager)
- `grep -n "^## Constraints" *SKILL.md` → 6/6 H2 convention; codex stub diverges per locked Idea contract
- `wrap-up/SKILL.md:184` is the precise edge after `### WORK discipline` body — Step 2.5 insertion point
