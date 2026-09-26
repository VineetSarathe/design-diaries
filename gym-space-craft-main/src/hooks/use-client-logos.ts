import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { preloadMediaUrls } from "@/lib/media";
import type { ClientLogo } from "@/lib/admin-api";

export function useClientLogos(options?: { enabled?: boolean }) {
  const enabled = options?.enabled ?? true;
  const [logos, setLogos] = useState<ClientLogo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!enabled) return;
    apiRequest<{ logos: ClientLogo[] }>("/client-logos")
      .then((res) => {
        setLogos(res.logos);
        preloadMediaUrls(res.logos.map((logo) => logo.imageUrl), 280);
      })
      .catch(() => setLogos([]))
      .finally(() => setLoading(false));
  }, [enabled]);

  return { logos, loading };
}
