// db.js
import Dexie from "dexie";
import type { Meal } from "./mealTypes";
import type { Material } from "./materialType";

export class sumDb extends Dexie {
  materials!: Dexie.Table<Material, number>;
  meals!: Dexie.Table<Meal, number>;

  constructor() {
    super("sumDb");

    //
    // Define tables and indexes
    // (Here's where the implicit table props are dynamically created)
    //
    this.version(1).stores({
      materials: "++id, name, caloriesPerHundredGram, imgUrl, default, deleted",
      meals: "++id, materialId, amount, date, category",
    });
  }
}

export const db = new sumDb();
