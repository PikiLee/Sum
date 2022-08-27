<template>
  <div>
    <MealsTab
      :mealsByPeriodList="mealStore.transFormedTodayMeals.mealsByPeriod"
      @click:item="openModal"
      @toggle="handleToggle"
    >
      <template v-slot:title>
        <h1 class="text-lg text-center font-bold">餐盘</h1>
        <h3 class="text-md text-center">点击卡片修改</h3>
      </template>
    </MealsTab>

    <!-- Progress -->
    <h1 class="text-lg text-center font-bold">今日统计</h1>
    <AppCard>
      <CaloriesStatsCard
        :transFormedTodayMeals="mealStore.transFormedTodayMeals"
      />
      <h2 class="text-center text-md font-md my-2">
        每日需求：<span class="text-green-400 font-bold text-lg">{{
          TDEEStore.TDEE
        }}</span>
        千卡 还可摄入
        <span class="text-orange-400 font-bold text-lg">{{
          TDEEStore.TDEE - mealStore.transFormedTodayMeals.caloriesByDay
        }}</span
        >千卡
      </h2>
      <h3 class="text-center mb-2" v-if="!TDEESetted">
        默认2500千卡，
        <span class="text-green-500">
          <RouterLink :to="{ name: 'expenditure' }"
            >点击设置每日需求</RouterLink
          >
        </span>
      </h3>
      <AppProgress :progress="mealStore.caloriesProgress" />
    </AppCard>

    <!-- Modal -->
    <AppModal
      :isOpen="isOpen"
      @cancel="handleCancel"
      :isLoading="isLoading"
      :error="error"
      title="修改"
    >
      <AmountForm v-model:amount="amount" :materialId="meal?.materialId ?? 1" />
      <template v-slot:footer>
        <BaseButton @click="handleCancel">取消</BaseButton>
        <BaseButton @click="deleteMeal">删除</BaseButton>
        <BaseButton @click="handleOk" :isLoading="isLoading">确定</BaseButton>
      </template>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import MealsTab from "./MealsTab.vue";
import AppCard from "../elements/AppCard.vue";
import { ref } from "vue";
import { useMealStore } from "../stores/meal";
import AmountForm from "../elements/AmountForm.vue";
import { useNoti } from "../plugins/useNoti";
import AppProgress from "../elements/AppProgress.vue";
import { useTDEEStore } from "../stores/TDEE";
import BaseButton from "../elements/BaseButton.vue";
import CaloriesStatsCard from "./CaloriesStatsCard.vue";
import type { Meal } from "@/db/mealTypes";
import mealService from "@/services/mealService";

const notier = useNoti();
const mealStore = useMealStore();
const TDEEStore = useTDEEStore();

const TDEESetted = ref<boolean>(false);

if (localStorage.getItem("TDEE")) {
  TDEESetted.value = true;
}

/**
 * Modal
 */
const isOpen = ref(false);
const amount = ref(0);
const isLoading = ref(false);
const error = ref("");
const meal = ref<Meal | null>(null);

function handleCancel() {
  isOpen.value = false;
}

function openModal(mealId: number) {
  const res = mealStore.getById(mealId);
  if (res) {
    meal.value = res;
    amount.value = res.amount;
  }
  isOpen.value = true;
}

function handleToggle(index: number) {
  mealStore.setCurrentCategory(index);
}

function deleteMeal() {
  if (meal.value && meal.value.id) {
    mealService
      .deleteMeal(meal.value.id)
      .then(() => {
        isOpen.value = false;
      })
      .finally(() => {
        isLoading.value = false;
      });
  }
}

function handleOk() {
  if (amount.value < 1) {
    notier.error("重量最少为1克");
  }
  isLoading.value = true;
  if (meal.value && meal.value.id) {
    mealService
      .update(meal.value.id, {
        amount: amount.value,
      })
      .then(() => {
        isOpen.value = false;
      })
      .finally(() => {
        isLoading.value = false;
      });
  }
}
</script>

<style lang="scss" scoped></style>
