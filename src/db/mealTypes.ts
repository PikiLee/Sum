import type { Material } from "./materialType";

export enum Category {
  "早餐",
  "午餐",
  "晚餐",
  "零食",
}

export type CategoryType = {
  0: "早餐";
  1: "午餐";
  2: "晚餐";
  3: "零食";
};

export interface Meal {
  id: number;
  materialId: number;
  amount: number;
  date: number;
  category: Category;
}

export type MealsByPeriod = {
  [Property in keyof CategoryType]: Meal[];
};

export interface PopultatedMeal extends Meal {
  material: Material;
}

export interface MealWithCalories extends PopultatedMeal {
  calories: number;
}
