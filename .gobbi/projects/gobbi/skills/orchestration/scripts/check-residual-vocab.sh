#!/usr/bin/env bash
# check-residual-vocab.sh — residual stale-vocabulary gate for the
# memorization -> {memory, record} rename (decision D18, the hardened GATE-C).
#
# Purpose:
#   The task-11 GATE-C grepped only the SWEPT forms (path refs + storage prose +
#   word-boundary CAPS MEMORIZATION). It was BLIND to the same stale vocabulary in
#   OTHER syntactic forms — skill NAMES, agent-wrapper capability descriptions, and
#   the value-feature pipeline label — which produced 5 surviving gaps (task 07b
#   G1-G5). This guard keys verification to the renamed VOCABULARY (every form),
#   not to the form the editor happened to touch.
#
#   It is the lesson of mistakes/refactor/sweep-grep-literal-loop-name-blindspot.md baked
#   into a reusable gate: grep the WHOLE vocabulary, then trust an explicit
#   allowlist of known-legitimate retentions instead of a form-specific grep.
#
# What it matches (case-insensitive, the full rename vocabulary):
#   - "memorization"          — the old skill name / sub-phase / pipeline word
#   - "session memory" / "session-memory"   — old storage-tier prose
#   - "project memory" / "project-memory"   — old storage-tier prose
#   - word-boundary CAPS "MEMORIZATION"      — the all-caps sub-phase form
#
# What it EXCLUDES (never reports):
#   1. The 21 historical EXCLUDE files — frozen records whose old vocabulary is a
#      true historical fact at write time (features/workflow/**, the 2026-06-08
#      redesign note, the persist-session backlog, the sweep-grep-literal mistake,
#      the two layer2 sweep/verify mistakes, CHANGELOG.md). Same principle as
#      memory/rules.md sec.4.6: frozen history is not re-prosed.
#   2. The D7-LEGIT retentions — live files whose "memorization" / "Memorize" use
#      is a CORRECT, intentional reference (the Wrap-up promotion STAGE, a
#      historical-filename example, and the generic Study->...->Memorize lifecycle
#      verb shared by every role doc). Each is enumerated below with its reason.
#
# What it does NOT exclude (deliberately):
#   - .claude/CLAUDE.md and .codex/AGENTS.md still carry the old 5-step framing.
#     Those are task 10's sweep surface, NOT allowlisted here: allowlisting them
#     would MASK a task-10 miss. The default full-tree scan WILL flag them until
#     task 10 sweeps them; task 11 runs this gate AFTER task 10, when they are
#     clean. For a task-07b-scoped proof, pass the swept surfaces as path args.
#
# TWO independent vocab-family triples (ideation iter4 root fix — the recurring
# `guard-cited-as-runtozero-without-matching-vocab` mistake):
#   - Family A (default): the prior `memorization` rename, scanned over skills/
#     (its existing default roots) with the D7-LEGIT line-keyed allowlist.
#   - Family B (`--family-b <path> ...`): THIS migration's retired forms
#     (`_shared` / `.effective` / `.tagAreaMap.spine|mistakes`), scanned ONLY over
#     the memory-tree paths passed as args, with the 26-carrier allowlist.
# Each triple (vocab, scan-surface, allowlist) is internally consistent and
# reaches 0 independently. Conflating them floods one surface with the other's
# legitimate concept-mentions (the false-pass the segmentation prevents).
#
# Args:
#   Family A: zero or more files and/or directories (default: the full live-rename
#     surface). Directories are walked for text files.
#   Family B: `--family-b` followed by at least one memory-tree path arg.
#
# Output:
#   stdout — "RESIDUAL: <file>:<line>: <match>" per non-allowlisted hit, then a
#            one-line summary tagged with the family. On a clean run, prints
#            "NO RESIDUAL VOCAB [family X]".
# Exit: 0 = no residual vocab; 1 = at least one residual; 2 = bad args.

set -uo pipefail

SELF="check-residual-vocab.sh"

log() { printf '%s: %s\n' "$SELF" "$*" >&2; }

usage() {
    cat >&2 <<'EOF'
usage:
  check-residual-vocab.sh [<file-or-dir> ...]
      Family A (default). Greps the prior-rename vocabulary (memorization /
      session(-)memory / project(-)memory / CAPS MEMORIZATION, case-insensitive)
      across the given paths (default: the full live-rename surface, skills/ etc.).

  check-residual-vocab.sh --family-b <memory-tree-path> ...
      Family B. Greps THIS migration's retired forms (_shared / .effective /
      .tagAreaMap.spine|mistakes) over the memory-tree paths passed as args
      (mistakes/ notes/ features/ backlogs/ reports/ ...). archive/ is pruned;
      the 26 measured legitimate carriers are allowlisted. At least one path arg
      is required (the scan surface is never defaulted for Family B).

  Both modes report every NON-allowlisted hit as "RESIDUAL: <file>:<line>: <match>"
  and exit 1; print "NO RESIDUAL VOCAB" and exit 0 when clean. Bad args -> exit 2.
EOF
}

# ---------------------------------------------------------------------------
# Resolve the canonical project root from this script's own location, so the
# default scan and the allowlist resolve correctly regardless of caller CWD.
# This script lives at <proj>/skills/orchestration/scripts/<self>.
# ---------------------------------------------------------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJ_DIR="$(cd "$SCRIPT_DIR/../../.." && pwd)"          # <proj> = .gobbi/projects/gobbi
SK="$PROJ_DIR/skills"
# The repo root holds .claude / .codex / plugins; it is <proj>/../../.. .
REPO_ROOT="$(cd "$PROJ_DIR/../../.." && pwd)"

# ---------------------------------------------------------------------------
# The rename vocabulary — one alternation, every form. Case-insensitive (-i)
# covers "memorization" AND "MEMORIZATION"; the explicit CAPS \bMEMORIZATION\b
# alternative is redundant under -i but kept so the pattern documents the form.
# ---------------------------------------------------------------------------
VOCAB='memorization|session[- ]memory|project[- ]memory'

# ---------------------------------------------------------------------------
# Family B — THIS migration's retired forms (the per-type areas+tags redesign,
# #310/#312). A SECOND, INDEPENDENT (vocab, scan-surface, allowlist) triple.
#
# The root fix (ideation iter4, mistake guard-cited-as-runtozero-without-matching
# -vocab): the prior single guard CONFLATED two vocabularies with different
# scopes. Family A's "memorization" vocab belongs to skills/ — dragged across the
# memory tree it floods 243 legitimate concept-mentions. Family B's retired forms
# (_shared / .effective / .tagAreaMap.spine|mistakes) live in the memory tree
# where Family A never looks. Segmenting gives each vocab its own scan-surface +
# allowlist so each reaches 0 independently and by construction.
#
# Family B is opt-in via `--family-b <path> ...`: the retired forms are scanned
# ONLY over the memory-tree paths passed as args (mistakes/ notes/ features/
# backlogs/ reports/ + the other by-area type dirs). archive/ carriers are
# find-pruned (frozen history; rules.md sec.4.6).
#
# The allowlist is FILE-PLUS-LINE keyed (mirrors Family A's is_allowlisted): a
# retired-form hit is allowlisted only when its file is one of the 26 MEASURED
# legitimate carriers AND its exact line content is in that file's derived
# baseline of legitimate retired-form lines. A NEW retired-form line added INSIDE
# an allowlisted carrier (novel content) is NOT in the baseline, so it still
# FAILS — closing the same-file false-pass (COD-T01-OVERALL-001). A bare _shared
# planted in any file (allowlisted or not) is novel content and fails.
#
# DERIVED FROM A FRESH RUN — regenerate the baseline below after any legitimate
# edit to a carrier's retired-form lines (e.g. a Task-3 frontmatter fix):
#   grep -rniE '_shared|\.effective|\.tagAreaMap\.(spine|mistakes)' --include='*.md' \
#       mistakes notes features backlogs reports | grep -v /archive/ \
#     | while IFS= read -r h; do f="${h%%:*}"; r="${h#*:}"; c="${r#*:}"; \
#         printf '%s\t%s\n' "$(basename "$f")" "$c"; done | sort -u
#   → 147 legitimate lines across the 26 carriers (the FAMILY_B_BASELINE block).
# The 26 carriers (count must equal the distinct basenames in the baseline):
#   (a) 14 features/memory/ redesign docs (design record of the retired model);
#   (b) 2 campaign-cited mistakes (consumer-spec-cites-process-not-sites,
#       guard-cited-as-runtozero-without-matching-vocab);
#   (c) 3 project-tier records (2 notes/memory journals + the guard-extension
#       backlog that names the retired forms it must catch).
#   (d) 7 this-session (1cd48095) promotions that DOCUMENT the retirement: the
#       2 guard-scope mistakes (guard-revises-twice-means-scope-model-wrong,
#       whole-file-allowlist-false-passes-same-file-residual), the migration
#       plan + the campaign design doc + the recurring-guard-root-closure
#       decision, the reconcile-_shared backlog, and the namespace-migration
#       journal. All reference the retired forms as history, not live use.
# ---------------------------------------------------------------------------
VOCAB_B='_shared|\.effective|\.tagAreaMap\.(spine|mistakes)'

# The 26 carrier basenames — the file-level gate. A retired-form hit in a file
# whose basename is NOT here fails immediately (it is not a known carrier).
FAMILY_B_CARRIERS='
memory-namespace-schema.md
project-defined-vocab-config-as-data.md
tag-area-map-combined-config.md
universal-base-layer.md
2026-06-24-drop-shared-user-decision-on-no-match.md
2026-06-24-no-match-user-decision-supersedes-shared-resolution.md
2026-06-24-per-type-flat-vocab-model.md
2026-06-23-area-tag-dehardcoding.md
2026-06-23-area-tag-migration-manifest.md
controlled-vocabulary-hybrid.md
ddd-organize-by-area-not-by-type.md
2026-06-23-vocab-source-and-universal-layer.md
2026-06-23-dehardcode-area-tag-vocab.md
README.md
consumer-spec-cites-process-not-sites.md
guard-cited-as-runtozero-without-matching-vocab.md
2026-06-23-area-tag-vocab-dehardcoded.md
2026-06-24-per-type-vocab-redesign.md
extend-residual-vocab-guard-for-per-type-sweep.md
guard-revises-twice-means-scope-model-wrong.md
whole-file-allowlist-false-passes-same-file-residual.md
2026-06-24-migration-execution-plan.md
memory-migration-curation-campaign.md
2026-06-24-recurring-guard-root-closure-criterion.md
reconcile-shared-described-as-current-in-active-carriers.md
2026-06-24-memory-namespace-migration-and-curation.md
'

# ---------------------------------------------------------------------------
# FAMILY_B_BASELINE — the 147 MEASURED legitimate retired-form lines, one per
# line as "<basename>\t<exact raw line content>". Loaded into the ALLOW_B set at
# startup; membership is the line-level allowlist. DERIVED FROM A FRESH RUN (see
# the regeneration command above) — NOT hand-written. README.md disambiguates by
# basename (it is unique among the 26 carriers).
# ---------------------------------------------------------------------------
declare -A ALLOW_B=()
load_family_b_baseline() {
    local line bn content
    while IFS=$'\t' read -r bn content; do
        [ -z "$bn" ] && continue
        ALLOW_B["$bn"$'\t'"$content"]=1
    done <<'FAMILY_B_BASELINE'
2026-06-23-area-tag-dehardcoding.md	| 1 | Create `memory-areas.json` — gobbi's per-type AREA lists + TAG list + tag→area map + universal base (`_shared`/`docs`/`tooling`/`tests`; mistakes core `verification`/`refactor`/`tooling`/`assumption`) | — | `jq -e .` valid; `jq` reads gobbi's declared areas/tags incl. universal additions | executor |
2026-06-23-area-tag-migration-manifest.md	| 15 | `mistakes/staging-a-mistake-candidate-does-not-fix-the-artifact.md` | mistakes | **FLAG-FOR-USER** (was `_shared`) | (held pending L14 user area-decision) | controlled tag `process` is intentional-no-match for mistakes | RE-DERIVED — flagged-for-user-decision (no `_shared`) |
2026-06-23-area-tag-migration-manifest.md	| 18 | `features/workflow/decisions/2026-06-13-vocabulary-rename-blast-radius.md` | decisions | `process` (was `_shared`) | `features/workflow/decisions/process/2026-06-13-vocabulary-rename-blast-radius.md` | tag 'vocabulary-sweep' -> process (L12) | RE-DERIVED — re-routed from `_shared` |
2026-06-23-area-tag-migration-manifest.md	| 1 | Authoritative per-file recompute of all 114 rows under the new per-type vocab (apply the `legacy-frontmatter-migration` tag fix first, then resolve area via `.tagAreaMap.{type}`); resolve the 4 type-mismatch files' type (option A/B) + route the 6 flagged-for-user records with the user | — | every row has a real area OR a recorded user area-decision; zero `_shared` | manager + executor |
2026-06-23-area-tag-migration-manifest.md	| 1 | `features/workflow/design/claude-md-agents-md-6step-reconcile.md` | design | `memory` (was `_shared`) | `features/workflow/design/memory/claude-md-agents-md-6step-reconcile.md` | tag 'design' -> memory (L12) | RE-DERIVED — re-routed from `_shared` |
2026-06-23-area-tag-migration-manifest.md	| 1 | `features/workflow/references/agent-trace-tree-scaffolding.md` | references | **FLAG-FOR-USER** (was `_shared`) | (held pending L14 user area-decision) | no controlled pool tag (off-vocab); legacy-tag fix first | RE-DERIVED — flagged-for-user-decision (no `_shared`) |
2026-06-23-area-tag-migration-manifest.md	| 1 | `features/workflow/scenarios/workflow-memorization-doc-rename-scope.md` | scenarios | `process` (was `_shared`) | `features/workflow/scenarios/process/workflow-memorization-doc-rename-scope.md` | tag 'vocabulary-sweep' -> process (L12) | RE-DERIVED — re-routed from `_shared` |
2026-06-23-area-tag-migration-manifest.md	| 2 | `features/git-workflow/checklists/remediation-must-be-ask-only.md` | checklists | `process` (was `_shared`) | `features/git-workflow/checklists/process/remediation-must-be-ask-only.md` | tag 'security' -> process (L12) | RE-DERIVED — re-routed from `_shared` |
2026-06-23-area-tag-migration-manifest.md	| 2 | `features/git-workflow/discussions/2026-06-14-post-research-design-decisions.md` | discussions | `codex` (was `_shared`) | `features/git-workflow/discussions/codex/2026-06-14-post-research-design-decisions.md` | tag 'hooks' -> codex (L12) | RE-DERIVED — re-routed from `_shared` |
2026-06-23-area-tag-migration-manifest.md	| 2 | `features/workflow/decisions/2026-06-08-gap1-verify-session-tree-check.md` | decisions | **FLAG-FOR-USER** (was `_shared`) | (held pending L14 user area-decision) | no controlled pool tag (off-vocab); legacy-tag fix first | RE-DERIVED — flagged-for-user-decision (no `_shared`) |
2026-06-23-area-tag-migration-manifest.md	2. **No `_shared` landings — the terminal is a user-decision (L13/L14).** `_shared` is dropped from
2026-06-23-area-tag-migration-manifest.md	| 3 | `features/workflow/references/build-tool-deterministic-output.md` | references | **FLAG-FOR-USER** (was `_shared`) | (held pending L14 user area-decision) | no controlled pool tag (off-vocab); legacy-tag fix first | RE-DERIVED — flagged-for-user-decision (no `_shared`) |
2026-06-23-area-tag-migration-manifest.md	| 4 | `features/git-workflow/decisions/probe-data-source-reliability.md` | decisions | **FLAG-FOR-USER** (was `_shared`) | (held pending L14 user area-decision) | no controlled pool tag (off-vocab); legacy-tag fix first | RE-DERIVED — flagged-for-user-decision (no `_shared`) |
2026-06-23-area-tag-migration-manifest.md	| 4 | `features/workflow/checklists/sweep-executor-verification-steps.md` | checklists | `process` (was `_shared`) | `features/workflow/checklists/process/sweep-executor-verification-steps.md` | tag 'vocabulary-sweep' -> process (L12) | RE-DERIVED — re-routed from `_shared` |
2026-06-23-area-tag-migration-manifest.md	| 4 | `features/workflow/design/sweep-manifest-command-derived.md` | design | `memory` (was `_shared`) | `features/workflow/design/memory/sweep-manifest-command-derived.md` | tag 'design' -> memory (L12) | RE-DERIVED — re-routed from `_shared` |
2026-06-23-area-tag-migration-manifest.md	| 4 | `features/workflow/references/git-layout-mutability-split.md` | references | **FLAG-FOR-USER** (was `_shared`) | (held pending L14 user area-decision) | no controlled pool tag (off-vocab); legacy-tag fix first | RE-DERIVED — flagged-for-user-decision (no `_shared`) |
2026-06-23-area-tag-migration-manifest.md	| 5 | `features/workflow/discussions/2026-06-13-scope-lock-d12-workflow-feature.md` | discussions | `memory` (was `_shared`) | `features/workflow/discussions/memory/2026-06-13-scope-lock-d12-workflow-feature.md` | tag 'design' -> memory (L12) | RE-DERIVED — re-routed from `_shared` |
2026-06-23-area-tag-migration-manifest.md	| 6 | `features/workflow/decisions/2026-06-08-script-hook-layer-verify-no-change.md` | decisions | `codex` (was `_shared`) | `features/workflow/decisions/codex/2026-06-08-script-hook-layer-verify-no-change.md` | tag 'hooks' -> codex (L12) | RE-DERIVED — re-routed from `_shared` |
2026-06-23-area-tag-migration-manifest.md	| 7 | `features/workflow/discussions/2026-06-13-two-skill-hybrid-d10.md` | discussions | `memory` (was `_shared`) | `features/workflow/discussions/memory/2026-06-13-two-skill-hybrid-d10.md` | tag 'design' -> memory (L12) | RE-DERIVED — re-routed from `_shared` |
2026-06-23-area-tag-migration-manifest.md	| 8 | `features/workflow/discussions/2026-06-13-vocabulary-d5-d6-d7-lock.md` | discussions | `memory` (was `_shared`) | `features/workflow/discussions/memory/2026-06-13-vocabulary-d5-d6-d7-lock.md` | tag 'design' -> memory (L12) | RE-DERIVED — re-routed from `_shared` |
2026-06-23-area-tag-migration-manifest.md	   already excludes `archive/`. No `_shared` involved.
2026-06-23-area-tag-migration-manifest.md	| Area | Files | Delta vs prior (`_shared` model) |
2026-06-23-area-tag-migration-manifest.md	> **Baseline note (re-derived 2026-06-24).** Under the new per-type vocab the `_shared/` dirs are no
2026-06-23-area-tag-migration-manifest.md	| `check-residual-vocab.sh` | `bash skills/orchestration/scripts/check-residual-vocab.sh` | zero residual OLD flat-path references to any moved file. NOTE: this guard's `VOCAB` pattern does NOT cover the redesign forms (`_shared`, `.effective.*`, `.tagAreaMap.spine\|mistakes`) — the OF-1 backlog tracks extending it; until then the move sweep also needs explicit per-form `grep -c` |
2026-06-23-area-tag-migration-manifest.md	| `codex` | 8 | +2 (formerly-`_shared` records via `hooks`→codex) |
2026-06-23-area-tag-migration-manifest.md	> deferred migration — NEVER auto-`_shared`. Resolution method: §1.5 selection rule applied per file —
2026-06-23-area-tag-migration-manifest.md	   every type's area list. A record whose controlled tags route to no area no longer falls to `_shared`;
2026-06-23-area-tag-migration-manifest.md	| **`flagged-for-user-decision`** | **6** | **NEW — replaces the silent `_shared` catch-all (L13/L14)** |
2026-06-23-area-tag-migration-manifest.md	> **`flagged-for-user-decision` replaces `_shared`.** The prior model showed `_shared = 17` "legitimate
2026-06-23-area-tag-migration-manifest.md	| # | Formerly-`_shared` record | Type | New resolution | Basis (controlled tag → area) |
2026-06-23-area-tag-migration-manifest.md	### Formerly-`_shared` re-resolution (the 17 records, model re-derivation)
2026-06-23-area-tag-migration-manifest.md	> longer a listed area, so any residual `_shared/` path now FAILS the area check (fail-closed, L15) —
2026-06-23-area-tag-migration-manifest.md	| `memory` | 25 | +5 (formerly-`_shared` design/discussions records via `design`→memory) |
2026-06-23-area-tag-migration-manifest.md	- [[no-match-user-decision-supersedes-shared-resolution]] — the decision (L13/L14) that removed `_shared` and made no-match a user-decision; superseded the prior `_shared`-resolution expectation
2026-06-23-area-tag-migration-manifest.md	> no-tag-match fallbacks." Under L13/L14 there is no `_shared`: 11 of those 17 now route to a real area
2026-06-23-area-tag-migration-manifest.md	> now a user-decision (L14), not a `_shared` landing. The historical narrative below (which mentions the
2026-06-23-area-tag-migration-manifest.md	> old `_shared` model as past context) is preserved deliberately — it is the record of the prior design,
2026-06-23-area-tag-migration-manifest.md	> output). They are NOT the live target: the `_shared` destination column in these rows is SUPERSEDED by
2026-06-23-area-tag-migration-manifest.md	   priority-ordered map per by-area type) — NOT the retired `.tagAreaMap.spine` /
2026-06-23-area-tag-migration-manifest.md	| `process` | 5 | +4 (formerly-`_shared` records via generic-tag routing) |
2026-06-23-area-tag-migration-manifest.md	> replaced by per-type `.tagAreaMap.{type}`; the `_shared` catch-all is removed (L13); area no-match is
2026-06-23-area-tag-migration-manifest.md	## Resolved-area distribution (all 114) — re-derived 2026-06-24 (ZERO `_shared`)
2026-06-23-area-tag-migration-manifest.md	`_shared`.
2026-06-23-area-tag-migration-manifest.md	> `_shared`-model resolution, PRESERVED as historical context (they record the prior design's per-file
2026-06-23-area-tag-migration-manifest.md	   `.tagAreaMap.mistakes` 2-table. The selection rule is otherwise unchanged: explicit `area:` field
2026-06-23-area-tag-migration-manifest.md	> `.tagAreaMap.{type}`); for any row whose old destination was a `_shared/` path, use the re-resolution
2026-06-23-area-tag-migration-manifest.md	> The 17 `_shared` rows are NOT pre-created on disk; they re-resolve at move time per the model above.
2026-06-23-area-tag-migration-manifest.md	> the `legacy-frontmatter-migration` tag fix. Read the rows below for the non-`_shared` destinations
2026-06-23-area-tag-migration-manifest.md	The move is done when: (a) a fresh `find` shows zero flat by-area files (modulo any option-B type-mismatch deferral or a file held pending its flagged-for-user area-decision); (b) all four guards pass (`check-markdown-links.sh`, `check-residual-vocab.sh` + explicit per-form greps, the NEW `layer2-source:` check, `validate-frontmatter.sh`); (c) the validator's area-flat violation count drops to ~0 for migrated files with NO new area/tag violations; (d) the only remaining RED is the documented legacy-tag expected-RED tracked by `legacy-frontmatter-migration`; (e) ZERO `_shared` landings — every record has a real area or a recorded user area-decision.
2026-06-23-area-tag-migration-manifest.md	> the re-derived model above (§ Re-derived resolution model + the formerly-`_shared` re-resolution
2026-06-23-area-tag-migration-manifest.md	Under the new per-type model. The `_shared` row is GONE; its 17 records re-route per the table above,
2026-06-23-area-tag-migration-manifest.md	   user to pick an existing area or create one as an Always-Ask edit). The prior 17 `_shared` records
2026-06-23-area-tag-vocab-dehardcoded.md	- **Round-trip guarantee**: gobbi's `.effective.*` lists are a SUPERSET of the pre-de-hardcoding hardcoded values, so no currently-valid file becomes invalid.
2026-06-23-area-tag-vocab-dehardcoded.md	- **Universal base layer** ([[universal-base-layer]]): `_shared` + `docs`/`tooling`/`tests` (spine) and `assumption` (mistakes) are universal; every project inherits them, none may remove them.
2026-06-23-area-tag-vocab-dehardcoded.md	- `validate-frontmatter.sh` — reads `.effective.{areas,tags}` from the config instead of literals.
2026-06-23-dehardcode-area-tag-vocab.md	The memory AREA and TAG vocabularies (previously hardcoded as `AREA_SPINE`/`AREA_MISTAKES`/`TAG_VOCAB` in `validate-frontmatter.sh` + literal lists in `rules.md`) are now declared in a project-owned `.gobbi/projects/{name}/memory-vocabulary.json`, which the bash validator reads via `jq`. `rules.md`/`wrap-up/SKILL.md`/the #307 design doc were repointed at the config. A ratified universal base (`_shared` + `docs`/`tooling`/`tests`; mistakes trap-class `assumption`) was added. gobbi declares its own areas+tags preserving current on-disk subdirs. A complete 114-file migration manifest was produced (the bulk move is a deferred backlog).
2026-06-23-vocab-source-and-universal-layer.md	2. Q2: What is the universal layer? Options: (a) _shared only, (b) _shared + docs/tooling/tests, (c) full features-as-areas.
2026-06-23-vocab-source-and-universal-layer.md	- Q2: _shared-only vs +docs/tooling/tests (ratified as domain-agnostic) vs full features.
2026-06-23-vocab-source-and-universal-layer.md	- **Q2:** Universal base = _shared (mandatory) + docs/tooling/tests (ratified). Project areas on top.
2026-06-24-drop-shared-user-decision-on-no-match.md	1. **Keep `_shared` as a real area (not a catch-all, but intentional cross-cutting records only)** — rejected. In practice `_shared` was never used intentionally; it was always a no-match landing. A category the validator cannot distinguish from "I didn't try" has no value.
2026-06-24-drop-shared-user-decision-on-no-match.md	description: Drop _shared from all type area lists; on area no-match surface a user-decision instead of defaulting to a catch-all.
2026-06-24-drop-shared-user-decision-on-no-match.md	# Drop `_shared` from all type area lists; surface a user-decision on area no-match
2026-06-24-drop-shared-user-decision-on-no-match.md	- Every type's `areas` list has no `_shared` entry.
2026-06-24-drop-shared-user-decision-on-no-match.md	keywords: [_shared, no-match, user-decision, NEEDS_CONTEXT, area-selection]
2026-06-24-drop-shared-user-decision-on-no-match.md	`_shared` accreted because no-match was silent — agents had an easy exit that bypassed classification. Replacing the silent catch-all with a user-decision forces every record into a real, intentional area and grows the controlled vocabulary deliberately (the §1.5 "extend deliberately" discipline). The `_shared` removal also makes the fail-closed validator stricter: a record stamped `area: _shared` now FAILS the off-allowlist area check, because `_shared` is not in any type's `areas` list. The existing wrap-up NEEDS_CONTEXT / unroutable-file escalation pattern is already present; this decision reuses it for the no-match case.
2026-06-24-drop-shared-user-decision-on-no-match.md	`_shared` is REMOVED from every type's area list. There is no catch-all area. On area no-match (no tag routes to a named area and no explicit `area:` override is present in frontmatter), the write-time agent emits `NEEDS_CONTEXT`. The manager asks the user to either pick an existing area or create a new one. If the user creates a new area, it is added to `types.{type}.areas` in `memory-vocabulary.json` as an Always-Ask edit (never auto-applied). The record then routes to the user-chosen area.
2026-06-24-drop-shared-user-decision-on-no-match.md	- The 17 formerly-`_shared` records must be reclassified: most route to a real area via L12 generic-tag routing; the remainder are flagged for per-file user area-decision in the deferred 114-file migration.
2026-06-24-drop-shared-user-decision-on-no-match.md	The prior memory area-selection rule's no-match terminal was `_shared/` — any record whose tags did not route to a named area was silently placed in `_shared/`. This accreted 17/114 records (15%) as a dumping ground, defeating the purpose of the controlled area vocabulary. `_shared` appeared in every type's area list, including the mistakes trap-class list, making it a de facto opt-out from the classification discipline.
2026-06-24-drop-shared-user-decision-on-no-match.md	- The `rules.md §1.5` selection rule terminal (step 3) is rewritten from "`_shared/` ONLY when NO area matched" to user-decision.
2026-06-24-drop-shared-user-decision-on-no-match.md	- `wrap-up/SKILL.md` line 312 (`_shared/` no-match terminal) is rewritten to return `NEEDS_CONTEXT`.
2026-06-24-drop-shared-user-decision-on-no-match.md	- Write-time agents must emit `NEEDS_CONTEXT` rather than stamping `area: _shared` on no-match.
2026-06-24-no-match-user-decision-supersedes-shared-resolution.md	# Area no-match → user-decision (not `_shared`); `_shared` dropped from every type area list
2026-06-24-no-match-user-decision-supersedes-shared-resolution.md	  `area: _shared`.
2026-06-24-no-match-user-decision-supersedes-shared-resolution.md	- [[area-tag-migration-manifest]] — the manifest re-derived to ZERO `_shared` landings (Task 08)
2026-06-24-no-match-user-decision-supersedes-shared-resolution.md	decision rests on: there is no `_shared` area anymore, so a `_shared` resolution can no longer occur.
2026-06-24-no-match-user-decision-supersedes-shared-resolution.md	description: Area no-match now surfaces a user-decision (NEEDS_CONTEXT), not a `_shared` landing; `_shared` is dropped from every type's area list. Supersedes the manifest's `_shared`-resolution expectation.
2026-06-24-no-match-user-decision-supersedes-shared-resolution.md	deterministically resolve to `_shared`, and instructed the executor to annotate the migration
2026-06-24-no-match-user-decision-supersedes-shared-resolution.md	enforced at write time instead of bypassed by `_shared`). The mechanism (#309 jq / fail-closed /
2026-06-24-no-match-user-decision-supersedes-shared-resolution.md	- **Keep `_shared` as the no-match catch-all** (the prior decision's premise): rejected by L13. It
2026-06-24-no-match-user-decision-supersedes-shared-resolution.md	keywords: [_shared-removed, no-match-user-decision, L13, L14, always-ask-area-add]
2026-06-24-no-match-user-decision-supersedes-shared-resolution.md	- **L13 — `_shared` REMOVED.** `_shared` is dropped from every type's area list. No catch-all area
2026-06-24-no-match-user-decision-supersedes-shared-resolution.md	- **L14 — no-match → user-decision.** Area resolution no longer defaults to `_shared` on no-match.
2026-06-24-no-match-user-decision-supersedes-shared-resolution.md	  landings; the 17 formerly-`_shared` records re-resolve (11 route to a real area via L12; 6 become
2026-06-24-no-match-user-decision-supersedes-shared-resolution.md	manifest's `_shared` rows as expected, not as a gap. The redesign's L13/L14 remove the premise that
2026-06-24-no-match-user-decision-supersedes-shared-resolution.md	no-match terminal from `_shared` (silent) to a user-decision (explicit). The fail-closed property is
2026-06-24-no-match-user-decision-supersedes-shared-resolution.md	one process-only mistake, and the 17 formerly-`_shared` records in the migration manifest) resolve to
2026-06-24-no-match-user-decision-supersedes-shared-resolution.md	preserved: since `_shared` is no longer a listed area, a `_shared/` directory now FAILS the validator.
2026-06-24-no-match-user-decision-supersedes-shared-resolution.md	removed the `_shared` catch-all area. The prior decision
2026-06-24-no-match-user-decision-supersedes-shared-resolution.md	`_shared` accreted 15% of records (17 of 114) as a silent dumping ground. Replacing the silent
2026-06-24-no-match-user-decision-supersedes-shared-resolution.md	- [[shared-resolution-expected-in-manifest]] — the prior decision this supersedes (its `_shared`
2026-06-24-no-match-user-decision-supersedes-shared-resolution.md	`_shared`. They do not — they either re-route via L12 generic-tag routing to a real area, or they hit
2026-06-24-no-match-user-decision-supersedes-shared-resolution.md	the L14 no-match user-decision (flagged-for-user-decision in the re-derived manifest). `_shared` is no
2026-06-24-no-match-user-decision-supersedes-shared-resolution.md	- The migration manifest's resolution model is re-derived against the per-type vocab: ZERO `_shared`
2026-06-24-no-match-user-decision-supersedes-shared-resolution.md	Two locked redesign decisions supersede the `_shared`-resolution expectation:
2026-06-24-per-type-flat-vocab-model.md	The memory vocabulary config (`memory-vocabulary.json`) previously used a layered model with a universal base, a project overlay, and an `effective` computed layer. Two area axes (`spine` + `mistakes`) were shared by all types; one global effective tag pool applied to all types. The result was that types with different routing needs shared the same area list, and the 17/114 `_shared` records showed that the catch-all was absorbing genuine classification pressure.
2026-06-24-per-type-vocab-redesign.md	  catch-all. 6 of the 17 formerly-`_shared` records are flagged-for-user-decision in the re-derived
2026-06-24-per-type-vocab-redesign.md	description: Per-session journal — the per-type flat memory-vocabulary redesign (drop layering + _shared; no-match user-decision; kind-required reviews/reports). Schema ships; 114-file migration deferred (merge-ordering A).
2026-06-24-per-type-vocab-redesign.md	- [[no-match-user-decision-supersedes-shared-resolution]] — the `_shared`-drop / no-match decision
2026-06-24-per-type-vocab-redesign.md	- **No `_shared` fallback.** Any record that matches no area is a user-decision, never a silent
2026-06-24-per-type-vocab-redesign.md	  not a defect (residual `_shared/` paths fail the fail-closed area check by design).
2026-06-24-per-type-vocab-redesign.md	- **`_shared` dropped + no-match → user-decision (L13/L14).** No catch-all area anywhere. On area
2026-06-24-per-type-vocab-redesign.md	- Task 08: overwrote the durable migration manifest with the re-derived (per-type, ZERO-`_shared`)
consumer-spec-cites-process-not-sites.md	2. **Mis-cited a line.** The `_shared` no-match terminal in `wrap-up/SKILL.md` was cited at line 172 in the draft. Line 172 is the routing-table-pointer step 4d ("mentions §1.5 selection rule"). The actual `_shared` no-match terminal is at **line 312** in the "Area resolution on promotion" block 306-314. The evaluator (Claude REVISE finding STR-1) caught this discrepancy by re-grepping the live file.
controlled-vocabulary-hybrid.md	gobbi's §1.5 already IS this hybrid: a closed `area` allowlist (controlled) + a `_shared` no-match terminal + the `keywords` freeform escape-hatch. Invoke to justify keeping the controlled-vocabulary DESIGN unchanged — the only change is moving WHO controls it (harness → project), not abandoning control for a folksonomy.
ddd-organize-by-area-not-by-type.md	| 2026-06-21 | c3ac1c53-6741-49cf-8856-cdb3fcd6bec0 | Anchored area-under-type (not replacing type) + the `_shared/` cross-cutting namespace |
ddd-organize-by-area-not-by-type.md	A caution against a naive "namespace everything by subsystem" answer. gobbi's TYPE is already the top directory and is load-bearing (the validator derives `type` and routing keys off it). So the area axis goes UNDER the type (`{type}/{area}/`), not as a replacement for it; and a `_shared/` namespace absorbs records that span areas (the DDD `shared/` analog). Invoke when defending area-under-type + the `_shared/` cross-cutting bucket (DP-2, DP-7).
ddd-organize-by-area-not-by-type.md	description: DDD groups by feature/area with a shared bucket for cross-context records — area goes under the load-bearing type, with a _shared namespace.
extend-residual-vocab-guard-for-per-type-sweep.md	catch-all area, the layered `.effective.*` config keys, and the 2-table `.tagAreaMap.spine` /
extend-residual-vocab-guard-for-per-type-sweep.md	description: check-residual-vocab.sh false-PASSes on this redesign's retired forms (_shared, .effective.*, .tagAreaMap.spine|mistakes); extend its pattern before the deferred 114-file migration relies on it.
extend-residual-vocab-guard-for-per-type-sweep.md	match this redesign's retired forms: `_shared`, `.effective.` (and the layered `.effective.*` key
extend-residual-vocab-guard-for-per-type-sweep.md	record the `_shared` history as past context). After extending, confirm the guard now returns non-zero
extend-residual-vocab-guard-for-per-type-sweep.md	shapes), and the 2-table `.tagAreaMap.spine` / `.tagAreaMap.mistakes`. Allowlist legitimate historical
extend-residual-vocab-guard-for-per-type-sweep.md	`_shared` and `.effective` occurrences still exist on disk. The Planning evaluator ran the guard and
extend-residual-vocab-guard-for-per-type-sweep.md	`.tagAreaMap.mistakes` shape. The guard `skills/orchestration/scripts/check-residual-vocab.sh` is the
extend-residual-vocab-guard-for-per-type-sweep.md	The per-type-vocab redesign (session `84e9570c`) retired three vocabulary forms: the `_shared`
guard-cited-as-runtozero-without-matching-vocab.md	The Planning plan for the per-type vocabulary redesign cited `check-residual-vocab.sh` as the "run-to-zero" verification anchor for removing the retired forms (`_shared`, `.effective.*`, `.tagAreaMap.spine|mistakes`). The Planning evaluator RAN the guard and found it returns "NO RESIDUAL VOCAB / exit 0" while 5 `_shared` + 3 `.effective` occurrences remained in `rules.md`. The manager reproduced this independently. The guard's VOCAB pattern only scans a PRIOR campaign's rename vocabulary (`memorization|session[- ]memory|...`), not this redesign's retired forms — so it would have green-lit Execution shipping a consumer still carrying `_shared`. A false-PASS verification gate.
memory-namespace-schema.md	> Every **by-area** memory record MUST be written under a controlled AREA segment for its type: `{type}/{area}/{slug}.md` (or `{type}/{area}/{YYYY-MM-DD}-{slug}.md` for date-prefixed types), on both tiers. A by-area record at bare `{type}/{slug}.md` is invalid. The area allowlist per type is controlled (extend deliberately, like the tag vocabulary §2.5); the area is resolved by the TOTAL deterministic selection rule (explicit `area:` > priority-ordered tag→area map > `_shared/` on no-match). **Structural exception:** `features/{f}/README.md` is the feature identity doc, not a by-area record — the feature dir is itself the area axis — so it is exempt.
memory-namespace-schema.md	| `mistakes` | gobbi instance: `verification · refactor · tooling · git · codex · docs-sync · memory · _shared · assumption` (`process` DISSOLVED into trap-classes; NOT a mistakes area; declared in the config's `.effective.areas.mistakes`) |
memory-namespace-schema.md	**Step 2 — scan a fixed PRIORITY-ORDERED tag→area map; FIRST match wins.** The project now declares this map in [`memory-vocabulary.json`](../../../../memory-vocabulary.json) `.tagAreaMap` (the Wrap-up agent reads it for area resolution following the prose spec; the validator does not read `.tagAreaMap` — it enforces the resolved area against `.effective.areas.*`); the values below are gobbi's declared instance of the design.
memory-namespace-schema.md	**Step 3 — `_shared/` ONLY when NO area matched in Steps 1-2.** Never invent a new area to avoid `_shared`.
memory-namespace-schema.md	**The project declares the allowlist values in [`memory-vocabulary.json`](../../../../memory-vocabulary.json)** — `.effective.areas.spine` and `.effective.areas.mistakes`, the SAME arrays the validator reads via jq (a non-gobbi project ships its own copy). This doc fixes the schema; the config holds the values. gobbi's spine instance is `memory · git · workflow · wrap-up · evaluation · codex · process · _shared · docs · tooling · tests`.
memory-namespace-schema.md	| TOTAL selection rule, 0 ambiguous | Re-run classification over 16 mistakes + 11 backlogs → all one area, `_shared`=1/0 |
project-defined-vocab-config-as-data.md	- Non-gobbi project declares tags [auth, payments] + areas [auth, payments, _shared]: both tag gate and area gate pass.
README.md	| 2026-06-24 | 84e9570c-bf2b-42b0-af5c-1c181d182e1b | Vocab REDESIGNED to flat per-type model; `_shared` dropped + no-match→user-decision; `review_kind`/`report_type` REQUIRED (kind=area); migration manifest re-derived (zero `_shared`); 114-file move still deferred (merge-ordering A) |
README.md	The memory AREA + TAG vocabulary was REDESIGNED to a FLAT per-type model on 2026-06-24 (session 84e9570c; both Execution evaluators PASS): `memory-vocabulary.json` now carries `types.{type}.{areas, tags}` at the top level — one independent area list + one tag pool per by-area type (15 active type keys) — replacing the layered universal/project/`effective` model with its shared `spine`/`mistakes` axes. `_shared` is dropped from every area list; area no-match now surfaces a user-decision (`NEEDS_CONTEXT`), never a silent catch-all. `review_kind`/`report_type` are now REQUIRED and the area resolves from the kind value (no `tagAreaMap` entry for reviews/reports). Merge-ordering A: the SCHEMA ships now; the 114-file MIGRATION is DEFERRED to a next session, so the live tree intentionally FAILS whole-tree validation until then (expected debt, not a defect). This refines the prior config-as-data ship (2026-06-23, commits 4557c78c / ed435550 / 9c171908): the validator still reads closed allowlists via `jq`, project-general by design.
tag-area-map-combined-config.md	- A project declares tags [auth, payments] + areas [auth, payments, _shared] + map {auth: auth, payments: payments}: tag gate passes; area resolves to auth.
tag-area-map-combined-config.md	The tag→area map currently in `rules.md:122-138` (restated `wrap-up/SKILL.md:308-312`) MOVES into this config. The harness provides the selection-rule STRUCTURE (explicit `area:` > tag→area map > `_shared`); the PROJECT provides the vocabulary and map values.
universal-base-layer.md	keywords: [universal-areas, universal-tags, two-tier-vocabulary, _shared]
universal-base-layer.md	- `_shared` — mandatory terminal (no-match destination); universal, cannot be removed by any project.
universal-base-layer.md	When de-hardcoding the vocabulary to project-defined, some areas and tags are genuinely domain-agnostic and belong in every project without re-declaration. A project that must re-declare `_shared` or `docs` gains nothing. The question is which items are truly universal vs gobbi-specific.
2026-06-24-memory-namespace-migration-and-curation.md	The tasks ran strictly in order. **T01** (`594d1a45`) segmented `check-residual-vocab.sh` into two independent vocab-family triples — Family A (`memorization`, scan-surface `skills/`) and Family B (the migration's retired forms `_shared|.effective|.tagAreaMap.(spine|mistakes)`, scan-surface the memory tree, allowlist = 19 carriers measured from a fresh run) — and added the `layer2-source:` resolution check. This closed the recurring guard-false-PASS root that had REVISE'd the Ideation three times. **T02** (`c65872d8`) corrected 4 type-mismatch mistakes (`type: decisions` → `type: mistakes`) and recorded the one structural area no-match decision (`verification`, user-locked). **T03** (`affad3dc`) cleared 572 legacy frontmatter / tag / status violations while the files were still flat. T04 recomputed each file's area via `.tagAreaMap.{type}`. **T05** (`812c9091`) `git mv`-relocated 108 normal-move files into `{type}/{area}/` namespaces (history-preserving). **T06** (`6fc5cf97`) repointed all inbound reference classes — path, prose, in-fence links, the 3 live `layer2-source:` carriers, and `required-mistakes:` paths. **T07** (`7e1a1f4d`) dropped the 4 dangling `layer2-source:` refs, resolved the dup-backlog pair, and archived (never deleted) the 6 spent journals to `archive/notes/{area}/`. T08 drove the whole tree to green.
2026-06-24-migration-execution-plan.md	| 1 | Segment `check-residual-vocab.sh` into two (vocab, scan-surface, allowlist) triples — Family A (memorization / `skills/`, allowlist covers existing + the 2 skills-side carriers) + Family B (retired forms / memory tree / 19-carrier allowlist from a fresh run); create the `layer2-source:` resolution check | — | `check-residual-vocab.sh` → exit 0 (was exit 1 / 4 residuals / 2 files); Family-B over the memory tree → exit 0; planted `_shared` → exit 1; `check-layer2-source.sh <WT>` runs (baseline 3 LIVE + 4 DANGLING) | executor |
2026-06-24-migration-execution-plan.md	| 4 | Recompute the 108 normal-move files' area via `.tagAreaMap.{type}` (featureDirNormalization first), AFTER the tag-fix; confirm the 5 tag-driven no-matches resolve; reads `memory-vocabulary.json` (does NOT modify it) | #3 | the map covers exactly 108 files, each a real area; zero `_shared`; zero unresolved no-match (Always-Ask via NEEDS_CONTEXT if any residual) | executor |
2026-06-24-recurring-guard-root-closure-criterion.md	2. **Derivation from fresh run:** each family's allowlist was MEASURED, not guessed. Family B: `grep -rlE '_shared|\.effective|tagAreaMap\.(spine|mistakes)' --include='*.md' mistakes notes features backlogs reports | grep -v /archive/` → 19 files. The allowlist equals the measured output; a re-run yields the same 19.
2026-06-24-recurring-guard-root-closure-criterion.md	4. **Fresh-verified by both systems:** Claude ran `check-residual-vocab.sh mistakes notes features backlogs reports` → 243 residual / 49 files / exit 1 (ALL Family-A `memorization`-family, ZERO Family-B — proves the conflation). Codex ran `rg -l "_shared|\.effective|tagAreaMap\.(spine|mistakes)" ...` → 19 live files + 1 archive. Both verified the same 19-file set and the same zero-by-construction property.
guard-revises-twice-means-scope-model-wrong.md	Applied in iter4: Family A (`memorization|session[- ]memory|project[- ]memory`, scan-surface = `skills/`, existing allowlist) and Family B (`_shared|\.effective|\.tagAreaMap\.(spine|mistakes)`, scan-surface = the memory tree, allowlist = the 19 measured legitimate carriers from a fresh `grep -rlE` run). Family B allowlist derivation: `grep -rlE '_shared|\.effective|tagAreaMap\.(spine|mistakes)' --include='*.md' mistakes notes features backlogs reports | grep -v /archive/` → 19 files. Post-allowlist result: 0 non-allowlisted residual by construction; a re-run yields the same 19 carriers and the same zero.
guard-revises-twice-means-scope-model-wrong.md	The guard conflated two independent vocabularies with different scopes: the prior `memorization` rename, scoped to `skills/`; and this migration's retired forms (`_shared`, `.effective`, `.tagAreaMap.spine|mistakes`), living in the memory tree. Both were forced through a SINGLE `(vocab, scan-surface, allowlist)` triple. Each facet-patch guessed a residual count against the wrong surface. The counts the draft committed to were never measured against the actual command run — they were inferred from the prior state. A count derived by inference rather than measurement is always refutable by the evaluator running the real command.
guard-revises-twice-means-scope-model-wrong.md	The memory-migration-curation-campaign Ideation cited `check-residual-vocab.sh` as a run-to-zero completion gate for the migration (retiring `_shared`, `.effective`, `.tagAreaMap.spine|mistakes`). The guard REVISE'd THREE consecutive iterations (iter1, iter2, iter3) — each fixing a different facet of the SAME underlying root: iter1 patched the VOCAB pattern; iter2 patched the scan-surface roots; iter3 would have patched the allowlist count again. Each fix guessed a residual count the next evaluator refuted by running the actual command. No single-facet patch ever closed the gate; the next evaluator always found the gap had relocated one layer deeper. iter4 stopped patching and fixed the root instead.
memory-migration-curation-campaign.md	- **D1 — Guard-extension = TWO independent vocab-family triples, derived from a fresh run, Task 1 first.** This Ideation REVISE'd 3× on the same root — the guard cited as a run-to-zero gate while its real coverage didn't match (iter1 VOCAB gap → iter2 scan-surface gap → iter3 allowlist undersized). The structural root is that the guard CONFLATES two independent vocabularies with different scopes; the fix is to SEGMENT it, not re-patch the count. **Family A** — vocab `memorization|session[- ]memory|project[- ]memory`, scan-surface = its existing `skills/ agents/ hooks/ .claude/ .codex/ plugins/` roots, allowlist = the existing legitimate `memorization` carriers. **Family B** — vocab `_shared|\.effective|\.tagAreaMap\.(spine|mistakes)`, scan-surface = the MEMORY TREE (`mistakes/ notes/ features/ backlogs/ reports/` + the other by-area type dirs as they exist), allowlist = the 19 MEASURED legitimate carriers from a fresh run (14 `features/memory/` redesign docs + 2 campaign-cited mistakes + 3 project-tier redesign records; the `archive/` carrier is find-pruned), each with a per-entry reason. The fresh run proved the conflation: the current single vocab over the memory tree returns 243 hits, ALL Family-A `memorization`-family, ZERO Family-B. The exhaustive per-path allowlist is the Task-1 Execution deliverable; this design carries the method (segment + derive-from-run) + the measured set. *Validation:* PROPERTY — Family A over `skills/` → 0 non-allowlisted residual; Family B over the memory tree → 0 non-allowlisted residual (allowlist = the measured 19); a planted retired-form in a non-allowlisted memory file fails; re-running the same grep yields the same 19 carriers and the same zero.
reconcile-shared-described-as-current-in-active-carriers.md	2. Find sections that describe `_shared` as the current resolution model.
reconcile-shared-described-as-current-in-active-carriers.md	3. Reframe to past tense: "The prior model used `_shared`…"; add a pointer to the per-type vocab config that replaced it.
reconcile-shared-described-as-current-in-active-carriers.md	After the migration campaign PR is merged and validator + both guard families reach zero. At that point the two files' `status: active` is correct but their `_shared`-as-current prose is a docs-sync gap. A focused docs-sync pass (read the merged config, update the two files' framing to "the prior model was…") closes this. No blocking dependency — can run in any session after the migration campaign PR lands.
reconcile-shared-described-as-current-in-active-carriers.md	Both files were allowlisted correctly (they are the design record of the model being retired and their content is load-bearing historical documentation). But their framing describes `_shared` as-if-current, contradicting the merged config.
reconcile-shared-described-as-current-in-active-carriers.md	description: 2 active Family-B allowlist carriers describe _shared as the current model, contradicting the merged config that dropped it.
reconcile-shared-described-as-current-in-active-carriers.md	# Reconcile _shared described as current in two active design docs
reconcile-shared-described-as-current-in-active-carriers.md	The per-type areas+tags vocabulary redesign (#310/#312, `ef54f990`) dropped `_shared` as a concept — the new model uses per-type area namespaces with no cross-type shared layer. During the memory-migration-curation-campaign Ideation (session `1cd48095-d745-4868-a5ac-f48326eb447f`), the Family-B legitimate-carrier derivation enumerated 19 memory-tree files that reference `_shared`/`.effective`/`.tagAreaMap.*` as legitimate carriers. 2 of those 19 files carry `status: active` and describe `_shared` as a CURRENT concept rather than a retired / historical one:
whole-file-allowlist-false-passes-same-file-residual.md	A residual-vocab guard's allowlist whitelisted entire FILES (the 19 legitimate historical carriers) rather than the specific legitimate LINES. A NEW retired-form token added inside one of those allowlisted files false-passed — the guard returned "NO RESIDUAL" / exit 0. The executor's self-check verified the NON-allowlisted-file case (which worked) but not the same-file case; the Codex evaluator's adversarial probe (append a new `_shared` line to an allowlisted carrier) exposed it.
FAMILY_B_BASELINE
}

# is_allowlisted_b — file-plus-line predicate. Allowlisted iff (1) the file's
# basename is a known carrier AND (2) the exact line content is in the derived
# baseline for that basename. Returns 0 (allowlisted) / 1 (residual).
is_allowlisted_b() {
    local file="$1" content="$2"
    local bn; bn="$(basename "$file")"
    # (1) file-level gate: basename must be a known carrier.
    case $'\n'"$FAMILY_B_CARRIERS"$'\n' in
        *$'\n'"$bn"$'\n'*) : ;;   # known carrier; fall through to the line check
        *) return 1 ;;            # not a carrier → residual
    esac
    # (2) line-level gate: exact (basename, content) must be in the baseline.
    [ -n "${ALLOW_B["$bn"$'\t'"$content"]:-}" ] && return 0
    return 1
}

# ---------------------------------------------------------------------------
# EXCLUDE path patterns — the 21 historical EXCLUDE files (matched by path
# substring, so features/workflow/** is covered as a whole tree). A hit inside
# any of these is frozen history, never a residual.
# ---------------------------------------------------------------------------
is_excluded_path() {
    local f="$1"
    case "$f" in
        */features/workflow/*)                       return 0 ;;  # 9-file redesign feature tree (frozen)
        */notes/2026-06-08-*)                         return 0 ;;  # session-memory-redesign note (frozen)
        */backlogs/persist-session-*)                 return 0 ;;  # persist-session-memory backlog (frozen)
        */mistakes/sweep-grep-literal-*)              return 0 ;;  # the originating sweep mistake (quotes old vocab)
        */skills/mistake/layer2-sweep-grep-form-specific-*) return 0 ;;  # layer2 copy (quotes old vocab)
        */skills/mistake/layer2-verify-state-from-authoritative-*) return 0 ;;  # layer2 copy (quotes old vocab)
        */skills/mistake/layer2-file-move-needs-link-resolution-*) return 0 ;;  # layer2 copy (quotes old vocab)
        */CHANGELOG.md)                               return 0 ;;  # changelog records the rename as history
        */skills/orchestration/scripts/check-residual-vocab.sh) return 0 ;;  # this gate's own source quotes the vocab it hunts
    esac
    return 1
}

# ---------------------------------------------------------------------------
# D7-LEGIT allowlist — live (file:line) hits whose old-vocab use is CORRECT and
# intentional AFTER the task-07b G1-G5 fix. Each entry is "file-substring|regex
# the matched line must satisfy" so a future EDIT to that line (that drops the
# legit framing) re-exposes it as a residual. Keyed by the legitimate phrasing,
# not by line number, so the allowlist survives line drift.
#
#   1. memory/memory-map.md — "memorization stage": the Wrap-up promotion STAGE
#      is legitimately named the memorization stage (D7 lowercase-stage retention).
#   2. memory/templates/notes.md — "2026-05-11-memorization-skill-refactor.md":
#      a historical filename used as a notes-naming EXAMPLE (D7 retention).
#   3. agents/{manager,executor,leader,assistant}.md — "### Memorize": the generic
#      Study->Plan->Execute->Verify->Memorize lifecycle VERB heading shared by every
#      role doc; not the per-loop RECORD sub-phase (G5: leave).
#   4. delegation/templates/{leader,executor,assistant}.md — "...Verify -> Memorize
#      lifecycle": the same generic lifecycle-verb reference in the delegation
#      template body.
#   5. wrap-up/SKILL.md — the Wrap-up "Memorization" STAGE 2 name introduced by
#      task 09 (D7: "memorization" = the wrap-up stage-2 promotion stage). Five
#      legit phrasings tie the word to stage 2: the stage-table row 2 cell
#      ("Memorization** (promotion:"), the D7 defining statement
#      ('"Memorization" names stage 2'), the step-table Stage column
#      ("**2 — memorization**", 4 rows), the routing-table contract line
#      ("stage 2 (memorization)"), and the RECORD-vs-stage disambiguation
#      ("memorization** stage (stage 2 of the WORK"). Each binds the word to
#      stage 2, so a genuinely-stale bare "memorization" still fails the match.
#   6. wrap-up/evaluation.md — the same stage-2 name in the eval intro
#      ("Stage 2 (memorization) is the promotion under evaluation").
#   7. memory/SKILL.md — three legit phrasings: the "memorization happens"
#      section heading, the "Memorization" names the Wrap-up stage vocabulary
#      caveat, and the stage-2 "memorization" promotion-mechanics pointer. Each
#      ties the word to the Wrap-up promotion stage (D7), so a genuinely-stale
#      bare "memorization" still fails the match.
#   8. memory/scripts/validate-frontmatter.sh — "the project memory root": a
#      code comment naming the project's memory ROOT DIRECTORY (the validator
#      resolves it), not the retired "project memory" storage tier. Legit.
# ---------------------------------------------------------------------------
is_allowlisted() {
    local file="$1" line="$2"
    case "$file" in
        */skills/memory/memory-map.md)
            [[ "$line" == *'memorization** stage'* || "$line" == *'memorization* stage'* || "$line" == *'memorization stage'* ]] && return 0 ;;
        */skills/memory/templates/notes.md)
            [[ "$line" == *'memorization-skill-refactor'* ]] && return 0 ;;
        */skills/memory/SKILL.md)
            [[ "$line" == *'When memorization happens'*  \
            || "$line" == *'"Memorization" names'*       \
            || "$line" == *'stage 2 "memorization"'* ]] && return 0 ;;
        */skills/memory/scripts/validate-frontmatter.sh)
            [[ "$line" == *'project memory root'* ]] && return 0 ;;
        */agents/manager.md|*/agents/executor.md|*/agents/leader.md|*/agents/assistant.md)
            [[ "$line" == '### Memorize'* ]] && return 0 ;;
        */skills/delegation/templates/leader.md|*/skills/delegation/templates/executor.md|*/skills/delegation/templates/assistant.md)
            [[ "$line" == *'Memorize lifecycle'* ]] && return 0 ;;
        */skills/wrap-up/SKILL.md)
            [[ "$line" == *'Memorization** (promotion:'*       \
            || "$line" == *'"Memorization" names stage 2'*     \
            || "$line" == *'**2 — memorization**'*             \
            || "$line" == *'stage 2 (memorization)'*           \
            || "$line" == *'memorization** stage (stage 2 of the WORK'* ]] && return 0 ;;
        */skills/wrap-up/evaluation.md)
            [[ "$line" == *'Stage 2 (memorization)'* ]] && return 0 ;;
    esac
    return 1
}

# ---------------------------------------------------------------------------
# Mode select: Family A (default) or Family B (`--family-b <path> ...`).
# Family B uses VOCAB_B + is_allowlisted_b + an archive/ find-prune; it requires
# at least one memory-tree path arg (the scan surface is never defaulted, so the
# prior-rename vocab is never dragged across the memory tree — the conflation
# the segmentation exists to prevent).
# ---------------------------------------------------------------------------
family="A"
if [ "${1:-}" = "--family-b" ]; then
    family="B"
    shift
    if [ "$#" -eq 0 ]; then
        log "--family-b requires at least one memory-tree path arg"
        usage
        exit 2
    fi
fi

# ---------------------------------------------------------------------------
# Resolve the scan targets. For Family A with no args, scan the full live-rename
# surface. For Family B, the targets are always the (required) path args.
# ---------------------------------------------------------------------------
targets=()
if [ "$#" -eq 0 ]; then
    for d in \
        "$SK" \
        "$PROJ_DIR/agents" \
        "$PROJ_DIR/hooks" \
        "$REPO_ROOT/.claude" \
        "$REPO_ROOT/.codex" \
        "$REPO_ROOT/plugins"; do
        [ -e "$d" ] && targets+=("$d")
    done
else
    for arg in "$@"; do
        if [ -e "$arg" ]; then
            targets+=("$arg")
        else
            log "no such file or directory: $arg"
            exit 2
        fi
    done
fi

if [ "${#targets[@]}" -eq 0 ]; then
    log "no scan targets resolved"
    exit 2
fi

# ---------------------------------------------------------------------------
# Scan. grep -r is symlink-following-safe here: -r does NOT traverse symlinked
# dirs and skips symlinked files, so mirrored .claude/.codex/plugins symlinks are
# scanned once via their canonical target (whichever target dir is also in the
# list) and never double-counted. -I skips binary files. -n gives line numbers.
# ---------------------------------------------------------------------------
residual=0
scanned_hits=0

# Select the family's vocabulary. The allowlist + path-prune differ per family
# and are applied inside the loop. Family B also loads its line-level baseline.
if [ "$family" = "B" ]; then
    scan_vocab="$VOCAB_B"
    load_family_b_baseline
else
    scan_vocab="$VOCAB"
fi

while IFS= read -r hit; do
    [ -z "$hit" ] && continue
    # hit form: <file>:<lineno>:<line-content>
    file="${hit%%:*}"
    rest="${hit#*:}"
    lineno="${rest%%:*}"
    content="${rest#*:}"
    scanned_hits=$((scanned_hits + 1))

    if [ "$family" = "B" ]; then
        # Family B: prune archive/ (frozen history; rules.md sec.4.6), then the
        # file-plus-line allowlist. A retired-form hit whose (carrier, line) is
        # NOT in the derived baseline fails — incl. a NEW line in a carrier.
        case "$file" in */archive/*) continue ;; esac
        if is_allowlisted_b "$file" "$content"; then
            continue
        fi
    else
        # Family A: the historical EXCLUDE paths + the D7-LEGIT line-keyed allowlist.
        if is_excluded_path "$file"; then
            continue
        fi
        if is_allowlisted "$file" "$content"; then
            continue
        fi
    fi
    printf 'RESIDUAL: %s:%s: %s\n' "$file" "$lineno" "$content"
    residual=$((residual + 1))
done < <(grep -rniE "$scan_vocab" "${targets[@]}" 2>/dev/null | sort -u)

if [ "$residual" -gt 0 ]; then
    printf '%s: [family %s] %d residual(s) found (%d total vocab hits scanned).\n' "$SELF" "$family" "$residual" "$scanned_hits"
    exit 1
fi

printf 'NO RESIDUAL VOCAB [family %s] (%d vocab hits scanned, all excluded or allowlisted)\n' "$family" "$scanned_hits"
exit 0
