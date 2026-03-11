// import { Injectable } from '@angular/core';
// import { IProduct } from '../models/iproduct';
// import { StaticProducts } from './static-products';

// export interface ICartItem extends IProduct {
//   cartQuantity: number;
// }

// @Injectable({ providedIn: 'root' })
// export class CartService {
//   private cartItems: ICartItem[] = [];

//   constructor(private productService: StaticProducts) {}

//   // ── Add ────────────────────────────────────────────
//   addToCart(product: IProduct): void {
//     const stock = this.productService.getProductById(product.id);
//     if (!stock || stock.quantity <= 0) return;

//     const existing = this.cartItems.find(i => i.id === product.id);
//     if (existing) {
//       existing.cartQuantity++;
//     } else {
//       // Snapshot price/name etc., but quantity in the cart item is cartQuantity
//       this.cartItems.push({ ...stock, cartQuantity: 1 });
//     }
//     stock.quantity--;   // deduct from store
//   }

//   // ── Remove entirely → restore ALL units ───────────
//   removeFromCart(productId: number): void {
//     const item = this.cartItems.find(i => i.id === productId);
//     if (item) {
//       const stock = this.productService.getProductById(productId);
//       if (stock) stock.quantity += item.cartQuantity;  // restore all
//       this.cartItems = this.cartItems.filter(i => i.id !== productId);
//     }
//   }

//   // ── Increment (add one more) ───────────────────────
//   increment(productId: number): void {
//     const item  = this.cartItems.find(i => i.id === productId);
//     const stock = this.productService.getProductById(productId);
//     if (item && stock && stock.quantity > 0) {
//       item.cartQuantity++;
//       stock.quantity--;
//     }
//   }

//   // ── Decrement (remove one) ─────────────────────────
//   decrement(productId: number): void {
//     const item = this.cartItems.find(i => i.id === productId);
//     if (!item) return;

//     const stock = this.productService.getProductById(productId);
//     if (stock) stock.quantity++;   // always restore one unit back

//     item.cartQuantity--;

//     if (item.cartQuantity <= 0) {
//       // item fully removed — stock already restored above
//       this.cartItems = this.cartItems.filter(i => i.id !== productId);
//     }
//   }

//   // ── Clear after purchase (stock already consumed) ─
//   clearCart(): void {
//     this.cartItems = [];
//   }

//   // ── Getters ────────────────────────────────────────
//   getCartItems(): ICartItem[]  { return this.cartItems; }
//   getCartCount(): number       { return this.cartItems.reduce((s, i) => s + i.cartQuantity, 0); }
//   getGrandTotal(): number      { return this.cartItems.reduce((s, i) => s + i.price * i.cartQuantity, 0); }
//   isInCart(id: number): boolean { return this.cartItems.some(i => i.id === id); }
//   getCartQuantity(id: number): number { return this.cartItems.find(i => i.id === id)?.cartQuantity ?? 0; }
// }
import { Injectable } from '@angular/core';
import { IProduct } from '../models/iproduct';
import { StaticProducts } from './static-products';

export interface ICartItem extends IProduct {
  cartQuantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartItems: ICartItem[] = [];

  constructor(private productService: StaticProducts) {}

  // ── Add ────────────────────────────────────────────
  addToCart(product: IProduct): void {
    const stock = this.productService.getProductById(product._id);
    if (!stock || stock.quantity <= 0) return;

    const existing = this.cartItems.find((i) => i._id === product._id);
    if (existing) {
      existing.cartQuantity++;
    } else {
      this.cartItems.push({ ...stock, cartQuantity: 1 });
    }
    stock.quantity--; // deduct from store
  }

  // ── Remove entirely → restore ALL units ───────────
  removeFromCart(productId: string): void {
    const item = this.cartItems.find((i) => i._id === productId);
    if (item) {
      const stock = this.productService.getProductById(productId);
      if (stock) stock.quantity += item.cartQuantity;
      this.cartItems = this.cartItems.filter((i) => i._id !== productId);
    }
  }

  // ── Increment (add one more) ───────────────────────
  increment(productId: string): void {
    const item = this.cartItems.find((i) => i._id === productId);
    const stock = this.productService.getProductById(productId);
    if (item && stock && stock.quantity > 0) {
      item.cartQuantity++;
      stock.quantity--;
    }
  }

  // ── Decrement (remove one) ─────────────────────────
  decrement(productId: string): void {
    const item = this.cartItems.find((i) => i._id === productId);
    if (!item) return;

    const stock = this.productService.getProductById(productId);
    if (stock) stock.quantity++;

    item.cartQuantity--;

    if (item.cartQuantity <= 0) {
      this.cartItems = this.cartItems.filter((i) => i._id !== productId);
    }
  }

  // ── Clear after purchase ───────────────────────────
  clearCart(): void {
    this.cartItems = [];
  }

  // ── Getters ────────────────────────────────────────
  getCartItems(): ICartItem[] {
    return this.cartItems;
  }
  getCartCount(): number {
    return this.cartItems.reduce((s, i) => s + i.cartQuantity, 0);
  }
  getGrandTotal(): number {
    return this.cartItems.reduce((s, i) => s + i.price * i.cartQuantity, 0);
  }
  isInCart(id: string): boolean {
    return this.cartItems.some((i) => i._id === id);
  }
  getCartQuantity(id: string): number {
    return this.cartItems.find((i) => i._id === id)?.cartQuantity ?? 0;
  }
}
