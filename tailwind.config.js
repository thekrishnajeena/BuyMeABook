/** @type {import('tailwindcss').Config} */
export const content = [
  "./app/**/*.{ts,tsx}",
  "./components/**/*.{ts,tsx}",
  "./node_modules/@shadcn/ui/dist/**/*.js" // include shadcn/ui components
];
export const theme = {
  extend: {},
};
export const plugins = [];
