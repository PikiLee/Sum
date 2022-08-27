<template>
  <div>
    <div class="flex justify-center mb-2">
      <AppAvatar :imgSrc="materialStore.getById(materialId).imgUrl" />
    </div>
    <a-slider
      :value="amount"
      @update:value="updateAmount"
      :min="1"
      :max="1000"
    />
    <div class="flex flex-row justify-center items-center mt-4">
      <a-input-number
        :value="amount"
        @update:value="updateAmount"
        :min="1"
        :max="1000"
      >
        <template #addonBefore>
          <font-awesome-icon icon="fa-solid fa-plus" @click="onPlus"
        /></template>
        <template #addonAfter>
          <font-awesome-icon icon="fa-solid fa-minus" @click="onMinus" />
        </template>
      </a-input-number>
      &nbsp;&nbsp;&nbsp;克
    </div>
  </div>
</template>

<script setup lang="ts">
import AppAvatar from "./AppAvatar.vue";
import { useMaterialStore } from "../stores/material";

const materialStore = useMaterialStore();

const props = defineProps({
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

function updateAmount(value: number) {
  emit("update:amount", value);
}

function onPlus() {
  if (props.amount + 1 <= 1000) emit("update:amount", props.amount + 1);
}

function onMinus() {
  if (props.amount - 1 >= 1) emit("update:amount", props.amount - 1);
}
</script>

<style lang="scss" scoped></style>
