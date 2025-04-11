import { ResponseStatus } from "@modular-forms/solid";
import { tv } from "tailwind-variants";

const styles = tv({
  base: "text-sm",
  variants: {
    status: {
      info: "text-fg-accent",
      error: "text-fg-destructive",
      success: "text-fg-positive",
    } satisfies { [key in ResponseStatus]: unknown },
  },
});

export default styles;
