export type ProjectStudyFields = {
  brief: string;
  user: string;
  challenge: string;
  decisions: string;
  outcome: string;
  learning: string;
};

export const EMPTY_PROJECT_STUDY: ProjectStudyFields = {
  brief: "",
  user: "",
  challenge: "",
  decisions: "",
  outcome: "",
  learning: "",
};

/** Labels shown on the work detail case study — fixed; admin only fills the text. */
export const CASE_STUDY_CHAPTERS: { key: keyof ProjectStudyFields; question: string }[] = [
  { key: "brief", question: "What needed to be built" },
  { key: "user", question: "Who the space needed to serve" },
  { key: "challenge", question: "What stood in the way" },
  { key: "decisions", question: "What changed in the plan" },
  { key: "outcome", question: "What improved in use" },
  { key: "learning", question: "What we take forward" },
];

export function studyHasContent(study: ProjectStudyFields | undefined) {
  if (!study) return false;
  return CASE_STUDY_CHAPTERS.some((chapter) => study[chapter.key].trim().length > 0);
}

/** Prefer CMS study from the API; otherwise use seeded fallback copy for the same slug. */
export function resolveStudyFields(
  fromApi: ProjectStudyFields | undefined,
  fallbackStudy?: ProjectStudyFields,
): ProjectStudyFields {
  const merged = { ...EMPTY_PROJECT_STUDY, ...fromApi };
  if (studyHasContent(merged)) return merged;
  if (fallbackStudy && studyHasContent(fallbackStudy)) {
    return { ...EMPTY_PROJECT_STUDY, ...fallbackStudy };
  }
  return merged;
}
