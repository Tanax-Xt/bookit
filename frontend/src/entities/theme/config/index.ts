import { Theme } from "../model/types";

export const THEME_LOCAL_STORAGE_KEY = "theme" as const;

export const THEMES = ["light", "dark", "auto"] as const;
export const DEFAULT_THEME: Theme = "auto" as const;
