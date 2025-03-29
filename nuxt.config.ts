// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  nitro: {
    preset: "cloudflare_pages",
  },
  tailwindcss: {
    exposeConfig: true,
  },
  modules: ["@nuxtjs/tailwindcss", "@nuxt/icon", "@pinia/nuxt", "@nuxthub/core"],
});
