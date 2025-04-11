import { Close } from "@corvu/dialog";
import { Component } from "solid-js";

import Button from "../button";

import IconIcRoundClear from "~icons/ic/round-clear";

export const DialogDismiss: Component = () => {
  return (
    <Button as={Close} aria-label="Закрыть" spacing="xs" appearance="tertiary" shape="circle" variant="ghost">
      <IconIcRoundClear class="size-6" />
    </Button>
  );
};

export default DialogDismiss;
