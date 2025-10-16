<script setup lang="ts">
const parameters = [
  { key: "pass", desc: "Enter password", isMultiple: false, example: "&pass=fool" },
  { key: "free", desc: "Select free VPN only", isMultiple: false, example: "&free=1" },
  { key: "premium", desc: "Select premium VPN only", isMultiple: false, example: "&premium=1" },
  { key: "vpn", desc: "Select VPN by protocol", isMultiple: true, example: "&vpn=vmess" },
  { key: "format", desc: "Select format", isMultiple: false, example: "&format=clash" },
  { key: "region", desc: "Select VPN by region", isMultiple: true, example: "&region=Asia" },
  { key: "cc", desc: "Select VPN by country code", isMultiple: true, example: "&cc=SG" },
  { key: "include", desc: "Select VPN by name", isMultiple: true, example: "&include=melbi" },
  { key: "exclude", desc: "Exclude VPN by name", isMultiple: true, example: "&exclude=amazon" },
  { key: "tls", desc: "Select VPN TLS or NTLS", isMultiple: false, example: "&tls=1" },
  { key: "network", desc: "Select VPN by network type", isMultiple: true, example: "&network=ws" },
  { key: "port", desc: "Select VPN by port", isMultiple: true, example: "&port=80,443" },
  { key: "ip", desc: "Convert VPN host domain to IP", isMultiple: false, example: "&ip=1" },
  { key: "sni", desc: "Set VPN with SNI host", isMultiple: true, example: "&sni=sni.host" },
  { key: "cdn", desc: "Set VPN with CDN host", isMultiple: true, example: "&cdn=cdn.host" },
  { key: "mode", desc: "Select connection mode", isMultiple: true, example: "&mode=cdn" },
  { key: "limit", desc: "Limit the number of VPNs", isMultiple: false, example: "&limit=10" },
  { key: "subdomain", desc: "Add subdomain to server domain", isMultiple: false, example: "&subdomain=zoom.us" },
  { key: "arg", desc: "Enter key-value pair", isMultiple: true, example: "&arg=xudp,key:value" },
];
</script>

<template>
  <div class="my-10 mx-auto max-w-6xl px-4">
    <div class="bg-[#121212] rounded-2xl shadow-xl border border-gray-800 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
        <h2 class="text-2xl font-semibold text-gray-100">Available Parameters</h2>
        <span class="text-sm text-gray-400">API Configuration Guide</span>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full text-sm text-gray-300">
          <thead class="bg-[#1c1c1c] text-gray-200 uppercase text-xs tracking-wider">
            <tr>
              <th class="px-4 py-3 text-left">Key</th>
              <th class="px-4 py-3 text-left">Description</th>
              <th class="px-4 py-3 text-center">Multiple</th>
              <th class="px-4 py-3 text-left">Example</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="data in parameters"
              :key="data.key"
              class="border-b border-gray-800 hover:bg-[#1e1e1e] transition-colors"
            >
              <td class="px-4 py-3 font-semibold text-gray-100">{{ data.key }}</td>
              <td class="px-4 py-3 text-gray-400">{{ data.desc }}</td>
              <td class="px-4 py-3 text-center">
                <span
                  class="px-2 py-1 rounded-full text-xs font-bold"
                  :class="data.isMultiple ? 'bg-green-600/30 text-green-400' : 'bg-red-600/30 text-red-400'"
                >
                  {{ data.isMultiple ? 'Yes' : 'No' }}
                </span>
              </td>
              <td class="px-4 py-3 font-mono text-gray-300">{{ data.example }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
