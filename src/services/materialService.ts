import { useNoti } from "./../plugins/useNoti";
import type { Material, UpdatedMaterial } from "./../db/materialType";
import { db } from "@/db/db";
import { useMaterialStore } from "@/stores/material";

const notier = useNoti();

function getAll() {
  return db.materials.toArray();
}

function getNotDeleted() {
  return db.materials
    .filter((material) => material.deleted === false)
    .toArray();
}

function add(material: Material) {
  return db.materials
    .put(material)
    .then((id) => {
      material.id = id;
      const materialStore = useMaterialStore();
      materialStore.addMaterial(material);
      notier.success("添加成功");
    })
    .catch(() => notier.error("添加失败"));
}

function deleteMaterial(id: number) {
  return db.materials
    .update(id, {
      deleted: true,
    })
    .then(() => {
      const materialStore = useMaterialStore();
      materialStore.deleteMaterial(id);
      notier.success("删除成功");
    })
    .catch(() => notier.error("删除失败"));
}

function update(id: number, updatedMaterial: UpdatedMaterial) {
  return db.materials
    .update(id, updatedMaterial)
    .then(() => {
      const materialStore = useMaterialStore();
      materialStore.updateMaterial(id, updatedMaterial);
      notier.success("修改成功");
    })
    .catch(() => notier.error("修改失败"));
}

export default {
  getAll,
  getNotDeleted,
  add,
  deleteMaterial,
  update,
};
