/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app.vue',
    './error.vue',
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.{vue,js,ts}',
    './pages/**/*.{vue,js,ts}',
    './plugins/**/*.{js,ts}',
    './src/**/*.{vue,js,ts}', // ← srcDir を使うなら必ず入れる
  ],
  theme: { extend: {} },
  plugins: [],
}