// db.js
import Dexie from "dexie";

export const db = new Dexie("sumDb");
db.version(1).stores({
  materials: "++id, name, caloriesPerHundredGram, imgUrl, default, deleted",
  meals: "++id, materialId, amount, date, meal",
});
