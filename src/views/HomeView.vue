<script setup lang="ts">
import MaterialBoardVue from "../components/MaterialBoard.vue";
import RecentAddedBoardVue from "../components/RecentAddedBoard.vue";
import DailyMealsVue from "../components/DailyMeals.vue";
import SearchBar from "../components/SearchBar.vue";
// import { defineAsyncComponent } from "vue";

// const MaterialBoardVue = defineAsyncComponent(
//   () => import("../components/MaterialBoard.vue")
// );

// const RecentAddedBoard = defineAsyncComponent(
//   () => import("../components/RecentAddedBoard.vue")
// );
</script>

<template>
  <SearchBar class="my-4" />
  <DailyMealsVue />
  <RecentAddedBoard />
  <MaterialBoardVue />
</template>
