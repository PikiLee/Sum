<template>
  <div class="fixed top-0 left-0 bg-green-400 h-2 w-full z-40" ref="bar">
    <img
      src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png"
      alt="汉堡"
      class="absolute w-6 aspect-square object-cover right-0 top-1/2 translate-x-1/2 -translate-y-1/2"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { gsap } from "gsap";
import { isProgressing } from "./useProgressBar";

const bar = ref(null);

const tl = gsap.timeline({ defaults: { ease: "none" } });

onMounted(() => {
  gsap.set(bar.value, {
    transformOrigin: "left center",
    width: 0,
  });

  tl.fromTo(
    bar.value,
    {
      width: 0,
    },
    {
      width: () => window.innerWidth * 0.75,
      duration: 1,
    }
  )
    .addLabel("done")
    .to(bar.value, {
      width: () => window.innerWidth,
      duration: 0.33,
    })
    .set(bar.value, {
      width: 0,
    });
});

watch(isProgressing, (newValue) => {
  if (newValue === 1 || newValue === 2) {
    tl.timeScale(1);
    tl.restart().play();
    tl.addPause("done");
  } else {
    tl.removePause("done");
    tl.timeScale(3);
    tl.play();
  }
});
</script>

<style lang="scss" scoped></style>
