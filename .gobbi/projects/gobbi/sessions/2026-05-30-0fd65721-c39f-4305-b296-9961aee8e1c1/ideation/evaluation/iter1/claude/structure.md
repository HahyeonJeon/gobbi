# Structure — Ideation eval iter1 (claude)

## Artifact Summary + Memory reads
(See project.md for full Summary + Memory reads register.) Structure lens: is the proposed decomposition of the two deliverables sound, boring-by-default, and testable?

## Locked Frame (Stage 1)
- **S1 Components cohere — each owns one concern, unidirectional deps.** (a) no circular deps in the proposed plugin↔skill↔mirror decomposition; (b) each component's concern named.
- **S2 Skeptical reader maps every checklist item to a structural element.** (a) design decisions name the concrete artifact (plugin.json key, hooks.json, file path); (b) each decision anchored to a research insight.
- **S3 Boring-by-default — no novel pattern where existing suffices.** (a) alternatives documented; (b) any novel choice spends an innovation token w/ rationale.
- **S4 Two-week smell test — maintainer understands from artifact alone.** (a) no magic components; (b) terms defined.
- **S5 Testability first-class.** (a) verification hooks named per decision; (b) validation method per DD.
- **S6 (adversarial) Decomposition hides a circular dep or shared-state hub.** (a) plugin/mirror/skill data-flow acyclic; (b) no coordinator-touches-everything.

## Per-scenario per-check results
- **S1a** YES — three components (plugin manifest, hooks.json registration, claude-plugin skill) are independent; the manifest declares, the skill documents, the mirror is downstream. No cycle. **S1b** YES — each concern named (DD-1 breadth, DD-2 layout, DD-3 hooks, DD-6 skill).
- **S2a** YES — DD-2 names `./.gobbi/projects/gobbi/skills/` + `agents/`; DD-3 names `hooks/hooks.json` + `${CLAUDE_PLUGIN_ROOT}/hooks/session-start.sh`; DD-6 names canonical path + mirror symlink. Concrete enough for a Planner to lift. **S2b** YES — every DD carries an "Anchored:" line to a named ref/insight; I confirmed each ref exists and supports the claim.
- **S3a** YES — DD-1 lists options A/B/C; DD-2 A/B/C; DD-4 A/B/C; DD-5 A/B. Alternatives documented. **S3b** YES — boring path chosen throughout (mirror the proven `.codex-plugin` directory-pointer; reuse install-runtime feature; no new abstraction). No innovation token spent.
- **S4a** YES — every element matches an existing pattern (codex-plugin manifest, existing mirror symlinks, existing hooks). **S4b** PARTIAL — `${CLAUDE_PLUGIN_ROOT}`, `@skills-dir`, ADDS-to-vs-REPLACE are used without inline glossary, but each traces to a staged ref. Minor; see F-S1.
- **S5a/b** YES — each DD has a "Validation:" line (validate CLI, cache-copy presence check, readlink, post-install hook-fire). Testability is explicit and matches the markdown-driven verification model (JSON-validity/symlink-integrity, no test suite).
- **S6a** YES — I traced: plugin.json → points at canonical files (read-only ref); skill → documents; mirror symlink → one new edge (claude-plugin skill). The new mirror symlink for claude-plugin is the only structural addition; it follows the established per-file-symlink pattern. No cycle, no hub. **S6b** YES — no coordinator object.

## Typed findings

**F-S1** — Type: checklist_gap · Domain: docs-sync · Disposition: open · Confidence: 50 · Severity: Low
Evidence: The agents-key REPLACE semantics is a latent structural trap the draft does not flag: the manifest-schema ref (L20) states `agents` REPLACES the default `agents/` dir while `skills` ADDS-to. The draft's checklist L202 says "component keys per DD-1/DD-2" but never surfaces that pointing `agents` at `./.gobbi/.../agents/` will REPLACE (not augment) the default scan — benign here (gobbi has no default `agents/` at plugin root) but a structural footgun the skill (DD-6) should teach. Why it matters: a future plugin author following the gobbi skill could silently lose default-dir agents. Suggested direction: add an Execution/skill checklist item distinguishing ADDS-to (skills) vs REPLACE (agents/commands/outputStyles).

## Per-perspective verdict: PASS
