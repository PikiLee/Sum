<template>
  <div class="relative p-8 my-12">
    <span
      class="absolute inset-0 border border-black bg-white rounded-[3rem] -z-10"
    ></span>
    <span
      class="absolute left-1/2 top-1/2 w-10/12 bg-white h-full scale-y-105 border border-black rounded-[4rem] -translate-x-1/2 -translate-y-1/2 -z-20"
    ></span>
    <span
      class="absolute left-1/2 top-1/2 w-10/12 bg-white h-full scale-y-110 scale-x-75 border border-black rounded-[6rem] -translate-x-1/2 -translate-y-1/2 -z-30"
    ></span>
    <slot />
  </div>
</template>

<style lang="scss" scoped></style>
