export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#f2f6ff",
          100: "#e6edff",
          200: "#cddcff",
          300: "#aabff8",
          400: "#8aa2f0",
          500: "#6c8ae4",
          600: "#526fcb",
          700: "#425aa7",
          800: "#364a88",
          900: "#2d3e72"
        },
        accent: {
          50:  "#fff4f7",
          100: "#ffe8ee",
          200: "#ffd1dd",
          300: "#fbb8c9",
          400: "#f79fb5",
          500: "#f18aa6",
          600: "#d66d88",
          700: "#b8576f",
          800: "#964656",
          900: "#7c3946"
        },
        mint:    "#cfe9df",
        peach:   "#ffd8b5",
        lavender:"#e6dcfb",
        sky:     "#cfe6fb",
        ink:     "#1f2937",
        muted:   "#6b7280",
        bg:      "#fafbff",
        surface: "#ffffff",
        border:  "#e5e7eb",
        danger:  "#ef4444",
        success: "#16a34a",
        warning: "#f59e0b",
      },
      borderRadius: { DEFAULT: '0.75rem', lg: '1rem', xl: '1.25rem', '2xl': '1.5rem' },
      boxShadow: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.04)',
        md: '0 4px 10px -2px rgb(0 0 0 / 0.08)',
        lg: '0 10px 20px -5px rgb(0 0 0 / 0.10)'
      },
      fontFamily: { sans: ['Poppins', 'system-ui', 'sans-serif'] }
    }
  },
  plugins: [],
}