import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule],
  selector: 'app-not-found',
  template: `
    <div class="not-found-shell">
      <mat-card>
        <mat-card-title>404 - Page Not Found</mat-card-title>
        <mat-card-content>
          <p>The page you are looking for does not exist.</p>
        </mat-card-content>
        <mat-card-actions>
          <button mat-flat-button color="primary" routerLink="/dashboard">Go to Dashboard</button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .not-found-shell {
        display: flex;
        min-height: calc(100vh - 72px);
        align-items: center;
        justify-content: center;
        padding: 24px;
      }
      mat-card {
        padding: 24px;
        background: rgba(22, 7, 59, 0.94);
      }
    `
  ]
})
export class NotFoundPage {}
