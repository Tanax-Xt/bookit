import { renderHook } from "@solidjs/testing-library";
import { assert, vi } from "vitest";

import { useTheme } from "./context";
import { ThemeProvider } from "../ui/ThemeProvider";

describe("useTheme", () => {
  const mockMatchMedia = () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
  };

  it("should not throw if used within a <ThemeProvider> component", () => {
    mockMatchMedia();

    assert.doesNotThrow(() => renderHook(useTheme, { wrapper: ThemeProvider }));
  });

  it("should throw if used outside of a <ThemeProvider> component", () => {
    mockMatchMedia();

    assert.throws(() => renderHook(useTheme));
  });
});
