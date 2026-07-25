#!/usr/bin/env node
// generate-electron-views.mjs — per-process `electron` module views.
//
// Derives three type-only views of the vendor `electron.d.ts` so that each
// per-process tsconfig resolves the bare specifier `electron` to a DIFFERENT
// module surface. Run at install time (the `postinstall` script) and runnable
// standalone: `node generate-electron-views.mjs`.
//
// WHY this exists. `electron.d.ts` is one monolithic declaration whose module
// surface is `Electron.CrossProcessExports` — every main, preload and renderer
// API in one module. No `lib` / `types` setting separates them, so a main unit
// importing `ipcRenderer` and a renderer unit importing `app` both compile
// clean. That is the most Electron-specific boundary error there is, and the
// ambient-globals split cannot see it.
//
// WHY NOT the subpath specifier. The same file declares process-scoped module
// namespaces (`electron/main`, `electron/common`, `electron/renderer`,
// `electron/utility`), but `electron@43.2.0` ships no `exports` map and no
// `typesVersions`. Under `module: nodenext`, `import { app } from
// 'electron/main'` fails with TS2307: on-disk resolution is attempted, there is
// no `main.d.ts`, and TypeScript does not fall back to the ambient declaration.
// So examples cannot reach the namespaces by writing the subpath.
//
// THE TWO SUBSTITUTIONS, applied to a copy of the vendor file:
//   1. the single line `  export = Electron.CrossProcessExports;` inside
//      `declare module 'electron'` becomes a `const` of the process-scoped
//      surface plus `export = <that const>`;
//   2. the leading `/// <reference types="node" />` is dropped, so each target
//      controls its own `types` (the main pass wants `["node"]`; the preload
//      and renderer passes want `[]`).
// Each per-process tsconfig then maps `electron` to its own view via `paths`,
// and examples keep the ordinary bare `import ... from 'electron'` specifier
// that real Electron code writes.
//
// SELF-FAILING. Each substitution must match EXACTLY ONE line. A vendor bump
// that renames or duplicates an anchor exits non-zero rather than emitting a
// silently-unscoped view — an unscoped view would let every wrong-process
// import compile clean, which is exactly the failure the harness exists to
// catch.
//
// Exit codes:
//   0  ok — three views written
//   2  usage / IO error (the vendor `electron.d.ts` is missing — run the install)
//   3  DRIFT — a substitution anchor matched other than exactly one line

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const vendorPath = join(here, "node_modules", "electron", "electron.d.ts");
const outDir = join(here, "generated");

const EXPORT_ANCHOR = "  export = Electron.CrossProcessExports;";
const NODE_REF_ANCHOR = '/// <reference types="node" />';

// One view per process target. `surface` is spliced into the generated `const`.
// `renderer` gets a named empty interface, not a namespace intersection: a
// correctly written renderer imports NO Electron module at all — everything it
// needs arrives over the contextBridge — so every `electron` import must fail.
const VIEWS = [
  {
    process: "main",
    decls: ["  const scoped: typeof Electron.Main & typeof Electron.Common;"],
    surface: "Electron.Main & Electron.Common",
  },
  {
    process: "preload",
    decls: ["  const scoped: typeof Electron.Renderer & typeof Electron.Common;"],
    surface: "Electron.Renderer & Electron.Common",
  },
  {
    process: "renderer",
    decls: [
      "  interface NoElectronModuleInRenderer {",
      "    // Intentionally empty: a renderer imports nothing from 'electron'.",
      "  }",
      "  const scoped: NoElectronModuleInRenderer;",
    ],
    surface: "nothing (a renderer imports no Electron module)",
  },
];

if (!existsSync(vendorPath)) {
  process.stderr.write(
    `FAIL: vendor typings not found at ${vendorPath} — run 'bun install' in ${here} first\n`
  );
  process.exit(2);
}

const vendorSource = readFileSync(vendorPath, "utf8");
const vendorLines = vendorSource.split(/\r?\n/);

// Replace every line equal to `anchor` with `replacement`, and fail unless the
// anchor matched exactly once. The count check is the drift guard, so it runs
// before anything is written to disk.
function substituteExactlyOnce(lines, anchor, replacement, label) {
  const hits = [];
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i] === anchor) {
      hits.push(i + 1);
      out.push(...replacement);
    } else {
      out.push(lines[i]);
    }
  }
  if (hits.length !== 1) {
    process.stderr.write(
      `FAIL: ${label} matched ${hits.length} line(s) in ${vendorPath}, expected exactly 1` +
        (hits.length > 1 ? ` (lines ${hits.join(", ")})` : "") +
        `\n      anchor: ${JSON.stringify(anchor)}\n` +
        "      the vendor typings changed shape — re-derive the substitution before trusting any view\n"
    );
    process.exit(3);
  }
  return out;
}

// Build every view in memory first, then write. A vendor bump that breaks an
// anchor must leave NO view on disk — a half-written `generated/` would pair a
// scoped view with a stale one and enforce a different boundary per process.
const pending = [];
for (const view of VIEWS) {
  const banner = [
    `// GENERATED — do not edit. Source: node_modules/electron/electron.d.ts`,
    `// Producer: generate-electron-views.mjs (runs at install; rerun with 'node generate-electron-views.mjs')`,
    `// View: ${view.process} — the bare specifier 'electron' resolves to ${view.surface}.`,
    "",
  ];

  let lines = substituteExactlyOnce(
    vendorLines,
    EXPORT_ANCHOR,
    [...view.decls, "  export = scoped;"],
    `the 'electron' module export anchor (${view.process} view)`
  );
  lines = substituteExactlyOnce(
    lines,
    NODE_REF_ANCHOR,
    ["// (removed by generate-electron-views.mjs: each target sets its own `types`)"],
    `the node triple-slash reference (${view.process} view)`
  );

  pending.push({
    path: join(outDir, `electron-${view.process}.d.ts`),
    content: `${banner.join("\n")}${lines.join("\n")}`,
  });
}

mkdirSync(outDir, { recursive: true });
for (const { path, content } of pending) writeFileSync(path, content);

process.stdout.write(`generated ${pending.length} electron view(s) in ${outDir}\n`);
process.exit(0);
