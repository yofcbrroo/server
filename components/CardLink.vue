<script setup lang="ts">
const props = defineProps({
  to: String,
  img: String,
  alt: String,
});
</script>

<template>
  <NuxtLink :to="props.to" class="h-full">
    <img
      :src="props.img"
      class="h-full grayscale hover:grayscale-0 transition-all duration-200 hover:scale-105"
      :alt="props.alt"
    />
  </NuxtLink>
</template>
