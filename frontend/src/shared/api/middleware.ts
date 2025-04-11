import { Middleware } from "openapi-fetch";

import { getAccessToken } from "@/shared/session";

export const AUTH_MIDDLEWARE: Middleware = {
  onRequest: async ({ request }) => {
    const token = getAccessToken();

    if (token && Date.parse(token.expires_at) > Date.now()) {
      request.headers.set("Authorization", `${token.token_type} ${token.access_token}`);
    }

    return request;
  },
};
