---
perspective: usage
iter: 1
system: claude
verdict: REVISE
---

## Artifact Summary + Memory reads

**What**: Plan consumed by executor agents spawned one-at-a-time.

**Memory reads**: `planning/evaluation.md`.

---

## Locked Frame (Stage 1)

**S1: Fresh executor given task N alone can begin work without parent context**
- Each task's what/why/files/verifies is self-contained

**S2: Executor knows which file to open, which section to edit**
- File paths explicit; section anchors named (e.g., line 129 for mistake/SKILL.md)

**S3: Failure modes communicated**
- Executor knows what must-not-touch violations look like; verifies commands tell pass/fail cleanly

**S4: Inter-task handoffs named identically on both sides**
- Producer outputs: field = consumer inputs: field

**S5: Executor must ask "what does X mean here?" (adversarial)**
- Ambiguous terms — especially around gobbi/SKILL.md and memorization/SKILL.md treatments in T06

---

## Per-scenario per-check results

**S1: Tasks self-contained for fresh executor**
- T01-T05: YES. Required skills + mistakes listed; what block is precise.
- T06: The task spec says "MODIFY (Path Conventions `{session-id}` row ONLY)" for `gobbi/SKILL.md` and `memorization/SKILL.md`. The executor will look for these rows and find: (a) in `memorization/SKILL.md` — a `### Path conventions` section (not `**Path conventions**`), so the awk verification command won't match; (b) in `gobbi/SKILL.md` — no Path conventions section at all. The executor is given no guidance on how to handle these cases. FAIL.

**S2: File and section anchors explicit**
- T01: `f-struct-01` backlog — no specific section anchor needed; frontmatter edit. YES.
- T02: `orchestration/SKILL.md` Step 1 rows 5/5.5/6. YES.
- T03: `mistake/SKILL.md` lines 63 + 90 (domain-tag) + line 129 (session-id row). YES.
- T04: skill template at `interview/templates/project-skill.md` referenced. YES.
- T05: `memorization/templates/design.md` referenced. YES.
- T06: Section anchor for `memorization/SKILL.md` and `gobbi/SKILL.md` missing — no path-conventions row to update. FAIL.

**S3: Failure modes communicated**
- `files-must-not-touch` denylist clearly communicates ownership boundaries. YES.
- Verification commands produce clean exit codes (FAIL messages in T06 loop). YES.

**S4: Inter-task handoffs — producer/consumer name match**
- T03 outputs `bundle-c-canonical-m2-wording-on-mistake-skill` → T06 inputs same. YES.
- T04 outputs `bundle-c-cl-2-gobbi-hook-authoring-skill-shipped` → T05 inputs same. YES.

**S5: Ambiguous terms in T06 (adversarial)**
- `memorization/SKILL.md`: The task says apply M2 wording. The executor who reads the actual file sees `### Path conventions` (not a bold heading). The awk won't find a block to verify. The executor has no fallback instruction. AMBIGUOUS.
- `gobbi/SKILL.md`: No Path conventions block. The executor's `what` says "Path Conventions `{session-id}` row ONLY; env-health gate at line 52 NOT edited" — but the row doesn't exist. AMBIGUOUS.

---

## Typed findings

**Finding U-F1**
- Type: `design_flaw`
- Domain: `docs-sync`
- Disposition: open
- Confidence: 100
- Severity: High
- Evidence: T06 task spec `what` block (lines 466-486) specifies "MODIFY (Path Conventions `{session-id}` row ONLY...)" for `gobbi/SKILL.md`. Tool-verified: `gobbi/SKILL.md` (250 lines) has no `**Path conventions**`, `## Path conventions`, or `### Path conventions` section. The executor has no target row to modify and no instruction for the no-block case. The SC-5 verification loop will hard-exit on this file.
- Why it matters: An executor following the task spec literally cannot succeed. It will either (a) fail verification silently and mark the task complete incorrectly, or (b) create unsanctioned content, or (c) raise NEEDS_CONTEXT — all bad outcomes.
- Suggested direction: Either exclude `gobbi/SKILL.md` from the 11-file sweep (since all 3 CCSI references are in prose/tables, not in a Path conventions block) or explicitly add a sub-instruction to create a Path conventions section in `gobbi/SKILL.md`.

(Note: Finding U-F1 is the Usage-lens view of the same root-cause as S-F2 in the Structure perspective. Both are High/100. They are recorded separately because the impact differs — Structure sees the verification design flaw; Usage sees the executor-briefing ambiguity.)

---

## Low-confidence appendix

None.
