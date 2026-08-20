import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { forkJoin } from 'rxjs';
import { LeaseService } from '../services/lease.service';
import { OperatorService } from '../services/operator.service';
import { TowerService } from '../services/tower.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTableModule,
    MatDividerModule
  ],
  selector: 'app-leases',
  template: `
    <ng-container *ngIf="leaseLoaded; else leasesLoading">
      <div class="page-shell">
        <div class="page-header">
          <div>
            <h2>Lease Requests</h2>
            <p>Review new requests, approve leases, and manage active contracts.</p>
          </div>
        </div>

        <mat-card>
          <mat-card-title>Active Lease Contracts</mat-card-title>
          <mat-card-content>
            <table mat-table [dataSource]="leases" class="mat-elevation-z2 lease-table">
              <ng-container matColumnDef="tower">
                <th mat-header-cell *matHeaderCellDef> Tower </th>
                <td mat-cell *matCellDef="let lease"> {{ lease.tower?.towerCode || lease.tower?.name }} </td>
              </ng-container>
              <ng-container matColumnDef="operator">
                <th mat-header-cell *matHeaderCellDef> Lessee </th>
                <td mat-cell *matCellDef="let lease"> {{ lease.lesseeOperator?.name }} </td>
              </ng-container>
              <ng-container matColumnDef="sharedCapacity">
                <th mat-header-cell *matHeaderCellDef> Shared Capacity </th>
                <td mat-cell *matCellDef="let lease"> {{ lease.sharedCapacity }} </td>
              </ng-container>
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef> Status </th>
                <td mat-cell *matCellDef="let lease"> {{ lease.status }} </td>
              </ng-container>
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef> Actions </th>
                <td mat-cell *matCellDef="let lease">
                  <button mat-icon-button color="primary" *ngIf="lease.status === 'PENDING_APPROVAL'" (click)="approveLease(lease.id, true)">
                    <mat-icon>check_circle</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" *ngIf="lease.status === 'PENDING_APPROVAL'" (click)="approveLease(lease.id, false)">
                    <mat-icon>cancel</mat-icon>
                  </button>
                  <button mat-icon-button color="accent" *ngIf="lease.status === 'ACTIVE'" (click)="terminateLease(lease.id)">
                    <mat-icon>close</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-title>Request a Lease</mat-card-title>
          <mat-card-content>
            <div class="form-grid">
              <mat-form-field appearance="outline">
                <mat-label>Tower</mat-label>
                <mat-select name="towerId" [(ngModel)]="leaseForm.towerId">
                  <mat-option *ngFor="let tower of leaseTowers" [value]="tower.id">{{ tower.towerCode }} — {{ tower.location }}</mat-option>
                </mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Operator</mat-label>
                <mat-select name="lesseeOperatorId" [(ngModel)]="leaseForm.lesseeOperatorId">
                  <mat-option *ngFor="let operator of operators" [value]="operator.id">{{ operator.name }}</mat-option>
                </mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Shared Capacity</mat-label>
                <input matInput type="number" name="sharedCapacity" [(ngModel)]="leaseForm.sharedCapacity" />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Months</mat-label>
                <input matInput type="number" name="months" [(ngModel)]="leaseForm.months" />
              </mat-form-field>
            </div>
            <div class="form-actions">
              <button mat-raised-button color="primary" (click)="requestLease()">Submit Request</button>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </ng-container>

    <ng-template #leasesLoading>
      <div class="page-shell">
        <mat-card>
          <mat-card-title>Loading leases...</mat-card-title>
          <mat-card-content>Please wait while lease and operator data are loaded.</mat-card-content>
        </mat-card>
      </div>
    </ng-template>
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
      .lease-table {
        width: 100%;
        margin-top: 16px;
      }
      .form-grid {
        display: grid;
        gap: 18px;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        margin-top: 16px;
      }
      .form-actions {
        margin-top: 18px;
      }
    `
  ]
})
export class LeasesPage implements OnInit {
  leases: any[] = [];
  leaseTowers: any[] = [];
  operators: any[] = [];
  displayedColumns = ['tower', 'operator', 'sharedCapacity', 'status', 'actions'];
  leaseLoaded = false;

  leaseForm: any = {
    towerId: null,
    lesseeOperatorId: null,
    sharedCapacity: 0,
    months: 12
  };

  constructor(
    private readonly leaseService: LeaseService,
    private readonly towerService: TowerService,
    private readonly operatorService: OperatorService,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    forkJoin({
      leases: this.leaseService.getAll(),
      operators: this.operatorService.getAllOperators(),
      leaseTowers: this.towerService.getAvailableForLease()
    }).subscribe({
      next: ({ leases, operators, leaseTowers }) => {
        this.leases = leases || [];
        this.operators = operators || [];
        this.leaseTowers = leaseTowers || [];
        this.leaseLoaded = true;
      },
      error: () => {
        this.leaseLoaded = true;
        this.snackBar.open('Unable to load lease data.', 'Close', { duration: 3000 });
      }
    });
  }

  public requestLease(): void {
    this.leaseService.requestLease(this.leaseForm).subscribe({
      next: () => {
        this.snackBar.open('Lease request submitted.', 'Close', { duration: 3000 });
        this.leaseForm = { towerId: null, lesseeOperatorId: null, sharedCapacity: 0, months: 12 };
        this.loadData();
      },
      error: () => this.snackBar.open('Unable to submit lease request.', 'Close', { duration: 3000 })
    });
  }

  public approveLease(id: number, approved: boolean): void {
    this.leaseService.approveLease(id, approved, approved ? 'Approved from frontend' : 'Rejected from frontend').subscribe({
      next: () => {
        const message = approved ? 'Lease approved.' : 'Lease rejected.';
        this.snackBar.open(message, 'Close', { duration: 3000 });
        this.loadData();
      },
      error: () => this.snackBar.open('Unable to update lease status.', 'Close', { duration: 3000 })
    });
  }

  public terminateLease(id: number): void {
    this.leaseService.terminateLease(id).subscribe({
      next: () => {
        this.snackBar.open('Lease terminated.', 'Close', { duration: 3000 });
        this.loadData();
      },
      error: () => this.snackBar.open('Unable to terminate lease.', 'Close', { duration: 3000 })
    });
  }
}
