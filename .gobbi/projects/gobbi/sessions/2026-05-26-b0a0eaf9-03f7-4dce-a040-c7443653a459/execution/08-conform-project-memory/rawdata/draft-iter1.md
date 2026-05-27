# T8 — Conform features/project-memory/ to dev-doc standard §4

## Baseline

§4.5 gate pre-edit: 3 files failing
- changelogs/2026-05-26-bundle-a-rehome.md (task key)
- decisions/path-conventions-anchor-casing.md (mistake-candidate, promoted-at, promoted-from, loop, slug, disposition)
- design/memorization-moment-of-capture.md (promoted-from, loop, iter, promoted-at)

Cryptic titles check pre-edit: 0 files (gate already clean)

## Per-file plan

### README.md
- Add: name, description, type, session, tags
- Remove: project (not a base or features-extension key), last_updated (not a base or features-extension key)
- Keep: scope, feature, status, value_proposition, created
- Title is fine: "Feature: Project Memory" — concept-first, no cryptic codes
- No body reshaping

### changelogs/2026-05-26-bundle-a-rehome.md
- Add: name, description, type, created, tags
- Remove: task (S-key), date (not standard — date is in filename, created goes in frontmatter), plan (not a changelogs extension)
- Keep: session, scope, feature, status
- Add: shipped_in (changelogs extension) — from body ("PR #266 (b9970dc)")
- Title: "Bundle A re-homed — project-memory's share" — concept-first, fine
- Body inline: "W3-T2" → de-crypt to "memory-system redesign task W3-T2" → context: "during memory-system redesign" (already in body)
  - "§8 rule 1" → "routing rule (design §8 LOW-16)" — already has context around it
  - "T02/T04" in Related → these are internal task codes in Related section = inline coord; de-crypt by expanding
  - "LOW-16" is a design doc internal reference — acceptable as it's a stable doc reference, not session-coord

### decisions/path-conventions-anchor-casing.md
- Add: name, description, tags
- Remove: slug (S-key), loop (S-key), mistake-candidate (S-key), promoted-from (S-key), promoted-at (S-key)
- Remove: disposition (S-key, not under backlogs/)
- Remove: project (not a base or decisions-extension key)
- Remove: date (not standard; date is in filename for decisions — but wait, this file has bare slug, not date-prefixed! decisions should be date-prefixed per template. However scope says mechanical conformance only — filename rename is out of scope)
- Fix: type = "design_flaw" → "decisions" (wrong type enum value; this is a decisions/ file)
- Keep: title (KEEP list), domain (KEEP list), supersedes, superseded_by, session, scope, feature, status, created
- decision_status: not present — add with appropriate value (accepted, since it was adopted)
- Title "Path conventions anchor casing — promote to H3" — concept-first, fine
- Body inline: "Concern 2" → de-crypt (it's a session-internal evaluator finding code); "Task 05" → de-crypt
  - "memorization/SKILL.md:224" — this is a file:line reference, NOT a session coord; legitimate
  - "draft-iter1.md" in body → session artifact reference; de-crypt

### design/memorization-moment-of-capture.md
- Add: name, description, type, created, tags
- Remove: loop (S-key), iter (S-key), promoted-from (S-key), promoted-at (S-key), topic (S-key — wait, topic is a KEEP key!)
  - Checking §4.4 KEEP: "related/supersedes/superseded_by/source/design-id/domain/priority/ref_type/title/accessed/verdict/decision_status/shipped_in/value_proposition/discussion-id/topic/outcome/category/project/last_updated"
  - topic IS in KEEP list — preserve it
  - So only strip: loop, iter, promoted-from, promoted-at
- Fix: status "final" → "active" (not a valid status value for design type)
- Keep: date (not standard but date is in frontmatter as created after adding)
  - Actually "date" is not a base key and not a design extension — should remove and use "created"
- Title "Design B — Memorization Moment-of-Capture Core Principle" — "Design B" is a session coordinate
  - De-crypt: → "Memorization Moment-of-Capture Core Principle"
- Body inline: "I6" → de-crypt (ideation insight 6 = session coord)
  - "T1/T2/T5" → de-crypt (task codes)
  - "γ" (pathology gamma) — this is a named concept, not a session coord; keep but clarify inline
  - "item B" → session coord; de-crypt
  - "Bundle A" → this is a real artifact name (PR #266), not session coord; keep
  - "draft-iter1.md" not in this doc
  - "2026-05-22-bac669ad" — session ID reference in Rationale, used as provenance; acceptable as a session pointer in this context

## KEEP key audit
- related: present in some? No — not currently present in any
- topic: present in design doc — must preserve
- title: present in decisions doc — must preserve  
- domain: present in decisions doc — must preserve
- supersedes/superseded_by: present in decisions doc — must preserve

## Session ID for README
- README is missing `session` — needs the session that created this feature dir
- From changelogs: "W3-T2" session is a10c82d6-... 
- From README "Recent activity": "session: a10c82d6"
- Full session ID: from changelogs frontmatter: a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7 — but README creation session might be different
- The README says "Feature dir created during memory-redesign W3-T0" and the worktree is "session-2026-05-25-a10c82d6"
- The changelogs session is a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7
- Use this same session for README (same session cluster); created: 2026-05-26
