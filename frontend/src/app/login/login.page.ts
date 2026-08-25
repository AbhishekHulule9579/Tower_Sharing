import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink, MatCardModule, MatButtonModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.css']
})
export class LoginPage {
  email: string = '';
  password = '';
  role = 'ADMIN';
  errorMessage = '';
  hidePassword = true;
  isLoading = false;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  login(): void {
    this.errorMessage = '';

    if (!this.email.trim() || !this.password) {
      this.errorMessage = 'Please enter both Email and password.';
      return;
    }

    if (this.isLoading) return;

    this.isLoading = true;

    this.authService.login(
      this.email.trim(),
      this.password,
      this.role
    ).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage =
          typeof error?.error === 'string'
            ? error.error
            : 'Login failed. Please check your credentials and selected role.';
      }
    });
  }
}