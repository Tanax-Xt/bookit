import { A } from "@solidjs/router";
import { Component, Show } from "solid-js";
import { tv } from "tailwind-variants";

import { UserResponse } from "@/shared/api/types";
import Avatar from "@/shared/ui/avatar";

import { getRoleDisplayName } from "../model/i18n";

import IconLogosTelegram from "~icons/logos/telegram";

const styles = tv({
  slots: {
    badge: "test-xs -mx-1 ms-1 mb-1 flex items-center gap-1 rounded-lg px-1 font-medium",
  },
  variants: {
    role: {
      admin: {
        badge: "bg-amber-600/15 text-amber-600 ring ring-amber-600",
      },
      guest: {
        badge: "bg-emerald-600/15 text-emerald-600 ring ring-emerald-600",
      },
      student: {
        badge: "bg-sky-600/15 text-sky-600 ring ring-sky-600",
      },
    },
  },
});

export const UserCard: Component<{ user: UserResponse }> = (props) => {
  return (
    <div class="py-2">
      <div class="relative flex transform items-center justify-between rounded-xl p-4 transition hover:bg-bg-primary">
        <div class="flex grow items-center justify-between gap-2">
          <Avatar alt={props.user.username} class="size-12 shrink-0 text-xl" />
          <div class="flex grow flex-col items-start justify-center">
            <div class="flex items-center gap-1">
              <A
                href={`/users/${props.user.id}`}
                class="text-lg font-semibold after:absolute after:inset-0"
                draggable={false}
              >
                {props.user.name ?? props.user.username}
              </A>
              <Show when={props.user.telegram_id}>
                <IconLogosTelegram class="size-5 shrink-0" />
              </Show>
            </div>
            <span class="text-fg-tertiary">{props.user.email ?? "– –"}</span>
          </div>
          <div class={styles().badge({ role: props.user.role })}>{getRoleDisplayName(props.user.role)}</div>
        </div>
      </div>
    </div>
  );
};
