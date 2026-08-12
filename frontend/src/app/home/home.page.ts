import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule],
  template: `
    <div class="home-shell">
      <mat-card class="home-card intro-card">
        <div class="hero-copy">
          <h1>Welcome to TowerSync</h1>
          <p>
            Securely manage telecom tower operations, site manager registrations, disaster recovery,
            and real-time asset dashboards.
          </p>
        </div>
        <div class="hero-actions">
          <button mat-flat-button color="primary" (click)="navigateTo('dashboard')">Go to Dashboard</button>
          <button mat-flat-button color="accent" (click)="navigateTo('login')">Login</button>
        </div>
      </mat-card>

      <div class="home-cards">
        <mat-card class="feature-card" (click)="navigateTo('dashboard')">
          <h2>Dashboard</h2>
          <p>Review your operations, maintenance alerts, and request pipelines in one place.</p>
        </mat-card>

        <mat-card class="feature-card" (click)="navigateTo('operators')">
          <h2>Operator Coverage</h2>
          <p>View operator details, site managers, and active tower assignments.</p>
        </mat-card>

        <mat-card class="feature-card" (click)="navigateTo('site-manager-requests')">
          <h2>Site Manager Requests</h2>
          <p>Admin users can review and approve site manager registration requests.</p>
        </mat-card>
      </div>
    </div>
  `,
  styles: [
    `
      .home-shell {
        display: grid;
        gap: 24px;
        padding: 24px;
      }
      .intro-card {
        padding: 32px;
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(168, 85, 247, 0.15));
      }
      .hero-copy h1 {
        margin: 0 0 12px;
        font-size: clamp(2.4rem, 3vw, 3.4rem);
      }
      .hero-copy p {
        margin: 0;
        color: rgba(226, 232, 240, 0.8);
      }
      .hero-actions {
        display: flex;
        gap: 14px;
        margin-top: 28px;
        flex-wrap: wrap;
      }
      .home-cards {
        display: grid;
        gap: 18px;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      }
      .feature-card {
        cursor: pointer;
        transition: transform 180ms ease, border-color 180ms ease;
      }
      .feature-card:hover {
        transform: translateY(-2px);
        border-color: rgba(59, 130, 246, 0.3);
      }
      .feature-card h2 {
        margin-top: 0;
      }
    `
  ]
})
export class HomePage {
  constructor(private readonly authService: AuthService, private readonly router: Router) {}

  navigateTo(path: string): void {
    if (path !== 'login' && !this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    this.router.navigate([`/${path}`]);
  }
}
