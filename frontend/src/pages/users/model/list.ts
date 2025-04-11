import { debounce } from "@solid-primitives/scheduled";
import { createEffect, createSignal } from "solid-js";
import { createStore } from "solid-js/store";

import { getUsers } from "@/entities/user";
import { UserResponse } from "@/shared/api/types";

type Store = {
  users: UserResponse[];
};

const SEARCH_DEBOUNCE_TIMEOUT = 300;

export const createUserList = () => {
  const [store, setStore] = createStore<Store>({ users: [] });
  const [searchValue, setSearchValue] = createSignal<string>("");
  const debounceSetSearchValue = debounce(setSearchValue, SEARCH_DEBOUNCE_TIMEOUT);

  createEffect(async () => {
    const users = await getUsers({ q: searchValue() });
    setStore({ users: users ?? [] });
  });

  return { store, searchValue, debounceSetSearchValue };
};
