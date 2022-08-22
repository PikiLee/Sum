export enum Gender {
  男,
  女,
}

export enum ExerciseLevel {
  几乎或完全没有运动,
  每周运动1至3次,
  每周运动3至5次,
  每天运动6至7次,
  每天运动及重体力工作,
}

console.log(ExerciseLevel[0]);
// type Gender = "男" | "女";

export interface TDEEFormState {
  gender: Gender;
  age: number;
  height: number;
  weight: number;
  exerciseLevel: ExerciseLevel;
}
