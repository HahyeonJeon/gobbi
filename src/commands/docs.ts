/**
 * gobbi docs — Command router for docs subcommands.
 *
 * Subcommands:
 *   init <type> [name]       Scaffold a new JSON template
 *   json2md <path>           Convert JSON template to Markdown
 *   md2json <path>           Migrate Markdown file to JSON template
 *   validate <path>          Validate a JSON template
 *   read <path> [--section]  Pretty-print JSON template metadata or section
 */

import { parseArgs } from 'node:util';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

import { header, ok, error, dim, bold, yellow } from '../lib/style.js';
import { renderDoc } from '../lib/docs/renderer.js';
import { parseMarkdown } from '../lib/docs/migrator.js';
import { validateFile } from '../lib/docs/validator.js';
import {
  isDocType,
  DOC_TYPE_TO_SCHEMA,
  VALID_DOC_TYPES,
} from '../lib/docs/types.js';

import type {
  DocType,
  GobbiDoc,
  GotchaDoc,
  Section,
  ContentBlock,
} from '../lib/docs/types.js';

// ---------------------------------------------------------------------------
// Usage Strings
// ---------------------------------------------------------------------------

const USAGE = `Usage: gobbi docs <subcommand> [options]

Subcommands:
  init <type> [name]       Scaffold a new JSON template
  json2md <path>           Convert JSON template to Markdown
  md2json <path>           Migrate Markdown file to JSON template
  validate <path>          Validate a JSON template
  read <path> [--section]  Pretty-print JSON metadata or section

Options:
  --help    Show this help message`;

const INIT_USAGE = `Usage: gobbi docs init <type> [name] [options]

Types: skill, agent, rule, root, child, gotcha

Options:
  --out <path>    Write JSON to file instead of stdout
  --help          Show this help message`;

const JSON2MD_USAGE = `Usage: gobbi docs json2md <path> [options]

Converts a JSON template to Markdown. Writes the .md file alongside the .json.

Options:
  --help    Show this help message`;

const MD2JSON_USAGE = `Usage: gobbi docs md2json <path> [options]

Migrates a Markdown file to its JSON template equivalent. Writes the .json file
alongside the .md, or outputs to stdout with --stdout.

Options:
  --stdout    Write JSON to stdout instead of file
  --help      Show this help message`;

const VALIDATE_USAGE = `Usage: gobbi docs validate <path> [options]

Validates a JSON template against the gobbi-docs schema.

Options:
  --help    Show this help message`;

const READ_USAGE = `Usage: gobbi docs read <path> [options]

Pretty-print JSON template metadata or a specific section.

Options:
  --section <name>    Display only the named section
  --help              Show this help message`;

// ---------------------------------------------------------------------------
// Top-Level Router
// ---------------------------------------------------------------------------

/**
 * Top-level handler for `gobbi docs`. Dispatches to subcommands.
 * Called from cli.ts with process.argv.slice(3).
 */
export async function runDocs(args: string[]): Promise<void> {
  const subcommand = args[0];

  switch (subcommand) {
    case 'init':
      await runDocsInit(args.slice(1));
      break;
    case 'json2md':
      await runDocsJson2md(args.slice(1));
      break;
    case 'md2json':
      await runDocsMd2json(args.slice(1));
      break;
    case 'validate':
      await runDocsValidate(args.slice(1));
      break;
    case 'read':
      await runDocsRead(args.slice(1));
      break;
    case '--help':
    case undefined:
      console.log(USAGE);
      break;
    default:
      console.log(error(`Unknown subcommand: ${subcommand}`));
      console.log(USAGE);
      process.exit(1);
  }
}

// ---------------------------------------------------------------------------
// init
// ---------------------------------------------------------------------------

async function runDocsInit(args: string[]): Promise<void> {
  const { values, positionals } = parseArgs({
    args,
    allowPositionals: true,
    strict: false,
    options: {
      'out': { type: 'string' },
      'help': { type: 'boolean', default: false },
    },
  });

  if (values.help === true) {
    console.log(INIT_USAGE);
    return;
  }

  const typeArg = positionals[0];
  if (typeArg === undefined) {
    console.log(error('Missing required argument: doc type'));
    console.log(INIT_USAGE);
    process.exit(1);
  }

  if (!isDocType(typeArg)) {
    console.log(error(`Invalid doc type: "${typeArg}". Must be one of: ${VALID_DOC_TYPES.join(', ')}`));
    process.exit(1);
  }
  const docType: DocType = typeArg;

  const name = positionals[1] ?? docType;
  const template = scaffoldTemplate(docType, name);
  const json = JSON.stringify(template, null, 2) + '\n';

  const outPath = values.out;
  if (typeof outPath === 'string') {
    await writeFile(outPath, json, 'utf8');
    console.log(ok(`Template written to ${outPath}`));
  } else {
    process.stdout.write(json);
  }
}

// ---------------------------------------------------------------------------
// json2md
// ---------------------------------------------------------------------------

async function runDocsJson2md(args: string[]): Promise<void> {
  const { values, positionals } = parseArgs({
    args,
    allowPositionals: true,
    strict: false,
    options: {
      'help': { type: 'boolean', default: false },
    },
  });

  if (values.help === true) {
    console.log(JSON2MD_USAGE);
    return;
  }

  const jsonPath = positionals[0];
  if (jsonPath === undefined) {
    console.log(error('Missing required argument: JSON file path'));
    console.log(JSON2MD_USAGE);
    process.exit(1);
  }

  let content: string;
  try {
    content = await readFile(jsonPath, 'utf8');
  } catch {
    console.log(error(`Cannot read file: ${jsonPath}`));
    process.exit(1);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    console.log(error('Invalid JSON'));
    process.exit(1);
  }

  // Quick validation before rendering
  const doc = parsed as GobbiDoc;
  if (typeof doc.$schema !== 'string' || !doc.$schema.startsWith('gobbi-docs/')) {
    console.log(error('Invalid or missing "$schema" — not a gobbi-docs template'));
    process.exit(1);
  }

  const markdown = renderDoc(doc);
  const dir = path.dirname(jsonPath);
  const basename = path.basename(jsonPath, '.json');
  const mdPath = path.join(dir, `${basename}.md`);

  await writeFile(mdPath, markdown, 'utf8');

  console.log(header('json2md'));
  console.log(ok(`${jsonPath} -> ${mdPath}`));
}

// ---------------------------------------------------------------------------
// md2json
// ---------------------------------------------------------------------------

async function runDocsMd2json(args: string[]): Promise<void> {
  const { values, positionals } = parseArgs({
    args,
    allowPositionals: true,
    strict: false,
    options: {
      'stdout': { type: 'boolean', default: false },
      'help': { type: 'boolean', default: false },
    },
  });

  if (values.help === true) {
    console.log(MD2JSON_USAGE);
    return;
  }

  const mdPath = positionals[0];
  if (mdPath === undefined) {
    console.log(error('Missing required argument: Markdown file path'));
    console.log(MD2JSON_USAGE);
    process.exit(1);
  }

  let content: string;
  try {
    content = await readFile(mdPath, 'utf8');
  } catch {
    console.log(error(`Cannot read file: ${mdPath}`));
    process.exit(1);
  }

  const doc = parseMarkdown(content, mdPath);
  const json = JSON.stringify(doc, null, 2) + '\n';

  if (values.stdout === true) {
    process.stdout.write(json);
    return;
  }

  const dir = path.dirname(mdPath);
  const basename = path.basename(mdPath, '.md');
  const jsonPath = path.join(dir, `${basename}.json`);

  await writeFile(jsonPath, json, 'utf8');

  console.log(header('md2json'));
  console.log(ok(`${mdPath} -> ${jsonPath}`));
}

// ---------------------------------------------------------------------------
// validate
// ---------------------------------------------------------------------------

async function runDocsValidate(args: string[]): Promise<void> {
  const { values, positionals } = parseArgs({
    args,
    allowPositionals: true,
    strict: false,
    options: {
      'help': { type: 'boolean', default: false },
    },
  });

  if (values.help === true) {
    console.log(VALIDATE_USAGE);
    return;
  }

  const filePath = positionals[0];
  if (filePath === undefined) {
    console.log(error('Missing required argument: JSON file path'));
    console.log(VALIDATE_USAGE);
    process.exit(1);
  }

  const result = await validateFile(filePath);

  console.log(header('Validation'));

  if (result.valid) {
    console.log(ok('Schema valid'));
  } else {
    for (const err of result.errors) {
      console.log(error(err));
    }
  }

  for (const warn of result.warnings) {
    console.log(yellow(`  ! ${warn}`));
  }

  if (result.syncStatus !== undefined) {
    switch (result.syncStatus) {
      case 'in-sync':
        console.log(ok('Markdown file in sync'));
        break;
      case 'out-of-sync':
        console.log(yellow('  ! Markdown file out of sync — run json2md to update'));
        break;
      case 'no-md-file':
        console.log(dim('  (no corresponding .md file found)'));
        break;
    }
  }

  if (!result.valid) {
    process.exit(1);
  }
}

// ---------------------------------------------------------------------------
// read
// ---------------------------------------------------------------------------

async function runDocsRead(args: string[]): Promise<void> {
  const { values, positionals } = parseArgs({
    args,
    allowPositionals: true,
    strict: false,
    options: {
      'section': { type: 'string' },
      'help': { type: 'boolean', default: false },
    },
  });

  if (values.help === true) {
    console.log(READ_USAGE);
    return;
  }

  const filePath = positionals[0];
  if (filePath === undefined) {
    console.log(error('Missing required argument: JSON file path'));
    console.log(READ_USAGE);
    process.exit(1);
  }

  let content: string;
  try {
    content = await readFile(filePath, 'utf8');
  } catch {
    console.log(error(`Cannot read file: ${filePath}`));
    process.exit(1);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    console.log(error('Invalid JSON'));
    process.exit(1);
  }

  const doc = parsed as GobbiDoc;

  const sectionName = values.section;

  if (typeof sectionName === 'string') {
    // Display a specific section
    printSection(doc, sectionName);
  } else {
    // Display metadata overview
    printMetadata(doc);
  }
}

// ---------------------------------------------------------------------------
// Read Helpers
// ---------------------------------------------------------------------------

function printMetadata(doc: GobbiDoc): void {
  console.log(header('Document Metadata'));
  console.log(`  ${bold('Schema:')}  ${doc.$schema}`);
  console.log(`  ${bold('Title:')}   ${doc.title}`);

  if (doc.opening !== undefined) {
    const openingPreview = doc.opening.length > 80
      ? doc.opening.slice(0, 77) + '...'
      : doc.opening;
    console.log(`  ${bold('Opening:')} ${openingPreview}`);
  }

  if ('parent' in doc && typeof doc.parent === 'string') {
    console.log(`  ${bold('Parent:')}  ${doc.parent}`);
  }

  if ('frontmatter' in doc && doc.frontmatter !== null && typeof doc.frontmatter === 'object') {
    console.log('');
    console.log(`  ${bold('Frontmatter:')}`);
    const fm = doc.frontmatter as Record<string, unknown>;
    for (const [key, value] of Object.entries(fm)) {
      console.log(`    ${key}: ${String(value)}`);
    }
  }

  if (doc.navigation !== undefined) {
    console.log('');
    console.log(`  ${bold('Navigation:')}`);
    for (const [file, description] of Object.entries(doc.navigation)) {
      console.log(`    ${file} -> ${description}`);
    }
  }

  // Section/entry summary
  if (doc.$schema === 'gobbi-docs/gotcha') {
    const gotchaDoc = doc as GotchaDoc;
    console.log('');
    console.log(`  ${bold('Entries:')} ${gotchaDoc.entries.length}`);
    for (const entry of gotchaDoc.entries) {
      console.log(`    - ${entry.title}`);
    }
  } else if ('sections' in doc && Array.isArray(doc.sections)) {
    const sections = doc.sections as Section[];
    console.log('');
    console.log(`  ${bold('Sections:')} ${sections.length}`);
    for (const section of sections) {
      const heading = section.heading ?? '(headingless)';
      console.log(`    - ${heading} (${section.content.length} blocks)`);
    }
  }
}

function printSection(doc: GobbiDoc, sectionName: string): void {
  if (doc.$schema === 'gobbi-docs/gotcha') {
    const gotchaDoc = doc as GotchaDoc;
    const entry = gotchaDoc.entries.find(
      (e) => e.title.toLowerCase() === sectionName.toLowerCase(),
    );
    if (entry === undefined) {
      console.log(error(`Entry not found: "${sectionName}"`));
      console.log(dim('  Available entries:'));
      for (const e of gotchaDoc.entries) {
        console.log(`    - ${e.title}`);
      }
      process.exit(1);
    }
    console.log(header(entry.title));
    console.log(`  ${bold('Priority:')} ${entry.body.priority}`);
    console.log('');
    console.log(`  ${bold('What happened:')}`);
    console.log(`  ${entry.body['what-happened']}`);
    console.log('');
    console.log(`  ${bold('User feedback:')}`);
    console.log(`  ${entry.body['user-feedback']}`);
    console.log('');
    console.log(`  ${bold('Correct approach:')}`);
    console.log(`  ${entry.body['correct-approach']}`);
    return;
  }

  if (!('sections' in doc) || !Array.isArray(doc.sections)) {
    console.log(error('Document has no sections'));
    process.exit(1);
  }

  const sections = doc.sections as Section[];
  const section = sections.find(
    (s) => s.heading !== null && s.heading.toLowerCase() === sectionName.toLowerCase(),
  );

  if (section === undefined) {
    console.log(error(`Section not found: "${sectionName}"`));
    console.log(dim('  Available sections:'));
    for (const s of sections) {
      const heading = s.heading ?? '(headingless)';
      console.log(`    - ${heading}`);
    }
    process.exit(1);
  }

  console.log(header(section.heading ?? '(headingless)'));
  for (const block of section.content) {
    printBlock(block, '  ');
  }
}

function printBlock(block: ContentBlock, indent: string): void {
  switch (block.type) {
    case 'text':
      console.log(`${indent}${block.value}`);
      break;
    case 'principle':
      console.log(`${indent}${bold(`> ${block.statement}`)}`);
      if (block.body !== undefined) {
        console.log(`${indent}${block.body}`);
      }
      break;
    case 'table':
      console.log(`${indent}${block.headers.join(' | ')}`);
      for (const row of block.rows) {
        console.log(`${indent}${row.join(' | ')}`);
      }
      break;
    case 'constraint-list':
      for (const item of block.items) {
        console.log(`${indent}- ${item}`);
      }
      break;
    case 'list':
      for (let i = 0; i < block.items.length; i++) {
        const item = block.items[i];
        if (item === undefined) continue;
        const prefix = block.style === 'numbered' ? `${i + 1}. ` : '- ';
        console.log(`${indent}${prefix}${item}`);
      }
      break;
    case 'subsection':
      console.log(`${indent}${bold(`### ${block.heading}`)}`);
      for (const child of block.content) {
        printBlock(child, indent + '  ');
      }
      break;
  }
}

// ---------------------------------------------------------------------------
// Template Scaffolding
// ---------------------------------------------------------------------------

function scaffoldTemplate(docType: DocType, name: string): GobbiDoc {
  const schema = DOC_TYPE_TO_SCHEMA[docType];

  switch (docType) {
    case 'skill':
      return {
        $schema: schema as 'gobbi-docs/skill',
        frontmatter: {
          name,
          description: `TODO: describe ${name}`,
        },
        title: titleCase(name),
        sections: [
          {
            heading: 'Core Principle',
            content: [
              {
                type: 'principle',
                statement: 'TODO: core principle statement',
                body: 'TODO: explanation',
              },
            ],
          },
        ],
      };
    case 'agent':
      return {
        $schema: schema as 'gobbi-docs/agent',
        frontmatter: {
          name,
          description: `TODO: describe ${name}`,
          tools: 'Read, Grep, Glob, Write, Edit, Bash',
          model: 'opus',
        },
        title: titleCase(name),
        sections: [],
      };
    case 'rule':
      return {
        $schema: schema as 'gobbi-docs/rule',
        title: titleCase(name),
        sections: [
          {
            heading: null,
            content: [
              { type: 'text', value: 'TODO: rule content' },
            ],
          },
        ],
      };
    case 'root':
      return {
        $schema: schema as 'gobbi-docs/root',
        title: titleCase(name),
        opening: 'TODO: opening paragraph',
        sections: [],
      };
    case 'child':
      return {
        $schema: schema as 'gobbi-docs/child',
        parent: 'TODO',
        title: titleCase(name),
        sections: [
          {
            heading: 'Core Principle',
            content: [
              {
                type: 'principle',
                statement: 'TODO: core principle statement',
                body: 'TODO: explanation',
              },
            ],
          },
        ],
      };
    case 'gotcha':
      return {
        $schema: schema as 'gobbi-docs/gotcha',
        parent: 'TODO',
        title: `Gotcha: ${titleCase(name)}`,
        entries: [
          {
            title: 'TODO: gotcha title',
            metadata: {
              priority: 'medium',
            },
            body: {
              priority: 'Medium',
              'what-happened': 'TODO: what went wrong',
              'user-feedback': 'TODO: what the user said',
              'correct-approach': 'TODO: how to do it correctly',
            },
          },
        ],
      };
  }
}

function titleCase(name: string): string {
  return name
    .replace(/^_+/, '')
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
