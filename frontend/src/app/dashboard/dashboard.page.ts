import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { DashboardService } from '../services/dashboard.service';
import { DisasterService } from '../services/disaster.service';
import { LeaseService } from '../services/lease.service';
import { MaintenanceService } from '../services/maintenance.service';
import { TowerService } from '../services/tower.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatGridListModule, MatIconModule, MatButtonModule, MatSnackBarModule],
  template: `
    <ng-container *ngIf="dashboardLoaded; else dashboardLoading">
      <div class="dashboard-shell">
        <div class="dashboard-top-cards">
          <mat-card class="stat-card" *ngFor="let card of statCards">
            <div class="stat-card-header">
              <div>
                <div class="stat-card-title">{{ card.label }}</div>
                <div class="stat-card-value">{{ card.value | number }}</div>
              </div>
              <mat-icon>{{ card.icon }}</mat-icon>
            </div>
            <div class="stat-card-footer">{{ card.description }}</div>
          </mat-card>
        </div>

        <div class="dashboard-panels">
          <mat-card class="panel-card summary-card">
            <mat-card-title>Disaster Monitoring</mat-card-title>
            <mat-card-content>
              <p>{{ disasterSummary }}</p>
            </mat-card-content>
          </mat-card>

          <mat-card class="panel-card summary-card">
            <mat-card-title>Lease & Revenue</mat-card-title>
            <mat-card-content>
              <p>{{ leaseSummary }}</p>
            </mat-card-content>
          </mat-card>

          <mat-card class="panel-card summary-card">
            <mat-card-title>Maintenance Report</mat-card-title>
            <mat-card-content>
              <p>{{ maintenanceSummary }}</p>
            </mat-card-content>
          </mat-card>

          <mat-card class="panel-card summary-card">
            <mat-card-title>Market Snapshot</mat-card-title>
            <mat-card-content>
              <p>{{ marketSummary }}</p>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </ng-container>

    <ng-template #dashboardLoading>
      <div class="dashboard-shell loading-shell">
        <mat-card>
          <mat-card-title>Loading dashboard...</mat-card-title>
          <mat-card-content>Please wait while dashboard data is loaded from the backend.</mat-card-content>
        </mat-card>
      </div>
    </ng-template>
  `,
  styles: [
    `
      .dashboard-shell {
        display: grid;
        gap: 24px;
      }
      .dashboard-top-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 20px;
      }
      .stat-card {
        background: linear-gradient(135deg, #5e35b1, #1e88e5);
        color: white;
        min-height: 140px;
      }
      .stat-card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }
      .stat-card-title {
        font-size: 0.9rem;
        opacity: 0.85;
      }
      .stat-card-value {
        font-size: 2.2rem;
        font-weight: 800;
      }
      .stat-card-footer {
        margin-top: 14px;
        opacity: 0.92;
      }
      .dashboard-panels {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 20px;
      }
      .panel-card {
        background: #0f172a;
        color: #eef2ff;
        min-height: 180px;
      }
      .summary-card mat-card-title {
        font-weight: 700;
      }
      .panel-card p {
        margin: 0;
      }
    `
  ]
})
export class DashboardPage implements OnInit {
  statCards = [
    { label: 'Total Towers', value: 0, icon: 'apartment', description: 'All registered tower assets' },
    { label: 'Active Incidents', value: 0, icon: 'warning', description: 'Ongoing disaster incidents' },
    { label: 'Pending Lease Requests', value: 0, icon: 'hourglass_top', description: 'Leases awaiting approval' },
    { label: 'Site Manager Requests', value: 0, icon: 'account_box', description: 'Pending registration approvals' },
    { label: 'Low Inventory Alerts', value: 0, icon: 'inventory_2', description: 'Stock running below threshold' }
  ];

  disasterSummary = 'Loading disaster monitoring details...';
  leaseSummary = 'Loading lease and revenue details...';
  maintenanceSummary = 'Loading maintenance report...';
  marketSummary = 'Loading market availability...';
  dashboardLoaded = false;

  constructor(
    private readonly dashboardService: DashboardService,
    private readonly disasterService: DisasterService,
    private readonly leaseService: LeaseService,
    private readonly maintenanceService: MaintenanceService,
    private readonly towerService: TowerService,
    private readonly authService: AuthService,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  private loadStats(): void {
    forkJoin({
      towerUtil: this.dashboardService.getTowerUtilization(),
      disasterMonitoring: this.dashboardService.getDisasterMonitoring(),
      revenueLease: this.dashboardService.getRevenueLease(),
      maintenanceReport: this.dashboardService.getMaintenanceReport(),
      availableLease: this.towerService.getAvailableForLease(),
      availableSale: this.towerService.getAvailableForSale(),
      allLeases: this.leaseService.getAll(),
      inventory: this.maintenanceService.getInventory()
    }).subscribe({
      next: ({
        towerUtil,
        disasterMonitoring,
        revenueLease,
        maintenanceReport,
        availableLease,
        availableSale,
        allLeases,
        inventory
      }) => {
        this.statCards[0].value = towerUtil?.totalTowers ?? 0;
        this.statCards[1].value = disasterMonitoring?.openIncidentsCount ?? 0;
        this.statCards[2].value = revenueLease?.activeLeasesCount ?? 0;
        this.statCards[4].value = maintenanceReport?.lowStockInventoryCount ?? 0;

        this.disasterSummary =
          disasterMonitoring?.openIncidentsCount !== undefined
            ? `Open incidents: ${disasterMonitoring.openIncidentsCount}, affected towers: ${disasterMonitoring.totalAffectedTowersCount}.`
            : 'Disaster tracking is active and reporting details.';
        this.leaseSummary =
          revenueLease?.activeLeasesCount !== undefined
            ? `Active leases: ${revenueLease.activeLeasesCount}, completed transactions: ${revenueLease.completedTransactionsCount}.`
            : 'Lease revenue and utilization are available from backend analytics.';
        this.maintenanceSummary =
          maintenanceReport?.openRepairsCount !== undefined
            ? `Open repairs: ${maintenanceReport.openRepairsCount}, low stock items: ${maintenanceReport.lowStockInventoryCount}.`
            : 'Repair workflow data and inventory health are being monitored.';
        this.marketSummary = `Available for lease: ${availableLease.length}, available for sale: ${availableSale.length}`;
        this.authService.getPendingSiteManagerRequests().subscribe({
          next: (requests) => {
            this.statCards[3].value = Array.isArray(requests) ? requests.length : 0;
            this.dashboardLoaded = true;
          },
          error: () => {
            this.statCards[3].value = 0;
            this.dashboardLoaded = true;
          }
        });
      },
      error: () => {
        this.snackBar.open('Unable to load dashboard data. Please refresh after the backend is available.', 'Close', {
          duration: 5000
        });
      }
    });
  }
}
