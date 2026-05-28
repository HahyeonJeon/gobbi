# Planning draft — Memory-System Redesign migration (iter1)

Session 2026-05-25-a10c82d6. Phase: Planning WORK. Author: leader (PI). Decomposes the LOCKED design `ideation/artifacts/memory-system-redesign-design.md` (§7 propagation + §8 migration) into an ordered, wave-structured, resumable Plan an Execution loop runs one task at a time.

## iter2 remediation log

Dual-system Planning eval returned REVISE; fixed IN PLACE (wave structure, dependency table, conflict flags, Operational Facts 1-4, W3-T3 6-cluster structure, agent/model table, Final-Gate concept all preserved):

- **H1** — W0-T1, W0-T2, W0-T9 SHIPPED in commit `90c46fd` (this session). Marked `STATUS: DONE … SKIP on re-execution` in each; Operational Fact 5 reworded to past tense (symlink already exists); added a W0-rest re-touch guard. Residual "Twelve→Thirteen" intro-prose tweak split into new W0-T1b. Added a duplicate-`## Principle 13` grep guard so re-execution corruption is detectable.
- **H2** — env-var-audit's 6 blocklist-violating files (the 4 `*-decisions.md` + `ideation-discussion.md` + `ideation-references.md`; README is the 7th md but is NOT a violator) now split+renamed BEFORE re-homing: new pre-step **W2-T3b**; W3-T1 gated on it. Final Gate (W5-T3) expanded to check ALL blocklist patterns in sprint/feature-phase context. **Plus** (discovered while validating the expanded gate against the live tree — the iter1 W2 wave only enumerated the 5 orch `decisions/` files; the live tree has 22 feature-side violators total): orch-improvements `design/item-a..g-*.md` (7) and bundle-b `discussions/iter2-*`, `iter3-*`, `t2-*` + `design/five-locked-decisions.md` (4) are ALSO violators that would re-home with non-compliant slugs and fail the gate. W2 now covers all 22: W2-T3 = 5 orch decisions + 7 orch item-X; W2-T3b = 6 env-var-audit; W2-T4 (new) = 4 bundle-b. 17 newly-covered beyond iter1's 5. The gate is now self-consistent with the rename tasks.
- **H3** — CWD convention declared once (below): **every `verifies:` block and grep gate runs with cwd = `<worktree>/.gobbi/projects/gobbi`**; relative paths resolve from there; out-of-root `.claude/...` paths use `../../../.claude/...`.
- **CN-01** — W2-T3 enumeration corrected: owns ONLY the 5 violating orch decision files (concern-1/2/3/5 + iter1-user-redirects) + the 7 orch `item-X` design files; the 4 non-violating concept-slug decision files explicitly excluded; `ideation-decisions.md` belongs to env-var-audit (W2-T3b).
- **ST-02** — W0-T10 + Final-Gate symlink loops scoped to `find … -type l` (skips the real `templates/` dir).
- **ST-03** — W3-T3 gains a per-cluster recovery manifest step.
- **US-01** — W3-T1 now enumerates per-file destinations for the 7 env-var-audit files.
- **US-02 / PJ-02** — W1-T3 sweep bounded to `design/` + `learnings/` + `rules/` + `backlogs/` (no unbounded "any swept file").
- **US-03** — locked design doc added to required-skills for W3-T0..T5 routing tasks.
- **RK-01** — W4-T1 gains an `ls -la tmp/` pre-inspection + confirm-scratch step before any removal.
- **CN-02** — count reconciled: 100 cluster md + 1 README (counted in W3-T5) = 101.
- **AE-01** — `files-out` field semantics normalized (see convention note); W1-T1 `files-out` fixed.

## Path / CWD convention (applies to ALL `verifies:` blocks + grep gates)

**Every verify command and every grep-gate line runs with working directory = `<worktree>/.gobbi/projects/gobbi`** (where `<worktree>` = `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-25-a10c82d6`). All relative paths in `verifies:` (`skills/...`, `mistakes/...`, `backlogs/...`) and in the gate suites resolve from there. Paths that reach OUTSIDE that root — `.claude/CLAUDE.md` and `.claude/skills/...` — are written worktree-relative as `../../../.claude/...` from that cwd, OR the executor prepends `cd <worktree>` for those specific lines (noted inline). An executor MUST `cd <worktree>/.gobbi/projects/gobbi` before running any gate.

**`files-out` field semantics (normalized):** `files-out` lists the files/dirs this task explicitly MUST NOT touch (out-of-scope guard / "leave for a later task") — NOT outputs. A task's outputs are declared in `files-in` (marked `create`/`modify`/`git mv`). Empty `files-out` = no adjacent-scope guard needed.

## Scope reference

- **Locked Idea:** `ideation/artifacts/memory-system-redesign-design.md` (iter2 PASS, manager-verified).
- **Locks:** `ideation/rawdata/locked-decisions.md` L1-L8 — FINAL, do NOT re-open.
- **Readiness:** `preparation/rawdata/readiness.md` — green.
- **Scope contract:** decompose §7 (13 propagation targets) + §8 (cat A-E migration) into waves. In scope: standards authoring + 4-sprint re-homing + slug renames + frontmatter fixes + going-forward session-cleanup docs + follow-up filing. **Out of scope (binding):** implementing anything (Execution's job); relocating `skills/`+`agents/` (L8/FLAG-1); creating a `claude`/`gobbi-install` skill (FLAG-2 is a follow-up to FILE, not to build); any retro-sweep of closed sessions (RATIFY-7); re-opening any lock.

### Already-shipped this session (commit `90c46fd` — "ship memory-system standard core")

Three W0 tasks shipped BEFORE this Plan executes. They are marked `STATUS: DONE — SKIP on re-execution` in the Tasks section. Re-executing them would CORRUPT (duplicate P13 section / overwrite committed rules.md):

- **W0-T1 DONE** — Principle 13 added to `skills/principles/SKILL.md` (1 occurrence) + `.claude/CLAUDE.md` Iron Law row 13 + "13 principles" prose. (NOTE: `skills/principles/SKILL.md` intro still says "Twelve principles" at line 9 — that prose tweak was NOT in 90c46fd. It is the ONE residual W0-T1 sub-item; see W0-T1b.)
- **W0-T2 DONE** — `skills/memorization/rules.md` authored (131 lines) + `.claude/skills/memorization/rules.md` symlink created (target `../../../.gobbi/projects/gobbi/skills/memorization/rules.md`, relative, matches siblings).
- **W0-T9 DONE** — `memorization/rules.md` wired into all 5 delegation templates (leader/assistant/executor/evaluator) + `delegation/SKILL.md`.

**W0-rest re-touch guard:** W0-T1b/T3 through W0-T8 MUST NOT re-edit `principles/SKILL.md` Principle-13 body, `.claude/CLAUDE.md`, `skills/memorization/rules.md` (the sibling), or the 5 delegation files — those are frozen at 90c46fd. (rules.md's content was authored complete in 90c46fd; no follow-on remediation commit exists, so no task re-touches its body. W0-T1b touches ONLY the principles intro line, not the P13 body.)

### Locked operational facts (every task inherits — from L8, §7 mirror-model, and 3 project mistakes)

1. **Edit the CANONICAL worktree-absolute path** `<worktree>/.gobbi/projects/gobbi/skills/X` — NOT the `.claude/skills/X` symlink, NOT the main-tree copy. Witnesses: `mistakes/edit-tool-refuses-symlink-paths.md` (Edit tool refuses symlink writes), `mistakes/executor-mirror-path-vs-worktree-physical-copy.md` + `mistakes/executor-main-tree-edit-near-miss.md` (worktree files are branch-isolated copies; main-tree cwd is the wrong target). `<worktree>` = `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-25-a10c82d6`.
2. **NO double edit.** `.claude/skills/X` is a per-file symlink into the canonical file; one canonical edit reflects automatically. Exception: `gobbi-hook-authoring` is canonical-only (no symlink) — not touched this session.
3. **NEVER physically delete project memory.** Every move / rename / archive / supersede uses `git mv` (preserves history); supersession also flips frontmatter (`status: superseded`, `superseded_by:`).
4. **`.claude/CLAUDE.md` is its own real file** in each tree (not a skill symlink) — a genuine co-update file for the new Principle (P13 blast-radius). Already co-updated in 90c46fd.
5. The `memorization/rules.md` canonical sibling and its `.claude/skills/memorization/rules.md` symlink ALREADY EXIST (created in commit `90c46fd`; symlink target is relative `../../../.gobbi/projects/gobbi/skills/memorization/rules.md`, matching the SKILL.md/memory-map.md siblings). No task creates them; W0-T10 only VERIFIES the symlink still resolves.

## File map

Grouped by wave/feature-concern. Paths are canonical worktree-absolute roots (prefix `<worktree>/.gobbi/projects/gobbi/`); the `.claude/skills/...` symlinks reflect automatically (fact 2).

### Wave 0 — STANDARDS (skill/template/principle authoring; "make the design real" core, §8 cat E + §7)
- `skills/principles/SKILL.md` — **[W0-T1 DONE]** P13 body + Iron Law row 13 already shipped (90c46fd). Residual: "Twelve"→"Thirteen" intro-prose tweak only (W0-T1b).
- `.claude/CLAUDE.md` — **[W0-T1 DONE]** Iron Law row 13 + "13 principles" prose shipped (90c46fd). Real file co-update, not a symlink. No further edit.
- `skills/memorization/rules.md` — **[W0-T2 DONE]** NEW canonical sibling + symlink already shipped (90c46fd). No re-author.
- `skills/memorization/memory-map.md` — 13 per-type-spec canonical home pointers; `session.json.lock` row; archive typed-subdir (typed wins); cross-ref to `rules.md`; project `plans/` row → maintainer-authored-only/NOT-loop-written (HIGH-4); `skills/`-contradiction → L8 follow-up note (FLAG-1) (§7 #3).
- `skills/memorization/SKILL.md` — staging-field-stripping mechanism (§5.3); staging-subdir list aligned to per-type specs; per-perspective eval filename canon + Execution per-task quartet; cross-ref `rules.md` (§7 #5).
- `skills/memorization/templates/*.md` — all 17 templates aligned to temporal-split naming + base+extension frontmatter + scope rule (§7 #8, specs §2.1-2.14).
- `skills/wrap-up/SKILL.md` — frontmatter-allowlist-on-promotion step (strip staging-only fields per type, drop `promoted-from`/`promoted-at`); routing table vs 13+4 specs; non-standard-subdir cleanup doc (no `followups/`, fold `restore/`→rawdata, remove `tmp/`); archive typed-subdir routing (§7 #6).
- `skills/orchestration/SKILL.md` + `skills/orchestration/workflow/*.md` — canonical session tree §3.1; per-task Execution quartet §3.2; per-perspective eval filenames §3.3; `session.json.lock` in session-root docs; retire `state.json` refs; reflect `tmp/` removal (§7 #7).
- `skills/delegation/SKILL.md` + `skills/delegation/templates/{leader,assistant,executor,evaluator}.md` — **[W0-T9 DONE]** `memorization/rules.md` already wired into all 5 templates + SKILL.md (90c46fd). No re-edit.
- `skills/gobbi/SKILL.md` — 7-value-feature model + dev-vibe slugs; install/runtime documented-not-a-skill note; repoint/note the missing `claude` skill ref per FLAG-2 (§7 #10).
- `skills/evaluation/SKILL.md` — 7-perspective vocab = single source for eval filenames; note canonical-perspective requirement (§7 #11).
- `skills/mistake/SKILL.md` — `mistake-candidate` documented staging-only + stripped on promotion (reciprocal to wrap-up) (§7 #12).

### Wave 1 — FRONTMATTER FIXES (§8 cat C, ~25-30 memory files)
- `mistakes/*.md` (17 with `mistake-candidate:true`) — strip the flag line; also drop `finding-id`, `promoted-from`, `promoted-at`, `disposition` (eval-routing) per §5.3; add any missing base fields.
- `rules/stub-redirect-format.md` — add base frontmatter (L6 wins); reword "No frontmatter" clause to scope to stub-redirect TARGET docs only (RATIFY-2).
- `design/session-lifecycle-worktree-boundaries.md`, `design/archive-move-on-terminal-model.md` — ad-hoc keys → base schema (`type: design`).
- `learnings/f-aes-01-*.md` + the other learnings — ad-hoc `discovered`/`promoted-from`/`promoted-at` → base `created`+`session` (the rename of this file is Wave 2).
- bounded sweep of `design/` + `learnings/` + `rules/` + `backlogs/` for any file missing base frontmatter (see W1-T3 scope).

### Wave 2 — SLUG RENAMES (§8 cat B) — all `git mv` + bundle splits
- `backlogs/item-1-2-broader-delegation-contract-verifier.md`, `item-1-2-skill-loading-discipline.md`, `item-1-3-symlink-into-worktree-alternative.md`, `item-1-3-two-surface-collapsing-strategy.md`, `item-2-1-auto-mode-silence-vs-always-ask.md` → concept slugs (5) — W2-T1.
- `learnings/f-aes-01-locked-wording-supersedes-readability-nit.md` → `locked-wording-supersedes-readability-nit.md` (1) — W2-T2.
- `features/gobbi-orchestration-workflow-improvements/`:
  - `decisions/` — SPLIT/rename the **5 blocklist-violating** files (`concern-1/2/3/5-*`, `iter1-user-redirects.md`); EXCLUDE the 4 compliant concept-slug files — W2-T3.
  - `design/item-a..g-*.md` (7) — drop the `item-X` positional prefix → concept slugs (blocklist #3; these are NOT bundles, just positional-prefixed → straight `git mv` rename, no split) — W2-T3.
- `features/env-var-audit/` — SPLIT/rename the **7 blocklist-violating** files (`decisions/{ideation,planning,preparation,t1}-decisions.md`, `discussions/ideation-discussion.md`, `references/ideation-references.md`) BEFORE re-homing — W2-T3b.
- `features/session-foundations-bundle-b/` — rename the **4 blocklist-violating** files: `discussions/iter2-revise-escalation.md`, `discussions/iter3-fail-escalation.md`, `discussions/t2-matrix-location-then-deferral.md` (drop `iterN-`/`t2-` positional prefix → concept slug), and `design/five-locked-decisions.md` (matches `*-decisions.md` blocklist pattern → rename to a non-`-decisions` concept slug, e.g. `five-locked-architecture-choices.md`; it is a single design note, not a bundle → straight rename, no split) — W2-T4. (bundle-c has zero violators.)

### Wave 3 — FEATURE RE-HOMING (§8 cat A, 136 md) — all `git mv` + README→changelog conversion
- Create 7 capability feature dirs: `features/{workflow,project-memory,agents,evaluation,guardrails,git-workflow,install-runtime}/` (+ README.md each, base frontmatter, value_proposition).
- Re-home per §1.3 mapping + §8 LOW-16 routing heuristic. Sub-waved by source sprint:
  - W3a env-var-audit (7 md, post-W2-T3b split — count may exceed 7 after atomic split) → primary `install-runtime`, secondaries git-workflow/workflow.
  - W3b Bundle A / gobbi-orchestration-workflow-improvements (22 md, post-W2-T3 split+rename) → primary `workflow`, secondaries project-memory/agents/evaluation.
  - W3c Bundle B / session-foundations-bundle-b (101 md = 100 cluster md + 1 README, post-W2-T4 rename) → primary `git-workflow`, secondaries install-runtime/agents/workflow. **Largest** — split by subdir-cluster (discussions 28 / design 16 / checklists 15 / backlogs 15 / references 12 / decisions 6 / scenarios 6 / plans 1 / changelogs 1 = 100; README counted in W3-T5).
  - W3d Bundle C / session-foundations-bundle-c (6 md) → primary `git-workflow`; route `archive-move-on-terminal-model.md` + session-lifecycle design to `project-memory`; mistake-promote/hooks → `guardrails`.
  - W3e Retire the 4 sprint dirs (README→changelogs in each touched feature; confirm `notes/` entry exists; `git mv` empty/residual sprint dir to `archive/features/` OR mark README `status: retired` + move per move-on-terminal).

### Wave 4 — SESSION CLEANUP (§8 cat D, going-forward + opportunistic ONLY)
- `git mv`/remove session `tmp/` dirs (RATIFY-8) where they exist — AFTER an `ls -la` pre-inspection + confirm-contents step (RK-01).
- Documentation of canonical tree enforcement is ALREADY in W0 (orchestration/SKILL.md + wrap-up/SKILL.md). W4 is the going-forward-doc confirmation + opportunistic removal of `tmp/` only. **NO retro-sweep of the 5 closed-session `state.json` / 2 `HANDOFF.md`** (RATIFY-7).

### Wave 5 — FOLLOW-UPS + FINAL VERIFY
- `backlogs/{slug}.md` (project-scope) for FLAG-1 (skills/agents location + memory-map-vs-wrap-up contradiction) and FLAG-2 (missing `claude` doc-standard skill + dangling CLAUDE.md nav row).
- Supersede/clarify `mistakes/executor-mirror-path-vs-worktree-physical-copy.md` (the design notes it was misread — its real point is worktree branch-isolation, not `.claude↔.gobbi` doubling): write a clarifying note or supersede in place per mistake skill.
- Final compliance sweep (grep gates below).

## Tasks

> Each task: `id / what / why(witness) / how(first step) / files-in / files-out / verifies / agent+model / requires / committable+commit-shape`. Agent = `executor` unless noted. Model: sonnet default; opus on judgment-heavy re-homing (W3) + bundle-splitting (W2-T3/T3b). All edits use canonical worktree-absolute skill paths (operational fact 1). **All `verifies:` lines run from cwd `<worktree>/.gobbi/projects/gobbi` per the Path/CWD convention above.**

### WAVE 0 — STANDARDS — CHECKPOINT after each task; whole wave is one logical unit

```yaml
- id: W0-T1
  STATUS: DONE — shipped in commit 90c46fd (this session); SKIP on re-execution.
  what: [SHIPPED] Principle 13 in principles/SKILL.md (body §6 verbatim + Iron Law Index row 13) AND .claude/CLAUDE.md Iron Law table row 13 + "13 principles" prose.
  why: L7 + design §6/§7 #1-#2 — new principle has a 3-place blast radius (P13 itself mandates enumerating co-updates).
  shipped-evidence: grep -c "Principle 13" skills/principles/SKILL.md == 1; .claude/CLAUDE.md has row 13 + "13 principles". DO NOT re-run the insert — re-execution would create a DUPLICATE "## Principle 13" section (the ≥1 grep gate passes silently with duplicates).
  residual: the intro-prose "Twelve principles"→"Thirteen principles" tweak (principles/SKILL.md line ~9) was NOT in 90c46fd → split out as W0-T1b.
  committable: DONE (already committed 90c46fd).
```
```yaml
- id: W0-T1b
  what: ONLY the residual intro-prose tweak — change "Twelve principles plus their named anti-rationalizations." → "Thirteen principles plus their named anti-rationalizations." in skills/principles/SKILL.md intro (line ~9). Do NOT touch the P13 body or the Iron Law Index (already shipped in 90c46fd).
  why: §7 #1 sub-item; the count-prose drifted from the shipped row-13 addition. Single-line correction so the intro count matches the 13-row table.
  how: Read skills/principles/SKILL.md line 9; replace the one word "Twelve"→"Thirteen". Verify the P13 body is NOT re-inserted.
  files-in: [skills/principles/SKILL.md (modify — one line only)]
  files-out: [skills/principles/SKILL.md P13 body, Iron Law Index, .claude/CLAUDE.md (all frozen at 90c46fd)]
  verifies: grep -c "Twelve principles" skills/principles/SKILL.md == 0; grep -c "Thirteen principles" skills/principles/SKILL.md == 1; grep -c "## Principle 13" skills/principles/SKILL.md == 1 (NOT 2 — duplicate guard).
  agent: executor; model: sonnet
  requires: []
  committable: yes — "docs(principles): fix intro count Twelve→Thirteen (residual of #<followup>)"
```
```yaml
- id: W0-T2
  STATUS: DONE — shipped in commit 90c46fd (this session); SKIP on re-execution.
  what: [SHIPPED] NEW canonical sibling skills/memorization/rules.md (naming §4.1-4.3 + frontmatter §5 + structure rules + three-way `rules` disambiguation §4) AND its .claude/skills/memorization/rules.md symlink.
  why: §4/§5 + §7 #4 (RATIFY-6). HIGH-2 wiring into delegation also shipped (W0-T9).
  shipped-evidence: test -f skills/memorization/rules.md (131 lines); readlink .claude/skills/memorization/rules.md == ../../../.gobbi/projects/gobbi/skills/memorization/rules.md. DO NOT re-Write — re-execution would OVERWRITE the committed file.
  committable: DONE (already committed 90c46fd).
```
```yaml
- id: W0-T3
  what: Update memory-map.md — 13 per-type-spec home pointers; session.json.lock row; archive typed-subdir wins; cross-ref rules.md; project plans/ row → maintainer-only/NOT-loop-written; skills/-contradiction → FLAG-1 follow-up note.
  why: §7 #3 + §9 contradictions (archive typed wins, plans HIGH-4) + FLAG-1.
  how: Read memory-map.md; locate archive section, plans row, session-root section; apply the 6 edits; add the rules.md cross-reference link. Do NOT re-touch rules.md itself (frozen at 90c46fd) — only add a cross-ref FROM memory-map.
  files-in: [skills/memorization/memory-map.md (modify)]
  files-out: [skills/memorization/rules.md (frozen — cross-ref only, no edit), SKILL.md, templates]
  verifies: grep -q "session.json.lock" skills/memorization/memory-map.md; grep -q "rules.md" skills/memorization/memory-map.md; grep -q "archive/{type}" skills/memorization/memory-map.md; grep -iq "maintainer" skills/memorization/memory-map.md.
  agent: executor; model: sonnet
  requires: []
  committable: yes — "docs(memorization): memory-map type homes + lock row + archive/plans fixes"
```
```yaml
- id: W0-T4
  what: Update memorization/SKILL.md — staging-field-stripping mechanism §5.3; staging-subdir list aligned to specs; per-perspective eval filename canon (bare names) + Execution per-task quartet; cross-ref rules.md.
  why: §7 #5 + §3.2/§3.3.
  how: Read SKILL.md; add §5.3 mechanism text; align the staging-subtree list; add eval-filename canon block. Do NOT re-touch rules.md (frozen) — cross-ref only.
  files-in: [skills/memorization/SKILL.md (modify)]
  files-out: [skills/memorization/rules.md (frozen), wrap-up/SKILL.md, orchestration]
  verifies: grep -q "strip" skills/memorization/SKILL.md; grep -q "perspective" skills/memorization/SKILL.md; grep -q "rules.md" skills/memorization/SKILL.md.
  agent: executor; model: sonnet
  requires: [W0-T3]
  committable: yes — "docs(memorization): staging-strip + eval-filename + quartet canon"
```
```yaml
- id: W0-T5
  what: Align all 17 templates in skills/memorization/templates/ to temporal-split naming + base+extension frontmatter + scope rule per §2.1-2.14; special-case rules.md template (add base frontmatter + reword no-frontmatter→stub-targets-only), archive.md (typed-subdir + original-type-preserved), feature-readme.md (value_proposition, drop sprint keys, scope=feature self-ref).
  why: §7 #8, specs §2. 17-file mechanical-with-judgment alignment.
  how: Read each template; apply the per-type spec frontmatter block + naming line + scope line. Process the 4 feature-subdir templates (changelogs/discussions/scenarios/checklists) per §2.14. NOTE: templates/rules.md is the TEMPLATE file (in templates/), distinct from skills/memorization/rules.md (the shipped sibling — frozen, not touched here).
  files-in: [skills/memorization/templates/{17 files} (modify)]
  files-out: [skills/memorization/rules.md (the sibling — frozen at 90c46fd), the memory files themselves (those are W1-W3)]
  verifies: for each template, frontmatter block matches §5 base; grep -q "stub-redirect TARGET" skills/memorization/templates/rules.md; grep -q "value_proposition" skills/memorization/templates/feature-readme.md; grep -c "^type: archive" skills/memorization/templates/archive.md == 0 (no static literal type).
  agent: executor; model: opus  # judgment: 17 distinct type specs, easy to drift
  requires: [W0-T4]
  committable: yes — "docs(templates): align all 17 memory templates to naming+frontmatter standard"
```
```yaml
- id: W0-T6
  what: Update wrap-up/SKILL.md — frontmatter-allowlist-on-promotion (strip staging-only per type; drop promoted-from/promoted-at); routing table vs 13+4 specs; non-standard-subdir cleanup doc (no followups/, fold restore/→rawdata, remove tmp/); archive typed-subdir routing.
  why: §7 #6 + §5.3 mechanism + §3.4 dispositions.
  how: Read wrap-up/SKILL.md promotion section; add the per-type allowlist step; add the cleanup-doc subsection.
  files-in: [skills/wrap-up/SKILL.md (modify)]
  files-out: [orchestration]
  verifies: grep -q "allowlist" skills/wrap-up/SKILL.md; grep -q "promoted-from" skills/wrap-up/SKILL.md; grep -q "tmp" skills/wrap-up/SKILL.md.
  agent: executor; model: sonnet
  requires: [W0-T5]
  committable: yes — "docs(wrap-up): promotion frontmatter allowlist + subdir cleanup"
```
```yaml
- id: W0-T7
  what: Update orchestration/SKILL.md + workflow/*.md — canonical session tree §3.1; per-task Execution quartet §3.2; per-perspective eval filenames §3.3; session.json.lock; retire state.json refs; reflect tmp/ removal.
  why: §7 #7 + §3.
  how: grep -rn "state.json" skills/orchestration/ to find refs to retire; add the canonical-tree block to SKILL.md; add lock row.
  files-in: [skills/orchestration/SKILL.md (modify), skills/orchestration/workflow/*.md (modify as found)]
  files-out: [delegation/* (frozen at 90c46fd for the rules.md wiring), gobbi, evaluation, mistake]
  verifies: grep -rc "state.json" skills/orchestration/ shows only retired/historical mentions; grep -q "session.json.lock" skills/orchestration/SKILL.md; grep -q "task-{NN}" skills/orchestration/SKILL.md.
  agent: executor; model: sonnet
  requires: [W0-T6]
  committable: yes — "docs(orchestration): canonical session tree + retire state.json"
```
```yaml
- id: W0-T8
  what: Update gobbi/SKILL.md (7-feature model + dev-vibe slugs + install-runtime-documented-not-a-skill + FLAG-2 repoint note), evaluation/SKILL.md (7-perspective vocab = eval-filename source), mistake/SKILL.md (mistake-candidate staging-only/stripped).
  why: §7 #10/#11/#12. Three small reciprocal edits grouped (one category: skill-doc alignment).
  how: Read each; apply the noted change. For gobbi/SKILL.md note the dangling claude-skill nav row → FLAG-2.
  files-in: [skills/gobbi/SKILL.md (modify), skills/evaluation/SKILL.md (modify), skills/mistake/SKILL.md (modify)]
  files-out: [delegation/* (frozen)]
  verifies: grep -q "project-memory" skills/gobbi/SKILL.md; grep -q "staging-only" skills/mistake/SKILL.md; grep -q "perspective" skills/evaluation/SKILL.md.
  agent: executor; model: sonnet
  requires: [W0-T7]
  committable: yes — "docs(skills): 7-feature model + eval-vocab + mistake-candidate strip"
```
```yaml
- id: W0-T9
  STATUS: DONE — shipped in commit 90c46fd (this session); SKIP on re-execution.
  what: [SHIPPED] Wire memorization/rules.md into delegation — Load Directives of leader.md/assistant.md/executor.md/evaluator.md + delegation/SKILL.md.
  why: §7 #13 (HIGH-2 — highest-leverage; without it the standard is advisory-only).
  shipped-evidence: grep -rc "memorization/rules.md" skills/delegation/templates/ shows the wiring across all 4 role templates; delegation/SKILL.md +2 lines. DO NOT re-add — re-execution would duplicate the Load Directive line.
  committable: DONE (already committed 90c46fd).
```
```yaml
- id: W0-T10
  what: Wave-0 compliance verify — confirm all §7 #1-#13 targets edited (W0-T1..T9 incl. the 3 DONE), no double-edit (symlinks unbroken), no orphan refs to old "12 principles".
  why: P7 hard gate before standards are declared the target shape for Waves 1-3.
  how: Run the W0 grep gate suite (below) from cwd <worktree>/.gobbi/projects/gobbi; confirm symlinks resolve.
  files-in: [none — read-only verify]
  files-out: []
  verifies: W0 grep gate suite all green (incl. the duplicate-P13 guard); symlink loop scoped to `find .claude/skills/memorization -maxdepth 1 -type l` all resolve.
  agent: executor; model: sonnet
  requires: [W0-T1b, W0-T3, W0-T4, W0-T5, W0-T6, W0-T7, W0-T8]
  committable: no — verification only (folds into W0-T8 commit or a chore verify note)
```

### WAVE 1 — FRONTMATTER FIXES (3 tasks)

```yaml
- id: W1-T1
  what: Strip mistake-candidate:true + finding-id + promoted-from/promoted-at + eval-routing disposition from the 17 mistakes carrying them; add any missing base fields.
  why: §8 cat C + §5.3 (L6) — staging-only flags leaked into durable memory.
  how: grep -rl mistake-candidate mistakes/ → 17 files; for each, remove the flagged lines, leaving base+extension only (priority/domain/supersedes kept).
  files-in: [mistakes/<17 files> (modify)]
  files-out: [features/ (re-homing is W3 — do not touch features here), mistakes/executor-mirror-path-vs-worktree-physical-copy.md (W5-T2 owns the in-place clarify — strip only, no reword)]
  verifies: grep -rl mistake-candidate mistakes/ | wc -l == 0; grep -rl promoted-from mistakes/ | wc -l == 0.
  agent: executor; model: sonnet
  requires: [W0-T10]
  committable: yes — "chore(mistakes): strip staging-only frontmatter per allowlist"
```
```yaml
- id: W1-T2
  what: Add base frontmatter to rules/stub-redirect-format.md AND reword its "No frontmatter" required-rule to scope to stub-redirect TARGET docs only (not project-memory files).
  why: §2.6/§7 #9 (RATIFY-2 — L6 wins; reciprocal to the templates/rules.md edit in W0-T5).
  how: Add the §5 base block (type: rules, scope: project, priority, established); edit the "No frontmatter" bullet to "...forbidden in the published stub-redirect TARGET docs".
  files-in: [rules/stub-redirect-format.md (modify)]
  files-out: []
  verifies: head -1 rules/stub-redirect-format.md == "---"; grep -q "TARGET" rules/stub-redirect-format.md; grep -q "type: rules" rules/stub-redirect-format.md.
  agent: executor; model: sonnet
  requires: [W0-T10]
  committable: yes — "chore(rules): add base frontmatter + rescope no-frontmatter clause"
```
```yaml
- id: W1-T3
  what: Fix ad-hoc frontmatter keys in design/session-lifecycle-worktree-boundaries.md, design/archive-move-on-terminal-model.md, and the learnings/*.md files → base schema; then run a BOUNDED frontmatter-presence sweep across EXACTLY these dirs — design/, learnings/, rules/, backlogs/ (project-root memory dirs only; NOT features/, NOT mistakes/ [W1-T1 owns], NOT sessions/) — and add base frontmatter to any file missing it.
  why: §8 cat C + §2.4/§2.7 — ad-hoc-key drift. Sweep bounded per US-02/PJ-02 (was unbounded "any swept file").
  how: Read each design+learning file; map bare title/status/feature/related → base (type: design|learnings); drop discovered/promoted-from/promoted-at; then `grep -rL "^---" design/ learnings/ rules/ backlogs/` (excluding README.md indices) to find any other missing-frontmatter file in those 4 dirs only.
  files-in: [design/*.md, learnings/*.md (modify), and any design/|learnings/|rules/|backlogs/ file the bounded sweep flags]
  files-out: [features/* (W3 re-homing), mistakes/* (W1-T1), the f-aes-01 RENAME (W2-T2), sessions/* (out of scope)]
  verifies: every file in design/ and learnings/ starts with "---" + has type/scope/created; grep -rL "^---" design/ learnings/ rules/ backlogs/ | grep -v '/README.md$' | wc -l == 0.
  agent: executor; model: sonnet
  requires: [W0-T10]
  committable: yes — "chore(memory): migrate ad-hoc design/learnings frontmatter to base + bounded sweep"
```

### WAVE 2 — SLUG RENAMES (5 tasks) — all `git mv`

```yaml
- id: W2-T1
  what: git mv the 5 backlogs/item-N-M-*.md to concept slugs (drop item-N-M positional prefix per blocklist #3).
  why: §8 cat B + §4.3 blocklist — positional prefix forbidden (L5).
  how: git mv item-1-2-broader-delegation-contract-verifier.md → broader-delegation-contract-verifier.md (and 4 more analogously); update internal refs if any grep hits.
  files-in: [backlogs/<5 files> (git mv)]
  files-out: []
  verifies: ls backlogs/ | grep -c "^item-" == 0; git status shows 5 renames (R).
  agent: executor; model: sonnet
  requires: [W0-T10]
  committable: yes — "chore(backlogs): rename 5 item-N-M positional slugs to concept slugs"
```
```yaml
- id: W2-T2
  what: git mv learnings/f-aes-01-locked-wording-supersedes-readability-nit.md → locked-wording-supersedes-readability-nit.md (drop finding-ID prefix, blocklist #2).
  why: §8 cat B + §2.7. (Its frontmatter ad-hoc-key fix already done in W1-T3.)
  how: git mv; grep -rl "f-aes-01" .gobbi/projects/gobbi/ and repoint any references.
  files-in: [learnings/<1 file> (git mv)]
  files-out: []
  verifies: ls learnings/ | grep -c "f-aes-01" == 0.
  agent: executor; model: sonnet
  requires: [W1-T3]   # frontmatter fixed before rename so the mv carries a clean file
  committable: yes — "chore(learnings): rename finding-ID-prefixed slug to concept slug"
```
```yaml
- id: W2-T3
  what: (A) SPLIT + rename the 5 BLOCKLIST-VIOLATING decision files in features/gobbi-orchestration-workflow-improvements/decisions/ — EXACTLY: concern-1-wrap-up-step-2-5-anchor.md, concern-2-path-conventions-anchor-casing.md, concern-3-coverage-ownership-cell-text.md, concern-5-constraints-body-block-vs-h2.md, iter1-user-redirects.md — into one-concept-per-file with concept slugs. EXCLUDE the 4 already-compliant files (codex-skill-assistant-wrapper-pattern-for-dual-system-eval.md, constraints-body-block-convention-deferred-to-planning.md, plan-diff-scope-gate-semantics-under-bundled-pr.md, step-2-5-example-non-canonical-domain-value.md) — do NOT process or rename them. (B) STRAIGHT-RENAME (no split) the 7 design/item-a..g-*.md files — drop the `item-X` positional prefix → concept slug (e.g. item-a-codex-skill-structure.md → codex-skill-structure.md). These are single-concept design notes, not bundles. (CN-01: ideation-decisions.md is NOT here — it belongs to env-var-audit, handled by W2-T3b.)
  why: §8 cat B + §4.3 blocklist #1/#3/#8/#11 + L5 atomicity. Must split/rename BEFORE W3 re-homing (heuristic rule 4) so each concept routes individually with a compliant slug. The item-X design files were missed by iter1's decisions-only W2 enumeration (H2 expansion).
  how: (A) Read each of the 5 decision bundles; for each distinct concept inside, write a new one-concept file (date-prefixed; decisions are date-indexed) with base frontmatter; preserve content (no-delete): git mv the bundle source to archive/decisions/ as superseded OR keep split-out files in place. (B) For each of the 7 design/item-X files: git mv to its de-prefixed concept slug.
  files-in: [features/gobbi-orchestration-workflow-improvements/decisions/{concern-1,concern-2,concern-3,concern-5,iter1-user-redirects}.md (split → N new + git mv source); features/gobbi-orchestration-workflow-improvements/design/item-{a,b,c,d,e,f,g}-*.md (git mv rename, 7)]
  files-out: [the 4 compliant concept-slug decision files (DO NOT touch), the W3b re-homing (split+renamed files re-home in W3-T2)]
  verifies: ls features/gobbi-orchestration-workflow-improvements/decisions/ | grep -Ec '^(concern-[0-9]|iter[0-9]|ideation-|planning-|preparation-|t[0-9]-|item-)' == 0; ls features/gobbi-orchestration-workflow-improvements/design/ | grep -Ec '^item-' == 0; the 4 compliant decision filenames still present + unchanged; each new decision file has exactly one concept.
  agent: executor; model: opus  # judgment: splitting bundles into atomic concepts + design-note de-prefix
  requires: [W0-T10]
  committable: yes — "chore(orch-feature): split decision bundles + de-prefix item-X design slugs"
```
```yaml
- id: W2-T3b
  what: SPLIT + rename the 6 BLOCKLIST-VIOLATING files in features/env-var-audit/ (README is the 7th md but is NOT a violator — leave it) — decisions/{ideation-decisions.md, planning-decisions.md, preparation-decisions.md, t1-decisions.md}, discussions/ideation-discussion.md, references/ideation-references.md — into one-concept-per-file with concept slugs (bundle decisions → one-concept-per-file per L5 atomicity; phase-prefix → concept slug per blocklist #1). Must run BEFORE env-var-audit re-homing (W3-T1).
  why: §8 cat B + §4.3 blocklist #1 (phase-prefix) + #3 (positional t1-) + L5 atomicity. Mirrors W2-T3 but for env-var-audit (H2 finding — W2-T3 only covered orch-improvements; env-var-audit's 6 violating files would otherwise re-home with non-compliant slugs in W3-T1).
  how: Read each of the 6 violating files (NOT README.md); for each distinct concept inside, write a new one-concept file with base frontmatter (decisions date-prefixed); preserve content (no-delete): git mv bundle sources to archive/decisions|discussions|references/ as superseded OR keep split-out files in place. README.md is NOT a violator — leave it.
  files-in: [features/env-var-audit/decisions/{ideation-decisions.md, planning-decisions.md, preparation-decisions.md, t1-decisions.md}, features/env-var-audit/discussions/ideation-discussion.md, features/env-var-audit/references/ideation-references.md (split → N new + git mv source)]
  files-out: [features/env-var-audit/README.md (NOT a violator — leave), the W3a re-homing (split files re-home in W3-T1)]
  verifies: find features/env-var-audit -name '*.md' | grep -Ec '(^|/)(ideation-|planning-|preparation-|t[0-9]-)' == 0 (post-split, excluding README); each new file has exactly one concept; README.md untouched.
  agent: executor; model: opus  # judgment: splitting bundles into atomic concepts (same class as W2-T3)
  requires: [W0-T10]
  committable: yes — "chore(env-var-audit): split loop-bundle/phase-prefix files to one-concept-per-file"
```
```yaml
- id: W2-T4
  what: STRAIGHT-RENAME (no split) the 4 BLOCKLIST-VIOLATING files in features/session-foundations-bundle-b/ — discussions/iter2-revise-escalation.md, discussions/iter3-fail-escalation.md, discussions/t2-matrix-location-then-deferral.md (drop iterN-/t2- positional prefix → concept slug), and design/five-locked-decisions.md (matches *-decisions.md blocklist pattern → rename to a non-`-decisions` concept slug, e.g. five-locked-architecture-choices.md). All 4 are single-concept notes → git mv rename only, NO split. Must run BEFORE bundle-b re-homing (W3-T3).
  why: §8 cat B + §4.3 blocklist #1/#3 + the *-decisions pattern. Discovered while validating the expanded Final Gate against the live tree (iter1's decisions-only W2 enumeration missed bundle-b's discussion/design violators) — without this, W3-T3 re-homes them with non-compliant slugs and the Final Gate fails.
  how: For each: read to confirm single-concept; git mv to a concept slug. five-locked-decisions.md: choose a slug NOT ending in -decisions (the blocklist forbids the *-decisions.* filename even for a single design note).
  files-in: [features/session-foundations-bundle-b/discussions/{iter2-revise-escalation.md, iter3-fail-escalation.md, t2-matrix-location-then-deferral.md}, features/session-foundations-bundle-b/design/five-locked-decisions.md (git mv rename, 4)]
  files-out: [the rest of bundle-b's 97 compliant files (W3-T3 owns re-homing), README.md]
  verifies: find features/session-foundations-bundle-b -name '*.md' | grep -Ec '(^|/)(iter[0-9]|t[0-9]-)' == 0; ls features/session-foundations-bundle-b/design/ | grep -c '\-decisions\.md$' == 0; git status shows 4 renames (R).
  agent: executor; model: sonnet  # mechanical de-prefix rename, single-concept (no split judgment)
  requires: [W0-T10]
  committable: yes — "chore(bundle-b): de-prefix iterN/t2 + rename five-locked-decisions slug"
```

### WAVE 3 — FEATURE RE-HOMING (6 tasks) — all `git mv`; **largest wave; opus throughout**

```yaml
- id: W3-T0
  what: Create the 7 capability feature dirs features/{workflow,project-memory,agents,evaluation,guardrails,git-workflow,install-runtime}/ each with README.md (base frontmatter + value_proposition + subsystems list + status: active per §1.2 table).
  why: §1.2 (RATIFY-1 ratified, L1). Target shape must exist before files migrate into it (standards-first).
  how: mkdir 7 dirs; Write each README.md from the §1.2 one-liner + skill-ownership column using the (W0-T5-aligned) feature-readme template.
  files-in: [features/<7 new dirs>/README.md (create)]
  files-out: [sprint dirs (retired in W3-T5)]
  verifies: for f in workflow project-memory agents evaluation guardrails git-workflow install-runtime; do test -f features/$f/README.md; done; each README starts with "---" + has value_proposition.
  agent: executor; model: opus
  requires: [W0-T10]
  committable: yes — "feat(features): create 7 capability feature dirs with READMEs (#<RATIFY-1>)"
```
```yaml
- id: W3-T1   # CHECKPOINT boundary
  what: Re-home env-var-audit (the 7 original md, now split into N atomic files by W2-T3b) → enumerated destinations; add changelog entry to each touched feature; confirm notes/ entry exists.
  why: §1.3 row 1 + §8 cat A + LOW-16 heuristic.
  how: For each split-out file, read its content; git mv into <destination-feature>/<subdir>/; write changelogs/{date}-env-var-audit-shipped.md in install-runtime (+ secondaries). PER-FILE DESTINATION ENUMERATION (US-01; refine per actual atomic-split content, but the source-file routing intent is):
    - README.md (env-var feature summary) → install-runtime/changelogs/ (folds into the shipped changelog) + install-runtime README subsystems list.
    - decisions/ideation-decisions.md (split) → install-runtime/decisions/ (env-file load semantics) — route any git.workflow-mode-touching concept to git-workflow/decisions/.
    - decisions/planning-decisions.md (split) → install-runtime/decisions/.
    - decisions/preparation-decisions.md (split) → install-runtime/decisions/.
    - decisions/t1-decisions.md (split) → install-runtime/decisions/ (implementation/T1 decisions about env-file export prefix).
    - discussions/ideation-discussion.md (split) → install-runtime/discussions/.
    - references/ideation-references.md (split) → install-runtime/references/.
    Default ambiguous → install-runtime (primary, §1.3 row 1). Any file whose content is about CLAUDE_ENV_FILE/export-prefix install mechanics stays install-runtime; any about workflow/session behaviour → workflow.
  files-in: [features/env-var-audit/** (split atomic md, git mv); features/install-runtime|git-workflow|workflow/** (destinations)]
  files-out: [other sprint dirs]
  verifies: find features/env-var-audit -name '*.md' | wc -l == 0 (post-move, dir empty or only residual pending T5); destination files exist; git status all R (renames).
  agent: executor; model: opus
  requires: [W3-T0, W2-T3b]
  committable: yes — "refactor(memory): re-home env-var-audit into install-runtime (W3a)"
```
```yaml
- id: W3-T2   # CHECKPOINT boundary
  what: Re-home Bundle A / gobbi-orchestration-workflow-improvements (22 md, INCLUDING the W2-T3 split-out decision files + de-prefixed item-X design files + the 4 already-compliant decision files) → primary workflow; route project-memory/agents/evaluation-content files to those features; changelog per touched feature.
  why: §1.3 row 2 + §8 cat A + heuristic. The split decisions + renamed design files (W2-T3) route individually here.
  how: Per-file content-routing (heuristic rule 1); git mv; default ambiguous → workflow (rule 2); changelogs to each touched feature.
  files-in: [features/gobbi-orchestration-workflow-improvements/** (22 md post-rename, git mv); destinations]
  files-out: [bundle-b, bundle-c, env-var-audit]
  verifies: source dir md count → 0 (pre-T5); each destination file present; git status all R.
  agent: executor; model: opus
  requires: [W3-T1, W2-T3]
  committable: yes — "refactor(memory): re-home Bundle A into workflow (W3b)"
```
```yaml
- id: W3-T3   # CHECKPOINT boundary — LARGEST single task; may need its own context window
  what: Re-home Bundle B / session-foundations-bundle-b (101 md = 100 cluster md + 1 README, post-W2-T4 rename) → primary git-workflow; route install-runtime(subagent-metadata)/agents(delegation-brief)/workflow content to those; changelog per touched feature. SPLIT BY SUBDIR-CLUSTER into committable batches + maintain a recovery manifest.
  why: §1.3 row 3 + §8 cat A (Bundle B = 101 of 136) + heuristic.
  how: FIRST write a recovery manifest (ST-03) at sessions/<this-session>/execution/staging/w3t3-cluster-manifest.md listing the 6 clusters with checkboxes [ ] and their md counts; mark each cluster done [x] + record its commit SHA after committing it, so a mid-context interruption resumes from the first unchecked cluster. Then process clusters in order, committing after each (resumable mid-task):
    (a) decisions 6 + scenarios 6 + plans 1 + changelogs 1 = 14;
    (b) design 16;
    (c) checklists 15;
    (d) backlogs 15;
    (e) references 12;
    (f) discussions 28.
    Sub-sum = 100 md (README.md is NOT in any cluster — it is retired in W3-T5, which is where the 101st file is counted). Per-file content-routing; git mv; default → git-workflow. On resume: read the manifest, skip checked clusters, continue from the first unchecked.
  files-in: [features/session-foundations-bundle-b/** (100 cluster md, git mv; README deferred to W3-T5); destinations]
  files-out: [bundle-a, bundle-c, env-var-audit, features/session-foundations-bundle-b/README.md (W3-T5 owns)]
  verifies: after each cluster commit, that cluster's source files are 0 remaining AND its manifest box is [x] with a SHA; final source dir md → 1 (README, pre-T5); 100 cluster renames across the 6 cluster commits; manifest all 6 boxes checked.
  agent: executor; model: opus
  requires: [W3-T2, W2-T4]
  committable: yes — PER-CLUSTER: "refactor(memory): re-home Bundle B <cluster> into capabilities (W3c-<n>)" — 6 sub-commits
```
```yaml
- id: W3-T4   # CHECKPOINT boundary
  what: Re-home Bundle C / session-foundations-bundle-c (6 md) → primary git-workflow; route archive-move-on-terminal-model.md + session-lifecycle design → project-memory; mistake-promote-fix/hooks-domain → guardrails; changelog per touched feature.
  why: §1.3 row 4 + Bundle C evidence note (MED-11) + heuristic. Cross-cutting — explicit routing per §1.3.
  how: Per the §1.3 Bundle-C evidence note; git mv each of the 6 to its content-destination (NOT just the primary); changelogs to git-workflow + project-memory + guardrails.
  files-in: [features/session-foundations-bundle-c/** (6 md, git mv); destinations project-memory/guardrails/git-workflow]
  files-out: [other sprint dirs]
  verifies: source md → 0 (pre-T5); design/archive-move-on-terminal-model.md now under features/project-memory/design/ (or project design/ if cross-feature — confirm with W0-T3 promote-up rule).
  agent: executor; model: opus
  requires: [W3-T3]
  committable: yes — "refactor(memory): re-home Bundle C into git-workflow/project-memory/guardrails (W3d)"
```
```yaml
- id: W3-T5   # CHECKPOINT boundary — closes Wave 3
  what: Retire the 4 emptied sprint feature dirs — convert each sprint README content into changelogs/ entries in the touched features (if not already done in T1-T4), confirm the notes/ session entry exists for each sprint, then git mv each sprint dir (README + any residual) to archive/features/ OR flip README status: retired and move per move-on-terminal model. THIS is where bundle-b's README.md (the 101st file) is accounted for.
  why: §1.3 re-home rule + §8 cat A + §2.1 terminal CRUD + archive-move-on-terminal-model.md.
  how: For each sprint dir: verify md count is 0 except README; ensure changelog coverage; git mv the dir/README to archive/features/<sprint>/ with archived_at + archive_reason: retired.
  files-in: [features/{env-var-audit,gobbi-orchestration-workflow-improvements,session-foundations-bundle-b,session-foundations-bundle-c}/ (git mv to archive/features/)]
  files-out: []
  verifies: ls features/ shows only the 7 capability dirs + README.md (no sprint dirs); archive/features/ holds the 4 retired sprints; notes/ has an entry per sprint.
  agent: executor; model: opus
  requires: [W3-T4]
  committable: yes — "refactor(memory): retire 4 sprint feature dirs to archive (W3e)"
```

### WAVE 4 — SESSION CLEANUP (1 task) — going-forward + opportunistic ONLY

```yaml
- id: W4-T1
  what: PRE-INSPECT then remove session tmp/ dirs where present; CONFIRM the going-forward canonical-tree enforcement docs already landed in W0-T6/W0-T7. Do NOT retro-sweep the 5 closed-session state.json or 2 HANDOFF.md (RATIFY-7).
  why: §8 cat D + RATIFY-7/RATIFY-8. Lowest-value; scoped to going-forward + opportunistic.
  how: (1) PRE-INSPECTION (RK-01): `find sessions -type d -name tmp` then for EACH match `ls -la <tmp>` and report its contents; confirm it is scratch (no durable memory) before removal. (2) for tracked → `git rm -r`; for untracked → `rm -rf` ONLY after the ls confirms scratch-only contents. (3) Confirm W0 cleanup docs present (grep). Leave closed-session state.json/HANDOFF.md untouched. Witness mistake: manager-rm-rf-without-investigating-tracked-files — never rm before inspecting.
  files-in: [sessions/**/tmp/ (inspect, then remove if scratch)]
  files-out: [closed-session state.json (5), HANDOFF.md (2) — explicitly LEFT untouched]
  verifies: ls -la output captured for every tmp/ before removal; find sessions -type d -name tmp | wc -l == 0 post-removal; find sessions -name state.json | wc -l still == 6 (untouched — incl. this active session); grep -q "tmp" skills/wrap-up/SKILL.md (from W0-T6).
  agent: executor; model: sonnet
  requires: [W0-T10]
  committable: yes — "chore(sessions): remove tmp/ scratch dirs (RATIFY-8)"
```

### WAVE 5 — FOLLOW-UPS + FINAL VERIFY (3 tasks)

```yaml
- id: W5-T1
  what: File project-scope backlog items for FLAG-1 (skills/+agents/ relocation + memory-map-vs-wrap-up canonical-location contradiction) and FLAG-2 (missing claude doc-standard skill + dangling CLAUDE.md nav row + FLAG-3 stub-redirect _claude/SKILL.md ref).
  why: §11 FLAG-1/2/3 + L8 (out-of-scope-this-session findings must be filed, not fixed).
  how: Write backlogs/<concept-slug>.md (bare-slug, base frontmatter, project-scope: true, disposition: open) for each flag.
  files-in: [backlogs/<2-3 new files> (create)]
  files-out: [any skills/ or agents/ relocation (L8 — forbidden this session)]
  verifies: test -f the new backlog files; each has project-scope: true + base frontmatter; grep -q FLAG in body.
  agent: executor; model: sonnet
  requires: [W3-T5]
  committable: yes — "chore(backlogs): file FLAG-1/FLAG-2/FLAG-3 follow-ups"
```
```yaml
- id: W5-T2
  what: Clarify/supersede mistakes/executor-mirror-path-vs-worktree-physical-copy.md — the design (§7 intro, iter2 Critical fix) records it was misread; its real point is worktree branch-isolation of canonical files, NOT .claude↔.gobbi mirror doubling. Reword in place (it is an active mistake — active mistakes never move) to make the real lesson unambiguous.
  why: §7 intro iter2-remediation + mistake skill (active mistakes never move; refine in place).
  how: Read the file; reword the title/body so the lesson is "worktree canonical files are branch-isolated copies — edit worktree-absolute path"; do NOT supersede-and-move (it is active); keep frontmatter status: active.
  files-in: [mistakes/executor-mirror-path-vs-worktree-physical-copy.md (modify in place)]
  files-out: []
  verifies: grep -q "branch-isolat" mistakes/executor-mirror-path-vs-worktree-physical-copy.md; grep -q "worktree-absolute" mistakes/executor-mirror-path-vs-worktree-physical-copy.md; status still active; file NOT moved.
  agent: executor; model: sonnet
  requires: [W1-T1]   # after the mistake-candidate strip pass touches mistakes/
  committable: yes — "docs(mistakes): clarify worktree-branch-isolation lesson (was misread)"
```
```yaml
- id: W5-T3
  what: Final compliance sweep — run the full grep gate suite across the migrated tree; confirm zero blocklist-pattern filenames (ALL patterns), zero mistake-candidate flags, all 7 feature dirs present + 4 sprints archived, all §7 standards landed, all symlinks resolve.
  why: P7 hard gate — fresh verification evidence before declaring the migration complete.
  how: Run the Final Gate Suite (below) from cwd <worktree>/.gobbi/projects/gobbi; any failure → re-open the owning wave.
  files-in: [none — read-only verify]
  files-out: []
  verifies: Final Gate Suite all green (see § Verification gate suites).
  agent: executor; model: sonnet
  requires: [W3-T5, W1-T1, W1-T2, W1-T3, W2-T1, W2-T2, W2-T3, W2-T3b, W2-T4, W4-T1, W5-T1, W5-T2]
  committable: no — verification only
```

## Dependency table

| Task | Depends on | Blocks | Files touched (root) |
|---|---|---|---|
| W0-T1 | DONE (90c46fd) | — | principles/SKILL.md, .claude/CLAUDE.md (shipped) |
| W0-T1b | — | W0-T10 | principles/SKILL.md (intro line only) |
| W0-T2 | DONE (90c46fd) | — | memorization/rules.md (+symlink) (shipped) |
| W0-T3 | — | W0-T4 | memorization/memory-map.md |
| W0-T4 | W0-T3 | W0-T5 | memorization/SKILL.md |
| W0-T5 | W0-T4 | W0-T6 | memorization/templates/* (17) |
| W0-T6 | W0-T5 | W0-T7 | wrap-up/SKILL.md |
| W0-T7 | W0-T6 | W0-T8 | orchestration/SKILL.md + workflow/* |
| W0-T8 | W0-T7 | W0-T10 | gobbi/, evaluation/, mistake/ SKILL.md |
| W0-T9 | DONE (90c46fd) | — | delegation/SKILL.md + 4 templates (shipped) |
| W0-T10 | W0-T1b,T3,T4,T5,T6,T7,T8 | ALL W1-W5 | (verify) |
| W1-T1 | W0-T10 | W5-T2 | mistakes/ (17) |
| W1-T2 | W0-T10 | — | rules/stub-redirect-format.md |
| W1-T3 | W0-T10 | W2-T2 | design/*, learnings/* (+ bounded sweep design/learnings/rules/backlogs) |
| W2-T1 | W0-T10 | — | backlogs/ (5) |
| W2-T2 | W1-T3 | — | learnings/ (1) |
| W2-T3 | W0-T10 | W3-T2 | orch decisions/ (5 violating, split) + design/item-X (7, rename) |
| W2-T3b | W0-T10 | W3-T1 | env-var-audit decisions/discussions/references (6 violating) |
| W2-T4 | W0-T10 | W3-T3 | bundle-b discussions/ (3) + design/five-locked-decisions (1) |
| W3-T0 | W0-T10 | W3-T1 | features/ (7 new) |
| W3-T1 | W3-T0, W2-T3b | W3-T2 | env-var-audit + destinations |
| W3-T2 | W3-T1, W2-T3 | W3-T3 | bundle-a + destinations |
| W3-T3 | W3-T2, W2-T4 | W3-T4 | bundle-b (100 cluster md) + destinations |
| W3-T4 | W3-T3 | W3-T5 | bundle-c + destinations |
| W3-T5 | W3-T4 | W5-T1,T3 | sprint dirs → archive/features/ (incl. bundle-b README, 101st) |
| W4-T1 | W0-T10 | W5-T3 | sessions/**/tmp/ |
| W5-T1 | W3-T5 | W5-T3 | backlogs/ (2-3 new) |
| W5-T2 | W1-T1 | W5-T3 | mistakes/ (1, in place) |
| W5-T3 | (all impl tasks) | — | (verify) |

## Parallel lanes (documentation only — Execution runs sequentially)

- **Lane STD (W0-T1b, W0-T3→T8, W0-T10):** strictly sequential — each standards edit builds on the prior; must finish before any migration (target shape first). Lane STD is the hard prerequisite for every other lane. (W0-T1/T2/T9 already DONE in 90c46fd.)
- **Lane FM (W1-T1, W1-T2, W1-T3):** post-W0; mutually file-disjoint (mistakes/ vs rules/ vs design+learnings/) — parallel-safe in principle, but run sequentially.
- **Lane RENAME (W2-T1, W2-T3, W2-T3b, W2-T4 || ; W2-T2 after W1-T3):** W2-T1 (backlogs), W2-T3 (orch), W2-T3b (env-var-audit), W2-T4 (bundle-b) are mutually file-disjoint; W2-T2 (learnings) must follow W1-T3 (same files).
- **Lane REHOME (W3-T0→T5):** strictly sequential by sub-wave; W3-T1 also requires W2-T3b; W3-T2 also requires W2-T3; W3-T3 also requires W2-T4 (split/rename-before-route for each source sprint).
- **Lane SESSION (W4-T1):** fully independent of W1-W3 (touches sessions/tmp only) — could run any time after W0.
- **Lane FU (W5-T1→T3):** W5-T1 after W3-T5; W5-T2 after W1-T1; W5-T3 last (gate).

**Conflict flags:**
- ⚠ W1-T3 and W2-T2 both touch `learnings/<f-aes-01 file>` — sequential (W1-T3 fixes frontmatter, then W2-T2 renames). Encoded as W2-T2 requires W1-T3.
- ⚠ W2-T3 (split/rename orch) and W3-T2 (re-home Bundle A) both touch `features/gobbi-orchestration-workflow-improvements/` — sequential (split/rename first, then route). Encoded as W3-T2 requires W2-T3.
- ⚠ W2-T3b (split env-var-audit) and W3-T1 (re-home env-var-audit) both touch `features/env-var-audit/` — sequential. Encoded as W3-T1 requires W2-T3b.
- ⚠ W2-T4 (rename bundle-b violators) and W3-T3 (re-home Bundle B) both touch `features/session-foundations-bundle-b/` — sequential (rename first, then route). Encoded as W3-T3 requires W2-T4.
- ⚠ W1-T1 and W5-T2 both touch `mistakes/` — sequential (strip pass, then in-place clarify). Encoded as W5-T2 requires W1-T1. (W1-T1 files-out explicitly defers the reword of the executor-mirror-path file to W5-T2 — W1-T1 only strips staging flags.)

## Agent assignments

| Task | Agent | Model | Required skills | Required mistakes |
|---|---|---|---|---|
| W0-T1 | DONE | — | (shipped 90c46fd) | — |
| W0-T1b | executor | sonnet | principles, mistake, memorization/SKILL.md, memorization/rules.md, git | edit-tool-refuses-symlink-paths, executor-main-tree-edit-near-miss |
| W0-T2 | DONE | — | (shipped 90c46fd) | — |
| W0-T3..T4 | executor | sonnet | principles, mistake, memorization/SKILL.md, memorization/rules.md, git | edit-tool-refuses-symlink-paths, executor-main-tree-edit-near-miss |
| W0-T5 | executor | **opus** | principles, mistake, memorization/SKILL.md, memorization/rules.md, memorization/memory-map.md | edit-tool-refuses-symlink-paths, executor-mirror-path-vs-worktree-physical-copy |
| W0-T6..T8 | executor | sonnet | principles, mistake, memorization/SKILL.md, memorization/rules.md, the target skill's own SKILL.md, git | edit-tool-refuses-symlink-paths, memorization-delegation-prompts-must-load-memorization-skill |
| W0-T9 | DONE | — | (shipped 90c46fd) | — |
| W0-T10 | executor | sonnet | principles, mistake, git | symlink-restore-depth-wrong |
| W1-T1..T3 | executor | sonnet | principles, mistake, memorization/SKILL.md, memorization/rules.md, git | (none domain-specific) |
| W2-T1 | executor | sonnet | principles, mistake, memorization/rules.md, git | (none) |
| W2-T2 | executor | sonnet | principles, mistake, memorization/rules.md, git | (none) |
| W2-T3 / W2-T3b | executor | **opus** | principles, mistake, memorization/rules.md, git | manager-context-overflow-with-large-bundle (bundle split) |
| W2-T4 | executor | sonnet | principles, mistake, memorization/rules.md, git | (none — mechanical de-prefix rename, no split) |
| W3-T0 | executor | **opus** | principles, mistake, memorization/SKILL.md, memorization/rules.md, memory-map.md, git, **the locked design doc (`ideation/artifacts/memory-system-redesign-design.md` §1.2 feature table)** | executor-mirror-path-vs-worktree-physical-copy, executor-main-tree-edit-near-miss |
| W3-T1..T5 | executor | **opus** | principles, mistake, memorization/SKILL.md, memorization/rules.md, memory-map.md, git, **the locked design doc (`ideation/artifacts/memory-system-redesign-design.md` §1.3 routing map + §8 LOW-16 heuristic)** | executor-mirror-path-vs-worktree-physical-copy, executor-main-tree-edit-near-miss, manager-rm-rf-without-investigating-tracked-files, manager-context-overflow-with-large-bundle |
| W4-T1 | executor | sonnet | principles, mistake, git | manager-rm-rf-without-investigating-tracked-files (rm only after ls/git-status check) |
| W5-T1 | executor | sonnet | principles, mistake, memorization/rules.md, git | (none) |
| W5-T2 | executor | sonnet | principles, mistake, mistake-skill discipline | executor-mirror-path-vs-worktree-physical-copy (the subject) |
| W5-T3 | executor | sonnet | principles, mistake, memorization/rules.md, git | (none) |

**Justifications for non-default:** opus on W0-T5 (17 distinct type specs — high drift risk), W2-T3/W2-T3b (atomic-concept splitting judgment), all W3 (per-file content-vs-sprint routing is the design's explicitly "judgment-heavy" call — the locked design doc is required reading so routing decisions trace to §1.3/§8, per US-03). W2-T4 is a mechanical de-prefix rename (no split judgment) → sonnet. W0-T1/T2/T9 are DONE (shipped 90c46fd). Every other task is mechanical-with-a-clear-spec → sonnet executor. No `leader`/`assistant` agent types used: no task needs sub-planning (rules out leader); the doc edits are substantive standards work with judgment, not trivial copy-rename (rules out assistant) — except W4-T1/W5-T1 which are borderline-trivial but kept on executor for the git-safety discipline (manager-rm-rf mistake).

## Verification gate suites

> **All commands below run from cwd `<worktree>/.gobbi/projects/gobbi`** (Path/CWD convention). Lines touching `.claude/...` use the `../../../.claude/...` worktree-relative form (those reach outside the cwd root).

### W0 grep gate (run in W0-T10)
```
grep -c "## Principle 13" skills/principles/SKILL.md                        # == 1  (DUPLICATE GUARD — must NOT be 2)
grep -c "Thirteen principles" skills/principles/SKILL.md                    # == 1  (intro prose, W0-T1b)
grep -c "Twelve principles" skills/principles/SKILL.md                      # == 0
grep -c "13 principles" ../../../.claude/CLAUDE.md                          # ≥1   (shipped 90c46fd)
test -f skills/memorization/rules.md && readlink -e ../../../.claude/skills/memorization/rules.md   # resolves (shipped)
grep -q "session.json.lock" skills/memorization/memory-map.md
grep -q "archive/{type}" skills/memorization/memory-map.md
grep -c "memorization/rules.md" skills/delegation/templates/{leader,assistant,executor,evaluator}.md  # ≥4 (shipped)
grep -q "stub-redirect TARGET" skills/memorization/templates/rules.md
# symlink resolution — scope to ACTUAL symlinks only (ST-02: skips real templates/ dir)
for f in $(find ../../../.claude/skills/memorization -maxdepth 1 -type l); do readlink -e "$f" >/dev/null || echo "BROKEN $f"; done
```

### Final Gate Suite (run in W5-T3)
```
# naming compliance — ALL blocklist patterns in sprint/feature-phase context (H2)
#   patterns: *-decisions.* | *-discussion.* | *-references.* | t[0-9]-* | iter*-* | concern-* | item-* | f-<tag>-<n> | ideation-/planning-/preparation- prefix
ls backlogs/ | grep -Ec '^(item-|f-[a-z]+-[0-9])'                                  # 0
find features -type f -name '*.md' \( \
   -name '*-decisions.md' -o -name '*-discussion.md' -o -name '*-references.md' \
   -o -name 't[0-9]-*' -o -name 'iter*-*' -o -name 'concern-*' -o -name 'item-*' \
   -o -name 'ideation-*' -o -name 'planning-*' -o -name 'preparation-*' \
   -o -name 'f-[a-z]*-[0-9]*' \) | grep -v '/README.md$'                            # empty
# (README.md is excluded; intentional concept slugs like codex-skill-... / step-2-5-example-... do NOT match any pattern above)
# frontmatter compliance
grep -rl mistake-candidate mistakes/ | wc -l                                        # 0
grep -rl 'promoted-from\|promoted-at' mistakes/ learnings/ design/ | wc -l           # 0
head -1 rules/stub-redirect-format.md                                               # ---
grep -rL "^---" design/ learnings/ rules/ backlogs/ | grep -v '/README.md$' | wc -l  # 0 (bounded sweep dirs)
# feature shape
ls features/ | grep -vE '^(workflow|project-memory|agents|evaluation|guardrails|git-workflow|install-runtime|README.md)$'  # empty
ls archive/features/ | wc -l                                                        # 4
find features/env-var-audit features/session-foundations-bundle-b -name '*.md' 2>/dev/null | wc -l  # 0 (dirs gone)
# session cleanup (going-forward only)
find sessions -type d -name tmp | wc -l                                             # 0
find sessions -name state.json | wc -l                                              # 6 (untouched, RATIFY-7)
# symlinks intact — ACTUAL symlinks only (ST-02)
for f in $(find ../../../.claude/skills -type l); do readlink -e "$f" >/dev/null || echo "BROKEN $f"; done   # silent
```

## NOT in scope

- Relocating `skills/` or `agents/` (L8) — FILED as backlog (W5-T1), never moved.
- Creating the `claude` doc-standard skill (FLAG-2) — FILED, not built.
- Retro-sweep of the 5 closed-session `state.json` / 2 root `HANDOFF.md` (RATIFY-7) — left untouched; only going-forward enforcement + `tmp/` removal.
- Re-opening any lock (L1-L8, RATIFY-1..8, the 7 features, 13 specs, naming/frontmatter standards, Principle #13).
- Re-executing the 3 SHIPPED W0 tasks (W0-T1/T2/T9, commit 90c46fd) — re-execution corrupts (duplicate P13 / overwrite rules.md). Guard encoded as STATUS: DONE in each + the duplicate-P13 grep gate.
- Test-writing (EVALUATION's job, not a Planning task).
- Editing the `gobbi-hook-authoring` canonical-only skill (not in §7; out of scope).

## Decisions log

This is Planning WORK on a manager-direct DISCUSSION; the substantive decisions are the design's locks. Planner decisions recorded here for the manager to surface at Planning DISCUSSION / EVALUATION:

1. **Wave order = standards-first** (W0 → W1/W2 || → W3 → W4 → W5). Rationale: §8 strategy ("do standards-first so migrated files land in an already-correct world"); W0-T10 is the hard gate before any migration.
2. **W0 internally sequential.** Each standards edit references the prior (memory-map cross-ref before templates before wrap-up promotion). Encoded as a chain. NOTE: W0-T1/T2/T9 already shipped in 90c46fd — the chain now starts at W0-T1b/T3.
3. **Wave 3 sub-waved by source sprint, and W3-T3 (Bundle B, 100 cluster md) further split into 6 subdir-cluster sub-commits + a recovery manifest.** Rationale: resumability across context windows (each cluster independently committable + verifiable; manifest enables mid-task resume after interruption — ST-03). **RECOMMENDATION: Wave 3 should be its own session** — see Concerns.
4. **`split-before-route` for ALL source sprints** — W2-T3 (orch) precedes W3-T2; W2-T3b (env-var-audit) precedes W3-T1; W2-T4 (bundle-b violators) precedes W3-T3 — so each atomic concept routes individually with a compliant slug (heuristic rule 4).
5. **W5-T2 reaffirms the misread mistake in place** (active mistakes never move — mistake skill); not superseded-and-archived. W1-T1 only strips its staging flags; the reword is W5-T2's sole job.
6. **state.json count discrepancy surfaced** — design §3.4 says 5; live tree has 6 (the 6th is THIS active session's own dir). W4-T1 leaves ALL 6 untouched (RATIFY-7 + the active session's file is live). Flagged for the manager.
7. **No leader/assistant agent types** — every task is executor (sonnet default, opus on the judgment-heavy tasks). Rationale: no sub-planning needed; the doc work is substantive-with-judgment, not trivial copy-rename.
8. **3 W0 tasks already shipped (90c46fd).** W0-T1 (P13+CLAUDE.md), W0-T2 (rules.md+symlink), W0-T9 (delegation wiring) landed mid-session before this Plan executes. Marked DONE/SKIP; a duplicate-P13 grep gate guards against re-insertion corruption (H1). Only the "Twelve→Thirteen" intro-prose tweak remained → W0-T1b.
9. **W2 rename scope expanded beyond iter1's decisions-only enumeration.** Validating the H2-expanded Final Gate against the live tree surfaced 11 more blocklist violators the iter1 W2 wave missed: orch `design/item-a..g-*.md` (7, folded into W2-T3) and bundle-b `discussions/{iter2,iter3,t2}-*` + `design/five-locked-decisions.md` (4, new W2-T4). Without these the gate fails after re-homing. `five-locked-decisions.md` is renamed (not split) to drop the `*-decisions.md` pattern — it is a single design note. **Flag for the manager:** confirm the blocklist genuinely forbids `*-decisions.md` even for a single non-bundle design note; if the intent is "no PHASE/bundle decisions files" only, the gate pattern + W2-T4's five-locked rename should be relaxed.
