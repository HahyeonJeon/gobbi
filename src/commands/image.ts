import { parseArgs } from 'node:util';
import path from 'path';
import { access, mkdir } from 'fs/promises';

import { assertSharpAvailable } from '../lib/media/deps.js';
import { getImageMetadata, resizeImage } from '../lib/media/image-utils.js';
import { generateContactSheet } from '../lib/media/contact-sheet.js';
import { writeManifest } from '../lib/media/manifest.js';
import { header, ok, error } from '../lib/style.js';

import type { Layout } from '../lib/media/contact-sheet.js';

const USAGE = `Usage: gobbi image <subcommand> [options]

Subcommands:
  analyze <path>         Analyze an image (metadata + resize)
  compare <paths...>     Compare images side-by-side (contact sheet)

Options:
  --help    Show this help message`;

const ANALYZE_USAGE = `Usage: gobbi image analyze <path> [options]

Options:
  --out <dir>       Output directory (required)
  --max-size <n>    Maximum pixel dimension (default: 2048)
  --format <fmt>    Output format: webp, png, jpeg (default: webp)
  --quality <n>     Encoding quality 1-100 (default: 80)
  --help            Show this help message`;

const COMPARE_USAGE = `Usage: gobbi image compare <path1> <path2> [paths...] [options]

Options:
  --out <dir>         Output directory (required)
  --layout <mode>     Layout: vertical, grid, horizontal (default: vertical)
  --cell-width <n>    Cell width in pixels (default: 800)
  --help              Show this help message`;

const VALID_LAYOUTS = ['vertical', 'grid', 'horizontal'] as const;

/**
 * Type guard for valid layout values.
 */
function isValidLayout(value: string): value is Layout {
  return (VALID_LAYOUTS as readonly string[]).includes(value);
}

/**
 * Top-level handler for `gobbi image`. Dispatches to subcommands.
 * Called from cli.ts with process.argv.slice(3).
 */
export async function runImage(args: string[]): Promise<void> {
  const subcommand = args[0];

  switch (subcommand) {
    case 'analyze':
      await runImageAnalyze(args.slice(1));
      break;
    case 'compare':
      await runImageCompare(args.slice(1));
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

/**
 * Handle `gobbi image analyze <path>`.
 * Extracts metadata, resizes the image, and writes a manifest.
 */
async function runImageAnalyze(args: string[]): Promise<void> {
  const { values, positionals } = parseArgs({
    args,
    allowPositionals: true,
    strict: false,
    options: {
      'out': { type: 'string' },
      'max-size': { type: 'string' },
      'format': { type: 'string' },
      'quality': { type: 'string' },
      'help': { type: 'boolean', default: false },
    },
  });

  if (values.help === true) {
    console.log(ANALYZE_USAGE);
    return;
  }

  // Validate required --out flag
  const outDir = values.out;
  if (typeof outDir !== 'string') {
    console.log(error('Missing required flag: --out'));
    console.log(ANALYZE_USAGE);
    process.exit(1);
  }

  // Validate positional image path
  const imagePath = positionals[0];
  if (imagePath === undefined) {
    console.log(error('Missing required argument: image path'));
    console.log(ANALYZE_USAGE);
    process.exit(1);
  }

  try {
    await access(imagePath);
  } catch {
    console.log(error(`File not found: ${imagePath}`));
    process.exit(1);
  }

  // Parse optional numeric values
  const maxSize = values['max-size'] !== undefined ? Number(values['max-size']) : 2048;
  const quality = values.quality !== undefined ? Number(values.quality) : 80;
  const format = (values.format as 'webp' | 'png' | 'jpeg' | undefined) ?? 'webp';

  // Check sharp availability
  await assertSharpAvailable();

  // Create output directory
  await mkdir(outDir, { recursive: true });

  // Extract metadata
  const metadata = await getImageMetadata(imagePath);

  // Determine output filename and path
  const basename = path.basename(imagePath, path.extname(imagePath));
  const outputFilename = `${basename}-resized.${format}`;
  const outputPath = path.join(outDir, outputFilename);

  // Resize image
  const result = await resizeImage(imagePath, outputPath, { maxSize, format, quality });

  // Write manifest
  const manifestPath = path.join(outDir, 'manifest.json');
  await writeManifest(outDir, {
    command: 'image analyze',
    timestamp: new Date().toISOString(),
    source: {
      type: 'image',
      path: imagePath,
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      colorSpace: metadata.colorSpace,
      fileSize: metadata.fileSize,
      density: metadata.density,
      hasAlpha: metadata.hasAlpha,
    },
    output: {
      files: [
        {
          filename: outputFilename,
          type: 'resized',
          width: result.resizedWidth,
          height: result.resizedHeight,
          format: result.format,
        },
      ],
    },
  });

  // Print results
  console.log(header('Image Analysis'));
  console.log(ok(`Metadata: ${metadata.width}\u00d7${metadata.height} ${metadata.format} (${metadata.fileSize} bytes)`));
  console.log(ok(`Resized: ${result.resizedWidth}\u00d7${result.resizedHeight} \u2192 ${outputPath}`));
  console.log(ok(`Manifest: ${manifestPath}`));
}

/**
 * Handle `gobbi image compare <paths...>`.
 * Generates a labeled contact sheet from multiple images.
 */
async function runImageCompare(args: string[]): Promise<void> {
  const { values, positionals } = parseArgs({
    args,
    allowPositionals: true,
    strict: false,
    options: {
      'out': { type: 'string' },
      'layout': { type: 'string' },
      'cell-width': { type: 'string' },
      'help': { type: 'boolean', default: false },
    },
  });

  if (values.help === true) {
    console.log(COMPARE_USAGE);
    return;
  }

  // Validate required --out flag
  const outDir = values.out;
  if (typeof outDir !== 'string') {
    console.log(error('Missing required flag: --out'));
    console.log(COMPARE_USAGE);
    process.exit(1);
  }

  // Validate positional image paths — need at least 2
  if (positionals.length < 2) {
    console.log(error('At least 2 image paths are required'));
    console.log(COMPARE_USAGE);
    process.exit(1);
  }

  // Validate all image paths exist
  const imagePaths: string[] = [];
  for (const p of positionals) {
    try {
      await access(p);
      imagePaths.push(p);
    } catch {
      console.log(error(`File not found: ${p}`));
      process.exit(1);
    }
  }

  // Parse optional values
  const cellWidth = values['cell-width'] !== undefined ? Number(values['cell-width']) : 800;

  const layoutValue = values.layout ?? 'vertical';
  if (typeof layoutValue === 'string' && !isValidLayout(layoutValue)) {
    console.log(error(`Invalid layout: ${layoutValue}. Must be one of: ${VALID_LAYOUTS.join(', ')}`));
    process.exit(1);
  }
  const layout: Layout = typeof layoutValue === 'string' && isValidLayout(layoutValue)
    ? layoutValue
    : 'vertical';

  // Check sharp availability
  await assertSharpAvailable();

  // Create output directory
  await mkdir(outDir, { recursive: true });

  // Create labels from filenames
  const labels = imagePaths.map((p) => path.basename(p));

  // Generate contact sheet
  const result = await generateContactSheet({
    imagePaths,
    labels,
    outputDir: outDir,
    layout,
    cellWidth,
  });

  // Write manifest
  const manifestPath = path.join(outDir, 'manifest.json');
  await writeManifest(outDir, {
    command: 'image compare',
    timestamp: new Date().toISOString(),
    source: {
      type: 'image',
      path: imagePaths.join(', '),
      count: imagePaths.length,
    },
    output: {
      files: [
        {
          filename: path.basename(result.outputPath),
          type: 'contact-sheet',
          width: result.width,
          height: result.height,
          format: path.extname(result.outputPath).slice(1),
        },
      ],
      contactSheet: {
        filename: path.basename(result.outputPath),
        layout: result.layout,
        columns: result.columns,
        rows: result.rows,
        cellWidth: result.cellWidth,
      },
    },
  });

  // Print results
  console.log(header('Image Comparison'));
  console.log(ok(`Contact sheet: ${result.width}\u00d7${result.height} (${result.layout}, ${result.columns}\u00d7${result.rows})`));
  console.log(ok(`Output: ${result.outputPath}`));
  console.log(ok(`Manifest: ${manifestPath}`));
}
