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
  template: `
    <div class="requests-shell">
      <div class="requests-header">
        <h2>Registration Requests</h2>
        <p>{{ isAdmin ? 'Approve pending Operations Manager registrations.' : 'Approve pending Site Manager registrations for your operator.' }}</p>
      </div>

      <ng-container *ngIf="requests.length > 0; else noRequests">
        <mat-list>
          <mat-list-item *ngFor="let request of requests">
            <div class="request-content">
              <div>
                <strong>{{ request.username }}</strong> • {{ request.email }}
                <div class="secondary">{{ request.requestedRole === 'OPERATOR_MANAGER' ? 'Operations Manager' : 'Site Manager' }} · Operator: {{ request.operator?.name || request.operator?.code }}</div>
              </div>
              <div class="request-actions">
                <button
                  mat-flat-button
                  color="primary"
                  *ngIf="canApprove(request)"
                  (click)="approve(request.id)"
                  [disabled]="request.status !== 'PENDING' || approvingRequestId === request.id">
                  {{ approvingRequestId === request.id ? 'Approving...' : 'Approve' }}
                </button>
                <span class="status-chip" [class.pending]="request.status === 'PENDING'">{{ request.status }}</span>
              </div>
            </div>
          </mat-list-item>
        </mat-list>
      </ng-container>

      <div class="error-message" *ngIf="errorMessage">{{ errorMessage }}</div>

      <ng-template #noRequests>
        <mat-card>
          <mat-card-title>No pending site manager requests</mat-card-title>
          <mat-card-content>
            There are no registration requests awaiting your approval.
          </mat-card-content>
        </mat-card>
      </ng-template>
    </div>
  `,
  styles: [
    `
      .requests-shell {
        display: grid;
        gap: 18px;
        padding: 22px;
      }
      .requests-header h2 {
        margin: 0;
      }
      .secondary {
        color: rgba(226, 232, 240, 0.72);
        margin-top: 2px;
      }
      .request-content {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 18px;
      }
      .request-actions {
        display: flex;
        align-items: center;
        gap: 14px;
      }
      .status-chip {
        padding: 6px 12px;
        border-radius: 18px;
        background: rgba(30, 64, 175, 0.18);
        color: #c7d2fe;
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 0.03em;
      }
      .status-chip.pending {
        background: rgba(251, 191, 36, 0.16);
        color: #fde68a;
      }
      .error-message {
        padding: 10px 12px;
        border-radius: 8px;
        background: rgba(239, 68, 68, 0.12);
        color: #fecaca;
      }
    `
  ]
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
