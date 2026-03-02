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
  currentId: number = 0;
  product: IProduct | null = null;
  addedToCart: boolean = false; // for button feedback
  idsArr:number[];
  currentIdIndex:number=0;


  constructor(
    private _activatedRoute: ActivatedRoute,
    private _detailsService: StaticProducts,
    private _cartService: CartService,
    private _location: Location,
    private _router:Router
  ) {
    this.idsArr=this._detailsService.mapProductsToId();

  }

  ngOnInit(): void {
    // this.currentId = Number(this._activatedRoute.snapshot.paramMap.get('id'));
    
    // this.product = this._detailsService.getProductById(this.currentId);
    
    // sync button state if already in cart
    //paramMap mn no3 Observable => ay haga hatt8er haysma3 feh w dh hysa3edne a listen lw dost next aw previous mn 8er ma a3ml refresh 
    //kol ma al params aly fl url tt8ayr zay l id hwa hy subscribe w ysm3 l ta8er dh 
    this._activatedRoute.paramMap.subscribe((paramMap)=>{
      this.currentId = Number(paramMap.get('id'));
      this.product = this._detailsService.getProductById(this.currentId);
    });
    if (this.product) {
      this.addedToCart = this._cartService.isInCart(this.product.id);
    }
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

  goNext() {
  this.currentIdIndex = this.idsArr.findIndex((id) => id == this.currentId);
  if(this.currentIdIndex  != this.idsArr.length-1){
    this._router.navigateByUrl(`/Details/${this.idsArr[this.currentIdIndex + 1]}`);
}
}
  goPrevious(){
  this.currentIdIndex = this.idsArr.findIndex((id) => id == this.currentId);
  if(this.currentIdIndex !=0){
    this._router.navigateByUrl(`/Details/${this.idsArr[this.currentIdIndex - 1]}`);



  }
  
  }

}