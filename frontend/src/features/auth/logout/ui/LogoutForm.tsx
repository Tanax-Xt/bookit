import { useAction, useSubmission } from "@solidjs/router";
import { Component, ComponentProps } from "solid-js";

import { logoutAction } from "@/entities/auth";
import Button from "@/shared/ui/button";
import Dialog from "@/shared/ui/dialog";

import IconIcRoundLogout from "~icons/ic/round-logout";

export type LogoutFormProps = ComponentProps<typeof Button>;

export const LogoutForm: Component<LogoutFormProps> = (props) => {
  const logout = useAction(logoutAction);
  const submission = useSubmission(logoutAction);

  return (
    <Dialog>
      <Button
        as={Dialog.Trigger}
        loading={submission.pending}
        spacing="lg"
        variant="gray"
        appearance="destructive"
        data-testid="logout"
        stretched
        before={<IconIcRoundLogout class="size-5" />}
        {...props}
      >
        Выйти из аккаунта
      </Button>

      <Dialog.Content>
        <Dialog.Label>Вы действительно хотите выйти?</Dialog.Label>

        <Dialog.Description>Это действие не затронет сессии на других устройствах.</Dialog.Description>

        <Dialog.Footer>
          <Button as={Dialog.Close} spacing="lg" variant="gray" appearance="secondary" data-testid="cancel" stretched>
            Отмена
          </Button>
          <Button
            spacing="lg"
            variant="gray"
            appearance="destructive"
            loading={submission.pending}
            onClick={async () => await logout()}
            data-testid="confirm"
            stretched
          >
            Выйти
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};
