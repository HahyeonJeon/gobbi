---
name: yc-canon
description: Y Combinator canon (PG essays, YC Startup School, YC application) mined for interview-craft and design-craft truths for the startup skill rewrite.
type: references
scope: project
feature: null
status: active
created: 2026-07-14
session: 97d3ef5a-1b8a-4dab-b884-9f686e185b22
tags: []
keywords: [yc, paul-graham, startup-school, interview-craft, design-craft, prior-art]
author: claude
title: YC Canon — Interview & Design Craft
source: Multiple primary sources — see § Sources below (as-is research cluster, not atomized per one-insight-per-file; kept whole per this session's user-approved promotion plan)
accessed: 2026-07-14
ref_type: other
---

# Research Findings — YC Canon (Cluster r1)

Prior-art research for the gobbi `startup` skill review. Cluster: Y Combinator canon.
Author: leader (research). Phase: Ideation iter 1, Research sub-step. Read-only + web.

**Scope reminder.** The `startup` skill does two things: (1) INTERVIEW the user to elicit a real,
evidenced startup idea; (2) turn that into a detailed PROJECT DESIGN. This artifact supplies the
YC-canon evidence base for both halves. Findings are directional (what the skill's principles and
questions should encode), not skill wording.

**Sources read (primary where possible).** All read this session via WebFetch/WebSearch:

- PG, "How to Get Startup Ideas" — http://www.paulgraham.com/startupideas.html
- PG, "Startup = Growth" — http://www.paulgraham.com/growth.html
- PG, "Do Things That Don't Scale" — http://www.paulgraham.com/ds.html
- PG, "Default Alive or Default Dead?" — http://www.paulgraham.com/aord.html
- PG, "How to Convince Investors" — http://www.paulgraham.com/convince.html
- PG, "The Hardest Lessons for Startups to Learn" — http://www.paulgraham.com/startuplessons.html
- Eric Migicovsky, "How to Talk to Users" (YC Startup School, Jul 2019) — five questions verified
  across https://www.startuparchive.org/p/eric-migicovsky-s-five-questions-you-can-ask-in-every-user-interview
  and the YC talk (https://www.youtube.com/watch?v=MT4Ig2uqjTc); summary
  https://www.indiehackers.com/post/eric-migicovsky-how-to-talk-to-users-summary-e3c4c844cc
- Sam Altman, CS183B "How to Start a Startup," Lectures 1–2 "Ideas, Products, Teams and Execution"
  — read via notes at https://www.bnjs.co/notes/sam-altman-ideas-products-teams-and-execution-highlights/
  (primary video https://www.youtube.com/watch?v=CBYhVcO4WgI; slides startupclass.samaltman.com/courses/lec01/)
- YC application questions + PG "How to Apply" guide — https://www.ycombinator.com/howtoapply

**Verification flags** (see § Gaps at end): CS183B quotes read via a third-party notes page, not
the primary video/transcript — treat as close paraphrase attested across transcripts. Live YC
application-form wording read via PG's "How to Apply" guide + search summaries, not the authenticated
2024/25 form — the four stable questions cited are well-attested but wording may have drifted.

---

## 1. Interview craft — how YC elicits truth from founders and users

The canonical YC method for eliciting truth is Eric Migicovsky's **five-question user interview**,
whose backbone is Rob Fitzpatrick's *The Mom Test* (Migicovsky names the book explicitly; the book
itself belongs to the sibling "startup books" cluster). The mechanics:

**The five questions (verbatim; startuparchive.org, cross-checked with YC talk):**
1. "What's the hardest part about [doing this thing]?"
2. "Tell me about the last time you encountered that problem."
3. "Why was this hard?"
4. "What, if anything, have you done to try to solve the problem?"
5. "What don't you love about the solutions you've tried?"

**What each question is engineered to extract:**
- Q1 surfaces whether a **genuine pain point** exists at all (not a nice-to-have).
- Q2 is the anti-hypothetical move: "get to specifics rather than hypotheticals and extract context"
  around a real past instance. Past behavior, not future speculation.
- Q3 reaches the underlying motive — "customers don't buy the 'what'. They buy the 'why'."
- Q4 is the **truth serum**: "If potential customers aren't already exploring potential solutions to
  this problem, it's possible that the problem ... isn't a pressing enough problem." Effort already
  spent (workarounds, spreadsheets, duct-tape, money) is hard evidence of real demand; zero effort is
  the strongest disqualifier.
- Q5 maps the gap in existing solutions — "This is the beginning of your potential feature set" (the
  wedge / differentiation).

**The governing rules of the method (indiehackers summary + talk):**
- "Talk about their life, not your idea." The interview is about the user's problem and history, NOT
  a pitch. Pitching contaminates the data.
- "Listen, don't talk" — "that's not the time to be pitching the product."
- "Talk specifics, not hypotheticals" — never ask "would you use X?" or "would you pay for X?"; those
  invite polite lies. Ask what they actually did.
- Talk to users at every stage — idea, prototype, post-launch — not once.

**YC application/interview as an elite founder-interview** (PG "How to Apply"; YC guide): the same
truth-extraction discipline turned on the founder. Signal questions YC actually uses:
- "What is your company going to make?" — must be answerable "right in the first sentence, in the
  simplest possible terms." Inability to state it plainly is itself a negative signal.
- "Please tell us in one or two sentences about something impressive that each founder has built or
  achieved." — PG calls this "the most important question on the application." Past achievement over
  claimed potential (same past-behavior-over-hypothetical logic as the user interview).
- "What other ideas did you have?" — probes range and honesty of the founder's thinking.
- "Tell us about the time you most successfully hacked some (non-computer) system to your advantage."
  — tests resourcefulness / willingness to bend defaults.
- If launched: YC expects you to "know everything about your users and metrics" and rewards founders
  "who know a lot about their users, and can tell us what they learned." Depth of user knowledge is
  the credibility test.

**Truth-serum principle across both halves:** demand is proven by *what people already did* (effort,
money, workarounds, switching), never by what they *say* they would do. The interview's whole job is
to convert opinions into evidenced past behavior.

## 2. Design/idea craft — how YC judges an idea and its build

**Idea origination (PG "How to Get Startup Ideas"):**
- "The way to get startup ideas is not to try to think of startup ideas. It's to look for problems,
  preferably problems you have yourself." Organic > made-up.
- "The very best startup ideas tend to have three things in common: they're something the founders
  themselves want, that they themselves can build, and that few others realize are worth doing."
- "Live in the future and build what's missing." Ideas are *noticed*, not brainstormed.
- Self-tests: "Would you use this thing yourself, if you hadn't written it?" and "Who wants this so
  much that they'll use it even when it's a crappy version one made by a two-person startup they've
  never heard of?"
- The dominant failure: "By far the most common mistake startups make is to solve problems no one
  has." Beware "sitcom startup ideas" that sound plausible (e.g. a social network for pet owners) —
  friends say "yeah, I could see using that," which masks indifference.
- Two filters that hide good ideas: the **schlep filter** (avoiding tedious work — why Stripe existed)
  and the **unsexy filter** (avoiding unglamorous domains — Viaweb).
- On competition (inverts the naive fear): "A crowded market is actually a good sign, because it means
  both that there's demand and that none of the existing solutions are good enough"; "Worrying that
  you're late is one of the signs of a good idea."

**Market shape (PG "How to Get Startup Ideas" + CS183B):**
- Dig a deep well, not a broad shallow hole: "build something a small number of people want a large
  amount" rather than something many people want a little. Start narrow, dominate, then find "a fast
  path out" (Facebook: Harvard → all colleges → everyone).
- Altman: "It's better to build something that a small number of users love, than a large number of
  users like." The 100-users-who-love-you rule.

**"Make something people want" and the PMF test (CS183B):**
- Startup outcome ≈ idea × product × execution × team × luck (luck a random 0–10000). Weakness in any
  factor caps the result.
- The product-market-fit signal is **organic word of mouth**: "When people really love something,
  they tell their friends about it and you'll see organic growth." Build "a product so good people
  spontaneously tell their friends about it."
- Clarity as a quality signal: "Good startup ideas are almost always very easy to explain ... If it
  takes more than a sentence to explain what you're doing, it's almost always a sign that it's too
  complicated."
- "Why now?" is a required question: "Why is this the perfect time for this particular idea? Why
  couldn't it have been done 2 years ago, and why will 2 years in the future be too late?"
- Passion/mission is load-bearing: "If you don't love and believe in what you're building, you're
  likely to give up at some point."

**Growth as the measure (PG "Startup = Growth"):**
- "A startup is a company designed to grow fast." Growth is the essence, not funding or tech.
- Concrete weekly-growth benchmarks (YC): "A good growth rate during YC is 5-7% a week"; "10% a week
  you're doing exceptionally well"; "if you can only manage 1%, it's a sign you haven't yet figured
  out what you're doing."
- Growth is the compass: "You can use that target growth rate to make all your decisions for you;
  anything that gets you the growth you need is ipso facto right." Pick a rate, hit it weekly.
- Startups differ from ordinary businesses by being unconstrained in *both* demand and reach: "To grow
  rapidly, you need to make something you can sell to a big market."

**Do things that don't scale (PG "Do Things That Don't Scale"):**
- "Startups take off because the founders make them take off." Not "build it and they will come."
- Recruit users manually, by hand, one at a time (Airbnb going door-to-door in New York; the Collison
  brothers' "Right then, give me your laptop" install).
- "It's not the product that should be insanely great, but the experience of being your user"
  (Wufoo's hand-written thank-you notes). "I have never once seen a startup lured down a blind alley
  by trying too hard to make their initial users happy."

**Economic discipline (PG "Default Alive or Default Dead?"):**
- The test: "Assuming their expenses remain constant and their revenue growth is what it has been over
  the last several months, do they make it to profitability on the money they have left?" — computed
  on the *current* trajectory, not assuming a raise.
- "Half the founders I talk to don't know whether they're default alive or default dead." Know which.
- Spend discipline: "Hiring too fast is by far the biggest killer of startups that raise money"; large
  staff is "more the effect of growth than the cause."
- The **fatal pinch** = "default dead + slow growth + not enough time to fix it." "You can never
  safely treat fundraising as more than a plan A."

**Convincing investors = actually being good (PG "How to Convince Investors"):**
- Be impressive, don't *seem* impressive. Three things investors seek: **formidable founders**, "a
  plausible path to a big market," and "evidence of success so far" (traction; stage-dependent).
- "A formidable person is one who seems like they'll get what they want, regardless of ... obstacles
  ... Formidable is roughly justifiably confident." The confidence must be earned by "know[ing]
  everything about your market." Grandiose marketing-speak is a tell of the Dunning-Kruger effect.

## 3. Startup quality axes — the gradable dimensions YC uses

Concrete, gradable dimensions that separate a real startup from a vanity one. Each is scorable and
maps to something the `startup` skill's design/evaluation half could grade an elicited idea against:

| Axis | What "good" looks like | Source |
|---|---|---|
| **Demand evidence** | Users already spend effort/money on workarounds; some need it urgently even as a crappy v1 | Migicovsky Q4; PG "startupideas" desperation test |
| **Problem reality** | Founder (or an evidenced user) actually has the problem; not a "sitcom" idea | PG "startupideas" self-problem test |
| **Growth rate** | 5–7%/wk good, 10%/wk exceptional, ~1% means lost; measured weekly as a ratio | PG "growth" |
| **PMF signal** | Organic word-of-mouth; users spontaneously tell friends; a small set who *love* it | CS183B; PG "startuplessons" |
| **Market shape** | Small deep well now + a fast path out to a big market; unconstrained in demand AND reach | PG "startupideas" + "growth" |
| **Timing ("why now")** | A concrete reason it's newly possible / newly urgent this year, not 2 yrs ago or 2 yrs hence | CS183B |
| **Clarity** | Statable in one plain sentence; if it needs more, it's too complicated | CS183B; PG "How to Apply" |
| **Unit economics / default-alive** | Reaches profitability on current cash + current growth without a raise; not in the fatal pinch | PG "aord" |
| **Distribution / go-to-market** | A repeatable channel; early manual recruitment that hand-holds users to delight | PG "ds.html" |
| **Founder credibility** | Domain expertise + a concrete impressive past build; "formidable" = justified confidence | PG "convince" + "How to Apply" |

## 4. Load-bearing truths (for the skill's PRINCIPLES)

Selective. Each is a truth this cluster genuinely establishes, with why it is load-bearing for an
interview-and-design skill.

1. **Demand is proven by past behavior, never by stated intent.** — Load-bearing: it is the single
   discipline that stops the whole skill from eliciting polite fiction. (Migicovsky Q2/Q4; Mom Test)

2. **Never pitch during elicitation — talk about the user's life, not your idea.** — Load-bearing:
   the interviewer's own idea is the primary contaminant of the evidence; the skill must separate
   elicitation from validation-of-my-solution. (Migicovsky)

3. **No hypothetical or leading questions; ask about a specific last instance.** — Load-bearing: it
   is the concrete mechanism that operationalizes truth #1 into askable questions. (Migicovsky Q2)

4. **"Solving a problem no one has" is the most common and fatal failure.** — Load-bearing: it names
   the top failure mode the skill exists to prevent, and gives the "sitcom idea" red flag to detect
   it early. (PG "startupideas")

5. **The best ideas are noticed from a real problem the founder has, can build, and few value.** —
   Load-bearing: it sets what a *good* elicited idea looks like, steering the interview toward
   organic problems over brainstormed ones. (PG "startupideas")

6. **Start with a small deep market you can dominate, then find a fast path out.** — Load-bearing: it
   is the design principle that keeps an idea both real-now and big-later; prevents both the
   too-broad-and-shallow and the forever-niche failure. (PG "startupideas" + "growth"; CS183B)

7. **Growth is the definition and the compass; measure it weekly as a ratio.** — Load-bearing: it
   gives the design half a single, gradable success metric with concrete benchmarks (5–7%/10%/1%).
   (PG "growth")

8. **PMF shows up as organic word of mouth — a few users who love it beat many who like it.** —
   Load-bearing: it is the observable, non-gameable signal of "made something people want" the design
   half should grade for. (CS183B; PG "startuplessons")

9. **If it can't be said in one plain sentence, it's too complicated.** — Load-bearing: clarity is
   both a quality gate on the idea and a direct check the skill can apply to any elicited pitch.
   (CS183B; PG "How to Apply")

10. **Answer "why now?" — name why the idea is newly possible/urgent this year.** — Load-bearing:
    timing is a distinct gradable axis that separates a durable idea from an evergreen-but-inert one.
    (CS183B)

11. **Startups don't take off by themselves; founders must do unscalable manual work early.** —
    Load-bearing: it corrects the "build it and they will come" default and defines what the earliest
    build/go-to-market actually is (hand recruitment + delight). (PG "ds.html")

12. **Know whether you are default alive or default dead — on current cash and current growth.** —
    Load-bearing: it forces the design half to include real unit economics, not just excitement, and
    names the fatal pinch. (PG "aord")

13. **Convince by actually being good, not by seeming good; be formidable = justifiably confident.**
    — Load-bearing: it reframes "pitch quality" as domain mastery + honest evidence, which is exactly
    what the skill should build in the founder rather than presentation polish. (PG "convince")

14. **Fear internal failure, not competitors — a crowded market is a demand signal.** — Load-bearing:
    it corrects two common founder misjudgments the skill will meet (competition panic; blaming the
    market) and reframes competition as evidence. (PG "startuplessons" + "startupideas")

15. **Determination over intelligence; passion is load-bearing because you'll want to quit.** —
    Load-bearing: it is the one founder-fit truth the skill's interview half must probe, since it
    predicts follow-through more than raw talent. (PG "startuplessons"; CS183B)

## 5. Directly reusable questions (verbatim / near-verbatim)

Tagged `[interview-craft]` (eliciting the idea from the user/users) vs `[design-craft]` (judging /
shaping the idea and its build). Source in parentheses.

**Interview-craft (the elicitation five + founder-truth probes):**
- `[interview-craft]` "What's the hardest part about [doing this thing]?" (Migicovsky Q1)
- `[interview-craft]` "Tell me about the last time you encountered that problem." (Migicovsky Q2)
- `[interview-craft]` "Why was this hard?" (Migicovsky Q3)
- `[interview-craft]` "What, if anything, have you done to try to solve the problem?" (Migicovsky Q4)
- `[interview-craft]` "What don't you love about the solutions you've tried?" (Migicovsky Q5)
- `[interview-craft]` "Would you use this yourself, if you hadn't built it?" (PG "startupideas")
- `[interview-craft]` "Who wants this so much they'll use a crappy v1 from a two-person startup they've
  never heard of?" (PG "startupideas")
- `[interview-craft]` "Tell me about something impressive you've actually built or achieved." (YC app —
  past behavior over claim)
- `[interview-craft]` "What other ideas did you consider, and why this one?" (YC app)

**Design-craft (grading and shaping the idea/build):**
- `[design-craft]` "Say it in one sentence: what are you going to make?" (CS183B; PG "How to Apply")
- `[design-craft]` "Why now? Why couldn't this have been done 2 years ago, and why is 2 years from now
  too late?" (CS183B)
- `[design-craft]` "What's the small market you can dominate first, and what's the path out to a big
  one?" (PG "startupideas" + "growth")
- `[design-craft]` "What's your weekly growth rate? (Target 5–7%; 10% is exceptional; ~1% means you
  haven't figured it out.)" (PG "growth")
- `[design-craft]` "Do users tell their friends without being asked? Do a few users *love* it?"
  (CS183B; PG "startuplessons")
- `[design-craft]` "Are you default alive or default dead — on today's cash and today's growth, no
  raise assumed?" (PG "aord")
- `[design-craft]` "What unscalable thing will you do by hand to get and delight the first users?"
  (PG "ds.html")
- `[design-craft]` "What do you understand about this market that others don't?" (PG "convince" —
  domain-expertise / formidability test)

---

## Gaps and uncertainties (flagged)

- **CS183B (Altman L1/L2) quotes** were read via a third-party notes page (bnjs.co), not the primary
  YouTube video or an official transcript. The lines are attested across multiple transcripts and are
  widely quoted, but they are close paraphrases, not verbatim-verified against the primary. If the
  synthesis leader needs a hard verbatim, pull the tech.genius.com transcript or the video captions.
- **Live YC application-form wording (2024/25)** could not be read from the authenticated application
  form. The four stable questions ("what are you going to make," "most impressive thing built/
  achieved," "other ideas," "hack a non-computer system") come from PG's "How to Apply" guide and
  search summaries. Wording may have drifted between batches; treat as stable-in-spirit, not
  current-form-exact.
- **Willingness-to-pay as an explicit truth serum** is a *Mom Test* (Rob Fitzpatrick) mechanic that
  Migicovsky references but does not fully develop in the talk. The deep treatment (asking for a real
  commitment of time/money/reputation as the only reliable signal) lives in the sibling "startup
  books" cluster — flagged here so the synthesis leader routes it there and does not double-count it.
- The YC "How to Talk to Users" official library page (ycombinator.com/library/6g-...) returned 404
  this session; the five questions were instead verified across two independent secondary captures of
  the same talk (startuparchive.org + the YC search result), which agree verbatim — high confidence.
- **Not covered by this cluster (by design):** SaaS/PLG metrics depth, the founder-team dynamics
  literature, and the AI-skill-framework prior art — those are the other four sibling clusters.

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-07-14 | 97d3ef5a-1b8a-4dab-b884-9f686e185b22 | Ideation prior-art base for the `startup` skill rewrite: interview-craft principles, the demand/PMF/growth quality axes, and the reusable question bank |

## Related

- [[scope-narrowed-to-design-craft]] — the decision that kept the craft-level truth-serums (demand
  ≠ interest, pay-for/workaround evidence) from this cluster while locking out the commercial axes
