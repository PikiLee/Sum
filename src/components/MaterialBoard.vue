<template>
  <div class="w-full h-full">
    <MaterialList @click:item="openModal" :materials="materialStore.materials">
      <template v-slot:title>
        <h1 class="text-lg text-center font-bold">材料</h1>
        <h3 class="text-md text-center">点击卡片添加到餐盘</h3>
      </template>
    </MaterialList>

    <!-- Modal -->
    <AddMealModal
      v-model:isOpen="isOpen"
      :materialId="materialId"
      :amount="amount"
    />
  </div>
</template>

<script setup lang="ts">
import MaterialList from "./MaterialList.vue";
import AddMealModal from "./AddMealModal.vue";
import { ref } from "vue";
import { useMaterialStore } from "../stores/material";
import { useLastMealAmount } from "../utils/useLastMealAmount";

const materialStore = useMaterialStore();

/**
 * Modal
 */
const isOpen = ref(false);
const materialId = ref(1);
const { amount, getAmount } = useLastMealAmount();

async function openModal(id: number) {
  materialId.value = id;
  await getAmount(id);
  isOpen.value = true;
}
</script>

<style lang="scss" scoped></style>
