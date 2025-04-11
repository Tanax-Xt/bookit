import { A } from "@solidjs/router";

import { UserResponse } from "@/shared/api/types";
import Button from "@/shared/ui/button";

import IconIcRoundArrowBack from "~icons/ic/round-arrow-back";
import IconIcRoundCheckCircleOutline from "~icons/ic/round-check-circle-outline";

export const BookingActivatedScreen = (props: { user: UserResponse }) => {
  return (
    <div class="flex grow flex-col items-center justify-center space-y-4">
      <IconIcRoundCheckCircleOutline class="size-24 text-fg-positive" />

      <hgroup class="space-y-2 text-center">
        <h1 class="text-2xl font-semibold">Бронь успешно активирована!</h1>
        <p class="text-fg-tertiary">Вы подтвердили присутствие {props.user.username} на месте.</p>
      </hgroup>

      <Button as={A} href="/" spacing="lg" appearance="accent" before={<IconIcRoundArrowBack class="size-5" />}>
        На главную
      </Button>
    </div>
  );
};
