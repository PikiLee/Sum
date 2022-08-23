import type {
  Meal,
  MealsByDay,
  Category,
  PopulatedMealWithCalories,
  UpdatedMeal,
} from "./../db/mealTypes";
import { categories } from "./../db/mealTypes";
import { defineStore } from "pinia";
import { useTDEEStore } from "./TDEE";

export const useMealStore = defineStore({
  id: "meal",
  state: () => ({
    currentCategory: 0,
    categories: categories,
    todayMeals: [] as Meal[],
    transFormedTodayMeals: {} as MealsByDay,
    recentMeals: [] as PopulatedMealWithCalories[],
    mealStats: [] as MealsByDay[],
  }),
  getters: {
    getById: (state) => {
      return (id: number) => state.todayMeals.find((meal) => meal.id === id);
    },
    caloriesProgress: (state) => {
      const TDEEStore = useTDEEStore();
      if (state.todayMeals && TDEEStore.TDEE) {
        const calories = state.transFormedTodayMeals.caloriesByDay;
        const progress = Number((1 - calories / TDEEStore.TDEE).toFixed(2));
        if (progress < 0) return 0;
        return progress;
      } else {
        return 1;
      }
    },
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
    updateTodayMeal(id: number, updatedMeal: UpdatedMeal) {
      this.todayMeals = this.todayMeals.map((meal) => {
        if (meal.id === id) {
          return Object.assign(meal, updatedMeal);
        } else {
          return meal;
        }
      });
    },
    deleteTodayMeal(id: number) {
      let index = 0;
      this.todayMeals.forEach((meal, i) => {
        if (meal.id === id) index = i;
      });
      this.todayMeals.splice(index, 1);
    },
    setTransFormedTodayMeals(transFormedTodayMeals: MealsByDay) {
      this.transFormedTodayMeals = transFormedTodayMeals;
    },
    setRecentMeals(meals: PopulatedMealWithCalories[]) {
      this.recentMeals = meals;
    },
    addMealStats(mealsByDay: MealsByDay) {
      this.mealStats.push(mealsByDay);
    },
  },
});
