<script setup lang="ts">
import prettyBytes from "pretty-bytes";

const refreshInterval = ref(2);
const serverList = ref([
  { url: "id1.foolvpn.me", ping: [], info: {}, status: {}, speed: {}, errors: [] },
  { url: "id2.foolvpn.me", ping: [], info: {}, status: {}, speed: {}, errors: [] },
  { url: "sg1.foolvpn.me", ping: [], info: {}, status: {}, speed: {}, errors: [] },
  { url: "sg2.foolvpn.me", ping: [], info: {}, status: {}, speed: {}, errors: [] },
]);

async function getServerPing(server: string) {
  try {
    const startTime = new Date().getTime();
    const res = await fetch(`https://${server}/api/v1/ping`);
    const finishTime = new Date().getTime();

    if (res.status == 200) {
      return { error: false, result: finishTime - startTime };
    } else throw new Error(res.statusText);
  } catch (e: any) {
    return { error: true, message: e.message };
  }
}

async function getServerInfo(server: string) {
  try {
    const res = await fetch(`https://${server}/api/v1/info`);
    if (res.status == 200) {
      return { error: false, result: await res.json() };
    } else throw new Error(res.statusText);
  } catch (e: any) {
    return { error: true, message: e.message };
  }
}

async function getServerStatus(server: string) {
  try {
    const res = await fetch(`https://${server}/api/v1/status`);
    if (res.status == 200) {
      return { error: false, result: await res.json() };
    } else throw new Error(res.statusText);
  } catch (e: any) {
    return { error: true, message: e.message };
  }
}

function getFlagEmoji(countryCode: string) {
  if (!countryCode) return "🏴";
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) =>
      String.fromCodePoint(127397 + char.charCodeAt(0))
    );
}

onMounted(async () => {
  for (let server of serverList.value) {
    getServerInfo(server.url).then((res) => {
      if (res.error) server.errors.unshift(res.message);
      else server.info = res.result;
    });

    setInterval(() => {
      for (const s of serverList.value) {
        if (s.errors.length) s.errors.pop();
      }
    }, 5000);

    setInterval(async () => {
      getServerStatus(server.url).then((res) => {
        if (res.error) {
          server.errors.unshift(res.message);
          return;
        }

        const prev = server.status?.nic?.[0] || { bytesSent: 0, bytesRecv: 0 };
        const nic = res.result.nic[0];

        server.speed.upload =
          (nic.bytesSent - prev.bytesSent) / refreshInterval.value;
        server.speed.download =
          (nic.bytesRecv - prev.bytesRecv) / refreshInterval.value;

        server.status = res.result;
      });

      getServerPing(server.url).then((res) => {
        if (res.error) server.errors.unshift(res.message);
        server.ping.push({
          delay: res.result || 0,
          date: new Date(),
        });
        if (server.ping.length > 22) server.ping.shift();
      });
    }, refreshInterval.value * 1000);
  }
});
</script>

<template>
  <div class="my-10 mx-auto max-w-6xl px-4">
    <div class="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
      <div
        v-for="server in serverList"
        :key="server.url"
        class="bg-[#121212] border border-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
      >
        <div class="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="text-3xl">{{ getFlagEmoji(server.info.country || "") }}</span>
            <div>
              <h3 class="text-lg font-semibold text-gray-100">
                {{ server.info.country_name || "Fetching..." }}
              </h3>
              <p class="text-sm text-gray-400 italic">{{ server.url }}</p>
            </div>
          </div>
          <span
            v-if="server.errors.length"
            class="text-xs bg-red-500/20 text-red-400 px-3 py-1 rounded-full"
          >
            {{ server.errors[0] }}
          </span>
        </div>

        <div class="px-6 py-4 space-y-4 text-gray-300">
          <!-- Info Section -->
          <div v-if="server.status.host" class="text-xs text-gray-400">
            <span>{{ server.status.host.os }}</span> /
            <span>{{ server.status.host.platform }}</span> /
            <span>{{ server.status.host.platformVersion }}</span>
          </div>
          <div v-else class="text-sm text-gray-500 italic">Fetching host info...</div>

          <!-- Metrics -->
          <div v-if="server.status.cpu" class="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <p class="text-sm text-gray-400">CPU</p>
              <p class="font-bold text-gray-100">
                {{ parseInt(server.status.cpu[0]).toFixed() }}%
              </p>
              <progress
                class="progress progress-secondary w-full"
                :value="parseInt(server.status.cpu[0]).toFixed()"
                max="100"
              ></progress>
            </div>

            <div>
              <p class="text-sm text-gray-400">RAM</p>
              <p class="font-bold text-gray-100">
                {{ prettyBytes(server.status.mem?.used || 0) }}
              </p>
              <progress
                class="progress progress-secondary w-full"
                :value="server.status.mem?.used || 0"
                :max="server.status.mem?.total || 1"
              ></progress>
            </div>

            <div>
              <p class="text-sm text-gray-400">Ping</p>
              <p class="font-bold text-gray-100">
                {{ server.ping[server.ping.length - 1]?.delay || 0 }} ms
              </p>
              <progress
                class="progress progress-secondary w-full"
                :value="server.ping.filter((p) => p.delay > 0).length"
                :max="server.ping.length"
              ></progress>
            </div>
          </div>

          <div v-else class="skeleton bg-gray-800 w-full h-16 rounded-md"></div>

          <!-- Speed Section -->
          <div
            v-if="server.status.nic"
            class="grid grid-cols-2 sm:grid-cols-2 gap-4 pt-3 border-t border-gray-700"
          >
            <div>
              <p class="text-sm text-gray-400">Upload</p>
              <p class="font-semibold text-gray-100">{{ prettyBytes(server.speed.upload || 0) }}/s</p>
              <p class="text-xs text-gray-500">
                Total: {{ prettyBytes(server.status.nic[0]?.bytesSent || 0) }}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-400">Download</p>
              <p class="font-semibold text-gray-100">{{ prettyBytes(server.speed.download || 0) }}/s</p>
              <p class="text-xs text-gray-500">
                Total: {{ prettyBytes(server.status.nic[0]?.bytesRecv || 0) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Ping Indicator -->
        <div
          v-if="server.ping.length"
          class="border-t border-gray-800 bg-[#1c1c1c] px-4 py-3 flex flex-wrap gap-1 justify-end"
        >
          <div
            v-for="pingData in server.ping"
            :key="pingData.date"
            class="tooltip"
            :data-tip="`${pingData.delay} ms (${pingData.date.toLocaleTimeString()})`"
          >
            <div
              class="w-2 h-2 rounded-full"
              :class="pingData.delay > 0 ? 'bg-green-500' : 'bg-red-500'"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
