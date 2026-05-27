---
name: memorization-moment-of-capture
description: "Design for adding a Moment-of-Capture Core Principle to memorization/SKILL.md, enforcing write-as-you-go during WORK"
type: design
scope: feature
feature: project-memory
status: active
created: 2026-05-23
session: 7ea62d36-e826-4ce6-9e90-9e948007b068
tags: [memorization, moment-of-capture, write-as-you-go, core-principle]
topic: memorization-moment-of-capture
supersedes: null
superseded_by: null
related: []
---

# Memorization Moment-of-Capture Core Principle

**Chosen direction**: Add new Core Principle bullet "Moment-of-capture, not end-of-loop" to `memorization/SKILL.md § Core Principles`, after "Store what survives, not what's transient" and before "Templates over freeform". Body: 2-3 sentences stating corrections/decisions/mistake-candidates are written to staging/rawdata at moment-of-occurrence during WORK, not deferred to MEMORIZATION. Reciprocal link to `mistake/SKILL.md` P2.

**Rationale**: The write-as-you-go discipline gap exists in WORK, but the corrective documentation lives in MEMORIZATION's contract. Adding it as a Core Principle makes it visible to every agent that loads memorization for any reason. The witness: session `2026-05-22-bac669ad` had full evaluations but empty staging, because corrections from DISCUSSION were never written at moment-of-occurrence. `mistake/SKILL.md` P2 already says "Do not defer to MEMORIZATION" — the reciprocal link from memorization to mistake closes the loop.

**Validation**: `grep "Moment-of-capture\|moment-of-capture" memorization/SKILL.md` returns ≥ 1; `grep "memorization/SKILL.md" mistake/SKILL.md` returns the reciprocal link.

**Cross-links Bundle A creates**: memorization/SKILL.md § Core Principle "Moment-of-capture" → mistake/SKILL.md § P2; mistake/SKILL.md § P2 → memorization/SKILL.md § Core Principle (reciprocal).
