import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { AuthService, AuthUser } from '../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-site-manager-requests',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatListModule, MatDividerModule],
  templateUrl: './site-manager-requests.page.html',
  styleUrls: ['./site-manager-requests.page.css']
})
export class SiteManagerRequestsPage implements OnInit {
  requests: any[] = [];
  currentUser: AuthUser | null = null;
  userRole = '';
  isAdmin = false;
  processingRequestId: number | null = null;
  errorMessage = '';
  successMessage = '';

  constructor(private readonly authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.userRole = this.authService.getUserRole() ?? '';
    this.isAdmin = this.userRole === 'ADMIN';
    this.loadRequests();
  }

  get operatorName(): string {
    return this.currentUser?.operatorName || 'Company';
  }

  loadRequests(): void {
    this.errorMessage = '';
    this.authService.getPendingSiteManagerRequests().subscribe({
      next: (data) => {
        this.requests = data || [];
      },
      error: () => {
        this.requests = [];
        this.errorMessage = 'Unable to load registration requests. Please sign in again and retry.';
      }
    });
  }

  canApprove(request: any): boolean {
    if (this.isAdmin) {
      return true; // Admin can approve any registration for their operator
    }
    return this.userRole === 'OPERATOR_MANAGER' && request.requestedRole === 'SITE_MANAGER';
  }

  approve(id: number): void {
    const target = this.requests.find((r) => r.id === id);
    const candidateName = target?.fullName || target?.name || target?.username || 'this applicant';
    const roleLabel = target?.requestedRole === 'OPERATOR_MANAGER' ? 'Operations Manager' : 'Site Manager';
    const stateLabel = target?.state ? ` for ${target.state}` : '';

    if (!window.confirm(`Are you sure you want to APPROVE the ${roleLabel} registration request for "${candidateName}"${stateLabel}?`)) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.processingRequestId = id;
    this.authService.approveSiteManagerRequest(id).subscribe({
      next: () => {
        this.processingRequestId = null;
        this.successMessage = `Registration request for "${candidateName}" approved successfully. User account is now active!`;
        this.loadRequests();
      },
      error: (error) => {
        this.processingRequestId = null;
        const msg =
          (typeof error?.error === 'string' ? error.error : error?.error?.message) ||
          error?.message ||
          'Unable to approve this registration request. Please try again.';
        this.errorMessage = msg;
      }
    });
  }

  reject(id: number): void {
    const target = this.requests.find((r) => r.id === id);
    const candidateName = target?.fullName || target?.name || target?.username || 'this applicant';
    const roleLabel = target?.requestedRole === 'OPERATOR_MANAGER' ? 'Operations Manager' : 'Site Manager';

    if (!window.confirm(`Are you sure you want to REJECT the ${roleLabel} registration request for "${candidateName}"?`)) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.processingRequestId = id;
    this.authService.rejectSiteManagerRequest(id).subscribe({
      next: () => {
        this.processingRequestId = null;
        this.successMessage = `Registration request for "${candidateName}" has been rejected.`;
        this.loadRequests();
      },
      error: (error) => {
        this.processingRequestId = null;
        const msg =
          (typeof error?.error === 'string' ? error.error : error?.error?.message) ||
          error?.message ||
          'Unable to reject this registration request. Please try again.';
        this.errorMessage = msg;
      }
    });
  }
}
