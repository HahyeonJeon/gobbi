---
perspective: structure
iter: 1
system: claude
verdict: REVISE
---

## Artifact Summary + Memory reads

**What**: 6 sequential executor tasks decomposing Bundle C CLs.

**Why**: Implements the Ideation Scope Contract (CL-1..CL-6).

**How**: 1 task per CL; pairwise disjoint file-touch sets; DAG verified in § Dependency table; per-task shell verifications.

**Memory reads**: `idea.md`, `preparation.md`, `planning/evaluation.md`, `manager-context-overflow-with-large-bundle.md`.

---

## Locked Frame (Stage 1)

**S1: Every task narrow enough for fresh executor (one read)**
- Each task's scope, files, and verification commands expressible in one YAML block

**S2: Dependencies form a DAG — no cycles**
- `requires:` fields produce a linear chain T01→T02→T03→T04→T05→T06
- No forward references

**S3: Each task's verification step is concrete (runnable command)**
- `verifies:` has literal shell commands (grep/awk/test/jq)

**S4: Files-touched per task bounded and declared**
- `files:` field present; `files-may-touch` explicit; `files-must-not-touch` explicit

**S5: Agent type matches work nature**
- All 6 tasks: executor/sonnet for docs editing. Appropriate.

**S6: DAG conflict check — file-touch sets pairwise disjoint (adversarial)**
- Compare every (Ti, Tj) pair for shared paths

**S7: T06 verifies block — awk pattern covers all heading variants used in target files**
- The awk pattern must capture Path Conventions blocks from all 11 sweep targets

---

## Per-scenario per-check results

**S1: Task scope — all tasks readable in one pass**
- T01: 1 file, 3 verifies. YES — narrow.
- T02: 1 skill file + 1 no-op. YES — bounded.
- T03: 2 files, clear two-edit spec. YES.
- T04: 3 files (stage+promote+backlog). 4 verifies. YES — slightly large but self-contained.
- T05: 2 files, 3 verifies. YES.
- T06: 12 files + backlog. 4 verifies. YES — sweep task by design (DR-1).

**S2: DAG — no cycles**
- requires chain: T01←none, T02←T01, T03←T01+T02, T04←T03, T05←T04, T06←T05.
- Linear chain with T03's double-require (T01+T02) — T01 and T02 are both prerequisites. No cycle. YES.

**S3: Verification commands concrete**
- T01: `grep -E '^status: closed$'` — concrete. YES.
- T02: `awk /^## Step 1.../` multi-line — concrete. YES.
- T03: `grep -nE '\bhooks\b'` — concrete. YES.
- T04: `test -f`, `grep -nE`, `awk`, `jq '.agents | length'` — concrete. YES.
- T05: `test -f`, `grep -cE`, `awk ... | wc -c` — concrete. YES.
- T06: Full loop over FILES with awk + grep — concrete. YES.

**S4: Files-touch sets declared**
- All tasks have `files:`, `files-may-touch:`, `files-must-not-touch:`. YES.

**S5: Agent types**
- All executor/sonnet. Appropriate for docs-editing work. YES.

**S6: DAG file-touch conflict check**
- `f-struct-01` backlog: T01 only. ✓
- `orchestration/SKILL.md`: T02 only (T06 has `orchestration/workflow/evaluation.md` which is a different path). ✓
- `mistake/SKILL.md`: T03 only (T06 explicitly excludes). ✓
- `gobbi-hook-authoring/SKILL.md` (project): T04 only. ✓
- `hooks-domain-mistakes-watchlist.md` backlog: T03 only. ✓
- `gobbi-hook-authoring-skill.md` backlog: T04 only. ✓
- Design doc + its backlog: T05 only. ✓
- 11 sweep files: T06 only (T02/T03/T04/T05 all exclude them). ✓
- `f-risk-01` backlog: T06 only. ✓
- RESULT: zero cross-task file-touch conflicts. ✓

**S7: T06 awk pattern vs actual file heading types — FAIL**
- awk pattern: `/^\*\*Path conventions\*\*|^## Path conventions|^## Path Conventions/`
- Files 1-9 (except memorization and gobbi) use `**Path conventions**` (bold). Pattern covers this. ✓
- `memorization/SKILL.md` uses `### Path conventions` (H3 heading). Pattern does NOT cover `^### Path conventions`. ✗
- `gobbi/SKILL.md` has NO Path conventions section at all. ✗

Evidence: Running `awk '/^\*\*Path conventions\*\*|^## Path conventions|^## Path Conventions/,/^\*\*[^P]|^## /' /playinganalytics/git/gobbi/.claude/skills/memorization/SKILL.md | wc -l` returns 0. Running same against `gobbi/SKILL.md` returns 0. Tool-verified at Confidence 100.

This means T06's per-file verification loop will FAIL for these two files:
- For `memorization/SKILL.md`: awk captures empty output; `grep -qE ...` fails → loop exits 1 with FAIL message.
- For `gobbi/SKILL.md`: same empty output → FAIL.

The executor brief instructs modification of a "Path Conventions `{session-id}` row" in both files, but:
- `memorization/SKILL.md` has the row under `### Path conventions` (H3) — a different heading type than the awk expects.
- `gobbi/SKILL.md` has no such row anywhere.

This will cause the executor to either (a) encounter failing verification it cannot satisfy, or (b) create/modify content in the wrong location to pass verification, which would be scope creep.

---

## Typed findings

**Finding S-F1**
- Type: `design_flaw`
- Domain: `test`
- Disposition: open
- Confidence: 100
- Severity: High
- Evidence: `memorization/SKILL.md:228` uses `### Path conventions` (H3). The T06 SC-5 awk pattern `/^\*\*Path conventions\*\*|^## Path conventions|^## Path Conventions/` does not match H3 headers. Tool-verified: `awk` returns 0 lines for this file.
- Why it matters: T06's per-file verification loop will hard-fail (`exit 1`) on `memorization/SKILL.md`. The executor cannot satisfy the verification as written; it would either skip the file (leaving the M2 sweep incomplete) or add `## Path conventions` where `### Path conventions` exists (structural regression).
- Suggested direction: Augment the awk start pattern to include `^### Path conventions`.

**Finding S-F2**
- Type: `design_flaw`
- Domain: `docs-sync`
- Disposition: open
- Confidence: 100
- Severity: High
- Evidence: `gobbi/SKILL.md` (symlink target `.gobbi/projects/gobbi/skills/gobbi/SKILL.md`, 250 lines) contains zero `**Path conventions**`, `## Path conventions`, or `### Path conventions` headings. Tool-verified: grep returns no results. All 3 CCSI hits (lines 38, 52, 63) are in prose/table sections, not in a Path Conventions block. The preparation.md claim at line 86 that "the Path Conventions row is one of the other two" is factually incorrect.
- Why it matters: T06 task spec says to "MODIFY (Path Conventions `{session-id}` row ONLY)" in `gobbi/SKILL.md`, but no such row exists. The executor has no row to modify. T06's SC-5 verification will hard-fail. Either the file must be excluded from the sweep, or the task spec must specify that the executor should CREATE a Path conventions block in `gobbi/SKILL.md` — which is a larger change than the task brief currently conveys.
- Suggested direction: Either (a) remove `gobbi/SKILL.md` from T06's file list (if the CCSI references there are all legitimately out-of-scope prose) or (b) explicitly instruct the executor to add a Path conventions section to `gobbi/SKILL.md` and update the verification accordingly.

---

## Low-confidence appendix

None.
