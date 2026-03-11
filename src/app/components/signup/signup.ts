import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  name = '';
  email = '';
  phone = '';
  password = '';
  confirmPassword = '';
  showPassword = false;
  isLoading = false;
  errorMessage = '';

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  onSubmit(): void {
    if (!this.name || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }
    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    let data = {
      name: this.name,
      email: this.email,
      password: this.password,
      phone: this.phone,
    };

    this.auth.register(data).subscribe({
      next: (res: any) => {
        console.log('Success:', res);
        if (res.status == 'fail') {
          this.errorMessage = res.message;
        } else {
          this.auth.setPendingEmail(this.email);
          this.router.navigateByUrl('verify-otp');
        }
      },
      error: (err) => {
        console.error('Sign Up Error : ... ', err);
        this.errorMessage = err.error?.message || 'Something went wrong';
      },
    });
  }
}
