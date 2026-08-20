import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { nitro } from "nitro/vite";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    tanstackStart({
      server: { entry: "src/server.ts" },
      preset: "vercel",
    }),
    nitro(),
    tailwindcss(),
    react(),
  ],
});
