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
import { StaticProducts } from '../../services/static-products';
import { Subscription } from 'rxjs';
import { IProduct } from '../../models/iproduct';
import { AuthService, IUser, IPromoCode, IBanner } from '../../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CurrencyPipe],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit, OnDestroy {
  private sub!: Subscription;
  products: IProduct[] = [];
  activeTab = 'products';
  searchTerm = '';
  showModal = false;
  editingProduct: IProduct | null = null;

  // Use a plain object for the form to avoid IProduct type conflicts
  form: {
    name?: string;
    price?: number;
    quantity?: number;
    stock?: number;
    imgUrl?: string;
    image?: string;
    categoryId?: string; // string to match IProduct
    description?: string;
  } = {};

  // User management
  users: IUser[] = [];

  // Promo codes
  showPromoModal = false;
  editingPromo: IPromoCode | null = null;
  promoForm: Partial<IPromoCode> = {};

  // Banners
  showBannerModal = false;
  editingBanner: IBanner | null = null;
  bannerForm: Partial<IBanner> = {};

  constructor(
    private productService: StaticProducts,
    private auth: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    if (!this.auth.isAdmin()) {
      this.router.navigate(['/login']);
      return;
    }
    this.sub = this.productService.products$.subscribe((prds) => {
      this.products = prds;
    });
    this.users = this.auth.getAllUsers();
  }

  // ── Products ──────────────────────────────────────
  get filteredProducts(): IProduct[] {
    return this.products.filter((p) =>
      p.name.toLowerCase().includes(this.searchTerm.toLowerCase()),
    );
  }

  openAdd(): void {
    this.editingProduct = null;
    this.form = { categoryId: '1', quantity: 1 }; // categoryId is string
    this.showModal = true;
  }

  openEdit(product: IProduct): void {
    this.editingProduct = product;
    this.form = { ...product };
    this.showModal = true;
  }

  save(): void {
    if (!this.form.name || !this.form.price) return;

    if (this.editingProduct) {
      Object.assign(this.editingProduct, this.form);
    } else {
      // Generate a temporary local _id for admin-created products
      const tempId = 'local-' + Date.now().toString();
      const newProduct: IProduct = {
        _id: tempId,
        name: this.form.name!,
        price: this.form.price!,
        quantity: this.form.quantity ?? 1,
        stock: this.form.quantity ?? 1,
        imgUrl: this.form.imgUrl || 'assets/images/img1.jpg',
        image: this.form.imgUrl || 'assets/images/img1.jpg',
        categoryId: this.form.categoryId || '1',
        description: this.form.description || '',
      };
      this.products.push(newProduct);
    }
    this.showModal = false;
  }

  delete(id: string): void {
    if (confirm('Delete this product?')) this.products = this.products.filter((p) => p._id !== id);
  }

  getCategoryName(id: string): string {
    const map: Record<string, string> = {
      '1': 'Suits',
      '2': 'Bags',
      '3': 'Shoes',
      '4': 'Coats',
      '5': 'Dresses',
    };
    return map[id] ?? 'Other';
  }

  // ── Featured (string _id) ─────────────────────────
  isFeatured(id: string): boolean {
    return this.auth.featuredProductIds().includes(id);
  }

  toggleFeatured(id: string): void {
    this.auth.toggleFeaturedProduct(id);
  }

  // ── Orders ────────────────────────────────────────
  get orders() {
    return this.auth.allOrders;
  }

  // ── Users ─────────────────────────────────────────
  refreshUsers(): void {
    this.users = this.auth.getAllUsers();
  }

  toggleUser(id: number): void {
    this.auth.toggleUserStatus(id);
    this.refreshUsers();
  }

  // ── Promo Codes ───────────────────────────────────
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

  // ── Banners ───────────────────────────────────────
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

  // ── Stats ─────────────────────────────────────────
  get stats() {
    return {
      totalProducts: this.products.length,
      totalOrders: this.orders.length,
      totalRevenue: this.orders.reduce((s, o) => s + o.total, 0),
      lowStock: this.products.filter((p) => p.quantity <= 2).length,
      totalUsers: this.users.filter((u) => u.role === 'user').length,
      restrictedUsers: this.users.filter((u) => u.status === 'restricted').length,
    };
  }

  logout(): void {
    this.auth.logout();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
