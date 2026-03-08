import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

export interface IUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  verified: boolean;
}

export interface IOrder {
  subtotal: number;
  shipping: number;
  discount: number;
  promoCode?: string;
  customerName?: string;
  email?: string;
  id: string;
  date: string;
  items: any[];
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered';
  paymentMethod: string;
  address: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _currentUser = signal<IUser | null>(null);
  private _pendingEmail = signal<string>('');
  private _pendingOtp = signal<string>('');
  private _orders = signal<IOrder[]>([]);
  private _wishlist = signal<number[]>([]);

  // Simulated registered users
  private users: IUser[] = [
    { id: 1, name: 'Admin User', email: 'admin@roselle.com', role: 'admin', verified: true },
    { id: 2, name: 'Jane Doe', email: 'jane@example.com', role: 'user', verified: true },
    { id: 3, name: 'Marina', email: 'marina@example.com', role: 'user', verified: true },
  ];

  currentUser = this._currentUser.asReadonly();
  pendingEmail = this._pendingEmail.asReadonly();
  orders = this._orders.asReadonly();
  wishlist = this._wishlist.asReadonly();

  constructor(private router: Router) {}

  login(email: string, password: string, asAdmin: boolean): 'success' | 'not_found' | 'wrong_pass' | 'need_verify' {
    const user = this.users.find(u => u.email === email);
    if (!user) return 'not_found';
    if (password !== 'password123') return 'wrong_pass'; // Simulated password check
    if (!user.verified) return 'need_verify';
    if (asAdmin && user.role !== 'admin') return 'wrong_pass';
    this._currentUser.set(user);
    return 'success';
  }

  register(name: string, email: string, password: string): 'exists' | 'otp_sent' {
    if (this.users.find(u => u.email === email)) return 'exists';
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this._pendingOtp.set(otp);
    this._pendingEmail.set(email);
    // Store new user as unverified
    this.users.push({ id: this.users.length + 1, name, email, role: 'user', verified: false });
    console.log(`OTP for ${email}: ${otp}`); // Simulated email
    return 'otp_sent';
  }

  verifyOtp(otp: string): boolean {
    if (otp === this._pendingOtp()) {
      const user = this.users.find(u => u.email === this._pendingEmail());
      if (user) {
        user.verified = true;
        this._currentUser.set(user);
      }
      this._pendingOtp.set('');
      return true;
    }
    return false;
  }

  sendPasswordReset(email: string): boolean {
    const user = this.users.find(u => u.email === email);
    if (!user) return false;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this._pendingOtp.set(otp);
    this._pendingEmail.set(email);
    console.log(`Password reset OTP for ${email}: ${otp}`);
    return true;
  }

  logout(): void {
    this._currentUser.set(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean { return this._currentUser() !== null; }
  isAdmin(): boolean { return this._currentUser()?.role === 'admin'; }

  // Orders
  placeOrder(order: Omit<IOrder, 'id' | 'date' | 'status'>): IOrder {
    const newOrder: IOrder = {
      ...order,
      id: 'ORD-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
      date: new Date().toLocaleDateString('en-EG', { year: 'numeric', month: 'long', day: 'numeric' }),
      status: 'confirmed',
    };
    this._orders.update(o => [newOrder, ...o]);
    return newOrder;
  }

  // Wishlist
  toggleWishlist(productId: number): void {
    this._wishlist.update(list =>
      list.includes(productId) ? list.filter(id => id !== productId) : [...list, productId]
    );
  }

  isInWishlist(productId: number): boolean {
    return this._wishlist().includes(productId);
  }
}
