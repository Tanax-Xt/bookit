import { BookingResponse, UserResponse } from "@/shared/api/types";
import Button from "@/shared/ui/button";
import { ReservationPreview } from "@/widgets/reservation";

import IconIcRoundCheck from "~icons/ic/round-check";

export const ActivateBookingScreen = (props: {
  user: UserResponse;
  booking: BookingResponse;
  loading?: boolean | undefined;
  onSubmit?: VoidFunction;
}) => {
  return (
    <div class="flex grow flex-col space-y-4">
      <ReservationPreview user={props.user} booking={props.booking} />

      <Button
        stretched
        class="max-lg:mt-auto"
        spacing="lg"
        appearance="positive"
        before={<IconIcRoundCheck role="presentation" class="size-5" />}
        onClick={props.onSubmit}
        loading={props.loading}
        disabled={props.booking.is_activated_by_user}
      >
        {props.booking.is_activated_by_user ? "Бронирование уже подтверждено" : "Подтвердить бронирование"}
      </Button>
    </div>
  );
};
