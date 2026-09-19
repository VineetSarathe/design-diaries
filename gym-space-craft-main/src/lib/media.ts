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

export function mediaPreviewUrl(url: string, width: number) {
  const parts = cloudinaryParts(url);
  if (!parts) return url;
  if (parts.resource === "video") {
    const still = parts.versionedPath.replace(/\.(mp4|webm|mov)(\?.*)?$/i, ".jpg");
    return `${parts.host}/video/upload/so_1,w_${width},c_fill,q_auto,f_jpg/${still}`;
  }
  return `${parts.host}/image/upload/w_${width},c_limit,f_auto,q_auto/${parts.versionedPath}`;
}

export function mediaPlaybackUrl(url: string, width = 960) {
  const parts = cloudinaryParts(url);
  if (!parts || parts.resource !== "video") return url;
  return `${parts.host}/video/upload/w_${width},c_limit,q_auto,f_mp4/${parts.versionedPath}`;
}
