import { createForm, focus, setResponse, SubmitHandler, valiForm } from "@modular-forms/solid";
import { useAction } from "@solidjs/router";

import { updateUserEmailAction } from "@/entities/user";

import { UpdateUserEmailFormSchema, UpdateUserEmailFormValues } from "./schema";

export const createUpdateUserEmailForm = (user_id: string, initialValues?: UpdateUserEmailFormValues) => {
  const updateUserEmail = useAction(updateUserEmailAction);

  const [form, { Form, Field }] = createForm<UpdateUserEmailFormValues>({
    validate: valiForm(UpdateUserEmailFormSchema),
    validateOn: "input",
    initialValues: initialValues,
  });

  const submit: SubmitHandler<UpdateUserEmailFormValues> = async (values) => {
    const { error } = await updateUserEmail(user_id, values.email);

    if (!error) {
      setResponse(form, { status: "success", message: "Почта успешно обновлёна." });
    }

    requestAnimationFrame(() => {
      focus(form, "email");
    });
  };

  return [form, submit, { Form, Field }] as const;
};
