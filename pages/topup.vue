<template>
  <div class="min-h-screen bg-base-100 p-4 flex justify-center items-center">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-lg p-6">
      <h1 class="text-xl font-bold text-center mb-4">Top-Up Game & Wallet Digital</h1>

      <form @submit.prevent="submitTopup">
        <label class="block mb-2">Pilih Layanan</label>
        <select v-model="selectedService" @change="updateOptions" class="w-full p-2 border rounded mb-4" required>
          <option v-for="(service, index) in services" :key="index" :value="service.name">{{ service.name }}</option>
        </select>

        <label class="block mb-2">User ID</label>
        <input
          v-model="userId"
          type="text"
          placeholder="Masukkan User ID"
          class="w-full p-2 border rounded mb-4"
          required
        />

        <label class="block mb-2">Pilih Jumlah</label>
        <select v-model="selectedAmount" class="w-full p-2 border rounded mb-4" required>
          <option v-for="(amount, index) in selectedOptions" :key="index" :value="amount">{{ amount }}</option>
        </select>

        <label class="block mb-2">Metode Pembayaran</label>
        <select v-model="selectedPayment" class="w-full p-2 border rounded mb-4" required>
          <option v-for="(method, index) in paymentMethods" :key="index" :value="method">{{ method }}</option>
        </select>

        <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded">Top-Up Sekarang</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const userId = ref("");
const selectedService = ref("Mobile Legends");
const selectedAmount = ref("");
const selectedPayment = ref("");

const services = [
  { name: "Mobile Legends", options: [86, 172, 257, 344, 429, 514, 600, 706, 875, 1000] },
  { name: "Free Fire", options: [70, 140, 210, 280, 355, 500, 720, 1000, 1450, 2000] },
  { name: "Steam Wallet", options: [5000, 10000, 20000, 50000, 100000] },
  { name: "PUBG Mobile", options: [60, 180, 325, 660, 1320, 1980, 2640] },
  { name: "Genshin Impact", options: [60, 300, 980, 1980, 3280, 6480] },
];

const paymentMethods = ["GoPay", "Dana", "OVO", "ShopeePay", "Transfer Bank", "Kartu Kredit"];

const selectedOptions = computed(() => {
  return services.find((service) => service.name === selectedService.value)?.options || [];
});

const updateOptions = () => {
  selectedAmount.value = "";
};

const submitTopup = () => {
  alert(
    `Top-Up ${selectedAmount.value} ${selectedService.value} ke User ID ${userId.value} menggunakan ${selectedPayment.value}`
  );
};
</script>
