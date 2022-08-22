<template>
  <div>
    <MealsTab
      v-for="(meals, index) in mealsForDaysBefore"
      :key="index"
      :mealsByPeriod="meals"
    >
      <template v-slot:title>
        <h2 class="text-lg text-center font-bold mt-4">
          {{ `${index + 1}天前` }}
        </h2>
      </template>
    </MealsTab>
  </div>
</template>

<script setup lang="ts">
import MealsTab from "./MealsTab.vue";
import { StatisticGetter } from "../db/mealStats";
import { ref } from "vue";
import { useMaterialStore } from "../stores/material";

useMaterialStore();

const getter = new StatisticGetter();

const mealsForDaysBefore = ref([]);

const aDay = 1000 * 60 * 60 * 24;
Promise.all([
  getter.getMeals(Date.now(), {
    byPeriod: true,
    populate: true,
    calcCalories: true,
  }),
  getter.getMeals(Date.now() - aDay, {
    byPeriod: true,
    populate: true,
    calcCalories: true,
  }),
  getter.getMeals(Date.now() - 2 * aDay, {
    byPeriod: true,
    populate: true,
    calcCalories: true,
  }),
]).then((values) => (mealsForDaysBefore.value = values));
</script>

<style lang="scss" scoped></style>
