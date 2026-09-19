import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { adminApi, type AdminUser } from "@/lib/admin-api";

type Options = {
  required?: boolean;
  redirectIfAuthed?: boolean;
};

export function useAdminSession({ required = false, redirectIfAuthed = false }: Options = {}) {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    adminApi
      .me()
      .then((res) => {
        if (cancelled) return;
        if (!res.admin) {
          setAdmin(null);
          if (required) {
            void navigate({ to: "/admin/login" });
          }
          return;
        }
        setAdmin(res.admin);
        if (redirectIfAuthed) {
          void navigate({ to: "/admin" });
        }
      })
      .catch(() => {
        if (cancelled) return;
        setAdmin(null);
        if (required) {
          void navigate({ to: "/admin/login" });
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [navigate, redirectIfAuthed, required]);

  const logout = useCallback(async () => {
    await adminApi.logout();
    setAdmin(null);
    await navigate({ to: "/admin/login" });
  }, [navigate]);

  return { admin, loading, logout };
}
