<template>
  <div class="relative p-3 rounded-3xl m-2">
    <span
      class="absolute top-2 left-2 w-full h-full border border-black -z-20 rounded-3xl"
    ></span>
    <span
      class="absolute inset-0 border border-black rounded-3xl bg-white -z-10"
    ></span>
    <slot />
  </div>
</template>

<script>
export default {
  setup() {
    return {};
  },
};
</script>

<style lang="scss" scoped></style>
