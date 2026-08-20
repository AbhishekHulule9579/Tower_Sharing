import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { OperatorService } from '../services/operator.service';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.css']
})
export class RegisterPage implements OnInit {
  username = '';
  fullName = '';
  email = '';
  phoneNumber = '';
  requestedRole = 'SITE_MANAGER';
  password = '';
  operatorId: number | null = null;
  errorMessage = '';
  successMessage = '';
  operators: any[] = [];
  isOperatorsLoading = false;
  operatorsLoadError = '';
  hidePassword = true;
  isLoading = false;

  constructor(
    private readonly authService: AuthService,
    private readonly operatorService: OperatorService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadOperators();
  }

  loadOperators(): void {
    this.isOperatorsLoading = true;
    this.operatorsLoadError = '';

    this.operatorService.getAllOperators().subscribe({
      next: data => {
        this.operators = (data || []).filter(operator => operator.active !== false);
        this.isOperatorsLoading = false;

        if (this.operators.length === 0) {
          this.operatorsLoadError = 'No telecom operators are currently available.';
        }
      },
      error: () => {
        this.operators = [];
        this.isOperatorsLoading = false;
        this.operatorsLoadError = 'Unable to load telecom operators. Please try again.';
      }
    });
  }

  get selectedOperatorName(): string {
    const operator = this.operators.find(op => op.id === this.operatorId);
    return operator
      ? `${operator.name} (${operator.code})`
      : 'Operator selected';
  }

  submit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (
      !this.username.trim() ||
      !this.fullName.trim() ||
      !this.email.trim() ||
      !this.phoneNumber.trim() ||
      !this.password ||
      this.operatorId === null
    ) {
      this.errorMessage = 'Please complete all fields to submit your request.';
      return;
    }

    if (this.username.trim().length < 3) {
      this.errorMessage = 'Username must be at least 3 characters long.';
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(this.email.trim())) {
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }

    const cleanPhone = this.phoneNumber.replace(/[\s-]/g, '');
    if (!/^\d{10}$/.test(cleanPhone)) {
      this.errorMessage = 'Phone number must be exactly 10 digits.';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long.';
      return;
    }

    if (this.isLoading) return;

    this.isLoading = true;

    this.authService.registerSiteManagerRequest({
      username: this.username.trim(),
      password: this.password,
      email: this.email.trim(),
      fullName: this.fullName.trim(),
      phoneNumber: this.phoneNumber.trim(),
      operatorId: this.operatorId,
      requestedRole: this.requestedRole
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage =
          this.requestedRole === 'SITE_MANAGER'
            ? 'Request submitted. Your Operations Manager will review it.'
            : 'Request submitted. The Platform Administrator will review it.';

        setTimeout(() => this.router.navigate(['/login']), 1800);
      },
      error: error => {
        this.isLoading = false;
        this.errorMessage =
          typeof error?.error === 'string'
            ? error.error
            : 'Unable to submit registration request at this time.';
      }
    });
  }
}
