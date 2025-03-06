<script setup lang="ts">
import { daisyui } from "#tailwind-config";

const routerPaths = ref([
  { name: "Home", path: "/" },
  { name: "Nautica", path: "/nautica" },
  { name: "About", path: "/" },
  { name: "Tools", path: "/" },
]);

const props = defineProps({
  name: String,
  root: String,
});
</script>

<template>
  <div class="navbar bg-base-100 px-[10%] z-50 sticky">
    <div class="flex-1">
      <NuxtLink to="/" class="btn btn-ghost text-xl">{{ props.name }}</NuxtLink>
    </div>
    <div class="flex-none">
      <ul class="menu menu-horizontal px-1 font-bold gap-2 h-max lg:flex items-center hidden">
        <li v-for="routerPath in routerPaths">
          <NuxtLink :to="routerPath.path">{{ routerPath.name }}</NuxtLink>
        </li>
        <div class="dropdown dropdown-bottom dropdown-end w-max">
          <div tabindex="0" role="button" class="btn m-1">Themes</div>
          <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-[1] p-2 shadow w-52">
            <li v-for="theme in daisyui.themes">
              <input
                type="radio"
                name="theme-dropdown"
                class="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                :aria-label="theme"
                :value="theme"
              />
            </li>
          </ul>
        </div>
      </ul>
      <div class="dropdown dropdown-end lg:hidden">
        <div tabindex="0" role="button" class="btn btn-sm m-1">Menu</div>
        <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
          <li v-for="routerPath in routerPaths">
            <NuxtLink :to="routerPath.path">{{ routerPath.name }}</NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
