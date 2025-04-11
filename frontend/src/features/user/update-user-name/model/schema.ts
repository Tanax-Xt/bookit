import * as v from "valibot";

import { NameSchema } from "@/entities/user";

export const UpdateUserNameFormSchema = v.object({
  name: NameSchema,
});

export type UpdateUserNameFormValues = v.InferInput<typeof UpdateUserNameFormSchema>;
