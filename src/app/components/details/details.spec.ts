// import { ComponentFixture, TestBed } from '@angular/core/testing';

// import { Details } from './details';

// describe('Details', () => {
//   let component: Details;
//   let fixture: ComponentFixture<Details>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [Details]
//     })
//     .compileComponents();

//     fixture = TestBed.createComponent(Details);
//     component = fixture.componentInstance;
//     await fixture.whenStable();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StaticProducts } from '../../services/static-products';
import { IProduct } from '../../models/iproduct';
import { CommonModule, CurrencyPipe, Location } from '@angular/common';
import { CartService } from '../../services/cart-service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CurrencyPipe, CommonModule, RouterLink],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details implements OnInit {
  currentId: string = ''; // _id is a string (MongoDB ObjectId)
  product: IProduct | null = null;
  addedToCart: boolean = false;
  idsArr: string[] = []; // string[] to match mapProductsToId()
  currentIdIndex: number = 0;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _detailsService: StaticProducts,
    private _cartService: CartService,
    private _location: Location,
    private _router: Router,
  ) {}

  ngOnInit(): void {
    // Wait for products to load from API, then resolve route param
    this._activatedRoute.paramMap.subscribe((paramMap) => {
      this.currentId = paramMap.get('id') ?? '';

      // Products may not be loaded yet (async API call) — poll briefly
      const tryLoad = () => {
        this.idsArr = this._detailsService.mapProductsToId();
        this.product = this._detailsService.getProductById(this.currentId);

        if (!this.product && this.idsArr.length === 0) {
          // Still loading — retry after short delay
          setTimeout(tryLoad, 200);
          return;
        }

        if (this.product) {
          this.addedToCart = this._cartService.isInCart(this.product._id);
        }
      };

      tryLoad();
    });
  }

  addToCart(): void {
    if (this.product && this.product.quantity > 0) {
      this._cartService.addToCart(this.product);
      this.addedToCart = true;
    }
  }

  goBack(): void {
    this._location.back();
  }

  get cartCount(): number {
    return this._cartService.getCartCount();
  }

  goNext(): void {
    this.currentIdIndex = this.idsArr.findIndex((id) => id === this.currentId);
    if (this.currentIdIndex !== this.idsArr.length - 1) {
      this._router.navigateByUrl(`/Details/${this.idsArr[this.currentIdIndex + 1]}`);
    }
  }

  goPrevious(): void {
    this.currentIdIndex = this.idsArr.findIndex((id) => id === this.currentId);
    if (this.currentIdIndex !== 0) {
      this._router.navigateByUrl(`/Details/${this.idsArr[this.currentIdIndex - 1]}`);
    }
  }
}
