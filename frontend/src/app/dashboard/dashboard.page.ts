import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DashboardService } from '../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDividerModule,
    RouterLink
  ],
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.css']
})
export class DashboardPage implements OnInit {
  summary: any = {
    totalTowers: 0,
    activeIncidents: 0,
    pendingLeaseRequests: 0,
    pendingRegistrationRequests: 0,
    lowInventoryAlerts: 0,
    availableForLease: 0,
    availableForSale: 0,
    openRepairs: 0,
    completedTransactions: 0
  };

  disasterDetails: any = null;
  revenueDetails: any = null;
  maintenanceDetails: any = null;
  utilizationDetails: any = null;

  dashboardLoaded = false;

  constructor(
    private readonly dashboardService: DashboardService,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadAllDashboardData();
  }

  private loadAllDashboardData(): void {
    forkJoin({
      summary: this.dashboardService.getSummary().pipe(catchError(() => of(null))),
      disaster: this.dashboardService.getDisasterMonitoring().pipe(catchError(() => of(null))),
      revenue: this.dashboardService.getRevenueLease().pipe(catchError(() => of(null))),
      maintenance: this.dashboardService.getMaintenanceReport().pipe(catchError(() => of(null))),
      utilization: this.dashboardService.getTowerUtilization().pipe(catchError(() => of(null)))
    }).subscribe({
      next: (results) => {
        if (results.summary) {
          this.summary = {
            totalTowers: results.summary.totalTowers ?? 0,
            activeIncidents: results.summary.activeIncidents ?? 0,
            pendingLeaseRequests: results.summary.pendingLeaseRequests ?? 0,
            pendingRegistrationRequests: results.summary.pendingRegistrationRequests ?? 0,
            lowInventoryAlerts: results.summary.lowInventoryAlerts ?? 0,
            availableForLease: results.summary.availableForLease ?? 0,
            availableForSale: results.summary.availableForSale ?? 0,
            openRepairs: results.summary.openRepairs ?? 0,
            completedTransactions: results.summary.completedTransactions ?? 0
          };
        }

        this.disasterDetails = results.disaster;
        this.revenueDetails = results.revenue;
        this.maintenanceDetails = results.maintenance;
        this.utilizationDetails = results.utilization;

        this.dashboardLoaded = true;
      },
      error: () => {
        this.dashboardLoaded = true;
        this.snackBar.open('Unable to load dashboard telemetry.', 'Close', { duration: 4000 });
      }
    });
  }
}
