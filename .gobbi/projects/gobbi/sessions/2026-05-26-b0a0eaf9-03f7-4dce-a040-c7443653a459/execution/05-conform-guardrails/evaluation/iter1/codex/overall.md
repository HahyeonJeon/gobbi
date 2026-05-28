## Findings

No findings.

Verification evidence:

- Leak gate over `features/guardrails/`: `LEAK_FILES=0` for the section 4.5 archive-safe, hyphen/underscore-aware staging-key scan.
- Conditional `disposition` gate: 3 backlog files preserve `disposition:` (`deferred`, `open`, `open`); non-backlog `disposition:` count is 0.
- Base schema: 10 live non-archive `features/guardrails/**/*.md` files checked; all carry the 9 base keys (`name`, `description`, `type`, `scope`, `feature`, `status`, `created`, `session`, `tags`).
- Commit scope: `git show --name-only 8e6ae25` lists only 9 changed paths, all under `.gobbi/projects/gobbi/features/guardrails/`.
- Backlog body reformat probe: the 3 backlog files were reshaped from ADR-style sections to backlog-template sections without losing the decision content. The former `Decision` + `Rationale` content is present under `Why deferred`; former `Alternatives considered` content is present under `Suggested approach`; former `Consequences` content is present under either `Suggested approach`, `When to pick up`, or `Originating session`.
- Non-backlog narrative spot check: README, checklists, discussion, and references changes are frontmatter normalization plus self-contained wording; body word counts were unchanged or increased, with no detected narrative deletion.

VERDICT: PASS
