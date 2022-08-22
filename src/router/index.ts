import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import MaterialsView from "../views/MaterialsView.vue";
import { useProgressBar } from "../plugins/progressBar/useProgressBar";

const progressBar = useProgressBar();
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
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
