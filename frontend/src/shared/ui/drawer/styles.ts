import { tv } from "tailwind-variants";

const styles = tv({
  slots: {
    overlay: [
      "fixed inset-0 z-dialog",
      "data-transitioning:transition-colors data-transitioning:duration-500 data-transitioning:ease-wave",
    ],
    content: [
      "fixed z-dialog flex flex-col outline-none",
      "after:absolute after:bg-inherit",
      "data-transitioning:transition-transform data-transitioning:duration-500 data-transitioning:ease-wave lg:select-none",
    ],
    handle: "-mt-2 mb-2 h-1 w-9 self-center rounded-full bg-bg-secondary",
  },
  variants: {
    side: {
      top: {},
      right: {
        content: [
          "inset-y-0 right-0 w-2xs items-start gap-6",
          "border-e border-bg-primary bg-bg-body px-4 py-6",
          "after:inset-y-0 after:left-[calc(100%-1px)] after:w-1/2",
        ],
      },
      left: {
        content: [
          "inset-y-0 left-0 w-2xs items-start gap-6",
          "border-e border-bg-primary bg-bg-body px-4 py-6",
          "after:inset-y-0 after:right-[calc(100%-1px)] after:w-1/2",
        ],
      },
      bottom: {
        content: [
          "inset-x-0 bottom-0 h-full max-h-11/12",
          "rounded-t-lg border-t border-bg-primary bg-bg-body px-4 py-4",
          "after:inset-x-0 after:top-[calc(100%-1px)] after:h-1/2",
        ],
      },
    },
  },
});

export default styles;
