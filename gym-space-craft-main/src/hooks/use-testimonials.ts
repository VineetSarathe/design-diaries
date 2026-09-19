import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import type { Testimonial } from "@/lib/admin-api";

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest<{ testimonials: Testimonial[] }>("/testimonials")
      .then((res) => setTestimonials(res.testimonials))
      .catch(() => setTestimonials([]))
      .finally(() => setLoading(false));
  }, []);

  return { testimonials, loading };
}
