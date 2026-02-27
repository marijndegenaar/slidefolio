// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: [
    './app/assets/sass/main.sass',
  ],

  modules: [
    '@nuxtjs/prismic',
    '@nuxtjs/tailwindcss',
    '@formkit/auto-animate/nuxt',
    '@nuxt/image',
  ],

  prismic: {
    endpoint: 'https://belosi.cdn.prismic.io/api/v2',
    toolbar: false,
    preview: false,
  },
})
