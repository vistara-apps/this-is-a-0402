/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "hsl(252, 78%, 60%)",
        secondary: "hsl(142, 76%, 36%)",
        accent: "hsl(38, 92%, 58%)",
        success: "hsl(142, 76%, 36%)",
        warning: "hsl(38, 92%, 58%)",
        error: "hsl(0, 73%, 51%)",
        background: "hsl(210, 20%, 98%)",
        surface: "hsl(0, 0%, 100%)",
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "20px",
        xl: "32px",
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "16px",
      },
      boxShadow: {
        card: "0 8px 24px hsla(210,20%,50%,0.12)",
        popover: "0 16px 48px hsla(210,20%,50%,0.16)",
      },
      animation: {
        "fade-in": "fadeIn 0.25s ease-in-out",
        "slide-up": "slideUp 0.4s cubic-bezier(0.22,1,0.36,1)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
}