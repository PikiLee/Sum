<template>
  <div class="grid grid-cols-2 justify-items-center gap-2">
    <span
      class="col-span-1"
      v-for="(calories, period) in caloriesByPeriod"
      :key="period"
      >{{ period }}：{{ calories }}千卡</span
    >
  </div>
  <h2 class="text-center mt-2">总共： {{ totalCalories }}千卡</h2>
</template>

<script setup>
defineProps({
  caloriesByPeriod: {
    type: Object,
    required: true,
  },
  totalCalories: {
    type: Number,
    required: true,
  },
});
</script>

<style lang="scss" scoped></style>
