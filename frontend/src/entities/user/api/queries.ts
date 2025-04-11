import { query } from "@solidjs/router";

import { client } from "@/shared/api";
import { getAccessTokenExpired, setAccessToken } from "@/shared/session";

export const getCurrentUser = query(async () => {
  if (getAccessTokenExpired()) {
    return;
  }

  const { data, response } = await client.GET("/api/users/me");

  if (response.status !== 200) {
    setAccessToken(undefined);
    return undefined;
  }

  return data;
}, "current-user");

export const getUser = query(async (user_id: string) => {
  const { data } = await client.GET("/api/users/{user_id}", {
    params: {
      path: {
        user_id,
      },
    },
  });

  return data;
}, "user-by-id");

export const getUsers = query(async (query: { q: string }) => {
  const { data } = await client.GET("/api/users", {
    params: {
      query: query,
    },
  });

  return data;
}, "users");
