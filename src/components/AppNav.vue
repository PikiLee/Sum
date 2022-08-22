<template>
  <div
    class="flex flex-row item-center justify-between w-10/12 fixed left-1/2 bottom-4 -translate-x-1/2 mx-auto border-2 border-black bg-green-400 rounded-lg px-4 py-1 z-50"
    ref="container"
  >
    <div
      class="text-lg w-max p-2 text-white flex item-center border-transparent border-2 rounded-xl hover:border-black hover:bg-orange-400 hover:text-black transition-all duration-100 ease-in"
      v-for="link in links"
      :key="link.name"
      :class="{ active: link.name === route.name }"
    >
      <RouterLink :to="{ name: link.name }">
        <font-awesome-icon :icon="`fa-solid ${link.icon}`" />
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from "vue-router";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const container = ref(null);

const height = ref(null);
onMounted(() => {
  height.value = container.value.offsetHeight;
});

defineExpose({
  height,
});

// active
const links = [
  {
    name: "home",
    icon: "fa-house",
  },
  {
    name: "materials",
    icon: "fa-layer-group",
  },
  {
    name: "expenditure",
    icon: "fa-gear",
  },
  {
    name: "statistics",
    icon: "fa-chart-simple",
  },
];
</script>

<style lang="scss" scoped>
.active {
  @apply border-black bg-orange-400 text-black;
}

a {
  line-height: 0;
  &:hover {
    color: black;
  }
}
</style>
