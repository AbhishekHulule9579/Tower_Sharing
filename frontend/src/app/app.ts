import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';

import { environment } from '../environments/environment';
import { BackendStatusService } from './core/backend-status.service';
import { LoadingService } from './core/loading.service';
import { AuthService } from './services/auth.service';

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
  @ViewChild(MatDrawer) private drawer?: MatDrawer;

  private readonly authService = inject(AuthService);
  protected readonly loadingService = inject(LoadingService);
  protected readonly backendStatus = inject(BackendStatusService);

  protected readonly loading$ = this.loadingService.loading$;
  protected readonly offline$ = this.backendStatus.offline$;
  protected readonly apiBaseUrl = environment.apiBaseUrl;
  protected readonly currentUser$ = this.authService.currentUser$;

  private readonly allNavItems: AppNavItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: '🏠' },
    { label: 'Towers', path: '/towers', icon: '📡' },
    { label: 'Leases', path: '/leases', icon: '🤝', badge: 0, badgeColor: 'accent' },
    { label: 'Transactions', path: '/transactions', icon: '💰' },
    { label: 'Disasters', path: '/disasters', icon: '🚨', badge: 0, badgeColor: 'warn' },
    { label: 'Maintenance', path: '/maintenance', icon: '🔧', badge: 0, badgeColor: 'warn' },
    { label: 'Operators & Managers', path: '/operators', icon: '🏢' },
    { label: 'Site Manager Requests', path: '/site-manager-requests', icon: '✓' }
  ];

  private readonly adminNavItems: AppNavItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: '🏠' },
    { label: 'Towers', path: '/towers', icon: '📡' },
    { label: 'Operators & Managers', path: '/operators', icon: '🏢' },
    { label: 'Site Manager Requests', path: '/site-manager-requests', icon: '✓' }
  ];

  get navItems(): AppNavItem[] {
    const user = this.authService.getCurrentUser();
    if (user?.role === 'ADMIN') {
      return this.adminNavItems;
    }
    return this.allNavItems;
  }

  logout(): void {
    this.authService.logout();
  }

  toggleNavigation(): void {
    this.drawer?.toggle();
  }

}

