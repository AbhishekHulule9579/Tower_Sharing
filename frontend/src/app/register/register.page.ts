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
  fullName = '';
  email = '';
  phoneNumber = '';
  requestedRole = 'SITE_MANAGER';
  password = '';
  operatorId: number | null = null;
  state = '';
  errorMessage = '';
  successMessage = '';
  operators: any[] = [];
  isOperatorsLoading = false;
  operatorsLoadError = '';
  hidePassword = true;
  isLoading = false;

  operatingStates: string[] = [];
  assignedStates: string[] = [];
  isLoadingStates = false;

  readonly indianStates: string[] = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
    'Delhi'
  ];

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
      next: (data) => {
        this.operators = (data || []).filter((operator) => operator.active !== false);
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
    const operator = this.operators.find((op) => op.id === this.operatorId);
    return operator
      ? `${operator.name} (${operator.code})`
      : 'Operator selected';
  }

  onOperatorOrRoleChange(): void {
    this.state = '';
    this.errorMessage = '';
    this.operatingStates = [];
    this.assignedStates = [];

    if (!this.operatorId) return;

    this.isLoadingStates = true;
    this.operatorService.getOperatingStates(this.operatorId).subscribe({
      next: (states) => {
        this.operatingStates = states || [];
        this.isLoadingStates = false;
      },
      error: () => {
        this.operatingStates = [];
        this.isLoadingStates = false;
      }
    });

    this.operatorService.getAssignedStates(this.operatorId).subscribe({
      next: (states) => {
        this.assignedStates = states || [];
      },
      error: () => {
        this.assignedStates = [];
      }
    });
  }

  isStateAssigned(stateName: string): boolean {
    return this.assignedStates.some(
      (s) => s.trim().toLowerCase() === stateName.trim().toLowerCase()
    );
  }

  submit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (
      !this.fullName.trim() ||
      !this.email.trim() ||
      !this.phoneNumber.trim() ||
      !this.password ||
      this.operatorId === null ||
      !this.state.trim()
    ) {
      this.errorMessage = 'Please complete all fields, including your assigned state jurisdiction.';
      return;
    }

    if (this.fullName.trim().length < 3) {
      this.errorMessage = 'Full Name must be at least 3 characters long.';
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(this.email.trim())) {
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }

    // const cleanPhone = this.phoneNumber.replace(/[\s-]/g, '');
    // if (!/^\d{10}$/.test(cleanPhone)) {
    //   this.errorMessage = 'Phone number must be exactly 10 digits.';
    //   return;
    // }
    
    //added here

    const cleanPhone = this.phoneNumber.replace(/[\s-]/g, '');

    if (!/^[6-9]\d{9}$/.test(cleanPhone) || /^(\d)\1{9}$/.test(cleanPhone)) {
      this.errorMessage = 'Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9 (dummy numbers like 0000000000 or repetitive digits are not allowed).';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long.';
      return;
    }

    // Role-specific state validation
    if (this.requestedRole === 'OPERATOR_MANAGER' && this.isStateAssigned(this.state)) {
      this.errorMessage = `The state '${this.state}' is already assigned to an Operations Manager for ${this.selectedOperatorName}.`;
      return;
    }

    if (this.requestedRole === 'SITE_MANAGER' && !this.operatingStates.includes(this.state)) {
      this.errorMessage = `No active Operations Manager is assigned for ${this.selectedOperatorName} in '${this.state}'. Please select an available state from the list.`;
      return;
    }

    if (this.isLoading) return;

    this.isLoading = true;

    this.authService.registerSiteManagerRequest({
      username: this.fullName.trim(),
      password: this.password,
      email: this.email.trim(),
      fullName: this.fullName.trim(),
      phoneNumber: cleanPhone,
      state: this.state.trim(),
      operatorId: this.operatorId,
      requestedRole: this.requestedRole
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage =
          this.requestedRole === 'SITE_MANAGER'
            ? `Request submitted. The ${this.selectedOperatorName} Operations Manager for ${this.state} will review it.`
            : `Request submitted for ${this.state} jurisdiction. The ${this.selectedOperatorName} Administrator will review it.`;

        setTimeout(() => this.router.navigate(['/login']), 2200);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage =
          typeof error?.error === 'string'
            ? error.error
            : 'Unable to submit registration request at this time.';
      }
    });
  }
}