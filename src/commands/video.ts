import { parseArgs } from 'node:util';
import path from 'path';
import { access, mkdir } from 'fs/promises';

import { assertFfmpegAvailable, assertSharpAvailable } from '../lib/media/deps.js';
import {
  probeVideo,
  extractFrame,
  selectFrameTimestamps,
  frameFilename,
} from '../lib/media/ffmpeg.js';
import { generateContactSheet } from '../lib/media/contact-sheet.js';
import { writeManifest } from '../lib/media/manifest.js';
import { header, ok, error } from '../lib/style.js';

import type { FrameStrategy, ImageFormat } from '../lib/media/ffmpeg.js';
import type { Layout } from '../lib/media/contact-sheet.js';
import type { ManifestFile } from '../lib/media/manifest.js';

const USAGE = `Usage: gobbi video <subcommand> [options]

Subcommands:
  analyze <path>    Analyze a video (extract frames + contact sheet)

Options:
  --help    Show this help message`;

const ANALYZE_USAGE = `Usage: gobbi video analyze <path> [options]

Options:
  --out <dir>         Output directory (required)
  --strategy <s>      Frame selection: key-moments, interval (default: key-moments)
  --interval <n>      Interval in seconds for interval strategy (default: 5)
  --format <fmt>      Output format: webp, png, jpeg (default: webp)
  --quality <n>       Encoding quality 1-100 (default: 80)
  --layout <mode>     Contact sheet layout: vertical, grid, horizontal (default: vertical)
  --cell-width <n>    Contact sheet cell width in pixels (default: 800)
  --help              Show this help message`;

const VALID_STRATEGIES = ['key-moments', 'interval'] as const;
const VALID_FORMATS = ['webp', 'png', 'jpeg'] as const;
const VALID_LAYOUTS = ['vertical', 'grid', 'horizontal'] as const;

/**
 * Type guard for valid frame strategy values.
 */
function isValidStrategy(value: string): value is FrameStrategy {
  return (VALID_STRATEGIES as readonly string[]).includes(value);
}

/**
 * Type guard for valid image format values.
 */
function isValidFormat(value: string): value is ImageFormat {
  return (VALID_FORMATS as readonly string[]).includes(value);
}

/**
 * Type guard for valid layout values.
 */
function isValidLayout(value: string): value is Layout {
  return (VALID_LAYOUTS as readonly string[]).includes(value);
}

/**
 * Top-level handler for `gobbi video`. Dispatches to subcommands.
 * Called from cli.ts with process.argv.slice(3).
 */
export async function runVideo(args: string[]): Promise<void> {
  const subcommand = args[0];

  switch (subcommand) {
    case 'analyze':
      await runVideoAnalyze(args.slice(1));
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
 * Handle `gobbi video analyze <path>`.
 * Probes video metadata, extracts key frames, generates a contact sheet,
 * and writes a manifest.
 */
async function runVideoAnalyze(args: string[]): Promise<void> {
  const { values, positionals } = parseArgs({
    args,
    allowPositionals: true,
    strict: false,
    options: {
      'out': { type: 'string' },
      'strategy': { type: 'string' },
      'interval': { type: 'string' },
      'format': { type: 'string' },
      'quality': { type: 'string' },
      'layout': { type: 'string' },
      'cell-width': { type: 'string' },
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

  // Validate positional video path
  const videoPath = positionals[0];
  if (videoPath === undefined) {
    console.log(error('Missing required argument: video path'));
    console.log(ANALYZE_USAGE);
    process.exit(1);
  }

  try {
    await access(videoPath);
  } catch {
    console.log(error(`File not found: ${videoPath}`));
    process.exit(1);
  }

  // Parse and validate strategy
  const strategyValue = values.strategy ?? 'key-moments';
  if (typeof strategyValue !== 'string' || !isValidStrategy(strategyValue)) {
    console.log(error(`Invalid strategy: ${String(strategyValue)}. Must be one of: ${VALID_STRATEGIES.join(', ')}`));
    process.exit(1);
  }
  const strategy: FrameStrategy = strategyValue;

  // Parse and validate format
  const formatValue = values.format ?? 'webp';
  if (typeof formatValue !== 'string' || !isValidFormat(formatValue)) {
    console.log(error(`Invalid format: ${String(formatValue)}. Must be one of: ${VALID_FORMATS.join(', ')}`));
    process.exit(1);
  }
  const format: ImageFormat = formatValue;

  // Parse and validate layout
  const layoutValue = values.layout ?? 'vertical';
  if (typeof layoutValue !== 'string' || !isValidLayout(layoutValue)) {
    console.log(error(`Invalid layout: ${String(layoutValue)}. Must be one of: ${VALID_LAYOUTS.join(', ')}`));
    process.exit(1);
  }
  const layout: Layout = layoutValue;

  // Parse numeric options
  const intervalSeconds = values.interval !== undefined ? Number(values.interval) : 5;
  const quality = values.quality !== undefined ? Number(values.quality) : 80;
  const cellWidth = values['cell-width'] !== undefined ? Number(values['cell-width']) : 800;

  // Check dependencies
  assertFfmpegAvailable();
  await assertSharpAvailable();

  // Create output directories
  await mkdir(outDir, { recursive: true });
  const framesDir = path.join(outDir, 'frames');
  await mkdir(framesDir, { recursive: true });

  // Probe video
  console.log(header('Video Analysis'));
  const info = await probeVideo(videoPath);
  console.log(ok(`Video: ${info.width}\u00d7${info.height} ${info.fps}fps ${info.durationSeconds.toFixed(1)}s (${info.codec})`));

  // Select frames
  const frames = selectFrameTimestamps(info.durationSeconds, info.fps, strategy, intervalSeconds);
  console.log(ok(`Extracting ${frames.length} frames (${strategy})...`));

  // Extract each frame sequentially
  const manifestFrames: ManifestFile[] = [];
  const framePaths: string[] = [];
  const frameLabels: string[] = [];

  for (const frame of frames) {
    const filename = frameFilename(frame.frameNumber, format, info.durationInFrames);
    const framePath = path.join(framesDir, filename);
    await extractFrame(videoPath, frame.timestampSeconds, framePath, format, quality);
    framePaths.push(framePath);
    frameLabels.push(`F${frame.frameNumber} ${frame.timestampSeconds.toFixed(1)}s`);
    manifestFrames.push({
      filename: `frames/${filename}`,
      type: 'frame',
      width: info.width,
      height: info.height,
      format,
    });
  }

  // Generate contact sheet
  const sheetResult = await generateContactSheet({
    imagePaths: framePaths,
    labels: frameLabels,
    outputDir: outDir,
    layout,
    cellWidth,
    format,
    quality,
  });
  console.log(ok(`Contact sheet: ${path.basename(sheetResult.outputPath)}`));

  // Write manifest
  await writeManifest(outDir, {
    command: 'video analyze',
    timestamp: new Date().toISOString(),
    source: {
      type: 'video',
      path: path.resolve(videoPath),
      width: info.width,
      height: info.height,
      fps: info.fps,
      durationSeconds: info.durationSeconds,
      durationInFrames: info.durationInFrames,
      codec: info.codec,
      format: info.format,
    },
    output: {
      files: [
        ...manifestFrames,
        {
          filename: path.basename(sheetResult.outputPath),
          type: 'contact-sheet',
          width: sheetResult.width,
          height: sheetResult.height,
          format,
        },
      ],
      contactSheet: {
        filename: path.basename(sheetResult.outputPath),
        layout: sheetResult.layout,
        columns: sheetResult.columns,
        rows: sheetResult.rows,
        cellWidth: sheetResult.cellWidth,
      },
    },
  });
  console.log(ok(`Manifest: ${outDir}/manifest.json`));
}
