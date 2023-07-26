/** @type {import("prettier").Options} */

module.exports = {
  plugins: [require('prettier-plugin-organize-imports'), require('prettier-plugin-tailwindcss')],
  tailwindConfig: './tailwind.config.js',
  // pluginSearchDirs: false,
  trailingComma: 'all',
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  printWidth: 160,
  bracketSpacing: true,
};
