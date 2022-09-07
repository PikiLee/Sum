import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import MaterialsView from "../views/MaterialsView.vue";
import { useProgressBar } from "../plugins/progressBar/useProgressBar";
import { useMealStore } from "@/stores/meal";
import mealService from "../services/mealService";
import materialService from "../services/materialService";
import { useMaterialStore } from "@/stores/material";
import { watch } from "vue";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import { isEmpty } from "lodash-es";

dayjs.extend(isToday);

async function retrieveMaterialsToStore() {
  const materialStore = useMaterialStore();
  const mealStore = useMealStore();

  if (isEmpty(mealStore.transFormedTodayMeals)) {
    const transFormedTodayMeals = await mealService.transformMeals(
      mealStore.todayMeals
    );
    mealStore.setTransFormedTodayMeals(transFormedTodayMeals);
  }

  if (mealStore.recentMeals.length === 0) {
    const meals = await mealService.getRecentMeals(5);
    mealStore.setRecentMeals(meals);
  }

  watch(
    mealStore.todayMeals,
    () => {
      mealService
        .transformMeals(mealStore.todayMeals)
        .then((transFormedTodayMeals) =>
          mealStore.setTransFormedTodayMeals(transFormedTodayMeals)
        );
      mealService
        .getRecentMeals(10)
        .then((meals) => mealStore.setRecentMeals(meals));
    },
    { deep: true }
  );

  if (materialStore.allMaterials.length === 0) {
    const allMaterials = await materialService.getAll();
    materialStore.setAllMaterials(allMaterials);
  }

  if (materialStore.materials.length === 0) {
    const materials = await materialService.getNotDeleted();
    materialStore.setMaterials(materials);
  }
}

const progressBar = useProgressBar();
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      beforeEnter: async () => {
        const mealStore = useMealStore();

        /**
         * Set up stores
         */

        if (
          mealStore.todayMeals.length === 0 ||
          !dayjs(mealStore.todayMeals[0].date).isToday()
        ) {
          const meals = await mealService.getMeals(Date.now());
          const con = "caloriesByDay" in meals;
          if (!con) {
            mealStore.setTodayMeals(meals);
          }
        }

        await retrieveMaterialsToStore();
        return true;
      },
    },
    {
      path: "/materials",
      name: "materials",
      component: MaterialsView,
      beforeEnter: async () => {
        await retrieveMaterialsToStore();
        return true;
      },
    },
    {
      path: "/expenditure",
      name: "expenditure",
      component: () => import("../views/ExpenditureView.vue"),
    },
    {
      path: "/statistics",
      name: "statistics",
      component: () => import("../views/StatisticsView.vue"),
      beforeEnter: async () => {
        const aDay = 1000 * 60 * 60 * 24;

        for (let i = 1; i < 4; i++) {
          const mealsByDay = await mealService.getMeals(Date.now() - aDay, {
            transform: true,
          });
          const mealStore = useMealStore();
          if ("caloriesByDay" in mealsByDay) {
            mealStore.addMealStats(mealsByDay);
          }
        }

        return true;
      },
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue')
    // }
  ],
});

router.beforeEach(() => {
  progressBar.start();
});

router.afterEach(() => {
  progressBar.done();
});

export default router;
