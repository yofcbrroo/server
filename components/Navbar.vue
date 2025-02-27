<script setup lang="ts">
import { daisyui } from "#tailwind-config";

const props = defineProps({
  name: String,
  root: String,
});
</script>

<template>
  <div class="navbar bg-base-100 px-[10%]">
    <div class="flex-1">
      <NuxtLink to="/" class="btn btn-ghost text-xl">{{ props.name }}</NuxtLink>
    </div>
    <div class="flex-none">
      <ul class="menu menu-horizontal px-1 font-bold gap-2 h-max flex items-center">
        <li><NuxtLink to="/">Home</NuxtLink></li>
        <li><NuxtLink to="/">About</NuxtLink></li>
      </ul>
      <div class="dropdown dropdown-bottom">
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
    </div>
  </div>
</template>
