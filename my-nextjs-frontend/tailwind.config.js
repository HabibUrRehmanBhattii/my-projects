/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/app/**/*.{js,ts,jsx,tsx}",
        "./src/components/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'media',
    theme: {
        extend: {
            colors: {
                primary: '#D84315', // Terracotta DEFAULT
                'primary-light': '#FF7D47',
                'primary-dark': '#A33112',
                secondary: '#4CAF50', // Green DEFAULT
                'secondary-light': '#80E27E',
                'secondary-dark': '#087F23',
                accent: '#FFC107', // Gold/Yellow DEFAULT
                'accent-light': '#FFF350',
                'accent-dark': '#C79100',
                neutral: { // Neutral remains nested as it's a palette
                    100: '#F5F5F5',
                    200: '#E0E0E0',
                    300: '#BDBDBD',
                    400: '#9E9E9E',
                    500: '#757575',
                    600: '#616161',
                    700: '#424242',
                    800: '#212121',
                    900: '#121212',
                },
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'sans-serif'],
                heading: ['var(--font-playfair)', 'serif'],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'pattern': "url('/patterns/paisley-light.png')",
            },
            boxShadow: {
                'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                'elevated': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
            },
        },
    },
    safelist: [
        'bg-primary',
        'bg-primary-light',
        'bg-primary-dark',
        'bg-secondary',
        'bg-secondary-light',
        'bg-secondary-dark',
        'bg-accent',
        'bg-accent-light',
        'bg-accent-dark',
    ],
    plugins: [],
};