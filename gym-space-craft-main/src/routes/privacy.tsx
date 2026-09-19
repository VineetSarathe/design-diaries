import { createFileRoute } from "@tanstack/react-router";
import { PageIntro } from "@/components/site/PageIntro";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | Design Diaries" },
      {
        name: "description",
        content: "How Design Diaries collects, stores and uses enquiry information.",
      },
      { property: "og:title", content: "Privacy Policy | Design Diaries" },
      { property: "og:description", content: "How we handle enquiry data." },
    ],
  }),
  component: () => (
    <PageIntro
      label="Legal"
      title="Privacy policy"
      intro="Placeholder text. We collect only what an enquiry form requires — name, phone, email and city — and use it solely to respond to your project enquiry."
    />
  ),
});
