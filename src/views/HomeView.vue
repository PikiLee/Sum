<script setup lang="ts">
import MaterialBoardVue from "../components/MaterialBoard.vue";
import RecentAddedBoard from "../components/RecentAddedBoard.vue";
import DailyMealsVue from "../components/DailyMeals.vue";
import SearchBar from "../components/SearchBar.vue";
</script>

<template>
  <SearchBar class="my-4" />
  <DailyMealsVue />
  <RecentAddedBoard />
  <MaterialBoardVue />
</template>
