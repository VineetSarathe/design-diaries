import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const require = createRequire(import.meta.url);
const ffmpegBin = require("ffmpeg-static") as string | null;

const MAX_WIDTH = 1280;
const TIMEOUT_MS = 90_000;

function extOf(name: string) {
  const ext = path.extname(name).toLowerCase();
  if (ext === ".mov" || ext === ".webm" || ext === ".mp4" || ext === ".m4v") return ext;
  return ".mp4";
}

function runFfmpeg(bin: string, args: string[]) {
  return new Promise<void>((resolve, reject) => {
    const proc = spawn(bin, args, { windowsHide: true });
    const timer = setTimeout(() => {
      proc.kill("SIGKILL");
      reject(new Error("Video compression timed out"));
    }, TIMEOUT_MS);

    proc.on("error", (err) => {
      clearTimeout(timer);
      reject(err);
    });
    proc.on("close", (code) => {
      clearTimeout(timer);
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited with ${code}`));
    });
  });
}

export async function compressVideoToMp4(source: Buffer | string, originalName = "video.mp4") {
  const bin = ffmpegBin;
  if (!bin) {
    throw new Error("ffmpeg is not available");
  }

  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "gsc-vid-"));
  const inputPath = typeof source === "string" ? source : path.join(tmp, `in${extOf(originalName)}`);
  const outputPath = path.join(tmp, "out.mp4");

  try {
    if (typeof source !== "string") {
      await fs.writeFile(inputPath, source);
    }

    const baseArgs = [
      "-y",
      "-i",
      inputPath,
      "-vf",
      `scale='min(${MAX_WIDTH},iw)':-2`,
      "-c:v",
      "libx264",
      "-preset",
      "veryfast",
      "-crf",
      "28",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
    ];

    try {
      await runFfmpeg(bin, [...baseArgs, "-c:a", "aac", "-b:a", "96k", "-ac", "2", outputPath]);
    } catch {
      await fs.unlink(outputPath).catch(() => undefined);
      await runFfmpeg(bin, [...baseArgs, "-an", outputPath]);
    }

    const compressed = await fs.readFile(outputPath);
    if (!compressed.length) throw new Error("Compressed video was empty");

    if (typeof source !== "string" && compressed.length >= source.length) {
      return source;
    }
    return compressed;
  } finally {
    await fs.rm(tmp, { recursive: true, force: true }).catch(() => undefined);
  }
}
