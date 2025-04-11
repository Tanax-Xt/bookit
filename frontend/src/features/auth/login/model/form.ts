import { createForm, FormError, setResponse, SubmitHandler, valiForm } from "@modular-forms/solid";
import { useAction, useSearchParams } from "@solidjs/router";
import { createMemo } from "solid-js";

import { loginAction } from "@/entities/auth";

import { LOGIN_PASSWORD_INCORRECT_STATUS_CODE, LOGIN_USER_NOT_FOUND_STATUS_CODE } from "../config";
import { LoginFormSchema, LoginFormValues } from "./schema";

export const createLoginForm = (initialValues?: LoginFormValues) => {
  const login = useAction(loginAction);
  const [searchParams] = useSearchParams();
  const redirect = createMemo(() => (typeof searchParams.redirect === "string" ? searchParams.redirect : undefined));

  const [form, { Form, Field }] = createForm<LoginFormValues>({
    validate: valiForm(LoginFormSchema),
    initialValues: initialValues,
  });

  const submit: SubmitHandler<LoginFormValues> = async (values) => {
    const { error, status } = await login(values, redirect());

    if (error == null) {
      return;
    }

    switch (status) {
      case LOGIN_USER_NOT_FOUND_STATUS_CODE:
        return setResponse(form, { status: "error", message: "Пользователь не найден." });
      case LOGIN_PASSWORD_INCORRECT_STATUS_CODE:
        return setResponse(form, { status: "error", message: "Неверный пароль." });
      default:
        throw new FormError<LoginFormValues>("Неизвестная ошибка, попробуйте отправить форму повторно.");
    }
  };

  return [form, submit, { Form, Field }] as const;
};
