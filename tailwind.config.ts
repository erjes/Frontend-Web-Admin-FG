import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
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
      colors: {
        gov: {
          canvas: "#F2F7FF",
          navyDeep: "#0B192C",
          primary: "#1E5BB8",
          primaryHover: "#174A96",
          primaryActive: "#123B78",
          cyanAccent: "#00D2FF",
          glassBg: "rgba(255, 255, 255, 0.72)",
          glassBorder: "rgba(226, 232, 240, 0.8)",
          cardBorder: "rgba(30, 91, 184, 0.12)",
        },
        lumatrix: {
          canvas: "#F2F7FF",
          navyDeep: "#0B192C",
          primary: "#1E5BB8",
          primaryHover: "#174A96",
          primaryActive: "#123B78",
          cyanAccent: "#00D2FF",
          glassBg: "rgba(255, 255, 255, 0.72)",
          glassBorder: "rgba(226, 232, 240, 0.8)",
          cardBorder: "rgba(30, 91, 184, 0.12)",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
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
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
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
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
