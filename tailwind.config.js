/** @type {import('tailwindcss').Config} */
import { screens } from "tailwindcss/defaultTheme";

export const content = [
  './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
  './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  './src/app/**/*.{js,ts,jsx,tsx,mdx}',
];
export const plugins = [
  require("@tailwindcss/forms")
];
export const theme = {
  screens: {
    "m_menu": "525px",
    ...screens
  }
};
