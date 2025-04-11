import * as v from "valibot";

import { PasswordSchema, UsernameSchema } from "@/entities/auth";

export const LoginFormSchema = v.object({
  username: UsernameSchema,
  password: PasswordSchema,
});

export type LoginFormValues = v.InferInput<typeof LoginFormSchema>;
