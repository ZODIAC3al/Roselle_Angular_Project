import { Component, HostListener } from '@angular/core';
import { CommonModule }            from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart-service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header {
  isScrolled = false;
  menuOpen = false;
  userMenuOpen = false;

  constructor(
    private auth: AuthService,
    private cart: CartService,
    private router: Router
  ) {}

  @HostListener('window:scroll')
  onScroll(): void { this.isScrolled = window.scrollY > 10; }

  @HostListener('document:click', ['$event'])
  onDocClick(e: MouseEvent): void {
    if (!(e.target as HTMLElement).closest('.user-menu')) {
      this.userMenuOpen = false;
    }
  }

  closeMenu(): void { this.menuOpen = false; }

  get isLoggedIn(): boolean { return this.auth.isLoggedIn(); }
  get isAdmin(): boolean { return this.auth.isAdmin(); }
  get currentUser() { return this.auth.currentUser(); }
  get cartCount(): number { return this.cart.getCartCount(); }
  get wishlistCount(): number { return this.auth.wishlist().length; }

  logout(): void {
    this.auth.logout();
    this.userMenuOpen = false;
  }
}