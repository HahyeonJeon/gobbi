# Planning iter1 — Aesthetics perspective (Claude)

## Artifact Summary + Memory reads (Stage 0)

**Target**: Readability + placeholder hygiene + consistent field schema of `main.md` + `draft-iter1.md`.

**Memory reads**: `principles` (Iron Law 12), `skills/planning/evaluation.md` § Aesthetics.

## Locked Frame (Stage 1)

Scenarios:
1. Task IDs / titles are concrete and unambiguous; no duplicate IDs.
2. Tasks read top-to-bottom in execution order.
3. Section headings match the project Planning template.
4. No placeholders or unfinished fields.
5. (Adversarial) Plan looks complete but a careful reader spots an empty task.

## Per-scenario per-check results

**S1 — concrete IDs/titles, no duplicates**
- `01-create-pre-reset-tag` and `02-cleanup-sweep`. Imperative-form, short. Unique. PASS.

**S2 — top-to-bottom ordering**
- Tasks listed 01 then 02 in `## Sub-tasks` table (main.md lines 32-33) and in `### Task 01` then `### Task 02` (draft-iter1.md lines 136, 160). Manager-ops §1-12 follows the chronological execution order (pre-Task-01 → pre-Task-02 → post-Task-02). PASS.

**S3 — section headings**
- main.md uses standard sections (Idea anchor, Scope Contract reference, Sub-tasks, Dependency graph, Verification strategy, etc.). draft-iter1.md has self-review report, decisions log, manager ops, parallel lanes — matches `planning/SKILL.md` § Sub-step E + Self-review components. PASS.

**S4 — no placeholders**
- Self-review at draft-iter1.md line 456 ran `grep -nE '(TBD|TODO|to be defined|<\.\.\.>|XXX|FIXME)'`: zero hits. I verified the literal pattern: also zero hits in main.md. PASS on placeholder hygiene.
- `<sweep-branch>`, `<pr-num>`, `<issue-num>`, `<worktree-absolute-path>`, `<HEAD_SHA>` are valid manager-fill parameters, not placeholders. The Plan calls this out explicitly (line 456). ACCEPTABLE.

**S5 — empty-task adversarial**
- Both tasks have non-empty `what:`, `traces-to:`, `requires:`, `files:` (Task 02 only), `inputs:`, `outputs:`, `verifies:`. No empty field. PASS.

## Typed findings

### F-CL-A-01 — Mixed-format `files:` entries in Task 02 (annotated comments vs uniform schema)
- **Type**: checklist_gap
- **Domain**: docs-sync
- **Disposition**: open
- **Confidence**: 50
- **Severity**: Low
- **Evidence**: Task 02 `files:` list (draft-iter1.md lines 184-239) mixes the uniform schema `{ path: "...", op: ... }` with inline comments like `# already D in tree (F-CX-PREP-O-02)` (line 195), `# tracked symlinks` (line 196), `# untracked, rm -rf` (line 197), `# remove lines 61-62 (iter2 H-1)` (line 199), `# wipes ALL ~40 project mistakes — load BEFORE this stage` (line 211), `# → one-line Q-C stub` (line 217), `# FS-only (was gitignored)` (line 225), `# 49 additional bare-UUID dirs swept by the find/xargs invocation; listed by predicate, not by name` (line 228), `# FS-only, gated` (line 231), `# no files; local refs only — listed for traceability` (line 233). The comments encode critical executor-facing information (Stage-C-wipes-mistakes-load-first; line 211) but they are not in a YAML schema-recognized field — a tool processing the YAML literally would drop them.
- **Why it matters**: If the executor delegation prompt is constructed from the YAML alone (without the comments), the executor loses the per-file context (e.g., "already D in tree" vs "needs `git rm`"; "FS-only" vs "tracked"). The Plan does cover these elsewhere (File map, Stage B narrative), but the redundancy invites drift between the YAML comments and the prose.
- **Suggested direction**: Add a `note:` field per-entry where context matters, or move the comments to the File-map prose and keep the YAML as pure `{path, op}` pairs. Not a blocker — the prose carries the context — but cleaner.

### F-CL-A-02 — main.md cites § "Manager pre/post-Execution operations" §12 which actually lives in draft-iter1.md, not main.md
- **Type**: checklist_gap
- **Domain**: docs-sync
- **Disposition**: open
- **Confidence**: 75
- **Severity**: Low
- **Evidence**: main.md line 47 references `(per § Manager pre/post-Execution operations §12 in `draft-iter1.md`)` — explicit cross-reference, OK. But main.md's own ## Manager actions before/around/after Execution Loop entry section (lines 79-102) duplicates the numbered list 1-12 already in draft-iter1.md lines 296-352. Both are present. ACCEPTABLE (main.md is the staged plan; draft-iter1.md is the rawdata — duplication is expected by the planning/SKILL.md staging convention).
- **Why it matters**: Two sources of truth invite drift over future iters. Minor.
- **Suggested direction**: At iter2+, treat main.md as canonical for promotion to project memory and the rawdata as audit-only. If main.md and draft-iter1.md diverge later, main.md wins.

## Low-confidence appendix

- The `## Open issues` section (main.md line 75) says "None at iter1" — true insofar as the leader's self-review found none. Per F-CL-P-01 (Project perspective), F-CL-S-01 (Structure), and the evaluation as a whole, there ARE open issues — but they are evaluator-surfaced, not leader-surfaced. The leader's "None" is honest within its own frame.

## Must-preserve list

- The Self-review report structure (Spec coverage matrix + Placeholder scan + Type/name consistency table).
- The `## NOT in scope` section (lines 480-498) which proactively documents every potential scope creep.
- The verbatim mode of citing Implementation Checklist anchors.

## Verdict: PASS

Aesthetics-level placeholders, naming, ordering all clean. Only Low-severity findings; none cross the REVISE threshold.
