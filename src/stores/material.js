import { defineStore } from "pinia";
import { liveQuery } from "dexie";
import { useObservable } from "@vueuse/rxjs";
import { db } from "../db/db";

export const useMaterialStore = defineStore({
  id: "material",
  state: () => ({
    materials: useObservable(
      liveQuery(() =>
        db.materials.filter((material) => material.deleted === false).toArray()
      )
    ),
    allMaterials: useObservable(liveQuery(() => db.materials.toArray())),
  }),
  getters: {
    getById: (state) => {
      return (id) => state.allMaterials.find((item) => item.id === id);
    },
    search: (state) => {
      return (str) =>
        state.materials.filter((material) => material.name.includes(str));
    },
  },
  actions: {},
});
