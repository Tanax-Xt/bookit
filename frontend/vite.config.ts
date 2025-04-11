/// <reference types="vitest" />
/// <reference types="vite/client" />

import tailwindcss from "@tailwindcss/vite";
import icons from "unplugin-icons/vite";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import paths from "vite-tsconfig-paths";

import app from "./package.json";

export default defineConfig({
  plugins: [paths(), solid(), icons({ compiler: "solid" }), tailwindcss()],
  test: {
    dir: "src",
    globals: true,
    environment: "jsdom",
    setupFiles: ["node_modules/@testing-library/jest-dom/vitest"],
  },
  server: {
    host: true,
    port: 1984,
  },
  define: {
    "import.meta.env.APP_NAME": JSON.stringify(app.name),
    "import.meta.env.APP_VERSION": JSON.stringify(app.version),
  },
  build: {
    target: "esnext",
  },
});
