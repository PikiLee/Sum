<script setup lang="ts">
import { onMounted, ref } from "vue";
import { RouterView } from "vue-router";
import AppNavVue from "./components/AppNav.vue";

const navBar = ref<InstanceType<typeof AppNavVue> | null>(null);
const wrapper = ref<HTMLDivElement | null>(null);
onMounted(() => {
  if (wrapper.value && navBar.value) {
    wrapper.value.style.setProperty("--pb", `${navBar.value.height * 2}px`);
  }
});
</script>

<template>
  <div class="container px-4 wrapper mx-auto" ref="wrapper">
    <AppNavVue ref="navBar" />
    <AppNotis />
    <RouterView />
  </div>
  <ProgressBar />
</template>

<style scoped>
.wrapper {
  --pb: 10rem;
  padding-bottom: var(--pb);
}
</style>
