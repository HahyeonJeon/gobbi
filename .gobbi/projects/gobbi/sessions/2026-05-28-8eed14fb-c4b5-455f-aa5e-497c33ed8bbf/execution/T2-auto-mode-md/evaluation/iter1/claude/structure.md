# T2 auto-mode.md — Structure Perspective (iter1, claude)

## Artifact Summary

(See `project.md`.)

## Memory reads

- Idea §4 / Plan T2 / discussion/SKILL.md / planning/SKILL.md / chat-mode.md (companion)
- `mistakes/section-order-is-part-of-the-contract-not-just-the-set.md`

## Locked Frame (Stage 1)

**Scenario S1.** Section structure is sound and navigable.
- [x] Numbered §1–§6 + Cross-references — six top-level sections
- [x] Each section has a one-line role declaration
- [x] Sub-sections (§2.1–§2.4) at depth ≤ 3 — scannable

**Scenario S2.** Refer-don't-duplicate: spec defers source-of-truth to existing skills.
- [x] §2.1 names `discussion/SKILL.md § Always-Ask categories (override auto-decide; the user decides)` as authoritative; §2.2 restates in Auto-flavored language only
- [x] §2.4 USER CHALLENGE is by reference, not re-spec
- [x] §5 cites `orchestration/SKILL.md` line 405 contract (verified live: SKILL.md line 405 says "`maxIterations` exhaustion in Auto Mode does NOT interrupt the user.")
- [x] §4 last paragraph defers banner injection to harness

**Scenario S3.** Companion-doc symmetry with chat-mode.md.
- [x] Both open with "Sub-document of the orchestration skill" framing
- [x] Both have a Cross-references section at the foot
- [x] Both use §N numbered headings — consistent

**Scenario S4 (adversarial).** Internal contradictions or duplicate authority claims.
- [x] §3 and §6 carry the same defaults table — but §3 is the spec table (with notes), §6 is the recap (mirrors Idea §5 schema). Both label the same values; no contradiction
- [x] §2 says "Always-Ask overrides discuss.mode unconditionally" AND §3 row 5-7 confirms "Always-Ask categories still fire (§2)" — coherent

## Stage 2 — Structure verdict

- **Verdict: PASS.**

## Findings

### F-S1 (Medium / Conf 50, open) — §3 and §6 are duplicate defaults tables

**Evidence.** Lines 90–102 (§3 main defaults table) and lines 164–178 (§6 "Settings defaults (Auto mode)" table) encode the same 11 fields with identical values. The §6 table cites "The full Chat-vs-Auto settings comparison lives in the Idea doc" as its sole purpose. Within a single 202-line doc, duplicating the defaults raises the maintenance surface: if a future change updates one table only, the doc internally contradicts.

**Why it matters.** A single-file source-of-truth is structurally simpler than two tables that may drift. The §6 table does not add information beyond §3.

**Type/Domain/Confidence/Severity/Disposition.** general / docs-sync / 50 / Medium / open.

**Suggested direction (not prescriptive).** Either drop §6 entirely and let §3 stand, or have §6 explicitly say "Reference recap — see §3 for normative table" + drop the duplicated cells.

## Low-confidence appendix

- (Conf 25) §1's "When the manager MUST interrupt" 1-4 list overlaps §2 (which restates the same Always-Ask trigger). Minor; the §1 list is broader (it also lists eval-finding-scope-change + step-failure-BLOCKED triggers that §2 doesn't cover), so the overlap is defensible.
