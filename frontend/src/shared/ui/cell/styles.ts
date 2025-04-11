import { tv, VariantProps } from "tailwind-variants";

const styles = tv({
  slots: {
    root: ["group/cell gap-3", "flex w-full items-center justify-center px-3 py-2.5"],
    label: ["leading-none"],
    description: ["flex h-fit text-sm text-fg-tertiary"],
    value: ["flex h-fit text-right text-fg-tertiary transition select-all"],
    chevron: ["text-fg-tertiary", "-mx-2 size-6"],
    group: ["grow text-start"],
  },
  variants: {
    clickable: {
      true: {
        root: [
          "cursor-pointer transition-[border-color,background-color,opacity] outline-none select-none active:duration-0",
          "hover:bg-bg-secondary/50 focus-visible:bg-bg-secondary/50 active:bg-bg-secondary/75",
          "aria-busy:cursor-progress data-checked:cursor-default",
          "disabled:cursor-default data-disabled:cursor-not-allowed",
          "disabled:opacity-50 data-disabled:opacity-50",
        ],
      },
    },
  },
});

export type CellVariantProps = VariantProps<typeof styles>;

export default styles;
