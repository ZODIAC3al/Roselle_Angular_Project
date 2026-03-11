import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { CartService, ICartItem } from '../../services/cart-service';
import { PaymentService } from '../../services/payment-service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CurrencyPipe],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit {
  cartItems: ICartItem[] = [];
  step = 1;

  isGuest = false;
  firstName = '';
  lastName = '';
  email = '';
  phone = '';
  address = '';
  city = '';
  governorate = '';

  paymentMethod = 'credit';
  cardNumber = '';
  cardName = '';
  cardExpiry = '';
  cardCvv = '';
  promoCode = '';
  promoApplied = false;
  promoDiscount = 0;
  promoError = '';

  // Payment processing state
  isProcessing = false;
  paymentError = '';

  constructor(
    private cartService: CartService,
    private auth: AuthService,
    private router: Router,
    private paymentService: PaymentService,
  ) {}

  ngOnInit(): void {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/checkout' } });
      return;
    }
    this.cartItems = this.cartService.getCartItems();
    const user = this.auth.currentUser();
    if (user) {
      this.email = user.email;
      this.firstName = user.name.split(' ')[0];
      this.lastName = user.name.split(' ').slice(1).join(' ');
      if (user.address) this.address = user.address;
    }
    if (this.cartItems.length === 0) this.router.navigate(['/cart']);
  }

  get subtotal(): number {
    return this.cartService.getGrandTotal();
  }
  get shipping(): number {
    return this.subtotal >= 1000 ? 0 : 80;
  }
  get discount(): number {
    return this.promoApplied ? this.promoDiscount : 0;
  }
  get total(): number {
    return this.subtotal + this.shipping - this.discount;
  }

  applyPromo(): void {
    const promo = this.auth.validatePromoCode(this.promoCode);
    if (promo) {
      this.promoDiscount =
        promo.discountType === 'percent'
          ? Math.round((this.subtotal * promo.discountValue) / 100)
          : promo.discountValue;
      this.promoApplied = true;
      this.promoError = '';
    } else {
      this.promoApplied = false;
      this.promoDiscount = 0;
      this.promoError = 'Invalid or inactive promo code.';
    }
  }

  nextStep(): void {
    if (this.step < 3) this.step++;
  }
  prevStep(): void {
    if (this.step > 1) this.step--;
  }

  placeOrder(): void {
    this.paymentError = '';

    if (this.paymentMethod === 'credit') {
      this.runCardPayment();
    } else {
      // COD / PayPal / Wallet — no card API needed
      this.finalizeOrder();
    }
  }

  // ─── 3-step card payment flow ────────────────────────────────────────────

  private runCardPayment(): void {
    this.isProcessing = true;

    // STEP 1: create-customer  { name, email }
    this.paymentService
      .createCustomer(`${this.firstName} ${this.lastName}`.trim(), this.email)
      .subscribe({
        next: () => this.runAddCard(),
        error: (err: Error) => this.onPaymentError(err.message),
      });
  }

  private runAddCard(): void {
    // STEP 2: add-card  { card_token: "tok_visa" }
    // In production replace "tok_visa" with a real token from Stripe.js
    this.paymentService.addCard('tok_visa').subscribe({
      next: () => this.runCharge(),
      error: (err: Error) => this.onPaymentError(err.message),
    });
  }

  private runCharge(): void {
    // STEP 3: create-charge  { amount, currency, description }
    // amount is in whole EGP (or whatever unit your backend expects)
    this.paymentService
      .createCharge(
        this.total,
        'usd', // change to 'egp' if your backend uses EGP
        `Order payment – ${this.email}`,
      )
      .subscribe({
        next: () => {
          this.isProcessing = false;
          this.finalizeOrder();
        },
        error: (err: Error) => this.onPaymentError(err.message),
      });
  }

  private onPaymentError(msg: string): void {
    this.isProcessing = false;
    this.paymentError = msg;
  }

  // ─── Save order & navigate ───────────────────────────────────────────────

  private finalizeOrder(): void {
    if (this.promoApplied) this.auth.usePromoCode(this.promoCode);
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
