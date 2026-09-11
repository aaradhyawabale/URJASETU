/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Light Municipal Design Tokens
        "app-bg": "#f8fafc",
        "surface": "#ffffff",
        "surface-subtle": "#f1f5f9",
        "surface-container": "#ffffff",
        "border-subtle": "#e2e8f0",
        "border-strong": "#cbd5e1",
        "text-primary": "#0f172a",
        "text-secondary": "#475569",
        "text-muted": "#94a3b8",
        
        // Brand Primary (Emerald Green)
        "primary": "#059669",
        "primary-container": "#ecfdf5",
        "on-primary": "#ffffff",
        "on-primary-container": "#065f46",

        // Secondary (Sky Blue / Slate Accent)
        "secondary": "#0284c7",
        "secondary-container": "#e0f2fe",
        "on-secondary": "#ffffff",

        // Status Indicators
        "status-recommended": "#059669",
        "status-recommended-bg": "#ecfdf5",
        "status-recommended-border": "#a7f3d0",

        "status-review": "#d97706",
        "status-review-bg": "#fffbeb",
        "status-review-border": "#fde68a",

        "status-disqualified": "#dc2626",
        "status-disqualified-bg": "#fef2f2",
        "status-disqualified-border": "#fecaca",

        "status-screening": "#64748b",
        "status-screening-bg": "#f8fafc",
        "status-screening-border": "#e2e8f0",

        // Map Specific Colors
        "map-waterway": "#bae6fd",
        "map-arterial": "#94a3b8",
        "map-parcel-fill": "#f1f5f9",
        "map-parcel-stroke": "#cbd5e1",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)",
        panel: "0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)",
      }
    },
  },
  plugins: [],
}
