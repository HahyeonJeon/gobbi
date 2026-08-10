# Gobbi development lifecycle skill family completed

**Completed at:** 2026-08-10T15:36:42Z

## Changes

- Added the [Gobbi development lifecycle skill family](../design/feature/gobbi-dev-skill-family.md): one
  navigation-only root and seven direct children for development, testing, review, release, deployment,
  conventions, and toolchain guidance.
- Added repository-local Claude and Codex discovery while excluding the exact top-level family from plugin
  content. Bilateral validators now reject family-contract drift before changing their owned surfaces.
- Hardened installed-runtime smoke observation with separate source, helper, and production policies,
  authenticated traces, terminal closure, and Unix descriptor provenance. The
  [completed review](../reports/review/2026-08-10-gobbi-dev-skill-family-review.md) records the accepted static
  evidence and the user-assumed production-runtime limit.
