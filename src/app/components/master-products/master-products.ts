import { Component, OnInit } from '@angular/core';
import { Products } from '../products/products';
import { ICategory } from '../../models/icategory';
import { NgClass, CommonModule } from '@angular/common';
import { StaticProducts, IGender } from '../../services/static-products';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart-service';
import { IProduct } from '../../models/iproduct';

@Component({
  selector: 'app-master-products',
  standalone: true,
  imports: [CommonModule, Products, NgClass, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './master-products.html',
  styleUrl: './master-products.css',
})
export class MasterProducts implements OnInit {
  // ── Gender tier ────────────────────────────────────
  genderList: IGender[] = [];
  selectedGender: string = 'all';   // 'all' | 'women' | 'men'

  // ── Category tier ──────────────────────────────────
  selectedCatId: number = 0;
  catList: ICategory[] = [];

  // ── Search / Price ─────────────────────────────────
  searchTerm = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;

  filteredProducts: IProduct[] = [];
  allProducts: IProduct[] = [];

  constructor(
    private _prdService: StaticProducts,
    private auth: AuthService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.genderList  = this._prdService.getAllGenders();
    this.catList     = this._prdService.getAllCategories();
    this.allProducts = this._prdService.getAllProducts();
    this.applyFilters();
  }

  // ── Live cart getters ──────────────────────────────
  get cartCount(): number  { return this.cartService.getCartCount(); }
  get grandTotal(): number { return this.cartService.getGrandTotal(); }

  receiveTotal(_total: number) { /* no-op */ }

  // ── Gender selection ───────────────────────────────
  selectGender(id: string): void {
    this.selectedGender = id;
    this.selectedCatId  = 0;   // reset subcategory when gender changes
    this.applyFilters();
  }

  // ── Category selection ─────────────────────────────
  selectCategory(id: number): void {
    this.selectedCatId = id;
    this.applyFilters();
  }

  // ── Master filter pipeline ─────────────────────────
  applyFilters(): void {
    // 1. Gender filter
    let list = this.selectedGender === 'all'
      ? this.allProducts
      : this.allProducts.filter(p => p.gender === this.selectedGender);

    // 2. Category filter
    if (this.selectedCatId !== 0) {
      list = list.filter(p => p.categoryId === this.selectedCatId);
    }

    // 3. Search filter
    if (this.searchTerm.trim()) {
      const q = this.searchTerm.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q));
    }

    // 4. Price filters
    if (this.minPrice !== null) list = list.filter(p => p.price >= this.minPrice!);
    if (this.maxPrice !== null) list = list.filter(p => p.price <= this.maxPrice!);

    this.filteredProducts = list;
  }

  clearFilters(): void {
    this.searchTerm    = '';
    this.minPrice      = null;
    this.maxPrice      = null;
    this.applyFilters();
  }

  get featuredProducts(): IProduct[] {
    const ids = this.auth.featuredProductIds();
    return this.allProducts.filter(p => ids.includes(p.id));
  }

  get activeBanners() { return this.auth.activeBanners; }
}