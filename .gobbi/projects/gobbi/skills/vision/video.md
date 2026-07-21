# Video Analysis

Use this child after [`SKILL.md`](SKILL.md) for a video or time-ordered rendered frames. It refines the parent
with temporal coverage, event evidence, motion, pacing, captions, and audio relationships. One isolated frame
supports static-image findings only and never proves a transient or timing claim.

## Procedure

### V1 — Establish playback and source context

Extend the parent frame with purpose, audience, platform, viewing conditions, duration, aspect ratio, frame
rate if known, resolution, language, autoplay or interaction context, sound-on/off expectations, and any
delivery constraints. Inventory the actual video, rendered frames, storyboard, edit timeline, captions,
transcript, audio, narration, source project, and reference cut separately.

Record playback or extraction limitations: variable frame rate, missing audio, proxy resolution, incomplete
range, frame reordering, compression, or unknown timing. If the evidence is only stills, route through the
appropriate static child and state that motion analysis is unavailable.

### V2 — Map temporal hierarchy and events

Extend the parent structural map into a time hierarchy:

- work or complete clip;
- segment or chapter;
- scene;
- shot;
- event or state change; and
- frame or short frame interval.

Assign stable IDs and exact timestamps or frame identifiers where available. Mark boundaries, cuts,
transitions, holds, high-motion passages, caption events, audio events, interactive states, and known
rendering discontinuities. Keep editorial units separate from visual events when they do not align.

### V3 — Plan temporal coverage and sampling

Apply the parent coverage rule across time. Inspect the beginning and end, every structural boundary, each
major event, transition before/during/after, caption and title-card interval, high-motion passage, long hold,
and suspected defect. Add deterministic interval samples through otherwise uneventful spans.

Record the inspected timestamps and frame neighborhoods, not merely “reviewed video.” A contact sheet or
sampled frame set can reveal scene structure but can miss single-frame flashes, jitter, or sync errors. For a
claimed transient defect, inspect the surrounding run at sufficient temporal resolution and preserve the
before/during/after evidence.

### V4 — Inspect static frame quality in context

At representative and high-risk frames, run the parent maps and the applicable static child. Inspect crop,
composition, text, graphics, overlays, focus, exposure, color, compression, masking, layering, and safe areas.
Then return each static finding to its temporal context: an awkward intermediate frame may be harmless during
fast intentional motion, while a one-frame wrong state can still create a visible flash.

Check whether subjects, UI elements, slides, charts, lower thirds, subtitles, and logos remain stable and
legible through motion. Use [`image.md`](image.md), [`ui.md`](ui.md), [`slides.md`](slides.md), or
[`chart.md`](chart.md) whenever that artifact is substantively present.

### V5 — Inspect continuity, motion, and state completion

For each meaningful event, compare before, during, and after:

- initial state appears when intended and does not leak early;
- motion direction, path, scale, rotation, opacity, and depth remain coherent;
- progress does not unexpectedly reverse, jump, flicker, jitter, tear, or pop;
- repeated animations use consistent timing where consistency supports comprehension;
- easing, acceleration, settling, and stagger express hierarchy and do not call attention accidentally;
- transitions preserve or deliberately reset spatial orientation;
- no dropped, duplicated, stale, or unfinished state is visible; and
- the final state completes and holds long enough for its purpose.

Distinguish capture/playback artifacts from authored defects by checking source frames, multiple playback
methods, or the timeline when available. Classify unresolved provenance as unknown rather than blaming design.

### V6 — Inspect pacing, attention, and narrative rhythm

Trace where attention is asked to move and whether visual change, editing, narration, music, and text compete
or cooperate. Evaluate shot duration, pause, reveal order, transition density, repetition, escalation,
variation, and the relation between content complexity and available reading or comprehension time.

Check title and caption hold time against actual text length and concurrent visual demand rather than using
one universal duration. Inspect whether rapid motion is purposeful, whether slow passages preserve engagement
or needed comprehension, and whether the ending resolves the promised action or message.

### V7 — Inspect text, captions, audio, and accessibility

For on-screen text and captions, check transcription against supplied copy or audio when available, timing,
line breaks, occlusion, contrast, speaker differentiation, placement, safe areas, and persistence across
cuts. Do not infer caption accuracy or audio meaning without readable text or audio/transcript evidence.

With audio, inspect narration-image relation, intelligibility, balance, abrupt cuts, noise, silence, music
competition, and sync among speech, captions, actions, and visual evidence. Without audio, explicitly mark
these checks not observed.

Inspect flashing or rapid-change risks, reliance on motion alone, reduced-motion alternatives where relevant,
caption and transcript coverage, meaningful non-speech audio cues, and whether information remains available
long enough to perceive. Formal thresholds require the current-authority verification owned by the parent.

### V8 — Evaluate motion aesthetics and reconcile findings

Apply parent aesthetic priorities to temporal craft: intentional rhythm, continuity, motivated transitions,
motion hierarchy, spatial coherence, pacing, sound-image fit, finish, genre, emotional arc, and platform fit.
Do not penalize energetic cuts, elastic motion, long holds, or restrained motion merely for diverging from a
preferred style. Evaluate how they serve the brief and what they cost.

Recheck a compelling overall cut for isolated transient defects and recheck a strange still within actual
motion. Every temporal finding names a timestamp or interval and the inspected before/during/after evidence.
Return static-only observations as static findings, not video-wide conclusions.

## References

- [`SKILL.md`](SKILL.md) owns shared framing, maps, coverage, evidence classes, aesthetics, verification,
  findings, and reporting.
- [`image.md`](image.md), [`ui.md`](ui.md), [`slides.md`](slides.md), and [`chart.md`](chart.md) compose with
  this child when the corresponding artifact is materially present in the video.
- [`scenarios.md`](scenarios.md) includes isolated-frame, transient-defect, sampling, caption, motion, and
  presentation-video cases.
- [`checklists.md`](checklists.md) contains the temporal evidence and handoff checks applied here.
