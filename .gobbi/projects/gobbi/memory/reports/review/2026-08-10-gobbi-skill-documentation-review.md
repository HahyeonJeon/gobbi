# Gobbi skill-documentation review

## Scope and result

This completed adversarial review covered the canonical Gobbi skill and agent documents. It examined document
quality and compactness, agent-facing instructions, cross-skill routing and ownership, lifecycle coverage, and
release-document consistency. It excluded whether any harness, CLI tool, permission, runtime primitive, or
external facility should exist.

The independent evaluation returned **PASS**. It found no High or Critical defect in the review itself. The
review retained 14 evidence-backed findings, each with alternatives and a preferred direction. No skill or
agent document changed during the review.

## Verified non-findings and release fact

- All tested local Markdown links in canonical `SKILL.md` files resolve. Named but unlinked skill nouns were
  assessed separately.
- The declared isolated-skill outbound-reference rule has no detected syntactic violation.
- The installed `gobbi-workspace` cache faithfully represents its own v1.1.2 tag. It is not defective.
- Current source still identifies itself as v1.1.2 while containing post-v1.1.2 Python and CLI families. This
  is source release-identity drift, not a historical-cache defect.

## Core correction bundles

1. **Entry and routing.** Define an accepted root-path input grammar, resolve the read-only entry-state and
   TODO-recording conflict, define cancellation and General-session recovery, and add deterministic task
   classification and cross-root precedence.
2. **Evaluation and finalization.** Make evaluator participation conditional on partner policy, require one
   shared finding envelope, and give Git one finalization procedure that Wrap-up calls for closure.
3. **Startup and validation.** Make Startup's questions manager-mediated, require caller-supplied artifact and
   overwrite boundaries, correct its output description, add a Startup eligibility gate, and either provide or
   explicitly limit representative-user validation ownership.
4. **Families and product support.** Add a small composition contract where mixed family work needs one;
   declare a supported-product boundary before adding broad new families; and require named project-local
   assurance and operations owners for unsupported product forms.
5. **Electron and Desktop.** Select one complete Electron lifecycle coordinator, then repair stale routes so
   installed behavior uses Electron Contract, candidate construction uses Packaging, and release starts from
   an accepted candidate.
6. **Agent and distribution surfaces.** Align wrapper portability, evaluator report-write boundaries, native
   runtime-control documentation, and package versioning before publishing current source content.

## User-owned architecture decisions

The review leaves four decisions to the user before a cross-skill rewrite:

1. Whether Gobbi holds runtime-only entry state or a selected owner creates the first state after handoff.
2. Whether Electron Delivery or Desktop Development owns the complete Electron desktop lifecycle.
3. Whether unsupported product forms require project-local owner skills before Startup accepts lifecycle
   promises, or Gobbi maintains new domain families.
4. Whether security assurance and live-service operations become narrow cross-cutting skills or remain
   explicit project-local requirements.

## Evaluation note

The evaluator confirmed the review's requested coverage, its seven independent input reports, its
evidence-to-claim distinctions, its in-scope boundary, and the v1.1.2 cache-versus-source distinction. Two
optional future improvements remain: add a compact raw-finding provenance map and state the Markdown-link test
boundary once more precisely.
