import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import type { Plugin } from "vite";

/**
 * Adresse publique du site.
 * Sur Netlify, `URL` vaut automatiquement le domaine principal du site
 * (lilmod.fr ; repli sur cette adresse si la variable est absente, dès que le
 * domaine sera branché) : rien à modifier dans le code.
 */
const SITE_URL = (process.env.VITE_SITE_URL || process.env.URL || "https://lilmod.fr").replace(/\/$/, "");
process.env.VITE_SITE_URL = SITE_URL;

/** Génère robots.txt avec la bonne adresse (le sitemap est servi dynamiquement par netlify/functions/sitemap.js). */
function seoFiles(): Plugin {
  return {
    name: "lilmod-seo-files",
    apply: "build",
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "robots.txt",
        source: `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
      });
    },
  };
}

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
  },

  // Preview server configuration
  preview: {
    port: 4173,
  },

  // Plugins
  plugins: [react(), seoFiles()],

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
