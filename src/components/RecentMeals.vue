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
        <AppCard>
          <CaloriesStatsCard :transFormedTodayMeals="mealsByDay" />
        </AppCard>
      </template>
    </MealsTab>
  </div>
</template>

<script setup lang="ts">
import MealsTab from "./MealsTab.vue";
import CaloriesStatsCard from "./CaloriesStatsCard.vue";
import { useMealStore } from "@/stores/meal";
import AppCard from "../elements/AppCard.vue";

const mealStore = useMealStore();
</script>

<style lang="scss" scoped></style>
