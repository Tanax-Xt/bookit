import MapPage from "@/entities/map/ui/MapPage";
import { getCurrentUser } from "@/entities/user";
import { Navigation } from "@/widgets/nav";
import { createAsync } from "@solidjs/router";
import { createMemo } from "solid-js";

const HomePage = () => {
  const user = createAsync(() => getCurrentUser());
  const label = createMemo(() => (user()?.role === "admin" ? "Просмотр броней" : "Создание брони"));
  return (
    <>
      <Navigation label={label()} />
      <MapPage />
    </>
  );
};

export default HomePage;
