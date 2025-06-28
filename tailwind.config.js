/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: 'media', // Updated for v3
  theme: {
    extend: {
      screens: {
        print: { raw: "print" },
        // => @media print { ... }
      },
      colors: {
        // Custom colors only - keep default Tailwind colors intact
        brown: "#695f5c",
        tan: "#f0e7de",
        concrete: "#f2f2f2",
        "light-gray": "#e9e9e9",
        "yellow-gray": "#e5ebe4",
        "dark-green": "#0d5352",
        "blue-green": "#0b6265",
        "light-green": "#adc0ba",
        "natural-red": "#b93b36",
        sand: "#f0e7de",
        // Add sky color to replace deprecated lightBlue  
        sky: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
      fontFamily: {
        rounded: ["Publica Play Regular", "Helvetica", "Arial", "sans-serif"],
        body: ['"Open Sans"', '"Helvetica Neue", Helvetica, Arial, sans-serif'],
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"), // Updated to v0.5.16 for compatibility
    require("@tailwindcss/aspect-ratio"), // Re-enabled for proper image sizing
    // require("tailwindcss-container-bleed"), // Keep disabled for now
  ],
};
