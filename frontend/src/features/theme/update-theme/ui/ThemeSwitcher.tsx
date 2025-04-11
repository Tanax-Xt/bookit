import { Component, JSX } from "solid-js";

import { Theme, THEMES, useTheme } from "@/entities/theme";
import Select from "@/shared/ui/select";

import { ThemeSwatch } from "./ThemeSwatch";
import { getThemeDisplayName } from "../model/i18n";

export const ThemeSwitcher: Component = () => {
  const theme = useTheme();

  return (
    <Select
      name="theme"
      label="Тема"
      value={theme.value}
      onChange={(event) => theme.setValue(event.currentTarget.value as Theme)}
      options={THEMES.map((theme) => ({
        value: theme,
        label: getThemeDisplayName(theme),
        before: (() => <ThemeSwatch value={theme} />) as unknown as JSX.Element,
      }))}
      disallowEmptySelection={true}
      allowDuplicateSelectionEvents={false}
    />
  );
};
