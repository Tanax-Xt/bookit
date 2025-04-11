import { tv } from "tailwind-variants";

export const styles = tv({
  base: [
    "relative isolate h-4 cursor-wait overflow-hidden rounded",
    "before:absolute before:inset-0 before:w-full before:-translate-x-full",
    "before:animate-shimmer",
    "before:border-t before:border-bg-tertiary/25",
    "before:bg-gradient-to-r before:from-transparent before:via-bg-tertiary/75 before:to-transparent",
    "motion-reduce:before:animate-none",
  ],
  variants: {
    opacity: {
      25: "bg-bg-secondary/25",
      50: "bg-bg-secondary/50",
      75: "bg-bg-secondary/75",
    },
  },
  defaultVariants: {
    opacity: 50,
  },
});

export default styles;
