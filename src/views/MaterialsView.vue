<template>
  <div>
    <MaterialList @click:item="openModal" :materials="materialStore.materials">
      <template v-slot:title>
        <h1 class="text-lg text-center font-bold">材料</h1>
        <h3 class="text-md text-center">点击卡片修改材料信息</h3>
      </template>
    </MaterialList>

    <!-- Modal -->
    <template v-if="activeMaterial?.default">
      <AppModal :isOpen="isOpen" title="详情">
        <div class="flex items-center justify-center mb-4">
          <AppAvatar :imgSrc="activeMaterial.imgUrl" />
        </div>
        <h2 class="text-center text-sm">{{ activeMaterial.name }}</h2>
        <h1 class="text-center text-xs">
          <span class="text-orange-400">{{
            activeMaterial.caloriesPerHundredGram
          }}</span
          >千卡每100克
        </h1>
        <template v-slot:footer>
          <BaseButton @click="handleCancel">确定</BaseButton>
        </template>
      </AppModal>
    </template>

    <!-- Modal -->
    <template v-else>
      <MaterialFormModal
        :isOpen="isOpen"
        @cancel="handleCancel"
        @ok="handleOk"
        @delete="handleDelete"
        :isLoading="isLoading"
        isEditing
        :material="activeMaterial"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import AppAvatar from "../elements/AppAvatar.vue";
import BaseButton from "../elements/BaseButton.vue";
import { useMaterialStore } from "../stores/material";
import { useNoti } from "../plugins/useNoti";

import MaterialFormModal from "../elements/MaterialFormModal.vue";
import type { Material } from "@/db/materialType";
import materialService from "@/services/materialService";

const notier = useNoti();
const materialStore = useMaterialStore();

/**
 * Modal
 */
const isOpen = ref(false);
const isLoading = ref(false);
const activeMaterial = ref<Material>({} as Material);

interface FormState {
  name: string;
  caloriesPerHundredGram: number;
}

const formState: FormState = reactive({
  name: "",
  caloriesPerHundredGram: 1,
});

function handleCancel() {
  isOpen.value = false;
}

function openModal(materialId: number) {
  const res = materialStore.getById(materialId);
  if (res) {
    activeMaterial.value = res;
    formState.name = activeMaterial.value.name;
    formState.caloriesPerHundredGram =
      activeMaterial.value.caloriesPerHundredGram;
    isOpen.value = true;
  } else {
    notier.error("找不到该材料");
  }
}

function handleDelete() {
  isLoading.value = true;
  if (activeMaterial.value && activeMaterial.value.id) {
    materialService
      .deleteMaterial(activeMaterial.value.id)
      .then(() => {
        isOpen.value = false;
      })
      .finally(() => (isLoading.value = false));
  }
}

function handleOk(values: FormState) {
  isLoading.value = true;
  if (activeMaterial.value && activeMaterial.value.id) {
    materialService
      .update(activeMaterial.value.id, {
        name: values.name,
        caloriesPerHundredGram: values.caloriesPerHundredGram,
      })
      .then(() => {
        isOpen.value = false;
      })
      .finally(() => (isLoading.value = false));
  }
}
</script>

<style lang="scss" scoped></style>
