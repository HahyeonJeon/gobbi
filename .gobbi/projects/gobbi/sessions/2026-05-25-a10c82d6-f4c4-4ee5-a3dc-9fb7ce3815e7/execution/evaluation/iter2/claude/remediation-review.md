# Remediation Review — iter2 (claude system)

**Phase:** execution-eval consolidated (Preparation + Planning + Execution)
**Iter:** 2
**System:** claude
**Evaluator role:** adversarial assessor, verification only

---

## Artifact A — `memorization/rules.md` + `memory-map.md`

Source: `.gobbi/projects/gobbi/skills/memorization/rules.md` (commit 309f3dc shipped)

### iter1 Codex findings — closure status

**HIGH-1 — Overscoped applicability ("every file under .gobbi/...")**
CLOSED. The opening paragraph now reads "govern every memory file" with an explicit scope-boundary blockquote directly beneath it (lines 3–5): "This standard governs memory files only. It does NOT govern the non-memory surfaces that also live under `.gobbi/projects/{project-name}/` — `skills/`, `agents/`, or session-runtime files (`sessions/`). Those follow their own authoring conventions, not this memory standard." The contradiction between the opening and §2.1 ("every memory file") is eliminated.

**HIGH-2 — Missing `features/` own-tier scope rule in §3**
CLOSED. §3 now includes a "Declared scope + promote-up" bullet with five sub-bullets. The first explicitly states "`features/` is its own tier" with the self-referential README contract (scope: feature + feature: own-slug) and the creation guard. All four feature-subdir-only types are listed as the final sub-bullet. The design's own-tier rule is now present in §3.

**MED — type-enum vs feature-subdir-type contradiction (no explicit exception model)**
CLOSED. Lines 79–81 now contain: a header "The `type` enum lists the 12 promotable content types" (explicitly naming 12, not 13); followed by a "Feature-subdir-only types — documented EXCEPTION to the enum" paragraph that names the four types, explains they set `type` to their own name, calls those values "intentionally outside the 12-value enum," and states they are "the only `type` values permitted outside it, and only on feature-subdir files." The exception model is explicit and unambiguous.

**LOW — "13 content types" wording**
CLOSED. The wording at line 79 now reads "The `type` enum lists the 12 promotable content types" — the stale "13" language is gone. (Note: line 116 still says "13 per-type specs in memory-map.md" — this refers to the 13 per-type specs in the map, not the enum count. The two are different things; this is correct, not a residual error.)

**LOW — memory-map.md back-ref to rules.md**
CLOSED. `memory-map.md` line 5 reads: "For the naming convention, frontmatter standard, and structure rules every memory file obeys, see `rules.md`" — explicit back-reference present.

**Internal consistency check (adversarial):** No new contradictions introduced. The scope boundary blockquote is consistent with the §2.1 "every memory file" scoping. The 12-count in §2.1 frontmatter definition matches the "12 promotable content types" header at line 79. The "13 per-type specs" in §3's intro refers to memory-map.md's per-type entries (12 promotable + archive as a destination = 13 entries in the map) — this is a distinct count from the enum and is correctly stated.

**Verdict for Artifact A: PASS — all iter1 Codex findings CLOSED; no new High/Critical defects.**

---

## Artifact B — `planning/rawdata/draft-iter1.md`

Source: session `2026-05-25-a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7/planning/rawdata/draft-iter1.md`

### iter1 Claude findings — closure status

**H1 — W0-T1/T2/T9 must be marked DONE-shipped-in-90c46fd + duplicate-Principle-13 guard added**
CLOSED. All three tasks carry `STATUS: DONE — shipped in commit 90c46fd (this session); SKIP on re-execution.` The W0 grep gate suite contains `grep -c "## Principle 13" skills/principles/SKILL.md  # == 1  (DUPLICATE GUARD — must NOT be 2)`. The remediation log at the top of the draft records the fix as H1. Operational Fact 5 was reworded to past-tense (symlink already exists). A W0-rest re-touch guard explicitly names the frozen files.

**H2 — env-var-audit bundle files split before re-homing (new W2-T3b) + Final Gate expanded to all blocklist patterns**
CLOSED. W2-T3b is present as a full task with what/why/how/files-in/files-out/verifies/agent/requires/committable. W3-T1 lists W2-T3b in its `requires`. The Final Gate Suite now uses `find features -type f -name '*.md' \( -name '*-decisions.md' -o -name '*-discussion.md' -o -name '*-references.md' -o -name 't[0-9]-*' -o -name 'iter*-*' -o -name 'concern-*' -o -name 'item-*' -o -name 'ideation-*' -o -name 'planning-*' -o -name 'preparation-*' -o -name 'f-[a-z]*-[0-9]*' \)` covering all blocklist patterns.

The remediation also discovered 11 additional violators (7 orch design/item-X + 4 bundle-b) and added W2-T4, expanding coverage beyond what iter1 required. This is a correct widening, not scope drift — the Final Gate's own validation exposed them.

**H3 — verify commands need CWD convention**
CLOSED. A "Path / CWD convention" section is inserted near the top of the document, before the task list. It explicitly declares `<worktree>/.gobbi/projects/gobbi` as the cwd for all `verifies:` blocks and grep gates, provides the worktree-absolute value, and explains how `.claude/...` paths resolve from that root. The task headers section states "All `verifies:` lines run from cwd `<worktree>/.gobbi/projects/gobbi` per the Path/CWD convention above." The W0 and Final Gate suite headers both include this anchor.

**CN-01 — W2-T3 enumeration corrected**
CLOSED. W2-T3 now explicitly states it owns ONLY the 5 violating orch decision files + 7 orch design/item-X files; excludes the 4 compliant decision files by name; and notes "CN-01: ideation-decisions.md is NOT here — it belongs to env-var-audit, handled by W2-T3b."

**ST-02 — symlink loop scoped to -type l**
CLOSED. The W0 grep gate uses `find ../../../.claude/skills/memorization -maxdepth 1 -type l`. The Final Gate uses `find ../../../.claude/skills -type l`. Both correctly skip the real `templates/` directory.

**ST-03 — W3-T3 recovery manifest**
CLOSED. W3-T3 how now leads with: "FIRST write a recovery manifest (ST-03) at sessions/<this-session>/execution/staging/w3t3-cluster-manifest.md listing the 6 clusters with checkboxes [ ] and their md counts; mark each cluster done [x] + record its commit SHA after committing it." The verifies block checks that all 6 manifest boxes are checked.

**US-01 — W3-T1 per-file destinations enumerated**
CLOSED. W3-T1 how now contains a "PER-FILE DESTINATION ENUMERATION (US-01)" block listing each of the 7 source files with its destination and routing rationale.

**US-02 / PJ-02 — W1-T3 sweep bounded to specific directories**
CLOSED. W1-T3 what now reads "run a BOUNDED frontmatter-presence sweep across EXACTLY these dirs — design/, learnings/, rules/, backlogs/ (project-root memory dirs only; NOT features/, NOT mistakes/ [W1-T1 owns], NOT sessions/)". The Final Gate grep also uses those same 4 bounded directories.

**US-03 — locked design doc added to required skills for W3 routing tasks**
CLOSED. The agent assignment table for W3-T0 through W3-T5 now includes "the locked design doc (`ideation/artifacts/memory-system-redesign-design.md` §1.3 routing map + §8 LOW-16 heuristic)" as a required skill in bold. The justification text in the agent assignments section explicitly cites US-03.

**RK-01 — W4-T1 pre-inspection step**
CLOSED. W4-T1 how now opens with "(1) PRE-INSPECTION (RK-01): `find sessions -type d -name tmp` then for EACH match `ls -la <tmp>` and report its contents; confirm it is scratch (no durable memory) before removal." The verifies block checks that ls -la output is captured before removal. The task title also reads "PRE-INSPECT then remove."

**CN-02 — count reconciled**
CLOSED. W3-T3 now consistently states "101 md = 100 cluster md + 1 README" with cluster sub-sum = 100, and "README.md is NOT in any cluster — it is retired in W3-T5, which is where the 101st file is counted." The dependency table row for W3-T5 says "(incl. bundle-b README, 101st)."

**AE-01 — files-out field semantics normalized**
CLOSED. A "files-out field semantics (normalized)" convention note is placed in the Path/CWD section: "`files-out` lists the files/dirs this task explicitly MUST NOT touch (out-of-scope guard / 'leave for a later task') — NOT outputs." W1-T1 files-out is now a proper scope-guard list.

### New defect found in Artifact B

**NEW-B-01 — W2-T3b internal count inconsistency: `what` says "6 BLOCKLIST-VIOLATING files" but `how` says "Read each of the 7 files"**

- **Type:** design_flaw
- **Domain:** docs-sync
- **Disposition:** open
- **Confidence:** 100
- **Severity:** Low
- **Evidence:** `planning/rawdata/draft-iter1.md` W2-T3b task body: `what` states "SPLIT + rename the 6 BLOCKLIST-VIOLATING files" and lists 6 files by name (4 decisions + 1 discussion + 1 reference). The `how` field immediately below says "Read each of the 7 files." The dependency table row reads "env-var-audit decisions/discussions/references (7 violating)." The remediation log at the top of the doc and the file-map section also say "7 blocklist-violating files" for env-var-audit. The correct count is 6 violating files (README.md is the 7th md in the directory but NOT a violator — the `what` is correct; the `how` and the dependency table are incorrect).
- **Why it matters:** An executor reading the `how` field would try to process "7 files" and hit the README.md, which is explicitly NOT a violator. The `files-out` correctly excludes README.md, but `how` and the dependency table contradict `what`. This creates ambiguity at the one point where the executor decides what to pick up.
- **Suggested direction:** Change `how` first sentence to "Read each of the 6 violating files listed above"; change the dependency table cell to "7 env-var-audit total md (6 violating + README)" or simply "env-var-audit decisions/discussions/references (6 violating)."

This is a Low severity defect — the correct scope is unambiguously declared in `what` and `files-in`, and the README exclusion is stated in both `files-out` and the `what` clause. An executor following the task should correctly derive 6 violating files. But the `how` and dep-table are factually wrong.

**Verdict for Artifact B: PASS — all iter1 Claude findings CLOSED; one new Low defect (NEW-B-01); no new High/Critical.**

---

## Artifact C — `preparation/rawdata/readiness.md` + `preparation/staging/decisions/`

### iter1 Claude findings — closure status

**F-PROJ-01 / F-STRUCT-01 — Missing 7-section Preparation template**
CLOSED. The readiness.md now contains exactly the 7 sections the Preparation template requires:
1. `## Scope reference` (present, lines 5–11)
2. `## Readiness summary` (present, lines 13–19)
3. `## Design + memory readiness` (present, lines 21–51)
4. `## Execution skills readiness` (present, lines 53–59)
5. `## Generated this loop` (present, lines 61–68)
6. `## Out of scope gaps` (present, lines 70–78)
7. `## Decisions log` (present, lines 80–115)

All 7 sections are populated with substantive content.

**F-USAGE-01 / F-CON-01 — Stale `rules.md`-absent line**
CLOSED. The readiness.md now reads: "`memorization/rules.md` was absent at Ideation time and has since been CREATED this session (Wave 0-core, commit 90c46fd) — the primary generate-now artifact is already in place." The stale "absent" claim is replaced with an accurate temporal-scoped statement.

**F-RISK-01 — FLAG-2 + L8 follow-ups must be staged**
CLOSED. Two staging decision files are present:
- `preparation/staging/decisions/claude-doc-standard-skill-missing.md` (FLAG-2)
- `preparation/staging/decisions/skills-agents-canonical-location-contradiction.md` (L8 / FLAG-1)

**Born-compliant check on both staged files:**
Both carry the correct base frontmatter per `memorization/rules.md` §2.1:
- `name`, `description`, `type: backlogs`, `scope: project`, `feature: project-memory`, `status: active`, `disposition: deferred`, `created: 2026-05-25`, `session: 2026-05-25-a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7`, `tags`
- Filenames: bare-slug (no date prefix) — correct per §1.2 (backlogs is evergreen)
- Slugs: `claude-doc-standard-skill-missing` and `skills-agents-canonical-location-contradiction` — no blocklist violations
- Both carry the `backlogs`-type extension field `disposition: deferred`

The files are born-compliant with `memorization/rules.md`.

**F-OVERALL-01 — Preparation was manager self-check not a Preparation Loop artifact**
Addressed proportionately. The artifact has been retroactively structured to the 7-section Preparation template, and the evaluation gap is being closed by this iter2 dual-system evaluation pass. The fundamental process deviation (no DISCUSSION/WORK/EVALUATION sub-phases run) is documented in the wrap-up staging mistake-candidate (`manager-substituted-self-verification-for-mandatory-dual-system-eval.md`). Per the iter1 Overall verdict, the user and manager decided to accept the manager-check + retroactive 7-section structure as sufficient for this session rather than re-running the full loop. This is within user authority. The artifact now structurally satisfies the template contract.

**Verdict for Artifact C: PASS — all iter1 High/Critical findings CLOSED; staged follow-ups born-compliant; no new High/Critical defects.**

---

## Cross-artifact integrity check

No new contradictions between the three artifacts:
- `rules.md` scope boundary is consistent with `memory-map.md`'s back-reference and the "every memory file" scoping throughout.
- Planning draft's W2-T3b correctly gates W3-T1 (split-before-route contract).
- Preparation readiness correctly describes what was already shipped (rules.md + symlink at commit 90c46fd) and what planning decomposes into.

---

## Must-preserve list

1. `rules.md` disambiguation blockquote (three-way rules/template/memory-type distinction) — this is the highest-risk confusion surface and the prominent placement is correct.
2. Planning draft wave ordering (standards-first before migration) — the design mandates this; the plan correctly encodes it.
3. W3-T3 six-cluster recovery manifest design — proportionate to 100-file operation; ST-03 correctly implemented.
4. Preparation readiness factual claims — all 7 propagation targets, all 17 templates, correct mirror model — verified correct by iter1 Codex PASS.
5. Both staged follow-up files' substantive content (correctly deferred FLAG-2 and L8 analysis).

---

## Overall verdict

**VERDICT: PASS**

All High/Critical iter1 findings across all three artifacts are CLOSED. No new High or Critical defects introduced. One new Low defect found (NEW-B-01: W2-T3b `how`/dep-table says "7 files" where the correct violator count is 6). This is below the REVISE threshold (requires High confidence ≥ 50).
