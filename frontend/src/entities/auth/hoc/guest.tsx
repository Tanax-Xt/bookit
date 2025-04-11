import { Navigate, RouteSectionProps, useSearchParams } from "@solidjs/router";
import { JSX, Match, Switch } from "solid-js";

import { getAccessTokenExpired } from "@/shared/session";

export const guest = (children: (props: RouteSectionProps) => JSX.Element, fallback: string = "/") => {
  return (props: RouteSectionProps) => {
    const [searchParams] = useSearchParams();
    const redirect = searchParams.redirect;

    return (
      <Switch>
        <Match when={getAccessTokenExpired() === true}>{children(props)}</Match>
        <Match when={getAccessTokenExpired() === false}>
          <Navigate href={typeof redirect === "string" && redirect.startsWith("/") ? redirect : fallback} />
        </Match>
      </Switch>
    );
  };
};
