<template>
  <div class="mb-3 h-max">
    <swiper
      :slides-per-view="1"
      :space-between="50"
      loop
      @swiper="onSwiper"
      @slideChange="onSlideChange"
      autoHeight
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
import { Swiper } from "swiper/vue";
import type { Swiper as SwiperType } from "swiper/types";
import BaseTab from "./BaseTab.vue";
import { watch } from "vue";
import { useMealStore } from "@/stores/meal";

// Import Swiper styles
import "swiper/css";

const mealStore = useMealStore();

defineProps<{
  tabTitles: string[];
  activeIndex: number;
}>();

const emit = defineEmits(["toggle"]);

let swiperIns: SwiperType | null = null;
const onSwiper = (swiper: SwiperType) => {
  swiperIns = swiper;
  emit("toggle", swiper.realIndex);
};
const onSlideChange = () => {
  if (swiperIns) {
    emit("toggle", swiperIns.realIndex);
  }
};

const handelToggle = (index: number) => {
  if (swiperIns) {
    swiperIns.slideToLoop(index);
    emit("toggle", swiperIns.realIndex);
  }
};

watch(mealStore.todayMeals, () => {
  setTimeout(() => {
    swiperIns?.updateAutoHeight(100);
  }, 300);
});
</script>

<style lang="scss" scoped></style>
