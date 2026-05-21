# Ideation iter1 — Project perspective (claude)

## Artifact Summary + Memory reads

**What**: A 408-line Ideation rawdata draft describing a 7-item destructive cleanup of the gobbi repo before bottom-up rebuild. Encodes 15 user-locked decisions (Q1–Q8 + Q-A–Q-G), seven layered sections (Scope Contract, Framed Problem, Research Insights, Scenarios, Implementation Checklist Stages 0–G, Design, Decisions Log), one staged backlog (`cli-regenerates-gobbi-gitignore.md`).

**Why**: Cumulative drift from ~26 v0.5.0 sessions; the rebuild cannot anchor on incoherent prior state. Trigger is the user's verbatim 7-item request (discussion-log lines 5–17). Success criteria are 11 enumerated, observable post-conditions in the Scope Contract plus 15 verification commands in Design D2.

**How**: Single worktree-PR sweep off `develop`; ordered stages 0/A–G; pre-sweep lightweight tag `pre-reset-2026-05-21` at `487fc35`; survivor set inside `.gobbi/projects/gobbi/` = `agents/`+`skills/`+`rules/`+`sessions/<current>`+`worktrees/`+`settings.json`; 13 dirs reduced to one-line stub READMEs; mixed `git rm` (tracked) vs `rm -rf` (untracked) per item.

**Memory reads**
- `.gobbi/projects/gobbi/rules/stub-redirect-format.md` — confirms placeholder stubs differ from supersession stubs (no banner needed; artifact correctly notes this at line 234)
- `.gobbi/projects/gobbi/mistakes/{executor-rationalized-failing-verification-gate,session-dir-naming-convention-uses-date-prefix,manager-mispec-grep-c-for-occurrence-count}.md`
- `.gobbi/projects/gobbi/sessions/2026-05-21-6637e759-.../ideation/rawdata/{draft-iter1.md,discussion-log.md}`
- `.gobbi/projects/gobbi/sessions/2026-05-21-6637e759-.../ideation/staging/backlogs/project/cli-regenerates-gobbi-gitignore.md`
- Fresh repo state: `git status --short`, `git worktree list`, `git branch -a`, `git merge-base --is-ancestor` for all 4 branches, `ls .gobbi/projects/gobbi/`, `ls .gobbi/projects/gobbi/sessions/`, `cat .gitignore`, `cat .gobbi/.gitignore`, `git ls-files .codex/`, `git rev-parse develop`, `git tag --list pre-reset*`

## Locked Frame (Stage 1)

Seed scenarios from `ideation/evaluation.md` § Project carried through plus the following Create/Update gaps:

- **scenario_gap S-PROJ-NEW-1**: "Inventory completeness — every file/dir under root + `.gobbi/projects/gobbi/` + `.claude/project/` is accounted for, with explicit fate (delete / keep-content / placeholder / out-of-scope)." Required by Iron Law 4 (scope is a contract). Adversarial.
- **scenario_gap S-PROJ-NEW-2**: "Cross-reference from surviving content (`.claude/CLAUDE.md`, `.gobbi/projects/gobbi/skills/`+`agents/`+`rules/`) into about-to-be-placeholdered dirs is inventoried; broken links are accepted explicitly or fixed." Required because Q-A protects content but does not guarantee link validity.
- **scenario_gap S-PROJ-NEW-3** (adversarial): "The second date-prefixed session dir `2026-05-21-c676684d-...` is in the delete set (not just `sess-final` + 51 bare-UUID + `99999999-aaaa-...` + the current's bare-UUID twin)."

Adversarial coverage: covered via S11 (mid-execution mind-change) + S12 (CLI regenerator) + steel-man "archive via tag" + S-PROJ-NEW-3. Cross-cutting matrix items mostly `not-applicable:` (no UI/i18n/PII/license/cost surface added by a destructive delete) except `cost`: `not-applicable: 66M node_modules + 7.4M packages + ~785M worktrees deletion reclaims disk; no recurring cost surface added`.

## Per-scenario per-check results

| Seed/derived scenario | Check | Result | Evidence |
|---|---|---|---|
| Root cause is actual root cause | "Why?" terminates at obviator | YES | Framed Problem § Root cause: cumulative drift across ~26 sessions; if absent the rebuild has no debt. Defensible. |
| Scope Contract sharp enough to refuse OOS tasks | Explicit Project/Feature/Task; no "etc."/"and related" | YES | `feature: repo-reset` frontmatter + In-Scope enumerates 11 buckets; Out-of-Scope enumerates 6 explicit exclusions |
| "Why now" concrete | Specific trigger named | YES | User's verbatim ask (discussion-log L5) + pre-rebuild blocker framing |
| Counterfactual steel-manned | Strongest "do nothing" arg | YES (partial — see F-P-02) | Counterfactual: "Archive via tag, defer destructive sweep" — actually addressed by Q-F as inclusion not rejection; this is a "do less" not a "do nothing", so the *purest* "no reset, live with debt" counterfactual is not articulated |
| Re-framing check recorded | Outcome + reasoning | YES | Re-framing rejects 2 adjacent framings with reason |
| Adjacent feature absorbs idea | Search `features/` for overlap | YES | Untracked `features/{gobbi-install,orchestration-docs}/` exist (git status); artifact treats them as evaporating under placeholder reset of `features/` — confirmed in I8 |
| Assumption ledger | Risky premises explicit | PARTIAL | "Last workflow against this layout, any subsequent gobbi command can re-bootstrap" (D9) is a load-bearing assumption about CLI behavior — not in a dedicated ledger but called out in D9 |
| Hypothesis/testability | Observable success/failure signals | YES | 11 Scope Contract criteria + 15 D2 commands |
| Prior-art search real | Codebase+memory grep, top-3 closest | PARTIAL | Memory entries cited (env-prep, redesign-version-naming, mirror-sync); no external prior-art (delete-and-rebuild patterns from other repos) — but the artifact explicitly justifies skipping external (Decisions Log line 380) and external isn't material here |
| **S-PROJ-NEW-1 inventory completeness** | Every root-level file/dir fate-tagged | **NO** — see F-P-01 |
| **S-PROJ-NEW-2 cross-ref validity** | Surviving content's refs to placeholder dirs surveyed | **NO** — see F-P-02 |
| **S-PROJ-NEW-3 c676684d twin in delete set** | Second date-prefixed dir explicitly named in delete | NO (implicitly covered by find predicate, but the artifact's I5 doesn't mention it; the Scope Contract talks about "53 sibling session dirs" without naming this twin) — see F-P-03 |

## Typed findings

### F-P-01 — `.claude/CLAUDE.md` table rows 61–62 will become dangling links after placeholder reset

- **Type**: `design_flaw`
- **Domain**: `docs-sync`
- **Disposition**: open
- **Confidence**: 100
- **Severity**: High
- **Evidence**: `.claude/CLAUDE.md` lines 61–62 (verified with `grep -n "\.gobbi/projects/gobbi/" .claude/CLAUDE.md`):
  - `| [`v050-overview.md`](../../../.gobbi/projects/gobbi/design/v050-overview.md) | ... |`
  - `| [`v050-cli.md`](../../../.gobbi/projects/gobbi/design/v050-cli.md) | ... |`
  - Q-A places `design/` in the PLACEHOLDER list (artifact lines 31, 71). After the sweep, `.gobbi/projects/gobbi/design/v050-overview.md` and `.gobbi/projects/gobbi/design/v050-cli.md` will not exist (only `design/README.md` will).
  - `.claude/CLAUDE.md` is NOT in the artifact's modification list (Out-of-Scope line 49: "Touching `.claude/CLAUDE.md`...").
- **Why it matters**: CLAUDE.md is loaded at every session start, resume, `/clear`, and `/compact` per the document itself (line 7). After the sweep, two of its three "Navigate deeper from here" pointers break, with no replacement. The user reads broken links on the very first session post-sweep. Iron Law 8 ("every implementation change reflected in documentation") is violated by omission: the sweep changes the existence of two named files that CLAUDE.md links to without updating CLAUDE.md.
- **Suggested direction**: either (a) re-scope to include a CLAUDE.md edit removing the 2 broken table rows before the sweep, (b) move `v050-overview.md` + `v050-cli.md` into the survivor set (which contradicts Q-A's design-as-placeholder lock — needs a Q-H from the user), or (c) accept the breakage with an explicit Scope Contract acknowledgement that the next rebuild session must repair CLAUDE.md as its first action. The artifact currently does none of these.

### F-P-02 — Steel-man is a "do less" not a true "do nothing", so the genuinely strongest counterfactual is not addressed

- **Type**: `design_flaw`
- **Domain**: `process`
- **Disposition**: open
- **Confidence**: 75
- **Severity**: Medium
- **Evidence**: Framed Problem § Counterfactual / steel-man (artifact lines 122–124): the "strongest argument against destructive single-PR reset" is articulated as *"Archive the prior state via a tag before deletion"* — but that's a refinement OF the sweep, not an argument against it. Q-F adopts the tag, so the "steel-man" is effectively a sub-clause of the work, not a counterfactual. The genuinely strongest counterfactual would be *"do not reset at all; the rebuild can branch from a new `redesign/clean` root and treat the existing state as historical; cost of inaction is reading 80 files of half-superseded history which is annoying but not blocking."* That argument is not articulated.
- **Why it matters**: Per `principles` Principle 1 (think before acting) and the Project perspective seed anti-pattern "Counterfactual that the creator already won", a steel-man that the artifact has already absorbed is not a steel-man — it's a feature. The real adversarial framing (live with the debt) is unexamined.
- **Suggested direction**: in iter2, articulate the no-reset counterfactual and either reject it with concrete evidence (e.g., "the next leader's first read costs ~N minutes parsing dead history") or surface it to the user as a Q-H decision.

### F-P-03 — Second date-prefixed session dir `2026-05-21-c676684d-...` is not named anywhere in the artifact

- **Type**: `general`
- **Domain**: `process`
- **Disposition**: open
- **Confidence**: 100
- **Severity**: Medium
- **Evidence**: `ls .gobbi/projects/gobbi/sessions/ | grep '^2026-'` returns TWO entries: the current `2026-05-21-6637e759-...` and `2026-05-21-c676684d-...`. The latter is the prior session that promoted all three of today's mistake files (cited in the artifact's Memory reads register, lines 357–358; promoted_at: 2026-05-21, session_id: c676684d-...). The artifact's I4 + Q-B discuss only the bare-UUID twin of the *current* session; the prior date-prefixed session is never named. The Stage E find predicate (line 250) excludes only `2026-05-21-6637e759-...` and `6637e759-...`, so `2026-05-21-c676684d-...` IS deleted — consistent with Q8 — but the artifact's discussion does not surface that this is a sibling DATE-PREFIXED session being deleted, which deserves explicit user awareness because it contains the original (pre-promotion) staging for today's three mistake files. If a future rollback wants to recover those, they're in this dir.
- **Why it matters**: Per `executor-rationalized-failing-verification-gate.md`, the prior session's `c676684d-...` ID is anchor-tagged in three project-level mistake files (frontmatter `session_id:` field). Post-sweep, those frontmatter anchors will reference a deleted session. Not a blocker — mistakes themselves survive as project memory — but the artifact should acknowledge this. Iron Law 6 (refuse vagueness): "53 sibling session dirs" elides the fact that one of them is structurally distinct (date-prefixed promotion source).
- **Suggested direction**: add a one-line note in I5 or Q-B that the second date-prefixed dir is the promotion source for today's three mistakes; confirm with user that deleting it is acceptable (Q8 implies yes, but it should be explicit). No new question needed if user wants to skip — record the acknowledgement.

## Low-confidence appendix

- (25) — possible: "external research skip reason logged" satisfies Ideation skill's external-research-skip rule but the rule isn't cited verbatim in the artifact. Cannot verify without loading the ideation skill's text; not load-bearing.

## Must-preserve list

- The 15-decision enumeration in Scope Contract → Decisions Locked is excellent — sharper than typical Ideation drafts in this project.
- Q-B mitigation sequencing (bare-UUID delete LAST in Stage E) is correct and well-motivated by I4.
- Branch ancestry verification (I2) matches `git merge-base --is-ancestor` ground truth exactly.
- Mixed `git rm` vs `rm -rf` discipline in Stage B is correct (verified `.codex/` is tracked via `git ls-files .codex/`).

## Verdict

REVISE — F-P-01 is High/100, triggering the High≥50 → REVISE threshold.
