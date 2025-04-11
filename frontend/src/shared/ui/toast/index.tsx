import { toast as sonnerToast } from "solid-sonner";
import type { JSX } from "solid-js";

const toast = (children: JSX.Element, style: "positive" | "destructive") =>
  sonnerToast.custom(
    () =>
      (() => (
        <div
          class="relative flex w-full min-w-80 items-center gap-1 rounded-xl border border-bg-secondary p-4 text-light shadow-xl"
          classList={{
            "bg-bg-positive": style === "positive",
            "bg-bg-destructive": style === "destructive",
          }}
        >
          {children}
        </div>
      )) as unknown as JSX.Element,
  );

export default toast;
