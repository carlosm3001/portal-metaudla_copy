/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Colores base usando variables CSS
        primary: "var(--brand-primary)",
        leaf: "var(--brand-leaf)",
        lima: "var(--brand-lima)",
        river: "var(--brand-river)",
        
        // Colores funcionales
        bg: "var(--brand-bg)",
        card: "var(--brand-card)",
        text: "var(--brand-text)",
        muted: "var(--brand-muted)",

        // Colores existentes que pueden ser mapeados o eliminados si no se usan
        // Mantengo algunos para evitar romper componentes existentes que no se refactoricen
        brand: {
          50:  "#eef2ff", // Ejemplo de mapeo a un tono de índigo si se mantiene
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81"
        },
        indigo: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81"
        },
        slate: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a"
        },
        danger:  "#ef4444",
        success: "#16a34a",
        warning: "#f59e0b",
      },
      ringColor: {
        DEFAULT: "var(--ring)",
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
