/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,ts,jsx,tsx,md,mdx}'],
  theme: {
    extend: {
      spacing: {
        'a4-w': '210mm',
        'a4-h': '297mm',
      },
      width: {
        'a4': '210mm',
      },
      height: {
        'a4': '297mm',
      },
      fontFamily: {
        sans: [
          '"Noto Sans KR"',
          'ui-sans-serif',
          'system-ui',
          'Segoe UI',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
