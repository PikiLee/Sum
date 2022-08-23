import { db } from "@/db/db";
function getAll() {
  return db.materials.toArray();
}

function getNotDeleted() {
  return db.materials
    .filter((material) => material.deleted === false)
    .toArray();
}

export default {
  getAll,
  getNotDeleted,
};
