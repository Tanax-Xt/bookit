import { A } from "@solidjs/router";
import { Component } from "solid-js";

import { FastLogin } from "@/entities/auth";
import Button from "@/shared/ui/button";
import FormResponse from "@/shared/ui/form-response";
import TextField from "@/shared/ui/text-field";

import { createLoginForm } from "../model/form";

export const LoginForm: Component = () => {
  const [form, submit, { Form, Field }] = createLoginForm();

  return (
    <Form onSubmit={submit} class="w-full space-y-4">
      <Field name="username">
        {(field, props) => (
          <TextField
            {...props}
            type="text"
            label="Имя пользователя"
            placeholder="Введите имя пользователя…"
            autocomplete="username"
            value={field.value}
            error={field.error}
            autofocus
            required
          />
        )}
      </Field>

      <Field name="password">
        {(field, props) => (
          <TextField
            {...props}
            type="password"
            label="Пароль"
            placeholder="Введите пароль…"
            value={field.value}
            error={field.error}
            required
          />
        )}
      </Field>

      <FormResponse of={form} />

      <div class="space-y-2">
        <Button type="submit" appearance="accent" loading={form.submitting} disabled={form.invalid} stretched>
          Войти
        </Button>

        <FastLogin />

        <Button as={A} href="/register" appearance="accent" variant="ghost" disabled={form.submitting} stretched>
          К форме регистрации
        </Button>
      </div>
    </Form>
  );
};
