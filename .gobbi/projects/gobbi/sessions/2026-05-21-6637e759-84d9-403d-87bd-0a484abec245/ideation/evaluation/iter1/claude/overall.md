# Ideation iter1 — Overall (Stage 3) (claude)

## Cross-perspective verdicts

| Perspective | Verdict | Driver |
|---|---|---|
| Project | REVISE | F-P-01 (CLAUDE.md links break) High/100 |
| Structure | REVISE | F-S-01 (Stage D↔E commit boundary ambiguity) High/75 |
| Performance | PASS | trivial perf surface |
| Aesthetics | PASS | minor polish only |
| Usage | REVISE | F-U-01 (Stage E LAST bullet ambiguous) High/75 |
| Consistency | PASS | 3 Medium/100 findings but no High |
| Risk | REVISE | F-R-02 (mistake files deleted) High/100 |

## Cross-perspective tensions

1. **Structure + Usage + Risk converge on Stage D ↔ E ambiguity** (F-S-01 + F-U-01 + F-R-03). The same physical issue surfaces from three lenses — strong signal the artifact has a real spec gap, not three coincidental observations. The pattern matches `executor-rationalized-failing-verification-gate.md` (just promoted today): ambiguous gate invites rationalization.

2. **Project + Risk converge on "what survives, really?"**. F-P-01 (`.claude/CLAUDE.md` links into placeholder `design/`) and F-R-02 (mistake files deleted from `mistakes/`) are the same root: Q-A's survivor set was scoped by the user to preserve *symlink validity* (`agents/`+`skills/`+`rules/`) but the broader "what content is cited by survivors" question wasn't asked. The artifact treats Q-A's three-dir survivor list as complete; in fact, *content cited by survivor files* is a derived survivor set that includes parts of `design/` (cited by CLAUDE.md) and arguably `mistakes/` (cited by this Ideation's Memory reads).

3. **Consistency F-C-01/F-C-02 vs Structure F-S-01** all sit at the same abstraction layer: the artifact specifies commit-vs-FS-operation labels without making the boundaries explicit. This is one bug in three dresses.

## Cross-cutting findings (no single perspective owns)

### F-OV-01 — The artifact assumes the leader's session staging is preserved through Wrap-up

- **Type**: `assumption_risk`
- **Domain**: `process`
- **Disposition**: open
- **Confidence**: 75
- **Severity**: High
- **Evidence**: The staged backlog at `staging/backlogs/project/cli-regenerates-gobbi-gitignore.md` (artifact line 386) is staged for Wrap-up promotion. The artifact's Q-A keeps the current session dir intact, so the staged file survives Stage C's placeholder reset. But the WRAP-UP promotion target is `.gobbi/projects/gobbi/backlogs/` — which Q-A places in the **PLACEHOLDER** list. After Wrap-up runs `gobbi backlog promote` (or equivalent), the backlog lands in `.gobbi/projects/gobbi/backlogs/<slug>.md` which is *deleted* in Stage C and replaced by an empty dir + README. So either (a) Wrap-up runs BEFORE the sweep — but then the backlog lives in the very `backlogs/` dir the sweep wipes — or (b) Wrap-up runs AFTER the sweep — but the sweep's PR has already been merged and the backlog wasn't included.
- **Why it matters**: The CLI-regenerator follow-up risk (D8) is the artifact's only explicit deferred-to-next-session risk. Losing it makes the next session unaware of the regenerator fragility.
- **Suggested direction**: clarify in the artifact: (a) Wrap-up promotion targets must be in the survivor set if the backlog is to survive, OR (b) the Wrap-up promotion is skipped this session and the backlog stays in the session's staging dir (which is in the survivor set), and the rebuild session reads from session staging directly.

## Karpathy four failure modes

| Mode | Present? | Evidence |
|---|---|---|
| **Wrong assumptions** | YES | F-R-02 (mistakes survive Q-A) + F-OV-01 (Wrap-up staging promotion targets survive) + F-P-01 (CLAUDE.md links survive). The artifact's survivor set was scoped by symlink-target safety, not by inbound-citation safety. |
| **Overcomplexity** | NO | Sweep is a destructive cleanup; minimal abstraction; no innovation tokens spent. |
| **Orthogonal edits** | PARTIAL — see F-OV-02 below |
| **Imperative-over-declarative** | NO | The artifact specifies *what* must hold post-sweep (Success Criteria, D2) and *which* operations to run (Implementation Checklist) — that's the right shape for a destructive sweep where the mechanism IS the contract. |

### F-OV-02 — Orthogonal edits: 7 user items, ~15 sub-decisions, one PR — is this really one Ideation?

- **Type**: `assumption_risk`
- **Domain**: `process`
- **Disposition**: open
- **Confidence**: 50
- **Severity**: Medium
- **Evidence**: The sweep bundles: (1) wipe code, (2) wipe most project memory, (3) wipe adversarial-review, (4) wipe worktrees, (5) wipe codex/agents support, (6) un-ignore sessions, (7) wipe root manifests. Items (1)+(7) are about runtime; (2)+(3) are about project memory; (4)+(8 = branches) are about git refs; (5) is about claude/codex multi-system; (6) is about gitignore policy. These DO share the umbrella "pre-rebuild reset," but a more decomposed shape would be one PR per axis (code / memory / git-refs / multi-system / gitignore). The user explicitly chose single-PR via Q3 (atomic sweep), so this is locked — but Karpathy's "orthogonal edits" anti-pattern is precisely "bundling unrelated changes into one diff for ease of review."
- **Why it matters**: per Q3 user lock, this is the user's call — record as `disputed`/`addressed` once the user re-confirms.
- **Suggested direction**: surface as a "user has locked Q3 single-PR, evaluator notes the orthogonal-edits signal but defers to lock."

## Preserve list (must not be broken by REVISE)

1. **Q-F pre-reset tag + push to origin BEFORE sweep**: best-in-class reversibility design.
2. **Branch ancestry verification (I2)** matches `git merge-base --is-ancestor` exactly — preserve the `-d` vs `-D` per-branch flag.
3. **Q-B mitigation: bare-UUID delete is LAST in Stage E** is the right ordering — preserve, but tighten the gate semantics per F-S-01 / F-U-01.
4. **The 5 critical-ordering invariants (artifact lines 271–275)**: keep them; refine wording per F-S-01.
5. **Memory reads register and Decisions Log traceability**.
6. **Mixed `git rm` vs `rm -rf` discipline per item**.
7. **Out-of-Scope enumeration (lines 47–54)** is explicit and sharp.
8. **15 locked decisions enumerated in two tables (top + bottom)** — preserve.
9. **External research skip reason** is explicitly logged.

## Overall verdict

**REVISE**.

Drivers:
- F-P-01 (CLAUDE.md links break) — High/100 — definite, evidence quoted; needs a Q-H + CLAUDE.md edit OR `design/v050-{overview,cli}.md` to enter survivor set.
- F-S-01 / F-U-01 (Stage D↔E ambiguity) — High/75 — load-bearing spec gap that invites the `executor-rationalized` anti-pattern.
- F-R-02 (mistake files in delete set) — High/100 — Iron Law 10 witness deletion; user re-confirmation needed.
- F-OV-01 (Wrap-up promotion target in delete set) — High/75 — orthogonal to F-R-02, same root cause.

No Critical findings rise to FAIL threshold (Critical≥75). The artifact is structurally sound and dense; iter2 can address the four High findings with surgical edits + 1–2 user questions (Q-H: re-scope survivor set OR accept the breakage; Q-I: confirm mistake-file deletion is intentional).

Recommended next-iter focus:
1. Edit Scope Contract survivor list per user's answer to Q-H/Q-I.
2. Re-state Stage D↔E with explicit "what enters the commit" vs "what is FS-only" + a concrete gate for the bare-UUID LAST delete (e.g., "after `git commit -m '...'` returns SHA X, recorded as `<key>: <sha>` in this session's session.json").
3. Add CLAUDE.md edit task (or out-of-scope acknowledgement with rebuild-session promise) per F-P-01.
4. Tighten `worktrees/` cleanup to `find -mindepth 1 -type d -empty -delete` per F-S-02.
5. Add post-merge sweep-branch deletion per F-C-02.
