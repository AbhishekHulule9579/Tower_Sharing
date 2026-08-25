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

  presets = [
    { label: 'Jio Admin', email: 'admin@jio.com', pass: 'admin123', role: 'ADMIN', color: '#0a2540' },
    { label: 'Airtel Admin', email: 'admin@airtel.com', pass: 'admin123', role: 'ADMIN', color: '#e40000' },
    { label: 'Vi Admin', email: 'admin@vodafoneidea.com', pass: 'admin123', role: 'ADMIN', color: '#ee1c25' },
    { label: 'BSNL Admin', email: 'admin@bsnl.co.in', pass: 'admin123', role: 'ADMIN', color: '#005a9c' },
    { label: 'Jio Manager', email: 'manager@jio.com', pass: 'pass123', role: 'OPERATOR_MANAGER', color: '#2563eb' },
    { label: 'Site Engineer', email: 'mumbai.site@jio.com', pass: 'site123', role: 'SITE_MANAGER', color: '#10b981' }
  ];

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  selectPreset(preset: { email: string; pass: string; role: string }): void {
    this.email = preset.email;
    this.password = preset.pass;
    this.role = preset.role;
    this.errorMessage = '';
  }

  login(): void {
    this.errorMessage = '';

    if (!this.email.trim() || !this.password) {
      this.errorMessage = 'Please enter both Email/Username and password.';
      return;
    }

    if (this.isLoading) return;

    this.isLoading = true;

    this.authService.login(
      this.email.trim(),
      this.password,
      this.role
    ).subscribe({
      next: (user) => {
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