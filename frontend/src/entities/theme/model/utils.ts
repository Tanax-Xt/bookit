import { DEFAULT_THEME, THEMES } from "../config";
import { Theme } from "./types";

export const isTheme = (value: unknown): value is Theme => {
  return typeof value === "string" && (THEMES as readonly string[]).includes(value);
};

export const parseTheme = (text: string): Theme => {
  const value = JSON.parse(text);

  return isTheme(value) ? value : DEFAULT_THEME;
};

export const safeParseTheme = (text: string) => {
  try {
    return parseTheme(text);
  } catch {
    return DEFAULT_THEME;
  }
};
