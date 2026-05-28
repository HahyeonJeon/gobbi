# Planning Eval iter2 — Risk perspective (Claude)

**Frame:** Wrong-assumption / latent-failure risk; symlink + main-tree-edit hazards; gate-gaming.

## iter1 findings under this lens
- **DOC-RISK-2 (archive-glob leak, High/100): CLOSED.** Same evidence as Project — every `**` glob archive-safe; the per-task git-diff verify could not have caught a silent archive edit before, now the edit set never includes archive.
- **DOC-RISK-1 (T10 symlink mismodel, Medium/100): CLOSED.** `readlink AGENTS.md` = `.codex/AGENTS.md` (confirmed; `ls -la` shows `AGENTS.md -> .codex/AGENTS.md`). iter1 T10 `files:` listed BOTH AGENTS.md and .codex/AGENTS.md as independent files — editing the symlink path would fail (mistake edit-tool-refuses-symlink-paths). iter2 T10 `files:` lists ONLY `.codex/AGENTS.md`; verifies confirms the symlink, asserts "13 principles" in both via propagation, "12 principles"=0, and git-diff lists only `.codex/AGENTS.md`. The WORKTREE-edit guard (executor-main-tree-edit: .codex/AGENTS.md exists in both trees) is preserved.

## Fresh pass
- **Gate-gaming (Iron Law 11):** the underscore key-set fix removes the false-pass risk on SC2. Current `.codex/AGENTS.md` shows "12 principles" (count=1) — the pre-fix state T10 will correct; verifies asserting "12 principles"=0 is a real post-condition.
- **Main-tree-edit hazard:** every task carries worktree-edit + cwd-reset mistakes; git-diff scope checks in verifies. T10 flagged CRITICAL.
- No new latent-failure: the typed-subdir globs (T3/T4/T6/T7) cannot reach archive (sibling, not nested) — verified; this is robust, not coincidental.

**Verdict: PASS** — both risk findings closed with re-run evidence; no new latent hazard introduced by the splits.
