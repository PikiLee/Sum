import type { Material } from "./../db/materialType";
import { defineStore } from "pinia";

export const useMaterialStore = defineStore({
  id: "material",
  state: () => ({
    materials: [] as Material[],
    allMaterials: [] as Material[],
  }),
  getters: {
    getById: (state) => {
      return (id: number) => state.allMaterials.find((item) => item.id === id);
    },
    search: (state) => {
      return (str: string) =>
        state.allMaterials.filter((material) => material.name.includes(str));
    },
  },
  actions: {
    setMaterials(materials: Material[]) {
      this.materials = materials;
    },
    setAllMaterials(materials: Material[]) {
      this.allMaterials = materials;
    },
  },
});
