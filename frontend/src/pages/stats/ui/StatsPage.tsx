import { useTheme } from "@/entities/theme";
import { Navigation } from "@/widgets/nav";

const StatsPage = () => {
  const theme = useTheme();

  return (
    <section class="space-y-4">
      <Navigation label="Статистика" />

      <div class="grid grid-cols-2 items-center justify-center gap-4 max-sm:grid-cols-1">
        <iframe
          src={`https://prod-team-27-kvcek6a0.final.prodcontest.ru/grafana/d-solo/aeepbtlb73bpcd/business-dashboard?var-rate_interval=1h&orgId=1&timezone=browser&theme=${theme.preferred}&panelId=5&__feature.dashboardSceneSolo`}
          width="100%"
          height="200"
          frame-border="0"
          class="overflow-clip rounded-lg"
        />
        <iframe
          src={`https://prod-team-27-kvcek6a0.final.prodcontest.ru/grafana/d-solo/aeepbtlb73bpcd/business-dashboard?var-rate_interval=1h&orgId=1&timezone=browser&theme=${theme.preferred}&panelId=6&__feature.dashboardSceneSolo`}
          width="100%"
          height="200"
          frame-border="0"
          class="overflow-clip rounded-lg"
        />
        <iframe
          src={`https://prod-team-27-kvcek6a0.final.prodcontest.ru/grafana/d-solo/aeepbtlb73bpcd/business-dashboard?var-rate_interval=1h&orgId=1&timezone=browser&theme=${theme.preferred}&panelId=7&__feature.dashboardSceneSolo`}
          width="100%"
          height="200"
          frame-border="0"
          class="overflow-clip rounded-lg"
        />
        <iframe
          src={`https://prod-team-27-kvcek6a0.final.prodcontest.ru/grafana/d-solo/aeepbtlb73bpcd/business-dashboard?var-rate_interval=1h&orgId=1&timezone=browser&theme=${theme.preferred}&panelId=4&__feature.dashboardSceneSolo`}
          width="100%"
          height="200"
          frame-border="0"
          class="overflow-clip rounded-lg"
        />
        <iframe
          src={`https://prod-team-27-kvcek6a0.final.prodcontest.ru/grafana/d-solo/aeepbtlb73bpcd/business-dashboard?var-rate_interval=1h&orgId=1&timezone=browser&theme=${theme.preferred}&panelId=9&__feature.dashboardSceneSolo`}
          width="100%"
          height="200"
          frame-border="0"
          class="overflow-clip rounded-lg"
        />
        <iframe
          src={`https://prod-team-27-kvcek6a0.final.prodcontest.ru/grafana/d-solo/aeepbtlb73bpcd/business-dashboard?var-rate_interval=1h&orgId=1&timezone=browser&theme=${theme.preferred}&panelId=8&__feature.dashboardSceneSolo`}
          width="100%"
          height="200"
          frame-border="0"
          class="overflow-clip rounded-lg"
        />
      </div>
    </section>
  );
};

export default StatsPage;
