import { Component, Show } from "solid-js";

import { UserNameCell } from "@/entities/user";
import { useBreakpoints } from "@/shared/lib/breakpoints";
import Dialog from "@/shared/ui/dialog";
import Drawer from "@/shared/ui/drawer";

import { UpdateUserNameForm } from "./UpdateUserNameForm";

export type UpdateUserNameCellProps = {
  name?: string | undefined | null;
  user_id: string;
};

export const UpdateUserNameCell: Component<UpdateUserNameCellProps> = (props) => {
  const breakpoints = useBreakpoints();

  return (
    <Show
      when={!breakpoints.lg}
      fallback={
        <Dialog>
          {(dialog) => (
            <>
              <UserNameCell as={Dialog.Trigger} name={props.name} clickable />
              <Dialog.Content>
                <UpdateUserNameForm
                  onCancel={() => dialog.setOpen(false)}
                  name={props.name ?? undefined}
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
            <UserNameCell as={Drawer.Trigger} name={props.name} clickable />
            <Drawer.Content>
              <UpdateUserNameForm
                onCancel={() => drawer.setOpen(false)}
                name={props.name ?? undefined}
                user_id={props.user_id}
              />
            </Drawer.Content>
          </>
        )}
      </Drawer>
    </Show>
  );
};
