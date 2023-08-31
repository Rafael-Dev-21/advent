import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { viteVConsole } from "vite-plugin-vconsole";
import { VitePWA } from "vite-plugin-pwa";
import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode, ssrBuild }) => {
  let config = {
    base: "./",
    plugins: [
      vue(),
       VitePWA({
         registerType: "autoUpdate",
         injectRegister: "auto",
         workbox: {
           globPatterns: ["**/*.{js,css,html,ico,png,svg,json,vue,txt,woff2,abc}"],
           cleanupOutdatedCaches: true,
         },
         manifest: {
           name: "Adventure",
           short_name: "Adventure",
           icons: [
             {
               src: "android-chrome-192x192.png",
               sizes: "192x192",
               type: "image/png"
             },
             {
               src: "android-chrome-512x512.png",
               sizes: "512x512",
               type: "image/png"
             }
           ],
           theme_color: "#ffffff",
           background_color: "#ffffff",
           display: "standalone"
         }
       }),
    ],
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
