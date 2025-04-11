import { createBreakpoints } from "@solid-primitives/media";

export const breakpoints = {
  sm: "40rem",
  md: "48rem",
  lg: "64rem",
  xl: "80rem",
};

export const useBreakpoints = () => {
  return createBreakpoints(breakpoints);
};
