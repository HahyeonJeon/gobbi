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

import { header, ok, error, dim, bold, yellow, formatTable } from '../lib/style.js';
import { renderDoc } from '../lib/docs/renderer.js';
import { parseMarkdown } from '../lib/docs/migrator.js';
import { validateFile } from '../lib/docs/validator.js';
import {
  isDocType,
  DOC_TYPE_TO_SCHEMA,
  VALID_DOC_TYPES,
  VALID_BLOCK_TYPES,
} from '../lib/docs/types.js';
import { listDocs } from '../lib/docs/lister.js';
import { buildTree, formatTreeText } from '../lib/docs/tree.js';
import { searchDocs } from '../lib/docs/search.js';
import { extractFromDoc, formatExtractMd } from '../lib/docs/extract.js';
import { computeStats } from '../lib/docs/stats.js';
import { checkHealth } from '../lib/docs/health.js';
import { scanCorpus } from '../lib/docs/scanner.js';
import { buildGraph } from '../lib/docs/graph.js';
import { getClaudeDir } from '../lib/repo.js';

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
  spec                     Show the gobbi-docs JSON schema specification
  list [directory]         List all gobbi-docs templates with metadata
  tree [directory]         Show navigation hierarchy as a tree
  search <pattern> [dir]   Search content across all templates
  extract <path> <query>   Extract content by dot-path query
  stats [directory]        Show aggregate corpus statistics
  health [directory]       Run cross-document health checks

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

const LIST_USAGE = `Usage: gobbi docs list [directory] [options]

List all gobbi-docs JSON templates with type, title, and content count.
Defaults to the .claude/ directory in the current repository.

Options:
  --type <type>       Filter by doc type (${VALID_DOC_TYPES.join(', ')})
  --format <fmt>      Output format: table (default), json
  --help              Show this help message`;

const TREE_USAGE = `Usage: gobbi docs tree [directory] [options]

Show the navigation hierarchy of gobbi-docs templates as a tree.
Defaults to the .claude/ directory in the current repository.

Options:
  --format <fmt>      Output format: text (default), json
  --help              Show this help message`;

const SEARCH_USAGE = `Usage: gobbi docs search <pattern> [directory] [options]

Search content across all gobbi-docs JSON templates using a regex pattern.
Defaults to the .claude/ directory in the current repository.

Options:
  --type <type>       Filter by doc type (${VALID_DOC_TYPES.join(', ')})
  --block <type>      Filter by block type (${VALID_BLOCK_TYPES.join(', ')}, title, opening, frontmatter)
  --format <fmt>      Output format: text (default), json
  --help              Show this help message`;

const EXTRACT_USAGE = `Usage: gobbi docs extract <path> <query> [options]

Extract content from a JSON template by dot-path query.

Queries: title, $schema, opening, frontmatter, frontmatter.name,
         sections, sections.Setup, entries, entries.<title>

Options:
  --format <fmt>      Output format: json (default), md, text
  --help              Show this help message`;

const STATS_USAGE = `Usage: gobbi docs stats [directory] [options]

Show aggregate statistics for all gobbi-docs templates in a directory.
Defaults to the .claude/ directory in the current repository.

Options:
  --format <fmt>      Output format: text (default), json
  --help              Show this help message`;

const HEALTH_USAGE = `Usage: gobbi docs health [directory] [options]

Run cross-document health checks: orphans, broken links, empty sections,
incomplete gotchas, missing parents, bidirectional consistency.
Defaults to the .claude/ directory in the current repository.

Exits with code 1 if any errors are found.

Options:
  --format <fmt>      Output format: text (default), json
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
    case 'list':
      await runDocsList(args.slice(1));
      break;
    case 'tree':
      await runDocsTree(args.slice(1));
      break;
    case 'search':
      await runDocsSearch(args.slice(1));
      break;
    case 'extract':
      await runDocsExtract(args.slice(1));
      break;
    case 'stats':
      await runDocsStats(args.slice(1));
      break;
    case 'health':
      await runDocsHealth(args.slice(1));
      break;
    case 'spec':
      runDocsSpec(args.slice(1));
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
// spec
// ---------------------------------------------------------------------------

const SPEC_USAGE = `Usage: gobbi docs spec [name]

Show the gobbi-docs JSON schema specification.

Without arguments, shows the full spec. With a name, shows only that
doc type, block type, or structural element.

Names:
  Doc types:    skill, agent, rule, root, child, gotcha
  Block types:  text, principle, table, constraint-list, list, subsection
  Structure:    navigation, section

Options:
  --help    Show this help message`;

function runDocsSpec(args: string[]): void {
  const name = args[0];

  if (name === '--help') {
    console.log(SPEC_USAGE);
    return;
  }

  const docTypes: Record<string, unknown> = {
    skill: {
      $schema: 'gobbi-docs/skill',
      description: 'Skill definition in .claude/skills/{name}/SKILL.md',
      frontmatter: { name: 'string', description: 'string', 'allowed-tools': 'string (optional)' },
      fields: ['title', 'opening?', 'navigation?', 'sections?'],
    },
    agent: {
      $schema: 'gobbi-docs/agent',
      description: 'Agent definition in .claude/agents/{name}.md',
      frontmatter: { name: 'string', description: 'string', tools: 'string', model: 'string' },
      fields: ['title', 'opening?', 'navigation?', 'sections?'],
    },
    rule: {
      $schema: 'gobbi-docs/rule',
      description: 'Rule file in .claude/rules/{name}.md',
      frontmatter: 'Record<string, string> (optional)',
      fields: ['title', 'opening?', 'navigation?', 'sections?'],
    },
    root: {
      $schema: 'gobbi-docs/root',
      description: 'Root README at .claude/README.md',
      fields: ['title', 'opening?', 'navigation?', 'sections?'],
    },
    child: {
      $schema: 'gobbi-docs/child',
      description: 'Child doc of a skill, e.g. .claude/skills/{name}/child.md',
      fields: ['parent', 'title', 'opening?', 'navigation?', 'sections?'],
    },
    gotcha: {
      $schema: 'gobbi-docs/gotcha',
      description: 'Gotcha file — known mistakes and corrections',
      fields: ['parent', 'title', 'opening?', 'navigation?', 'entries[]'],
      entry: {
        fields: ['title', 'metadata?', 'body'],
        metadata: { priority: 'string?', 'tech-stack': 'string?', enforcement: '"hook" | "advisory"', pattern: 'string?', event: '"bash" | "file" | "stop"' },
        body: { priority: 'string', 'what-happened': 'string', 'user-feedback': 'string', 'correct-approach': 'string' },
      },
    },
  };

  const blockTypes: Record<string, unknown> = {
    text: { fields: ['value: string'], renders: 'Prose paragraph' },
    principle: { fields: ['statement: string', 'body?: string'], renders: '> **statement** followed by body text' },
    table: { fields: ['headers: string[]', 'rows: string[][]'], renders: 'Markdown table' },
    'constraint-list': { fields: ['items: string[]'], renders: 'Bullet list of constraints (must/should/must-not)' },
    list: { fields: ['style: "bullet" | "numbered"', 'items: string[]'], renders: 'Bullet or numbered list' },
    subsection: { fields: ['heading: string', 'content: ContentBlock[]'], renders: '### heading with nested content blocks' },
  };

  const structure: Record<string, unknown> = {
    navigation: {
      format: 'Record<string, string>',
      keys: '.claude/-relative file paths (e.g., "skills/_git/conventions.md")',
      values: 'Description string',
      rendering: 'Rendered as "Navigate deeper from here:" table with file-relative links',
    },
    section: {
      fields: ['heading: string | null', 'content: ContentBlock[]'],
      rendering: 'Sections separated by --- with ## heading',
    },
  };

  // No argument — show full spec
  if (name === undefined) {
    console.log(JSON.stringify({ description: 'gobbi-docs JSON schema for .claude/ documentation', docTypes, blockTypes, ...structure }, null, 2));
    return;
  }

  // Look up by name
  const match = docTypes[name] ?? blockTypes[name] ?? structure[name];
  if (match !== undefined) {
    console.log(JSON.stringify(match, null, 2));
    return;
  }

  console.log(error(`Unknown spec name: ${name}`));
  console.log(dim('Valid names: ' + [...Object.keys(docTypes), ...Object.keys(blockTypes), ...Object.keys(structure)].join(', ')));
  process.exit(1);
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

  const markdown = renderDoc(doc, jsonPath);
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
// list
// ---------------------------------------------------------------------------

async function runDocsList(args: string[]): Promise<void> {
  const { values, positionals } = parseArgs({
    args,
    allowPositionals: true,
    strict: false,
    options: {
      'type': { type: 'string' },
      'format': { type: 'string' },
      'help': { type: 'boolean', default: false },
    },
  });

  if (values.help === true) {
    console.log(LIST_USAGE);
    return;
  }

  const directory = typeof positionals[0] === 'string' ? positionals[0] : getClaudeDir();
  const typeFilter = typeof values.type === 'string' ? values.type : undefined;
  const fmt = typeof values.format === 'string' ? values.format : 'table';

  if (typeFilter !== undefined && !isDocType(typeFilter)) {
    console.log(error(`Invalid doc type: "${typeFilter}". Must be one of: ${VALID_DOC_TYPES.join(', ')}`));
    process.exit(1);
  }

  const result = await listDocs(directory, typeFilter);

  if (fmt === 'json') {
    console.log(JSON.stringify(result.entries, null, 2));
  } else {
    if (result.entries.length === 0) {
      console.log(dim('  No gobbi-docs templates found.'));
    } else {
      const headers = ['PATH', 'TYPE', 'TITLE', 'COUNT'];
      const rows = result.entries.map((e) => [e.path, e.type, e.title, String(e.count)]);
      console.log(formatTable(headers, rows));
    }
  }

  if (result.errors.length > 0) {
    console.log('');
    console.log(yellow(`  ${result.errors.length} scan error(s):`));
    for (const err of result.errors) {
      console.log(error(`${err.path}: ${err.error}`));
    }
  }
}

// ---------------------------------------------------------------------------
// tree
// ---------------------------------------------------------------------------

async function runDocsTree(args: string[]): Promise<void> {
  const { values, positionals } = parseArgs({
    args,
    allowPositionals: true,
    strict: false,
    options: {
      'format': { type: 'string' },
      'help': { type: 'boolean', default: false },
    },
  });

  if (values.help === true) {
    console.log(TREE_USAGE);
    return;
  }

  const directory = typeof positionals[0] === 'string' ? positionals[0] : getClaudeDir();
  const fmt = typeof values.format === 'string' ? values.format : 'text';

  const corpus = await scanCorpus(directory);
  const graph = buildGraph(corpus.docs);
  const result = buildTree(graph, directory);

  if (fmt === 'json') {
    console.log(JSON.stringify({ roots: result.roots, orphans: result.orphans }, null, 2));
  } else {
    if (result.roots.length === 0 && result.orphans.length === 0) {
      console.log(dim('  No navigation tree found.'));
    } else {
      if (result.roots.length > 0) {
        console.log(header('Navigation Tree'));
        console.log(formatTreeText(result.roots));
        console.log('');
      }
      if (result.orphans.length > 0) {
        console.log(header('Orphaned Documents'));
        console.log(formatTreeText(result.orphans));
        console.log('');
      }
      console.log(dim(`  ${result.flatCount} documents total`));
    }
  }
}

// ---------------------------------------------------------------------------
// search
// ---------------------------------------------------------------------------

async function runDocsSearch(args: string[]): Promise<void> {
  const { values, positionals } = parseArgs({
    args,
    allowPositionals: true,
    strict: false,
    options: {
      'type': { type: 'string' },
      'block': { type: 'string' },
      'format': { type: 'string' },
      'help': { type: 'boolean', default: false },
    },
  });

  if (values.help === true) {
    console.log(SEARCH_USAGE);
    return;
  }

  const pattern = positionals[0];
  if (typeof pattern !== 'string') {
    console.log(error('Missing required argument: search pattern'));
    console.log(SEARCH_USAGE);
    process.exit(1);
  }

  const directory = typeof positionals[1] === 'string' ? positionals[1] : getClaudeDir();
  const typeFilter = typeof values.type === 'string' ? values.type : undefined;
  const blockFilter = typeof values.block === 'string' ? values.block : undefined;
  const fmt = typeof values.format === 'string' ? values.format : 'text';

  if (typeFilter !== undefined && !isDocType(typeFilter)) {
    console.log(error(`Invalid doc type: "${typeFilter}". Must be one of: ${VALID_DOC_TYPES.join(', ')}`));
    process.exit(1);
  }

  const result = await searchDocs(directory, pattern, typeFilter, blockFilter);

  if (result.error !== undefined) {
    console.log(error(result.error));
    process.exit(1);
  }

  if (fmt === 'json') {
    console.log(JSON.stringify(result.matches, null, 2));
  } else {
    if (result.matches.length === 0) {
      console.log(dim('  No matches found.'));
    } else {
      // Group matches by file path
      const groups = new Map<string, typeof result.matches>();
      for (const match of result.matches) {
        const existing = groups.get(match.path);
        if (existing !== undefined) {
          existing.push(match);
        } else {
          groups.set(match.path, [match]);
        }
      }

      for (const [filePath, matches] of groups) {
        console.log(bold(filePath));
        for (const match of matches) {
          console.log(`  ${dim(match.section)} ${dim('[')}${match.blockType}${dim(']')}`);
          console.log(`    ${match.match}`);
          // Show the extract command for actionable follow-up
          const extractQuery = match.section !== '(document)'
            ? `sections.${match.section}`
            : match.blockType;
          console.log(dim(`    -> gobbi docs extract ${filePath} "${extractQuery}"`));
        }
        console.log('');
      }
    }

    console.log(dim(`  ${result.matches.length} match(es) in ${result.scannedCount} document(s)`));
  }
}

// ---------------------------------------------------------------------------
// extract
// ---------------------------------------------------------------------------

async function runDocsExtract(args: string[]): Promise<void> {
  const { values, positionals } = parseArgs({
    args,
    allowPositionals: true,
    strict: false,
    options: {
      'format': { type: 'string' },
      'help': { type: 'boolean', default: false },
    },
  });

  if (values.help === true) {
    console.log(EXTRACT_USAGE);
    return;
  }

  const filePath = positionals[0];
  if (typeof filePath !== 'string') {
    console.log(error('Missing required argument: JSON file path'));
    console.log(EXTRACT_USAGE);
    process.exit(1);
  }

  const query = positionals[1];
  if (typeof query !== 'string') {
    console.log(error('Missing required argument: dot-path query'));
    console.log(EXTRACT_USAGE);
    process.exit(1);
  }

  const fmt = typeof values.format === 'string' ? values.format : 'json';

  let result;
  try {
    result = await extractFromDoc(filePath, query);
  } catch (err) {
    const message = err instanceof Error ? err.message : `Cannot read or parse file: ${filePath}`;
    console.log(error(message));
    process.exit(1);
  }

  if (!result.found) {
    console.log(error(`Path not found: "${query}"`));
    if (result.availablePaths !== undefined && result.availablePaths.length > 0) {
      console.log(dim('  Available paths:'));
      for (const p of result.availablePaths) {
        console.log(`    ${p}`);
      }
    }
    process.exit(1);
  }

  switch (fmt) {
    case 'json':
      console.log(JSON.stringify(result.value, null, 2));
      break;
    case 'md':
      console.log(formatExtractMd(result.value));
      break;
    case 'text':
      printExtractedValue(result.value);
      break;
    default:
      console.log(JSON.stringify(result.value, null, 2));
      break;
  }
}

/**
 * Print an extracted value in plain text, using `printBlock` for typed
 * content structures and JSON.stringify for everything else.
 */
function printExtractedValue(value: unknown): void {
  if (value === undefined || value === null) return;

  if (typeof value === 'string') {
    console.log(value);
    return;
  }

  if (typeof value !== 'object') {
    console.log(String(value));
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      printExtractedValue(item);
    }
    return;
  }

  const record = value as Record<string, unknown>;

  // Section: has heading and content array
  if ('heading' in record && 'content' in record && Array.isArray(record['content'])) {
    const heading = record['heading'];
    if (typeof heading === 'string') {
      console.log(header(heading));
    }
    for (const block of record['content'] as unknown[]) {
      if (isContentBlock(block)) {
        printBlock(block, '  ');
      }
    }
    return;
  }

  // ContentBlock: has type field
  if ('type' in record && typeof record['type'] === 'string') {
    if (isContentBlock(value)) {
      printBlock(value, '');
    }
    return;
  }

  // Fallback
  console.log(JSON.stringify(value, null, 2));
}

/** Type guard for ContentBlock. */
function isContentBlock(value: unknown): value is ContentBlock {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Record<string, unknown>;
  const type = record['type'];
  return typeof type === 'string' && (VALID_BLOCK_TYPES as readonly string[]).includes(type);
}

// ---------------------------------------------------------------------------
// stats
// ---------------------------------------------------------------------------

async function runDocsStats(args: string[]): Promise<void> {
  const { values, positionals } = parseArgs({
    args,
    allowPositionals: true,
    strict: false,
    options: {
      'format': { type: 'string' },
      'help': { type: 'boolean', default: false },
    },
  });

  if (values.help === true) {
    console.log(STATS_USAGE);
    return;
  }

  const directory = typeof positionals[0] === 'string' ? positionals[0] : getClaudeDir();
  const fmt = typeof values.format === 'string' ? values.format : 'text';

  const stats = await computeStats(directory);

  if (fmt === 'json') {
    console.log(JSON.stringify(stats, null, 2));
  } else {
    console.log(header('Corpus Statistics'));
    console.log('');
    console.log(`  ${bold('Total documents:')} ${stats.total}`);
    console.log('');

    console.log(`  ${bold('By doc type:')}`);
    for (const [type, count] of Object.entries(stats.byType)) {
      console.log(`    ${type}: ${count}`);
    }
    console.log('');

    console.log(`  ${bold('Content:')}`);
    console.log(`    Sections: ${stats.totalSections}`);
    console.log(`    Blocks: ${stats.totalBlocks}`);
    console.log('');

    if (Object.keys(stats.byBlockType).length > 0) {
      console.log(`  ${bold('By block type:')}`);
      for (const [type, count] of Object.entries(stats.byBlockType)) {
        console.log(`    ${type}: ${count}`);
      }
      console.log('');
    }

    console.log(`  ${bold('Navigation:')}`);
    console.log(`    With navigation: ${stats.navigation.with}`);
    console.log(`    Without navigation: ${stats.navigation.without}`);
    console.log('');

    if (stats.gotchas.totalEntries > 0) {
      console.log(`  ${bold('Gotchas:')}`);
      console.log(`    Total entries: ${stats.gotchas.totalEntries}`);
      for (const [priority, count] of Object.entries(stats.gotchas.byPriority)) {
        console.log(`    ${priority}: ${count}`);
      }
      console.log('');
    }

    console.log(`  ${bold('Section size distribution:')}`);
    console.log(`    Min: ${stats.sizeDistribution.minSections}`);
    console.log(`    Max: ${stats.sizeDistribution.maxSections}`);
    console.log(`    Avg: ${stats.sizeDistribution.avgSections}`);
    console.log('');

    console.log(`  ${bold('Estimated tokens:')}`);
    console.log(`    Total: ~${stats.tokens.total.toLocaleString()}`);
    for (const [type, count] of Object.entries(stats.tokens.byType)) {
      console.log(`    ${type}: ~${count.toLocaleString()}`);
    }
  }
}

// ---------------------------------------------------------------------------
// health
// ---------------------------------------------------------------------------

async function runDocsHealth(args: string[]): Promise<void> {
  const { values, positionals } = parseArgs({
    args,
    allowPositionals: true,
    strict: false,
    options: {
      'format': { type: 'string' },
      'help': { type: 'boolean', default: false },
    },
  });

  if (values.help === true) {
    console.log(HEALTH_USAGE);
    return;
  }

  const directory = typeof positionals[0] === 'string' ? positionals[0] : getClaudeDir();
  const fmt = typeof values.format === 'string' ? values.format : 'text';

  const report = await checkHealth(directory);

  if (fmt === 'json') {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(header('Health Check'));
    console.log('');
    console.log(`  ${report.summary.errors} error(s), ${report.summary.warnings} warning(s), ${report.summary.info} info`);
    console.log('');

    if (report.findings.length === 0) {
      console.log(ok('No issues found'));
    } else {
      // Group by severity for display
      const errors = report.findings.filter((f) => f.severity === 'error');
      const warnings = report.findings.filter((f) => f.severity === 'warning');
      const infos = report.findings.filter((f) => f.severity === 'info');

      if (errors.length > 0) {
        console.log(bold('  Errors:'));
        for (const finding of errors) {
          console.log(error(`[${finding.category}] ${finding.path}: ${finding.message}`));
          console.log(dim(`    -> ${finding.suggestion}`));
        }
        console.log('');
      }

      if (warnings.length > 0) {
        console.log(bold('  Warnings:'));
        for (const finding of warnings) {
          console.log(yellow(`  ! [${finding.category}] ${finding.path}: ${finding.message}`));
          console.log(dim(`    -> ${finding.suggestion}`));
        }
        console.log('');
      }

      if (infos.length > 0) {
        console.log(bold('  Info:'));
        for (const finding of infos) {
          console.log(dim(`  i [${finding.category}] ${finding.path}: ${finding.message}`));
          console.log(dim(`    -> ${finding.suggestion}`));
        }
        console.log('');
      }
    }
  }

  if (report.summary.errors > 0) {
    process.exit(1);
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
