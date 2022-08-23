import type {
  Meal,
  MealsByDay,
  Category,
  PopulatedMealWithCalories,
} from "./../db/mealTypes";
import { categories } from "./../db/mealTypes";
import { defineStore } from "pinia";
import { db } from "../db/db";
import { useMaterialStore } from "./material";
import { useTDEEStore } from "./TDEE";
import mealService from "../services/mealService";

// function calcCaloriesSum(meals) {
//   const materialStore = useMaterialStore();
//   const calories = meals.reduce((previousValue, currentMeal) => {
//     const material = materialStore.getById(currentMeal.materialId);
//     return (
//       previousValue +
//       (material.caloriesPerHundredGram * currentMeal.amount) / 100
//     );
//   }, 0);
//   return calories.toFixed(0);
// }

export const useMealStore = defineStore({
  id: "meal",
  state: () => ({
    currentCategory: 0,
    categories: categories,
    todayMeals: [] as Meal[],
    // recentlyAddedMeals: useObservable(
    //   liveQuery(() => {
    //     return db.meals.orderBy("date").desc().limit(5).toArray();
    //   })
    // ),
    transFormedTodayMeals: {} as MealsByDay,
    recentMeals: [] as PopulatedMealWithCalories[],
  }),
  getters: {
    getById: (state) => {
      return (id: number) => state.todayMeals.find((meal) => meal.id === id);
    },
    // transFormedTodayMeals: (state) => {
    //   return mealService.transformMeals(state.todayMeals);
    // },
    // totalCalories: (state) => {
    //   if (state.todayMeals) {
    //     return calcCaloriesSum(state.todayMeals);
    //   }
    // },
    // todayMealsByPeriod: (state) => {
    //   if (state.todayMeals) {
    //     const todayMealsByPeriod = {};
    //     state.meals.forEach(
    //       (category) =>
    //         (todayMealsByPeriod[category] = state.todayMeals.filter(
    //           (meal) => meal.meal === category
    //         ))
    //     );
    //     return todayMealsByPeriod;
    //   }
    // },
    // todayCaloriesByPeriod: (state) => {
    //   if (state.todayMealsByPeriod) {
    //     const todayCaloriesByPeriod = {};
    //     for (const [category, meals] of Object.entries(
    //       state.todayMealsByPeriod
    //     )) {
    //       todayCaloriesByPeriod[category] = calcCaloriesSum(meals);
    //     }
    //     return todayCaloriesByPeriod;
    //   }
    // },
    // caloriesProgress: (state) => {
    //   const TDEEStore = useTDEEStore();
    //   if (state.todayMeals && TDEEStore.TDEE) {
    //     const calories = state.totalCalories;
    //     return Number((1 - calories / TDEEStore.TDEE).toFixed(2));
    //   } else {
    //     return 1;
    //   }
    // },
  },
  actions: {
    setCurrentCategory(category: Category) {
      this.currentCategory = category;
    },
    setTodayMeals(meals: Meal[]) {
      this.todayMeals = meals;
    },
    addTodayMeal(meal: Meal) {
      this.todayMeals.push(meal);
    },
    setTransFormedTodayMeals(transFormedTodayMeals: MealsByDay) {
      this.transFormedTodayMeals = transFormedTodayMeals;
    },
    setRecentMeals(meals: PopulatedMealWithCalories[]) {
      this.recentMeals = meals;
    },
  },
});
