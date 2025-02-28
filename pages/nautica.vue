<script setup lang="ts">
const myip = reactive({
  asOrganization: "Getting info",
  ip: "Getting info",
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

// Client side fetching
useFetch("https://myip.shylook.workers.dev", {
  server: false,
}).then((res) => {
  if (res.status.value == "success") {
    const jsonValue = JSON.parse(res.data.value as string);

    myip.asOrganization = jsonValue.asOrganization;
    myip.ip = jsonValue.ip;
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

      proxiesTemp.push({
        ip,
        port,
        country: country.toLowerCase(),
        isp,
      });

      countriesTemp.push(country);

      if (proxiesTemp.length > 20) break;
    }

    proxies.value = proxiesTemp as any;
    countries.value = [...new Set(countriesTemp)];

    console.log(proxies.value);
  }
});
</script>

<template>
  <div class="grid lg:grid-cols-6 px-[10%] py-10">
    <div>
      <div class="flex flex-col gap-4 p-2">
        <CardWithIcon icon="traffic-light" :text="myip.asOrganization"></CardWithIcon>
        <CardWithIcon icon="sign-out-alt" :text="myip.ip"></CardWithIcon>
        <CardWithSlot icon="cloud-computing">
          <select class="select select-primary w-full max-w-xs">
            <option disabled selected>Select Country</option>
            <option v-for="country in countries">{{ country }}</option>
          </select>
        </CardWithSlot>
      </div>
    </div>
    <div class="lg:col-start-2 lg:col-end-7 p-2 gap-3 flex flex-wrap justify-start">
      <span v-for="proxy in proxies">
        <ProxyCard :isp="proxy.isp" :ip-port="`${proxy.ip}:${proxy.port}`" :country="proxy.country"></ProxyCard>
      </span>
    </div>
  </div>
  <div class="flex justify-center">
    <div class="join mb-10">
      <input class="join-item btn btn-square" type="radio" name="options" aria-label="1" :checked="true" />
      <input class="join-item btn btn-square" type="radio" name="options" aria-label="2" />
      <input class="join-item btn btn-square" type="radio" name="options" aria-label="3" />
      <input class="join-item btn btn-square" type="radio" name="options" aria-label="4" />
    </div>
  </div>
</template>
