import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

/**
 * Vite Configuration for LILMOD Website
 * 
 * Clean configuration without any Lovable dependencies.
 * Optimized for production with proper aliases and build settings.
 */
export default defineConfig({
  // Development server configuration
  server: {
    host: "localhost",
    port: 3000,
    open: true,
  },

  // Preview server configuration
  preview: {
    port: 4173,
  },

  // Plugins
  plugins: [react()],

  // Path aliases for clean imports
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".mjs", ".json"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@lib": path.resolve(__dirname, "./src/lib"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@assets": path.resolve(__dirname, "./src/assets"),
    },
  },

  // Build optimization
  build: {
    // Output directory
    outDir: "dist",
    
    // Generate sourcemaps for debugging
    sourcemap: false,
    
    // Minification
    minify: "esbuild",
    
    // Chunk size warning limit (500kb)
    chunkSizeWarningLimit: 500,
    
    // Rollup options for code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          "react-vendor": ["react", "react-dom"],
          "ui-vendor": ["lucide-react"],
        },
      },
    },
  },

  // CSS configuration
  css: {
    devSourcemap: true,
  },
});
