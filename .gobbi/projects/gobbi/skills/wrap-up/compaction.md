# Wrap-up Compaction — the Promotion stage's consolidation sub-procedure

The bounded-memory sub-procedure of the Wrap-up Loop. `wrap-up/SKILL.md` holds the top-level SOP and the
sibling [`promotion.md`](promotion.md) holds Stages 1–2; this child doc holds the compaction detail an agent
opens when a promoted `{type}/{area}/` area has grown past its cap. Read it when running the final
consolidation sub-step of the Promotion stage, or when auditing a merge.

Compaction folds related records, losslessly, into ONE consolidated **Map-of-Content (MoC)** file and
`git mv`s the originals to `archive/`; it never hard-deletes. The **standard** — what a consolidated file is,
what it must preserve, the caps, and split-on-retire — is owned by
[`memory/rules.md § 5`](../memory/rules.md#5-memory-compaction-the-consolidated--map-of-content-carve-out);
this doc is the **procedure**, and `check-merge-ref-integrity.sh` is its runnable gate. This doc states the
procedure and points to that owner; it does not restate § 5.

## Table of Contents

- [When it runs and what the flag gates](#when-it-runs-and-what-the-flag-gates)
- [Procedure](#procedure)
  - [P1 — Count every area (always)](#p1--count-every-area-always)
  - [P2 — Archive terminal records, then re-count](#p2--archive-terminal-records-then-re-count)
  - [P3 — Cluster related records and apply the gates](#p3--cluster-related-records-and-apply-the-gates)
  - [P4 — Merge each selected cluster to cap](#p4--merge-each-selected-cluster-to-cap)
  - [P5 — Write the merge manifest](#p5--write-the-merge-manifest)
  - [P6 — Repoint every inbound reference class](#p6--repoint-every-inbound-reference-class)
  - [P7 — Recount, then run the guards to zero](#p7--recount-then-run-the-guards-to-zero)
- [Merged-file (MoC) write mechanics](#merged-file-moc-write-mechanics)
- [Merge manifest field names](#merge-manifest-field-names)
- [Caps and the Always-Ask safety tier](#caps-and-the-always-ask-safety-tier)
- [Completion evidence](#completion-evidence)

---

## When it runs and what the flag gates

The compaction sub-procedure is the **final consolidation sub-step of the Promotion stage** (Stage 2). It runs
AFTER Stage 2's promotion writes, move-on-terminal actions, and the per-session journal have all landed, and
BEFORE the Stage-3 memory-validation gate — so its writes land inside Stage 2 and the non-skippable Stage-3
dual-system gate validates them (the consolidated MoC file, the archived sources, the repointed references, the
manifest, and the final counts). It never runs after the gate, and never after git finalization. Its unit of
work is one `{type}/{area}/` directory; it never merges across types or areas.

**Always count — the flag gates ONLY automatic merging.** `settings.compaction.enabled` gates **automatic
merging only**, and ships `false` (dormant). It does NOT gate any of: counting, terminal archival, the
`hardCap` check, the `Always-Ask` decision, or the standing post-promotion guards. Regardless of the flag,
Wrap-up **always counts** every `{type}/{area}/` area post-promotion, and an over-`hardCap` area **cannot
silently PASS** — it routes to an Always-Ask decision even when automatic merging is off. A dormant switch once
let `mistakes/verification/` reach 44 records against a `hardCap` of 15 unnoticed — always-count closes that
hole.

The per-area caps are project config, owned by [`memory-vocabulary.json`](../memory/memory-vocabulary.json)
(`compaction.softCap` / `compaction.hardCap`; gobbi's instance is softCap 12 / hardCap 15, with an optional
per-type `types.{type}.compaction.{softCap,hardCap}` override that takes precedence for that type). Automatic
merges are bounded by `settings.compaction.maxAutoActions`. Compaction runs ONE uniform strategy for every
type — there is no `mode` field and no archive-only exemption.

---

## Procedure

Read [`memory/rules.md § 5`](../memory/rules.md#5-memory-compaction-the-consolidated--map-of-content-carve-out)
as the compaction standard first, then run P1–P7 in order, after the other Promotion writes finish. P1 (count)
and the over-`hardCap` Always-Ask routing are **unconditional**; the merge itself (P3 automatic branch, P4)
runs only when `settings.compaction.enabled` is `true` or the user authorizes a merge at an Always-Ask
decision.

### P1 — Count every area (always)

1. Resolve the cap pair: the global `softCap` / `hardCap`, overridden by any per-type
   `types.{type}.compaction.{softCap,hardCap}`. Use the same resolved pair for every area of that type.
2. Enumerate every post-promotion `{type}/{area}/` area (the §1.5 scannable unit) in the active project tree
   and count its live records. Record `{type}`, `{area}`, `live_count`, effective `softCap`, and effective
   `hardCap` as always-count evidence.
3. Put every area with `live_count > softCap` into the work set. Areas at or below `softCap` need no merge, but
   their counts stay part of the always-count evidence.

This count runs on **every** wrap-up, independent of `settings.compaction.enabled` — that setting is consulted
only at P3's automatic-merge branch. An area over `hardCap` cannot silently PASS (see
[Caps and the Always-Ask safety tier](#caps-and-the-always-ask-safety-tier)).

### P2 — Archive terminal records, then re-count

For each area in the work set:

1. Find records already terminal (`shipped` / `superseded` / `retired` / `dropped`), stamp the archive fields,
   and `git mv` each full file to `archive/{type}/{area}/` per the move-on-terminal model owned by
   [`memory/templates/archive.md`](../memory/templates/archive.md), preserving the source type and resolved
   area.
2. Run an **Always-Ask** staleness review of the records that are old but still live — surfacing them through
   the manager's user-decision primitive. Do NOT infer that age alone makes a record terminal.
3. **Re-count** the area. If the new `live_count ≤ softCap`, record that no merge is needed and drop the area
   from the merge work set — the archival pre-step alone may resolve the overage.

Terminal archival is a Promotion lifecycle action, not an automatic merge — `settings.compaction.enabled` does
not suppress it.

### P3 — Cluster related records and apply the gates

For each area still above `softCap`:

1. Group records that share one subject into candidate clusters. Keep every cluster inside the one
   `{type}/{area}/`; leave unrelated records separate — never lump unrelated records together to hit a number.
2. **If `live_count > hardCap`**, stop before any automatic merge and route the area to an **Always-Ask**
   decision (owner: [`discussion/SKILL.md § Decision Classification`](../discussion/SKILL.md#decision-classification)),
   offering: merge a related cluster / raise the cap / archive an oldest-terminal item (when one exists) /
   accept the over-`hardCap` count with explicit acknowledgement for this wrap-up. Record the chosen
   disposition — an explicit accept is evidence the overage did not silently pass; it does not change the
   configured cap. If no related cluster exists, do NOT invent one; return to this Always-Ask disposition.
3. **If above `softCap` but not above `hardCap`**, consult `settings.compaction.enabled`: `false` → do not merge
   automatically, retain the count evidence, and continue to P7; `true` → automatic merging may proceed within
   `settings.compaction.maxAutoActions`.
4. Regardless of the band or setting, a proposed **`mistakes` or `rules` merge is Always-Ask** before it can
   proceed.

### P4 — Merge each selected cluster to cap

For each approved or automatically-eligible cluster:

1. Create one consolidated MoC file in the same `{type}/{area}/` and apply every item in
   [Merged-file (MoC) write mechanics](#merged-file-moc-write-mechanics).
2. Set each merged source `status: superseded` + `superseded_by: <consolidated-slug>`, stamp
   `archive_reason: merged`, and `git mv` the full source to `archive/{type}/{area}/`
   ([`memory/rules.md § 5.5`](../memory/rules.md#5-memory-compaction-the-consolidated--map-of-content-carve-out)).
3. **Re-count after each merge.** Continue only while the area is above `softCap`, a related cluster remains, and
   the automatic-action budget or user approval permits another merge — stop the loop at `live_count ≤ softCap`.
4. If the action budget ends while the area is still above `hardCap`, return to the P3 Always-Ask gate. **Never
   treat budget exhaustion as permission to pass silently.**

Every merged source stays recoverable from both its consolidated `## ` section and its archived original.

### P5 — Write the merge manifest

Whenever P4 performs at least one merge, write a tab-separated (TSV) merge manifest — the input to the
ref-integrity gate. One `merge` row per merged-away source (a `split` row only when a later split-out actually
occurs). The field names and order must match `check-merge-ref-integrity.sh` exactly (see
[Merge manifest field names](#merge-manifest-field-names)); use the source's own slug as `source_anchor`, and
manifest paths that resolve from the gate's `<resolve-base>` (which defaults to `<scan-root>`). There is **no
header row** — the gate skips blank lines and `#`-comment lines, and every data row's first tab-field is the
record kind (`merge` or `split`). The manifest's merged-source set must equal exactly the set merged in P4.

### P6 — Repoint every inbound reference class

Using the manifest as the source map, repoint every live inbound reference that names a merged-away source or
its vacated active path. Enumerate every reference class per the refactor procedure owned by
[`memory/rules.md § 1.5`](../memory/rules.md#15-area-namespace-the-second-category-axis-under-each-type) — path
refs, prose refs, `required-mistakes:` PATH refs, inventory / table refs, wrapper-description refs,
pipeline-label refs, in-fence example paths, cross-doc mentions, and body `[[slug]]` wikilinks. Repoint by
reference meaning:

- a source-level slug ref → `consolidated_slug`;
- a path ref → `consolidated_path`;
- a ref to one source's content → `consolidated_slug#source_anchor`, where `source_anchor` equals the source
  slug ([`memory/rules.md § 5.2`](../memory/rules.md#5-memory-compaction-the-consolidated--map-of-content-carve-out));
- a historical ref that deliberately points at the frozen original → `archived_path`.

Do NOT rewrite the reciprocal `supersedes` / `superseded_by` links into ordinary live references — the gate
checks those positively as the supersession relationship (its Family 2), not as dangling inbound refs.

### P7 — Recount, then run the guards to zero

1. Recount every area changed by P2 or P4 and update the count evidence with the final `live_count`. For any
   final `live_count > hardCap`, the run must record one of: an Always-Ask remediation still in progress (so
   Promotion cannot complete), an explicit user accept for this wrap-up, or a raised cap that puts the count at
   or below `hardCap`.
2. When P4 produced a merge manifest, run the compaction gate to zero — its own gate, not a general link check:

   ```text
   check-merge-ref-integrity.sh <manifest> <scan-root> [<resolve-base>]
   ```

   `<scan-root>` is the project dir `.gobbi/projects/{project-name}/`; `<resolve-base>` (arg 3, optional)
   defaults to `<scan-root>`. A clean run prints `REF-INTEGRITY OK` and exits 0. Do NOT run this gate when no
   merge manifest exists — a non-merging wrap-up has nothing for it to check.
3. The five standing post-promotion guards then run over the post-compaction tree — that guard set is owned by
   [`promotion.md § Post-promotion standing-guard green-check`](promotion.md#post-promotion-standing-guard-green-check)
   and runs on EVERY wrap-up independent of `settings.compaction.enabled`, so this doc does not re-list it. A
   green frontmatter validator alone is not completion evidence.

Promotion may advance to the Stage-3 memory-validation gate only when the final counts satisfy the hard-cap
decision rule AND the compaction gate (when applicable) plus every standing guard exit 0.

---

## Merged-file (MoC) write mechanics

A consolidated file is a Map *of* its sources, not a summary *of* them — it preserves each source as a
first-class, individually addressable `## ` section (the standard is owned by
[`memory/rules.md § 5.2`](../memory/rules.md#5-memory-compaction-the-consolidated--map-of-content-carve-out)).
When P4 writes the consolidated MoC file:

1. **Stamp the type template** from [`memory/templates/`](../memory/templates/) — the consolidated file keeps
   the merged sources' `type`.
2. **`name` = a new subject slug** — a fresh, descriptive subject slug for the consolidation (§1.3 naming),
   never a source's slug and never a positional index.
3. **`tags` = the union of the sources' tags**, each still within that type's controlled pool (§2.5); any
   overflow goes to `keywords`.
4. **`supersedes: [all source slugs]`** — the list form (many→one consolidation-merge, §2.4); it MUST equal the
   merge's source set exactly (the gate's Family 2 checks this both ways).
5. **One `## <source-slug>` section per source.** Copy each source's full type-required structure **verbatim**
   (a merged `mistakes` source keeps all four elements — What happened / Why it happens / Correct approach / How
   to detect); never blend two sources into one section or summarize a body down. The section heading slugifies
   to the source slug, so the stable anchor equals the manifest's `source_anchor`.
6. **A `## Sources` section** listing each archived original as a `[[slug]]` wikilink plus its `archived_path` —
   one bullet per merged source.

The archived source stays the frozen full-body recovery copy; the consolidated section is the live,
individually addressable copy. Consolidation is a documented subtype of supersession, so a reader meets a normal
`superseded` source whose `archive_reason: merged` says it lives on as a section of the consolidated file
([`memory/rules.md § 5.5`](../memory/rules.md#5-memory-compaction-the-consolidated--map-of-content-carve-out)).

---

## Merge manifest field names

The manifest is TSV; the field names and order match `check-merge-ref-integrity.sh` exactly. No header row;
each data row's first tab-field is the record kind.

- **MERGE row** — the `merge` kind plus six fields, one row per merged-away source:

  ```text
  merge<TAB>merged_away_slug<TAB>merged_away_active_path<TAB>archived_path<TAB>source_anchor<TAB>consolidated_slug<TAB>consolidated_path
  ```

- **SPLIT row** — the `split` kind plus three fields, one row per split-out section (optional):

  ```text
  split<TAB>split_out_anchor<TAB>consolidated_slug<TAB>new_home_path
  ```

A later split-on-retire ([`memory/rules.md § 5.3`](../memory/rules.md#5-memory-compaction-the-consolidated--map-of-content-carve-out))
— when one merged item terminates — records a SPLIT row, so a live `moc-slug#source-anchor` reference that must
follow the section to its `new_home_path` is caught by the gate's Family 1b (`STALE-ANCHOR`). This procedure
writes a `split` row only when a section is actually split out, never speculatively.

---

## Caps and the Always-Ask safety tier

- **Where the caps live.** The per-`{type}/{area}/` cap is project config, not prose:
  [`memory-vocabulary.json`](../memory/memory-vocabulary.json) holds `compaction.softCap` /
  `compaction.hardCap` (gobbi's instance: softCap 12 / hardCap 15), with an optional per-type
  `types.{type}.compaction.{softCap,hardCap}` override. The merge loop stops when the area is back to
  `live_count ≤ softCap`.
- **The Always-Ask safety tier — a hard rule, not a config knob.** `mistakes` and `rules` merges are
  **Always-Ask**: the merge surfaces through the manager's user-decision primitive
  ([`discussion/SKILL.md § Decision Classification`](../discussion/SKILL.md#decision-classification)) before it
  runs. Every other type's merge is auto within `settings.compaction.maxAutoActions`. This split is a hard rule
  of the standard ([`memory/rules.md § 5.4`](../memory/rules.md#5-memory-compaction-the-consolidated--map-of-content-carve-out));
  it is deliberately NOT a per-type config knob, so it cannot be silently disabled.
- **Over-`hardCap` cannot silently PASS.** When an area is over `hardCap`, the wrap-up cannot advance without an
  explicit decision — Always-Ask (merge a cluster / raise the cap / archive an oldest-terminal item /
  accept-with-acknowledgement), even when `settings.compaction.enabled` is `false`. An over-`hardCap` area with
  no related cluster is Always-Ask too — never an invented merge.

---

## Completion evidence

The compaction sub-procedure returns these facts to the Promotion stage before the Stage-3 gate:

- an always-count table covering every post-promotion `{type}/{area}/` (with each area's `live_count` and its
  effective caps);
- the terminal-archival and staleness decisions for each worked area;
- each candidate cluster and whether it was automatic, approved, declined, or unavailable;
- the final count for every changed area, plus an explicit Always-Ask disposition for every accepted final count
  above `hardCap`;
- each consolidated file and its archived sources;
- the TSV merge manifest when a merge occurred, and the reference-repoint sweep result;
- exit results for the compaction gate (when run) and the standing post-promotion guards.

An area over `hardCap` with no recorded Always-Ask decision is **incomplete**, even if every file and reference
guard is green.
