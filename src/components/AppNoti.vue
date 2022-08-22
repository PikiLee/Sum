<template>
  <div
    class="mt-2 border-2 border-black text-xl px-8 py-2 rounded-xl flex gap-4 items-center shadow-lg shadow-slate-300 select-hone pointer-events-none"
    :class="[type]"
  >
    <!-- success icon -->
    <svg
      xmlns="http://www.w3.org/2000/svg"
      id="Outline"
      viewBox="0 0 24 24"
      class="icon"
      v-if="type === 'success'"
    >
      <path
        d="M22.319,4.431,8.5,18.249a1,1,0,0,1-1.417,0L1.739,12.9a1,1,0,0,0-1.417,0h0a1,1,0,0,0,0,1.417l5.346,5.345a3.008,3.008,0,0,0,4.25,0L23.736,5.847a1,1,0,0,0,0-1.416h0A1,1,0,0,0,22.319,4.431Z"
      />
    </svg>
    <!-- cross icon -->
    <svg
      xmlns="http://www.w3.org/2000/svg"
      id="Outline"
      viewBox="0 0 24 24"
      class="icon"
      v-if="type === 'error'"
    >
      <path
        d="M16,8a1,1,0,0,0-1.414,0L12,10.586,9.414,8A1,1,0,0,0,8,9.414L10.586,12,8,14.586A1,1,0,0,0,9.414,16L12,13.414,14.586,16A1,1,0,0,0,16,14.586L13.414,12,16,9.414A1,1,0,0,0,16,8Z"
      />
      <path
        d="M12,0A12,12,0,1,0,24,12,12.013,12.013,0,0,0,12,0Zm0,22A10,10,0,1,1,22,12,10.011,10.011,0,0,1,12,22Z"
      />
    </svg>

    <!-- info icon -->
    <svg
      xmlns="http://www.w3.org/2000/svg"
      id="Outline"
      viewBox="0 0 24 24"
      class="icon"
      v-if="type === 'info'"
    >
      <path
        d="M12,0A12,12,0,1,0,24,12,12.013,12.013,0,0,0,12,0Zm0,22A10,10,0,1,1,22,12,10.011,10.011,0,0,1,12,22Z"
      />
      <path d="M12,10H11a1,1,0,0,0,0,2h1v6a1,1,0,0,0,2,0V12A2,2,0,0,0,12,10Z" />
      <circle cx="12" cy="6.5" r="1.5" />
    </svg>
    <slot />
  </div>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: "info",
  },
});
</script>

<style lang="scss" scoped>
.icon {
  @apply w-6 aspect-square;
}

.info {
  @apply bg-yellow-300;
}

.error {
  @apply bg-red-300;
}

.success {
  @apply bg-green-300;
}
</style>
