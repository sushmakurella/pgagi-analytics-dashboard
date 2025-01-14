// import type { Config } from "tailwindcss";

// export default {
//   content: [
//     "./pages/**/*.{js,ts,jsx,tsx,mdx}",
//     "./components/**/*.{js,ts,jsx,tsx,mdx}",
//     "./app/**/*.{js,ts,jsx,tsx,mdx}",
//   ],
//   theme: {
//     extend: {
//       colors: {
//         background: "var(--background)",
//         foreground: "var(--foreground)",
//       },
//     },
//   },
//   plugins: [],
// } satisfies Config;

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // If using the new "app" directory in Next.js
    "./pages/**/*.{js,ts,jsx,tsx}", // For files in the "pages" directory
    "./components/**/*.{js,ts,jsx,tsx}", // For files in the "components" directory
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4CAF50", // Custom color for styling (optional)
        secondary: "#FF5722", // Another custom color (optional)
      },
    },
  },
  darkMode: "class", // Enable dark mode using the "class" strategy
  plugins: [],
};