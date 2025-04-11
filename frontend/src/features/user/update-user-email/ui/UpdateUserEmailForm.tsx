import { getValue } from "@modular-forms/solid";
import { createMemo } from "solid-js";

import Button from "@/shared/ui/button";
import FormResponse from "@/shared/ui/form-response";
import TextField from "@/shared/ui/text-field";

import { createUpdateUserEmailForm } from "../model/form";

export type UpdateUserEmailFormProps = {
  onCancel?: VoidFunction;
  email: string | undefined;
  user_id: string;
};

export const UpdateUserEmailForm = (props: UpdateUserEmailFormProps) => {
  const email = createMemo(() => props.email);
  const [form, submit, { Form, Field }] = createUpdateUserEmailForm(
    props.user_id,
    email() ? { email: email()! } : undefined,
  );
  const emailChanged = createMemo(() => getValue(form, "email") !== email());

  return (
    <Form onSubmit={submit} class="flex grow flex-col space-y-4">
      <h2 class="text-xl font-semibold">Редактирование почты</h2>

      <Field name="email">
        {(field, props) => (
          <TextField
            {...props}
            type="email"
            label="Почта"
            placeholder="Введите почту…"
            description="Почта используется для верификации пользователей."
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
          disabled={form.invalid || !emailChanged()}
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
