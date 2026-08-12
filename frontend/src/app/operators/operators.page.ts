import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { OperatorService } from '../services/operator.service';

@Component({
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatListModule, MatGridListModule],
  selector: 'app-operators',
  template: `
    <div class="page-shell">
      <div class="page-header">
        <div>
          <h2>Operators & Users</h2>
          <p>Review all operators, system users, and site manager assignments.</p>
        </div>
      </div>

      <div class="section-grid">
        <mat-card class="summary-card">
          <mat-card-title>Operators</mat-card-title>
          <mat-card-content>{{ operators.length }}</mat-card-content>
        </mat-card>
        <mat-card class="summary-card">
          <mat-card-title>Platform Users</mat-card-title>
          <mat-card-content>{{ users.length }}</mat-card-content>
        </mat-card>
        <mat-card class="summary-card">
          <mat-card-title>Site Managers</mat-card-title>
          <mat-card-content>{{ siteManagers.length }}</mat-card-content>
        </mat-card>
      </div>

      <mat-card>
        <mat-card-title>Operators</mat-card-title>
        <mat-card-content>
          <mat-list>
            <mat-list-item *ngFor="let operator of operators">
              <mat-icon matListIcon>business</mat-icon>
              <div matLine>{{ operator.name }}</div>
              <div matLine class="secondary">{{ operator.code }} • {{ operator.contactEmail }}</div>
            </mat-list-item>
          </mat-list>
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-title>Users</mat-card-title>
        <mat-card-content>
          <mat-list>
            <mat-list-item *ngFor="let user of users">
              <mat-icon matListIcon>person</mat-icon>
              <div matLine>{{ user.username || user.email }}</div>
              <div matLine class="secondary">{{ user.role }} • {{ user.email }}</div>
            </mat-list-item>
          </mat-list>
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-title>Site Managers</mat-card-title>
        <mat-card-content>
          <mat-list>
            <mat-list-item *ngFor="let manager of siteManagers">
              <mat-icon matListIcon>supervisor_account</mat-icon>
              <div matLine>{{ manager.username || manager.email }}</div>
              <div matLine class="secondary">{{ manager.role }} • manages site requests</div>
            </mat-list-item>
          </mat-list>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .page-shell {
        display: grid;
        gap: 22px;
        padding: 22px;
      }
      .page-header h2 {
        margin: 0;
        font-size: 2rem;
      }
      .page-header p {
        margin: 4px 0 0;
        color: rgba(255, 255, 255, 0.76);
      }
      .section-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 18px;
      }
      .summary-card {
        background: #111827;
        color: #e0e7ff;
        min-height: 120px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .secondary {
        color: rgba(255, 255, 255, 0.68);
      }
    `
  ]
})
export class OperatorsPage implements OnInit {
  operators: any[] = [];
  users: any[] = [];
  siteManagers: any[] = [];

  constructor(private readonly operatorService: OperatorService) {}

  ngOnInit(): void {
    this.operatorService.getAllOperators().subscribe((data) => (this.operators = data || []));
    this.operatorService.getAllUsers().subscribe((data) => (this.users = data || []));
    this.operatorService.getSiteManagers().subscribe((data) => (this.siteManagers = data || []));
  }
}
