const UPLOAD_SAFE_BYTES = 35 * 1024 * 1024;
const MAX_EDGE = 4500;

type CompressImageOptions = {
  force?: boolean;
  maxEdge?: number;
  quality?: number;
  uploadSafeBytes?: number;
};

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read that image"));
    };
    image.src = url;
  });
}

function canvasToFile(canvas: HTMLCanvasElement, name: string, quality: number) {
  return new Promise<File>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Could not prepare that image"));
          return;
        }
        resolve(new File([blob], name.replace(/\.[^.]+$/, ".jpg"), { type: "image/jpeg" }));
      },
      "image/jpeg",
      quality,
    );
  });
}

/** Keep originals. Only shrink files that would miss the 40 MB upload cap. */
export async function compressImage(file: File, options: CompressImageOptions = {}): Promise<File> {
  const limit = options.uploadSafeBytes ?? UPLOAD_SAFE_BYTES;
  if (!file.type.startsWith("image/") || (!options.force && file.size <= limit)) return file;

  const maxEdge = options.maxEdge ?? MAX_EDGE;
  const quality = options.quality ?? 0.95;
  const image = await loadImage(file);
  const scale = Math.min(1, maxEdge / Math.max(image.width, image.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  const prepared = await canvasToFile(canvas, file.name, quality);
  return prepared.size < file.size ? prepared : file;
}
