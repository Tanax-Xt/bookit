import { createForm, focus, setError, setResponse, SubmitHandler, valiForm } from "@modular-forms/solid";
import { useAction } from "@solidjs/router";

import { updateCurrentUserUsernameAction } from "@/entities/user";

import { UpdateCurrentUserUsernameFormSchema, UpdateCurrentUserUsernameFormValues } from "./schema";

export const createUpdateCurrentUserUsernameForm = (initialValues?: UpdateCurrentUserUsernameFormValues) => {
  const updateCurrentUserUsername = useAction(updateCurrentUserUsernameAction);

  const [form, { Form, Field }] = createForm<UpdateCurrentUserUsernameFormValues>({
    validate: valiForm(UpdateCurrentUserUsernameFormSchema),
    validateOn: "input",
    initialValues: initialValues,
  });

  const submit: SubmitHandler<UpdateCurrentUserUsernameFormValues> = async (values) => {
    const { error } = await updateCurrentUserUsername(values.username);

    if (error) {
      setError(form, "username", "Это имя пользователя уже занятно.");
    } else {
      setResponse(form, { status: "success", message: "Имя пользователя успешно обновлёно." });
    }

    requestAnimationFrame(() => {
      focus(form, "username");
    });
  };

  return [form, submit, { Form, Field }] as const;
};
