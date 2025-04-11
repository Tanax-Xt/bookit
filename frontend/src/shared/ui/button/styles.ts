import { tv } from "tailwind-variants";

const styles = tv({
  base: [
    "inline-flex items-center font-medium outline-none select-none",
    "not-disabled:cursor-pointer",
    "disabled:cursor-not-allowed disabled:opacity-25",
    "aria-busy:cursor-wait",
    "transition active:transition-none",
  ],
  variants: {
    size: {
      sm: "text-sm leading-tight",
      md: "text-base leading-tight",
      lg: "text-lg leading-tight",
    },
    align: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
    },
    shape: {
      circle: "rounded-full",
      rounded: "rounded-lg",
    },
    spacing: {
      0: "gap-0 p-0",
      xs: "gap-1.5 px-1.5 py-1.5",
      sm: "gap-1.5 px-2 py-2",
      md: "gap-1.5 px-3 py-2",
      lg: "gap-1.5 px-3.5 py-2.5",
    },
    stretched: {
      true: "w-full",
      false: "w-fit",
    },
    appearance: {
      inverse: "",
      primary: "",
      secondary: "",
      tertiary: "",
      accent: "",
      positive: "",
      destructive: "",
      feature: "",
    },
    variant: {
      fill: [
        "not-disabled:hover:opacity-75 not-disabled:active:opacity-50",
        "aria-[current]:opacity-75 data-expanded:opacity-75 data-open:opacity-75",
        "focus-visible:opacity-75",
      ],
      gray: [
        "bg-bg-primary not-disabled:hover:bg-bg-secondary not-disabled:active:bg-bg-secondary not-disabled:active:opacity-75",
        "aria-[current]:bg-bg-secondary data-expanded:bg-bg-secondary data-open:bg-bg-secondary",
        "focus-visible:bg-bg-secondary",
      ],
      ghost: [
        "not-disabled:hover:bg-bg-primary not-disabled:active:bg-bg-primary not-disabled:active:opacity-75",
        "aria-[current]:bg-bg-primary data-expanded:bg-bg-primary data-open:bg-bg-primary",
        "focus-visible:bg-bg-primary",
      ],
    },
    shimmer: {
      true: [
        "relative isolate !overflow-hidden",
        "before:absolute before:inset-0 before:w-full before:-translate-x-full",
        "not-disabled:before:animate-shimmer",
        "before:border-t before:border-light/25",
        "before:bg-gradient-to-r before:from-transparent before:via-light/50 before:to-transparent",
        "motion-reduce:before:animate-none",
      ],
    },
  },
  compoundVariants: [
    {
      variant: "fill",
      appearance: "inverse",
      class: "bg-bg-inverse text-fg-inverse",
    },
    {
      variant: "fill",
      appearance: "primary",
      class: "bg-bg-primary text-fg-body",
    },
    {
      variant: "fill",
      appearance: "secondary",
      class: "bg-bg-secondary text-fg-body",
    },
    {
      variant: "fill",
      appearance: "tertiary",
      class: "bg-bg-tertiary text-fg-body",
    },
    {
      variant: "fill",
      appearance: "accent",
      class: "bg-bg-accent text-light",
    },
    {
      variant: "fill",
      appearance: "positive",
      class: "bg-bg-positive text-light",
    },
    {
      variant: "fill",
      appearance: "destructive",
      class: "bg-bg-destructive text-light",
    },
    {
      variant: "fill",
      appearance: "feature",
      class: "bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-light",
    },
    {
      variant: "gray",
      appearance: "inverse",
      class: "text-fg-inverse",
    },
    {
      variant: "gray",
      appearance: "primary",
      class: "text-fg-primary",
    },
    {
      variant: "gray",
      appearance: "secondary",
      class: "text-fg-secondary",
    },
    {
      variant: "gray",
      appearance: "tertiary",
      class: "text-fg-tertiary",
    },
    {
      variant: "gray",
      appearance: "accent",
      class: "text-fg-accent",
    },
    {
      variant: "gray",
      appearance: "positive",
      class: "text-fg-positive",
    },
    {
      variant: "gray",
      appearance: "destructive",
      class: "text-fg-destructive",
    },
    {
      variant: "ghost",
      appearance: "inverse",
      class: "text-fg-inverse",
    },
    {
      variant: "ghost",
      appearance: "primary",
      class: "text-fg-primary",
    },
    {
      variant: "ghost",
      appearance: "secondary",
      class: "text-fg-secondary",
    },
    {
      variant: "ghost",
      appearance: "tertiary",
      class: "text-fg-tertiary",
    },
    {
      variant: "ghost",
      appearance: "accent",
      class: "text-fg-accent",
    },
    {
      variant: "ghost",
      appearance: "positive",
      class: "text-fg-positive",
    },
    {
      variant: "ghost",
      appearance: "destructive",
      class: "text-fg-destructive",
    },
  ],
  defaultVariants: {
    size: "md",
    align: "center",
    shape: "rounded",
    spacing: "md",
    variant: "fill",
    stretched: false,
    appearance: "primary",
  },
});

export default styles;
