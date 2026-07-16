#!/usr/bin/env bun
// extract-blocks.mjs — extractor half of the example-verification harness.
//
// Reads markdown, pulls every fenced `ts` / `typescript` block, groups the
// blocks by category, and writes one compilable `.ts` unit per example into
// <out-units-dir>. run-examples.sh (the runner half) then type-checks the
// units with the LOCAL tsc under tsconfig.examples.json.
//
// Usage:  bun extract-blocks.mjs <out-units-dir> <md-file-or-dir> [more...]
//
// Categories (read from the fenced info string — the words after the language
// token; a `ts` block with NO category word defaults to `complete`):
//   complete      self-contained module; must type-check clean (DEFAULT)
//   partial       needs a prelude; compiled as <prelude-src>\n<partial-src>
//   prelude       shared decls for the partials that share its `key=`; an
//                 orphan prelude (no partner partial) is compiled standalone
//   expect-error  an intentionally-bad block; the bad line is preceded by
//                 `// @ts-expect-error`, so the block type-checks clean IFF
//                 the error is present (self-verifying)
//   type-level    a type-assertion block; asserts via `// @ts-expect-error`
//                 (no expect-type / tsd dependency); compiled like `complete`
//
// Prelude/partial linkage: `ts prelude key=NAME` + `ts partial key=NAME` link
// by NAME. `key=` may be omitted — the empty key is the shared default.
//
// Exit codes:
//   0  ok — >=1 unit written
//   2  usage / IO error, or a partial with no matching prelude
//   3  FAIL-CLOSED — zero `ts` blocks found (a broken parser or a no-example
//      input must NEVER be reported as a pass)

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
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

const blocks = []; // { category, key, source, file }
for (const file of mdFiles) {
  const lines = readFileSync(file, "utf8").split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const open = OPEN_RE.exec(lines[i]);
    if (!open) continue;
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
    const lang = (tokens[0] || "").toLowerCase();
    if (lang !== "ts" && lang !== "typescript") continue;

    let category = "complete";
    let key = "";
    for (const t of tokens.slice(1)) {
      const low = t.toLowerCase();
      if (CATEGORY_WORDS.has(low)) category = low;
      else if (low.startsWith("key=")) key = t.slice(4);
    }
    blocks.push({ category, key, source: body.join("\n"), file });
  }
}

// ---- fail-closed: zero ts blocks -------------------------------------------
if (blocks.length === 0) {
  process.stderr.write(
    `FAIL: no fenced 'ts' / 'typescript' blocks found in [${inputs.join(", ")}] — fail-closed (a broken parser or a no-example input is never a pass)\n`
  );
  process.exit(3);
}

// ---- resolve prelude/partial linkage ---------------------------------------
const preludesByKey = new Map(); // key -> [source, ...]
for (const b of blocks) {
  if (b.category !== "prelude") continue;
  const arr = preludesByKey.get(b.key) ?? [];
  arr.push(b.source);
  preludesByKey.set(b.key, arr);
}
const usedPreludeKeys = new Set();

let unitIdx = 0;
function writeUnit(category, source) {
  const name = `unit-${String(unitIdx).padStart(3, "0")}-${category}.ts`;
  writeFileSync(join(outDir, name), source.endsWith("\n") ? source : `${source}\n`);
  unitIdx++;
}

for (const b of blocks) {
  if (b.category === "prelude") continue; // emitted after the loop if orphaned
  if (b.category === "partial") {
    const preludes = preludesByKey.get(b.key);
    if (!preludes || preludes.length === 0) {
      process.stderr.write(
        `FAIL: partial block (key='${b.key}') in ${b.file} has no matching prelude — add a \`ts prelude key=${b.key}\` block\n`
      );
      process.exit(2);
    }
    usedPreludeKeys.add(b.key);
    writeUnit("partial", `${preludes.join("\n")}\n${b.source}`);
  } else {
    // complete | expect-error | type-level -> compiled standalone
    writeUnit(b.category, b.source);
  }
}

// An orphan prelude (declared but never consumed by a partial) is still
// compiled standalone, so a broken one is caught rather than silently skipped.
for (const [key, sources] of preludesByKey) {
  if (!usedPreludeKeys.has(key)) writeUnit("prelude", sources.join("\n"));
}

if (unitIdx === 0) {
  // defense in depth: blocks>0 must always yield >=1 unit
  process.stderr.write("FAIL: ts blocks found but no compilable unit produced — fail-closed\n");
  process.exit(3);
}

process.stdout.write(`extracted ${unitIdx} unit(s) from ${blocks.length} ts block(s)\n`);
process.exit(0);
