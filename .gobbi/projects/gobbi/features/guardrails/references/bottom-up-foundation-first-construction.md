---
name: bottom-up-foundation-first-construction
description: Prior art on foundation-first, bottom-up, incremental construction from classic software engineering (Walking Skeleton, GOOS, Tracer Bullets, YAGNI) and current agent harnesses — anchored the redesign of Principle 2 "Bottom-Up Construction".
type: references
scope: feature
feature: guardrails
status: active
created: 2026-06-02
session: 9fe7bd7c-1507-4ef2-88ed-e6111e7e6d10
tags: [principles, principle-2, bottom-up, foundation-first, research, prior-art]
title: Foundation-First, Bottom-Up, Incremental Construction — Prior Art for Gobbi Principle 2
source: sessions/2026-06-02-9fe7bd7c-1507-4ef2-88ed-e6111e7e6d10/ideation/rawdata/research/bottom-up-foundation-first-construction.md
accessed: 2026-06-02
ref_type: internal-research
---

# Research — Foundation-First, Bottom-Up, Incremental Construction

**Purpose:** Anchor the redesign of gobbi's Principle 2 ("Bottom-Up Construction"). The principle targets the failure mode: *"agents tend to implement full features at once with low quality. This makes the features have low-quality design and it becomes a bad reference for the project recursively."*

All external claims are cited with URLs. No quote, URL, or source is invented. Where a claim is paraphrase rather than verbatim, it is marked as such. Confidence is noted per source.

---

## Part 1 — Classic software construction discipline

### 1. Walking Skeleton (Alistair Cockburn; popularized by GOOS)
- **What it is:** A named technique: build a tiny end-to-end implementation that links together all the main architectural components first, then grow it. URL: https://www.oreilly.com/library/view/97-things-every/9780596800611/ch60.html
- **Verbatim (confidence: HIGH — fetched from the O'Reilly chapter page):**
  - *"A walking skeleton is a minimal, end-to-end implementation of the system that links together all the main architectural components."*
  - *"Starting small, with a working system exercising all the communication paths, gives you confidence that you are heading in the right direction."*
  - *"implement incrementally, adding end-to-end functionality. The goal is to keep the system running, all the while growing the skeleton."*
  - *"Making changes to an architecture is harder and more expensive the longer it has been around and the bigger it gets. We want to find mistakes early."*
- **Takeaway:** The *foundation* is the thinnest structure that wires the whole system together; verify it works end-to-end before adding real functionality, then grow incrementally. The explicit rationale — *changes get more expensive the bigger the thing gets; find mistakes early* — directly supports the gobbi failure mode.

### 2. Tracer Bullets (The Pragmatic Programmer — Hunt & Thomas)
- **What it is:** Build a thin but *complete and permanent* slice of the system end-to-end to remove uncertainty and provide an integration platform; contrasted with throwaway prototypes. URL: https://www.barbarianmeetscoding.com/notes/books/pragmatic-programmer/tracer-bullets/ (book-notes summary; confidence: MEDIUM — secondary summary, not the book text)
- **Key paraphrase (confidence: MEDIUM):** *"Prototyping generates disposable code, while tracer code is lean but complete, and forms part of the skeleton of the final system."* Tracer development *"produces an outline of the requirements embodied in code, providing an integration platform where you can add new pieces of code after unit-testing."*
- **Takeaway:** Foundation-first as a *real* (not throwaway) thin slice that becomes the skeleton everything else attaches to.

### 3. "Make it work, make it right, make it fast" + "Simplest thing that could possibly work" (Kent Beck / XP)
- **What it is:** A sequencing maxim attributed to Kent Beck (XP): get a minimal correct version working first, *then* improve its design, *then* optimize. URL: https://martinfowler.com/bliki/Yagni.html and https://medium.com/@ibk9493/make-it-work-make-it-right-make-it-fast-the-evolution-of-software-development-fbbc1eddd33e (secondary; confidence: MEDIUM)
- **Paraphrase (confidence: MEDIUM):** Phase ordering — *Make It Work* (a minimal working version, possibly ugly), *Make It Right* (refactor to maintainable), *Make It Fast* (optimize last). DTSTTCPW: build the simplest solution that actually works for today's problem, not an elaborate one.
- **Takeaway:** The *minimal-step* half of the principle: don't aim for the full polished feature in one pass; reach a small working state, then grow quality in deliberate steps.

### 4. Growing Object-Oriented Software, Guided by Tests (GOOS — Freeman & Pryce)
- **What it is:** A book whose Chapter 10 ("The Walking Skeleton") makes incremental, test-driven growth the central method. URLs: https://www.oreilly.com/library/view/growing-object-oriented-software/9780321574442/ch10.html and https://growing-object-oriented-software.com/toc.html (confidence: HIGH on the book's method; phrasing below MEDIUM — secondary summaries)
- **Paraphrase (confidence: MEDIUM):**
  - *"A walking skeleton is an implementation of the thinnest possible slice of real functionality that we can automatically build, deploy, and test end-to-end."*
  - *"a critical technique with incremental development is learning how to slice up the application so that it can be built a little at a time"*; *"always having something working, always adding just one more feature."*
  - The team *"makes only the smallest possible decisions to kick-start the cycle, so they can start learning and improving from real feedback."*
- **Takeaway:** Design the structure first (the skeleton forces architecture decisions), then grow in the smallest verifiable increments. "Smallest possible decisions … improving from real feedback" is the exact antithesis of "implement the full feature in one pass."

### 5. Steel Thread / Vertical Slice
- **What it is:** A thin end-to-end implementation of one core workflow through every layer (UI → logic → data), proving integration before breadth. URLs: https://computerknown.com/what-is-steel-thread-in-software/ and https://monday.com/blog/rnd/vertical-slice/ (secondary; confidence: MEDIUM)
- **Paraphrase (confidence: MEDIUM):** Favors *"completeness over breadth"* — a minimal but fully functional version of an essential process, used to surface integration problems early.

### 6. YAGNI + Fowler's four costs of presumptive features
- **What it is:** "You Aren't Gonna Need It" (XP). Fowler enumerates *why* over-building costs: build, delay, carry, repair. URL: https://martinfowler.com/bliki/Yagni.html (confidence: HIGH that Fowler's four-cost framing exists; phrasing below MEDIUM)
- **Paraphrase (confidence: MEDIUM):** Fowler names four costs of building features pre-emptively — **cost of build**, **cost of delay**, **cost of carry** (the extra code *"adds complexity … makes it harder to modify and debug that software"*), and **cost of repair**. YAGNI: *"always build the simplest solution to today's problems."*
- **Takeaway:** This is the economic backbone of the *minimal-step* discipline and, crucially, names the **carry cost** — over-built low-quality code *stays in the codebase and makes everything harder*, which is precisely the gobbi "bad recursive reference" concern restated in cost terms.

---

## Part 2 — Agent-coding harnesses (one-shot failure mode)

### The "one-shot over-build → low quality" failure mode IS documented

- **Source:** Addy Osmani, "My LLM coding workflow going into 2026." URL: https://addyosmani.com/blog/ai-coding-workflow/ (confidence: HIGH — fetched; verbatim quote confirmed)
- **Verbatim:** developers who *"tried to have an LLM generate huge swaths of an app … ended up with inconsistency and duplication - 'like 10 devs worked on it without talking to each other.'"*
- **Recommendation, verbatim:** *"Break the project into iterative steps or tickets and tackle them one by one. This mirrors good software engineering practice, but it's even more important with AI in the loop. LLMs do best when given focused prompts: implement one function, fix one bug, add one feature at a time."*

- **Anthropic, Claude Code best practices.** URL: https://code.claude.com/docs/en/best-practices (confidence: HIGH — fetched; verbatim)
  - *"Explore first, then plan, then code"* and *"Letting Claude jump straight to coding can produce code that solves the wrong problem."*
  - *"Give Claude a way to verify its work"* — *"Give Claude something that produces a pass or fail, and the loop closes on its own."*
  - *"Course-correct early and often … The best results come from tight feedback loops."*

---

## Cross-source synthesis

1. **Build the foundation/structure first, thinly, end-to-end — and verify it — before adding real functionality.** (Walking Skeleton, Tracer Bullets, Steel Thread, GOOS iteration-zero.) The foundation forces the structural/architecture decisions early, when they are cheap to change.
2. **Grow in the smallest verifiable increments; always keep something working.** (GOOS; Beck "make it work, make it right, make it fast"; DTSTTCPW; Claude Code "one function/bug/feature at a time.")
3. **Big one-shot construction produces low-quality, incoherent, hard-to-change output — and the cost compounds.** (Cockburn: changes get more expensive the bigger it gets; Fowler: carry cost; Osmani: one-shot = "10 devs who didn't talk to each other.")
4. **Early, frequent feedback/verification between steps is the mechanism that keeps quality high.** (Walking skeleton "short feedback cycle"; Claude Code "tight feedback loops, course-correct early and often.")

---

## Per-source confidence summary

| Source | Used for | Confidence |
|---|---|---|
| Cockburn Walking Skeleton (O'Reilly 97-Things ch60) — fetched | foundation-first, find-mistakes-early, cost-grows-with-size | HIGH (verbatim) |
| Claude Code best practices (code.claude.com) — fetched | plan-first, verify-each-step, course-correct, "too big for one pass" | HIGH (verbatim) |
| Addy Osmani LLM workflow — fetched | one-shot over-build → low quality; one-thing-at-a-time fix | HIGH (verbatim) |
| GOOS Ch.10 (O'Reilly) — fetched summary + secondary | smallest decisions, test-drive architecture, always-working | MEDIUM-HIGH |
| Fowler Yagni (martinfowler.com) + InfoQ — search summary | four costs, carry cost = compounding complexity | MEDIUM |
| Pragmatic Programmer Tracer Bullets — secondary book-notes | thin-but-complete skeleton of final system | MEDIUM |
| Kent Beck "work/right/fast" + DTSTTCPW — secondary | minimal-working-then-improve sequencing | MEDIUM |
| Steel Thread / Vertical Slice — secondary | thin end-to-end slice, completeness over breadth | MEDIUM |
