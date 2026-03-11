// import { Component, OnInit } from '@angular/core';
// import { CommonModule, CurrencyPipe } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { RouterLink, Router } from '@angular/router';
// import { StaticProducts } from '../../services/static-products';
// import { IProduct } from '../../models/iproduct';
// import { AuthService, IUser, IPromoCode, IBanner } from '../../services/auth.service';

// @Component({
//   selector: 'app-admin-dashboard',
//   standalone: true,
//   imports: [CommonModule, FormsModule, RouterLink, CurrencyPipe],
//   templateUrl: './admin-dashboard.html',
//   styleUrl: './admin-dashboard.css',
// })
// export class AdminDashboard implements OnInit {
//   products: IProduct[] = [];
//   activeTab = 'products';
//   searchTerm = '';
//   showModal = false;
//   editingProduct: IProduct | null = null;
//   form: Partial<IProduct> = {};

//   // User management
//   users: IUser[] = [];

//   // Promo codes
//   showPromoModal = false;
//   editingPromo: IPromoCode | null = null;
//   promoForm: Partial<IPromoCode> = {};

//   // Banners
//   showBannerModal = false;
//   editingBanner: IBanner | null = null;
//   bannerForm: Partial<IBanner> = {};

//   constructor(
//     private productService: StaticProducts,
//     private auth: AuthService,
//     private router: Router,
//   ) {}

//   ngOnInit(): void {
//     if (!this.auth.isAdmin()) {
//       this.router.navigate(['/login']);
//       return;
//     }
//     this.products = this.productService.getAllProducts();
//     this.users = this.auth.getAllUsers();
//   }

//   // ── Products ──────────────────────────────────────
//   get filteredProducts(): IProduct[] {
//     return this.products.filter((p) =>
//       p.name.toLowerCase().includes(this.searchTerm.toLowerCase()),
//     );
//   }

//   openAdd(): void {
//     this.editingProduct = null;
//     this.form = { categoryId: 1, quantity: 1 };
//     this.showModal = true;
//   }
//   openEdit(product: IProduct): void {
//     this.editingProduct = product;
//     this.form = { ...product };
//     this.showModal = true;
//   }

//   save(): void {
//     if (!this.form.name || !this.form.price) return;
//     if (this.editingProduct) {
//       Object.assign(this.editingProduct, this.form);
//     } else {
//       this.products.push({
//         id: Math.max(...this.products.map((p) => p.id)) + 1,
//         name: this.form.name!,
//         price: this.form.price!,
//         quantity: this.form.quantity || 1,
//         imgUrl: this.form.imgUrl || 'assets/images/img1.jpg',
//         categoryId: this.form.categoryId || 1,
//         description: this.form.description || '',
//       });
//     }
//     this.showModal = false;
//   }

//   delete(id: number): void {
//     if (confirm('Delete this product?')) this.products = this.products.filter((p) => p.id !== id);
//   }

//   getCategoryName(id: number): string {
//     const map: Record<number, string> = {
//       1: 'Suits',
//       2: 'Bags',
//       3: 'Shoes',
//       4: 'Coats',
//       5: 'Dresses',
//     };
//     return map[id] ?? 'Other';
//   }

//   // ── Featured ──────────────────────────────────────
//   isFeatured(id: number): boolean {
//     return this.auth.featuredProductIds().includes(id);
//   }
//   toggleFeatured(id: number): void {
//     this.auth.toggleFeaturedProduct(id);
//   }

//   // ── Orders ────────────────────────────────────────
//   get orders() {
//     return this.auth.allOrders;
//   }

//   // ── Users ─────────────────────────────────────────
//   refreshUsers(): void {
//     this.users = this.auth.getAllUsers();
//   }

//   toggleUser(id: number): void {
//     this.auth.toggleUserStatus(id);
//     this.refreshUsers();
//   }

//   // ── Promo Codes ───────────────────────────────────
//   get promoCodes() {
//     return this.auth.promoCodes();
//   }

//   openAddPromo(): void {
//     this.editingPromo = null;
//     this.promoForm = { discountType: 'percent', active: true };
//     this.showPromoModal = true;
//   }
//   openEditPromo(p: IPromoCode): void {
//     this.editingPromo = p;
//     this.promoForm = { ...p };
//     this.showPromoModal = true;
//   }

//   savePromo(): void {
//     if (!this.promoForm.code || !this.promoForm.discountValue) return;
//     if (this.editingPromo) {
//       this.auth.updatePromoCode(this.editingPromo.id, this.promoForm);
//     } else {
//       this.auth.addPromoCode({
//         code: this.promoForm.code!.toUpperCase(),
//         discountType: this.promoForm.discountType || 'percent',
//         discountValue: this.promoForm.discountValue!,
//         active: this.promoForm.active ?? true,
//       });
//     }
//     this.showPromoModal = false;
//   }

//   deletePromo(id: number): void {
//     if (confirm('Delete promo code?')) this.auth.deletePromoCode(id);
//   }
//   togglePromo(id: number, active: boolean): void {
//     this.auth.updatePromoCode(id, { active });
//   }

//   // ── Banners ───────────────────────────────────────
//   get banners() {
//     return this.auth.banners();
//   }

//   openAddBanner(): void {
//     this.editingBanner = null;
//     this.bannerForm = { active: true };
//     this.showBannerModal = true;
//   }
//   openEditBanner(b: IBanner): void {
//     this.editingBanner = b;
//     this.bannerForm = { ...b };
//     this.showBannerModal = true;
//   }

//   saveBanner(): void {
//     if (!this.bannerForm.imageUrl || !this.bannerForm.title) return;
//     if (this.editingBanner) {
//       this.auth.updateBanner(this.editingBanner.id, this.bannerForm);
//     } else {
//       this.auth.addBanner({
//         imageUrl: this.bannerForm.imageUrl!,
//         title: this.bannerForm.title!,
//         subtitle: this.bannerForm.subtitle || '',
//         active: this.bannerForm.active ?? true,
//       });
//     }
//     this.showBannerModal = false;
//   }

//   deleteBanner(id: number): void {
//     if (confirm('Delete banner?')) this.auth.deleteBanner(id);
//   }
//   toggleBanner(id: number, active: boolean): void {
//     this.auth.updateBanner(id, { active });
//   }

//   // ── Stats ─────────────────────────────────────────
//   get stats() {
//     return {
//       totalProducts: this.products.length,
//       totalOrders: this.orders.length,
//       totalRevenue: this.orders.reduce((s, o) => s + o.total, 0),
//       lowStock: this.products.filter((p) => p.quantity <= 2).length,
//       totalUsers: this.users.filter((u) => u.role === 'user').length,
//       restrictedUsers: this.users.filter((u) => u.status === 'restricted').length,
//     };
//   }

//   logout(): void {
//     this.auth.logout();
//   }
// }
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

import { StaticProducts } from '../../services/static-products';
import { ProductService, IProductPayload } from '../../services/product.service';
import { IProduct } from '../../models/iproduct';
import { AuthService, IPromoCode, IBanner } from '../../services/auth.service';

export interface IApiCategory {
  _id: string;
  category_name: string;
}

export interface IDbUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  isblocked: boolean;
  isVerified: boolean;
  deletedAt: string | null;
  createdAt: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CurrencyPipe],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit, OnDestroy {
  private sub!: Subscription;

  private readonly apiUrl = 'http://localhost:3000/api';

  products: IProduct[] = [];
  activeTab = 'products';
  searchTerm = '';
  showModal = false;
  saving = false;
  editingProduct: IProduct | null = null;

  apiCategories: IApiCategory[] = [];

  form: {
    name?: string;
    price?: number;
    stock?: number;
    imgUrl?: string;
    categoryId?: string;
    description?: string;
    gender?: 'men' | 'women' | 'unisex';
  } = {};

  // Users from DB
  dbUsers: IDbUser[] = [];
  usersLoading = false;

  // Promo codes
  showPromoModal = false;
  editingPromo: IPromoCode | null = null;
  promoForm: Partial<IPromoCode> = {};

  // Banners
  showBannerModal = false;
  editingBanner: IBanner | null = null;
  bannerForm: Partial<IBanner> = {};

  constructor(
    private productStore: StaticProducts,
    private productApi: ProductService,
    private auth: AuthService,
    private router: Router,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    if (!this.auth.isAdmin()) {
      this.router.navigate(['/login']);
      return;
    }

    this.sub = this.productStore.products$.subscribe((prds) => {
      this.products = prds;
    });

    this.http.get<any>(`${this.apiUrl}/categories?limit=50`).subscribe((res) => {
      this.apiCategories = res.data?.categories ?? [];
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  // ── Tab switch — load users on demand ─────────────
  onTabChange(tab: string): void {
    this.activeTab = tab;
    if (tab === 'users' && this.dbUsers.length === 0) {
      this.loadUsers();
    }
  }

  loadUsers(): void {
    this.usersLoading = true;
    this.http.get<any>(`${this.apiUrl}/user/all`).subscribe({
      next: (res) => {
        this.dbUsers = res.users ?? [];
        this.usersLoading = false;
      },
      error: (err) => {
        console.error('Failed to load users', err);
        this.usersLoading = false;
      },
    });
  }

  toggleBlock(user: IDbUser): void {
    this.http.patch<any>(`${this.apiUrl}/user/block/${user._id}`, {}).subscribe({
      next: (res) => {
        user.isblocked = res.user.isblocked;
      },
      error: (err) => console.error('Block/unblock failed', err),
    });
  }

  // ── Products ───────────────────────────────────────

  get filteredProducts(): IProduct[] {
    return this.products.filter((p) =>
      p.name.toLowerCase().includes(this.searchTerm.toLowerCase()),
    );
  }

  openAdd(): void {
    this.editingProduct = null;
    this.form = {
      categoryId: this.apiCategories[0]?._id ?? '',
      stock: 1,
      gender: 'unisex',
    };
    this.showModal = true;
  }

  openEdit(product: IProduct): void {
    this.editingProduct = product;
    const catId =
      typeof product.categoryId === 'object'
        ? (product.categoryId as any)?._id?.toString()
        : product.categoryId;
    this.form = {
      name: product.name,
      price: product.price,
      stock: product.stock ?? product.quantity,
      imgUrl: product.imgUrl || product.image,
      categoryId: catId,
      description: product.description,
      gender: product.gender as any,
    };
    this.showModal = true;
  }

  save(): void {
    if (!this.form.name || !this.form.price || !this.form.categoryId) return;

    this.saving = true;

    const payload: IProductPayload = {
      name: this.form.name,
      description: this.form.description || '',
      price: Number(this.form.price),
      categoryId: this.form.categoryId,
      stock: Number(this.form.stock ?? 1),
      image: this.form.imgUrl || '',
      gender: this.form.gender ?? 'unisex',
    };

    if (this.editingProduct) {
      this.productApi.updateProduct(this.editingProduct._id, payload).subscribe({
        next: () => {
          this.productStore.reloadProducts();
          this.showModal = false; // ← close modal on success
          this.saving = false;
        },
        error: (err) => {
          console.error('Update failed', err);
          alert('Update failed: ' + (err.error?.message || err.message));
          this.saving = false;
        },
      });
    } else {
      this.productApi.createProduct(payload).subscribe({
        next: () => {
          this.productStore.reloadProducts();
          this.showModal = false; // ← close modal on success
          this.saving = false;
        },
        error: (err) => {
          console.error('Create failed', err);
          alert('Create failed: ' + (err.error?.message || err.message));
          this.saving = false;
        },
      });
    }
  }

  delete(id: string): void {
    if (!confirm('Delete this product permanently from the database?')) return;
    this.productApi.deleteProduct(id).subscribe({
      next: () => this.productStore.reloadProducts(),
      error: (err) => console.error('Delete failed', err),
    });
  }

  getCategoryName(categoryId: any): string {
    const id =
      typeof categoryId === 'object' ? categoryId?._id?.toString() : categoryId?.toString();
    const found = this.apiCategories.find((c) => c._id === id);
    return found?.category_name ?? id ?? 'Unknown';
  }

  // ── Featured ───────────────────────────────────────

  isFeatured(id: string): boolean {
    return this.auth.featuredProductIds().includes(id);
  }

  toggleFeatured(id: string): void {
    this.auth.toggleFeaturedProduct(id);
  }

  // ── Orders ─────────────────────────────────────────

  get orders() {
    return this.auth.allOrders;
  }

  // ── Promo Codes ────────────────────────────────────

  get promoCodes() {
    return this.auth.promoCodes();
  }

  openAddPromo(): void {
    this.editingPromo = null;
    this.promoForm = { discountType: 'percent', active: true };
    this.showPromoModal = true;
  }

  openEditPromo(p: IPromoCode): void {
    this.editingPromo = p;
    this.promoForm = { ...p };
    this.showPromoModal = true;
  }

  savePromo(): void {
    if (!this.promoForm.code || !this.promoForm.discountValue) return;
    if (this.editingPromo) {
      this.auth.updatePromoCode(this.editingPromo.id, this.promoForm);
    } else {
      this.auth.addPromoCode({
        code: this.promoForm.code!.toUpperCase(),
        discountType: this.promoForm.discountType || 'percent',
        discountValue: this.promoForm.discountValue!,
        active: this.promoForm.active ?? true,
      });
    }
    this.showPromoModal = false;
  }

  deletePromo(id: number): void {
    if (confirm('Delete promo code?')) this.auth.deletePromoCode(id);
  }

  togglePromo(id: number, active: boolean): void {
    this.auth.updatePromoCode(id, { active });
  }

  // ── Banners ────────────────────────────────────────

  get banners() {
    return this.auth.banners();
  }

  openAddBanner(): void {
    this.editingBanner = null;
    this.bannerForm = { active: true };
    this.showBannerModal = true;
  }

  openEditBanner(b: IBanner): void {
    this.editingBanner = b;
    this.bannerForm = { ...b };
    this.showBannerModal = true;
  }

  saveBanner(): void {
    if (!this.bannerForm.imageUrl || !this.bannerForm.title) return;
    if (this.editingBanner) {
      this.auth.updateBanner(this.editingBanner.id, this.bannerForm);
    } else {
      this.auth.addBanner({
        imageUrl: this.bannerForm.imageUrl!,
        title: this.bannerForm.title!,
        subtitle: this.bannerForm.subtitle || '',
        active: this.bannerForm.active ?? true,
      });
    }
    this.showBannerModal = false;
  }

  deleteBanner(id: number): void {
    if (confirm('Delete banner?')) this.auth.deleteBanner(id);
  }

  toggleBanner(id: number, active: boolean): void {
    this.auth.updateBanner(id, { active });
  }

  // ── Stats ──────────────────────────────────────────

  get stats() {
    const blocked = this.dbUsers.filter((u) => u.isblocked).length;
    const normalUsers = this.dbUsers.filter((u) => u.role === 'user').length;
    return {
      totalProducts: this.products.length,
      totalOrders: this.orders.length,
      totalRevenue: this.orders.reduce((s, o) => s + o.total, 0),
      lowStock: this.products.filter((p) => (p.stock ?? p.quantity) <= 2).length,
      totalUsers: normalUsers,
      restrictedUsers: blocked,
    };
  }

  logout(): void {
    this.auth.logout();
  }
}
