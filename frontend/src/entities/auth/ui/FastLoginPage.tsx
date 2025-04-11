import { useAction, useSearchParams } from "@solidjs/router";
import { createMemo } from "solid-js";

import Button from "@/shared/ui/button";

import { loginAction } from "../api/actions";

const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "H@rdP8ssw0rd",
};

const GUEST_CREDENTIALS = {
  username: "guest",
  password: "H@rdP8ssw0rd",
};

const STUDENT_CREDENTIALS = {
  username: "student",
  password: "H@rdP8ssw0rd",
};

export const FastLogin = () => {
  const login = useAction(loginAction);
  const [searchParams] = useSearchParams();
  const redirect = createMemo(() => (typeof searchParams.redirect === "string" ? searchParams.redirect : undefined));

  return (
    <div class="flex w-full flex-col gap-1">
      <Button appearance="positive" stretched onClick={() => login(GUEST_CREDENTIALS, redirect())}>
        Войти как гость
      </Button>
      <Button appearance="positive" stretched onClick={() => login(STUDENT_CREDENTIALS, redirect())}>
        Войти как сотрудник
      </Button>
      <Button appearance="positive" stretched onClick={() => login(ADMIN_CREDENTIALS, redirect())}>
        Войти как админ
      </Button>
    </div>
  );
};
