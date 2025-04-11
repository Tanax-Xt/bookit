import * as v from "valibot";

import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_PATTERN,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_PATTERN,
} from "../config";

export const UsernameSchema = v.pipe(
  v.string("Имя пользователя должно быть строкой."),
  v.nonEmpty("Имя пользователя не может быть пустым."),
  v.minLength(USERNAME_MIN_LENGTH, `Имя пользователя должно содержать минимум ${USERNAME_MIN_LENGTH} символов.`),
  v.maxLength(USERNAME_MAX_LENGTH, `Имя пользователя должно содержать максимум ${USERNAME_MAX_LENGTH} символов.`),
  v.regex(USERNAME_PATTERN, "Имя пользователя должно содержать только a-z, A-Z, 0-9 и _."),
  v.trim(),
);

export const PasswordSchema = v.pipe(
  v.string("Пароль должен быть строкой."),
  v.nonEmpty("Пароль не может быть пустым."),
  v.minLength(PASSWORD_MIN_LENGTH, `Пароль должен содержать минимум ${PASSWORD_MIN_LENGTH} символов.`),
  v.maxLength(PASSWORD_MAX_LENGTH, `Пароль должен содержать максимум ${PASSWORD_MAX_LENGTH} символов.`),
  v.regex(PASSWORD_PATTERN, "Пароль должен содержать только a-z, A-Z, 0-9, и !@#$%^&*."),
  v.trim(),
);
