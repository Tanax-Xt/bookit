import { A } from "@solidjs/router";
import { Component, Show } from "solid-js";

import { BookingResponse, RoleEnum } from "@/shared/api/types";
import { formatTime } from "@/shared/lib/date";
import Avatar from "@/shared/ui/avatar";

import { ReservationMoreDropdown } from "./ReservationMoreDropdown";

import IconIcRoundCheckCircleOutline from "~icons/ic/round-check-circle-outline";

export type ReservationCardProps = {
  booking: BookingResponse;
  role?: RoleEnum;
};

export const ReservationCard: Component<ReservationCardProps> = (props) => {
  return (
    <div class="py-2">
      <div class="relative flex transform items-center justify-between rounded-xl p-4 transition hover:bg-bg-primary">
        <div class="flex grow flex-col items-start justify-center">
          <Show
            when={props.role !== "admin"}
            fallback={
              <div class="flex grow items-center justify-center gap-1">
                <Avatar alt={props.booking.user.username} class="size-6 text-xs" />
                <span class="font-semibold">{props.booking.user.username}</span>
                <Show when={props.booking.is_activated_by_user}>
                  <IconIcRoundCheckCircleOutline class="size-5 text-fg-positive" />
                </Show>
              </div>
            }
          >
            <div class="flex items-center gap-1">
              <A
                href={`/reservations/${props.booking.id}`}
                class="text-lg font-semibold after:absolute after:inset-0"
                draggable={false}
              >
                {props.booking.place.name}
              </A>
              <Show when={props.booking.is_activated_by_user}>
                <div class="test-xs -mx-1 ms-1 mb-1 flex items-center gap-1 rounded-full bg-bg-positive/15 px-1 text-fg-positive ring ring-bg-positive">
                  посещено
                </div>
              </Show>
            </div>
          </Show>
          <span class="text-fg-secondary">
            {formatTime(props.booking.start_second)} – {formatTime(props.booking.end_second)}
          </span>
        </div>
        <ReservationMoreDropdown booking={props.booking} class="z-1" />
      </div>
    </div>
  );
};
