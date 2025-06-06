import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      screens: {
        xs: "480px",
      },
      container: {
        center: true,
        padding: ".5rem",
      },
      fontFamily: {
        body: ["Roboto", "sans-serif"],
        heading: ["Nunito", "sans-serif"],
        nioicon: ["Nioicon"],
        sans: ["Outfit", ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        xxs: "11px",
      },
      lineHeight: {
        tighter: "1.1",
        3.5: "0.875rem",
        4.5: "1.125rem",
        5.5: "1.375rem",
        6.5: "1.625rem",
      },
      letterSpacing: {
        snug: "0.01em",
        relaxed: "0.2em",
      },
      colors: {
        primary: {
          50: "#ffeff0",
          100: "#ffe0e2",
          200: "#ffc5cc",
          300: "#ff96a3",
          400: "#ff5b73",
          500: "#ff2249",
          600: "#ff0034",
          700: "#da002c",
          800: "#b6002d",
          900: "#97002d",
          950: "#580013",
        },

        senato: {
          DEFAULT: "#97002D", // Main Sangria color
          light: "#B83F54", // Lighter shade (optional)
          dark: "#6A001F", // Darker shade (optional)
        },
        green: {
          50: "#e9fcf7",
          100: "#e6fcf6",
          200: "#bcf6e6",
          300: "#a5f3de",
          400: "#78eccd",
          500: "#4be6bd",
          600: "#1ee0ac",
          700: "#18b38a",
          800: "#128667",
          900: "#0c5a45",
          950: "#062d22",
        },
        yellow: {
          50: "#fef8e7",
          100: "#fef8e4",
          200: "#fcebb7",
          300: "#fbe59f",
          400: "#f8d76e",
          500: "#f6ca3e",
          600: "#f4bd0e",
          700: "#c3970b",
          800: "#927108",
          900: "#624c06",
          950: "#312603",
        },
        red: {
          50: "#fdeeed",
          100: "#fceceb",
          200: "#f8cbc8",
          300: "#f6bab5",
          400: "#f19891",
          500: "#ed756c",
          600: "#e85347",
          700: "#ba4239",
          800: "#8b322b",
          900: "#2e110e",
          950: "#2e110e",
        },
        cyan: {
          50: "#e6f9fc",
          100: "#e4f8fb",
          200: "#b5edf5",
          300: "#9de7f2",
          400: "#6bdaeb",
          500: "#3acee5",
          600: "#09c2de",
          700: "#079bb2",
          800: "#057485",
          900: "#044e59",
          950: "#02272c",
        },
        slate: {
          50: "#f5f7fd",
          100: "#ecf2ff",
          200: "#dfe9fe",
          300: "#b6c6e3",
          400: "#8094ae",
          500: "#6e82a5",
          600: "#526484",
          700: "#364a63",
          800: "#203145",
          900: "#1c2b46",
          950: "#131f34",
        },
        gray: {
          50: "#f7fafc",
          100: "#ebeef2",
          200: "#e5e9f2",
          300: "#dbdfea",
          400: "#b7c2d0",
          500: "#8091a7",
          600: "#3c4d62",
          700: "#344357",
          800: "#2b3748",
          900: "#1f2b3a",
          950: "#101924",
          1000: "#0d141d",
        },
      },
      spacing: {
        0.75: "0.1875rem",
        4.5: "1.125rem",
        5.5: "1.375rem",
        6.5: "1.625rem",
        7.5: "1.875rem",
        13: "3.25rem",
        15: "3.75rem",
        17: "4.25rem",
        18: "4.5rem",
        19: "4.75rem",
        68: "17rem",
      },
      borderWidth: {
        3: "3px",
        5: "5px",
        6: "6px",
        7: "7px",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@headlessui/tailwindcss"),
  ],
};
