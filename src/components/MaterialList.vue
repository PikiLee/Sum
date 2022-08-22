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

<script setup>
import AppCard from "../elements/AppCard.vue";
import SmallCard from "../elements/SmallCard.vue";
import { ref } from "vue";
import { db } from "../db/db";
import DefaultImg from "../assets/imgs/default.jpg";
import { useNoti } from "../plugins/useNoti";
import { gsap } from "gsap";

import MaterialCard from "./MaterialCard.vue";
import MaterialFormModal from "../elements/MaterialFormModal.vue";

const notier = useNoti();

defineProps({
  materials: {
    type: Array,
    required: true,
  },
});

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

function handleOk(values) {
  isLoading.value = true;
  db.materials
    .put({
      name: values.name,
      caloriesPerHundredGram: values.caloriesPerHundredGram,
      imgUrl: DefaultImg,
      default: false,
      deleted: false,
    })
    .then(() => {
      notier.success("添加成功");
      isOpen.value = false;
    })
    .catch(() => notier.error("添加失败"))
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
