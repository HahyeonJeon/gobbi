---
name: codex-exec-at-file-hangs-on-stdin-in-background
description: "`codex exec \"@promptfile\"` launched via Bash run_in_background can hang reading stdin and exit 0 with zero output files; inline the prompt via \"$(cat file)\" and redirect stdin from /dev/null."
metadata:
  type: feedback
mistake-candidate: true
domain: process
scope: project
source: session-2026-05-24-45388fa9-execution-T04-iter2
session-id: 2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f
feature: session-foundations-bundle-c
created: 2026-05-25
---

# `codex exec "@promptfile"` can silently hang on stdin in a background Bash call

**What went wrong.** The T04 iter2 Codex evaluation leg was launched as `timeout 600 codex exec --sandbox workspace-write --cd <worktree> "@<promptfile>" > log 2>&1` via `Bash(run_in_background:true)`. Codex exited 0 but wrote ZERO output files. The stdout log contained only `Reading additional input from stdin...` — codex was waiting on stdin (which, in a background Bash task, is not a TTY and never delivers the prompt), then terminated without producing the contracted per-perspective files. An identical-shaped iter1 invocation had worked, so the failure was intermittent/environment-dependent, which is worse — it passes sometimes and silently no-ops other times.

**Why it went wrong (mistaken assumption).** Assumed `"@promptfile"` is a reliable way to feed the prompt to `codex exec` in every context. In a non-interactive background invocation, codex's `@file` / prompt-arg handling fell through to reading additional input from stdin; with no stdin attached, it got EOF and produced nothing. The `> log 2>&1` redirect hid that it was waiting (no visible prompt), and `exit 0` made it look successful to the files-as-truth check only because we DID verify file existence (0 files) rather than trusting the exit code — which is the one thing that caught it.

**How to recognize it next time.** Symptoms: `codex exec` exits 0 but the contracted output directory is empty, and the stdout log's last line is `Reading additional input from stdin...`. Any time a `codex exec` produces no files despite exit 0, suspect the prompt never reached the model. The codex skill's "files-as-truth completion signal" rule is what surfaces this — never trust exit code alone.

**Corrected approach.** Inline the prompt as a literal argument and close stdin explicitly:
`timeout 600 codex exec --sandbox workspace-write --cd <worktree> "$(cat <promptfile>)" < /dev/null > log 2>&1`
The `"$(cat file)"` guarantees codex receives the prompt as its argument (no `@`-resolution / stdin fallback), and `< /dev/null` guarantees it cannot block waiting for stdin. Always run the files-as-truth check (file existence + content grep) after; on 0 files, re-run with this robust form rather than proceeding. Consider folding this into the [[codex]] skill's invocation-patterns section as the preferred non-interactive form.
