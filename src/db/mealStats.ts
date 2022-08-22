import { db } from "./db";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);

import type {
  Category,
  Meal,
  MealsByPeriod,
  PopultatedMeal,
  MealWithCalories,
} from "./mealTypes";

interface Options {
  byPeriod: boolean;
  populated: boolean;
  calcCalories: boolean;
  limit?: number;
}

export class StatisticGetter {
  oneDayInMiliseconds: number;
  categories: Category[];
  constructor() {
    this.oneDayInMiliseconds = 1000 * 60 * 60 * 24;
    this.categories = [0, 1, 2, 3];
  }

  getDayValidator(datetime: number) {
    const targetDatetime = dayjs(datetime);

    return (datetime: number) => {
      return dayjs(datetime).isBetween(
        targetDatetime,
        targetDatetime,
        "day",
        "[]"
      );
    };
  }

  splitMealsByPeriod(meals: Meal[]) {
    const mealsByPeriod = {} as MealsByPeriod;
    this.categories.forEach((category) => {
      mealsByPeriod[category] = meals.filter(
        (meal) => meal.category === category
      );
    });
    return mealsByPeriod;
  }

  async populateMeals(meals: Meal[]) {
    const result = [];
    for (const meal of meals) {
      const material = await db.materials.get(meal.materialId);
      result.push({ ...meal, material });
    }
    return result;
  }

  calcCalories(populatedMeals: PopultatedMeal[]) {
    const meals = [] as MealWithCalories[];
    populatedMeals.forEach((meal) => {
      const calories = Number(
        ((meal.amount * meal.material.caloriesPerHundredGram) / 100).toFixed(0)
      );
      meals.push({ ...meal, calories });
    });
    return meals;
  }

  async getMeals(datatime: number, options: Options) {
    const {
      byPeriod = false,
      populated = false,
      calcCalories = false,
      limit = 0,
    } = options;
    const dayValidator = this.getDayValidator(datatime);

    let result;
    if (limit > 0) {
      result = await db.meals
        .filter((meal) => dayValidator(meal.date))
        .sortBy("date")
        .desc()
        .limit(limit)
        .toArray();
    } else {
      result = await db.meals
        .filter((meal) => dayValidator(meal.date))
        .toArray();
    }

    if (populated) result = await this.populateMeals(result);
    if (populated && calcCalories) result = this.calcCalories(result);

    if (byPeriod) result = this.splitMealsByPeriod(result);

    return result;
  }

  calcCaloriesByPeriod(mealsByPeriod: MealsByPeriod) {
    const caloriesByPeriod = {};
    let total = 0;
    for (const key in mealsByPeriod) {
      const c = mealsByPeriod[key].reduce(
        (previousValue: number, currentMeal: Meal) => {
          return previousValue + currentMeal.calories;
        },
        0
      );
      caloriesByPeriod[key] = c;
      total += c;
    }

    return {
      caloriesByPeriod,
      total,
    };
  }

  async getCaloriesStats(datatime: number) {
    const mealsByPeriod = await this.getMeals(datatime, {
      byPeriod: true,
      populated: true,
      calcCalories: true,
    });
    return this.calcCaloriesByPeriod(mealsByPeriod);
  }
}
