<template>
  <AppCard2 ref="card">
    <h1 class="text-lg font-bold text-center">计算你的每日热量总需求</h1>
    <div class="flex justify-center gap-2 items-center my-4">
      <a-switch v-model:checked="inputDirectly" />
      <span>直接输入？</span>
    </div>
    <!-- Long Form -->
    <Transition @leave="onLeave" mode="out-in">
      <a-form
        :model="formState"
        layout="vertical"
        v-if="!inputDirectly"
        @submit="handleSubmit"
      >
        <a-form-item label="年龄" name="age">
          <a-input-number
            v-model:value="formState.age"
            :min="1"
            :max="99"
            :style="style"
          />
        </a-form-item>
        <a-form-item label="性别" name="gender">
          <a-radio-group v-model:value="formState.gender">
            <a-radio
              :style="radioStyle"
              :value="value"
              v-for="(value, key) in genderIndexMap"
              :key="key"
              >{{ key }}</a-radio
            >
          </a-radio-group>
        </a-form-item>
        <a-form-item label="身高(厘米)" name="height">
          <a-input-number
            v-model:value="formState.height"
            :min="1"
            :style="style"
          />
        </a-form-item>
        <a-form-item label="体重(千克)" name="weight">
          <a-input-number
            v-model:value="formState.weight"
            :min="1"
            :style="style"
          />
        </a-form-item>
        <a-form-item label="每周运动量" name="exerciseLevel">
          <a-select v-model:value="formState.exerciseLevel" size="small">
            <a-select-option
              v-for="(value, key) in exerciseLevelIndexMap"
              :key="key"
              :value="value"
              >{{ key }}</a-select-option
            >
          </a-select>
        </a-form-item>
        <div class="flex items-center justify-center">
          <BaseButton htmlType="submit" :isLoading="isLoading">确定</BaseButton>
        </div>
      </a-form>
      <!-- Short Form -->
      <a-form v-else layout="horizontal" @submit="handleSubmit">
        <a-form-item label="每日热量总需求(千卡)">
          <a-input-number v-model:value="calories" :min="1" :style="style" />
        </a-form-item>
        <div class="flex items-center justify-center">
          <BaseButton htmlType="submit" :isLoading="isLoading">确定</BaseButton>
        </div>
      </a-form>
    </Transition>
    <p class="mt-2 text-center">
      计算公式参考了
      <a
        class="text-green-400"
        href="https://www.omnicalculator.com/health/bmr-harris-benedict-equation#:~:text=The%20Harris%2DBenedict%20equation%20is%20a%20mathematical%20formula%20that%20allows,%2D%20(4.676%20*%20age)%20."
        >此文章</a
      >
    </p>
  </AppCard2>
</template>

<script setup lang="ts">
import { reactive, ref, toRaw } from "vue";
import BaseButton from "../elements/BaseButton.vue";
import AppCard2 from "../elements/AppCard2.vue";
import { useTDEEStore } from "../stores/TDEE";
import { useNoti } from "../plugins/useNoti";

import { useRouter } from "vue-router";
import { gsap } from "gsap";
import type { TDEEFormState } from "@/db/TDEEType";
import {
  genderIndexMap,
  exerciseLevelAlphaMap,
  exerciseLevelIndexMap,
} from "@/db/TDEEType";

const router = useRouter();
const notier = useNoti();
const TDEEStore = useTDEEStore();

// whether or not input directly
const inputDirectly = ref(false);

// form 1
let TDEEInfo: TDEEFormState | null = null;
const item = localStorage.getItem("TDEEInfo");
if (item) {
  TDEEInfo = JSON.parse(item);
}

const formDefault: TDEEFormState = {
  gender: 0,
  age: 20,
  height: 178,
  weight: 80,
  exerciseLevel: 1,
};
const formState: TDEEFormState = reactive(TDEEInfo || formDefault);

const radioStyle = reactive({
  display: "flex",
  height: "30px",
  lineHeight: "30px",
});

const style = reactive({
  width: "100%",
});

// const rules = {
//   gender: [
//     {
//       required: true,
//       validator: async (_, value) => ["男", "女"].includes(value),
//       trigger: "change",
//     },
//   ],
//   age: [
//     {
//       required: true,
//       validator: async (_, value) => value >= 1,
//       trigger: "change",
//     },
//   ],
//   height: [
//     {
//       required: true,
//       validator: async (_, value) => value >= 1,
//       trigger: "change",
//     },
//   ],
//   weight: [
//     {
//       required: true,
//       validator: async (_, value) => value >= 1,
//       trigger: "change",
//     },
//   ],
//   exerciseLevel: [
//     {
//       required: true,
//       validator: async (_, value) =>
//         [
//           "几乎或完全没有运动",
//           "每周运动1至3次",
//           "每周运动3至5次",
//           "每天运动6至7次",
//           "每天运动加重体力工作",
//         ].includes(value),
//       trigger: "change",
//     },
//   ],
// };

//form 2
const calories = ref(TDEEStore.TDEE);

// submit
const isLoading = ref(false);

function handleSubmit() {
  try {
    isLoading.value = true;
    let TDEE: number;

    if (inputDirectly.value) {
      TDEE = calories.value;
    } else if (formState.gender === 0) {
      TDEE =
        66 +
        13.7 * formState.weight +
        5 * formState.height -
        6.8 * formState.age;

      TDEE = Number(
        (TDEE * exerciseLevelAlphaMap[formState.exerciseLevel]).toFixed(0)
      );
    } else {
      TDEE =
        655 +
        9.6 * formState.weight +
        1.8 * formState.height -
        4.7 * formState.age;

      TDEE = Number(
        (TDEE * exerciseLevelAlphaMap[formState.exerciseLevel]).toFixed(0)
      );
    }

    TDEEStore.setTDEE(TDEE);
    localStorage.setItem("TDEEInfo", JSON.stringify(toRaw(formState)));
    localStorage.setItem("TDEE", String(TDEE));
    localStorage.setItem("TDEESetted", JSON.stringify(true));
    notier.success("设置成功");
    setTimeout(() => router.push({ name: "home" }), 500);

    isLoading.value = false;
  } catch {
    notier.error("设置失败");
  }
}

/**
 * Animaton
 */

const card = ref<InstanceType<typeof AppCard2> | null>(null);

function onLeave(_, done) {
  const tl = gsap.timeline();
  tl.set(card.value.$el, {
    transformPerspective: "700px",
  })
    .to(card.value.$el, {
      xPercent: -200,
      z: -600,
      ease: "power1.in",
    })
    .set(card.value.$el, {
      xPercent: 200,
      rotateY: -45,
      onComplete: done,
    })
    .to(card.value.$el, {
      xPercent: 0,
      z: 0,
      rotateY: 0,
      ease: "back(2)",
      duration: 0.7,
    });
}
</script>

<style lang="scss" scoped></style>
