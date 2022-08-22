import { defineStore } from "pinia";
import { liveQuery } from "dexie";
import { useObservable } from "@vueuse/rxjs";
import { db } from "../db/db";
import { useMaterialStore } from "./material";
import { useTDEEStore } from "./TDEE";

function calcCaloriesSum(meals) {
  const materialStore = useMaterialStore();
  const calories = meals.reduce((previousValue, currentMeal) => {
    const material = materialStore.getById(currentMeal.materialId);
    return (
      previousValue +
      (material.caloriesPerHundredGram * currentMeal.amount) / 100
    );
  }, 0);
  return calories.toFixed(0);
}

export const useMealStore = defineStore({
  id: "meal",
  state: () => ({
    currentMeal: "早餐",
    meals: ["早餐", "午餐", "晚餐", "零食"],
    todayMeals: useObservable(
      liveQuery(() =>
        db.meals
          .filter((meal) => {
            const today = new Date();
            const date = new Date(meal.date);
            return (
              date.getDate() === today.getDate() &&
              date.getMonth() === today.getMonth() &&
              date.getFullYear() === date.getFullYear()
            );
          })
          .toArray()
      )
    ),
    recentlyAddedMeals: useObservable(
      liveQuery(() => {
        return db.meals.orderBy("date").desc().limit(5).toArray();
      })
    ),
  }),
  getters: {
    getById: (state) => {
      return (id) => state.todayMeals.find((meal) => meal.id === id);
    },
    totalCalories: (state) => {
      if (state.todayMeals) {
        return calcCaloriesSum(state.todayMeals);
      }
    },
    todayMealsByPeriod: (state) => {
      if (state.todayMeals) {
        const todayMealsByPeriod = {};
        state.meals.forEach(
          (category) =>
            (todayMealsByPeriod[category] = state.todayMeals.filter(
              (meal) => meal.meal === category
            ))
        );
        return todayMealsByPeriod;
      }
    },
    todayCaloriesByPeriod: (state) => {
      if (state.todayMealsByPeriod) {
        const todayCaloriesByPeriod = {};
        for (const [category, meals] of Object.entries(
          state.todayMealsByPeriod
        )) {
          todayCaloriesByPeriod[category] = calcCaloriesSum(meals);
        }
        return todayCaloriesByPeriod;
      }
    },
    caloriesProgress: (state) => {
      const TDEEStore = useTDEEStore();
      if (state.todayMeals && TDEEStore.TDEE) {
        const calories = state.totalCalories;
        return Number((1 - calories / TDEEStore.TDEE).toFixed(2));
      } else {
        return 1;
      }
    },
  },
  actions: {
    setCurrentMeal(currentMeal) {
      this.currentMeal = currentMeal;
    },
  },
});
