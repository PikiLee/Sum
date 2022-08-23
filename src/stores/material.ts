import type { Material, UpdatedMaterial } from "./../db/materialType";
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
    addMaterial(material: Material) {
      this.materials.push(material);
      this.allMaterials.push(material);
    },
    deleteMaterial(id: number) {
      const index = this.materials.findIndex((material) => material.id === id);
      this.materials.splice(index, 1);

      this.allMaterials.forEach((material) => {
        if (material.id === id) material.deleted = true;
      });
    },
    updateMaterial(id: number, updatedMaterial: UpdatedMaterial) {
      this.materials.forEach((material) => {
        if (material.id === id)
          material = Object.assign(material, updatedMaterial);
      });
    },
  },
});
