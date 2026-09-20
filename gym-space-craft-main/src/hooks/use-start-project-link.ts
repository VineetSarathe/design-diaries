import { useRouterState } from "@tanstack/react-router";
import type { MouseEvent } from "react";

export const PROJECT_ENQUIRY_ID = "project-enquiry";

export function scrollToProjectEnquiry() {
  document.getElementById(PROJECT_ENQUIRY_ID)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function useStartProjectLink() {
  const onStartPage = useRouterState({
    select: (state) => state.location.pathname === "/start-a-project",
  });

  return {
    to: "/start-a-project" as const,
    hash: onStartPage ? PROJECT_ENQUIRY_ID : undefined,
    onClick: onStartPage
      ? (event: MouseEvent<HTMLAnchorElement>) => {
          event.preventDefault();
          scrollToProjectEnquiry();
        }
      : undefined,
  };
}
