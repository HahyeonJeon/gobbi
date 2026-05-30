# T4 iter1 — Usage perspective (claude)

**Perspective:** Usage — does the artifact support its intended consumers (config resolver, downstream skills, human editors)?

## Stage 0 — Target understanding

Consumers:
1. The config resolver (loads `settings.default.json` at session start, dispatches by `settings.mode`).
2. The orchestration manager (reads `workflow.{phase}.discuss/evaluate/maxIterations` per loop).
3. Downstream skills (delegation reads `models.{system}.{role}`; wrap-up reads `git.*`).
4. Human authors editing defaults.

The bundled shape requires the resolver to pick `settings[mode]` and serve that subtree as the authoritative settings for the session.

## Stage 1 — Frame

Scenarios:
1. Active subtree (e.g. `chat`) is self-contained — a consumer reading `settings.chat.workflow.execution.discuss.mode` gets a complete answer without needing baseline-shape compatibility.
2. R1 trigger works as advertised: a Chat-mode resolver reads `settings.chat.workflow.preparation.maxIterations` → `0` → loop-entry guard stamps `state: Skipped`. The literal `0` is present.
3. `models.*` and `git.*` resolution paths are unchanged: `settings.chat.models.manager.system` and `settings.chat.git.repo` exist and carry baseline values.
4. The `mode` dispatch key inside each subtree matches its parent key (chat→"chat", auto→"auto") — no mismatch trap.

## Stage 2 — Evidence

| # | Scenario | Evidence | Verdict |
|---|---|---|---|
| 1 | Self-contained subtree | both subtrees carry full workflow + models + git | PASS |
| 2 | R1 trigger present | `.chat.workflow.preparation.maxIterations == 0` | PASS |
| 3 | models / git resolution paths exist with baseline values | MD5 identity | PASS |
| 4 | Internal `mode` matches outer key | `.chat.mode == "chat"`, `.auto.mode == "auto"` | PASS |

## Findings

**F-U1 — Resolver contract unspecified at the file level (Confidence 25, Severity Low):** The file does not encode any hint to its consumer (resolver) that the shape is "mode-keyed bundle". A future reader who only has the file (no Idea doc) sees two parallel trees and must infer the dispatch contract. A leading `"$comment"` or doc-string in the README/template area could short-circuit that. Out of T4 scope (T4 is the JSON itself) but worth flagging.

**Why it matters:** Discoverability for a fresh resolver implementer. The resolver is downstream of T4 — it will need an inline pointer to the cascade contract spec.

## Must-preserve

- The `mode`-keyed bundled shape — this is the dispatch contract. Do NOT factor it out into per-mode files; do NOT collapse to a flat tree with `byMode` overrides.
- `chat.workflow.preparation.maxIterations: 0` — the R1 trigger. Changing this value breaks the Skipped-at-loop-entry semantic.

## Verdict

**PASS**
