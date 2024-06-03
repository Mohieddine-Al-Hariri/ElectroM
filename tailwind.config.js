/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        // primary: {
        //   DEFAULT: "var(--primaryColor)",
        // },
        // secondary: {
        //   DEFAULT: "var(--secondaryColor)",
        // }
        "primaryColor" : "var(--primaryColor)",
        "secondaryColor" : "var(--secondaryColor)",
      },
    },
    variants: {
      //Didnt work
      extend: {
        background: ["hover"],
        border: ["hover"],
        color: ["hover"],
        textColor: ["hover"],
      },
    },
  },
  plugins: [],
};
