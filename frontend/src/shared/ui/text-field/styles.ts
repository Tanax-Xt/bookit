import { tv } from "tailwind-variants";

const styles = tv({
  slots: {
    root: "group h-fit w-full",
    label: "mb-1 flex text-start text-sm font-semibold select-none",
    wrapper: "flex w-full overflow-clip transition outline-none",
    input: [
      "flex w-full resize-none text-start leading-normal outline-none",
      "disabled:text-fg-tertiary",
      "disabled:cursor-not-allowed",
      "placeholder:text-fg-tertiary",
      "data-placeholder-shown:text-fg-tertiary",
    ],
    description: "mt-1 flex h-fit text-start text-sm text-fg-tertiary select-none",
    error: "mt-1 flex h-fit text-start text-sm text-fg-destructive select-none",
    before: "flex items-center gap-0.5 self-center",
    after: "flex items-center gap-0.5 self-center",
  },
  variants: {
    required: {
      true: {
        label: "after:ms-1 after:text-fg-destructive after:content-['*']",
      },
    },
    plain: {
      true: {
        root: "w-fit",
      },
      false: {
        input: "p-1.5",
        wrapper: [
          "gap-1 rounded-lg bg-bg-primary",
          "ring ring-bg-secondary",
          "not-disabled:hover:ring-bg-tertiary",
          "not-disabled:has-[input:focus]:ring-bg-accent not-disabled:has-[textarea:focus]:ring-bg-accent",
          "focus-visible:ring-bg-accent data-expanded:!ring-bg-accent data-open:!ring-bg-accent",
        ],
        before: "ms-0.5",
        after: "me-0.5",
      },
    },
  },
});

export default styles;
