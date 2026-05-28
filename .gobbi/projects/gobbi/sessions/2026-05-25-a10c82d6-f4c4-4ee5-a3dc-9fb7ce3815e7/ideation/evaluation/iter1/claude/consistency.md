# Consistency Perspective — Memory-System Redesign (iter1, claude)

## Artifact Summary + Memory reads

(See project.md for full summary — shared across perspectives.)

## Locked Frame (Stage 1)

**S1: Design sections describe the same problem as the audit/locks**
- Scope Contract (L1-L8) matches the design's content throughout.
- No design section solves a different problem than the audit identified.

**S2: 13 type specs internally consistent with the temporal split table (§4.2)**
- Each type's Naming section should match the temporal split table's classification.
- Date-prefixed types: notes, reviews, reports, changelogs, decisions, plans, archive entries.
- Bare-slug types: features, mistakes, rules, learnings, design, references, backlogs.

**S3: Frontmatter base (§5.1) consistent with per-type extension tables (§5.2)**
- No base field that conflicts with an extension field.
- No extension field that duplicates a base field.

**S4: Propagation plan (§7) covers all changes that the design specs mandate**
- If §2 specifies a change, §7 must list the file to update.
- If §5 mandates stripping `promoted-from`/`promoted-at`, §7 must cover the templates.

**S5: Internal cross-references are accurate**
- §2.3 decisions: "Anti-pattern killed (L5 atomicity)" — matches L5. ✓
- §2.5 mistakes: "17 of 20 mistakes retain mistake-candidate" — verified (actual: 17 of 20 non-README). ✓
- §3.3 per-perspective eval file naming cites `memory-map.md:38`. Let me verify.

**S6: The memory-map vs archive contradiction is correctly resolved (adversarial)**
- memory-map.md line 112 shows `archive/{slug}.md` (flat slug).
- Design §2.13 says typed-subdir wins (`archive/{type}/`).
- Is this explicitly added to §7 #3 as a fix?

**S7: The backlogs item count — design says "4 item-N-M- positional prefixes" but actual is 5**
- Verified: 5 items with item-N-M prefix in backlogs.

---

## Per-scenario per-check results

| Scenario | Result | Evidence |
|---|---|---|
| S1: Design matches audit/locks | PASS | All L1-L8 locks are honored; audit findings directly map to design sections |
| S2: 13 type naming matches temporal split | PASS | All 13 types checked against §4.2; no contradiction found |
| S3: Frontmatter base vs extensions | PASS | No field conflicts; `decision_status`, `priority`, `domain` are extensions, not base |
| S4: Propagation plan covers design mandates | PARTIAL FAIL | See F-CONS-01 |
| S5: Internal cross-references accurate | PARTIAL FAIL | See F-CONS-02 |
| S6: Archive contradiction in §7 #3 | PASS | §7 #3 says "resolve archive flat-vs-typed (typed wins)"; covered ✓ |
| S7: Backlogs item count off | FAIL | See F-CONS-03 |

---

## Typed findings

### F-CONS-01 — Propagation plan §7 #3 does not explicitly list the plans/{slug}.md → plans/{date}-{slug}.md fix

- **Type:** design_flaw
- **Domain:** docs-sync
- **Disposition:** open
- **Confidence:** 100
- **Severity:** Medium
- **Evidence:** `memory-map.md` line 108 shows project-level `plans/{slug}.md` using bare slug. Design §4.2 and §2.10 classify plans as date-prefixed. §7 #3 lists what memory-map.md must be updated with (add lock row, resolve archive, add cross-reference) but does not include "standardize plans/{slug} → plans/{date}-{slug} at project level." Without an explicit mandate in §7 #3, an Executor updating memory-map.md will miss this inconsistency.
- **Why it matters:** The design claims to establish a unified naming standard. If the plans naming inconsistency survives migration, the memory-map remains self-contradictory on this point.
- **Suggested direction:** Add one bullet to §7 #3: "Standardize project-level `plans/{slug}.md` path to `plans/{YYYY-MM-DD}-{slug}.md` to match the date-prefix rule (§4.2, §2.10); or explicitly state plans/ at project level is maintainer-authored and bare slug is acceptable for that tier."

### F-CONS-02 — §3.3 cites memory-map.md:38 but that line doesn't contain the per-perspective eval schema

- **Type:** design_flaw
- **Domain:** docs-sync
- **Disposition:** open
- **Confidence:** 75
- **Severity:** Low
- **Evidence:** §3.3: "per `memory-map.md:38`" — I checked memory-map.md; line 38 is in the Per-loop subtree table and says `{loop}/evaluation/iter{n}/{system}/{perspective}.md` with description "Per-perspective evaluation file — Artifact Summary + W/W/H + Locked Frame + Stage 2 verdicts + typed findings. `{system}` ∈ claude / codex; `{perspective}` ∈ project / structure / performance / aesthetics / usage / consistency / risk." So the citation IS accurate — line 38 does contain the canonical evaluation file naming. PASS on accuracy. But the reference format `:38` (line number) is fragile — if memory-map.md is edited during migration, line 38 may shift, making the citation stale immediately after execution.
- **Why it matters:** A line-number citation that will break on the very next edit to memory-map.md is worse than no citation. After §7 #3 updates memory-map.md, the line number for that row will likely shift. The citation in §3.3 will be stale as soon as migration runs.
- **Suggested direction:** Replace `:38` with a section anchor or a descriptive reference: "per `memory-map.md` § Per-loop subtree, evaluation row" rather than a fragile line number.

### F-CONS-03 — Backlogs item count: design says "4 item-N-M- positional prefixes" but actual is 5

- **Type:** design_flaw
- **Domain:** docs-sync
- **Disposition:** open
- **Confidence:** 100
- **Severity:** Low
- **Evidence:** Design §2.8: "the 4 `item-N-M-` positional prefixes (`item-1-2-…`, `item-1-3-…`, `item-2-1-…` — verified in `backlogs/`) are FORBIDDEN." `ls backlogs/` returns 5 files with item-N-M prefix: `item-1-2-broader-delegation-contract-verifier.md`, `item-1-2-skill-loading-discipline.md`, `item-1-3-symlink-into-worktree-alternative.md`, `item-1-3-two-surface-collapsing-strategy.md`, `item-2-1-auto-mode-silence-vs-always-ask.md`. The design's enumeration says the count is 4 but identifies only 3 prefix patterns — it missed counting two `item-1-2-*` files and two `item-1-3-*` files as separate items.
- **Why it matters:** The migration rename task (§8 cat B) says "~10-15 renames." An Executor following this inventory would rename 4 items but actually have 5 to rename. Minor but wrong.
- **Suggested direction:** Update §2.8 backlogs count to 5, and update the anti-pattern example to show both `item-1-2-*` files by listing them explicitly.

### F-CONS-04 — §5.1 frontmatter base includes "status" with no type-appropriate lifecycle values defined for all 13 types

- **Type:** design_flaw
- **Domain:** docs-sync
- **Disposition:** open
- **Confidence:** 75
- **Severity:** Medium
- **Evidence:** §5.1 base frontmatter: `status: {type-appropriate lifecycle value}`. §5.2 extension table lists status values for features (active|retired) but no status vocabulary is defined for most other types. For example: mistakes have no status value in §5.2 (though `accepted/superseded` is implied). Decisions have `decision_status: proposed|accepted|superseded` in §5.2 as an EXTENSION, which means the base `status` field is also present — this creates two status fields (base `status` + extension `decision_status`) that could carry conflicting information. Similarly backlogs have `disposition: open|deferred` as extension but what is the base `status` value for a backlog?
- **Why it matters:** An Executor implementing the frontmatter standard will face ambiguity: for decisions, do they set both `status` and `decision_status`? For backlogs, do they set both `status` and `disposition`? The overlap between the base `status` field and type-specific lifecycle extension fields is unresolved.
- **Suggested direction:** Either (a) define the vocabulary for `status` per type in §5.2 (one extra column in the extension table), or (b) clarify that `status` in the base is a GENERIC field and each type's spec defines the allowed values with the understanding that the type-specific extension field (like `decision_status`) is the authoritative lifecycle tracker. Option (b) requires naming which takes precedence.

---

## Low-confidence appendix

None.

---

## Per-perspective verdict: REVISE

Rationale: F-CONS-04 is Medium/75 (dual-status field ambiguity). F-CONS-01 and F-CONS-04 together are Medium findings that will cause Executor confusion. No single finding above High, but combined with multiple from other perspectives this is firmly REVISE.
