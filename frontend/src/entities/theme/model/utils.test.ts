import { DEFAULT_THEME, THEMES } from "../config";
import { isTheme, parseTheme, safeParseTheme } from "./utils";

describe("utils", () => {
  describe("isTheme", () => {
    it("should return true for valid themes", () => {
      for (const theme of THEMES) {
        expect(isTheme(theme)).toBe(true);
      }
    });

    it("should return false for invalid themes", () => {
      expect(isTheme("invalid")).toBe(false);
      expect(isTheme(123)).toBe(false);
      expect(isTheme(null)).toBe(false);
      expect(isTheme(undefined)).toBe(false);
    });
  });

  describe("parseTheme", () => {
    it("should return the theme for valid JSON strings", () => {
      for (const theme of THEMES) {
        expect(parseTheme(JSON.stringify(theme))).toBe(theme);
      }
    });

    it("should return the default theme for invalid JSON strings", () => {
      expect(parseTheme(JSON.stringify("invalid"))).toBe(DEFAULT_THEME);
    });
  });

  describe("safeParseTheme", () => {
    it("should return the theme for valid JSON strings", () => {
      for (const theme of THEMES) {
        expect(safeParseTheme(JSON.stringify(theme))).toBe(theme);
      }
    });

    it("should return the default theme for invalid JSON strings", () => {
      expect(safeParseTheme("invalid")).toBe(DEFAULT_THEME);
      expect(safeParseTheme(JSON.stringify("invalid"))).toBe(DEFAULT_THEME);
    });

    it("should return the default theme for malformed JSON", () => {
      expect(safeParseTheme("{json")).toBe(DEFAULT_THEME);
      expect(safeParseTheme('{ "theme": "invalid-theme"')).toBe(DEFAULT_THEME);
    });
  });
});
