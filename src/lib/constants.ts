export const TOPICS = [
  "competency_based_learning",
  "sotl",
  "future_skills",
  "sustainability",
  "digital_transformation",
  "interdisciplinarity",
  "student_participation",
  "assessment_innovation",
  "project_based_learning",
  "service_learning",
  "inclusion_diversity",
  "curriculum_design",
  "ai_in_education",
  "entrepreneurship_education",
] as const;

export type Topic = (typeof TOPICS)[number];

export const TOPIC_LABELS: Record<string, { de: string; en: string }> = {
  competency_based_learning: {
    de: "Kompetenzorientiertes Lernen",
    en: "Competency-Based Learning",
  },
  sotl: {
    de: "Scholarship of Teaching & Learning",
    en: "Scholarship of Teaching & Learning",
  },
  future_skills: { de: "Future Skills", en: "Future Skills" },
  sustainability: { de: "Nachhaltigkeit / BNE", en: "Sustainability / ESD" },
  digital_transformation: {
    de: "Digitale Transformation",
    en: "Digital Transformation",
  },
  interdisciplinarity: {
    de: "Interdisziplinarität",
    en: "Interdisciplinarity",
  },
  student_participation: {
    de: "Studierendenbeteiligung",
    en: "Student Participation",
  },
  assessment_innovation: {
    de: "Innovative Prüfungsformen",
    en: "Assessment Innovation",
  },
  project_based_learning: {
    de: "Projektbasiertes Lernen",
    en: "Project-Based Learning",
  },
  service_learning: { de: "Service Learning", en: "Service Learning" },
  inclusion_diversity: {
    de: "Inklusion & Diversität",
    en: "Inclusion & Diversity",
  },
  curriculum_design: {
    de: "Curriculumsentwicklung",
    en: "Curriculum Design",
  },
  ai_in_education: { de: "KI in der Bildung", en: "AI in Education" },
  entrepreneurship_education: {
    de: "Entrepreneurship-Bildung",
    en: "Entrepreneurship Education",
  },
};

export const COUNTRIES = [
  { code: "DE", de: "Deutschland", en: "Germany" },
  { code: "AT", de: "Österreich", en: "Austria" },
  { code: "CH", de: "Schweiz", en: "Switzerland" },
  { code: "NL", de: "Niederlande", en: "Netherlands" },
  { code: "BE", de: "Belgien", en: "Belgium" },
  { code: "DK", de: "Dänemark", en: "Denmark" },
  { code: "SE", de: "Schweden", en: "Sweden" },
  { code: "NO", de: "Norwegen", en: "Norway" },
  { code: "FI", de: "Finnland", en: "Finland" },
  { code: "UK", de: "Vereinigtes Königreich", en: "United Kingdom" },
  { code: "IE", de: "Irland", en: "Ireland" },
  { code: "FR", de: "Frankreich", en: "France" },
  { code: "ES", de: "Spanien", en: "Spain" },
  { code: "PT", de: "Portugal", en: "Portugal" },
  { code: "IT", de: "Italien", en: "Italy" },
  { code: "PL", de: "Polen", en: "Poland" },
  { code: "CZ", de: "Tschechien", en: "Czech Republic" },
  { code: "EE", de: "Estland", en: "Estonia" },
  { code: "LV", de: "Lettland", en: "Latvia" },
  { code: "LT", de: "Litauen", en: "Lithuania" },
  { code: "OTHER", de: "Anderes Land", en: "Other Country" },
] as const;

export const INSTITUTION_TYPES = [
  "university",
  "fh",
  "art_school",
  "other",
] as const;

export const STUDY_PHASES = ["bachelor", "master", "all"] as const;

export const COUNTRY_FLAGS: Record<string, string> = {
  DE: "🇩🇪",
  AT: "🇦🇹",
  CH: "🇨🇭",
  NL: "🇳🇱",
  BE: "🇧🇪",
  DK: "🇩🇰",
  SE: "🇸🇪",
  NO: "🇳🇴",
  FI: "🇫🇮",
  UK: "🇬🇧",
  IE: "🇮🇪",
  FR: "🇫🇷",
  ES: "🇪🇸",
  PT: "🇵🇹",
  IT: "🇮🇹",
  PL: "🇵🇱",
  CZ: "🇨🇿",
  EE: "🇪🇪",
  LV: "🇱🇻",
  LT: "🇱🇹",
  OTHER: "🌍",
};
