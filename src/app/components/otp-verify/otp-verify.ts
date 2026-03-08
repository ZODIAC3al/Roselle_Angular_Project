import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-otp-verify',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './otp-verify.html',
  styleUrl: './otp-verify.css',
})
export class OtpVerify implements OnInit, OnDestroy {
  digits = ['', '', '', '', '', ''];
  isLoading = false;
  errorMessage = '';
  resendCountdown = 30;
  canResend = false;
  private timer: any;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.startTimer();
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  get email(): string { return this.auth.pendingEmail(); }

  startTimer(): void {
    this.resendCountdown = 30;
    this.canResend = false;
    this.timer = setInterval(() => {
      this.resendCountdown--;
      if (this.resendCountdown <= 0) {
        clearInterval(this.timer);
        this.canResend = true;
      }
    }, 1000);
  }

  onInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const val = input.value.replace(/\D/g, '').slice(-1);
    this.digits[index] = val;
    if (val && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      (next as HTMLInputElement)?.focus();
    }
  }

  onKeydown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace' && !this.digits[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      (prev as HTMLInputElement)?.focus();
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const text = event.clipboardData?.getData('text') || '';
    const nums = text.replace(/\D/g, '').slice(0, 6);
    nums.split('').forEach((c, i) => { if (i < 6) this.digits[i] = c; });
  }

  get otpValue(): string { return this.digits.join(''); }

  verify(): void {
    if (this.otpValue.length < 6) {
      this.errorMessage = 'Please enter all 6 digits.';
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';
    setTimeout(() => {
      const ok = this.auth.verifyOtp(this.otpValue);
      this.isLoading = false;
      if (ok) {
        this.router.navigate(['/login']);
      } else {
        this.errorMessage = 'Invalid code. Please try again.';
        this.digits = ['', '', '', '', '', ''];
      }
    }, 800);
  }

  resend(): void {
    if (!this.canResend) return;
    // Re-trigger OTP (in real app would call backend)
    console.log('Resending OTP...');
    this.startTimer();
  }
}
