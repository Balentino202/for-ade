import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import path from "node:path";
import { defineConfig } from "vite";

// Vite config for the Softgem React template.
// - `@` → `src` for consistent imports across the codebase (also mirror
//   this in tsconfig.app.json `paths`).
// - Tailwind CSS v4 is wired via its official Vite plugin — no separate
//   PostCSS or tailwind.config file required.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    strictPort: false,
  },
});
