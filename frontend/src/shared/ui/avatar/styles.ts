import { tv } from "tailwind-variants";

const styles = tv({
  slots: {
    root: "inline-flex size-6 items-center justify-center overflow-clip rounded-full ring ring-bg-tertiary ring-inset",
    img: "size-full",
    fallback:
      "flex size-full items-center justify-center bg-gradient-to-t leading-none font-medium text-light select-none",
  },
  variants: {
    appearance: {
      red: {
        fallback: "from-red-600 to-red-400",
      },
      orange: {
        fallback: "from-orange-600 to-orange-400",
      },
      amber: {
        fallback: "from-amber-600 to-amber-400",
      },
      yellow: {
        fallback: "from-yellow-600 to-yellow-400",
      },
      lime: {
        fallback: "from-lime-600 to-lime-400",
      },
      green: {
        fallback: "from-green-600 to-green-400",
      },
      emerald: {
        fallback: "from-emerald-600 to-emerald-400",
      },
      teal: {
        fallback: "from-teal-600 to-teal-400",
      },
      cyan: {
        fallback: "from-cyan-600 to-cyan-400",
      },
      sky: {
        fallback: "from-sky-600 to-sky-400",
      },
      blue: {
        fallback: "from-blue-600 to-blue-400",
      },
      indigo: {
        fallback: "from-indigo-600 to-indigo-400",
      },
      violet: {
        fallback: "from-violet-600 to-violet-400",
      },
      purple: {
        fallback: "from-purple-600 to-purple-400",
      },
      fuchsia: {
        fallback: "from-fuchsia-600 to-fuchsia-400",
      },
      pink: {
        fallback: "from-pink-600 to-pink-400",
      },
      rose: {
        fallback: "from-rose-600 to-rose-400",
      },
      slate: {
        fallback: "from-slate-600 to-slate-400",
      },
      gray: {
        fallback: "from-gray-600 to-gray-400",
      },
      zinc: {
        fallback: "from-zinc-600 to-zinc-400",
      },
      neutral: {
        fallback: "from-neutral-600 to-neutral-400",
      },
      stone: {
        fallback: "from-stone-600 to-stone-400",
      },
    },
  },
  defaultVariants: {
    appearance: "gray",
  },
});

export default styles;
