import type { Material } from "./materialType";

export enum Category {
  "早餐",
  "午餐",
  "晚餐",
  "零食",
}

export const categories = [
  Category.早餐,
  Category.午餐,
  Category.晚餐,
  Category.零食,
];

export const cates = ["早餐", "午餐", "晚餐", "零食"];

export type CategoryType = {
  0: "早餐";
  1: "午餐";
  2: "晚餐";
  3: "零食";
};

export interface Meal {
  id?: number;
  materialId: number;
  amount: number;
  date: number;
  category: Category;
}

export interface PopulatedMealWithCalories extends Meal {
  material: Material;
  calories: number;
}

export interface MealsByPeriod {
  meals: PopulatedMealWithCalories[];
  category: Category;
  caloriesByPeriod: number;
}

export interface MealsByDay {
  mealsByPeriod: MealsByPeriod[];
  caloriesByDay: number;
}
