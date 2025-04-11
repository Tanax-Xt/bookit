import * as v from "valibot";

import { PasswordSchema, UsernameSchema } from "@/entities/auth";

export const RegisterFormSchema = v.object({
  username: UsernameSchema,
  password: PasswordSchema,
});

export type RegisterFormValues = v.InferInput<typeof RegisterFormSchema>;
