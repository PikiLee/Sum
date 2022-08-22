<template>
  <div ref="container">
    <div
      class="w-16 relative aspect-square rounded-full"
      :class="[`size-${size ?? 'middle'}`]"
    >
      <img class="w-full h-full object-cover rounded-full" :src="imgSrc" />
      <span
        class="absolute block -left-3px -top-3px w-full h-full box-content rounded-full"
        :class="[borderCls, borderColor]"
        ref="border"
      ></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { gsap } from "gsap";

const props = defineProps<{
  imgSrc: string;
  borderRotate: boolean;
  jump: boolean;
  size: string;
}>();

// container
const border = ref(null);
const container = ref(null);

/**
 * Get Random Border
 */
const borderClasses = ["border-half", " border-none-bottom"];
const borderCls =
  borderClasses[Math.floor(Math.random() * borderClasses.length)];

/**
 * Get random border color
 */
// const colorClasses = [
//   "slate",
//   "gray",
//   "zinc",
//   "neutral",
//   "stone",
//   "red",
//   "orange",
//   "amber",
//   "yellow",
//   "lime",
//   "green",
//   "emerald",
//   "teal",
//   "cyan",
//   "sky",
//   "blue",
//   "indigo",
//   "violet",
//   "purple",
//   "fuchsia",
//   "pink",
//   "rose",
// ];

const colorClasses = ["rose", "lime", "sky", "orange"];

const borderColor = `bc-${
  colorClasses[Math.floor(Math.random() * colorClasses.length)]
}`;

onMounted(() => {
  /**
   * Jump Animation
   */
  if (props.jump) {
    const tl = gsap.timeline();
    tl.to(container.value, {
      y: -70,
      duration: 1,
      repeat: -1,
      yoyo: true,
    }).to(
      container.value,
      {
        keyframes: {
          "45%": { scaleY: 1 },
          "50%": { scaleY: 0.7 },
          "55%": { scaleY: 1 },
        },
        duration: 2,
        repeat: -1,
      },
      1
    );
  }

  /**
   * Rotation Animation
   */
  if (props.borderRotate) {
    gsap.to(border.value, {
      rotation: 360,
      duration: 2,
      transformOrigin: "center center",
      ease: "none",
      repeat: -1,
    });
  }
});
</script>

<style lang="scss" scoped>
.-left-3px {
  left: -3px;
}

.-top-3px {
  top: -3px;
}

// =============== SIZES ===============
$sizes: (
  "small": 32px,
  "middle": 48px,
  "large": 64px,
);

@each $size, $value in $sizes {
  .size-#{$size} {
    width: $value;
  }
}
// ===============BORDER COLORS ===============
.bc-rose {
  @apply border-rose-400;
}
.bc-lime {
  @apply border-lime-400;
}
.bc-sky {
  @apply border-sky-400;
}
.bc-orange {
  @apply border-orange-400;
}

.border-none-bottom {
  border-width: 3px;
  @apply border-l-transparent;
}

.border-half {
  border-width: 3px;
  @apply border-l-transparent border-b-transparent;
}

@for $i from 1 through 8 {
  .border-rotate-#{$i} {
    transform: rotate($i * 45deg);
  }
}
</style>
