export function isVideoSrc(url: string) {
  return /\.(mp4|webm|mov)(\?|$)/i.test(url) || url.includes("/video/upload/");
}

function cloudinaryParts(url: string) {
  const match = url.match(/^(https:\/\/res\.cloudinary\.com\/[^/]+)\/(image|video)\/upload\/(.+)$/i);
  if (!match) return null;
  const rest = match[3];
  const versioned = rest.match(/(v\d+\/.+)$/);
  return {
    host: match[1],
    resource: match[2].toLowerCase() as "image" | "video",
    versionedPath: versioned ? versioned[1] : rest,
  };
}

function clamp(width: number, max: number) {
  return Math.max(1, Math.min(Math.round(width), max));
}

/** Width cap only — keeps the original image format (no f_auto / quality re-encode). */
export function mediaPreviewUrl(url: string, width: number) {
  const parts = cloudinaryParts(url);
  if (!parts) return url;
  const w = clamp(width, 2000);
  if (parts.resource === "video") {
    const still = parts.versionedPath.replace(/\.(mp4|webm|mov)(\?.*)?$/i, ".jpg");
    return `${parts.host}/video/upload/c_limit,dpr_auto,f_jpg,so_1,w_${w}/${still}`;
  }
  return `${parts.host}/image/upload/c_limit,dpr_auto,w_${w}/${parts.versionedPath}`;
}

export function mediaPreviewSrcSet(url: string, widths: number[]) {
  const unique = Array.from(new Set(widths.map((w) => clamp(w, 2000)))).sort((a, b) => a - b);
  return unique.map((w) => `${mediaPreviewUrl(url, w)} ${w}w`).join(", ");
}

export function mediaPlaybackUrl(url: string, width = 720) {
  const parts = cloudinaryParts(url);
  if (!parts || parts.resource !== "video") return url;
  const w = clamp(width, 960);
  return `${parts.host}/video/upload/ac_aac,br_700k,c_limit,f_mp4,q_auto:good,vc_h264,w_${w}/${parts.versionedPath}`;
}
