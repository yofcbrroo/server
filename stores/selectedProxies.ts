export const useSelectedProxiesStore = defineStore("selectedProxies", () => {
  const selectedProxies = ref<string[]>([]);

  // Getters
  const getSelectedProxies = computed(() => selectedProxies.value);

  // Setters
  function toggleSelectedProxies(id: string) {
    if (selectedProxies.value.includes(id)) {
      selectedProxies.value.splice(selectedProxies.value.indexOf(id), 1);
    } else {
      selectedProxies.value.push(id);
    }
  }

  return { selectedProxies, getSelectedProxies, toggleSelectedProxies };
});
