import { Component, For } from "solid-js";

import { UserCard } from "@/entities/user";
import { UserResponse } from "@/shared/api/types";

interface UserListProps {
  users: UserResponse[] | null | undefined;
}

export const UserList: Component<UserListProps> = (props) => {
  return (
    <div class="divide-y divide-bg-primary">
      <For each={props.users} fallback={"Пользователей не найдено"}>
        {(user) => <UserCard user={user} />}
      </For>
    </div>
  );
};
