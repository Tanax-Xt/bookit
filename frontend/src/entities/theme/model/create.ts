import { usePrefersDark } from "@solid-primitives/media";
import { makePersisted, PersistenceOptions } from "@solid-primitives/storage";
import { createEffect, createMemo, createSignal, Setter } from "solid-js";

import { DEFAULT_THEME, THEME_LOCAL_STORAGE_KEY } from "../config";
import { Theme } from "./types";
import { safeParseTheme } from "./utils";

export type CreateThemeReturn = {
  value: Theme;
  setValue: Setter<Theme>;
  preferred: Theme;
};

export const THEME_PERSISTENCE_OPTIONS: PersistenceOptions<Theme, undefined> = {
  name: THEME_LOCAL_STORAGE_KEY,
  deserialize: safeParseTheme,
};

export const createTheme = (): CreateThemeReturn => {
  const prefersDark = usePrefersDark();
  const [value, setValue] = makePersisted(createSignal<Theme>(DEFAULT_THEME), THEME_PERSISTENCE_OPTIONS);
  const preferred = createMemo<Theme>(() => (value() === "auto" ? (prefersDark() ? "dark" : "light") : value()));

  createEffect(() => {
    document.documentElement.dataset.theme = preferred();
  });

  return {
    get value() {
      return value();
    },
    setValue,
    get preferred() {
      return preferred();
    },
  };
};
