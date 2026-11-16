import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import type { Plugin } from "vite";

/**
 * Adresse publique du site.
 * Sur Netlify, `URL` vaut automatiquement le domaine principal du site
 * (graceful-blancmange-8e4e41.netlify.app aujourd'hui, lilmod.fr dès que le
 * domaine sera branché) : rien à modifier dans le code.
 */
const SITE_URL = (process.env.VITE_SITE_URL || process.env.URL || "https://graceful-blancmange-8e4e41.netlify.app").replace(/\/$/, "");
process.env.VITE_SITE_URL = SITE_URL;

/** Génère robots.txt et sitemap.xml avec la bonne adresse. */
function seoFiles(): Plugin {
  return {
    name: "lilmod-seo-files",
    apply: "build",
    generateBundle() {
      const today = new Date().toISOString().slice(0, 10);
      this.emitFile({
        type: "asset",
        fileName: "robots.txt",
        source: `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
      });
      this.emitFile({
        type: "asset",
        fileName: "sitemap.xml",
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${SITE_URL}/</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>\n`,
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
