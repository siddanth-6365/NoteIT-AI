/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    // Use the new Tailwind CSS PostCSS plugin as required by Tailwind v4+
    '@tailwindcss/postcss': {},
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;
