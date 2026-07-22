# Web UX Ideation

Browser-experience discussion procedure for P1–P5 of [`SKILL.md`](SKILL.md). Run after parent
[`web`](../ideation.md) has bounded the feature and generic [`ux`](../../ux/ideation.md) has produced the
applicable accepted experience specification. This companion resolves web journey, continuity, trust, and
measurement mechanics; it does not substitute for direct research or add policy.

## Conduct

Move through X0–X8 in dependency order. Inspect accepted UX artifacts, the current application and analytics,
support evidence, browser behavior, and project/privacy commitments before asking. Discuss one unresolved axis
per turn; present evidence and material options, recommend one, and record the decision and consequences.
Smart-skip only with current proof. When a browser constraint contradicts accepted experience or parent scope,
reopen the earliest owner rather than hiding the change in copy, routing, or instrumentation.

For each axis record **evidence**, **accepted clause**, **web-context decision**, **affected journeys/states**,
**measurement consequence**, **verification**, and **reopen condition**.

## X0 — Accepted experience, current journey, and baseline

- Which generic UX clauses, research contexts, prototype evidence, and acceptance decision govern this feature?
- What routes, content, session/provider behavior, analytics, support contacts, and outcome baselines exist now?
- Which populations and contexts are represented, absent, or unsafe to generalize from?
- Which product, privacy, data, support, and release owners control consequential decisions?

**Close with:** accepted-clause trace, current journey, baseline/denominator sources, evidence limits, and owner
map. Missing required generic UX evidence remains `NEEDS_CONTEXT`.

## X1 — Entry, URL, orientation, and history

- Can the person arrive directly, deeply, internally, from email/search/provider, or by a stale/shared link?
- What is the canonical and safe URL meaning, and can it be bookmarked/shared without leaking or misleading?
- What should refresh, back, forward, history restore, duplicate tab, and return from external handoff do?
- At each entry, can the person understand location, reason, current status, consequence, next actions, and
  support without remembering a prior screen?

**Close with:** entry/URL/history map, orientation content, safe/stale-link behavior, and false-entry oracles.

## X2 — Journey steps, decisions, and content

- What is the smallest path from each entry to visible and authoritative completion?
- Which alternative-valid paths, decisions, prerequisites, and handoffs materially change the outcome?
- What question or consequence must be understood at each step, and what primary/alternative action follows?
- Which plain-language terms, labels, status, instructions, confirmations, receipts, and support content are
  needed; which existing content convention should remain?

**Close with:** journey map, decision/content inventory, completion/false-completion signals, and UI handoff.

## X3 — Identity, session, and context continuity

- What happens at sign-in/out, reauthentication, session expiry, permission or role change, account/tenant
  switch, another tab, email/provider return, or cross-device/session resumption if promised?
- Which intent, inputs, and progress may safely persist; which protected context must expire or be discarded?
- How does the person understand why a transition happened and return to the smallest safe next step?
- How are stale authority, mismatched account, or replayed return URLs detected and recovered?

**Close with:** identity/context transition map, persistence/discard rules, explanations, and recovery routes.

## X4 — Latency, interruption, stale state, and recovery

- Which steps can wait, progress, cancel, timeout, go offline, suspend, race, return late, or expose partial/stale
  state?
- What work and intent survive navigation away, refresh, auth expiry, dependency failure, duplicate action, or
  retry?
- Which failure classes need correction, retry, wait, alternate path, escalation, or support, and who owns each?
- What prevents a delayed or repeated request from looking complete or repeating irreversible harm?

**Close with:** time/interruption states, work-retention policy, failure taxonomy, recovery/support map, and
duplicate/late-result oracles.

## X5 — Trust, privacy, and consequential action

- What identity, authority, data purpose/retention/sharing, consent, requested permission, third-party domain,
  cost, term, or irreversible consequence must be understood before commitment?
- Which choice is optional, and can refusal or later withdrawal be made without coercion or disguised harm?
- Where are review, correction, proportional confirmation/reauthentication, receipt, reversal, dispute, and
  support placed?
- Could branding, redirects, urgency, security instructions, or permission prompts train phishing acceptance or
  conceal who will act?

**Close with:** trust-boundary content, consent/permission choices, consequential-action safeguards, and harm
guardrails.

## X6 — Representative web contexts and evidence

- Which devices/browsers, input or assistive modes, locales/content, network qualities, auth states,
  interruption patterns, privacy controls, and consequential contexts materially change the experience claim?
- Which accepted generic UX studies cover each context, and where is direct evidence absent?
- Are consent, accommodations, recruitment, data handling, and power/safety conditions valid for further work?
- Which contexts belong to web UI mechanics versus experience research, and how will their evidence reconcile?

**Close with:** smallest risk-complete context matrix, study/evidence mapping, limitations, UI collaboration, and
any `NEEDS_CONTEXT` condition.

## X7 — Outcome and instrumentation model

- Who is eligible and exposed; what starts an attempt; what marks progress, visible completion, authoritative
  completion, failure class, recovery, abandonment, escalation, harm, and downstream outcome?
- What baseline, denominator, window, segments, exclusions, guardrails, and decision thresholds are meaningful?
- Which client/server/data/provider event owns each signal, how are versions and identities joined, and how are
  retries, blocks, delay, duplication, missingness, and consent handled?
- What observation could disprove apparent success, and which metrics cannot exist until after deployment?

**Close with:** metric tree, event dictionary, join/deduplication rules, privacy controls, data-quality checks,
guardrails, and live-validation plan.

## X8 — Realization checkpoint

Present the trace in this order: accepted clauses and evidence limits; current/baseline; entries/URL/history;
journeys/content; identity/session continuity; time/failure/recovery; trust/consequential safeguards; context
matrix; measurement/event model; affected production surfaces; selected scenarios/checks; framework and UI
owner handoffs; pending live claims.

Ask the user to confirm any material web-experience decision not already fixed. Do not begin P6 while an open
item can change accepted outcome, trust, safe persistence, measurement meaning, or feature scope.

**Close with:** locked browser-experience realization and proof plan.

## Completion ledger

The discussion closes only when X0–X8 are confirmed or proved inapplicable; each journey/state traces to an
accepted generic UX clause and parent effect; representative contexts and limits are explicit; the event model
can reconcile visible and authoritative truth; web UI and framework owner boundaries are clear; and live
post-deployment outcomes remain pending rather than forecast as achieved.
