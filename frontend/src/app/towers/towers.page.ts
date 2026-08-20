import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
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
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatDividerModule
  ],
  selector: 'app-towers',
  template: `
    <ng-container *ngIf="dataLoaded; else loading">

      <div
        class="notification"
        *ngIf="notification.show"
        [ngClass]="notification.type"
      >
        <div class="notification-icon">
          {{ notification.type === 'success' ? '✓' : notification.type === 'warning' ? '!' : '×' }}
        </div>

        <div class="notification-content">
          <strong>
            {{ notification.type === 'success' ? 'Success' : notification.type === 'warning' ? 'Warning' : 'Error' }}
          </strong>
          <span>{{ notification.message }}</span>
        </div>

        <button
          type="button"
          class="notification-close"
          (click)="hideNotification()"
        >
          ×
        </button>
      </div>

      <div class="page-shell">

        <div class="page-header">
          <div class="header-icon">📡</div>

          <div>
            <h1>Tower Inventory</h1>
            <p>View, create, and manage tower assets across the network.</p>
          </div>
        </div>

        <div class="section-grid">

          <mat-card class="summary-card total">
            <div class="summary-icon">📡</div>

            <div class="summary-info">
              <span>Total Towers</span>
              <strong>{{ towers.length }}</strong>
              <small>Registered towers</small>
            </div>
          </mat-card>

          <mat-card class="summary-card lease">
            <div class="summary-icon">🔑</div>

            <div class="summary-info">
              <span>Available to Lease</span>
              <strong>{{ availableForLease.length }}</strong>
              <small>Ready for leasing</small>
            </div>
          </mat-card>

          <mat-card class="summary-card sale">
            <div class="summary-icon">🏷️</div>

            <div class="summary-info">
              <span>Available to Sell</span>
              <strong>{{ availableForSale.length }}</strong>
              <small>Ready for sale</small>
            </div>
          </mat-card>

        </div>

        <mat-card class="content-card">

          <div class="card-header">

            <div class="title">

              <div class="title-icon">📡</div>

              <div>
                <h2>All Towers</h2>
                <p>Manage your existing tower inventory</p>
              </div>

            </div>

            <span class="count">
              {{ towers.length }} Towers
            </span>

          </div>

          <mat-divider></mat-divider>

          <div class="table-scroll">

            <table
              mat-table
              [dataSource]="towers"
              class="tower-table"
            >

              <ng-container matColumnDef="towerCode">

                <th mat-header-cell *matHeaderCellDef>
                  TOWER CODE
                </th>

                <td mat-cell *matCellDef="let tower">

                  <span class="tower-code">
                    {{ tower.towerCode }}
                  </span>

                </td>

              </ng-container>

              <ng-container matColumnDef="name">

                <th mat-header-cell *matHeaderCellDef>
                  NAME
                </th>

                <td mat-cell *matCellDef="let tower">

                  <div class="tower-name">

                    <span class="tower-avatar">
                      📡
                    </span>

                    <span>
                      {{ tower.name }}
                    </span>

                  </div>

                </td>

              </ng-container>

              <ng-container matColumnDef="location">

                <th mat-header-cell *matHeaderCellDef>
                  LOCATION
                </th>

                <td mat-cell *matCellDef="let tower">

                  <div class="tower-location">

                    <span class="location-icon">
                      📍
                    </span>

                    <div>

                      <span>
                        {{ tower.location }}
                      </span>

                      <small>
                        {{ tower.city }}
                      </small>

                    </div>

                  </div>

                </td>

              </ng-container>

              <ng-container matColumnDef="status">

                <th mat-header-cell *matHeaderCellDef>
                  STATUS
                </th>

                <td mat-cell *matCellDef="let tower">

                  <span
                    class="status-badge"
                    [ngClass]="{
                      'active': tower.status === 'ACTIVE',
                      'inactive': tower.status === 'INACTIVE',
                      'maintenance': tower.status === 'MAINTENANCE'
                    }"
                  >

                    <span class="status-dot"></span>

                    {{ tower.status }}

                  </span>

                </td>

              </ng-container>

              <ng-container matColumnDef="sharingStatus">

                <th mat-header-cell *matHeaderCellDef>
                  SHARING STATUS
                </th>

                <td mat-cell *matCellDef="let tower">

                  <span
                    class="sharing-badge"
                    [ngClass]="{
                      'lease-badge': tower.sharingStatus === 'AVAILABLE_FOR_LEASE',
                      'sale-badge': tower.sharingStatus === 'AVAILABLE_FOR_SALE',
                      'unavailable-badge': tower.sharingStatus === 'NOT_AVAILABLE'
                    }"
                  >

                    <span>
                      {{
                        tower.sharingStatus === 'AVAILABLE_FOR_LEASE'
                          ? '🔑'
                          : tower.sharingStatus === 'AVAILABLE_FOR_SALE'
                          ? '🏷️'
                          : '⛔'
                      }}
                    </span>

                    {{ tower.sharingStatus }}

                  </span>

                </td>

              </ng-container>

              <ng-container matColumnDef="actions">

                <th mat-header-cell *matHeaderCellDef>
                  ACTIONS
                </th>

                <td mat-cell *matCellDef="let tower">

                  <div class="actions">

                    <button
                      type="button"
                      class="action-button edit"
                      title="Edit Tower"
                      (click)="editTower(tower)"
                    >
                      ✏
                    </button>

                    <button
                      type="button"
                      class="action-button delete"
                      title="Delete Tower"
                      (click)="deleteTower(tower.id)"
                    >
                      🗑
                    </button>

                  </div>

                </td>

              </ng-container>

              <tr
                mat-header-row
                *matHeaderRowDef="displayedColumns"
              ></tr>

              <tr
                mat-row
                *matRowDef="let row; columns: displayedColumns"
              ></tr>

            </table>

          </div>

        </mat-card>

        <mat-card class="content-card form-card">

          <div class="card-header">

            <div class="title">

              <div class="title-icon purple">
                {{ selectedTower ? '✏' : '+' }}
              </div>

              <div>

                <h2>
                  {{ selectedTower ? 'Edit Tower' : 'Create New Tower' }}
                </h2>

                <p>
                  {{
                    selectedTower
                      ? 'Update tower information and configuration'
                      : 'Add a new tower or update existing tower details'
                  }}
                </p>

              </div>

            </div>

          </div>

          <mat-divider></mat-divider>

          <mat-card-content class="form-content">

            <div class="form-grid">

              <mat-form-field appearance="outline">

                <mat-label>Tower Code</mat-label>

                <input
                  matInput
                  name="towerCode"
                  [(ngModel)]="towerForm.towerCode"
                />

              </mat-form-field>

              <mat-form-field appearance="outline">

                <mat-label>Name</mat-label>

                <input
                  matInput
                  name="name"
                  [(ngModel)]="towerForm.name"
                />

              </mat-form-field>

              <mat-form-field appearance="outline">

                <mat-label>City</mat-label>

                <input
                  matInput
                  name="city"
                  [(ngModel)]="towerForm.city"
                />

              </mat-form-field>

              <mat-form-field appearance="outline">

                <mat-label>State</mat-label>

                <input
                  matInput
                  name="state"
                  [(ngModel)]="towerForm.state"
                />

              </mat-form-field>

              <mat-form-field appearance="outline">

                <mat-label>Location</mat-label>

                <input
                  matInput
                  name="location"
                  [(ngModel)]="towerForm.location"
                />

              </mat-form-field>

              <mat-form-field appearance="outline">

                <mat-label>Owner Operator</mat-label>

                <mat-select
                  name="ownerOperatorId"
                  [(ngModel)]="towerForm.ownerOperatorId"
                >

                  <mat-option
                    *ngFor="let operator of operators"
                    [value]="operator.id"
                  >
                    {{ operator.name }}
                  </mat-option>

                </mat-select>

              </mat-form-field>

              <mat-form-field appearance="outline">

                <mat-label>Status</mat-label>

                <mat-select
                  name="status"
                  [(ngModel)]="towerForm.status"
                >

                  <mat-option value="ACTIVE">
                    ACTIVE
                  </mat-option>

                  <mat-option value="INACTIVE">
                    INACTIVE
                  </mat-option>

                  <mat-option value="MAINTENANCE">
                    MAINTENANCE
                  </mat-option>

                </mat-select>

              </mat-form-field>

              <mat-form-field appearance="outline">

                <mat-label>Sharing Status</mat-label>

                <mat-select
                  name="sharingStatus"
                  [(ngModel)]="towerForm.sharingStatus"
                >

                  <mat-option value="AVAILABLE_FOR_LEASE">
                    AVAILABLE_FOR_LEASE
                  </mat-option>

                  <mat-option value="AVAILABLE_FOR_SALE">
                    AVAILABLE_FOR_SALE
                  </mat-option>

                  <mat-option value="NOT_AVAILABLE">
                    NOT_AVAILABLE
                  </mat-option>

                </mat-select>

              </mat-form-field>

              <mat-form-field appearance="outline">

                <mat-label>Total Capacity</mat-label>

                <input
                  matInput
                  type="number"
                  name="totalCapacity"
                  [(ngModel)]="towerForm.totalCapacity"
                />

              </mat-form-field>

              <mat-form-field appearance="outline">

                <mat-label>Current Occupancy</mat-label>

                <input
                  matInput
                  type="number"
                  name="currentOccupancy"
                  [(ngModel)]="towerForm.currentOccupancy"
                />

              </mat-form-field>

              <mat-form-field appearance="outline">

                <mat-label>Monthly Lease Rate (₹)</mat-label>

                <input
                  matInput
                  type="number"
                  name="monthlyLeaseRate"
                  [(ngModel)]="towerForm.monthlyLeaseRate"
                />

              </mat-form-field>

              <mat-form-field appearance="outline">

                <mat-label>Sale Price (₹)</mat-label>

                <input
                  matInput
                  type="number"
                  name="salePrice"
                  [(ngModel)]="towerForm.salePrice"
                />

              </mat-form-field>

              <mat-form-field appearance="outline">

                <mat-label>Latitude</mat-label>

                <input
                  matInput
                  type="number"
                  name="latitude"
                  [(ngModel)]="towerForm.latitude"
                />

              </mat-form-field>

              <mat-form-field appearance="outline">

                <mat-label>Longitude</mat-label>

                <input
                  matInput
                  type="number"
                  name="longitude"
                  [(ngModel)]="towerForm.longitude"
                />

              </mat-form-field>

            </div>

            <div class="form-actions">

              <button
                mat-raised-button
                class="save-button"
                (click)="saveTower()"
              >
                <span>
                  {{ selectedTower ? '💾' : '＋' }}
                </span>

                {{ selectedTower ? 'Save Tower' : 'Create Tower' }}

              </button>

              <button
                mat-stroked-button
                class="reset-button"
                (click)="resetForm()"
              >
                <span>↻</span>
                Reset Form
              </button>

            </div>

          </mat-card-content>

        </mat-card>

      </div>

    </ng-container>

    <ng-template #loading>

      <div class="loading">

        <mat-card>

          <div class="loading-icon">
            📡
          </div>

          <mat-card-title>
            Loading towers...
          </mat-card-title>

          <mat-card-content>
            Please wait while tower inventory and operators are loaded.
          </mat-card-content>

        </mat-card>

      </div>

    </ng-template>
  `,
  styleUrls: ['./tower.page.css']
})
export class TowersPage implements OnInit {

  towers: any[] = [];
  availableForLease: any[] = [];
  availableForSale: any[] = [];
  operators: any[] = [];
  selectedTower: any | null = null;

  displayedColumns = [
    'towerCode',
    'name',
    'location',
    'status',
    'sharingStatus',
    'actions'
  ];

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

  dataLoaded = false;

  notification = {
    show: false,
    type: 'error',
    message: ''
  };

  private notificationTimer: any;

  constructor(
    private readonly towerService: TowerService,
    private readonly operatorService: OperatorService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {

    forkJoin({
      towers: this.towerService.getAll(),
      operators: this.operatorService.getAllOperators()
    }).subscribe({
      next: result => {

        this.towers = result.towers || [];

        this.availableForLease = this.towers.filter(
          tower => tower.sharingStatus === 'AVAILABLE_FOR_LEASE'
        );

        this.availableForSale = this.towers.filter(
          tower => tower.sharingStatus === 'AVAILABLE_FOR_SALE'
        );

        this.operators = result.operators || [];

        Promise.resolve().then(() => {
          this.dataLoaded = true;
        });

      },

      error: error => {

        this.dataLoaded = true;

        this.showNotification(
          'error',
          this.getErrorMessage(error, 'Unable to load tower data.')
        );

      }
    });

  }

  public saveTower(): void {

    const validationError = this.validateTower();

    if (validationError) {

      this.showNotification(
        'warning',
        validationError
      );

      return;
    }

    const payload = {
      ...this.towerForm,
      ownerOperator: {
        id: this.towerForm.ownerOperatorId
      }
    };

    if (this.selectedTower?.id) {

      this.towerService.updateTower(
        this.selectedTower.id,
        payload
      ).subscribe({

        next: () => {

          this.showNotification(
            'success',
            'Tower updated successfully.'
          );

          this.resetForm(false);
          this.loadData();

        },

        error: error => {

          this.showNotification(
            'error',
            this.getErrorMessage(
              error,
              'Unable to update the tower.'
            )
          );

        }

      });

      return;
    }

    this.towerService.createTower(payload).subscribe({

      next: () => {

        this.showNotification(
          'success',
          'Tower created successfully.'
        );

        this.resetForm(false);
        this.loadData();

      },

      error: error => {

        this.showNotification(
          'error',
          this.getErrorMessage(
            error,
            'Unable to create the tower.'
          )
        );

      }

    });

  }

  private validateTower(): string | null {

    if (!this.towerForm.towerCode?.trim()) {
      return 'Tower Code is required.';
    }

    if (!this.towerForm.name?.trim()) {
      return 'Tower Name is required.';
    }

    if (!this.towerForm.city?.trim()) {
      return 'City is required.';
    }

    if (!this.towerForm.state?.trim()) {
      return 'State is required.';
    }

    if (!this.towerForm.location?.trim()) {
      return 'Location is required.';
    }

    if (!this.towerForm.ownerOperatorId) {
      return 'Please select an Owner Operator.';
    }

    if (!this.towerForm.status) {
      return 'Please select a Status.';
    }

    if (!this.towerForm.sharingStatus) {
      return 'Please select a Sharing Status.';
    }

    if (
      this.towerForm.totalCapacity === null ||
      this.towerForm.totalCapacity === '' ||
      this.towerForm.totalCapacity <= 0
    ) {
      return 'Total Capacity must be greater than 0.';
    }

    if (
      this.towerForm.currentOccupancy === null ||
      this.towerForm.currentOccupancy === '' ||
      this.towerForm.currentOccupancy < 0
    ) {
      return 'Current Occupancy cannot be empty or negative.';
    }

    if (
      this.towerForm.currentOccupancy >
      this.towerForm.totalCapacity
    ) {
      return 'Current Occupancy cannot be greater than Total Capacity.';
    }

    if (
      this.towerForm.monthlyLeaseRate === null ||
      this.towerForm.monthlyLeaseRate === '' ||
      this.towerForm.monthlyLeaseRate < 0
    ) {
      return 'Monthly Lease Rate cannot be negative.';
    }

    if (
      this.towerForm.salePrice === null ||
      this.towerForm.salePrice === '' ||
      this.towerForm.salePrice < 0
    ) {
      return 'Sale Price cannot be negative.';
    }

    if (
      this.towerForm.latitude === null ||
      this.towerForm.latitude === '' ||
      this.towerForm.latitude < -90 ||
      this.towerForm.latitude > 90
    ) {
      return 'Latitude must be between -90 and 90.';
    }

    if (
      this.towerForm.longitude === null ||
      this.towerForm.longitude === '' ||
      this.towerForm.longitude < -180 ||
      this.towerForm.longitude > 180
    ) {
      return 'Longitude must be between -180 and 180.';
    }

    return null;
  }

  public editTower(tower: any): void {

    this.selectedTower = tower;

    this.towerForm = {
      towerCode: tower.towerCode || '',
      name: tower.name || '',
      location: tower.location || '',
      city: tower.city || '',
      state: tower.state || '',
      latitude: tower.latitude ?? 0,
      longitude: tower.longitude ?? 0,
      totalCapacity: tower.totalCapacity ?? 0,
      currentOccupancy: tower.currentOccupancy ?? 0,
      ownerOperatorId: tower.ownerOperator?.id ?? null,
      status: tower.status || 'ACTIVE',
      sharingStatus:
        tower.sharingStatus || 'AVAILABLE_FOR_LEASE',
      monthlyLeaseRate: tower.monthlyLeaseRate ?? 0,
      salePrice: tower.salePrice ?? 0
    };

    this.showNotification(
      'success',
      `Editing tower ${tower.towerCode}.`
    );

    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });

  }

  public deleteTower(id: number): void {

    if (!id) {

      this.showNotification(
        'error',
        'Invalid tower ID. Unable to delete the tower.'
      );

      return;
    }

    this.towerService.deleteTower(id).subscribe({

      next: () => {

        this.showNotification(
          'success',
          'Tower deleted successfully.'
        );

        this.loadData();

      },

      error: error => {

        this.showNotification(
          'error',
          this.getErrorMessage(
            error,
            'Unable to delete the tower.'
          )
        );

      }

    });

  }

  public resetForm(showMessage = true): void {

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

    if (showMessage) {

      this.showNotification(
        'success',
        'Form has been reset.'
      );

    }

  }

  private showNotification(
    type: 'success' | 'error' | 'warning',
    message: string
  ): void {

    if (this.notificationTimer) {
      clearTimeout(this.notificationTimer);
    }

    this.notification = {
      show: true,
      type,
      message
    };

    this.notificationTimer = setTimeout(() => {
      this.hideNotification();
    }, 5000);

  }

  public hideNotification(): void {

    if (this.notificationTimer) {
      clearTimeout(this.notificationTimer);
    }

    this.notification = {
      show: false,
      type: 'error',
      message: ''
    };

  }

  private getErrorMessage(
    error: any,
    defaultMessage: string
  ): string {

    if (!error) {
      return defaultMessage;
    }

    if (typeof error.error === 'string' && error.error.trim()) {
      return error.error;
    }

    if (error.error?.message) {
      return error.error.message;
    }

    if (error.error?.error) {
      return error.error.error;
    }

    if (error.message) {
      return error.message;
    }

    if (error.status === 400) {
      return 'Invalid tower information. Please check all fields.';
    }

    if (error.status === 404) {
      return 'Tower or related resource was not found.';
    }

    if (error.status === 409) {
      return 'A tower with the same information already exists.';
    }

    if (error.status === 500) {
      return 'Server error. Please try again later.';
    }

    return defaultMessage;
  }

}