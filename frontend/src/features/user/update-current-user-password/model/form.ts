import { clearResponse, createForm, focus, getValue, setResponse, SubmitHandler, valiForm } from "@modular-forms/solid";
import { useAction } from "@solidjs/router";
import { createEffect, createMemo } from "solid-js";

import { updateCurrentUserPasswordAction } from "@/entities/user";

import { UpdateCurrentUserPasswordFormValues, UpdateCurrentUserPasswordFormSchema } from "./schema";

export const createUpdateCurrentUserPasswordForm = (initialValues?: UpdateCurrentUserPasswordFormValues) => {
  const updateCurrentUserPassword = useAction(updateCurrentUserPasswordAction);

  const [form, { Form, Field }] = createForm<UpdateCurrentUserPasswordFormValues>({
    validate: valiForm(UpdateCurrentUserPasswordFormSchema),
    validateOn: "input",
    initialValues: initialValues,
  });

  const mismatch = createMemo(() => getValue(form, "password1") !== getValue(form, "password2"));

  const submit: SubmitHandler<UpdateCurrentUserPasswordFormValues> = async (values) => {
    const { error } = await updateCurrentUserPassword(values.password1);

    if (error) {
      setResponse(form, { status: "error", message: "Что-то пошло не так. Попробуйте снова." });
    } else {
      setResponse(form, { status: "success", message: "Пароль успешно обновлён." });
    }

    requestAnimationFrame(() => {
      focus(form, "password1");
    });
  };

  createEffect(() => {
    if (mismatch()) {
      setResponse(form, { status: "error", message: "Введённые пароли не совпадают." });
    } else {
      clearResponse(form);
    }
  });

  return [form, submit, { Form, Field }] as const;
};
