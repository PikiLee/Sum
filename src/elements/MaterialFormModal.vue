<template>
  <!-- Modal -->
  <AppModal :isOpen="isOpen" :error="error" :title="title">
    <a-form ref="formRef" :model="formState" :rules="rules">
      <a-form-item label="名称" name="name">
        <a-input v-model:value="formState.name" />
      </a-form-item>
      <a-form-item label="卡路里（每一百克）" name="caloriesPerHundredGram">
        <a-input-number
          v-model:value="formState.caloriesPerHundredGram"
          :min="1"
        />
      </a-form-item>
    </a-form>
    <template v-slot:footer>
      <BaseButton @click="handleCancel">取消</BaseButton>
      <BaseButton @click="handleDelete" v-if="isEditing">删除</BaseButton>
      <BaseButton @click="handleOk" :isLoading="isLoading">确定</BaseButton>
    </template>
  </AppModal>
</template>

<script setup lang="ts">
import AppModal from "../components/AppModal.vue";
import BaseButton from "./BaseButton.vue";
import { ref, reactive, watch, computed } from "vue";
import type { FormInstance } from "ant-design-vue";

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: "",
  },
  isEditing: {
    type: Boolean,
    default: false,
  },
  material: {
    type: Object,
  },
});

const emit = defineEmits([
  "cancel",
  "ok",
  "delete",
  "update:name",
  "update:caloriesPerHundredGram",
]);

/**
 * Modal
 */
const isLoading = ref(false);
const error = ref("");
const title = computed(() => {
  return props.isEditing ? "修改" : "添加";
});

function handleCancel() {
  emit("cancel");
}

function handleDelete() {
  emit("delete");
}

/**
 * From
 */
const formRef = ref<FormInstance>();

interface FormState {
  name: string;
  caloriesPerHundredGram: number;
}

const formState: FormState = reactive({
  name: props.isEditing ? props.material?.name : "",
  caloriesPerHundredGram: props.isEditing
    ? props.material?.caloriesPerHundredGram
    : 1,
});

watch(
  () => props.material,
  (newValue) => {
    formState.name = newValue?.name;
    formState.caloriesPerHundredGram = newValue?.caloriesPerHundredGram;
  }
);

// rules
const rules = {
  name: [
    {
      required: true,
      message: "必填项",
      trigger: "change",
    },
  ],
  caloriesPerHundredGram: [
    {
      required: true,
      type: "number",
      min: 1,
      message: "必须大于等于1",
      trigger: "change",
    },
  ],
};

function handleOk() {
  formRef.value?.validateFields().then((values) => {
    emit("ok", values);
  });
}
</script>

<style lang="scss" scoped></style>
