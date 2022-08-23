<template>
  <div class="grid grid-cols-2 justify-items-center gap-2">
    <span
      class="col-span-1"
      v-for="(mealsByPeriod, period) in transFormedTodayMeals.mealsByPeriod"
      :key="period"
      >{{ Category[period] }}：{{ mealsByPeriod.caloriesByPeriod }}千卡</span
    >
  </div>
  <h2 class="text-center mt-2">
    总共： {{ transFormedTodayMeals.caloriesByDay }}千卡
  </h2>
</template>

<script setup lang="ts">
import type { MealsByDay } from "../db/mealTypes";
import { Category } from "../db/mealTypes";

defineProps<{
  transFormedTodayMeals: MealsByDay;
}>();
</script>

<style lang="scss" scoped></style>
