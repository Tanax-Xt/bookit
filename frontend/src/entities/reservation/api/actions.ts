import { action, json } from "@solidjs/router";

import { client } from "@/shared/api";

import { getReservations } from "./queries";

export const deleteReservationAction = action(async (booking_id: string) => {
  const { error } = await client.DELETE("/api/bookings/{booking_id}", {
    params: {
      path: {
        booking_id,
      },
    },
  });

  return json({ error }, { revalidate: getReservations.key });
}, "delete-reservation-action");

export const activateReservationAction = action(
  async (options: { secret_id: string; user_id: string; booking_id: string; place_id: string }) => {
    const { response } = await client.POST("/api/bookings/{booking_id}/activate", {
      body: {
        secret_id: options.secret_id,
        user_id: options.user_id,
      },
      params: {
        path: {
          booking_id: options.booking_id,
        },
      },
    });

    return json({ status: response.status });
  },
  "activate-reservation-action",
);
