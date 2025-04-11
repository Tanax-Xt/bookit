import { action, json } from "@solidjs/router";

import { client } from "@/shared/api";
import { formatDateToYYYYMMDD } from "@/shared/lib/date";

export const createBookingAction = action(
  async (place_id: string, date: Date, start_second: number, end_second: number, email?: string | null | undefined) => {
    const { error, response, data } = await client.POST(`/api/places/{place_id}/bookings`, {
      body: { date: formatDateToYYYYMMDD(date), start_second, end_second },
      params: { path: { place_id } },
    });

    if (email && data) {
      await client.POST("/api/bookings/{booking_id}/send_mail", {
        body: {
          email,
        },
        params: {
          path: {
            booking_id: data.id,
          },
        },
      });
    }

    return json({ error, status: response.status });
  },
);

export const editBookingAction = action(
  async (
    booking_id: string,
    date: string,
    start_second: number,
    end_second: number,
    place_id: string,
    email?: string | null | undefined,
  ) => {
    const { error, response } = await client.PATCH(`/api/bookings/{booking_id}`, {
      body: { date, start_second, end_second, place_id },
      params: { path: { booking_id } },
    });

    if (email) {
      await client.POST("/api/bookings/{booking_id}/send_mail", {
        body: {
          email,
        },
        params: {
          path: {
            booking_id,
          },
        },
      });
    }

    return json({ error, status: response.status });
  },
);
