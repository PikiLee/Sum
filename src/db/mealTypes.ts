// export interface Meal {
//   id: number;
//   name: string;
//   caloriesPerHundredGram: number;
//   imgUrl: string;
//   default: boolean;
//   deleted: boolean;
// }

export interface Meal {
  id: number;
  materialId: number;
  amount: number;
  date: number;
  category: string;
}
