export interface IProduct {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imgUrl: string;
  categoryId: number;
  gender?: 'women' | 'men';
  description: string;
}