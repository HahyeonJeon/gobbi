#!/usr/bin/env node
// generate-electron-views.mjs — per-process `electron` module views.
//
// Derives three process-scoped views of the vendor `electron.d.ts` so that each
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
// THE THREE TRANSFORMATIONS, applied to a copy of the vendor file:
//   1. for main and preload, Common-only members are merged into the primary
//      process namespace with `export import` aliases;
//   2. the single line `  export = Electron.CrossProcessExports;` inside
//      `declare module 'electron'` exports that primary namespace directly,
//      preserving both its value and type sides (renderer stays empty);
//   3. the leading `/// <reference types="node" />` is dropped, so each target
//      controls its own `types` (the main pass wants `["node"]`; the preload
//      and renderer passes want `[]`).
// Each per-process tsconfig then maps `electron` to its own view via `paths`,
// and examples keep the ordinary bare `import ... from 'electron'` specifier
// that real Electron code writes.
//
// WHY NOT `typeof Main & typeof Common`. That expression preserves the values
// but drops namespace-only types such as `WebContents` and
// `IpcMainInvokeEvent`. Correct `import type` statements then fail with TS2305,
// which is indistinguishable from the harness's wrong-process signal. Direct
// namespace export plus aliases preserves both sides.
//
// SELF-FAILING. Each substitution must match EXACTLY ONE line, and the
// namespace analysis must find the exact vendor shape it derives from. A
// vendor bump that changes either exits non-zero rather than emitting a
// silently-unscoped or type-incomplete view.
//
// Exit codes:
//   0  ok — three views written
//   2  usage / IO error (the vendor `electron.d.ts` is missing — run the install)
//   3  DRIFT — a substitution anchor matched other than exactly one line

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const here = dirname(fileURLToPath(import.meta.url));
const vendorPath = join(here, "node_modules", "electron", "electron.d.ts");
const outDir = join(here, "generated");

const MODULE_ANCHOR = "declare module 'electron' {";
const EXPORT_ANCHOR = "  export = Electron.CrossProcessExports;";
const NODE_REF_ANCHOR = '/// <reference types="node" />';

// One view per process target. Main and preload export the vendor's own
// namespace directly after receiving Common-only aliases. `renderer` gets a
// named empty interface: a
// correctly written renderer imports NO Electron module at all — everything it
// needs arrives over the contextBridge — so every `electron` import must fail.
const VIEWS = [
  {
    process: "main",
    primaryNamespace: "Main",
    surface: "Electron.Main plus Electron.Common-only aliases",
  },
  {
    process: "preload",
    primaryNamespace: "Renderer",
    surface: "Electron.Renderer plus Electron.Common-only aliases",
  },
  {
    process: "renderer",
    primaryNamespace: null,
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
const vendorAst = ts.createSourceFile(
  vendorPath,
  vendorSource,
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TS
);

function failDrift(label, detail) {
  process.stderr.write(
    `FAIL: ${label}: ${detail}\n` +
      `      vendor typings: ${vendorPath}\n` +
      "      the vendor typings changed shape — re-derive the process views before trusting them\n"
  );
  process.exit(3);
}

if (vendorAst.parseDiagnostics.length !== 0) {
  failDrift(
    "the vendor declaration parse",
    ts.flattenDiagnosticMessageText(vendorAst.parseDiagnostics[0].messageText, "\n")
  );
}

function namespaceBlock(statements, name, label) {
  const matches = statements.filter(
    (statement) =>
      ts.isModuleDeclaration(statement) &&
      ts.isIdentifier(statement.name) &&
      statement.name.text === name
  );
  if (matches.length !== 1) {
    failDrift(
      label,
      `found ${matches.length} namespace declaration(s) named ${JSON.stringify(name)}, expected 1`
    );
  }
  const body = matches[0].body;
  if (!body || !ts.isModuleBlock(body)) {
    failDrift(label, `namespace ${JSON.stringify(name)} does not have one direct module block`);
  }
  return body;
}

function namespaceMemberNames(block, label) {
  const names = [];
  for (const statement of block.statements) {
    if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        if (!ts.isIdentifier(declaration.name)) {
          failDrift(label, "found a variable member whose name is not an identifier");
        }
        names.push(declaration.name.text);
      }
      continue;
    }
    if (!statement.name || !ts.isIdentifier(statement.name)) {
      failDrift(label, `found unsupported namespace member kind ${ts.SyntaxKind[statement.kind]}`);
    }
    names.push(statement.name.text);
  }
  if (names.length === 0) {
    failDrift(label, "found no namespace members");
  }
  return new Set(names);
}

const electronBlock = namespaceBlock(vendorAst.statements, "Electron", "the top-level Electron namespace");
const commonMembers = namespaceMemberNames(
  namespaceBlock(electronBlock.statements, "Common", "the Electron.Common namespace"),
  "the Electron.Common namespace"
);
const primaryMembers = new Map(
  ["Main", "Renderer"].map((name) => [
    name,
    namespaceMemberNames(
      namespaceBlock(electronBlock.statements, name, `the Electron.${name} namespace`),
      `the Electron.${name} namespace`
    ),
  ])
);

function commonOnlyAugmentation(primaryNamespace) {
  if (primaryNamespace === null) return [];
  const primary = primaryMembers.get(primaryNamespace);
  if (!primary) {
    failDrift(
      "the configured process namespace",
      `no analyzed namespace named ${JSON.stringify(primaryNamespace)}`
    );
  }
  const commonOnly = [...commonMembers].filter((name) => !primary.has(name));
  if (commonOnly.length === 0) return [];
  return [
    "declare namespace Electron {",
    `  namespace ${primaryNamespace} {`,
    ...commonOnly.map((name) => `    export import ${name} = Electron.Common.${name};`),
    "  }",
    "}",
    "",
  ];
}

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
    MODULE_ANCHOR,
    [...commonOnlyAugmentation(view.primaryNamespace), MODULE_ANCHOR],
    `the 'electron' module declaration anchor (${view.process} view)`
  );
  const moduleExport =
    view.primaryNamespace === null
      ? [...view.decls, "  export = scoped;"]
      : [`  export = Electron.${view.primaryNamespace};`];
  lines = substituteExactlyOnce(
    lines,
    EXPORT_ANCHOR,
    moduleExport,
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
