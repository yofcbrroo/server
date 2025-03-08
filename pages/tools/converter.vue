<script setup lang="ts">
const rawProxies = ref("");
const convertedProxies = ref("");
const convertFormats = ref(["clash", "sfa", "brf"]);

function convertProxiesTo(format: string) {
  if (rawProxies.value === "") {
    return;
  }

  const proxies = rawProxies.value.split("\n");
  convertedProxies.value = proxies.join("\n");
}

function copyToClipboard() {
  navigator.clipboard.writeText(convertedProxies.value);
}
</script>

<template>
  <div class="w-full h-full flex flex-col items-center justify-center gap-10 py-10">
    <fieldset class="fieldset w-[80%] lg:w-[50%]">
      <legend class="fieldset-legend mb-2">VPN Raw URL</legend>
      <textarea
        v-model="rawProxies"
        class="textarea textarea-primary h-24 w-full overflow-scroll"
        placeholder="vless://....."
      ></textarea>
    </fieldset>

    <div class="flex gap-2">
      <button v-for="format in convertFormats" class="btn btn-primary" v-on:click="convertProxiesTo(format)">
        {{ format.toUpperCase() }}
      </button>
    </div>

    <fieldset class="fieldset w-[80%] lg:w-[50%]">
      <legend class="fieldset-legend mb-2">Result</legend>
      <textarea
        :value="convertedProxies"
        class="textarea textarea-primary w-full overflow-scroll"
        placeholder="vless://....."
        disabled
      ></textarea>
    </fieldset>

    <div>
      <button class="btn btn-primary" v-on:click="copyToClipboard">Copy to Clipboard</button>
    </div>
  </div>
</template>
