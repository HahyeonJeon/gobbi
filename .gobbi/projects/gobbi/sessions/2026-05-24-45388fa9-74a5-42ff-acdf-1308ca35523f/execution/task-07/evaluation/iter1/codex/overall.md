# Overall

The contracted T07 files are mostly correct: the target docs no longer reference `gobbi mistake promote`, the two-layer model is preserved, `wrap-up/SKILL.md` now owns Layer-2 promotion, `mistake/SKILL.md` is coherent with the Wrap-up sole-writer exception, the backlog is addressed, `packages/cli` is absent, and the orchestration skill does define the workflow governor plus `workflow/` sub-documents.

However, one mandatory Codex entrypoint remains stale: `.codex/AGENTS.md` still contains both the old `packages/cli` / `gobbi workflow init` claim and the nonexistent `gobbi mistake promote` instruction. That is a High-confidence docs-sync finding, so the threshold result is REVISE.

VERDICT: REVISE

Must-preserve:
- Keep the two-layer promotion model.
- Keep both layers agent-driven during Wrap-up; no CLI command.
- Keep the Wrap-up assistant as the sole documented promotion/write exception for project-memory mistakes.
- Keep the T06 `{session-id}` path-conventions row intact.
- Keep T07's four-file scope discipline unless the revision explicitly adds `.codex/AGENTS.md` as an approved follow-up surface.
