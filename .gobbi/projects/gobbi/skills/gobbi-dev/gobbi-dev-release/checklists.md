# Gobbi Release Checklists

Use these unchecked conditions while applying the parent release operation. They neither grant authority nor
replace its identity, order, Evaluation, acceptance, publication, or recovery rules.

## Candidate Preparation

- [ ] The caller supplied one exact stage, `prepare`, `evaluate`, `promote`, `publish`, or `recover`, with its
  allowed effects, semantic version, release scope, criteria, targets, and expected states.
- [ ] The requested stage met its entry gate and did not replay an earlier stage or authorize a later effect.
- [ ] `develop` is clean and identifies the exact candidate commit and tree.
- [ ] Both plugin manifests and the Claude marketplace entry contain the same approved version.
- [ ] Canonical sources, generated local views, filtered package files, and included bytes satisfy their owners.
- [ ] Required source, fixture, shell, link, package, and real installed-runtime checks passed without a static
  substitute.
- [ ] The freeze records commit, tree, version, metadata, package tree, filtered inventory, per-file hashes,
  digest, checks, environments, evidence limits, expected `main` and tag targets, exact annotated-tag message,
  hosted title, notes digest, draft or prerelease state, and exact asset paths and digests.
- [ ] A successful prepare receipt binds the freeze, stage, allowed and completed local effects, retained state,
  and limits, and preparation stopped before Evaluation.

## Evaluation and Acceptance

- [ ] The subject supplied to Evaluation is byte-for-byte and identity-for-identity equal to the freeze.
- [ ] The exact annotated-tag message, hosted title, notes digest, draft or prerelease state, and asset paths and
  digests were recomputed and matched immediately before Evaluation handoff.
- [ ] A successful Evaluation-handoff receipt binds the prepare receipt, unchanged identity, publication
  identity, criteria, read-only handoff, allowed effects, and limits, and the operation stopped for Evaluation.
- [ ] The evaluator is independent and used the caller's exact criteria.
- [ ] The report names the candidate, method, evidence, gaps, limits, problems, and criteria-derived verdict.
- [ ] The manager or user accepted the same exact candidate only after the Evaluation verdict.
- [ ] Acceptance is not recorded as Git, network, credential, hosted-publication, or cleanup authority.

## Promotion and Hosted Publication

- [ ] The `promote` request supplied the matching Evaluation result; Step 2.3 then obtained and recorded manager
  or user acceptance for that exact candidate before any Phase 3 promotion effect.
- [ ] Publication began only from a separate `publish` request naming a verified promotion receipt.
- [ ] `develop`, the candidate, package digest and inventory, metadata, repository, `main` preimage, tag state,
  remote state, and hosted expected state were reobserved immediately before effects.
- [ ] Git received exact point-of-action authority for the named branch, ref, annotated tag, remote, and effect.
- [ ] The verified `main` commit and peeled annotated tag target equal the accepted candidate.
- [ ] The promotion receipt binds the candidate, Evaluation, acceptance, exact Git effects and observations,
  current refs, retained objects, and evidence limits before any hosted publication.
- [ ] Hosted authority names the repository, tag, title, notes, state, assets, network, credentials, and expected
  results.
- [ ] The hosted release identifier, URL, tag, target, title, notes digest, state, asset names, sizes, and
  digests match the accepted specification.
- [ ] No accepted byte or metadata was rebuilt, altered, overwritten, force-published, or inferred.

## Recovery

- [ ] Recovery began only from a `recover` request naming the observed partial state, exact action, expected
  states, allowed effects, and current owner-specific authority.
- [ ] The first failure stopped all later effects.
- [ ] Current branches, tag, hosted release, assets, candidate, and package were observed directly when allowed.
- [ ] Every effect is labeled not attempted, compatible no-op, completed, failed, unavailable, or retained.
- [ ] The receipt records the first useful sanitized diagnostic, risk, limits, owner, unique objects, and first
  non-mutating recovery action.
- [ ] Any recovery mutation has a new exact action, matching current expected states, and fresh owner-specific
  authority.
- [ ] Unproved or incompatible refs, releases, assets, packages, and candidates remain preserved.
