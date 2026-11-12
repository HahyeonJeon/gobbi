# Authoring Mistakes

## The exploration stop "no further question would add an entity" does not bound grain

**Context:** Recursive Exploration stops when no further question would add an entity the materials support,
or when the caller named the last question. A Web UI test stopped at 39, 93, and 274 entities.

**Mistake:** Treating "no further question would add an entity" as a bound on grain. That stop does not fix
how fine the record is.

**Correction:** The caller names a last question when the goal is a definition rather than a full catalog.

**Seen:** 2026-10-18 (526eee31)
