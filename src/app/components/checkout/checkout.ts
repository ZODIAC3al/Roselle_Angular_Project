import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CartService, ICartItem } from '../../services/cart-service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CurrencyPipe],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit {
  cartItems: ICartItem[] = [];
  step = 1; // 1=Info, 2=Payment, 3=Review

  // Guest/User info
  isGuest = false;
  firstName = '';
  lastName = '';
  email = '';
  phone = '';
  address = '';
  city = '';
  governorate = '';

  // Payment
  paymentMethod = 'credit';
  cardNumber = '';
  cardName = '';
  cardExpiry = '';
  cardCvv = '';
  promoCode = '';
  promoApplied = false;
  promoDiscount = 0;

  constructor(
    private cartService: CartService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartItems = this.cartService.getCartItems();
    const user = this.auth.currentUser();
    if (user) {
      this.email = user.email;
      this.firstName = user.name.split(' ')[0];
      this.lastName = user.name.split(' ').slice(1).join(' ');
    }
    if (this.cartItems.length === 0) this.router.navigate(['/cart']);
  }

  get subtotal(): number { return this.cartService.getGrandTotal(); }
  get shipping(): number { return this.subtotal >= 1000 ? 0 : 80; }
  get discount(): number { return this.promoApplied ? this.promoDiscount : 0; }
  get total(): number { return this.subtotal + this.shipping - this.discount; }

  applyPromo(): void {
    if (this.promoCode.toUpperCase() === 'ROSELLE10') {
      this.promoDiscount = Math.round(this.subtotal * 0.10);
      this.promoApplied = true;
    } else if (this.promoCode.toUpperCase() === 'VIP20') {
      this.promoDiscount = Math.round(this.subtotal * 0.20);
      this.promoApplied = true;
    } else {
      this.promoApplied = false;
      this.promoDiscount = 0;
      alert('Invalid promo code. Try ROSELLE10 or VIP20');
    }
  }

  nextStep(): void {
    if (this.step < 3) this.step++;
  }
  prevStep(): void {
    if (this.step > 1) this.step--;
  }

  placeOrder(): void {
    const order = this.auth.placeOrder({
      items: this.cartItems,
      subtotal: this.subtotal,
      shipping: this.shipping,
      discount: this.discount,
      promoCode: this.promoApplied ? this.promoCode : undefined,
      total: this.total,
      paymentMethod: this.paymentMethod,
      address: `${this.address}, ${this.city}, ${this.governorate}`,
      customerName: `${this.firstName} ${this.lastName}`,
      email: this.email,
    });
    this.cartService.clearCart();
    this.router.navigate(['/order-confirmation'], { state: { order } });
  }
}
