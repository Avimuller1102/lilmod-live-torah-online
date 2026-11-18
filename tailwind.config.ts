import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";
import typography from "@tailwindcss/typography";

/**
 * Tailwind CSS Configuration for LILMOD
 * 
 * Custom design tokens for premium Torah education website
 */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // Custom Colors - Jerusalem Gold Theme
      colors: {
        // Primary - Deep Blue (Torah, Trust)
        lilmod: {
          blue: "#2D5DA9",
          gold: "#C4A963",
          navy: "#1A365D",
          "light-blue": "#EBF4FF",
        },
        // Bleu nuit de Jérusalem
        primary: {
          50: "#EEF3FA",
          100: "#D8E3F2",
          200: "#B3C7E3",
          300: "#86A4CD",
          400: "#5A7FB3",
          500: "#3A6198",
          600: "#2B4C7E",
          700: "#1F3A63",
          800: "#172C4D",
          900: "#0F1E36",
          950: "#0A1426",
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // Sable et or de la pierre de Jérusalem (500+ : contraste AA avec le blanc)
        accent: {
          50: "#FBF7EE",
          100: "#F5EBD3",
          200: "#EBD7A8",
          300: "#DFC07A",
          400: "#CFA653",
          500: "#9A722B",
          600: "#7F5D22",
          700: "#6E5020",
          800: "#5C421A",
          900: "#3F2D12",
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        sand: { 50: "#FCFAF6", 100: "#F7F3EC", 200: "#EFE7DA" },
        // UI Colors (shadcn)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },

      // Typography
      fontFamily: {
        display: ["Fraunces", "Georgia", "Cambria", "serif"],
        hebrew: ["\"Frank Ruhl Libre\"", "\"David Libre\"", "serif"],
        body: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        accent: ["Fraunces", "Georgia", "serif"],
      },

      // Font Sizes (Perfect Fourth Scale)
      fontSize: {
        "display-lg": ["4.5rem", { lineHeight: "1.1", letterSpacing: "-0.025em" }],
        "display": ["3.75rem", { lineHeight: "1.15", letterSpacing: "-0.025em" }],
        "display-sm": ["3rem", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
        "heading-lg": ["2.25rem", { lineHeight: "1.25", letterSpacing: "-0.015em" }],
        "heading": ["1.875rem", { lineHeight: "1.3", letterSpacing: "-0.01em" }],
        "heading-sm": ["1.5rem", { lineHeight: "1.35" }],
        "body-lg": ["1.25rem", { lineHeight: "1.6" }],
        "body": ["1rem", { lineHeight: "1.7" }],
        "body-sm": ["0.875rem", { lineHeight: "1.6" }],
      },

      // Spacing (8pt Grid)
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
      },

      // Border Radius
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },

      borderWidth: {
        "3": "3px",
      },

      transitionDuration: {
        "400": "400ms",
        "600": "600ms",
      },

      // Box Shadows
      boxShadow: {
        "gold": "0 4px 14px 0 rgba(196, 169, 99, 0.3)",
        "blue": "0 4px 14px 0 rgba(45, 93, 169, 0.3)",
        "gold-lg": "0 8px 20px -4px rgba(196, 169, 99, 0.4)",
        "blue-lg": "0 8px 20px -4px rgba(45, 93, 169, 0.4)",
        "premium": "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
      },

      // Animations
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-down": {
          from: { opacity: "0", transform: "translateY(-20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "pulse-gold": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(196, 169, 99, 0.7)" },
          "50%": { boxShadow: "0 0 0 10px rgba(196, 169, 99, 0)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "slide-up": "slide-up 0.5s ease-out forwards",
        "slide-down": "slide-down 0.5s ease-out forwards",
        "scale-in": "scale-in 0.3s ease-out forwards",
        "pulse-gold": "pulse-gold 2s infinite",
        "float": "float 3s ease-in-out infinite",
      },

      // Backdrop Blur
      backdropBlur: {
        xs: "2px",
      },

      // Gradients via backgroundImage
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-hero": "linear-gradient(135deg, #1A365D 0%, #2D5DA9 50%, #1E3A5F 100%)",
        "gradient-gold": "linear-gradient(135deg, #C4A963 0%, #B8860B 100%)",
        "gradient-card": "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)",
      },
    },
  },
  plugins: [
    animate,
    typography,
  ],
} satisfies Config;
