// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  nitro: {
    preset: "cloudflare-pages",
  },
  devtools: { enabled: true },
  tailwindcss: {
    exposeConfig: true,
  },
  modules: ["@nuxtjs/tailwindcss", "@nuxt/icon", "@pinia/nuxt"],
});
