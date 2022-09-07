<template>
  <div class="w-full relative z-40">
    <label class="hidden" for="searchBar">搜索材料</label>
    <input
      id="searchBar"
      type="text"
      class="border-2 border-black w-full rounded-lg h-8 p-6 text-lg outline-none"
      v-model="searchInput"
      placeholder="搜索材料"
      @input="openList"
      ref="inputEl"
    />
    <div
      class="absolute bg-orange-400 top-1.5 left-1.5 w-full min-h-full p-6 pb-2 rounded-lg -z-10 border-2 border-black transition-all duration-1000"
      :class="{ active }"
    >
      <div v-if="active">
        <Transition mode="out-in" @leave="onLeave" @enter="onEnter">
          <a-skeleton v-if="results.length === 0 && !notFound" active />
          <div v-else-if="results.length > 0" class="flex flex-col gap-2">
            <MaterialCard
              :material="material"
              v-for="material in results"
              :key="material.id"
              @click:item="openModal"
            />
          </div>
          <div v-else class="text-white">
            <p class="mb-2">未找到该材料。</p>
            <AddMaterialCard />
          </div>
        </Transition>
      </div>
    </div>
    <font-awesome-icon
      icon="fa-solid fa-xmark"
      class="absolute right-6 top-1/2 -translate-y-1/2 text-xl cursor-pointer"
      @click="clearInput"
    />

    <!-- Modal -->
    <AddMealModal
      v-model:isOpen="isOpen"
      :materialId="materialId"
      @ok="handleOk"
      :amount="amount"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useMaterialStore } from "../stores/material";
import MaterialCard from "./MaterialCard.vue";
import { gsap } from "gsap";
import type { Material } from "@/db/materialType";
import AddMaterialCard from "./AddMaterialCard.vue";
import { useLastMealAmount } from "../utils/useLastMealAmount";

const materialStore = useMaterialStore();
const searchInput = ref("");
const results = ref<Material[]>([]);
const notFound = ref(false);
const active = ref(false);
const inputEl = ref<HTMLInputElement | null>(null);

let timer: number | null = null;

function openList() {
  if (searchInput.value.length > 0) {
    active.value = true;
    results.value = [];
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      const result = materialStore.search(searchInput.value);
      if (result.length === 0) {
        notFound.value = true;
      } else {
        notFound.value = false;
        results.value = result;
      }
    }, 500);
  } else {
    if (timer) clearTimeout(timer);
    active.value = false;
    results.value = [];
    notFound.value = false;
  }
}

function clearInput() {
  searchInput.value = "";
  openList();
}

/**
 * Modal
 */
const materialId = ref(1);
const isOpen = ref(false);
const { amount, getAmount } = useLastMealAmount();

async function openModal(id: number) {
  materialId.value = id;
  await getAmount(id);
  isOpen.value = true;
}

function handleOk() {
  clearInput();
  inputEl.value?.focus();
}

/**
 * Animation
 */
function onLeave(el: Element, done: () => void) {
  gsap.to(el, {
    opacity: 0,
    onComplete: done,
  });
}

function onEnter(el: Element, done: () => void) {
  gsap.from(el, {
    scale: 0,
    opacity: 0,
    onComplete: done,
  });
}
</script>

<style lang="scss" scoped>
.active {
  @apply bg-orange-700 pt-12 transition-all duration-1000;
}
</style>
