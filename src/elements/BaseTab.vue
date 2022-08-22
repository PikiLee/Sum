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

<script setup>
import { gsap } from "gsap";
import { onMounted, ref } from "vue";

const props = defineProps({
  tabTitles: {
    type: Array,
    required: true,
  },
  activeIndex: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["update:activeIndex"]);

/**
 * Toggle Active Tab
 */
const active = ref(null);
const group = ref(null);

function toggleActive(index) {
  animateActive(index);
  emit("update:activeIndex", index);
}

// animation
function animateActive(index) {
  gsap.to(active.value, {
    x: () => group.value.offsetWidth * 0.25 * index,
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
