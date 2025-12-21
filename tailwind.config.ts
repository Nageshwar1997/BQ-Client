/** @type {import('tailwindcss').Config} */
import typographyPlugin from "@tailwindcss/typography";
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
          10: "var(--secondary-10)",
          30: "var(--secondary-30)",
          50: "var(--secondary-50)",
          inverted: {
            DEFAULT: "var(--secondary-inverted)",
            10: "var(--secondary-inverted-10)",
            30: "var(--secondary-inverted-30)",
            50: "var(--secondary-inverted-50)",
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
          10: "var(--tertiary-10)",
          30: "var(--tertiary-30)",
          50: "var(--tertiary-50)",
          inverted: {
            DEFAULT: "var(--tertiary-inverted)",
            10: "var(--tertiary-inverted-10)",
            30: "var(--tertiary-inverted-30)",
            50: "var(--tertiary-inverted-50)",
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
        "picton-blue-c": "var(--picton-blue-c)",
        "rose-c": "var(--rose-c)",
        "white-smoke-night": "var(--white-smoke-night)",
        "white-smoke-night-inverted": "var(--white-smoke-night-inverted)",
        "silver-jet": "var(--silver-jet)",
        "jade-c": "var(--jade-c)",
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
        "primary-btn":
          "0px 4px 4px 0px var(--primary-inverted-30), 0px 2px 8px 0px var(--argentinian-celestial-blue-30)",
        "secondary-btn":
          "0px 4px 4px 0px var(--primary-inverted-30), 0px 2px 8px 0px var(--secondary-30)",
        "tertiary-btn":
          "0px 4px 4px 0px var(--primary-inverted-30), 0px 2px 8px 0px var(--tertiary-30)",
        "outline-btn":
          "0px 4px 4px 0px var(--primary-inverted-30), 0px 2px 8px 0px var(--primary-30)",
        "primary-btn-hover":
          "0px 4px 4px 0px var(--primary-inverted-30), 0px 2px 4px 0px var(--argentinian-celestial-blue-10), 0px 2px 8px 0px var(--argentinian-celestial-blue-50)",
        "secondary-btn-hover":
          "0px 4px 4px 0px var(--primary-inverted-30), 0px 2px 4px 0px var(--secondary-10), 0px 2px 8px 0px var(--secondary-50)",
        "tertiary-btn-hover":
          "0px 4px 4px 0px var(--primary-inverted-30), 0px 2px 4px 0px var(--tertiary-10), 0px 2px 8px 0px var(--tertiary-50)",
        "outline-btn-hover":
          "0px 4px 4px 0px var(--primary-inverted-30), 0px 2px 4px 0px var(--primary-10), 0px 2px 8px 0px var(--primary-50)",
      },
      fontFamily: {
        metropolis: ["metropolis", "sans-serif"],
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.4", transform: "scale(1.3)" },
        },
        fadeInOut: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        growAndFade: {
          "0%": { opacity: "0.25", transform: "scale(0)" },
          "100%": { opacity: "0", transform: "scale(1)" },
        },
        "border-spin": {
          "100%": {
            transform: "rotate(360deg)",
          },
        },
      },
      animation: {
        blink: "blink 2s ease-in-out infinite",
        "spin-slow": "spin 6s linear infinite",
        "border-spin": "border-spin 5s linear infinite",
        fadeIn: "fadeInOut 500ms ease-in-out",
      },
    },
  },
  plugins: [
    // Utilities
    function ({
      addUtilities,
    }: {
      addUtilities: (utilities: Record<string, Record<string, string>>) => void;
    }) {
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
        ".opening-card:hover": {
          background: `radial-gradient(67.31% 80.26% at 0% 0%, var(--dept-color-30) 0%, var(--dept-color-0) 100%), linear-gradient(0deg, var(--primary-inverted-10) 0%, var(--primary-inverted-10) 100%), var(--primary-inverted)`,
        },
        ".border-rounded-corners-gradient": {
          border: "solid 1px transparent",
          borderRadius: "16px",
          background:
            "linear-gradient(var(--primary-inverted), var(--primary-inverted)), linear-gradient(var(--primary-50) 10%, var(--primary-10))",
          backgroundOrigin: "border-box",
          backgroundClip: "padding-box, border-box",
          boxShadow: "var(--primary-10) -4px 9px 25px -6px",
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
    typographyPlugin,
  ],
};
