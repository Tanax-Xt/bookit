import { tv } from "tailwind-variants";

import { styles as baseStyles } from "../text-field";

const styles = tv({
  extend: baseStyles,
  slots: {
    wrapper: "cursor-pointer outline-none",
    content: [
      "outline-none",
      "rounded-lg bg-bg-primary p-1 shadow-lg ring ring-bg-secondary",
      "origin-(--kb-popover-content-transform-origin)",
      "data-expanded:animate-in data-expanded:fade-in-0% data-expanded:zoom-in-95%",
      "data-closed:animate-out data-closed:fade-out-0% data-closed:zoom-out-95%",
    ],
  },
});

export default styles;
