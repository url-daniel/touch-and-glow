import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FBF5EF",
        ivory: "#FFFDFB",
        clay: "#C98F76",
        "clay-dark": "#A86B52",
        espresso: "#3A2A22",
        taupe: "#8B6F5C",
        blush: "#F0D9CE",
        peach: "#E8A87C"
      },
      fontFamily: {
        display: ["Fraunces", "ui-serif", "Georgia", "serif"],
        body: ["\"Work Sans\"", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      maxWidth: {
        prose: "68ch"
      }
    }
  },
  plugins: []
};

export default config;
