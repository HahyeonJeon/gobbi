# Codex iter2 — Subcommand-mode output

The 8-file per-perspective layout (`project.md`, `structure.md`, …, `overall.md`) used in `iter1/codex/` and `iter2/claude/` was NOT produced for iter2 codex/, for the following dual failure:

1. **First attempt (`codex-rescue` → `codex-companion.mjs task --write --effort xhigh`)** — codex token-budget exhausted before any file was written.
2. **Retry (same path)** — `linux-sandbox` panic: legacy-landlock profile mismatch made all read commands fail before Stage 0 could execute. No files written.

Fallback path used: `codex-companion.mjs adversarial-review --background --base develop --scope branch "<focus>"` (PR-style review subcommand). This produced a flat-shape verdict + findings list rather than the 4-stage 8-perspective Stage 0-3 layout — but the substantive evaluation is valid and one regression was surfaced that Claude iter2 missed.

See `summary.md` in this directory for the captured Codex output.

Per `orchestration/workflow/evaluation.md` § Dual-system failure handling: when one system's structured output is unavailable, manager records a `process` finding (Domain: `process`, Severity: `High`) and the loop verdict floor remains `REVISE`.
