// https://nuxt.com/docs/api/configuration/nuxt-config
// nuxt.config.ts
export default defineNuxtConfig({
  srcDir: 'src',
  css: [
    '~/assets/css/tailwind.css',
    'swiper/css',
    'swiper/css/navigation',
    'swiper/css/pagination',
  ],
  app: { head: { title: 'SNS Slider App' } },
  typescript: { strict: true },
  vite: {
    server: {
      watch: { usePolling: true }, // 監視をポーリングに
      hmr: { protocol: 'ws', host: 'localhost', port: 7000 }, // 明示
    },
  },
    postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
      autoprefixer: {},
    },
  },
  
});