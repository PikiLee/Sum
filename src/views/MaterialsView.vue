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
import { db } from "../db/db";
import DefaultImg from "../assets/imgs/default.jpg";
import { useNoti } from "../plugins/useNoti";

import MaterialFormModal from "../elements/MaterialFormModal.vue";
import type { Material } from "@/db/materialType";

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
  activeMaterial.value = materialStore.getById(materialId);
  formState.name = activeMaterial.value.name;
  formState.caloriesPerHundredGram =
    activeMaterial.value.caloriesPerHundredGram;
  isOpen.value = true;
}

function handleDelete() {
  isLoading.value = true;
  db.materials
    .update(activeMaterial.value.id, {
      deleted: true,
    })
    .then(() => {
      notier.success("删除成功");
      isOpen.value = false;
    })
    .catch(() => notier.error("删除失败"))
    .finally(() => (isLoading.value = false));
}

function handleOk(values: FormState) {
  isLoading.value = true;
  db.materials
    .put({
      id: activeMaterial.value.id,
      name: values.name,
      caloriesPerHundredGram: values.caloriesPerHundredGram,
      imgUrl: DefaultImg,
      default: false,
      deleted: false,
    })
    .then(() => {
      notier.success("修改成功");
      isOpen.value = false;
    })
    .catch(() => notier.error("修改失败"))
    .finally(() => (isLoading.value = false));
}
</script>

<style lang="scss" scoped></style>
