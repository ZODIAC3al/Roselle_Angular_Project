// import { HttpClient } from '@angular/common/http';
// import { Injectable, signal } from '@angular/core';
// import { Router } from '@angular/router';

// export interface IUser {
//   id: number;
//   name: string;
//   email: string;
//   phone?: string;
//   address?: string;
//   paymentDetails?: { cardHolder?: string; cardNumber?: string; expiry?: string };
//   role: 'user' | 'admin';
//   verified: boolean;
//   status: 'active' | 'restricted';
// }

// export interface IOrder {
//   subtotal: number;
//   shipping: number;
//   discount: number;
//   promoCode?: string;
//   customerName?: string;
//   email?: string;
//   id: string;
//   date: string;
//   items: any[];
//   total: number;
//   status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered';
//   paymentMethod: string;
//   address: string;
//   userId: number;
// }

// export interface IPromoCode {
//   id: number;
//   code: string;
//   discountType: 'percent' | 'fixed';
//   discountValue: number;
//   active: boolean;
//   usageCount: number;
// }

// export interface IBanner {
//   id: number;
//   imageUrl: string;
//   title: string;
//   subtitle: string;
//   active: boolean;
// }

// @Injectable({ providedIn: 'root' })
// export class AuthService {
//   private _currentUser = signal<IUser | null>(null);
//   private _pendingEmail = signal<string>('');
//   private _pendingOtp = signal<string>('');

//   private _userOrders = signal<{ [userId: number]: IOrder[] }>({});
//   private _userWishlists = signal<{ [userId: number]: number[] }>({});

//   private _promoCodes = signal<IPromoCode[]>([
//     { id: 1, code: 'ROSELLE10', discountType: 'percent', discountValue: 10, active: true, usageCount: 0 },
//     { id: 2, code: 'SAVE200', discountType: 'fixed', discountValue: 200, active: true, usageCount: 0 },
//     { id: 3, code: 'VIP20', discountType: 'percent', discountValue: 20, active: false, usageCount: 5 },
//   ]);

//   private _banners = signal<IBanner[]>([
//     { id: 1, imageUrl: 'assets/images/slider11.jpg', title: 'New Arrivals', subtitle: 'Discover the latest luxury pieces', active: true },
//     { id: 2, imageUrl: 'assets/images/slider22.jpg', title: 'Exclusive Collection', subtitle: 'Timeless elegance awaits', active: true },
//     { id: 3, imageUrl: 'assets/images/slider33.jpg', title: 'Winter Edit', subtitle: 'Wrap yourself in luxury', active: true },
//   ]);

//   private _featuredProductIds = signal<number[]>([1, 3, 9]);

//   private users: IUser[] = [
//     { id: 1, name: 'Admin User', email: 'admin@roselle.com', role: 'admin', verified: true, status: 'active' },
//     { id: 2, name: 'Jane Doe', email: 'jane@example.com', role: 'user', verified: true, status: 'active', phone: '01000000000', address: 'Cairo, Egypt' },
//     { id: 3, name: 'Marina', email: 'marina@example.com', role: 'user', verified: true, status: 'active' },
//   ];

//   currentUser = this._currentUser.asReadonly();
//   pendingEmail = this._pendingEmail.asReadonly();
//   promoCodes = this._promoCodes.asReadonly();
//   banners = this._banners.asReadonly();
//   featuredProductIds = this._featuredProductIds.asReadonly();

//   constructor(private router: Router,private http: HttpClient) {}

//   get wishlist(): number[] {
//     const uid = this._currentUser()?.id;
//     if (!uid) return [];
//     return this._userWishlists()[uid] ?? [];
//   }

//   toggleWishlist(productId: number): void {
//     const uid = this._currentUser()?.id;
//     if (!uid) return;
//     this._userWishlists.update(map => {
//       const current = map[uid] ?? [];
//       return { ...map, [uid]: current.includes(productId) ? current.filter(id => id !== productId) : [...current, productId] };
//     });
//   }

//   isInWishlist(productId: number): boolean { return this.wishlist.includes(productId); }
//   get wishlistCount(): number { return this.wishlist.length; }

//   get orders(): IOrder[] {
//     const uid = this._currentUser()?.id;
//     if (!uid) return [];
//     return this._userOrders()[uid] ?? [];
//   }

//   get allOrders(): IOrder[] {
//     const all = this._userOrders();
//     return Object.values(all).flat();
//   }

//   placeOrder(order: Omit<IOrder, 'id' | 'date' | 'status' | 'userId'>): IOrder {
//     const uid = this._currentUser()?.id ?? 0;
//     const newOrder: IOrder = {
//       ...order,
//       id: 'ORD-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
//       date: new Date().toLocaleDateString('en-EG', { year: 'numeric', month: 'long', day: 'numeric' }),
//       status: 'confirmed',
//       userId: uid,
//     };
//     this._userOrders.update(map => {
//       const current = map[uid] ?? [];
//       return { ...map, [uid]: [newOrder, ...current] };
//     });
//     return newOrder;
//   }

//   login(email: string, password: string, asAdmin: boolean): 'success' | 'not_found' | 'wrong_pass' | 'need_verify' | 'restricted' {
//     const user = this.users.find(u => u.email === email);
//     if (!user) return 'not_found';
//     if (password !== 'password123') return 'wrong_pass';
//     if (!user.verified) return 'need_verify';
//     if (asAdmin && user.role !== 'admin') return 'wrong_pass';
//     if (user.status === 'restricted') return 'restricted';
//     this._currentUser.set({ ...user });
//     return 'success';
//   }

//   apiUrl = "http://localhost:3000/api";
//   register(data:{email:string,phone:string,name:string,password:string}){
//     return this.http.post(`${this.apiUrl}/user/signup`,data);
//   }

//   signup_google(idToken:any){
//   return this.http.post(`${this.apiUrl}/user/signup_bygoogle`, {
//     idToken: idToken
//   });
// }

//   verifyOtp(otp: string) {
//      return this.http.post(`${this.apiUrl}/user/verify_account`,{otp,emil:this._pendingEmail()});
//   }

//   resendotp(){
//     return this.http.post(`${this.apiUrl}/user/resend_otp`,{emil:this._pendingEmail()});
//   }

//   sendPasswordReset(email: string): boolean {
//     const user = this.users.find(u => u.email === email);
//     if (!user) return false;
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     this._pendingOtp.set(otp);
//     this._pendingEmail.set(email);
//     console.log(`Password reset OTP for ${email}: ${otp}`);
//     return true;
//   }

//   logout(): void {
//     this._currentUser.set(null);
//     //this.router.navigate(['/login']);
//   }

//   isLoggedIn(): boolean { return this._currentUser() !== null; }
//   isAdmin(): boolean { return this._currentUser()?.role === 'admin'; }

//   updateProfile(data: { name?: string; phone?: string; address?: string; paymentDetails?: IUser['paymentDetails'] }): void {
//     const user = this.users.find(u => u.id === this._currentUser()?.id);
//     if (!user) return;
//     if (data.name) user.name = data.name;
//     if (data.phone !== undefined) user.phone = data.phone;
//     if (data.address !== undefined) user.address = data.address;
//     if (data.paymentDetails) user.paymentDetails = data.paymentDetails;
//     this._currentUser.set({ ...user });
//   }

//   getAllUsers(): IUser[] { return [...this.users]; }

//   toggleUserStatus(userId: number): void {
//     const user = this.users.find(u => u.id === userId);
//     if (!user) return;
//     user.status = user.status === 'active' ? 'restricted' : 'active';
//   }

//   addPromoCode(promo: Omit<IPromoCode, 'id' | 'usageCount'>): void {
//     this._promoCodes.update(list => [...list, { ...promo, id: Date.now(), usageCount: 0 }]);
//   }

//   updatePromoCode(id: number, data: Partial<IPromoCode>): void {
//     this._promoCodes.update(list => list.map(p => p.id === id ? { ...p, ...data } : p));
//   }

//   deletePromoCode(id: number): void {
//     this._promoCodes.update(list => list.filter(p => p.id !== id));
//   }

//   validatePromoCode(code: string): IPromoCode | null {
//     return this._promoCodes().find(p => p.code.toUpperCase() === code.toUpperCase() && p.active) ?? null;
//   }

//   usePromoCode(code: string): void {
//     this._promoCodes.update(list => list.map(p =>
//       p.code.toUpperCase() === code.toUpperCase() ? { ...p, usageCount: p.usageCount + 1 } : p
//     ));
//   }

//   addBanner(b: Omit<IBanner, 'id'>): void {
//     this._banners.update(list => [...list, { ...b, id: Date.now() }]);
//   }

//   updateBanner(id: number, data: Partial<IBanner>): void {
//     this._banners.update(list => list.map(b => b.id === id ? { ...b, ...data } : b));
//   }

//   deleteBanner(id: number): void {
//     this._banners.update(list => list.filter(b => b.id !== id));
//   }

//   get activeBanners(): IBanner[] { return this._banners().filter(b => b.active); }

//   setFeaturedProducts(ids: number[]): void { this._featuredProductIds.set(ids); }

//   toggleFeaturedProduct(id: number): void {
//     this._featuredProductIds.update(list =>
//       list.includes(id) ? list.filter(x => x !== id) : [...list, id]
//     );
//   }
// }
import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

export interface IUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  paymentDetails?: { cardHolder?: string; cardNumber?: string; expiry?: string };
  role: 'user' | 'admin';
  verified: boolean;
  status: 'active' | 'restricted';
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
  userId: number;
}

export interface IPromoCode {
  id: number;
  code: string;
  discountType: 'percent' | 'fixed';
  discountValue: number;
  active: boolean;
  usageCount: number;
}

export interface IBanner {
  id: number;
  imageUrl: string;
  title: string;
  subtitle: string;
  active: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _currentUser = signal<IUser | null>(null);
  private _pendingEmail = signal<string>('');
  private _pendingOtp = signal<string>('');

  private _userOrders = signal<{ [userId: number]: IOrder[] }>({});

  // ── Wishlist now uses string _id (MongoDB) ─────────
  private _userWishlists = signal<{ [userId: number]: string[] }>({});

  private _promoCodes = signal<IPromoCode[]>([
    {
      id: 1,
      code: 'ROSELLE10',
      discountType: 'percent',
      discountValue: 10,
      active: true,
      usageCount: 0,
    },
    {
      id: 2,
      code: 'SAVE200',
      discountType: 'fixed',
      discountValue: 200,
      active: true,
      usageCount: 0,
    },
    {
      id: 3,
      code: 'VIP20',
      discountType: 'percent',
      discountValue: 20,
      active: false,
      usageCount: 5,
    },
  ]);

  private _banners = signal<IBanner[]>([
    {
      id: 1,
      imageUrl: 'assets/images/slider11.jpg',
      title: 'New Arrivals',
      subtitle: 'Discover the latest luxury pieces',
      active: true,
    },
    {
      id: 2,
      imageUrl: 'assets/images/slider22.jpg',
      title: 'Exclusive Collection',
      subtitle: 'Timeless elegance awaits',
      active: true,
    },
    {
      id: 3,
      imageUrl: 'assets/images/slider33.jpg',
      title: 'Winter Edit',
      subtitle: 'Wrap yourself in luxury',
      active: true,
    },
  ]);

  // ── Featured product ids are now strings (_id) ─────
  private _featuredProductIds = signal<string[]>([]);

  private users: IUser[] = [
    {
      id: 1,
      name: 'Admin User',
      email: 'admin@roselle.com',
      role: 'admin',
      verified: true,
      status: 'active',
    },
    {
      id: 2,
      name: 'Jane Doe',
      email: 'jane@example.com',
      role: 'user',
      verified: true,
      status: 'active',
      phone: '01000000000',
      address: 'Cairo, Egypt',
    },
    {
      id: 3,
      name: 'Marina',
      email: 'marina@example.com',
      role: 'user',
      verified: true,
      status: 'active',
    },
  ];

  currentUser = this._currentUser.asReadonly();
  pendingEmail = this._pendingEmail.asReadonly();
  promoCodes = this._promoCodes.asReadonly();
  banners = this._banners.asReadonly();
  featuredProductIds = this._featuredProductIds.asReadonly();

  constructor(
    private router: Router,
    private http: HttpClient,
  ) {}

  // ── Wishlist (string _id) ──────────────────────────
  get wishlist(): string[] {
    const uid = this._currentUser()?.id;
    if (!uid) return [];
    return this._userWishlists()[uid] ?? [];
  }

  toggleWishlist(productId: string): void {
    const uid = this._currentUser()?.id;
    if (!uid) return;
    this._userWishlists.update((map) => {
      const current = map[uid] ?? [];
      return {
        ...map,
        [uid]: current.includes(productId)
          ? current.filter((id) => id !== productId)
          : [...current, productId],
      };
    });
  }

  isInWishlist(productId: string): boolean {
    return this.wishlist.includes(productId);
  }

  get wishlistCount(): number {
    return this.wishlist.length;
  }

  // ── Orders ─────────────────────────────────────────
  get orders(): IOrder[] {
    const uid = this._currentUser()?.id;
    if (!uid) return [];
    return this._userOrders()[uid] ?? [];
  }

  get allOrders(): IOrder[] {
    const all = this._userOrders();
    return Object.values(all).flat();
  }

  placeOrder(order: Omit<IOrder, 'id' | 'date' | 'status' | 'userId'>): IOrder {
    const uid = this._currentUser()?.id ?? 0;
    const newOrder: IOrder = {
      ...order,
      id: 'ORD-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
      date: new Date().toLocaleDateString('en-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      status: 'confirmed',
      userId: uid,
    };
    this._userOrders.update((map) => {
      const current = map[uid] ?? [];
      return { ...map, [uid]: [newOrder, ...current] };
    });
    return newOrder;
  }

  // ── Auth ───────────────────────────────────────────
  login(
    email: string,
    password: string,
    asAdmin: boolean,
  ): 'success' | 'not_found' | 'wrong_pass' | 'need_verify' | 'restricted' {
    const user = this.users.find((u) => u.email === email);
    if (!user) return 'not_found';
    if (password !== 'password123') return 'wrong_pass';
    if (!user.verified) return 'need_verify';
    if (asAdmin && user.role !== 'admin') return 'wrong_pass';
    if (user.status === 'restricted') return 'restricted';
    this._currentUser.set({ ...user });
    return 'success';
  }

  apiUrl = 'http://localhost:3000/api';

  register(data: { email: string; phone: string; name: string; password: string }) {
    return this.http.post(`${this.apiUrl}/user/signup`, data);
  }

  signup_google(idToken: any) {
    return this.http.post(`${this.apiUrl}/user/signup_bygoogle`, { idToken });
  }

  verifyOtp(otp: string) {
    return this.http.post(`${this.apiUrl}/user/verify_account`, {
      otp,
      emil: this._pendingEmail(),
    });
  }

  resendotp() {
    return this.http.post(`${this.apiUrl}/user/resend_otp`, { emil: this._pendingEmail() });
  }

  sendPasswordReset(email: string): boolean {
    const user = this.users.find((u) => u.email === email);
    if (!user) return false;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this._pendingOtp.set(otp);
    this._pendingEmail.set(email);
    console.log(`Password reset OTP for ${email}: ${otp}`);
    return true;
  }

  logout(): void {
    this._currentUser.set(null);
  }

  isLoggedIn(): boolean {
    return this._currentUser() !== null;
  }

  isAdmin(): boolean {
    return this._currentUser()?.role === 'admin';
  }

  updateProfile(data: {
    name?: string;
    phone?: string;
    address?: string;
    paymentDetails?: IUser['paymentDetails'];
  }): void {
    const user = this.users.find((u) => u.id === this._currentUser()?.id);
    if (!user) return;
    if (data.name) user.name = data.name;
    if (data.phone !== undefined) user.phone = data.phone;
    if (data.address !== undefined) user.address = data.address;
    if (data.paymentDetails) user.paymentDetails = data.paymentDetails;
    this._currentUser.set({ ...user });
  }

  getAllUsers(): IUser[] {
    return [...this.users];
  }

  toggleUserStatus(userId: number): void {
    const user = this.users.find((u) => u.id === userId);
    if (!user) return;
    user.status = user.status === 'active' ? 'restricted' : 'active';
  }

  // ── Promo codes ────────────────────────────────────
  addPromoCode(promo: Omit<IPromoCode, 'id' | 'usageCount'>): void {
    this._promoCodes.update((list) => [...list, { ...promo, id: Date.now(), usageCount: 0 }]);
  }

  updatePromoCode(id: number, data: Partial<IPromoCode>): void {
    this._promoCodes.update((list) => list.map((p) => (p.id === id ? { ...p, ...data } : p)));
  }

  deletePromoCode(id: number): void {
    this._promoCodes.update((list) => list.filter((p) => p.id !== id));
  }

  validatePromoCode(code: string): IPromoCode | null {
    return (
      this._promoCodes().find((p) => p.code.toUpperCase() === code.toUpperCase() && p.active) ??
      null
    );
  }

  usePromoCode(code: string): void {
    this._promoCodes.update((list) =>
      list.map((p) =>
        p.code.toUpperCase() === code.toUpperCase() ? { ...p, usageCount: p.usageCount + 1 } : p,
      ),
    );
  }

  // ── Banners ────────────────────────────────────────
  addBanner(b: Omit<IBanner, 'id'>): void {
    this._banners.update((list) => [...list, { ...b, id: Date.now() }]);
  }

  updateBanner(id: number, data: Partial<IBanner>): void {
    this._banners.update((list) => list.map((b) => (b.id === id ? { ...b, ...data } : b)));
  }

  deleteBanner(id: number): void {
    this._banners.update((list) => list.filter((b) => b.id !== id));
  }

  get activeBanners(): IBanner[] {
    return this._banners().filter((b) => b.active);
  }

  // ── Featured products (string _id) ────────────────
  setFeaturedProducts(ids: string[]): void {
    this._featuredProductIds.set(ids);
  }

  toggleFeaturedProduct(id: string): void {
    this._featuredProductIds.update((list) =>
      list.includes(id) ? list.filter((x) => x !== id) : [...list, id],
    );
  }
}
