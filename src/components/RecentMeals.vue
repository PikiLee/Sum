<template>
  <div>
    <MealsTab
      v-for="(mealsByDay, index) in mealStore.mealStats"
      :key="index"
      :mealsByPeriodList="mealsByDay.mealsByPeriod"
    >
      <template v-slot:title>
        <h2 class="text-lg text-center font-bold mt-4">
          {{ `${index + 1}天前` }}
        </h2>
      </template>
      <template v-slot:footer>
        <ProgressStats v-bind="getStatsFromMealsByDay(mealsByDay)" />
      </template>
    </MealsTab>
  </div>
</template>

<script setup lang="ts">
import MealsTab from "./MealsTab.vue";
import ProgressStats from "./ProgressStats.vue";
import { useMealStore } from "@/stores/meal";
import { getStatsFromMealsByDay } from "../services/mealService";

const mealStore = useMealStore();
</script>

<style lang="scss" scoped></style>
