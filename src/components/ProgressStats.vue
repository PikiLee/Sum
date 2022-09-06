<template>
  <div ref="containerEl"></div>
</template>

<script setup lang="ts">
import {
  Application,
  Container,
  Graphics,
  LINE_CAP,
  TextStyle,
  Text,
  settings,
  SCALE_MODES,
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
  textPic.pivot.x = textPic.width * 0.5;
  textPic.pivot.y = textPic.height * 0.5;
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
    const height = 400;
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
    arcsContainer.y = height * 0.5;

    app.stage.addChild(arcsContainer);

    // draw arc
    const colors = [0xdcfce7, 0xd9f99d, 0x4ade80, 0x84cc16, 0x94a3b8];
    const colorWrap = gsap.utils.wrap(colors);

    noramlizeProgresses.value.forEach((progress, index) => {
      const startArc =
        Math.PI *
        (1 + calcSum(noramlizeProgresses.value.slice(0, index)) + gap * index);
      const endArc = Math.PI * progress + startArc;

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
    


    app.ticker.add(() => {
      noramlizeProgresses.value.forEach((progress, index) => {
        const startArc =
          Math.PI *
          (1 +
            calcSum(noramlizeProgresses.value.slice(0, index)) +
            gap * index);
        const endArc = Math.PI * progress + startArc;

        reDrawFns[index]({
          newText: animatedQuantities.value[index].toFixed(0),
          newStartArc: startArc,
          newEndArc: endArc,
        });
        // console.log("tick");
      });
    });
  }
});
</script>

<style scoped></style>
