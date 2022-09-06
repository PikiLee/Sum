<template>
  <div class="">
    <h1 class="text-lg text-center font-bold mt-6">今日统计</h1>
    <div ref="containerEl"></div>
    <div class="flex justify-around pt-1">
      <div
        class="flex flex-col gap-2 items-center"
        v-for="(label, index) in [...labels, '剩余']"
        :key="label"
      >
        <div
          class="w-3 aspect-square border border-slate-600 rounded-sm"
          :style="{ backgroundColor: colorStringWrap(index) }"
        ></div>
        <p class="leading-none">{{ label }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Application,
  Container,
  Graphics,
  LINE_CAP,
  TextStyle,
  Text,
  type ObservablePoint,
} from "pixi.js";
import { onMounted, ref, computed, watch } from "vue";
import { gsap } from "gsap";

const props = defineProps<{
  labels: string[];
  quantities: number[];
  goal: number;
}>();

const containerEl = ref<HTMLDivElement | null>(null);

const quantities = computed(() => {
  const sum = calcSum(props.quantities);
  const left = props.goal - sum;
  return [...props.quantities, left];
});

const animatedQuantities = ref(Array(quantities.value.length).fill(0));
watch(
  quantities,
  (newQuantities) => {
    gsap.to(animatedQuantities.value, {
      endArray: newQuantities,
      duration: 1,
      overwrite: true,
    });
  },
  { immediate: true }
);

const progresses = computed(() => {
  return animatedQuantities.value.map((quantity) => quantity / props.goal);
});

const gap = 0.05;
const noramlizeProgresses = computed(() => normalize(gap, progresses.value));

const colors = [0xdcfce7, 0xd9f99d, 0x4ade80, 0x84cc16, 0x94a3b8];
const colorWrap = gsap.utils.wrap(colors);
const colorStrings = ["#dcfce7", "#d9f99d", "#4ade80", "#84cc16", "#94a3b8"];
const colorStringWrap = gsap.utils.wrap(colorStrings);

/**
 * Utility Functions
 */

// return the sum of an array
function calcSum(nums: number[]) {
  return nums.reduce(
    (previousValue, currentValue) => previousValue + currentValue,
    0
  );
}

// normalize progresses with gap
function normalize(gap: number, progresses: number[]) {
  const total = 1 + gap * progresses.length;
  return progresses.map((progress) => progress / total);
}

/**
 *  Draw an arc and an text
 *  text: string,
  startArc: number,
  endArc: number,
  x: number,
  y: number,
  radius: number,
  parent: Container,
  arcColor: number,
  textColor: number
 */
function drawArcText(
  text: string,
  startArc: number,
  endArc: number,
  x: number,
  y: number,
  radius: number,
  parent: Container,
  arcColor: number,
  textColor: number
) {
  const container = new Container();
  container.x = x;
  container.y = y;

  const graphics = new Graphics();
  // draw arc
  drawArc(graphics, 0, 0, radius, startArc, endArc, arcColor);
  container.addChild(graphics);

  // draw text
  const [textX, textY] = calcMiddlePointOfArc(startArc, endArc, radius);

  const fontSize = 15;
  const textStyle = new TextStyle({
    fontSize: fontSize,
    strokeThickness: 2,
    fill: textColor,
  });
  const textPic = new Text(text, textStyle);
  makeCenterToBePivot(textPic);
  textPic.x = textX;
  textPic.y = textY;
  textPic.rotation = calcDegreeOfTangentOfArc(startArc, endArc);
  container.addChild(textPic);
  parent.addChild(container);

  return function reDraw(options: ReDrawOptions) {
    const { newText, newStartArc, newEndArc } = options;

    graphics.clear();
    drawArc(
      graphics,
      0,
      0,
      radius,
      newStartArc ?? startArc,
      newEndArc ?? endArc,
      arcColor
    );

    if (newText) {
      textPic.text = newText;
      if (newStartArc && newEndArc) {
        const [textX, textY] = calcMiddlePointOfArc(
          newStartArc,
          newEndArc,
          radius
        );
        textPic.x = textX;
        textPic.y = textY;
        textPic.rotation = calcDegreeOfTangentOfArc(newStartArc, newEndArc);
      }
    }
  };
}

function drawArc(
  graphics: Graphics,
  x: number,
  y: number,
  radius: number,
  startArc: number,
  endArc: number,
  color: number
) {
  // draw arc
  graphics.lineStyle({ width: 20, color: color, cap: LINE_CAP.ROUND });
  graphics.arc(x, y, radius, startArc, endArc);
}

function calcMiddlePointOfArc(arc1: number, arc2: number, radius: number) {
  const degree = (arc1 + arc2) * 0.5;
  const x = Math.cos(degree) * radius;
  const y = Math.sin(degree) * radius;
  return [x, y];
}

function calcDegreeOfTangentOfArc(arc1: number, arc2: number) {
  const middlePointDegree = (arc1 + arc2) * 0.5;
  const degree = (Math.PI * 0.5 - (middlePointDegree - Math.PI)) * -1;
  return degree;
}

function makeCenterToBePivot(object: {
  pivot: ObservablePoint;
  width: number;
  height: number;
}) {
  object.pivot.x = object.width * 0.5;
  object.pivot.y = object.height * 0.5;
}

function clampArc(arc: number) {
  if (arc < Math.PI) arc = Math.PI;
  if (arc > Math.PI * 2) arc = Math.PI * 2;
  return arc;
}

interface ReDrawOptions {
  newText?: string;
  newStartArc?: number;
  newEndArc?: number;
}

type ReDraw = (options: ReDrawOptions) => void;

onMounted(() => {
  if (containerEl.value) {
    // draw
    const width = containerEl.value.clientWidth;
    const height = 200;
    const radius = width * 0.4;
    const reDrawFns: ReDraw[] = [];

    const app = new Application({
      width: width,
      height: height,
      autoDensity: true,
      resolution: window.devicePixelRatio,
      backgroundColor: 0xffffff,
      antialias: true,
    });
    containerEl.value.appendChild(app.view);

    const arcsContainer = new Container();
    arcsContainer.x = width * 0.5;
    arcsContainer.y = height * 0.9;

    app.stage.addChild(arcsContainer);

    // draw arc

    noramlizeProgresses.value.forEach((progress, index) => {
      const startArc = clampArc(
        Math.PI *
          (1 + calcSum(noramlizeProgresses.value.slice(0, index)) + gap * index)
      );
      const endArc = clampArc(Math.PI * progress + startArc);

      const reDrawFn = drawArcText(
        animatedQuantities.value[index].toFixed(0),
        startArc,
        endArc,
        0,
        0,
        radius,
        arcsContainer,
        colorWrap(index),
        0xffffff
      );
      reDrawFns.push(reDrawFn);
    });

    // draw goal
    const textContainer = new Container();
    textContainer.x = width * 0.5;
    textContainer.y = height * 0.9;
    app.stage.addChild(textContainer);

    const labelStyle = new TextStyle({
      fontSize: 15,
      stroke: 0x94a3b8,
      strokeThickness: 0.5,
      fill: 0x94a3b8,
    });
    const goalLabel = new Text("目标", labelStyle);
    makeCenterToBePivot(goalLabel);
    goalLabel.y = -70;
    textContainer.addChild(goalLabel);

    const leftLabel = new Text("剩余", labelStyle);
    makeCenterToBePivot(leftLabel);
    textContainer.addChild(leftLabel);

    const leftTextStyle = new TextStyle({
      fontSize: 25,
      stroke: 0x4ade80,
      strokeThickness: 2,
      fill: 0x4ade80,
    });
    const leftText = new Text(
      animatedQuantities.value[animatedQuantities.value.length - 1].toFixed(0),
      leftTextStyle
    );
    makeCenterToBePivot(leftText);
    leftText.y = -30;
    textContainer.addChild(leftText);

    const goalStyle = new TextStyle({
      fontSize: 20,
      stroke: 0x334155,
      strokeThickness: 1,
      fill: 0x334155,
    });
    const goalText = new Text(props.goal, goalStyle);
    makeCenterToBePivot(goalText);
    goalText.y = -100;
    textContainer.addChild(goalText);

    app.ticker.add(() => {
      noramlizeProgresses.value.forEach((progress, index) => {
        // redraw arc
        const startArc =
          progress < 0
            ? Math.PI * 2
            : clampArc(
                Math.PI *
                  (1 +
                    calcSum(noramlizeProgresses.value.slice(0, index)) +
                    gap * index)
              );
        const endArc =
          progress < 0 ? Math.PI * 2 : clampArc(Math.PI * progress + startArc);

        reDrawFns[index]({
          newText: animatedQuantities.value[index].toFixed(0),
          newStartArc: startArc,
          newEndArc: endArc,
        });

        // redraw goal
        leftText.text =
          animatedQuantities.value[animatedQuantities.value.length - 1].toFixed(
            0
          );
        makeCenterToBePivot(leftText);
        goalText.text = props.goal;
        makeCenterToBePivot(goalText);
      });
    });
  }
});
</script>

<style scoped></style>
