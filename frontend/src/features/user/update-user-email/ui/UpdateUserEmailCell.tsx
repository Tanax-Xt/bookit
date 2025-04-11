import { Component, Show } from "solid-js";

import { UserEmailCell } from "@/entities/user";
import { useBreakpoints } from "@/shared/lib/breakpoints";
import Dialog from "@/shared/ui/dialog";
import Drawer from "@/shared/ui/drawer";

import { UpdateUserEmailForm } from "./UpdateUserEmailForm";

export type UpdateUserEmailCellProps = {
  email?: string | undefined | null;
  user_id: string;
};

export const UpdateUserEmailCell: Component<UpdateUserEmailCellProps> = (props) => {
  const breakpoints = useBreakpoints();

  return (
    <Show
      when={!breakpoints.lg}
      fallback={
        <Dialog>
          {(dialog) => (
            <>
              <UserEmailCell as={Dialog.Trigger} email={props.email} clickable />
              <Dialog.Content>
                <UpdateUserEmailForm
                  onCancel={() => dialog.setOpen(false)}
                  email={props.email ?? undefined}
                  user_id={props.user_id}
                />
              </Dialog.Content>
            </>
          )}
        </Dialog>
      }
    >
      <Drawer side="bottom">
        {(drawer) => (
          <>
            <UserEmailCell as={Drawer.Trigger} email={props.email} clickable />
            <Drawer.Content>
              <UpdateUserEmailForm
                onCancel={() => drawer.setOpen(false)}
                email={props.email ?? undefined}
                user_id={props.user_id}
              />
            </Drawer.Content>
          </>
        )}
      </Drawer>
    </Show>
  );
};
