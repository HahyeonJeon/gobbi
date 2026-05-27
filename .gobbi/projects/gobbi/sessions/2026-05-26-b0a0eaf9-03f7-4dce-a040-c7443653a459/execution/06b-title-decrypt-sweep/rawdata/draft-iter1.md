# T6b title-decrypt sweep — iter1 rawdata

## Scope

18 files across `features/agents`, `features/git-workflow`, `features/install-runtime`.
Only heading lines (`#`/`##`/`###`) touched. Zero frontmatter or body prose changes.

## Before → After (selected examples)

| File | Old heading | New heading |
|------|-------------|-------------|
| `decisions/session-start-hook-script-decisions.md` | `# T1 Decisions Log` | `# SessionStart hook script decisions and evaluation outcome` |
| `decisions/session-start-hook-script-decisions.md` | `## Dual-system EVAL iter1` | `## Dual-system evaluation (iteration 1)` |
| `changelogs/2026-05-25-gobbi-hook-authoring-skill-shipped.md` | `# T04 — gobbi-hook-authoring project skill shipped` | `# gobbi-hook-authoring project skill shipped` |
| `discussions/hook-plus-reconstructor-mechanism.md` | `# T3 mechanism — PostToolUse hook + shell-script reconstructor selected` | `# PostToolUse hook + shell-script reconstructor selected for agents[] population` |
| `discussions/scope-contract-lock.md` | `# T3 schema gap check — existing agents[] fields sufficient; no template bump this session` | `# Session template agents[] schema sufficient; no template bump needed` |
| `design/direct-mode-retained-opt-out.md` | `# D-5 — Direct mode preserved as documented opt-out` | `# Direct mode preserved as documented opt-out (D-5)` |
| `design/dual-hook-registration-resolver.md` | `# D-3-3 — Hook scope: PostToolUse + PostToolUseFailure dual registration; session-dir resolver` | `# Hook scope: PostToolUse + PostToolUseFailure dual registration with session-dir resolver (D-3-3)` |
| `checklists/d-ref-codes-missing-inline-expansion.md` | `# D-3-3/D-4/D-5/D-9 reference codes lack inline expansion for executors` | `# Opaque decision reference codes lack inline expansion in executor briefs (D-3-3/D-4/D-5/D-9)` |
| `discussions/scope-literal-ask-vs-broader-verifier.md` | `# T2 scope — literal-ask (matrix + validator) vs broader delegation contract verifier` | `# Validator scope: literal-ask (skill-loading matrix + validator) vs broader delegation contract verifier` |

## Traceability approach

- For git-workflow and install-runtime design files: design codes (D-1, D-2, D-3, D-3-1 … D-3-6, D-4, D-5) moved to parenthetical-after-concept in the H1 title.
- For install-runtime discussions: T3 prefix stripped; subject phrase retained and expanded; no parenthetical needed (T3 is a session task code, not a cross-reference design ID).
- For T04 changelog: "T04 —" prefix stripped; the subject phrase already names the deliverable.
- For T1 decisions: H1 rewritten to name subject; H2 `Dual-system EVAL iter1` rewritten as `Dual-system evaluation (iteration 1)`.

## Verification outputs

### Gate 1 — no cryptic-led headings remain
```
(empty — zero files returned)
```

### Gate 2 — only in-scope files changed
```
18 files: all within the contracted set
```

### Gate 3 — only heading lines changed
```
19 line-pairs, all starting with # (heading lines only)
```

## Commit

SHA: 6ba07a1
Subject: chore(docs): title-sweep — concept-first headings in 18 conformed docs
Files changed: 18 files, 19 insertions, 19 deletions

## Notes / observations (out-of-scope)

- The `flock-serialization-on-session-json.md` body contains `# ... read, modify, write session.json atomically ...` — this is a comment INSIDE a bash code block, not a markdown heading. Left untouched (correct).
- The `session-start-hook-script-decisions.md` H2 `## Below-threshold findings (filed for awareness, no further action)` and `## Commits` / `## Outcome` are descriptive and not cryptic — left as-is.
- The `d-ref-codes-missing-inline-expansion.md` checklist retains the D-codes in parenthetical at the end of the title for traceability, since the specific codes ARE the subject (they name which codes have the gap).
