# Perspective 4 — Specificity
**Evaluator**: claude (iter2)
**Phase**: ideation
**Artifact**: draft-iter2.md — Bundle C foundation follow-ups

## Artifact Summary + Memory reads

(Same artifact summary as p1-project.md; see that file. Memory reads identical.)

---

## Locked Frame (Stage 1)

**Scenario A — "12 skills" — are all 12 named?**
- [YES] CL-5 In-Scope item 5, Per-Deliverable table CL-5, and CK-7 all enumerate the same 12 skills: `mistake/SKILL.md`, `wrap-up/SKILL.md`, `research/SKILL.md`, `orchestration/workflow/evaluation.md`, `planning/SKILL.md`, `execution/SKILL.md`, `ideation/SKILL.md`, `memorization/SKILL.md`, `interview/SKILL.md`, `evaluation/SKILL.md`, `preparation/SKILL.md`, `gobbi/SKILL.md`. Verified: all 12 exist on develop (checked via filesystem).
- Count verification: the TL;DR says "12 skills"; the enumeration consistently lists exactly 12 items across three sections. Count confirmed.

**Scenario B — M2 substitution wording — is it locked verbatim?**
- [YES] The backlog file `f-risk-01-subagent-ccsi-semantics.md` § Candidate mitigations M2 reads (verbatim from read): `"use \`{session-id}\` from the delegation prompt's \`session-id:\` field; do NOT read \`$CLAUDE_CODE_SESSION_ID\` for this value."`
- [YES] iter2 draft CL-5 witness paragraph quotes this verbatim AND adds the subagent-UUID parenthetical explanation ("subagent context returns the subagent's own UUID, not the parent session's").
- [PARTIAL] The iter2 draft does NOT state whether the exact substitution string is finalized at Ideation scope or deferred to Preparation/Planning. It says: "The exact substitution wording is Preparation/Planning scope, not Ideation scope" (§ In-Scope item 5). This deferral is explicitly stated. However, the TL;DR and DL-5 cite wording that extends beyond the backlog's M2 language by adding the subagent-UUID parenthetical. The extended wording (with parenthetical) is cited in CK-7 as the canonical text. There is a minor tension: if the "exact wording" is Preparation scope, why does Ideation already cite it precisely in CK-7 and SC-5? This is probably intentional (the extension is clarificatory, not substantive), but it blurs the Ideation/Preparation scope boundary.

**Scenario C — N=2 witnesses — are both named with paths and commit SHAs?**
- [YES] `.claude/hooks/session-start.sh` — path confirmed; "commit `159eb21`" cited (env-var-audit PR #265).
- [YES] `.claude/hooks/post-tool-use-agents.sh` — path confirmed; "in Bundle B PR #268 `dfb7d6d`" cited.
- [YES] LOC claims: "79 lines" + "251 lines" — verified: `wc -l` returns exactly 79 and 251.
- [YES] Both files exist on develop at the stated paths (verified via filesystem check).

**Scenario D — Verification anchors actually verifiable as written**
- [YES] SC-1: `grep -E '^status: closed' .gobbi/projects/gobbi/backlogs/f-struct-01-jq-sh-env-passthrough.md` — concrete, executable, correct path.
- [YES] SC-2: `.gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md` exists; `head -10` shows YAML frontmatter with `name: gobbi-hook-authoring`; section header grep — concrete.
- [YES] SC-3: `grep -E 'hooks' .claude/skills/mistake/SKILL.md` — concrete, executable.
- [YES] SC-4: file exists + grep section headers shows all 5 sections — concrete.
- [PARTIAL] SC-5: `grep -nE 'session-id.*delegation prompt' {each-skill}` — `{each-skill}` is a placeholder. Not executable as written without expanding it to 12 paths. (Also flagged in P1-003.)
- [YES] SC-6: PR description witness references — verifiable from PR body but not grep-verifiable; acceptable for a PR-body check.
- [YES] SC-7: "All 5 deliverables land in the same PR" — verifiable via `git diff`.

**Scenario E — Every design decision names the specific approach (adversarial: no vague "we'll figure out X in Planning")**
- [YES] D-1 (skill body sourcing pattern) — specific: sources from 2 hook witnesses + session memory. Template: `interview/templates/project-skill.md`. No vague "some template."
- [YES] D-3 (f-struct-01 close-in-PR) — specific: frontmatter edit, closure note text specified.
- [YES] D-4 revised (M2 absorption) — specific: 12 paragraph-edits, M2 wording cited.
- [YES] D-7 (CL-3/CL-5 coordination) — specific: single executor task, both edits in one pass.
- [PARTIAL] D-6 revised (task count cap) — "≤ 7 if CL-5 = 1 task; ≤ 15 if CL-5 = 12 tasks" defers the decision to Planning. The recommended path is stated (7 tasks, CL-5 as one sweep), but the boundary is not locked. This is correctly scoped to Planning.
- [YES] D-2 (watchlist resolution shape) — specific: single skill edit + single backlog status update, no new artifact.

**Scenario F — CL-1 closure note — exact text specified?**
- [YES] § In-Scope CL-1 Action: "append a one-line closure note: 'Closed — fix already shipped in `session-start.sh` lines 73-77 via env-var-audit PR #265 (commit `159eb21`); discovered during Bundle C ideation 2026-05-24.'" — Exact text specified.

**Scenario G — f-risk-01 backlog disposition update — exact field/value specified? (adversarial)**
- [FAIL] Three sections give conflicting field/value specifications (C2-001 from Consistency perspective; see also S3 scope finding). The exact field update is ambiguous: `disposition: addressed` (SC-6), `disposition: addressed (or equivalent)` (Per-Deliverable table), `status: in-progress → disposition: addressed` (Backlog Deltas). Not a single, canonical "update field X to value Y" statement anywhere.

---

## Per-scenario per-check results

The specificity failures are:
1. SC-5 `{each-skill}` placeholder — affects the largest deliverable's primary verification criterion.
2. f-risk-01 backlog field/value ambiguity — three slightly different formulations, no single canonical spec.
3. "Exact substitution wording is Preparation scope" statement partially undermined by CK-7 and SC-5 already prescribing the wording.

---

## Typed findings

### P4-001 — "Exact substitution wording is Preparation scope" contradicts Ideation already specifying it in CK-7 and SC-5

- **Type**: `design_flaw`
- **Domain**: `process`
- **Disposition**: open
- **Confidence**: 75
- **Severity**: Medium
- **Evidence**: 
  - § In-Scope CL-5: "The exact substitution wording is Preparation/Planning scope, not Ideation scope — Ideation locks the direction (M2 codification); Preparation produces the substitution string + the per-file Path Conventions table verification anchors."
  - § Implementation Checklist CK-7: "update the `{session-id}` Path Conventions row to 'from the delegation prompt's `session-id:` field' with an explicit 'do NOT read `$CLAUDE_CODE_SESSION_ID` for this value (subagent context returns the subagent's own UUID, not the parent session's)' disclaimer."
  - § SC-5 also cites the wording: "do NOT read `$CLAUDE_CODE_SESSION_ID`... subagent context returns the subagent's own UUID, not the parent session's."
  
  The artifact simultaneously defers the exact wording to Preparation (CL-5 text) and specifies the exact wording in CK-7/SC-5. The Preparation agent will receive Ideation's output as its input contract. If Preparation reads CK-7 and SC-5, it has the wording. If it reads only the CL-5 deferral statement, it knows to produce the wording itself. The contradiction creates ambiguity: should Preparation produce the substitution string independently, or use the one Ideation already locked?
- **Why it matters**: Preparation's scope boundary vis-à-vis Ideation is unclear for CL-5. If Preparation produces a slightly different wording (e.g., word order change), it will conflict with the SC-5 verification criteria which greps for a literal string. If Preparation inherits Ideation's wording from CK-7, the "deferral" claim was misleading.
- **Suggested direction**: Either remove the CL-5 deferral statement ("exact wording is Preparation scope") and accept that Ideation has locked the wording in CK-7/SC-5, OR remove the exact wording from CK-7/SC-5 and let Preparation produce it. Pick one; document which scope owns the substitution string.

### P4-002 — f-risk-01 backlog field/value update lacks a single canonical specification

- **Type**: `checklist_gap`
- **Domain**: `docs-sync`
- **Disposition**: open
- **Confidence**: 75
- **Severity**: Medium
- **Evidence**: See C2-001 (Consistency perspective) and S3-001 for cross-references. Three formulations exist:
  - SC-6: `disposition: open` → `disposition: addressed`
  - Per-Deliverable CL-5 verification anchor: `disposition: addressed (or equivalent)`
  - Backlog Deltas: `status: in-progress` → `disposition: addressed` post-merge
  The current backlog file frontmatter has both `disposition: open` and `status: open`. No single section of the iter2 draft specifies which field(s) are updated to which value(s) with a complete, unambiguous statement.
- **Why it matters**: Executor building the CL-5 task will follow one of these three formulations. The SC-5/SC-6 verification anchors don't grep the backlog file's `disposition:` or `status:` fields specifically — they rely on the backlog pointing to the 12-skill commits. An inconsistent update (e.g., only `status:` updated but not `disposition:`) will pass SC-6's stated verification checks.
- **Suggested direction**: Converge to: "Set `status: addressed` and `disposition: addressed` (both fields) in `f-risk-01-subagent-ccsi-semantics.md` frontmatter; add body section '## Disposition' citing the 12-skill commits + DL-5." Then update SC-6, Per-Deliverable CL-5 verification, and Backlog Deltas to all say the same thing.

---

## Per-perspective verdict

**PASS** — Two Medium findings (P4-001, P4-002) at Confidence 75. Per verdict thresholds: Medium findings at any confidence → PASS. Neither rises to High severity; both are fixable in Planning's task spec construction without requiring Ideation re-iteration.

---

## Low-confidence appendix

None — all findings above have confidence ≥ 50.
