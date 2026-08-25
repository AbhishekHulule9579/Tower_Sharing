import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService, AuthUser } from '../services/auth.service';
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
  currentUser: AuthUser | null = null;
  isAdmin = false;

  adminSummary: any = {
    operatorName: '',
    operatorCode: '',
    operatorId: null,
    companyTowers: 0,
    operatorManagers: 0,
    pendingRequests: 0,
    activeTowers: 0,
    maintenanceTowers: 0,
    inactiveTowers: 0,
    recentRequests: []
  };

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
  processingRequestId: number | null = null;

  constructor(
    private readonly dashboardService: DashboardService,
    private readonly authService: AuthService,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.isAdmin = this.currentUser?.role === 'ADMIN';

    if (this.isAdmin) {
      this.loadAdminDashboardData();
    } else {
      this.loadAllDashboardData();
    }
  }

  loadAdminDashboardData(): void {
    this.dashboardService.getAdminSummary().pipe(
      catchError(() => of(null))
    ).subscribe({
      next: (data) => {
        if (data) {
          this.adminSummary = {
            operatorName: data.operatorName || this.currentUser?.operatorName || 'Company',
            operatorCode: data.operatorCode || this.currentUser?.operatorCode || '',
            operatorId: data.operatorId || this.currentUser?.operatorId,
            companyTowers: data.companyTowers ?? 0,
            operatorManagers: data.operatorManagers ?? 0,
            pendingRequests: data.pendingRequests ?? 0,
            activeTowers: data.activeTowers ?? 0,
            maintenanceTowers: data.maintenanceTowers ?? 0,
            inactiveTowers: data.inactiveTowers ?? 0,
            recentRequests: data.recentRequests || []
          };
        }
        this.dashboardLoaded = true;
      },
      error: () => {
        this.dashboardLoaded = true;
        this.snackBar.open('Unable to load admin dashboard telemetry.', 'Close', { duration: 4000 });
      }
    });
  }

  loadAllDashboardData(): void {
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
        this.snackBar.open('Unable to load operations dashboard telemetry.', 'Close', { duration: 4000 });
      }
    });
  }

  approveRequest(id: number): void {
    this.processingRequestId = id;
    this.authService.approveSiteManagerRequest(id).subscribe({
      next: () => {
        this.processingRequestId = null;
        this.snackBar.open('Registration request approved successfully!', 'OK', { duration: 3000 });
        this.loadAdminDashboardData();
      },
      error: (err) => {
        this.processingRequestId = null;
        const msg = typeof err?.error === 'string' ? err.error : 'Failed to approve request.';
        this.snackBar.open(msg, 'Close', { duration: 4000 });
      }
    });
  }

  rejectRequest(id: number): void {
    this.processingRequestId = id;
    this.authService.rejectSiteManagerRequest(id).subscribe({
      next: () => {
        this.processingRequestId = null;
        this.snackBar.open('Registration request rejected.', 'OK', { duration: 3000 });
        this.loadAdminDashboardData();
      },
      error: (err) => {
        this.processingRequestId = null;
        const msg = typeof err?.error === 'string' ? err.error : 'Failed to reject request.';
        this.snackBar.open(msg, 'Close', { duration: 4000 });
      }
    });
  }
}
