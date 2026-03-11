import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IProduct } from '../models/iproduct';
import { ICategory } from '../models/icategory';

export interface IProductsResponse {
  status: string;
  page: number;
  results: number;
  totalProducts: number;
  data: { products: IProduct[] };
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private baseUrl = 'http://localhost:3000/api/products'; // adjust to your backend URL

  constructor(private http: HttpClient) {}

  getProducts(filters?: {
    name?: string;
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    page?: number;
    limit?: number;
  }): Observable<IProductsResponse> {
    let params = new HttpParams();
    if (filters?.name) params = params.set('name', filters.name);
    if (filters?.categoryId) params = params.set('categoryId', filters.categoryId);
    if (filters?.minPrice) params = params.set('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice) params = params.set('maxPrice', filters.maxPrice.toString());
    if (filters?.inStock) params = params.set('inStock', 'true');
    if (filters?.page) params = params.set('page', filters.page.toString());
    if (filters?.limit) params = params.set('limit', filters.limit.toString());

    return this.http.get<IProductsResponse>(this.baseUrl, { params });
  }

  getProductById(id: string): Observable<{ data: { product: IProduct } }> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  toggleFavorite(id: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/favorites/toggle/${id}`, {});
  }

  getFavourites(): Observable<any> {
    return this.http.get(`${this.baseUrl}/getFavourites`);
  }
}
