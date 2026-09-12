# Documentation Checklist

> **Document role:** Reusable unchecked evaluation source<br>
> **Subject:** Documentation work and documentation artifacts<br>
> **Applicability:** General documentation self-review and evaluation; the applying operation binds the exact artifact, revision, and intended readers under review<br>
> **Purpose:** Provide baseline coverage for trustworthy, clear, compact, usable, and maintainable documentation during Authoring Execution self-review and independent review<br>
> **Scope:** Purpose, scope, change coverage, content, structure, headings, prose, vocabulary, lists, tables, readability, complexity, reader use, reading contexts, and maintenance<br>
> **Exclusions:** Product behavior beyond the documentation artifact; domain-, document-type-, accessibility-, locale-, safety-, privacy-, and sensitivity-specific expectations not activated by the target<br>
> **Governing sources:** [Authoring Review](SKILL.md), [Checklist](../../checklist/SKILL.md), [Principles](../../principles/SKILL.md), the accepted work contract, and applicable project or document sources<br>
> **Context:** Apply the intended readers, reader tasks, document type, affected set, and reading contexts current at the bound review state<br>
> **Checkbox meaning:** Check an item when evidence shows the problem is present.

## Project Lifecycle

### Purpose

#### The document lacks a stable purpose, audience, or boundary

- [ ] The intended readers cannot be identified.
- [ ] The tasks those readers need to complete cannot be identified.
- [ ] The title or opening does not establish the document's subject and main purpose.
- [ ] The included and excluded topic boundary is unclear.
- [ ] A required prerequisite is unclear.
- [ ] An applicability condition is unclear.
- [ ] The document combines purposes or audiences whose information needs conflict.
- [ ] Content falls outside the accepted documentation work without a governing reason.

### Change Coverage

#### The documentation set is incomplete or inconsistent after the work

- [ ] A changed behavior, interface, process, configuration, example, or term remains stale in an affected document.
- [ ] Related documents express conflicting versions of the same fact, rule, or contract.
- [ ] A required new document, section, link, index entry, or navigation path is missing.
- [ ] An obsolete document or passage remains presented as current guidance.
- [ ] The changed documentation cannot be traced to the accepted work and governing sources.

## Design and Development Lifecycle

### Content

#### The content is inaccurate, incomplete, or unsupported

- [ ] A factual or normative claim conflicts with the target or its governing source.
- [ ] A material claim lacks support that a reader can identify.
- [ ] An example contradicts the surrounding explanation or current behavior.
- [ ] A required premise or constraint is missing.
- [ ] A material exception or limit is missing.
- [ ] A risk established by the governing sources is missing.
- [ ] Detail is presented as certain when the available evidence leaves it unresolved.

### Structure

#### The section structure makes topics difficult to find or relate

- [ ] A section owns multiple unrelated topics or duplicates another section's role.
- [ ] The heading hierarchy hides containment or gives peer topics different levels.
- [ ] Section order places dependent information before its prerequisite or main context.
- [ ] Headings and section order do not expose a clear route to task-relevant information.
- [ ] Unnecessary nesting or fragmentation separates information that belongs together.

#### Section headings are longer or less clear than their topics require

- [ ] A heading exceeds two words when a shorter title would preserve its meaning and role.
- [ ] A one- or two-word heading becomes cryptic, ambiguous, or incomplete because brevity displaced meaning.
- [ ] A heading names the document form or writing action instead of the section's subject.
- [ ] Parallel sections use headings with inconsistent scope, grammar, or level of detail.

### Presentation

#### Prose, lists, and tables are used for the wrong information shape

- [ ] A sequence, set, or short group of alternatives remains dense prose when a list would reduce reading work.
- [ ] Repeated fields or comparisons remain prose when a table would reduce lookup work.
- [ ] A connected explanation or narrative is fragmented into a list or table that obscures its meaning.
- [ ] A list or table repeats nearby prose without improving navigation, comparison, or action.
- [ ] List items or table rows do not use a consistent and comparable structure.
- [ ] A dense or irregular table makes linear prose or separate sections easier to understand.

#### Rendered elements change or obscure the intended meaning

- [ ] A link or navigation target is broken or misleading when rendered.
- [ ] A code block or example is broken or misleading when rendered.
- [ ] A list, table, or note loses its intended grouping or relationships when rendered.
- [ ] Visual formatting carries meaning that is absent from the text or document structure.
- [ ] The rendered layout requires avoidable horizontal scanning or deep visual nesting.
- [ ] Examples or code blocks omit the context needed to interpret or use them safely.

### Language

#### Vocabulary permits avoidable interpretation

- [ ] One concept is named with inconsistent terms.
- [ ] A word conflicts with the project's established domain vocabulary.
- [ ] An abbreviation or jargon term is undefined where the intended reader first needs it.
- [ ] An actor, action, condition, exception, scope, or reference is ambiguous.
- [ ] Normative force changes without a supported reason.
- [ ] A vague modifier replaces an observable condition or owned expectation.

#### Sentences obscure the main claim

- [ ] A sentence delays its main point behind setup or secondary detail.
- [ ] One sentence combines distinct claims that can require different evidence or actions.
- [ ] A sentence uses uncommon, indirect, ornamental, or metaphorical wording where plain wording is available.
- [ ] Pronouns or references force the reader to guess which subject they identify.
- [ ] A compressed sentence removes information needed to understand, act, or recover safely.

### Prose

#### Narrative or descriptive paragraphs hide or fragment their main point

- [ ] A paragraph does not state its main point before supporting detail.
- [ ] One paragraph combines materially different topics.
- [ ] Related reasoning is split into disconnected fragments that hide why the information matters.
- [ ] Narrative detail delays the decision, action, result, or recovery information the reader needs.
- [ ] Descriptive detail adds length without helping the reader understand, decide, act, recover, or verify.

#### The reading sequence does not form a coherent explanation

- [ ] A transition between sections or paragraphs leaves their relationship unclear.
- [ ] A conclusion, instruction, or decision appears before the facts needed to interpret it.
- [ ] Supporting detail appears far from the claim or step it qualifies.
- [ ] Repeated setup interrupts progress without adding new meaning.
- [ ] An example appears before the concept or boundary it is meant to clarify.

### Complexity

#### Reading work exceeds the information's actual complexity

- [ ] Repetition, tautology, heading restatement, filler, hedging, or ornament adds no useful meaning.
- [ ] Unnecessary sections, nesting, or cross-references enlarge the document structure.
- [ ] Unnecessary exceptions or terminology enlarge the reader's mental model.
- [ ] The document explains internal detail that the intended reader does not need.
- [ ] Related guidance is scattered across locations without a clear owner or navigation path.
- [ ] The same rule is repeated where one canonical statement and local reference would remain clearer.
- [ ] The document is longer or more complicated than its current purpose and evidence require.

### Review Integrity

#### The documentation appears complete without establishing its quality

- [ ] A cold-reader pass was replaced by author familiarity or surface inspection.
- [ ] Link or navigation behavior lacks evidence from the delivered document.
- [ ] Example, code, or command accuracy lacks evidence from the delivered document.
- [ ] Rendered structure lacks evidence from a material reading context.
- [ ] The reviewed artifact differs from the delivered revision or rendered state.
- [ ] A known evidence gap is omitted from the documentation result.
- [ ] Removal or compression reopened a material content or navigation gap.

### Reader Use

#### A cold reader cannot complete or recover from the intended task

- [ ] A required prerequisite is absent.
- [ ] A required reader action is absent.
- [ ] An expected result is absent.
- [ ] The reader cannot tell where to begin or what to do next.
- [ ] Feedback does not make the task result or current state clear.
- [ ] A material failure condition is missing.
- [ ] A required recovery path is missing.
- [ ] An example does not represent an ordinary reader path or clarify its limits.
- [ ] The document assumes private project knowledge that its intended readers may not have.

### Reading Contexts

#### The document fails in a supported reader or delivery context

- [ ] A supported renderer or viewport makes the document difficult to read or navigate.
- [ ] A supported reading order changes the intended meaning.
- [ ] A copied, printed, searched, or linked fragment loses context needed to interpret it correctly.
- [ ] The document cannot be used at the point in the product or project lifecycle where readers need it.

### Maintenance

#### The document is difficult to keep current or replace safely

- [ ] Document ownership or authority is unclear.
- [ ] The source of a changeable claim is unclear.
- [ ] Volatile detail is copied across documents without a clear reason or consistency mechanism.
- [ ] A link or cross-reference depends on an unstable location without a maintained route.
- [ ] A product, interface, or process change can leave the document stale without an identifiable affected surface.

#### Replacement or retirement strands current readers

- [ ] Current and superseded guidance are difficult to distinguish.
- [ ] A replacement does not identify the guidance it supersedes.
- [ ] A replacement does not direct readers to the current route.
- [ ] Retiring a document removes still-needed guidance without a successor or clear closure.

## Product Lifecycle

No supported coverage for this lifecycle.
