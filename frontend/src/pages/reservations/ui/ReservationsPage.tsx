import { createAsyncStore } from "@solidjs/router";
import { Show, Suspense } from "solid-js";

import { getReservations } from "@/entities/reservation";
import { Navigation } from "@/widgets/nav";
import { ReservationList } from "@/widgets/reservation";

const ReservationsPage = () => {
  const reservations = createAsyncStore(() => getReservations());

  return (
    <section class="relative space-y-4">
      <Navigation label="Мои брони" />
      <Suspense>
        <Show when={reservations()}>{(reservations) => <ReservationList bookings={reservations()} />}</Show>
      </Suspense>
    </section>
  );
};

export default ReservationsPage;
