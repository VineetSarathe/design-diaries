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

export function mediaPreviewUrl(url: string, width: number) {
  const parts = cloudinaryParts(url);
  if (!parts) return url;
  const w = clamp(width, 1400);
  if (parts.resource === "video") {
    const still = parts.versionedPath.replace(/\.(mp4|webm|mov)(\?.*)?$/i, ".jpg");
    return `${parts.host}/video/upload/c_fill,f_jpg,q_auto:good,so_1,w_${w}/${still}`;
  }
  return `${parts.host}/image/upload/c_limit,f_auto,q_auto:good,w_${w}/${parts.versionedPath}`;
}

export function mediaPlaybackUrl(url: string, width = 720) {
  const parts = cloudinaryParts(url);
  if (!parts || parts.resource !== "video") return url;
  const w = clamp(width, 960);
  return `${parts.host}/video/upload/ac_aac,br_700k,c_limit,f_mp4,q_auto:good,vc_h264,w_${w}/${parts.versionedPath}`;
}
