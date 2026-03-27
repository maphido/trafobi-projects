"use client";

import { useReducer, useEffect, useCallback } from "react";

export interface ProjectFormData {
  // Step 1: About You (read from session, editable)
  authorName: string;
  authorInstitution: string;
  authorCountry: string;
  authorBio: string;

  // Step 2: Basics
  title: string;
  language: string;
  institutionName: string;
  institutionType: string;
  country: string;
  city: string;
  topics: string[];
  studyPhase: string;

  // Step 3: Story
  summary: string;
  description: string;

  // Step 4: Results
  impact: string;
  challenges: string;
  tips: string;

  // Step 5: Links
  links: { url: string; label: string }[];
}

interface FormState {
  data: ProjectFormData;
  step: number;
  projectId: string | null;
  saving: boolean;
  submitting: boolean;
  error: string | null;
}

type FormAction =
  | { type: "SET_FIELD"; field: keyof ProjectFormData; value: unknown }
  | { type: "SET_STEP"; step: number }
  | { type: "SET_PROJECT_ID"; id: string }
  | { type: "SET_SAVING"; saving: boolean }
  | { type: "SET_SUBMITTING"; submitting: boolean }
  | { type: "SET_ERROR"; error: string | null }
  | { type: "LOAD_STATE"; state: Partial<FormState> }
  | { type: "ADD_LINK" }
  | { type: "REMOVE_LINK"; index: number }
  | { type: "UPDATE_LINK"; index: number; field: "url" | "label"; value: string };

const INITIAL_DATA: ProjectFormData = {
  authorName: "",
  authorInstitution: "",
  authorCountry: "",
  authorBio: "",
  title: "",
  language: "de",
  institutionName: "",
  institutionType: "",
  country: "",
  city: "",
  topics: [],
  studyPhase: "all",
  summary: "",
  description: "",
  impact: "",
  challenges: "",
  tips: "",
  links: [],
};

const INITIAL_STATE: FormState = {
  data: INITIAL_DATA,
  step: 0,
  projectId: null,
  saving: false,
  submitting: false,
  error: null,
};

const STORAGE_KEY = "trafobi-project-form";

function reducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, data: { ...state.data, [action.field]: action.value } };
    case "SET_STEP":
      return { ...state, step: action.step };
    case "SET_PROJECT_ID":
      return { ...state, projectId: action.id };
    case "SET_SAVING":
      return { ...state, saving: action.saving };
    case "SET_SUBMITTING":
      return { ...state, submitting: action.submitting };
    case "SET_ERROR":
      return { ...state, error: action.error };
    case "LOAD_STATE":
      return { ...state, ...action.state };
    case "ADD_LINK":
      return {
        ...state,
        data: {
          ...state.data,
          links: [...state.data.links, { url: "", label: "" }],
        },
      };
    case "REMOVE_LINK":
      return {
        ...state,
        data: {
          ...state.data,
          links: state.data.links.filter((_, i) => i !== action.index),
        },
      };
    case "UPDATE_LINK": {
      const links = [...state.data.links];
      links[action.index] = { ...links[action.index], [action.field]: action.value };
      return { ...state, data: { ...state.data, links } };
    }
    default:
      return state;
  }
}

export function useProjectForm() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        dispatch({ type: "LOAD_STATE", state: parsed });
      } catch {
        // Ignore invalid saved state
      }
    }
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    const toSave = { data: state.data, step: state.step, projectId: state.projectId };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  }, [state.data, state.step, state.projectId]);

  const setField = useCallback(
    (field: keyof ProjectFormData, value: unknown) => {
      dispatch({ type: "SET_FIELD", field, value });
    },
    []
  );

  const nextStep = useCallback(() => {
    dispatch({ type: "SET_STEP", step: Math.min(state.step + 1, 4) });
  }, [state.step]);

  const prevStep = useCallback(() => {
    dispatch({ type: "SET_STEP", step: Math.max(state.step - 1, 0) });
  }, [state.step]);

  // Returns the project ID on success, null on failure
  const saveDraft = useCallback(async (): Promise<string | null> => {
    dispatch({ type: "SET_SAVING", saving: true });
    dispatch({ type: "SET_ERROR", error: null });

    try {
      const payload = {
        title: state.data.title || "Untitled Project",
        language: state.data.language,
        summary: state.data.summary,
        description: state.data.description,
        impact: state.data.impact,
        challenges: state.data.challenges,
        tips: state.data.tips,
        institutionName: state.data.institutionName,
        institutionType: state.data.institutionType || null,
        country: state.data.country,
        city: state.data.city,
        topics: state.data.topics,
        studyPhase: state.data.studyPhase,
        links: state.data.links.filter((l) => l.url),
      };

      let res: Response;
      if (state.projectId) {
        res = await fetch(`/api/projects/${state.projectId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }

      const project = await res.json();
      if (!state.projectId) {
        dispatch({ type: "SET_PROJECT_ID", id: project.id });
      }
      return project.id;
    } catch (err) {
      dispatch({
        type: "SET_ERROR",
        error: err instanceof Error ? err.message : "Failed to save",
      });
      return null;
    } finally {
      dispatch({ type: "SET_SAVING", saving: false });
    }
  }, [state.data, state.projectId]);

  const submitForReview = useCallback(async () => {
    // Always save first to get a project ID
    const savedId = await saveDraft();
    const pid = savedId || state.projectId;
    if (!pid) return false;

    dispatch({ type: "SET_SUBMITTING", submitting: true });
    dispatch({ type: "SET_ERROR", error: null });

    try {

      const res = await fetch(`/api/projects/${pid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...state.data, _action: "submit" }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit");
      }

      // Clear localStorage after successful submission
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (err) {
      dispatch({
        type: "SET_ERROR",
        error: err instanceof Error ? err.message : "Failed to submit",
      });
      return false;
    } finally {
      dispatch({ type: "SET_SUBMITTING", submitting: false });
    }
  }, [state.data, state.projectId, saveDraft]);

  const resetForm = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    dispatch({ type: "LOAD_STATE", state: INITIAL_STATE });
  }, []);

  const loadProject = useCallback(
    (project: Record<string, unknown>) => {
      dispatch({
        type: "LOAD_STATE",
        state: {
          projectId: project.id as string,
          data: {
            ...INITIAL_DATA,
            title: (project.title as string) || "",
            language: (project.language as string) || "de",
            summary: (project.summary as string) || "",
            description: (project.description as string) || "",
            impact: (project.impact as string) || "",
            challenges: (project.challenges as string) || "",
            tips: (project.tips as string) || "",
            institutionName: (project.institutionName as string) || "",
            institutionType: (project.institutionType as string) || "",
            country: (project.country as string) || "",
            city: (project.city as string) || "",
            topics: (project.topics as string[]) || [],
            studyPhase: (project.studyPhase as string) || "all",
            links: (project.links as { url: string; label: string }[]) || [],
          },
        },
      });
    },
    []
  );

  return {
    ...state,
    setField,
    nextStep,
    prevStep,
    saveDraft,
    submitForReview,
    resetForm,
    loadProject,
    dispatch,
  };
}
