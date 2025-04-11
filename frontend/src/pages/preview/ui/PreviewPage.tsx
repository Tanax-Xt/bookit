import { createAsync, useParams } from "@solidjs/router";
import { Show } from "solid-js";

import { getBooking } from "@/entities/map/api/queries";
import { ReservationMoreDropdown } from "@/entities/reservation";
import { getCurrentUser } from "@/entities/user";
import { Navigation } from "@/widgets/nav";
import { ReservationPreview } from "@/widgets/reservation";

const PreviewPage = () => {
  const params = useParams();

  const currentUser = createAsync(() => getCurrentUser());
  const booking = createAsync(() => getBooking(params.id as string));

  return (
    <section class="space-y-4">
      {/* TODO: suspence skeleton */}
      <Show when={currentUser() && booking()?.data}>
        <Navigation
          label="Просмотр брони"
          back="/reservations"
          after={<ReservationMoreDropdown booking={booking()!.data!} />}
        />

        <ReservationPreview user={currentUser()!} booking={booking()!.data!} />
      </Show>
    </section>
  );
};

export default PreviewPage;
