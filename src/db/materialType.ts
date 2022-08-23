export interface Material {
  id?: number;
  name: string;
  caloriesPerHundredGram: number;
  imgUrl: string;
  default: boolean;
  deleted: boolean;
}

export interface UpdatedMaterial {
  name?: string;
  caloriesPerHundredGram?: number;
  imgUrl?: string;
  default?: boolean;
  deleted?: boolean;
}
