<template>
  <div
    class="relative border rounded-md border-black flex bg-green-400 z-0 text-slate-900 gap-0"
  >
    <button
      class="w-full grow-0 h-full rounded-md transition-all duration-200 ease-in text-lg"
      :class="{ 'btn-active': activeIndex === index }"
      v-for="(tabTitle, index) in tabTitles"
      :key="tabTitle"
      @click="toggleActive(index)"
    >
      {{ tabTitle }}
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  tabTitles: string[];
  activeIndex: number;
}

defineProps<Props>();

const emit = defineEmits(["update:activeIndex"]);

/**
 * Toggle Active Tab
 */
function toggleActive(index: number) {
  emit("update:activeIndex", index);
}
</script>

<style lang="scss" scoped>
.btn-active {
  @apply bg-green-700 border border-green-600 text-slate-100 font-bold shadow-inner shadow-green-900;
}
</style>
