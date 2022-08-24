<template>
  <SmallCard class="col-span-1" @click="handleClick">
    <div class="grid grid-cols-3 items-center justify-items-center">
      <AppAvatar
        :imgSrc="meal.material.imgUrl"
        size="small"
        class="row-start-1 row-span-4 col-span-1"
      />

      <h2
        class="text-center text-sm col-start-2 col-span-2 flex items-end justify-center font-bold"
      >
        {{ meal.material.name }}
      </h2>
      <!-- <h2 v-if="amount">{{ amount }}克</h2> -->
      <div
        class="col-span-2 row-span-2 flex flex-col gap-1 justify-center items-center"
      >
        <a-badge
          :count="meal.amount + '克'"
          :number-style="{ backgroundColor: '#4ade80' }"
        />
        <a-badge
          :count="meal.calories + '千卡'"
          :number-style="{ backgroundColor: '#fb923c' }"
        />
      </div>
      <h4 class="col-span-2 text-center text-xs mt-1 text-slate-500">
        <span class="text-orange-400">
          {{ meal.material.caloriesPerHundredGram }}
        </span>
        千卡每100克
      </h4>
    </div>
  </SmallCard>
</template>

<script setup lang="ts">
import SmallCard from "../elements/SmallCard.vue";
import AppAvatar from "../elements/AppAvatar.vue";
import type { PopulatedMealWithCalories } from "@/db/mealTypes";

const props = defineProps<{
  meal: PopulatedMealWithCalories;
}>();

const emit = defineEmits(["click:item"]);

function handleClick() {
  emit("click:item", props.meal.id);
}
</script>

<style scoped></style>
