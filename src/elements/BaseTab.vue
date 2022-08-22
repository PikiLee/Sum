<template>
  <div
    class="relative border rounded-md border-black flex bg-green-400 z-0 text-white"
    ref="group"
  >
    <span
      class="absolute bg-white -z-10 rounded-md shadow-2xl shadow-orange-400 active"
      ref="active"
    ></span>
    <button
      class="w-1/4 grow-0 transition-all duration-500 ease-in delay-300 text-lg"
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
import { gsap } from "gsap";
import { onMounted, ref } from "vue";

interface Props {
  tabTitles: string[];
  activeIndex: number;
}

const props = defineProps<Props>();

const emit = defineEmits(["update:activeIndex"]);

/**
 * Toggle Active Tab
 */
const active = ref(null);
const group = ref<HTMLDivElement | null>(null);

function toggleActive(index: number) {
  animateActive(index);
  emit("update:activeIndex", index);
}

// animation
function animateActive(index: number) {
  gsap.to(active.value, {
    x: () => (group.value?.offsetWidth ?? 0) * 0.25 * index,
    duration: 1,
  });
}

onMounted(() => {
  animateActive(props.activeIndex);
});
</script>

<style lang="scss" scoped>
.active {
  width: 21%;
  left: 2%;
  top: 7%;
  height: 86%;
}

.btn-active {
  color: black;
}
</style>
