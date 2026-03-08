import { Injectable } from '@angular/core';
import { IProduct } from '../models/iproduct';
import { ICategory } from '../models/icategory';

@Injectable({
  providedIn: 'root', //ast5dmha f ay component 
})
export class StaticProducts {
   products: IProduct[];
   catList: ICategory[];
  constructor(){
   this.products = [

  // --- Elegant Suits (categoryId: 1) ---
  {
    id: 1,
    name: 'The Signature Ivory Suit',
    price: 5200,
    quantity: 3,
    imgUrl: 'assets/images/img1.jpg',
    categoryId: 1,
    description: 'Impeccably tailored silhouette crafted for timeless elegance and modern sophistication.'
  },
  {
    id: 2,
    name: 'Midnight Elegance Blazer Set',
    price: 4800,
    quantity: 2,
    imgUrl: 'assets/images/img2.jpg',
    categoryId: 1,
    description: 'A refined short blazer ensemble designed for confident and effortless luxury.'
  },

  // --- Luxury Bags (categoryId: 2) ---
  {
    id: 3,
    name: 'Luxe Beige Mini Bag',
    price: 2800,
    quantity: 5,
    imgUrl: 'assets/images/img3.jpg',
    categoryId: 2,
    description: 'Premium textured leather accented with a delicate gold-tone accessories and chain.'
  },
  {
    id: 4,
    name: 'The Executive Leather Tote Bag',
    price: 3500,
    quantity: 4,
    imgUrl: 'assets/images/img4.jpg',
    categoryId: 2,
    description: 'Spacious structured design crafted from finest leather for everyday luxury'
  },

  // --- Shoes (categoryId: 3) ---
  {
    id: 5,
    name: 'Royal Stiletto Heels',
    price: 2100,
    quantity: 4,
    imgUrl: 'assets/images/img5.jpg',
    categoryId: 3,
    description: 'Elegant Italian craftsmanship with a sleek 10cm heel for a graceful statement.'
  },
  {
    id: 6,
    name: 'Velvet Wine Heels',
    price: 1800,
    quantity: 2,
    imgUrl: 'assets/images/img6.jpg',
    categoryId: 3,
    description: 'Rich tone and refined finish red heels designed for evening sophistication and nights.'
  },

  // --- Coats (categoryId: 4) ---
  {
    id: 7,
    name: 'Heritage Wool Coat',
    price: 6500,
    quantity: 3,
    imgUrl: 'assets/images/img7.jpg',
    categoryId: 4,
    description: 'Luxury double-breasted coat made from premium wool for timeless winter elegance.'
  },
  {
    id: 8,
    name: 'The Nude Trench Classic',
    price: 3900,
    quantity: 2,
    imgUrl: 'assets/images/img8.jpg',
    categoryId: 4,
    description: 'Minimalist belted trench designed for effortless sophistication in every season.'
  },

  // --- Dresses (categoryId: 5) ---
  {
    id: 9,
    name: 'Golden Grace Evening Dress',
    price: 4500,
    quantity: 3,
    imgUrl: 'assets/images/img9.jpg',
    categoryId: 5,
    description: 'Long Flowing silhouette with subtle gold accents for refined evening glamour.'
  },
  {
    id: 10,
    name: 'Noir Lace Couture Dress',
    price: 5800,
    quantity: 1,
    imgUrl: 'assets/images/img10.jpg',
    categoryId: 5,
    description: 'Hand-finished lace detailing that embodies elegance, mystery, and couture luxury.'
  }
];
 this.catList = [
  { id: 0, name: 'All Pieces' },
  { id: 1, name: 'Suits' },
  { id: 2, name: 'Bags' },
  { id: 3, name: 'Shoes' },
  { id: 4, name: 'Coats' },
  { id: 5, name: 'Dresses' }
  ];
  }
  getAllProducts():IProduct[]{
    return this.products;
  }
  getProductById(id:number):IProduct|null{
   let foundedPrd = this.products.find((product)=>product.id==id);
   return foundedPrd?foundedPrd : null;
  }
  getProductByCatId(catId:number):IProduct[]{
    return this.products.filter((product)=>product.categoryId==catId);
  }

  // addProduct(){
  // }

  getAllCategories(): ICategory[] {
  return this.catList;
}

  mapProductsToId():number[]{
    //3aiza a7awel al array of products l array of ids 
   return this.products.map((prd)=>prd.id)
  }
  
}
