import { createContext, useContext } from "solid-js";

import { CreateThemeReturn } from "./create";

export type ThemeContextValue = CreateThemeReturn;

export const ThemeContext = createContext<ThemeContextValue>();

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("The 'useTheme' primitive must be used within a <ThemeProvider> component.");
  }

  return context;
};
