import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output
} from '@angular/core';

import { CommonModule, NgClass } from '@angular/common';
import { IProduct } from '../../models/iproduct';
import { CalcPipe } from '../../pipes/calc-pipe-pipe';
import { HighlightCard } from '../../directives/highlight-card';
import { StaticProducts } from '../../services/static-products';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../services/cart-service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, NgClass, CalcPipe, HighlightCard, RouterLink, RouterLinkActive],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit, OnChanges {

  @Input() recievedID: number = 0;
  @Output() total = new EventEmitter<number>();

  totalPrice: number = 0;
  products: IProduct[] = [];
  filteratedList: IProduct[] = [];
  addedToCartId: number | null = null;

  constructor(
    private prdService: StaticProducts,
    private router: Router,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.products = this.prdService.getAllProducts();
    this.FilterationList();
  }

  ngOnChanges(): void {
    this.FilterationList();
  }

  FilterationList() {
    if (this.recievedID == 0) {
      this.filteratedList = this.products;
    } else {
      this.filteratedList = this.prdService.getProductByCatId(this.recievedID);
    }
  }

  addToCart(p: IProduct) {
    if (p.quantity === 0) return;
    this.cartService.addToCart(p);
    this.totalPrice += p.price;
    this.total.emit(this.totalPrice);
    // Brief feedback then navigate to cart
    this.addedToCartId = p.id;
    setTimeout(() => {
      this.addedToCartId = null;
      this.router.navigate(['/cart']);
    }, 600);
  }

  toggleWishlist(p: IProduct, event: MouseEvent) {
    event.stopPropagation();
    this.authService.toggleWishlist(p.id);
  }

  isInWishlist(id: number): boolean {
    return this.authService.isInWishlist(id);
  }

  isInCart(id: number): boolean {
    return this.cartService.isInCart(id);
  }

  navigateToDetails(id: number) {
    this.router.navigate(['/Details', id]);
  }
}