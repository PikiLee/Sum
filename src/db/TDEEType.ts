export type Gender = 0 | 1;
export const indexGenderMap = {
  0: "男",
  1: "女",
};

export const genderIndexMap = {
  男: 0,
  女: 1,
};

export type ExerciseLevel = 0 | 1 | 2 | 3 | 4;

export const indexExerciseLevelMap = {
  0: "几乎或完全没有运动",
  1: "每周运动1至3次",
  2: "每周运动3至5次",
  3: "每天运动6至7次",
  4: "每天运动及重体力工作",
};

export const exerciseLevelIndexMap = {
  几乎或完全没有运动: 0,
  每周运动1至3次: 1,
  每周运动3至5次: 2,
  每天运动6至7次: 3,
  每天运动及重体力工作: 4,
};

export const exerciseLevelAlphaMap = {
  0: 1.2,
  1: 1.375,
  2: 1.55,
  3: 1.725,
  4: 1.9,
};

export interface TDEEFormState {
  gender: Gender;
  age: number;
  height: number;
  weight: number;
  exerciseLevel: ExerciseLevel;
}
