import { action, json, redirect } from "@solidjs/router";

import { client, serializeFormData } from "@/shared/api";
import { BodyLoginApiAuthLoginPost, UserRegistrationRequest } from "@/shared/api/types";
import { setAccessToken } from "@/shared/session";

export const loginAction = action(
  async (form: Pick<BodyLoginApiAuthLoginPost, "username" | "password">, redirectTo: string = "/") => {
    const { data, error, response } = await client.POST("/api/auth/login", {
      body: {
        scope: "",
        username: form.username,
        password: form.password,
      },
      bodySerializer: serializeFormData,
    });

    if (data) {
      setAccessToken(data);

      throw redirect(redirectTo);
    }

    return json({ error, status: response.status });
  },
  "login-action",
);

export const registerAction = action(async (body: UserRegistrationRequest, redirectTo: string = "/") => {
  const { data, error, response } = await client.POST("/api/auth/register", { body: body });

  if (data) {
    setAccessToken(data);

    throw redirect(redirectTo);
  }

  return json({ error, status: response.status });
}, "register-action");

export const logoutAction = action(async (redirectTo: string = "/") => {
  setAccessToken(undefined);

  throw redirect(redirectTo);
}, "logout-action");
