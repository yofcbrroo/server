<script setup lang="ts">
const props = defineProps({
  icon: String,
  text: String,
});
</script>

<template>
  <div class="w-full h-max bg-primary rounded-xl p-4 grid grid-cols-4">
    <div class="flex justify-center items-center">
      <Icon :name="`uil:${props.icon}`" size="32px" class="bg-primary-content" />
    </div>
    <div class="col-start-2 col-end-5 flex justify-start items-center font-medium text-primary-content">
      {{ props.text }}
    </div>
  </div>
</template>
