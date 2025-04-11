import { Component, Show } from "solid-js";

import { UserPasswordCell } from "@/entities/user";
import { useBreakpoints } from "@/shared/lib/breakpoints";
import Dialog from "@/shared/ui/dialog";
import Drawer from "@/shared/ui/drawer";

import { UpdateCurrentUserPasswordForm } from "./UpdateCurrentUserPasswordForm";

export const UpdateCurrentUserPasswordCell: Component = () => {
  const breakpoints = useBreakpoints();

  return (
    <Show
      when={!breakpoints.lg}
      fallback={
        <Dialog>
          {(dialog) => (
            <>
              <UserPasswordCell as={Dialog.Trigger} data-testid="update-password" clickable />
              <Dialog.Content>
                <UpdateCurrentUserPasswordForm onCancel={() => dialog.setOpen(false)} />
              </Dialog.Content>
            </>
          )}
        </Dialog>
      }
    >
      <Drawer side="bottom">
        {(drawer) => (
          <>
            <UserPasswordCell as={Drawer.Trigger} data-testid="update-password" clickable />
            <Drawer.Content>
              <UpdateCurrentUserPasswordForm onCancel={() => drawer.setOpen(false)} />
            </Drawer.Content>
          </>
        )}
      </Drawer>
    </Show>
  );
};
