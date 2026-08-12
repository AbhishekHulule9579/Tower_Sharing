import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';

import { firstValueFrom } from 'rxjs';
import { environment } from '../environments/environment';
import { BackendStatusService } from './core/backend-status.service';
import { LoadingService } from './core/loading.service';
import { AuthService } from './services/auth.service';
import { DisasterService } from './services/disaster.service';
import { LeaseService } from './services/lease.service';
import { MaintenanceService } from './services/maintenance.service';

export interface AppNavItem {
  label: string;
  path: string;
  icon: string;
  badge?: number;
  badgeColor?: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatBadgeModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatCardModule
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  private readonly leaseService = inject(LeaseService);
  private readonly disasterService = inject(DisasterService);
  private readonly maintenanceService = inject(MaintenanceService);
  private readonly authService = inject(AuthService);
  protected readonly loadingService = inject(LoadingService);
  protected readonly backendStatus = inject(BackendStatusService);

  protected readonly loading$ = this.loadingService.loading$;
  protected readonly offline$ = this.backendStatus.offline$;
  protected readonly apiBaseUrl = environment.apiBaseUrl;
  protected readonly currentUser$ = this.authService.currentUser$;

  protected navItems: AppNavItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: '🏠' },
    { label: 'Towers', path: '/towers', icon: '📡' },
    { label: 'Leases', path: '/leases', icon: '🤝', badge: 0, badgeColor: 'accent' },
    { label: 'Transactions', path: '/transactions', icon: '💰' },
    { label: 'Disasters', path: '/disasters', icon: '🚨', badge: 0, badgeColor: 'warn' },
    { label: 'Maintenance', path: '/maintenance', icon: '🔧', badge: 0, badgeColor: 'warn' },
    { label: 'Operators', path: '/operators', icon: '🏢' }
  ];

  constructor() {
    this.loadSidebarCounts();
  }

  logout(): void {
    this.authService.logout();
  }

  private async loadSidebarCounts(): Promise<void> {
    try {
      const leases = await firstValueFrom(this.leaseService.getAll());
      const incidents = await firstValueFrom(this.disasterService.getIncidents());
      const repairs = await firstValueFrom(this.maintenanceService.getRepairRequests());

      const pendingLeases = Array.isArray(leases)
        ? leases.filter((lease: any) => lease.status === 'PENDING_APPROVAL').length
        : 0;
      const activeDisasters = Array.isArray(incidents)
        ? incidents.filter((incident: any) => incident.status === 'ACTIVE').length
        : 0;
      const maintenanceAlerts = Array.isArray(repairs)
        ? repairs.filter((repair: any) => repair.priority === 'HIGH' && repair.status === 'PENDING').length
        : 0;

      this.navItems = this.navItems.map((item) => {
        if (item.path === '/leases') {
          return { ...item, badge: pendingLeases };
        }
        if (item.path === '/disasters') {
          return { ...item, badge: activeDisasters };
        }
        if (item.path === '/maintenance') {
          return { ...item, badge: maintenanceAlerts };
        }
        return item;
      });
    } catch {
      this.backendStatus.setOffline(true);
    }
  }
}

