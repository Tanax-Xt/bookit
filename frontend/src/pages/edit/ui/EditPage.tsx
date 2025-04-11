import { useParams } from "@solidjs/router";

import MapPage from "@/entities/map/ui/MapPage";
import { Navigation } from "@/widgets/nav";

const EditPage = () => {
  const params = useParams();

  return (
    <>
      <Navigation label="Редактирование брони" back={`/reservations/${params.id}`} />
      <MapPage isEditPage />
    </>
  );
};

export default EditPage;
