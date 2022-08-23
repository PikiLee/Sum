<template>
  <div class="my-4">
    <h2 class="text-lg font-bold text-center">最近添加</h2>
    <h3 class="text-md text-center">点击卡片添加到餐盘</h3>
    <AppCard class="grid grid-cols-2 gap-2">
      <MaterialCard
        v-for="meal in mealStore.recentMeals"
        :key="meal.date"
        :material="meal.material"
        :amount="meal.amount"
        @click:item="openModal"
      />
    </AppCard>

    <!-- Modal -->
    <AddMealModal
      v-model:isOpen="isOpen"
      :materialId="materialId"
      :amount="amount"
    />
  </div>
</template>

<script setup lang="ts">
import AppCard from "../elements/AppCard.vue";
import MaterialCard from "./MaterialCard.vue";
import { useMaterialStore } from "../stores/material";
import { useMealStore } from "../stores/meal";

import { ref } from "vue";
import AddMealModal from "./AddMealModal.vue";

const materialStore = useMaterialStore();
const mealStore = useMealStore();

/**
 * Modal
 */
const isOpen = ref(false);
const amount = ref(0);
const materialId = ref(1);

function openModal(values: number[]) {
  materialId.value = values[0];
  amount.value = values[1];
  isOpen.value = true;
}
</script>

<style lang="scss" scoped></style>
