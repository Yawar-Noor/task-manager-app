// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Adjust this to match your project's file structure!
  ],
  theme: {
    extend: {
      // Did you have any custom colors, fonts, or other theme extensions?
      // If so, you will need to add them back here.

      colors: {
        bg: {
          primary: '#fafafa',      // Off-white main background
          secondary: '#ffffff',    // White card backgrounds  
          tertiary: '#f5f5f5',     // Alternative light background
          hover: '#f9fafb'         // Hover states
        },
        
        // Text System
        text: {
          primary: '#000000',      // Main black text
          secondary: '#6b7280',    // Secondary gray text
          tertiary: '#9ca3af',     // Light gray text
          inverse: '#ffffff',      // White text on dark backgrounds
          muted: '#d1d5db'         // Very light gray/disabled text
        },
        
        // Surface System (Cards & Components)
        surface: {
          primary: '#ffffff',      // Main card background
          secondary: '#f9fafb',    // Secondary card background
          elevated: '#ffffff',     // Elevated cards with shadows
          border: '#e5e7eb'        // Border colors
        },
      },
      fontFamily: {
        'roboto': ['Roboto', 'sans-serif'],
      },
      fontWeight: {
        'light': '300',
        'normal': '400', 
        'medium': '500',
        'bold': '700',
      },
      
      letterSpacing: {
        // Material Design letter spacing values
        'tight-xl': '-0.25px',
        'tight-lg': '-0.15px', 
        'tight': '-0.05px',
        'normal': '0px',
        'wide-xs': '0.1px',
        'wide-sm': '0.25px',
        'wide': '0.4px',
        'wide-lg': '0.5px'
      }
    },
  },
  plugins: [
    // Did you have any Tailwind plugins? e.g., require('@tailwindcss/forms')
  ],
}
