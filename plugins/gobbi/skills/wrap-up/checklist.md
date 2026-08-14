# Wrap-up Checklist

> **Document role:** Reusable unchecked evaluation source<br>
> **Subject:** Wrap-up work and response-only Notes produced through the Wrap-up operation<br>
> **Applicability:** General Wrap-up evaluation; Evaluation binds the exact accepted closure, Memory result, frozen and integrated trees, Git evidence, terminal state, and Note<br>
> **Purpose:** Provide baseline coverage for closure governance, durable Memory, exact-tree integration, recovery, and factual Note reporting before target-specific items are added<br>
> **Scope:** Acceptance and authority, closure boundaries, Memory reconciliation, verification and tree identity, commit and merge evidence, retained recovery state, and the final Note<br>
> **Exclusions:** Quality of the already accepted work except its preservation through closure; detailed Memory-category or Git behavior outside Wrap-up's use; Workflow orchestration outside closure; operating product behavior<br>
> **Governing sources:** [Checklist](../checklist/SKILL.md), [Evaluation](../evaluation/SKILL.md), [Principles](../principles/SKILL.md), [Wrap-up](SKILL.md), [Note template](templates/note.md), [Memory](../memory/SKILL.md), [Git](../git/SKILL.md), and the accepted closure contract<br>
> **Context:** Evaluate the closure evidence, durable Memory result, Git result, and Note as one subject. Apply the [Documentation checklist](../execution/docs/checklist.md) to the Note in parallel and add target-specific items after study.<br>
> **Checkbox meaning:** Check an item when evidence shows the problem is present.

## Project Lifecycle

### Closure Governance

#### Closure begins from unclear or unsupported acceptance, identity, or authority

- [ ] The exact accepted work and its acceptance evidence cannot be identified.
- [ ] A material unresolved decision remains while closure proceeds.
- [ ] The session or project Memory boundary is missing, ambiguous, or conflicts with the accepted work.
- [ ] The repository, base, work branch, worktree, or session identity is missing, ambiguous, or conflicting.
- [ ] Required commit or merge authority is absent, stale, or broader than the accepted closure.
- [ ] An active writer, unrelated change, or protected path remains unresolved when mutation begins.

#### Closure crosses its accepted scope or ownership boundaries

- [ ] A tracked change in the closure cannot be traced to the accepted work or closure-owned Memory update.
- [ ] A Memory change lands outside the supplied project Memory root.
- [ ] Closure changes accepted work instead of preserving it for separate authorized repair.
- [ ] A participant performs an acceptance, Memory, Git, or recovery decision owned by another actor.
- [ ] The response-only Note becomes a tracked closure artifact.

## Design and Development Lifecycle

### Memory Reconciliation

#### Durable Memory becomes stale, fragmented, duplicated, or historically inaccurate

- [ ] The full session root or related existing Memory is not reviewed before durable changes are chosen.
- [ ] A Memory change lacks an applicable category owner.
- [ ] Session-shaped content is appended when existing durable context should be updated or merged.
- [ ] A current fact remains stale or appears in unexplained duplicate records after closure.
- [ ] A completed point-in-time record is rewritten as though it were current-state documentation.
- [ ] A move, merge, reorganization, or removal leaves navigation or related retained content inconsistent.
- [ ] A durable Memory action lacks a present reason or direct verification.
- [ ] A justified no-change result is unproved or replaced with a needless Memory write.

### Tree Integrity

#### The closure loses the accepted verified tree before integration

- [ ] An accepted task commit or closure-owned change is absent from the verified closure tree.
- [ ] The verified closure tree contains an unrelated, protected, or unowned change.
- [ ] Closure verification applies to different content from the tree later committed or integrated.
- [ ] The closure tree, work head, base head, or base checkout state is not frozen before Git mutation.
- [ ] Worktree drift after verification is missed or accepted without repeating the responsible closure step.
- [ ] Base head or tree drift is missed or accepted before integration.

### Git Integration

#### Git integration changes or fails to prove the accepted result

- [ ] Closure-owned changes remain uncommitted while integration is reported complete.
- [ ] An already-complete accepted head is replaced with a needless closure commit.
- [ ] The closure commit tree differs from the verified closure tree.
- [ ] The closure commit lacks exact revision, tree, scope, or authority evidence.
- [ ] Mutable Git state or authority is not rechecked before a dependent action.
- [ ] Wrap-up issues an unauthorized merge, resolves a conflict, or changes accepted work outside the caller contract.
- [ ] The resulting base tree differs from the accepted work tree.
- [ ] The base heads, trees, merge form, or checkout state before and after integration is unproved.

### Recovery

#### A stopped closure loses safe and exact recovery state

- [ ] Mutation continues after a required stop condition is observed.
- [ ] A unique commit, branch, worktree, or other recoverable object is lost or left unprotected.
- [ ] The exact failed or unattempted action cannot be distinguished from completed work.
- [ ] The base checkout's status or active Git operation is unknown after integration stops.
- [ ] The recovery owner or first safe recovery command is missing or unsupported by the retained state.
- [ ] Recovery performs a new mutation without the authority and evidence required for that action.

### Note Reporting

#### The final Note is missing, incomplete, or misleading

- [ ] A terminal path returns without one response-only Note.
- [ ] The Note type, status, session, assignment, or recorded time conflicts with the closure evidence.
- [ ] Context is insufficient for a cold reader to understand the purpose, requirements, scope, exclusions, decisions, sources, and acceptance.
- [ ] A material delivered result or its evidence is absent from Work.
- [ ] A Memory row omits the category owner, change and reason, affected paths, or verification.
- [ ] A verification row reports a claim without its method, factual result, and evidence.
- [ ] A Git row omits a material accepted-work, commit, base, merge, branch, worktree, or observation state.
- [ ] An intended, unavailable, deferred, failed, or unproved action is described as completed.
- [ ] A remaining concern, preserved unrelated change, retained object, recovery owner, or first safe command is omitted.

## Product Lifecycle

No supported coverage for this lifecycle.
