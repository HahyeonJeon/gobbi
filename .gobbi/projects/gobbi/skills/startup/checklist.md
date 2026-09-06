# Startup Checklist

> **Document role:** Reusable unchecked evaluation source<br>
> **Subject:** Startup skill families that finish as a conductor plus Interview, Project Design, Roadmap, and Bootstrap, and that must leave a project ready to start development<br>
> **Applicability:** A complete current Startup family and its accepted design evidence; Evaluation binds the exact files, revision, and intended operators<br>
> **Purpose:** Evaluate whether the family produces enough design, stack, first-check, and first-horizon order for a contributor to start development, without becoming a complete-design interrogation<br>
> **Scope:** Family contract, identity, gates, re-entry, topic coverage, specification templates, derivation, roadmap order, bootstrap first-check, Memory handoff, procedure, and document quality<br>
> **Exclusions:** Planning task hierarchies; feature implementation; publication and merge; operating product behavior; live interview answers from one run except as evidence for a bound target; general documentation, skill, and operation-skill quality already covered by those checklists<br>
> **Governing sources:** [Authoring Review](../authoring/authoring-review/SKILL.md), [Checklist](../checklist/SKILL.md), [Principles](../principles/SKILL.md), [Startup](SKILL.md), [Gobbi Skill](../gobbi-skill/SKILL.md), [Operation Skill](../gobbi-skill/operation-skill/SKILL.md), [Memory](../memory/SKILL.md), [Design Memory](../memory/design/SKILL.md), [Git](../git/SKILL.md), the accepted Startup design, and the owners the family delegates to<br>
> **Context:** Evaluate the conductor and its children as one work-artifact family. Documents and skills stay in Design and Development. Ready to start development means a contributor can begin without inventing missing design, stack, first-check, or first-horizon order. Apply the [Documentation checklist](../authoring/authoring-review/checklist.md), [Gobbi Skill checklist](../gobbi-skill/checklist.md), and [Operation Skill checklist](../gobbi-skill/operation-skill/checklist.md) in parallel.<br>
> **Checkbox meaning:** Check an item when evidence shows the problem is present.

## Project Lifecycle

### Purpose

#### The family does not define the readiness it promises

- [ ] The intended operator cannot be identified.
- [ ] The later contributor who should start development cannot be identified.
- [ ] The state a project must reach when the run finishes cannot be identified.
- [ ] The artifacts that prove that state cannot be identified.
- [ ] The family mixes a draft-interview goal with a complete-design goal.

#### The family can finish without the readiness it promises

- [ ] A named readiness artifact has no skill that produces it.
- [ ] A produced artifact serves no stated part of the readiness goal.
- [ ] The run can be reported complete while a stated readiness artifact is absent.
- [ ] The closing return omits the facts a contributor needs to begin work.

### Scope

#### The family boundary is missing, exceeded, or unfinished

- [ ] Planning task work is in scope for the family.
- [ ] Feature implementation is in scope for the family.
- [ ] Publication, push, pull request, or merge is in scope for the family.
- [ ] An agreed in-scope child, template, or handoff is absent.
- [ ] A fifth child or extra durable file kind is introduced without an accepted decision.
- [ ] The family performs work that a named downstream owner is said to own.
- [ ] A non-goal in one skill is contradicted by a step in another.
- [ ] An externally visible or irreversible action is permitted without the stated authority.
- [ ] A child writes outside the write set its own text declares.
- [ ] The boundary between the family's outputs and an existing project's files is unstated.

### Ownership

#### Identity or write ownership is split or invented

- [ ] Identity used by every child is derived in more than one place.
- [ ] A child continues when session root, target root, or project key is missing.
- [ ] A child invents identity that the contract reserves to the conductor.
- [ ] Two skills claim the right to write the same path or heading.
- [ ] A path required by the run has no named creator.
- [ ] A delegated stage does not name the identity relationship it authorizes.
- [ ] A delegated stage does not name the write boundary it authorizes.
- [ ] A delegated owner's rules conflict with the use the family makes of it.

### Change

#### The family drifts from its accepted locked design

- [ ] A locked decision has no counterpart in the delivered files.
- [ ] A delivered behavior contradicts a locked decision without a recorded supersession.
- [ ] Superseded guidance and current guidance are difficult to tell apart.
- [ ] An artifact the locked design ordered removed is still produced or still referenced.
- [ ] A later addendum and the base decision are both presented as current.

### Gates

#### A phase starts or finishes without the evidence its gate names

- [ ] A later child can start without inspectable acceptance evidence from the previous child.
- [ ] Acceptance is required in a Rule and is absent from the child's Procedure and template.
- [ ] File existence is treated as user acceptance.
- [ ] A gate names evidence that no artifact can carry.
- [ ] A gate names an output from a phase other than the one it follows.
- [ ] Two statements of the same start gate disagree.
- [ ] Phase order stated in the rules differs from the order the steps enforce.
- [ ] A blocking open topic does not stop the next child.

#### A resumed run cannot establish or preserve completed work

- [ ] A phase can be skipped without a stated condition.
- [ ] Re-entry can skip a phase whose output later development still needs.
- [ ] A stop condition names no way to resume.
- [ ] A resumed run cannot determine which phases already completed.
- [ ] Work already accepted is silently re-derived on resumption.
- [ ] A newly changed input does not mark the outputs it invalidates.
- [ ] Invalidated outputs are deleted rather than named for the user.
- [ ] A resumption entry point exists with no matching check that it is legitimate.
- [ ] Two resumptions of the same phase produce diverging results.

### Coordination

#### The conductor does not actually conduct

- [ ] The parent performs a child's work instead of loading the child.
- [ ] A child is loaded before its start gate is stated.
- [ ] The parent loads a downstream operation the family is forbidden to perform.

## Design and Development Lifecycle

### Interview

#### The interview is too thin for later work

- [ ] A core needed for stack, first-check, first-horizon order, or first useful outcome is absent.
- [ ] A family file states a topic count that the topic bank does not own.
- [ ] Recursion has no parent-before-child order.
- [ ] The subject set that later branches walk is never named.

#### The question set grows into a complete-design interrogation

- [ ] The topic set is spread across multiple banks, overlays, or aliases.
- [ ] The topic set is presented as a questionnaire that must be asked in full.
- [ ] Every core must be asked even when evidence already answers it.
- [ ] The number of questions asked is unbounded for an ordinary project.
- [ ] A follow-up may recurse without a stated depth or trigger limit.
- [ ] A topic is asked again for a subject that inherits the answer.
- [ ] A topic demands detail that a later phase is stated to own.

#### The walk cannot end or ends by invention

- [ ] No condition states when the interview is complete.
- [ ] A topic has no permitted unresolved state such as assumed or open.
- [ ] An unresolved topic that blocks later work is not distinguished from one that does not.
- [ ] A missing blocking answer is invented instead of stopping.
- [ ] A contradiction found later in the walk has no stated way to revise an earlier answer.

#### Interview results do not reach the design

- [ ] A topic that is asked has no destination in any specification template.
- [ ] A statement needed downstream is recorded only in a file the downstream phase does not read.
- [ ] The interview draft is copied into durable memory.

### Specification

#### A required specification source is unfillable from its stated sources

- [ ] A locked heading is missing from a template.
- [ ] A heading must be derived from topic ids that the template never cites.
- [ ] A required heading has no stated source or filling rule.
- [ ] Actors, scope, or behavior on a feature specification have no source and no named question.
- [ ] The same information is required in two templates without one owner.

#### A template cannot express a required case or mark its gaps

- [ ] A heading may be deleted when it does not apply.
- [ ] An unfilled heading and a genuinely inapplicable heading look identical.
- [ ] An open item does not state what would resolve it.
- [ ] A required table's columns are left to the writer.
- [ ] The stack table cannot record local versus later cloud.
- [ ] A multi-subject answer is flattened so the owner of a stack, interface, or task is lost.
- [ ] A refused use is written as a feature file.
- [ ] Zero features cannot be stated explicitly.

#### The specification is insufficient to begin work from

- [ ] A feature specification omits the behavior a contributor must implement.
- [ ] Alternate, invalid, failure, or recovery behavior has no place in the specification.
- [ ] Structure, data, or interface expectations have no place in the specification.
- [ ] Constraints and qualities that bound the work have no place in the specification.
- [ ] The evidence that would show the work is correct has no place in the specification.
- [ ] Nesting or repetition in a template exceeds what the ordinary case needs.

### Derivation

#### Design statements are invented or left open where development needs an answer

- [ ] A skill permits a design statement with no recorded source.
- [ ] A missing answer is filled by the agent instead of raised to the user.
- [ ] A derived file contradicts the answer it cites.
- [ ] A scheduled first-horizon feature can complete with Open actors, scope, or behavior.
- [ ] Local-stack rows can be Open and still pass Project Design completion.
- [ ] Open questions on a design or roadmap file have no blocking flag.
- [ ] A statement's certainty exceeds the evidence recorded for it.
- [ ] Stale content from an earlier run survives beside a contradicting new statement.

### Roadmap

#### The horizon order cannot be executed as written

- [ ] First-horizon order has no document.
- [ ] First-horizon order has no mechanical feature-placement check.
- [ ] A unit of scope appears in no horizon and in no deferred list.
- [ ] A unit of scope appears in more than one horizon.
- [ ] Every feature can sit in Not scheduled while the family still claims a first-horizon order.
- [ ] A horizon states no entry condition.
- [ ] A horizon states no exit evidence.
- [ ] The first horizon depends on capability a later horizon delivers.
- [ ] The ordering rule between an early and a later environment is unstated.
- [ ] The roadmap contains task decomposition, dates, estimates, or assignees it excludes.
- [ ] No observation is named that would require the order to be revised or the work to stop.

### Bootstrap

#### The smallest repository cannot be created or proved

- [ ] Completion rests on files existing rather than on a check that runs.
- [ ] The first-check command cannot be derived from recorded local-stack rows and the First check heading.
- [ ] A command that ignores the toolchain can satisfy first-check.
- [ ] No stated behavior covers a check that fails.
- [ ] A failing check can be retried without limit.
- [ ] The bootstrap chooses a stack that design did not record.
- [ ] The bootstrap proceeds when the recorded stack or First check heading is absent or self-contradictory.

#### Bootstrap damages or ignores what the target already has

- [ ] An existing stack-root file may be overwritten to match a template.
- [ ] An existing README with no first-check is treated as success.
- [ ] An existing file that would break the check produces no reported conflict.
- [ ] Repository history is created when the target is already a repository.
- [ ] Repository history is created or altered without a stated condition.
- [ ] Files are created that no stated need requires.
- [ ] Empty directory structure is created as a stand-in for work.
- [ ] Secrets or real configuration values are written.

### Handoff

#### Durable design is missing, copied blindly, or placed under the wrong name

- [ ] Session drafts are never Memorized into the locked Design Memory paths.
- [ ] A session draft required for the durable result has no presence check.
- [ ] Memorize is called without the session identity Memory requires.
- [ ] The durable write set differs from the set the contract locked.
- [ ] Locked Startup filenames are merged into older differently named design files.
- [ ] Navigation is not updated when a durable file is added.
- [ ] A second run duplicates navigation entries.
- [ ] Unrelated existing design links are dropped.
- [ ] A durable file left behind by an earlier run is neither updated nor reconciled.
- [ ] A Memory commit is invented after a verified no-change Memorize.
- [ ] A change that should be committed is left uncommitted without a stated reason.

### Procedure

#### The procedure cannot be executed as written

- [ ] A mandated action cannot be performed with the tools the skill grants.
- [ ] A granted tool serves no action in the skill.
- [ ] A step governs a path that nothing in the family produces.
- [ ] A branch cannot be reached by any supported run.
- [ ] A step's stated precondition differs from the input it actually reads.
- [ ] An instruction conflicts with the governing source that owns the same subject.
- [ ] A step can appear complete without the evidence needed to continue or return.
- [ ] An ordinary target name fails a format check with no recovery offered.
- [ ] A required failure, stop, or recovery path is absent.
- [ ] A write lacks its output path or access boundary.
- [ ] Supporting text introduces an operating rule that Procedure never states.
- [ ] A supported target shape has no stated path through the run.

### Documentation

#### Prose or structure hides the contract

- [ ] One concept is named with inconsistent terms.
- [ ] Related files state conflicting versions of the same rule.
- [ ] Acceptance, identity, or path fields are described and not present in the template.
- [ ] A heading, table, or list makes the ordinary path harder to find.
- [ ] A reference points to a document that does not resolve.
- [ ] An owner needed to use or maintain the skill is absent from its references.
- [ ] Guidance for one subject is scattered across files with no clear owner.
- [ ] A reader must hold private authoring context to know which guidance applies.

### Classification

#### The family is classified or bounded incorrectly

- [ ] The parent is not an operation conductor.
- [ ] A child is not an operation.
- [ ] A skill that must not mutate the target is granted tools that write the target.

## Product Lifecycle

No supported coverage for this lifecycle.
