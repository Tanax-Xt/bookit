import { createForm, FormError, setError, SubmitHandler, valiForm } from "@modular-forms/solid";
import { useAction } from "@solidjs/router";

import { registerAction } from "@/entities/auth";

import { REGISTER_USERNAME_ALREADY_EXISTS_STATUS_CODE } from "../config";
import { RegisterFormSchema, RegisterFormValues } from "./schema";

export const createRegisterForm = (initialValues?: RegisterFormValues) => {
  const register = useAction(registerAction);

  const [form, { Form, Field }] = createForm<RegisterFormValues>({
    validate: valiForm(RegisterFormSchema),
    initialValues: initialValues,
  });

  const submit: SubmitHandler<RegisterFormValues> = async (values) => {
    // @ts-expect-error нужно убрать на бекенде
    const { error, status } = await register(values);

    if (error == null) {
      return;
    }

    switch (status) {
      case REGISTER_USERNAME_ALREADY_EXISTS_STATUS_CODE:
        return setError(form, "username", "Такое имя пользователя уже зарегистрировано.");
      default:
        throw new FormError<RegisterFormValues>("Неизвестная ошибка, попробуйте отправить форму повторно.");
    }
  };

  return [form, submit, { Form, Field }] as const;
};
