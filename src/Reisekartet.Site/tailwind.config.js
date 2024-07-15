/** @type {import('tailwindcss').Config} */
export default {
  purge: ['./index.html', './src/**/*.{vue,js,ts}'],
  content: [],
  theme: {
    extend: {
      colors: {
        primary: '#3f51b5',
        complementary: '#b53f51',
        analogous: {
          lightBlue: '#3f79b5',
          slateBlue: '#3f5fb5'
        },
        accent: {
          fuchsia: '#b53f92',
          emerald: '#3fb557',
          goldenrod: '#b5913f'
        },
        neutral: {
          lightGray: '#f5f5f5',
          mediumGray: '#e0e0e0',
          darkGray: '#212121'
        }
      }
    }
  },
  plugins: []
}
