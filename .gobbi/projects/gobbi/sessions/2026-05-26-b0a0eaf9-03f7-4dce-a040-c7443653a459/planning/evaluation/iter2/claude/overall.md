# Planning Eval iter2 — Overall (Stage 3, Claude)

iter1 = REVISE (5 findings + Codex F2). iter2 remediates. Each finding re-verified by independent re-run at HEAD d2b5b37 (NOT trusting the draft's pasted outputs), plus a fresh pass.

## Per-iter1-finding disposition (re-run evidence)

1. **Archive-glob leak (DOC-PROJECT-1/CONS-1/RISK-2 + Codex implied, was High/100) — CLOSED.**
   Re-run: 7 frozen docs = 2 nested content (`install-runtime/archive/references/...`, `workflow/archive/decisions/...`) + 5 archive READMEs, exactly as enumerated. Every `**` `files:` glob carries `exclude: "**/archive/**"` (12 verified) OR is typed-subdir-enumerated where archive is a SIBLING not nested (verified `install-runtime/archive/references/` ≠ `install-runtime/references/archive/`; gw-A subdirs have 0 archive paths). No task would edit `features/*/archive/`. Edit-glob = count predicate (workflow 27→26, install-runtime 45→44). `verifies` also carries `-not -path '*/archive/*'`.

2. **Prose over-budget (DOC-STRUCT-1/PERF-1, was High) — CLOSED.**
   Re-counted on FS: P3a=20, P3b=21, P5a=24, P5b=20, P7a=35, P7b=33 (mirror T3/T4/T6/T7/T9b/T9c exactly). Prose set max = 35 ≤ ceiling. Total normalized to 25 (draft + staged main.md task_count: 25).

3. **Underscore keys (DOC-CONS-2, was Medium/100, my own iter1 finding) — CLOSED.**
   Re-ran grep: 5 install-runtime files carry `promoted_from`/`promoted_at` and (verified per-file) NO hyphen variant — the iter1 hyphen-only gate would falsely certify them. Key-set S now includes underscore spellings (T0 predicate, T6/T7 verifies naming all 5, T11 cumulative). SC2 target = {63 ∪ 5} → 0. T1 + T5 now assert disposition preservation (closes Codex F2; agents backlog = `disposition: deferred`, 3 guardrails backlogs carry disposition).

4. **T10 symlink (DOC-USAGE-2/RISK-1, was Medium/100) — CLOSED.**
   `readlink AGENTS.md` = `.codex/AGENTS.md` confirmed; `ls -la` shows the symlink. T10 `files:` lists ONLY `.codex/AGENTS.md`; verifies confirms symlink + "13 principles" propagation + "12 principles"=0 + worktree-only diff. WORKTREE-edit guard preserved.

5. **Count prose (Codex F3, was Low) — CLOSED.**
   All count prose = 25 records; staged main.md synced (task_count: 25, 25-row table). T11 transitive-closure note added (10 direct edges cover 11 conformance records via T3→T4, T6→T7). Residual "22" tokens are historical "22→25" references only.

## Per-perspective verdicts
| Perspective | Verdict | iter1 → iter2 |
|---|---|---|
| Project | PASS | REVISE → closed (archive leak) |
| Structure | PASS | REVISE → closed (prose split, DAG sound) |
| Performance | PASS | REVISE → closed (≤35 on prose) |
| Aesthetics | PASS | PASS (Low moot) |
| Usage | PASS | PASS (USAGE-1/2 closed) |
| Consistency | PASS | REVISE → closed (underscore gate + counts) |
| Risk | PASS | REVISE → closed (symlink + archive) |

## Fresh-pass results (beyond the 5 findings)
- DAG: new P*a/P*b outputs→inputs fully connected; N1 inputs reference 11 prose-quality outputs, all produced; 0 dangling. T11 prereq closure = all 11 conformance records. Conformance-before-prose on shared files preserved (each Pk requires its Tk); A→B prose chaining serializes same-tree edits.
- Partition complete + disjoint (154+68=222), prose partition identical.
- Placeholder scan: 0 genuine placeholders (matches are scan-description + DEFERRED-removal narrative).
- Faithfulness: count system 222/18/204/63 preserved verbatim (independently reproduced); D10 archive exclusion honored across all 25 records; FLAG-2/FLAG-3 still deferred.

## Karpathy failure-mode check
- Wrong assumptions: NO remaining (symlink + underscore-key assumptions both fixed).
- Overcomplexity: NO — splits are along existing conformance boundaries, no new structure invented.
- Orthogonal edits: NO — clean per-feature/tier partition.
- Imperative-over-declarative: NO — verifiable goals, not prescribed diffs.

## New findings
NONE at any severity. The remediation is surgical, the preserve-list assets (count system, DAG, partition, schema) are untouched, and no new blocker was introduced.

## Preserve list (do NOT break)
- The independently-reproduced count system 222/18/204/63 (+5 underscore) and buggy-vs-corrected filter narrative.
- The conformance-before-prose DAG + A→B chaining + T11/N1 closure.
- Complete+disjoint partition.
- Uniform 8-field schema; 0 placeholders; 0-dangling inputs/outputs.
- T10 WORKTREE-physical edit target + symlink handling.

## Aggregated reasoning
All five iter1 findings (plus Codex F2) are GENUINELY closed — verified by independent re-run, not by trusting the draft's pasted outputs. The two High roots (archive leak, prose over-budget) are eliminated structurally and confirmed against the live filesystem. The Medium SC2-validity finding (underscore gate-gaming) is closed with proof the 5 files are caught only by the extension. No Critical-≥75 and no High-≥50 remains; no new blocker. The plan is execution-ready.

VERDICT: PASS
