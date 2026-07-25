#!/usr/bin/env bun
// extract-blocks.mjs — extractor half of the `electron` example-verification
// harness.
//
// ORIGIN. Copied from `examples/typescript/extract-blocks.mjs` and modified.
// It is a COPY, not a shared module: the process-tag vocabulary, the
// error-on-untagged rule, the process-keyed linkage and the non-`ts` fence rule
// are Electron-specific, and pushing them into the `typescript` harness would
// change what that skill's examples resolve against and force its green to be
// re-proven. The cost of a copy is drift; the mitigation is this header, which
// names the origin file and ALL SIX deltas below.
//
// THE SIX DELTAS FROM THE ORIGIN FILE
//   1. PROCESS WORDS.        `main` / `preload` / `renderer` are parsed
//      orthogonally to the category words, so a fence reads `ts main
//      expect-error`. `key=` is NOT overloaded to carry the process.
//   2. UNTAGGED IS AN ERROR. A `ts` block with no process word is a hard error,
//      never a default. A default would route untagged blocks into one pass and
//      reintroduce the single-config false pass this harness exists to prevent.
//   3. PER-PROCESS UNIT DIRS. Units are written to `units/main/`,
//      `units/preload/` and `units/renderer/`; the runner type-checks each
//      directory against that process's own tsconfig.
//   4. TSX MARKER GUARD.     A `tsx` fence must carry the info-string token
//      `uncompiled`. Marked `tsx` blocks are counted and NOT compiled; an
//      unmarked one is a hard error. The origin file dropped every non-`ts`
//      fence before recording it, so this guard needs the parse loop
//      restructured — it is not a token-loop delta.
//   5. PROCESS-KEYED LINKAGE. Prelude/partial linkage is keyed by
//      (process, key), an explicit `key=` is REQUIRED on every `prelude` and
//      every `partial`, and an orphan prelude is written into its own process
//      directory. The origin file keyed by `key` alone and treated the empty key
//      as a shared default, so a keyless renderer prelude was concatenated into
//      a keyless main partial — the harness performing, inside its own
//      machinery, the cross-process mixing it exists to forbid.
//   6. UNSUPPORTED LANGUAGE IS AN ERROR. A fence whose language is not `ts`,
//      `typescript` or `tsx` is a hard error unless it is on the non-code
//      allowlist (`text`, `yaml`, `json`, `sh`, `console`). The origin file
//      silently skipped `js` / `jsx` / `json` / untagged fences, so a block that
//      was never extracted was also never counted, and a coverage claim over the
//      skill docs could not be falsified. Electron's vendor documentation writes
//      its samples as ```js, so this is the likeliest way for a taught fact to
//      vanish.
//
// One further trap of the origin file is fixed here, and it is not a delta of
// the tagging scheme: the origin's token loop had no `else`, so any unrecognized
// info-string token was silently discarded. A misspelled `expect-erro` became a
// plain `complete` block with no signal. Every unrecognized token is an error
// here.
//
// Usage:  bun extract-blocks.mjs <out-units-dir> <md-file-or-dir> [more...]
//
// Categories (read from the fenced info string — the words after the language
// token; a `ts` block with NO category word defaults to `complete`):
//   complete      self-contained module; must type-check clean (DEFAULT)
//   partial       needs a prelude; compiled as <prelude-src>\n<partial-src>
//   prelude       shared decls for the partials that share its (process, key=);
//                 an orphan prelude (no partner partial) is compiled standalone
//   expect-error  an intentionally-bad block; the bad line is preceded by
//                 `// @ts-expect-error`, so the block type-checks clean IFF
//                 the error is present (self-verifying)
//   type-level    a type-assertion block; asserts via `// @ts-expect-error`
//                 (no expect-type / tsd dependency); compiled like `complete`
//
// Processes (delta 1 — exactly one is REQUIRED on every `ts` block):
//   main | preload | renderer
//
// Outputs, beside the unit directories:
//   <out-units-dir>/manifest.txt   `key=value` counts the runner reports —
//                                  units_{main,preload,renderer}, units_total,
//                                  ts_blocks, tsx_uncompiled.
//
// Exit codes:
//   0  ok — >=1 unit written
//   2  usage / IO error, or a partial with no matching prelude
//   3  FAIL-CLOSED — zero `ts` blocks found (a broken parser or a no-example
//      input must NEVER be reported as a pass)
//   4  FENCE-TAGGING VIOLATION — deltas 2, 4, 5 and 6, and the unknown-token
//      guard. Every violation in the input is reported, not just the first.

import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync } from "node:fs";
import { join, extname } from "node:path";

const argv = process.argv.slice(2);
if (argv.length < 2) {
  process.stderr.write("usage: extract-blocks.mjs <out-units-dir> <md-file-or-dir> [more...]\n");
  process.exit(2);
}
const outDir = argv[0];
const inputs = argv.slice(1);

// ---- collect markdown inputs ------------------------------------------------
// A directory is recursed for `*.md`; a direct file argument is taken as-is
// (any extension), so a caller can point the harness at one specific doc.
function collectMarkdown(target) {
  let st;
  try {
    st = statSync(target);
  } catch {
    process.stderr.write(`FAIL: input not found: ${target}\n`);
    process.exit(2);
  }
  if (st.isDirectory()) {
    const found = [];
    for (const name of readdirSync(target).sort()) {
      const child = join(target, name);
      if (statSync(child).isDirectory()) found.push(...collectMarkdown(child));
      else if (extname(name) === ".md") found.push(child);
    }
    return found;
  }
  return [target];
}

const mdFiles = [];
for (const inp of inputs) mdFiles.push(...collectMarkdown(inp));

// ---- parse fenced code blocks ----------------------------------------------
// CommonMark fences: >=3 backticks or tildes open a block; it closes at the
// first later line with >= the opening run of the SAME fence char and only
// trailing whitespace. The language is the first token of the info string.
const OPEN_RE = /^(\s*)(`{3,}|~{3,})(.*)$/;
const CATEGORY_WORDS = new Set(["complete", "partial", "prelude", "expect-error", "type-level"]);
// Delta 1. Orthogonal to CATEGORY_WORDS: a fence carries one of each.
const PROCESS_WORDS = new Set(["main", "preload", "renderer"]);
// Delta 6. Fences that are prose, config or shell transcript rather than code
// this harness compiles. Anything outside this set and {ts, typescript, tsx} is
// an error, so a block can never vanish uncounted.
const NON_CODE_LANGS = new Set(["text", "yaml", "json", "sh", "console"]);
// Delta 4. A `tsx` fence declares itself deliberately not compiled by this
// harness (no JSX runtime is installed); the marker is an info-string token
// because that is machine-checkable and sits on the fence itself.
const TSX_MARKER = "uncompiled";

// Delta 2/4/5/6 violations are COLLECTED, not thrown at the first hit: one run
// over a doc set should report every mistagged fence, and a single fixture that
// carries two different violations must show both.
const tagErrors = [];
function tagError(kind, file, line, message) {
  tagErrors.push(`FAIL[${kind}] ${file}:${line}: ${message}`);
}

const blocks = []; // { process, category, key, source, file, line }
let tsBlockCount = 0;
let tsxUncompiledCount = 0;

for (const file of mdFiles) {
  const lines = readFileSync(file, "utf8").split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const open = OPEN_RE.exec(lines[i]);
    if (!open) continue;
    const fenceLine = i + 1;
    const fenceChar = open[2][0];
    const fenceLen = open[2].length;
    const info = open[3].trim();

    // gather the body up to the matching close fence
    const body = [];
    let j = i + 1;
    for (; j < lines.length; j++) {
      const close = /^(\s*)(`{3,}|~{3,})\s*$/.exec(lines[j]);
      if (close && close[2][0] === fenceChar && close[2].length >= fenceLen) break;
      body.push(lines[j]);
    }
    i = j; // continue scanning after the close fence (or EOF)

    const tokens = info.split(/\s+/).filter(Boolean);
    const lang = (tokens[0] ?? "").toLowerCase();
    const rest = tokens.slice(1);

    // Delta 6 restructures this dispatch. The origin file `continue`d on every
    // non-`ts` language before the block was recorded, which is why the `tsx`
    // guard cannot live in the token loop.
    if (lang === "ts" || lang === "typescript") {
      tsBlockCount++;

      let category = "complete";
      let processTag = "";
      let key = "";
      let rejected = false;

      for (const t of rest) {
        const low = t.toLowerCase();
        if (CATEGORY_WORDS.has(low)) {
          category = low;
        } else if (PROCESS_WORDS.has(low)) {
          // Delta 1. Parsed here, orthogonally to the category word above.
          processTag = low;
        } else if (low.startsWith("key=")) {
          key = t.slice(4);
        } else {
          // The origin file had no `else` here and discarded this token in
          // silence, so a typo degraded a block instead of failing it.
          tagError(
            "unknown-token",
            file,
            fenceLine,
            `unrecognized info-string token '${t}' on a \`${lang}\` fence — expected one category ` +
              `(${[...CATEGORY_WORDS].join(", ")}), one process (${[...PROCESS_WORDS].join(", ")}) ` +
              "and an optional `key=NAME`"
          );
          rejected = true;
        }
      }

      // Delta 2. The single change that makes the multi-pass design real.
      if (!processTag) {
        tagError(
          "untagged-process",
          file,
          fenceLine,
          "a `ts` block carries no process word — tag it `main`, `preload` or `renderer`. " +
            "There is deliberately no default: an untagged block routed to one pass would be " +
            "certified against the wrong process boundary"
        );
        rejected = true;
      }

      // Delta 5. An explicit key on both ends of the linkage; the origin's
      // empty-key shared bucket let a prelude of one process be concatenated
      // into a partial of another.
      if ((category === "prelude" || category === "partial") && key === "") {
        tagError(
          "keyless-linkage",
          file,
          fenceLine,
          `a \`${category}\` block has no \`key=NAME\` — it is required on every prelude and every ` +
            "partial. The empty key is not a shared default here"
        );
        rejected = true;
      }

      if (!rejected) {
        blocks.push({ process: processTag, category, key, source: body.join("\n"), file, line: fenceLine });
      }
    } else if (lang === "tsx") {
      // Delta 4.
      if (rest.some((t) => t.toLowerCase() === TSX_MARKER)) {
        tsxUncompiledCount++;
      } else {
        tagError(
          "tsx-unmarked",
          file,
          fenceLine,
          "a `tsx` fence carries no `uncompiled` token — this harness installs no JSX runtime, so a " +
            "`tsx` block must declare itself uncompiled on the fence (```tsx uncompiled). Silently " +
            "dropping it would leave a taught fact unverified and uncounted"
        );
      }
    } else if (NON_CODE_LANGS.has(lang)) {
      // Prose, config or a shell transcript: nothing to compile, and counted as
      // deliberately excluded rather than lost.
    } else {
      // Delta 6.
      tagError(
        "unsupported-language",
        file,
        fenceLine,
        lang === ""
          ? "a fence carries no language tag — every fence must declare one, so that a block is " +
              `never skipped uncounted. Use \`ts\`/\`tsx\`, or one of ${[...NON_CODE_LANGS].join(", ")}`
          : `unsupported fence language '${lang}' — this skill's examples are TypeScript. Rewrite a ` +
              `\`js\`/\`jsx\` sample as \`ts\`/\`tsx\`, or use one of ${[...NON_CODE_LANGS].join(", ")}`
      );
    }
  }
}

// ---- fence-tagging violations ----------------------------------------------
// Checked BEFORE the fail-closed guard: a file whose only `ts` block was
// rejected must report the tagging violation that rejected it, not the
// downstream "zero blocks" symptom.
if (tagErrors.length > 0) {
  for (const e of tagErrors) process.stderr.write(`${e}\n`);
  process.stderr.write(
    `FAIL: ${tagErrors.length} fence-tagging violation(s) in [${inputs.join(", ")}] — see the six ` +
      "deltas in the header of this file\n"
  );
  process.exit(4);
}

// ---- fail-closed: zero ts blocks -------------------------------------------
if (tsBlockCount === 0) {
  process.stderr.write(
    `FAIL: no fenced 'ts' / 'typescript' blocks found in [${inputs.join(", ")}] — fail-closed (a ` +
      `broken parser or a no-example input is never a pass); ${tsxUncompiledCount} \`tsx uncompiled\` ` +
      "block(s) are counted but never compiled and cannot satisfy this check\n"
  );
  process.exit(3);
}

// ---- resolve prelude/partial linkage ---------------------------------------
// Delta 5. Keyed by (process, key), so two processes may reuse a key name
// without their preludes ever meeting.
const linkKey = (process_, key) => `${process_} ${key}`;

// Keyed `"<process> <key>"`. Both halves come from whitespace-split info-string
// tokens, so neither can contain a space and no two pairs can collide.
const preludesByLink = new Map(); // "<process> <key>" -> [source, ...]
for (const b of blocks) {
  if (b.category !== "prelude") continue;
  const k = linkKey(b.process, b.key);
  const arr = preludesByLink.get(k) ?? [];
  arr.push(b.source);
  preludesByLink.set(k, arr);
}
const usedPreludeLinks = new Set();

// Delta 3. One counter and one directory per process.
const unitCounts = { main: 0, preload: 0, renderer: 0 };
function writeUnit(process_, category, source) {
  const dir = join(outDir, process_);
  mkdirSync(dir, { recursive: true });
  const name = `unit-${String(unitCounts[process_]).padStart(3, "0")}-${category}.ts`;
  writeFileSync(join(dir, name), source.endsWith("\n") ? source : `${source}\n`);
  unitCounts[process_] += 1;
}

for (const b of blocks) {
  if (b.category === "prelude") continue; // emitted after the loop if orphaned
  if (b.category === "partial") {
    const preludes = preludesByLink.get(linkKey(b.process, b.key));
    if (!preludes || preludes.length === 0) {
      process.stderr.write(
        `FAIL[orphan-partial] ${b.file}:${b.line}: a \`${b.process}\` partial (key='${b.key}') has no ` +
          `matching prelude — add a \`ts ${b.process} prelude key=${b.key}\` block. A prelude of another ` +
          "process does NOT match: linkage is keyed by (process, key)\n"
      );
      process.exit(2);
    }
    usedPreludeLinks.add(linkKey(b.process, b.key));
    writeUnit(b.process, "partial", `${preludes.join("\n")}\n${b.source}`);
  } else {
    // complete | expect-error | type-level -> compiled standalone
    writeUnit(b.process, b.category, b.source);
  }
}

// An orphan prelude (declared but never consumed by a partial) is still
// compiled standalone, so a broken one is caught rather than silently skipped.
// Delta 5 gives it a home: its own process directory, never a shared bucket.
for (const [k, sources] of preludesByLink) {
  if (usedPreludeLinks.has(k)) continue;
  const [process_] = k.split(" ");
  writeUnit(process_, "prelude", sources.join("\n"));
}

const unitTotal = unitCounts.main + unitCounts.preload + unitCounts.renderer;
if (unitTotal === 0) {
  // defense in depth: blocks>0 must always yield >=1 unit
  process.stderr.write("FAIL: ts blocks found but no compilable unit produced — fail-closed\n");
  process.exit(3);
}

// The two counts EL-R-16 needs, in a form the runner can read without jq. It
// lives at the root of the units directory, beside the per-process directories,
// so no compile pass ever sees it.
writeFileSync(
  join(outDir, "manifest.txt"),
  [
    `units_main=${unitCounts.main}`,
    `units_preload=${unitCounts.preload}`,
    `units_renderer=${unitCounts.renderer}`,
    `units_total=${unitTotal}`,
    `ts_blocks=${tsBlockCount}`,
    `tsx_uncompiled=${tsxUncompiledCount}`,
    "",
  ].join("\n")
);

process.stdout.write(
  `extracted ${unitTotal} unit(s) from ${tsBlockCount} ts block(s) — ` +
    `main=${unitCounts.main} preload=${unitCounts.preload} renderer=${unitCounts.renderer}\n`
);
process.stdout.write(`tsx blocks marked \`uncompiled\` (counted, never compiled): ${tsxUncompiledCount}\n`);
process.exit(0);
