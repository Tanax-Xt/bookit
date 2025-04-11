import { tv } from "tailwind-variants";

const styles = tv({
  slots: {
    overlay: [
      "fixed inset-0 z-dialog bg-black/50",
      "data-open:animate-in data-open:fade-in-0%",
      "data-closed:animate-out data-closed:fade-out-0%",
    ],
    content: [
      "fixed top-1/2 left-1/2 z-dialog -translate-x-1/2 -translate-y-1/2 outline-none",
      "flex max-h-dvh w-full flex-col space-y-4 overflow-x-hidden overflow-y-auto max-lg:max-w-xs lg:max-w-sm",
      "rounded-2xl bg-bg-body p-6 shadow-2xl ring ring-bg-primary ring-inset",
      "data-open:animate-in data-open:fade-in-0% data-open:zoom-in-95%",
      "data-closed:animate-out data-closed:fade-out-0% data-closed:zoom-out-95%",
    ],
    header: ["flex items-center justify-between"],
    label: ["text-xl font-semibold tracking-tight"],
    description: ["leading-tight text-fg-secondary"],
    footer: ["flex flex-row justify-end gap-2"],
  },
});

export default styles;
