import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { StaticProducts } from '../../services/static-products';
import { IProduct } from '../../models/iproduct';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CurrencyPipe],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  products: IProduct[] = [];
  activeTab = 'products'; // products | orders | users
  searchTerm = '';
  showModal = false;
  editingProduct: IProduct | null = null;

  form: Partial<IProduct> = {};

  constructor(
    private productService: StaticProducts,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.auth.isAdmin()) {
      this.router.navigate(['/login']);
      return;
    }
    this.products = this.productService.getAllProducts();
  }

  get filteredProducts(): IProduct[] {
    return this.products.filter(p =>
      p.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  get orders() { return this.auth.orders(); }

  openAdd(): void {
    this.editingProduct = null;
    this.form = { categoryId: 1, quantity: 1 };
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
      const newProd: IProduct = {
        id: Math.max(...this.products.map(p => p.id)) + 1,
        name: this.form.name!,
        price: this.form.price!,
        quantity: this.form.quantity || 1,
        imgUrl: this.form.imgUrl || 'assets/images/img1.jpg',
        categoryId: this.form.categoryId || 1,
        description: this.form.description || '',
      };
      this.products.push(newProd);
    }
    this.showModal = false;
  }

  delete(id: number): void {
    if (confirm('Delete this product?')) {
      this.products = this.products.filter(p => p.id !== id);
    }
  }

  logout(): void { this.auth.logout(); }

  get stats() {
    return {
      totalProducts: this.products.length,
      totalOrders: this.orders.length,
      totalRevenue: this.orders.reduce((s, o) => s + o.total, 0),
      lowStock: this.products.filter(p => p.quantity <= 2).length,
    };
  }
}
