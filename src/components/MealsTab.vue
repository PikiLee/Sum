<template>
  <div>
    <slot name="title" />
    <AppTabVue
      :tabTitles="cates"
      :activeIndex="activeIndex"
      @toggle="handleToggle"
    >
      <AppCard
        v-for="(mealsByPeriod, index) in mealsByPeriodList"
        :key="index"
        ref="tabs"
        class="mt-3"
      >
        <div
          class="grid grid-cols-2 gap-3"
          v-if="mealsByPeriod.meals.length > 1"
        >
          <SmallCardVue
            v-for="meal in mealsByPeriod.meals"
            :key="meal.id"
            class="col-span-1"
            @click="$emit('click:item', meal.id)"
          >
            <div class="grid grid-cols-3 gap-2 h-full">
              <AppAvatar
                :imgSrc="meal.material.imgUrl"
                size="small"
                class="row-start-1 row-span-2 col-span-1 self-center justify-self-center"
              />
              <h2 class="row-start-3 col-span-1 text-center text-sm">
                {{ meal.material.name }}
              </h2>
              <h2 class="col-span-2 text-center text-md">
                {{ meal.amount }}克
              </h2>
              <h2
                class="col-span-2 text-center text-xs flex items-center justify-center"
              >
                {{ meal.material.caloriesPerHundredGram }}千卡每100克
              </h2>
              <h2 class="col-span-2 text-center">
                <span class="text-xl font-bold text-orange-400 align-baseline">
                  {{ meal.calories }}
                </span>
                <span class="align-baseline"> 千卡 </span>
              </h2>
            </div>
          </SmallCardVue>
        </div>
        <img
          v-else
          src="https://cdn-icons-png.flaticon.com/512/2039/2039083.png"
          alt="空"
          class="w-1/5 block aspect-square object-cover m-auto my-3"
        />
      </AppCard>
    </AppTabVue>
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

defineProps<{
  mealsByPeriodList: MealsByPeriod[];
}>();

const emit = defineEmits(["click:item", "toggle"]);

/**
 * Meal
 */

const activeIndex = ref(0);

const tabs = ref(null);

function handleToggle(index: number) {
  activeIndex.value = index;
  emit("toggle", index);
}
</script>

<style lang="scss" scoped></style>
