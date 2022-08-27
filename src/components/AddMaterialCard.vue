<template>
  <SmallCard
    @click="openModal"
    key="add-btn"
    class="text-black flex items-center justify-center gap-1 text-xl text-center"
  >
    <span class="text-3xl pb-1">+ </span><span>添加新材料</span>

    <!-- Modal -->
    <MaterialFormModal
      :isOpen="isOpen"
      @cancel="handleCancel"
      @ok="handleOk"
      :isLoading="isLoading"
    />
  </SmallCard>
</template>

<script setup lang="ts">
import SmallCard from "@/elements/SmallCard.vue";
import { ref } from "vue";
import materialService from "@/services/materialService";
import DefaultImg from "../assets/imgs/default.jpg";
import MaterialFormModal from "../elements/MaterialFormModal.vue";

/**
 * Modal
 */
const isOpen = ref(false);
const isLoading = ref(false);

function handleCancel() {
  isOpen.value = false;
}

function openModal() {
  isOpen.value = true;
}

function handleOk(values: { name: string; caloriesPerHundredGram: number }) {
  isLoading.value = true;
  materialService
    .add({
      name: values.name,
      caloriesPerHundredGram: values.caloriesPerHundredGram,
      imgUrl: DefaultImg,
      default: false,
      deleted: false,
    })
    .then(() => {
      isOpen.value = false;
    })
    .finally(() => (isLoading.value = false));
}
</script>

<style scoped></style>
