import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService, IOrder } from '../../services/auth.service';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterLink],
  templateUrl: './order-history.html',
  styleUrl: './order-history.css',
})
export class OrderHistory {
  expandedOrderId: string | null = null;
  statusSteps = ['confirmed', 'processing', 'shipped', 'delivered'];

  constructor(private auth: AuthService) {}

  // Reads directly from the signal every time the template evaluates —
  // so newly placed orders appear immediately without any extra work.
  get orders(): IOrder[] {
    return this.auth.orders;
  }

  toggle(id: string): void {
    this.expandedOrderId = this.expandedOrderId === id ? null : id;
  }

  getStatusStep(status: string): number {
    return this.statusSteps.indexOf(status);
  }

  getStatusColor(status: string): string {
    const map: Record<string, string> = {
      confirmed: '#b8965a',
      processing: '#3b82f6',
      shipped: '#8b5cf6',
      delivered: '#22c55e',
    };
    return map[status] || '#7a6e68';
  }

  getPaymentIcon(method: string): string {
    if (method === 'credit') return 'bi-credit-card-2-front';
    if (method === 'paypal') return 'bi-paypal';
    if (method === 'wallet') return 'bi-wallet2';
    return 'bi-cash-coin';
  }
}
