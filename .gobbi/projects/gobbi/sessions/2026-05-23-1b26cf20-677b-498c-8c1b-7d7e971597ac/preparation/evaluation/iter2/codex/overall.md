## Artifact Summary + Memory reads

What: Overall synthesizes the Codex Preparation iter2 evaluation across Project, Structure, Performance, Aesthetics, Usage, Consistency, and Risk. Why: the manager needs one Codex-side verdict before reconciling against the Claude-side evaluator. How: iter2 successfully applies the five requested fixes, but a narrower symlink edit-surface hazard remains because the corrected policy overstates "editing either path" without a symlink-preservation guard. Scope: T1/T3 Preparation readiness; T2 and broader Memory Access Matrix cleanup remain out of scope. Consumers: manager reconciliation, Planning, Execution, Wrap-up, and future promoted memory readers.

Memory reads: `preparation/rawdata/draft-iter2.md`; all five target staging files; `preparation/rawdata/draft-iter1.md`; `preparation/rawdata/sub-steps-a-d-iter1.md`; all iter1 Codex and Claude per-perspective files; `.gobbi/projects/gobbi/rules/stub-redirect-format.md`; all eight listed project mistakes; `.agents/skills/evaluation/SKILL.md`; `.agents/skills/preparation/evaluation.md`; `.agents/skills/orchestration/workflow/evaluation.md`. Tool verification included the required symlink count, workflow dir count and listing, staging file existence/status checks, full staging list, tracked symlink mode checks, and a temporary symlink rewrite check.

## Cross-perspective tensions

Project vs Risk: Project can pass because the false policy is corrected and scope is respected, but Risk still revises because the operational edit contract is unsafe for symlink-replacing tools.

Structure vs Usage: Structure shows the artifact understands the symlink topology, while Usage shows the next consumer still lacks a safe instruction for editing through that topology.

Aesthetics vs Consistency: The corrected narrative is readable and mostly precise, but a readable "editing either path edits the same physical file" statement is too broad when tested against rewrite-by-rename tools.

Performance vs Risk: The remaining issue is narrower than iter1 and only Medium from a cost lens, but it is High from a write-safety lens because a broken symlink can create real drift.

## Cross-cutting findings

ID: COD-OVERALL-PREP2-001
Type: assumption_risk
Domain: task-briefing
Disposition: open
Confidence: 100
Severity: High
Evidence: The corrected mirror policy and D-4 design file recommend workspace-path citations and state that editing either path edits the same physical file. This is not true for all plausible edit methods. Repository evidence shows workspace skill paths are tracked symlinks and mirror paths are regular files; a temporary `sed -i` verification replaced a symlink with a regular file while leaving the target unchanged. Planning needs one more surgical clarification: use a symlink-preserving edit method or edit the canonical mirror path for bulk rewrites, and verify workspace symlinks remain symlinks.
surfaced-by: codex

## Karpathy 4 failure modes

Wrong assumptions: Present in narrower form. The old wrong assumption ("workspace canonical, mirror auto-syncs") is fixed. The remaining wrong assumption is that "editing either path" is universally equivalent, when symlink-replacing write tools can break the equivalence.

Overcomplexity: Not present. The corrected mirror decision, moot backlog closure, and D-4 excluded-files section are simple and scoped. The needed revision is a small edit-method guard, not a new mechanism.

Orthogonal edits: Mostly absent. Iter2 stays within the five surgical fixes and explicitly leaves Memory Access Matrix cleanup out of scope. The symlink edit guard is not orthogonal because it directly protects the corrected mirror policy from being misapplied.

Imperative-over-declarative: Mildly present. The artifact declares the desired topology well, but it skips the operational invariant that makes the declaration safe: workspace symlinks must remain symlinks after edits.

## Preserve list

Preserve the accepted mirror-canonical symlink policy and the 53-symlink empirical evidence.

Preserve the superseded old mirror decision with its `## Supersession reason`.

Preserve the sync backlog as `status: superseded` with `## Moot reason`; no new sync mechanism should be planned.

Preserve the D-4 five loop-doc list and the excluded-files rationale for `evaluation.md` and `memorization.md`.

Preserve D-3's requirement that T1 task briefs cite the three specific mistakes.

Preserve the conclusion that no RE-IDEATE trigger exists for T1/T3.

## Overall typed findings

ID: COD-OVERALL-PREP2-001
Type: assumption_risk
Domain: task-briefing
Disposition: open
Confidence: 100
Severity: High
Evidence: Same as Cross-cutting findings. The artifact needs a symlink-preservation edit contract before Planning uses the corrected mirror policy in T1 task briefs.
surfaced-by: codex

## Iter1 Overall finding dispositions

ID: COD-OVERALL-PREP1-001
disposition: addressed
evidence: The false mirror policy is superseded and replaced by an accepted mirror-canonical symlink decision.

ID: COD-OVERALL-PREP1-002
disposition: superseded
evidence: Planning no longer copies the false mirror model, but may still copy an unsafe "editing either path" model; superseded by COD-OVERALL-PREP2-001.

ID: COD-OVERALL-PREP1-003
disposition: addressed
evidence: The old empirical-evidence wording is no longer live; iter2 states the earlier scan was incomplete and records the corrected symlink evidence.

ID: COD-OVERALL-PREP1-004
disposition: addressed
evidence: Symlink-topology checks were added and used; they now reveal a narrower edit-surface guard, not the old frame gap.

VERDICT: REVISE
