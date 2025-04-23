/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.html', 
    './src/**/*.{js,jsx,ts,tsx}',
    './public/**/*.{html,js}',
  ],
  safelist: [
    'text-emerald-500',
    '#f97316',
    'text-gray-600',
    'text-gray-500',
    'text-indigo-600',
    'text-gray-800',
    'text-blue-500',
    'text-green-700',
    'bg-green-100',
    'text-gray-700',
    'text-indigo-700',
    'text-blue-600',
    'bg-white',
    'bg-gray-50',
    'border-gray-200',
    'bg-indigo-600',
    'hover:bg-indigo-700',
  ],
  theme: {
    extend: {
      fontFamily: {
        fjalla_one: ['Fjalla One', 'sans-serif'],  
        inter: ['Inter', 'sans-serif'],           
      },
      animation: {
        'slide-in-left': 'slideInLeft 0.5s ease-out',
        'slide-out-right': 'slideOutRight 0.3s ease-in',
        'fade-in': 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        slideInLeft: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideOutRight: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
      boxShadow: {
        '2xl': '0px 10px 15px rgba(0, 0, 0, 0.1), 0px 4px 6px rgba(0, 0, 0, 0.1)',
        'modal': '0px 0px 20px rgba(0, 0, 0, 0.25)',
      },
      backdropBlur: {
        '10px': 'blur(10px)',
      },
      colors: {
        'modal-bg': 'rgba(0, 0, 0, 0.5)',  // Fundo do modal com opacidade 50%
      },
    },
  },
  corePlugins: {
    preflight: true, // Garantindo que o reset de base esteja ativo
  },
  plugins: [],
};
