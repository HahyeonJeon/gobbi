# Design Topics

Use this direct phase bank to prepare evidence-backed Design questions for the current subject. Keep Project,
Product, and Implementation decisions at their owning level.

## Project

- What complete result is the Project responsible for delivering?

- Where does the Project's responsibility begin and end?

- Which plausible capabilities are explicitly outside the Project's current scope?

- Which tasks will intentionally remain manual rather than being performed by any Product?

- What evidence would justify adding work that is currently outside Project scope?

- Which Project scope or responsibility decision would be most costly to change later?

- Which people, organizations, Products, or external systems exchange information with the Project?

- For each important kind of information, who or what sends it, and who or what receives it?

- Which Products or external systems must remain easy to change independently to avoid the greatest future cost?
  - **Example:** For example, changing one Product should not force an unrelated Product release.

- What new evidence would justify changing the cross-Product design?

- If Products or external systems disagree about Project status or data, which source is authoritative?
  - **Example:** For example, one source decides status while another only caches it.

- What must happen to Project data from creation or collection through use, storage, retention, and deletion?

- Which independently useful Products does the Project own?
  - **Example:** For example, list two independently useful deliverables separately.

- When important Project qualities conflict, which one must take priority?

- Which Project capabilities will be built, bought, or adopted, and why?

- Which capability or outcome must remain differentiated rather than delegated to a commodity dependency?

- Which attractive product or technical direction is deliberately excluded from the Project strategy?

- Which quality or capability tradeoff does the strategy accept, and what protects the losing side?

- What evidence would require the Project to change its solution strategy?

- Which outcome defines each Project horizon without prescribing implementation tasks?
  - **Example:** For example, name the next outcome, not its implementation tasks.

- Which evidence, decision, external system, or earlier outcome must exist before each horizon can start?

- What observable evidence permits the Project to advance from each horizon?

- Which people, time, money, or operating-capacity assumptions bound each horizon?

- Which costly-to-reverse decision must be delayed, tested, or explicitly accepted in each horizon?

- Which observation requires the Project horizon plan to be revised?

- Which observation requires a horizon or the Project to stop?

## Product

- Which Product connection or consumer-facing behavior must remain stable when its Implementation changes?
  - **Example:** For example, callers depend on a behavior, not its storage.

- For a web Product, which work must occur in the consumer's browser?

- How should a data Product produce its result—as data arrives, in scheduled batches, or on demand?

- Which accepted Product-type evidence establishes this Product's type and complete outcome?

- Which registered stable identity names this Product's single complete Implementation?

- Which accepted Product identity owns that registered Implementation?

- How will each main consumer interact with this Product?
  - **Example:** For example, distinguish a person’s command from a programmatic call.

- Which Product-specific ideas and terms must have the same meaning in every interface?

- Which intended consumers should test the most uncertain Product-use assumption?

- Which realistic Product tasks should those consumers attempt?

- Which existing Product or interface demonstrates an approach worth following?

- Which apparently relevant Product or interface should not guide this design?

## Implementation

- Which major runtime units execute independently within this Implementation?
  - **Example:** For example, identify processes that can fail independently.

- What responsibility does each runtime unit own?

- Which runtime units handle the Product's main result from start to finish?
  - **Example:** For example, trace a request from entry to the returned result.

- Which unattended work must succeed for the Product result to be correct?

- Which runtime unit must prevent one failure from affecting other units or consumers?

- Which Implementation state must be restored before normal runtime work can continue?

- Which programming languages must this Implementation use or continue to support?

- Which frameworks must this Implementation use or remain compatible with?

- Which execution runtimes must this Implementation run on?

- Which databases or other data stores must this Implementation use or remain compatible with?

- What responsibility, boundary, interface, owner, deployment need, and quality obligation does this complete Implementation have?

- For each stack entry, is it a framework, runtime, engine, datastore, table format, protocol, platform, infrastructure, external service, library, language, or toolchain?

- Which Implementation responsibility uses each technology or language entry?

- What evidence, constraint, and tradeoff justify each material stack entry?
