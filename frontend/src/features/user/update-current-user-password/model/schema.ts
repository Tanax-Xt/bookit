import * as v from "valibot";

import { PasswordSchema } from "@/entities/auth";

export const UpdateCurrentUserPasswordFormSchema = v.object({
  password1: PasswordSchema,
  password2: PasswordSchema,
});

export type UpdateCurrentUserPasswordFormValues = v.InferInput<typeof UpdateCurrentUserPasswordFormSchema>;
