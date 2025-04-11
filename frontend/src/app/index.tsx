/* @refresh reload */
import "./styles/index.css";

import { I18nProvider } from "@kobalte/core/i18n";
import { Route, Router } from "@solidjs/router";
import { lazy, Suspense } from "solid-js";
import { render } from "solid-js/web";
import { Toaster } from "solid-sonner";

import { guest, protect } from "@/entities/auth";
import { ThemeProvider } from "@/entities/theme";
import { AccountPageSkeleton } from "@/pages/account/ui/AccountPageSkeleton";

const root = document.getElementById("root");

if (!(root instanceof HTMLElement)) {
  throw new Error("The root element is missing.");
}

render(
  () => (
    <I18nProvider locale="ru">
      <ThemeProvider>
        <Router base={import.meta.env.BASE_URL} root={(props) => <Suspense>{props.children}</Suspense>}>
          <Route component={lazy(() => import("@/app/layouts/bare"))}>
            <Route path="*404" component={lazy(() => import("@/pages/404"))} />
            <Route path="/login" component={guest(lazy(() => import("@/pages/login")))} />
            <Route path="/register" component={guest(lazy(() => import("@/pages/register")))} />
          </Route>
          <Route component={lazy(() => import("@/app/layouts/sidenav"))}>
            <Route path="/" component={protect(lazy(() => import("@/pages/home")))} />
            <Route path="/settings" component={lazy(() => import("@/pages/settings"))} />
            <Route
              path="/account"
              component={protect(
                lazy(() => import("@/pages/account")),
                undefined,
                <AccountPageSkeleton />,
              )}
            />
            <Route path="/reservations" component={protect(lazy(() => import("@/pages/reservations")))} />
            <Route path="/reservations/:id" component={protect(lazy(() => import("@/pages/preview")))} />
            <Route path="/reservations/:id/edit" component={protect(lazy(() => import("@/pages/edit")))} />
            <Route path="/qr" component={protect(lazy(() => import("@/pages/qr")))} />
            <Route
              path="/start"
              component={protect(
                lazy(() => import("@/pages/start")),
                "admin",
              )}
            />
            <Route
              path="/users"
              component={protect(
                lazy(() => import("@/pages/users")),
                "admin",
              )}
            />
            <Route
              path="/users/:id"
              component={protect(
                lazy(() => import("@/pages/user-detail")),
                "admin",
              )}
            />
            <Route
              path="/stats"
              component={protect(
                lazy(() => import("@/pages/stats")),
                "admin",
              )}
            />
          </Route>
        </Router>
        {/* @ts-expect-error use the themme from the document element instead of the toaster */}
        <Toaster theme="" />
      </ThemeProvider>
    </I18nProvider>
  ),
  root,
);
