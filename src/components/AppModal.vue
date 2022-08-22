<template>
  <Teleport to="body">
    <transition @enter="animateModalEnter" @leave="animateModalLeave">
      <div
        class="fixed w-10/12 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-5 z-50"
        v-if="isOpen"
      >
        <!-- Background -->
        <span
          class="absolute inset-0 bg-white border border-black rounded-3xl -z-10"
        ></span>
        <span
          class="absolute w-5/6 h-full left-1/2 top-0 -translate-x-1/2 bg-white border border-black rounded-3xl -z-20 translate-y-2"
        ></span>
        <span
          class="absolute w-4/6 h-full left-1/2 top-0 -translate-x-1/2 bg-white border border-black rounded-3xl -z-30 translate-y-4"
        ></span>
        <h2
          class="text-lg font-bold text-center underline decoration-solid decoration-1 underline-offset-8 pb-3"
          v-if="title"
        >
          {{ title }}
        </h2>
        <!-- Default Slot -->
        <slot />
        <!-- Footer -->
        <p class="text-red-500 text-center mt-4" v-if="error">{{ error }}</p>
        <div class="flex item-center justify-center gap-2 w-full mt-6">
          <slot name="footer">
            <BaseButton @click="$emit('cancel')">取消</BaseButton>
            <BaseButton @click="$emit('ok')" :isLoading="isLoading"
              >确定</BaseButton
            >
          </slot>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import BaseButton from "../elements/BaseButton.vue";
import { gsap } from "gsap";

defineProps({
  isOpen: {
    type: Boolean,
    required: false,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
  },
  title: {
    type: String,
  },
});

defineEmits(["cancel", "ok"]);

/**
 * Animations
 */
function animateModalEnter(el, done) {
  gsap.from(el, {
    scale: 0,
    opacity: 0,
    duration: 0.3,
    ease: "back",
    onComplete: () => done(),
  });
}

function animateModalLeave(el, done) {
  gsap.to(el, {
    scale: 0,
    opacity: 0,
    duration: 0.2,
    ease: "power1.in",
    onComplete: () => done(),
  });
}
</script>

<style lang="scss" scoped></style>
