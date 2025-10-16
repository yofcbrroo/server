<script setup lang="ts">
const route = useRoute();
const selectedProxies = useSelectedProxiesStore();

const myip = reactive({
  asOrganization: "",
  ip: "",
  city: "",
  region: "",
  country: "",
});
const proxies = ref([{ ip: "", isp: "", port: "", country: "" }]);
const countries = ref([""]);
const selectedCountry = ref("All");
const displayProxies = ref([{ ip: "", isp: "", port: "", country: "" }]);
const page = ref(0);
const itemPerPage = ref(15);
const pagination = ref([0, 1, 2]);
const displaySelected = ref(false);
const openToast = ref(false);
const toastText = ref("");
const search = ref("");

const proxySettings = reactive<ProxySettings>({
  protocol: "trojan",
  format: "raw",
  tls: false,
  host: route.query.host?.toString() || "nautica.foolvpn.me",
  server: "172.67.73.39",
});

// === FUNGSI ===
function getTempProxies() {
  let proxiesTemp = proxies.value;

  if (displaySelected.value) {
    proxiesTemp = proxiesTemp.filter((proxy) =>
      selectedProxies.getSelectedProxies.includes(`${proxy.ip}:${proxy.port}`)
    );
  }

  if (selectedCountry.value && selectedCountry.value !== "All") {
    proxiesTemp = proxiesTemp.filter(
      (proxy) => proxy.country.toLowerCase() === selectedCountry.value.toLowerCase()
    );
  }

  if (search.value) {
    proxiesTemp = proxiesTemp.filter((proxy) =>
      proxy.isp.toLowerCase().includes(search.value.toLowerCase())
    );
  }

  return proxiesTemp;
}

function setDisplayProxies() {
  const displayProxiesTemp = [];
  const proxiesTemp = getTempProxies();
  for (let i = page.value * itemPerPage.value; i < page.value * itemPerPage.value + itemPerPage.value; i++) {
    const proxy = proxiesTemp[i];
    if (proxy?.isp) displayProxiesTemp.push(proxy);
  }
  displayProxies.value = displayProxiesTemp as any;
}

function setPagination() {
  const proxiesTemp = getTempProxies();
  const maxIndex = Math.floor(proxiesTemp.length / itemPerPage.value);
  const maxItem = 5;
  const paginationTemp = [];

  if (page.value < 0) page.value = 0;
  if (page.value > maxIndex) page.value = maxIndex;
  for (let i = page.value <= 2 ? 0 : page.value + 2 >= maxIndex ? maxIndex - 4 : page.value - 2; i <= maxIndex; i++) {
    paginationTemp.push(i);
    if (paginationTemp.length >= maxItem) break;
  }
  pagination.value = paginationTemp;
}

async function copyToClipboard() {
  const proxiesTemp = proxies.value;
  const configResult = await parseProxies(
    proxiesTemp.filter((proxy) => selectedProxies.getSelectedProxies.includes(`${proxy.ip}:${proxy.port}`)) as any,
    proxySettings
  );
  navigator.clipboard.writeText(configResult as string);
  openToast.value = true;
  toastText.value = "Proxy copied to clipboard!";
}

// === WATCHER ===
watch([page, proxies, selectedCountry, displaySelected, search], () => {
  setDisplayProxies();
  setPagination();
});
watch(openToast, () => {
  if (openToast.value)
    setTimeout(() => {
      openToast.value = false;
    }, 3000);
});

// === FETCH DATA ===
useFetch("https://myip.ipeek.workers.dev", { server: false, cache: "no-cache" }).then(async (res) => {
  await res.execute();
  if (res.status.value == "success") {
    const json = JSON.parse(res.data.value as string);
    Object.assign(myip, json);
  } else {
    myip.asOrganization = "Failed";
    myip.ip = "Failed";
  }
});

useFetch("https://raw.githubusercontent.com/FoolVPN-ID/Nautica/refs/heads/main/proxyList.txt").then((res) => {
  if (res.status.value == "success") {
    const proxiesTemp = [];
    const countriesTemp = [];
    for (const data of (res.data.value as string).split("\n")) {
      const [ip, port, country, isp] = data.split(",");
      proxiesTemp.push({ ip, port, country: country.toLowerCase(), isp });
      countriesTemp.push(country);
    }
    proxies.value = proxiesTemp as any;
    countries.value = ["All", ...new Set(countriesTemp)];
  }
});
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-gray-100 flex flex-col lg:flex-row">
    <!-- SIDEBAR -->
    <aside class="lg:w-1/4 w-full p-5 bg-gray-800 shadow-lg flex flex-col gap-5 sticky top-0 h-max lg:h-screen">
      <div class="text-xl font-bold mb-3">🌐 Proxy Dashboard</div>

      <div class="bg-gray-700 p-3 rounded-lg">
        <p class="text-sm text-gray-400">Your IP:</p>
        <p class="font-semibold">{{ myip.ip }}</p>
        <p>{{ myip.city }}, {{ myip.region }}</p>
        <p class="text-sm text-gray-400">{{ myip.asOrganization }}</p>
      </div>

      <div class="space-y-3">
        <input v-model="search" type="text" placeholder="Search ISP..." class="input w-full bg-gray-700 text-white" />
        <select v-model="selectedCountry" class="select w-full bg-gray-700 text-white">
          <option v-for="country in countries" :key="country">{{ country }}</option>
        </select>

        <button @click="displaySelected = !displaySelected" class="btn bg-indigo-600 hover:bg-indigo-500 w-full">
          {{ displaySelected ? "Show All" : "Show Selected" }}
        </button>

        <button onclick="my_modal_1.showModal()" class="btn bg-gray-700 hover:bg-gray-600 w-full">
          ⚙️ Settings
        </button>

        <button @click="copyToClipboard" class="btn bg-green-600 hover:bg-green-500 w-full">
          📋 Export Selected ({{ selectedProxies.getSelectedProxies.length }})
        </button>
      </div>
    </aside>

    <!-- MAIN CONTENT -->
    <main class="flex-1 p-6">
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div
          v-for="proxy in displayProxies"
          :key="proxy.ip + proxy.port"
          class="bg-gray-800 p-4 rounded-xl shadow-md hover:shadow-lg hover:bg-gray-700 transition"
        >
          <p class="font-bold text-indigo-400">{{ proxy.isp }}</p>
          <p class="text-sm text-gray-300">{{ proxy.ip }}:{{ proxy.port }}</p>
          <p class="text-xs text-gray-400 uppercase">{{ proxy.country }}</p>
        </div>
      </div>

      <!-- Pagination -->
      <div class="flex justify-center mt-6 space-x-2">
        <button @click="page--" class="btn btn-sm bg-gray-700 hover:bg-gray-600">&lt;&lt;</button>
        <button
          v-for="pageIndex in pagination"
          :key="pageIndex"
          @click="page = pageIndex"
          :class="pageIndex == page ? 'btn btn-sm bg-indigo-600' : 'btn btn-sm bg-gray-700 hover:bg-gray-600'"
        >
          {{ pageIndex }}
        </button>
        <button @click="page++" class="btn btn-sm bg-gray-700 hover:bg-gray-600">&gt;&gt;</button>
      </div>
    </main>
  </div>

  <!-- TOAST -->
  <transition name="fade">
    <div v-if="openToast" class="fixed bottom-5 right-5 bg-indigo-600 px-4 py-3 rounded-lg shadow-lg">
      {{ toastText }}
    </div>
  </transition>

  <!-- MODAL -->
  <dialog id="my_modal_1" class="modal">
    <div class="modal-box bg-gray-800 text-white">
      <h3 class="text-lg font-bold mb-3">⚙️ Proxy Settings</h3>

      <div class="flex flex-col gap-3">
        <input v-model="proxySettings.server" type="text" placeholder="Server host"
          class="input bg-gray-700 text-white" />

        <div class="flex gap-2">
          <select v-model="proxySettings.protocol" class="select flex-1 bg-gray-700 text-white">
            <option disabled>Protocol</option>
            <option v-for="p in getProtocols()" :key="p">{{ p }}</option>
          </select>

          <select v-model="proxySettings.format" class="select flex-1 bg-gray-700 text-white">
            <option disabled>Format</option>
            <option v-for="f in getFormats()" :key="f">{{ f }}</option>
          </select>

          <select v-model="proxySettings.tls" class="select flex-1 bg-gray-700 text-white">
            <option v-for="tls in [true, false]" :key="tls">{{ tls }}</option>
          </select>
        </div>
      </div>

      <div class="modal-action">
        <form method="dialog"><button class="btn bg-indigo-600 hover:bg-indigo-500">Done</button></form>
      </div>
    </div>
  </dialog>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
