import { Component, Show } from "solid-js";

import { UserUsernameCell } from "@/entities/user";
import { useBreakpoints } from "@/shared/lib/breakpoints";
import Dialog from "@/shared/ui/dialog";
import Drawer from "@/shared/ui/drawer";

import { UpdateCurrentUserUsernameForm } from "./UpdateCurrentUserUsernameForm";

export type UpdateCurrentUserUsernameCellProps = {
  username: string;
};

export const UpdateCurrentUserUsernameCell: Component<UpdateCurrentUserUsernameCellProps> = (props) => {
  const breakpoints = useBreakpoints();

  return (
    <Show
      when={!breakpoints.lg}
      fallback={
        <Dialog>
          {(dialog) => (
            <>
              <UserUsernameCell as={Dialog.Trigger} username={props.username} data-testid="update-username" clickable />
              <Dialog.Content>
                <UpdateCurrentUserUsernameForm onCancel={() => dialog.setOpen(false)} username={props.username} />
              </Dialog.Content>
            </>
          )}
        </Dialog>
      }
    >
      <Drawer side="bottom">
        {(drawer) => (
          <>
            <UserUsernameCell as={Drawer.Trigger} username={props.username} data-testid="update-username" clickable />
            <Drawer.Content>
              <UpdateCurrentUserUsernameForm onCancel={() => drawer.setOpen(false)} username={props.username} />
            </Drawer.Content>
          </>
        )}
      </Drawer>
    </Show>
  );
};
