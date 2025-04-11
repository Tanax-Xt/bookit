import { tv } from "tailwind-variants";

import { styles as baseStyles } from "../text-field";

const styles = tv({
  extend: baseStyles,
  slots: {
    wrapper: "cursor-pointer",
    item: [
      "flex items-center justify-between gap-1 px-2 py-1.5 outline-none",
      "not-disabled:cursor-pointer not-disabled:data-highlighted:bg-bg-secondary",
      "data-disabled:cursor-not-allowed data-disabled:text-fg-tertiary",
    ],
    content: [
      "z-select overflow-clip outline-none",
      "rounded-lg bg-bg-primary shadow-lg ring ring-bg-secondary outline-none ring-inset",
      "origin-(--kb-select-content-transform-origin)",
      "data-expanded:animate-in data-expanded:fade-in-0% data-expanded:zoom-in-95%",
      "data-closed:animate-out data-closed:fade-out-0% data-closed:zoom-out-95%",
    ],
    listbox: "max-h-56 divide-y divide-bg-secondary overflow-clip overflow-y-auto outline-none",
  },
});

export default styles;
