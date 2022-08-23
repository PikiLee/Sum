<template>
  <div class="w-full">
    <!-- Title -->
    <div class="p-3">
      <slot name="title" />
    </div>
    <!-- Cards -->
    <AppCard class="mx-3">
      <div class="w-full grid grid-cols-2 gap-3">
        <TransitionGroup name="list" @leave="onLeave" @enter="onEnter">
          <SmallCard
            class="col-span-1 text-xl text-center cursor-pointer flex items-center justify-center gap-1"
            @click="openModal"
            key="add-btn"
          >
            <span class="text-3xl pb-1">+ </span><span>添加材料</span>
          </SmallCard>
          <MaterialCard
            v-for="material in materials"
            :key="material.id"
            :material="material"
            @click:item="(val) => $emit('click:item', val)"
          />
        </TransitionGroup>
      </div>
      <p class="text-center mt-4">
        所有食物图片来自<a
          href="https://www.flaticon.com/free-icons/idea"
          title="idea icons"
          class="text-green-400 block mt-2 text-md"
          >Idea icons created by Freepik - Flaticon</a
        >
      </p>
    </AppCard>

    <!-- Modal -->
    <MaterialFormModal
      :isOpen="isOpen"
      @cancel="handleCancel"
      @ok="handleOk"
      :isLoading="isLoading"
    />
  </div>
</template>

<script setup lang="ts">
import AppCard from "../elements/AppCard.vue";
import SmallCard from "../elements/SmallCard.vue";
import { ref } from "vue";
import DefaultImg from "../assets/imgs/default.jpg";
import { gsap } from "gsap";
import type { Material } from "../db/materialType";

import MaterialCard from "./MaterialCard.vue";
import MaterialFormModal from "../elements/MaterialFormModal.vue";
import materialService from "@/services/materialService";

defineProps<{
  materials: Material[];
}>();

defineEmits(["click:item"]);

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

/**
 * Animation
 */

function onLeave(el, done) {
  gsap.to(el, {
    scaleX: 0,
    onComplete: done,
  });
}

function onEnter(el, done) {
  gsap.from(el, {
    scaleX: 0,
    onComplete: done,
  });
}
</script>

<style lang="scss" scoped></style>
