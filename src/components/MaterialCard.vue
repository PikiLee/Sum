<template>
  <SmallCard class="col-span-1" @click="handleClick">
    <div class="grid grid-cols-3">
      <AppAvatar
        :imgSrc="material.imgUrl"
        size="small"
        class="row-start-1 row-span-2 col-span-1 self-center justify-self-center"
      />
      <div class="row-start-1 col-span-2 flex justify-around">
        <h2 class="text-center text-sm">
          {{ material.name }}
        </h2>
        <h2 v-if="amount">{{ amount }}克</h2>
      </div>
      <h1 class="row-start-2 col-span-2 text-center text-xs">
        <span class="text-orange-400">{{
          material.caloriesPerHundredGram
        }}</span
        >千卡每100克
      </h1>
    </div>
  </SmallCard>
</template>

<script setup>
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
