import * as v from "valibot";

export const NameSchema = v.pipe(
  v.string("Имя должно быть строкой."),
  v.nonEmpty("Имя не должно быть пустым."),
  v.trim(),
);

export const EmailSchema = v.pipe(
  v.string("Пароль должен быть строкой."),
  v.nonEmpty("Почта не должна быть пустой."),
  v.email("Почта неверно отформатирована."),
  v.trim(),
);
