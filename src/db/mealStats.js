import { db } from "./db";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);

export class StatisticGetter {
  constructor() {
    this.oneDayInMiliseconds = 1000 * 60 * 60 * 24;
    this.categories = ["早餐", "午餐", "晚餐", "零食"];
  }

  getDayValidator(datetime) {
    const targetDatetime = dayjs(datetime);

    return (datetime) => {
      return dayjs(datetime).isBetween(
        targetDatetime,
        targetDatetime,
        "day",
        "[]"
      );
    };
  }

  splitMealsByPeriod(meals) {
    const mealsByPeriod = {};
    this.categories.forEach((category) => {
      mealsByPeriod[category] = meals.filter((meal) => meal.meal === category);
    });
    return mealsByPeriod;
  }

  async populateMeals(meals) {
    const result = [];
    for (const meal of meals) {
      const material = await db.materials.get(meal.materialId);
      result.push({ ...meal, material });
    }
    return result;
  }

  calcCalories(populatedMeals) {
    const meals = [];
    populatedMeals.forEach((meal) => {
      const calories = Number(
        ((meal.amount * meal.material.caloriesPerHundredGram) / 100).toFixed(0)
      );
      meals.push({ ...meal, calories });
    });
    return meals;
  }

  async getMeals(datatime, options) {
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

  calcCaloriesByPeriod(mealsByPeriod) {
    const caloriesByPeriod = {};
    let total = 0;
    for (const [key, value] of Object.entries(mealsByPeriod)) {
      const c = value.reduce((previousValue, currentMeal) => {
        return previousValue + currentMeal.calories;
      }, 0);
      caloriesByPeriod[key] = c;
      total += c;
    }

    return {
      caloriesByPeriod,
      total,
    };
  }

  async getCaloriesStats(datatime) {
    const mealsByPeriod = await this.getMeals(datatime, {
      byPeriod: true,
      populated: true,
      calcCalories: true,
    });
    return this.calcCaloriesByPeriod(mealsByPeriod);
  }
}
