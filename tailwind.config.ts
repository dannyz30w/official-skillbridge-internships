import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      fontFamily: {
        display: ["'Merriweather'", "serif"],
        body: ["'Manrope'", "sans-serif"],
        heading: ["'Manrope'", "system-ui", "sans-serif"],
        sans: ["'Manrope'", "system-ui", "-apple-system", "sans-serif"],
        ui: ["'Manrope'", "system-ui", "sans-serif"],
      },
      fontSize: {
        'display': ['56px', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'h1': ['40px', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'h2': ['32px', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'h3': ['24px', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'h4': ['20px', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'body': ['16px', { lineHeight: '1.65' }],
        'small': ['14px', { lineHeight: '1.65' }],
        'caption': ['12px', { lineHeight: '1.4', letterSpacing: '0.03em' }],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        success: { DEFAULT: "hsl(var(--success))", foreground: "hsl(var(--success-foreground))" },
        warning: { DEFAULT: "hsl(var(--warning))", foreground: "hsl(var(--warning-foreground))" },
      },
      borderRadius: {
        "2xl": "20px",
        xl: "14px",
        lg: "12px",
        md: "8px",
        sm: "6px",
        pill: "100px",
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
