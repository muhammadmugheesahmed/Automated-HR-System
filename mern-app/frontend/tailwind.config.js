import flowbite from "flowbite/plugins"
/** @type {import('tailwindcss').Config} */  
export default {
    content: ["./index.html",
              "./src/**/*.{js,ts,jsx,tsx}", 
              "./node_modules/flowbite/**/*.js"], // Add this line],
    theme: {
      extend: {},
    },
    plugins: [flowbite],
  };