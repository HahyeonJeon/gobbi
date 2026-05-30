# Structure — iter3

**Perspective:** Structure
**Verdict:** PASS

## Stage 1 inheritance

- iter2 F-STRUCT2-3 (G6 / triple-escape) → confirmed `addressed`. T4 line 278 carries the printf-comparison form literally; no embedded JSON literal needing nested escapes.
- iter2 F-STRUCT2-1 / F-STRUCT2-2 — addressed via iter3's G3 (absolute-path variables) and structurally inherited from iter2.

## Stage 2 — structural integrity of the 7-task plan

- **Task DAG unchanged.** T1, T2, T4, T5 have `requires: []`; T3 requires [T1, T2]; T6 requires [T1, T2, T3]; T7 `requires: []`. Same as iter2; no cycle; no orphan.
- **YAML hygiene (G5).** FLAG-2 NOTE moved OUT of the `required-skills:` block to prose ABOVE the YAML at lines 109/178/238/294/345. The `required-skills:` blocks are now syntactically clean YAML — only existing skill IDs. No more YAML-comment-as-skill-entry confusion.
- **Common-variable preamble pattern (G3).** Every task's `verification-commands:` first array entry is an `Fn=/abs/path[; Mn=...]` or `WT=...; Fn=...` line. T1 (F1/M1), T2 (F2/M2), T3 (F3F/M3 — non-colliding rename), T4 (WT/F4), T5 (WT/F5_STATE/F5_SESSION), T6 (WT/OLD_CHAT/OLD_AUTO/ARCHIVE_DIR), T7 (F7). All paths absolute. No cross-task collision (each verification block executes in its own scope at Execution time).
- **Per-task pre-flight pattern (F6).** T1/T2/T3 carry `test -L "$M{1,2,3}" && echo SYMLINK_OK || { echo BROKEN; exit 1; }` as the first post-variable verification line. T4/T5 carry the `PRE_T{4,5}_REV=$(git -C "$WT" rev-parse HEAD)` capture as their pre-flight (G4 mechanism).
- **§4 acceptance test.** 9 binary-assertion blocks, all keyed on `$WT` and absolute paths. `develop..HEAD` for diff baselines (F7).

## New / regression findings

None. Structure is clean; the G5 unblocking is a real YAML-hygiene improvement over iter2.

## Must-preserve

- The `Fn=/Mn=` common-variable preamble idiom — it's the load-bearing pattern that unblocks G3.
- T3's `F3F` rename (vs the `F3` name used by the iter3 §3 head convention for "F-finding-3") — prevents semantic collision.

Verdict: **PASS**.
