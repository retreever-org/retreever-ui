import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Primary brand (from logo background)
        primary: {
          50: "#e5f0ff",
          100: "#cfe2ff",
          200: "#9ec4ff",
          300: "#6ea7ff",
          400: "#3d89ff",
          500: "#1f78ff", // main
          600: "#1760d4",
          700: "#1148a3",
          800: "#0a306f",
          900: "#061b3d",
        },

        // Accent for success / “check” UX
        accent: {
          50: "#f4e9ff", 
          200: "#d7b6ff", 
          400: "#a78bfa", 
          500: "#8b5cf6", 
          700: "#5b21b6", 
          850: "#1a0b29", 
          900: "#14071f", 
          950: "#0d0414", 
        },

        // Neutral surfaces (dark UI)
        surface: {
          50: "#f5f5f5",
          100: "#e5e5e5",
          200: "#d4d4d4",
          300: "#a3a3a3",
          400: "#737373",
          500: "#525252",
          600: "#404040",
          700: "#1C1C1C",
          800: "#202020",
          900: "#0a0a0a",
        },

        // Semantic
        success: "#20d48b",
        info: "#1f78ff",
        warn: "#fbbf24",
        danger: "#ef4444",
      },

      backgroundImage: {
        "gradient-bottom":
          "linear-gradient(to bottom, #1f78ff 0%, #1760d4 40%, #0a306f 100%)",
        "gradient-right":
          "linear-gradient(to right, #1f78ff 0%, #1760d4 40%, #0a306f 100%)",
      },

      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
