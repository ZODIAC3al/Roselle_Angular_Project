// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router, RouterLink } from '@angular/router';
// import { StaticProducts } from '../../services/static-products';

// import { IProduct } from '../../models/iproduct';
// import { CommonModule, CurrencyPipe, Location } from '@angular/common';
// import { CartService } from '../../services/cart-service';

// @Component({
//   selector: 'app-details',
//   standalone: true,
//   imports: [CurrencyPipe, CommonModule, RouterLink],
//   templateUrl: './details.html',
//   styleUrl: './details.css',
// })
// export class Details implements OnInit {
//   currentId: number = 0;
//   product: IProduct | null = null;
//   addedToCart: boolean = false; // for button feedback
//   idsArr:number[];
//   currentIdIndex:number=0;

//   constructor(
//     private _activatedRoute: ActivatedRoute,
//     private _detailsService: StaticProducts,
//     private _cartService: CartService,
//     private _location: Location,
//     private _router:Router
//   ) {
//     this.idsArr=this._detailsService.mapProductsToId();

//   }

//   ngOnInit(): void {
//     // this.currentId = Number(this._activatedRoute.snapshot.paramMap.get('id'));

//     // this.product = this._detailsService.getProductById(this.currentId);

//     // sync button state if already in cart
//     //paramMap mn no3 Observable => ay haga hatt8er haysma3 feh w dh hysa3edne a listen lw dost next aw previous mn 8er ma a3ml refresh
//     //kol ma al params aly fl url tt8ayr zay l id hwa hy subscribe w ysm3 l ta8er dh
//     this._activatedRoute.paramMap.subscribe((paramMap)=>{
//       this.currentId = Number(paramMap.get('id'));
//       this.product = this._detailsService.getProductById(this.currentId);
//     });
//     if (this.product) {
//       this.addedToCart = this._cartService.isInCart(this.product.id);
//     }
//   }

//   addToCart(): void {
//     if (this.product && this.product.quantity > 0) {
//       this._cartService.addToCart(this.product);
//       this.addedToCart = true;
//     }
//   }

//   goBack(): void {
//     this._location.back();
//   }

//   get cartCount(): number {
//     return this._cartService.getCartCount();
//   }

//   goNext() {
//   this.currentIdIndex = this.idsArr.findIndex((id) => id == this.currentId);
//   if(this.currentIdIndex  != this.idsArr.length-1){
//     this._router.navigateByUrl(`/Details/${this.idsArr[this.currentIdIndex + 1]}`);
// }
// }
//   goPrevious(){
//   this.currentIdIndex = this.idsArr.findIndex((id) => id == this.currentId);
//   if(this.currentIdIndex !=0){
//     this._router.navigateByUrl(`/Details/${this.idsArr[this.currentIdIndex - 1]}`);

//   }

//   }

// }
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule, CurrencyPipe, Location } from '@angular/common';
import { CartService } from '../../services/cart-service';
import { ProductService } from '../../services/product.service';
import { StaticProducts } from '../../services/static-products';
import { IProduct } from '../../models/iproduct';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CurrencyPipe, CommonModule, RouterLink],
  templateUrl: './details.html',
  styleUrls: ['./details.css'],
})
export class Details implements OnInit, OnDestroy {
  currentId: string = '';
  product: IProduct | null = null;
  addedToCart: boolean = false;
  loading: boolean = true;

  idsArr: string[] = [];
  currentIdIndex: number = 0;

  private _routeSub!: Subscription;
  private _idsSub!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private prdService: StaticProducts,
    private cartService: CartService,
    private location: Location,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Keep idsArr synced with the full product list so Next/Previous always work
    this._idsSub = this.prdService.products$.subscribe((products) => {
      this.idsArr = products.map((p) => p._id);
      // Recalculate index whenever the list updates
      this.currentIdIndex = this.idsArr.findIndex((id) => id === this.currentId);
    });

    this._routeSub = this.route.paramMap.subscribe((params) => {
      const id = params.get('id');

      if (!id) {
        this.loading = false;
        return;
      }

      this.currentId = id;
      this.currentIdIndex = this.idsArr.findIndex((id) => id === this.currentId);
      this.loading = true;
      this.product = null;

      this.productService.getProductById(id).subscribe({
        next: (res) => {
          const p = res.data.product;
          this.product = {
            ...p,
            imgUrl: p.image,
            quantity: p.stock,
          };
          this.addedToCart = this.cartService.isInCart(this.product._id);
          this.loading = false;
        },
        error: () => {
          this.product = null;
          this.loading = false;
        },
      });
    });
  }

  ngOnDestroy(): void {
    this._routeSub?.unsubscribe();
    this._idsSub?.unsubscribe();
  }

  addToCart(): void {
    if (this.product && this.product.quantity > 0) {
      this.cartService.addToCart(this.product);
      this.addedToCart = true;
    }
  }

  goBack(): void {
    this.location.back();
  }

  goNext(): void {
    this.currentIdIndex = this.idsArr.findIndex((id) => id === this.currentId);
    if (this.currentIdIndex !== -1 && this.currentIdIndex < this.idsArr.length - 1) {
      this.router.navigateByUrl(`/Details/${this.idsArr[this.currentIdIndex + 1]}`);
    }
  }

  goPrevious(): void {
    this.currentIdIndex = this.idsArr.findIndex((id) => id === this.currentId);
    if (this.currentIdIndex > 0) {
      this.router.navigateByUrl(`/Details/${this.idsArr[this.currentIdIndex - 1]}`);
    }
  }

  get isFirst(): boolean {
    return this.currentIdIndex <= 0;
  }

  get isLast(): boolean {
    return this.currentIdIndex >= this.idsArr.length - 1;
  }

  get cartCount(): number {
    return this.cartService.getCartCount();
  }
}
