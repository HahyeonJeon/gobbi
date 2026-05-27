# Structure Perspective — T3 conform git-workflow (commit 2d01316)

## Frame
Frontmatter structure (§2.1 base + §2.2 per-type extensions), key ordering, type-aware allowlist safety invariant (§4.4: never strip a legit per-type key), filename/temporal-split (§1.2) conformance.

## Verified (own commands)
- **Base block well-formed** on all 20 docs: 9 base keys present, valid `type` enum values (decisions/design) + documented feature-subdir exception (discussions). `scope: feature` + `feature: git-workflow` correct for all.
- **Per-type extensions preserved (safety invariant §4.4 holds)**: decisions retain `supersedes`/`superseded_by`/`domain`; design retains `design-id`/`related`; discussions retain `loop`/`topic`/`outcome`. No legitimate per-type key was stripped. The strip was a type-aware allowlist, not a blanket grep — confirmed by inspecting the 3 decisions diffs (only the 8 S-keys removed, `domain`/`cost-impact`/`supersedes` kept).
- **Temporal split (§1.2)**: date-prefixed types correct — 2 decisions + 2 discussions carry `YYYY-MM-DD-` prefix; bare-slug design + bare-slug discussions correct. No filename renames in this commit (stable-address §1.1 rule 5 honored).
- **`description` populated** (one-line what-this-is) on all 20 — these were absent pre-commit and are now meaningful.

## Findings

### STRUCT-1 — Key ordering deviates from §2.1 canonical block order (cosmetic)
- **Type**: general · **Domain**: docs-sync · **Disposition**: open · **Confidence**: 70 · **Severity**: Low
- **Evidence**: In several docs the base keys are interleaved with extensions in non-canonical order — e.g., storage-bounds has `…tags → domain → cost-impact → supersedes`; rollback has `…tags → loop → domain → supersedes`. §2.1 shows base block as a contiguous 9-key unit; here extensions follow base, which is acceptable, but `loop`/`domain` placement varies doc-to-doc.
- **Why it matters**: Purely cosmetic — YAML is order-independent and all tools key-read, not position-read. §2.1/§2.2 do not mandate a strict serialization order. No functional impact; flagged only for completeness.
- **Suggested direction**: Optional — no action. Not a defect against any stated rule.

## Must-preserve
- The type-aware allowlist safety invariant (legit per-type keys all preserved).
- Correct temporal-split filenames; no destabilizing renames.

VERDICT: PASS
