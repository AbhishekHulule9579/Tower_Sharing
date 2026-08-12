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
import { DisasterService } from '../services/disaster.service';
import { MaintenanceService } from '../services/maintenance.service';
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
  selector: 'app-maintenance',
  template: `
    <div class="page-shell">
      <div class="page-header">
        <div>
          <h2>Maintenance Center</h2>
          <p>Manage inventory, repair requests, and tower restoration workflows.</p>
        </div>
      </div>

      <div class="section-grid">
        <mat-card class="summary-card">
          <mat-card-title>Inventory Items</mat-card-title>
          <mat-card-content>{{ inventoryItems.length }}</mat-card-content>
        </mat-card>
        <mat-card class="summary-card">
          <mat-card-title>Open Repair Requests</mat-card-title>
          <mat-card-content>{{ repairRequests.length }}</mat-card-content>
        </mat-card>
      </div>

      <mat-card>
        <mat-card-title>Inventory</mat-card-title>
        <mat-card-content>
          <table mat-table [dataSource]="inventoryItems" class="mat-elevation-z2 inventory-table">
            <ng-container matColumnDef="itemCode">
              <th mat-header-cell *matHeaderCellDef> Item Code </th>
              <td mat-cell *matCellDef="let item"> {{ item.itemCode }} </td>
            </ng-container>
            <ng-container matColumnDef="itemName">
              <th mat-header-cell *matHeaderCellDef> Name </th>
              <td mat-cell *matCellDef="let item"> {{ item.itemName }} </td>
            </ng-container>
            <ng-container matColumnDef="quantity">
              <th mat-header-cell *matHeaderCellDef> Quantity </th>
              <td mat-cell *matCellDef="let item"> {{ item.quantity }} </td>
            </ng-container>
            <ng-container matColumnDef="location">
              <th mat-header-cell *matHeaderCellDef> Location </th>
              <td mat-cell *matCellDef="let item"> {{ item.location }} </td>
            </ng-container>
            <ng-container matColumnDef="threshold">
              <th mat-header-cell *matHeaderCellDef> Min Threshold </th>
              <td mat-cell *matCellDef="let item"> {{ item.minThreshold }} </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="inventoryColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: inventoryColumns;"></tr>
          </table>
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-title>Repair Requests</mat-card-title>
        <mat-card-content>
          <table mat-table [dataSource]="repairRequests" class="mat-elevation-z2 repair-table">
            <ng-container matColumnDef="tower">
              <th mat-header-cell *matHeaderCellDef> Tower </th>
              <td mat-cell *matCellDef="let repair"> {{ repair.tower?.towerCode }} </td>
            </ng-container>
            <ng-container matColumnDef="priority">
              <th mat-header-cell *matHeaderCellDef> Priority </th>
              <td mat-cell *matCellDef="let repair"> {{ repair.priority }} </td>
            </ng-container>
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef> Status </th>
              <td mat-cell *matCellDef="let repair"> {{ repair.status }} </td>
            </ng-container>
            <ng-container matColumnDef="siteManager">
              <th mat-header-cell *matHeaderCellDef> Site Manager </th>
              <td mat-cell *matCellDef="let repair"> {{ repair.assignedSiteManager?.username || repair.assignedSiteManager?.email }} </td>
            </ng-container>
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef> Actions </th>
              <td mat-cell *matCellDef="let repair">
                <button mat-icon-button color="primary" (click)="selectRepairForConsume(repair)">
                  <mat-icon>construction</mat-icon>
                </button>
                <button mat-icon-button color="accent" (click)="selectRepairForRestore(repair)">
                  <mat-icon>restore</mat-icon>
                </button>
              </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="repairColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: repairColumns;"></tr>
          </table>
        </mat-card-content>
      </mat-card>

      <div class="form-grid">
        <mat-card>
          <mat-card-title>New Inventory Item</mat-card-title>
          <mat-card-content>
            <div class="form-grid-inner">
              <mat-form-field appearance="outline">
                <mat-label>Item Code</mat-label>
                <input matInput [(ngModel)]="inventoryForm.itemCode" name="itemCode" />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Item Name</mat-label>
                <input matInput [(ngModel)]="inventoryForm.itemName" name="itemName" />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Quantity</mat-label>
                <input matInput type="number" [(ngModel)]="inventoryForm.quantity" name="quantity" />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Unit Price</mat-label>
                <input matInput type="number" [(ngModel)]="inventoryForm.unitPrice" name="unitPrice" />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Location</mat-label>
                <input matInput [(ngModel)]="inventoryForm.location" name="location" />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Min Threshold</mat-label>
                <input matInput type="number" [(ngModel)]="inventoryForm.minThreshold" name="minThreshold" />
              </mat-form-field>
            </div>
            <div class="form-actions">
              <button mat-raised-button color="primary" (click)="createInventoryItem()">Add Inventory</button>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-title>New Repair Request</mat-card-title>
          <mat-card-content>
            <div class="form-grid-inner">
              <mat-form-field appearance="outline">
                <mat-label>Tower</mat-label>
                <mat-select [(ngModel)]="repairForm.towerId" name="towerId">
                  <mat-option *ngFor="let tower of towers" [value]="tower.id">{{ tower.towerCode }}</mat-option>
                </mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Site Manager</mat-label>
                <mat-select [(ngModel)]="repairForm.assignedSiteManagerId" name="assignedSiteManagerId">
                  <mat-option *ngFor="let manager of siteManagers" [value]="manager.id">{{ manager.username || manager.email }}</mat-option>
                </mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Priority</mat-label>
                <mat-select [(ngModel)]="repairForm.priority" name="priority">
                  <mat-option value="HIGH">HIGH</mat-option>
                  <mat-option value="MEDIUM">MEDIUM</mat-option>
                  <mat-option value="LOW">LOW</mat-option>
                </mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline" class="span-full">
                <mat-label>Description</mat-label>
                <input matInput [(ngModel)]="repairForm.description" name="description" />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Incident ID</mat-label>
                <input matInput type="number" [(ngModel)]="repairForm.incidentId" name="incidentId" />
              </mat-form-field>
            </div>
            <div class="form-actions">
              <button mat-raised-button color="primary" (click)="createRepairRequest()">Create Repair Request</button>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="form-grid">
        <mat-card>
          <mat-card-title>Consume Parts for Repair</mat-card-title>
          <mat-card-content>
            <div class="form-grid-inner">
              <mat-form-field appearance="outline">
                <mat-label>Repair Request</mat-label>
                <mat-select [(ngModel)]="consumeForm.repairRequestId" name="repairRequestId">
                  <mat-option *ngFor="let repair of repairRequests" [value]="repair.id">{{ repair.id }} - {{ repair.tower?.towerCode }}</mat-option>
                </mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Inventory Item ID</mat-label>
                <input matInput type="number" [(ngModel)]="consumeForm.inventoryItemId" name="inventoryItemId" />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Quantity Used</mat-label>
                <input matInput type="number" [(ngModel)]="consumeForm.quantityUsed" name="quantityUsed" />
              </mat-form-field>
            </div>
            <div class="form-actions">
              <button mat-raised-button color="primary" (click)="consumeParts()">Consume Parts</button>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-title>Restore Tower</mat-card-title>
          <mat-card-content>
            <div class="form-grid-inner">
              <mat-form-field appearance="outline">
                <mat-label>Repair Request</mat-label>
                <mat-select [(ngModel)]="restoreForm.repairRequestId" name="repairRequestId">
                  <mat-option *ngFor="let repair of repairRequests" [value]="repair.id">{{ repair.id }} - {{ repair.tower?.towerCode }}</mat-option>
                </mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline" class="span-full">
                <mat-label>Maintenance Notes</mat-label>
                <input matInput [(ngModel)]="restoreForm.maintenanceNotes" name="maintenanceNotes" />
              </mat-form-field>
            </div>
            <div class="form-actions">
              <button mat-raised-button color="primary" (click)="restoreTower()">Restore Tower</button>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
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
      .section-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 18px;
      }
      .summary-card {
        background: #111827;
        color: #e0e7ff;
        min-height: 120px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .inventory-table,
      .repair-table {
        width: 100%;
        margin-top: 16px;
      }
      .form-grid {
        display: grid;
        gap: 18px;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      }
      .form-grid-inner {
        display: grid;
        gap: 18px;
      }
      .span-full {
        grid-column: span 2;
      }
      .form-actions {
        margin-top: 18px;
      }
    `
  ]
})
export class MaintenancePage implements OnInit {
  inventoryItems: any[] = [];
  repairRequests: any[] = [];
  towers: any[] = [];
  siteManagers: any[] = [];
  dataLoaded = false;

  inventoryColumns = ['itemCode', 'itemName', 'quantity', 'location', 'threshold'];
  repairColumns = ['tower', 'priority', 'status', 'siteManager', 'actions'];

  inventoryForm: any = {
    itemCode: '',
    itemName: '',
    quantity: 0,
    unitPrice: 0,
    location: '',
    minThreshold: 0
  };

  repairForm: any = {
    towerId: null,
    incidentId: null,
    priority: 'HIGH',
    description: '',
    assignedSiteManagerId: null
  };

  consumeForm: any = {
    repairRequestId: null,
    inventoryItemId: null,
    quantityUsed: 0
  };

  restoreForm: any = {
    repairRequestId: null,
    maintenanceNotes: ''
  };

  constructor(
    private readonly maintenanceService: MaintenanceService,
    private readonly towerService: TowerService,
    private readonly disasterService: DisasterService,
    private readonly operatorService: OperatorService,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    forkJoin({
      inventory: this.maintenanceService.getInventory(),
      repairRequests: this.maintenanceService.getRepairRequests(),
      towers: this.towerService.getAll(),
      siteManagers: this.operatorService.getSiteManagers()
    }).subscribe({
      next: ({ inventory, repairRequests, towers, siteManagers }) => {
        this.inventoryItems = inventory || [];
        this.repairRequests = repairRequests || [];
        this.towers = towers || [];
        this.siteManagers = siteManagers || [];
        this.dataLoaded = true;
      },
      error: () => {
        this.snackBar.open('Unable to load maintenance data.', 'Close', { duration: 3000 });
      }
    });
  }

  public createInventoryItem(): void {
    this.maintenanceService.addInventoryItem(this.inventoryForm).subscribe({
      next: () => {
        this.snackBar.open('Inventory item added.', 'Close', { duration: 3000 });
        this.inventoryForm = { itemCode: '', itemName: '', quantity: 0, unitPrice: 0, location: '', minThreshold: 0 };
        this.loadData();
      },
      error: () => this.snackBar.open('Unable to add inventory.', 'Close', { duration: 3000 })
    });
  }

  public createRepairRequest(): void {
    this.maintenanceService.createRepairRequest(this.repairForm).subscribe({
      next: () => {
        this.snackBar.open('Repair request created.', 'Close', { duration: 3000 });
        this.repairForm = { towerId: null, incidentId: null, priority: 'HIGH', description: '', assignedSiteManagerId: null };
        this.loadData();
      },
      error: () => this.snackBar.open('Unable to create repair request.', 'Close', { duration: 3000 })
    });
  }

  public selectRepairForConsume(repair: any): void {
    this.consumeForm.repairRequestId = repair.id;
  }

  public selectRepairForRestore(repair: any): void {
    this.restoreForm.repairRequestId = repair.id;
  }

  public consumeParts(): void {
    this.maintenanceService.consumeParts(this.consumeForm.repairRequestId, {
      inventoryItemId: this.consumeForm.inventoryItemId,
      quantityUsed: this.consumeForm.quantityUsed
    }).subscribe({
      next: () => {
        this.snackBar.open('Parts consumed successfully.', 'Close', { duration: 3000 });
        this.consumeForm = { repairRequestId: null, inventoryItemId: null, quantityUsed: 0 };
        this.loadData();
      },
      error: () => this.snackBar.open('Unable to consume parts.', 'Close', { duration: 3000 })
    });
  }

  public restoreTower(): void {
    this.maintenanceService.restoreTower(this.restoreForm.repairRequestId, {
      maintenanceNotes: this.restoreForm.maintenanceNotes
    }).subscribe({
      next: () => {
        this.snackBar.open('Tower restored successfully.', 'Close', { duration: 3000 });
        this.restoreForm = { repairRequestId: null, maintenanceNotes: '' };
        this.loadData();
      },
      error: () => this.snackBar.open('Unable to restore tower.', 'Close', { duration: 3000 })
    });
  }
}
