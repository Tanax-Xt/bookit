import { query } from "@solidjs/router";

import { client } from "@/shared/api";
import { formatDateToYYYYMMDD } from "@/shared/lib/date";

export const getPlaces = query(async () => {
  const { data, response } = await client.GET("/api/places");

  if (response.status !== 200) {
    return undefined;
  }

  return data;
}, "places");

export const getPlaceBookings = query(
  async (
    place_id: string,
    query: {
      date: string;
      start_second: number;
      end_second: number;
    },
  ) => {
    const { data, response } = await client.GET("/api/places/{place_id}/bookings", {
      params: {
        path: {
          place_id,
        },
        query,
      },
    });

    if (response.status !== 200) {
      return undefined;
    }

    return data;
  },
  "place-bookings",
);

export const getAvailablePlaces = query(async (date: Date, start_second: number, end_second: number) => {
  const { data, response } = await client.POST("/api/places/availability", {
    body: {
      date: formatDateToYYYYMMDD(date),
      start_second,
      end_second,
    },
  });

  if (response.status !== 200) {
    return [];
  }

  return data;
}, "available-places");

export const getBooking = query(async (booking_id: string) => {
  const { data, response, error } = await client.GET("/api/bookings/{booking_id}", {
    params: {
      path: { booking_id },
    },
  });

  if (response.status !== 200) {
    return { error };
  }

  return { data, error };
}, "booking");
