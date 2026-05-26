# Codex adversarial findings - memory-redesign Wrap-up

Target: wrap-up commit `cd99877d58f528f6c65d6120d9febcd5d58c6436` + final handoff.

Verified from `.gobbi/projects/gobbi` with fresh reads. Commit scope is exactly 6 files: 2 new mistakes, `wrap-up/artifacts/handoff.md`, `backlogs/memory-redesign-remaining-waves.md`, `design/memory-system-redesign.md`, and `notes/2026-05-26-memory-redesign-waves-complete.md`. Main-tree `develop` remains `82a5137`.

## Findings

[HIGH|general|95] Handoff wave-status claim is not supported by the on-disk evaluation tree. `wrap-up/artifacts/handoff.md` says the redesign is `COMPLETE`, "All 6 waves (W0-rest through W5) shipped", "all migration work [is] live", and "No deferred redesign waves remain"; it only explicitly says PASS for W0-rest (`REVISE -> PASS`) and W5. Fresh verdict grep shows no all-wave PASS evidence: W0-rest latest Codex verdict is `REVISE`, W1 Codex is `REVISE`, W2 Claude and Codex are both `REVISE`, and W3 Codex is `REVISE`; the tree contains no later `w1/w2/w3` evaluation iteration directories and no W0-rest iter3 evaluation directory. If later commits remediated or user-deferred those findings, the handoff must preserve the exact disposition and evidence instead of flattening the session to "all waves shipped". This hits the handoff-accuracy gate because the completion/PASS story does not match the real session evaluation artifacts.

Evidence:
- `rg` in `handoff.md`: line 20 claims all 6 waves shipped/no deferred redesign waves; line 42 says W0-rest `REVISE -> PASS`; line 92 says W5 PASS.
- Verdict grep: `w0-rest/evaluation/iter2/codex/findings.md` ends `VERDICT: REVISE`; `w1/evaluation/iter1/codex/findings.md` ends `VERDICT: REVISE`; `w2/evaluation/iter1/{claude,codex}/findings.md` both end `VERDICT: REVISE`; `w3/evaluation/iter1/codex/findings.md` ends `VERDICT: REVISE`; only W5 has both systems PASS.
- Directory check: `w1`, `w2`, and `w3` have only `iter1`; `w0-rest` has only `iter1` and `iter2`.

[MEDIUM|checklist_gap|100] `mistakes/sendmessage-continued-cwd-resets-to-main-tree.md` did not preserve the staged `[[...]]` cross-links. The source staging file `execution/w1/staging/decisions/sendmessage-continued-executor-edits-main-tree.md` contains `[[executor-main-tree-edit-near-miss]]`, `[[executor-mirror-path-vs-worktree-physical-copy]]`, and `[[manager-skipped-dual-system-eval]]`. The promoted mistake has zero `[[...]]` links; the related entries were rewritten as literal `mistakes/...md` paths. This violates the explicit promoted-mistake gate that `[[ ]]` cross-links are preserved.

## Passing checks

- Both promoted mistake files exist, start with `---`, have `name/description/type/scope: project/created`, include the four body elements, and have no `mistake-candidate:`, `promoted-from:`, or `promoted-at:` frontmatter.
- `grep -rl '^mistake-candidate:' mistakes/ | wc -l` is `0`; `grep -rl -E '^(promoted-from|promoted-at):' mistakes/ | wc -l` is `0`.
- Handoff lists 4 ratified decisions, the 4 deferred backlog files, and the LOW grep note; the LOW note is accurate (`features/`/`archive/features/` contain both underscore and hyphen promoted-field spellings).
- Cross-checks passed: `features/` contains exactly 7 live capability dirs plus `README.md`; all 4 deferred backlog files exist; both new mistake files exist; all 4 retired sprint dirs exist under `archive/features/`.
- `backlogs/memory-redesign-remaining-waves.md` exists with `status: closed` and `disposition: resolved`; `design/memory-system-redesign.md` is marked `SHIPPED 2026-05-26` / `STATUS ... COMPLETE`.

VERDICT: REVISE
