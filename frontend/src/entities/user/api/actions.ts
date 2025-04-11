import { action, json } from "@solidjs/router";

import { client } from "@/shared/api";
import { RoleEnum } from "@/shared/api/types";

import { getCurrentUser } from "./queries";

export const updateCurrentUserUsernameAction = action(async (username: string) => {
  const { error } = await client.PATCH("/api/users/me/username", {
    body: {
      username: username,
    },
  });

  return json({ error });
}, "update-current-user-username-action");

export const updateCurrentUserPasswordAction = action(async (password: string) => {
  const { error } = await client.PATCH("/api/users/me/password", {
    body: {
      password: password,
    },
  });

  return json({ error });
}, "update-current-user-password-action");

export const updateUserRoleAction = action(async (user_id: string, role: RoleEnum) => {
  const { error } = await client.PATCH("/api/users/{user_id}/role", {
    params: {
      path: {
        user_id,
      },
    },
    body: { role },
  });

  return json({ error });
}, "update-user-role-action");

export const updateUserNameAction = action(async (user_id: string, name: string) => {
  const { error } = await client.PATCH("/api/users/{user_id}/name", {
    params: {
      path: {
        user_id,
      },
    },
    body: {
      name,
    },
  });

  return json({ error });
}, "update-user-name-action");

export const updateUserEmailAction = action(async (user_id: string, email: string) => {
  const { error } = await client.PATCH("/api/users/{user_id}/email", {
    params: {
      path: {
        user_id,
      },
    },
    body: {
      email,
    },
  });

  return json({ error });
}, "update-user-email-action");

export const updateUserSecretIdAction = action(async (user_id: string) => {
  const { error } = await client.PATCH("/api/users/{user_id}/update_secret", {
    params: {
      path: {
        user_id,
      },
    },
  });

  return json({ error }, { revalidate: getCurrentUser.key });
}, "update-user-secret-id-action");
