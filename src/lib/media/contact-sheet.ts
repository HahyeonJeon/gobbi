import path from 'path';

import { getSharp } from './deps.js';

// ---------------------------------------------------------------------------
// Minimal sharp type surface
// ---------------------------------------------------------------------------

/**
 * Minimal interface for a sharp processing pipeline.
 * Covers only the methods used by this module so we avoid depending on
 * sharp's type declarations (sharp is a peer dependency).
 */
interface SharpInstance {
  metadata(): Promise<{ width?: number; height?: number }>;
  resize(w: number, h: number, opts?: { fit?: string }): SharpInstance;
  composite(
    inputs: Array<{ input: Buffer; left: number; top: number }>,
  ): SharpInstance;
  webp(opts?: { quality?: number }): SharpInstance;
  jpeg(opts?: { quality?: number }): SharpInstance;
  png(): SharpInstance;
  toFile(
    path: string,
  ): Promise<{ width: number; height: number; size: number }>;
  toBuffer(): Promise<Buffer>;
}

/**
 * Sharp constructor — supports both file path input and canvas creation.
 */
interface SharpStatic {
  (input: string | Buffer): SharpInstance;
  (options: {
    create: {
      width: number;
      height: number;
      channels: number;
      background: { r: number; g: number; b: number; alpha: number };
    };
  }): SharpInstance;
}

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

/** Layout mode for the contact sheet grid. */
export type Layout = 'vertical' | 'grid' | 'horizontal';

/** Options for generating a contact sheet. */
export interface ContactSheetOptions {
  /** Absolute paths to the source image files. */
  imagePaths: string[];
  /** Labels for each image (must match imagePaths length). */
  labels: string[];
  /** Output directory for the contact sheet file. */
  outputDir: string;
  /** Layout mode. Defaults to 'vertical'. */
  layout?: Layout | undefined;
  /** Width of each cell in pixels. Defaults to 800. */
  cellWidth?: number | undefined;
  /** Output image format. Defaults to 'webp'. */
  format?: 'webp' | 'png' | 'jpeg' | undefined;
  /** Encoding quality (1-100). Defaults to 80. Ignored for png. */
  quality?: number | undefined;
}

/** Result returned after a contact sheet has been generated. */
export interface ContactSheetResult {
  outputPath: string;
  width: number;
  height: number;
  layout: Layout;
  columns: number;
  rows: number;
  cellWidth: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Load sharp's default export and cast to our minimal static type.
 * `getSharp()` returns the module namespace object (`unknown`). For a
 * default-exported function the namespace has a `.default` property.
 */
async function loadSharp(): Promise<SharpStatic> {
  const mod = (await getSharp()) as { default: SharpStatic };
  return mod.default;
}

/**
 * Escape special XML characters in text content.
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Create an SVG text overlay for a label positioned at the bottom of a cell.
 * The overlay has a semi-transparent dark background with white monospace text.
 *
 * @param label - Text content for the label.
 * @param width - Width of the overlay in pixels (matches cell width).
 * @returns Buffer containing the SVG markup.
 */
function createLabelOverlay(label: string, width: number): Buffer {
  const fontSize = Math.max(12, Math.round(width * 0.04));
  const padding = Math.round(fontSize * 0.5);
  const bgHeight = fontSize + padding * 2;

  const svg =
    `<svg width="${width}" height="${bgHeight}" xmlns="http://www.w3.org/2000/svg">` +
    `<rect x="0" y="0" width="${width}" height="${bgHeight}" fill="rgba(0,0,0,0.7)"/>` +
    `<text x="${padding}" y="${fontSize + padding * 0.7}" ` +
    `font-family="monospace, sans-serif" font-size="${fontSize}" fill="white" ` +
    `dominant-baseline="auto">${escapeXml(label)}</text>` +
    `</svg>`;

  return Buffer.from(svg);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Calculate the number of columns and rows for a given item count and layout.
 *
 * - `vertical`:   single column, count rows
 * - `horizontal`: count columns, single row
 * - `grid`:       ceil(sqrt(count)) columns, ceil(count/columns) rows
 *
 * @param count  - Number of items to arrange.
 * @param layout - Layout mode.
 * @returns Grid dimensions.
 */
export function calculateLayout(
  count: number,
  layout: Layout,
): { columns: number; rows: number } {
  if (count <= 0) {
    return { columns: 0, rows: 0 };
  }

  switch (layout) {
    case 'vertical':
      return { columns: 1, rows: count };
    case 'horizontal':
      return { columns: count, rows: 1 };
    case 'grid': {
      const columns = Math.ceil(Math.sqrt(count));
      const rows = Math.ceil(count / columns);
      return { columns, rows };
    }
  }
}

/**
 * Generate a contact sheet by compositing multiple images into a single
 * grid image with text labels.
 *
 * @param options - Contact sheet generation options.
 * @returns Result describing the generated contact sheet.
 */
export async function generateContactSheet(
  options: ContactSheetOptions,
): Promise<ContactSheetResult> {
  const {
    imagePaths,
    labels,
    outputDir,
    layout: layoutMode = 'vertical',
    cellWidth = 800,
    format = 'webp',
    quality = 80,
  } = options;

  // Validate inputs --------------------------------------------------------

  if (imagePaths.length === 0) {
    throw new Error('Cannot generate contact sheet: no images provided');
  }
  if (imagePaths.length !== labels.length) {
    throw new Error(
      `imagePaths length (${imagePaths.length}) must match labels length (${labels.length})`,
    );
  }

  // Load sharp and determine cell dimensions --------------------------------

  const sharp = await loadSharp();

  const firstPath = imagePaths[0];
  if (firstPath === undefined) {
    throw new Error('Cannot generate contact sheet: no images provided');
  }

  const firstMeta = await sharp(firstPath).metadata();
  const sourceWidth = firstMeta.width ?? 1920;
  const sourceHeight = firstMeta.height ?? 1080;
  const cellHeight = Math.round(cellWidth * (sourceHeight / sourceWidth));

  // Calculate grid layout ---------------------------------------------------

  const { columns, rows } = calculateLayout(imagePaths.length, layoutMode);
  const canvasWidth = columns * cellWidth;
  const canvasHeight = rows * cellHeight;

  // Build composite inputs --------------------------------------------------

  const compositeInputs: Array<{ input: Buffer; left: number; top: number }> =
    [];

  for (let i = 0; i < imagePaths.length; i++) {
    const imagePath = imagePaths[i];
    const label = labels[i];

    if (imagePath === undefined || label === undefined) {
      continue;
    }

    const col = i % columns;
    const row = Math.floor(i / columns);
    const x = col * cellWidth;
    const y = row * cellHeight;

    // Resize image to cell dimensions
    const resizedBuffer = await sharp(imagePath)
      .resize(cellWidth, cellHeight, { fit: 'fill' })
      .toBuffer();

    compositeInputs.push({ input: resizedBuffer, left: x, top: y });

    // Create label overlay at the bottom of the cell
    const labelOverlay = createLabelOverlay(label, cellWidth);
    const labelMeta = await sharp(labelOverlay).metadata();
    const labelHeight = labelMeta.height ?? 20;

    compositeInputs.push({
      input: labelOverlay,
      left: x,
      top: y + cellHeight - labelHeight,
    });
  }

  // Create canvas and composite ---------------------------------------------

  let pipeline = sharp({
    create: {
      width: canvasWidth,
      height: canvasHeight,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 1 },
    },
  }).composite(compositeInputs);

  // Apply format encoding
  switch (format) {
    case 'webp':
      pipeline = pipeline.webp({ quality });
      break;
    case 'jpeg':
      pipeline = pipeline.jpeg({ quality });
      break;
    case 'png':
      pipeline = pipeline.png();
      break;
  }

  // Write output file -------------------------------------------------------

  const outputPath = path.join(outputDir, `contact-sheet.${format}`);
  await pipeline.toFile(outputPath);

  return {
    outputPath,
    width: canvasWidth,
    height: canvasHeight,
    layout: layoutMode,
    columns,
    rows,
    cellWidth,
  };
}
