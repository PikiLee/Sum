<template>
  <div
    class="fixed top-9 left-1/2 -translate-x-1/2 z-100 select-hone pointer-events- z-50"
  >
    <TransitionGroup @enter="onEnter" @leave="onLeave">
      <AppNoti :type="noti.type" v-for="noti in notis" :key="noti.message">{{
        noti.message
      }}</AppNoti>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { gsap } from "gsap";
import { notis } from "@/plugins/useNoti";

function onEnter(el: Element, done: () => void) {
  gsap.from(el, {
    scale: 0,
    y: () => window.innerHeight * -1,
    ease: "back(1)",
    onComplete: done,
  });
}

function onLeave(el: Element, done: () => void) {
  gsap.to(el, {
    scale: 0,
    onComplete: done,
  });
}
</script>

<style lang="scss" scoped></style>
