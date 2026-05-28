---
loop: execution
iter: 2
artifact_type: verification-report
created_at: 2026-05-28
status: final
supersedes: []
related:
  - execution/N1-readme-nav-accuracy/artifacts/change-summary.md
  - execution/N1-readme-nav-accuracy/evaluation/iter1/claude/findings.md
  - execution/N1-readme-nav-accuracy/evaluation/iter1/codex/findings.md
---

# N1 — README Subdirectories Nav Accuracy: Verification Report

## Dual-system evaluation — iter1

### Claude — PASS

Verdict: PASS with one Low informational finding.

Finding: `[general][Low][75]` — Root README disposes of 4 non-memory surfaces (`skills/`, `agents/`, `sessions/`, `tmp/`) via a trailing prose sentence rather than as bullet entries. Treated as acceptable-as-designed under §4 memory-standard scope (READMEs index memory tiers; non-memory surfaces are explicitly out-of-scope). Not a blocker.

17 of 18 READMEs fully conforming as explicit bullet lists. §4.5 leak gate clean (zero matches). All cross-refs resolve. Scope adhered to (only README.md files touched).

### Codex — REVISE

Verdict: REVISE on 1 High finding.

Finding: `[general][High][100]` — Root README `## Subdirectories` lists only 12 bullet entries. Live `ls -d .gobbi/projects/gobbi/*/` returns 16 subdirectories (`agents archive backlogs decisions design features learnings mistakes notes plans references reviews rules sessions skills tmp`). The 4 missing entries are `agents/`, `sessions/`, `skills/`, and `tmp/`. The prose sentence at line 30 names them, but the brief requires one entry per live subdir, and the listed-entry extraction catches only the 12 bullets. Strict literal reading: defect.

### Cross-system divergence

Claude and Codex agreed on 17 of 18 READMEs (all PASS). The divergence was on the root README only: Claude treated the prose footnote as acceptable-as-designed; Codex applied the literal "one bullet per live subdir" reading of the brief.

## Manager ground-truth — iter1 divergence resolution

Manager verified Codex's literal reading is correct per the brief. The acceptance criterion was "match live set exactly" — prose footnotes do not satisfy 1:1 bullet matching. The Low finding (Claude) and High finding (Codex) both identify the same gap; Codex's severity and verdict were correct.

Decision: REVISE → fix root README to add 4 missing subdirs as bullet entries.

## iter2 fix and final verification

Commit `66bf1be` added `agents/`, `sessions/`, `skills/`, and `tmp/` as explicit bullet entries under the root README's `## Subdirectories` section, each annotated with `_(non-memory surface ...)_` notes preserving §4 scope intent.

Manager re-verified post-iter2:
- 16/16 live subdirs now listed as bullets in root README
- §4 scope intent preserved via annotations on non-memory entries
- All 18 READMEs: PASS

## Final per-README nav-accuracy table (iter2 state)

| # | README | Live subdirs | Listed entries | Final verdict |
|---|--------|:---:|:---:|---|
| 1 | `.gobbi/projects/gobbi/README.md` | 16 | 16 bullets | PASS (iter2 fix) |
| 2 | `features/README.md` | 7 | 7 | PASS |
| 3 | `features/agents/README.md` | 7 | 7 | PASS |
| 4 | `features/evaluation/README.md` | 5 | 5 | PASS |
| 5 | `features/git-workflow/README.md` | 9 | 9 | PASS (untouched) |
| 6 | `features/guardrails/README.md` | 5 | 5 | PASS (untouched) |
| 7 | `features/install-runtime/README.md` | 9 | 9 | PASS (untouched) |
| 8 | `features/project-memory/README.md` | 10 | 10 | PASS |
| 9 | `features/workflow/README.md` | 8 | 8 | PASS (untouched) |
| 10 | `backlogs/README.md` | 0 | `_None_` | PASS |
| 11 | `decisions/README.md` | 0 | `_None_` | PASS |
| 12 | `design/README.md` | 0 | `_None_` | PASS |
| 13 | `learnings/README.md` | 0 | `_None_` | PASS |
| 14 | `mistakes/README.md` | 0 | `_None_` | PASS |
| 15 | `notes/README.md` | 0 | `_None_` | PASS |
| 16 | `plans/README.md` | 0 | `_None_` | PASS |
| 17 | `references/README.md` | 0 | `_None_` | PASS |
| 18 | `reviews/README.md` | 0 | `_None_` | PASS |

## Scope and gate checks (from iter1 evaluation — carried forward)

- Scope: all changed paths are `README.md` files under `.gobbi/projects/gobbi/`. No out-of-scope files touched across both commits.
- §4.5 leak gate: zero matches — no session-only frontmatter fields leaked into README files.
- Cross-refs added in iter1 (`features/README.md`, `design/memory-system-redesign.md`) both resolve.
