import { defineStore } from "pinia";

export const useTDEEStore = defineStore({
  id: "TDEE",
  state: () => ({
    TDEE: 2500,
  }),
  getters: {},
  actions: {
    setTDEE(value: number) {
      this.TDEE = value;
    },
  },
});
