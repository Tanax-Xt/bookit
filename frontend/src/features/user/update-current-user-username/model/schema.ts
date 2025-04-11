import * as v from "valibot";

import { UsernameSchema } from "@/entities/auth";

export const UpdateCurrentUserUsernameFormSchema = v.object({
  username: UsernameSchema,
});

export type UpdateCurrentUserUsernameFormValues = v.InferInput<typeof UpdateCurrentUserUsernameFormSchema>;
