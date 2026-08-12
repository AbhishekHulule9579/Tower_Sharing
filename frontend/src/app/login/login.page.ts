import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  template: `
    <div class="login-shell">
      <mat-card class="login-card">
        <h2>Sign In</h2>

        <form class="login-form" (ngSubmit)="login()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Username</mat-label>
            <input matInput name="username" [(ngModel)]="username" />
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Password</mat-label>
            <input matInput name="password" type="password" [(ngModel)]="password" />
          </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Login as</mat-label>
          <mat-select name="role" [(ngModel)]="role" panelClass="white-select-panel">
            <mat-option value="ADMIN">Administrator</mat-option>
            <mat-option value="OPERATOR_MANAGER">Operator Manager</mat-option>
            <mat-option value="SITE_MANAGER">Site Manager</mat-option>
          </mat-select>
        </mat-form-field>

        <p class="hint">
          Use one of these login options:
          <br />• Admin: username <strong>admin</strong>, password <strong>admin123</strong>
          <br />• Operator Manager: username <strong>jio_mgr</strong>, password <strong>pass123</strong> (or <strong>airtel_mgr</strong>, <strong>vi_mgr</strong>, <strong>bsnl_mgr</strong>)
          <br />• Site Manager: username <strong>site_mgr_mumbai</strong>, password <strong>site123</strong> (or <strong>site_mgr_delhi</strong>, <strong>site_mgr_chennai</strong>)
        </p>

          <button mat-flat-button color="primary" class="full-width" type="submit">Login</button>
        </form>

        <button mat-button class="register-button" routerLink="/register">Register as Site Manager</button>

        <p class="error" *ngIf="errorMessage">{{ errorMessage }}</p>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .login-shell {
        min-height: calc(100vh - 64px);
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 24px;
      }
      .login-card {
        width: min(520px, 100%);
        padding: 32px;
      }
      h2 {
        margin-top: 0;
        margin-bottom: 20px;
      }
      .full-width {
        width: 100%;
        margin-bottom: 18px;
      }
      .white-select-panel {
        background: #ffffff !important;
        color: #0f172a !important;
      }
      .white-select-panel .mat-option {
        color: #0f172a !important;
      }
      .hint {
        margin: 0 0 18px;
        color: rgba(226, 232, 240, 0.7);
      }
      .register-button {
        width: 100%;
        margin-top: 8px;
      }
      .error {
        margin-top: 14px;
        color: #f44336;
      }
    `
  ]
})
export class LoginPage {
  username = '';
  password = '';
  role = 'ADMIN';
  errorMessage = '';

  constructor(private readonly authService: AuthService, private readonly router: Router) {}

  login(): void {
    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter both username and password.';
      return;
    }

    this.authService.login(this.username, this.password, this.role).subscribe({
      next: (user) => {
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.errorMessage = error?.error || 'Login failed. Please check your credentials.';
      }
    });
  }
}
