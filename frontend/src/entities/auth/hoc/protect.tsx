import { createAsync, Navigate, useSearchParams, type RouteSectionProps } from "@solidjs/router";
import { createMemo, JSX, Show, Suspense } from "solid-js";

import { getCurrentUser } from "@/entities/user";
import { RoleEnum } from "@/shared/api/types";
import { getAccessTokenExpired } from "@/shared/session";

export const protect = (
  children: (props: RouteSectionProps) => JSX.Element,
  role: RoleEnum | RoleEnum[] | undefined = undefined,
  skeleton?: JSX.Element,
  fallback: string = "/login",
) => {
  return (props: RouteSectionProps) => {
    const currentUser = createAsync(() => getCurrentUser());
    const redirect = encodeURIComponent(props.location.pathname);
    const [searchParams] = useSearchParams();

    const formattedSearchParams = createMemo(() => {
      const params = new URLSearchParams();
      Object.entries(searchParams).forEach(([key, value]) => typeof value === "string" && params.append(key, value));
      return params.size ? encodeURIComponent(`?${params.toString()}`) : "";
    });

    return (
      <Show
        when={getAccessTokenExpired() === false}
        fallback={<Navigate href={`${fallback}?redirect=${redirect}${formattedSearchParams()}`} />}
      >
        <Suspense fallback={skeleton}>
          <Show when={currentUser()}>
            {(currentUser) => (
              <Show when={role === undefined || currentUser().role === role} fallback={<Navigate href="/" />}>
                {children(props)}
              </Show>
            )}
          </Show>
        </Suspense>
      </Show>
    );
  };
};
