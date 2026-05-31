# Project Perspective

## Finding P1

Type: design_flaw
Severity: High
Confidence: 100
Evidence: `scripts/validate-plugin-hooks-fire-once.sh:59-62` documents:
`claude plugin marketplace add \`
`  --url "https://github.com/HahyeonJeon/gobbi" \`
`  --branch "chore/session-2026-05-30-0fd65721"`.
Fresh CLI check from the worktree:
`claude plugin marketplace add --url https://example.com --branch test` -> `error: unknown option '--url'`, `exit=1`.
Fresh help output for the same CLI says: `Usage: claude plugin marketplace add [options] <source>` with options `--scope` and `--sparse`; it does not expose `--url` or `--branch`.
Why-it-matters: T5 is correctly operator-assisted, but the authored operator procedure is still part of the build. As written, the procedure fails before marketplace install, so the fire-once and installed-cache validation path cannot be run by the operator.
Suggested-direction: Replace the marketplace-add procedure with the current supported `claude plugin marketplace add <source>` syntax, including whatever branch/sparse mechanism this CLI actually supports, then re-run a no-mutation CLI-shape check plus `bash -n`.
