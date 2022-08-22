<template>
  <div>
    <div class="flex justify-center mb-2">
      <AppAvatar :imgSrc="materialStore.getById(materialId).imgUrl" />
    </div>
    <a-slider
      :value="amount"
      @update:value="updateAmount"
      :min="1"
      :max="500"
    />
    <div class="flex flex-row justify-center items-center mt-4">
      <a-input-number
        :value="amount"
        @update:value="updateAmount"
        :min="1"
        :max="500"
      />
      &nbsp;&nbsp;&nbsp;克
    </div>
  </div>
</template>

<script setup>
import AppAvatar from "./AppAvatar.vue";
import { useMaterialStore } from "../stores/material";

const materialStore = useMaterialStore();

defineProps({
  materialId: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["update:amount"]);

function updateAmount(value) {
  emit("update:amount", value);
}
</script>

<style lang="scss" scoped></style>
