<template>
  <SmallCard class="col-span-1" @click="handleClick">
    <div class="grid grid-cols-3 items-center justify-items-center">
      <AppAvatar
        :imgSrc="material.imgUrl"
        size="small"
        class="row-start-1 row-span-3 col-span-1"
      />

      <h2
        class="text-center text-sm col-start-2 col-span-2 flex items-end justify-center font-bold"
      >
        {{ material.name }}
      </h2>
      <!-- <h2 v-if="amount">{{ amount }}克</h2> -->
      <div v-if="amount" class="col-span-2">
        <a-badge
          :count="amount + '克'"
          :number-style="{ backgroundColor: '#4ade80' }"
        />
      </div>
      <h3
        v-if="!amount"
        class="col-span-2 text-center text-2xl font-bold text-orange-400 flex items-center justify-center gap-2"
      >
        {{ material.caloriesPerHundredGram }}
      </h3>
      <h4
        class="col-start-2 col-span-2 text-center text-xs mt-1 text-slate-500"
      >
        <span class="text-orange-400" v-if="amount">
          {{ material.caloriesPerHundredGram }}
        </span>
        千卡每100克
      </h4>
    </div>
  </SmallCard>
</template>

<script setup lang="ts">
import SmallCard from "../elements/SmallCard.vue";
import AppAvatar from "../elements/AppAvatar.vue";
const props = defineProps({
  material: {
    type: Object,
    required: true,
  },
  amount: {
    type: Number,
  },
});

const emit = defineEmits(["click:item"]);

function handleClick() {
  if (!props.amount) {
    emit("click:item", props.material.id);
  } else {
    emit("click:item", [props.material.id, props.amount]);
  }
}
</script>

<style lang="scss" scoped></style>
