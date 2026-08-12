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
        <h2>Site Manager Registration Requests</h2>
        <p *ngIf="userRole !== 'ADMIN'">Only platform administrators may approve registration requests.</p>
      </div>

      <ng-container *ngIf="requests.length > 0; else noRequests">
        <mat-list>
          <mat-list-item *ngFor="let request of requests">
            <div class="request-content">
              <div>
                <strong>{{ request.username }}</strong> • {{ request.email }}
                <div class="secondary">Operator: {{ request.operatorName || request.operator.code }}</div>
              </div>
              <div class="request-actions">
                <button mat-flat-button color="primary" *ngIf="isAdmin" (click)="approve(request.id)" [disabled]="request.status !== 'PENDING'">Approve</button>
                <span class="status-chip" [class.pending]="request.status === 'PENDING'">{{ request.status }}</span>
              </div>
            </div>
          </mat-list-item>
        </mat-list>
      </ng-container>

      <ng-template #noRequests>
        <mat-card>
          <mat-card-title>No pending site manager requests</mat-card-title>
          <mat-card-content>
            There are no current pending approvals. Site managers can request registration from the login page.
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
    `
  ]
})
export class SiteManagerRequestsPage implements OnInit {
  requests: any[] = [];
  userRole = '';
  isAdmin = false;

  constructor(private readonly authService: AuthService) {}

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole() ?? '';
    this.isAdmin = this.userRole === 'ADMIN';
    this.loadRequests();
  }

  loadRequests(): void {
    this.authService.getPendingSiteManagerRequests().subscribe((data) => {
      this.requests = data || [];
    });
  }

  approve(id: number): void {
    this.authService.approveSiteManagerRequest(id).subscribe(() => {
      this.loadRequests();
    });
  }
}
