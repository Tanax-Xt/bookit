import { createAsyncStore } from "@solidjs/router";
import { Setter, Show, Suspense } from "solid-js";

import { PlaceAvailableResponse } from "@/shared/api/types";
import { useBreakpoints } from "@/shared/lib/breakpoints";
import { formatDateToYYYYMMDD } from "@/shared/lib/date";
import Drawer from "@/shared/ui/drawer";
import { ReservationList, ReservationListSkeleton } from "@/widgets/reservation";

import { getPlaceBookings } from "../api/queries";

type AdminPanelProps = {
  open: boolean;
  setOpen: Setter<boolean>;
  resetActivePlace: () => void;
  selectedPlace: PlaceAvailableResponse | undefined;
  day: Date;
};

export const AdminPanel = (props: AdminPanelProps) => {
  const breakpoints = useBreakpoints();
  return (
    <Drawer
      side={breakpoints.lg ? "right" : "bottom"}
      open={props.open}
      onOpenChange={props.setOpen}
      onContentPresentChange={(present) => {
        if (!present) props.resetActivePlace();
      }}
      closeOnOutsidePointerStrategy="pointerdown"
    >
      <Drawer.Content>
        <Drawer.Label class="text-2xl font-semibold">{props.selectedPlace?.name}</Drawer.Label>

        <Show when={props.selectedPlace}>
          {(place) => {
            const bookings = createAsyncStore(() => {
              return getPlaceBookings(place().id, {
                date: formatDateToYYYYMMDD(props.day),
                // TODO: remove in backend
                start_second: 0,
                end_second: 86399,
              });
            });

            return (
              <Suspense fallback={<ReservationListSkeleton />}>
                <ReservationList bookings={bookings()} role={"admin"} />
              </Suspense>
            );
          }}
        </Show>
      </Drawer.Content>
    </Drawer>
  );
};
