import { createAsync } from "@solidjs/router";
import { createMemo, createSelector, createSignal, For, Setter, Show } from "solid-js";

import { getCurrentUser } from "@/entities/user";
import { PlaceAvailableResponse } from "@/shared/api/types";

import { PageType } from "../types";
import { AdminPanel } from "./AdminPanel";
import { BookingPanel } from "./BookingPanel";
import { Place } from "./Place";

type MapProps = {
  day: Date;
  time: [number, number];
  activeId: string | undefined;
  places: PlaceAvailableResponse[];
  pageType: PageType;
  error: string | undefined;
  setError: Setter<string | undefined>;
  onSubmit: VoidFunction;
  onChange: (id: string | undefined) => void;
};

export const Map = (props: MapProps) => {
  const [bookDialogOpen, setBookDialogOpen] = createSignal(false);
  const [adminPanelOpen, setAdminPanelOpen] = createSignal(false);
  const selectedPlace = createMemo(() => props.places.find((item) => item.id === props.activeId));

  const user = createAsync(() => getCurrentUser());

  const isActive = createSelector(() => props.activeId);

  const initHammer = () => {
    // @ts-ignore
    const el: HTMLDivElement | null = document.querySelector("#map");
    let mc;
    try {
      // @ts-ignore
      mc = new Hammer(el, {
        domEvents: true,
      });
    } catch (e) {
      setTimeout(initHammer, 50);
      return;
    }

    const wrapper = document.querySelector("#wrapper");

    let cS = 1;
    let lS = 1;
    let cX = 0;
    let lX = 0;
    let cY = 0;
    let lY = 0;
    let W = wrapper?.getBoundingClientRect().width || 0;
    let H = wrapper?.getBoundingClientRect().height || 0;

    const okX = (x: number, S: number): boolean => {
      const xmax = (-1 * (1000 - 1000 * S)) / 2 / S;
      const w = 1000 * S;
      const d = (1000 - 1000 * S) / 2;
      const xmin = W - w - d - d;
      return xmin <= x && x <= xmax;
    };

    const okY = (y: number, S: number): boolean => {
      const ymax = (-1 * (1000 - 1000 * S)) / 2 / S;
      const h = 1000 * S;
      const d = (1000 - 1000 * S) / 2;
      const ymin = H - h - d - d;
      return ymin <= y && y <= ymax;
    };

    const getX = (x: number): number => {
      const xmax = (-1 * (1000 - 1000 * cS)) / 2 / cS;
      const w = 1000 * cS;
      const d = (1000 - 1000 * cS) / 2;
      const xmin = W - w - d - d;
      return Math.min(xmax, Math.max(xmin, x));
    };

    const getY = (y: number): number => {
      const ymax = (-1 * (1000 - 1000 * cS)) / 2 / cS;
      const h = 1000 * cS;
      const d = (1000 - 1000 * cS) / 2;
      const ymin = H - h - d - d;
      return Math.min(ymax, Math.max(ymin, y));
    };

    const updateStyle = (x: number, y: number, s: number) => {
      if (el) {
        el.style.transform = "scale(" + s + ") translate(" + x + "px," + y + "px)";
      }
    };

    mc.get("pinch").set({ enable: true });
    mc.on("pinchstart", () => mc.off("pan"));
    // @ts-ignore
    mc.on("pinch", (ev) => {
      const S = cS * ev.scale;
      if (!okX(cX, S)) return;
      if (!okY(cY, S)) return;
      lS = S;
      updateStyle(cX, cY, S);
    });
    mc.on("pinchend", () => {
      cS = lS;
      updateStyle(cX, cY, cS);
      setTimeout(hammerPan, 50);
    });

    // @ts-ignore
    const hammerPan = () => {
      // @ts-ignore
      mc.on("pan", (ev) => {
        lX = getX(ev.deltaX / cS + cX);
        lY = getY(ev.deltaY / cS + cY);

        updateStyle(lX, lY, cS);
      });
    };

    hammerPan();
    mc.on("panend", () => {
      cX = lX;
      cY = lY;
      updateStyle(cX, cY, cS);
    });
  };

  setTimeout(initHammer, 10);

  return (
    <div
      class="scrollbar-none cursor-move overflow-hidden rounded-lg border"
      classList={{
        "max-h-[calc(100dvh-72px-365px)] lg:max-h-[calc(100dvh-16px-365px)]": props.pageType === "preview",
        "max-h-[calc(100dvh-72px-133px-96px)] lg:max-h-[calc(100dvh-133px-48px-64px)]": props.pageType === "edit",
        "max-h-[calc(100dvh-72px-133px-32px)] lg:max-h-[calc(100dvh-133px-48px)]":
          props.pageType !== "preview" && props.pageType !== "edit",
      }}
      id="wrapper"
    >
      <Show when={props.pageType !== "admin-static-view" && props.pageType !== "edit"}>
        <BookingPanel
          day={props.day}
          time={props.time}
          activeId={props.activeId}
          user={user()}
          place={selectedPlace()}
          error={props.error}
          open={bookDialogOpen()}
          onOpenChange={setBookDialogOpen}
          onContentPresentChange={(present) => !present && props.setError(undefined)}
          onSubmit={props.onSubmit}
        />
      </Show>
      <Show when={props.pageType === "admin-static-view"}>
        <AdminPanel
          open={adminPanelOpen()}
          setOpen={setAdminPanelOpen}
          resetActivePlace={() => props.onChange(undefined)}
          selectedPlace={selectedPlace()}
          day={props.day}
        />
      </Show>
      <div
        class="relative mx-auto h-[1000px] w-[1000px] rounded-lg ring ring-bg-secondary ring-inset"
        style={{
          "background-image": 'url("/map.svg")',
          "background-size": "contain",
        }}
        id="map"
      >
        <For each={props.places}>
          {(item) => (
            <Place
              onClick={(place) => {
                if (props.pageType === "admin-static-view") {
                  setAdminPanelOpen(true);
                } else {
                  setBookDialogOpen(true);
                }
                props.onChange(place?.id);
              }}
              place={item}
              isActive={isActive(item.id)}
              role={user()?.role || "guest"}
              pageType={props.pageType}
            />
          )}
        </For>
      </div>
    </div>
  );
};
