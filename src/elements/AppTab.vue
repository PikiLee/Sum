<template>
  <div class="mb-3">
    <swiper
      :slides-per-view="1"
      :space-between="50"
      loop
      @swiper="onSwiper"
      @slideChange="onSlideChange"
    >
      <slot />
      <template v-slot:container-start>
        <BaseTab
          :tabTitles="tabTitles"
          :activeIndex="activeIndex"
          class="my-3"
          @update:activeIndex="handelToggle"
        />
      </template>
    </swiper>
  </div>
</template>

<script setup lang="ts">
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from "swiper/vue";
import type { Swiper as SwiperType } from "swiper/types";
import DefaultImg from "../assets/imgs/default.jpg";
import BaseTab from "./BaseTab.vue";
import { ref } from "vue";

// Import Swiper styles
import "swiper/css";

defineProps<{
  tabTitles: string[];
}>();

const activeIndex = ref(0);
let swiperIns: SwiperType | null = null;
const onSwiper = (swiper: SwiperType) => {
  swiperIns = swiper;
  activeIndex.value = swiper.realIndex;
};
const onSlideChange = () => {
  if (swiperIns) {
    activeIndex.value = swiperIns.realIndex;
  }
};

const handelToggle = (index: number) => {
  if (swiperIns) {
    swiperIns?.slideTo(index);
    activeIndex.value = index;
  }
};
</script>

<style lang="scss" scoped></style>
