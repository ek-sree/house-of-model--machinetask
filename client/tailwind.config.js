/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // No need to extend scrollbar styles here, since you are using custom CSS
    },
  },
  plugins: [
    require('tailwind-scrollbar'), // Ensure this plugin is installed and imported
    // Other plugins...
  ],
};
