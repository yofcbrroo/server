<script setup lang="ts">
const selectedProxies = useSelectedProxiesStore();
const myip = reactive({
  asOrganization: "",
  ip: "",
  city: "",
  region: "",
  country: "",
});
const proxies = ref([
  {
    ip: String,
    isp: String,
    port: String,
    country: String,
  },
]);
const countries = ref([""]);
const selectedCountry = ref("Select Country");
const displayProxies = ref([
  {
    ip: "",
    isp: "",
    port: "",
    country: "",
  },
]);
const page = ref(0);
const itemPerPage = ref(15);
const pagination = ref([0, 1, 2]);
const displaySelected = ref(false);
const openToast = ref(false);
const toastText = ref("");
const search = ref("");

// Functions
function getTempProxies() {
  let proxiesTemp = proxies.value;

  if (displaySelected.value) {
    proxiesTemp = proxiesTemp.filter((proxy) =>
      selectedProxies.getSelectedProxies.includes(`${proxy.ip}:${proxy.port}`)
    );
  }

  if (selectedCountry.value.length == 2) {
    proxiesTemp = proxiesTemp.filter((proxy) => proxy.country.toString() == selectedCountry.value.toLowerCase());
  }

  if (search.value != "") {
    proxiesTemp = proxiesTemp.filter((proxy) =>
      proxy.isp.toString().toLowerCase().includes(search.value.toLowerCase())
    );
  }

  return proxiesTemp;
}

function setDisplayProxies() {
  const displayProxiesTemp = [];
  const proxiesTemp = getTempProxies();

  for (let i = page.value * itemPerPage.value; i < page.value * itemPerPage.value + itemPerPage.value; i++) {
    const proxy = proxiesTemp[i];
    if (proxy?.isp.toString()) {
      displayProxiesTemp.push(proxiesTemp[i]);
    }
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

function copyToClipboard() {
  const settings: ProxySettings = {
    protocol: "trojan",
    format: "raw",
  };
  const configResult = parseProxies(selectedProxies.getSelectedProxies, settings);

  navigator.clipboard.writeText(configResult as string);
}

// Watcher
watch([page, proxies, selectedCountry, displaySelected, search], () => {
  setDisplayProxies();
  setPagination();
});
watch([openToast], () => {
  setTimeout(() => {
    openToast.value = false;
  }, 3000);
});

// Client side fetching
useFetch("https://myip.shylook.workers.dev", {
  server: false,
  cache: "no-cache",
}).then(async (res) => {
  await res.execute();
  if (res.status.value == "success") {
    const jsonValue = JSON.parse(res.data.value as string);

    myip.asOrganization = jsonValue.asOrganization;
    myip.ip = jsonValue.ip;
    myip.city = jsonValue.city;
    myip.region = jsonValue.region;
    myip.country = jsonValue.country;
  } else if (res.error.value) {
    myip.asOrganization = "Failed";
    myip.ip = "Failed";
  }
});

// Server side fetching
useFetch("https://raw.githubusercontent.com/FoolVPN-ID/Nautica/refs/heads/main/proxyList.txt").then((res) => {
  if (res.status.value == "success") {
    const proxiesTemp = [];
    const countriesTemp = [];
    for (const data of (res.data.value as string).split("\n")) {
      const [ip, port, country, isp] = data.split(",");

      proxiesTemp.push({
        ip,
        port,
        country: country.toLowerCase(),
        isp,
      });

      countriesTemp.push(country);
    }

    proxies.value = proxiesTemp as any;
    countries.value = ["All", ...new Set(countriesTemp)];
  }
});
</script>

<template>
  <div class="grid lg:grid-cols-6 px-[10%] py-10 mb-[8%] lg:mb-0">
    <div>
      <div class="flex flex-col gap-4 p-2">
        <CardWithSlot icon="traffic-light" :text="myip.asOrganization">
          <div class="flex flex-col w-full">
            <span>{{ myip.asOrganization }}</span>
            <span>{{ myip.ip }}</span>
          </div>
        </CardWithSlot>
        <CardWithSlot icon="map-marker" :text="myip.ip">
          <div class="flex flex-col w-full">
            <div>
              <span>{{ myip.city }}</span>
              <span>, </span>
              <span>{{ myip.region }}</span>
            </div>
            <span>{{ myip.country }}</span>
          </div>
        </CardWithSlot>
        <CardWithSlot icon="cloud-computing">
          <select class="select select-primary w-full max-w-xs" v-model="selectedCountry">
            <option disabled selected>Select Country</option>
            <option v-for="country in countries">{{ country }}</option>
          </select>
        </CardWithSlot>
      </div>
    </div>
    <div class="lg:col-start-2 lg:col-end-6 p-2 gap-3 flex flex-col lg:flex-row flex-wrap justify-start h-max">
      <span v-for="proxy in displayProxies" v-if="displayProxies[0].isp">
        <ProxyCard :isp="proxy.isp" :ip-port="`${proxy.ip}:${proxy.port}`" :country="proxy.country"></ProxyCard>
      </span>
    </div>
    <div>
      <div class="flex flex-col gap-4 p-2">
        <CardWithSlot icon="search">
          <div class="w-full">
            <input v-model="search" type="text" placeholder="Type here" class="input w-full" />
          </div>
        </CardWithSlot>
        <CardWithSlot icon="list-ul">
          <div class="flex flex-col w-full">
            <div v-on:click="displaySelected = !displaySelected" class="btn w-full font-bold text-md">
              {{ selectedProxies.getSelectedProxies.length }} proxies
            </div>
          </div>
        </CardWithSlot>
        <CardWithSlot icon="cog">
          <div class="flex flex-col w-full gap-2">
            <div class="btn w-full font-bold text-md">Settings</div>
            <div
              v-on:click="
                () => {
                  copyToClipboard();
                  openToast = true;
                  toastText = 'Proxy copied to clipboard!';
                }
              "
              class="btn w-full font-bold text-md"
            >
              Export
            </div>
          </div>
        </CardWithSlot>
      </div>
    </div>
  </div>
  <div class="flex justify-center">
    <div class="join bottom-0 fixed mb-[5%] lg:mb-[3%]">
      <input v-on:click="page--" class="join-item btn btn-square" type="radio" name="options" aria-label="<<" />
      <span v-for="pageIndex in pagination">
        <input
          v-on:click="page = pageIndex"
          class="join-item btn btn-square"
          type="radio"
          name="options"
          :aria-label="pageIndex.toString()"
          :class="pageIndex == page ? 'btn-active' : ''"
        />
      </span>
      <input v-on:click="page++" class="join-item btn btn-square" type="radio" name="options" aria-label=">>" />
    </div>
  </div>
  <div v-if="openToast" class="toast">
    <div class="alert alert-info">
      <span>{{ toastText }}</span>
    </div>
  </div>
</template>
