import { createFileRoute } from "@tanstack/react-router";
import { PageIntro } from "@/components/site/PageIntro";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Use | Design Diaries" },
      {
        name: "description",
        content: "Terms governing use of the Design Diaries website and enquiry forms.",
      },
      { property: "og:title", content: "Terms of Use | Design Diaries" },
      { property: "og:description", content: "Terms for using this website." },
    ],
  }),
  component: () => (
    <PageIntro
      label="Legal"
      title="Terms of use"
      intro="Placeholder text. Site content, imagery and project descriptions are the property of Design Diaries and are shown here for reference only."
    />
  ),
});
