import { tv, VariantProps } from "tailwind-variants";

const styles = tv({
  slots: {
    root: ["w-full space-y-1.5"],
    label: ["flex h-fit text-lg font-semibold"],
    content: ["group/group overflow-hidden", "w-full rounded-lg", "ring-1", "transition-[background-color,box-shadow]"],
    description: ["flex h-fit text-sm text-fg-tertiary"],
  },
  variants: {
    divide: {
      true: {
        content: "divide-y",
      },
    },
    appearance: {
      body: {
        content: "divide-bg-primary bg-bg-body ring-bg-primary",
      },
      primary: {
        content: "divide-bg-secondary bg-bg-primary ring-bg-secondary",
      },
    },
  },
  defaultVariants: {
    divide: true,
    appearance: "primary",
  },
});

export type GroupVariantProps = VariantProps<typeof styles>;

export default styles;
