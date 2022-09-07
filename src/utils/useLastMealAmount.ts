import { ref } from "vue";
import mealService from "@/services/mealService";

const amount = ref(100);

function getAmount(materialId: number) {
  return mealService.getMostRecentMealByMaterial(materialId).then((meal) => {
    if (meal) {
      amount.value = meal.amount;
    }
  });
}

export function useLastMealAmount() {
  return { getAmount, amount };
}
