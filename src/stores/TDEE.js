import { defineStore } from "pinia";

export const useTDEEStore = defineStore({
  id: "TDEE",
  state: () => ({
    TDEE: null,
  }),
  getters: {
    doubleCount: (state) => state.counter * 2,
  },
  actions: {
    setTDEE(value) {
      this.TDEE = value;
    },
  },
});
