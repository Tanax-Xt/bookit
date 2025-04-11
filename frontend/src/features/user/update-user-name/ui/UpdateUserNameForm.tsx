import { getValue } from "@modular-forms/solid";
import { createMemo } from "solid-js";

import Button from "@/shared/ui/button";
import FormResponse from "@/shared/ui/form-response";
import TextField from "@/shared/ui/text-field";

import { createUpdateUserNameForm } from "../model/form";
import { UpdateUserNameFormValues } from "../model/schema";

export type UpdateUserNameFormProps = {
  onCancel?: VoidFunction;
  initialValues?: UpdateUserNameFormValues;
  name: string | undefined;
  user_id: string;
};

export const UpdateUserNameForm = (props: UpdateUserNameFormProps) => {
  const name = createMemo(() => props.name);
  const [form, submit, { Form, Field }] = createUpdateUserNameForm(
    props.user_id,
    name() ? { name: name()! } : undefined,
  );
  const nameChanged = createMemo(() => getValue(form, "name") !== name());

  return (
    <Form onSubmit={submit} class="flex grow flex-col space-y-4">
      <h2 class="text-xl font-semibold">Редактирование ФИО</h2>

      <Field name="name">
        {(field, props) => (
          <TextField
            {...props}
            label="ФИО"
            placeholder="Введите ФИО…"
            description="ФИО используется для верификации пользователей."
            disabled={form.submitting}
            value={field.value}
            error={field.error}
            clearable
            required
          />
        )}
      </Field>

      <FormResponse of={form} />

      <div class="flex gap-2 max-lg:mt-auto max-lg:flex-col-reverse">
        <Button
          onClick={props.onCancel}
          data-testid="close"
          spacing="lg"
          variant="gray"
          appearance="secondary"
          stretched
        >
          Отмена
        </Button>
        <Button
          type="submit"
          loading={form.submitting}
          disabled={form.invalid || !nameChanged()}
          data-testid="save"
          appearance="accent"
          spacing="lg"
          stretched
        >
          Сохранить
        </Button>
      </div>
    </Form>
  );
};
