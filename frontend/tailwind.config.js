/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: "tw-",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "sans-serif",
        ],
      },
      colors: {
        calendar: {
          primary: "#3b82f6",
          secondary: "#64748b",
          today: "#ef4444",
          event: {
            blue: "#3b82f6",
            green: "#10b981",
            purple: "#8b5cf6",
            orange: "#f59e0b",
            red: "#ef4444",
            pink: "#ec4899",
          },
        },
        ceylona: {
          dark: "#0f172a",
          darker: "#020617",
          navy: "#1e3a8a",
          slate: "#1e293b",
          muted: "#334155",
        },
      },
      animation: {
        "dropdown-in":
          "dropdownFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "spin-slow": "spin 3s linear infinite",
      },
      keyframes: {
        dropdownFadeIn: {
          "0%": { opacity: "0", transform: "scale(0.95) translateY(-5px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      backdropBlur: {
        20: "20px",
        25: "25px",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      maxWidth: {
        container: "1320px",
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
