import { getValue } from "@modular-forms/solid";
import { createMemo } from "solid-js";

import Button from "@/shared/ui/button";
import FormResponse from "@/shared/ui/form-response";
import TextField from "@/shared/ui/text-field";

import { createUpdateCurrentUserUsernameForm } from "../model/form";

export type UpdateCurrentUserUsernameFormProps = {
  onCancel?: VoidFunction;
  username: string;
};

export const UpdateCurrentUserUsernameForm = (props: UpdateCurrentUserUsernameFormProps) => {
  const username = createMemo(() => props.username);
  const [form, submit, { Form, Field }] = createUpdateCurrentUserUsernameForm({ username: username() });
  const usernameChanged = createMemo(() => getValue(form, "username") !== username());

  return (
    <Form onSubmit={submit} class="flex grow flex-col space-y-4">
      <h2 class="text-xl font-semibold">Редактирование имени</h2>

      <Field name="username">
        {(field, props) => (
          <TextField
            {...props}
            type="text"
            label="Имя пользователя"
            placeholder="Введите имя пользователя…"
            description="Вы можете выбрать публичное имя пользователя. Это имя должно быть уникальным."
            autocomplete="username"
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
          disabled={form.invalid || !usernameChanged()}
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
