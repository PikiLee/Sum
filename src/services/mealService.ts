import { useMealStore } from "@/stores/meal";
import { db } from "../db/db";
import { categories } from "../db/mealTypes";
import { useNoti } from "@/plugins/useNoti";

const notier = useNoti();

import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);

import type {
  Meal,
  MealsByPeriod,
  PopulatedMealWithCalories,
  MealsByDay,
} from "../db/mealTypes";

interface Options {
  transform?: boolean;
  limit?: number;
  populateAndCalories?: boolean;
}

function getDayValidator(datetime: number) {
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

export async function populateAndCalcCalories(meals: Meal[]) {
  const popultatedMealWithCalories = [] as PopulatedMealWithCalories[];
  for (const meal of meals) {
    const material = await db.materials.get(meal.materialId);
    let calories = 0;
    if (material) {
      calories = Number(
        ((material?.caloriesPerHundredGram * meal.amount) / 100).toFixed(0)
      );
      popultatedMealWithCalories.push({ ...meal, material, calories });
    } else {
      throw "找不到材料";
    }
  }

  return popultatedMealWithCalories;
}

export async function transformMeals(meals: Meal[]) {
  // populate and calc calories
  const popultatedMealWithCalories = await populateAndCalcCalories(meals);

  // split meals by periods,  calc calories for every period
  const mealsByPeriodList: MealsByPeriod[] = [];
  categories.forEach((category) => {
    const mealsByPeriod = {} as MealsByPeriod;
    mealsByPeriod.category = category;
    mealsByPeriod.meals = popultatedMealWithCalories.filter(
      (meal) => meal.category === category
    );
    mealsByPeriod.caloriesByPeriod = mealsByPeriod.meals.reduce(
      (previousValue: number, currentMeal: PopulatedMealWithCalories) => {
        return previousValue + currentMeal.calories;
      },
      0
    );
    mealsByPeriodList.push(mealsByPeriod);
  });

  // calc calories by day
  const mealsByDay = {} as MealsByDay;
  mealsByDay.mealsByPeriod = mealsByPeriodList;
  mealsByDay.caloriesByDay = mealsByDay.mealsByPeriod.reduce(
    (previousValue: number, currentMealsByPeriod: MealsByPeriod) => {
      return previousValue + currentMealsByPeriod.caloriesByPeriod;
    },
    0
  );

  return mealsByDay;
}

export async function getMeals(datatime: number, options?: Options) {
  if (!options) options = {} as Options;
  const { transform = false, limit = 0, populateAndCalories = false } = options;
  const dayValidator = getDayValidator(datatime);

  let result;
  if (limit > 0) {
    result = await db.meals
      .filter((meal) => dayValidator(meal.date))
      .limit(limit)
      .reverse()
      .sortBy("date");
  } else {
    result = await db.meals.filter((meal) => dayValidator(meal.date)).toArray();
  }

  if (transform) {
    await transformMeals(result);
  } else if (populateAndCalories) {
    result = await populateAndCalcCalories(result);
  }

  return result;
}

function add(meal: Meal) {
  return db.meals
    .put(meal)
    .then((id) => {
      const mealStore = useMealStore();
      meal.id = id;
      mealStore.addTodayMeal(meal);
      notier.success("添加成功");
    })
    .catch(() => {
      notier.error("添加失败");
    });
}

export default {
  getMeals,
  transformMeals,
  add,
};
