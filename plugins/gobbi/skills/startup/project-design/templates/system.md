# {Project} — System

Derive every heading from accepted interview topic ids. Never invent a lifecycle
answer. Fill each heading, write `Not applicable — {reason}`, or write
`Open — {what would resolve it}`. Keep one system file. After `## Products`,
write one `### {Product}` subsection under every remaining heading, including
when the project has one product. Start an inherited answer with `Inherited — `.

## Products

- Products:
  - {product}
- Source: `products`

## Composition

### {Product}

- Statement: {from `shape`}
- Source: `shape`

## Parts and responsibilities

### {Product}

- Component: {part}
- Responsibility: {owned role}
- Source: `shape`, `build-buy-adopt`, `failure-containment`

## Data and flow

### {Product}

- Statement: {from `data` and `data-lifecycle`}
- Authoritative source: {source}
- Source: `data`, `data-lifecycle`

## Interfaces

### {Product}

- Boundary: {from `interfaces`}
- Source: `interfaces`

## Stack

Local-stack rows and `## First check` are the only Bootstrap inputs from design.

### {Product}

| Product | Entry | Category | Responsibility | Local or cloud | Version policy | Rationale | Constraints |
|---|---|---|---|---|---|---|---|
| {product} | {entry} | {language, framework, runtime, datastore, toolchain, or other} | {owned role} | {local or later-cloud} | {policy or unknown} | {reason and topic id} | {limits} |

- Source: `stack`, `local-or-cloud`

## First check

Do not use a no-op, `echo`, or any command that ignores the local toolchain.

### {Product}

- Command: {exact command the README will run}
- What it proves: {toolchain install, compile, or the stack's ordinary test runner}
- Source: `first-check`

Project command, after every product subsection. If two local products
disagree, mark Open and ask.

- Project command: {the command Bootstrap writes into README}
- Taken from product: {product that owns the local stack used for Bootstrap}
- Default: the first named product that has at least one `local` Stack row
- Source: `first-check`

## Environments

### {Product}

- Environment: {from `environments`}
- What differs: {difference}
- Source: `environments`

## Verification and build risk

### {Product}

- Verification: {from `verification`}
- Build risk: {from `build-risk`}
- Source: `verification`, `build-risk`

## Change path

### {Product}

- Statement: {from `change-path`}
- Source: `change-path`

## Open questions

| Id | Question | What would resolve it |
|---|---|---|
| {topic-id} | {question} | {evidence or decision} |

- Source: open topic ids

## Acceptance

- User accepted this draft: {yes | no}
- Accepted by: {user}
- Date: {date}
- Session-only: this file is not Memory.
- Source: session record; not a topic
