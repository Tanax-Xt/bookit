import { tv } from "tailwind-variants";

const styles = tv({
  slots: {
    item: [
      "min-w-56",
      "flex items-center gap-2 px-2 py-1.5 outline-none",
      "not-disabled:cursor-pointer not-disabled:data-highlighted:bg-bg-secondary",
      "data-disabled:cursor-not-allowed data-disabled:text-fg-tertiary",
    ],
    content: [
      "z-dropdown outline-none",
      "rounded-lg bg-bg-primary shadow-lg ring ring-bg-secondary outline-none ring-inset",
      "overflow-clip",
      "divide-y divide-bg-secondary",
      "origin-(--kb-menu-content-transform-origin)",
      "data-expanded:animate-in data-expanded:fade-in-0% data-expanded:zoom-in-95%",
      "data-closed:animate-out data-closed:fade-out-0% data-closed:zoom-out-95%",
    ],
  },
});

export default styles;
