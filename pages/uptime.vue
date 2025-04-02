<script setup lang="ts">
import prettyBytes from "pretty-bytes";

const refreshInterval = ref(3);
const serverList = ref<
  Array<{
    url: string;
    ping: number;
    info: any;
    status: any;
    speed: any;
  }>
>([
  {
    url: "id1.foolvpn.me",
    ping: 0,
    info: {},
    status: {},
    speed: {},
  },
  {
    url: "sg1.foolvpn.me",
    ping: 0,
    info: {},
    status: {},
    speed: {},
  },
]);

async function getServerPing(server: string) {
  const startTime = new Date().getTime();
  const res = await fetch(`https://${server}/api/v1/ping`);
  const finishTime = new Date().getTime();
  if (res.status == 200) {
    for (const i in serverList.value) {
      if (serverList.value[i].url == server) {
        serverList.value[i].ping = finishTime - startTime;
      }
    }
  }
}

async function getServerInfo(server: string) {
  const res = await fetch(`https://${server}/api/v1/info`);
  if (res.status == 200) {
    for (const i in serverList.value) {
      if (serverList.value[i].url == server) {
        serverList.value[i].info = await res.json();
      }
    }
  }
}

async function getServerStatus(server: string) {
  const res = await fetch(`https://${server}/api/v1/status`);
  if (res.status == 200) {
    for (const i in serverList.value) {
      if (serverList.value[i].url == server) {
        const resJson = await res.json();
        serverList.value[i].speed["upload"] =
          (resJson.nic[0].bytesSent - serverList.value[i].status.nic?.[0].bytesSent) / refreshInterval.value;
        serverList.value[i].speed["download"] =
          (resJson.nic[0].bytesRecv - serverList.value[i].status.nic?.[0].bytesRecv) / refreshInterval.value;
        serverList.value[i].status = resJson;
      }
    }
  }
}

onMounted(() => {
  for (const server of serverList.value) {
    getServerInfo(server.url);

    setInterval(() => {
      getServerStatus(server.url);
      getServerPing(server.url);
    }, refreshInterval.value * 1000);
  }
});
</script>

<template>
  <div class="flex justify-center">
    <div class="w-[80%] lg:w-[50%] flex justify-around flex-wrap gap-2 p-2">
      <Card v-for="server in serverList">
        <div
          class="mx-5 my-2 grid grid-rows-3 lg:grid-rows-none lg:grid-cols-3 font-bold"
          v-if="server.info.country && server.status.mem"
        >
          <div class="flex items-center justify-center lg:justify-start font-bold gap-3">
            <span class="text-3xl hidden lg:block">
              {{ getFlagEmoji(server.info.country) }}
            </span>
            <div class="flex flex-col items-center lg:items-start">
              <span class="text-sm">
                {{ server.info.country_name }}
              </span>
              <span class="text-xl">
                {{ server.info.org }}
              </span>
              <span class="text-xs font-normal italic">
                {{ server.status.host.os }}
                {{ server.status.host.platformFamily }}
                {{ server.status.host.platformVersion }}
              </span>
            </div>
          </div>
          <div class="row-span-2 lg:col-span-2 flex justify-center items-center gap-5">
            <div class="flex gap-5">
              <div class="flex flex-col">
                <div>Ping</div>
                <div class="text-xs">{{ server.ping }} ms</div>
              </div>
              <div class="flex flex-col">
                <div>CPU</div>
                <div class="text-xs">{{ parseInt(server.status.cpu[0]).toFixed() }} %</div>
                <div>
                  <progress
                    class="progress progress-secondary w-12"
                    :value="parseInt(server.status.cpu[0]).toFixed()"
                    max="100"
                  ></progress>
                </div>
              </div>
              <div class="flex flex-col">
                <div>RAM</div>
                <div class="text-xs">{{ prettyBytes(server.status.mem.used) }}</div>
                <div>
                  <progress
                    class="progress progress-secondary w-12"
                    :value="server.status.mem.used"
                    :max="server.status.mem.total"
                  ></progress>
                </div>
              </div>
              <div class="flex flex-col">
                <div>Upload</div>
                <div class="text-xs">
                  {{ prettyBytes(server.speed.upload) }}
                </div>
                <div>
                  {{ prettyBytes(server.status.nic[0].bytesSent) }}
                </div>
              </div>
              <div class="flex flex-col">
                <div>Download</div>
                <div class="text-xs">
                  {{ prettyBytes(server.speed.download) }}
                </div>
                <div>
                  {{ prettyBytes(server.status.nic[0].bytesRecv) }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="h-24 w-full skeleton"></div>
      </Card>
    </div>
  </div>
</template>
