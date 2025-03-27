/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        base: "450px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      colors: {
        primary: {
          DEFAULT: "var(--primary)",
          8: "var(--primary-8)",
          10: "var(--primary-10)",
          30: "var(--primary-30)",
          50: "var(--primary-50)",
          inverted: {
            DEFAULT: "var(--primary-inverted)",
            8: "var(--primary-inverted-8)",
            10: "var(--primary-inverted-10)",
            30: "var(--primary-inverted-30)",
            50: "var(--primary-inverted-50)",
          },
          "battleship-davys-gray": {
            DEFAULT: "var(--primary-battleship-davys-gray)",
            inverted: {
              DEFAULT: "var(--primary-battleship-davys-gray-inverted)",
            },
          },
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          inverted: {
            DEFAULT: "var(--secondary-inverted)",
          },
          "battleship-davys-gray": {
            DEFAULT: "var(--secondary-battleship-davys-gray)",
            inverted: {
              DEFAULT: "var(--secondary-battleship-davys-gray-inverted)",
            },
          },
        },
        tertiary: {
          DEFAULT: "var(--tertiary)",
          inverted: {
            DEFAULT: "var(--tertiary-inverted)",
          },
        },
        silver: {
          DEFAULT: "var(--silver)",
          jet: "var(--silver-jet)",
          "jet-2": "var(--silver-jet-2)",
        },
        "smoke-eerie": "var(--smoke-eerie)",
        "smoke-eerie-inverted": "var(--smoke-eerie-inverted)",
        "seasalt-black": "var(--seasalt-black)",
        "platinum-jet": "var(--platinum-jet)",
        "platinum-black": "var(--platinum-black)",
        "platinum-black-inverted": "var(--platinum-black-inverted)",
        "blue-crayola-c": "var(--blue-crayola-c)",
        "white-smoke-night": "var(--white-smoke-night)",
        "white-smoke-night-inverted": "var(--white-smoke-night-inverted)",
        "silver-jet": "var(--silver-jet)",
      },
      backgroundImage: {
        "accent-duo": "var(--accent-duo)",
        "silver-duo": "var(--silver-duo)",
        "golden-gradient":
          "linear-gradient(114deg,#feeca4 0%, #e8c03d 20%, #fcc54f 35%, #b2b2b2 50%, #ffdf2c 65%, #efd336 80%, #fcf0be 100%)",
        "sky-blue-burst": "var(--sky-blue-burst)",
        "gradient-line": "var(--gradient-line)",
        "gradient-dark-fade-bottom": "var(--gradient-dark-fade-bottom)",
        "beautinique-gradient": "var(--beautinique-gradient)",
      },
      boxShadow: {
        "neumorphic-layered": "var(--shadow-neumorphic-layered)",
        "light-dark-soft": "var(--shadow-light-dark-soft)",
        "primary-btn": "var(--shadow-primary-button)",
        "primary-btn-hover": "var(--shadow-primary-button-hover)",
        "secondary-btn":
          "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 2px 16px 0px var(--primary-50)",
        "secondary-btn-hover":
          "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 2px 32px 0px var(--primary-50), 0px 2px 16px 0px var(--primary-10)",
        "navbar-card": "var(--primary-inverted-50) 0px 3px 8px",
      },
      fontFamily: {
        metropolis: ["metropolis", "sans-serif"],
      },
    },
  },
  plugins: [
    // Utilities
    function ({ addUtilities }) {
      addUtilities({
        ".text-fill-transparent": {
          "-webkit-text-fill-color": "transparent",
        },
        ".text-shadow-sm": {
          "text-shadow": "0px 0.079px 0.016px rgba(0, 0, 0, 0.08)",
        },
        ".text-shadow-md": {
          "text-shadow": "0px 0.216px 0.043px rgba(0, 0, 0, 0.08)",
        },
        ".text-shadow-lg": {
          "text-shadow": "0px 12px 14.4px rgba(0, 0, 0, 0.15)",
        },
        ".border-gradient": {
          background:
            "linear-gradient(to bottom, var(--battleship-davys-gray),  var(--timberwolf-eerie-black))",
        },
      });
    },
    // Theme variants
    function ({
      addVariant,
    }: {
      addVariant: (name: string, selector: string) => void;
    }) {
      addVariant("light", '[theme="light"] &');
      addVariant("dark", '[theme="dark"] &');
    },
  ],
};
