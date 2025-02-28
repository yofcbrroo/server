<script setup lang="ts">
const props = defineProps({
  isp: String,
  ipPort: String,
  country: String,
});

const stats = reactive({
  proxyip: false,
  delay: 0,
  loading: false,
});
// Server side fetching
async function checkProxyHealth() {
  stats.loading = true;
  try {
    const res = await $fetch(`https://nautica.foolvpn.me/check?target=${props.ipPort}`);

    const jsonValue = res as any;
    stats.proxyip = jsonValue.proxyip;
    stats.delay = jsonValue.delay;
  } catch (e) {
    console.error(e);
  }
  stats.loading = false;
}

onMounted(() => {
  checkProxyHealth();
});
watch(props, () => {
  checkProxyHealth();
});
</script>

<template>
  <div
    class="w-full lg:w-max rounded-lg grid grid-cols-1 p-4 hover:scale-105 transition-all duration-200 h-max"
    :class="stats.proxyip == true ? 'bg-secondary text-secondary-content' : 'bg-accent text-accent-content'"
  >
    <div>
      <div class="flex justify-start items-center gap-2 font-bold">
        <img
          width="32"
          :src="`https://hatscripts.github.io/circle-flags/flags/${props.country}.svg`"
          :alt="props.country"
        />
        <div class="flex flex-col">
          <span> {{ props.isp }} </span>
          <span> {{ props.ipPort }} </span>
        </div>
      </div>
      <div class="mt-1 gap-2 flex items-center">
        <span
          v-on:click="
            () => {
              if (stats.loading == false) checkProxyHealth();
            }
          "
          class="badge cursor-pointer"
          :class="stats.delay ? 'badge-primary' : 'badge-default'"
        >
          <span class="loading loading-xs loading-spinner" v-if="stats.loading"></span>
          <span v-else>
            {{ stats.delay }}
          </span>
        </span>
      </div>
    </div>
  </div>
</template>
