import { createForm, focus, setResponse, SubmitHandler, valiForm } from "@modular-forms/solid";
import { useAction } from "@solidjs/router";

import { updateUserNameAction } from "@/entities/user";

import { UpdateUserNameFormSchema, UpdateUserNameFormValues } from "./schema";

export const createUpdateUserNameForm = (user_id: string, initialValues?: UpdateUserNameFormValues) => {
  const updateUserName = useAction(updateUserNameAction);

  const [form, { Form, Field }] = createForm<UpdateUserNameFormValues>({
    validate: valiForm(UpdateUserNameFormSchema),
    validateOn: "input",
    initialValues: initialValues,
  });

  const submit: SubmitHandler<UpdateUserNameFormValues> = async (values) => {
    const { error } = await updateUserName(user_id, values.name);

    if (!error) {
      setResponse(form, { status: "success", message: "ФИО успешно обновлёно." });
    }

    requestAnimationFrame(() => {
      focus(form, "name");
    });
  };

  return [form, submit, { Form, Field }] as const;
};
