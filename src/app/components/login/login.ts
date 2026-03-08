import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';
  showPassword = false;
  isAdmin = false;
  isLoading = false;
  errorMessage = '';

  constructor(private auth: AuthService, private router: Router) {}

  toggleRole(): void {
    this.isAdmin = !this.isAdmin;
    this.errorMessage = '';
  }

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';

    setTimeout(() => {
      const result = this.auth.login(this.email, this.password, this.isAdmin);
      this.isLoading = false;
      if (result === 'success') {
        this.router.navigate(this.isAdmin ? ['/admin'] : ['/Master']);
      } else if (result === 'not_found') {
        this.errorMessage = 'No account found with this email.';
      } else if (result === 'wrong_pass') {
        this.errorMessage = this.isAdmin ? 'Invalid credentials or insufficient permissions.' : 'Incorrect password.';
      } else if (result === 'need_verify') {
        this.errorMessage = 'Please verify your email first.';
      }
    }, 800);
  }
}
