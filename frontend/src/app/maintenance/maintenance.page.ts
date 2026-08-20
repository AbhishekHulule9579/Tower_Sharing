import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
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
import { forkJoin, Subscription } from 'rxjs';
import { AuthService, AuthUser } from '../services/auth.service';
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
  templateUrl: './maintenance.page.html',
  styleUrls: ['./maintenance.page.css']
})
export class MaintenancePage implements OnInit, OnDestroy {
  inventoryItems: any[] = [];
  repairRequests: any[] = [];
  towers: any[] = [];
  siteManagers: any[] = [];
  dataLoaded = false;

  currentUser: AuthUser | null = null;
  isAdmin = false;
  isOperatorUser = false;
  private authSubscription?: Subscription;

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
    private readonly authService: AuthService,
    private readonly snackBar: MatSnackBar,
    private readonly changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.updateUserPermissions();

    this.authSubscription = this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      this.updateUserPermissions();
    });

    this.loadData();
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  private updateUserPermissions(): void {
    const role = this.currentUser?.role;
    this.isAdmin = role === 'ADMIN';
    this.isOperatorUser = role === 'OPERATOR_MANAGER' || role === 'SITE_MANAGER';
  }

  public getOperatorDisplayName(): string {
    return this.currentUser?.operatorName || this.currentUser?.operatorCode || '';
  }

  public getSelectableTowers(): any[] {
    if (!this.isAdmin && this.isOperatorUser && this.currentUser?.operatorId) {
      return this.towers.filter((t) => t.ownerOperator?.id === this.currentUser?.operatorId);
    }
    return this.towers;
  }

  public getSelectableSiteManagers(): any[] {
    if (!this.isAdmin && this.isOperatorUser && this.currentUser?.operatorId) {
      return this.siteManagers.filter(
        (m) => m.operator?.id === this.currentUser?.operatorId || m.operatorId === this.currentUser?.operatorId
      );
    }
    return this.siteManagers;
  }

  public getDisplayedRepairs(): any[] {
    if (!this.isAdmin && this.isOperatorUser && this.currentUser?.operatorId) {
      return this.repairRequests.filter(
        (r) => r.tower?.ownerOperator?.id === this.currentUser?.operatorId
      );
    }
    return this.repairRequests;
  }

  public getManageableRepairs(): any[] {
    return this.getDisplayedRepairs().filter((r) => r.status !== 'COMPLETED');
  }

  public canManageRepair(rep: any): boolean {
    if (this.isAdmin) return true;
    if (this.isOperatorUser && this.currentUser?.operatorId) {
      return rep.tower?.ownerOperator?.id === this.currentUser.operatorId;
    }
    return false;
  }

  public selectForAction(rep: any): void {
    this.consumeForm.repairRequestId = rep.id;
    this.restoreForm.repairRequestId = rep.id;
    this.snackBar.open(`Selected work order ${rep.requestTicketCode || rep.id} for tower ${rep.tower?.towerCode}`, 'Close', {
      duration: 3000
    });
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
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.dataLoaded = true;
        this.snackBar.open('Unable to load maintenance data.', 'Close', { duration: 3000 });
      }
    });
  }

  public createInventoryItem(): void {
    if (!this.inventoryForm.itemCode?.trim()) {
      this.snackBar.open('⚠️ Part Code is required (e.g. PART-ANT-5G).', 'Close', { duration: 3500 });
      return;
    }

    if (!this.inventoryForm.itemName?.trim()) {
      this.snackBar.open('⚠️ Part Name is required (e.g. 5G Panel Antenna).', 'Close', { duration: 3500 });
      return;
    }

    if (this.inventoryForm.quantity === null || this.inventoryForm.quantity === undefined || this.inventoryForm.quantity < 0) {
      this.snackBar.open('⚠️ Stock quantity cannot be negative.', 'Close', { duration: 3500 });
      return;
    }

    if (this.inventoryForm.unitPrice === null || this.inventoryForm.unitPrice === undefined || this.inventoryForm.unitPrice < 0) {
      this.snackBar.open('⚠️ Unit price cannot be negative.', 'Close', { duration: 3500 });
      return;
    }

    if (!this.inventoryForm.location?.trim()) {
      this.snackBar.open('⚠️ Depot location is required (e.g. Mumbai Depot).', 'Close', { duration: 3500 });
      return;
    }

    this.maintenanceService.addInventoryItem(this.inventoryForm).subscribe({
      next: () => {
        this.snackBar.open('✓ Inventory item added successfully.', 'Close', { duration: 3500 });
        this.inventoryForm = { itemCode: '', itemName: '', quantity: 0, unitPrice: 0, location: '', minThreshold: 0 };
        this.loadData();
      },
      error: (err) => {
        const msg = err?.error?.message || err?.error || '⚠️ Unable to add inventory item.';
        this.snackBar.open(msg, 'Close', { duration: 3500 });
      }
    });
  }

  public createRepairRequest(): void {
    if (!this.repairForm.towerId) {
      this.snackBar.open('⚠️ Please select a tower requiring repair.', 'Close', { duration: 3500 });
      return;
    }

    if (!this.repairForm.assignedSiteManagerId) {
      this.snackBar.open('⚠️ Please assign a Site Manager to this work order.', 'Close', { duration: 3500 });
      return;
    }

    if (!this.repairForm.description?.trim()) {
      this.snackBar.open('⚠️ Please enter a description of the required repair work.', 'Close', { duration: 3500 });
      return;
    }

    this.maintenanceService.createRepairRequest(this.repairForm).subscribe({
      next: () => {
        this.snackBar.open('✓ Repair request created successfully.', 'Close', { duration: 3500 });
        this.repairForm = { towerId: null, incidentId: null, priority: 'HIGH', description: '', assignedSiteManagerId: null };
        this.loadData();
      },
      error: (err) => {
        const msg = err?.error?.message || err?.error || '⚠️ Unable to create repair request.';
        this.snackBar.open(msg, 'Close', { duration: 4000 });
      }
    });
  }

  public consumeParts(): void {
    const id = this.consumeForm.repairRequestId;
    if (!id) {
      this.snackBar.open('⚠️ Please select a repair request ticket.', 'Close', { duration: 3500 });
      return;
    }

    if (!this.consumeForm.inventoryItemId) {
      this.snackBar.open('⚠️ Please select a spare part inventory item.', 'Close', { duration: 3500 });
      return;
    }

    if (!this.consumeForm.quantityUsed || this.consumeForm.quantityUsed <= 0) {
      this.snackBar.open('⚠️ Quantity used must be greater than 0.', 'Close', { duration: 3500 });
      return;
    }

    const selectedItem = this.inventoryItems.find((i) => i.id === this.consumeForm.inventoryItemId);
    if (selectedItem && this.consumeForm.quantityUsed > selectedItem.quantity) {
      this.snackBar.open(`⚠️ Insufficient stock. Only ${selectedItem.quantity} units available.`, 'Close', { duration: 4000 });
      return;
    }

    this.maintenanceService.consumeParts(id, this.consumeForm).subscribe({
      next: () => {
        this.snackBar.open('✓ Parts consumed and inventory deducted successfully.', 'Close', { duration: 3500 });
        this.consumeForm = { repairRequestId: null, inventoryItemId: null, quantityUsed: 0 };
        this.loadData();
      },
      error: (err) => {
        const msg = err?.error?.message || err?.error || '⚠️ Unable to record inventory usage.';
        this.snackBar.open(msg, 'Close', { duration: 4000 });
      }
    });
  }

  public restoreTower(): void {
    const id = this.restoreForm.repairRequestId;
    if (!id) {
      this.snackBar.open('⚠️ Please select a repair request to mark restored.', 'Close', { duration: 3500 });
      return;
    }

    if (!this.restoreForm.maintenanceNotes?.trim()) {
      this.snackBar.open('⚠️ Please enter maintenance completion notes before restoring.', 'Close', { duration: 3500 });
      return;
    }

    this.maintenanceService.restoreTower(id, this.restoreForm).subscribe({
      next: () => {
        this.snackBar.open('✓ Tower restored to ACTIVE status successfully.', 'Close', { duration: 3500 });
        this.restoreForm = { repairRequestId: null, maintenanceNotes: '' };
        this.loadData();
      },
      error: (err) => {
        const msg = err?.error?.message || err?.error || '⚠️ Unable to restore tower.';
        this.snackBar.open(msg, 'Close', { duration: 4000 });
      }
    });
  }
}
