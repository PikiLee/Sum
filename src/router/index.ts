import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import MaterialsView from "../views/MaterialsView.vue";
import { useProgressBar } from "../plugins/progressBar/useProgressBar";
import { useMealStore } from "@/stores/meal";
import mealService from "../services/mealService";
import materialService from "../services/materialService";
import { useMaterialStore } from "@/stores/material";
import { watch } from "vue";

const progressBar = useProgressBar();
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      beforeEnter: async () => {
        const materialStore = useMaterialStore();
        const mealStore = useMealStore();

        /**
         * Set up stores
         */

        const meals = await mealService.getMeals(Date.now());
        mealStore.setTodayMeals(meals);

        watch(
          mealStore.todayMeals,
          () => {
            mealService
              .transformMeals(mealStore.todayMeals)
              .then((transFormedTodayMeals) =>
                mealStore.setTransFormedTodayMeals(transFormedTodayMeals)
              );
            mealService
              .getMeals(Date.now(), { limit: 5, populateAndCalories: true })
              .then((meals) => mealStore.setRecentMeals(meals));
          },
          { immediate: true, deep: true }
        );

        const allMaterials = await materialService.getAll();
        materialStore.setAllMaterials(allMaterials);

        const materials = await materialService.getNotDeleted();
        materialStore.setMaterials(materials);

        return true;
      },
    },
    {
      path: "/materials",
      name: "materials",
      component: MaterialsView,
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
