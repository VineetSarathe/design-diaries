import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { preloadMediaUrls } from "@/lib/media";
import type { Recognition } from "@/lib/admin-api";
import type { RecognitionItem } from "@/components/site/Recognition";

function toItem(item: Recognition, index: number): RecognitionItem {
  const media = item.images.map((image) => ({
    url: image.url,
    kind: image.kind === "video" || image.url.includes("/video/upload/") || /\.(mp4|webm|mov)(\?|$)/i.test(image.url)
      ? ("video" as const)
      : ("image" as const),
  }));
  return {
    number: String(index + 1).padStart(2, "0"),
    category: item.category,
    title: item.title,
    year: item.year,
    image: item.imageUrl,
    images: media.map((entry) => entry.url),
    media,
    description: item.description || "",
    link: item.link || "/about#recognition",
  };
}

export function useRecognitions(fallback: RecognitionItem[] = []) {
  const [items, setItems] = useState<RecognitionItem[]>(fallback);

  useEffect(() => {
    apiRequest<{ items: Recognition[] }>("/recognitions")
      .then((res) => {
        const next = res.items.map(toItem);
        setItems(next);
        preloadMediaUrls(next.map((item) => item.image), 900);
        preloadMediaUrls(
          next.flatMap((item) => item.images ?? []).filter(Boolean),
          720,
        );
      })
      .catch(() => undefined);
  }, []);

  return { items };
}
