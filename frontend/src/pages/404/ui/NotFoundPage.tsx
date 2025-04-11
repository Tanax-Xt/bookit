import { A } from "@solidjs/router";

import Button from "@/shared/ui/button";

import IconIcOutlineSignpost from "~icons/ic/outline-signpost";
import IconIcRoundArrowBack from "~icons/ic/round-arrow-back";

const NotFoundPage = () => {
  return (
    <div class="flex flex-col items-center justify-center space-y-4">
      <IconIcOutlineSignpost class="size-24 text-fg-primary" />

      <hgroup class="space-y-2 text-center">
        <h1 class="text-2xl font-semibold">Страница не найдена</h1>
        <p class="text-fg-tertiary">Этой страницы не существует</p>
      </hgroup>

      <Button as={A} href="/" spacing="lg" appearance="accent" before={<IconIcRoundArrowBack class="size-5" />}>
        На главную
      </Button>
    </div>
  );
};

export default NotFoundPage;
