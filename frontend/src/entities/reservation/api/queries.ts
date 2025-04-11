import { json, query } from "@solidjs/router";

import { client } from "@/shared/api";

export const getReservations = query(async () => {
  const { data } = await client.GET("/api/users/me/bookings");

  return json(data);
}, "reservations");

export const getCurrentReservation = query(async (user_id: string, secret_id: string) => {
  const { data } = await client.POST("/api/bookings/current", {
    body: {
      user_id,
      secret_id,
    },
  });

  return json(data);
}, "current-reservation");
