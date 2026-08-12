import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { OperatorService } from '../services/operator.service';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule],
  template: `
    <div class="register-shell">
      <mat-card class="register-card">
        <h2>Site Manager Registration</h2>

        <form class="register-form" (ngSubmit)="submit()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Username</mat-label>
            <input matInput name="username" [(ngModel)]="username" />
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Full Name</mat-label>
            <input matInput name="fullName" [(ngModel)]="fullName" />
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input matInput type="email" name="email" [(ngModel)]="email" />
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Phone Number</mat-label>
            <input matInput name="phoneNumber" [(ngModel)]="phoneNumber" />
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Password</mat-label>
            <input matInput name="password" type="password" [(ngModel)]="password" />
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Operator</mat-label>
            <mat-select name="operatorId" [(ngModel)]="operatorId" panelClass="white-select-panel">
              <mat-option *ngFor="let op of operators" [value]="op.id">
                {{ op.name }} ({{ op.code }})
              </mat-option>
            </mat-select>
          </mat-form-field>

          <button mat-flat-button color="primary" class="full-width" type="submit">Submit Registration Request</button>
          <button mat-button class="full-width" routerLink="/login" type="button">Back to Login</button>
        </form>

        <p class="error" *ngIf="errorMessage">{{ errorMessage }}</p>
        <p class="success" *ngIf="successMessage">{{ successMessage }}</p>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .register-shell {
        min-height: calc(100vh - 64px);
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 24px;
      }
      .register-card {
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
      .error {
        color: #f44336;
        margin-top: 14px;
      }
      .success {
        color: #4caf50;
        margin-top: 14px;
      }
    `
  ]
})
export class RegisterPage implements OnInit {
  username = '';
  fullName = '';
  email = '';
  phoneNumber = '';
  password = '';
  operatorId: number | null = null;
  errorMessage = '';
  successMessage = '';
  operators: any[] = [];

  constructor(
    private readonly authService: AuthService,
    private readonly operatorService: OperatorService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.operatorService.getAllOperators().subscribe((data) => (this.operators = data || []));
  }

  submit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.username || !this.fullName || !this.email || !this.phoneNumber || !this.password || !this.operatorId) {
      this.errorMessage = 'Please complete all fields to submit your request.';
      return;
    }

    this.authService.registerSiteManagerRequest({
      username: this.username,
      password: this.password,
      email: this.email,
      fullName: this.fullName,
      phoneNumber: this.phoneNumber,
      operatorId: this.operatorId
    }).subscribe({
      next: () => {
        this.successMessage = 'Request submitted successfully. Your operator admin will review it.';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (error) => {
        this.errorMessage = error?.error || 'Unable to submit registration request at this time.';
      }
    });
  }
}
