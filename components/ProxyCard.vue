<script setup lang="ts">
const props = defineProps({
  isp: String,
  ipPort: String,
  country: String,
});
</script>

<template>
  <div class="w-full lg:w-max bg-secondary rounded-lg grid grid-cols-1 p-4 hover:scale-105 transition-all duration-200">
    <div>
      <div class="flex justify-start items-center gap-2 font-bold">
        <img width="32" :src="`https://hatscripts.github.io/circle-flags/flags/${props.country}.svg`" alt="Indonesia" />
        <div class="flex flex-col">
          <span> {{ props.isp }} </span>
          <span> {{ props.ipPort }} </span>
        </div>
      </div>
      <div class="mt-1">
        <span class="badge">Badge</span>
      </div>
    </div>
  </div>
</template>
