import { createAsync } from "@solidjs/router";
import { Component, Show } from "solid-js";

import { getCurrentUser } from "@/entities/user";
import TextField from "@/shared/ui/text-field";
import { Navigation } from "@/widgets/nav";
import { UserList } from "@/widgets/user";

import { UsersPageSkeleton } from "./UsersPageSkeleton";
import { createUserList } from "../model/list";

import IconIcRoundSearch from "~icons/ic/round-search";

const UsersPage: Component = () => {
  const state = createUserList();
  const currentUser = createAsync(() => getCurrentUser());

  return (
    <section class="space-y-4">
      <Navigation label="Пользователи" />

      <TextField
        placeholder="Поиск"
        onInput={(event) => state.debounceSetSearchValue(event.currentTarget.value)}
        before={<IconIcRoundSearch class="ms-1 -me-1.5 size-5 text-fg-tertiary" />}
      />

      <Show when={state.store.users.length || state.searchValue()} fallback={<UsersPageSkeleton />}>
        <UserList users={state.store.users.filter((user) => user.id !== currentUser()?.id)} />
      </Show>
    </section>
  );
};

export default UsersPage;
