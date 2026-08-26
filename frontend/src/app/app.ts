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
import { Router, RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';

import { environment } from '../environments/environment';
import { BackendStatusService } from './core/backend-status.service';
import { LoadingService } from './core/loading.service';
import { ThemeService } from './core/theme.service';
import { AuthService, AuthUser } from './services/auth.service';

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
  private readonly router = inject(Router);
  protected readonly loadingService = inject(LoadingService);
  protected readonly backendStatus = inject(BackendStatusService);
  public readonly themeService = inject(ThemeService);

  protected readonly loading$ = this.loadingService.loading$;
  protected readonly offline$ = this.backendStatus.offline$;
  protected readonly apiBaseUrl = environment.apiBaseUrl;
  protected readonly currentUser$ = this.authService.currentUser$;

  get isDark(): boolean {
    return this.themeService.isDark;
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  private readonly operatorManagerNavItems: AppNavItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: '🏠' },
    { label: 'Towers', path: '/towers', icon: '📡' },
    { label: 'Leases', path: '/leases', icon: '🤝', badge: 0, badgeColor: 'accent' },
    { label: 'Transactions', path: '/transactions', icon: '💰' },
    { label: 'Disasters', path: '/disasters', icon: '🚨', badge: 0, badgeColor: 'warn' },
    { label: 'Site Manager Requests', path: '/site-manager-requests', icon: '✓' }
  ];

  private readonly siteManagerNavItems: AppNavItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: '🏠' },
    { label: 'Towers', path: '/towers', icon: '📡' },
    { label: 'Disasters', path: '/disasters', icon: '🚨', badge: 0, badgeColor: 'warn' }
  ];

  private readonly adminNavItems: AppNavItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: '🏠' },
    { label: 'Towers', path: '/towers', icon: '📡' },
    { label: 'Operators & Managers', path: '/operators', icon: '🏢' },
    { label: 'Operator Manager Requests', path: '/site-manager-requests', icon: '✓' }
  ];

  get navItems(): AppNavItem[] {
    const user = this.authService.getCurrentUser();
    if (user?.role === 'ADMIN') {
      return this.adminNavItems;
    }
    if (user?.role === 'SITE_MANAGER') {
      return this.siteManagerNavItems;
    }
    return this.operatorManagerNavItems;
  }

  getUserDisplayName(user: AuthUser | null): string {
    if (!user) return '';
    return user.fullName || user.name || user.username || '';
  }

  getUserState(user: AuthUser | null): string {
    if (!user || user.role === 'ADMIN') return '';
    if (user.state) return user.state;
    return this.authService.inferStateFromUser(user);
  }

  getUserRoleSubtitle(user: AuthUser | null): string {
    if (!user) return '';
    const opPrefix = user.operatorName ? `${user.operatorName} ` : '';
    if (user.role === 'OPERATOR_MANAGER') {
      return `${opPrefix}Operations Manager`;
    }
    if (user.role === 'SITE_MANAGER') {
      return `${opPrefix}Site Manager`;
    }
    if (user.role === 'ADMIN') {
      return `${opPrefix}Administrator`;
    }
    return user.role;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  toggleNavigation(): void {
    this.drawer?.toggle();
  }

}

