<script setup lang="ts"></script>

<template>
  <div class="w-screen h-screen flex bg-[url(/img/tarot-bg.jpg)] justify-center items-center">
    <div class="flex h-[50%] w-full gap-4 justify-center items-center">
      <NuxtLink to="/foolvpn" class="h-full">
        <img
          src="/img/the-fool.png"
          class="h-full grayscale hover:grayscale-0 transition-all duration-200 hover:scale-105"
          alt="Tarot Card"
        />
      </NuxtLink>
      <NuxtLink to="/nautica" class="h-full">
        <img
          src="/img/the-star.png"
          class="h-full grayscale hover:grayscale-0 transition-all duration-200 hover:scale-105"
          alt="Tarot Card"
        />
      </NuxtLink>
    </div>
  </div>
</template>
