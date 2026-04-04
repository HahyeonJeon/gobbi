import { execFile as execFileCb } from 'child_process';
import { promisify } from 'util';

const execFile = promisify(execFileCb);

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Video metadata returned by ffprobe. */
export interface VideoInfo {
  width: number;
  height: number;
  fps: number;
  durationSeconds: number;
  durationInFrames: number;
  codec: string;
  format: string;
}

/** A single frame selection with its frame number and timestamp. */
export interface FrameSelection {
  frameNumber: number;
  timestampSeconds: number;
}

/** Strategy for selecting which frames to extract from a video. */
export type FrameStrategy = 'key-moments' | 'interval';

/** Supported output image formats for frame extraction. */
export type ImageFormat = 'webp' | 'png' | 'jpeg';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Parse an ffprobe frame rate string into a number.
 * Handles rational format ("30/1", "30000/1001"), decimal ("29.97"),
 * and invalid values ("0/0", "N/A").
 * @param rateStr - The raw frame rate string from ffprobe.
 * @returns The parsed FPS, or 30 as a safe default.
 */
function parseFps(rateStr: string): number {
  if (rateStr.includes('/')) {
    const parts = rateStr.split('/');
    const numStr = parts[0];
    const denStr = parts[1];
    const numerator = parseFloat(numStr ?? '0');
    const denominator = parseFloat(denStr ?? '1');
    if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) {
      return 30;
    }
    const result = numerator / denominator;
    return Number.isFinite(result) && result > 0 ? result : 30;
  }
  const parsed = parseFloat(rateStr);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 30;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Probe a video file with ffprobe to extract metadata.
 *
 * Runs ffprobe asynchronously and parses its JSON output to find the
 * video stream and extract dimensions, frame rate, duration, and codec.
 *
 * @param filePath - Absolute path to the video file.
 * @returns Video metadata.
 * @throws If ffprobe fails, the file has no video stream, or dimensions/duration are invalid.
 */
export async function probeVideo(filePath: string): Promise<VideoInfo> {
  const { stdout } = await execFile('ffprobe', [
    '-v', 'quiet',
    '-print_format', 'json',
    '-show_streams',
    '-show_format',
    filePath,
  ]);

  const parsed = JSON.parse(stdout) as {
    streams?: Array<{
      codec_type?: string;
      codec_name?: string;
      width?: number;
      height?: number;
      r_frame_rate?: string;
      avg_frame_rate?: string;
      duration?: string;
    }>;
    format?: {
      duration?: string;
      format_name?: string;
    };
  };

  const streams = parsed.streams;
  if (!streams) {
    throw new Error(`No streams found in: ${filePath}`);
  }

  const videoStream = streams.find((s) => s.codec_type === 'video');
  if (!videoStream) {
    throw new Error(`No video stream found in: ${filePath}`);
  }

  const width = videoStream.width ?? 0;
  const height = videoStream.height ?? 0;

  if (width === 0 || height === 0) {
    throw new Error(
      `Could not determine video dimensions for: ${filePath}. ` +
      `Got width=${String(width)}, height=${String(height)}.`,
    );
  }

  const fps = parseFps(
    videoStream.r_frame_rate ?? videoStream.avg_frame_rate ?? '30/1',
  );

  const durationStr = videoStream.duration ?? parsed.format?.duration ?? '0';
  const durationSeconds = parseFloat(durationStr);

  if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) {
    throw new Error(
      `Could not determine video duration for: ${filePath}. ` +
      `Got duration=${String(durationSeconds)}s.`,
    );
  }

  const durationInFrames = Math.ceil(durationSeconds * fps);
  const codec = videoStream.codec_name ?? 'unknown';
  const format = parsed.format?.format_name ?? 'unknown';

  return { width, height, fps, durationSeconds, durationInFrames, codec, format };
}

/**
 * Extract a single frame from a video file at a specific timestamp.
 *
 * Uses ffmpeg with the `-ss` flag before `-i` for fast keyframe-based
 * seeking. Arguments are passed as an array (no shell invocation) to
 * prevent injection.
 *
 * @param videoPath - Absolute path to the video file.
 * @param timestampSeconds - Timestamp in seconds to seek to.
 * @param outputPath - Absolute path for the output image file.
 * @param format - Output image format.
 * @param quality - Encoding quality (1-100). Ignored for PNG.
 */
export async function extractFrame(
  videoPath: string,
  timestampSeconds: number,
  outputPath: string,
  format: ImageFormat,
  quality: number,
): Promise<void> {
  let codec: string;
  let formatArgs: string[];

  switch (format) {
    case 'webp':
      codec = 'libwebp';
      formatArgs = ['-quality', String(quality)];
      break;
    case 'png':
      codec = 'png';
      formatArgs = [];
      break;
    case 'jpeg':
      codec = 'mjpeg';
      // FFmpeg JPEG quality: 1 (best) to 31 (worst).
      // Map quality 100→1, 0→32 via linear scale.
      formatArgs = ['-q:v', String(Math.round((100 - quality) * 0.31 + 1))];
      break;
  }

  const args: string[] = [
    '-ss', String(timestampSeconds),
    '-i', videoPath,
    '-frames:v', '1',
    '-y',
    '-c:v', codec,
    ...formatArgs,
    outputPath,
  ];

  await execFile('ffmpeg', args);
}

/**
 * Select frame timestamps from a video using the specified strategy.
 *
 * `key-moments` selects 5 frames at 0%, 25%, 50%, 75%, and 100% of
 * the duration. `interval` selects frames at regular intervals,
 * always including the first and last frames.
 *
 * @param durationSeconds - Total video duration in seconds.
 * @param fps - Video frame rate.
 * @param strategy - Selection strategy.
 * @param intervalSeconds - Interval in seconds for the `interval` strategy. Defaults to 5.
 * @returns Array of frame selections with frame numbers and timestamps.
 */
export function selectFrameTimestamps(
  durationSeconds: number,
  fps: number,
  strategy: FrameStrategy,
  intervalSeconds?: number | undefined,
): FrameSelection[] {
  if (strategy === 'key-moments') {
    const percentages = [0, 0.25, 0.5, 0.75, 1.0];
    const lastSafe = Math.max(durationSeconds - 0.1, 0);

    // Deduplicate by frame number — for very short videos multiple
    // percentages may map to the same frame.
    const seen = new Set<number>();
    const selections: FrameSelection[] = [];

    for (const pct of percentages) {
      let timestamp = durationSeconds * pct;
      // Clamp the 100% point to avoid seeking past the end
      if (timestamp > lastSafe) {
        timestamp = lastSafe;
      }
      // Round to 4 decimal places
      timestamp = Math.round(timestamp * 10000) / 10000;
      const frameNumber = Math.round(timestamp * fps);

      if (!seen.has(frameNumber)) {
        seen.add(frameNumber);
        selections.push({ frameNumber, timestampSeconds: timestamp });
      }
    }

    return selections;
  }

  // interval strategy
  const interval = intervalSeconds ?? 5;
  const lastSafe = Math.max(durationSeconds - 0.1, 0);
  const selections: FrameSelection[] = [];
  const seen = new Set<number>();

  for (let t = 0; t < durationSeconds; t += interval) {
    const timestamp = Math.round(t * 10000) / 10000;
    const frameNumber = Math.round(timestamp * fps);

    if (!seen.has(frameNumber)) {
      seen.add(frameNumber);
      selections.push({ frameNumber, timestampSeconds: timestamp });
    }
  }

  // Always include the last frame
  const lastTimestamp = Math.round(lastSafe * 10000) / 10000;
  const lastFrame = Math.round(lastTimestamp * fps);

  if (!seen.has(lastFrame)) {
    selections.push({ frameNumber: lastFrame, timestampSeconds: lastTimestamp });
  }

  return selections;
}

/**
 * Generate a zero-padded frame filename.
 *
 * @param frameNumber - The frame number to encode in the filename.
 * @param format - File extension (without dot).
 * @param totalFrames - Total number of frames, used to determine padding width.
 * @returns Filename like `frame-00042.webp`.
 */
export function frameFilename(frameNumber: number, format: string, totalFrames: number): string {
  const padWidth = Math.max(String(totalFrames).length, 5);
  const padded = String(frameNumber).padStart(padWidth, '0');
  return `frame-${padded}.${format}`;
}
