import { usePrefersDark } from "@solid-primitives/media";
import { createEffect, createSignal } from "solid-js";

import { Theme } from "@/entities/theme";

export type ThemeSwatchProps = {
  value: Theme;
};

export const ThemeSwatch = (props: ThemeSwatchProps) => {
  const [theme, setTheme] = createSignal<Theme>(props.value);

  createEffect(() => {
    if (props.value === "auto") {
      const prefersDark = usePrefersDark();

      setTheme(prefersDark() ? "dark" : "light");
    }
  });

  return (
    <div class="size-6 overflow-clip rounded-full ring-1 ring-bg-tertiary transition-shadow">
      <div class="size-full bg-bg-body transition-colors" data-theme={theme()} />
    </div>
  );
};
