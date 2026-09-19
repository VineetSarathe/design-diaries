import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import type { ClientLogo } from "@/lib/admin-api";

export function useClientLogos() {
  const [logos, setLogos] = useState<ClientLogo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest<{ logos: ClientLogo[] }>("/client-logos")
      .then((res) => setLogos(res.logos))
      .catch(() => setLogos([]))
      .finally(() => setLoading(false));
  }, []);

  return { logos, loading };
}
