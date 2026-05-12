import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        slack: {
          aubergine: "#3F0E40",
          "aubergine-hover": "#350D36",
          "aubergine-active": "#1164A3",
          blue: "#1164A3",
          "blue-hover": "#0B4C8C",
          green: "#2BAC76",
          red: "#E01E5A",
          yellow: "#ECB22E",
          purple: "#4A154B",
          sidebar: {
            text: "#BCABBC",
            "text-active": "#FFFFFF",
            hover: "rgba(255,255,255,0.08)",
          },
        },
      },
      fontFamily: {
        sans: [
          "Lato",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
