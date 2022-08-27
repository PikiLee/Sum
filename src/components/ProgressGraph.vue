<template>
  <h1 class="text-lg text-center font-bold mt-6">今日统计</h1>
  <div ref="containerEl" class="relative"></div>
  <div class="flex justify-around">
    <div
      class="flex gap-2 items-end"
      v-for="(label, index) in labels"
      :key="label"
    >
      <div
        class="w-3 aspect-square border border-slate-600 rounded-sm"
        :style="{ backgroundColor: stokeColors[index] }"
      ></div>
      <p class="leading-none">{{ label }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch, reactive } from "vue";
import p5 from "p5";
import { gsap } from "gsap";
import { zipObject, reverse } from "lodash-es";

const props = defineProps<{
  labels: string[];
  amounts: number[];
  target: number;
}>();

const containerEl = ref<HTMLElement | null>(null);

// colors
const stokeColors = ["#dcfce7", "#d9f99d", "#4ade80", "#84cc16"];

const finalColor = "#e2e8f0";

const colorWrapper = gsap.utils.wrap(stokeColors);

interface AnimationObj {
  [index: string]: number;
}

const sum = computed(() => {
  return props.amounts.reduce(
    (previousValue, currentValue) => previousValue + currentValue,
    0
  );
});

const animationObj: AnimationObj = reactive({});

function getAnimationObj() {
  const labels = [...props.labels];
  labels.push("剩余");
  const amounts = [...props.amounts];
  amounts.push(props.target - sum.value);

  return zipObject(labels, amounts);
}

watch(
  () => props,
  () => {
    const newAnimationObj = getAnimationObj();

    gsap.to(animationObj, {
      ...newAnimationObj,
      duration: 1,
      ease: "none",
    });
  },
  { immediate: true, deep: true }
);

const progresses = computed(() => {
  const progresses: number[] = [];
  for (const property in animationObj) {
    if (property !== "_gsap") {
      progresses.push(animationObj[property] / props.target);
    }
  }
  return reverse(progresses);
});

const amounts = computed(() => {
  const amounts: number[] = [];
  for (const property in animationObj) {
    if (property !== "_gsap") {
      amounts.push(Number(Number(animationObj[property]).toFixed(0)));
    }
  }
  return reverse(amounts);
});

onMounted(() => {
  if (containerEl.value) {
    const s = (p: InstanceType<typeof p5>) => {
      p.setup = () => {
        if (containerEl.value) {
          p.createCanvas(
            containerEl.value.clientWidth,
            containerEl.value.clientWidth * 0.7
          );
        }
      };

      const getArcSpecs = () => {
        const arcPosition = {
          x: p.width * 0.5,
          y: p.height * 0.75,
        };

        const arcRadius = {
          x: 0.9 * p.width * 0.5,
          y: 0.9 * p.width * 0.5,
        };

        return { arcPosition, arcRadius };
      };

      const drawProgress = (progresses: number[]) => {
        const { arcPosition, arcRadius } = getArcSpecs();
        // normalization again with gaps
        // console.log(progresses);
        const gap = progresses[-1] === 1 ? 0 : 0.06;

        const sum = progresses.reduce(
          (previousValue, currentValue) => previousValue + currentValue,
          gap * (progresses.length - 1)
        );
        // console.log(sum);

        const _progresses = progresses.map((progress) => progress / sum);
        // console.log(_progresses);

        // get start and end degrees
        const points: number[][] = [];

        let lastPointEnd: number | null = null;
        _progresses.forEach((progress: number, index: number) => {
          const start = lastPointEnd ? lastPointEnd + gap * p.PI : -1 * p.PI;
          const end =
            index === _progresses.length - 1 ? 0 : start + progress * p.PI;
          lastPointEnd = end;

          points.push([start, end]);
        });

        points.forEach((point, index) => {
          if (index === points.length - 1) {
            p.stroke(finalColor);
          } else {
            p.stroke(colorWrapper(index));
          }

          //draw progress circle
          p.strokeWeight(20);
          p.strokeCap(p.ROUND);
          p.noFill();
          p.resetMatrix();

          p.arc(
            arcPosition.x,
            arcPosition.y,
            arcRadius.x * 2,
            arcRadius.y * 2,
            point[0],
            point[1]
          );
        });
        return points;
      };

      const drawText = (
        points: number[][],
        labels: string[],
        amounts: number[],
        target: number,
        sum: number
      ) => {
        const { arcPosition, arcRadius } = getArcSpecs();

        points.forEach((point, index) => {
          if (index === points.length - 1) {
            p.stroke(finalColor);
          } else {
            p.stroke(colorWrapper(index));
          }

          const middlePointDegree = point[0] + (point[1] - point[0]) * 0.5;

          const middlePoint = [
            Math.cos(middlePointDegree) * arcRadius.x + arcPosition.x,
            Math.sin(middlePointDegree) * arcRadius.y + arcPosition.y,
          ];

          p.strokeWeight(4);
          p.line(
            middlePoint[0],
            middlePoint[1],
            middlePoint[0],
            middlePoint[1] + 25
          );

          p.strokeWeight(2);
          p.stroke("#334155");
          p.textSize(15);
          p.fill(colorWrapper(index));
          if (index === amounts.length - 1) {
            p.fill(finalColor);
          }
          p.text(amounts[index], middlePoint[0], middlePoint[1] + 45);
        });

        p.strokeWeight(0);
        p.fill("#334155");
        p.textAlign(p.CENTER);
        p.textStyle(p.BOLD);
        p.textSize(15);
        p.resetMatrix();
        p.text(target, arcPosition.x, arcPosition.y * 0.6);
        p.textSize(30);
        p.fill("#4ade80");
        p.text(target - sum, arcPosition.x, arcPosition.y);
        p.fill("#64748b");
        p.textSize(15);
        p.text("剩余", arcPosition.x, arcPosition.y * 1.15);
        p.text("目标", arcPosition.x, arcPosition.y * 0.75);
      };

      p.draw = () => {
        p.clear(1, 1, 1, 1);
        const points = drawProgress(progresses.value);
        drawText(points, props.labels, amounts.value, props.target, sum.value);
      };
    };
    new p5(s, containerEl.value);
  }
});
</script>

<style scoped></style>
