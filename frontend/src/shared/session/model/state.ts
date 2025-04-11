import { makePersisted, PersistenceOptions } from "@solid-primitives/storage";
import { createSignal } from "solid-js";

import { AccessTokenResponse } from "@/shared/api/types";

import { SESSION_LOCAL_STORAGE_KEY } from "../config";

export const SESSION_PERSISTENCE_OPTIONS: PersistenceOptions<AccessTokenResponse | undefined, undefined> = {
  name: SESSION_LOCAL_STORAGE_KEY,
  serialize: (data) => btoa(JSON.stringify(data)),
  deserialize: (data) => (data ? JSON.parse(atob(data)) : undefined),
};

export const [getAccessToken, setAccessToken] = makePersisted(
  createSignal<AccessTokenResponse>(),
  SESSION_PERSISTENCE_OPTIONS,
);

export const getAccessTokenExpirationDate = () => {
  const token = getAccessToken();
  return token ? Date.parse(token.expires_at) : undefined;
};

export const getAccessTokenExpirationTimeout = () => {
  const expirationDate = getAccessTokenExpirationDate();
  const expiresAfterMs = expirationDate ? expirationDate - Date.now() : 0;
  return expiresAfterMs > 0 ? expiresAfterMs : false;
};

export const getAccessTokenExpired = () => {
  const expirationDate = getAccessTokenExpirationDate();
  return expirationDate === undefined || expirationDate <= Date.now();
};
