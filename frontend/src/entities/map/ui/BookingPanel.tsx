import { createEffect, Show } from "solid-js";

import { CurrentUserResponse, PlaceAvailableResponse } from "@/shared/api/types";
import { useBreakpoints } from "@/shared/lib/breakpoints";
import Dialog from "@/shared/ui/dialog";
import Drawer from "@/shared/ui/drawer";

import { BookingPanelForm } from "./BookingPanelForm";

type BookingPanelProps = {
  day: Date;
  time: [number, number];
  activeId?: string;
  user?: CurrentUserResponse;
  place?: PlaceAvailableResponse;
  error?: string;
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  onContentPresentChange?: (present: boolean) => void;
  onSubmit: VoidFunction;
};

export const BookingPanel = (props: BookingPanelProps) => {
  const breakpoints = useBreakpoints();

  return (
    <Show
      when={!breakpoints.lg}
      fallback={
        <Dialog open={props.open} onOpenChange={props.onOpenChange}>
          {(dialog) => {
            createEffect(() => {
              props.onContentPresentChange?.(dialog.contentPresent);
            });

            return (
              <Dialog.Content>
                <BookingPanelForm
                  day={props.day}
                  time={props.time}
                  activeId={props.activeId}
                  user={props.user}
                  place={props.place}
                  onCancel={() => props.onOpenChange?.(false)}
                  error={props.error}
                  onSubmit={props.onSubmit}
                />
              </Dialog.Content>
            );
          }}
        </Dialog>
      }
    >
      <Drawer
        side="bottom"
        open={props.open}
        onOpenChange={props.onOpenChange}
        onContentPresentChange={props.onContentPresentChange}
      >
        <Drawer.Content>
          <BookingPanelForm
            day={props.day}
            time={props.time}
            activeId={props.activeId}
            user={props.user}
            place={props.place}
            onCancel={() => props.onOpenChange?.(false)}
            error={props.error}
            onSubmit={props.onSubmit}
          />
        </Drawer.Content>
      </Drawer>
    </Show>
  );
};
