VERDICT: REVISE

## Artifact Summary + Memory reads
The risk surface is documentation-driven but high leverage: the mode contracts govern future sessions, subagent spawning, user gates, memory writes, and Wrap-up promotion. The artifact self-flags many risks in section 8; this review focuses on missed or under-rated risks.

### Memory reads
- Target draft read in full, especially sections 3, 5, 7, 8, and 9.
- Current source files and templates checked for file existence, schemas, and default values.
- Applicable mistakes: `skills-mirror-symlinks-not-copies.md`, `subagent-relative-write-paths-stray-cd-doesnt-persist.md` and related path mistakes for write-path discipline, `wrap-up-promotion-must-strip-staging-frontmatter.md`, `memorization-delegation-prompts-must-load-memorization-skill.md`, `manager-context-overflow-with-large-bundle.md`.

## Locked Frame (Stage 1)
Scenario 1: False file-state assumptions do not cause wrong writes or missing published docs.
- Check: Every central path is verified before Execution.
- Check: Missing `.claude` symlinks are planned if `.claude` consumers need them.
- Check: Risk severity reflects centrality to the deliverable.

Scenario 2: Chat narrowed staging does not lose durable memory if a session stops before explicit Wrap-up.
- Check: Corrections and mistake-candidates are still staged immediately.
- Check: Non-mistake typed findings have a survivable source if Wrap-up is never triggered.
- Check: Resume behavior for partial Chat sessions is explicit.

Scenario 3 (adversarial): The redesign creates a cost/context runaway or memory-retention problem across many Chat tasks.
- Check: Session-level task count, transcript size, and evaluation fan-out have limits or warnings.
- Check: Task records avoid sensitive verbatim user content unless retention is intentional.
- Check: Wrap-up mining is bounded and verifiable.

Coverage notes:
- Privacy/data retention: applicable because transcript and task records become Wrap-up inputs; no PII policy is stated.
- Cost/budget: applicable and also scored in Performance.
- Licensing/IP and dependency supply chain: not applicable; no new dependencies or borrowed code.
- Error budget: applicable as workflow failure/memory-loss risk.

## Per-scenario per-check results
Scenario 1:
- Central paths verified: no. The artifact leaves verification to Planning/R12 but already makes false claims.
- Missing `.claude` symlink plan: no. It says they already exist.
- Severity calibrated: no. R12 is Low despite verified absence of the files and symlinks.

Scenario 2:
- Mistakes staged immediately: yes, according to `draft-iter1.md:145`.
- Non-mistake typed findings survive without Wrap-up: partial/no. The draft says per-loop staging of typed findings does not happen in Chat (`:134`), and Wrap-up mines transcript/task records later. If the user closes without Wrap-up, non-mistake typed finding promotion is weaker than in Auto.
- Resume behavior explicit: partial. `draft-iter1.md:170` says partial session memory survives, but not how deferred typed findings are reconstructed.

Scenario 3:
- Session-level cap/warning: no.
- Sensitive content retention: no. Task-record field "what the user asked" may be verbatim or paraphrased (`draft-iter1.md:155`), but no privacy/data-retention guidance is given.
- Wrap-up mining bounded: no.

## Typed findings
- finding-id: codex-risk-484af650
- Type: assumption_risk
- Domain: docs-sync
- Disposition: open
- Confidence: 100
- Severity: High
- Evidence: `draft-iter1.md:426` marks placeholder/mirror verification as Low, but fresh file checks show both canonical mode docs and both `.claude` mirror paths are missing.
  Finding: The false placeholder/mirror assumption is under-rated. It can cause an executor to update non-existent files, skip required symlink creation, or leave the new mode specs invisible to `.claude` consumers. This is a central deliverable risk, not a low pre-flight nit.

- finding-id: codex-risk-79f7e024
- Type: assumption_risk
- Domain: privacy
- Disposition: open
- Confidence: 50
- Severity: Medium
- Evidence: `draft-iter1.md:155` allows task-records to store the user's ask verbatim or paraphrased; `:120-124` says Wrap-up mines transcript and all task records. No retention/privacy note exists.
  Finding: Chat task records create a new durable-ish session artifact that may capture user requests verbatim. The design should state whether task records avoid secrets/PII, prefer paraphrase, and remain session-scoped unless Wrap-up derives sanitized project memory.

- finding-id: codex-risk-3af0c72e
- Type: scenario_gap
- Domain: cost
- Disposition: open
- Confidence: 75
- Severity: High
- Evidence: `draft-iter1.md:65-67`, `:143`, and `:168` combine unbounded task count, always-on evaluation, and no auto-wrap after N tasks.
  Finding: The risk table misses a cost/context runaway scenario for long Chat sessions. Add an explicit risk and mitigation: status budget warning, user-confirmed continuation after threshold, or a Wrap-up suggestion that is advisory rather than automatic.

## Low-confidence appendix
- finding-id: codex-risk-low-1
- Suppressed at confidence 25: The backlog archive references in older sessions may or may not need repointing. `rg` found historical references, but session audit trails are usually immutable, so this is not scored.
