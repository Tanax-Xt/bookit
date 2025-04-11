import { Theme } from "@/entities/theme";

const translations: Record<Theme, string> = {
  light: "Светлая",
  dark: "Тёмная",
  auto: "Как в системе",
};

export const getThemeDisplayName = (theme: Theme) => {
  return translations[theme];
};
