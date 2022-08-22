<template>
  <AppModal
    :isOpen="isOpen"
    @cancel="handleCancel"
    :isLoading="isLoading"
    :error="error"
    @ok="handleOk"
    title="添加"
  >
    <AmountForm v-model:amount="amount" :materialId="materialId" />
  </AppModal>
</template>

<script setup>
import AppModal from "./AppModal.vue";
import { ref, watch } from "vue";
import { useMealStore } from "../stores/meal";
import { db } from "../db/db";
import { useNoti } from "../plugins/useNoti";
import AmountForm from "../elements/AmountForm.vue";

const notier = useNoti();
const mealStore = useMealStore();

const props = defineProps({
  materialId: {
    type: Number,
    required: true,
  },
  isOpen: {
    type: Boolean,
    required: true,
  },
  amount: {
    type: Number,
    default: 100,
  },
});

const emit = defineEmits(["update:isOpen", "ok"]);

/**
 * Modal
 */
const amount = ref(props.amount);
const isLoading = ref(false);
const error = ref("");

watch(
  () => props.amount,
  (newValue) => {
    amount.value = newValue;
  }
);

function handleCancel() {
  emit("update:isOpen", false);
}

function handleOk() {
  isLoading.value = true;
  db.meals
    .put({
      materialId: props.materialId,
      amount: amount.value,
      date: Date.now(),
      meal: mealStore.currentMeal,
    })
    .then(() => {
      isLoading.value = false;
      notier.success("添加成功");
      emit("update:isOpen", false);
      emit("ok");
    })
    .catch(() => {
      notier.error("添加失败");
    })
    .finally(() => (isLoading.value = false));
}
</script>

<style lang="scss" scoped></style>
