import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import type { InstagramCard } from "@/lib/admin-api";

export function useInstagramFeed(placement: "home" | "work" | "about" | "resources" | "services", fallback: InstagramCard[] = []) {
  const [items, setItems] = useState<InstagramCard[]>(fallback);

  useEffect(() => {
    apiRequest<{ items: InstagramCard[] }>(`/instagram-feed?placement=${placement}`)
      .then((res) => {
        if (res.items?.length) setItems(res.items);
      })
      .catch(() => undefined);
  }, [placement]);

  return { items };
}
