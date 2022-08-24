<template>
  <div class="h-max">
    <slot name="title" />
    <AppTabVue
      :tabTitles="cates"
      :activeIndex="activeIndex"
      @toggle="handleToggle"
    >
      <SwiperSlide
        v-for="(mealsByPeriod, index) in mealsByPeriodList"
        :key="index"
      >
        <AppCard class="mt-3">
          <div
            class="grid grid-cols-2 gap-3"
            v-if="mealsByPeriod.meals.length >= 1"
          >
            <MealCard
              v-for="meal in mealsByPeriod.meals"
              :key="meal.id"
              class="col-span-1"
              :meal="meal"
              @click="$emit('click:item', meal.id)"
            />
          </div>
          <img
            v-else
            src="https://cdn-icons-png.flaticon.com/512/2039/2039083.png"
            alt="空"
            class="w-1/5 block aspect-square object-cover m-auto my-3"
          />
        </AppCard>
      </SwiperSlide>
    </AppTabVue>

    <slot name="footer" />
  </div>
</template>

<script setup lang="ts">
import AppTabVue from "../elements/AppTab.vue";
import AppCard from "../elements/AppCard.vue";
import SmallCardVue from "../elements/SmallCard.vue";
import AppAvatar from "../elements/AppAvatar.vue";
import { ref } from "vue";
import { cates } from "@/db/mealTypes";
import type { MealsByPeriod } from "@/db/mealTypes";
import { SwiperSlide } from "swiper/vue";

defineProps<{
  mealsByPeriodList: MealsByPeriod[];
}>();

const emit = defineEmits(["click:item", "toggle"]);

/**
 * Meal
 */

const activeIndex = ref(0);

function handleToggle(index: number) {
  activeIndex.value = index;
  emit("toggle", index);
}
</script>

<style lang="scss" scoped></style>
