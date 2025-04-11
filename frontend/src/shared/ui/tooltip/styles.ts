import { tv } from "tailwind-variants";

const styles = tv({
  slots: {
    content: [
      "z-50",
      "rounded-md bg-bg-primary px-1 py-0.5 text-sm text-fg-secondary shadow-md ring ring-bg-secondary",
      "origin-(--kb-tooltip-content-transform-origin)",
      "data-expanded:animate-in data-expanded:fade-in-0% data-expanded:zoom-in-95%",
      "data-closed:animate-out data-closed:fade-out-0% data-closed:zoom-out-95%",
    ],
  },
});

export default styles;
