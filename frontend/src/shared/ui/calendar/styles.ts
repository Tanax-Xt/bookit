import { tv } from "tailwind-variants";

const styles = tv({
  slots: {
    label: "flex grow gap-1 px-1 font-semibold capitalize",
    header: "flex items-center justify-between gap-0.5",
    table: "mt-3",
    thead: "flex",
    tbody: "flex flex-col gap-0.5",
    headcell: "w-8 flex-1 pb-1 text-sm font-normal text-fg-secondary",
    celltrigger: "size-8 text-sm data-selected:!bg-bg-accent data-selected:!text-light data-today:bg-bg-tertiary",
    tr: "flex gap-0.5",
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
