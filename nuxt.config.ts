// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: [
    './app/assets/fonts/fonts.css',
    './app/assets/sass/main.sass',
  ],

  modules: [
    '@nuxtjs/prismic',
    '@nuxtjs/tailwindcss',
    '@formkit/auto-animate/nuxt',
    '@nuxt/image',
    '@nuxtjs/sitemap',
  ],

  site: {
    url: 'https://andreabelosi.com',
    name: 'Andrea Belosi - Architecture & Scenography',
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      link: [
        { rel: 'canonical', href: 'https://andreabelosi.com' },
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'apple-touch-icon', href: '/favicon.png' },
      ],
    },
  },

  prismic: {
    endpoint: 'https://belosi.cdn.prismic.io/api/v2',
    toolbar: false,
    preview: false,
  },

  sitemap: {
    exclude: ['/slice-simulator'],
  },

  routeRules: {
    '/slice-simulator': { robots: false },
    '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
  },

  nitro: {
    compressPublicAssets: true,
  },

  image: {},
})
