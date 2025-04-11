import { createAsync, useAction, useSearchParams, useSubmission } from "@solidjs/router";
import { createMemo, Show, Suspense } from "solid-js";

import { activateReservationAction, getCurrentReservation } from "@/entities/reservation";
import { getUser } from "@/entities/user";
import { Navigation } from "@/widgets/nav";

import { ActivateBookingScreen } from "./ActivateBookingScreen";
import { ActivateBookingScreenSkeleton } from "./ActivateBookingScreenSkeleton";
import { BookingActivatedScreen } from "./BookingActivatedScreen";

const StartPage = () => {
  const [searchParams] = useSearchParams();

  const activateReservation = useAction(activateReservationAction);
  const activatingReservation = useSubmission(activateReservationAction);

  const userId = createMemo<string | null>(() =>
    typeof searchParams.user_id === "string" ? searchParams.user_id : null,
  );

  const secretId = createMemo<string | null>(() =>
    typeof searchParams.secret_id === "string" ? searchParams.secret_id : null,
  );

  return (
    <section class="flex grow flex-col space-y-4">
      <Navigation label="Подтверждение бронирования" back="/" />

      <Suspense fallback={<ActivateBookingScreenSkeleton />}>
        <Show when={userId()} fallback={"Неверное имя пользователя"}>
          {(userId) => {
            const user = createAsync(() => getUser(userId()));

            return (
              <Show when={secretId()} fallback={"Неверный QR"}>
                {(secretId) => (
                  <Show when={user()} fallback={"Пользователь не найден"}>
                    {(user) => {
                      const currentReservation = createAsync(() => getCurrentReservation(user().id, secretId()));

                      return (
                        <Show when={currentReservation()} fallback={"Нет ближайших бронирований"}>
                          {(currentReservation) => {
                            const submit = async () => {
                              await activateReservation({
                                booking_id: currentReservation().id,
                                place_id: currentReservation().place.id,
                                user_id: user().id,
                                secret_id: secretId(),
                              });
                            };

                            return (
                              <Show
                                when={activatingReservation.result?.status === 200}
                                fallback={
                                  <ActivateBookingScreen
                                    user={user()}
                                    booking={currentReservation()}
                                    loading={activatingReservation.pending}
                                    onSubmit={submit}
                                  />
                                }
                              >
                                <BookingActivatedScreen user={user()} />
                              </Show>
                            );
                          }}
                        </Show>
                      );
                    }}
                  </Show>
                )}
              </Show>
            );
          }}
        </Show>
      </Suspense>
    </section>
  );
};

export default StartPage;
