# Structure — iter1 Claude

## Stage 0 — Artifact Summary
See `project.md` § Stage 0 (shared across perspectives this iter). W/W/H gate PASS; Scope Contract embedded in frontmatter; downstream consumer = Planning.

### Memory reads — see `project.md` (shared).

## Stage 1 — Locked Frame

### Scenarios (Structure)

**S-S-1: Proposed components / modules / layers cohere** (seed)
- [a] Coupling is unidirectional in the proposed decomposition
- [b] Each component's owning concern is named

**S-S-2: Skeptical reader can map every checklist item to a structural element** (seed)
- [a] Directional design decisions name library / framework / pattern / API shape explicitly
- [b] Each design decision anchored to a research insight

**S-S-3: Boring-by-default holds** (seed)
- [a] Alternatives considered are documented (or "no alternatives" explicitly justified)
- [b] Novel structural choices spend an explicit innovation token

**S-S-4: Two-week smell test** (seed)
- [a] No "magic" components — every element matches existing project pattern or deviation is justified
- [b] Glossary / definitions exist for non-obvious terms

**S-S-5: Testability is first-class** (seed)
- [a] Testability hooks identified — what gets stubbed / faked / observed
- [b] For each major component, a verification approach is named

**S-S-6: Decomposition silently introduces circular dep or shared-state hub** (seed, adversarial)
- [a] Cross-module data flow direction traced + acyclic
- [b] No "manager" / "coordinator" that touches every component

**S-S-7: Bundle decomposition — T1 and T3 are genuinely separable not a Karpathy "orthogonal edits" anti-pattern** (NEW, adversarial)
- [a] T1's success criteria can be met without T3
- [b] T3's success criteria can be met without T1
- [c] If bundled, the rationale for bundling is documented (not just convenience)

**S-S-8: Each shell-script "component" has a single owning responsibility** (NEW, T3-specific)
- [a] Hook script and reconstructor share no implicit state
- [b] No script does both real-time write + repair (those are distinct lifecycles)

## Stage 2 — Findings

### S-S-1 results
- [a] PASS — Cross-module data flow: T3 hook only writes `session.json`; reconstructor only reads transcript + writes `session.json`. Acyclic; no shared mutable state at runtime (the script writes atomically via temp-file + mv per D-3-2 / draft G-2 step 6).
- [b] PASS — Hook owns "real-time append on every Task completion"; reconstructor owns "verify + fix idempotently"; `delegation/SKILL.md` owns "structured header convention." Concerns named.

### S-S-2 results
- [a] PASS — D-3-1 names "bash + jq" stack; D-3-2 names "verify-and-fix upsert" algorithm; D-3-4 names regex `^Your (phase|iteration|sub-step|step): (.+)$`; D-1 names "row 5.5"; D-3 names `git -C "$worktreePath"` form.
- [b] PASS — every D-N has *Anchored insights.* citing T-I-N / T-E-N / T-DQ-N. Verified for D-1 through D-5 and D-3-1 through D-3-4.

### S-S-3 results
- [a] PASS — D-1 trade-off: "Promote worktree-creation to row 5 — rejected (changes more than necessary)." D-3-2 trade-offs: scan-and-replace rejected (deletes manager seed); append-only rejected (cannot fix partial-fields). D-3-3 trade-offs: PostToolUse-only rejected (loses audit); two scripts rejected (DRY).
- [b] PASS — No novel structural pattern introduced. Hook+reconstructor cloned from `session-start.sh` precedent (T3-I-4); worktree-first is the runtime-recommended path per T1-E-1; per-iteration session-memory commits match `T1-E-2 rule 3`. No innovation token spent inappropriately.

### S-S-4 results
- [a] PASS — Every component matches an existing pattern: bash+jq (session-start.sh), regex-on-prompt (commitlint precedent in T2-E-2 if/when T2 ships, but T2 deferred), session-dir resolver mimics `$cwd/.gobbi/...` convention.
- [b] PASS — Internal terms (`structured header`, `upsert-by-id`, `synthetic id`) are defined in the section where they appear.

### S-S-5 results
- [a] PASS — D-3-1 validation names "single-script verifier on fixture transcript"; D-3-2 names "2-state fixture (empty + partial); idempotency double-run"; D-3-4 names "fixture prompt with all four headers."
- [b] PASS — Each D-N has a *Validation method* row (5 for T1, 4 for T3, consolidated in § Validation strategy tables).

### S-S-6 results
- [a] PASS — T1's row 5.5 creates state that row 6 consumes (one-direction); D-2's qualified rule pushes state into `session.json` which is the manager-owned source (no callback into git skill). T3 hook reads transcript + writes session.json; no back-pressure.
- [b] PASS — No "manager" object collecting all hook outputs centrally; the hook writes directly to session.json keyed by `id`.

### S-S-7 results (NEW adversarial — Karpathy orthogonal edits)
- [a] PASS — T1's success criteria (`worktreePath` non-null; PR diff contains symlinks; session memory survives PR squash) do not require T3. T1 could ship alone.
- [b] PARTIAL — T3's success criteria mostly don't require T1 EXCEPT D-3-3 session-dir resolver assumes `$cwd/.gobbi/...` resolves correctly. Under direct mode this works; under T1 worktree-first it works (cwd = worktree, session dir is in worktree). But the *correctness of that path* depends on T1's "session dir lives in worktree" lock — if session dir lived in main tree under direct mode + worktree-first conflict, the resolver would fail. The draft acknowledges this dependency (E-4 scenario at line 220, Cross-task observation 1 at line 303). So T3 is *technically separable but practically coupled* to T1 — this is documented but the bundling rationale is "they share a constraint about session-foundation infrastructure that fails silently" which is thematic, not technical. Bundling rationale = acceptable per Sub-step B user lock.
- [c] PASS — Bundling rationale documented at draft line 71 ("session-foundation infrastructure that fails silently and degrades audit fidelity"); user-locked at Sub-step B.

### S-S-8 results (NEW T3-specific)
- [a] PASS — Hook and reconstructor share *jq snippets* (D-3-2: "Shares the field-extraction `jq` snippets with the hook (Design Decision D-3-2 specifies shared library — keep them inline for simplicity in iter1, factor to a sourced helper only if iter2 evaluation demands)"). The "shared inline" decision is risky — divergent edits could create silent skew. **This is a latent Structure concern: two independently-edited copies of the same extraction logic.**
- [b] PASS — Hook writes real-time; reconstructor writes repair-time; they share the upsert semantics (by-id) but apply at different lifecycle points.

### Typed findings

```yaml
finding-id: S1-iter1
type: design_flaw
domain: process
disposition: open
confidence: 75
severity: Medium
surfaced-by: claude
```
**S1 — Hook + reconstructor share inline `jq` extraction snippets without a sourced helper; drift risk is acknowledged but not addressed.** D-3-2 implementation note (draft line 240) states: "Shares the field-extraction `jq` snippets with the hook ... keep them inline for simplicity in iter1, factor to a sourced helper only if iter2 evaluation demands." This punts the DRY concern to a future evaluation cycle, but the failure mode is exactly the kind that wouldn't surface until a schema-drift mitigation lands in one but not both scripts. Evidence: draft line 240. Suggested direction: surface as `assumption_risk` and force the decision now — either factor the extraction into a single sourced bash function file (`.claude/scripts/lib/extract-agent-fields.sh`), or document the divergence-prevention discipline (e.g., a test that diffs `grep`-extracted jq lines between the two files).

```yaml
finding-id: S2-iter1
type: scenario_gap
domain: process
disposition: open
confidence: 75
severity: Medium
surfaced-by: claude
```
**S2 — No scenario covers the situation where T1 ships but T3 doesn't (or vice-versa) and the partial deployment introduces a regression.** The Planning ordering recommendation (§ line 327) says T1.a–T1.d before T3.a–T3.e because of cwd semantics. But if Execution interleaves the commits and lands T3 first (hook script runs while cwd-semantics are still main-tree-only), the resolver `$cwd/.gobbi/projects/<name>/sessions/...` resolves to the main tree (which is correct for THIS session since `worktreePath` is null), so T3 actually works in legacy mode. Conversely, if T1 docs land first but the hook isn't yet installed, `agents[]` continues to be 1-row — no regression, just slower fix. So there's no actual partial-deployment regression — but no scenario states this, so the safety property is implicit. Evidence: draft § Cross-task observations 1–3 (lines 303–321). Suggested direction: add an "F-X" failure scenario or an explicit "partial deployment is safe" note explaining why interleaving is OK.

```yaml
finding-id: S3-iter1
type: checklist_gap
domain: docs-sync
disposition: open
confidence: 75
severity: Medium
surfaced-by: claude
```
**S3 — `orchestration/SKILL.md` row 5 is currently "Initialize `state.json`" (verified at line 102), but draft D-1 describes row 5 as "state.json" and inserts row 5.5 between current row 5 and current row 6. However, row 5 in the live skill is `state.json` and row 6 is `session.json` — verified. The structural edit is unambiguous BUT § Workflow Configuration table in `orchestration/SKILL.md` numbers rows 1 through 7+ (the table I read shows rows 1 through 7). Drafting "row 5.5" as a half-decimal row is unusual numbering. Existing project tables don't use decimal row numbers anywhere I verified.** Evidence: `orchestration/SKILL.md` lines 95–110 (table rows are integers). Suggested direction: confirm whether the project's convention is to renumber (5 → 5, 6 → 6, 7 → 7, with a fresh 5.5 between) or to renumber all subsequent rows by +1. The current draft language ("row 5.5") is acceptable as a placeholder but Execution should not literally write "5.5" — surface to Planning as an aesthetic/structural decision.

### Low-confidence appendix
- (none above 25)

## Verdict
**PASS** — Structure is sound. T1/T3 share a coherent decomposition, no circular dependencies, alternatives documented, validation strategies named. S1 (shared inline jq) and S2 (no partial-deploy scenario) are Medium issues that should be addressed but do not block Planning. S3 (decimal row numbering) is a docs convention question for Planning.
