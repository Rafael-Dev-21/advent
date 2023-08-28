import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { viteVConsole } from "vite-plugin-vconsole";
import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode, ssrBuild }) => {
  let config = {
    plugins: [vue()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  };

  if (command === "serve") {
    config.plugins.push(
      viteVConsole({
        entry: [path.resolve("src/main.ts")], // entry for each page, different from the above
        enabled: true,
        config: {
          maxLogNumber: 1000,
          theme: "dark",
        },
      })
    );
  }

  return config;
});
