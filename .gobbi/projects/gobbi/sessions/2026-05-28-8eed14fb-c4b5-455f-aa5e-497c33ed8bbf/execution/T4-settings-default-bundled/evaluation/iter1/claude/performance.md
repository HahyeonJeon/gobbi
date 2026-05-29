# T4 iter1 — Performance perspective (claude)

**Perspective:** Performance — file size, parse cost, resolver work, structural overhead.

## Stage 0 — Target understanding

Bundled file ~2× the per-subtree volume of the pre-T4 baseline (chat + auto each carry full workflow + models + git). At-rest JSON parsed once per session at config load. No hot-path cost — settings are not read per loop iteration.

## Stage 1 — Frame

Scenarios:
1. File size remains within reasonable bounds (sub-10KB target — config files should be human-readable).
2. Parse cost is O(1) per session start (negligible).
3. Bundled shape adds at most one resolver branch (`settings[mode]`) — no quadratic blowup.
4. Karpathy-4 mode: over-engineering check — bundled shape vs alternative (single tree with per-field `byMode` overrides). The bundled choice is the simpler one (Idea Decision #8 lock).

## Stage 2 — Evidence

```
$ wc -c .gobbi/projects/gobbi/skills/orchestration/templates/settings.default.json
```
Bundled file roughly doubles vs baseline because models.* and git.* are duplicated across both subtrees. This is acceptable — these blocks are small (per-role model name strings; per-field git defaults). Total file remains in the low-KB range.

| # | Scenario | Verdict |
|---|---|---|
| 1 | Sub-10KB | PASS (well under) |
| 2 | Parse cost negligible | PASS |
| 3 | Resolver adds one dispatch branch | PASS |
| 4 | No Karpathy-4 over-engineering | PASS — bundled is simpler than per-field-override schema |

## Findings

None within Performance scope. The duplication of `models.*` and `git.*` across both subtrees is a known cost (Idea §5 rows 333–334 explicitly list both as "unchanged" in each subtree); the alternative (factor-out shared section) would invent new schema and reopen Decision #8.

**Note (Confidence 50, Severity Low):** Duplicated `models.*` and `git.*` blocks create two future-maintenance edit sites. If a model assignment or default git setting changes upstream, both subtrees must be updated in lockstep — drift risk exists. Not a T4 bug; surfaces as a process risk for future PRs. The Finding #8 backlog (models drift) is the canonical home for this concern.

## Must-preserve

- The single-file shape — do NOT split into `settings.chat.default.json` + `settings.auto.default.json`.
- Lazy resolution: only the active mode's subtree should be needed at runtime (resolver concern; out of T4 scope).

## Verdict

**PASS**
