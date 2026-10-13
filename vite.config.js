import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Default Configuration (HTTP mode)
// For HTTPS mode, use: npm run dev:https
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    esbuildOptions: {
      target: "es2015",
    },
    include: [
      "react-icons/bs",
      "react-icons/fa",
      "react-icons/fa6",
      "react-icons/io5",
      "react-icons/md",
      "react-icons/si",
    ],
  },
  server: {
    host: "0.0.0.0", // Listen on all network interfaces
    port: 5173,
    https: false, // HTTP by default
    hmr: {
      protocol: "ws",
      port: 5173,
    },
  },
  build: {
    // es2019 is the sweet spot: fully supported by all mobile browsers
    // that also support ES modules — avoids extra polyfill weight vs es2015
    // while keeping modern syntax (optional chaining, nullish coalescing, etc.)
    target: ["es2019", "chrome64", "safari12", "firefox67"],
    cssCodeSplit: false,
    // Inline assets <4KB as base64 → fewer mobile round-trips
    assetsInlineLimit: 4096,
    // Provide the modulepreload polyfill so split chunks load on older
    // Android WebView / Safari without hanging
    modulePreload: {
      polyfill: true,
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react-dom")) return "vendor-react";
            if (id.includes("react-router")) return "vendor-react";
            if (id.includes("@tanstack/react-query")) return "vendor-query";
            if (id.includes("i18next") || id.includes("react-i18next"))
              return "vendor-i18n";
            if (id.includes("framer-motion")) return "vendor-motion";
            if (id.includes("react-icons")) return "vendor-icons";
            if (id.includes("lucide-react")) return "vendor-lucide";
            if (id.includes("react-helmet-async")) return "vendor-helmet";
            if (id.includes("axios")) return "vendor-axios";
          }
        },
      },
    },
  },
});
