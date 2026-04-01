import { stat } from 'fs/promises';

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
  metadata(): Promise<{
    width?: number;
    height?: number;
    format?: string;
    space?: string;
    density?: number;
    hasAlpha?: boolean;
    size?: number;
  }>;
  resize(
    width: number,
    height: number,
    options?: { fit?: string; withoutEnlargement?: boolean },
  ): SharpInstance;
  webp(options?: { quality?: number }): SharpInstance;
  jpeg(options?: { quality?: number }): SharpInstance;
  png(): SharpInstance;
  toFile(path: string): Promise<{
    width: number;
    height: number;
    format: string;
    size: number;
  }>;
}

/** Constructor function returned by the sharp module's default export. */
type SharpConstructor = (input: string) => SharpInstance;

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

/**
 * Core metadata extracted from an image file.
 */
export interface ImageMetadata {
  width: number;
  height: number;
  format: string;
  colorSpace: string;
  fileSize: number;
  density: number;
  hasAlpha: boolean;
}

/**
 * Options controlling how an image is resized.
 */
export interface ResizeOptions {
  /** Maximum pixel dimension for the longest side. Defaults to 2048. */
  maxSize?: number | undefined;
  /** Output format. Defaults to the source format. */
  format?: 'webp' | 'png' | 'jpeg' | undefined;
  /** Encoding quality (1-100). Defaults to 80. Ignored for png. */
  quality?: number | undefined;
}

/**
 * Result returned after an image has been resized and written to disk.
 */
export interface ResizeResult {
  outputPath: string;
  originalWidth: number;
  originalHeight: number;
  resizedWidth: number;
  resizedHeight: number;
  format: string;
  fileSizeBytes: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Load sharp's default export and cast to our minimal constructor type.
 * `getSharp()` returns the module namespace object (`unknown`). For a
 * default-exported function the namespace has a `.default` property.
 */
async function loadSharp(): Promise<SharpConstructor> {
  const mod = (await getSharp()) as { default: SharpConstructor };
  return mod.default;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Extract metadata from an image file.
 * @param filePath - Absolute path to the image file.
 * @returns Populated metadata object.
 */
export async function getImageMetadata(filePath: string): Promise<ImageMetadata> {
  const sharp = await loadSharp();
  const meta = await sharp(filePath).metadata();

  // File size via fs.stat — more reliable than sharp's metadata size
  // which is only populated when reading from a buffer.
  const fileStat = await stat(filePath);

  return {
    width: meta.width ?? 0,
    height: meta.height ?? 0,
    format: meta.format ?? 'unknown',
    colorSpace: meta.space ?? 'unknown',
    fileSize: fileStat.size,
    density: meta.density ?? 72,
    hasAlpha: meta.hasAlpha ?? false,
  };
}

/**
 * Resize an image, writing the result to `outputPath`.
 *
 * If either dimension exceeds `maxSize` (default 2048), the image is
 * scaled down proportionally so that the largest dimension equals
 * `maxSize`. Images already within bounds are still processed — they
 * are re-encoded if the target format differs from the source, or
 * passed through otherwise.
 *
 * @param inputPath  - Absolute path to the source image.
 * @param outputPath - Absolute path for the output file.
 * @param options    - Optional resize and encoding parameters.
 * @returns Result describing the output file.
 */
export async function resizeImage(
  inputPath: string,
  outputPath: string,
  options?: ResizeOptions | undefined,
): Promise<ResizeResult> {
  const maxSize = options?.maxSize ?? 2048;
  const quality = options?.quality ?? 80;

  const sharp = await loadSharp();
  const meta = await sharp(inputPath).metadata();

  const originalWidth = meta.width ?? 0;
  const originalHeight = meta.height ?? 0;

  // Determine target dimensions -----------------------------------------
  let targetWidth = originalWidth;
  let targetHeight = originalHeight;

  if (originalWidth > maxSize || originalHeight > maxSize) {
    const scale = maxSize / Math.max(originalWidth, originalHeight);
    targetWidth = Math.round(originalWidth * scale);
    targetHeight = Math.round(originalHeight * scale);
  }

  // Determine output format ---------------------------------------------
  const sourceFormat = meta.format ?? 'unknown';
  const outputFormat = options?.format ?? sourceFormat;

  // Build pipeline ------------------------------------------------------
  let pipeline = sharp(inputPath).resize(targetWidth, targetHeight, {
    fit: 'inside',
    withoutEnlargement: true,
  });

  switch (outputFormat) {
    case 'webp':
      pipeline = pipeline.webp({ quality });
      break;
    case 'jpeg':
      pipeline = pipeline.jpeg({ quality });
      break;
    case 'png':
      pipeline = pipeline.png();
      break;
    // For unrecognised formats (e.g. source format passthrough like 'gif')
    // sharp will use the input format automatically.
  }

  const info = await pipeline.toFile(outputPath);

  return {
    outputPath,
    originalWidth,
    originalHeight,
    resizedWidth: info.width,
    resizedHeight: info.height,
    format: info.format,
    fileSizeBytes: info.size,
  };
}
