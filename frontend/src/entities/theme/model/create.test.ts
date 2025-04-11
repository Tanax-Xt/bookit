import { renderHook } from "@solidjs/testing-library";
import { vi } from "vitest";

import { THEME_LOCAL_STORAGE_KEY } from "../config";
import { createTheme } from "./create";
import { Theme } from "./types";

describe("createTheme", () => {
  const mockPrefersDark = (prefersDark = false) => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: prefersDark,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
  };

  describe("when localStorage has no theme set", () => {
    it("should default to 'auto' theme and set document theme to 'light' when prefersDark is false", () => {
      mockPrefersDark(false);

      const { result } = renderHook(createTheme);

      expect(result.value).toBe("auto" satisfies Theme);
      expect(result.preferred).toBe("light" satisfies Theme);
      expect(document.documentElement.dataset.theme).toBe("light" satisfies Theme);
    });

    it("should default to 'auto' theme and set document theme to 'dark' when prefersDark is true", () => {
      mockPrefersDark(true);

      const { result } = renderHook(createTheme);

      expect(result.value).toBe("auto" satisfies Theme);
      expect(result.preferred).toBe("dark" satisfies Theme);
      expect(document.documentElement.dataset.theme).toBe("dark" satisfies Theme);
    });
  });

  describe("when localStorage has a theme set", () => {
    afterEach(() => {
      localStorage.clear();
    });

    it("should apply the 'light' theme from localStorage", () => {
      localStorage.setItem(THEME_LOCAL_STORAGE_KEY, JSON.stringify("light" satisfies Theme));

      const { result } = renderHook(createTheme);

      expect(result.value).toBe("light" satisfies Theme);
      expect(result.preferred).toBe("light" satisfies Theme);
      expect(document.documentElement.dataset.theme).toBe("light" satisfies Theme);
    });

    it("should apply the 'dark' theme from localStorage", () => {
      localStorage.setItem(THEME_LOCAL_STORAGE_KEY, JSON.stringify("dark" satisfies Theme));

      const { result } = renderHook(createTheme);

      expect(result.value).toBe("dark" satisfies Theme);
      expect(result.preferred).toBe("dark" satisfies Theme);
      expect(document.documentElement.dataset.theme).toBe("dark" satisfies Theme);
    });

    it("should use 'auto' theme from localStorage and set document theme to 'light' with light preference", () => {
      mockPrefersDark(false);
      localStorage.setItem(THEME_LOCAL_STORAGE_KEY, JSON.stringify("auto" satisfies Theme));

      const { result } = renderHook(createTheme);

      expect(result.value).toBe("auto" satisfies Theme);
      expect(result.preferred).toBe("light" satisfies Theme);
      expect(document.documentElement.dataset.theme).toBe("light" satisfies Theme);
    });

    it("should use 'auto' theme from localStorage and set document theme to 'dark' with dark preference", () => {
      mockPrefersDark(true);
      localStorage.setItem(THEME_LOCAL_STORAGE_KEY, JSON.stringify("auto" satisfies Theme));

      const { result } = renderHook(createTheme);

      expect(result.value).toBe("auto" satisfies Theme);
      expect(result.preferred).toBe("dark" satisfies Theme);
      expect(document.documentElement.dataset.theme).toBe("dark" satisfies Theme);
    });

    it("should revert to 'auto' theme when an invalid theme is stored in localStorage", () => {
      localStorage.setItem(THEME_LOCAL_STORAGE_KEY, JSON.stringify("invalid"));

      const { result } = renderHook(createTheme);

      expect(result.value).toBe("auto" satisfies Theme);
    });
  });

  describe("interactions", () => {
    afterEach(() => {
      localStorage.clear();
    });

    it("should update the theme to 'light' when the theme is manually set to 'light'", async () => {
      localStorage.setItem(THEME_LOCAL_STORAGE_KEY, JSON.stringify("auto" satisfies Theme));

      const { result } = renderHook(createTheme);

      result.setValue("light");

      expect(result.value).toBe("light" satisfies Theme);
      expect(result.preferred).toBe("light" satisfies Theme);
      expect(document.documentElement.dataset.theme).toBe("light" satisfies Theme);
    });

    it("should update the theme to 'dark' when the theme is manually set to 'dark'", async () => {
      localStorage.setItem(THEME_LOCAL_STORAGE_KEY, JSON.stringify("auto" satisfies Theme));

      const { result } = renderHook(createTheme);

      result.setValue("dark");

      expect(result.value).toBe("dark" satisfies Theme);
      expect(result.preferred).toBe("dark" satisfies Theme);
      expect(document.documentElement.dataset.theme).toBe("dark" satisfies Theme);
    });

    it("should switch to 'auto' theme and set document theme to 'light' when the theme is set to 'auto' with light preference", async () => {
      mockPrefersDark(false);
      localStorage.setItem(THEME_LOCAL_STORAGE_KEY, JSON.stringify("dark" satisfies Theme));

      const { result } = renderHook(createTheme);

      result.setValue("auto");

      expect(result.value).toBe("auto" satisfies Theme);
      expect(result.preferred).toBe("light" satisfies Theme);
      expect(document.documentElement.dataset.theme).toBe("light" satisfies Theme);
    });

    it("should switch to 'auto' theme and set document theme to 'dark' when the theme is set to 'auto' with dark preference", async () => {
      mockPrefersDark(true);
      localStorage.setItem(THEME_LOCAL_STORAGE_KEY, JSON.stringify("light" satisfies Theme));

      const { result } = renderHook(createTheme);

      result.setValue("auto");

      expect(result.value).toBe("auto" satisfies Theme);
      expect(result.preferred).toBe("dark" satisfies Theme);
      expect(document.documentElement.dataset.theme).toBe("dark" satisfies Theme);
    });
  });
});
