import { parseArgs } from 'node:util';
import path from 'path';
import { mkdir, unlink, writeFile as fsWriteFile } from 'fs/promises';

import { assertPlaywrightAvailable, assertSharpAvailable, getPlaywright } from '../lib/media/deps.js';
import { resizeImage } from '../lib/media/image-utils.js';
import { writeManifest } from '../lib/media/manifest.js';
import { header, ok, error, dim } from '../lib/style.js';

// ---------------------------------------------------------------------------
// Minimal Playwright type surface
// ---------------------------------------------------------------------------

/**
 * Minimal interface for a Playwright page.
 * Covers only the methods used by this module so we avoid depending on
 * Playwright's type declarations (playwright is a peer dependency).
 */
interface PlaywrightPage {
  goto(url: string, options?: { waitUntil?: string }): Promise<unknown>;
  screenshot(options?: { path?: string; fullPage?: boolean; type?: 'png' | 'jpeg' }): Promise<Buffer>;
  locator(selector: string): {
    screenshot(options?: { path?: string; type?: 'png' | 'jpeg' }): Promise<Buffer>;
  };
  setViewportSize(size: { width: number; height: number }): Promise<void>;
  evaluate<T>(fn: () => T): Promise<T>;
  $$eval<T>(selector: string, fn: (elements: Element[]) => T): Promise<T>;
}

/** Minimal interface for a Playwright browser instance. */
interface PlaywrightBrowser {
  newPage(): Promise<PlaywrightPage>;
  close(): Promise<void>;
}

/** Minimal interface for the Playwright module's chromium launcher. */
interface PlaywrightModule {
  chromium: {
    launch(options?: { headless?: boolean }): Promise<PlaywrightBrowser>;
  };
}

// ---------------------------------------------------------------------------
// Usage strings
// ---------------------------------------------------------------------------

const USAGE = `Usage: gobbi web <subcommand> [options]

Subcommands:
  screenshot <url>    Take a screenshot of a web page
  capture <url>       Download images from a web page

Options:
  --help    Show this help message`;

const SCREENSHOT_USAGE = `Usage: gobbi web screenshot <url> [options]

Options:
  --out <dir>          Output directory (required)
  --full-page          Capture full scrollable page (default: false)
  --selector <sel>     CSS selector to screenshot a specific element
  --viewport <WxH>    Viewport size (default: 1280x720)
  --max-size <n>       Maximum pixel dimension (default: 2048)
  --format <fmt>       Output format: png, jpeg, webp (default: png)
  --quality <n>        Encoding quality 1-100 (default: 80)
  --help               Show this help message`;

const CAPTURE_USAGE = `Usage: gobbi web capture <url> [options]

Options:
  --out <dir>          Output directory (required)
  --selector <sel>     CSS selector for image elements (default: img)
  --pattern <regex>    Filter image URLs by regex pattern
  --help               Show this help message`;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Parse a viewport string like "1280x720" into width and height.
 * Accepts 'x' or 'X' as the separator.
 * Returns null if the format is invalid.
 */
function parseViewport(viewport: string): { width: number; height: number } | null {
  const parts = viewport.split(/[xX]/);
  if (parts.length !== 2) return null;

  const widthStr = parts[0];
  const heightStr = parts[1];
  if (widthStr === undefined || heightStr === undefined) return null;

  const width = Number(widthStr);
  const height = Number(heightStr);

  if (!Number.isInteger(width) || !Number.isInteger(height) || width <= 0 || height <= 0) {
    return null;
  }

  return { width, height };
}

/**
 * Validate that a string is a valid HTTP or HTTPS URL.
 */
function isHttpUrl(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://');
}

/**
 * Derive a safe filename from a URL, stripping query params and
 * replacing filesystem-unsafe characters.
 */
function filenameFromUrl(url: string, index: number): string {
  try {
    const parsed = new URL(url);
    const lastSegment = parsed.pathname.split('/').pop() ?? '';
    // Remove query params and hash (already handled by URL parsing)
    const cleaned = lastSegment.replace(/[^a-zA-Z0-9._-]/g, '_');
    if (cleaned.length > 0 && cleaned !== '_') {
      return `${String(index).padStart(3, '0')}-${cleaned}`;
    }
  } catch {
    // Fall through to default
  }
  return `${String(index).padStart(3, '0')}-image`;
}

/**
 * Load the Playwright module and return the chromium launcher.
 */
async function loadPlaywright(): Promise<PlaywrightModule> {
  const pw = (await getPlaywright()) as { default: PlaywrightModule };
  return pw.default;
}

// ---------------------------------------------------------------------------
// Top-level handler
// ---------------------------------------------------------------------------

/**
 * Top-level handler for `gobbi web`. Dispatches to subcommands.
 * Called from cli.ts with process.argv.slice(3).
 */
export async function runWeb(args: string[]): Promise<void> {
  const subcommand = args[0];

  switch (subcommand) {
    case 'screenshot':
      await runWebScreenshot(args.slice(1));
      break;
    case 'capture':
      await runWebCapture(args.slice(1));
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
// gobbi web screenshot
// ---------------------------------------------------------------------------

/**
 * Handle `gobbi web screenshot <url>`.
 * Takes a screenshot of a web page using Playwright, optionally resizes,
 * and writes a manifest.
 */
async function runWebScreenshot(args: string[]): Promise<void> {
  const { values, positionals } = parseArgs({
    args,
    allowPositionals: true,
    strict: false,
    options: {
      'out': { type: 'string' },
      'full-page': { type: 'boolean', default: false },
      'selector': { type: 'string' },
      'viewport': { type: 'string' },
      'max-size': { type: 'string' },
      'format': { type: 'string' },
      'quality': { type: 'string' },
      'help': { type: 'boolean', default: false },
    },
  });

  if (values.help === true) {
    console.log(SCREENSHOT_USAGE);
    return;
  }

  // Validate required --out flag
  const outDir = values.out;
  if (typeof outDir !== 'string') {
    console.log(error('Missing required flag: --out'));
    console.log(SCREENSHOT_USAGE);
    process.exit(1);
  }

  // Validate positional URL
  const url = positionals[0];
  if (url === undefined) {
    console.log(error('Missing required argument: URL'));
    console.log(SCREENSHOT_USAGE);
    process.exit(1);
  }
  if (!isHttpUrl(url)) {
    console.log(error('URL must start with http:// or https://'));
    process.exit(1);
  }

  // Parse options with defaults
  const viewportStr = typeof values.viewport === 'string' ? values.viewport : '1280x720';
  const viewport = parseViewport(viewportStr);
  if (viewport === null) {
    console.log(error(`Invalid viewport format: ${viewportStr}. Expected WxH (e.g. 1280x720)`));
    process.exit(1);
  }

  const maxSize = values['max-size'] !== undefined ? Number(values['max-size']) : 2048;
  const format = (typeof values.format === 'string' ? values.format : 'png') as 'png' | 'jpeg' | 'webp';
  const quality = values.quality !== undefined ? Number(values.quality) : 80;
  const fullPage = values['full-page'] === true;
  const selector = typeof values.selector === 'string' ? values.selector : undefined;

  // Validate format
  if (format !== 'png' && format !== 'jpeg' && format !== 'webp') {
    console.log(error(`Invalid format: ${format as string}. Must be one of: png, jpeg, webp`));
    process.exit(1);
  }

  // Check dependency availability
  await assertPlaywrightAvailable();
  await assertSharpAvailable();

  // Create output directory
  await mkdir(outDir, { recursive: true });

  // Load Playwright and launch browser
  const pw = await loadPlaywright();
  const browser = await pw.chromium.launch({ headless: true });

  try {
    const page = await browser.newPage();
    await page.setViewportSize(viewport);
    await page.goto(url, { waitUntil: 'networkidle' });

    // Determine Playwright-native screenshot type.
    // Playwright supports only 'png' and 'jpeg'. For 'webp', capture as PNG
    // and convert with sharp.
    const nativeType: 'png' | 'jpeg' = format === 'jpeg' ? 'jpeg' : 'png';
    const needsConversion = format === 'webp' || format !== nativeType;

    const outputFilename = `screenshot.${format}`;
    const outputPath = path.join(outDir, outputFilename);

    // Use a temp file when post-processing is needed
    const tempFilename = needsConversion ? `screenshot-temp.${nativeType}` : outputFilename;
    const tempPath = needsConversion ? path.join(outDir, tempFilename) : outputPath;

    // Take screenshot
    if (selector !== undefined) {
      await page.locator(selector).screenshot({ path: tempPath, type: nativeType });
    } else if (fullPage) {
      await page.screenshot({ fullPage: true, path: tempPath, type: nativeType });
    } else {
      await page.screenshot({ path: tempPath, type: nativeType });
    }

    // Post-process: convert format or resize
    let resizedWidth = viewport.width;
    let resizedHeight = viewport.height;

    if (needsConversion || maxSize < Math.max(viewport.width, viewport.height)) {
      const result = await resizeImage(tempPath, outputPath, {
        maxSize,
        format: format === 'jpeg' ? 'jpeg' : format === 'webp' ? 'webp' : 'png',
        quality,
      });
      resizedWidth = result.resizedWidth;
      resizedHeight = result.resizedHeight;

      // Clean up temp file if it differs from output
      if (tempPath !== outputPath) {
        await unlink(tempPath);
      }
    } else {
      resizedWidth = viewport.width;
      resizedHeight = viewport.height;
    }

    // Write manifest
    const manifestPath = path.join(outDir, 'manifest.json');
    await writeManifest(outDir, {
      command: 'web screenshot',
      timestamp: new Date().toISOString(),
      source: {
        type: 'web',
        path: url,
        viewport: `${String(viewport.width)}x${String(viewport.height)}`,
        fullPage,
        ...(selector !== undefined ? { selector } : {}),
      },
      output: {
        files: [
          {
            filename: outputFilename,
            type: 'screenshot',
            width: resizedWidth,
            height: resizedHeight,
            format,
          },
        ],
      },
    });

    // Print results
    console.log(header('Web Screenshot'));
    console.log(ok(`URL: ${url}`));
    console.log(ok(`Viewport: ${String(viewport.width)}\u00d7${String(viewport.height)}`));
    if (selector !== undefined) {
      console.log(ok(`Selector: ${selector}`));
    }
    console.log(ok(`Screenshot: ${String(resizedWidth)}\u00d7${String(resizedHeight)} ${format} \u2192 ${outputPath}`));
    console.log(ok(`Manifest: ${manifestPath}`));
  } finally {
    await browser.close();
  }
}

// ---------------------------------------------------------------------------
// gobbi web capture
// ---------------------------------------------------------------------------

/**
 * Handle `gobbi web capture <url>`.
 * Opens a web page, extracts image URLs from matching elements, and
 * downloads them to the output directory.
 */
async function runWebCapture(args: string[]): Promise<void> {
  const { values, positionals } = parseArgs({
    args,
    allowPositionals: true,
    strict: false,
    options: {
      'out': { type: 'string' },
      'selector': { type: 'string' },
      'pattern': { type: 'string' },
      'help': { type: 'boolean', default: false },
    },
  });

  if (values.help === true) {
    console.log(CAPTURE_USAGE);
    return;
  }

  // Validate required --out flag
  const outDir = values.out;
  if (typeof outDir !== 'string') {
    console.log(error('Missing required flag: --out'));
    console.log(CAPTURE_USAGE);
    process.exit(1);
  }

  // Validate positional URL
  const url = positionals[0];
  if (url === undefined) {
    console.log(error('Missing required argument: URL'));
    console.log(CAPTURE_USAGE);
    process.exit(1);
  }
  if (!isHttpUrl(url)) {
    console.log(error('URL must start with http:// or https://'));
    process.exit(1);
  }

  // Parse options with defaults
  const selector = typeof values.selector === 'string' ? values.selector : 'img';
  const pattern = typeof values.pattern === 'string' ? values.pattern : undefined;

  // Check dependency availability
  await assertPlaywrightAvailable();

  // Create output directory
  await mkdir(outDir, { recursive: true });

  // Load Playwright and launch browser
  const pw = await loadPlaywright();
  const browser = await pw.chromium.launch({ headless: true });

  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle' });

    // Extract image URLs from the page
    const imgSrcs = await page.$$eval(selector, (elements: Element[]) => {
      return elements
        .map((el) => (el as HTMLImageElement).src || (el as HTMLImageElement).currentSrc)
        .filter((src) => src && src.length > 0);
    });

    if (imgSrcs.length === 0) {
      console.log(error(`No images found matching selector: ${selector}`));
      process.exit(1);
    }

    // Filter by pattern if provided
    let filteredSrcs = imgSrcs;
    if (pattern !== undefined) {
      const regex = new RegExp(pattern);
      filteredSrcs = imgSrcs.filter((src) => regex.test(src));
      if (filteredSrcs.length === 0) {
        console.log(error(`No images matched pattern: ${pattern}`));
        console.log(dim(`  Found ${String(imgSrcs.length)} images before filtering`));
        process.exit(1);
      }
    }

    // Download each image
    const downloadedFiles: Array<{ filename: string; size: number }> = [];
    let downloadIndex = 0;

    for (const imgUrl of filteredSrcs) {
      const filename = filenameFromUrl(imgUrl, downloadIndex);
      const outputPath = path.join(outDir, filename);

      try {
        const response = await fetch(imgUrl);
        if (!response.ok) {
          console.log(dim(`  Skipped (HTTP ${String(response.status)}): ${imgUrl}`));
          continue;
        }

        const buffer = Buffer.from(await response.arrayBuffer());
        await fsWriteFile(outputPath, buffer);
        downloadedFiles.push({ filename, size: buffer.length });
        downloadIndex++;
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.log(dim(`  Skipped (${message}): ${imgUrl}`));
      }
    }

    if (downloadedFiles.length === 0) {
      console.log(error('No images could be downloaded'));
      process.exit(1);
    }

    // Write manifest
    const manifestPath = path.join(outDir, 'manifest.json');
    await writeManifest(outDir, {
      command: 'web capture',
      timestamp: new Date().toISOString(),
      source: {
        type: 'web',
        path: url,
        selector,
        ...(pattern !== undefined ? { pattern } : {}),
        totalFound: imgSrcs.length,
        ...(pattern !== undefined ? { matchedPattern: filteredSrcs.length } : {}),
      },
      output: {
        files: downloadedFiles.map((f) => ({
          filename: f.filename,
          type: 'capture',
          width: 0,
          height: 0,
          format: path.extname(f.filename).slice(1) || 'unknown',
        })),
      },
    });

    // Print results
    console.log(header('Web Capture'));
    console.log(ok(`URL: ${url}`));
    console.log(ok(`Selector: ${selector}`));
    if (pattern !== undefined) {
      console.log(ok(`Pattern: ${pattern}`));
    }
    console.log(ok(`Found: ${String(imgSrcs.length)} images`));
    if (pattern !== undefined) {
      console.log(ok(`Matched: ${String(filteredSrcs.length)} images`));
    }
    console.log(ok(`Downloaded: ${String(downloadedFiles.length)} images \u2192 ${outDir}`));
    console.log(ok(`Manifest: ${manifestPath}`));
  } finally {
    await browser.close();
  }
}
