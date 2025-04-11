import Button from "@/shared/ui/button";
import FormResponse from "@/shared/ui/form-response";
import TextField from "@/shared/ui/text-field";

import { createUpdateCurrentUserPasswordForm } from "../model/form";

export type UpdateCurrentUserPasswordFormProps = {
  onCancel?: VoidFunction;
};

export const UpdateCurrentUserPasswordForm = (props: UpdateCurrentUserPasswordFormProps) => {
  const [form, submit, { Form, Field }] = createUpdateCurrentUserPasswordForm();

  return (
    <>
      <Form onSubmit={submit} class="flex grow flex-col space-y-4">
        <h2 class="text-xl font-semibold">Редактирование пароля</h2>

        <Field name="password1">
          {(field, props) => (
            <TextField
              {...props}
              type="password"
              label="Новый пароль"
              placeholder="Введите новый пароль…"
              disabled={form.submitting}
              value={field.value}
              error={field.error}
              required
            />
          )}
        </Field>

        <Field name="password2">
          {(field, props) => (
            <TextField
              {...props}
              type="password"
              label="Подтвердите новый пароль"
              placeholder="Введите новый пароль ещё раз…"
              description="Вы можете изменить пароль для своего аккаунта. Это действие не затронет сессии на других устройствах."
              disabled={form.submitting}
              value={field.value}
              error={field.error}
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
            disabled={form.invalid || form.response.status === "error"}
            data-testid="save"
            appearance="accent"
            spacing="lg"
            stretched
          >
            Сохранить
          </Button>
        </div>
      </Form>
    </>
  );
};
