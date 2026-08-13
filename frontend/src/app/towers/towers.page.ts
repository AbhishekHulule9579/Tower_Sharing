import { CommonModule } from '@angular/common';
import { afterNextRender, Component, OnInit } from '@angular/core';
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
  selector: 'app-towers',
  template: `
    <ng-container *ngIf="dataLoaded; else loading">
      <div class="page-shell">
        <div class="page-header">
          <div>
            <h2>Tower Inventory</h2>
            <p>View, create, and manage tower assets across the network.</p>
          </div>
        </div>

        <div class="section-grid">
        <mat-card class="summary-card">
          <mat-card-title>Total Towers</mat-card-title>
          <mat-card-content>{{ towers.length }}</mat-card-content>
        </mat-card>
        <mat-card class="summary-card">
          <mat-card-title>Available to Lease</mat-card-title>
          <mat-card-content>{{ availableForLease.length }}</mat-card-content>
        </mat-card>
        <mat-card class="summary-card">
          <mat-card-title>Available to Sell</mat-card-title>
          <mat-card-content>{{ availableForSale.length }}</mat-card-content>
        </mat-card>
      </div>

      <mat-card>
        <mat-card-title>All Towers</mat-card-title>
        <mat-card-content>
          <table mat-table [dataSource]="towers" class="mat-elevation-z2 tower-table">
            <ng-container matColumnDef="towerCode">
              <th mat-header-cell *matHeaderCellDef> Code </th>
              <td mat-cell *matCellDef="let tower"> {{ tower.towerCode }} </td>
            </ng-container>
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef> Name </th>
              <td mat-cell *matCellDef="let tower"> {{ tower.name }} </td>
            </ng-container>
            <ng-container matColumnDef="location">
              <th mat-header-cell *matHeaderCellDef> Location </th>
              <td mat-cell *matCellDef="let tower"> {{ tower.location }}, {{ tower.city }} </td>
            </ng-container>
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef> Status </th>
              <td mat-cell *matCellDef="let tower"> {{ tower.status }} </td>
            </ng-container>
            <ng-container matColumnDef="sharingStatus">
              <th mat-header-cell *matHeaderCellDef> Sharing </th>
              <td mat-cell *matCellDef="let tower"> {{ tower.sharingStatus }} </td>
            </ng-container>
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef> Actions </th>
              <td mat-cell *matCellDef="let tower">
                <button mat-icon-button color="primary" (click)="editTower(tower)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteTower(tower.id)">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-title>{{ selectedTower ? 'Edit Tower' : 'Create New Tower' }}</mat-card-title>
        <mat-card-content>
          <div class="form-grid">
            <mat-form-field appearance="outline">
              <mat-label>Tower Code</mat-label>
              <input matInput name="towerCode" [(ngModel)]="towerForm.towerCode" />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Name</mat-label>
              <input matInput name="name" [(ngModel)]="towerForm.name" />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>City</mat-label>
              <input matInput name="city" [(ngModel)]="towerForm.city" />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>State</mat-label>
              <input matInput name="state" [(ngModel)]="towerForm.state" />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Location</mat-label>
              <input matInput name="location" [(ngModel)]="towerForm.location" />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Owner Operator</mat-label>
              <mat-select name="ownerOperatorId" [(ngModel)]="towerForm.ownerOperatorId">
                <mat-option *ngFor="let operator of operators" [value]="operator.id">{{ operator.name }}</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Status</mat-label>
              <mat-select name="status" [(ngModel)]="towerForm.status">
                <mat-option value="ACTIVE">ACTIVE</mat-option>
                <mat-option value="INACTIVE">INACTIVE</mat-option>
                <mat-option value="MAINTENANCE">MAINTENANCE</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Sharing Status</mat-label>
              <mat-select name="sharingStatus" [(ngModel)]="towerForm.sharingStatus">
                <mat-option value="AVAILABLE_FOR_LEASE">AVAILABLE_FOR_LEASE</mat-option>
                <mat-option value="AVAILABLE_FOR_SALE">AVAILABLE_FOR_SALE</mat-option>
                <mat-option value="NOT_AVAILABLE">NOT_AVAILABLE</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Total Capacity</mat-label>
              <input matInput type="number" name="totalCapacity" [(ngModel)]="towerForm.totalCapacity" />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Current Occupancy</mat-label>
              <input matInput type="number" name="currentOccupancy" [(ngModel)]="towerForm.currentOccupancy" />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Monthly Lease Rate</mat-label>
              <input matInput type="number" name="monthlyLeaseRate" [(ngModel)]="towerForm.monthlyLeaseRate" />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Sale Price</mat-label>
              <input matInput type="number" name="salePrice" [(ngModel)]="towerForm.salePrice" />
            </mat-form-field>
            <mat-form-field appearance="outline" class="span-full">
              <mat-label>Latitude</mat-label>
              <input matInput type="number" name="latitude" [(ngModel)]="towerForm.latitude" />
            </mat-form-field>
            <mat-form-field appearance="outline" class="span-full">
              <mat-label>Longitude</mat-label>
              <input matInput type="number" name="longitude" [(ngModel)]="towerForm.longitude" />
            </mat-form-field>
          </div>
          <div class="form-actions">
            <button mat-raised-button color="primary" (click)="saveTower()">{{ selectedTower ? 'Update Tower' : 'Create Tower' }}</button>
            <button mat-stroked-button color="accent" (click)="resetForm()">Reset Form</button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  </ng-container>

  <ng-template #loading>
    <div class="page-shell">
      <mat-card>
        <mat-card-title>Loading towers...</mat-card-title>
        <mat-card-content>Please wait while tower inventory and operators are loaded.</mat-card-content>
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
      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 18px;
      }
      .page-header h2 {
        margin: 0;
        font-size: 2rem;
      }
      .page-header p {
        margin: 4px 0 0;
        color: rgba(255, 255, 255, 0.72);
      }
      .section-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 18px;
      }
      .summary-card {
        background: #111827;
        color: #f8fafc;
        min-height: 120px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .tower-table {
        width: 100%;
        margin-top: 16px;
      }
      .form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 18px;
        margin-top: 16px;
      }
      .span-full {
        grid-column: span 2;
      }
      .form-actions {
        display: flex;
        gap: 12px;
        margin-top: 18px;
      }
    `
  ]
})
export class TowersPage implements OnInit {
  towers: any[] = [];
  availableForLease: any[] = [];
  availableForSale: any[] = [];
  operators: any[] = [];
  selectedTower: any | null = null;

  displayedColumns = ['towerCode', 'name', 'location', 'status', 'sharingStatus', 'actions'];

  towerForm: any = {
    towerCode: '',
    name: '',
    location: '',
    city: '',
    state: '',
    latitude: 0,
    longitude: 0,
    totalCapacity: 0,
    currentOccupancy: 0,
    ownerOperatorId: null,
    status: 'ACTIVE',
    sharingStatus: 'AVAILABLE_FOR_LEASE',
    monthlyLeaseRate: 0,
    salePrice: 0
  };

  constructor(
    private readonly towerService: TowerService,
    private readonly operatorService: OperatorService,
    private readonly snackBar: MatSnackBar
  ) {
    afterNextRender(() => setTimeout(() => this.loadData()));
  }

  dataLoaded = false;

  ngOnInit(): void {}

  private loadData(): void {
    forkJoin({
      towers: this.towerService.getAll(),
      operators: this.operatorService.getAllOperators()
    }).subscribe({
      next: (result) => {
        this.towers = result.towers || [];
        this.availableForLease = this.towers.filter((tower) => tower.sharingStatus === 'AVAILABLE_FOR_LEASE');
        this.availableForSale = this.towers.filter((tower) => tower.sharingStatus === 'AVAILABLE_FOR_SALE');
        this.operators = result.operators || [];
        Promise.resolve().then(() => {
          this.dataLoaded = true;
        });
      },
      error: () => {
        this.snackBar.open('Unable to load tower data.', 'Close', { duration: 3000 });
      }
    });
  }

  public saveTower(): void {
    const payload = {
      ...this.towerForm,
      ownerOperator: { id: this.towerForm.ownerOperatorId }
    };

    if (this.selectedTower?.id) {
      this.towerService.updateTower(this.selectedTower.id, payload).subscribe({
        next: () => {
          this.snackBar.open('Tower updated successfully.', 'Close', { duration: 3000 });
          this.resetForm();
          this.loadData();
        },
        error: () => this.snackBar.open('Unable to update the tower.', 'Close', { duration: 3000 })
      });
      return;
    }

    this.towerService.createTower(payload).subscribe({
      next: () => {
        this.snackBar.open('Tower created successfully.', 'Close', { duration: 3000 });
        this.resetForm();
        this.loadData();
      },
      error: () => this.snackBar.open('Unable to create the tower.', 'Close', { duration: 3000 })
    });
  }

  public editTower(tower: any): void {
    this.selectedTower = tower;
    this.towerForm = {
      towerCode: tower.towerCode,
      name: tower.name,
      location: tower.location,
      city: tower.city,
      state: tower.state,
      latitude: tower.latitude,
      longitude: tower.longitude,
      totalCapacity: tower.totalCapacity,
      currentOccupancy: tower.currentOccupancy,
      ownerOperatorId: tower.ownerOperator?.id,
      status: tower.status,
      sharingStatus: tower.sharingStatus,
      monthlyLeaseRate: tower.monthlyLeaseRate,
      salePrice: tower.salePrice
    };
  }

  public deleteTower(id: number): void {
    this.towerService.deleteTower(id).subscribe({
      next: () => {
        this.snackBar.open('Tower deleted.', 'Close', { duration: 3000 });
        this.loadData();
      },
      error: () => this.snackBar.open('Unable to delete tower.', 'Close', { duration: 3000 })
    });
  }

  public resetForm(): void {
    this.selectedTower = null;
    this.towerForm = {
      towerCode: '',
      name: '',
      location: '',
      city: '',
      state: '',
      latitude: 0,
      longitude: 0,
      totalCapacity: 0,
      currentOccupancy: 0,
      ownerOperatorId: null,
      status: 'ACTIVE',
      sharingStatus: 'AVAILABLE_FOR_LEASE',
      monthlyLeaseRate: 0,
      salePrice: 0
    };
  }
}
