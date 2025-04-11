import * as v from "valibot";

import { EmailSchema } from "@/entities/user";

export const UpdateUserEmailFormSchema = v.object({
  email: EmailSchema,
});

export type UpdateUserEmailFormValues = v.InferInput<typeof UpdateUserEmailFormSchema>;
