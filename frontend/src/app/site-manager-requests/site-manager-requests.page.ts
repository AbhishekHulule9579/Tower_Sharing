import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { AuthService } from '../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-site-manager-requests',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatListModule],
  templateUrl: './site-manager-requests.page.html',
  styleUrls: ['./site-manager-requests.page.css']
})
export class SiteManagerRequestsPage implements OnInit {
  requests: any[] = [];
  userRole = '';
  isAdmin = false;
  approvingRequestId: number | null = null;
  errorMessage = '';

  constructor(private readonly authService: AuthService) {}

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole() ?? '';
    this.isAdmin = this.userRole === 'ADMIN';
    this.loadRequests();
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
    return (
      (this.isAdmin && request.requestedRole === 'OPERATOR_MANAGER') ||
      (this.userRole === 'OPERATOR_MANAGER' && request.requestedRole === 'SITE_MANAGER')
    );
  }

  approve(id: number): void {
    this.errorMessage = '';
    this.approvingRequestId = id;
    this.authService.approveSiteManagerRequest(id).subscribe({
      next: () => {
        this.approvingRequestId = null;
        this.loadRequests();
      },
      error: (error) => {
        this.approvingRequestId = null;
        this.errorMessage = typeof error?.error === 'string'
          ? error.error
          : 'Unable to approve this registration request. Please try again.';
      }
    });
  }
}
