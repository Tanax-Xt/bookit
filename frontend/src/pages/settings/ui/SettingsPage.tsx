import { ThemeSwitcher } from "@/features/theme";
import { Navigation } from "@/widgets/nav";

const SettingsPage = () => {
  return (
    <section class="space-y-4">
      <Navigation label="Настройки" />

      <ThemeSwitcher />
    </section>
  );
};

export default SettingsPage;
