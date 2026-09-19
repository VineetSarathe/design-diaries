import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
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
    link: item.link || "/about#recognition",
  };
}

export function useRecognitions(fallback: RecognitionItem[] = []) {
  const [items, setItems] = useState<RecognitionItem[]>(fallback);

  useEffect(() => {
    apiRequest<{ items: Recognition[] }>("/recognitions")
      .then((res) => setItems(res.items.map(toItem)))
      .catch(() => undefined);
  }, []);

  return { items };
}
