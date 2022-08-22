<template>
  <div class="w-full h-screen flex flex-col items-center justify-center gap-8">
    <!-- Car2 -->
    <AppCard class="w-11/12 p-10">
      <div class="relative w-full aspect-square">
        <div
          class="w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 aspect-square mx-auto rounded-full border border-dashed border-neutral-400"
        ></div>
        <div
          class="w-8/12 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 aspect-square mx-auto rounded-full border border-dashed border-neutral-400"
        ></div>
        <div
          class="w-5/12 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 aspect-square mx-auto rounded-full border border-dashed border-neutral-400"
        ></div>

        <!-- POINTS -->
        <span
          class="absolute top-0 left-1/2 w-3 aspect-square border-1 border-solid rounded-full bg-sky-200 -translate-y-1/2"
        ></span>
        <span
          class="absolute left-1/3 top-1/3 w-3 aspect-square border-1 border-solid rounded-full bg-lime-200"
        ></span>
        <span
          class="absolute left-1/2 top-2/3 w-3 aspect-square border-1 border-solid rounded-full bg-orange-200 translate-y-1/2"
        ></span>
        <span
          class="absolute left-full top-1/2 w-3 aspect-square border-1 border-solid rounded-full bg-lime-200 -translate-x-1/2"
        ></span>
        <span
          class="absolute left-0 top-1/3 w-3 aspect-square border-1 border-solid rounded-full bg-rose-200"
        ></span>

        <!-- AVATARS -->
        <AppAvatar
          :imgSrc="DefaultImg"
          size="large"
          borderRotate
          class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        />
        <AppAvatar
          :imgSrc="DefaultImg"
          borderRotate
          class="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2"
        />
        <AppAvatar
          :imgSrc="DefaultImg"
          borderRotate
          class="absolute left-3/4 top-3/4 -translate-x-1/2 -translate-y-1/2"
        />
        <AppAvatar
          :imgSrc="DefaultImg"
          borderRotate
          class="absolute left-2/3 top-1/4 -translate-x-1/2 -translate-y-1/2"
        />
        <AppAvatar
          :imgSrc="DefaultImg"
          borderRotate
          class="absolute left-1/3 top-2/3 -translate-x-1/2 -translate-y-1/2"
        />
      </div>
    </AppCard>

    <!-- Loading -->
    <h1 class="text-xl font-bold" ref="loading">加载中</h1>
  </div>
</template>

<script>
import DefaultImg from "../assets/imgs/default.jpg";
import AppAvatar from "../elements/AppAvatar.vue";
import { TextPlugin } from "gsap/TextPlugin";
import { onMounted, ref } from "vue";
import { gsap } from "gsap";
import AppCard from "../elements/AppCard.vue";

export default {
  components: {
    AppAvatar,
    AppCard,
  },
  setup() {
    gsap.registerPlugin(TextPlugin);

    const loading = ref(null);
    onMounted(() => {
      gsap.to(loading.value, {
        text: {
          value: "加载中。。。",
          diff: true,
        },
        duration: 1,
        repeat: -1,
        yoyo: true,
      });
    });
    return { DefaultImg, loading };
  },
};
</script>

<style lang="scss" scoped></style>
