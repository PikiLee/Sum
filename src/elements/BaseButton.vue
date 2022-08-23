<template>
  <button
    class="relative w-32 py-1 border border-black rounded-lg bg-green-400 font-bold cursor-pointer"
    :type="htmlType"
    @click="handleClick"
  >
    <span
      class="absolute inset-0 bg-white -z-10 translate-x-1 translate-y-1 border border-black rounded-lg"
    ></span>
    <transition @enter="animateLoading">
      <p v-if="isLoading" ref="loadingEl">加载中</p>
      <template v-else>
        <slot />
      </template>
    </transition>
  </button>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";

gsap.registerPlugin(TextPlugin);

interface Props {
  isLoading?: boolean;
  htmlType?: "button" | "submit" | "reset" | undefined;
}

const props = defineProps<Props>();
const emit = defineEmits(["click"]);

/**
 * Handle Click
 */
function handleClick(e: Event) {
  if (props.isLoading) {
    e.preventDefault();
    return;
  }
  emit("click");
}

/**
 * Loading Animation
 */
const loadingEl = ref(null);

function animateLoading(_: Element, done: () => void) {
  if (loadingEl.value) {
    gsap.to(loadingEl.value, {
      text: {
        value: "加载中。。。",
        type: "diff",
      },
      duration: 1,
      repeat: -1,
      yoyo: true,
      onComplete: () => done(),
    });
  } else {
    done();
  }
}
</script>

<style lang="scss" scoped></style>
